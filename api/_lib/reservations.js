const CLOSED_ORDER_STATUSES = new Set([
  "cancelado",
  "cancelada",
  "canceled",
  "cancelled",
  "concluido",
  "concluida",
  "completed",
  "entregue",
  "delivered",
]);

// Kept in step with AUDIT_LIMIT in assets/admin.js. It used to be 100 here and
// 80 there, and a single reconciliation can push one entry per changed order
// line, so a busy day erased the trail of the days before it.
const AUDIT_LIMIT = 500;

const INELIGIBLE_BATCH_STATUSES = new Set([
  "bloqueado",
  "blocked",
  "descartado",
  "discarded",
  "planejado",
  "planned",
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function nonNegative(value) {
  return Math.max(0, number(value));
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizeFlavor(value) {
  let text = normalizeText(value);
  const saborIndex = text.lastIndexOf("sabor ");
  if (saborIndex >= 0) text = text.slice(saborIndex + 6);

  return text
    .replace(/\b\d+\s*ml\b/g, " ")
    .replace(/\b(kombucha|premium|garrafa|produto|base|receita|v\d+)\b/g, " ")
    .replace(/\bc\s*[/.-]\s*/g, " ")
    .replace(/&/g, " e ")
    .replace(/\b(com|e|de|da|do)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sizeFromText(...values) {
  for (const value of values) {
    const match = String(value || "").match(/\b(\d{2,4})\s*ml\b/i);
    if (match) return number(match[1]);
  }
  return 0;
}

function stateMaps(state) {
  return {
    products: new Map((state.products || []).map((item) => [item.id, item])),
    recipes: new Map((state.recipes || []).map((item) => [item.id, item])),
  };
}

function productSize(product) {
  return nonNegative(
    product?.sizeMl ||
      product?.size ||
      product?.bottleMl ||
      sizeFromText(product?.name, product?.flavor, product?.description, product?.item)
  );
}

function recipeSize(recipe, maps) {
  const product = maps.products.get(recipe?.productId);
  return nonNegative(
    recipe?.sizeMl ||
      recipe?.size ||
      recipe?.bottleMl ||
      productSize(product) ||
      sizeFromText(recipe?.flavor, recipe?.version, recipe?.name)
  );
}

function orderItemSize(item, maps) {
  const product = maps.products.get(item?.productId);
  return (
    nonNegative(
      item?.sizeMl ||
        item?.size ||
        item?.bottleMl ||
        productSize(product) ||
        sizeFromText(item?.flavor, item?.productName, item?.description, item?.item)
    ) || 500
  );
}

function batchSize(batch, maps) {
  const recipe = maps.recipes.get(batch?.recipeId);
  const product = maps.products.get(batch?.productId || recipe?.productId);
  return (
    nonNegative(
      batch?.sizeMl ||
        batch?.size ||
        batch?.bottleMl ||
        productSize(product) ||
        recipeSize(recipe, maps) ||
        sizeFromText(batch?.flavor, batch?.productName, batch?.code)
    ) || 500
  );
}

function orderItemFlavor(item, maps) {
  const product = maps.products.get(item?.productId);
  return normalizeFlavor(
    item?.flavor ||
      item?.productName ||
      item?.name ||
      product?.flavor ||
      product?.name ||
      product?.description
  );
}

function batchFlavor(batch, maps) {
  const recipe = maps.recipes.get(batch?.recipeId);
  const product = maps.products.get(batch?.productId || recipe?.productId);
  return normalizeFlavor(
    batch?.flavor ||
      batch?.productName ||
      product?.flavor ||
      recipe?.flavor ||
      product?.name ||
      product?.description
  );
}

function batchProductId(batch, maps) {
  const recipe = maps.recipes.get(batch?.recipeId);
  return batch?.productId || recipe?.productId || "";
}

function batchMatchesOrderItem(batch, item, maps) {
  if (!batch || !item) return false;
  if (batchSize(batch, maps) !== orderItemSize(item, maps)) return false;

  const productId = batchProductId(batch, maps);
  if (productId && item.productId && productId === item.productId) return true;

  const batchFlavorKey = batchFlavor(batch, maps);
  const itemFlavorKey = orderItemFlavor(item, maps);
  return Boolean(batchFlavorKey && itemFlavorKey && batchFlavorKey === itemFlavorKey);
}

function isOpenOrder(order) {
  return !CLOSED_ORDER_STATUSES.has(normalizeText(order?.status));
}

// A cleared numeric input arrives as "", which is neither null nor undefined, so
// `??` accepts it and Number("") is 0. That made a batch with a blanked `actual`
// report zero production, drop out of the eligible set, and silently release
// every reservation held against it. Blank and non-numeric values mean "not
// recorded on this field", so fall through to the next one instead.
function firstNumber(...values) {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function batchProducedQuantity(batch) {
  return nonNegative(
    firstNumber(batch?.actual, batch?.inventoryQty, batch?.actualYield, batch?.quantity)
  );
}

function isEligibleBatch(batch) {
  return (
    batchProducedQuantity(batch) > 0 &&
    !INELIGIBLE_BATCH_STATUSES.has(normalizeText(batch?.status))
  );
}

function orderItems(order) {
  return Array.isArray(order?.items) ? order.items : [];
}

function orderCreatedValue(order) {
  const value = order?.createdAt || order?.orderDate || order?.date || "";
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : Number.MAX_SAFE_INTEGER;
}

function compareOrders(a, b) {
  return (
    orderCreatedValue(a) - orderCreatedValue(b) ||
    String(a?.orderDate || a?.date || "").localeCompare(String(b?.orderDate || b?.date || "")) ||
    String(a?.code || a?.id || "").localeCompare(String(b?.code || b?.id || ""))
  );
}

function compareBatches(a, b) {
  return (
    String(a?.date || a?.productionDate || "").localeCompare(
      String(b?.date || b?.productionDate || "")
    ) || String(a?.code || a?.id || "").localeCompare(String(b?.code || b?.id || ""))
  );
}

function deliveredQuantity(item) {
  return Math.min(nonNegative(item?.qty), nonNegative(item?.deliveredQty));
}

function outstandingQuantity(item) {
  return Math.max(0, nonNegative(item?.qty) - deliveredQuantity(item));
}

function reservationLimit(item) {
  const outstanding = outstandingQuantity(item);
  const override = item?.reservationOverride;
  const manualTarget =
    override && override.active !== false
      ? override.reservedNow ?? override.targetQty
      : undefined;
  if (manualTarget === undefined || manualTarget === null || manualTarget === "") {
    return outstanding;
  }
  return Math.min(outstanding, nonNegative(manualTarget));
}

function timestampValue(...values) {
  for (const value of values) {
    const timestamp = Date.parse(value || "");
    if (Number.isFinite(timestamp)) return timestamp;
  }
  return Number.NaN;
}

function batchReservationEventValue(batch) {
  return timestampValue(
    batch?.updatedAt,
    batch?.createdAt,
    batch?.correctedAt,
    batch?.productionDate,
    batch?.date
  );
}

function releaseSupersededReservationOverrides(
  openOrders,
  eligibleBatches,
  maps,
  reconciledAt
) {
  openOrders.forEach((order) => {
    orderItems(order).forEach((item) => {
      const override = item?.reservationOverride;
      if (!override || override.active === false) return;

      const overrideAt = timestampValue(override.updatedAt);
      if (!Number.isFinite(overrideAt)) return;

      const newerBatch = eligibleBatches.find(
        (batch) =>
          batchMatchesOrderItem(batch, item, maps) &&
          batchReservationEventValue(batch) > overrideAt
      );
      if (!newerBatch) return;

      item.reservationOverride = {
        ...override,
        active: false,
        supersededAt: reconciledAt,
        supersededByBatch: String(newerBatch.code || newerBatch.id || ""),
      };
    });
  });
}

function allocationQuantity(allocation) {
  return nonNegative(allocation?.qty || allocation?.quantity);
}

function netSalesForBatch(state, batchCode) {
  return (state.sales || [])
    .filter((sale) => String(sale?.batchCode || "") === String(batchCode || ""))
    .reduce((total, sale) => total + number(sale?.qty || sale?.quantity), 0);
}

function appendAllocation(item, allocation) {
  if (!allocationQuantity(allocation)) return;
  const existing = item.allocations.find(
    (candidate) =>
      candidate.batchCode === allocation.batchCode &&
      Boolean(candidate.manual) === Boolean(allocation.manual) &&
      String(candidate.note || "") === String(allocation.note || "")
  );
  if (existing) {
    existing.qty = allocationQuantity(existing) + allocationQuantity(allocation);
    return;
  }
  item.allocations.push({
    batchCode: allocation.batchCode,
    qty: allocationQuantity(allocation),
    date: allocation.date || "",
    manual: Boolean(allocation.manual),
    note: allocation.note || "",
  });
}

function reservedQuantity(item) {
  return (item.allocations || []).reduce(
    (total, allocation) => total + allocationQuantity(allocation),
    0
  );
}

function updateItemReservationFields(item, closed = false) {
  const outstanding = outstandingQuantity(item);
  const reserved = closed ? 0 : Math.min(outstanding, reservedQuantity(item));
  const allocations = Array.isArray(item.allocations) ? item.allocations : [];
  item.reservedQty = reserved;
  item.producedQty = reserved;
  item.batchCode = [...new Set(allocations.map((allocation) => allocation.batchCode).filter(Boolean))].join(", ");
  item.readyDate = allocations.at(-1)?.date || "";

  // These must stay inside ORDER_ITEM_STATUSES in assets/admin.js. The server
  // used to write "concluido" and "parcial", which the admin's item status
  // <select> has no option for, so editing such an item silently reset it.
  if (closed || outstanding === 0) {
    item.productionStatus = "entregue";
  } else if (reserved >= outstanding) {
    item.productionStatus = "reservado";
  } else if (reserved > 0) {
    item.productionStatus = "em produção";
  } else {
    item.productionStatus = "pendente";
  }
}

function updateOrderStatus(order) {
  if (!isOpenOrder(order)) return;
  const items = orderItems(order);
  if (!items.length) return;

  const outstanding = items.reduce((total, item) => total + outstandingQuantity(item), 0);
  const reserved = items.reduce((total, item) => total + reservedQuantity(item), 0);
  // "entregue", not "concluido": ORDER_STATUSES in assets/admin.js has no
  // "concluido" option, and the payment reminder cron only treats an order as
  // receivable when status === "entregue", so an order closed here as
  // "concluido" never produced a payment reminder.
  if (outstanding === 0) {
    order.status = "entregue";
    delete order.statusManual;
    return;
  }
  // A status the operator chose deliberately is theirs to keep; this used to
  // recompute it out from under them on every save. Everything being delivered,
  // handled above, is a fact rather than a judgement, so that still wins.
  if (order.statusManual) return;
  if (reserved >= outstanding) {
    order.status = "pronto";
  } else if (reserved > 0) {
    order.status = "em produção";
  } else if (normalizeText(order.status) === "pronto") {
    order.status = "recebido";
  }
}

function reservationSnapshot(state) {
  return JSON.stringify({
    orders: (state.orders || []).map((order) => ({
      id: order.id,
      code: order.code,
      status: order.status,
      items: orderItems(order).map((item) => ({
        id: item.id,
        productId: item.productId,
        reservedQty: item.reservedQty,
        producedQty: item.producedQty,
        batchCode: item.batchCode,
        readyDate: item.readyDate,
        productionStatus: item.productionStatus,
        allocations: item.allocations,
        reservationOverride: item.reservationOverride,
      })),
    })),
  });
}

function orderAuditLabel(order) {
  return String(
    order?.client ||
      order?.clientName ||
      order?.customer ||
      order?.customerName ||
      order?.business ||
      order?.businessName ||
      order?.code ||
      order?.id ||
      "Pedido"
  );
}

function reservationAuditState(state, maps) {
  const rows = new Map();
  (state.orders || []).forEach((order, orderIndex) => {
    const orderIdentity = String(order?.id || order?.code || `order-${orderIndex}`);
    orderItems(order).forEach((item, itemIndex) => {
      const product = maps.products.get(item?.productId);
      const itemIdentity = String(
        item?.id ||
          item?.productId ||
          `${orderItemFlavor(item, maps)}-${orderItemSize(item, maps)}-${itemIndex}`
      );
      const flavor = String(
        item?.flavor ||
          item?.productName ||
          item?.name ||
          product?.flavor ||
          product?.name ||
          "Sabor"
      ).replace(/\s+\d+\s*ml\s*$/i, "");
      rows.set(`${orderIdentity}:${itemIdentity}`, {
        flavor,
        sizeMl: orderItemSize(item, maps),
        orderId: String(order?.code || order?.id || ""),
        client: orderAuditLabel(order),
        quantity: reservedQuantity(item),
      });
    });
  });
  return rows;
}

function reservationAuditChanges(beforeRows, afterRows, reconciledAt, user) {
  const records = [];
  const keys = new Set([...beforeRows.keys(), ...afterRows.keys()]);
  keys.forEach((key) => {
    const before = beforeRows.get(key);
    const after = afterRows.get(key);
    const previousQty = before?.quantity || 0;
    const newQty = after?.quantity || 0;
    if (previousQty === newQty) return;

    const row = after || before;
    const quantityChanged = newQty - previousQty;
    const direction = quantityChanged > 0 ? "recebeu" : "liberou";
    records.push({
      at: reconciledAt,
      user,
      action:
        quantityChanged > 0
          ? "Reserva automática aplicada"
          : "Reserva automática reduzida",
      entity: "reservation",
      flavor: row.flavor,
      sizeMl: row.sizeMl,
      orderId: row.orderId,
      client: row.client,
      previousQty,
      newQty,
      quantityChanged,
      reason: "Reconciliação automática de estoque e pedidos por prioridade FIFO.",
      detail: `${row.flavor} ${row.sizeMl}ml | ${row.client} | ${previousQty} -> ${newQty} (${direction} ${Math.abs(quantityChanged)}) | prioridade FIFO`,
    });
  });
  return records;
}

function reconcileReservations(inputState, options = {}) {
  const state = clone(inputState);
  state.products = Array.isArray(state.products) ? state.products : [];
  state.recipes = Array.isArray(state.recipes) ? state.recipes : [];
  state.batches = Array.isArray(state.batches) ? state.batches : [];
  state.orders = Array.isArray(state.orders) ? state.orders : [];
  state.sales = Array.isArray(state.sales) ? state.sales : [];
  state.audit = Array.isArray(state.audit) ? state.audit : [];

  const reconciledAt = options.now || new Date().toISOString();
  const before = reservationSnapshot(state);
  const maps = stateMaps(state);
  const beforeAuditRows = reservationAuditState(state, maps);
  const eligibleBatches = state.batches.filter(isEligibleBatch).sort(compareBatches);
  const batchesByCode = new Map(
    eligibleBatches.map((batch) => [String(batch.code || batch.id || ""), batch])
  );
  const remainingByBatch = new Map(
    eligibleBatches.map((batch) => {
      const code = String(batch.code || batch.id || "");
      const produced = batchProducedQuantity(batch);
      return [code, Math.max(0, produced - netSalesForBatch(state, code))];
    })
  );

  const openOrders = state.orders.filter(isOpenOrder).sort(compareOrders);
  const openOrderSet = new Set(openOrders);
  releaseSupersededReservationOverrides(
    openOrders,
    eligibleBatches,
    maps,
    reconciledAt
  );
  const manualCandidates = [];

  state.orders.forEach((order) => {
    orderItems(order).forEach((item, itemIndex) => {
      const originalAllocations = Array.isArray(item.allocations) ? item.allocations : [];
      if (openOrderSet.has(order)) {
        originalAllocations.forEach((allocation, allocationIndex) => {
          if (allocation?.manual) {
            manualCandidates.push({ order, item, itemIndex, allocation, allocationIndex });
          }
        });
      }
      // Only open orders are rebuilt. A closed order keeps its allocations as
      // the record of which batch filled it: they are never re-applied so they
      // hold no stock, but clearing them also cleared item.batchCode and
      // item.readyDate, destroying the lot traceability of every delivered
      // order the first time it was reconciled.
      if (openOrderSet.has(order)) item.allocations = [];
      updateItemReservationFields(item, !openOrderSet.has(order));
    });
  });

  manualCandidates
    .sort(
      (a, b) =>
        compareOrders(a.order, b.order) ||
        a.itemIndex - b.itemIndex ||
        a.allocationIndex - b.allocationIndex
    )
    .forEach(({ item, allocation }) => {
      const code = String(allocation?.batchCode || "");
      const batch = batchesByCode.get(code);
      if (!batch || !batchMatchesOrderItem(batch, item, maps)) return;

      const need = Math.max(0, reservationLimit(item) - reservedQuantity(item));
      const available = remainingByBatch.get(code) || 0;
      const quantity = Math.min(need, available, allocationQuantity(allocation));
      if (!quantity) return;

      appendAllocation(item, {
        ...allocation,
        batchCode: code,
        qty: quantity,
        date: allocation.date || batch.date || batch.productionDate || "",
        manual: true,
      });
      remainingByBatch.set(code, available - quantity);
    });

  eligibleBatches.forEach((batch) => {
    const code = String(batch.code || batch.id || "");
    let available = remainingByBatch.get(code) || 0;
    if (!available) return;

    openOrders.forEach((order) => {
      orderItems(order).forEach((item) => {
        if (!available || !batchMatchesOrderItem(batch, item, maps)) return;
        const need = Math.max(0, reservationLimit(item) - reservedQuantity(item));
        if (!need) return;

        const quantity = Math.min(need, available);
        appendAllocation(item, {
          batchCode: code,
          qty: quantity,
          date: batch.date || batch.productionDate || "",
          manual: false,
          note: "",
        });
        available -= quantity;
      });
    });
    remainingByBatch.set(code, available);
  });

  state.orders.forEach((order) => {
    const closed = !openOrderSet.has(order);
    orderItems(order).forEach((item) => updateItemReservationFields(item, closed));
    updateOrderStatus(order);
  });

  const after = reservationSnapshot(state);
  const changed = before !== after;
  if (changed && options.audit !== false) {
    const auditUser = options.user || options.updatedBy || "system";
    const detailedRecords = reservationAuditChanges(
      beforeAuditRows,
      reservationAuditState(state, maps),
      reconciledAt,
      auditUser
    );
    state.audit.unshift(...detailedRecords, {
      at: reconciledAt,
      user: auditUser,
      action: "Reservas reconciliadas",
      detail:
        "Reservas automáticas recalculadas por produto, sabor, tamanho e prioridade FIFO dos pedidos.",
    });
    state.audit = state.audit.slice(0, AUDIT_LIMIT);
  }

  const batches = eligibleBatches.map((batch) => {
    const code = String(batch.code || batch.id || "");
    const produced = batchProducedQuantity(batch);
    const available = remainingByBatch.get(code) || 0;
    return {
      code,
      flavor: batch.flavor || "",
      sizeMl: batchSize(batch, maps),
      produced,
      reserved: Math.max(0, produced - netSalesForBatch(state, code) - available),
      available,
    };
  });

  return {
    state,
    changed,
    summary: {
      batches,
      reserved: batches.reduce((total, batch) => total + batch.reserved, 0),
      available: batches.reduce((total, batch) => total + batch.available, 0),
    },
  };
}

module.exports = {
  batchMatchesOrderItem,
  batchSize,
  compareOrders,
  normalizeFlavor,
  orderItemSize,
  reconcileReservations,
};
