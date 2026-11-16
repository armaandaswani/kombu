// Supplies never block (owner decisions of 15 and 16 November 2026). Production
// with too few supplies saves at once, with no yes/no dialog, keeps the true
// negative balance and says so in a notice on the next screen; the dashboard
// flags it until a purchase covers it. A supply that reads exactly 0 asks "is it
// really 0?" with two answers, and neither one stops any work. The stock of a
// supply can be corrected without writing a reason.
const assert = require("node:assert/strict");
const { chromium, launchOptions } = require("./browser-runtime");

const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local fixtures only");
const storageKey = "kombuAdminStateV3";
const counted = "2026-11-15T10:00:00Z";
const seed = {
  products: [{ id: "p", item: "KMB900", flavor: "Chá Teste", sizeMl: 500, retailPrice: 22, wholesalePrice: 15, status: "ativo", visible: true }],
  recipes: [{ id: "r", productId: "p", flavor: "Chá Teste", version: "v1", status: "ativa", bottleMl: 500, yieldBottles: 1, ingredients: [{ ingredientId: "tea", qty: 10, unit: "g" }], packaging: [] }],
  ingredients: [
    { id: "tea", name: "Chá preto", category: "chá", purchaseUnit: "g", stock: 100, costPerUnit: 0.03, min: 0, status: "ativo", stockCountedAt: counted },
    { id: "sugar", name: "Açúcar", category: "açúcar", purchaseUnit: "g", stock: 0, costPerUnit: 0.005, min: 0, status: "ativo", stockCountedAt: counted },
    { id: "honey", name: "Mel", category: "doce", purchaseUnit: "g", stock: 0, costPerUnit: 0.02, min: 0, status: "ativo", stockCountedAt: counted },
  ],
  packaging: [], batches: [], orders: [], sales: [], purchases: [], expenses: [], partners: [], suppliers: [], audit: [],
};

(async () => {
  const browser = await chromium.launch(launchOptions);
  try {
    for (const width of [390, 1440]) {
      for (const locale of ["pt", "en"]) {
        const T = (pt, en) => (locale === "en" ? en : pt);
        const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: locale === "en" ? "en-US" : "pt-BR" });
        await context.addInitScript(({ key, value, lang }) => {
          if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value));
          localStorage.setItem("kombuAdminLocale", lang);
        }, { key: storageKey, value: seed, lang: locale });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        // Nothing in this flow may open a dialog.
        const dialogs = [];
        page.on("dialog", (dialog) => { dialogs.push(dialog.message()); dialog.dismiss(); });
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
          await page.waitForSelector("#adminModal", { state: "hidden" });
        };

        // 12 bottles need 120 g; only 100 g recorded. It saves at once.
        await produce(12);
        assert.deepEqual(dialogs, [], "no dialog is opened before saving");
        let state = await snapshot();
        assert.equal(state.batches.length, 1, "the production was saved");
        assert.equal(state.ingredients[0].stock, -20, "the true negative balance is kept");
        const notice = page.locator("#adminContent .operator-notice.is-warn");
        await notice.waitFor();
        assert.match(await notice.innerText(), new RegExp(T("Atenção: faltou Chá preto no estoque \\(ficou -20 g\\)\\. Confira a compra ou corrija o estoque\\.", "Attention: Chá preto ran short in stock \\(now -20 g\\)\\. Check the purchase or correct the stock\\.")));
        // The message is shown once.
        await page.evaluate(() => setModule("dashboard"));
        assert.equal(await page.locator("#adminContent .operator-notice").count(), 0, "the notice does not come back");

        // The dashboard flags the negative supply.
        const alert = page.locator(".alert-item.alert-danger").filter({ hasText: "Chá preto" });
        assert.ok(await alert.isVisible(), "negative supply is flagged on the dashboard");
        assert.match(await alert.innerText(), /-20/);

        // Two supplies read 0. Each is asked about, and the question blocks nothing.
        const question = (name) => page.locator(".alert-item").filter({ hasText: new RegExp(T(`${name} está com 0\\. É 0 mesmo\\?`, `${name} is at 0\\. Is it really 0\\?`)) });
        assert.equal(await question("Açúcar").count(), 1);
        assert.equal(await question("Mel").count(), 1);
        for (const button of await page.locator(".alert-actions .btn").all()) assert.ok((await button.boundingBox()).height >= 48, "answers are easy to hit");
        await question("Açúcar").locator(`[data-action="confirm-zero-supply:ingredients:sugar"]`).click();
        assert.equal(await question("Açúcar").count(), 0, "a confirmed 0 stops asking");
        state = await snapshot();
        assert.equal(state.ingredients.find((item) => item.id === "sugar").zeroConfirmed, true);
        assert.ok(state.ingredients.find((item) => item.id === "sugar").stockCountedAt > counted, "confirming counts the item");
        await page.reload();
        await page.waitForSelector("#adminShell:not(.is-locked)");
        assert.equal(await question("Açúcar").count(), 0, "the confirmation survives a reload");

        // "Corrigir estoque" opens the adjustment on that item; no reason is asked for.
        await question("Mel").locator(`[data-action="fix-supply-stock:ingredients:honey"]`).click();
        await page.waitForSelector("#adjustForm");
        assert.equal(await page.inputValue('#adjustForm [name="stockKey"]'), "ingredients:honey", "the form opens on the item");
        assert.equal(await page.locator('#adjustForm [name="reason"]').getAttribute("required"), null, "the reason is optional");
        assert.match(await page.locator('#adjustForm [name="reason"]').evaluate((input) => input.closest("label").innerText), new RegExp(T("Motivo \\(opcional\\)", "Reason \\(optional\\)")));
        await page.fill('#adjustForm [name="stock"]', "500");
        await page.click('#adjustForm button[type="submit"]');
        await page.waitForSelector("#adminModal", { state: "hidden" });
        state = await snapshot();
        assert.equal(state.ingredients.find((item) => item.id === "honey").stock, 500);
        assert.match(state.audit[0].detail, /Mel: 0 -> 500\. Motivo: Contagem de estoque/, "an empty reason is recorded as a count");
        assert.equal(await question("Mel").count(), 0);

        // A negative supply can still be edited (the stock field has no minimum).
        await page.evaluate(() => handleAction("edit-ingredient:tea"));
        await page.waitForSelector("#editRecordForm");
        await page.fill('#editRecordForm [name="name"]', "Chá preto orgânico");
        await page.click('#editRecordForm button[type="submit"]');
        await page.waitForSelector("#adminModal", { state: "hidden" });
        state = await snapshot();
        assert.equal(state.ingredients[0].name, "Chá preto orgânico");
        assert.equal(state.ingredients[0].stock, -20);

        // Enough stock: no notice at all.
        await page.evaluate(() => { state.ingredients[0].stock = 1000; persistLocalState(); setModule("dashboard"); });
        assert.equal(await page.locator(".alert-item.alert-danger").count(), 0, "the flag clears once stock is covered");
        await produce(5);
        assert.equal(await page.locator("#adminContent .operator-notice").count(), 0, "no notice when nothing ran short");
        assert.equal((await snapshot()).ingredients[0].stock, 950);
        assert.deepEqual(dialogs, [], "no dialog was opened at any point");
        assert.deepEqual(errors, []);
        await context.close();
      }
    }
    console.log("Supply shortfall: production saves with no dialog, notice after saving, negative balance kept and flagged, zero-stock question with confirm and correct, optional reason, PT/EN passed at 390/1440px.");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
