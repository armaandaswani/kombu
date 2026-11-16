// Estoque → Reposição in a real browser: the tab opens, a flavor about to run
// out says "Produzir", a new flavor gets no forecast, a supply that runs out
// before the supplier can deliver says "Comprar", viewing writes nothing, the
// tab reads in English and nothing overflows at phone width.
const assert = require("node:assert/strict");
const { chromium, launchOptions } = require("./browser-runtime");

const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local fixtures only");
const storageKey = "kombuAdminStateV3";
const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toLocaleDateString("sv-SE");
};
const product = (id, flavor) => ({ id, item: id.toUpperCase(), flavor, sizeMl: 500, retailPrice: 22, wholesalePrice: 15, status: "ativo", visible: true });
const sale = (id, batchCode, productId, qty, days) => ({ id, batchCode, productId, qty, date: daysAgo(days), movementType: "venda", unitPrice: 22, discount: 0, delivery: 0, customerName: "Cliente" });
const seed = {
  products: [product("kmb901", "Gengibre Teste"), product("kmb902", "Hibisco Teste")],
  recipes: [{ id: "r", productId: "kmb901", flavor: "Gengibre Teste", version: "v1", status: "ativa", bottleMl: 500, yieldBottles: 1, ingredients: [{ ingredientId: "sugar", qty: 100, unit: "g" }], packaging: [] }],
  ingredients: [{ id: "sugar", name: "Açúcar Teste", category: "açúcar", purchaseUnit: "g", stock: 500, costPerUnit: 0.01, min: 0, supplier: "Doce Teste", status: "ativo", stockCountedAt: "2026-11-01T10:00:00Z" }],
  suppliers: [{ id: "s", name: "Doce Teste", leadTime: "10 dias", status: "ativo" }],
  batches: [
    { id: "b1", code: "G1", productId: "kmb901", recipeId: "r", flavor: "Gengibre Teste", sizeMl: 500, actual: 30, date: daysAgo(40), status: "aprovado", inventoryAdjusted: true, inventoryQty: 30 },
    { id: "b2", code: "H1", productId: "kmb902", flavor: "Hibisco Teste", sizeMl: 500, actual: 20, date: daysAgo(5), status: "aprovado" },
  ],
  sales: [sale("s1", "G1", "kmb901", 9, 30), sale("s2", "G1", "kmb901", 9, 20), sale("s3", "G1", "kmb901", 9, 10), sale("s4", "H1", "kmb902", 2, 2)],
  packaging: [], orders: [], purchases: [], expenses: [], partners: [], audit: [],
};

(async () => {
  const browser = await chromium.launch(launchOptions);
  try {
    for (const width of [390, 1440]) {
      for (const locale of ["pt", "en"]) {
        const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: locale === "en" ? "en-US" : "pt-BR" });
        await context.addInitScript(({ key, value, lang }) => {
          if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value));
          localStorage.setItem("kombuAdminLocale", lang);
        }, { key: storageKey, value: seed, lang: locale });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(`${base}/admin.html`);
        await page.fill("#adminPassword", "local-fixture");
        await page.click('#loginForm button[type="submit"]');
        await page.waitForSelector("#adminShell:not(.is-locked)");
        const before = await page.evaluate((key) => localStorage.getItem(key), storageKey);

        await page.evaluate(() => setModule("stock"));
        await page.click('[data-stock-view="replenishment"]');
        const row = (name) => page.locator("tr").filter({ hasText: name });
        const ginger = await row("Gengibre Teste").innerText();
        const hibiscus = await row("Hibisco Teste").innerText();
        const sugar = await row("Açúcar Teste").innerText();
        if (locale === "pt") {
          await page.getByRole("heading", { name: "Reposição" }).waitFor();
          // 30 made, 27 sold over 40 days: 3 left at about 4.7 a week.
          assert.match(ginger, /Produzir/);
          assert.match(hibiscus, /Histórico insuficiente/);
          assert.match(hibiscus, /menos de 4 semanas de histórico/);
          // 3,000 g used over 40 days: 500 g lasts under 10 days + a week.
          assert.match(sugar, /Comprar/);
          assert.match(sugar, /10 dias/);
        } else {
          await page.getByRole("heading", { name: "Replenishment" }).waitFor();
          assert.match(ginger, /Produce/);
          assert.match(hibiscus, /Not enough history/);
          assert.match(sugar, /Buy/);
          const leftovers = await page.evaluate(() => window.KombuLocale.misses().map((miss) => miss.text));
          assert.deepEqual(leftovers.filter((text) => /Reposição|Produzir|Comprar|semanas|histórico/i.test(text)), [], "the tab has untranslated text");
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `no horizontal scroll at ${width}px`);
        assert.equal(await page.evaluate((key) => localStorage.getItem(key), storageKey), before, "viewing the forecast writes nothing");
        assert.deepEqual(errors, []);
        if (process.env.REPLENISHMENT_SHOTS) await page.screenshot({ path: `${process.env.REPLENISHMENT_SHOTS}/reposicao-${locale}-${width}.png`, fullPage: true });
        await context.close();
      }
    }
    console.log("Replenishment: tab opens, Produzir/Comprar/insufficient history shown, English labels, no writes, no overflow and no page errors passed at 390/1440px.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
