const assert = require("assert");

function responseMock() {
  return {
    statusCode: 200,
    headers: {},
    body: "",
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    end(value = "") { this.body = value; this.ended = true; },
  };
}

function jsonBody(res) {
  return res.body ? JSON.parse(res.body) : {};
}

async function run() {
  const previous = {
    ADMIN_PORTAL_PASSWORD: process.env.ADMIN_PORTAL_PASSWORD,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
    CRON_SECRET: process.env.CRON_SECRET,
  };
  const backend = require("../api/_lib/kombu-backend");
  const login = require("../api/auth/login");
  const cron = require("../api/cron/payment-reminders");
  const stateHandler = require("../api/state");

  assert.strictEqual(backend.validateAppState({ products: [] }), "");
  assert.strictEqual(backend.validateAppState({ products: {} }), "invalid_products");
  assert.strictEqual(backend.validateAppState([]), "invalid_state");

  delete process.env.ADMIN_PORTAL_PASSWORD;
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_SESSION_SECRET;
  let req = { method: "POST", headers: { host: "kombukombucha.com.br" }, body: { password: "anything" } };
  let res = responseMock();
  await login(req, res);
  assert.strictEqual(res.statusCode, 503);
  assert.strictEqual(jsonBody(res).error, "admin_auth_not_configured");
  assert.deepStrictEqual(jsonBody(res).missing, ["ADMIN_PORTAL_PASSWORD", "ADMIN_SESSION_SECRET"]);

  process.env.ADMIN_PORTAL_PASSWORD = "test-password";
  req = { method: "POST", headers: { host: "kombukombucha.com.br" }, body: { password: "test-password" } };
  res = responseMock();
  await login(req, res);
  assert.strictEqual(res.statusCode, 503, "login must fail closed without an independent session secret");
  assert.strictEqual(jsonBody(res).error, "admin_auth_not_configured");
  assert.deepStrictEqual(jsonBody(res).missing, ["ADMIN_SESSION_SECRET"]);

  process.env.ADMIN_SESSION_SECRET = "a-long-test-session-secret";
  req = { method: "POST", headers: { host: "kombukombucha.com.br" }, body: { password: "wrong" } };
  res = responseMock();
  await login(req, res);
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(jsonBody(res).error, "invalid_password");

  req = { method: "POST", headers: { host: "kombukombucha.com.br" }, body: { password: "test-password" } };
  res = responseMock();
  await login(req, res);
  assert.strictEqual(res.statusCode, 200);
  assert.ok(String(res.headers["set-cookie"]).includes("HttpOnly"));
  assert.ok(String(res.headers["set-cookie"]).includes("Secure"));
  assert.ok(!String(res.headers["set-cookie"]).includes("test-password"));

  delete process.env.CRON_SECRET;
  req = { method: "GET", headers: {} };
  res = responseMock();
  await cron(req, res);
  assert.strictEqual(res.statusCode, 503);
  assert.strictEqual(jsonBody(res).error, "cron_not_configured");
  assert.deepStrictEqual(jsonBody(res).missing, ["CRON_SECRET"]);

  process.env.CRON_SECRET = "cron-test-secret";
  req = { method: "GET", headers: { authorization: "Bearer wrong" } };
  res = responseMock();
  await cron(req, res);
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(jsonBody(res).error, "invalid_cron_secret");

  req = { method: "GET", headers: {} };
  res = responseMock();
  await stateHandler(req, res);
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(jsonBody(res).error, "not_authenticated");

  Object.entries(previous).forEach(([key, value]) => {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  });
  console.log("API regression: fail-closed auth/cron, secure cookie and state validation passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
