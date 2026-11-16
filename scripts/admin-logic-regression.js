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

// With the server figure in hand the panel must show the PERIOD, not the page.
function testTheLedgerShowsTheServerPeriodTotalNotThePage() {
  loadLedger({
    sales: [ledgerSale({ revenue: 20 })],
    nextCursor: "2026-08-11|2",
    totals: {
      count: 5,
      qty: 12,
      revenue: 100,
      freight: 5,
      discount: 2,
      byMovement: {
        venda: { count: 2, qty: 10, revenue: 100 },
        perda: { count: 1, qty: 3, revenue: 0 },
        devolucao: { count: 1, qty: -2, revenue: 0 },
      },
    },
  });
  const html = admin.__eval("salesLedgerMarkup()");
  // Match the period line itself: the breakdown below it also prints 100,00, so
  // searching the whole document would pass even if the header were wrong.
  const periodLine = html.split("\n").find((line) => line.includes("Receita do período")) || "";
  assert.ok(periodLine, "the period is named as such");
  assert.ok(/100,00/.test(periodLine), "and carries the server total");
  assert.ok(!/105,00/.test(periodLine), "with freight kept out of it");
  assert.ok(!html.includes("vendas carregadas"), "the page-only line gives way to the real figure");
  assert.ok(html.includes("não incluído na receita"), "freight is shown apart from revenue");
  assert.ok(html.includes("Baixa: 1 (3 un)"), "write-offs are visible in the breakdown");
  assert.ok(html.includes("Devolução: 1 (-2 un)"), "a return shows as negative");
}

function testAPeriodTooBigToSumSaysSo() {
  loadLedger({
    totals: { count: 5000, qty: 5000, revenue: 50000, freight: 0, discount: 0, byMovement: { venda: { count: 5000, qty: 5000, revenue: 50000 } } },
    totalsPartial: true,
  });
  const html = admin.__eval("salesLedgerMarkup()");
  assert.ok(html.includes("muito grande"), "a capped total must not pass as complete");
  assert.ok(html.includes("Estreite as datas"), "and must say how to get an exact one");
}

// If the server figure cannot be had, the honest page-only line comes back
// rather than a blank or, worse, a page sum labelled as the period.
function testTheLedgerFallsBackHonestlyWithoutServerTotals() {
  loadLedger({ sales: [ledgerSale({ revenue: 20 })], totals: null });
  const html = admin.__eval("salesLedgerMarkup()");
  assert.ok(html.includes("Total da 1 venda carregada"), "one row reads as one venda, not '1 vendas'");
  assert.ok(!html.includes("Receita do período"), "and never claims to be the period");
}

function testTheLedgerSaysWhenItIsNotAvailableYet() {
  loadLedger({ sales: [], unavailable: true });
  const html = admin.__eval("salesLedgerMarkup()");
  assert.ok(html.includes("ainda não está disponível"), "a missing table is explained, not silent");
  assert.ok(!html.includes("Total das"), "and no total is claimed when there is nothing");
}

function testOrderDateWinsOverLateDataEntry() {
  load({ products: PRODUCTS, batches: [batch("L", "p-fv", 10)], orders: [
    order("new", [item("new-i", "p-fv", 10)], { orderDate: "2026-08-10", createdAt: "2026-08-10T10:00:00Z" }),
    order("old", [item("old-i", "p-fv", 10)], { orderDate: "2026-08-03", createdAt: "2026-09-18T10:00:00Z" }),
  ] });
  call("autoAllocateOrderStock");
  assert.deepEqual(admin.__getState().orders.map(o => call("orderItemReservedQty", o.items[0])), [0, 10]);
  assert.equal(admin.__eval("pendingReservationRequest.mode"), "recalculate");
}

function testGlobalAutoAllocationClearsManualOverrides() {
  load({
    products: PRODUCTS,
    batches: [batch("L-auto", "p-fv", 10)],
    orders: [order("manual", [item("manual-i", "p-fv", 10, [], {
      reservationOverride: { active: true, persistent: true, reservedNow: 0 },
    })])],
  });
  const state = admin.__getState();
  call("autoAllocateOrderStock");
  assert.equal(call("orderItemReservedQty", state.orders[0].items[0]), 0, "ordinary saves respect a manual zero ceiling");

  call("forceAutomaticOrderReservations");
  const line = admin.__getState().orders[0].items[0];
  assert.equal(line.reservationOverride, null, "the global action removes the manual ceiling");
  assert.equal(call("orderItemReservedQty", line), 10, "the global action allocates matching free stock");
  assert.equal(line.allocations.every((allocation) => allocation.manual === false), true);
}

function testReleasedBottlesHaveAnExplicitDestination() {
  for (const destination of ["free", "auto", JSON.stringify(["new", "new-i"])]) {
    const state = load({ products: PRODUCTS, batches: [batch("L", "p-fv", 10)], orders: [
      order("source", [item("source-i", "p-fv", 10, [{ batchCode: "L", qty: 10 }])]),
      order("old", [item("old-i", "p-fv", 10)], { orderDate: "2026-01-01" }),
      order("new", [item("new-i", "p-fv", 10)], { orderDate: "2026-01-20" }),
      order("wrong", [item("wrong-i", "p-fv-500", 10)], { orderDate: "2025-01-01" }),
    ] });
    const source = state.orders[0], line = source.items[0];
    const before = plain(line.allocations);
    call("setOrderItemReservation", source, line, 5, "teste");
    const moved = call("redirectReleasedReservations", source, line, before, destination, "teste");
    assert.equal(moved, destination === "free" ? 0 : 5);
    const qty = state.orders.map(o => call("orderItemReservedQty", o.items[0]));
    assert.deepEqual(qty, destination === "free" ? [5,0,0,0] : destination === "auto" ? [5,5,0,0] : [5,0,5,0]);
    assert.equal(call("batchAvailableStock", "L"), destination === "free" ? 5 : 0);
    if (destination !== "free") {
      state.batches.push(batch("L-new", "p-fv", 5, { createdAt: "2099-01-01T00:00:00Z" }));
      call("autoAllocateOrderStock");
      assert.equal(call("orderItemReservedQty", line), 5, "manual choice persists across new stock and recalculation");
      if (destination !== "auto") assert.equal(call("orderItemReservedQty", state.orders[2].items[0]), 5);
      call("restoreAutomaticOrderReservations", source);
      assert.equal(line.reservationOverride, null);
      assert.equal(line.allocations.some(a => a.manual), false);
    }
  }
}

const tests = [
  testOrderDateWinsOverLateDataEntry,
  testGlobalAutoAllocationClearsManualOverrides,
  testReleasedBottlesHaveAnExplicitDestination,
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
  testTheLedgerShowsTheServerPeriodTotalNotThePage,
  testAPeriodTooBigToSumSaysSo,
  testTheLedgerFallsBackHonestlyWithoutServerTotals,
];

tests.forEach((test) => test());
console.log(`Admin logic regression: ${tests.length} scenarios passed.`);

// Month boundaries, stock-independent financial periods, and incomplete costs.
{
  load({ packaging: [],
    batches: [{ code: "MONTH", costSnapshot: { costPerBottle: 4 } }],
    sales: [
      { date: "2026-09-01", batchCode: "MONTH", qty: 10, unitPrice: 20, discount: 10, delivery: 50 },
      { date: "2026-09-30", batchCode: "MONTH", qty: 2, unitPrice: 20, movementType: "brinde" },
      { date: "2026-08-31", batchCode: "MONTH", qty: 100, unitPrice: 20 },
      { date: "2026-10-01", batchCode: "MONTH", qty: 100, unitPrice: 20 },
    ], expenses: [{ date: "2026-09-10", amount: 30 }, { date: "2026-08-10", amount: 1000 }, { date: "2026-09-10", amount: 500, purchaseId: "stock-buy" }, { date: "2026-09-11", amount: 5, purchaseId: "op-buy" }],
    purchases: [{ id: "stock-buy", date: "2026-09-10", total: 500, kind: "ingredient" }, { id: "op-buy", kind: "operational", total: 5 }],
  });
  const result = call("dashboardFinancials", "2026-09");
  assert.equal(result.revenue, 190, "month revenue excludes other months, gifts and freight, and deducts discounts");
  assert.equal(result.cogs, 48, "all current-month inventory exits incur their snapshot cost");
  assert.equal(result.expenses, 35, "only current-month expenses count");
  assert.equal(result.net, 107, "do not deduct inventory purchases a second time");
  assert.equal(call("totals").expenses, 1035, "reports share the inventory-purchase exclusion and keep operational purchases");
  assert.equal(call("dashboardFinancials", "2024-02").range.end, "2024-02-29");
  assert.equal(call("dashboardFinancials", "2026-12").range.end, "2026-12-31");
  assert.equal(call("dashboardFinancials", "2027-01").net, 0, "empty month is zero");
  admin.__getState().sales.push({ date: "2026-09-15", batchCode: "MISSING", qty: 1, unitPrice: 20 });
  assert.equal(call("dashboardFinancials", "2026-09").unknownCosts, 1, "unlinked batch is not silently free");
  admin.__eval('dashboardMonth = "2026-09"');
  const html = call("renderDashboard");
  assert.ok(html.includes("Custo incompleto"), "unknown cost suppresses misleading profit");
  assert.ok(html.includes('data-action="new-batch"'), "the dashboard keeps a direct new-batch action");
  assert.ok(html.indexOf('aria-label="Indicadores principais"') < html.indexOf('data-dashboard-panel="reservations"'), "headline figures precede detailed operations");
}
console.log("Dashboard regression: monthly finances, missing costs and overview hierarchy passed.");

{
  load({ packaging: [], sales: [{ date: "2026-09-01", batchCode: "GIFT", flavor: "Gift test", qty: 2, unitPrice: 20, movementType: "brinde" }], batches: [{ code: "GIFT", costSnapshot: { costPerBottle: 4 } }] });
  const report = call("renderReports");
  const giftRow = report.match(/<div class="report-row"><strong>Gift test<\/strong><span>(.*?)<\/span>/)?.[1] || "";
  assert.match(giftRow, /0,00 receita/, "flavor reports must not turn gifts into revenue");
}


// A correction to zero must clear the amount used in financial reporting.
{
  const purchase = { id: "corrected-purchase", kind: "operational", item: "Maintenance", date: "2026-11-14", total: 80 };
  load({ purchases: [purchase] });
  call("syncPurchaseExpense", purchase);
  assert.equal(call("totals").expenses, 80);
  purchase.total = 0;
  call("syncPurchaseExpense", purchase);
  assert.equal(call("totals").expenses, 0);
  assert.equal(admin.__getState().expenses.length, 1);
  console.log("Purchase correction: zero total reconciles with the linked expense.");
}

// An uncosted sale still contributes revenue but cannot establish profit.
{
  load({ sales: [{ id: "uncosted-sale", date: "2026-11-14", flavor: "Ginger", qty: 2, unitPrice: 15 }] });
  assert.equal(call("totals").salesRevenue, 30);
  assert.equal(call("totals").unknownCosts, 1);
  assert.equal(call("dashboardFinancials", "2026-11").unknownCosts, 1);
  assert.match(call("renderReports"), /lucro indisponível/);
  console.log("Reports: uncosted sale retains revenue and withholds profit.");
}

// Purchases value stock at weighted average cost (owner decision, 15 November
// 2026). Receiving blends the purchase price with the stock already on hand;
// taking a purchase back out (edit or delete) removes its value again.
{
  const ingredient = { id: "tea", name: "Tea", purchaseUnit: "g", stock: 1000, costPerUnit: 0.025 };
  load({ ingredients: [ingredient] });
  const item = () => admin.__getState().ingredients[0];
  // 1000 g at 0.025 plus 1000 g bought for R$ 35 (0.035/g) averages to 0.030.
  call("receiveAtAverageCost", "ingredients", item(), 1000, 0.035);
  assert.equal(item().stock, 2000);
  assert.equal(item().costPerUnit, 0.03);
  // Consumption does not change the average.
  item().stock = 500;
  // Taking the 1000 g purchase back out of 500 g leaves a real 500 g deficit,
  // which is kept (negative stock is allowed and flagged), and the average is
  // kept rather than invented.
  call("returnAtAverageCost", "ingredients", item(), 1000, 0.035);
  assert.equal(item().stock, -500);
  assert.equal(item().costPerUnit, 0.03);
  // With nothing on hand the next purchase sets the price outright; it first
  // covers the deficit.
  call("receiveAtAverageCost", "ingredients", item(), 900, 0.04);
  assert.equal(item().stock, 400);
  assert.equal(item().costPerUnit, 0.04);
  // Reversal with stock left: 400 g at 0.04 + 600 g at 0.02 = 0.028 average;
  // removing the 600 g purchase restores 0.04.
  call("receiveAtAverageCost", "ingredients", item(), 600, 0.02);
  assert.equal(item().costPerUnit, 0.028);
  call("returnAtAverageCost", "ingredients", item(), 600, 0.02);
  assert.equal(item().stock, 400);
  assert.equal(item().costPerUnit, 0.04);
  // Stock with no known cost is valued at the incoming price, not at zero.
  const uncosted = { id: "box", name: "Box", unit: "un", stock: 50, costEach: 0 };
  load({ packaging: [uncosted] });
  call("receiveAtAverageCost", "packaging", admin.__getState().packaging[0], 50, 1.2);
  assert.equal(admin.__getState().packaging[0].stock, 100);
  assert.equal(admin.__getState().packaging[0].costEach, 1.2);
  console.log("Purchase costing: weighted average on receipt, reversal, empty stock and uncosted stock passed.");
}

// Production may take supplies below zero after a warning (owner decision, 15
// November 2026). The shortfall check nets returns against new consumption and
// the dashboard lists every negative supply until it is covered.
{
  const recipe = { id: "r", flavor: "Tea", bottleMl: 500, yieldBottles: 1, ingredients: [{ ingredientId: "tea", qty: 10, unit: "g" }], packaging: [{ itemId: "bottle", qty: 1 }] };
  load({
    recipes: [recipe],
    ingredients: [{ id: "tea", name: "Tea", purchaseUnit: "g", stock: 100, costPerUnit: 0.03, stockCountedAt: "2026-11-15T10:00:00Z" }],
    packaging: [{ id: "bottle", name: "Bottle", unit: "un", stock: 50, costEach: 1 }],
  });
  const state = () => admin.__getState();
  const shortfalls = (consumptions) => plain(call("supplyShortfalls", consumptions)).map((row) => [row.item.id, row.qty, row.after]);
  // 8 bottles need 80 g tea and 8 bottles: enough of both.
  assert.deepEqual(shortfalls([{ recipe: state().recipes[0], bottles: 8 }]), []);
  // 12 bottles need 120 g tea: 20 g short. Bottles are fine. 60 bottles would
  // also exhaust the 50 bottles, but bottles were never counted or bought, so
  // only the tracked tea is reported.
  assert.deepEqual(shortfalls([{ recipe: state().recipes[0], bottles: 60 }]), [["tea", 600, -500]]);
  assert.deepEqual(shortfalls([{ recipe: state().recipes[0], bottles: 12 }]), [["tea", 120, -20]]);
  // Editing a 12-bottle batch to 14 only consumes 2 more: no shortfall.
  assert.deepEqual(shortfalls([{ recipe: state().recipes[0], bottles: -12 }, { recipe: state().recipes[0], bottles: 14 }]), []);
  // Accepting the warning keeps the true negative and flags it on the dashboard.
  call("applyBatchInventory", state().recipes[0], 12, -1);
  assert.equal(state().ingredients[0].stock, -20);
  assert.deepEqual(plain(call("negativeStockSupplies")).map((row) => row.item.id), ["tea"]);
  // An untracked supply that goes negative is not flagged.
  state().packaging[0].stock = -5;
  assert.deepEqual(plain(call("negativeStockSupplies")).map((row) => row.item.id), ["tea"]);
  assert.match(call("renderDashboard"), /Estoque negativo: Tea/);
  // A purchase covering the deficit clears the alert.
  call("receiveAtAverageCost", "ingredients", state().ingredients[0], 1000, 0.025);
  assert.equal(state().ingredients[0].stock, 980);
  assert.deepEqual(plain(call("negativeStockSupplies")), []);
  assert.doesNotMatch(call("renderDashboard"), /Estoque negativo/);
  console.log("Supply shortfalls: netted check, kept negative balance, dashboard flag and clearing purchase passed.");
}

// Bottles may be sold beyond stock after a warning (owner decision, 15 November
// 2026). The excess is a sale with no batch: revenue counts, profit waits, and
// the next batch of that product absorbs it, oldest sale first, without ever
// over-allocating the batch on the server's own invariant check.
{
  const { stateInvariantViolations } = require("../api/_lib/kombu-backend");
  const product = { id: "p", item: "KMB1", flavor: "Tea", sizeMl: 500, retailPrice: 20, wholesalePrice: 15, status: "ativo" };
  const recipe = { id: "r", productId: "p", flavor: "Tea", bottleMl: 500, yieldBottles: 1, ingredients: [], packaging: [] };
  load({ products: [product], recipes: [recipe], packaging: [] });
  const state = () => admin.__getState();
  const sale = (fields) => call("recordPendingSale", { date: "2026-11-10", customerName: "Ana", movementType: "venda", priceType: "varejo", productId: "p", flavor: "Tea", unitPrice: 20, discount: 0, delivery: 0, ...fields });
  assert.equal(call("productPhysicalStock", "p"), 0);
  sale({ qty: 7, customerName: "Ana", date: "2026-11-10" });
  sale({ qty: 5, customerName: "Bia", date: "2026-11-12", discount: 4 });
  assert.equal(call("pendingSaleQuantity", "p"), 12);
  // Revenue counts now; profit is withheld while the cost is unknown.
  assert.equal(call("totals").salesRevenue, 12 * 20 - 4);
  assert.equal(call("totals").unknownCosts, 2);
  assert.match(call("renderDashboard"), /Vendido sem estoque/);

  // A 10-bottle batch takes Ana's 7 whole and 3 of Bia's 5, oldest first.
  const batch = { id: "b1", code: "L1", productId: "p", recipeId: "r", flavor: "Tea", sizeMl: 500, actual: 10, date: "2026-11-15", status: "aprovado", costSnapshot: { version: 1, costPerBottle: 4, yieldBottles: 1 } };
  state().batches.push(batch);
  assert.equal(call("linkPendingSalesToBatch", state().batches[0]), 10);
  const linked = plain(state().sales).filter((row) => row.batchCode === "L1");
  assert.deepEqual(linked.map((row) => [row.customerName, row.qty]).sort(), [["Ana", 7], ["Bia", 3]]);
  const pending = plain(state().sales).filter((row) => row.pendingBatch);
  assert.deepEqual(pending.map((row) => [row.customerName, row.qty, row.discount]), [["Bia", 2, 4]], "the discount stays once, on the part still pending");
  assert.equal(call("pendingSaleQuantity", "p"), 2);
  assert.equal(call("batchStockBreakdown", "L1").physical, 0);
  assert.equal(call("totals").salesRevenue, 12 * 20 - 4, "splitting does not change revenue");
  assert.equal(stateInvariantViolations(plain(state())).byRule.batch_over_allocated, 0);

  // The server accepts a pending sale and its reconciliation leaves it alone.
  const { reconcileReservations } = require("../api/_lib/reservations");
  const { validateAppState } = require("../api/_lib/kombu-backend");
  assert.equal(validateAppState(plain(state())), "", "a valid state has no error code");
  const reconciled = reconcileReservations(plain(state()), { reservationMode: "preserve", audit: false }).state;
  assert.deepEqual(reconciled.sales.filter((row) => row.pendingBatch).map((row) => [row.customerName, row.qty]), [["Bia", 2]]);
  assert.equal(reconciled.sales.filter((row) => row.batchCode === "L1").reduce((sum, row) => sum + row.qty, 0), 10);

  // The next batch absorbs the rest; the flag clears and profit becomes known.
  state().batches.push({ ...batch, id: "b2", code: "L2", actual: 6 });
  assert.equal(call("linkPendingSalesToBatch", state().batches[1]), 2);
  assert.equal(call("pendingSaleQuantity", "p"), 0);
  assert.equal(call("batchStockBreakdown", "L2").physical, 4);
  assert.equal(call("totals").unknownCosts, 0);
  assert.doesNotMatch(call("renderDashboard"), /Vendido sem estoque/);
  assert.equal(stateInvariantViolations(plain(state())).byRule.batch_over_allocated, 0);
  console.log("Pending-batch sales: revenue now, profit later, oldest-first linking with splits, and no batch over-allocation passed.");
}

// One access level with full access (owner decision, 15 November 2026): no
// screen renders a disabled action and no action is silently ignored.
{
  load({ products: [], packaging: [] });
  ["renderDashboard", "renderPurchases", "renderSales", "renderOrders", "renderStock", "renderReports", "renderPartners", "renderExpenses"].forEach((view) => {
    assert.doesNotMatch(call(view), /aria-disabled="true"|modo leitura/, `${view} renders a disabled action`);
  });
  assert.equal(admin.__eval("typeof canWrite"), "undefined");
  console.log("Access: one full-access level, no disabled actions or read-only notices passed.");
}

// Financial reconciliation: every money figure ties back to its records, to
// the cent, and the months add up to the all-time totals. October: 10 bottles
// at R$ 22 less a R$ 5 discount and 2 gifted, all from a batch that cost R$ 4
// a bottle; a R$ 100 expense. November: 5 at R$ 15 plus R$ 8 delivery and 1
// lost, from a batch at R$ 5; 3 sold before any batch existed; a R$ 40
// operating purchase and a R$ 300 stock purchase (which reaches profit through
// batch costs, never as an expense).
{
  const snapshot = (cost) => ({ version: 1, costPerBottle: cost, yieldBottles: 1 });
  load({
    products: [{ id: "p", item: "K1", flavor: "Tea", sizeMl: 500, retailPrice: 22, wholesalePrice: 15, status: "ativo" }],
    recipes: [{ id: "r", productId: "p", flavor: "Tea", bottleMl: 500, yieldBottles: 1, ingredients: [], packaging: [] }],
    packaging: [],
    batches: [
      { id: "b1", code: "OCT", productId: "p", recipeId: "r", flavor: "Tea", sizeMl: 500, actual: 20, date: "2026-10-01", status: "aprovado", costSnapshot: snapshot(4) },
      { id: "b2", code: "NOV", productId: "p", recipeId: "r", flavor: "Tea", sizeMl: 500, actual: 20, date: "2026-11-01", status: "aprovado", costSnapshot: snapshot(5) },
    ],
    sales: [
      { id: "s1", date: "2026-10-05", batchCode: "OCT", productId: "p", flavor: "Tea", movementType: "venda", qty: 10, unitPrice: 22, discount: 5, delivery: 0 },
      { id: "s2", date: "2026-10-31", batchCode: "OCT", productId: "p", flavor: "Tea", movementType: "presente", qty: 2, unitPrice: 0, discount: 0, delivery: 0 },
      { id: "s3", date: "2026-11-01", batchCode: "NOV", productId: "p", flavor: "Tea", movementType: "venda", qty: 5, unitPrice: 15, discount: 0, delivery: 8 },
      { id: "s4", date: "2026-11-20", batchCode: "NOV", productId: "p", flavor: "Tea", movementType: "perda", qty: 1, unitPrice: 0, discount: 0, delivery: 0 },
      { id: "s5", date: "2026-11-21", batchCode: "", pendingBatch: true, productId: "p", flavor: "Tea", movementType: "venda", qty: 3, unitPrice: 20, discount: 0, delivery: 0 },
    ],
    purchases: [
      { id: "op", kind: "operational", date: "2026-11-10", item: "Gás", total: 40 },
      { id: "st", kind: "stock", date: "2026-11-02", item: "Açúcar", total: 300, qty: 60000, unit: "g" },
    ],
    expenses: [{ id: "e1", date: "2026-10-15", category: "Aluguel", description: "Aluguel", amount: 100 }],
  });
  call("syncPurchaseExpense", admin.__getState().purchases[0]);
  call("syncPurchaseExpense", admin.__getState().purchases[1]);
  const cents = (value) => Math.round(value * 100);
  const october = plain(call("dashboardFinancials", "2026-10"));
  const november = plain(call("dashboardFinancials", "2026-11"));
  assert.deepEqual([cents(october.revenue), cents(october.cogs), cents(october.expenses), cents(october.net), october.unknownCosts], [21500, 4800, 10000, 6700, 0]);
  assert.deepEqual([cents(november.revenue), cents(november.cogs), cents(november.expenses), november.unknownCosts], [13500, 3000, 4000, 1], "the batchless sale makes November's cost incomplete");
  const total = plain(call("totals"));
  assert.equal(cents(total.salesRevenue), cents(october.revenue + november.revenue), "months add up to the total revenue");
  assert.equal(cents(total.cogs), cents(october.cogs + november.cogs));
  assert.equal(cents(total.expenses), cents(october.expenses + november.expenses), "the stock purchase is not an expense");
  assert.equal(cents(total.deliveryFees), 800, "delivery is reported apart from revenue");
  assert.equal(total.unknownCosts, 1);
  admin.__eval(`dashboardMonth = "2026-11"`);
  assert.match(call("renderDashboard"), /Custo incompleto/, "the dashboard never shows a profit it cannot compute");

  // Per-sale profit in Vendas: a sale whose cost is unknown shows no profit.
  admin.__eval('currentSalesPeriod = "custom"; salesCustomStart = "2026-11-01"; salesCustomEnd = "2026-11-30";');
  const salesScreen = call("renderSales");
  assert.match(salesScreen, /Lucro<\/small><strong>R\$\s50,00/, "5 x 15 less 5 x 5 cost");
  assert.match(salesScreen, /Lucro<\/small><strong>Custo pendente/, "unknown cost is said, not shown as profit");
  assert.doesNotMatch(salesScreen, /Lucro<\/small><strong>R\$\s60,00/, "the batchless sale's R$ 60 is not profit");

  // Despesas tells stock purchases apart from what the dashboard counts.
  const expensesScreen = call("renderExpenses");
  assert.match(expensesScreen, /no custo dos lotes/);
  assert.match(expensesScreen, /Despesas que entram no resultado: <strong>R\$\s140,00<\/strong>\. Compras de estoque: <strong>R\$\s300,00/);

  // The CSV carries money in cents, never floating point noise.
  admin.__getState().expenses.push({ id: "e2", date: "2026-11-25", category: "Taxas", description: "Tarifa", amount: 0.1 }, { id: "e3", date: "2026-11-26", category: "Taxas", description: "Tarifa", amount: 0.2 });
  admin.__eval("window.__csv = null; exportCSV = (name, rows) => { window.__csv = rows; };");
  call("handleAction", "export-reports");
  const csv = plain(admin.__eval("window.__csv"));
  csv.slice(1).forEach(([label, value]) => assert.ok(value === "" || /^-?\d+(\.\d{1,2})?$/.test(String(value)), `${label} is not in cents: ${value}`));
  assert.deepEqual(csv.find((row) => row[0] === "Receita (sem frete)"), ["Receita (sem frete)", 350]);
  assert.deepEqual(csv.find((row) => row[0] === "Despesas"), ["Despesas", 140.3], "0.10 + 0.20 is 0.30, not 0.30000000000000004");
  console.log("Financial reconciliation: monthly revenue, cost, expenses and result to the cent, months adding up to totals, stock purchases kept out of expenses, delivery apart, unknown costs never shown as profit, and a clean CSV passed.");
}

// Replenishment: rates come from what actually left over the last 8 weeks, no
// forecast is given with under 4 weeks of history, and nothing is written.
// Today is 16 November 2026, so the window opens after 21 September.
{
  const TODAY = "2026-11-16";
  const product = (id, flavor) => ({ id, item: flavor, flavor, sizeMl: 500, retailPrice: 20, wholesalePrice: 14, status: "ativo" });
  const lot = (code, productId, actual, date, extra = {}) => ({ id: `b-${code}`, code, productId, flavor: "", sizeMl: 500, actual, date, status: "aprovado", ...extra });
  const out = (id, batchCode, productId, qty, date, movementType = "venda") => ({ id, batchCode, productId, qty, date, movementType, unitPrice: movementType === "venda" ? 20 : 0, discount: 0, delivery: 0 });
  const before = load({
    products: [product("p-a", "Tea"), product("p-b", "Gengibre"), product("p-c", "Hibisco"), product("p-d", "Lima")],
    recipes: [{ id: "r-a", productId: "p-a", flavor: "Tea", bottleMl: 500, yieldBottles: 1, ingredients: [{ ingredientId: "i-sugar", qty: 100, unit: "g" }], packaging: [{ itemId: "pk-cap", qty: 1 }] }],
    ingredients: [
      { id: "i-sugar", name: "Açúcar", purchaseUnit: "g", stock: 1000, min: 0, supplier: "Doce", stockCountedAt: "2026-11-01T12:00:00Z" },
      { id: "i-tea", name: "Chá verde", purchaseUnit: "g", stock: 5, min: 10, supplier: "Folhas" },
      { id: "i-label", name: "Carimbo", purchaseUnit: "un", stock: 0, min: 0 },
    ],
    packaging: [
      { id: "pk-cap", name: "Tampa", unit: "un", stock: 500, min: 50 },
      { id: "pk-box", name: "Caixa", unit: "un", stock: 20, min: 10 },
    ],
    suppliers: [{ id: "s1", name: "Doce", leadTime: "10 dias" }, { id: "s2", name: "Folhas", leadTime: "2 semanas" }],
    batches: [
      lot("A1", "p-a", 100, "2026-09-01", { recipeId: "r-a", inventoryAdjusted: true, inventoryQty: 100 }),
      lot("A2", "p-a", 40, "2026-10-26", { recipeId: "r-a", inventoryAdjusted: true, inventoryQty: 40 }),
      lot("B1", "p-b", 20, "2026-09-01"),
      lot("C1", "p-c", 30, "2026-11-06"),
      lot("D1", "p-d", 30, "2026-08-01"),
    ],
    sales: [
      out("a0", "A1", "p-a", 60, "2026-09-05"), // before the window
      out("a1", "A1", "p-a", 10, "2026-09-25"),
      out("a2", "A1", "p-a", 10, "2026-10-10"),
      out("a3", "A1", "p-a", 10, "2026-10-28"),
      out("a4", "A1", "p-a", 10, "2026-11-10"),
      out("a5", "A2", "p-a", 2, "2026-11-12", "presente"), // a gift still leaves the shelf
      out("a6", "A2", "p-a", 5, "2026-11-14", "perda"), // a loss is not demand
      out("b1", "B1", "p-b", 6, "2026-10-01"),
      out("b2", "B1", "p-b", 6, "2026-10-20"),
      out("b3", "B1", "p-b", 6, "2026-11-05"),
      out("c1", "C1", "p-c", 3, "2026-11-08"),
      out("c2", "C1", "p-c", 3, "2026-11-12"),
    ],
  });
  const snapshot = JSON.stringify(before);
  const bottles = Object.fromEntries(plain(call("productReplenishmentRows", TODAY)).map((row) => [row.flavor, row]));
  assert.deepEqual(Object.keys(bottles).sort(), ["Gengibre", "Hibisco", "Lima", "Tea"]);
  assert.equal(bottles.Tea.free, 33, "140 made, 60 + 40 sold, 2 gifted, 5 lost");
  assert.equal(bottles.Tea.weekly, 5.25, "42 bottles left in 8 weeks; the loss and the sale before the window do not count");
  assert.equal(bottles.Tea.coverWeeks.toFixed(2), "6.29");
  assert.equal(bottles.Tea.signal, "bom");
  assert.equal(bottles.Gengibre.signal, "produzir", "2 free bottles at 2.25 a week last under a week");
  assert.equal(bottles.Hibisco.signal, "insuficiente", "10 days of history is not enough to forecast");
  assert.equal(bottles.Hibisco.weekly, null);
  assert.equal(bottles.Hibisco.coverWeeks, null);
  assert.equal(bottles.Lima.signal, "parado", "stock with nothing leaving for 8 weeks");
  assert.equal(bottles.Lima.weekly, 0);

  const supplies = Object.fromEntries(plain(call("supplyReplenishmentRows", TODAY)).map((row) => [row.name, row]));
  assert.deepEqual(Object.keys(supplies).sort(), ["Açúcar", "Caixa", "Chá verde", "Tampa"], "an untracked supply has no stock to forecast");
  assert.equal(supplies["Açúcar"].weekly, 500, "batch A2 used 40 x 100 g inside the window; A1 is older");
  assert.equal(supplies["Açúcar"].coverDays, 14);
  assert.equal(supplies["Açúcar"].leadDays, 10);
  assert.equal(supplies["Açúcar"].signal, "comprar", "14 days of sugar against a 10-day supplier");
  assert.equal(supplies["Chá verde"].signal, "comprar", "below its minimum");
  assert.equal(supplies["Chá verde"].leadDays, 14, "\"2 semanas\" reads as 14 days");
  assert.equal(supplies.Tampa.weekly, 5);
  assert.equal(supplies.Tampa.signal, "bom");
  assert.equal(supplies.Caixa.signal, "sem-consumo");
  // A short history starts on its first day, and that day's movement counts:
  // 30 used on 17 October is 30 over 31 days, both ends included.
  assert.equal(call("outflowRate", [{ date: "2026-10-17", qty: 30 }], ["2026-10-17"], TODAY).weekly, 6.7742);

  admin.__eval('currentStockView = "replenishment"');
  const screen = call("renderStock");
  assert.match(screen, /Reposição/);
  assert.match(screen, /Produzir/);
  assert.match(screen, /Comprar/);
  assert.match(screen, /Parado/);
  const hibiscoRow = screen.slice(screen.indexOf("Hibisco"), screen.indexOf("</tr>", screen.indexOf("Hibisco")));
  assert.match(hibiscoRow, /Histórico insuficiente/);
  assert.doesNotMatch(hibiscoRow, /semanas? de estoque/, "no coverage is shown without enough history");
  admin.__eval('currentStockView = "kombuchas"');
  assert.equal(JSON.stringify(admin.__getState()), snapshot, "forecasting writes nothing");
  console.log("Replenishment: 8-week outflow rates, losses excluded, no forecast under 4 weeks, stalled stock, supplier lead times, minimums and no writes passed.");
}
{
  // One tap on "Limpar dados" replaced the whole saved state with the empty
  // default and saved it. No handler may wipe or reseed the data.
  const source = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "assets", "admin.js"), "utf8");
  const start = source.indexOf("function handleAction(action) {");
  const handlers = source.slice(start, source.indexOf("\n}\n", start));
  assert.ok(start > 0, "handleAction is where the actions live");
  assert.doesNotMatch(handlers, /\bstate\s*=\s*clone\(defaultState\)/, "no action replaces the whole state");
  assert.doesNotMatch(handlers, /"reset-demo"|"import-cost-base"/, "the wipe and seed-restore actions are gone");
  assert.doesNotMatch(call("renderSchema"), /data-action="reset-demo"/, "the Arquitetura screen has no wipe button");
}
console.log("Data safety regression: no action wipes or reseeds the saved state.");

// Counting finished bottles directly (owner request, 16 November 2026). The
// operator types what is on the shelf and the system works out the rest, with
// no reason, no confirmation and no lock. More bottles than recorded enter as a
// batch made by the recipe, so supplies, cost and sales made without stock
// follow. Fewer are a loss, taken from the oldest batch first and, when those
// bottles were reserved, from the order needed latest.
{
  const { stateInvariantViolations } = require("../api/_lib/kombu-backend");
  const product = { id: "tea", item: "KMB1", flavor: "Tea", sizeMl: 500, retailPrice: 22, wholesalePrice: 15, status: "ativo", visible: true };
  const recipe = (extra = {}) => ({ id: "r-tea", productId: "tea", flavor: "Tea", version: "v1", status: "ativa", bottleMl: 500, yieldBottles: 1, ingredients: [{ ingredientId: "leaf", qty: 10, unit: "g" }], packaging: [], ...extra });
  const leaf = (stock = 1000) => ({ id: "leaf", name: "Folha", category: "chá", purchaseUnit: "g", stock, costPerUnit: 0.05, stockCountedAt: "2026-11-01T10:00:00Z" });
  const batch = (code, actual, date) => ({ id: `b-${code}`, code, productId: "tea", recipeId: "r-tea", flavor: "Tea", sizeMl: 500, actual, expected: actual, date, status: "aprovado", inventoryAdjusted: true, inventoryQty: actual, costSnapshot: { costPerBottle: 2, yieldBottles: 1, total: 2, ingredientCost: 2 } });
  const order = (orderId, due, qty, allocations, createdAt) => ({ id: orderId, code: orderId.toUpperCase(), status: "confirmado", orderDate: "2026-11-01", neededBy: due, createdAt, customerName: orderId, items: [{ key: `k-${orderId}`, productId: "tea", flavor: "Tea", sizeMl: 500, qty, unitPrice: 22, allocations }] });
  const state = () => admin.__getState();
  const count = (counted, productId = "tea") => plain(call("applyBottleCount", [{ productId, counted }]));
  const reserved = (orderId) => call("orderItemReservedQty", state().orders.find((item) => item.id === orderId).items[0]);
  // Nothing here may open a dialog.
  admin.confirm = () => { throw new Error("a blocking dialog was opened"); };
  admin.alert = () => { throw new Error("a blocking alert was opened"); };

  // More on the shelf than recorded: an entry made by the recipe.
  load({ products: [product], recipes: [recipe()], ingredients: [leaf()], batches: [batch("T-1", 9, "2026-11-01")] });
  assert.equal(call("expectedBottles", "tea"), 9);
  const untouched = JSON.stringify(state());
  assert.equal(count(9)[0].kind, "same");
  assert.equal(JSON.stringify(state()), untouched, "counting the number already recorded writes nothing");
  const entry = count(12);
  assert.deepEqual([entry[0].kind, entry[0].expected, entry[0].counted, entry[0].qty], ["entry", 9, 12, 3]);
  assert.equal(entry[0].message, "Tea 500 ml: 9 → 12, entraram 3 garrafas.");
  const made = state().batches[0];
  assert.deepEqual([made.source, made.actual, made.recipeId, made.productId, made.status], ["ajuste", 3, "r-tea", "tea", "aprovado"]);
  assert.match(made.note, /sistema 9.*contado 12/);
  assert.equal(state().ingredients[0].stock, 970, "the entry takes the recipe's 30 g of leaf");
  assert.equal(made.costSnapshot.costPerBottle, 0.5, "the cost of the new bottles is frozen from the recipe");
  assert.equal(call("expectedBottles", "tea"), 12);
  assert.match(state().audit.find((row) => row.action === "Contagem de estoque")?.detail || "", /Tea 500 ml: 9 → 12/);
  // The server accepts what a count writes: the batch's source and note.
  const { validateAppState } = require("../api/_lib/kombu-backend");
  assert.equal(validateAppState(plain(state())), "", "the server accepts a state with a count entry");

  // Fewer than recorded: a loss, oldest batch first. T-1 has 2 on the shelf, all
  // reserved by the order needed latest; T-2 has 6 with 4 reserved.
  load({
    products: [product], recipes: [recipe()], ingredients: [leaf()],
    batches: [batch("T-1", 3, "2026-10-01"), batch("T-2", 6, "2026-11-01")],
    sales: [{ id: "s1", date: "2026-01-05", batchCode: "T-1", productId: "tea", flavor: "Tea", qty: 1, unitPrice: 22, movementType: "venda", customerName: "Ana" }],
    orders: [order("old", "2026-11-20", 4, [{ batchCode: "T-2", qty: 4 }], "2026-11-01T10:00:00Z"), order("new", "2026-12-20", 2, [{ batchCode: "T-1", qty: 2 }], "2026-11-05T10:00:00Z")],
  });
  assert.equal(call("expectedBottles", "tea"), 8);
  const loss = count(4);
  assert.deepEqual([loss[0].kind, loss[0].qty], ["loss", 4]);
  assert.equal(loss[0].message, "Tea 500 ml: 8 → 4, 4 perdidas.");
  const lost = plain(state().sales).filter((sale) => sale.movementType === "perda");
  assert.deepEqual(lost.map((sale) => [sale.batchCode, sale.qty]).sort(), [["T-1", 2], ["T-2", 2]], "the loss is spread oldest batch first");
  lost.forEach((sale) => {
    assert.deepEqual([sale.unitPrice, sale.customerName, sale.productId, sale.date], [0, "Ajuste de estoque", "tea", call("todayIso")]);
    assert.match(sale.note, /sistema 8.*contado 4/);
  });
  assert.equal(reserved("new"), 0, "the order needed latest gave up its bottles");
  assert.equal(reserved("old"), 4, "the older order keeps its reservation");
  assert.equal(call("expectedBottles", "tea"), 4);
  assert.equal(state().ingredients[0].stock, 1000, "a loss does not touch supplies");
  assert.equal(stateInvariantViolations(plain(state())).byRule.batch_over_allocated, 0, "the server would accept the saved state");
  // The loss costs what the bottles cost and earns nothing.
  const finance = plain(call("dashboardFinancials", call("todayIso").slice(0, 7)));
  assert.deepEqual([finance.revenue, finance.cogs], [0, 8]);

  // One batch, two orders: the order needed latest gives up first.
  load({
    products: [product], recipes: [recipe()], ingredients: [leaf()], batches: [batch("T-1", 4, "2026-11-01")],
    orders: [order("old", "2026-11-20", 2, [{ batchCode: "T-1", qty: 2 }], "2026-11-01T10:00:00Z"), order("new", "2026-12-20", 2, [{ batchCode: "T-1", qty: 2 }], "2026-11-05T10:00:00Z")],
  });
  count(1);
  assert.deepEqual([reserved("new"), reserved("old")], [0, 1]);
  assert.equal(stateInvariantViolations(plain(state())).byRule.batch_over_allocated, 0);

  // Bottles already sold before any batch existed are not on the shelf, so the
  // count is compared with what is left after them, and a new entry covers them.
  load({ products: [product], recipes: [recipe()], ingredients: [leaf()], batches: [batch("T-1", 3, "2026-11-01")] });
  call("recordPendingSale", { date: "2026-11-10", customerName: "Ana", movementType: "venda", priceType: "varejo", productId: "tea", flavor: "Tea", qty: 2, unitPrice: 22, discount: 0, delivery: 0 });
  assert.deepEqual([call("productPhysicalStock", "tea"), call("pendingSaleQuantity", "tea"), call("expectedBottles", "tea")], [3, 2, 1]);
  assert.deepEqual([count(4)[0].kind, count(4)[0].kind], ["entry", "same"]);
  assert.deepEqual([call("pendingSaleQuantity", "tea"), call("productPhysicalStock", "tea"), call("expectedBottles", "tea")], [0, 4, 4], "the entry covered the bottles already sold");

  // No active recipe: the entry is not made and no cost is invented.
  load({ products: [product], recipes: [recipe({ status: "arquivada" })], ingredients: [leaf()], batches: [batch("T-1", 3, "2026-11-01")] });
  const none = count(5);
  assert.equal(none[0].kind, "no-recipe");
  assert.match(none[0].message, /sem receita ativa/);
  assert.deepEqual([state().batches.length, state().ingredients[0].stock], [1, 1000]);

  // Supplies never block. Production that takes a supply below zero saves, and a
  // notice is queued for the next screen instead of a yes/no dialog.
  load({ products: [product], recipes: [recipe()], ingredients: [leaf(100)] });
  const produced = plain(call("recordProduction", [{ recipe: state().recipes[0], bottles: 12, code: "T-X" }], "2026-11-16", "Dona Maria"));
  assert.equal(produced.length, 1);
  assert.equal(state().ingredients[0].stock, -20, "the true negative balance is kept");
  const notices = plain(call("takeNotices"));
  assert.equal(notices.length, 1);
  assert.equal(notices[0].tone, "warn");
  assert.match(notices[0].text, /Folha.*20/);
  assert.deepEqual(plain(call("takeNotices")), [], "a notice is shown once");

  // A supply at exactly 0 asks "is it really 0?" and is never a block. Only
  // supplies whose stock is kept are asked about.
  load({
    ingredients: [
      { id: "sugar", name: "Açúcar", purchaseUnit: "g", stock: 0, costPerUnit: 0.005, stockCountedAt: "2026-11-01T10:00:00Z" },
      { id: "stamp", name: "Carimbo", purchaseUnit: "un", stock: 0, costPerUnit: 0 },
      { id: "salt", name: "Sal", purchaseUnit: "g", stock: -5, costPerUnit: 0.01, stockCountedAt: "2026-11-01T10:00:00Z" },
    ],
    packaging: [],
  });
  assert.deepEqual(plain(call("zeroStockSupplies")).map((row) => row.item.id), ["sugar"]);
  const dashboard = call("renderDashboard");
  assert.match(dashboard, /Açúcar está com 0\. É 0 mesmo\?/);
  assert.match(dashboard, /data-action="confirm-zero-supply:ingredients:sugar"/);
  assert.match(dashboard, /data-action="fix-supply-stock:ingredients:sugar"/);
  assert.match(call("renderOperator"), /Açúcar está com 0/, "simple mode asks too");
  assert.match(dashboard, /Estoque negativo: Sal/, "negative supplies keep their alert");
  call("confirmZeroSupply", "ingredients", "sugar");
  assert.deepEqual(plain(call("zeroStockSupplies")), []);
  assert.ok(state().ingredients[0].stockCountedAt > "2026-11-02", "confirming counts the item");
  assert.equal(state().ingredients[0].zeroConfirmed, true);
  assert.equal(require("../api/_lib/kombu-backend").validateAppState(plain(state())), "", "the server accepts a supply with zeroConfirmed");
  assert.doesNotMatch(call("renderDashboard"), /É 0 mesmo/);
  // Once the stock moves and comes back to zero, the question returns.
  state().ingredients[0].stock = 300;
  call("saveState");
  state().ingredients[0].stock = 0;
  assert.deepEqual(plain(call("zeroStockSupplies")).map((row) => row.item.id), ["sugar"]);

  admin.confirm = () => true;
  admin.alert = () => {};
}
console.log("Stock count: entry by recipe, loss oldest batch first, reserved bottles from the newest order, bottles sold without stock, no recipe, supplies never blocking and the zero-stock question passed.");
