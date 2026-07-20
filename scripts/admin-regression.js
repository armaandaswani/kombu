const assert = require("assert");
const fs = require("fs");
const { chromium } = require("playwright");

const baseUrl = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
const executablePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const storageKey = "kombuAdminStateV3";

const seed = {
  products: [
    {
      id: "product-1",
      item: "KMB001",
      ean: "7890528600010",
      flavor: "Maracuja",
      title: "Kombucha Maracuja 500ml",
      sizeMl: 500,
      retailPrice: 22,
      wholesalePrice: 15,
      active: true,
    },
  ],
  ingredients: [],
  packaging: [],
  suppliers: [],
  partners: [
    {
      id: "partner-1",
      name: "Mercado Teste",
      type: "Parceiro",
      city: "Manaus",
      visible: true,
    },
  ],
  recipes: [
    {
      id: "recipe-1",
      productId: "product-1",
      flavor: "Maracuja",
      version: "v1",
      status: "ativa",
      bottleMl: 500,
      yieldBottles: 1,
      wholesalePrice: 15,
      retailPrice: 22,
      ingredients: [],
      packaging: [],
    },
  ],
  batches: [
    {
      id: "batch-1",
      code: "LOT-TEST-1",
      recipeId: "recipe-1",
      productId: "product-1",
      flavor: "Maracuja",
      date: "2026-07-14",
      actual: 4,
      expected: 4,
      status: "aprovado",
      expiry: "2026-11-14",
    },
  ],
  sales: [],
  orders: [
    {
      id: "order-1",
      code: "PED-TEST-1",
      orderDate: "2026-07-14",
      neededBy: "2026-07-18",
      status: "confirmado",
      paymentStatus: "aberto",
      customerName: "Ana Teste",
      businessName: "Mercado Teste",
      partnerId: "partner-1",
      items: [
        {
          productId: "product-1",
          productName: "Kombucha Maracuja 500ml",
          flavor: "Maracuja",
          qty: 4,
          unitPrice: 15,
          allocations: [],
        },
      ],
    },
  ],
  leads: [],
  purchases: [],
  expenses: [],
  audit: [],
  settings: {
    globalRetailPrice: 22,
    globalWholesalePrice: 15,
    priceVersion: "2026-07-04-22-15",
  },
};

async function storedState(page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
}

async function assertNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert.ok(overflow.document <= overflow.viewport + 1, `${label} document overflows horizontally: ${JSON.stringify(overflow)}`);
  assert.ok(overflow.body <= overflow.viewport + 1, `${label} body overflows horizontally: ${JSON.stringify(overflow)}`);
}

async function assertOldestOrderReservationPriority(browser) {
  const fifoSeed = JSON.parse(JSON.stringify(seed));
  fifoSeed.orders = [
    {
      id: "order-new-small",
      code: "PED-NEW-SMALL",
      createdAt: "2026-07-12T08:00:00.000Z",
      orderDate: "2026-07-12",
      neededBy: "2026-07-15",
      status: "confirmado",
      paymentStatus: "aberto",
      customerName: "Pedido novo pequeno",
      items: [
        {
          productId: "product-1",
          productName: "Kombucha Maracuja 500ml",
          flavor: "Maracuja",
          qty: 1,
          unitPrice: 15,
          allocations: [],
        },
      ],
    },
    {
      id: "order-old-large",
      code: "PED-OLD-LARGE",
      orderDate: "2026-07-10",
      neededBy: "2026-07-20",
      status: "confirmado",
      paymentStatus: "aberto",
      customerName: "Pedido antigo grande",
      items: [
        {
          productId: "product-1",
          productName: "Kombucha Maracuja 500ml",
          flavor: "Maracuja",
          qty: 4,
          unitPrice: 15,
          allocations: [],
        },
      ],
    },
  ];

  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "pt-BR" });
  await context.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: storageKey, value: fifoSeed });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/admin.html`, { waitUntil: "domcontentloaded" });
  await page.fill("#adminPassword", "local-regression");
  await page.click('#loginForm button[type="submit"]');
  await page.waitForSelector("#adminShell:not(.is-locked)");

  const fifoState = await storedState(page);
  const oldOrder = fifoState.orders.find((order) => order.id === "order-old-large");
  const newOrder = fifoState.orders.find((order) => order.id === "order-new-small");
  const reserved = (order) => order.items[0].allocations.reduce((sum, allocation) => sum + Number(allocation.qty || 0), 0);
  assert.strictEqual(reserved(oldOrder), 4, "the oldest order must receive the available batch first");
  assert.strictEqual(reserved(newOrder), 0, "a newer smaller order must not overtake an older order");
  await context.close();
}

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "pt-BR" });
  await context.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: storageKey, value: seed });
  const page = await context.newPage();
  page.on("dialog", (dialog) => dialog.accept());

  await page.goto(`${baseUrl}/admin.html`, { waitUntil: "domcontentloaded" });
  assert.strictEqual(await page.locator("#adminPassword").getAttribute("type"), "password");
  await page.click("#togglePassword");
  assert.strictEqual(await page.locator("#adminPassword").getAttribute("type"), "text");
  assert.strictEqual(await page.locator("#togglePassword").getAttribute("aria-pressed"), "true");
  await page.click("#togglePassword");
  assert.strictEqual(await page.locator("#adminPassword").getAttribute("type"), "password");
  await page.fill("#adminPassword", "local-regression");
  await page.click('#loginForm button[type="submit"]');
  await page.waitForSelector("#adminShell:not(.is-locked)");

  const readyCard = page.locator(".order-ready-card", { hasText: "Ana Teste" });
  await assert.doesNotReject(() => readyCard.waitFor());
  assert.match(await readyCard.innerText(), /4\/4/);

  await readyCard.locator('[data-action="adjust-order-reservation:order-1"]').click();
  await page.fill('#adjustOrderReservationForm input[name="reservedNow"]', "3");
  await page.fill('#adjustOrderReservationForm input[name="reason"]', "Liberar uma unidade para venda");
  await page.click('#adjustOrderReservationForm button[type="submit"]');
  await page.waitForSelector("#adminModal", { state: "hidden" });

  let state = await storedState(page);
  let item = state.orders[0].items[0];
  assert.strictEqual(item.qty, 4, "manual reservation changes must never alter the ordered quantity");
  assert.strictEqual(item.reservationTarget, null, "legacy order target must not be used for current reservation adjustments");
  assert.strictEqual(item.reservationOverride.reservedNow, 3, "the current reserved quantity should be persisted independently");
  assert.strictEqual(item.reservationOverride.orderedQty, 4, "the audit snapshot should preserve the ordered quantity");
  assert.strictEqual(item.allocations.reduce((sum, allocation) => sum + allocation.qty, 0), 3, "exactly three bottles should remain reserved");
  assert.match(state.audit[0].detail, /4 -> 3/);
  assert.match(state.audit[0].detail, /pedido permanece em 4/);
  assert.match(state.audit[0].detail, /Liberar uma unidade para venda/);
  assert.strictEqual(state.audit[0].user, "Owner / Admin");

  const updatedCard = page.locator(".order-ready-card", { hasText: "Ana Teste" });
  assert.match(await updatedCard.innerText(), /3\/4/);

  await page.click('[data-dashboard-order-view="missing"]');
  const missingCard = page.locator(".order-ready-card", { hasText: "Ana Teste" });
  assert.match(await missingCard.innerText(), /1 faltando de 4/);
  assert.ok(!(await missingCard.innerText()).includes("pronta(s)"), "missing view should replace ready-item detail instead of adding clutter");
  await assertNoHorizontalOverflow(page, "dashboard missing-only view");
  await page.click('[data-dashboard-order-view="summary"]');

  await page.locator('[data-action="delivery-proof:order-1"]').click();
  await page.waitForSelector("#deliveryProofForm");
  assert.strictEqual(await page.locator('[name="deliveredQty_0"]').inputValue(), "3", "proof should start with bottles already reserved for the client");
  await page.selectOption('[name="paymentMethod"]', "Pix");
  assert.match(await page.locator("#deliveryProofQuantity").innerText(), /3 garrafa/);
  assert.match(await page.locator("#deliveryProofTotal").innerText(), /45,00/);
  const proofPath = "/tmp/kombu-delivery-proof-regression.pdf";
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click('#deliveryProofForm button[type="submit"]'),
  ]);
  await download.saveAs(proofPath);
  const proofBytes = fs.readFileSync(proofPath);
  assert.ok(proofBytes.length > 5000, "delivery proof should contain a real A4 PDF");
  assert.strictEqual(proofBytes.subarray(0, 4).toString(), "%PDF");
  state = await storedState(page);
  assert.strictEqual(state.orders[0].paymentMethod, "Pix", "selected payment method should remain attached to the order");
  await page.click("#closeAdminModal");

  await updatedCard.locator('[data-action="dashboard-edit-partner:partner-1"]').click();
  await page.waitForSelector("#adminModal.is-open");
  assert.strictEqual(await page.locator("#mobileModuleSelector").inputValue(), "partners");
  assert.strictEqual(await page.locator("#adminModalTitle").innerText(), "Editar parceiro");
  assert.strictEqual(await page.locator('#editRecordForm input[name="name"]').inputValue(), "Mercado Teste");
  await page.click("#closeAdminModal");

  await page.selectOption("#mobileModuleSelector", "orders");
  const compactOrder = page.locator(".order-compact-card", { hasText: "Ana Teste" });
  await compactOrder.locator("summary").click();
  await compactOrder.locator('[data-action="edit-order:order-1"]').click();
  await page.waitForSelector("#orderForm");
  assert.strictEqual(await page.locator(".order-item-selector").count(), 1, "order editor should start with a compact flavor selector");
  assert.strictEqual(await page.locator(".order-item-row:not([hidden])").count(), 1, "only one flavor editor may be visible at a time");
  await page.click("[data-add-order-item]");
  assert.strictEqual(await page.locator(".order-item-selector").count(), 2, "new flavors should be added to the compact selector");
  assert.strictEqual(await page.locator(".order-item-row:not([hidden])").count(), 1, "adding a flavor must not expand every item editor");
  await assertNoHorizontalOverflow(page, "compact order editor");
  await page.click("#closeAdminModal");

  await page.selectOption("#mobileModuleSelector", "stock");
  await page.waitForSelector('[data-action="write-off-stock:LOT-TEST-1"]');
  await page.click('[data-action="write-off-stock:LOT-TEST-1"]');
  await page.selectOption('#writeOffStockForm select[name="reasonType"]', "danificada");
  await page.fill('#writeOffStockForm input[name="note"]', "Garrafa trincada na conferencia");
  await page.click('#writeOffStockForm button[type="submit"]');
  await page.waitForSelector("#adminModal", { state: "hidden" });

  state = await storedState(page);
  item = state.orders[0].items[0];
  assert.strictEqual(item.allocations.reduce((sum, allocation) => sum + allocation.qty, 0), 3, "write-off must not consume reserved stock");
  assert.strictEqual(state.sales.length, 1);
  assert.strictEqual(state.sales[0].movementType, "perda");
  assert.strictEqual(state.sales[0].qty, 1);
  assert.match(state.audit[0].detail, /danificada/);
  assert.match(state.audit[0].detail, /Garrafa trincada/);

  const available = state.batches[0].actual - state.sales.reduce((sum, sale) => sum + sale.qty, 0) - item.allocations.reduce((sum, allocation) => sum + allocation.qty, 0);
  assert.strictEqual(available, 0, "the written-off bottle must not return to available stock");

  await page.selectOption("#mobileModuleSelector", "sales");
  await page.waitForSelector('[data-sales-period="month"]');
  assert.strictEqual(await page.locator(".sale-compact-card").count(), 1, "the current month should show its stock movement");
  await page.click('[data-sales-period="custom"]');
  await page.fill('[data-sales-custom="start"]', "2099-01-01");
  await page.locator('[data-sales-custom="start"]').dispatchEvent("change");
  await page.waitForFunction(() => document.querySelectorAll(".sale-compact-card").length === 0);
  assert.strictEqual(await page.locator(".sale-compact-card").count(), 0, "custom range must filter older movements immediately");
  await assertNoHorizontalOverflow(page, "sales period view");

  await assertOldestOrderReservationPriority(browser);
  await browser.close();
  console.log("Admin regression: password visibility, compact order editing, missing-only dashboard, A4 delivery proof, period filters, FIFO order reservation, reservation override, partner deep-link, audit history and write-off passed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
