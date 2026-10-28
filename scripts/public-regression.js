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
  if (!firstVisit) await context.addInitScript(() => localStorage.setItem("kombuAudience", "consumo"));
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

    // First visits restore the dedicated audience chooser; direct links stay uninterrupted.
    const first = await newPage(browser, leads, { firstVisit: true });
    await first.page.goto(`${baseUrl}/`);
    await first.page.waitForFunction(() => document.querySelectorAll(".walk-step").length > 0);
    assert.equal(await first.page.locator('dialog[open]').count(), 1, 'first visit opens the dedicated chooser');
    assert.ok(await first.page.locator('#audienceChooser').isVisible(), 'audience chooser is visible');
    await first.page.locator('#audienceChooser [data-choice=consumo]').click();
    assert.ok(await first.page.locator('#audienceChooser').isHidden());
    assert.ok(await first.page.locator('#hero-title').isVisible());
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
    await b.page.waitForFunction(() => document.querySelectorAll("#fan img").length > 0);
    assert.ok((await b.page.locator("#fan img").count()) >= 3, "the hero shows a fan of bottles");
    const proof = await b.page.locator("#proofNames b").allInnerTexts();
    assert.strictEqual(proof.at(-1), "Solar Café Regional", "Solar Café is last in the proof strip too");
    assert.strictEqual(await b.page.evaluate(() => window.__xss), undefined);
    await b.page.fill("#rev-nome", "Dono Teste");
    await b.page.fill("#rev-negocio", "Café Teste");
    await b.page.selectOption("#rev-tipo", "Café");
    await b.page.fill("#rev-whatsapp", "92 98888-0000");
    await b.page.click('#resellerForm button[type="submit"]');
    await b.page.waitForSelector("#resellerForm .form-status:not([hidden])");
    const lead = leads.at(-1);
    assert.strictEqual(lead.type, "revenda");
    assert.strictEqual(lead.business, "Café Teste");
    assert.strictEqual(lead.businessType, "Café");
    assert.strictEqual(lead.source, "site-revenda", "the CRM can tell a reseller lead from the business page");
    assert.ok(await b.page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), "no horizontal scroll on /revenda");
    assert.deepStrictEqual(b.errors, [], "no script errors on /revenda");

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
    await referral.page.fill('#creatorForm [name="nome"]', "Criadora Teste");
    await referral.page.fill('#creatorForm [name="whatsapp"]', "92999990000");
    await referral.page.fill('#creatorForm [name="instagram"]', "@criadora");
    await referral.page.fill('#creatorForm [name="bairro"]', "Manaus");
    await referral.page.fill('#creatorForm [name="mensagem"]', "Quero apresentar a Kombú para minha comunidade.");
    await referral.page.click('#creatorForm button[type="submit"]');
    await referral.page.waitForSelector("#creatorForm .form-status[data-state='ok']");
    assert.strictEqual(leads.at(-1).type, "criador");
    assert.strictEqual(leads.at(-1).source, "site-criadores");
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
    for (const url of ["/", "/experimente", "/revenda", "/legal", "/blog", "/blog/o-que-e-kombucha", "/blog/como-a-kombu-e-feita", "/blog/como-servir-kombucha"]) {
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

    console.log("Public regression: walk, admin overrides, partner order and escaping, both forms, menu, legal redirects, dedicated first-visit chooser and motion controls, mobile layout, blog and SEO basics passed.");
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
