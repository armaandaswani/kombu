const { json, readBody } = require("./_lib/kombu-backend");
const { processPayment } = require("./_lib/storefront");
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return json(res, 405, { ok: false }); }
  try {
    const url = new URL(req.url, "https://localhost");
    const result = await processPayment(url.searchParams.get("order") || "", url.searchParams.get("token"), await readBody(req, { maxBytes: 64000 }));
    return json(res, 200, { ok: true, ...result });
  } catch (error) { return json(res, Number(error.status) || 503, { ok: false, error: "payment_not_confirmed" }); }
};
