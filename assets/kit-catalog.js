// Public kit prices approved on 2026-10-27. Also required by the server: all
// monetary calculations use integer centavos and ignore browser-supplied totals.
(function (root, factory) {
  const catalog = factory();
  if (typeof module === "object" && module.exports) module.exports = catalog;
  else root.KombuKits = catalog;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";
  const kits = Object.freeze([
    Object.freeze({ id: "kit-4", name: "Primeiros sabores", bottles: 4, sizeMl: 500, priceCents: 10000 }),
    Object.freeze({ id: "kit-6", name: "Para compartilhar", bottles: 6, sizeMl: 500, priceCents: 14100 }),
    Object.freeze({ id: "kit-12", name: "Mais descobertas", bottles: 12, sizeMl: 500, priceCents: 26400 }),
    Object.freeze({ id: "kit-20", name: "Sua seleção completa", bottles: 20, sizeMl: 500, priceCents: 40000 }),
  ]);
  const discountBps = 500;
  const commissionBps = 1000;
  function code(value) {
    const normalized = String(value || "").trim().toUpperCase();
    return /^[A-Z0-9_-]{1,40}$/.test(normalized) ? normalized : "";
  }
  function quote(kitId, creator = null, deliveryCents = 0) {
    const kit = kits.find((item) => item.id === kitId);
    if (!kit) throw new Error("invalid_kit");
    if (!Number.isSafeInteger(deliveryCents) || deliveryCents < 0) throw new Error("invalid_delivery_fee");
    if (creator && (!creator.active || !code(creator.code) || !creator.id)) throw new Error("invalid_creator_code");
    const discountCents = creator ? Math.round(kit.priceCents * discountBps / 10000) : 0;
    const productsCents = kit.priceCents - discountCents;
    return {
      kitId: kit.id, kitName: kit.name, bottles: kit.bottles, sizeMl: kit.sizeMl,
      subtotalCents: kit.priceCents, discountCents, productsCents, deliveryCents,
      totalCents: productsCents + deliveryCents,
      couponCode: creator ? code(creator.code) : "", creatorId: creator?.id || null,
      discountBps: creator ? discountBps : 0, commissionBps: creator ? commissionBps : 0,
      commissionCents: creator ? Math.round(productsCents * commissionBps / 10000) : 0,
    };
  }
  return Object.freeze({ kits, code, quote, discountBps, commissionBps });
});
