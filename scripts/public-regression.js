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

async function newPage(browser, leads, { firstVisit = false } = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "pt-BR", reducedMotion: "no-preference" });
  if (!firstVisit) await context.addInitScript(() => localStorage.setItem("kombuAudience", "consumo"));
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/api/public-state", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, state }) }));
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
    await page.evaluate(() => window.scrollTo(0, 0));
    assert.strictEqual(await page.evaluate(() => document.querySelector(".walk-stage .btn") && getComputedStyle(document.querySelector(".walk-stage .btn")).backgroundColor !== getComputedStyle(document.querySelector(".walk-stage")).backgroundColor), true, "the stage button is not the colour of the stage");

    // Admin overrides still apply.
    assert.strictEqual(await page.locator("#heroSub").innerText(), "Kombucha artesanal da Amazônia.");
    assert.ok((await page.locator("#flavorList").innerText()).includes("Ângulo vindo do admin."), "an admin description wins over the default");

    // Partners: Solar Café last, flavour names normalised, markup escaped.
    const names = await page.locator(".partner h3").allInnerTexts();
    assert.strictEqual(names.at(-1), "Solar Café Regional", "Solar Café is listed after everyone else");
    assert.ok(names.some((n) => n.includes("<img")), "a partner name containing markup is shown as text");
    assert.strictEqual(await page.evaluate(() => window.__xss), undefined, "partner data is never executed");
    const divina = page.locator(".partner", { hasText: "Divina Terra" });
    assert.ok((await divina.innerText()).includes("Maçã & Canela"), "hand-typed flavour names are shown canonically");
    assert.ok((await divina.innerText()).includes("Flor Fada Azul & Blueberry"));
    assert.ok((await divina.locator('a:has-text("Ver rota")').getAttribute("href")).startsWith("https://www.google.com/maps/search/"));
    assert.strictEqual(await divina.locator('a[href*="instagram.com/divinaterramanaus"]').count(), 1);

    // WhatsApp links use the number set in the admin.
    assert.ok((await page.locator("[data-whatsapp]").first().getAttribute("href")).includes("phone=5592992097165"));

    // Ordering direct is one tap away: hero button, "Pedir este sabor" prefills the flavour,
    // and on a phone a floating button appears once the hero is out of view.
    assert.strictEqual(await page.locator('.hero .btn[href="#comprar"]').count(), 1, "the hero offers ordering direct");
    assert.ok(await page.evaluate(() => document.querySelector("#comprar").compareDocumentPosition(document.querySelector("#sabores")) & Node.DOCUMENT_POSITION_FOLLOWING), "ordering comes before the flavour walk");
    await page.evaluate(() => { const el = document.querySelectorAll(".walk-step")[4]; window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + 20); });
    await page.waitForFunction(() => document.querySelector(".walk-count").textContent.startsWith("05"));
    const onStage = (await page.locator(".walk-name").innerText()).trim();
    await page.locator(".walk-order").evaluate((a) => a.click());
    assert.strictEqual(await page.inputValue("#order-mensagem"), onStage, "Pedir este sabor fills in the flavour on screen");
    await page.fill("#order-mensagem", "");
    await page.evaluate(() => window.scrollTo(0, document.querySelector("#onde").getBoundingClientRect().top + window.scrollY + 300));
    await page.waitForFunction(() => !document.querySelector(".order-fab").classList.contains("is-away"));
    assert.ok(await page.locator(".order-fab").isVisible(), "the floating order button shows mid-page on a phone");

    // Direct order form → /api/lead as a "contato" tagged as a 20+ order.
    await page.fill("#order-nome", "Teste Público");
    await page.fill("#order-whatsapp", "92 99999-0000");
    await page.fill("#order-mensagem", "10 Maracujá");
    await page.click('#orderForm button[type="submit"]');
    await page.waitForSelector("#orderForm .form-status:not([hidden])");
    assert.strictEqual(leads.at(-1).type, "contato");
    assert.ok(leads.at(-1).message.startsWith("Pedido direto (20+ garrafas):"), "the order is recognisable in the CRM");

    // Mobile menu (the header hides while scrolling down, so come back to the top first).
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => !document.querySelector(".site-header").classList.contains("is-hidden"));
    await page.click(".menu-btn");
    assert.ok((await page.locator(".nav .audience").innerText()).includes("Para consumo próprio"));
    assert.ok((await page.locator(".nav .audience").innerText()).includes("Para revenda"));
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

    // ---------------------------------------------------------------- first-visit chooser
    const first = await newPage(browser, leads, { firstVisit: true });
    await first.page.goto(`${baseUrl}/`);
    await first.page.waitForSelector("#audienceChooser[open]");
    await first.page.keyboard.press("Escape");
    assert.ok(!(await first.page.locator("#audienceChooser").evaluate((d) => d.open)), "Escape closes the chooser");
    await first.page.reload();
    await first.page.waitForFunction(() => document.querySelectorAll(".walk-step").length > 0);
    assert.ok(!(await first.page.locator("#audienceChooser").evaluate((d) => d.open)), "closing it once is remembered");

    const resale = await newPage(browser, leads, { firstVisit: true });
    await resale.page.goto(`${baseUrl}/`);
    await resale.page.waitForSelector("#audienceChooser[open]");
    await resale.page.click('#audienceChooser [data-choice="revenda"]');
    await resale.page.waitForURL(/\/revenda(\.html)?$/);

    const deep = await newPage(browser, leads, { firstVisit: true });
    await deep.page.goto(`${baseUrl}/#onde`);
    await deep.page.waitForFunction(() => document.querySelectorAll(".partner").length > 0);
    assert.ok(!(await deep.page.locator("#audienceChooser").evaluate((d) => d.open)), "a direct link is not interrupted");

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

    // ---------------------------------------------------------------- blog and SEO
    const blog = await newPage(browser, leads);
    for (const url of ["/", "/revenda", "/legal", "/blog", "/blog/o-que-e-kombucha", "/blog/como-a-kombu-e-feita", "/blog/como-servir-kombucha"]) {
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

    console.log("Public regression: walk, admin overrides, partner order and escaping, both forms, menu, legal redirects, first-visit chooser, mobile layout, blog and SEO basics passed.");
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
