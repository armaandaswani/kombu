// Shared by the passkey tests: an in-memory stand-in for the Supabase REST calls
// the passkey code makes, and a software authenticator that builds the same bytes
// a phone or laptop does (CBOR, authenticator data, signatures), with real keys.
const crypto = require("crypto");

const SUPABASE_URL = "http://supabase.test";

function installFakeSupabase() {
  const rows = new Map();
  const control = { rows, failNextPatch: false, failPatches: false, hold: null, throwNext: null, calls: [] };
  const reply = (data, status = 200) => ({ ok: status < 400, status, text: async () => JSON.stringify(data) });
  global.fetch = async (url, options = {}) => {
    if (control.throwNext) { const failure = control.throwNext; control.throwNext = null; throw failure; }
    if (!String(url).startsWith(SUPABASE_URL)) throw new Error(`unexpected request to ${url}`);
    const parsed = new URL(url);
    const method = options.method || "GET";
    const id = (parsed.searchParams.get("id") || "").replace(/^eq\./, "");
    control.calls.push(`${method} ${id || parsed.pathname}`);
    if (method === "GET") return reply(rows.has(id) ? [rows.get(id)] : []);
    if (method === "POST") {
      const row = JSON.parse(options.body);
      if (rows.has(row.id)) return reply([]);
      rows.set(row.id, row);
      return reply([row]);
    }
    if (method === "PATCH") {
      if (control.hold) { const gate = control.hold; control.hold = null; await gate; }
      const row = rows.get(id);
      const expected = (parsed.searchParams.get("updated_at") || "").replace(/^eq\./, "");
      if (control.failPatches) return reply([]);
      if (control.failNextPatch) {
        control.failNextPatch = false;
        return reply([]);
      }
      if (!row || row.updated_at !== expected) return reply([]);
      Object.assign(row, JSON.parse(options.body));
      return reply([row]);
    }
    throw new Error(`unexpected ${method}`);
  };
  return control;
}

// ---- CBOR writer for the few shapes WebAuthn uses.
function head(major, value, payload = Buffer.alloc(0)) {
  let prefix;
  if (value < 24) prefix = Buffer.from([(major << 5) | value]);
  else if (value < 256) prefix = Buffer.from([(major << 5) | 24, value]);
  else if (value < 65536) { prefix = Buffer.alloc(3); prefix[0] = (major << 5) | 25; prefix.writeUInt16BE(value, 1); }
  else { prefix = Buffer.alloc(5); prefix[0] = (major << 5) | 26; prefix.writeUInt32BE(value, 1); }
  return Buffer.concat([prefix, payload]);
}

function cbor(value) {
  if (Buffer.isBuffer(value)) return head(2, value.length, value);
  if (typeof value === "string") { const bytes = Buffer.from(value); return head(3, bytes.length, bytes); }
  if (typeof value === "number") return value >= 0 ? head(0, value) : head(1, -1 - value);
  if (Array.isArray(value)) return head(4, value.length, Buffer.concat(value.map(cbor)));
  if (value instanceof Map) return head(5, value.size, Buffer.concat([...value].flatMap(([key, item]) => [cbor(key), cbor(item)])));
  throw new Error("cannot encode");
}

const sha256 = (value) => crypto.createHash("sha256").update(value).digest();
const u32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32BE(n); return b; };
const u16 = (n) => { const b = Buffer.alloc(2); b.writeUInt16BE(n); return b; };
const FLAGS = { present: 0x01, verified: 0x04, attested: 0x40 };

function authenticatorData({ rpId, flags, counter = 0, credentialId, cose }) {
  const base = Buffer.concat([sha256(rpId), Buffer.from([flags]), u32(counter)]);
  if (!(flags & FLAGS.attested)) return base;
  return Buffer.concat([base, Buffer.alloc(16), u16(credentialId.length), credentialId, cbor(cose)]);
}

// A software authenticator. "alg" is ES256, RS256 or EdDSA.
function createAuthenticator(alg = "ES256") {
  const pair = alg === "ES256"
    ? crypto.generateKeyPairSync("ec", { namedCurve: "P-256" })
    : alg === "RS256"
      ? crypto.generateKeyPairSync("rsa", { modulusLength: 2048 })
      : crypto.generateKeyPairSync("ed25519");
  const jwk = pair.publicKey.export({ format: "jwk" });
  const b64 = (value) => Buffer.from(value, "base64url");
  const cose = alg === "ES256"
    ? new Map([[1, 2], [3, -7], [-1, 1], [-2, b64(jwk.x)], [-3, b64(jwk.y)]])
    : alg === "RS256"
      ? new Map([[1, 3], [3, -257], [-1, b64(jwk.n)], [-2, b64(jwk.e)]])
      : new Map([[1, 1], [3, -8], [-1, 6], [-2, b64(jwk.x)]]);
  const credentialId = crypto.randomBytes(32);
  const sign = (data) => (alg === "EdDSA" ? crypto.sign(null, data, pair.privateKey) : crypto.sign("sha256", data, pair.privateKey));
  const clientData = (type, challenge, origin) => Buffer.from(JSON.stringify({ type, challenge, origin, crossOrigin: false }));
  return {
    alg,
    id: credentialId.toString("base64url"),
    credentialId,
    // What the browser returns from navigator.credentials.create().
    create({ challenge, origin, rpId, flags = FLAGS.present | FLAGS.verified | FLAGS.attested, counter = 0 }) {
      const data = authenticatorData({ rpId, flags, counter, credentialId, cose });
      return {
        id: credentialId.toString("base64url"),
        response: {
          clientDataJSON: clientData("webauthn.create", challenge, origin).toString("base64url"),
          attestationObject: cbor(new Map([["fmt", "none"], ["attStmt", new Map()], ["authData", data]])).toString("base64url"),
          transports: ["internal"],
        },
      };
    },
    // What it returns from navigator.credentials.get().
    get({ challenge, origin, rpId, flags = FLAGS.present | FLAGS.verified, counter = 0, tamper = false, attested = false }) {
      // "attested" signs real credential data into the answer, which a sign-in never carries.
      const data = authenticatorData({ rpId, flags: attested ? flags | FLAGS.attested : flags, counter, credentialId, cose });
      const client = clientData("webauthn.get", challenge, origin);
      let signature = sign(Buffer.concat([data, sha256(client)]));
      if (tamper) { signature = Buffer.from(signature); signature[signature.length - 1] ^= 1; }
      return {
        id: credentialId.toString("base64url"),
        response: { clientDataJSON: client.toString("base64url"), authenticatorData: data.toString("base64url"), signature: signature.toString("base64url") },
      };
    },
  };
}

module.exports = { FLAGS, SUPABASE_URL, authenticatorData, cbor, createAuthenticator, installFakeSupabase, sha256 };
