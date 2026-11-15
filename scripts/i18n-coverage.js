// Walks every admin module and every dialog its buttons open, in the chosen
// locale, and reports interface text that is still Portuguese. Business data
// (anything stored in state, such as flavor or customer names) is excluded.
// Usage: AUDIT_BASE_URL=http://127.0.0.1:PORT node scripts/i18n-coverage.js
//   I18N_LOCALE=en (default) fails when untranslated text remains.
//   I18N_DUMP=path writes every finding as JSON instead of failing.
const fs = require("fs");
const { chromium, launchOptions } = require("./browser-runtime");

const baseUrl = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(baseUrl).hostname)) throw new Error("i18n coverage requires a local fixture server");
const locale = process.env.I18N_LOCALE || "en";
const dumpPath = process.env.I18N_DUMP || "";
const modules = ["operator", "dashboard", "orders", "sales", "receipts", "leads", "partners", "batches", "stock", "products", "recipes", "ingredients", "packaging", "purchases", "suppliers", "costs", "expenses", "reports", "cms", "schema"];
// Actions that leave the page or replace the whole state are not opened here.
const skipActions = new Set(["logout", "import-json", "restore-cost-base", "reset-demo", "clear-local", "export-json", "export-csv", "print"]);

async function collect(page, scope) {
  return page.evaluate((scopeName) => {
    const portuguese = /[ãáàâçéêíóôõúÃÁÀÂÇÉÊÍÓÔÕÚ]|\b(de|do|da|dos|das|para|com|sem|não|nao|ou|em|no|na|nos|nas|por|um|uma|ao|aos|seu|sua|este|esta|novo|nova|salvar|cancelar|excluir|editar|pedido|pedidos|venda|vendas|compra|compras|estoque|lote|lotes|cliente|clientes|parceiro|fornecedor|despesa|receita|custo|garrafa|garrafas|sabor|sabores|preço|total|mês|hoje|ontem|ativo|ativa|pago|aberto|recebido|entregue|cancelado|pronto|produzido|reservado|pendente|abrir|fechar|voltar|ver|registrar|adicionar|remover|buscar|filtrar|período|resumo|histórico|quantidade|valor|data|status|tipo|nome|observação|observações)\b/i;
    const state = JSON.parse(localStorage.getItem("kombuAdminStateV3") || "{}");
    const data = new Set();
    (function walk(value) {
      if (typeof value === "string") { const text = value.trim(); if (text) data.add(text); return; }
      if (Array.isArray(value)) return value.forEach(walk);
      if (value && typeof value === "object") Object.values(value).forEach(walk);
    })(state);
    const found = [];
    const consider = (raw, where) => {
      const text = String(raw || "").replace(/\s+/g, " ").trim();
      if (!text || text.length < 2 || !portuguese.test(text) || data.has(text)) return;
      found.push({ text, where, scope: scopeName });
    };
    const roots = [document.querySelector("#adminShell"), document.querySelector("#adminModal"), document.querySelector("#loginScreen"), document.querySelector("title")].filter(Boolean);
    roots.forEach((root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const parent = node.parentElement;
        if (!parent || parent.closest("script, style, .material-symbols-outlined, [data-i18n-skip]")) continue;
        if (parent.closest("[hidden]") && !parent.closest("#adminModal")) continue;
        consider(node.nodeValue, "text");
      }
      root.querySelectorAll?.("[placeholder], [title], [aria-label], [alt], [data-tooltip]").forEach((element) => {
        if (element.closest("[data-i18n-skip]")) return;
        ["placeholder", "title", "aria-label", "alt", "data-tooltip"].forEach((attribute) => {
          if (element.hasAttribute(attribute)) consider(element.getAttribute(attribute), attribute);
        });
      });
    });
    return found;
  }, scope);
}

async function openModule(page, moduleName) {
  await page.evaluate((value) => {
    document.querySelector("#adminModal")?.classList.remove("is-open");
    const select = document.querySelector("#mobileModuleSelector");
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }, moduleName);
  await page.waitForTimeout(60);
}

async function run() {
  const browser = await chromium.launch(launchOptions);
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: locale === "en" ? "en-US" : "pt-BR" });
  await context.addInitScript((value) => localStorage.setItem("kombuAdminLocale", value), locale);
  const page = await context.newPage();
  const findings = [];
  const runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("dialog", async (dialog) => {
    const text = dialog.message().replace(/\s+/g, " ").trim();
    if (/[ãáàâçéêíóôõú]|\b(de|do|da|para|com|não|o|a|os|as)\b/i.test(text)) findings.push({ text, where: `dialog:${dialog.type()}`, scope: "dialog" });
    await dialog.dismiss().catch(() => {});
  });

  await page.goto(`${baseUrl}/admin.html`, { waitUntil: "domcontentloaded" });
  findings.push(...(await collect(page, "login")));
  await page.fill("#adminPassword", "local-i18n");
  await page.click('#loginForm button[type="submit"]');
  await page.waitForSelector("#adminShell:not(.is-locked)", { timeout: 10000 });
  // Records in every collection so tables, details and status labels render.
  await page.evaluate(() => {
    const today = new Date().toLocaleDateString("sv-SE");
    const product = state.products[0];
    const recipe = state.recipes.find((item) => item.productId === product.id) || state.recipes[0];
    state.batches.push({ id: "bat-i18n", code: "L-I18N", productId: product.id, recipeId: recipe?.id || "", sizeMl: 500, flavor: product.flavor, planned: 20, actual: 20, date: today, status: "aprovado" });
    state.orders.push({ id: "ord-i18n", code: "PED-I18N", customerName: "Cliente Fixture", clientType: "novo_parceiro", orderDate: today, deliveryDate: today, createdAt: new Date().toISOString(), status: "confirmado", paymentStatus: "aguardando pagamento", paymentMethod: "Pix", items: [{ key: "oi-i18n", productId: product.id, flavor: product.flavor, sizeMl: 500, qty: 12, unitPrice: 15, allocations: [{ batchCode: "L-I18N", qty: 5, manual: false }] }] });
    state.sales.push({ id: "sale-i18n", date: today, partner: "Cliente Fixture", customerName: "Cliente Fixture", channel: "varejo", movementType: "venda", priceType: "varejo", flavor: product.flavor, productId: product.id, batchCode: "L-I18N", qty: 2, unitPrice: 22, discount: 0, delivery: 0 });
    state.purchases.push({ id: "pur-i18n", date: today, supplier: "Fornecedor Fixture", item: state.ingredients[0].name, stockCollection: "ingredients", stockItemId: state.ingredients[0].id, packageCount: 1, packageSize: 1000, packageUnit: "g", qty: 1000, unit: "g", total: 25, costPerUnit: 0.025, method: "Pix" });
    state.expenses.push({ id: "exp-i18n", date: today, category: "Logística", description: "Frete fixture", amount: 40, method: "Pix" });
    state.suppliers.push({ id: "sup-i18n", name: "Fornecedor Fixture", city: "Manaus", status: "ativo" });
    state.partners.push({ id: "par-i18n", name: "Parceiro Fixture", type: "Café", city: "Manaus", visible: true });
    state.leads.push({ id: "lead-i18n", type: "revenda", name: "Lead Fixture", whatsapp: "92999990000", status: "novo", createdAt: new Date().toISOString() });
    persistLocalState();
    render();
  });

  for (const moduleName of modules) {
    await openModule(page, moduleName);
    findings.push(...(await collect(page, moduleName)));
    const actions = await page.$$eval("#adminContent [data-action]", (buttons) => buttons.map((button, index) => ({ index, action: button.dataset.action })));
    const seen = new Set();
    for (const { index, action } of actions) {
      const base = action.split(":")[0];
      if (skipActions.has(base) || seen.has(base)) continue;
      seen.add(base);
      await openModule(page, moduleName);
      const clicked = await page.evaluate((position) => {
        const button = document.querySelectorAll("#adminContent [data-action]")[position];
        if (!button || button.disabled) return false;
        button.click();
        return true;
      }, index);
      if (!clicked) continue;
      await page.waitForTimeout(60);
      findings.push(...(await collect(page, `${moduleName}>${base}`)));
    }
  }
  // Every string the layer tried and could not match, minus business data:
  // names stored in state, codes, numbers and units.
  const missing = locale === "pt" ? [] : await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("kombuAdminStateV3") || "{}");
    const data = new Set();
    (function walk(value) {
      if (typeof value === "string") { const text = value.trim(); if (text.length > 1) data.add(text); return; }
      if (Array.isArray(value)) return value.forEach(walk);
      if (value && typeof value === "object") Object.values(value).forEach(walk);
    })(state);
    const byLength = [...data].sort((a, b) => b.length - a.length);
    const same = new Set(["Kombú", "Kombú Admin", "Pix", "EAN", "CMS", "CRM", "PDF", "CSV", "WhatsApp", "Instagram", "Supabase", "Vercel", "Manaus", "ml", "un", "kg", "g", "R$", "Status", "Total", "Dashboard", "Email", "Lead", "Leads", "Checkout", "Ledger", "Owner", "Admin", "Viewer", "base"]);
    return window.KombuLocale.misses().map((row) => row.text).filter((text) => {
      if (byLength.some((value) => value.includes(text))) return false; // a piece of a stored name
      let rest = ` ${text} `.replace(/\b\d{1,2}:\d{2}(:\d{2})?\s?(AM|PM)\b/g, " ");
      byLength.forEach((value) => { if (rest.includes(value)) rest = rest.split(value).join(" "); });
      rest = rest
        .replace(/R\$\s?-?[\d.,]+/g, " ")
        .replace(/\b[A-Z]{1,5}-?[A-Z0-9]*\d[A-Z0-9-]*\b/g, " ")
        .replace(/[\d.,:%/#@×x+-]+/g, " ");
      const words = rest.split(/[^A-Za-zÀ-ÿ]+/).filter((word) => word.length > 1 && !same.has(word));
      return words.length > 0;
    });
  });
  // The switch itself: back to Portuguese restores the page, English survives a
  // reload, and longer English labels still fit a phone.
  const switchChecks = [];
  if (locale === "en") {
    const navLabel = () => page.$eval('#adminNav [data-module="orders"] .label', (node) => node.textContent.trim());
    await openModule(page, "dashboard");
    if (await navLabel() !== "Orders") switchChecks.push(`nav label in English is "${await navLabel()}"`);
    await page.click('[data-locale="pt"]');
    await page.waitForTimeout(80);
    if (await navLabel() !== "Pedidos") switchChecks.push(`nav label after switching to PT is "${await navLabel()}"`);
    const leftovers = await page.evaluate(() => ["Orders", "Stock by flavor", "Log out", "Public site", "Search EAN"].filter((text) => document.body.innerText.includes(text) || [...document.querySelectorAll("[placeholder]")].some((node) => node.placeholder.includes(text))));
    if (leftovers.length) switchChecks.push(`English left after switching to PT: ${leftovers.join(", ")}`);
    if (await page.evaluate(() => document.documentElement.lang) !== "pt-BR") switchChecks.push("html lang not pt-BR after switching");
    await page.click('[data-locale="en"]');
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("#adminShell:not(.is-locked)", { timeout: 10000 });
    await page.waitForTimeout(80);
    if (await navLabel() !== "Orders") switchChecks.push(`after reload the nav label is "${await navLabel()}"`);
    if (await page.evaluate(() => document.documentElement.lang) !== "en") switchChecks.push("html lang not en after reload");
    await page.setViewportSize({ width: 390, height: 844 });
    for (const moduleName of modules) {
      await openModule(page, moduleName);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 2) switchChecks.push(`${moduleName} overflows by ${overflow}px at 390px in English`);
    }
  }
  await browser.close();
  if (switchChecks.length && !dumpPath) throw new Error(`Language switch checks failed:\n  ${switchChecks.join("\n  ")}`);

  const unique = new Map();
  findings.forEach((item) => {
    const key = `${item.where === "text" ? "" : item.where + "|"}${item.text}`;
    if (!unique.has(key)) unique.set(key, { ...item, scopes: new Set() });
    unique.get(key).scopes.add(item.scope);
  });
  const rows = [...unique.values()].map((item) => ({ text: item.text, where: item.where, scopes: [...item.scopes].slice(0, 6) }));
  if (dumpPath) {
    fs.writeFileSync(dumpPath, JSON.stringify({ locale, count: rows.length, runtimeErrors, missing, rows }, null, 2));
    console.log(`i18n coverage (${locale}): ${rows.length} Portuguese-looking strings and ${missing.length} catalog misses written to ${dumpPath}; ${runtimeErrors.length} runtime errors.`);
    return;
  }
  if (runtimeErrors.length) throw new Error(`Runtime errors during i18n walk:\n${runtimeErrors.join("\n")}`);
  if (locale === "en" && missing.length) {
    throw new Error(`${missing.length} interface strings have no English entry in assets/admin-i18n.js:\n${missing.slice(0, 60).map((text) => `  ${text}`).join("\n")}`);
  }
  console.log(`i18n coverage (${locale}): every module and dialog renders without untranslated interface text; switching back to PT restores the page, the choice survives a reload and no module overflows at 390px.`);
}

run().catch((error) => { console.error(error.message || error); process.exitCode = 1; });
