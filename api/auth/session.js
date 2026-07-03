const { json, requireAdmin } = require("../_lib/kombu-backend");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }

  const session = requireAdmin(req, res);
  if (!session) return;

  return json(res, 200, {
    ok: true,
    role: session.role || "Owner / Admin",
  });
};
