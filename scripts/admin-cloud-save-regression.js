const assert = require("node:assert/strict");
const { createAdminSandbox } = require("./admin-harness");

async function run() {
  const admin = createAdminSandbox();
  await new Promise((resolve) => setImmediate(resolve));
  const writes = [];
  admin.fetch = (_url, { body }) => new Promise((resolve) => {
    writes.push({ body: JSON.parse(body), resolve });
  });
  admin.sessionStorage.setItem("kombuAdminAuthenticated", "true");
  admin.__eval('cloudSyncReady = true; cloudStateUpdatedAt = "version-1"');
  admin.__setState({ purchases: [{ id: "first" }] });
  const first = admin.__eval("pushStateToCloud()");
  admin.__setState({ purchases: [{ id: "first" }, { id: "second" }] });
  await admin.__eval("pushStateToCloud()");
  assert.equal(writes.length, 1, "the first write must finish before submitting newer edits");

  writes[0].resolve({ ok: true, status: 200, json: async () => ({ ok: true, updatedAt: "version-2" }) });
  await first;
  const second = admin.__eval("pushStateToCloud()");
  assert.equal(writes[1].body.updatedAt, "version-2");
  assert.deepEqual(writes[1].body.state.purchases.map(({ id }) => id), ["first", "second"]);

  writes[1].resolve({ ok: true, status: 202, json: async () => ({ ok: false, reason: "missing_supabase_env" }) });
  await second;
  assert.equal(admin.__eval("cloudSyncEnabled"), false);
  assert.equal(admin.__eval("lastCloudSaveAt"), "version-2");
  assert.match(admin.__eval("cloudSyncLastError"), /SUPABASE_URL/);
  console.log("Admin cloud save: serialized edits and unpersisted responses passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
