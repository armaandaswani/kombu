// Weighted average cost through the real purchase and ingredient forms:
// record a purchase, edit it, rename the ingredient, delete the purchase.
const assert = require("node:assert/strict");
const { chromium, launchOptions } = require("./browser-runtime");

const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local fixtures only");
const storageKey = "kombuAdminStateV3";
const seed = {
  products: [], recipes: [], batches: [], orders: [], sales: [], purchases: [], expenses: [], partners: [], packaging: [], audit: [],
  suppliers: [{ id: "sup", name: "Fornecedor Chá", status: "ativo" }],
  ingredients: [{ id: "tea", name: "Chá preto", category: "chá", purchaseUnit: "g", stock: 1000, costPerUnit: 0.025, packageCount: 1, packageSize: 1000, packageUnit: "g", packageTotal: 25, min: 0, status: "ativo" }],
};
const tea = (state) => state.ingredients.find((item) => item.id === "tea");
const close = (actual, expected, label) => assert.ok(Math.abs(actual - expected) < 1e-9, `${label}: expected ${expected}, got ${actual}`);

(async () => {
  const browser = await chromium.launch(launchOptions);
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: "pt-BR" });
      await context.addInitScript(({ key, value }) => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value)); }, { key: storageKey, value: seed });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("dialog", (dialog) => dialog.accept());
      const snapshot = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
      const action = (name) => page.evaluate((value) => handleAction(value), name);
      await page.goto(`${base}/admin.html`);
      await page.fill("#adminPassword", "local-fixture");
      await page.click('#loginForm button[type="submit"]');
      await page.waitForSelector("#adminShell:not(.is-locked)");

      // 1000 g at R$ 0.025 on hand; buying 1000 g for R$ 35 averages to 0.030.
      await action("new-purchase");
      await page.waitForSelector("#purchaseForm");
      await page.evaluate(() => {
        const form = document.querySelector("#purchaseForm");
        form.elements.itemMode.value = "existing";
        form.elements.itemMode.dispatchEvent(new Event("change", { bubbles: true }));
        form.elements.stockKey.value = "ingredients:tea";
        form.elements.stockKey.dispatchEvent(new Event("change", { bubbles: true }));
      });
      await page.fill('#purchaseForm [name="packageCount"]', "1");
      await page.fill('#purchaseForm [name="packageSize"]', "1000");
      await page.selectOption('#purchaseForm [name="packageUnit"]', "g");
      await page.fill('#purchaseForm [name="total"]', "35");
      await page.click('#purchaseForm button[type="submit"]');
      await page.waitForSelector("#adminModal", { state: "hidden" });
      let state = await snapshot();
      assert.equal(tea(state).stock, 2000);
      close(tea(state).costPerUnit, 0.03, "after purchase");
      const purchaseId = state.purchases[0].id;
      assert.ok(state.audit.some((entry) => /custo médio agora/.test(entry.detail || entry.details || entry.description || JSON.stringify(entry))), "audit records the new average");

      // Editing the total to R$ 45 takes the R$ 35 purchase out (back to 1000 g
      // at 0.025) and receives 1000 g at 0.045: average 0.035.
      await action(`edit-purchase:${purchaseId}`);
      await page.waitForSelector("#editRecordForm");
      await page.fill('#editRecordForm [name="total"]', "45");
      await page.click('#editRecordForm button[type="submit"]');
      await page.waitForSelector("#adminModal", { state: "hidden" });
      state = await snapshot();
      assert.equal(tea(state).stock, 2000);
      close(tea(state).costPerUnit, 0.035, "after editing the purchase");

      // Renaming the ingredient must not recompute its cost from the package.
      await action("edit-ingredient:tea");
      await page.waitForSelector("#editRecordForm");
      await page.fill('#editRecordForm [name="name"]', "Chá preto orgânico");
      await page.click('#editRecordForm button[type="submit"]');
      await page.waitForSelector("#adminModal", { state: "hidden" });
      state = await snapshot();
      assert.equal(tea(state).name, "Chá preto orgânico");
      close(tea(state).costPerUnit, 0.035, "after renaming the ingredient");

      // Deleting the purchase removes 1000 g at 0.045: 1000 g at 0.025 remain.
      await action(`delete-purchase:${purchaseId}`);
      state = await snapshot();
      assert.equal(state.purchases.length, 0);
      assert.equal(tea(state).stock, 1000);
      close(tea(state).costPerUnit, 0.025, "after deleting the purchase");

      // The values survive a reload.
      await page.reload();
      await page.waitForSelector("#adminShell:not(.is-locked)");
      state = await snapshot();
      close(tea(state).costPerUnit, 0.025, "after reload");
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("Purchase cost: weighted average through the purchase form, purchase edit, ingredient rename, purchase deletion and reload passed at 390/1440px.");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
