const assert = require("assert");
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
  await page.fill('#adjustOrderReservationForm input[name="targetQty"]', "3");
  await page.fill('#adjustOrderReservationForm input[name="reason"]', "Liberar uma unidade para venda");
  await page.click('#adjustOrderReservationForm button[type="submit"]');
  await page.waitForSelector("#adminModal", { state: "hidden" });

  let state = await storedState(page);
  let item = state.orders[0].items[0];
  assert.strictEqual(item.reservationTarget, 3, "manual target should be persisted");
  assert.strictEqual(item.allocations.reduce((sum, allocation) => sum + allocation.qty, 0), 3, "exactly three bottles should remain reserved");
  assert.match(state.audit[0].detail, /4 -> 3/);
  assert.match(state.audit[0].detail, /Liberar uma unidade para venda/);
  assert.strictEqual(state.audit[0].user, "Owner / Admin");

  const updatedCard = page.locator(".order-ready-card", { hasText: "Ana Teste" });
  assert.match(await updatedCard.innerText(), /3\/4/);
  await updatedCard.locator('[data-action="dashboard-edit-partner:partner-1"]').click();
  await page.waitForSelector("#adminModal.is-open");
  assert.strictEqual(await page.locator("#mobileModuleSelector").inputValue(), "partners");
  assert.strictEqual(await page.locator("#adminModalTitle").innerText(), "Editar parceiro");
  assert.strictEqual(await page.locator('#editRecordForm input[name="name"]').inputValue(), "Mercado Teste");
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

  await browser.close();
  console.log("Admin regression: password visibility, reservation override, partner deep-link, audit history and write-off passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
