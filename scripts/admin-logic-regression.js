// Covers the order, reservation and quick-sale logic that lives in
// assets/admin.js. Until now that file was only ever checked by hand in a
// browser, which is why the scenarios below are the ones from the feature brief,
// with the same numbers: if a change breaks what was demonstrated by hand, this
// fails instead of reaching production unnoticed.
const assert = require("node:assert/strict");
const { createAdminSandbox } = require("./admin-harness");

const admin = createAdminSandbox();

// Each test starts from its own state so nothing leaks between scenarios.
function load(state) {
  admin.__setState({
    products: [],
    recipes: [],
    batches: [],
    sales: [],
    orders: [],
    partners: [],
    expenses: [],
    ingredients: [],
    purchases: [],
    audit: [],
    leads: [],
    settings: {},
    ...state,
  });
  // Deliberately accumulates across batches until a save fires, so it has to be
  // cleared here or one scenario's production shows up in the next one.
  admin.__eval("pendingReservationRequest = null;");
  return admin.__getState();
}

function call(fn, ...args) {
  admin.__args = args;
  return admin.__eval(`${fn}(...__args)`);
}

// Arrays and objects built inside the sandbox have that context's prototypes, so
// deepStrictEqual rejects them on identity alone. Comparing the structure is
// what these tests are actually about.
function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

const PRODUCTS = [
  { id: "p-fv", flavor: "Frutas Vermelhas", sizeMl: 350, retailPrice: 18, wholesalePrice: 12 },
  { id: "p-lav", flavor: "Lavanda", sizeMl: 350, retailPrice: 20, wholesalePrice: 14 },
  { id: "p-mar", flavor: "Maracujá", sizeMl: 350, retailPrice: 20, wholesalePrice: 14 },
  { id: "p-fv-500", flavor: "Frutas Vermelhas", sizeMl: 500, retailPrice: 24, wholesalePrice: 17 },
];

function batch(code, productId, actual, extra = {}) {
  return { id: `b-${code}`, code, productId, actual, status: "aprovado", date: "2026-01-10", ...extra };
}

function item(key, productId, qty, allocations = [], extra = {}) {
  return {
    key,
    productId,
    qty,
    allocations: allocations.map((allocation) => ({ manual: false, ...allocation })),
    ...extra,
  };
}

function order(id, items, extra = {}) {
  return {
    id,
    code: id.toUpperCase(),
    customerName: "Divina Terra",
    status: "aberto",
    createdAt: "2026-01-05T10:00:00.000Z",
    orderDate: "2026-01-05",
    items,
    ...extra,
  };
}

// --- Section 1: what the dashboard card says -------------------------------

// The brief's own example: 48 ordered, one batch covering 4 of them. The card
// has to say "4 de 48 reservadas" and "44 faltando", not treat the order as
// ready because a batch exists.
function testACardReportsReservedAndMissingSeparately() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 48)],
    orders: [order("o1", [item("i1", "p-fv", 48, [{ batchCode: "L-001", qty: 4 }])])],
  });
  const [line] = call("orderLineRows", admin.__getState().orders[0]);
  assert.equal(line.ordered, 48);
  assert.equal(line.reserved, 4);
  assert.equal(line.missing, 44);
  assert.equal(line.status, "parcial");
  assert.deepEqual(plain(line.batches), ["L-001"]);
}

function testOrderStatusFollowsWhatIsStillMissing() {
  assert.equal(call("orderReadyStatus", 0, 10), "pendente");
  assert.equal(call("orderReadyStatus", 4, 44), "parcial");
  assert.equal(call("orderReadyStatus", 48, 0), "completo");
  // Nothing reserved and nothing missing is a fully delivered order, not a
  // pending one - it must not be shown as still waiting.
  assert.equal(call("orderReadyStatus", 0, 0), "completo");
}

function testDeliveredBottlesLeaveTheOutstandingCount() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 48)],
    orders: [order("o1", [item("i1", "p-fv", 48, [{ batchCode: "L-001", qty: 4 }], { deliveredQty: 30 })])],
  });
  const [line] = call("orderLineRows", admin.__getState().orders[0]);
  assert.equal(line.delivered, 30);
  assert.equal(line.outstanding, 18);
  assert.equal(line.reserved, 4);
  assert.equal(line.missing, 14);
}

// --- Section 2: adjusting one line by hand ---------------------------------

// The brief's adjustment example: three flavours on one screen, each moved to an
// exact number. Reducing one must not feed another.
function testReducingAReservationReleasesStockWithoutGivingItAway() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 48)],
    orders: [
      order("o1", [item("i1", "p-fv", 20, [{ batchCode: "L-001", qty: 20 }])]),
      order("o2", [item("i2", "p-fv", 20, [])], { id: "o2", code: "O2" }),
    ],
  });
  const state = admin.__getState();
  const result = call("setOrderItemReservation", state.orders[0], state.orders[0].items[0], 5, "sobra");
  assert.equal(result.from, 20);
  assert.equal(result.to, 5);
  // The 15 released bottles are free stock now, NOT handed to the waiting order.
  assert.equal(call("orderItemReservedQty", state.orders[1].items[0]), 0);
  assert.equal(call("batchStockBreakdown", "L-001").free, 43);
}

function testAReservationCannotExceedWhatWasOrdered() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 100)],
    orders: [order("o1", [item("i1", "p-fv", 10, [])])],
  });
  const state = admin.__getState();
  const result = call("setOrderItemReservation", state.orders[0], state.orders[0].items[0], 999, "");
  assert.equal(result.to, 10);
}

function testAReservationCannotExceedTheStockThatExists() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 6)],
    orders: [order("o1", [item("i1", "p-fv", 48, [])])],
  });
  const state = admin.__getState();
  const result = call("setOrderItemReservation", state.orders[0], state.orders[0].items[0], 48, "");
  assert.equal(result.to, 6);
}

function testAdjustingOneFlavourLeavesTheOthersAlone() {
  load({
    products: PRODUCTS,
    batches: [batch("L-fv", "p-fv", 50), batch("L-lav", "p-lav", 50), batch("L-mar", "p-mar", 50)],
    orders: [
      order("o1", [
        item("i-fv", "p-fv", 10, [{ batchCode: "L-fv", qty: 10 }]),
        item("i-lav", "p-lav", 10, [{ batchCode: "L-lav", qty: 10 }]),
        item("i-mar", "p-mar", 10, [{ batchCode: "L-mar", qty: 10 }]),
      ]),
    ],
  });
  const state = admin.__getState();
  call("setOrderItemReservation", state.orders[0], state.orders[0].items[1], 3, "ajuste");
  const rows = call("orderLineRows", state.orders[0]);
  assert.deepEqual(plain(rows).map((row) => row.reserved), [10, 3, 10]);
}

// A manual number has to survive the automatic pass that runs on every save,
// otherwise the adjustment silently undoes itself.
function testAManualNumberSurvivesTheAutomaticRefresh() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 48)],
    orders: [order("o1", [item("i1", "p-fv", 48, [{ batchCode: "L-001", qty: 48 }])])],
  });
  const state = admin.__getState();
  call("setOrderItemReservation", state.orders[0], state.orders[0].items[0], 12, "cliente pediu menos");
  call("refreshAllOrderReservations");
  assert.equal(call("orderItemReservedQty", admin.__getState().orders[0].items[0]), 12);
}

// The manual number is a ceiling, not just a one-off edit: new production must
// not quietly push the order back up to the full quantity. Only an explicit
// recalculation is allowed to supersede what a person chose.
function testLaterProductionDoesNotOverrideAManualNumber() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 48)],
    orders: [order("o1", [item("i1", "p-fv", 48, [{ batchCode: "L-001", qty: 48 }])])],
  });
  const state = admin.__getState();
  const adjustment = call("setOrderItemReservation", state.orders[0], state.orders[0].items[0], 12, "cliente pediu menos");
  assert.equal(adjustment.to, 12);
  assert.equal(state.orders[0].items[0].reservationOverride.reservedNow, 12);
  // 36 more bottles are produced - enough to complete the order on paper.
  state.batches.push(batch("L-002", "p-fv", 36, { date: "2026-03-01" }));
  call("allocateNewBatchToOrders", state.batches[1]);
  assert.equal(call("orderItemReservedQty", admin.__getState().orders[0].items[0]), 12);
}

// --- Section 3: new production is additive ---------------------------------

function testNewProductionNeverMovesAnExistingReservation() {
  load({
    products: PRODUCTS,
    batches: [batch("L-old", "p-fv", 10), batch("L-new", "p-fv", 30, { date: "2026-02-01" })],
    orders: [
      // Older order, already holding the old batch.
      order("o1", [item("i1", "p-fv", 10, [{ batchCode: "L-old", qty: 10 }])], {
        createdAt: "2026-01-01T10:00:00.000Z",
      }),
      order("o2", [item("i2", "p-fv", 30, [])], {
        id: "o2",
        code: "O2",
        customerName: "Outro Cliente",
        createdAt: "2026-01-20T10:00:00.000Z",
      }),
    ],
  });
  const state = admin.__getState();
  call("allocateNewBatchToOrders", state.batches[1]);
  const after = admin.__getState();
  // The first order keeps exactly what it had; only the new batch is handed out.
  assert.equal(call("orderItemReservedQty", after.orders[0].items[0]), 10);
  assert.deepEqual(plain(call("orderItemBatchCodes", after.orders[0].items[0])), ["L-old"]);
  assert.equal(call("orderItemReservedQty", after.orders[1].items[0]), 30);
  assert.deepEqual(plain(call("orderItemBatchCodes", after.orders[1].items[0])), ["L-new"]);
}

function testNewProductionTagsTheSaveSoTheServerAgrees() {
  load({
    products: PRODUCTS,
    batches: [batch("L-new", "p-fv", 30)],
    orders: [order("o1", [item("i1", "p-fv", 30, [])])],
  });
  call("allocateNewBatchToOrders", admin.__getState().batches[0]);
  const request = admin.__eval("pendingReservationRequest");
  assert.equal(request.mode, "allocate-new-stock");
  assert.deepEqual(plain(request.batchCodes), ["L-new"]);
}

function testAnOrdinaryRefreshMovesNothingBetweenOrders() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 10)],
    orders: [
      // The newer order holds the stock; a FIFO rebuild would take it away.
      order("o1", [item("i1", "p-fv", 10, [])], { createdAt: "2026-01-01T10:00:00.000Z" }),
      order("o2", [item("i2", "p-fv", 10, [{ batchCode: "L-001", qty: 10 }])], {
        id: "o2",
        code: "O2",
        createdAt: "2026-01-20T10:00:00.000Z",
      }),
    ],
  });
  call("refreshAllOrderReservations");
  const after = admin.__getState();
  assert.equal(call("orderItemReservedQty", after.orders[0].items[0]), 0);
  assert.equal(call("orderItemReservedQty", after.orders[1].items[0]), 10);
}

// --- Section 5: repeating a previous order ---------------------------------

function testRepeatingAnOrderCopiesOnlyWhatWasBought() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 48)],
    orders: [
      order("o1", [item("i1", "p-fv", 12, [{ batchCode: "L-001", qty: 12 }], { note: "sem gelo", unitPrice: 9 })], {
        deliveries: [{ qty: 12 }],
        status: "entregue",
        paymentStatus: "pago",
      }),
    ],
  });
  const copied = call("orderItemsFromPreviousOrder", admin.__getState().orders[0], "novo_cliente");
  assert.deepEqual(plain(copied), [{ productId: "p-fv", qty: 12, note: "sem gelo", unitPrice: 18 }]);
  // Nothing about how the old order was fulfilled travels with the copy.
  const keys = Object.keys(plain(copied)[0]).sort();
  assert.deepEqual(keys, ["note", "productId", "qty", "unitPrice"]);
}

function testRepeatingAnOrderRepricesAtTodaysTable() {
  load({ products: PRODUCTS, orders: [order("o1", [item("i1", "p-lav", 5, [], { unitPrice: 3 })])] });
  const previous = admin.__getState().orders[0];
  assert.equal(call("orderItemsFromPreviousOrder", previous, "novo_cliente")[0].unitPrice, 20);
  assert.equal(call("orderItemsFromPreviousOrder", previous, "novo_parceiro")[0].unitPrice, 14);
}

function testPreviousOrdersAreFoundByEitherNameAndNewestFirst() {
  load({
    products: PRODUCTS,
    orders: [
      order("o1", [item("i1", "p-fv", 1)], { orderDate: "2026-01-01" }),
      order("o2", [item("i2", "p-fv", 1)], { id: "o2", orderDate: "2026-03-01" }),
      order("o3", [item("i3", "p-fv", 1)], { id: "o3", customerName: "Outro", businessName: "Divina Terra", orderDate: "2026-02-01" }),
      order("o4", [item("i4", "p-fv", 1)], { id: "o4", customerName: "Ninguém" }),
    ],
  });
  const found = call("previousOrdersForClient", "Divina Terra", "");
  assert.deepEqual(plain(found).map((row) => row.id), ["o2", "o3", "o1"]);
}

function testAnOrderWithNoLinesIsNotOfferedForRepeating() {
  load({ products: PRODUCTS, orders: [order("o1", [item("i1", "p-fv", 0)])] });
  assert.deepEqual(plain(call("previousOrdersForClient", "Divina Terra", "")), []);
}

// --- Sections 6-8: selling stock that is already reserved -------------------

function testTheBreakdownSeparatesPhysicalStockFromFreeStock() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 10)],
    sales: [{ id: "s1", batchCode: "L-001", qty: 2 }],
    orders: [order("o1", [item("i1", "p-fv", 8, [{ batchCode: "L-001", qty: 8 }])])],
  });
  const breakdown = call("batchStockBreakdown", "L-001");
  assert.equal(breakdown.produced, 10);
  assert.equal(breakdown.sold, 2);
  assert.equal(breakdown.reserved, 8);
  // 8 bottles are on the shelf even though every one of them is spoken for.
  assert.equal(breakdown.physical, 8);
  assert.equal(breakdown.free, 0);
}

// The brief's quick-sale example: orders A, B and C hold 4, 5 and 1 bottles of
// the same batch. Selling 1 must take it from the order that needs it latest.
function testAWithdrawalTakesFromTheOrderThatNeedsItLatest() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 10)],
    orders: [
      order("oA", [item("iA", "p-fv", 4, [{ batchCode: "L-001", qty: 4 }])], { id: "oA", neededBy: "2026-02-01" }),
      order("oB", [item("iB", "p-fv", 5, [{ batchCode: "L-001", qty: 5 }])], { id: "oB", neededBy: "2026-02-10" }),
      order("oC", [item("iC", "p-fv", 1, [{ batchCode: "L-001", qty: 1 }])], { id: "oC", neededBy: "2026-03-01" }),
    ],
  });
  const plan = call("planReservedStockWithdrawal", "L-001", 1);
  assert.equal(plan.fromFree, 0);
  assert.equal(plan.shortfall, 0);
  assert.equal(plan.takes.length, 1);
  assert.equal(plan.takes[0].order.id, "oC");
  assert.equal(plan.takes[0].take, 1);
  assert.equal(plan.takes[0].reservedBefore, 1);
  assert.equal(plan.takes[0].reservedAfter, 0);
  assert.equal(plan.takes[0].missingBefore, 0);
  assert.equal(plan.takes[0].missingAfter, 1);
}

function testFreeStockIsAlwaysSpentBeforeAnyReservation() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 10)],
    orders: [order("oA", [item("iA", "p-fv", 4, [{ batchCode: "L-001", qty: 4 }])], { neededBy: "2026-02-01" })],
  });
  const plan = call("planReservedStockWithdrawal", "L-001", 6);
  assert.equal(plan.fromFree, 6);
  assert.deepEqual(plain(plan.takes.map((t) => t.take)), []);
}

function testAWithdrawalLargerThanTheShelfReportsAShortfall() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 5)],
    orders: [order("oA", [item("iA", "p-fv", 5, [{ batchCode: "L-001", qty: 5 }])])],
  });
  const plan = call("planReservedStockWithdrawal", "L-001", 9);
  assert.equal(plan.fromFree, 0);
  assert.equal(plan.takes.reduce((sum, take) => sum + take.take, 0), 5);
  assert.equal(plan.shortfall, 4);
}

// This is the bug that was found by hand during the quick-sale work:
// orderItemAllocations rebuilds an allocation from batchCode + reservedQty when
// the array is empty, so a sold bottle reappeared as still reserved.
function testASoldBottleDoesNotReappearAsReserved() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 1)],
    orders: [
      order("oC", [item("iC", "p-fv", 1, [{ batchCode: "L-001", qty: 1 }], { reservedQty: 1, producedQty: 1, batchCode: "L-001" })]),
    ],
  });
  const target = admin.__getState().orders[0].items[0];
  assert.equal(call("removeAllocationFromItem", target, "L-001", 1), 1);
  assert.equal(call("orderItemReservedQty", target), 0);
  assert.deepEqual(plain(call("orderItemAllocations", target)), []);
  assert.equal(target.reservedQty, 0);
  assert.equal(target.producedQty, 0);
  assert.equal(target.batchCode, "");
}

function testRemovingOneBatchLeavesTheOtherBatchesOnTheLine() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 5), batch("L-002", "p-fv", 5)],
    orders: [
      order("o1", [item("i1", "p-fv", 10, [{ batchCode: "L-001", qty: 5 }, { batchCode: "L-002", qty: 5 }])]),
    ],
  });
  const target = admin.__getState().orders[0].items[0];
  call("removeAllocationFromItem", target, "L-001", 3);
  assert.equal(call("orderItemReservedQty", target), 7);
  assert.deepEqual(plain(call("orderItemBatchCodes", target)), ["L-001", "L-002"]);
  assert.equal(call("orderItemAllocations", target).find((a) => a.batchCode === "L-001").qty, 2);
}

function testApplyingAWithdrawalUpdatesTheOrdersAndWritesHistory() {
  load({
    products: PRODUCTS,
    // Fully reserved, so the sale has to come out of a reservation.
    batches: [batch("L-001", "p-fv", 5)],
    orders: [
      order("oA", [item("iA", "p-fv", 4, [{ batchCode: "L-001", qty: 4 }])], { id: "oA", neededBy: "2026-02-01" }),
      order("oC", [item("iC", "p-fv", 1, [{ batchCode: "L-001", qty: 1 }])], { id: "oC", neededBy: "2026-03-01" }),
    ],
  });
  const before = admin.__getState().audit.length;
  const plan = call("planReservedStockWithdrawal", "L-001", 1);
  call("applyReservedStockWithdrawal", plan, "venda balcão");
  const after = admin.__getState();
  assert.equal(call("orderItemReservedQty", after.orders[1].items[0]), 0);
  // The untouched order keeps every bottle it held.
  assert.equal(call("orderItemReservedQty", after.orders[0].items[0]), 4);
  assert.equal(after.audit.length, before + 1);
  assert.match(after.audit[0].detail, /L-001/);
  assert.match(after.audit[0].detail, /venda balcão/);
}

// Taking a bottle away must also drop the manual target, or the next automatic
// pass tries to hold a bottle that has already been sold.
function testAWithdrawalClearsTheManualTargetItInvalidates() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 5)],
    orders: [order("oA", [item("iA", "p-fv", 5, [{ batchCode: "L-001", qty: 3 }])])],
  });
  const state = admin.__getState();
  call("setOrderItemReservation", state.orders[0], state.orders[0].items[0], 5, "reserva firme");
  assert.equal(state.orders[0].items[0].reservationOverride.reservedNow, 5);
  const plan = call("planReservedStockWithdrawal", "L-001", 2);
  call("applyReservedStockWithdrawal", plan, "venda");
  assert.equal(admin.__getState().orders[0].items[0].reservationOverride, null);
  assert.equal(call("orderItemReservedQty", admin.__getState().orders[0].items[0]), 3);
}

// --- Cross-cutting rules ---------------------------------------------------

function testVolumesAreNeverMixed() {
  load({
    products: PRODUCTS,
    batches: [batch("L-500", "p-fv-500", 50)],
    orders: [order("o1", [item("i1", "p-fv", 10, [])])],
  });
  // A 500ml batch can never cover a 350ml line, even though the flavour matches.
  assert.equal(call("freeStockForOrderItem", admin.__getState().orders[0].items[0]), 0);
}

function testClosedOrdersDoNotHoldStockBackFromNewSales() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 10)],
    orders: [
      order("o1", [item("i1", "p-fv", 10, [{ batchCode: "L-001", qty: 10 }])], { status: "entregue" }),
    ],
  });
  // The order keeps its lot for traceability, but a delivered order is not
  // holding shelf stock any more.
  assert.equal(call("batchStockBreakdown", "L-001").reserved, 0);
  assert.deepEqual(plain(call("orderItemBatchCodes", admin.__getState().orders[0].items[0])), ["L-001"]);
}

function testACancelledBatchIsNotSellableStock() {
  load({
    products: PRODUCTS,
    batches: [batch("L-001", "p-fv", 10, { status: "descartado" })],
    orders: [order("o1", [item("i1", "p-fv", 10, [])])],
  });
  assert.equal(call("batchStockBreakdown", "L-001"), null);
  assert.equal(call("freeStockForOrderItem", admin.__getState().orders[0].items[0]), 0);
}

// --- sales ledger viewer ---------------------------------------------------

function loadLedger(ledger) {
  admin.__incoming = {
    sales: [],
    nextCursor: null,
    search: "",
    from: "",
    to: "",
    loading: false,
    error: "",
    unavailable: false,
    ...ledger,
  };
  admin.__eval("salesLedger = __incoming;");
}

const ledgerSale = (extra = {}) => ({
  id: "s1",
  date: "2026-08-12",
  movementType: "venda",
  customerName: "Divina Terra",
  flavor: "Frutas Vermelhas",
  batchCode: "L-001",
  qty: 2,
  unitPrice: 10,
  discount: 0,
  delivery: 5,
  revenue: 20,
  note: "",
  ...extra,
});

// Everything here came from a text field somebody typed, so it has to be escaped
// on the way out exactly like the rest of the admin.
function testTheLedgerEscapesEverythingItRenders() {
  loadLedger({
    sales: [
      ledgerSale({
        customerName: '<img src=x onerror=alert(1)>',
        flavor: "Frutas <b>Vermelhas</b>",
        note: '"><script>alert(2)</script>',
      }),
    ],
  });
  const html = admin.__eval("salesLedgerMarkup()");
  assert.ok(!html.includes("<img"), "an injected img must not survive");
  assert.ok(!html.includes("<script"), "an injected script must not survive");
  assert.ok(!html.includes("<b>"), "injected markup must not survive");
  assert.ok(html.includes("&lt;img") && html.includes("&lt;script"), "it is escaped, not stripped");
}

// The figure is the sum of what is on screen. Calling it a period total would be
// simply wrong whenever another page is waiting.
function testTheLedgerTotalOnlyClaimsTheRowsItLoaded() {
  loadLedger({
    sales: [ledgerSale({ revenue: 20 }), ledgerSale({ id: "s2", revenue: 15 })],
    nextCursor: "2026-08-11|2",
  });
  const html = admin.__eval("salesLedgerMarkup()");
  assert.ok(html.includes("Total das 2 vendas carregadas"), "the total names what it counted");
  assert.ok(html.includes("35,00"), "it sums the stored revenue of the loaded rows");
  assert.ok(html.includes("há mais registros a carregar"), "and says when the figure is partial");

  loadLedger({ sales: [ledgerSale({ revenue: 20 })], nextCursor: null });
  assert.ok(
    !admin.__eval("salesLedgerMarkup()").includes("há mais registros"),
    "a complete page does not warn about more",
  );
}

function testTheLedgerNamesEachKindOfMovement() {
  loadLedger({
    sales: [
      ledgerSale({ movementType: "venda" }),
      ledgerSale({ id: "s2", movementType: "perda", revenue: 0 }),
      ledgerSale({ id: "s3", movementType: "devolucao", qty: -2, revenue: 0 }),
      ledgerSale({ id: "s4", movementType: "presente", revenue: 0 }),
    ],
  });
  const html = admin.__eval("salesLedgerMarkup()");
  ["Venda", "Baixa", "Devolução", "Cortesia"].forEach((label) => {
    assert.ok(html.includes(label), `${label} must be named rather than shown as a raw code`);
  });
  // Only the sale earned anything, so the total must not count the rest.
  // (Intl's pt-BR currency puts a non-breaking space after R$, so match the
  // number rather than the whole string.)
  const totalLine = html.split("\n").find((line) => line.includes("Total das")) || "";
  assert.ok(totalLine.includes("Total das 4 vendas carregadas"), "every movement is listed");
  assert.ok(/20,00/.test(totalLine), "but only the sale contributes revenue");
  assert.ok(!/80,00/.test(totalLine), "a write-off must not be counted as income");
}

function testTheLedgerSaysWhenItIsNotAvailableYet() {
  loadLedger({ sales: [], unavailable: true });
  const html = admin.__eval("salesLedgerMarkup()");
  assert.ok(html.includes("ainda não está disponível"), "a missing table is explained, not silent");
  assert.ok(!html.includes("Total das"), "and no total is claimed when there is nothing");
}

const tests = [
  testACardReportsReservedAndMissingSeparately,
  testOrderStatusFollowsWhatIsStillMissing,
  testDeliveredBottlesLeaveTheOutstandingCount,
  testReducingAReservationReleasesStockWithoutGivingItAway,
  testAReservationCannotExceedWhatWasOrdered,
  testAReservationCannotExceedTheStockThatExists,
  testAdjustingOneFlavourLeavesTheOthersAlone,
  testAManualNumberSurvivesTheAutomaticRefresh,
  testLaterProductionDoesNotOverrideAManualNumber,
  testNewProductionNeverMovesAnExistingReservation,
  testNewProductionTagsTheSaveSoTheServerAgrees,
  testAnOrdinaryRefreshMovesNothingBetweenOrders,
  testRepeatingAnOrderCopiesOnlyWhatWasBought,
  testRepeatingAnOrderRepricesAtTodaysTable,
  testPreviousOrdersAreFoundByEitherNameAndNewestFirst,
  testAnOrderWithNoLinesIsNotOfferedForRepeating,
  testTheBreakdownSeparatesPhysicalStockFromFreeStock,
  testAWithdrawalTakesFromTheOrderThatNeedsItLatest,
  testFreeStockIsAlwaysSpentBeforeAnyReservation,
  testAWithdrawalLargerThanTheShelfReportsAShortfall,
  testASoldBottleDoesNotReappearAsReserved,
  testRemovingOneBatchLeavesTheOtherBatchesOnTheLine,
  testApplyingAWithdrawalUpdatesTheOrdersAndWritesHistory,
  testAWithdrawalClearsTheManualTargetItInvalidates,
  testVolumesAreNeverMixed,
  testClosedOrdersDoNotHoldStockBackFromNewSales,
  testACancelledBatchIsNotSellableStock,
  testTheLedgerEscapesEverythingItRenders,
  testTheLedgerTotalOnlyClaimsTheRowsItLoaded,
  testTheLedgerNamesEachKindOfMovement,
  testTheLedgerSaysWhenItIsNotAvailableYet,
];

tests.forEach((test) => test());
console.log(`Admin logic regression: ${tests.length} scenarios passed.`);
