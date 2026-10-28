const { getAppState } = require('./kombu-backend');
const { reconcileReservations, batchMatchesOrderItem, orderItemSize } = require('./reservations');
const normal = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
function reservableProducts(state) {
  if (!state || !Array.isArray(state.products)) throw new Error('stock_unavailable');
  const maps = { products: new Map(state.products.map(p => [p.id, p])), recipes: new Map((state.recipes || []).map(r => [r.id, r])) };
  return state.products.filter(p => p.visible !== false && normal(p.status || 'ativo') === 'ativo' && orderItemSize({ productId: p.id }, maps) === 500)
    .map(p => ({ productId: p.id, flavor: String(p.flavor || p.name || ''), sizeMl: 500 })).filter(p => p.flavor);
}
async function getAvailability() {
  const state = await getAppState();
  return { products: availableProducts(state), reservationProducts: reservableProducts(state) };
}
function validateReservation(items, products, bottles) {
  if (bottles !== 15 && bottles < 20) { const e = new Error('reservation_kit_required'); e.status = 400; throw e; }
  const selection = validateSelection(items, products.map(p => ({ ...p, available: bottles })), bottles);
  if (selection.some(item => item.qty < 5)) { const e = new Error('reservation_minimum'); e.status = 400; throw e; }
  return selection;
}
function availableProducts(state, now = new Date()) {
  if (!state || !Array.isArray(state.products)) throw new Error('stock_unavailable');
  const maps = { products: new Map(state.products.map(p => [p.id, p])), recipes: new Map((state.recipes || []).map(r => [r.id, r])) };
  const available = new Map(reconcileReservations(state, { mode: 'preserve', audit: false }).summary.batches.map(b => [b.code, b.available]));
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Manaus', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const products = state.products.filter(p => p.visible !== false && normal(p.status || 'ativo') === 'ativo' && orderItemSize({ productId: p.id }, maps) === 500);
  const totals = new Map(products.map(p => [p.id, 0]));
  for (const batch of state.batches || []) {
    // Unknown or expired validity cannot be offered as ready-to-deliver stock.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(batch.expiry || '') || batch.expiry < today) continue;
    const qty = Math.max(0, Math.floor(available.get(String(batch.code || batch.id || '')) || 0));
    if (!qty) continue;
    const linkedId = batch.productId || maps.recipes.get(batch.recipeId)?.productId;
    const candidates = products.filter(p => batchMatchesOrderItem(batch, { productId: p.id, flavor: p.flavor || p.name, sizeMl: 500 }, maps));
    // A legacy batch without a product ID is offered only if its mapping is unambiguous.
    const product = linkedId ? candidates.find(p => p.id === linkedId) : candidates.length === 1 ? candidates[0] : null;
    if (product) totals.set(product.id, totals.get(product.id) + qty);
  }
  return products.map(p => ({ productId: p.id, flavor: String(p.flavor || p.name || ''), sizeMl: 500, available: totals.get(p.id) })).filter(p => p.flavor && p.available > 0);
}
async function getStock() { return availableProducts(await getAppState()); }
function validateSelection(items, products, bottles) {
  const invalid = () => { const e = new Error('stock_changed'); e.status = 409; throw e; };
  if (!Array.isArray(items) || !items.length || items.length > 20) invalid();
  const seen = new Set();
  const selected = items.map(item => {
    const product = products.find(p => p.productId === item.productId);
    if (!product || seen.has(item.productId) || !Number.isSafeInteger(item.qty) || item.qty < 5 || item.qty > product.available) invalid();
    seen.add(item.productId);
    return { productId: product.productId, flavor: product.flavor, sizeMl: 500, qty: item.qty };
  });
  if (selected.reduce((sum, item) => sum + item.qty, 0) !== bottles) invalid();
  return selected;
}
module.exports = { availableProducts, getStock, validateSelection, reservableProducts, getAvailability, validateReservation };
