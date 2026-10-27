const crypto = require("crypto");
const { requireAdmin, json, readBody, supabaseFetch } = require("./_lib/kombu-backend");
const { catalog, createPaymentLink } = require("./_lib/storefront");
module.exports = async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      const [creators, orders] = await Promise.all([
        supabaseFetch("/rest/v1/creator_codes?select=id,code,creator_name,active,created_at&order=created_at.desc&limit=200"),
        supabaseFetch("/rest/v1/storefront_orders?select=id,created_at,customer,quote,flavors,delivery_method,pickup_address,checkout_url,status,commission_cents,commission_status&order=created_at.desc&limit=200"),
      ]);
      return json(res, 200, { ok: true, creators, orders, limit: 200 });
    }
    if (req.method !== "POST") { res.setHeader("Allow", "GET, POST"); return json(res, 405, { ok: false }); }
    const body = await readBody(req, { maxBytes: 4000 });
    if (body.action === "payment-link") return json(res, 200, { ok: true, ...await createPaymentLink(body.orderId, body.deliveryCents) });
    const code = catalog.code(body.code);
    if (!code) return json(res, 400, { ok: false, error: "invalid_code" });
    if (body.action === "create") {
      const name = String(body.creatorName || "").trim().slice(0, 120);
      if (!name) return json(res, 400, { ok: false, error: "name_required" });
      // Ownership cannot be reassigned through an upsert: historic codes stay
      // linked to their original creator, including after deactivation.
      await supabaseFetch("/rest/v1/creator_codes", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ id: crypto.randomUUID(), code, creator_name: name, active: true }) });
    } else if (body.action === "disable") {
      await supabaseFetch(`/rest/v1/creator_codes?code=eq.${encodeURIComponent(code)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ active: false }) });
    } else return json(res, 400, { ok: false, error: "invalid_action" });
    return json(res, 200, { ok: true });
  } catch (error) { return json(res, [400,404,409].includes(error.status) ? error.status : 503, { ok: false, error: error.status === 409 ? "code_or_order_conflict" : error.status === 400 ? error.message : "creator_store_unavailable" }); }
};
