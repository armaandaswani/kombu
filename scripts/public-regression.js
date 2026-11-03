// Browser regression for the public site ("/", "/revenda", "/legal"), redesigned 2026-10-24.
// Runs against any static server; the API is mocked per test, so nothing reaches production.
//   AUDIT_BASE_URL=http://127.0.0.1:4173 node scripts/public-regression.js
const assert = require("assert");
const { chromium, launchOptions } = require("./browser-runtime");

const baseUrl = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";

const state = {
  cms: {
    headline: "Kombucha artesanal da Amazônia.",
    whatsapp: "(92) 99209-7165",
    announcement: "",
    // One flavour hidden in the admin must disappear everywhere.
    flavors: [{ slug: "uva", visible: false }, { slug: "maracuja", angle: "Ângulo vindo do admin." }],
  },
  partners: [
    // Listed first in the data on purpose: Solar Café must still be shown last.
    { name: "Solar Café Regional", neighborhood: "Tarumã", visible: true, whatsapp: "5592111", flavors: "Uva" },
    { name: "Divina Terra", neighborhood: "São Geraldo", address: "Av. Djalma Batista, 935", visible: true, instagram: "@divinaterramanaus", whatsapp: "5592222", flavors: "Maçã c/Canela, Mirtilo c/Flor Borboleta Azul" },
    // Partner data is typed into the admin; it must be rendered as text, never as markup.
    { name: '<img src=x onerror="window.__xss=1">Café', neighborhood: "Centro", visible: true },
  ],
};

const kitOrders = [];

async function newPage(browser, leads, { firstVisit = false } = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "pt-BR", reducedMotion: "no-preference" });
  if (!firstVisit) await context.addInitScript(() => { localStorage.setItem("kombuAudience", "consumo"); sessionStorage.setItem("kombuEntryAudience", "consumo"); });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/api/public-state", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, state }) }));
  await page.route("**/api/checkout", async (route) => {
    if (route.request().method() === "GET") return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, products: [{ productId: "p1", flavor: "Maracujá", available: 10 }, { productId: "p2", flavor: "Uva", available: 10 }], reservationProducts: [{ productId: "p1", flavor: "Maracujá", sizeMl: 500 }, { productId: "p2", flavor: "Uva", sizeMl: 500 }] }) });
    const body = JSON.parse(route.request().postData() || "{}");
    if (body.action === "quote") {
      const catalog = require("../assets/kit-catalog");
      if (body.couponCode !== "AMAZONIA10") return route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ ok: false, error: "invalid_creator_code" }) });
      const quote = catalog.quote(body.kitId, body.couponCode === "AMAZONIA10" ? { id: "fixture-creator", code: "AMAZONIA10", active: true } : null);
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, quote }) });
    }
    kitOrders.push(body);
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, persisted: true, reservation: body.orderMode === "reservation", orderId: body.requestId }) });
  });
  await page.route("**/api/lead", async (route) => {
    leads.push(JSON.parse(route.request().postData() || "{}").lead);
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, persisted: true }) });
  });
  return { page, errors };
}

async function run() {
  const browser = await chromium.launch(launchOptions);
  const leads = [];
  try {
    // ---------------------------------------------------------------- consumer page
    const { page, errors } = await newPage(browser, leads);
    await page.goto(`${baseUrl}/`);
    await page.waitForFunction(() => document.querySelectorAll(".walk-step").length > 0);

    const steps = await page.locator(".walk-step").count();
    assert.strictEqual(steps, 11, "12 flavours minus the one hidden in the admin");
    assert.strictEqual(await page.locator(".hero-bottle img").count(), 11, "the hero cycles the same visible flavours");
    assert.ok(!(await page.locator("#flavorList").innerText()).includes("Uva"), "a flavour hidden in the admin is not listed");

    // The hero can be browsed by hand.
    const firstName = await page.locator("#heroNow").innerText();
    await page.click(".hero-arrow.next");
    assert.notStrictEqual(await page.locator("#heroNow").innerText(), firstName, "the next arrow shows another flavour");
    await page.click(".hero-arrow.prev");
    assert.strictEqual(await page.locator("#heroNow").innerText(), firstName, "the previous arrow comes back");

    // Scrolling through the walk puts each flavour on stage, in order, with its own bottle.
    for (const i of [0, 4, 10]) {
      await page.evaluate((n) => {
        const el = document.querySelectorAll(".walk-step")[n];
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + 20);
      }, i);
      await page.waitForFunction((n) => document.querySelector(".walk-count").textContent.startsWith(String(n + 1).padStart(2, "0")), i);
      const onIndex = await page.evaluate(() => [...document.querySelectorAll(".walk-bottle img")].findIndex((img) => img.classList.contains("is-on")));
      assert.strictEqual(onIndex, i, `flavour ${i + 1}: the bottle shown matches the name`);
    }
    // The transparent scroll markers must not intercept dot clicks or drags.
    await page.locator(".walk-rail button").nth(3).click();
    await page.waitForFunction(() => document.querySelector(".walk-count").textContent.startsWith("04"));
    await page.waitForTimeout(150);
    assert.ok((await page.locator(".walk-count").innerText()).startsWith("04"), "dot selection stays selected after scroll sync");
    await page.locator(".walk-rail button").first().click();
    await page.waitForFunction(() => document.querySelector(".walk-count").textContent.startsWith("01"));
    assert.ok(await page.locator(".walk-stage").evaluate((stage) => Math.abs(stage.getBoundingClientRect().top) < 3), "first flavour remains fully pinned");
    await page.locator(".walk-rail button").first().focus();
    await page.keyboard.press("End");
    await page.waitForFunction((count) => document.querySelector(".walk-count").textContent.startsWith(String(count).padStart(2, "0")), steps);
    await page.keyboard.press("Home");
    await page.waitForFunction(() => document.querySelector(".walk-count").textContent.startsWith("01"));
    const bottleBox = await page.locator(".walk-bottle").boundingBox();
    const dragX = bottleBox.x + bottleBox.width * 0.7;
    const dragY = bottleBox.y + bottleBox.height * 0.5;
    await page.mouse.move(dragX, dragY);
    await page.mouse.down();
    await page.mouse.move(dragX - 100, dragY + 5, { steps: 6 });
    await page.mouse.up();
    await page.waitForFunction(() => document.querySelector(".walk-count").textContent.startsWith("02"));
    const touch = await page.context().newCDPSession(page);
    await touch.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
    await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: dragX, y: dragY, id: 1 }] });
    await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: dragX - 90, y: dragY + 5, id: 1 }] });
    await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForFunction(() => document.querySelector(".walk-count").textContent.startsWith("03"));
    await touch.send("Emulation.setTouchEmulationEnabled", { enabled: false });
    await touch.detach();
    await page.evaluate(() => window.scrollTo(0, 0));
    assert.strictEqual(await page.evaluate(() => document.querySelector(".walk-stage .btn") && getComputedStyle(document.querySelector(".walk-stage .btn")).backgroundColor !== getComputedStyle(document.querySelector(".walk-stage")).backgroundColor), true, "the stage button is not the colour of the stage");

    // Admin overrides still apply.
    assert.strictEqual(await page.locator("#heroSub").innerText(), "Kombucha Artesanal da Amazônia");
    assert.ok((await page.locator("#flavorList").innerText()).includes("Ângulo vindo do admin."), "an admin description wins over the default");

    // Partners: Solar Café last, flavour names normalised, markup escaped.
    const names = await page.locator(".partner h3").allInnerTexts();
    assert.strictEqual(names.at(-1), "Solar Café Regional", "Solar Café is listed after everyone else");
    assert.ok(names.some((n) => n.includes("<img")), "a partner name containing markup is shown as text");
    assert.strictEqual(await page.evaluate(() => window.__xss), undefined, "partner data is never executed");
    const divina = page.locator(".partner", { hasText: "Divina Terra" });
    assert.equal(await divina.locator("details").getAttribute("open"), null, "long flavor lists begin collapsed");
    await divina.locator("summary").click();
    assert.ok((await divina.innerText()).includes("Maçã & Canela"), "hand-typed flavour names are shown canonically");
    assert.ok((await divina.innerText()).includes("Flor Fada Azul & Blueberry"));
    assert.ok((await divina.locator('a:has-text("Ver rota")').getAttribute("href")).startsWith("https://www.google.com/maps/search/"));
    assert.strictEqual(await divina.locator('a[href*="instagram.com/divinaterramanaus"]').count(), 1);

    // WhatsApp links use the number set in the admin.
    assert.ok((await page.locator("[data-whatsapp]").first().getAttribute("href")).includes("phone=5592992097165"));

    // Ordering direct is one tap away: hero button, "Pedir este sabor" prefills the flavour,
    // and on a phone a floating button appears once the hero is out of view.
    assert.strictEqual(await page.locator('.hero .btn[href="/experimente"]').count(), 1, "the hero leads directly to priced kits");
    assert.ok(await page.evaluate(() => document.querySelector("#comprar").compareDocumentPosition(document.querySelector("#sabores")) & Node.DOCUMENT_POSITION_FOLLOWING), "ordering comes before the flavour walk");
    await page.evaluate(() => { const el = document.querySelectorAll(".walk-step")[4]; window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + 20); });
    await page.waitForFunction(() => document.querySelector(".walk-count").textContent.startsWith("05"));
    const onStage = (await page.locator(".walk-name").innerText()).trim();
    await page.locator(".walk-order").evaluate(a => a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })));
    await page.waitForURL('**/experimente?kit=kit-5&sabor=**');
    assert.ok(new URL(page.url()).searchParams.get("sabor").includes(onStage));
    await page.goto(`${baseUrl}/`);
    await page.evaluate(() => window.scrollTo(0, document.querySelector("#onde").getBoundingClientRect().top + window.scrollY + 300));
    await page.waitForFunction(() => !document.querySelector(".order-fab").classList.contains("is-away"));
    assert.ok(await page.locator(".order-fab").isVisible(), "the floating order button shows mid-page on a phone");

    assert.strictEqual(await page.locator('#comprar .buy article').count(), 2);
    assert.strictEqual(await page.locator('#comprar form').count(), 0, 'purchase cards stay compact');
    assert.strictEqual(await page.locator('.buy-kit-options a').count(), 5);
    assert.ok(!(await page.locator('#comprar').innerText()).includes('R$'), 'home cards do not show prices');

    // Mobile menu (the header hides while scrolling down, so come back to the top first).
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => !document.querySelector(".site-header").classList.contains("is-hidden"));
    await page.click(".menu-btn");
    assert.strictEqual(await page.locator(".nav .nav-buy").innerText(), "Comprar");
    assert.strictEqual(await page.locator(".nav .nav-reseller").innerText(), "Para revenda");
    assert.ok(await page.locator(".site-header").evaluate((h) => h.classList.contains("menu-open")));
    // Overlay navigation must work with keyboard and release the scroll lock on resize.
    await page.locator('.menu-btn').focus();
    await page.keyboard.press('Tab');
    assert.ok(await page.evaluate(() => document.querySelector('.site-header').contains(document.activeElement)), 'Tab stays inside the open menu');
    await page.keyboard.press('Shift+Tab');
    assert.ok(await page.locator('.menu-btn').evaluate(el => el === document.activeElement), 'reverse Tab returns to the menu toggle');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.menu-btn').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.evaluate(() => document.body.style.overflow), '', 'Escape releases the scroll lock');
    assert.ok(await page.locator('.menu-btn').evaluate(el => el === document.activeElement), 'Escape restores focus');
    await page.click('.menu-btn');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForFunction(() => !document.querySelector('.site-header').classList.contains('menu-open'));
    assert.equal(await page.evaluate(() => document.body.style.overflow), '', 'desktop resize releases the scroll lock');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click('.menu-btn');
    await page.click('.nav a[href="#onde"]');
    assert.ok(!(await page.locator(".site-header").evaluate((h) => h.classList.contains("menu-open"))), "following a menu link closes the menu");

    // Nothing scrolls sideways on a phone.
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), "no horizontal scroll at 390px");
    assert.deepStrictEqual(errors, [], "no script errors");

    // Old links to the legal texts on the home page land on /legal.
    // The redirect can land before "/" finishes loading, which aborts that load and makes
    // Playwright's navigation waits throw; poll the address instead.
    await page.goto(`${baseUrl}/#termos`, { waitUntil: "commit" });
    for (let t = 0; !/\/legal(\.html)?#termos$/.test(page.url()); t++) {
      assert.ok(t < 100, `/#termos should redirect to /legal#termos, stayed on ${page.url()}`);
      await new Promise((r) => setTimeout(r, 50));
    }

    // The entry is a separate document, including for someone with an old saved preference.
    const first = await newPage(browser, leads, { firstVisit: true });
    await first.page.context().addInitScript(() => localStorage.setItem('kombuAudience', 'consumo'));
    await first.page.goto(`${baseUrl}/?ref=AMAZONIA10`);
    await first.page.waitForURL(/\/entrada(?:\.html)?\?ref=AMAZONIA10$/);
    assert.equal(await first.page.locator('.site-header, .hero, dialog').count(), 0, 'entry has no home or modal behind it');
    assert.ok(await first.page.locator('.entry-screen').isVisible());
    await first.page.locator('[data-choice=consumo]').click();
    await first.page.waitForFunction(() => document.querySelectorAll('.walk-step').length > 0);
    assert.ok(await first.page.locator('#hero-title').isVisible());
    assert.equal(new URL(first.page.url()).searchParams.get('ref'), 'AMAZONIA10', 'entry preserves creator attribution');
    await first.page.goto(`${baseUrl}/`);
    assert.ok(await first.page.locator('#hero-title').isVisible(), 'entry choice lasts for this browsing session');
    await first.page.locator('.hero-pause').click();
    assert.equal(await first.page.locator('.hero-pause').getAttribute('aria-pressed'), 'true');
    assert.ok(await first.page.evaluate(() => document.documentElement.classList.contains('motion-paused')));
    await first.page.locator('.hero-pause').click();
    assert.equal(await first.page.locator('.hero-pause').getAttribute('aria-pressed'), 'false');
    await first.page.locator('.menu-btn').click();
    await first.page.locator('.nav-reseller').click();
    await first.page.waitForURL(/\/revenda(\.html)?$/);
    assert.equal(await first.page.evaluate(() => localStorage.getItem('kombuAudience')), 'revenda');

    const deep = await newPage(browser, leads, { firstVisit: true });
    await deep.page.goto(`${baseUrl}/#onde`);
    await deep.page.waitForFunction(() => document.querySelectorAll(".partner").length > 0);
    assert.equal(await deep.page.locator('dialog[open]').count(), 0, 'deep links stay uninterrupted');

    // ---------------------------------------------------------------- revenda
    const b = await newPage(browser, leads);
    await b.page.goto(`${baseUrl}/revenda.html`);
    await b.page.waitForFunction(() => document.querySelectorAll("#resellerFlavors article").length === 11);
    assert.ok(!(await b.page.locator('#resellerFlavors').innerText()).includes('Uva'), 'CMS-hidden flavour stays hidden in reseller catalogue');
    await b.page.selectOption('#resellerFlavorFamily', 'Florais');
    assert.ok(await b.page.locator('#resellerFlavors article').count() < 11, 'catalogue filters by flavour profile');
    await b.page.selectOption('#resellerFlavorFamily', '');
    await b.page.locator('[data-name="Maracujá"]').click();
    assert.ok((await b.page.locator('#tradeHeroBottle').getAttribute('src')).includes('maracuja'), 'hero selection shows the actual selected bottle');
    for (const width of [320, 390, 768]) {
      await b.page.setViewportSize({ width, height: 900 });
      assert.ok(await b.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `reseller page fits ${width}px`);
    }
    await b.page.setViewportSize({ width: 390, height: 844 });
    await b.page.context().route('https://wa.me/**', (route) => route.fulfill({ status: 200, body: 'ok' }));
    // Pré-contato: one question per screen, answers go organised to the Kombú WhatsApp.
    const sheet = b.page.locator('.pc');
    const pick = (label) => sheet.locator(`[data-value="${label}"]`).click();
    await b.page.locator('#contato a[data-precontato="revenda"]').click();
    await sheet.locator('h2', { hasText: 'Que tipo de espaço' }).waitFor();
    await pick('Outro');
    assert.ok(await sheet.locator('[data-pc-next]').isDisabled(), 'Other requires its explanation');
    await sheet.locator('[data-other]').fill('Padaria artesanal');
    await sheet.locator('[data-pc-next]').click();
    await pick('Já vendo kombucha');
    await sheet.locator('h2', { hasText: 'dia a dia' }).waitFor();
    await pick('Pratica yoga, pilates ou meditação');
    await pick('Prefere produtos naturais e orgânicos');
    await pick('Treina e cuida do corpo');
    assert.equal(await sheet.locator('[data-value="Aprecia gastronomia e cafés especiais"]').getAttribute('aria-disabled'), 'true', 'lifestyle choice is capped at three');
    await sheet.locator('[data-pc-next]').click();
    await sheet.locator('h2', { hasText: 'uma bebida no seu espaço' }).waitFor();
    await pick('De R$ 15 a R$ 25');
    await pick('Sim, tenho geladeira ou expositor');
    await sheet.locator('h2', { hasText: 'Quais sabores' }).waitFor();
    assert.equal(await sheet.locator('.pc-flavor').count(), 11, 'CMS-hidden flavour stays out of the pre-contact');
    await pick('Maracujá');
    await sheet.locator('[data-pc-next]').click();
    await pick('Assim que possível');
    await sheet.locator('[name="negocio"]').waitFor();
    assert.ok(await sheet.locator('[data-pc-next]').isDisabled(), 'business details are required');
    await sheet.locator('[name="negocio"]').fill('Café Teste');
    await sheet.locator('[name="bairro"]').fill('Centro');
    await sheet.locator('[name="nome"]').fill('Dono Teste');
    assert.ok(await sheet.locator('[data-pc-next]').isDisabled(), 'business Instagram is required');
    await sheet.locator('[name="instagram"]').fill('@cafeteste');
    await sheet.locator('[data-pc-next]').click();
    await pick('Instagram');
    await sheet.locator('[data-pc-send]').waitFor();
    await sheet.locator('[data-edit="tipo"]').click();
    await sheet.locator('h2', { hasText: 'Que tipo de espaço' }).waitFor();
    await pick('Café ou confeitaria');
    const href = await b.page.evaluate(async () => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      while (!document.querySelector('.pc [data-pc-send]')) {
        const next = document.querySelector('.pc [data-pc-next]:not([disabled])');
        const checked = document.querySelector('.pc .pc-option[aria-checked="true"]');
        if (next) next.click(); else if (checked) checked.click();
        await wait(350);
      }
      return document.querySelector('.pc [data-pc-send]').href;
    });
    assert.ok(href.startsWith('https://wa.me/5592992097165?text='), 'pre-contact goes to the Kombú WhatsApp');
    const text = decodeURIComponent(href.split('text=')[1]);
    assert.ok(text.includes('*O espaço*\n• Nome: Café Teste\n• Bairro: Centro\n• Tipo: Café ou confeitaria'), 'message is organised by section');
    assert.ok(text.includes('• Sabores: Maracujá') && text.includes('• Responsável: Dono Teste'));
    const popupPromise = b.page.context().waitForEvent('page');
    await sheet.locator('[data-pc-send]').click();
    const popup = await popupPromise.catch(() => null);
    await popup?.close().catch(() => {});
    await b.page.waitForFunction(() => document.querySelector('.pc').hidden);
    await b.page.waitForTimeout(200);
    const lead = leads.at(-1);
    assert.equal(lead.type, 'revenda');
    assert.equal(lead.business, 'Café Teste');
    assert.equal(lead.businessType, 'Café ou confeitaria');
    assert.equal(lead.source, 'site-revenda');
    assert.equal(lead.audiences.length, 3, 'multiple audiences survive serialization');
    assert.ok(text.includes('*Público*\n• Estilo de vida: Pratica yoga, pilates ou meditação; Prefere produtos naturais e orgânicos; Treina e cuida do corpo\n• Preço médio de uma bebida: De R$ 15 a R$ 25'), 'audience fit has its own section');
    assert.ok(!/renda|classe|idade|anos/i.test(text.split('*Interesse*')[0].split('*Público*')[1]), 'audience questions never ask income, class or age directly');
    assert.equal(lead.discoverySource, 'Instagram');
    assert.ok(lead.message.includes('*Interesse*'), 'CRM keeps the same organised summary');
    assert.deepStrictEqual(b.errors, [], 'no script errors on /revenda');

    // Referral survives navigation to a tasting kit, and can be changed or removed.
    const referral = await newPage(browser, leads);
    await referral.page.goto(`${baseUrl}/?cupom=amazonia10#comprar`);
    await referral.page.waitForFunction(() => sessionStorage.getItem("kombuReferral") === "AMAZONIA10");
    await referral.page.goto(`${baseUrl}/experimente`);
    await referral.page.waitForFunction(() => document.querySelector("input[name='couponCode']")?.value === "AMAZONIA10");
    await referral.page.click('[data-kit="kit-10"]');
    assert.strictEqual(await referral.page.inputValue("#kit-choice"), "kit-10");
    assert.equal(await referral.page.locator("#customQuantityField").isVisible(), false, "normal kits hide custom quantity");
    await referral.page.fill('#kitForm [name="couponCode"]', "INVALID");
    await referral.page.locator('#kitForm [name="couponCode"]').blur();
    await referral.page.waitForSelector('#couponStatus[data-state="error"]');
    assert.ok(await referral.page.locator('#kitForm button[type="submit"]').isDisabled(), "invalid code blocks a discounted order");
    await referral.page.fill('#kitForm [name="couponCode"]', "AMAZONIA10");
    await referral.page.locator('#kitForm [name="couponCode"]').blur();
    await referral.page.fill('#kitForm [name="nome"]', "Cliente Kit");
    await referral.page.fill('#kitForm [name="whatsapp"]', "92999990000");
    await referral.page.fill('#kitForm [name="bairro"]', "Centro");
    await referral.page.fill('#kitForm [name="cep"]', "69057-002");
    await referral.page.fill('#kitForm [name="address"]', "Rua Teste, 100");
    await referral.page.fill('#stockProducts input[data-product-id="p1"]', "5");
    await referral.page.fill('#stockProducts input[data-product-id="p2"]', "5");
    await referral.page.waitForFunction(() => !document.querySelector('#kitForm button[type="submit"]').disabled);
    assert.ok((await referral.page.locator("#kitQuote").innerText()).includes("223,25"), "the approved 5% discount is shown on the ten-bottle kit");
    await referral.page.click('#kitForm button[type="submit"]');
    await referral.page.waitForSelector("#kitForm .form-status[data-state='ok']");
    assert.strictEqual(kitOrders.at(-1).kitId, "kit-10");
    assert.strictEqual(kitOrders.at(-1).couponCode, "AMAZONIA10");
    assert.deepStrictEqual(kitOrders.at(-1).items, [{ productId: "p1", qty: 5 }, { productId: "p2", qty: 5 }]);
    await referral.page.selectOption('#kitForm [name="kitId"]', 'kit-15');
    await referral.page.selectOption('#kitForm [name="orderMode"]', 'reservation');
    await referral.page.fill('#stockProducts input[data-product-id="p1"]', '4');
    await referral.page.fill('#stockProducts input[data-product-id="p2"]', '11');
    assert.ok(await referral.page.locator('#kitForm button[type="submit"]').isDisabled(), 'minimum 5 per flavour blocks 4+8');
    await referral.page.fill('#stockProducts input[data-product-id="p1"]', '5');
    await referral.page.fill('#stockProducts input[data-product-id="p2"]', '10');
    await referral.page.waitForFunction(() => !document.querySelector('#kitForm button[type="submit"]').disabled);
    assert.strictEqual(await referral.page.locator('#kitForm button[type="submit"]').textContent(), 'Reservar lote sem pagamento');
    await referral.page.selectOption('#kitForm [name="kitId"]', 'kit-10');
    assert.ok(await referral.page.locator('#kitForm button[type="submit"]').isDisabled(), 'small kits cannot reserve production');

    assert.strictEqual(kitOrders.at(-1).deliveryCents, undefined, "customer does not choose a delivery fee");
    await referral.page.fill('input[name="couponCode"]', "");
    await referral.page.locator('input[name="couponCode"]').blur();
    await referral.page.reload();
    await referral.page.waitForFunction(() => Boolean(window.KombuKits && document.querySelector("#kitForm")));
    assert.strictEqual(await referral.page.inputValue('input[name="couponCode"]'), "");
    await referral.page.goto(`${baseUrl}/?ref=%3Cscript%3E#comprar`);
    await referral.page.waitForFunction(() => document.querySelectorAll(".walk-step").length > 0);
    assert.strictEqual(await referral.page.locator('#comprar input[name="couponCode"]').count(), 0);
    assert.ok(await referral.page.locator('#parcerias a[href="/parcerias"]').isVisible(), 'home opens the broader partnership area');
    await referral.page.goto(`${baseUrl}/criadores`);
    assert.equal((await referral.page.locator('h1').innerText()).replace(/\s+/g, ' '), 'Parcerias com a Kombú.');
    assert.ok(!(await referral.page.locator('main').innerText()).match(/(?:5|10)\s*%/), 'partnership invitation keeps commercial rates private');
    assert.equal(await referral.page.locator('[name="seguidores"]').count(), 0, 'professional partnerships require no followers');
    await referral.page.context().route('https://wa.me/**', (route) => route.fulfill({ status: 200, body: 'ok' }));
    const psheet = referral.page.locator('.pc');
    const ppick = (label) => psheet.locator(`[data-value="${label}"]`).click();
    await referral.page.locator('.trade-hero [data-precontato="parceria"]').click();
    // A studio that wants to sell Kombú is sent to the reseller flow.
    await psheet.locator('[data-pc-switch]').click();
    await psheet.locator('h2', { hasText: 'Que tipo de espaço' }).waitFor();
    await referral.page.keyboard.press('Escape');
    await referral.page.locator('.trade-hero [data-precontato="parceria"]').click();
    // Creators get follower and brand questions; professionals do not.
    await ppick('Criador(a) de conteúdo');
    await psheet.locator('h2', { hasText: 'dia a dia de quem acompanha' }).waitFor();
    await ppick('Prefere produtos naturais e orgânicos');
    await psheet.locator('[data-pc-next]').click();
    await psheet.locator('h2', { hasText: 'seguidores' }).waitFor();
    await psheet.locator('[data-pc-back]').click();
    await psheet.locator('[data-pc-back]').click();
    await ppick('Nutricionista ou nutrólogo(a)');
    await psheet.locator('h2', { hasText: 'dia a dia de quem acompanha' }).waitFor();
    // Going back keeps the lifestyle answer already given.
    await psheet.locator('[data-pc-next]').click();
    await psheet.locator('h2', { hasText: 'pacientes ou alunos' }).waitFor();
    await ppick('De 30 a 100');
    await psheet.locator('h2', { hasText: 'já conhece' }).waitFor();
    await ppick('Ainda não conheço');
    await psheet.locator('h2', { hasText: 'Como você imagina' }).waitFor();
    assert.equal(await psheet.locator('[data-value="Ter Kombú no meu espaço"]').count(), 0, 'selling in a space belongs to the reseller flow');
    await ppick('Degustação ou evento');
    await psheet.locator('[data-pc-next]').click();
    await psheet.locator('h2', { hasText: 'espera em troca' }).waitFor();
    await ppick('Produto para provar e divulgar');
    await psheet.locator('h2', { hasText: 'Conte sua ideia' }).waitFor();
    await psheet.locator('[name="mensagem"]').fill('Quero apresentar a Kombú para minhas pacientes.');
    await psheet.locator('[data-pc-next]').click();
    await psheet.locator('[name="nome"]').fill('Profissional Teste');
    await psheet.locator('[name="bairro"]').fill('Manaus');
    assert.ok(await psheet.locator('[data-pc-next]').isDisabled(), 'Instagram is required');
    await psheet.locator('[name="instagram"]').fill('@profissionalteste');
    await psheet.locator('[data-pc-next]').click();
    await ppick('Amigo ou conhecido');
    const phref = await psheet.locator('[data-pc-send]').getAttribute('href');
    const ptext = decodeURIComponent(phref.split('text=')[1]);
    assert.ok(ptext.startsWith('Olá! Vim pelo site da Kombú e quero conversar sobre uma parceria.'));
    assert.ok(ptext.includes('• Área: Nutricionista ou nutrólogo(a)'));
    assert.ok(ptext.includes('*Público*\n• Estilo de vida: Prefere produtos naturais e orgânicos\n• Pacientes ou alunos por mês: De 30 a 100'), ptext);
    assert.ok(ptext.includes('• Espera em troca: Produto para provar e divulgar'));
    assert.ok(!/Seguidores|Marcas|Quanto custa/.test(ptext), 'answers from another area branch never leak into the message');
    const ppopup = referral.page.context().waitForEvent('page');
    await psheet.locator('[data-pc-send]').click();
    await (await ppopup.catch(() => null))?.close().catch(() => {});
    await referral.page.waitForTimeout(300);
    assert.equal(leads.at(-1).type, 'parceria');
    assert.equal(leads.at(-1).source, 'site-parcerias');
    assert.equal(leads.at(-1).profileType, 'Nutricionista ou nutrólogo(a)');
    assert.deepStrictEqual(leads.at(-1).audiences, ['Prefere produtos naturais e orgânicos']);
    assert.equal(leads.at(-1).instagram, '@profissionalteste', 'Instagram reaches the CRM');
    assert.deepStrictEqual(referral.errors, []);

    // Stock errors offer retry, and empty ready-stock leads to an unpaid production request.
    const empty = await newPage(browser, leads);
    let firstStockAttempt = true;
    await empty.page.route('**/api/checkout', async route => {
      if (route.request().method() !== 'GET') return route.fallback();
      if (firstStockAttempt) { firstStockAttempt = false; return route.fulfill({status:503,json:{ok:false}}); }
      return route.fulfill({json:{ok:true,products:[],reservationProducts:[{productId:'p1',flavor:'Maracujá'},{productId:'p2',flavor:'Uva'}]}});
    });
    await empty.page.goto(`${baseUrl}/experimente?kit=kit-15#consultar`);
    await empty.page.waitForSelector('#retryStock:not([hidden])');
    await empty.page.locator('#retryStock').click();
    await empty.page.waitForSelector('#reserveInstead:not([hidden])');
    assert.ok(await empty.page.locator('#customQuantityField').isHidden());
    await empty.page.locator('#reserveInstead').click();
    assert.equal(await empty.page.locator('[name=orderMode]').inputValue(), 'reservation');
    await empty.page.locator('#stockProducts input[data-product-id=p1]').fill('5');
    await empty.page.locator('#stockProducts input[data-product-id=p2]').fill('10');
    for (const [name,value] of Object.entries({nome:'Reserva Teste',whatsapp:'92999990000',bairro:'Centro',cep:'69057002',address:'Rua Teste, 1'})) await empty.page.locator(`[name=${name}]`).fill(value);
    await empty.page.locator('#kitForm button[type=submit]').click();
    await empty.page.waitForSelector('#kitForm .form-status[data-state=ok]');
    assert.equal(kitOrders.at(-1).orderMode, 'reservation');
    assert.ok((await empty.page.locator('#kitForm .form-status').innerText()).includes('sem pagamento'));

    // ---------------------------------------------------------------- blog and SEO
    const blog = await newPage(browser, leads);
    for (const url of ["/", "/experimente", "/revenda", "/parcerias", "/legal", "/blog", "/blog/o-que-e-kombucha", "/blog/como-a-kombu-e-feita", "/blog/como-servir-kombucha"]) {
      await blog.page.goto(`${baseUrl}${url}`);
      const seo = await blog.page.evaluate(() => ({
        h1: document.querySelectorAll("h1").length,
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || "",
        canonical: document.querySelector('link[rel="canonical"]')?.href || "",
        ogImage: document.querySelector('meta[property="og:image"]')?.content || "",
        jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { JSON.parse(s.textContent); return true; } catch { return false; } }),
        wide: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      }));
      assert.strictEqual(seo.h1, 1, `${url}: exactly one h1`);
      assert.ok(seo.title.length >= 25 && seo.title.length <= 65, `${url}: title length ${seo.title.length}`);
      assert.ok(seo.description.length >= 80 && seo.description.length <= 165, `${url}: description length ${seo.description.length}`);
      assert.ok(seo.canonical.startsWith("https://www.kombukombucha.com.br/"), `${url}: canonical`);
      assert.ok(seo.ogImage.endsWith("/assets/og-kombu.jpg"), `${url}: share image`);
      assert.ok(seo.jsonld.length >= 1 && seo.jsonld.every(Boolean), `${url}: valid structured data`);
      assert.ok(!seo.wide, `${url}: no horizontal scroll`);
    }
    await blog.page.goto(`${baseUrl}/blog`);
    assert.strictEqual(await blog.page.locator(".post-list li").count(), 3, "the blog lists every article");
    const readingLinks = blog.page.locator(".reading-list a");
    assert.strictEqual(await readingLinks.count(), 5, "the reading list from linktr.ee/kombuestudos");
    for (const rel of await readingLinks.evaluateAll((as) => as.map((a) => a.rel))) assert.ok(rel.includes("noopener"), "external reading opens safely");
    assert.deepStrictEqual(blog.errors, [], "no script errors on the blog");

    console.log("Public regression: walk, admin overrides, partner order and escaping, both forms, menu, legal redirects, separate pre-landing entry and motion controls, mobile layout, blog and SEO basics passed.");
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
