// Production with too few supplies (owner decision, 15 November 2026): the
// operator is warned, can cancel with nothing saved, or confirm and keep the
// true negative balance, which the dashboard flags until a purchase covers it.
const assert = require("node:assert/strict");
const { chromium, launchOptions } = require("./browser-runtime");

const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local fixtures only");
const storageKey = "kombuAdminStateV3";
const seed = {
  products: [{ id: "p", item: "KMB900", flavor: "Chá Teste", sizeMl: 500, retailPrice: 22, wholesalePrice: 15, status: "ativo", visible: true }],
  recipes: [{ id: "r", productId: "p", flavor: "Chá Teste", version: "v1", status: "ativa", bottleMl: 500, yieldBottles: 1, ingredients: [{ ingredientId: "tea", qty: 10, unit: "g" }], packaging: [] }],
  ingredients: [{ id: "tea", name: "Chá preto", category: "chá", purchaseUnit: "g", stock: 100, costPerUnit: 0.03, min: 0, status: "ativo", stockCountedAt: "2026-11-15T10:00:00Z" }],
  packaging: [], batches: [], orders: [], sales: [], purchases: [], expenses: [], partners: [], suppliers: [], audit: [],
};

(async () => {
  const browser = await chromium.launch(launchOptions);
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: "pt-BR" });
      await context.addInitScript(({ key, value }) => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value)); }, { key: storageKey, value: seed });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const dialogs = [];
      let answer = false;
      page.on("dialog", (dialog) => { dialogs.push(dialog.message()); return answer ? dialog.accept() : dialog.dismiss(); });
      const snapshot = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
      await page.goto(`${base}/admin.html`);
      await page.fill("#adminPassword", "local-fixture");
      await page.click('#loginForm button[type="submit"]');
      await page.waitForSelector("#adminShell:not(.is-locked)");

      const produce = async (bottles) => {
        await page.evaluate(() => handleAction("new-batch"));
        await page.waitForSelector("#batchForm");
        await page.locator('#batchForm [data-batch-choice][value="r"]').check();
        await page.fill('#batchForm [data-batch-qty="r"]', String(bottles));
        await page.click('#batchForm button[type="submit"]');
      };

      // 12 bottles need 120 g; only 100 g recorded. Cancelling saves nothing.
      await produce(12);
      assert.equal(dialogs.length, 1, "a warning is shown before saving");
      assert.match(dialogs[0], /Faltam insumos/);
      assert.match(dialogs[0], /Chá preto: 100 g em estoque, a produção usa 120 g \(fica -20 g\)/);
      // Labels and date stamps the recipe adds are never counted, so they are not listed.
      assert.doesNotMatch(dialogs[0], /Rótulo|Datador/);
      let state = await snapshot();
      assert.equal(state.batches.length, 0);
      assert.equal(state.ingredients[0].stock, 100);
      assert.ok(await page.locator("#batchForm").isVisible(), "the form stays open to fix the quantity");

      // Confirming saves the batch and keeps the true negative balance.
      answer = true;
      await page.click('#batchForm button[type="submit"]');
      await page.waitForSelector("#adminModal", { state: "hidden" });
      state = await snapshot();
      assert.equal(state.batches.length, 1);
      assert.equal(state.ingredients[0].stock, -20);

      // The dashboard flags it.
      await page.evaluate(() => setModule("dashboard"));
      const alert = page.locator(".alert-item.alert-danger").filter({ hasText: "Chá preto" });
      assert.ok(await alert.isVisible(), "negative supply is flagged on the dashboard");
      assert.match(await alert.innerText(), /-20/);

      // A negative supply can still be edited (the stock field has no minimum).
      await page.evaluate(() => handleAction("edit-ingredient:tea"));
      await page.waitForSelector("#editRecordForm");
      await page.fill('#editRecordForm [name="name"]', "Chá preto orgânico");
      await page.click('#editRecordForm button[type="submit"]');
      await page.waitForSelector("#adminModal", { state: "hidden" });
      state = await snapshot();
      assert.equal(state.ingredients[0].name, "Chá preto orgânico");
      assert.equal(state.ingredients[0].stock, -20);

      // Enough stock: no warning at all.
      dialogs.length = 0;
      await page.evaluate(() => { state.ingredients[0].stock = 1000; persistLocalState(); setModule("dashboard"); });
      assert.equal(await page.locator(".alert-item.alert-danger").count(), 0, "the flag clears once stock is covered");
      await produce(5);
      await page.waitForSelector("#adminModal", { state: "hidden" });
      assert.equal(dialogs.length, 0);
      assert.equal((await snapshot()).ingredients[0].stock, 950);
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("Supply shortfall: warning before production, cancel saves nothing, confirm keeps the negative balance, dashboard flag and clearing passed at 390/1440px.");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
