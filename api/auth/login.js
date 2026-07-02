const { adminPassword, json, readBody, setSessionCookie } = require("../_lib/kombu-backend");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }

  const body = await readBody(req);
  if (String(body.password || "") !== adminPassword()) {
    return json(res, 401, { ok: false, error: "invalid_password" });
  }

  setSessionCookie(req, res, {
    sub: "kombu-admin",
    role: "Owner / Admin",
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 12,
  });
  return json(res, 200, { ok: true });
};
