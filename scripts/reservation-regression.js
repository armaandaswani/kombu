const assert = require("node:assert/strict");
const { reconcileReservations } = require("../api/_lib/reservations");

function makeState({ batches = [], orders = [], sales = [] } = {}) {
  return {
    products: [
      {
        id: "product-manga-current-500",
        item: "KMB010",
        flavor: "Manga & Jasmim",
        sizeMl: 500,
      },
      {
        id: "product-manga-current-300",
        item: "KMB010-300",
        flavor: "Manga & Jasmim",
        sizeMl: 300,
      },
    ],
    recipes: [
      {
        id: "recipe-manga-500",
        productId: "product-manga-current-500",
        flavor: "Manga & Jasmim",
        sizeMl: 500,
      },
      {
        id: "recipe-manga-300",
        productId: "product-manga-current-300",
        flavor: "Manga & Jasmim",
        sizeMl: 300,
      },
    ],
    batches,
    orders,
    sales,
    audit: [],
  };
}

function makeBatch({
  id = "batch-500",
  code = "KMB010-260727",
  actual = 11,
  inventoryQty,
  productId = "product-manga-current-500",
  recipeId = "recipe-manga-500",
  flavor = "Manga & Jasmim",
  sizeMl = 500,
  date = "2026-07-27",
  createdAt,
  updatedAt,
  status = "aprovado",
} = {}) {
  return {
    id,
    code,
    actual,
    inventoryQty,
    productId,
    recipeId,
    flavor,
    sizeMl,
    date,
    createdAt,
    updatedAt,
    status,
  };
}

function makeOrder({
  id = "order-old",
  code = "PED-260702-01",
  createdAt = "2026-07-02T10:00:00.000Z",
  qty = 10,
  deliveredQty = 0,
  productId = "legacy-product-manga-500",
  flavor = "Manga & Jasmim 500ml",
  sizeMl = 500,
  status = "confirmado",
  allocations = [],
  reservationOverride,
} = {}) {
  return {
    id,
    code,
    createdAt,
    orderDate: createdAt.slice(0, 10),
    status,
    items: [
      {
        id: `${id}-item`,
        productId,
        flavor,
        sizeMl,
        qty,
        deliveredQty,
        allocations,
        reservationOverride,
      },
    ],
  };
}

function item(order) {
  return order.items[0];
}

function reserved(order) {
  return (item(order).allocations || []).reduce(
    (total, allocation) => total + Number(allocation.qty || allocation.quantity || 0),
    0
  );
}

function batchSummary(result, code = "KMB010-260727") {
  return result.summary.batches.find((batch) => batch.code === code);
}

// Most scenarios below exercise the allocation engine itself, which is what the
// explicit recalculation does. Everyday saves use "preserve" and are covered
// separately by testPreserveDoesNotMoveReservationsBetweenOrders and friends.
function reconcile(state, options = {}) {
  return reconcileReservations(state, {
    updatedBy: "Regression",
    now: "2026-07-27T12:00:00.000Z",
    reservationMode: "recalculate",
    ...options,
  });
}

function testNewProductionUsesLegacyOrderIdentity() {
  const order = makeOrder();
  const result = reconcile(
    makeState({
      batches: [makeBatch({ actual: 11 })],
      orders: [order],
    })
  );

  assert.equal(reserved(result.state.orders[0]), 10);
  assert.equal(item(result.state.orders[0]).productId, "legacy-product-manga-500");
  assert.equal(item(result.state.orders[0]).reservedQty, 10);
  assert.equal(item(result.state.orders[0]).productionStatus, "reservado");
  assert.equal(result.summary.reserved, 10);
  assert.equal(batchSummary(result).reserved, 10);
  assert.equal(batchSummary(result).available, 1);
}

function testPartialProduction() {
  const result = reconcile(
    makeState({
      batches: [makeBatch({ actual: 5 })],
      orders: [makeOrder({ qty: 10 })],
    })
  );

  assert.equal(reserved(result.state.orders[0]), 5);
  assert.equal(batchSummary(result).available, 0);
}

function testFifoPrefersOldestOrder() {
  const oldOrder = makeOrder({
    id: "order-old",
    code: "PED-OLD",
    createdAt: "2026-07-02T10:00:00.000Z",
    qty: 10,
  });
  const newOrder = makeOrder({
    id: "order-new",
    code: "PED-NEW",
    createdAt: "2026-07-06T09:00:00.000Z",
    qty: 2,
  });
  const result = reconcile(
    makeState({
      batches: [makeBatch({ actual: 11 })],
      orders: [newOrder, oldOrder],
    })
  );
  const reconciledOld = result.state.orders.find((order) => order.id === "order-old");
  const reconciledNew = result.state.orders.find((order) => order.id === "order-new");

  assert.equal(reserved(reconciledOld), 10);
  assert.equal(reserved(reconciledNew), 1);
}

function testVolumeIsNeverMixed() {
  const order500 = makeOrder({ id: "order-500", qty: 10 });
  const order300 = makeOrder({
    id: "order-300",
    qty: 10,
    productId: "legacy-product-manga-300",
    flavor: "Manga & Jasmim 300ml",
    sizeMl: 300,
  });
  const result = reconcile(
    makeState({
      batches: [makeBatch({ actual: 11 })],
      orders: [order300, order500],
    })
  );

  assert.equal(
    reserved(result.state.orders.find((order) => order.id === "order-500")),
    10
  );
  assert.equal(
    reserved(result.state.orders.find((order) => order.id === "order-300")),
    0
  );
  assert.equal(batchSummary(result).available, 1);
}

function testClosedAndCanceledOrdersAreExcluded() {
  const result = reconcile(
    makeState({
      batches: [makeBatch({ actual: 11 })],
      orders: [
        makeOrder({ id: "canceled", status: "cancelado", qty: 10 }),
        makeOrder({ id: "delivered", status: "entregue", qty: 10 }),
        makeOrder({ id: "open", status: "confirmado", qty: 10 }),
      ],
    })
  );

  assert.equal(reserved(result.state.orders.find((order) => order.id === "canceled")), 0);
  assert.equal(reserved(result.state.orders.find((order) => order.id === "delivered")), 0);
  assert.equal(reserved(result.state.orders.find((order) => order.id === "open")), 10);
}

function testReactivatedOrderReclaimsAvailableStock() {
  const canceled = reconcile(
    makeState({
      batches: [makeBatch({ actual: 11 })],
      orders: [makeOrder({ status: "cancelado", qty: 10 })],
    })
  );

  assert.equal(batchSummary(canceled).available, 11);
  canceled.state.orders[0].status = "recebido";
  const reactivated = reconcile(canceled.state);

  assert.equal(reserved(reactivated.state.orders[0]), 10);
  assert.equal(batchSummary(reactivated).reserved, 10);
  assert.equal(batchSummary(reactivated).available, 1);
}

function testProductionEditAndDeleteReconcileReservations() {
  const initial = reconcile(
    makeState({
      batches: [makeBatch({ actual: 11 })],
      orders: [makeOrder({ qty: 10 })],
    })
  );
  initial.state.batches[0].actual = 5;
  const reduced = reconcile(initial.state);

  assert.equal(reserved(reduced.state.orders[0]), 5);
  assert.equal(batchSummary(reduced).available, 0);

  reduced.state.batches = [];
  const deleted = reconcile(reduced.state);
  assert.equal(reserved(deleted.state.orders[0]), 0);
  assert.equal(item(deleted.state.orders[0]).batchCode, "");
  assert.equal(item(deleted.state.orders[0]).readyDate, "");
}

function testRepeatedReconciliationIsIdempotent() {
  const first = reconcile(
    makeState({
      batches: [makeBatch({ actual: 11 })],
      orders: [makeOrder({ qty: 10 })],
    })
  );
  const second = reconcile(first.state);

  assert.equal(second.changed, false);
  assert.deepEqual(second.state, first.state);
}

function testInvalidAndDuplicateAllocationsAreRepaired() {
  const order = makeOrder({
    qty: 10,
    allocations: [
      { batchCode: "KMB010-260727", qty: 7, source: "auto" },
      { batchCode: "KMB010-260727", qty: 7, source: "auto" },
      { batchCode: "UNKNOWN", qty: 5, source: "auto" },
      { batchCode: "KMB010-300-260727", qty: 4, source: "auto" },
    ],
  });
  const result = reconcile(
    makeState({
      batches: [
        makeBatch({ actual: 11 }),
        makeBatch({
          id: "batch-300",
          code: "KMB010-300-260727",
          actual: 20,
          productId: "product-manga-current-300",
          recipeId: "recipe-manga-300",
          sizeMl: 300,
        }),
      ],
      orders: [order],
    })
  );
  const allocations = item(result.state.orders[0]).allocations;

  assert.equal(allocations.length, 1);
  assert.equal(allocations[0].batchCode, "KMB010-260727");
  assert.equal(allocations[0].qty, 10);
}

function testManualCurrentReservationIsPreservedWithoutChangingOrder() {
  const result = reconcile(
    makeState({
      batches: [makeBatch({ actual: 4 })],
      orders: [
        makeOrder({
          qty: 4,
          reservationOverride: {
            active: true,
            reservedNow: 3,
            reason: "Liberar uma garrafa",
          },
        }),
      ],
    })
  );

  assert.equal(item(result.state.orders[0]).qty, 4);
  assert.equal(reserved(result.state.orders[0]), 3);
  assert.equal(batchSummary(result).available, 1);
}

function testLaterProductionSupersedesManualCurrentReservation() {
  const order = makeOrder({
    qty: 10,
    reservationOverride: {
      active: true,
      reservedNow: 3,
      reason: "Liberar uma garrafa do estoque atual",
      updatedAt: "2026-07-20T12:00:00.000Z",
    },
  });
  const result = reconcile(
    makeState({
      batches: [
        makeBatch({
          actual: 11,
          createdAt: "2026-07-27T10:00:00.000Z",
          updatedAt: "2026-07-27T10:00:00.000Z",
        }),
      ],
      orders: [order],
    })
  );
  const reconciledItem = item(result.state.orders[0]);

  assert.equal(reconciledItem.qty, 10);
  assert.equal(reserved(result.state.orders[0]), 10);
  assert.equal(reconciledItem.reservationOverride.active, false);
  assert.equal(reconciledItem.reservationOverride.supersededByBatch, "KMB010-260727");
  assert.equal(batchSummary(result).available, 1);
  // The audit action names the mode that produced the change, so a recalculation
  // reads differently from new production arriving.
  const allocationAudit = result.state.audit.find(
    (record) => record.action === "Reserva recalculada automaticamente" && record.orderId === "PED-260702-01"
  );
  assert.ok(allocationAudit);
  assert.equal(allocationAudit.flavor, "Manga & Jasmim");
  assert.equal(allocationAudit.sizeMl, 500);
  assert.equal(allocationAudit.previousQty, 0);
  assert.equal(allocationAudit.newQty, 10);
  assert.equal(allocationAudit.quantityChanged, 10);
}

function testInventoryQuantitySupportsReservations() {
  const batch = makeBatch({ inventoryQty: 11 });
  delete batch.actual;
  const result = reconcile(
    makeState({
      batches: [batch],
      orders: [makeOrder({ qty: 10 })],
    })
  );

  assert.equal(reserved(result.state.orders[0]), 10);
  assert.equal(batchSummary(result).reserved, 10);
  assert.equal(batchSummary(result).available, 1);
}

function testBlankActualFallsBackInsteadOfErasingStock() {
  // A cleared "actual" field arrives as "". It must not be read as zero
  // production, which would drop the batch and release its reservations.
  const batch = makeBatch({ actual: "", inventoryQty: 11 });
  const result = reconcile(
    makeState({
      batches: [batch],
      orders: [makeOrder({ qty: 10 })],
    })
  );

  assert.equal(reserved(result.state.orders[0]), 10, "a blank actual must fall back to inventoryQty");
  assert.equal(batchSummary(result).produced, 11);
  assert.equal(batchSummary(result).reserved, 10);
  assert.equal(batchSummary(result).available, 1);
}

function testWhitespaceActualIsTreatedAsUnrecorded() {
  const batch = makeBatch({ actual: "   ", inventoryQty: 8 });
  const result = reconcile(
    makeState({
      batches: [batch],
      orders: [makeOrder({ qty: 10 })],
    })
  );

  assert.equal(reserved(result.state.orders[0]), 8);
  assert.equal(batchSummary(result).produced, 8);
}

function testExplicitZeroActualStillMeansNoProduction() {
  // Regression guard on the fallback itself: a real zero must stay zero and
  // must not silently fall through to a stale inventoryQty.
  const batch = makeBatch({ actual: 0, inventoryQty: 11 });
  const result = reconcile(
    makeState({
      batches: [batch],
      orders: [makeOrder({ qty: 10 })],
    })
  );

  assert.equal(reserved(result.state.orders[0]), 0);
  assert.equal(result.summary.batches.length, 0, "a batch producing zero is not eligible stock");
}

// The server writes these straight into records the admin renders and edits, so
// they have to stay inside ORDER_STATUSES / ORDER_ITEM_STATUSES in assets/admin.js.
const ADMIN_ORDER_STATUSES = ["recebido", "confirmado", "em produção", "produzido", "pronto", "entregue", "cancelado"];
const ADMIN_ORDER_ITEM_STATUSES = ["pendente", "em produção", "produzido", "reservado", "entregue"];

function testServerWritesStatusesTheAdminUnderstands() {
  const pending = reconcile(makeState({ batches: [], orders: [makeOrder({ qty: 10 })] }));
  assert.equal(item(pending.state.orders[0]).productionStatus, "pendente");

  const partial = reconcile(
    makeState({ batches: [makeBatch({ actual: 4 })], orders: [makeOrder({ qty: 10 })] })
  );
  assert.equal(item(partial.state.orders[0]).productionStatus, "em produção");
  assert.equal(partial.state.orders[0].status, "em produção");

  const full = reconcile(
    makeState({ batches: [makeBatch({ actual: 10 })], orders: [makeOrder({ qty: 10 })] })
  );
  assert.equal(item(full.state.orders[0]).productionStatus, "reservado");
  assert.equal(full.state.orders[0].status, "pronto");

  // Fully delivered: must close as "entregue", never "concluido". The payment
  // reminder cron only bills orders whose status is exactly "entregue".
  const delivered = reconcile(
    makeState({ batches: [], orders: [makeOrder({ qty: 10, deliveredQty: 10 })] })
  );
  assert.equal(delivered.state.orders[0].status, "entregue");
  assert.equal(item(delivered.state.orders[0]).productionStatus, "entregue");

  [pending, partial, full, delivered].forEach((result) => {
    const order = result.state.orders[0];
    assert.ok(
      ADMIN_ORDER_STATUSES.includes(order.status),
      `order status "${order.status}" is not offered by the admin`
    );
    assert.ok(
      ADMIN_ORDER_ITEM_STATUSES.includes(item(order).productionStatus),
      `item status "${item(order).productionStatus}" is not offered by the admin`
    );
  });
}

function testLegacyConcluidoOrdersAreStillTreatedAsClosed() {
  // Records written before the vocabulary was aligned still carry "concluido".
  const result = reconcile(
    makeState({
      batches: [makeBatch({ actual: 10 })],
      orders: [makeOrder({ qty: 10, status: "concluido" })],
    })
  );
  assert.equal(reserved(result.state.orders[0]), 0, "a closed legacy order must not hold stock");
  assert.equal(batchSummary(result).available, 10);
}

function testClosedOrdersKeepTheirLotTraceability() {
  const delivered = makeOrder({ qty: 10, deliveredQty: 10, status: "entregue" });
  item(delivered).allocations = [
    { batchCode: "KMB010-260727", qty: 10, date: "2026-07-27", manual: false, note: "" },
  ];
  const result = reconcile(
    makeState({ batches: [makeBatch({ actual: 10 })], orders: [delivered] })
  );

  const closedItem = item(result.state.orders[0]);
  assert.equal(closedItem.allocations.length, 1, "a closed order must keep the record of which batch filled it");
  assert.equal(closedItem.allocations[0].batchCode, "KMB010-260727");
  assert.equal(closedItem.batchCode, "KMB010-260727", "batchCode must survive on a closed order");
  // ...but it must not hold stock any more.
  assert.equal(closedItem.reservedQty, 0, "a closed order must not reserve stock");
  assert.equal(batchSummary(result).available, 10, "a closed order must release its stock");
  assert.equal(batchSummary(result).reserved, 0);
}

function testClosedOrderTraceabilitySurvivesRepeatedReconciliation() {
  const delivered = makeOrder({ qty: 10, deliveredQty: 10, status: "entregue" });
  item(delivered).allocations = [
    { batchCode: "KMB010-260727", qty: 10, date: "2026-07-27", manual: false, note: "" },
  ];
  const first = reconcile(makeState({ batches: [makeBatch({ actual: 10 })], orders: [delivered] }));
  const second = reconcile({ ...first.state });
  assert.equal(item(second.state.orders[0]).batchCode, "KMB010-260727");
  assert.equal(second.changed, false, "reconciling a settled state again must be a no-op");
}

function testAManuallyChosenOrderStatusIsNotRecomputed() {
  const chosen = makeOrder({ qty: 10, status: "produzido" });
  chosen.statusManual = true;
  const result = reconcile(
    makeState({ batches: [makeBatch({ actual: 10 })], orders: [chosen] })
  );
  assert.equal(result.state.orders[0].status, "produzido", "an explicitly chosen status must survive reconciliation");
  // The reservation itself must still be applied; only the label is left alone.
  assert.equal(reserved(result.state.orders[0]), 10);

  // Full delivery is a fact, not a judgement, so it still closes the order.
  const delivered = makeOrder({ qty: 10, deliveredQty: 10, status: "produzido" });
  delivered.statusManual = true;
  const closed = reconcile(makeState({ batches: [], orders: [delivered] }));
  assert.equal(closed.state.orders[0].status, "entregue");
  assert.equal(closed.state.orders[0].statusManual, undefined, "the manual flag is cleared once the order closes");

  // Without the flag the status is still derived as before.
  const derived = reconcile(
    makeState({ batches: [makeBatch({ actual: 10 })], orders: [makeOrder({ qty: 10, status: "confirmado" })] })
  );
  assert.equal(derived.state.orders[0].status, "pronto");
}

// --- reservation modes -------------------------------------------------------
// The point of these: an ordinary save must never move a bottle from one order
// to another. That silent movement is what made the numbers jump.

function testPreserveDoesNotMoveReservationsBetweenOrders() {
  const older = makeOrder({ id: "order-old", code: "PED-A", createdAt: "2026-07-01T10:00:00.000Z", qty: 10 });
  const newer = makeOrder({ id: "order-new", code: "PED-B", createdAt: "2026-07-20T10:00:00.000Z", qty: 10 });
  // The newer order is holding the stock even though FIFO would favour the older.
  item(newer).allocations = [{ batchCode: "KMB010-260727", qty: 6, date: "2026-07-27", manual: false, note: "" }];

  const result = reconcileReservations(
    makeState({ batches: [makeBatch({ actual: 6 })], orders: [older, newer] }),
    { updatedBy: "Regression", now: "2026-07-27T12:00:00.000Z", reservationMode: "preserve" },
  );

  const [keptOld, keptNew] = result.state.orders;
  assert.equal(reserved(keptNew), 6, "an ordinary save must leave an existing reservation alone");
  assert.equal(reserved(keptOld), 0, "an ordinary save must not hand stock to another order");
  assert.equal(result.mode, "preserve");
}

function testPreserveIsTheDefault() {
  const holder = makeOrder({ id: "order-holder", qty: 10 });
  item(holder).allocations = [{ batchCode: "KMB010-260727", qty: 4, date: "2026-07-27", manual: false, note: "" }];
  const result = reconcileReservations(
    makeState({ batches: [makeBatch({ actual: 10 })], orders: [holder] }),
    { updatedBy: "Regression", now: "2026-07-27T12:00:00.000Z" },
  );
  assert.equal(result.mode, "preserve", "a save that asks for nothing must not redistribute");
  assert.equal(reserved(result.state.orders[0]), 4, "free stock is not handed out by an ordinary save");
}

function testAllocateNewStockOnlyDistributesTheNamedBatch() {
  const waiting = makeOrder({ qty: 10 });
  const existing = makeBatch({ id: "batch-old", code: "KMB010-260701", actual: 5, date: "2026-07-01" });
  const arriving = makeBatch({ id: "batch-new", code: "KMB010-260727", actual: 4, date: "2026-07-27" });

  const result = reconcileReservations(
    makeState({ batches: [existing, arriving], orders: [waiting] }),
    {
      updatedBy: "Regression",
      now: "2026-07-27T12:00:00.000Z",
      reservationMode: "allocate-new-stock",
      batchCodes: ["KMB010-260727"],
    },
  );

  assert.equal(reserved(result.state.orders[0]), 4, "only the batch that just arrived is handed out");
  assert.equal(batchSummary(result, "KMB010-260727").available, 0);
  assert.equal(batchSummary(result, "KMB010-260701").available, 5, "older free stock stays free until asked for");
  assert.equal(result.mode, "allocate-new-stock");
}

function testRecalculateAppliesFifoAcrossOrders() {
  const older = makeOrder({ id: "order-old", code: "PED-A", createdAt: "2026-07-01T10:00:00.000Z", qty: 10 });
  const newer = makeOrder({ id: "order-new", code: "PED-B", createdAt: "2026-07-20T10:00:00.000Z", qty: 10 });
  item(newer).allocations = [{ batchCode: "KMB010-260727", qty: 6, date: "2026-07-27", manual: false, note: "" }];

  const result = reconcile(makeState({ batches: [makeBatch({ actual: 6 })], orders: [older, newer] }));

  const [rebuiltOld, rebuiltNew] = result.state.orders;
  assert.equal(reserved(rebuiltOld), 6, "an explicit recalculation applies FIFO");
  assert.equal(reserved(rebuiltNew), 0);
  assert.equal(result.mode, "recalculate");
}

function testSupersededOverrideReconciliationIsIdempotent() {
  const first = reconcile(
    makeState({
      batches: [
        makeBatch({
          actual: 11,
          updatedAt: "2026-07-27T10:00:00.000Z",
        }),
      ],
      orders: [
        makeOrder({
          qty: 10,
          reservationOverride: {
            active: true,
            reservedNow: 3,
            updatedAt: "2026-07-20T12:00:00.000Z",
          },
        }),
      ],
    })
  );
  const second = reconcile(first.state);

  assert.equal(second.changed, false);
  assert.deepEqual(second.state, first.state);
}

function testSalesReduceReservableCapacity() {
  const result = reconcile(
    makeState({
      batches: [makeBatch({ actual: 11 })],
      orders: [makeOrder({ qty: 10 })],
      sales: [{ id: "sale-1", batchCode: "KMB010-260727", qty: 2 }],
    })
  );

  assert.equal(reserved(result.state.orders[0]), 9);
  assert.equal(batchSummary(result).available, 0);
}

const tests = [
  testNewProductionUsesLegacyOrderIdentity,
  testPartialProduction,
  testFifoPrefersOldestOrder,
  testVolumeIsNeverMixed,
  testClosedAndCanceledOrdersAreExcluded,
  testReactivatedOrderReclaimsAvailableStock,
  testProductionEditAndDeleteReconcileReservations,
  testRepeatedReconciliationIsIdempotent,
  testInvalidAndDuplicateAllocationsAreRepaired,
  testManualCurrentReservationIsPreservedWithoutChangingOrder,
  testLaterProductionSupersedesManualCurrentReservation,
  testInventoryQuantitySupportsReservations,
  testBlankActualFallsBackInsteadOfErasingStock,
  testWhitespaceActualIsTreatedAsUnrecorded,
  testExplicitZeroActualStillMeansNoProduction,
  testServerWritesStatusesTheAdminUnderstands,
  testLegacyConcluidoOrdersAreStillTreatedAsClosed,
  testClosedOrdersKeepTheirLotTraceability,
  testClosedOrderTraceabilitySurvivesRepeatedReconciliation,
  testAManuallyChosenOrderStatusIsNotRecomputed,
  testPreserveDoesNotMoveReservationsBetweenOrders,
  testPreserveIsTheDefault,
  testAllocateNewStockOnlyDistributesTheNamedBatch,
  testRecalculateAppliesFifoAcrossOrders,
  testSupersededOverrideReconciliationIsIdempotent,
  testSalesReduceReservableCapacity,
];

tests.forEach((test) => test());
console.log(`Reservation regression: ${tests.length} scenarios passed.`);
