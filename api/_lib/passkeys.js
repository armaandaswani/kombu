// Passkey (WebAuthn) sign-in for the admin, with no dependencies: only node:crypto.
//
// What is trusted and what is not:
// - Registration needs a signed-in session AND the password, so a stolen session
//   cookie cannot add a permanent way in.
// - Sign-in checks the challenge this server issued, the origin and relying party
//   the browser reports, that the authenticator verified the user (Face ID, touch,
//   PIN), and the signature against the public key stored at registration.
// - Attestation is not used ("none"): a passkey is trusted because the owner added
//   it while signed in, not because of who made the authenticator.
//
// Public keys live in their own row of app_state (id "admin_passkeys"), which the
// browser never reads and the service role alone can write, so no SQL is needed.
const crypto = require("crypto");
const { hasSupabase, requestError, sessionSecret, supabaseFetch } = require("./kombu-backend");

const PASSKEY_ROW = "admin_passkeys";
const CHALLENGE_TTL_MS = 2 * 60 * 1000;
const MAX_PASSKEYS = 20;
const ALGORITHMS = { "-7": "ES256", "-257": "RS256", "-8": "EdDSA" };
const TRANSPORTS = ["internal", "hybrid", "usb", "nfc", "ble"];

// ---------------------------------------------------------------- CBOR (read only)
// The subset WebAuthn uses: definite lengths, no floats worth reading. Maps come
// back as Map because COSE keys use integer keys.
function cborDecode(buffer, offset = 0, depth = 0) {
  if (depth > 8) throw requestError("passkey_invalid_cbor", 400);
  if (offset >= buffer.length) throw requestError("passkey_invalid_cbor", 400);
  const initial = buffer[offset];
  const major = initial >> 5;
  const info = initial & 31;
  let cursor = offset + 1;
  let length = info;
  if (info === 24) { length = buffer[cursor]; cursor += 1; }
  else if (info === 25) { length = buffer.readUInt16BE(cursor); cursor += 2; }
  else if (info === 26) { length = buffer.readUInt32BE(cursor); cursor += 4; }
  else if (info === 27) {
    const big = buffer.readBigUInt64BE(cursor);
    if (big > BigInt(Number.MAX_SAFE_INTEGER)) throw requestError("passkey_invalid_cbor", 400);
    length = Number(big);
    cursor += 8;
  } else if (info > 27) throw requestError("passkey_invalid_cbor", 400);
  if (major === 0) return { value: length, offset: cursor };
  if (major === 1) return { value: -1 - length, offset: cursor };
  if (major === 2 || major === 3) {
    if (cursor + length > buffer.length) throw requestError("passkey_invalid_cbor", 400);
    const bytes = buffer.subarray(cursor, cursor + length);
    return { value: major === 2 ? Buffer.from(bytes) : bytes.toString("utf8"), offset: cursor + length };
  }
  if (major === 4 || major === 5) {
    if (length > 64) throw requestError("passkey_invalid_cbor", 400);
    const items = major === 4 ? [] : new Map();
    for (let index = 0; index < length; index += 1) {
      const first = cborDecode(buffer, cursor, depth + 1);
      cursor = first.offset;
      if (major === 4) { items.push(first.value); continue; }
      const second = cborDecode(buffer, cursor, depth + 1);
      cursor = second.offset;
      items.set(first.value, second.value);
    }
    return { value: items, offset: cursor };
  }
  if (major === 7) {
    if (info === 20) return { value: false, offset: cursor };
    if (info === 21) return { value: true, offset: cursor };
    if (info === 22 || info === 23) return { value: null, offset: cursor };
  }
  throw requestError("passkey_invalid_cbor", 400);
}

// ---------------------------------------------------------------- authenticator data
function parseAuthData(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 37) throw requestError("passkey_invalid_auth_data", 400);
  const flags = buffer[32];
  const parsed = {
    rpIdHash: buffer.subarray(0, 32),
    userPresent: Boolean(flags & 0x01),
    userVerified: Boolean(flags & 0x04),
    backedUp: Boolean(flags & 0x10),
    signCount: buffer.readUInt32BE(33),
    credentialId: null,
    coseKey: null,
  };
  if (flags & 0x40) {
    if (buffer.length < 55) throw requestError("passkey_invalid_auth_data", 400);
    const idLength = buffer.readUInt16BE(53);
    if (idLength < 16 || idLength > 1023 || buffer.length < 55 + idLength) throw requestError("passkey_invalid_auth_data", 400);
    parsed.credentialId = Buffer.from(buffer.subarray(55, 55 + idLength));
    const key = cborDecode(buffer, 55 + idLength);
    if (!(key.value instanceof Map)) throw requestError("passkey_invalid_auth_data", 400);
    parsed.coseKey = key.value;
  }
  return parsed;
}

// A COSE key to a Node public key, only for the three algorithms offered to the
// browser. Returns the key as base64url SPKI, which Node can read back.
function coseToPublicKey(cose) {
  const type = cose.get(1);
  const alg = cose.get(3);
  let jwk;
  if (type === 2 && alg === -7 && cose.get(-1) === 1) {
    jwk = { kty: "EC", crv: "P-256", x: cose.get(-2)?.toString("base64url"), y: cose.get(-3)?.toString("base64url") };
  } else if (type === 3 && alg === -257) {
    jwk = { kty: "RSA", n: cose.get(-1)?.toString("base64url"), e: cose.get(-2)?.toString("base64url") };
  } else if (type === 1 && alg === -8 && cose.get(-1) === 6) {
    jwk = { kty: "OKP", crv: "Ed25519", x: cose.get(-2)?.toString("base64url") };
  } else {
    throw requestError("passkey_unsupported_key", 400);
  }
  let key;
  try {
    key = crypto.createPublicKey({ key: jwk, format: "jwk" });
  } catch {
    throw requestError("passkey_invalid_key", 400);
  }
  if (key.asymmetricKeyType === "rsa" && (key.asymmetricKeyDetails?.modulusLength || 0) < 2048) throw requestError("passkey_weak_key", 400);
  return { alg, publicKey: key.export({ type: "spki", format: "der" }).toString("base64url") };
}

// ---------------------------------------------------------------- relying party
// The relying party is the site the browser says it is on. "www." is dropped so a
// passkey made on the apex works on www and the other way round.
function relyingParty(req) {
  const host = String(req?.headers?.["x-forwarded-host"] || req?.headers?.host || "").split(",")[0].trim().toLowerCase();
  const match = host.match(/^([a-z0-9]([a-z0-9.-]*[a-z0-9])?)(:(\d{1,5}))?$/);
  if (!match || /^\d+(\.\d+){3}$/.test(match[1])) return null;
  const hostname = match[1];
  const local = hostname === "localhost";
  const rpId = hostname.startsWith("www.") ? hostname.slice(4) : hostname;
  const port = local && match[4] ? `:${match[4]}` : "";
  const scheme = local ? "http" : "https";
  return { rpId, origins: [`${scheme}://${rpId}${port}`, `${scheme}://www.${rpId}${port}`], name: "Kombú Admin" };
}

// ---------------------------------------------------------------- challenges
// Stateless and short-lived. They are signed with a key derived from the session
// secret for this purpose only: a challenge handed to anyone on the login screen
// must never be accepted as a session cookie, which uses the same token shape.
function challengeKey() {
  const secret = sessionSecret();
  if (!secret) throw requestError("admin_auth_not_configured", 503);
  return crypto.createHmac("sha256", secret).update("kombu-passkey-challenge-v1").digest();
}

function signChallenge(kind, extra = {}, now = Date.now()) {
  const challenge = crypto.randomBytes(32).toString("base64url");
  const encoded = Buffer.from(JSON.stringify({ k: kind, c: challenge, exp: now + CHALLENGE_TTL_MS, ...extra })).toString("base64url");
  const signature = crypto.createHmac("sha256", challengeKey()).update(encoded).digest("base64url");
  return { challenge, token: `${encoded}.${signature}` };
}

function verifyChallenge(token, kind, now = Date.now()) {
  const [encoded, signature] = String(token || "").split(".");
  if (!encoded || !signature) throw requestError("passkey_invalid_challenge", 401);
  const expected = crypto.createHmac("sha256", challengeKey()).update(encoded).digest("base64url");
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw requestError("passkey_invalid_challenge", 401);
  let payload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    throw requestError("passkey_invalid_challenge", 401);
  }
  if (payload.k !== kind || !payload.c || now > payload.exp) throw requestError("passkey_invalid_challenge", 401);
  return payload;
}

// ---------------------------------------------------------------- verification
function sameText(a, b) {
  const left = Buffer.from(String(a ?? ""));
  const right = Buffer.from(String(b ?? ""));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function readClientData(clientDataJSON, { type, challenge, origins }) {
  const raw = Buffer.from(String(clientDataJSON || ""), "base64url");
  let data;
  try {
    data = JSON.parse(raw.toString("utf8"));
  } catch {
    throw requestError("passkey_invalid_client_data", 400);
  }
  if (data.type !== type || !sameText(data.challenge, challenge)) throw requestError("passkey_wrong_challenge", 401);
  if (!origins.includes(data.origin) || data.crossOrigin === true) throw requestError("passkey_wrong_origin", 401);
  return raw;
}

function checkAuthData(auth, rpId) {
  const expected = crypto.createHash("sha256").update(rpId).digest();
  if (!crypto.timingSafeEqual(auth.rpIdHash, expected)) throw requestError("passkey_wrong_site", 401);
  if (!auth.userPresent || !auth.userVerified) throw requestError("passkey_not_verified", 401);
}

// A new passkey: returns what to store.
function verifyRegistration({ clientDataJSON, attestationObject, id }, { challenge, rpId, origins }) {
  readClientData(clientDataJSON, { type: "webauthn.create", challenge, origins });
  let attestation;
  try {
    attestation = cborDecode(Buffer.from(String(attestationObject || ""), "base64url")).value;
  } catch {
    throw requestError("passkey_invalid_attestation", 400);
  }
  const authData = attestation instanceof Map ? attestation.get("authData") : null;
  const auth = parseAuthData(authData);
  checkAuthData(auth, rpId);
  if (!auth.credentialId || !auth.coseKey) throw requestError("passkey_invalid_auth_data", 400);
  if (id && !sameText(id, auth.credentialId.toString("base64url"))) throw requestError("passkey_invalid_auth_data", 400);
  const { alg, publicKey } = coseToPublicKey(auth.coseKey);
  return { id: auth.credentialId.toString("base64url"), alg, publicKey, signCount: auth.signCount, backedUp: auth.backedUp };
}

// A sign-in: true only if the signature over the authenticator data and the hash
// of the client data verifies with the stored key.
function verifyAssertion({ clientDataJSON, authenticatorData, signature }, credential, { challenge, rpId, origins }) {
  const clientData = readClientData(clientDataJSON, { type: "webauthn.get", challenge, origins });
  const authBytes = Buffer.from(String(authenticatorData || ""), "base64url");
  const auth = parseAuthData(authBytes);
  checkAuthData(auth, rpId);
  const signed = Buffer.concat([authBytes, crypto.createHash("sha256").update(clientData).digest()]);
  const key = crypto.createPublicKey({ key: Buffer.from(credential.publicKey, "base64url"), format: "der", type: "spki" });
  const sig = Buffer.from(String(signature || ""), "base64url");
  let valid = false;
  try {
    valid = credential.alg === -8 ? crypto.verify(null, signed, key, sig) : crypto.verify("sha256", signed, key, sig);
  } catch {
    valid = false;
  }
  if (!valid) throw requestError("passkey_bad_signature", 401);
  // Synced passkeys (iCloud, Google) always report 0. When a counter is kept, a
  // value that does not move forward means the key was copied.
  const previous = Number(credential.signCount || 0);
  if (auth.signCount > 0 && previous > 0 && auth.signCount <= previous) throw requestError("passkey_counter_regressed", 401);
  return { signCount: auth.signCount };
}

// ---------------------------------------------------------------- storage
async function readPasskeyRow() {
  if (!hasSupabase()) throw requestError("passkeys_not_configured", 503);
  const rows = await supabaseFetch(`/rest/v1/app_state?id=eq.${PASSKEY_ROW}&select=state,updated_at`);
  const row = Array.isArray(rows) ? rows[0] : null;
  const list = Array.isArray(row?.state?.credentials) ? row.state.credentials : [];
  return { list, updatedAt: row?.updated_at || "" };
}

async function writePasskeys(list, updatedAt) {
  const state = { credentials: list };
  if (!updatedAt) {
    const rows = await supabaseFetch("/rest/v1/app_state", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
      body: JSON.stringify({ id: PASSKEY_ROW, state, updated_by: "passkeys", updated_at: new Date().toISOString() }),
    });
    if (!Array.isArray(rows) || rows.length === 0) throw requestError("state_conflict", 409);
    return;
  }
  const rows = await supabaseFetch(`/rest/v1/app_state?id=eq.${PASSKEY_ROW}&updated_at=eq.${encodeURIComponent(updatedAt)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ state, updated_by: "passkeys", updated_at: new Date().toISOString() }),
  });
  if (!Array.isArray(rows) || rows.length === 0) throw requestError("state_conflict", 409);
}

// Read, change, write back; two changes at once retry instead of overwriting.
async function changePasskeys(mutator, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const { list, updatedAt } = await readPasskeyRow();
    const next = mutator(list.map((item) => ({ ...item })));
    try {
      await writePasskeys(next, updatedAt);
      return next;
    } catch (error) {
      if (error.code !== "state_conflict" || attempt === retries - 1) throw error;
    }
  }
  throw requestError("state_conflict", 409);
}

function cleanLabel(value) {
  const label = String(value || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 40);
  return label || "Aparelho sem nome";
}

function cleanTransports(value) {
  return (Array.isArray(value) ? value : []).filter((item) => TRANSPORTS.includes(item)).slice(0, 5);
}

function publicCredential(item) {
  return { id: item.id, label: item.label, createdAt: item.createdAt, lastUsedAt: item.lastUsedAt || null };
}

module.exports = {
  ALGORITHMS,
  CHALLENGE_TTL_MS,
  MAX_PASSKEYS,
  changePasskeys,
  cborDecode,
  cleanLabel,
  cleanTransports,
  coseToPublicKey,
  parseAuthData,
  publicCredential,
  readPasskeyRow,
  relyingParty,
  signChallenge,
  verifyAssertion,
  verifyChallenge,
  verifyRegistration,
};
