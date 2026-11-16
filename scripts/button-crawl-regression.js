// Presses every button, link and menu on every admin screen and fails when one
// does nothing visible or throws: "a button must never exist merely as a
// visual element". A press counts as working when it opens or changes a form or
// dialog, changes screen, downloads, opens a tab, saves data, moves focus,
// shows a message, or changes the page. State is restored before every press
// and confirmations are declined, so delete buttons are exercised safely.
const assert = require("node:assert/strict");
const { chromium, launchOptions } = require("./browser-runtime");

const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local fixtures only");
const allModules = ["operator", "dashboard", "orders", "sales", "receipts", "leads", "partners", "batches", "stock", "purchases", "ingredients", "packaging", "recipes", "suppliers", "expenses", "costs", "reports", "products", "cms", "schema"];
// CRAWL_MODULES=stock,orders limits the walk while debugging.
const modules = process.env.CRAWL_MODULES ? process.env.CRAWL_MODULES.split(",") : allModules;
// Leaves the page or replaces every record; covered by their own suites.
const skip = new Set(["reset-demo", "import-json", "restore-cost-base"]);

(async () => {
  const browser = await chromium.launch(launchOptions);
  const dead = [];
  const broken = [];
  let pressed = 0;
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: "pt-BR", acceptDownloads: true });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    let dialogs = 0;
    page.on("dialog", (dialog) => { dialogs += 1; return dialog.dismiss(); });
    let downloads = 0;
    page.on("download", () => { downloads += 1; });
    await page.goto(`${base}/admin.html`);
    await page.fill("#adminPassword", "local-crawl");
    await page.click('#loginForm button[type="submit"]');
    await page.waitForSelector("#adminShell:not(.is-locked)");
    // Records in every collection, so tables and their row buttons render.
    const saved = await page.evaluate(() => {
      window.open = () => { window.__opened = (window.__opened || 0) + 1; return null; };
      const today = new Date().toLocaleDateString("sv-SE");
      const product = state.products[0];
      const recipe = state.recipes.find((item) => item.productId === product.id) || state.recipes[0];
      state.batches.push({ id: "bat-crawl", code: "L-CRAWL", productId: product.id, recipeId: recipe?.id || "", sizeMl: 500, flavor: product.flavor, actual: 20, expected: 20, date: today, status: "aprovado" });
      state.orders.push({ id: "ord-crawl", code: "PED-CRAWL", customerName: "Cliente Crawl", clientType: "novo_parceiro", orderDate: today, deliveryDate: today, createdAt: new Date().toISOString(), status: "confirmado", paymentStatus: "aguardando pagamento", paymentMethod: "Pix", items: [{ key: "oi-crawl", productId: product.id, flavor: product.flavor, sizeMl: 500, qty: 12, unitPrice: 15, allocations: [{ batchCode: "L-CRAWL", qty: 5, manual: false }] }] });
      state.sales.push({ id: "sale-crawl", date: today, partner: "Cliente Crawl", customerName: "Cliente Crawl", movementType: "venda", priceType: "varejo", flavor: product.flavor, productId: product.id, batchCode: "L-CRAWL", qty: 2, unitPrice: 22, discount: 0, delivery: 0 });
      state.purchases.push({ id: "pur-crawl", kind: "stock", date: today, supplier: "Fornecedor Crawl", item: state.ingredients[0].name, stockCollection: "ingredients", stockItemId: state.ingredients[0].id, packageCount: 1, packageSize: 1000, packageUnit: "g", qty: 1000, unit: "g", total: 25, costPerUnit: 0.025 });
      state.expenses.push({ id: "exp-crawl", date: today, category: "Logística", description: "Frete", amount: 40, method: "Pix" });
      state.suppliers.push({ id: "sup-crawl", name: "Fornecedor Crawl", city: "Manaus", status: "ativo" });
      state.partners.push({ id: "par-crawl", name: "Parceiro Crawl", type: "Café", city: "Manaus", visible: true });
      state.leads.push({ id: "lead-crawl", type: "revenda", name: "Lead Crawl", whatsapp: "92999990000", status: "novo", createdAt: new Date().toISOString() });
      state.receipts.push({ id: "rec-crawl", number: "REC-CRAWL", type: "manual", customerName: "Cliente Crawl", amount: 30, receivedAt: today, status: "emitido", items: [], deliveryIds: [], issuedAt: new Date().toISOString() });
      persistLocalState();
      return JSON.stringify(state);
    });

    // Presses also change view settings (a stock size, an order filter), which
    // change which buttons render, so those are restored with the data.
    const view = await page.evaluate(() => JSON.stringify({ currentStockView, currentKombuchaStockSize, currentSalesPeriod, currentDashboardOrderView, dashboardMonth, orderListFilters, globalSearch, operatorView, operatorOrdersTab }));
    const reset = (moduleName) => page.evaluate(({ snapshot, view, moduleName }) => {
      closeModal();
      state = JSON.parse(snapshot);
      persistLocalState();
      operatorSearch = "";
      ({ currentStockView, currentKombuchaStockSize, currentSalesPeriod, currentDashboardOrderView, dashboardMonth, orderListFilters, globalSearch, operatorView, operatorOrdersTab } = JSON.parse(view));
      setModule(moduleName);
      window.scrollTo(0, 0);
    }, { snapshot: saved, view, moduleName });
    const signature = () => page.evaluate(() => ({
      modal: document.querySelector("#adminModal")?.classList.contains("is-open") ? document.querySelector("#adminModalBody")?.innerHTML.length + (document.querySelector("#adminModalTitle")?.textContent || "") : "",
      module: currentModule,
      content: document.querySelector("#adminContent")?.innerHTML || "",
      data: localStorage.getItem("kombuAdminStateV3"),
      focus: document.activeElement?.id || document.activeElement?.tagName || "",
      opened: window.__opened || 0,
      pressed: window.__pressed || "",
    }));

    for (const moduleName of modules) {
      await reset(moduleName);
      const controls = await page.evaluate(() => [...document.querySelectorAll("#adminContent button, #adminContent summary, #adminContent a[href]")]
        .map((element, index) => ({
          index,
          action: element.dataset.action || "",
          label: (element.getAttribute("aria-label") || element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60),
          visible: element.getClientRects().length > 0 && !element.closest("[hidden]"),
          // Already the current choice: pressing it again rightly changes nothing.
          selected: element.classList.contains("is-active") || element.getAttribute("aria-pressed") === "true" || element.hasAttribute("aria-current"),
          disabled: element.disabled === true,
          href: element.getAttribute("href") || "",
        })));
      const seen = new Set();
      for (const control of controls) {
        if (!control.visible || control.selected) continue;
        const key = `${control.action.split(":")[0]}|${control.action ? "" : control.label}`;
        if (seen.has(key) || skip.has(control.action.split(":")[0])) continue;
        seen.add(key);
        if (control.disabled) {
          dead.push(`${moduleName}: "${control.label}" is disabled`);
          continue;
        }
        if (control.href) {
          if (control.href === "#" || control.href.startsWith("javascript:")) dead.push(`${moduleName}: link "${control.label}" goes nowhere`);
          continue;
        }
        await reset(moduleName);
        const before = await signature();
        const dialogsBefore = dialogs;
        const downloadsBefore = downloads;
        const errorsBefore = errors.length;
        await page.evaluate((index) => {
          const element = [...document.querySelectorAll("#adminContent button, #adminContent summary, #adminContent a[href]")][index];
          element?.scrollIntoView({ block: "center" });
          window.__pressed = element ? element.outerHTML.slice(0, 90) : "nothing";
          element?.click();
        }, control.index);
        await page.waitForTimeout(120);
        pressed += 1;
        const after = await signature();
        if (errors.length > errorsBefore) broken.push(`${moduleName}: "${control.label}" (${control.action || "no action"}) threw: ${errors.slice(errorsBefore).join(" | ")}`);
        const changed = Object.keys(before).some((field) => field !== "pressed" && before[field] !== after[field]) || dialogs > dialogsBefore || downloads > downloadsBefore;
        if (!changed) dead.push(`${moduleName}: "${control.label}" (${control.action || "no action"}) did nothing visible [pressed: ${after.pressed}; modal ${JSON.stringify(after.modal)}; module ${after.module}]`);
      }
    }
    await context.close();
  } finally {
    await browser.close();
  }
  assert.deepEqual(broken, [], `buttons that throw:\n${broken.join("\n")}`);
  assert.deepEqual(dead, [], `buttons that do nothing:\n${dead.join("\n")}`);
  console.log(`Button crawl: ${pressed} buttons, links and menus pressed across ${modules.length} screens; every one responded and none threw.`);
})().catch((error) => { console.error(error.message || error); process.exitCode = 1; });
