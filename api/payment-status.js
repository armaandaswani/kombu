const { json, supabaseFetch } = require("./_lib/kombu-backend");
const { uuid } = require("./_lib/storefront");
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return json(res, 405, { ok: false }); }
  const id = new URL(req.url, "https://localhost").searchParams.get("order_nsu");
  if (!uuid(id)) return json(res, 400, { ok: false });
  try {
    const rows = await supabaseFetch(`/rest/v1/storefront_orders?id=eq.${id}&select=status&limit=1`);
    // No personal data, amount, creator identity, or payment URL is returned.
    return json(res, 200, { ok: true, status: rows?.[0]?.status || "unknown" });
  } catch { return json(res, 503, { ok: false }); }
};
