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

function reconcile(state) {
  return reconcileReservations(state, {
    updatedBy: "Regression",
    now: "2026-07-27T12:00:00.000Z",
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
  const allocationAudit = result.state.audit.find(
    (record) => record.action === "Reserva automática aplicada" && record.orderId === "PED-260702-01"
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
  testSupersededOverrideReconciliationIsIdempotent,
  testSalesReduceReservableCapacity,
];

tests.forEach((test) => test());
console.log(`Reservation regression: ${tests.length} scenarios passed.`);
