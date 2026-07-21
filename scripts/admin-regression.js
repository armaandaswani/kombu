const assert = require("assert");
const fs = require("fs");
const { execFileSync } = require("child_process");
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
  ingredients: [
    {
      id: "ingredient-1",
      name: "Maracuja",
      category: "fruta",
      purchaseUnit: "g",
      costPerUnit: 0.025,
      stock: 1000,
      min: 0,
      status: "ativo",
    },
  ],
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
      ingredients: [{ ingredientId: "ingredient-1", qty: 40, unit: "g" }],
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
      actual: 5,
      expected: 5,
      status: "aprovado",
      expiry: "2026-11-14",
    },
    {
      id: "batch-300",
      code: "LOT-TEST-300",
      recipeId: "recipe-1-300",
      productId: "product-1-300",
      flavor: "Maracuja",
      date: "2026-07-14",
      actual: 2,
      expected: 2,
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
  audit: [
    {
      at: "2026-07-14T12:00:00.000Z",
      user: "Owner / Admin",
      action: "Venda registrada",
      detail: "1 garrafa do lote LOT-TEST-1 para Ana Teste",
    },
  ],
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
  fifoSeed.batches[0].actual = 4;
  fifoSeed.batches[0].expected = 4;
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

  let state = await storedState(page);
  const product300 = state.products.find((product) => product.id === "product-1-300");
  const recipe300 = state.recipes.find((recipe) => recipe.id === "recipe-1-300");
  assert.ok(product300, "a 300ml product variant should be created without replacing the 500ml product");
  assert.strictEqual(product300.sizeMl, 300);
  assert.strictEqual(product300.retailPrice, 16, "300ml products must keep their own retail reference");
  assert.strictEqual(product300.wholesalePrice, 10, "300ml products must keep their own wholesale reference");
  assert.ok(recipe300, "a 300ml recipe variant should be created automatically");
  assert.strictEqual(recipe300.bottleMl, 300);
  assert.strictEqual(recipe300.retailPrice, 16, "300ml recipes must inherit the 300ml retail reference");
  assert.strictEqual(recipe300.wholesalePrice, 10, "300ml recipes must inherit the 300ml wholesale reference");
  assert.strictEqual(recipe300.ingredients[0].qty, 24, "300ml ingredient quantities must be exactly 60% of the 500ml recipe");
  assert.ok(recipe300.packaging.some((line) => line.itemId === "pkg-bottle-300"), "the 300ml recipe must use the 300ml bottle");
  assert.strictEqual(state.packaging.find((item) => item.id === "pkg-bottle-300").costEach, 1.2);
  assert.strictEqual(state.products.find((product) => product.id === "product-1").retailPrice, 22, "500ml retail price must remain independent");
  assert.strictEqual(state.products.find((product) => product.id === "product-1").wholesalePrice, 15, "500ml wholesale price must remain independent");

  await page.selectOption("#mobileModuleSelector", "packaging");
  await page.click('[data-action="new-packaging"]');
  await page.fill('#simpleForm input[name="name"]', "Material decimal teste");
  await page.fill('#simpleForm input[name="costEach"]', "1.2");
  await page.click('#simpleForm button[type="submit"]');
  await page.waitForSelector("#adminModal", { state: "hidden" });
  state = await storedState(page);
  assert.strictEqual(state.packaging.find((item) => item.name === "Material decimal teste").costEach, 1.2, "packaging costs must accept cent values such as R$ 1.20");

  await page.selectOption("#mobileModuleSelector", "products");
  const productsText = await page.locator("#adminContent").innerText();
  assert.strictEqual(await page.getByText("Custo da receita", { exact: true }).count(), 1, "products must identify the recipe as the cost source");
  assert.ok(!productsText.includes("Custo print"), "products must not expose the obsolete manual print cost");
  const productCard = page.locator(".product-compact-card", { hasText: "Maracuja" }).first();
  const productCardText = await productCard.innerText();
  assert.match(productCardText, /Custo R\$/, "product cards must show the current recipe calculation");
  assert.ok(!/Custo R\$[\s\u00a0]*0,00/.test(productCardText), "linked recipes must not fall back to a zero manual cost");
  assert.strictEqual(await page.locator(".size-pricing-card").count(), 2, "products must expose one pricing control per bottle size");
  assert.match(
    await page.locator('.size-pricing-card', { hasText: "500ml" }).innerText(),
    /R\$\s*22,00[\s\S]*R\$\s*15,00/,
    "500ml pricing summary must show its own retail and wholesale prices",
  );
  assert.match(
    await page.locator('.size-pricing-card', { hasText: "300ml" }).innerText(),
    /R\$\s*16,00[\s\S]*R\$\s*10,00/,
    "300ml pricing summary must show its own retail and wholesale prices",
  );
  await page.click('[data-action="global-prices-300"]');
  await page.waitForSelector("#globalPriceForm");
  assert.strictEqual(await page.locator("#globalPriceForm").getAttribute("data-size-ml"), "300");
  assert.strictEqual(Number(await page.locator('#globalPriceForm [name="retailPrice"]').inputValue()), 16);
  assert.strictEqual(Number(await page.locator('#globalPriceForm [name="wholesalePrice"]').inputValue()), 10);
  const pricingSummary = await page.locator("#globalPriceForm .pricing-form-summary").innerText();
  assert.match(pricingSummary, /Maior custo/, "pricing review must explain the real cost used for the suggestion");
  assert.ok(!/Maior custo[^\n]*R\$\s*0,00/.test(pricingSummary), "pricing suggestions must use the linked recipe costs");
  await page.fill('#globalPriceForm [name="retailPrice"]', "17");
  await page.fill('#globalPriceForm [name="wholesalePrice"]', "11");
  await page.click('#globalPriceForm button[type="submit"]');
  await page.waitForSelector("#adminModal", { state: "hidden" });
  state = await storedState(page);
  assert.strictEqual(state.products.find((product) => product.id === "product-1-300").retailPrice, 17);
  assert.strictEqual(state.products.find((product) => product.id === "product-1-300").wholesalePrice, 11);
  assert.strictEqual(state.recipes.find((recipe) => recipe.id === "recipe-1-300").retailPrice, 17);
  assert.strictEqual(state.recipes.find((recipe) => recipe.id === "recipe-1-300").wholesalePrice, 11);
  assert.strictEqual(state.products.find((product) => product.id === "product-1").retailPrice, 22, "changing 300ml prices must not touch 500ml retail");
  assert.strictEqual(state.products.find((product) => product.id === "product-1").wholesalePrice, 15, "changing 300ml prices must not touch 500ml wholesale");
  await productCard.locator('[data-action="edit-product:product-1"]').click();
  await page.waitForSelector("#editProductForm");
  assert.strictEqual(await page.locator('#editProductForm [name="baselineCost"]').count(), 0, "recipe-derived cost must not be manually editable");
  assert.strictEqual(await page.locator('#editProductForm [name="status"]').count(), 0, "product status must not duplicate operational availability");
  const productCostSummary = await page.locator("#editProductForm .product-cost-summary").innerText();
  assert.match(productCostSummary, /R\$/);
  assert.ok(!/R\$[\s\u00a0]*0,00/.test(productCostSummary));
  assert.match(productCostSummary, /Calculado automaticamente pela receita/);
  assert.strictEqual(await page.locator('#editProductForm [name="operational"]').isChecked(), true);
  await page.locator('#editProductForm [name="operational"]').uncheck();
  await page.click('#editProductForm button[type="submit"]');
  await page.waitForSelector("#adminModal", { state: "hidden" });
  state = await storedState(page);
  assert.strictEqual(state.products.find((product) => product.id === "product-1").visible, false);
  assert.strictEqual(state.products.find((product) => product.id === "product-1").status, "inativo");
  await page.locator('.product-compact-card [data-action="edit-product:product-1"]').click();
  await page.waitForSelector("#editProductForm");
  await page.locator('#editProductForm [name="operational"]').check();
  await page.click('#editProductForm button[type="submit"]');
  await page.waitForSelector("#adminModal", { state: "hidden" });
  state = await storedState(page);
  assert.strictEqual(state.products.find((product) => product.id === "product-1").visible, true);
  assert.strictEqual(state.products.find((product) => product.id === "product-1").status, "ativo");

  await page.selectOption("#mobileModuleSelector", "batches");
  await page.click('[data-action="new-batch"]');
  assert.strictEqual(await page.locator('#batchForm [data-variant-flavor]').inputValue(), "Maracuja");
  assert.deepStrictEqual(
    await page.locator('#batchForm [data-variant-size] option').evaluateAll((options) => options.map((option) => option.value)),
    ["300", "500"],
    "new batches must ask for flavor first and then expose both bottle sizes",
  );
  await page.click("#closeAdminModal");

  await page.selectOption("#mobileModuleSelector", "dashboard");
  await page.click('[data-action="quick-sale"]');
  assert.strictEqual(await page.locator('#quickSaleForm [data-variant-flavor]').inputValue(), "Maracuja");
  assert.deepStrictEqual(
    await page.locator('#quickSaleForm [data-variant-size] option').evaluateAll((options) => options.map((option) => option.value)),
    ["300", "500"],
    "sales must ask for flavor first and size second when both variants have available stock",
  );
  await page.click("#closeAdminModal");

  const legacySaleAudit = page.locator(".audit-row", { hasText: "LOT-TEST-1" });
  assert.match(await legacySaleAudit.innerText(), /Maracuja/);
  assert.match(await legacySaleAudit.innerText(), /lote LOT-TEST-1/);

  const readyCard = page.locator(".order-ready-card", { hasText: "Ana Teste" });
  await assert.doesNotReject(() => readyCard.waitFor());
  assert.match(await readyCard.innerText(), /4\/4/);

  await readyCard.locator('[data-action="adjust-order-reservation:order-1"]').click();
  await page.fill('#adjustOrderReservationForm input[name="reservedNow"]', "3");
  await page.fill('#adjustOrderReservationForm input[name="reason"]', "Liberar uma unidade para venda");
  await page.click('#adjustOrderReservationForm button[type="submit"]');
  await page.waitForSelector("#adminModal", { state: "hidden" });

  state = await storedState(page);
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
  const updatedCardText = await updatedCard.innerText();
  assert.match(updatedCardText, /3\/4/);
  assert.match(updatedCardText, /Sabores que faltam/);
  assert.match(updatedCardText, /Maracuja/);
  assert.match(updatedCardText, /1 faltando de 4/);

  await page.click('[data-dashboard-order-view="missing"]');
  const missingCard = page.locator(".order-ready-card", { hasText: "Ana Teste" });
  assert.match(await missingCard.innerText(), /1 faltando de 4/);
  assert.ok(!(await missingCard.innerText()).includes("pronta(s)"), "missing view should replace ready-item detail instead of adding clutter");
  await assertNoHorizontalOverflow(page, "dashboard missing-only view");
  await page.click('[data-dashboard-order-view="summary"]');

  await page.locator('[data-action="delivery-proof:order-1"]').click();
  await page.waitForSelector("#deliveryProofForm");
  assert.match(await page.locator(".delivery-proof-item").innerText(), /Maracuja 500ml/);
  assert.strictEqual(await page.locator('[name="deliveredQty_0"]').inputValue(), "3", "proof should start with bottles already reserved for the client");
  assert.strictEqual(
    await page.locator('[name="paymentMethod"]').inputValue(),
    "Prazo – 15 dias corridos após a entrega",
    "delivery proof should default to the 15-day payment term",
  );
  assert.strictEqual(await page.locator('[name="recipientName"]').count(), 0, "recipient field should not clutter the delivery proof form");
  assert.match(await page.locator(".delivery-proof-payment small").innerText(), /Infinite Pay/);
  assert.match(await page.locator("#deliveryProofQuantity").innerText(), /3 garrafa/);
  assert.match(await page.locator("#deliveryProofTotal").innerText(), /45,00/);
  const firstProofPath = "/tmp/kombu-delivery-proof-remessa-01.pdf";
  const [firstDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.click('#deliveryProofForm button[type="submit"]'),
  ]);
  await firstDownload.saveAs(firstProofPath);
  assert.match(firstDownload.suggestedFilename(), /remessa-01/);
  await page.waitForSelector("#adminModal", { state: "hidden" });
  const firstProofBytes = fs.readFileSync(firstProofPath);
  assert.ok(firstProofBytes.length > 7000, "first delivery proof should contain both complete A4 copies");
  assert.strictEqual(firstProofBytes.subarray(0, 4).toString(), "%PDF");
  const firstPdfInfo = execFileSync("pdfinfo", [firstProofPath], { encoding: "utf8" });
  assert.match(firstPdfInfo, /^Pages:\s+2$/m, "first delivery proof should contain establishment and customer copies");
  state = await storedState(page);
  item = state.orders[0].items[0];
  assert.strictEqual(
    state.orders[0].paymentMethod,
    "Prazo – 15 dias corridos após a entrega",
    "default payment term should remain attached to the order",
  );
  assert.strictEqual(item.qty, 4, "a partial delivery must preserve the original ordered quantity");
  assert.strictEqual(item.deliveredQty, 3, "the first delivery must persist only the three bottles sent now");
  assert.strictEqual(state.orders[0].deliveries.length, 1);
  assert.strictEqual(state.orders[0].deliveries[0].items[0].qty, 3);
  assert.strictEqual(state.orders[0].deliveries[0].number, 1);
  assert.strictEqual(
    state.sales.filter((sale) => sale.movementType === "venda").reduce((sum, sale) => sum + Number(sale.qty || 0), 0),
    3,
    "only the first shipment may leave inventory",
  );
  assert.strictEqual(item.allocations.reduce((sum, allocation) => sum + allocation.qty, 0), 1, "the remaining bottle should be reserved for the next shipment");

  await updatedCard.locator('[data-action="dashboard-edit-partner:partner-1"]').click();
  await page.waitForSelector("#adminModal.is-open");
  assert.strictEqual(await page.locator("#mobileModuleSelector").inputValue(), "partners");
  assert.strictEqual(await page.locator("#adminModalTitle").innerText(), "Editar parceiro");
  assert.strictEqual(await page.locator('#editRecordForm input[name="name"]').inputValue(), "Mercado Teste");
  await page.click("#closeAdminModal");

  await page.selectOption("#mobileModuleSelector", "dashboard");
  const partialCard = page.locator(".order-ready-card", { hasText: "Ana Teste" });
  assert.match(await partialCard.innerText(), /3 já entregue/);
  assert.match(await partialCard.innerText(), /1\/1/);
  await partialCard.locator('[data-action="delivery-proof:order-1"]').click();
  await page.waitForSelector("#deliveryProofForm");
  assert.strictEqual(await page.locator('[name="deliveredQty_0"]').inputValue(), "1", "the second proof may contain only the newly ready balance");
  await page.locator(".delivery-history summary").click();
  assert.match(await page.locator(".delivery-history").innerText(), /Remessa 1/);
  assert.match(await page.locator("#deliveryProofQuantity").innerText(), /1 garrafa/);
  assert.match(await page.locator("#deliveryProofTotal").innerText(), /15,00/);
  const secondProofPath = "/tmp/kombu-delivery-proof-remessa-02.pdf";
  const [secondDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.click('#deliveryProofForm button[type="submit"]'),
  ]);
  await secondDownload.saveAs(secondProofPath);
  assert.match(secondDownload.suggestedFilename(), /remessa-02/);
  await page.waitForSelector("#adminModal", { state: "hidden" });
  const secondPdfInfo = execFileSync("pdfinfo", [secondProofPath], { encoding: "utf8" });
  assert.match(secondPdfInfo, /^Pages:\s+2$/m, "second delivery proof should also contain two A4 copies");
  state = await storedState(page);
  item = state.orders[0].items[0];
  assert.strictEqual(item.qty, 4);
  assert.strictEqual(item.deliveredQty, 4);
  assert.strictEqual(state.orders[0].deliveries.length, 2);
  assert.strictEqual(state.orders[0].deliveries[1].items[0].qty, 1);
  assert.strictEqual(state.orders[0].status, "entregue");
  assert.strictEqual(
    state.sales.filter((sale) => sale.movementType === "venda").reduce((sum, sale) => sum + Number(sale.qty || 0), 0),
    4,
    "the two shipments together must sell exactly the original order quantity",
  );

  await page.selectOption("#mobileModuleSelector", "orders");
  const compactOrder = page.locator(".order-compact-card", { hasText: "Ana Teste" });
  await compactOrder.locator("summary").click();
  assert.match(await compactOrder.locator('[data-action="delivery-proof:order-1"]').innerText(), /PDF da entrega/);
  await compactOrder.locator('[data-action="edit-order:order-1"]').click();
  await page.waitForSelector("#orderForm");
  assert.strictEqual(await page.locator(".order-item-selector").count(), 1, "order editor should start with a compact flavor selector");
  assert.strictEqual(await page.locator(".order-item-row:not([hidden])").count(), 1, "only one flavor editor may be visible at a time");
  assert.deepStrictEqual(
    await page.locator('.order-item-row:not([hidden]) [data-variant-size] option').evaluateAll((options) => options.map((option) => option.value)),
    ["300", "500"],
    "order items must keep flavor and bottle size as separate, compact choices",
  );
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
  assert.strictEqual(item.allocations.reduce((sum, allocation) => sum + allocation.qty, 0), 0, "completed deliveries must consume their reservations");
  const losses = state.sales.filter((sale) => sale.movementType === "perda");
  assert.strictEqual(losses.length, 1);
  assert.strictEqual(losses[0].qty, 1);
  assert.match(state.audit[0].detail, /danificada/);
  assert.match(state.audit[0].detail, /Garrafa trincada/);

  const available = state.batches[0].actual - state.sales.reduce((sum, sale) => sum + sale.qty, 0) - item.allocations.reduce((sum, allocation) => sum + allocation.qty, 0);
  assert.strictEqual(available, 0, "the written-off bottle must not return to available stock");

  await page.selectOption("#mobileModuleSelector", "sales");
  await page.waitForSelector('[data-sales-period="month"]');
  assert.ok((await page.locator(".sale-compact-card").count()) >= 3, "the current month should show both deliveries and the write-off");
  await page.click('[data-sales-period="custom"]');
  await page.fill('[data-sales-custom="start"]', "2099-01-01");
  await page.locator('[data-sales-custom="start"]').dispatchEvent("change");
  await page.waitForFunction(() => document.querySelectorAll(".sale-compact-card").length === 0);
  assert.strictEqual(await page.locator(".sale-compact-card").count(), 0, "custom range must filter older movements immediately");
  await assertNoHorizontalOverflow(page, "sales period view");

  await assertOldestOrderReservationPriority(browser);
  await browser.close();
  console.log("Admin regression: password visibility, decimal packaging cost, recipe-driven product cost, unified product availability, automatic 300ml recipes, flavor-size flows, compact order editing, two partial A4 deliveries, shipment history, period filters, FIFO order reservation, reservation override, partner deep-link, audit history and write-off passed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
