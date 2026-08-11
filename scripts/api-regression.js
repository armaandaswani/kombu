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

  // --- lead retention --------------------------------------------------------
  // Roughly 500 submissions to the public form used to flush the whole CRM.
  const workedLead = (n) => ({ id: `worked-${n}`, status: "qualificado" });
  const freshLead = (n) => ({ id: `novo-${n}`, status: "novo" });
  const flooded = [
    ...Array.from({ length: 600 }, (_, n) => freshLead(n)),
    workedLead(1),
    workedLead(2),
  ];
  const capped = backend.capLeads(flooded);
  assert.strictEqual(capped.length, 500, "the cap itself still applies");
  assert.ok(
    capped.some((lead) => lead.id === "worked-1") && capped.some((lead) => lead.id === "worked-2"),
    "a lead someone has already worked must never be evicted by new submissions",
  );
  assert.ok(
    capped.indexOf(capped.find((lead) => lead.id === "novo-0")) <
      capped.indexOf(capped.find((lead) => lead.id === "novo-1")),
    "surviving leads keep their original order",
  );
  assert.strictEqual(backend.capLeads([freshLead(1)]).length, 1, "a short list is returned untouched");

  // --- brute force protection on the shared admin password -------------------
  const attackerIp = { "x-forwarded-for": "203.0.113.9" };
  let lastLoginStatus = 0;
  let sawTooMany = false;
  for (let attempt = 0; attempt < 14; attempt += 1) {
    req = { method: "POST", headers: { host: "kombukombucha.com.br", ...attackerIp }, body: { password: "guess" } };
    res = responseMock();
    await login(req, res);
    lastLoginStatus = res.statusCode;
    if (res.statusCode === 429) sawTooMany = true;
  }
  assert.ok(sawTooMany, "repeated password guesses from one source must start being refused");
  assert.strictEqual(lastLoginStatus, 429);
  assert.strictEqual(jsonBody(res).error, "too_many_attempts");

  // A different source is unaffected by the attacker's attempts.
  req = { method: "POST", headers: { host: "kombukombucha.com.br", "x-forwarded-for": "198.51.100.4" }, body: { password: "test-password" } };
  res = responseMock();
  await login(req, res);
  assert.strictEqual(res.statusCode, 200, "throttling must be per source, not global");

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

  // --- GET /api/state must never write -------------------------------------
  // Reading the panel used to reconcile and then persist, so every page load
  // rewrote the production document and competed for the optimistic lock.
  const writeMethods = [];
  global.fetch = async (url, options = {}) => {
    const method = options.method || "GET";
    if (method !== "GET") writeMethods.push(method);
    if (method === "GET") {
      return supabaseReply([
        {
          id: "production",
          updated_at: "2026-08-11T00:00:00.000Z",
          // an order with stock available to reserve, so reconciliation has work to do
          state: {
            products: [{ id: "p1", flavor: "Maracuja", sizeMl: 500 }],
            recipes: [{ id: "r1", productId: "p1", sizeMl: 500 }],
            batches: [{ id: "b1", code: "B-1", productId: "p1", recipeId: "r1", actual: 20, status: "aprovado", date: "2026-08-01" }],
            orders: [{ id: "o1", code: "PED-1", status: "confirmado", createdAt: "2026-08-01T00:00:00.000Z",
                       items: [{ id: "i1", productId: "p1", flavor: "Maracuja", sizeMl: 500, qty: 10 }] }],
            sales: [],
          },
        },
      ]);
    }
    return supabaseReply([{ updated_at: "2026-08-11T02:00:00.000Z" }]);
  };

  const signed = require("../api/_lib/kombu-backend");
  process.env.ADMIN_SESSION_SECRET = "a-long-test-session-secret";
  res = responseMock();
  await signed.setSessionCookie({ headers: { host: "kombukombucha.com.br" } }, res, { sub: "kombu-admin", role: "admin", exp: Date.now() + 60000 });
  const cookie = String(res.headers["set-cookie"]).split(";")[0];

  req = { method: "GET", headers: { host: "kombukombucha.com.br", cookie } };
  res = responseMock();
  await stateHandler(req, res);
  assert.strictEqual(res.statusCode, 200, "an authenticated read must succeed");
  assert.ok(jsonBody(res).state, "the read must return reconciled state");
  assert.deepStrictEqual(writeMethods, [], "GET /api/state must not write to Supabase");

  global.fetch = previousFetch;
  if (previousUrl === undefined) delete process.env.SUPABASE_URL;
  else process.env.SUPABASE_URL = previousUrl;

  Object.entries(previous).forEach(([key, value]) => {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  });
  console.log(
    "API regression: fail-closed auth/cron, secure cookie, state validation, state concurrency, " +
      "no-write-on-read, lead retention and login throttling passed.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
