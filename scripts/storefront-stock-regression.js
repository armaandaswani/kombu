const assert = require('node:assert/strict');
const { availableProducts, validateSelection } = require('../api/_lib/storefront-stock');
const state = {
  products: [{ id: 'p', flavor: 'Uva', sizeMl: 500 }, { id: 'small', flavor: 'Uva', sizeMl: 300 }, { id: 'hidden', flavor: 'Manga', sizeMl: 500, visible: false }],
  batches: [
    { code: 'ok', productId: 'p', actual: 12, expiry: '2026-12-01' },
    { code: 'expired', productId: 'p', actual: 100, expiry: '2026-10-26' },
    { code: 'unknown', productId: 'p', actual: 100 },
    { code: 'blocked', productId: 'p', actual: 100, expiry: '2026-12-01', status: 'bloqueado' },
    { code: 'small', productId: 'small', actual: 100, sizeMl: 300, expiry: '2026-12-01' },
    { code: 'hidden', productId: 'hidden', actual: 100, expiry: '2026-12-01' },
  ],
  sales: [{ batchCode: 'ok', qty: 2 }],
  orders: [{ id: 'o', status: 'confirmado', items: [{ productId: 'p', flavor: 'Uva', qty: 3, sizeMl: 500, allocations: [{ batchCode: 'ok', qty: 3 }] }] }],
};
const before = JSON.stringify(state);
const products = availableProducts(state, new Date('2026-10-27T16:00:00Z'));
assert.deepEqual(products, [{ productId: 'p', flavor: 'Uva', sizeMl: 500, available: 7 }]);
assert.equal(JSON.stringify(state), before, 'public stock read must not modify the panel');
assert.equal(validateSelection([{ productId: 'p', qty: 4 }], products, 4)[0].flavor, 'Uva');
for (const items of [[{ productId: 'p', qty: 8 }], [{ productId: 'p', qty: 1.5 }], [{ productId: 'hidden', qty: 4 }], [{ productId: 'p', qty: 2 }, { productId: 'p', qty: 2 }], []]) assert.throws(() => validateSelection(items, products, 4), /stock_changed/);
assert.throws(() => availableProducts(null), /stock_unavailable/);
console.log('Storefront stock: panel availability, sales, reservations, validity, sizes, visibility and selection validation passed.');
