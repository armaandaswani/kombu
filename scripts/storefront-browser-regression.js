const assert = require("node:assert/strict");
const { chromium, launchOptions } = require("./browser-runtime");
const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost","127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local fixtures only");
(async () => {
  const browser = await chromium.launch(launchOptions);
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const calls = [];
    let codes = [];
    const order = { id: "12345678-1234-1234-1234-123456789abc", status: "awaiting_shipping", customer: { name: "Cliente Teste", phone: "92999990000", address: "Rua Teste, 1", neighborhood: "Centro", city: "Manaus", cep: "69057002" }, quote: { bottles: 6, productsCents: 13395, couponCode: "CRIADOR5" }, flavors: "3 Maracujá e 3 Uva", pickup_address: "Av. Mário Ypiranga, 2090", commission_cents: 1340, commission_status: "none" };
    await page.route("**/api/creators", async route => {
      const request = route.request();
      if (request.method() === "POST") {
        const body = JSON.parse(request.postData()); calls.push(body);
        if (body.action === "create") codes.push({ code: body.code.toUpperCase(), creator_name: body.creatorName, active: true });
        if (body.action === "disable") codes = codes.map(code => ({ ...code, active: false }));
        if (body.action === "payment-link") { order.status = "pending"; order.quote.deliveryCents = body.deliveryCents; order.quote.totalCents = order.quote.productsCents + body.deliveryCents; order.checkout_url = "https://checkout.infinitepay.com.br/fixture"; }
        return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, checkoutUrl: order.checkout_url }) });
      }
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, creators: codes, orders: [order] }) });
    });
    await page.goto(`${base}/admin.html`);
    await page.fill("#adminPassword", "local-test");
    await page.click('#loginForm button[type="submit"]');
    await page.waitForSelector("#adminContent");
    await page.evaluate(() => setModule("leads"));
    await page.click('[data-action="creator-store"]');
    await page.waitForSelector("[data-order-shipping]");
    await page.fill('#creatorCodeForm [name="creatorName"]', '<img src=x onerror="window.bad=1">Criadora');
    await page.fill('#creatorCodeForm [name="code"]', "CRIADOR5");
    await page.click('#creatorCodeForm button');
    await page.waitForSelector('[data-disable-code="CRIADOR5"]');
    assert.equal(await page.evaluate(() => window.bad), undefined);
    await page.click('[data-disable-code="CRIADOR5"]');
    await page.waitForFunction(() => document.querySelector("#creatorStoreData").textContent.includes("Inativo"));
    await page.fill('[data-order-shipping] [name="shipping"]', "18.00");
    await page.click('[data-order-shipping] button');
    await page.waitForSelector('input[aria-label="Link InfinitePay"]');
    assert.equal(calls.at(-1).deliveryCents, 1800);
    assert.ok((await page.locator("#creatorStoreData").innerText()).includes("151,95"));
    assert.equal(await page.inputValue('input[aria-label="Link InfinitePay"]'), "https://checkout.infinitepay.com.br/fixture");
    await page.route("**/api/payment-status?*", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, status: "pending" }) }));
    await page.goto(`${base}/pagamento?order_nsu=${order.id}&paid=true`);
    await page.waitForFunction(() => document.querySelector("#paymentStatus").textContent.includes("Ainda aguardamos"));
    assert.ok(!(await page.locator("#paymentStatus").innerText()).includes("Pagamento confirmado"), "a browser redirect cannot prove payment");
    assert.deepEqual(errors, []);
    console.log("Storefront browser regression passed: code create/disable, escaping, manual Uber charge, full payment total and copyable InfinitePay link.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
