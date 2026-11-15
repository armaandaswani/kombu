// Catalog integrity, translation rules and locale formatting for the admin.
// The browser walk over every screen is scripts/i18n-coverage.js.
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { extract, loadCatalog } = require("./i18n-extract");
const { createAdminSandbox } = require("./admin-harness");

const root = path.resolve(__dirname, "..");

function loadLocale() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(root, "assets/admin-i18n.js"), "utf8"), sandbox);
  vm.runInContext(fs.readFileSync(path.join(root, "assets/admin-locale.js"), "utf8"), sandbox);
  return sandbox.window.KombuLocale;
}

// 1. Every entry is usable: a non-empty value with the same placeholders.
const catalog = loadCatalog();
Object.entries(catalog.en).forEach(([key, value]) => {
  assert.ok(typeof value === "string" && value.trim(), `empty translation for ${JSON.stringify(key)}`);
  const slots = (text) => [...text.matchAll(/\{(\d+)\}/g)].map((match) => match[1]).sort().join(",");
  assert.strictEqual(slots(value), slots(key), `placeholders differ for ${JSON.stringify(key)}`);
});

// 2. No Portuguese interface text in admin.js or admin.html lacks an entry.
const missing = [...extract().keys()].filter((text) => !(text in catalog.en) && !(catalog.same || []).includes(text));
assert.deepStrictEqual(missing.slice(0, 30), [], `${missing.length} interface strings have no English entry; run node scripts/i18n-extract.js --json out.json`);

// 3. Stored enumerations shown in the interface have entries.
const admin = createAdminSandbox();
const enumerations = admin.__eval(`[
  ...ORDER_STATUSES, ...ORDER_ITEM_STATUSES, ...PAYMENT_STATUSES, ...PAYMENT_METHODS,
  ...ORDER_CLIENT_TYPES.map((type) => type.label), ...FLAVOR_CATEGORIES,
]`);
const locale = loadLocale();
locale.setLocale("en");
// Plain string options of form selects (statuses), excluding units.
const adminSource = fs.readFileSync(path.join(root, "assets/admin.js"), "utf8");
[...adminSource.matchAll(/options: \[((?:\s*"[^"]*",?)+)\s*\]/g)].forEach((match) => {
  JSON.parse(`[${match[1].replace(/,\s*$/, "")}]`).filter((value) => !["kg", "g", "l", "ml", "un"].includes(value)).forEach((value) => enumerations.push(value));
});
const missingEnumerations = [...enumerations].filter((value) => !locale.has(value) && !(catalog.same || []).includes(value));
assert.deepStrictEqual(missingEnumerations, [], "enumerations shown in the interface need English entries");

// 4. Translation rules.
assert.strictEqual(locale.translate("Pedidos"), "Orders");
assert.strictEqual(locale.translate("  pago\n  "), " paid ");
assert.strictEqual(locale.translate("Lote L-2026-01"), "Batch L-2026-01", "template slot keeps the code");
assert.strictEqual(locale.translate("13 disp."), "13 avail.", "count before a known label");
assert.strictEqual(locale.translate("Maracujá"), "Maracujá", "business data is left as entered");
assert.strictEqual(locale.translateMessage("Excluir \"Maracujá\"? Esta acao remove o registro deste painel."), "Delete \"Maracujá\"? This action removes the record from this panel.");
const dialog = locale.translateMessage("Excluir \"Chá\"? Esta acao remove o registro deste painel.\n\nEste registro ainda e usado por:\n- 2 receitas");
assert.strictEqual(dialog.split("\n").length, 4, "multi-line dialogs keep their line breaks");
assert.ok(!/Excluir|usado por/.test(dialog), `dialog still Portuguese: ${dialog}`);
locale.setLocale("pt");
assert.strictEqual(locale.translate("Pedidos"), "Pedidos", "Portuguese passes through untouched");

// 5. Formats follow the panel language; customer documents stay pt-BR.
admin.__eval('currentLocale = "en"');
assert.strictEqual(admin.__eval("brl(1234.5)"), "R$1,234.50");
assert.strictEqual(admin.__eval("inDocumentLocale(() => brl(1234.5))").replace(/\s/g, " "), "R$ 1.234,50");
assert.strictEqual(admin.__eval('fullDate("2026-11-15")'), "11/15/2026");
assert.strictEqual(admin.__eval('inDocumentLocale(() => fullDate("2026-11-15"))'), "15/11/2026");
admin.__eval('currentLocale = "pt"');
assert.strictEqual(admin.__eval("brl(1234.5)").replace(/\s/g, " "), "R$ 1.234,50");

// 6. A receipt issued while the panel is in English is still a Brazilian
// document. jsPDF is replaced by a recorder of the text it is asked to draw.
const drawn = [];
const recorder = new Proxy(function () {}, {
  get: (target, name) => {
    if (name === "text") return (text) => { drawn.push([].concat(text).join(" ")); return recorder; };
    if (name === "splitTextToSize") return (text) => [text];
    if (name === "getNumberOfPages") return () => 1;
    if (name === "internal") return { pageSize: { getWidth: () => 210, getHeight: () => 297 } };
    return () => recorder;
  },
  construct: () => recorder,
});
admin.jspdf = { jsPDF: recorder };
admin.__setState({ ...admin.__getState(), receipts: [{ id: "rec-en", number: "REC-2026-001", type: "manual", customerName: "Cliente Teste", amount: 1234.5, receivedAt: "2026-11-15", paymentMethod: "Pix", status: "emitido", items: [], deliveryIds: [] }] });
admin.__eval('currentLocale = "en"');
admin.__eval('receiptPdf("rec-en", "download")');
const receiptText = drawn.join("\n");
assert.ok(receiptText.includes("RECIBO") && receiptText.includes("Recebemos de"), `receipt text not Portuguese:\n${receiptText}`);
assert.ok(/R\$\s1\.234,50/.test(receiptText), `receipt amount not in pt-BR format:\n${receiptText}`);
assert.ok(receiptText.includes("15/11/2026"), `receipt date not in pt-BR format:\n${receiptText}`);
assert.strictEqual(admin.__eval("formatLocale()"), "en-US", "document locale is released after the receipt");
admin.__eval('currentLocale = "pt"');

console.log(`i18n regression: ${Object.keys(catalog.en).length} entries consistent, no unextracted interface text, enumerations covered, translation rules and document formats passed.`);
