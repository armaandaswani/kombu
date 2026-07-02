const { getStateRow, hasSupabase, json, readBody, requireAdmin, upsertAppState } = require("./_lib/kombu-backend");

module.exports = async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  if (req.method === "GET") {
    const row = await getStateRow();
    return json(res, 200, {
      ok: true,
      configured: hasSupabase(),
      exists: Boolean(row),
      state: row?.state || null,
      updatedAt: row?.updated_at || null,
    });
  }

  if (req.method === "PUT" || req.method === "POST") {
    const body = await readBody(req);
    if (!body.state || typeof body.state !== "object") {
      return json(res, 400, { ok: false, error: "missing_state" });
    }
    const result = await upsertAppState(body.state, session.role || "admin");
    return json(res, result.ok ? 200 : 202, result);
  }

  res.setHeader("Allow", "GET, POST, PUT");
  return json(res, 405, { ok: false, error: "method_not_allowed" });
};
