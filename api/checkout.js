const { json, readBody, clientIp, rateLimit } = require("./_lib/kombu-backend");
const { catalog, checkoutEnabled, PICKUP, pricedQuote, requestOrder } = require("./_lib/storefront");
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "GET") {
    try {
    const availability = await require("./_lib/storefront-stock").getAvailability();
    return json(res, 200, {
    ok: true, kits: catalog.kits, discountBps: catalog.discountBps,
    ...availability, checkoutEnabled: checkoutEnabled(), pickup: PICKUP, deliveryMode: "uber_manual",
    });
    } catch { return json(res, 503, { ok: false, error: "stock_unavailable" }); }
  }
  if (req.method !== "POST") { res.setHeader("Allow", "GET, POST"); return json(res, 405, { ok: false, error: "method_not_allowed" }); }
  const throttle = rateLimit(`checkout:${clientIp(req)}`, { limit: 15, windowMs: 60000 });
  if (!throttle.allowed) { res.setHeader("Retry-After", String(throttle.retryAfterSeconds)); return json(res, 429, { ok: false, error: "rate_limited" }); }
  try {
    const body = await readBody(req, { maxBytes: 12000 });
    if (body.action === "quote") {
      const full = await pricedQuote(body);
      // Creator identities and commission earnings are not public customer data.
      const { creatorId, commissionCents, commissionBps, ...quote } = full;
      return json(res, 200, { ok: true, quote });
    }
    if (body.action !== "request") return json(res, 400, { ok: false, error: "invalid_action" });
    const result = await requestOrder(body);
    return json(res, 200, { ok: true, ...result });
  } catch (error) {
    const status = Number(error.status) || 503;
    return json(res, status, { ok: false, error: status < 500 ? error.message : "checkout_unavailable" });
  }
};
