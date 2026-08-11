const { adminPassword, clientIp, hasSessionSecret, json, rateLimit, readBody, setSessionCookie } = require("../_lib/kombu-backend");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }

  const configuredPassword = adminPassword();
  const missing = [
    !configuredPassword ? "ADMIN_PORTAL_PASSWORD" : "",
    !hasSessionSecret() ? "ADMIN_SESSION_SECRET" : "",
  ].filter(Boolean);
  if (missing.length) {
    return json(res, 503, { ok: false, error: "admin_auth_not_configured", missing });
  }
  // The whole platform sits behind one shared password, so an unlimited number
  // of guesses is the only thing standing between a guesser and every record.
  // Generous enough that a real admin mistyping is never locked out.
  const attempt = rateLimit(`login:${clientIp(req)}`, { limit: 10, windowMs: 15 * 60 * 1000 });
  if (!attempt.allowed) {
    res.setHeader("Retry-After", String(attempt.retryAfterSeconds));
    return json(res, 429, { ok: false, error: "too_many_attempts", retryAfterSeconds: attempt.retryAfterSeconds });
  }

  let body;
  try {
    body = await readBody(req, { maxBytes: 4096 });
  } catch (error) {
    return json(res, error.status || 400, { ok: false, error: error.code || "invalid_request" });
  }
  const provided = Buffer.from(String(body.password || ""));
  const expected = Buffer.from(configuredPassword);
  if (provided.length !== expected.length || !require("crypto").timingSafeEqual(provided, expected)) {
    return json(res, 401, { ok: false, error: "invalid_password" });
  }

  setSessionCookie(req, res, {
    sub: "kombu-admin",
    role: "Owner / Admin",
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 12,
  });
  if (String(req.headers.accept || "").includes("text/html")) {
    res.statusCode = 303;
    res.setHeader("Location", "/admin");
    return res.end();
  }
  return json(res, 200, { ok: true });
};
