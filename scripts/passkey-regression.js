// Passkey sign-in for the admin, against a software authenticator with real keys
// (ES256, RS256, Ed25519) and an in-memory stand-in for Supabase. Covers adding a
// passkey (needs session and password), signing in with it, and every way a
// sign-in must fail: a challenge that is wrong, expired or from another purpose,
// another site, a user who was not verified, a forged or copied key, and a removed
// passkey. Nothing here touches a real database or a real device.
const assert = require("node:assert/strict");
const { FLAGS, SUPABASE_URL, authenticatorData, cbor, createAuthenticator, installFakeSupabase, sha256 } = require("./passkey-helpers");

process.env.ADMIN_PORTAL_PASSWORD = "senha-de-teste";
process.env.ADMIN_SESSION_SECRET = "a-long-test-session-secret";
process.env.SUPABASE_URL = SUPABASE_URL;
process.env.SUPABASE_SERVICE_ROLE_KEY = "a-long-test-supabase-service-role-key";
const database = installFakeSupabase();

const handler = require("../api/auth/passkey");
const loginHandler = require("../api/auth/login");
const sessionHandler = require("../api/auth/session");
const passkeys = require("../api/_lib/passkeys");

const HOST = "www.kombukombucha.com.br";
const RP = { rpId: "kombukombucha.com.br", origin: "https://www.kombukombucha.com.br" };
let ipCounter = 0;
const freshIp = () => `10.0.0.${(ipCounter += 1)}`;

async function call(target, body, { cookie = "", ip = freshIp(), host = HOST, method = "POST" } = {}) {
  const res = {
    statusCode: 200,
    headers: {},
    body: "",
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    end(value = "") { this.body = value; },
  };
  await target({ method, headers: { host, cookie, "x-forwarded-for": ip, "content-type": "application/json" }, body }, res);
  return { status: res.statusCode, data: res.body ? JSON.parse(res.body) : {}, headers: res.headers };
}
const act = (action, body = {}, options) => call(handler, { action, ...body }, options);

async function passwordSession() {
  const res = await call(loginHandler, { password: process.env.ADMIN_PORTAL_PASSWORD });
  assert.equal(res.status, 200);
  return res.headers["set-cookie"].split(";")[0];
}

async function addPasskey(cookie, authenticator, label = "iPhone da Dona Maria") {
  const options = await act("register-options", { password: process.env.ADMIN_PORTAL_PASSWORD }, { cookie });
  assert.equal(options.status, 200, JSON.stringify(options.data));
  const credential = authenticator.create({ challenge: options.data.challenge, ...RP });
  return act("register", { token: options.data.token, id: credential.id, response: credential.response, label }, { cookie });
}

async function signIn(authenticator, overrides = {}, { token, ip } = {}) {
  const options = await act("login-options", {}, { ip });
  assert.equal(options.status, 200, JSON.stringify(options.data));
  const assertion = authenticator.get({ challenge: options.data.challenge, ...RP, ...overrides });
  return act("login", { token: token || options.data.token, id: assertion.id, response: assertion.response }, { ip });
}

(async () => {
  // --- Nothing works without a session, and a challenge is not a session.
  for (const action of ["register-options", "register", "list", "remove"]) {
    const res = await act(action, { password: process.env.ADMIN_PORTAL_PASSWORD });
    assert.equal(res.status, 401, `${action} needs a session`);
  }
  assert.equal((await act("login-options")).status, 404, "no passkeys yet: the login screen is told so");
  assert.equal((await call(handler, { action: "nope" })).status, 400);
  const wrongMethod = { statusCode: 200, headers: {}, setHeader() {}, end() {} };
  await handler({ method: "GET", headers: {} }, wrongMethod);
  assert.equal(wrongMethod.statusCode, 405);

  // --- Adding a passkey needs the password again.
  const cookie = await passwordSession();
  assert.equal((await act("register-options", { password: "errada" }, { cookie })).status, 401, "wrong password");
  assert.equal((await act("register-options", {}, { cookie })).status, 401, "no password");
  const options = await act("register-options", { password: process.env.ADMIN_PORTAL_PASSWORD }, { cookie });
  assert.equal(options.status, 200);
  assert.deepEqual(
    [options.data.rp.id, options.data.attestation, options.data.authenticatorSelection.userVerification, options.data.pubKeyCredParams.map((item) => item.alg)],
    [RP.rpId, "none", "required", [-7, -257]],
  );
  assert.ok(options.data.challenge.length >= 43 && options.data.token.includes("."));

  // --- The first passkey: ES256, as Face ID and Touch ID create.
  const iphone = createAuthenticator("ES256");
  const added = await addPasskey(cookie, iphone);
  assert.equal(added.status, 200, JSON.stringify(added.data));
  assert.deepEqual(Object.keys(added.data.credential).sort(), ["createdAt", "id", "label", "lastUsedAt"], "the public key and counter are never returned");
  const stored = database.rows.get("admin_passkeys").state.credentials[0];
  assert.equal(stored.rpId, RP.rpId);
  assert.equal(stored.alg, -7);
  assert.equal((await addPasskey(cookie, iphone)).data.error, "passkey_exists", "the same passkey is not added twice");
  assert.equal(database.rows.has("production"), false, "the business data row is never touched");

  // --- Signing in with it gives the same session the password does.
  const ok = await signIn(iphone);
  assert.equal(ok.status, 200, JSON.stringify(ok.data));
  const sessionCookie = ok.headers["set-cookie"].split(";")[0];
  assert.ok(ok.headers["set-cookie"].includes("HttpOnly") && ok.headers["set-cookie"].includes("Secure"));
  assert.equal((await call(sessionHandler, {}, { cookie: sessionCookie, method: "GET" })).status, 200, "the new session is accepted");
  assert.ok(database.rows.get("admin_passkeys").state.credentials[0].lastUsedAt, "last use is recorded");
  const loginOptions = await act("login-options");
  assert.deepEqual(loginOptions.data.allowCredentials, [], "the sign-in challenge does not tell anyone which credentials exist");
  assert.equal(JSON.stringify(loginOptions.data).includes(iphone.id), false);
  assert.equal(loginOptions.data.userVerification, "required");
  // JSON only: a form post, which another site can send with the visitor's cookie, is refused.
  const formPost = { statusCode: 200, headers: {}, body: "", setHeader() {}, end(value) { this.body = value; } };
  await handler({ method: "POST", headers: { host: HOST, cookie, "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": freshIp() }, body: { action: "remove", id: iphone.id } }, formPost);
  assert.equal(formPost.statusCode, 415);
  assert.equal(database.rows.get("admin_passkeys").state.credentials.length, 1, "a form post removes nothing");

  // --- Every way a sign-in must fail answers the same way and sets no cookie.
  const refuse = async (label, result) => {
    assert.equal(result.status, 401, `${label}: ${JSON.stringify(result.data)}`);
    assert.equal(result.data.error, "passkey_invalid", `${label}: the reason is not revealed`);
    assert.equal(result.headers["set-cookie"], undefined, `${label}: no session is given`);
  };
  await refuse("wrong challenge", await signIn(iphone, { challenge: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" }));
  await refuse("another site's origin", await signIn(iphone, { origin: "https://kombukombucha.evil.com" }));
  await refuse("another site's relying party", await signIn(iphone, { rpId: "evil.com" }));
  await refuse("user not verified", await signIn(iphone, { flags: FLAGS.present }));
  await refuse("user not present", await signIn(iphone, { flags: FLAGS.verified }));
  await refuse("forged signature", await signIn(iphone, { tamper: true }));
  await refuse("a passkey that was never added", await signIn(createAuthenticator("ES256")));
  const thief = createAuthenticator("ES256");
  thief.id = iphone.id;
  await refuse("another key under a known id", await signIn({ ...thief, get: (args) => ({ ...thief.get(args), id: iphone.id }) }));
  // The assertion is made for the registration challenge itself, so only the
  // purpose recorded in the token can stop it.
  const registration = (await act("register-options", { password: process.env.ADMIN_PORTAL_PASSWORD }, { cookie })).data;
  const forRegistration = iphone.get({ challenge: registration.challenge, ...RP });
  await refuse("a registration challenge used to sign in", await act("login", { token: registration.token, id: forRegistration.id, response: forRegistration.response }));
  await refuse("a made-up token", await signIn(iphone, {}, { token: "abc.def" }));
  const realNow = Date.now;
  const early = await act("login-options");
  Date.now = () => realNow() + 3 * 60 * 1000;
  try {
    const assertion = iphone.get({ challenge: early.data.challenge, ...RP });
    await refuse("a challenge older than two minutes", await act("login", { token: early.data.token, id: assertion.id, response: assertion.response }));
  } finally {
    Date.now = realNow;
  }
  const first = await act("login-options");
  const assertion = iphone.get({ challenge: first.data.challenge, ...RP });
  const otherChallenge = await act("login-options");
  await refuse("a signature made for another challenge", await act("login", { token: otherChallenge.data.token, id: assertion.id, response: assertion.response }));
  await refuse("an incomplete request", await act("login", { token: first.data.token, id: assertion.id, response: {} }));

  // --- A signed-in answer works once. Synced passkeys report a counter of 0, so
  // only recording the challenge stops a captured answer from being sent again.
  const replayOptions = await act("login-options");
  const replayAssertion = iphone.get({ challenge: replayOptions.data.challenge, ...RP });
  const replayBody = { token: replayOptions.data.token, id: replayAssertion.id, response: replayAssertion.response };
  assert.equal((await act("login", replayBody)).status, 200, "the first use works");
  await refuse("the same answer sent again", await act("login", replayBody));
  const racing = await act("login-options");
  const racingAssertion = iphone.get({ challenge: racing.data.challenge, ...RP });
  const racingBody = { token: racing.data.token, id: racingAssertion.id, response: racingAssertion.response };
  const raced = await Promise.all([act("login", racingBody), act("login", racingBody)]);
  assert.deepEqual(raced.map((result) => result.status).sort(), [200, 401], "two copies sent at once: exactly one gets in");
  // If the use cannot be recorded the sign-in is refused, not granted unguarded.
  const unrecorded = await act("login-options");
  const unrecordedAssertion = iphone.get({ challenge: unrecorded.data.challenge, ...RP });
  database.failPatches = true;
  await refuse("a sign-in whose use cannot be recorded", await act("login", { token: unrecorded.data.token, id: unrecordedAssertion.id, response: unrecordedAssertion.response }));
  database.failPatches = false;
  assert.equal((await signIn(iphone)).status, 200, "and it works again once the database does");
  // Spent challenges are forgotten once they would have expired anyway.
  assert.ok(database.rows.get("admin_passkeys").state.used.length >= 2, "spent challenges are recorded");
  Date.now = () => realNow() + 10 * 60 * 1000;
  try {
    const later = await act("login-options");
    const laterAssertion = iphone.get({ challenge: later.data.challenge, ...RP });
    assert.equal((await act("login", { token: later.data.token, id: laterAssertion.id, response: laterAssertion.response })).status, 200);
  } finally {
    Date.now = realNow;
  }
  assert.equal(database.rows.get("admin_passkeys").state.used.length, 1, "old spent challenges are dropped");

  // --- A challenge handed out on the login screen must never work as a session cookie.
  const publicChallenge = (await act("login-options")).data.token;
  assert.equal((await call(sessionHandler, {}, { cookie: `kombu_admin_session=${publicChallenge}`, method: "GET" })).status, 401, "a challenge is not a session");
  const sessionAsChallenge = cookie.split("=")[1];
  await refuse("a session cookie used as a challenge", await signIn(iphone, {}, { token: sessionAsChallenge }));

  // --- A site's passkey does not work on another site.
  assert.equal((await act("login-options", {}, { host: "kombukombucha.evil.com" })).status, 404, "no passkeys for another domain");
  assert.equal((await act("login-options", {}, { host: "kombukombucha.com.br" })).status, 200, "the apex shares the passkeys of www");

  // --- Counters: ones that move are enforced, synced passkeys that report 0 are fine.
  const laptop = createAuthenticator("ES256");
  assert.equal((await addPasskey(cookie, laptop, "Notebook")).status, 200);
  assert.equal((await signIn(laptop, { counter: 5 })).status, 200);
  await refuse("a counter that did not move (copied key)", await signIn(laptop, { counter: 5 }));
  assert.equal((await signIn(laptop, { counter: 6 })).status, 200);
  assert.equal((await signIn(iphone, { counter: 0 })).status, 200, "a synced passkey always reports 0");
  // A device that has kept a counter cannot fall back to 0: that would switch the check off.
  await refuse("a counter that fell back to 0 after one was kept", await signIn(laptop, { counter: 0 }));
  await refuse("a counter that went down", await signIn(laptop, { counter: 3 }));
  const storedCounter = () => database.rows.get("admin_passkeys").state.credentials.find((item) => item.id === laptop.id).signCount;
  assert.equal(storedCounter(), 6, "a refused sign-in does not change the stored counter");
  // A slower sign-in cannot move the counter back behind a faster one; the check is
  // repeated inside the write, against what is stored by then.
  const slow = (await act("login-options")).data;
  const slowAnswer = laptop.get({ challenge: slow.challenge, ...RP, counter: 20 });
  const fast = (await act("login-options")).data;
  const fastAnswer = laptop.get({ challenge: fast.challenge, ...RP, counter: 21 });
  let letSlowFinish;
  database.hold = new Promise((resolve) => { letSlowFinish = resolve; });
  const slowSignIn = act("login", { token: slow.token, id: slowAnswer.id, response: slowAnswer.response });
  await new Promise((resolve) => setTimeout(resolve, 25));
  assert.equal((await act("login", { token: fast.token, id: fastAnswer.id, response: fastAnswer.response })).status, 200);
  letSlowFinish();
  await refuse("the slower sign-in finishing last", await slowSignIn);
  assert.equal(storedCounter(), 21, "the counter never moves backwards");

  // --- Other key types.
  const windows = createAuthenticator("RS256");
  assert.equal((await addPasskey(cookie, windows, "Windows Hello")).status, 200);
  assert.equal((await signIn(windows)).status, 200, "RS256");
  await refuse("RS256 forged", await signIn(windows, { tamper: true }));
  const key = createAuthenticator("EdDSA");
  assert.equal((await addPasskey(cookie, key, "Chave USB")).status, 200);
  assert.equal((await signIn(key)).status, 200, "Ed25519");

  // --- Registration is checked as hard as sign-in.
  const checkRegistration = async (label, change) => {
    const opts = await act("register-options", { password: process.env.ADMIN_PORTAL_PASSWORD }, { cookie });
    const authenticator = createAuthenticator("ES256");
    const created = authenticator.create({ challenge: opts.data.challenge, ...RP, ...(change.create || {}) });
    const res = await act("register", { token: change.token || opts.data.token, id: created.id, response: created.response }, { cookie });
    assert.notEqual(res.status, 200, `${label} must be refused`);
    return res;
  };
  await checkRegistration("another origin", { create: { origin: "https://evil.com" } });
  await checkRegistration("another relying party", { create: { rpId: "evil.com" } });
  await checkRegistration("user not verified", { create: { flags: FLAGS.present | FLAGS.attested } });
  await checkRegistration("no credential data", { create: { flags: FLAGS.present | FLAGS.verified } });
  const forSignIn = (await act("login-options")).data;
  const fromSignIn = createAuthenticator("ES256").create({ challenge: forSignIn.challenge, ...RP });
  const signInAsRegistration = await act("register", { token: forSignIn.token, id: fromSignIn.id, response: fromSignIn.response }, { cookie });
  assert.notEqual(signInAsRegistration.status, 200, "a sign-in challenge must not add a passkey");
  const noCookie = await act("register", { token: options.data.token, id: "x", response: {} });
  assert.equal(noCookie.status, 401);
  assert.equal(((await act("list", {}, { cookie })).data.credentials).length, 4, "refused registrations stored nothing");

  // --- Listing and removing.
  const list = await act("list", {}, { cookie });
  assert.deepEqual(list.data.credentials.map((item) => item.label), ["iPhone da Dona Maria", "Notebook", "Windows Hello", "Chave USB"]);
  assert.equal(JSON.stringify(list.data).includes("publicKey"), false);
  assert.equal((await act("remove", { id: "nao-existe" }, { cookie })).status, 404);
  assert.equal((await act("remove", { id: windows.id }, { cookie })).status, 200);
  await refuse("a removed passkey", await signIn(windows));
  assert.equal((await act("list", {}, { cookie })).data.credentials.length, 3);

  // --- One password entry adds one device: a registration challenge works once.
  const oneEntry = (await act("register-options", { password: process.env.ADMIN_PORTAL_PASSWORD }, { cookie })).data;
  const tries = [];
  for (const kind of ["ES256", "ES256", "RS256"]) {
    const created = createAuthenticator(kind).create({ challenge: oneEntry.challenge, ...RP });
    tries.push((await act("register", { token: oneEntry.token, id: created.id, response: created.response }, { cookie })).status);
  }
  assert.deepEqual([tries[0], tries[1] !== 200, tries[2] !== 200], [200, true, true], "the same registration challenge adds only one device");
  const racedEntry = (await act("register-options", { password: process.env.ADMIN_PORTAL_PASSWORD }, { cookie })).data;
  const racedTries = await Promise.all(["ES256", "ES256", "RS256"].map((kind) => {
    const created = createAuthenticator(kind).create({ challenge: racedEntry.challenge, ...RP });
    return act("register", { token: racedEntry.token, id: created.id, response: created.response }, { cookie });
  }));
  assert.equal(racedTries.filter((result) => result.status === 200).length, 1, "three registrations sent at once with one challenge: exactly one is added");
  assert.equal((await act("list", {}, { cookie })).data.credentials.length, 5);

  // --- Malformed answers get the same 401 as any other failed sign-in, never a 500
  // that would tell an outsider the challenge and the credential were real.
  const malformed = async (label, change) => {
    const options = (await act("login-options")).data;
    const answer = iphone.get({ challenge: options.challenge, ...RP });
    await refuse(label, await act("login", { token: options.token, id: answer.id, response: change(answer.response) }));
  };
  const attested = authenticatorData({ rpId: RP.rpId, flags: FLAGS.present | FLAGS.verified | FLAGS.attested, credentialId: Buffer.alloc(32, 1), cose: new Map([[1, 2]]) });
  await malformed("truncated attested data", (r) => ({ ...r, authenticatorData: Buffer.concat([sha256(RP.rpId), Buffer.from([0x45]), Buffer.alloc(4), Buffer.alloc(30)]).toString("base64url") }));
  await malformed("attested data in a sign-in", (r) => ({ ...r, authenticatorData: attested.toString("base64url") }));
  await malformed("client data that is null", (r) => ({ ...r, clientDataJSON: Buffer.from("null").toString("base64url") }));
  await malformed("client data that is a list", (r) => ({ ...r, clientDataJSON: Buffer.from("[1]").toString("base64url") }));
  await malformed("client data that is not JSON", (r) => ({ ...r, clientDataJSON: Buffer.from("not json").toString("base64url") }));
  await malformed("a signature that is not base64", (r) => ({ ...r, signature: "!!!" }));
  await malformed("fields that are not text", (r) => ({ ...r, clientDataJSON: 5, signature: { a: 1 } }));
  // Each guard is also tested alone, because the others would still refuse these:
  // a validly signed sign-in that carries credential data is refused for that reason alone.
  const withCredentialData = (await act("login-options")).data;
  const carrying = iphone.get({ challenge: withCredentialData.challenge, ...RP, attested: true });
  await refuse("a validly signed sign-in that carries credential data", await act("login", { token: withCredentialData.token, id: carrying.id, response: carrying.response }));
  // An error nobody named (a crash inside the server) still answers like any failed sign-in.
  const crashing = (await act("login-options")).data;
  const crashAnswer = iphone.get({ challenge: crashing.challenge, ...RP });
  database.throwNext = new TypeError("something unexpected");
  await refuse("an unexpected server error during sign-in", await act("login", { token: crashing.token, id: crashAnswer.id, response: crashAnswer.response }));
  assert.equal((await act("login", { token: crashing.token, id: crashAnswer.id, response: crashAnswer.response })).status, 200, "and the same answer works once the fault is gone");
  const storedIphone = database.rows.get("admin_passkeys").state.credentials.find((item) => item.id === iphone.id);
  const unitAnswer = iphone.get({ challenge: "x", ...RP }).response;
  for (const [label, text] of [["null", "null"], ["a list", "[1]"], ["a number", "5"]]) {
    assert.throws(
      () => passkeys.verifyAssertion({ ...unitAnswer, clientDataJSON: Buffer.from(text).toString("base64url") }, storedIphone, { challenge: "x", ...RP, origins: [RP.origin] }),
      (error) => error.code === "passkey_invalid_client_data",
      `client data that is ${label} is named, not an exception`,
    );
  }
  assert.throws(() => passkeys.coseToPublicKey(new Map([[1, 2], [3, -7], [-1, 1], [-2, 5], [-3, 6]])), (error) => error.code === "passkey_invalid_key", "a key part that is a number is named, not an exception");
  assert.throws(() => passkeys.coseToPublicKey(new Map([[1, 2], [3, -7], [-1, 1], [-2, Buffer.alloc(0)], [-3, Buffer.alloc(32)]])), (error) => error.code === "passkey_invalid_key", "an empty key part is refused");
  const odd = await act("login", { token: 5, id: ["x"], response: "text" });
  assert.equal(odd.status, 401);
  assert.equal(odd.data.error, "passkey_invalid");
  assert.equal((await call(handler, [])).status, 400, "a body that is not an object is a plain bad request");

  // A registration with a broken key is a bad request, not a server fault.
  const badKey = createAuthenticator("ES256");
  const badOptions = (await act("register-options", { password: process.env.ADMIN_PORTAL_PASSWORD }, { cookie })).data;
  const badData = authenticatorData({ rpId: RP.rpId, flags: FLAGS.present | FLAGS.verified | FLAGS.attested, credentialId: badKey.credentialId, cose: new Map([[1, 2], [3, -7], [-1, 1], [-2, 5], [-3, 6]]) });
  const badRegistration = await act("register", {
    token: badOptions.token,
    id: badKey.id,
    response: {
      clientDataJSON: Buffer.from(JSON.stringify({ type: "webauthn.create", challenge: badOptions.challenge, origin: RP.origin, crossOrigin: false })).toString("base64url"),
      attestationObject: cbor(new Map([["fmt", "none"], ["attStmt", new Map()], ["authData", badData]])).toString("base64url"),
    },
  }, { cookie });
  assert.equal(badRegistration.status, 400, "a key part that is a number is refused as a bad request");
  assert.equal((await act("list", {}, { cookie })).data.credentials.length, 5, "and nothing was stored");

  // --- A label is cleaned, and the limit holds.
  const labelled = createAuthenticator("ES256");
  const labelOptions = await act("register-options", { password: process.env.ADMIN_PORTAL_PASSWORD }, { cookie });
  const labelCreated = labelled.create({ challenge: labelOptions.data.challenge, ...RP });
  const labelResult = await act("register", { token: labelOptions.data.token, id: labelCreated.id, response: labelCreated.response, label: "<b>x</b>\n".repeat(30) }, { cookie });
  assert.ok(!/[<>\n]/.test(labelResult.data.credential.label) && labelResult.data.credential.label.length <= 40);
  while ((await act("list", {}, { cookie })).data.credentials.length < passkeys.MAX_PASSKEYS) assert.equal((await addPasskey(cookie, createAuthenticator("ES256"))).status, 200);
  assert.equal((await addPasskey(cookie, createAuthenticator("ES256"))).data.error, "too_many_passkeys");

  // --- Two changes at once do not overwrite each other.
  database.failNextPatch = true;
  assert.equal((await act("remove", { id: labelled.id }, { cookie })).status, 200, "a conflicting write is retried");
  assert.equal((await act("list", {}, { cookie })).data.credentials.some((item) => item.id === labelled.id), false);

  // --- Too many tries from one address.
  const noisy = freshIp();
  let blocked = 0;
  for (let attempt = 0; attempt < 35; attempt += 1) if ((await act("login-options", {}, { ip: noisy })).status === 429) blocked += 1;
  assert.ok(blocked >= 4, "sign-in attempts are rate limited");
  const guesser = freshIp();
  let guessBlocked = 0;
  for (let attempt = 0; attempt < 13; attempt += 1) if ((await act("register-options", { password: `errada${attempt}` }, { cookie, ip: guesser })).status === 429) guessBlocked += 1;
  assert.ok(guessBlocked >= 3, "guessing the password here shares the sign-in budget");

  // --- Unit checks of the parsing.
  const rp = passkeys.relyingParty({ headers: { host: "www.kombukombucha.com.br" } });
  assert.deepEqual([rp.rpId, rp.origins], ["kombukombucha.com.br", ["https://kombukombucha.com.br", "https://www.kombukombucha.com.br"]]);
  assert.deepEqual(passkeys.relyingParty({ headers: { host: "localhost:3000" } }).origins, ["http://localhost:3000", "http://www.localhost:3000"]);
  assert.equal(passkeys.relyingParty({ headers: { host: "127.0.0.1:3000" } }), null, "an IP address cannot be a relying party");
  assert.equal(passkeys.relyingParty({ headers: { host: "evil.com/x" } }), null);
  assert.equal(passkeys.relyingParty({ headers: {} }), null);
  assert.throws(() => passkeys.cborDecode(Buffer.from([0x9f, 0x01, 0xff])), /passkey_invalid_cbor/, "indefinite lengths are refused");
  assert.throws(() => passkeys.cborDecode(Buffer.from([0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x01])), /passkey_invalid_cbor/, "deep nesting is refused");
  assert.throws(() => passkeys.cborDecode(Buffer.from([0x58, 0x20, 0x01])), /passkey_invalid_cbor/, "a truncated string is refused");
  // Every length field is checked against the end of the data before it is read.
  for (const cut of [[0x18], [0x19, 0x00], [0x1a, 0, 0, 0], [0x1b, 0, 0, 0, 0], [0x58], [0x59, 0x00]]) {
    assert.throws(() => passkeys.cborDecode(Buffer.from(cut)), /passkey_invalid_cbor/, `a cut-off length field ${cut.map((byte) => byte.toString(16)).join(" ")} is refused`);
  }
  assert.throws(() => passkeys.checkCounter(10, 0), /passkey_counter_regressed/, "0 after a kept counter is not forward");
  assert.doesNotThrow(() => passkeys.checkCounter(0, 0), "a passkey that never kept a counter stays at 0");
  assert.doesNotThrow(() => passkeys.checkCounter(0, 7), "a counter that starts later is fine");
  assert.throws(() => passkeys.parseAuthData(Buffer.alloc(10)), /passkey_invalid_auth_data/);
  const weak = new Map([[1, 3], [3, -257], [-1, Buffer.alloc(128, 1)], [-2, Buffer.from([1, 0, 1])]]);
  assert.throws(() => passkeys.coseToPublicKey(weak), /passkey_(weak|invalid)_key/, "a small RSA key is refused");
  assert.throws(() => passkeys.coseToPublicKey(new Map([[1, 2], [3, -7], [-1, 1], [-2, Buffer.alloc(32, 1)], [-3, Buffer.alloc(32, 2)]])), /passkey_invalid_key/, "a point that is not on the curve is refused");
  const data = authenticatorData({ rpId: RP.rpId, flags: FLAGS.present | FLAGS.verified | FLAGS.attested, credentialId: Buffer.alloc(32, 7), cose: new Map([[1, 2]]) });
  assert.equal(passkeys.parseAuthData(data).credentialId.length, 32);
  assert.equal(sha256("x").length, 32);
  assert.equal(cbor(new Map([["a", 1]])).length > 0, true);

  // --- Without the backend configured, signing in says so instead of failing oddly.
  const saved = process.env.SUPABASE_URL;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const notConfigured = await act("login-options");
  assert.equal(notConfigured.status, 503);
  assert.equal(notConfigured.data.error, "passkeys_not_configured");
  process.env.SUPABASE_URL = saved;
  delete process.env.ADMIN_SESSION_SECRET;
  assert.equal((await act("login-options")).status, 503, "no session secret: fail closed");

  console.log("Passkeys: add needs session and password, sign-in with ES256/RS256/Ed25519, wrong or expired challenge, other site, unverified user, forged and copied keys, challenge never usable as a session, removal, limits, rate limits and parsing passed.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
