// Simple mode for the people who take orders and record production, in a real
// browser: a new order with the right price for the kind of customer, a known
// partner bringing back the wholesale price, editing an order without losing
// its price or partner, the order list with late and delivered orders, and a
// production that sets bottles aside for the waiting order, then delivering
// those bottles with the proof of delivery. Every save goes
// through the same code as the full panel. Checked at phone and desktop width,
// in Portuguese and English, with large targets and no horizontal scroll.
const assert = require("node:assert/strict");
const { chromium, launchOptions } = require("./browser-runtime");

const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local fixtures only");
const storageKey = "kombuAdminStateV3";
const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("sv-SE", { timeZone: "America/Manaus" });
};
const product = (id, flavor, sizeMl, retailPrice, wholesalePrice) => ({ id, item: id.toUpperCase(), flavor, sizeMl, retailPrice, wholesalePrice, status: "ativo", visible: true });
const recipe = (id, productId, flavor, bottleMl) => ({ id, productId, flavor, version: "v1", status: "ativa", bottleMl, yieldBottles: 1, ingredients: [], packaging: [] });
const seed = {
  products: [product("mar", "Maracujá", 500, 22, 15), product("gen", "Gengibre", 500, 22, 15), product("hib", "Hibisco", 300, 16, 11)],
  recipes: [recipe("r-mar", "mar", "Maracujá", 500), recipe("r-gen", "gen", "Gengibre", 500), recipe("r-hib", "hib", "Hibisco", 300), { ...recipe("r-old", "mar", "Maracujá", 500), version: "v0", status: "arquivada" }],
  partners: [{ id: "cafe", name: "Café Centro", whatsapp: "92999990000", city: "Manaus", status: "ativo" }],
  orders: [
    { id: "late", code: "PED-1", orderDate: daysFromNow(-10), neededBy: daysFromNow(-2), status: "confirmado", paymentStatus: "aberto", clientType: "parceiro_recorrente", partnerId: "cafe", customerName: "Café Centro", businessName: "Café Centro", items: [{ key: "k1", productId: "mar", flavor: "Maracujá", sizeMl: 500, qty: 6, unitPrice: 13.5, allocations: [] }] },
    { id: "done", code: "PED-0", orderDate: daysFromNow(-30), deliveredAt: daysFromNow(-25), status: "entregue", paymentStatus: "pago", clientType: "novo_cliente", customerName: "Seu Jorge", items: [{ key: "k0", productId: "gen", flavor: "Gengibre", sizeMl: 500, qty: 2, deliveredQty: 2, unitPrice: 22, allocations: [] }] },
  ],
  batches: [], sales: [], ingredients: [], packaging: [], purchases: [], expenses: [], suppliers: [], receipts: [], audit: [],
};

(async () => {
  const browser = await chromium.launch(launchOptions);
  try {
    for (const width of [390, 1440]) {
      for (const locale of ["pt", "en"]) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, locale: locale === "en" ? "en-US" : "pt-BR" });
        await context.addInitScript(({ key, value, lang }) => {
          if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value));
          localStorage.setItem("kombuAdminLocale", lang);
          localStorage.setItem("kombuAdminHome", "operator");
        }, { key: storageKey, value: seed, lang: locale });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("dialog", (dialog) => { errors.push(`unexpected dialog: ${dialog.message()}`); dialog.dismiss(); });
        await page.goto(`${base}/admin.html`);
        await page.fill("#adminPassword", "local-fixture");
        await page.click('#loginForm button[type="submit"]');
        await page.waitForSelector(".operator");
        const shot = async (name) => {
          if (process.env.SIMPLE_SHOTS) await page.screenshot({ path: `${process.env.SIMPLE_SHOTS}/${name}-${locale}-${width}.png`, fullPage: true });
        };
        const noOverflow = async (where) => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `no horizontal scroll: ${where} at ${width}px`);
        const smallTargets = (selector) => page.evaluate((sel) => [...document.querySelectorAll(sel)]
          .filter((node) => node.offsetParent)
          .map((node) => ({ text: node.innerText || node.getAttribute("aria-label"), height: node.getBoundingClientRect().height }))
          .filter((box) => box.height < 48), selector);
        const order = (orderId) => page.evaluate((idToFind) => state.orders.find((item) => item.id === idToFind), orderId);
        const T = (pt, en) => (locale === "en" ? en : pt);
        const notice = () => page.locator(".operator-notice > span:not(.material-symbols-outlined)").innerText();

        // Home: the four everyday tasks, and the next orders with the late one flagged.
        const tasks = await page.locator(".operator-task strong").allInnerTexts();
        assert.deepEqual(tasks, locale === "en" ? ["New order", "See orders", "Record production", "Check stock"] : ["Novo pedido", "Ver pedidos", "Registrar produção", "Ver estoque"]);
        const next = page.locator(".simple-order");
        assert.equal(await next.count(), 1, "only the open order is listed on the home screen");
        assert.match(await next.innerText(), new RegExp(T("Atrasado", "Late")));
        assert.match(await next.innerText(), new RegExp(T("Faltam produzir 6 garrafas", "6 bottles still to produce")));
        assert.deepEqual(await smallTargets(".operator button"), [], "every button on the home screen is at least 48px tall");
        await noOverflow("home");
        await shot("inicio");

        // A new customer: name, price type and bottles are each asked for in turn.
        await page.locator(".operator-task").first().click();
        await page.waitForSelector("#simpleOrderForm");
        const form = page.locator("#simpleOrderForm");
        const error = form.locator(".simple-error");
        const flavor = (name) => form.locator(".simple-flavor").filter({ hasText: name });
        await form.locator(".simple-save").click();
        assert.equal(await error.innerText(), T("Escreva o nome do cliente.", "Write the customer's name."));
        await form.locator('[name="customerName"]').fill("Dona Rosa");
        await flavor("Gengibre").locator('[data-step="1"]').click();
        await form.locator(".simple-save").click();
        assert.equal(await error.innerText(), T("Escolha que preço usar.", "Choose which price to use."));
        assert.match(await form.locator(".simple-total").innerText(), new RegExp(T("Total: 1 garrafa", "Total: 1 bottle")));
        await form.locator('[name="priceType"][value="retail"]').check();
        assert.match(await flavor("Gengibre").innerText(), /22[.,]00/);
        await flavor("Gengibre").locator('[data-step="1"]').click();
        await flavor("Gengibre").locator('[data-step="1"]').click();
        await flavor("Gengibre").locator('[data-step="-1"]').click();
        await flavor("Gengibre").locator('[data-step="1"]').click();
        await flavor("Hibisco").locator("[data-qty]").fill("2");
        await flavor("Hibisco").locator("[data-qty]").dispatchEvent("change");
        // Three ginger at 22 and two 300 ml hibiscus at 16.
        assert.match(await form.locator(".simple-total").innerText(), new RegExp(`${T("Total: 5 garrafas", "Total: 5 bottles")} · R\\$\\s?98[.,]00`));
        assert.equal(await form.locator(".simple-size").count(), 2, "flavours are grouped by bottle size");
        // A radio is tapped through its whole card, so the card is measured.
        assert.deepEqual(await smallTargets("#simpleOrderForm button, #simpleOrderForm input:not([type=radio]), #simpleOrderForm .simple-choice-option"), [], "every control in the order form is at least 48px tall");
        await noOverflow("new order form");
        await shot("novo-pedido");
        await form.locator(".simple-save").click();
        await page.waitForSelector(".operator-notice");
        assert.equal(await notice(), T("Pedido de Dona Rosa salvo: 5 garrafas.", "Order for Dona Rosa saved: 5 bottles."));
        const rosa = await page.evaluate(() => state.orders.find((item) => item.customerName === "Dona Rosa"));
        assert.equal(rosa.clientType, "novo_cliente");
        assert.equal(rosa.status, "recebido");
        assert.match(rosa.code, /^PED-\d{6}-\d{2}$/);
        assert.deepEqual(rosa.items.map((item) => [item.productId, item.qty, item.unitPrice]).sort(), [["gen", 3, 22], ["hib", 2, 16]]);
        assert.equal(rosa.totalValue, 98);
        assert.doesNotMatch(await page.locator(".simple-order").filter({ hasText: "Dona Rosa" }).innerText(), new RegExp(T("Entregar até", "Deliver by")), "no deadline is shown when the customer gave none");
        await noOverflow("order list");
        await shot("pedidos");

        // A registered partner brings back the wholesale price by name.
        await page.click('[data-action="simple-new-order"]');
        await page.waitForSelector("#simpleOrderForm");
        await form.locator('[name="customerName"]').fill("café centro");
        assert.equal(await form.locator('[name="priceType"][value="wholesale"]').isChecked(), true, "a known partner picks the wholesale price");
        assert.match(await flavor("Maracujá").innerText(), /15[.,]00/);
        await page.evaluate(() => closeModal());

        // Editing keeps the negotiated price, the partner and the order's history.
        await page.locator(".simple-order").filter({ hasText: "Café Centro" }).locator(".operator-fix").click();
        await page.waitForSelector("#simpleOrderForm");
        assert.equal(await form.locator('[name="customerName"]').inputValue(), "Café Centro");
        assert.equal(await form.locator('[name="priceType"][value="wholesale"]').isChecked(), true);
        assert.equal(await flavor("Maracujá").locator("[data-qty]").inputValue(), "6");
        assert.match(await flavor("Maracujá").innerText(), /13[.,]50/, "the negotiated price is shown, not the table price");
        await flavor("Maracujá").locator('[data-step="1"]').click();
        await flavor("Maracujá").locator('[data-step="1"]').click();
        await flavor("Gengibre").locator('[data-step="1"]').click();
        await flavor("Gengibre").locator('[data-step="1"]').click();
        await shot("editar-pedido");
        await form.locator(".simple-save").click();
        await page.waitForSelector(".operator-notice");
        const late = await order("late");
        assert.equal(late.code, "PED-1");
        assert.equal(late.clientType, "parceiro_recorrente");
        assert.equal(late.partnerId, "cafe");
        assert.equal(late.status, "confirmado");
        assert.deepEqual(late.items.map((item) => [item.productId, item.qty, item.unitPrice]), [["mar", 8, 13.5], ["gen", 2, 13.5]], "new 500 ml bottles take the order's negotiated price");
        assert.equal(late.items[0].key, "k1", "the existing line keeps its identity");

        // The delivered order is listed apart and cannot be edited here.
        await page.click('[data-action="operator-orders-tab:delivered"]');
        assert.equal(await page.locator(".simple-order").count(), 1);
        assert.match(await page.locator(".simple-order").innerText(), /Seu Jorge/);
        assert.equal(await page.locator(".simple-order .operator-fix").count(), 0);
        await page.click('[data-action="operator-orders-tab:open"]');

        // Production: only active recipes, the waiting bottles shown, and the
        // new bottles set aside for the order that was waiting.
        await page.click('[data-action="operator-home"]');
        await page.locator(".operator-task").nth(2).click();
        await page.waitForSelector("#simpleBatchForm");
        const batchForm = page.locator("#simpleBatchForm");
        // The 500 ml group comes first; the 300 ml recipes the panel creates
        // automatically are listed in their own group.
        const batchRow = (name) => batchForm.locator(".simple-flavor-list").first().locator(".simple-flavor").filter({ hasText: name });
        assert.equal(await batchRow("Maracujá").count(), 1, "an archived recipe is not offered");
        assert.match(await batchRow("Maracujá").innerText(), new RegExp(T("Pedidos esperando: 8 garrafas", "Orders waiting: 8 bottles")));
        await batchForm.locator('[name="responsible"]').fill("");
        await batchRow("Maracujá").locator("[data-qty]").fill("10");
        await batchRow("Maracujá").locator("[data-qty]").dispatchEvent("change");
        await batchForm.locator(".simple-save").click();
        assert.equal(await batchForm.locator(".simple-error").innerText(), T("Escreva seu nome.", "Write your name."));
        await batchForm.locator('[name="responsible"]').fill("Dona Maria");
        assert.equal(await batchForm.locator(".simple-error").isHidden(), true, "the message goes away once answered");
        assert.deepEqual(await smallTargets("#simpleBatchForm button, #simpleBatchForm input"), [], "every control in the production form is at least 48px tall");
        await noOverflow("production form");
        await shot("producao");
        await batchForm.locator(".simple-save").click();
        await page.waitForSelector(".operator-notice");
        assert.equal(await notice(), T("Produção salva: 10 garrafas. 8 garrafas já separadas para pedidos.", "Production saved: 10 bottles. 8 bottles already set aside for orders."));
        const batch = await page.evaluate(() => state.batches[0]);
        assert.deepEqual([batch.recipeId, batch.actual, batch.responsible, batch.status], ["r-mar", 10, "Dona Maria", "aprovado"]);
        const afterProduction = await order("late");
        assert.equal(afterProduction.items[0].allocations.reduce((sum, allocation) => sum + allocation.qty, 0), 8);
        assert.match(await page.locator(".simple-order").filter({ hasText: "Café Centro" }).innerText(), new RegExp(T("Faltam produzir 2 garrafas \\(8 garrafas já separadas\\)", "2 bottles still to produce \\(8 bottles already set aside\\)")));

        // Delivery: the 8 bottles set aside go out, the 2 not yet produced stay
        // on the order, and the proof of delivery can be downloaded.
        const cafe = () => page.locator(".simple-order").filter({ hasText: "Café Centro" });
        assert.equal(await page.locator(".simple-order").filter({ hasText: "Dona Rosa" }).locator('[data-action^="simple-deliver"]').count(), 0, "nothing to deliver without bottles set aside");
        await cafe().locator('[data-action^="simple-deliver"]').click();
        await page.waitForSelector("#simpleDeliveryForm");
        const delivery = page.locator("#simpleDeliveryForm");
        const deliveryRow = delivery.locator(".simple-flavor");
        assert.equal(await deliveryRow.count(), 1, "only flavours with bottles ready are offered");
        assert.equal(await deliveryRow.locator("[data-qty]").inputValue(), "8");
        await deliveryRow.locator('[data-step="1"]').click();
        assert.equal(await deliveryRow.locator("[data-qty]").inputValue(), "8", "no more than the bottles set aside");
        assert.match(await delivery.innerText(), new RegExp(T("Ficam para uma próxima entrega: 2 garrafas", "Left for a later delivery: 2 bottles")));
        assert.equal(await delivery.locator('[name="paymentMethod"]:checked').inputValue(), "Prazo – 15 dias corridos após a entrega", "the panel's default way to pay is preselected");
        assert.match(await delivery.locator(".simple-total").innerText(), /R\$\s?108[.,]00/);
        await delivery.locator('[name="paymentMethod"][value="Pix"]').check();
        assert.deepEqual(await smallTargets("#simpleDeliveryForm button, #simpleDeliveryForm input:not([type=radio]), #simpleDeliveryForm .simple-choice-option"), [], "every control in the delivery form is at least 48px tall");
        await noOverflow("delivery form");
        await shot("entrega");
        await delivery.locator(".simple-save").click();
        await page.waitForSelector(".operator-notice");
        assert.equal(await notice(), T("Entrega registrada: 8 garrafas para Café Centro. Ainda faltam 2 garrafas.", "Delivery recorded: 8 bottles for Café Centro. 2 bottles still to go."));
        const delivered = await order("late");
        assert.equal(delivered.deliveries.length, 1);
        assert.deepEqual([delivered.deliveries[0].totalQty, delivered.deliveries[0].paymentMethod, delivered.deliveries[0].total], [8, "Pix", 108]);
        assert.equal(delivered.items[0].deliveredQty, 8);
        assert.equal(delivered.status, "confirmado", "the order stays open for the 2 bottles still owed");
        const sold = await page.evaluate(() => state.sales.filter((sale) => sale.orderId === "late"));
        assert.equal(sold.reduce((sum, sale) => sum + Number(sale.qty || 0), 0), 8, "the delivery becomes sales");
        assert.equal(await cafe().locator('[data-action^="simple-deliver"]').count(), 0, "nothing left set aside to deliver");
        assert.match(await cafe().innerText(), new RegExp(T("8 garrafas já entregues", "8 bottles already delivered")), "the card says what was already delivered");
        const download = page.waitForEvent("download");
        await page.click('.operator-notice [data-action^="delivery-proof-reprint"]');
        assert.match((await download).suggestedFilename(), /\.pdf$/);
        await noOverflow("after delivery");
        await shot("entregue");

        // Editing the order now cannot go below the bottles already delivered.
        await cafe().locator('[data-action^="simple-edit-order"]').click();
        await page.waitForSelector("#simpleOrderForm");
        const passion = flavor("Maracujá").first();
        for (let press = 0; press < 3; press += 1) await passion.locator('[data-step="-1"]').click();
        assert.equal(await passion.locator("[data-qty]").inputValue(), "8");
        assert.match(await passion.innerText(), new RegExp(T("8 garrafas já entregues", "8 bottles already delivered")));

        // Correcting the contact's name keeps the order with its partner and
        // creates no second partner.
        for (let press = 0; press < 2; press += 1) await passion.locator('[data-step="1"]').click();
        await form.locator('[name="customerName"]').fill("Seu Paulo");
        await form.locator(".simple-save").click();
        await page.waitForSelector(".operator-notice");
        const renamed = await order("late");
        assert.deepEqual([renamed.customerName, renamed.clientType, renamed.partnerId, renamed.businessName], ["Seu Paulo", "parceiro_recorrente", "cafe", "Café Centro"]);
        assert.equal(await page.evaluate(() => state.partners.length), 1, "a rename does not create a partner");

        // A new price type applies to the bottles still owed. The 8 delivered
        // were sold at the negotiated price, so their line keeps it.
        await cafe().locator('[data-action^="simple-edit-order"]').click();
        await page.waitForSelector("#simpleOrderForm");
        await form.locator('[name="priceType"][value="retail"]').check();
        assert.match(await form.locator(".simple-total").innerText(), /R\$\s?196[.,]00/, "the total shown is what will be saved");
        await form.locator(".simple-save").click();
        await page.waitForSelector(".operator-notice");
        const repriced = await order("late");
        assert.equal(repriced.clientType, "novo_cliente");
        assert.deepEqual(repriced.items.map((item) => [item.productId, item.qty, item.unitPrice, item.deliveredQty]), [["mar", 8, 13.5, 8], ["mar", 2, 22, 0], ["gen", 2, 22, 0]]);
        assert.equal(repriced.items[0].key, "k1", "the delivered line keeps the key its delivery points at");
        assert.equal(await page.evaluate(() => orderTotal(state.orders.find((item) => item.id === "late"))), 196);

        // Cutting the order to what was delivered closes it on the delivery's
        // dates, not on the day it was edited.
        await cafe().locator('[data-action^="simple-edit-order"]').click();
        await page.waitForSelector("#simpleOrderForm");
        await passion.locator("[data-qty]").fill("0");
        await passion.locator("[data-qty]").dispatchEvent("change");
        await flavor("Gengibre").locator("[data-qty]").fill("0");
        await flavor("Gengibre").locator("[data-qty]").dispatchEvent("change");
        await form.locator(".simple-save").click();
        await page.waitForSelector(".operator-notice");
        const closed = await order("late");
        assert.equal(closed.status, "entregue");
        assert.deepEqual([closed.deliveredAt, closed.paymentDueDate], [closed.deliveries[0].deliveredAt, closed.deliveries[0].paymentDueDate]);

        if (locale === "en") {
          // Names and amounts are data; any other leftover is interface text.
          const data = new Set(["Café Centro", "Café Centro)", "Seu Paulo", "Dona Rosa", "Seu Jorge", "Gengibre", "Hibisco", "Maracujá"]);
          const leftovers = await page.evaluate(() => window.KombuLocale.misses().map((miss) => miss.text));
          assert.deepEqual(leftovers.filter((text) => !data.has(text) && !/^R\$\s?[\d.,]+$/.test(text)), [], "simple mode has untranslated text");
        }
        // The full panel's new order starts unpaid, as simple mode's does.
        // Checked after the translation check, which covers simple mode only.
        await page.evaluate(() => orderForm());
        assert.equal(await page.locator('#orderForm [name="paymentStatus"]').inputValue(), "aberto");
        await page.evaluate(() => closeModal());
        assert.deepEqual(errors, []);
        await context.close();
      }
    }
    console.log("Simple orders: new order priced by customer type, known partner wholesale, edit keeping price/partner/history, delivered list, production reserving for the waiting order, delivery of the set-aside bottles with sales and proof PDF, rename keeping the partner, repricing only undelivered bottles, closing on the delivery's dates, full-panel new order unpaid, 48px targets, PT/EN and no overflow passed at 390/1440px.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
