const crypto = require("crypto");
const catalog = require("../../assets/kit-catalog");
const { supabaseFetch, hasSupabase, appendLeadToState, sendEmail, ADMIN_EMAIL } = require("./kombu-backend");
const PICKUP = "Av. Mário Ypiranga, 2090 — Manaus/AM, CEP 69057-002";
function fail(code, status = 400) { const error = new Error(code); error.status = status; throw error; }
function origin() {
  const url = new URL(process.env.STOREFRONT_ORIGIN || "https://www.kombukombucha.com.br");
  if (url.protocol !== "https:" || url.pathname !== "/" || url.username || url.password || url.search || url.hash) fail("invalid_storefront_origin", 503);
  return url.origin;
}
function merchantHandle() { return process.env.INFINITEPAY_HANDLE || "kombu-amazonia"; }
function checkoutEnabled() {
  return process.env.STOREFRONT_CHECKOUT_ENABLED === "true" && hasSupabase() && Boolean(process.env.INFINITEPAY_API_KEY);
}
async function creatorFor(rawCode) {
  const code = catalog.code(rawCode);
  if (!String(rawCode || "").trim()) return null;
  if (!code) fail("invalid_creator_code");
  if (!hasSupabase()) fail("coupon_validation_unavailable", 503);
  const rows = await supabaseFetch(`/rest/v1/creator_codes?code=eq.${encodeURIComponent(code)}&active=eq.true&select=id,code,active&limit=1`);
  if (!rows?.[0]) fail("invalid_creator_code");
  return rows[0];
}
async function pricedQuote(body) {
  // Public requests can select a kit/code, never a freight charge or rate.
  if (!catalog.kits.some((kit) => kit.id === body.kitId)) fail("invalid_kit");
  return catalog.quote(body.kitId, await creatorFor(body.couponCode));
}
async function provider(path, body) {
  const response = await fetch(`https://api.checkout.infinitepay.io/${path}`, {
    method: "POST", headers: { "Content-Type": "application/json", "X-Api-Key": process.env.INFINITEPAY_API_KEY },
    body: JSON.stringify(body), signal: AbortSignal.timeout(12000),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) fail("payment_provider_unavailable", 502);
  return result;
}
function safeCheckoutUrl(value) {
  let url;
  try { url = new URL(value); } catch { fail("invalid_provider_response", 502); }
  if (url.protocol !== "https:" || !["checkout.infinitepay.com.br", "checkout.infinitepay.io", "pay.infinitepay.io"].includes(url.hostname) || url.username || url.password) fail("invalid_provider_response", 502);
  return url.href;
}
function uuid(value) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(String(value || "")); }
async function requestOrder(body) {
  if (!hasSupabase()) fail("order_store_unavailable", 503);
  if (!uuid(body.requestId)) fail("invalid_request_id");
  const customer = {
    name: String(body.name || "").trim().slice(0, 120),
    phone: String(body.phone || "").replace(/\D/g, ""),
    email: String(body.email || "").trim().toLowerCase().slice(0, 160),
    neighborhood: String(body.neighborhood || "").trim().slice(0, 120),
    city: String(body.city || "").trim(),
    address: String(body.address || "").trim().slice(0, 300),
    cep: String(body.cep || "").replace(/\D/g, ""),
  };
  if (!customer.name || !/^\d{10,13}$/.test(customer.phone) || (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))) fail("invalid_customer");
  if (customer.city.toLocaleLowerCase("pt-BR") !== "manaus" || !customer.address || !customer.neighborhood || !/^\d{8}$/.test(customer.cep)) fail("invalid_delivery_address");
  const { getStock, validateSelection } = require("./storefront-stock");
  const kit = catalog.kits.find(k => k.id === body.kitId);
  if (!kit) fail("invalid_kit");
  const selection = validateSelection(body.items, await getStock(), kit.bottles);
  const flavors = selection.map(item => `${item.qty} ${item.flavor}`).join("; ");
  const fingerprint = crypto.createHash("sha256").update(JSON.stringify([body.kitId, catalog.code(body.couponCode), customer, flavors])).digest("hex");
  const quote = await pricedQuote(body);
  async function notify(required = false) {
    const summary = `Pedido de kit: ${quote.bottles} garrafas de ${quote.sizeMl} ml. Produtos: R$ ${(quote.productsCents / 100).toFixed(2)}. Cupom: ${quote.couponCode || "nenhum"}. Frete Uber a confirmar. Sabores: ${flavors}. Endereço: ${customer.address}, ${customer.neighborhood}, ${customer.city}, CEP ${customer.cep}. Pedido: ${body.requestId}`;
    const saved = await appendLeadToState({ id: `kit-${body.requestId}`, type: "contato", name: customer.name, whatsapp: customer.phone, location: customer.neighborhood, couponCode: quote.couponCode, source: "site-kits", message: summary }).catch(() => ({ ok: false }));
    if (required && !saved.ok) fail("order_store_unavailable", 503);
    await sendEmail({ to: process.env.LEAD_NOTIFY_EMAIL || ADMIN_EMAIL, subject: `Novo pedido de kit Kombú: ${customer.name}`, text: summary }).catch(() => {});
  }
  let previous;
  try {
    previous = await supabaseFetch(`/rest/v1/storefront_orders?id=eq.${body.requestId}&select=id,request_fingerprint&limit=1`);
  } catch (error) {
    if (!["42P01", "PGRST205"].includes(error.detail?.code)) throw error;
    // Until the additive checkout migration is installed, retain kit enquiries
    // in the already deployed CRM. Never create an untracked payment link.
    await notify(true);
    return { orderId: body.requestId, persisted: true, storage: "crm", paymentPendingSetup: true };
  }
  if (previous?.[0]) {
    if (previous[0].request_fingerprint !== fingerprint) fail("request_changed", 409);
    return { orderId: previous[0].id, persisted: true };
  }
  const order = {
    id: body.requestId, request_fingerprint: fingerprint, quote, customer, flavors,
    delivery_method: "uber_manual", status: "awaiting_shipping", pickup_address: PICKUP,
    creator_id: quote.creatorId, commission_cents: quote.commissionCents,
  };
  try {
    await supabaseFetch("/rest/v1/storefront_orders", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(order) });
  } catch (error) {
    if (error.status !== 409) throw error;
    const duplicate = await supabaseFetch(`/rest/v1/storefront_orders?id=eq.${body.requestId}&select=id,request_fingerprint&limit=1`);
    if (!duplicate?.[0] || duplicate[0].request_fingerprint !== fingerprint) fail("request_changed", 409);
  }
  // The durable order is authoritative; CRM/email remain secondary here.
  await notify();
  return { orderId: order.id, persisted: true };
}
async function createPaymentLink(orderId, deliveryCents) {
  if (!checkoutEnabled()) fail("checkout_not_configured", 503);
  if (!uuid(orderId)) fail("invalid_order");
  if (!Number.isSafeInteger(deliveryCents) || deliveryCents < 0 || deliveryCents > 100000) fail("invalid_delivery_fee");
  const rows = await supabaseFetch(`/rest/v1/storefront_orders?id=eq.${orderId}&select=*&limit=1`);
  const order = rows?.[0];
  if (!order) fail("order_not_found", 404);
  if (order.status === "pending" && order.quote.deliveryCents === deliveryCents && order.checkout_url) return { checkoutUrl: safeCheckoutUrl(order.checkout_url) };
  if (order.status !== "awaiting_shipping") fail("order_not_ready", 409);
  // Freeze the customer-approved shipping charge without re-pricing the kit
  // or creator terms. Freight receives neither a discount nor commission.
  const quote = { ...order.quote, deliveryCents, totalCents: order.quote.productsCents + deliveryCents };
  const token = crypto.randomBytes(32).toString("hex");
  const callbackHash = crypto.createHash("sha256").update(token).digest("hex");
  const claimed = await supabaseFetch(`/rest/v1/storefront_orders?id=eq.${orderId}&status=eq.awaiting_shipping`, {
    method: "PATCH", headers: { Prefer: "return=representation" },
    body: JSON.stringify({ status: "creating", quote, callback_hash: callbackHash, shipping_quoted_at: new Date().toISOString() }),
  });
  if (!claimed?.length) fail("order_not_ready", 409);
  try {
    const phone = order.customer.phone;
    const result = await provider("links", {
      handle: merchantHandle(), order_nsu: order.id,
      redirect_url: `${origin()}/pagamento`,
      webhook: { url: `${origin()}/api/payment-webhook?order=${order.id}&token=${token}`, events: ["paid", "refunded", "canceled"] },
      customer: { name: order.customer.name, ...(order.customer.email ? { email: order.customer.email } : {}), phone_number: `+${phone.length > 11 && phone.startsWith("55") ? phone : `55${phone}`}` },
      items: [
        { quantity: 1, price: quote.productsCents, description: `Kombú: ${quote.bottles} garrafas de ${quote.sizeMl} ml${quote.couponCode ? ` — cupom ${quote.couponCode}` : ""}` },
        ...(quote.deliveryCents ? [{ quantity: 1, price: quote.deliveryCents, description: "Entrega Uber — valor confirmado" }] : []),
      ],
      options: { single_payment: true, valid_until: new Date(Date.now() + 30 * 60 * 1000).toISOString(), require_delivery_address: false },
    });
    const checkoutUrl = safeCheckoutUrl(result.url);
    await supabaseFetch(`/rest/v1/storefront_orders?id=eq.${order.id}&status=eq.creating`, {
      method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "pending", checkout_url: checkoutUrl }),
    });
    return { checkoutUrl };
  } catch (error) {
    // Timeout can mean the charge was created. No blind retry: preserve the
    // order for staff reconciliation instead of risking a second charge.
    await supabaseFetch(`/rest/v1/storefront_orders?id=eq.${order.id}&status=eq.creating`, {
      method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "review" }),
    }).catch(() => {});
    throw error;
  }
}
function validCallback(token, hash) {
  const candidate = crypto.createHash("sha256").update(String(token || "")).digest();
  const stored = Buffer.from(String(hash || ""), "hex");
  return candidate.length === stored.length && crypto.timingSafeEqual(candidate, stored);
}
async function processPayment(orderId, token, body) {
  if (!uuid(orderId)) fail("invalid_callback", 401);
  const rows = await supabaseFetch(`/rest/v1/storefront_orders?id=eq.${orderId}&select=*&limit=1`);
  const order = rows?.[0];
  if (!order || !order.callback_hash || !validCallback(token, order.callback_hash)) fail("invalid_callback", 401);
  const data = body.data || body;
  if (data.order_nsu !== order.id) fail("order_mismatch");
  const event = body.event || "paid";
  if (["refunded", "canceled"].includes(event)) {
    await supabaseFetch(`/rest/v1/storefront_orders?id=eq.${order.id}&status=not.in.(refunded,canceled)`, {
      method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: event, commission_status: "void" }),
    });
    return { status: event };
  }
  if (event !== "paid") return { status: "ignored" };
  if (order.status === "paid") return { status: "paid" };
  if (["refunded", "canceled"].includes(order.status)) return { status: order.status };
  if (!data.transaction_nsu || !(data.slug || data.invoice_slug)) fail("invalid_payment_notification");
  const checked = await provider("payment_check", {
    handle: merchantHandle(), order_nsu: order.id,
    transaction_nsu: String(data.transaction_nsu), slug: String(data.slug || data.invoice_slug),
  });
  if (checked.success !== true || checked.paid !== true || checked.amount !== order.quote.totalCents) fail("payment_not_verified", 409);
  const updated = await supabaseFetch(`/rest/v1/storefront_orders?id=eq.${order.id}&status=in.(creating,pending,review)`, {
    method: "PATCH", headers: { Prefer: "return=representation" },
    body: JSON.stringify({ status: "paid", paid_at: new Date().toISOString(), transaction_nsu: String(data.transaction_nsu), commission_status: order.creator_id ? "pending_fulfilment" : "none" }),
  });
  return { status: updated?.[0]?.status || "unchanged" };
}
module.exports = { catalog, PICKUP, checkoutEnabled, creatorFor, pricedQuote, requestOrder, createPaymentLink, processPayment, validCallback, safeCheckoutUrl, uuid };
