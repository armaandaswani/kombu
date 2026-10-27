const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const catalog = require("../assets/kit-catalog");
const originalFetch = global.fetch;
const originalEnv = { ...process.env };
const orders = new Map();
const creators = new Map([["AMAZONIA5", { id: "creator-1", code: "AMAZONIA5", active: true }]]);
let providerCalls = 0;
let paymentVerified = true;
let providerAmount = 0;
let failInsert = false;
let failProvider = false;
let lastLinkRequest;
let missingSchema = false;
const crmRow = { id: "production", updated_at: "2026-10-27T12:00:00Z", state: { leads: [], products: [{ id: "p1", flavor: "Maracujá", sizeMl: 500 }, { id: "p2", flavor: "Uva", sizeMl: 500 }], batches: [{ code: "b1", productId: "p1", actual: 100, expiry: "2099-01-01" }, { code: "b2", productId: "p2", actual: 100, expiry: "2099-01-01" }] } };
function response(value, status = 200) { return { ok: status < 400, status, text: async () => JSON.stringify(value), json: async () => value }; }
function matches(row, url) {
  const id = url.searchParams.get("id");
  if (id && row.id !== id.slice(3)) return false;
  const status = url.searchParams.get("status");
  if (status?.startsWith("eq.") && row.status !== status.slice(3)) return false;
  if (status?.startsWith("in.(") && !status.slice(4,-1).split(",").includes(row.status)) return false;
  if (status?.startsWith("not.in.(") && status.slice(8,-1).split(",").includes(row.status)) return false;
  return true;
}
global.fetch = async (raw, options = {}) => {
  const url = new URL(raw);
  if (url.hostname === "api.checkout.infinitepay.io") {
    providerCalls++;
    if (failProvider) throw new Error("connection lost after dispatch");
    if (url.pathname === "/links") { lastLinkRequest = JSON.parse(options.body); return response({ url: "https://checkout.infinitepay.com.br/test-order" }); }
    if (url.pathname === "/payment_check") return response({ success: true, paid: paymentVerified, amount: providerAmount });
    throw new Error(`Unexpected provider path: ${url.pathname}`);
  }
  if (url.hostname !== "fixture.supabase.test") throw new Error(`Unexpected external network: ${url.hostname}`);
  if (url.pathname === "/rest/v1/creator_codes") {
    const code = url.searchParams.get("code")?.slice(3);
    const creator = creators.get(code);
    return response(creator?.active ? [creator] : []);
  }
  if (url.pathname === "/rest/v1/storefront_orders") {
    if (missingSchema) return response({ code: "PGRST205" }, 404);
    if (options.method === "POST") {
      if (failInsert) return response({ message: "unavailable" }, 503);
      const order = JSON.parse(options.body);
      if (orders.has(order.id)) return response({ message: "duplicate" }, 409);
      orders.set(order.id, structuredClone(order));
      return response(null);
    }
    const rows = [...orders.values()].filter(row => matches(row, url));
    if (options.method === "PATCH") {
      const patch = JSON.parse(options.body);
      if (patch.transaction_nsu && [...orders.values()].some(row => row.id !== rows[0]?.id && row.transaction_nsu === patch.transaction_nsu)) return response({ message: "duplicate transaction" }, 409);
      rows.forEach(row => Object.assign(row, structuredClone(patch)));
    }
    return response(structuredClone(rows));
  }
  // CRM notification is secondary; simulate it unavailable so this suite also
  // checks that a durable order survives a separate CRM failure.
  if (url.pathname === "/rest/v1/app_state") {
    if (!missingSchema && options.method === "PATCH") return response({ message: "CRM unavailable" }, 503);
    if (options.method === "PATCH") Object.assign(crmRow, JSON.parse(options.body));
    return response([crmRow]);
  }
  if (missingSchema && ["/rest/v1/app_state_backups", "/rest/v1/lead_archive", "/rest/v1/audit_events", "/rest/v1/sales_ledger"].includes(url.pathname)) return response([]);
  throw new Error(`Unexpected database path: ${url.pathname}`);
};
function mockRes() { return { headers: {}, setHeader(k,v) { this.headers[k] = v; }, end(raw) { this.body = JSON.parse(raw); } }; }
async function run() {
  Object.assign(process.env, { SUPABASE_URL: "https://fixture.supabase.test", SUPABASE_SERVICE_ROLE_KEY: "test-only-service-key", INFINITEPAY_HANDLE: "kombu-amazonia", INFINITEPAY_API_KEY: "test-only-key", STOREFRONT_CHECKOUT_ENABLED: "true" });
  delete process.env.RESEND_API_KEY;
  const { pricedQuote, requestOrder, createPaymentLink, processPayment, safeCheckoutUrl } = require("../api/_lib/storefront");
  const expected = [["kit-4",10000,9500,950],["kit-6",14100,13395,1340],["kit-12",26400,25080,2508],["kit-20",40000,38000,3800]];
  for (const [id,subtotal,products,commission] of expected) {
    const quote = await pricedQuote({ kitId: id, couponCode: " amazonia5 ", priceCents: 1, discountBps: 9999, commissionBps: 9999, deliveryCents: -1 });
    assert.equal(quote.subtotalCents, subtotal);
    assert.equal(quote.productsCents, products);
    assert.equal(quote.commissionCents, commission);
    assert.equal(quote.deliveryCents, 0, "public cannot supply freight");
    assert.equal(catalog.quote(id).productsCents, subtotal);
  }
  await assert.rejects(pricedQuote({ kitId: "kit-4", couponCode: "UNKNOWN" }), /invalid_creator_code/);
  creators.get("AMAZONIA5").active = false;
  await assert.rejects(pricedQuote({ kitId: "kit-4", couponCode: "AMAZONIA5" }), /invalid_creator_code/);
  creators.get("AMAZONIA5").active = true;
  for (const bad of ["javascript:alert(1)","https://checkout.infinitepay.com.br.evil.test/a","https://evil.test","http://checkout.infinitepay.com.br/a"]) assert.throws(() => safeCheckoutUrl(bad));
  const input = { requestId: crypto.randomUUID(), kitId: "kit-6", couponCode: "AMAZONIA5", name: "Cliente Teste", phone: "92999990000", email: "cliente@example.test", city: "Manaus", neighborhood: "Centro", cep: "69057002", address: "Rua Teste, 1", items: [{ productId: "p1", qty: 3 }, { productId: "p2", qty: 3 }] };
  const initialProviderCalls = providerCalls;
  const requested = await requestOrder(input);
  assert.equal(providerCalls, initialProviderCalls, "customer request never creates a payment before freight confirmation");
  assert.equal(requested.persisted, true);
  assert.equal(orders.get(input.requestId).status, "awaiting_shipping");
  await requestOrder(input);
  assert.equal(orders.size, 1, "same request ID is idempotent");
  await assert.rejects(requestOrder({ ...input, items: [{ productId: "p1", qty: 6 }] }), /request_changed/);
  await assert.rejects(requestOrder({ ...input, requestId: crypto.randomUUID(), city: "Belém" }), /invalid_delivery_address/);
  await assert.rejects(createPaymentLink(input.requestId, -1), /invalid_delivery_fee/);
  await assert.rejects(createPaymentLink(input.requestId, 1.5), /invalid_delivery_fee/);
  failInsert = true;
  await assert.rejects(requestOrder({ ...input, requestId: crypto.randomUUID() }));
  assert.equal(providerCalls, initialProviderCalls, "failed database write cannot create a payment");
  failInsert = false;
  const payment = await createPaymentLink(input.requestId, 1800);
  assert.equal(payment.checkoutUrl, "https://checkout.infinitepay.com.br/test-order");
  assert.equal(orders.get(input.requestId).quote.totalCents, 15195);
  assert.equal(orders.get(input.requestId).commission_cents, 1340, "delivery is excluded from commission");
  assert.equal(lastLinkRequest.items[0].price, 13395);
  assert.equal(lastLinkRequest.items[1].price, 1800);
  assert.equal(lastLinkRequest.handle, "kombu-amazonia");
  assert.equal(lastLinkRequest.options.single_payment, true);
  const count = providerCalls;
  await createPaymentLink(input.requestId, 1800);
  assert.equal(providerCalls, count, "reuse the same pending payment link");
  await assert.rejects(createPaymentLink(input.requestId, 1900), /order_not_ready/);
  const callbackUrl = new URL(lastLinkRequest.webhook.url);
  const token = callbackUrl.searchParams.get("token");
  const body = { event: "paid", data: { order_nsu: input.requestId, transaction_nsu: "transaction-1", invoice_slug: "slug-1" } };
  await assert.rejects(processPayment(input.requestId, "forged", body), /invalid_callback/);
  providerAmount = 1;
  await assert.rejects(processPayment(input.requestId, token, body), /payment_not_verified/);
  assert.equal(orders.get(input.requestId).status, "pending");
  providerAmount = 15195;
  paymentVerified = false;
  await assert.rejects(processPayment(input.requestId, token, body), /payment_not_verified/);
  paymentVerified = true;
  await processPayment(input.requestId, token, body);
  assert.equal(orders.get(input.requestId).status, "paid");
  assert.equal(orders.get(input.requestId).commission_status, "pending_fulfilment");
  const verifiedCount = providerCalls;
  await processPayment(input.requestId, token, body);
  assert.equal(providerCalls, verifiedCount, "duplicate paid callback cannot accrue another commission");
  await processPayment(input.requestId, token, { ...body, event: "refunded" });
  assert.equal(orders.get(input.requestId).commission_status, "void");
  await processPayment(input.requestId, token, body);
  assert.equal(orders.get(input.requestId).status, "refunded", "late paid callback cannot reverse refund");
  const second = { ...input, requestId: crypto.randomUUID() };
  await requestOrder(second);
  failProvider = true;
  await assert.rejects(createPaymentLink(second.requestId, 1800));
  failProvider = false;
  assert.equal(orders.get(second.requestId).status, "review");
  await assert.rejects(createPaymentLink(second.requestId, 1800), /order_not_ready/, "ambiguous provider failure cannot create a second charge");
  missingSchema = true;
  const enquiry = { ...input, requestId: crypto.randomUUID(), couponCode: "" };
  const fallback = await requestOrder(enquiry);
  assert.equal(fallback.storage, "crm");
  assert.equal(fallback.persisted, true);
  assert.ok(crmRow.state.leads[0].message.includes("141.00"), "kit enquiries remain usable before checkout migration");
  missingSchema = false;
  const checkout = require("../api/checkout");
  let res = mockRes();
  await checkout({ method: "POST", headers: {}, body: { action: "quote", kitId: "kit-4", couponCode: "AMAZONIA5" } }, res);
  assert.equal(res.body.quote.productsCents, 9500);
  assert.equal(res.body.quote.creatorId, undefined);
  assert.equal(res.body.quote.commissionCents, undefined);
  res = mockRes();
  await require("../api/creators")({ method: "POST", headers: {}, body: { action: "payment-link" } }, res);
  assert.equal(res.statusCode, 401, "shipping/payment links require admin authentication");
  console.log("Storefront regression passed: all four approved prices, coupon/rate tampering, inactive codes, cent rounding, manual freight, persistence-before-payment, idempotency, callbacks, refunds and admin auth.");
}
run().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { global.fetch = originalFetch; for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key]; Object.assign(process.env, originalEnv); });
