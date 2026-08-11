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
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
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
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
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

  process.env.SUPABASE_SERVICE_ROLE_KEY = "a-long-test-supabase-service-role-key";
  req = { method: "POST", headers: { host: "kombukombucha.com.br" }, body: { password: "test-password" } };
  res = responseMock();
  await login(req, res);
  assert.strictEqual(res.statusCode, 200, "Supabase service role key should provide a secure session fallback");
  assert.ok(String(res.headers["set-cookie"]).includes("HttpOnly"));

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

  // --- optimistic concurrency on the shared state document -------------------
  // A write without a version token must never be able to replace an existing
  // production document, and a write with a stale token must be rejected.
  const previousUrl = process.env.SUPABASE_URL;
  const previousFetch = global.fetch;
  process.env.SUPABASE_URL = "https://test-project.supabase.co";

  let rowExists = true;
  const calls = [];
  const supabaseReply = (body) => ({ ok: true, status: 200, text: async () => JSON.stringify(body) });
  global.fetch = async (url, options = {}) => {
    const method = options.method || "GET";
    calls.push(`${method} ${String(url).includes("updated_at=eq.") ? "patch-guarded" : "plain"}`);
    if (method === "GET") {
      return supabaseReply(rowExists ? [{ id: "production", state: {}, updated_at: "2026-08-11T00:00:00.000Z" }] : []);
    }
    if (method === "POST") return supabaseReply([{ updated_at: "2026-08-11T01:00:00.000Z" }]);
    if (method === "PATCH") {
      const matched = String(url).includes(encodeURIComponent("2026-08-11T00:00:00.000Z"));
      return supabaseReply(matched ? [{ updated_at: "2026-08-11T02:00:00.000Z" }] : []);
    }
    return supabaseReply([]);
  };

  await assert.rejects(
    () => backend.replaceAppState({ products: [] }, "test", ""),
    (error) => error.code === "state_conflict" && error.status === 409,
    "a write with no version token must not overwrite an existing state document",
  );

  rowExists = false;
  const created = await backend.replaceAppState({ products: [] }, "test", "");
  assert.strictEqual(created.ok, true, "the very first state row must still be creatable");

  rowExists = true;
  const saved = await backend.replaceAppState({ products: [] }, "test", "2026-08-11T00:00:00.000Z");
  assert.strictEqual(saved.ok, true, "a write carrying the current version token must succeed");

  await assert.rejects(
    () => backend.replaceAppState({ products: [] }, "test", "2026-08-10T00:00:00.000Z"),
    (error) => error.code === "state_conflict" && error.status === 409,
    "a write carrying a stale version token must be rejected",
  );

  global.fetch = previousFetch;
  if (previousUrl === undefined) delete process.env.SUPABASE_URL;
  else process.env.SUPABASE_URL = previousUrl;

  Object.entries(previous).forEach(([key, value]) => {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  });
  console.log("API regression: fail-closed auth/cron, secure cookie, state validation and state concurrency passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
