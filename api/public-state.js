const { getStateRow, json, sanitizePublicState } = require("./_lib/kombu-backend");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }
  const row = await getStateRow();
  return json(res, 200, {
    ok: true,
    state: sanitizePublicState(row?.state || {}),
    updatedAt: row?.updated_at || null,
  });
};
