const { backendErrorPayload, getStateRow, hasSupabase, json, readBody, replaceAppState, requireAdmin, validateAppState } = require("./_lib/kombu-backend");

module.exports = async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  if (req.method === "GET") {
    try {
      const row = await getStateRow();
      return json(res, 200, {
        ok: true,
        configured: hasSupabase(),
        exists: Boolean(row),
        state: row?.state || null,
        updatedAt: row?.updated_at || null,
      });
    } catch (error) {
      return json(res, 503, backendErrorPayload(error));
    }
  }

  if (req.method === "PUT" || req.method === "POST") {
    let body;
    try {
      body = await readBody(req, { maxBytes: 5 * 1024 * 1024 });
    } catch (error) {
      return json(res, error.status || 400, { ok: false, error: error.code || "invalid_request" });
    }
    if (!body.state || typeof body.state !== "object") {
      return json(res, 400, { ok: false, error: "missing_state" });
    }
    const validationError = validateAppState(body.state);
    if (validationError) return json(res, validationError === "state_too_large" ? 413 : 422, { ok: false, error: validationError });
    try {
      const result = await replaceAppState(body.state, session.role || "admin", String(body.updatedAt || ""));
      return json(res, result.ok ? 200 : 202, result);
    } catch (error) {
      if (error.code === "state_conflict") {
        const row = await getStateRow().catch(() => null);
        return json(res, 409, { ok: false, error: "state_conflict", updatedAt: row?.updated_at || null });
      }
      return json(res, 503, backendErrorPayload(error));
    }
  }

  res.setHeader("Allow", "GET, POST, PUT");
  return json(res, 405, { ok: false, error: "method_not_allowed" });
};
