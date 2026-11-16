// "Encerrar pedidos antigos" in a real browser ("só fechar", owner decision of 16
// November 2026): a preview, a typed word, and then every order that is not
// cancelled is delivered and paid, with no sale, revenue, cost, receipt or stock
// movement. The page is reloaded afterwards, because every load derives sales
// from orders and a closed order must not produce one. Checked at phone and
// desktop width, in Portuguese and English.
const assert = require("node:assert/strict");
const { chromium, launchOptions } = require("./browser-runtime");

const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local fixtures only");
const storageKey = "kombuAdminStateV3";
const item = (key, qty, extra = {}) => ({ key, productId: "tea", flavor: "Chá Teste", sizeMl: 500, qty, unitPrice: 22, deliveredQty: 0, allocations: [], reservedQty: 0, producedQty: 0, ...extra });
const delivery = (id, orderItemKey, qty, deliveredAt) => ({ id, number: 1, deliveredAt, paymentDueDate: `${deliveredAt.slice(0, 8)}28`, createdAt: `${deliveredAt}T10:00:00Z`, items: [{ orderItemKey, productId: "tea", flavor: "Chá Teste", qty, unitPrice: 22, allocations: [{ batchCode: "T-1", qty }] }], totalQty: qty, productsTotal: qty * 22, total: qty * 22, deliveryFee: 0, paymentMethod: "Pix" });
const order = (id, fields) => ({ id, code: `PED-${id.toUpperCase()}`, customerName: `Cliente ${id.toUpperCase()}`, clientType: "novo_cliente", orderDate: "2026-11-01", paymentStatus: "aberto", ...fields });
const seed = {
  products: [{ id: "tea", item: "KMB901", flavor: "Chá Teste", sizeMl: 500, retailPrice: 22, wholesalePrice: 15, status: "ativo", visible: true }],
  recipes: [{ id: "r-tea", productId: "tea", flavor: "Chá Teste", version: "v1", status: "ativa", bottleMl: 500, yieldBottles: 1, ingredients: [], packaging: [] }],
  batches: [{ id: "b1", code: "T-1", productId: "tea", recipeId: "r-tea", flavor: "Chá Teste", sizeMl: 500, actual: 20, expected: 20, date: "2026-10-01", status: "aprovado", inventoryAdjusted: true, inventoryQty: 20, costSnapshot: { costPerBottle: 2, yieldBottles: 1, total: 2, ingredientCost: 2 } }],
  orders: [
    order("a", { status: "confirmado", neededBy: "2026-11-10", items: [item("ka", 4, { allocations: [{ batchCode: "T-1", qty: 4 }], reservedQty: 4, producedQty: 4 })] }),
    order("b", { status: "confirmado", orderDate: "2026-11-02", items: [item("kb", 5, { deliveredQty: 2, allocations: [{ batchCode: "T-1", qty: 3 }], reservedQty: 3, producedQty: 3 })], deliveries: [delivery("d1", "kb", 2, "2026-11-05")] }),
    order("c", { status: "entregue", orderDate: "2026-10-20", deliveredAt: "2026-10-25", paymentDueDate: "2026-11-09", paymentStatus: "aguardando pagamento", items: [item("kc", 3, { deliveredQty: 3 })], deliveries: [delivery("d2", "kc", 3, "2026-10-25")] }),
    order("d", { status: "entregue", orderDate: "2026-10-10", deliveredAt: "2026-10-12", paymentDueDate: "2026-10-27", paymentStatus: "aguardando pagamento", items: [item("kd", 2, { deliveredQty: 2, allocations: [{ batchCode: "T-1", qty: 2 }] })] }),
    order("e", { status: "cancelado", items: [item("ke", 9)] }),
    order("f", { status: "entregue", orderDate: "2026-10-01", deliveredAt: "2026-10-03", paymentDueDate: "2026-10-18", paymentStatus: "pago", items: [item("kf", 1, { deliveredQty: 1 })], deliveries: [delivery("d3", "kf", 1, "2026-10-03")] }),
    order("g", { status: "recebido", orderDate: "2026-11-03", neededBy: "2099-01-01", items: [item("kg", 1)] }),
  ],
  sales: [], ingredients: [], packaging: [], purchases: [], expenses: [], partners: [], suppliers: [], receipts: [], audit: [],
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
        const login = async () => {
          await page.fill("#adminPassword", "local-fixture");
          await page.click('#loginForm button[type="submit"]');
          await page.waitForSelector("#adminShell:not(.is-locked)");
        };
        const noOverflow = async (where) => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `no horizontal scroll: ${where} at ${width}px`);
        const smallTargets = (selector) => page.evaluate((sel) => [...document.querySelectorAll(sel)]
          .filter((node) => node.offsetParent)
          .map((node) => ({ text: node.innerText || node.getAttribute("aria-label"), height: node.getBoundingClientRect().height }))
          .filter((box) => box.height < 48), selector);
        // Everything money and stock are made of, as the page itself computes it.
        const money = () => page.evaluate(() => ({
          sales: JSON.stringify(state.sales), batches: JSON.stringify(state.batches), receipts: JSON.stringify(state.receipts),
          purchases: JSON.stringify(state.purchases), expenses: JSON.stringify(state.expenses), ingredients: JSON.stringify(state.ingredients),
          physical: productPhysicalStock("tea"),
          totals: (({ salesRevenue, cogs, expenses, unknownCosts, produced, sold }) => ({ salesRevenue, cogs, expenses, unknownCosts, produced, sold }))(totals()),
          month: dashboardFinancials(todayIso().slice(0, 7)),
        }));
        const orderRow = (orderId) => page.evaluate((idToFind) => state.orders.find((row) => row.id === idToFind), orderId);
        await page.goto(`${base}/admin.html`);
        await login();

        // Sales that the orders already imply (the deliveries of B, C and F, and
        // D's own) exist from the first load; the closing must leave them be.
        await page.evaluate(() => setModule("orders"));
        const before = await money();
        assert.equal(JSON.parse(before.sales).length, 4);
        assert.ok(await page.evaluate(() => totals().receivable) > 0);
        const ordersBefore = await page.evaluate(() => JSON.stringify(state.orders));

        // The button is on the Pedidos page of the full panel, not in simple mode.
        const open = page.locator('[data-action="close-old-orders"]');
        assert.equal((await open.innerText()).replace(/\s+/g, " ").trim().replace(/^\S+ /, ""), T("Encerrar pedidos antigos", "Close old orders"));
        await page.evaluate(() => { operatorView = "orders"; setModule("operator"); });
        await page.waitForSelector(".operator");
        assert.equal(await page.locator('[data-action="close-old-orders"]').count(), 0, "simple mode does not offer it");
        await page.evaluate(() => { operatorView = "home"; setModule("orders"); });

        // The preview.
        await open.click();
        const form = page.locator("#freshStartForm");
        await form.waitFor();
        const summary = (await form.locator(".order-detail-summary span").allInnerTexts()).map((text) => text.replace(/\s+/g, " ").trim());
        assert.deepEqual(summary.slice(0, 4), [T("Pedidos a encerrar 5", "Orders to close 5"), T("Em aberto 3", "Open 3"), T("Entregues sem pagamento 2", "Delivered, unpaid 2"), T("Garrafas sem entrega 8", "Undelivered bottles 8")]);
        assert.match(summary[4], /176[.,]00/, "the value of the bottles that never left");
        assert.ok((await form.innerText()).includes(T("Não cria vendas, não muda o estoque, não gera recibos. Para desfazer, só pela cópia do banco.", "It creates no sales, changes no stock and issues no receipts. To undo it, only from the database copy.")));
        assert.equal(JSON.stringify(await money()), JSON.stringify(before), "the preview writes nothing");
        await noOverflow("preview");
        if (process.env.FRESH_SHOTS) await page.screenshot({ path: `${process.env.FRESH_SHOTS}/previa-${locale}-${width}.png`, fullPage: true });

        // Only the typed word closes anything.
        const save = form.locator(".simple-save");
        assert.equal(await save.isDisabled(), true, "the button waits for the word");
        for (const wrong of ["ENCERRA", "sim", "ENCERRAR TUDO"]) {
          await form.locator('[name="word"]').fill(wrong);
          assert.equal(await save.isDisabled(), true, `"${wrong}" does not enable it`);
        }
        await form.locator('[name="word"]').press("Enter");
        assert.equal(await page.evaluate(() => JSON.stringify(state.orders)), ordersBefore, "Enter with a wrong word closes nothing");
        assert.ok(await form.isVisible(), "the dialog stays open");
        await form.locator('[name="word"]').fill(" encerrar ");
        assert.equal(await save.isDisabled(), false);
        assert.deepEqual(await smallTargets("#freshStartForm button, #freshStartForm input"), [], "controls are at least 48px tall");
        await save.click();
        await page.waitForSelector("#adminModal", { state: "hidden" });
        assert.deepEqual(dialogs, [], "no dialog is opened");

        // The summary, and what the orders became.
        const messages = await page.locator("#adminContent .operator-notice > span:not(.material-symbols-outlined)").allInnerTexts();
        assert.ok(messages.includes(T("Pedidos encerrados: 5 (3 em aberto, 2 entregues sem pagamento). Garrafas fechadas sem sair do estoque: 8.", "Orders closed: 5 (3 open, 2 delivered and unpaid). Bottles closed without leaving stock: 8.")), JSON.stringify(messages));
        assert.ok(messages.includes(T("Nenhuma venda, nenhum recibo e nenhuma baixa de estoque foram criados.", "No sale, receipt or stock movement was created.")));
        const today = await page.evaluate(() => todayIso());
        const a = await orderRow("a");
        assert.deepEqual([a.status, a.paymentStatus, a.deliveredAt, a.paymentDueDate, a.closedFreshStart, a.items[0].deliveredQty, a.items[0].allocations.length], ["entregue", "pago", "2026-11-10", "2026-11-25", today, 4, 0]);
        assert.match(a.notes, /Encerrado em \d{2}\/\d{2}\/\d{4} ao recomeçar o sistema \(sem venda, sem baixa de estoque\)/);
        assert.equal((await orderRow("g")).deliveredAt, today, "a date in the future is never used");
        assert.deepEqual([(await orderRow("c")).paymentStatus, (await orderRow("c")).closedFreshStart], ["pago", undefined]);
        assert.equal(JSON.stringify(await orderRow("e")), JSON.stringify(JSON.parse(ordersBefore).find((row) => row.id === "e")), "the cancelled order is untouched");
        assert.equal(JSON.stringify(await orderRow("f")), JSON.stringify(JSON.parse(ordersBefore).find((row) => row.id === "f")), "the order already paid is untouched");
        assert.equal(await page.evaluate(() => state.orders.filter(isOpenOrder).length), 0);
        assert.deepEqual(await page.evaluate(() => (({ receivable, openOrderQty, productionMissing }) => ({ receivable, openOrderQty, productionMissing }))(totals())), { receivable: 0, openOrderQty: 0, productionMissing: 0 });
        assert.equal(await page.evaluate(() => state.audit.filter((row) => row.action === "Pedidos encerrados ao recomeçar").length), 1, "one history entry names the orders");
        await noOverflow("after closing");
        if (process.env.FRESH_SHOTS) await page.screenshot({ path: `${process.env.FRESH_SHOTS}/encerrado-${locale}-${width}.png`, fullPage: true });

        // Money and stock are exactly as they were.
        let after = await money();
        assert.deepEqual(after, before, "sales, revenue, cost, batches, receipts and physical stock are identical");

        // The page loads again: the orders derive no sale. This is the guard.
        await page.reload();
        await page.waitForSelector("#adminShell:not(.is-locked)");
        after = await money();
        assert.deepEqual(after, before, "after a reload, still no sale, revenue or cost was created");
        assert.equal(await page.evaluate(() => state.orders.filter(isOpenOrder).length), 0);

        // Nothing left to close.
        await page.evaluate(() => setModule("orders"));
        await page.locator('[data-action="close-old-orders"]').click();
        await page.waitForSelector("#adminModal .empty-note");
        assert.match(await page.locator("#adminModal .empty-note").innerText(), new RegExp(T("Não há pedidos para encerrar", "There are no orders to close")));
        await page.evaluate(() => closeModal());

        if (locale === "en") {
          // Orders, customers and codes are data. What this suite owns is the
          // closing text: nothing about closing, receipts or confirmation may
          // stay Portuguese.
          const leftovers = await page.evaluate(() => window.KombuLocale.misses().map((miss) => miss.text));
          const closingText = /encerr|recomeçar|sem venda|sem baixa|recibo|cópia|banco|confirmar|digite|garrafas fechadas|sem entrega|sem pagamento/i;
          assert.deepEqual(leftovers.filter((text) => closingText.test(text) && !/^Encerrado em/.test(text)), [], "the closing screens have untranslated text");
        }
        assert.deepEqual(dialogs, [], "no dialog was opened at any point");
        assert.deepEqual(errors, []);
        await context.close();
      }
    }
    console.log("Fresh start: preview, typed word, delivered and paid with no sale, revenue, cost, receipt or stock movement, still none after a reload, hidden in simple mode, cancelled and paid untouched, PT/EN, 48px targets and no overflow passed at 390/1440px.");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
