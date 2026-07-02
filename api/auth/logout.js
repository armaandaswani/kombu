const { clearSessionCookie, json } = require("../_lib/kombu-backend");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }
  clearSessionCookie(req, res);
  return json(res, 200, { ok: true });
};
