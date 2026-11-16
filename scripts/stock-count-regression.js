// "Contar garrafas" in a real browser (owner request, 16 November 2026): from
// the Estoque page and from simple mode, one stepper per flavour prefilled with
// what the system believes is on the shelf. Changing a number and saving is the
// whole job: more bottles enter as production by the recipe (supplies and cost
// follow), fewer are a loss taken from the oldest batch and, if reserved, from
// the order needed latest. Bottles sold before any batch existed are covered by
// an entry. No reason is asked for and no dialog is opened. Checked at phone and
// desktop width, in Portuguese and English.
const assert = require("node:assert/strict");
const { chromium, launchOptions } = require("./browser-runtime");

const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local fixtures only");
const storageKey = "kombuAdminStateV3";
const product = (id, item, flavor) => ({ id, item, flavor, sizeMl: 500, retailPrice: 22, wholesalePrice: 15, status: "ativo", visible: true });
const batch = (code, productId, recipeId, flavor, actual, date) => ({ id: `b-${code}`, code, productId, recipeId, flavor, sizeMl: 500, actual, expected: actual, date, status: "aprovado", inventoryAdjusted: Boolean(recipeId), inventoryQty: actual, costSnapshot: { costPerBottle: 2, yieldBottles: 1, total: 2, ingredientCost: 2 } });
const order = (id, customer, due, qty, allocations, createdAt) => ({ id, code: id.toUpperCase(), status: "confirmado", orderDate: "2026-11-01", neededBy: due, createdAt, customerName: customer, clientType: "novo_cliente", paymentStatus: "aberto", items: [{ key: `k-${id}`, productId: "tea", flavor: "Chá Teste", sizeMl: 500, qty, unitPrice: 22, allocations }] });
const seed = {
  products: [product("tea", "KMB901", "Chá Teste"), product("gen", "KMB902", "Gengibre"), product("lim", "KMB903", "Lima")],
  recipes: [
    { id: "r-tea", productId: "tea", flavor: "Chá Teste", version: "v1", status: "ativa", bottleMl: 500, yieldBottles: 1, ingredients: [{ ingredientId: "leaf", qty: 10, unit: "g" }], packaging: [] },
    { id: "r-gen", productId: "gen", flavor: "Gengibre", version: "v1", status: "ativa", bottleMl: 500, yieldBottles: 1, ingredients: [{ ingredientId: "leaf", qty: 5, unit: "g" }], packaging: [] },
  ],
  ingredients: [{ id: "leaf", name: "Folha", category: "chá", purchaseUnit: "g", stock: 1000, costPerUnit: 0.05, min: 0, status: "ativo", stockCountedAt: "2026-11-01T10:00:00Z" }],
  // Chá Teste: 2 on the shelf in T-1 (both reserved for Dona Rosa) and 6 in T-2
  // (4 reserved for Café Centro). Gengibre: 4 recorded, 1 already sold before any
  // batch existed. Lima has no recipe.
  batches: [batch("T-1", "tea", "r-tea", "Chá Teste", 3, "2026-10-01"), batch("T-2", "tea", "r-tea", "Chá Teste", 6, "2026-11-01"), batch("G-1", "gen", "r-gen", "Gengibre", 4, "2026-11-02"), batch("L-1", "lim", "", "Lima", 2, "2026-11-03")],
  sales: [
    { id: "s1", date: "2026-01-05", batchCode: "T-1", productId: "tea", flavor: "Chá Teste", qty: 1, unitPrice: 22, movementType: "venda", customerName: "Ana", partner: "Ana" },
    { id: "s2", date: "2026-11-10", batchCode: "", pendingBatch: true, productId: "gen", flavor: "Gengibre", qty: 1, unitPrice: 22, discount: 0, delivery: 0, movementType: "venda", priceType: "varejo", customerName: "Ana", partner: "Ana" },
  ],
  orders: [order("o-old", "Café Centro", "2026-11-20", 4, [{ batchCode: "T-2", qty: 4 }], "2026-11-01T10:00:00Z"), order("o-new", "Dona Rosa", "2026-12-20", 2, [{ batchCode: "T-1", qty: 2 }], "2026-11-05T10:00:00Z")],
  packaging: [], purchases: [], expenses: [], partners: [], suppliers: [], receipts: [], audit: [],
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
        const dialogs = [];
        page.on("dialog", (dialog) => { dialogs.push(dialog.message()); dialog.dismiss(); });
        const snapshot = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
        const shot = async (name) => {
          if (process.env.COUNT_SHOTS) await page.screenshot({ path: `${process.env.COUNT_SHOTS}/${name}-${locale}-${width}.png`, fullPage: true });
        };
        const noOverflow = async (where) => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `no horizontal scroll: ${where} at ${width}px`);
        const smallTargets = (selector) => page.evaluate((sel) => [...document.querySelectorAll(sel)]
          .filter((node) => node.offsetParent)
          .map((node) => ({ text: node.innerText || node.getAttribute("aria-label"), height: node.getBoundingClientRect().height }))
          .filter((box) => box.height < 48), selector);
        await page.goto(`${base}/admin.html`);
        await page.fill("#adminPassword", "local-fixture");
        await page.click('#loginForm button[type="submit"]');
        await page.waitForSelector("#adminShell:not(.is-locked)");

        const form = page.locator("#bottleCountForm");
        const row = (name) => form.locator(".simple-flavor").filter({ hasText: name });
        const set = async (name, value) => {
          await row(name).locator("[data-qty]").fill(String(value));
          await row(name).locator("[data-qty]").dispatchEvent("change");
        };
        const notices = () => page.locator("#adminContent .operator-notice > span:not(.material-symbols-outlined)").allInnerTexts();

        // ---- From the Estoque page ----
        await page.evaluate(() => setModule("stock"));
        assert.equal(await page.locator('[data-action="count-bottles"]').first().innerText().then((text) => text.replace(/\s+/g, " ").trim().replace(/^\S+ /, "")), T("Contar garrafas", "Count bottles"));
        await page.locator('[data-action="count-bottles"]').first().click();
        await form.waitFor();
        assert.equal(await row("Chá Teste").locator("[data-qty]").inputValue(), "8", "prefilled with the 8 the system believes are on the shelf");
        assert.equal(await row("Gengibre").locator("[data-qty]").inputValue(), "3", "the bottle already sold before any batch is not on the shelf");
        assert.equal(await row("Lima").locator("[data-qty]").inputValue(), "2");
        assert.match(await row("Chá Teste").innerText(), new RegExp(T("No sistema: 8 garrafas", "In the system: 8 bottles")));
        assert.equal(await form.locator('[name="reason"]').count(), 0, "no reason is asked for");
        assert.match(await form.locator(".simple-total").innerText(), new RegExp(T("Nenhuma contagem mudou ainda\\.", "No count has changed yet\\.")));

        // A flavour with no active recipe can be reduced but not increased.
        await row("Lima").locator('[data-step="1"]').click();
        assert.equal(await row("Lima").locator("[data-qty]").inputValue(), "2", "no entry without a recipe, so no invented cost");
        assert.match(await row("Lima").innerText(), new RegExp(T("Sem receita ativa: só dá para diminuir\\.", "No active recipe: you can only reduce\\.")));

        // Nothing changed: saving says so and writes nothing.
        const before = JSON.stringify(await snapshot());
        await form.locator(".simple-save").click();
        assert.equal(await form.locator(".simple-error").innerText(), T("Nenhuma contagem mudou.", "No count has changed."));
        assert.equal(JSON.stringify(await snapshot()), before);

        // Chá Teste: counted 4 of 8 (4 lost). Gengibre: counted 6 of 3 (3 enter).
        await set("Chá Teste", 4);
        await set("Gengibre", 6);
        assert.match(await row("Chá Teste").innerText(), new RegExp(T("4 garrafas viram perda", "4 bottles become a loss")));
        assert.match(await row("Gengibre").innerText(), new RegExp(T("Entram 3 garrafas", "3 bottles enter")));
        assert.match(await form.locator(".simple-total").innerText(), new RegExp(T("2 sabores mudam\\.", "2 flavours change\\.")));
        assert.deepEqual(await smallTargets("#bottleCountForm button, #bottleCountForm input"), [], "every control in the count screen is at least 48px tall");
        await noOverflow("count screen");
        await shot("contagem");
        await form.locator(".simple-save").click();
        await page.waitForSelector("#adminModal", { state: "hidden" });
        assert.deepEqual(dialogs, [], "saving a count opens no dialog");

        const messages = await notices();
        assert.ok(messages.includes(T("Chá Teste 500 ml: 8 → 4, 4 perdidas.", "Chá Teste 500 ml: 8 → 4, 4 lost.")), `loss message in ${JSON.stringify(messages)}`);
        assert.ok(messages.includes(T("Gengibre 500 ml: 3 → 6, entraram 3 garrafas.", "Gengibre 500 ml: 3 → 6, 3 bottles entered.")), `entry message in ${JSON.stringify(messages)}`);
        assert.ok(messages.includes(T("Reserva retirada: Dona Rosa (2).", "Reservation taken: Dona Rosa (2).")), `reservation message in ${JSON.stringify(messages)}`);
        await noOverflow("after the count");
        await shot("contado");

        let state = await snapshot();
        const losses = state.sales.filter((sale) => sale.movementType === "perda").map((sale) => [sale.batchCode, sale.qty]).sort();
        assert.deepEqual(losses, [["T-1", 2], ["T-2", 2]], "the loss is spread oldest batch first");
        assert.ok(state.sales.filter((sale) => sale.movementType === "perda").every((sale) => sale.unitPrice === 0 && sale.customerName === "Ajuste de estoque" && /Contagem de estoque: sistema 8, contado 4/.test(sale.note)));
        const entry = state.batches.find((item) => item.source === "ajuste");
        // The panel adds its standard packaging to every recipe on load, so the
        // whole cost is the recipe's; the leaf part is 5 g x 0.05.
        const recipeCostNow = await page.evaluate(() => recipeCost(byId("recipes", "r-gen")).costPerBottle);
        assert.deepEqual([entry.productId, entry.actual, entry.recipeId, entry.costSnapshot.ingredientCost, entry.costSnapshot.costPerBottle], ["gen", 3, "r-gen", 0.25, recipeCostNow], "the entry is a batch made by the recipe, with its cost frozen");
        assert.equal(state.ingredients[0].stock, 985, "the entry took 3 x 5 g of leaf; the loss took none");
        assert.equal(state.sales.filter((sale) => sale.pendingBatch).length, 0, "the entry covered the bottle sold before any batch existed");
        const held = (code) => page.evaluate((batchCode) => reservedFromBatch(batchCode), code);
        assert.equal(await held("T-1"), 0, "Dona Rosa, needed latest, gave up her bottles");
        assert.equal(await held("T-2"), 4, "Café Centro keeps its bottles");
        assert.ok(await page.evaluate(() => finishedStockRows().every((stockRow) => reservedFromBatch(stockRow.code) <= batchProducedQuantity(stockRow) - soldFromBatch(stockRow.code))), "no batch has more bottles reserved than it holds");
        assert.equal(await page.evaluate(() => expectedBottles("tea")), 4);
        assert.equal(await page.evaluate(() => expectedBottles("gen")), 6);

        // ---- From simple mode ----
        await page.evaluate(() => { operatorView = "home"; setModule("operator"); });
        await page.waitForSelector(".operator");
        assert.match(await page.locator(".operator-more").innerText(), new RegExp(T("Contar o estoque", "Count the stock")));
        await page.locator('.operator-more [data-action="count-bottles"]').click();
        await form.waitFor();
        assert.equal(await row("Chá Teste").locator("[data-qty]").inputValue(), "4");
        assert.equal(await row("Gengibre").locator("[data-qty]").inputValue(), "6");
        await row("Chá Teste").locator('[data-step="1"]').click();
        await row("Gengibre").locator('[data-step="-1"]').click();
        assert.deepEqual(await smallTargets("#bottleCountForm button, #bottleCountForm input"), [], "every control is large in simple mode");
        await noOverflow("count screen in simple mode");
        await shot("contagem-simples");
        await form.locator(".simple-save").click();
        await page.waitForSelector("#adminModal", { state: "hidden" });
        await page.waitForSelector(".operator-notice");
        const simpleMessages = await page.locator(".operator-notice > span:not(.material-symbols-outlined)").allInnerTexts();
        assert.equal(simpleMessages[0], T("Contagem salva.", "Count saved."));
        assert.ok(simpleMessages.includes(T("Chá Teste 500 ml: 4 → 5, entrou 1 garrafa.", "Chá Teste 500 ml: 4 → 5, 1 bottle entered.")), JSON.stringify(simpleMessages));
        assert.ok(simpleMessages.includes(T("Gengibre 500 ml: 6 → 5, 1 perdida.", "Gengibre 500 ml: 6 → 5, 1 lost.")), JSON.stringify(simpleMessages));
        await noOverflow("simple mode after the count");
        await shot("contado-simples");
        state = await snapshot();
        assert.equal(state.ingredients[0].stock, 975, "the second entry took 10 g of leaf");
        assert.equal(state.batches.filter((item) => item.source === "ajuste").length, 2);
        assert.equal(state.audit.filter((item) => item.action === "Contagem de estoque").length, 4, "every change is in the history");

        if (locale === "en") {
          // Batch codes, names and dates are data, and the Estoque page has older
          // fragments with reservations that this suite does not own. What this
          // suite owns is the count text: nothing that talks about a count, a
          // loss, an entry or a recipe may stay Portuguese.
          const leftovers = await page.evaluate(() => window.KombuLocale.misses().map((miss) => miss.text));
          const countText = /contagem|contar|contou|garrafa|perdid|perda|entra|receita|sistema|sabor|reserva|insumo|mesmo|diminuir|prateleira|salvar/i;
          assert.deepEqual(leftovers.filter((text) => countText.test(text)), [], "the count screens have untranslated text");
        }
        assert.deepEqual(dialogs, [], "no dialog was opened at any point");
        assert.deepEqual(errors, []);
        await context.close();
      }
    }
    console.log("Stock count: Estoque and simple mode, prefilled steppers, entry by recipe with supplies and cost, loss oldest batch first, reserved bottles from the newest order, bottle sold without stock covered, no recipe, no reason, no dialog, 48px targets, PT/EN and no overflow passed at 390/1440px.");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
