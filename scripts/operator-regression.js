// "Modo simples" for the people who record the day's work: every task opens
// the right form, entries can be found and corrected in one tap, the screen is
// remembered on the device, and targets, focus and width hold on a phone.
const assert = require("node:assert/strict");
const { chromium, launchOptions } = require("./browser-runtime");

const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local fixtures only");
const storageKey = "kombuAdminStateV3";
const seed = {
  products: [{ id: "p", item: "KMB1", flavor: "Maracujá", sizeMl: 500, retailPrice: 22, wholesalePrice: 15, status: "ativo", visible: true }],
  recipes: [{ id: "r", productId: "p", flavor: "Maracujá", version: "v1", status: "ativa", bottleMl: 500, yieldBottles: 1, ingredients: [], packaging: [] }],
  batches: [{ id: "b1", code: "MAR-1511", productId: "p", recipeId: "r", flavor: "Maracujá", sizeMl: 500, actual: 24, expected: 24, date: "2026-11-15", status: "aprovado", responsible: "Dona Maria", inventoryAdjusted: false }],
  purchases: [{ id: "pu1", kind: "stock", date: "2026-11-14", supplier: "Mercado Boa Compra", item: "Açúcar", ingredientId: "acucar", stockCollection: "ingredients", stockItemId: "acucar", qty: 2000, unit: "g", total: 9.98, costPerUnit: 0.00499, packageCount: 2, packageSize: 1, packageUnit: "kg" }],
  sales: [{ id: "s1", date: "2026-11-13", customerName: "Café Centro", partner: "Café Centro", flavor: "Maracujá", productId: "p", batchCode: "MAR-1511", qty: 6, unitPrice: 15, movementType: "venda" }],
  ingredients: [{ id: "acucar", name: "Açúcar", category: "açúcar", purchaseUnit: "g", stock: 2000, costPerUnit: 0.00499, min: 0, status: "ativo" }],
  packaging: [], orders: [], expenses: [], partners: [], suppliers: [], audit: [],
};

(async () => {
  const browser = await chromium.launch(launchOptions);
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, locale: "pt-BR" });
      await context.addInitScript(({ key, value }) => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value)); }, { key: storageKey, value: seed });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const login = async () => {
        await page.fill("#adminPassword", "local-fixture");
        await page.click('#loginForm button[type="submit"]');
        await page.waitForSelector("#adminShell:not(.is-locked)");
      };
      const closeModal = () => page.evaluate(() => closeModal());
      await page.goto(`${base}/admin.html`);
      await login();
      assert.equal(await page.evaluate(() => currentModule), "dashboard", "the full panel is the default");

      // Entering simple mode from the menu.
      if (width < 760) await page.selectOption("#mobileModuleSelector", "operator");
      else await page.click('#adminNav [data-module="operator"]');
      await page.waitForSelector(".operator");
      assert.ok(await page.locator("#adminShell.is-simple").count());
      assert.equal(await page.locator(".admin-sidebar").isVisible(), false, "the sidebar is hidden");
      assert.equal(await page.locator("#globalSearch").isVisible(), false);
      const tasks = page.locator(".operator-task");
      assert.equal(await tasks.count(), 4);
      for (const box of await tasks.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().height))) assert.ok(box >= 80, `task height ${box}`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "no horizontal scroll");

      // Every task opens its form.
      await tasks.filter({ hasText: "Registrar produção" }).click();
      await page.waitForSelector("#batchForm");
      await closeModal();
      await tasks.filter({ hasText: "Registrar compra" }).click();
      await page.waitForSelector("[data-receipt-photo]");
      await closeModal();
      await page.click(".operator-alt .link-button");
      await page.waitForSelector("#purchaseForm");
      await closeModal();
      await tasks.filter({ hasText: "Encontrar ou corrigir" }).click();
      assert.equal(await page.evaluate(() => document.activeElement?.id), "operatorSearch", "find focuses the search box");

      // The list: newest first, searchable by name, client and date, one tap to correct.
      const entries = page.locator(".operator-entry");
      assert.deepEqual(await entries.locator("strong").allInnerTexts(), ["Maracujá 500 ml", "Açúcar", "Maracujá"]);
      await page.fill("#operatorSearch", "café centro");
      assert.equal(await entries.count(), 1);
      assert.equal(await page.evaluate(() => document.activeElement?.id), "operatorSearch", "typing keeps focus in the search box");
      await page.fill("#operatorSearch", "14/11");
      assert.deepEqual(await entries.locator("strong").allInnerTexts(), ["Açúcar"]);
      await page.fill("#operatorSearch", "nada assim");
      assert.match(await page.locator("#operatorEntries").innerText(), /Nada encontrado para "nada assim"/);
      await page.fill("#operatorSearch", "");
      await entries.filter({ hasText: "Açúcar" }).locator(".operator-fix").click();
      await page.waitForSelector("#editRecordForm");
      assert.equal(await page.inputValue('#editRecordForm [name="supplier"]'), "Mercado Boa Compra");
      await closeModal();
      await entries.filter({ hasText: "lote MAR-1511" }).locator(".operator-fix").click();
      await page.waitForSelector("#correctBatchQtyForm");
      await closeModal();
      await entries.filter({ hasText: "Café Centro" }).locator(".operator-fix").click();
      await page.waitForSelector("#editRecordForm");
      await closeModal();
      for (const box of await page.locator(".operator-fix").evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().height))) assert.ok(box >= 44, `button height ${box}`);

      // Stock opens the full screen with a way back.
      await tasks.filter({ hasText: "Ver estoque" }).click();
      await page.waitForSelector(".operator-return");
      assert.equal(await page.evaluate(() => currentModule), "stock");
      await page.click('.operator-return [data-action="operator-home"]');
      await page.waitForSelector(".operator");

      // Keyboard focus is visible on the tasks.
      await page.locator(".operator-task").first().focus();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      assert.notEqual(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), "none", "focus is visible");

      // The device remembers simple mode, and the full panel when chosen.
      await page.reload();
      await page.waitForSelector("#adminShell:not(.is-locked)");
      await page.waitForSelector(".operator");
      await page.click('[data-action="full-panel"]');
      assert.equal(await page.evaluate(() => currentModule), "dashboard");
      assert.equal(await page.locator(".operator-return").count(), 0, "no return bar once the full panel is home");
      await page.reload();
      await page.waitForSelector("#adminShell:not(.is-locked)");
      assert.equal(await page.evaluate(() => currentModule), "dashboard");
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("Operator mode: menu entry, hidden sidebar, four tasks opening their forms, search by name/client/date keeping focus, one-tap corrections, return from stock, visible focus, 44px targets, no overflow and remembered home passed at 390/1440px.");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
