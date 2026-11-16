// Passkey sign-in for the admin (Face ID, touch, PIN). One endpoint, POST only,
// with an "action": login-options, login, register-options, register, list, remove.
// Signing in needs no session; everything else needs one. Adding a passkey also
// needs the password again, so a stolen session cookie cannot add a permanent way in.
const crypto = require("crypto");
const { adminPassword, clientIp, hasSessionSecret, json, rateLimit, readBody, requireAdmin, setSessionCookie } = require("../_lib/kombu-backend");
const passkeys = require("../_lib/passkeys");

const SESSION_MS = 1000 * 60 * 60 * 12;

function digest(value) {
  return crypto.createHash("sha256").update(String(value), "utf8").digest();
}

function text(value, max) {
  return typeof value === "string" && value.length > 0 && value.length <= max ? value : "";
}

function fail(status, error) {
  const failure = new Error(error);
  failure.status = status;
  failure.code = error;
  return failure;
}

async function loginOptions(rp) {
  const { list } = await passkeys.readPasskeyRow();
  const mine = list.filter((item) => item.rpId === rp.rpId);
  if (!mine.length) throw fail(404, "no_passkeys");
  const { challenge, token } = passkeys.signChallenge("auth");
  return {
    ok: true,
    challenge,
    token,
    rpId: rp.rpId,
    timeout: passkeys.CHALLENGE_TTL_MS,
    userVerification: "required",
    allowCredentials: mine.map((item) => ({ id: item.id, transports: item.transports || [] })),
  };
}

async function login(req, res, body, rp) {
  const response = body.response || {};
  const id = text(body.id, 1400);
  const input = {
    clientDataJSON: text(response.clientDataJSON, 4096),
    authenticatorData: text(response.authenticatorData, 4096),
    signature: text(response.signature, 2048),
  };
  if (!id || !input.clientDataJSON || !input.authenticatorData || !input.signature) throw fail(400, "invalid_request");
  const payload = passkeys.verifyChallenge(body.token, "auth");
  const { list } = await passkeys.readPasskeyRow();
  const credential = list.find((item) => item.id === id && item.rpId === rp.rpId);
  if (!credential) throw fail(401, "passkey_unknown");
  const { signCount } = passkeys.verifyAssertion(input, credential, { challenge: payload.c, rpId: rp.rpId, origins: rp.origins });
  // The sign-in is only granted if this write lands: it spends the challenge, so
  // the same signed answer cannot be sent a second time, and it records the use.
  // If the write fails the sign-in fails, and the password still works.
  await passkeys.changePasskeys((doc) => {
    const current = doc.credentials.find((item) => item.id === id && item.rpId === rp.rpId);
    if (!current) throw fail(401, "passkey_unknown");
    passkeys.spendChallenge(doc, payload);
    current.signCount = signCount;
    current.lastUsedAt = new Date().toISOString();
    return doc;
  });
  setSessionCookie(req, res, { sub: "kombu-admin", role: "Owner / Admin", iat: Date.now(), exp: Date.now() + SESSION_MS, via: "passkey" });
  return { ok: true };
}

function registerOptions(body, rp, session) {
  const configured = adminPassword();
  if (!configured) throw fail(503, "admin_auth_not_configured");
  if (!crypto.timingSafeEqual(digest(body.password || ""), digest(configured))) throw fail(401, "invalid_password");
  return passkeys.readPasskeyRow().then(({ list }) => {
    const { challenge, token } = passkeys.signChallenge("reg", { sub: session.sub });
    return {
      ok: true,
      challenge,
      token,
      rp: { id: rp.rpId, name: rp.name },
      user: { id: digest("kombu-admin").toString("base64url"), name: "Kombú Admin", displayName: "Kombú Admin" },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
      authenticatorSelection: { residentKey: "preferred", userVerification: "required" },
      attestation: "none",
      timeout: passkeys.CHALLENGE_TTL_MS,
      excludeCredentials: list.filter((item) => item.rpId === rp.rpId).map((item) => ({ type: "public-key", id: item.id, transports: item.transports || [] })),
    };
  });
}

async function register(body, rp, session) {
  const response = body.response || {};
  const input = {
    id: text(body.id, 1400),
    clientDataJSON: text(response.clientDataJSON, 4096),
    attestationObject: text(response.attestationObject, 16384),
  };
  if (!input.id || !input.clientDataJSON || !input.attestationObject) throw fail(400, "invalid_request");
  const payload = passkeys.verifyChallenge(body.token, "reg");
  if (payload.sub !== session.sub) throw fail(401, "passkey_invalid_challenge");
  const created = passkeys.verifyRegistration(input, { challenge: payload.c, rpId: rp.rpId, origins: rp.origins });
  const entry = {
    id: created.id,
    publicKey: created.publicKey,
    alg: created.alg,
    signCount: created.signCount,
    label: passkeys.cleanLabel(body.label),
    rpId: rp.rpId,
    transports: passkeys.cleanTransports(response.transports),
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
  };
  await passkeys.changePasskeys((doc) => {
    if (doc.credentials.some((item) => item.id === entry.id)) throw fail(409, "passkey_exists");
    if (doc.credentials.length >= passkeys.MAX_PASSKEYS) throw fail(409, "too_many_passkeys");
    doc.credentials.push(entry);
    return doc;
  });
  return { ok: true, credential: passkeys.publicCredential(entry) };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }
  if (!hasSessionSecret()) return json(res, 503, { ok: false, error: "admin_auth_not_configured" });

  let body;
  try {
    body = await readBody(req, { maxBytes: 32 * 1024 });
  } catch (error) {
    return json(res, error.status || 400, { ok: false, error: error.code || "invalid_request" });
  }
  const action = String(body.action || "");
  const rp = passkeys.relyingParty(req);
  if (!rp) return json(res, 400, { ok: false, error: "invalid_host" });

  const signingIn = action === "login-options" || action === "login";
  // Guesses at the password through this door count against the same budget as
  // the password sign-in itself.
  const bucket = action === "register-options" ? "login" : "passkey";
  if (signingIn || action === "register-options") {
    const attempt = rateLimit(`${bucket}:${clientIp(req)}`, { limit: signingIn ? 30 : 10, windowMs: 15 * 60 * 1000 });
    if (!attempt.allowed) {
      res.setHeader("Retry-After", String(attempt.retryAfterSeconds));
      return json(res, 429, { ok: false, error: "too_many_attempts", retryAfterSeconds: attempt.retryAfterSeconds });
    }
  }

  try {
    if (action === "login-options") return json(res, 200, await loginOptions(rp));
    if (action === "login") return json(res, 200, await login(req, res, body, rp));
    if (!["register-options", "register", "list", "remove"].includes(action)) return json(res, 400, { ok: false, error: "unknown_action" });

    const session = requireAdmin(req, res);
    if (!session) return undefined;
    if (action === "register-options") return json(res, 200, await registerOptions(body, rp, session));
    if (action === "register") return json(res, 200, await register(body, rp, session));
    if (action === "list") {
      const { list } = await passkeys.readPasskeyRow();
      return json(res, 200, { ok: true, rpId: rp.rpId, credentials: list.map(passkeys.publicCredential) });
    }
    const id = text(body.id, 1400);
    if (!id) return json(res, 400, { ok: false, error: "invalid_request" });
    let found = false;
    await passkeys.changePasskeys((doc) => {
      found = doc.credentials.some((item) => item.id === id);
      doc.credentials = doc.credentials.filter((item) => item.id !== id);
      return doc;
    });
    return found ? json(res, 200, { ok: true }) : json(res, 404, { ok: false, error: "passkey_not_found" });
  } catch (error) {
    // Anyone can try to sign in, so a failed sign-in never says why.
    if (signingIn && error.status && error.status < 500 && error.status !== 404) return json(res, 401, { ok: false, error: "passkey_invalid" });
    const status = error.status && error.status < 600 ? error.status : 500;
    return json(res, status, { ok: false, error: status === 500 ? "server_error" : error.code || "server_error" });
  }
};
