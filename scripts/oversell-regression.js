// Selling bottles beyond stock (owner decision, 15 November 2026) through the
// real quick sale, sale and batch forms: warning, pending sale, dashboard flag,
// linking to the next batch, and the cases that must stay blocked.
const assert = require("node:assert/strict");
const { chromium, launchOptions } = require("./browser-runtime");

const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local fixtures only");
const storageKey = "kombuAdminStateV3";
const product = (id, flavor) => ({ id, item: id.toUpperCase(), flavor, sizeMl: 500, retailPrice: 20, wholesalePrice: 15, status: "ativo", visible: true });
const recipe = (id, productId, flavor) => ({ id, productId, flavor, version: "v1", status: "ativa", bottleMl: 500, yieldBottles: 1, ingredients: [], packaging: [] });
const batch = (code, productId, recipeId, flavor, actual) => ({ id: `b-${code}`, code, productId, recipeId, flavor, sizeMl: 500, actual, expected: actual, date: "2026-11-01", status: "aprovado", inventoryAdjusted: false, costSnapshot: { version: 1, costPerBottle: 4, yieldBottles: 1 } });
const seed = {
  products: [product("tea", "Chá Teste"), product("ginger", "Gengibre Teste")],
  recipes: [recipe("r-tea", "tea", "Chá Teste"), recipe("r-ginger", "ginger", "Gengibre Teste")],
  batches: [batch("G1", "ginger", "r-ginger", "Gengibre Teste", 5), batch("G2", "ginger", "r-ginger", "Gengibre Teste", 3)],
  ingredients: [], packaging: [], orders: [], sales: [], purchases: [], expenses: [], partners: [], suppliers: [], audit: [],
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
      const pending = (state) => state.sales.filter((sale) => sale.pendingBatch).reduce((sum, sale) => sum + sale.qty, 0);
      const linked = (state, code) => state.sales.filter((sale) => sale.batchCode === code).reduce((sum, sale) => sum + sale.qty, 0);
      const pickFlavor = (formId, flavor) => page.evaluate(({ formId, flavor }) => {
        const select = document.querySelector(`#${formId} [data-variant-flavor]`);
        select.value = flavor;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }, { formId, flavor });
      await page.goto(`${base}/admin.html`);
      await page.fill("#adminPassword", "local-fixture");
      await page.click('#loginForm button[type="submit"]');
      await page.waitForSelector("#adminShell:not(.is-locked)");

      // 1. A flavour with no stock can be sold; cancelling the warning saves nothing.
      await page.evaluate(() => handleAction("quick-sale"));
      await page.waitForSelector("#quickSaleForm");
      await pickFlavor("quickSaleForm", "Chá Teste");
      assert.equal(await page.inputValue("#quickSaleForm [name=batchCode]"), "");
      assert.match(await page.locator("#quickSalePreview").innerText(), /aguardando o próximo lote/);
      await page.fill("#quickSaleForm [name=qty]", "7");
      await page.click("#quickSaleForm button[type=submit]");
      assert.equal(dialogs.length, 1);
      assert.match(dialogs[0], /Não há estoque registrado de Chá Teste 500 ml/);
      assert.equal(pending(await snapshot()), 0, "cancelling records nothing");
      answer = true;
      await page.click("#quickSaleForm button[type=submit]");
      await page.waitForSelector("#adminModal", { state: "hidden" });
      let state = await snapshot();
      assert.equal(pending(state), 7);
      assert.equal(state.sales[0].unitPrice, 20, "retail price filled from the product");

      // 2. The dashboard flags it.
      await page.evaluate(() => setModule("dashboard"));
      assert.match(await page.locator(".alert-item.alert-danger").first().innerText(), /Vendido sem estoque: Chá Teste 500 ml[\s\S]*7 garrafa/);

      // 3. Registering a 10-bottle batch links the sale; 3 bottles remain free.
      await page.evaluate(() => handleAction("new-batch"));
      await page.waitForSelector("#batchForm");
      await page.locator('#batchForm [data-batch-choice][value="r-tea"]').check();
      await page.fill('#batchForm [data-batch-qty="r-tea"]', "10");
      await page.click("#batchForm button[type=submit]");
      await page.waitForSelector("#adminModal", { state: "hidden" });
      state = await snapshot();
      const teaBatch = state.batches.find((row) => row.productId === "tea");
      assert.equal(pending(state), 0);
      assert.equal(linked(state, teaBatch.code), 7);
      assert.equal(await page.evaluate((code) => batchStockBreakdown(code).physical, teaBatch.code), 3);
      await page.evaluate(() => setModule("dashboard"));
      assert.equal(await page.locator(".alert-item.alert-danger").count(), 0, "the flag clears");

      // 4. Sale form beyond the 3 left: 3 come from the batch, 2 wait.
      dialogs.length = 0;
      await page.evaluate(() => handleAction("new-sale"));
      await page.waitForSelector("#saleForm");
      await pickFlavor("saleForm", "Chá Teste");
      await page.fill("#saleForm [name=customerName]", "Café Centro");
      await page.fill("#saleForm [name=qty]", "5");
      await page.fill("#saleForm [name=discount]", "2");
      await page.click("#saleForm button[type=submit]");
      await page.waitForSelector("#adminModal", { state: "hidden" });
      assert.match(dialogs[0], /cobre 3 garrafa\(s\)\. As outras 2/);
      state = await snapshot();
      assert.equal(linked(state, teaBatch.code), 10);
      assert.equal(pending(state), 2);
      const discounts = state.sales.filter((sale) => sale.customerName === "Café Centro").map((sale) => sale.discount);
      assert.deepEqual(discounts.sort(), [0, 2], "the discount is charged once");

      // 5. Bottles still in another batch: the short batch stays blocked.
      dialogs.length = 0;
      await page.evaluate(() => handleAction("quick-sale"));
      await page.waitForSelector("#quickSaleForm");
      await pickFlavor("quickSaleForm", "Gengibre Teste");
      await page.selectOption("#quickSaleForm [name=batchCode]", "G2");
      await page.fill("#quickSaleForm [name=qty]", "4");
      await page.click("#quickSaleForm button[type=submit]");
      assert.match(dialogs[0], /Outro lote deste sabor ainda tem garrafas/);
      state = await snapshot();
      assert.equal(state.sales.filter((sale) => sale.productId === "ginger").length, 0);
      await page.evaluate(() => closeModal());

      // 6. A loss can never exceed stock.
      dialogs.length = 0;
      await page.evaluate(() => handleAction("new-sale"));
      await page.waitForSelector("#saleForm");
      await pickFlavor("saleForm", "Chá Teste");
      await page.selectOption("#saleForm [name=movementType]", "perda");
      await page.fill("#saleForm [name=customerName]", "Quebra");
      await page.fill("#saleForm [name=qty]", "1");
      await page.click("#saleForm button[type=submit]");
      assert.match(dialogs[0], /Estoque insuficiente/);
      assert.equal(pending(await snapshot()), 2);
      await page.evaluate(() => closeModal());

      // 7. Everything survives a reload.
      await page.reload();
      await page.waitForSelector("#adminShell:not(.is-locked)");
      state = await snapshot();
      assert.equal(pending(state), 2);
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("Oversell: no-stock quick sale with warning, dashboard flag, linking on the next batch, split sale with one discount, other-batch and loss blocks, reload passed at 390/1440px.");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
