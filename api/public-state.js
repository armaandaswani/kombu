const { backendErrorPayload, getStateRow, hasSupabase, json, sanitizePublicState } = require("./_lib/kombu-backend");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }
  try {
    const row = await getStateRow();
    return json(res, 200, {
      ok: true,
      configured: hasSupabase(),
      exists: Boolean(row),
      state: sanitizePublicState(row?.state || {}),
      updatedAt: row?.updated_at || null,
    });
  } catch (error) {
    return json(res, 503, backendErrorPayload(error));
  }
};
