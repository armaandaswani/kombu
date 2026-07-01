const STORAGE_KEY = "kombuAdminStateV1";

const defaultState = {
  ingredients: [
    { id: "ing-tea", name: "Chá Verde Banchá Orgânico", category: "chá", supplier: "Ervas da Terra", purchaseUnit: "kg", costPerUnit: 85, stock: 15.5, min: 4, expires: "2026-10-20", location: "Prateleira A", status: "ativo" },
    { id: "ing-sugar", name: "Açúcar Cristal Orgânico", category: "açúcar", supplier: "Doce Vida Agro", purchaseUnit: "kg", costPerUnit: 12.5, stock: 12, min: 20, expires: "2027-02-10", location: "Secos", status: "ativo" },
    { id: "ing-ginger", name: "Gengibre Fresco", category: "especiaria", supplier: "Amazon Sabores", purchaseUnit: "kg", costPerUnit: 30, stock: 3.2, min: 5, expires: "2026-07-12", location: "Câmara fria", status: "ativo" },
    { id: "ing-turmeric", name: "Cúrcuma", category: "especiaria", supplier: "Amazon Sabores", purchaseUnit: "kg", costPerUnit: 42, stock: 4.8, min: 2, expires: "2026-08-22", location: "Câmara fria", status: "ativo" },
    { id: "ing-lemon", name: "Limão Tahiti", category: "fruta", supplier: "Feira Manaus Moderna", purchaseUnit: "kg", costPerUnit: 9, stock: 18, min: 8, expires: "2026-07-08", location: "Câmara fria", status: "ativo" },
    { id: "ing-passion", name: "Polpa de Maracujá", category: "fruta", supplier: "Sítio Rio Negro", purchaseUnit: "kg", costPerUnit: 12, stock: 20, min: 10, expires: "2026-09-01", location: "Freezer", status: "ativo" },
    { id: "ing-berries", name: "Mix de Frutas Vermelhas", category: "fruta", supplier: "Frutaria Norte", purchaseUnit: "kg", costPerUnit: 46, stock: 8.5, min: 6, expires: "2026-08-18", location: "Freezer", status: "ativo" },
    { id: "ing-hibiscus", name: "Hibisco Seco", category: "flor", supplier: "Ervas da Terra", purchaseUnit: "kg", costPerUnit: 72, stock: 2, min: 4, expires: "2027-01-01", location: "Secos", status: "ativo" },
    { id: "ing-apple", name: "Maçã Fuji", category: "fruta", supplier: "Frutaria Norte", purchaseUnit: "kg", costPerUnit: 8, stock: 25, min: 8, expires: "2026-07-14", location: "Câmara fria", status: "ativo" },
    { id: "ing-cinnamon", name: "Canela em Pau", category: "especiaria", supplier: "Ervas da Terra", purchaseUnit: "kg", costPerUnit: 96, stock: 1.4, min: 0.8, expires: "2027-03-30", location: "Secos", status: "ativo" },
    { id: "ing-butterfly", name: "Flor Borboleta Azul", category: "flor", supplier: "Jardim Comestível", purchaseUnit: "kg", costPerUnit: 180, stock: 1.1, min: 1, expires: "2026-12-05", location: "Secos", status: "ativo" },
  ],
  packaging: [
    { id: "pkg-bottle", name: "Garrafa PET Transparente 500ml", supplier: "Vidros do Sul", unit: "un", costEach: 2.15, stock: 1240, min: 500, location: "Estoque seco" },
    { id: "pkg-cap", name: "Tampa Branca Lacre", supplier: "Tampas Brasil", unit: "un", costEach: 0.45, stock: 2500, min: 800, location: "Estoque seco" },
    { id: "pkg-label", name: "Rótulo Premium", supplier: "Print Manaus", unit: "un", costEach: 0.62, stock: 1800, min: 800, location: "Estoque seco" },
    { id: "pkg-box", name: "Caixa de Transporte 12 unidades", supplier: "Embalagens Norte", unit: "un", costEach: 2.4, stock: 180, min: 70, location: "Estoque seco" },
  ],
  suppliers: [
    { id: "sup-1", name: "Ervas da Terra", contact: "Luana", whatsapp: "(92) 98888-1010", email: "compras@ervasdaterra.com", city: "Manaus", categories: "chás, flores, especiarias", leadTime: "3 dias", status: "ativo" },
    { id: "sup-2", name: "Amazon Sabores", contact: "Rafael", whatsapp: "(92) 97777-2323", email: "vendas@amazonsabores.com", city: "Manaus", categories: "frutas, extratos", leadTime: "2 dias", status: "ativo" },
    { id: "sup-3", name: "Print Manaus", contact: "Bianca", whatsapp: "(92) 96666-4545", email: "print@manaus.com", city: "Manaus", categories: "rótulos", leadTime: "7 dias", status: "ativo" },
  ],
  partners: [
    { id: "par-1", name: "Empório Amazônia Viva", type: "empório", neighborhood: "Adrianópolis", city: "Manaus", whatsapp: "(92) 99209-7165", instagram: "@emporioamazoniaviva", flavors: "Maracujá, Imunidade, Frutas Vermelhas", visible: true, terms: "15 dias", lastDelivery: "2026-06-22" },
    { id: "par-2", name: "Solar Café Regional", type: "café", neighborhood: "Centro", city: "Manaus", whatsapp: "(92) 99209-7165", instagram: "@solarcaferegional", flavors: "Hibisco, Maçã e Canela", visible: true, terms: "à vista", lastDelivery: "2026-06-24" },
    { id: "par-3", name: "Studio Corpo Leve", type: "academia", neighborhood: "Vieiralves", city: "Manaus", whatsapp: "(92) 99209-7165", instagram: "@studiocorpoleve", flavors: "Imunidade, Pêra", visible: true, terms: "7 dias", lastDelivery: "2026-06-25" },
  ],
  recipes: [
    {
      id: "rec-imunidade-v3",
      flavor: "Imunidade",
      version: "v3",
      status: "ativa",
      bottleMl: 500,
      yieldBottles: 200,
      wastePct: 4,
      labor: 160,
      utilities: 72,
      other: 38,
      wholesalePrice: 10.5,
      retailPrice: 20,
      ingredients: [
        { ingredientId: "ing-tea", qty: 0.9, unit: "kg" },
        { ingredientId: "ing-sugar", qty: 6, unit: "kg" },
        { ingredientId: "ing-lemon", qty: 8, unit: "kg" },
        { ingredientId: "ing-ginger", qty: 2, unit: "kg" },
        { ingredientId: "ing-turmeric", qty: 0.8, unit: "kg" },
      ],
      packaging: [
        { itemId: "pkg-bottle", qty: 1 },
        { itemId: "pkg-cap", qty: 1 },
        { itemId: "pkg-label", qty: 1 },
        { itemId: "pkg-box", qty: 0.084 },
      ],
    },
    {
      id: "rec-maracuja-v2",
      flavor: "Maracujá",
      version: "v2",
      status: "ativa",
      bottleMl: 500,
      yieldBottles: 200,
      wastePct: 3,
      labor: 150,
      utilities: 68,
      other: 35,
      wholesalePrice: 10,
      retailPrice: 20,
      ingredients: [
        { ingredientId: "ing-tea", qty: 0.85, unit: "kg" },
        { ingredientId: "ing-sugar", qty: 6, unit: "kg" },
        { ingredientId: "ing-passion", qty: 10, unit: "kg" },
      ],
      packaging: [
        { itemId: "pkg-bottle", qty: 1 },
        { itemId: "pkg-cap", qty: 1 },
        { itemId: "pkg-label", qty: 1 },
        { itemId: "pkg-box", qty: 0.084 },
      ],
    },
    {
      id: "rec-frutas-v1",
      flavor: "Frutas Vermelhas",
      version: "v1",
      status: "ativa",
      bottleMl: 500,
      yieldBottles: 180,
      wastePct: 5,
      labor: 155,
      utilities: 70,
      other: 40,
      wholesalePrice: 11,
      retailPrice: 20,
      ingredients: [
        { ingredientId: "ing-tea", qty: 0.85, unit: "kg" },
        { ingredientId: "ing-sugar", qty: 5.8, unit: "kg" },
        { ingredientId: "ing-berries", qty: 8.5, unit: "kg" },
      ],
      packaging: [
        { itemId: "pkg-bottle", qty: 1 },
        { itemId: "pkg-cap", qty: 1 },
        { itemId: "pkg-label", qty: 1 },
        { itemId: "pkg-box", qty: 0.084 },
      ],
    },
  ],
  batches: [
    { id: "bat-1", code: "KMB-2606-IMU", flavor: "Imunidade", recipeId: "rec-imunidade-v3", date: "2026-06-18", responsible: "Amanda", expected: 200, actual: 194, expiry: "2026-09-18", status: "aprovado" },
    { id: "bat-2", code: "KMB-2606-MAR", flavor: "Maracujá", recipeId: "rec-maracuja-v2", date: "2026-06-20", responsible: "Lucas", expected: 200, actual: 203, expiry: "2026-09-20", status: "aprovado" },
    { id: "bat-3", code: "KMB-2606-FRV", flavor: "Frutas Vermelhas", recipeId: "rec-frutas-v1", date: "2026-06-24", responsible: "Amanda", expected: 180, actual: 172, expiry: "2026-09-24", status: "bottled" },
    { id: "bat-4", code: "KMB-2607-HIB", flavor: "Hibisco", recipeId: "rec-frutas-v1", date: "2026-07-02", responsible: "Equipe", expected: 160, actual: 0, expiry: "2026-10-02", status: "planejado" },
  ],
  sales: [
    { id: "sale-1", date: "2026-06-22", partner: "Empório Amazônia Viva", channel: "revenda", flavor: "Imunidade", batchCode: "KMB-2606-IMU", qty: 60, unitPrice: 10.5, discount: 0, delivery: 18 },
    { id: "sale-2", date: "2026-06-24", partner: "Solar Café Regional", channel: "parceiro", flavor: "Maracujá", batchCode: "KMB-2606-MAR", qty: 48, unitPrice: 11, discount: 0, delivery: 12 },
    { id: "sale-3", date: "2026-06-25", partner: "Studio Corpo Leve", channel: "revenda", flavor: "Imunidade", batchCode: "KMB-2606-IMU", qty: 40, unitPrice: 10.5, discount: 20, delivery: 10 },
    { id: "sale-4", date: "2026-06-26", partner: "Evento Wellness", channel: "evento", flavor: "Frutas Vermelhas", batchCode: "KMB-2606-FRV", qty: 75, unitPrice: 14, discount: 0, delivery: 25 },
  ],
  purchases: [
    { id: "pur-1", date: "2026-06-15", supplier: "Amazon Sabores", item: "Gengibre Fresco", qty: 6, unit: "kg", total: 180, method: "Pix", buyer: "Amanda" },
    { id: "pur-2", date: "2026-06-16", supplier: "Print Manaus", item: "Rótulo Premium", qty: 1000, unit: "un", total: 620, method: "Boleto", buyer: "Lucas" },
    { id: "pur-3", date: "2026-06-20", supplier: "Ervas da Terra", item: "Hibisco Seco", qty: 2, unit: "kg", total: 144, method: "Pix", buyer: "Amanda" },
  ],
  expenses: [
    { id: "exp-1", date: "2026-06-02", category: "Marketing", description: "Fotos de produto", amount: 850, method: "Pix", recurring: false },
    { id: "exp-2", date: "2026-06-05", category: "Utilities", description: "Água e energia produção", amount: 420, method: "Débito", recurring: true },
    { id: "exp-3", date: "2026-06-18", category: "Delivery/logística", description: "Entregas parceiros", amount: 260, method: "Pix", recurring: false },
  ],
  cms: {
    headline: "Refrigerante saudável, natural e cheio de sabor.",
    subheadline: "Feita com ingredientes reais, fermentação natural e uma proposta simples: cuidar da saúde sem abrir mão do sabor.",
    whatsapp: "(92) 99209-7165",
    announcement: "Novos pontos de venda em Manaus toda semana.",
    flavors: [
      { name: "Maracujá", visible: true, featured: true },
      { name: "Imunidade", visible: true, featured: true },
      { name: "Frutas Vermelhas", visible: true, featured: true },
      { name: "Hibisco com Anis", visible: true, featured: false },
      { name: "Lavanda com Limão", visible: false, featured: false },
      { name: "Goiaba", visible: false, featured: false },
    ],
  },
  audit: [
    { at: "2026-06-26T10:22:00", user: "Owner / Admin", action: "Receita Imunidade v3 atualizada", detail: "Perda ajustada para 4%." },
    { at: "2026-06-26T14:10:00", user: "Produção", action: "Lote KMB-2606-FRV engarrafado", detail: "Rendimento real de 172 garrafas." },
  ],
};

let state = loadState();
let currentModule = "dashboard";
let globalSearch = "";
let activeRecipeId = state.recipes[0]?.id || "";
let currentRole = "Owner / Admin";

const brl = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));

const number = (value, digits = 0) =>
  new Intl.NumberFormat("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number(value || 0));

const pct = (value) => `${number(value, 1)}%`;
const id = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
const todayIso = () => new Date().toISOString().slice(0, 10);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || clone(defaultState);
  } catch {
    return clone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function addAudit(action, detail = "") {
  state.audit.unshift({ at: new Date().toISOString(), user: currentRole, action, detail });
  state.audit = state.audit.slice(0, 80);
  saveState();
}

function canWrite(module = currentModule) {
  if (currentRole === "Viewer") return false;
  if (currentRole === "Produção") return ["dashboard", "ingredients", "recipes", "costs", "batches", "stock", "packaging"].includes(module);
  if (currentRole === "Financeiro") return ["dashboard", "purchases", "suppliers", "costs", "expenses", "reports"].includes(module);
  if (currentRole === "Vendas") return ["dashboard", "sales", "partners", "cms", "reports"].includes(module);
  return true;
}

function byId(collection, itemId) {
  return state[collection].find((item) => item.id === itemId);
}

const unitFactor = { g: 1, kg: 1000, ml: 1, l: 1000, L: 1000, un: 1 };
const unitFamily = { g: "mass", kg: "mass", ml: "volume", l: "volume", L: "volume", un: "unit" };

function convertedAmount(qty, fromUnit, toUnit) {
  if (fromUnit === toUnit) return Number(qty || 0);
  if (unitFamily[fromUnit] !== unitFamily[toUnit]) return Number(qty || 0);
  return (Number(qty || 0) * unitFactor[fromUnit]) / unitFactor[toUnit];
}

function ingredientLineCost(line) {
  const ingredient = byId("ingredients", line.ingredientId);
  if (!ingredient) return 0;
  return convertedAmount(line.qty, line.unit, ingredient.purchaseUnit) * ingredient.costPerUnit;
}

function packagingLineCost(line, yieldBottles = 1) {
  const item = byId("packaging", line.itemId);
  if (!item) return 0;
  return Number(line.qty || 0) * yieldBottles * item.costEach;
}

function recipeCost(recipe) {
  const ingredientCost = recipe.ingredients.reduce((sum, line) => sum + ingredientLineCost(line), 0);
  const packagingCost = recipe.packaging.reduce((sum, line) => sum + packagingLineCost(line, recipe.yieldBottles), 0);
  const direct = ingredientCost + packagingCost + Number(recipe.labor || 0) + Number(recipe.utilities || 0) + Number(recipe.other || 0);
  const total = direct * (1 + Number(recipe.wastePct || 0) / 100);
  const costPerBottle = total / Number(recipe.yieldBottles || 1);
  const costPerLiter = costPerBottle / (Number(recipe.bottleMl || 500) / 1000);
  const wholesaleProfit = Number(recipe.wholesalePrice || 0) - costPerBottle;
  const retailProfit = Number(recipe.retailPrice || 0) - costPerBottle;
  return {
    ingredientCost,
    packagingCost,
    direct,
    total,
    costPerBottle,
    costPerLiter,
    wholesaleProfit,
    wholesaleMargin: Number(recipe.wholesalePrice || 0) ? (wholesaleProfit / Number(recipe.wholesalePrice)) * 100 : 0,
    retailProfit,
    retailMargin: Number(recipe.retailPrice || 0) ? (retailProfit / Number(recipe.retailPrice)) * 100 : 0,
  };
}

function batchCost(batch) {
  const recipe = byId("recipes", batch.recipeId) || state.recipes.find((item) => item.flavor === batch.flavor) || state.recipes[0];
  const cost = recipeCost(recipe);
  const actual = Number(batch.actual || batch.expected || recipe.yieldBottles || 1);
  const total = cost.costPerBottle * actual;
  return { ...cost, batchTotal: total, batchCostPerBottle: total / actual };
}

function soldFromBatch(code) {
  return state.sales.filter((sale) => sale.batchCode === code).reduce((sum, sale) => sum + Number(sale.qty || 0), 0);
}

function finishedStockRows() {
  return state.batches
    .filter((batch) => batch.status !== "planejado" && batch.status !== "descartado")
    .map((batch) => ({
      ...batch,
      sold: soldFromBatch(batch.code),
      stock: Math.max(0, Number(batch.actual || 0) - soldFromBatch(batch.code)),
      cost: batchCost(batch),
    }));
}

function totals() {
  const salesRevenue = state.sales.reduce((sum, sale) => sum + Number(sale.qty || 0) * Number(sale.unitPrice || 0) - Number(sale.discount || 0), 0);
  const cogs = state.sales.reduce((sum, sale) => {
    const batch = state.batches.find((item) => item.code === sale.batchCode);
    return sum + Number(sale.qty || 0) * (batch ? batchCost(batch).batchCostPerBottle : 0);
  }, 0);
  const expenses = state.expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const finishedStock = finishedStockRows().reduce((sum, row) => sum + row.stock, 0);
  const produced = state.batches.reduce((sum, batch) => sum + Number(batch.actual || 0), 0);
  const sold = state.sales.reduce((sum, sale) => sum + Number(sale.qty || 0), 0);
  return {
    salesRevenue,
    cogs,
    grossProfit: salesRevenue - cogs,
    grossMargin: salesRevenue ? ((salesRevenue - cogs) / salesRevenue) * 100 : 0,
    expenses,
    net: salesRevenue - cogs - expenses,
    finishedStock,
    produced,
    sold,
    avgCost: state.recipes.reduce((sum, recipe) => sum + recipeCost(recipe).costPerBottle, 0) / Math.max(1, state.recipes.length),
  };
}

function lowStockIngredients() {
  return state.ingredients.filter((item) => Number(item.stock) <= Number(item.min));
}

function lowStockPackaging() {
  return state.packaging.filter((item) => Number(item.stock) <= Number(item.min));
}

function nearExpiryBatches() {
  const now = new Date();
  return finishedStockRows().filter((batch) => {
    const days = (new Date(batch.expiry) - now) / 86400000;
    return days <= 30 && batch.stock > 0;
  });
}

function pageHead(title, description, actions = "") {
  const roleAlert = canWrite() ? "" : `<p class="empty-note">Perfil ${currentRole}: modo leitura para este módulo.</p>`;
  return `
    <div class="admin-page-head">
      <div>
        <h1>${title}</h1>
        <p>${description}</p>
      </div>
      <div class="admin-actions">${actions}</div>
    </div>
    ${roleAlert}
  `;
}

function actionButton(action, label, icon, variant = "btn-primary", module = currentModule) {
  const disabled = canWrite(module) ? "" : "disabled aria-disabled=\"true\"";
  return `<button class="btn ${variant}" type="button" data-action="${action}" ${disabled}>
    <span class="material-symbols-outlined" aria-hidden="true">${icon}</span>${label}
  </button>`;
}

function metric(label, value, note, icon = "monitoring") {
  return `
    <article class="admin-card metric-card">
      <small><span class="material-symbols-outlined" aria-hidden="true">${icon}</span> ${label}</small>
      <strong>${value}</strong>
      <span>${note}</span>
    </article>
  `;
}

function renderDashboard() {
  const total = totals();
  const flavorRows = Object.entries(
    finishedStockRows().reduce((acc, row) => {
      acc[row.flavor] = (acc[row.flavor] || 0) + row.stock;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const partnerRows = Object.entries(
    state.sales.reduce((acc, sale) => {
      acc[sale.partner] = (acc[sale.partner] || 0) + Number(sale.qty || 0);
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const shortFlavor = (flavor) =>
    ({
      "Frutas Vermelhas": "Frutas",
      "Imunidade": "Imun.",
      "Maracujá": "Maracujá",
    })[flavor] || flavor.slice(0, 8);
  return `
    ${pageHead(
      "Visão Geral",
      "Controle operacional e financeiro da Kombú: produção, estoque, custo por garrafa, vendas e alertas.",
      `${actionButton("new-batch", "Novo lote", "science", "btn-outline")} ${actionButton("new-purchase", "Registrar compra", "shopping_bag", "btn-outline")} ${actionButton("new-sale", "Nova venda", "receipt_long")}`,
    )}
    <section class="metric-grid">
      ${metric("Garrafas em estoque", number(total.finishedStock), "Prontas para venda por lote", "water_bottle")}
      ${metric("Produção vs vendas", `${number(total.produced)} / ${number(total.sold)}`, `${number(total.produced - total.sold)} unidades de diferença`, "autorenew")}
      ${metric("Receita do período", brl(total.salesRevenue), `Lucro bruto ${brl(total.grossProfit)} (${pct(total.grossMargin)})`, "account_balance_wallet")}
      ${metric("Custo médio/garrafa", brl(total.avgCost), "Média das receitas ativas", "price_check")}
    </section>
    <section class="admin-grid">
      <article class="admin-card">
        <h3>Atenção necessária</h3>
        <div class="alert-list">
          ${[...lowStockIngredients(), ...lowStockPackaging()]
            .slice(0, 5)
            .map((item) => `<div class="alert-item"><strong>Estoque baixo: ${item.name}</strong><span>Atual ${number(item.stock, 2)} | mínimo ${number(item.min, 2)}</span></div>`)
            .join("")}
          ${nearExpiryBatches()
            .map((batch) => `<div class="alert-item"><strong>Lote próximo ao vencimento: ${batch.code}</strong><span>${batch.stock} garrafas vencem em ${batch.expiry}</span></div>`)
            .join("")}
          ${lowStockIngredients().length || lowStockPackaging().length || nearExpiryBatches().length ? "" : `<div class="empty-note">Nenhum alerta crítico no momento.</div>`}
        </div>
      </article>
      <article class="admin-card chart-card">
        <h3>Estoque por sabor</h3>
        <div class="bar-chart">
          ${flavorRows
            .slice(0, 6)
            .map(([flavor, qty]) => `<div class="bar" title="${flavor}"><i style="height:${Math.max(8, Math.min(100, qty / 2.4))}%"></i><span>${shortFlavor(flavor)}</span></div>`)
            .join("")}
        </div>
      </article>
    </section>
    <section class="admin-grid">
      <article class="admin-card">
        <h3>Parceiros com maior volume</h3>
        <div class="stack-list">
          ${partnerRows.map(([partner, qty]) => `<div class="report-row"><strong>${partner}</strong><span>${number(qty)} garrafas vendidas</span></div>`).join("")}
        </div>
      </article>
      <article class="admin-card">
        <h3>Audit log recente</h3>
        <div class="stack-list">${renderAuditRows(5)}</div>
      </article>
    </section>
  `;
}

function statusClass(value, type = "stock") {
  if (type === "stock") return value <= 0 ? "bad" : value <= 1 ? "warn" : "good";
  if (["aprovado", "ativo", "ativa", "pago"].includes(value)) return "good";
  if (["planejado", "bottled", "pendente"].includes(value)) return "warn";
  return "bad";
}

function table(headers, rows, minWidth = 780) {
  return `
    <article class="admin-card table-card">
      <div class="table-scroll">
        <table class="data-table" style="min-width:${minWidth}px">
          <thead><tr>${headers.map((header) => `<th class="${header.num ? "num" : ""}">${header.label}</th>`).join("")}</tr></thead>
          <tbody>${rows.join("")}</tbody>
        </table>
      </div>
    </article>
  `;
}

function renderIngredients() {
  const rows = state.ingredients
    .filter((item) => matchesSearch(item))
    .map(
      (item) => `
        <tr>
          <td><strong>${item.name}</strong><br><span>${item.location}</span></td>
          <td>${item.category}</td>
          <td>${item.supplier}</td>
          <td class="num">${number(item.stock, 2)} ${item.purchaseUnit}</td>
          <td class="num">${brl(item.costPerUnit)} / ${item.purchaseUnit}</td>
          <td><span class="status ${statusClass(item.stock / item.min)}">${item.stock <= item.min ? "baixo" : "bom"}</span></td>
          <td>${item.expires}</td>
        </tr>
      `,
    );
  return `
    ${pageHead(
      "Ingredientes",
      "Cadastro, estoque mínimo, fornecedores, vencimento e custo unitário usado nas fórmulas.",
      `${actionButton("new-ingredient", "Novo ingrediente", "add")} ${actionButton("new-purchase", "Registrar compra", "shopping_bag", "btn-outline")} ${actionButton("export-ingredients", "CSV", "download", "btn-outline")}`,
    )}
    ${table(
      [
        { label: "Nome" },
        { label: "Categoria" },
        { label: "Fornecedor" },
        { label: "Estoque", num: true },
        { label: "Custo", num: true },
        { label: "Status" },
        { label: "Vencimento" },
      ],
      rows,
      920,
    )}
  `;
}

function renderPurchases() {
  const rows = state.purchases
    .filter((item) => matchesSearch(item))
    .map(
      (item) => `
        <tr>
          <td>${item.date}</td>
          <td><strong>${item.item}</strong><br><span>${item.supplier}</span></td>
          <td class="num">${number(item.qty, 2)} ${item.unit}</td>
          <td class="num">${brl(item.total)}</td>
          <td>${item.method}</td>
          <td>${item.buyer}</td>
        </tr>
      `,
    );
  return `
    ${pageHead(
      "Compras",
      "Registre compras com múltiplos itens, atualize estoque e preserve histórico de custo.",
      `${actionButton("new-purchase", "Registrar compra", "add")} ${actionButton("export-purchases", "CSV", "download", "btn-outline")}`,
    )}
    ${table(
      [
        { label: "Data" },
        { label: "Item / fornecedor" },
        { label: "Quantidade", num: true },
        { label: "Total", num: true },
        { label: "Pagamento" },
        { label: "Comprador" },
      ],
      rows,
      840,
    )}
  `;
}

function renderSuppliers() {
  const rows = state.suppliers
    .filter((item) => matchesSearch(item))
    .map(
      (item) => `
        <tr>
          <td><strong>${item.name}</strong><br><span>${item.categories}</span></td>
          <td>${item.contact}</td>
          <td>${item.whatsapp}</td>
          <td>${item.email}</td>
          <td>${item.city}</td>
          <td>${item.leadTime}</td>
          <td><span class="status ${statusClass(item.status, "general")}">${item.status}</span></td>
        </tr>
      `,
    );
  return `
    ${pageHead("Fornecedores", "Contatos, categorias fornecidas, prazo médio e status operacional.", actionButton("new-supplier", "Novo fornecedor", "add"))}
    ${table(
      [
        { label: "Fornecedor" },
        { label: "Contato" },
        { label: "WhatsApp" },
        { label: "Email" },
        { label: "Cidade" },
        { label: "Prazo" },
        { label: "Status" },
      ],
      rows,
      980,
    )}
  `;
}

function renderRecipes() {
  const rows = state.recipes
    .filter((recipe) => matchesSearch(recipe))
    .map((recipe) => {
      const cost = recipeCost(recipe);
      return `
        <tr>
          <td><strong>${recipe.flavor}</strong><br><span>${recipe.version} | ${recipe.bottleMl}ml</span></td>
          <td class="num">${number(recipe.yieldBottles)} garrafas</td>
          <td class="num">${brl(cost.ingredientCost)}</td>
          <td class="num">${brl(cost.packagingCost)}</td>
          <td class="num">${brl(cost.total)}</td>
          <td class="num"><strong>${brl(cost.costPerBottle)}</strong></td>
          <td class="num">${pct(cost.wholesaleMargin)}</td>
          <td><span class="status ${statusClass(recipe.status, "general")}">${recipe.status}</span></td>
        </tr>
      `;
    });
  return `
    ${pageHead(
      "Receitas / Fórmulas",
      "Versões de receitas por sabor, rendimento, insumos, embalagens, perdas e custo histórico.",
      `${actionButton("new-recipe", "Nova receita", "add")} ${actionButton("go-costs", "Abrir calculadora", "calculate", "btn-outline")}`,
    )}
    ${table(
      [
        { label: "Sabor / versão" },
        { label: "Rendimento", num: true },
        { label: "Ingredientes", num: true },
        { label: "Embalagem", num: true },
        { label: "Custo lote", num: true },
        { label: "Custo/garrafa", num: true },
        { label: "Margem atacado", num: true },
        { label: "Status" },
      ],
      rows,
      1000,
    )}
  `;
}

function renderCosts() {
  const recipe = state.recipes.find((item) => item.id === activeRecipeId) || state.recipes[0];
  activeRecipeId = recipe.id;
  const cost = recipeCost(recipe);
  const ingredientRows = recipe.ingredients
    .map((line, index) => {
      const ingredient = byId("ingredients", line.ingredientId);
      return `
        <tr>
          <td>Ingrediente</td>
          <td>${ingredient?.name || "Não encontrado"}</td>
          <td><input type="number" min="0" step="0.01" value="${line.qty}" data-cost-line="ingredients" data-index="${index}" data-field="qty"></td>
          <td>
            <select data-cost-line="ingredients" data-index="${index}" data-field="unit">
              ${["g", "kg", "ml", "l", "un"].map((unit) => `<option ${line.unit === unit ? "selected" : ""}>${unit}</option>`).join("")}
            </select>
          </td>
          <td class="num">${brl(ingredient?.costPerUnit || 0)} / ${ingredient?.purchaseUnit || ""}</td>
          <td class="num">${brl(ingredientLineCost(line))}</td>
        </tr>
      `;
    })
    .join("");
  const packagingRows = recipe.packaging
    .map((line, index) => {
      const item = byId("packaging", line.itemId);
      return `
        <tr>
          <td>Embalagem</td>
          <td>${item?.name || "Não encontrado"}</td>
          <td><input type="number" min="0" step="0.001" value="${line.qty}" data-cost-line="packaging" data-index="${index}" data-field="qty"></td>
          <td>un/garrafa</td>
          <td class="num">${brl(item?.costEach || 0)}</td>
          <td class="num">${brl(packagingLineCost(line, recipe.yieldBottles))}</td>
        </tr>
      `;
    })
    .join("");
  return `
    ${pageHead(
      "Custo por Garrafa",
      "Tabela editável inspirada em Excel, com conversão de unidades, custo por lote e simulação de margem.",
      `${actionButton("save-costs", "Salvar simulação", "save")} ${actionButton("export-costs", "CSV", "download", "btn-outline")}`,
    )}
    <div class="calculator-grid">
      <article class="admin-card table-card">
        <div class="table-toolbar" style="padding:16px 16px 0">
          <label class="field" style="min-width:260px">
            <span>Receita ativa</span>
            <select id="recipeSelector" class="admin-select">
              ${state.recipes.map((item) => `<option value="${item.id}" ${item.id === recipe.id ? "selected" : ""}>${item.flavor} ${item.version}</option>`).join("")}
            </select>
          </label>
          <div class="admin-actions">
            <label class="field">
              <span>Rendimento</span>
              <input class="admin-input" type="number" value="${recipe.yieldBottles}" data-recipe-field="yieldBottles" />
            </label>
            <label class="field">
              <span>Perda %</span>
              <input class="admin-input" type="number" value="${recipe.wastePct}" data-recipe-field="wastePct" />
            </label>
          </div>
        </div>
        <div class="table-scroll">
          <table class="spreadsheet">
            <thead>
              <tr>
                <th>Grupo</th>
                <th>Insumo</th>
                <th>Qtd.</th>
                <th>Unidade</th>
                <th>Custo compra</th>
                <th>Custo no lote</th>
              </tr>
            </thead>
            <tbody>
              ${ingredientRows}
              <tr class="subtotal-row"><td colspan="5">Subtotal ingredientes</td><td class="num">${brl(cost.ingredientCost)}</td></tr>
              ${packagingRows}
              <tr class="subtotal-row"><td colspan="5">Subtotal embalagens</td><td class="num">${brl(cost.packagingCost)}</td></tr>
              <tr><td>Operação</td><td>Mão de obra por lote</td><td><input type="number" value="${recipe.labor}" data-recipe-field="labor"></td><td>R$</td><td></td><td class="num">${brl(recipe.labor)}</td></tr>
              <tr><td>Operação</td><td>Água, energia e gás</td><td><input type="number" value="${recipe.utilities}" data-recipe-field="utilities"></td><td>R$</td><td></td><td class="num">${brl(recipe.utilities)}</td></tr>
              <tr><td>Operação</td><td>Transporte, sanitização e outros</td><td><input type="number" value="${recipe.other}" data-recipe-field="other"></td><td>R$</td><td></td><td class="num">${brl(recipe.other)}</td></tr>
              <tr class="subtotal-row"><td colspan="5">Custo direto com perda</td><td class="num">${brl(cost.total)}</td></tr>
            </tbody>
          </table>
        </div>
      </article>
      <aside class="result-panel">
        <div class="result-card"><small>Custo por lote</small><strong>${brl(cost.total)}</strong></div>
        <div class="result-card"><small>Custo por garrafa ${recipe.bottleMl}ml</small><strong>${brl(cost.costPerBottle)}</strong></div>
        <div class="result-card"><small>Custo por litro</small><strong>${brl(cost.costPerLiter)}</strong></div>
        <div class="result-card"><small>Preço atacado sugerido</small><strong>${brl(recipe.wholesalePrice)}</strong><span>${brl(cost.wholesaleProfit)} lucro | ${pct(cost.wholesaleMargin)}</span></div>
        <div class="result-card"><small>Preço varejo sugerido</small><strong>${brl(recipe.retailPrice)}</strong><span>${brl(cost.retailProfit)} lucro | ${pct(cost.retailMargin)}</span></div>
      </aside>
    </div>
  `;
}

function renderBatches() {
  const rows = state.batches
    .filter((item) => matchesSearch(item))
    .map((batch) => {
      const cost = batchCost(batch);
      const loss = Number(batch.expected || 0) - Number(batch.actual || 0);
      return `
        <tr>
          <td><strong>${batch.code}</strong><br><span>${batch.flavor}</span></td>
          <td>${batch.date}</td>
          <td>${batch.responsible}</td>
          <td class="num">${number(batch.expected)} / ${number(batch.actual)}</td>
          <td class="num">${number(loss)}</td>
          <td class="num">${brl(cost.batchCostPerBottle)}</td>
          <td>${batch.expiry}</td>
          <td><span class="status ${statusClass(batch.status, "general")}">${batch.status}</span></td>
        </tr>
      `;
    });
  return `
    ${pageHead(
      "Produção / Lotes",
      "Controle de lotes, versão da receita, rendimento real, vencimento, custo histórico e rastreabilidade.",
      `${actionButton("new-batch", "Novo lote", "add")} ${actionButton("stock-adjustment", "Ajuste de estoque", "tune", "btn-outline")}`,
    )}
    ${table(
      [
        { label: "Lote / sabor" },
        { label: "Produção" },
        { label: "Responsável" },
        { label: "Esperado / real", num: true },
        { label: "Perda", num: true },
        { label: "Custo/garrafa", num: true },
        { label: "Validade" },
        { label: "Status" },
      ],
      rows,
      1060,
    )}
  `;
}

function renderStock() {
  const finishedRows = finishedStockRows().map(
    (row) => `
      <tr>
        <td><strong>${row.flavor}</strong><br><span>${row.code}</span></td>
        <td class="num">${number(row.actual)}</td>
        <td class="num">${number(row.sold)}</td>
        <td class="num"><strong>${number(row.stock)}</strong></td>
        <td>${row.expiry}</td>
        <td class="num">${brl(row.stock * row.cost.batchCostPerBottle)}</td>
      </tr>
    `,
  );
  return `
    ${pageHead("Estoque", "Produtos acabados, ingredientes, embalagens e movimentos com alertas de mínimo e vencimento.", actionButton("stock-adjustment", "Ajuste com motivo", "tune"))}
    <section class="admin-grid">
      ${table(
        [
          { label: "Sabor / lote" },
          { label: "Produzido", num: true },
          { label: "Vendido", num: true },
          { label: "Saldo", num: true },
          { label: "Validade" },
          { label: "Valor em estoque", num: true },
        ],
        finishedRows,
        760,
      )}
      <article class="admin-card">
        <h3>Alertas de estoque</h3>
        <div class="stack-list">
          ${[...lowStockIngredients(), ...lowStockPackaging()]
            .map((item) => `<div class="stock-row"><strong>${item.name}</strong><span>Atual ${number(item.stock, 2)} | mínimo ${number(item.min, 2)}</span></div>`)
            .join("") || `<div class="empty-note">Sem alertas de mínimo.</div>`}
        </div>
      </article>
    </section>
  `;
}

function renderPackaging() {
  const rows = state.packaging
    .filter((item) => matchesSearch(item))
    .map(
      (item) => `
        <tr>
          <td><strong>${item.name}</strong><br><span>${item.location}</span></td>
          <td>${item.supplier}</td>
          <td class="num">${number(item.stock)} ${item.unit}</td>
          <td class="num">${number(item.min)} ${item.unit}</td>
          <td class="num">${brl(item.costEach)}</td>
          <td><span class="status ${statusClass(item.stock / item.min)}">${item.stock <= item.min ? "baixo" : "bom"}</span></td>
        </tr>
      `,
    );
  return `
    ${pageHead("Embalagens", "Garrafas, tampas, rótulos, caixas e materiais que entram no custo por garrafa.", actionButton("new-packaging", "Novo material", "add"))}
    ${table(
      [
        { label: "Item" },
        { label: "Fornecedor" },
        { label: "Estoque", num: true },
        { label: "Mínimo", num: true },
        { label: "Custo unitário", num: true },
        { label: "Status" },
      ],
      rows,
      820,
    )}
  `;
}

function renderSales() {
  const rows = state.sales
    .filter((item) => matchesSearch(item))
    .map((sale) => {
      const revenue = Number(sale.qty) * Number(sale.unitPrice) - Number(sale.discount || 0);
      const batch = state.batches.find((item) => item.code === sale.batchCode);
      const cogs = Number(sale.qty) * (batch ? batchCost(batch).batchCostPerBottle : 0);
      return `
        <tr>
          <td>${sale.date}</td>
          <td><strong>${sale.partner}</strong><br><span>${sale.channel}</span></td>
          <td>${sale.flavor}<br><span>${sale.batchCode}</span></td>
          <td class="num">${number(sale.qty)}</td>
          <td class="num">${brl(revenue)}</td>
          <td class="num">${brl(cogs)}</td>
          <td class="num"><strong>${brl(revenue - cogs)}</strong></td>
          <td class="num">${pct(revenue ? ((revenue - cogs) / revenue) * 100 : 0)}</td>
        </tr>
      `;
    });
  return `
    ${pageHead("Vendas", "Registre vendas por canal, parceiro, lote e sabor para calcular COGS, lucro e margem.", `${actionButton("new-sale", "Nova venda", "add")} ${actionButton("export-sales", "CSV", "download", "btn-outline")}`)}
    ${table(
      [
        { label: "Data" },
        { label: "Cliente / canal" },
        { label: "Sabor / lote" },
        { label: "Qtd.", num: true },
        { label: "Receita", num: true },
        { label: "COGS", num: true },
        { label: "Lucro", num: true },
        { label: "Margem", num: true },
      ],
      rows,
      1060,
    )}
  `;
}

function renderPartners() {
  const rows = state.partners
    .filter((item) => matchesSearch(item))
    .map(
      (partner) => `
        <tr>
          <td><strong>${partner.name}</strong><br><span>${partner.type} | ${partner.neighborhood}</span></td>
          <td>${partner.whatsapp}</td>
          <td>${partner.instagram}</td>
          <td>${partner.flavors}</td>
          <td>${partner.terms}</td>
          <td>${partner.lastDelivery}</td>
          <td><span class="status ${partner.visible ? "good" : "warn"}">${partner.visible ? "público" : "oculto"}</span></td>
        </tr>
      `,
    );
  return `
    ${pageHead("Parceiros", "Controle pontos de venda e gerencie quem aparece no localizador público.", actionButton("new-partner", "Novo parceiro", "add"))}
    ${table(
      [
        { label: "Parceiro" },
        { label: "WhatsApp" },
        { label: "Instagram" },
        { label: "Sabores" },
        { label: "Prazo" },
        { label: "Última entrega" },
        { label: "Visibilidade" },
      ],
      rows,
      1040,
    )}
  `;
}

function renderExpenses() {
  const rows = state.expenses
    .filter((item) => matchesSearch(item))
    .map(
      (expense) => `
        <tr>
          <td>${expense.date}</td>
          <td>${expense.category}</td>
          <td><strong>${expense.description}</strong></td>
          <td class="num">${brl(expense.amount)}</td>
          <td>${expense.method}</td>
          <td><span class="status ${expense.recurring ? "warn" : "good"}">${expense.recurring ? "recorrente" : "avulsa"}</span></td>
        </tr>
      `,
    );
  return `
    ${pageHead("Despesas", "Registre custos fixos e variáveis para estimar resultado líquido por período.", actionButton("new-expense", "Nova despesa", "add"))}
    ${table(
      [
        { label: "Data" },
        { label: "Categoria" },
        { label: "Descrição" },
        { label: "Valor", num: true },
        { label: "Método" },
        { label: "Tipo" },
      ],
      rows,
      840,
    )}
  `;
}

function renderReports() {
  const total = totals();
  const byFlavor = state.sales.reduce((acc, sale) => {
    acc[sale.flavor] = acc[sale.flavor] || { qty: 0, revenue: 0, profit: 0 };
    const batch = state.batches.find((item) => item.code === sale.batchCode);
    const cogs = Number(sale.qty) * (batch ? batchCost(batch).batchCostPerBottle : 0);
    const revenue = Number(sale.qty) * Number(sale.unitPrice) - Number(sale.discount || 0);
    acc[sale.flavor].qty += Number(sale.qty);
    acc[sale.flavor].revenue += revenue;
    acc[sale.flavor].profit += revenue - cogs;
    return acc;
  }, {});
  const reportRows = Object.entries(byFlavor)
    .sort((a, b) => b[1].profit - a[1].profit)
    .map(([flavor, row]) => `<div class="report-row"><strong>${flavor}</strong><span>${number(row.qty)} un | ${brl(row.revenue)} receita | ${brl(row.profit)} lucro</span></div>`)
    .join("");
  return `
    ${pageHead("Relatórios", "Margem, lucro, despesas, estoque, sabores mais vendidos e custo médio ao longo do tempo.", actionButton("export-reports", "Exportar CSV", "download", "btn-outline", "reports"))}
    <section class="metric-grid">
      ${metric("Receita", brl(total.salesRevenue), "Vendas registradas", "payments")}
      ${metric("COGS", brl(total.cogs), "Custo dos produtos vendidos", "inventory")}
      ${metric("Lucro bruto", brl(total.grossProfit), pct(total.grossMargin), "trending_up")}
      ${metric("Resultado líquido estimado", brl(total.net), `Despesas: ${brl(total.expenses)}`, "query_stats")}
    </section>
    <section class="admin-grid">
      <article class="admin-card chart-card">
        <h3>Vendas dos últimos meses</h3>
        <div class="bar-chart">
          ${["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"].map((month, index) => `<div class="bar"><i style="height:${[34, 48, 56, 72, 84, 96][index]}%"></i><span>${month}</span></div>`).join("")}
        </div>
      </article>
      <article class="admin-card">
        <h3>Lucro por sabor</h3>
        <div class="stack-list">${reportRows}</div>
      </article>
    </section>
    <section class="admin-grid">
      <article class="admin-card">
        <h3>Distribuição de canais</h3>
        <div class="donut" data-total="${number(total.sold)}"></div>
        <p class="lead" style="font-size:1rem">Revenda, parceiros, eventos e canais externos alimentam o cálculo de margem por período.</p>
      </article>
      <article class="admin-card">
        <h3>Audit log</h3>
        <div class="stack-list">${renderAuditRows(10)}</div>
      </article>
    </section>
  `;
}

function renderCMS() {
  return `
    ${pageHead("CMS Público", "Controle headlines, sabores, parceiros, SEO, WhatsApp e anúncios do site público.", actionButton("save-cms", "Salvar CMS", "save"))}
    <section class="admin-grid">
      <form class="admin-card" id="cmsForm">
        <div class="input-grid">
          <label class="field field-full"><span>Headline da home</span><input name="headline" value="${state.cms.headline}"></label>
          <label class="field field-full"><span>Subheadline</span><textarea name="subheadline">${state.cms.subheadline}</textarea></label>
          <label class="field"><span>WhatsApp</span><input name="whatsapp" value="${state.cms.whatsapp}"></label>
          <label class="field"><span>Anúncio</span><input name="announcement" value="${state.cms.announcement}"></label>
        </div>
      </form>
      <article class="admin-card">
        <h3>Sabores publicados</h3>
        <div class="stack-list">
          ${state.cms.flavors
            .map(
              (flavor, index) => `
                <label class="stock-row">
                  <strong>${flavor.name}</strong>
                  <span>
                    <input type="checkbox" ${flavor.visible ? "checked" : ""} data-cms-flavor="${index}" data-field="visible"> Visível no site
                    <input type="checkbox" ${flavor.featured ? "checked" : ""} data-cms-flavor="${index}" data-field="featured"> Destaque
                  </span>
                </label>
              `,
            )
            .join("")}
        </div>
      </article>
    </section>
    <section class="admin-card" style="margin-top:16px">
      <h3>SEO planejado</h3>
      <div class="schema-grid">
        ${["Homepage", "Sabores", "Benefícios", "O que é Kombucha", "Onde Encontrar", "Seja Revendedor", "Sobre a Kombú", "Contato"].map((page) => `<div class="schema-entity"><strong>${page}</strong><span>Title, description, Product/LocalBusiness schema e CTA contextual.</span></div>`).join("")}
      </div>
    </section>
  `;
}

function renderSchema() {
  const entities = [
    "Users", "Roles", "Ingredients", "Ingredient Categories", "Suppliers", "Purchases", "Purchase Items", "Packaging Materials",
    "Recipes", "Recipe Ingredients", "Recipe Versions", "Production Batches", "Batch Ingredients Used", "Finished Product Stock",
    "Stock Movements", "Flavors", "Partners", "Sales", "Sale Items", "Expenses", "Expense Categories", "Cost Assumptions",
    "Reports", "CMS Pages", "Media Library", "Audit Logs",
  ];
  return `
    ${pageHead("Arquitetura e Banco de Dados", "Estrutura sugerida para evoluir este protótipo estático para um sistema seguro com autenticação, roles e histórico.", actionButton("reset-demo", "Resetar demo", "restart_alt", "btn-danger", "schema"))}
    <section class="admin-card">
      <h3>Entidades mínimas</h3>
      <div class="schema-grid">
        ${entities.map((entity) => `<div class="schema-entity"><strong>${entity}</strong><span>CRUD, permissões por perfil, timestamps e trilha de auditoria.</span></div>`).join("")}
      </div>
    </section>
    <section class="admin-grid-3">
      <article class="admin-card"><h3>Histórico de custos</h3><p>Um lote deve gravar a versão da receita e custo dos ingredientes no momento da produção. Mudanças futuras não alteram o passado.</p></article>
      <article class="admin-card"><h3>Segurança</h3><p>Login obrigatório, RBAC, uploads protegidos, logs de alterações e nenhuma exposição pública de dados financeiros.</p></article>
      <article class="admin-card"><h3>Integrações</h3><p>Importação/exportação CSV ou Excel, analytics, Meta Pixel, Google Ads, WhatsApp e mapa público de parceiros.</p></article>
    </section>
  `;
}

function renderAuditRows(limit) {
  return state.audit
    .slice(0, limit)
    .map((entry) => `<div class="audit-row"><strong>${entry.action}</strong><span>${new Date(entry.at).toLocaleString("pt-BR")} | ${entry.user}</span><span>${entry.detail}</span></div>`)
    .join("");
}

function matchesSearch(item) {
  if (!globalSearch) return true;
  return JSON.stringify(item).toLowerCase().includes(globalSearch.toLowerCase());
}

function render() {
  const view = {
    dashboard: renderDashboard,
    ingredients: renderIngredients,
    purchases: renderPurchases,
    suppliers: renderSuppliers,
    recipes: renderRecipes,
    costs: renderCosts,
    batches: renderBatches,
    stock: renderStock,
    packaging: renderPackaging,
    sales: renderSales,
    partners: renderPartners,
    expenses: renderExpenses,
    reports: renderReports,
    cms: renderCMS,
    schema: renderSchema,
  }[currentModule];
  document.querySelector("#adminContent").innerHTML = view();
  bindModuleEvents();
}

function setModule(module) {
  currentModule = module;
  document.querySelectorAll("#adminNav button").forEach((button) => button.classList.toggle("is-active", button.dataset.module === module));
  render();
}

function openModal(title, eyebrow, body) {
  document.querySelector("#adminModalTitle").textContent = title;
  document.querySelector("#adminModalEyebrow").textContent = eyebrow;
  document.querySelector("#adminModalBody").innerHTML = body;
  document.querySelector("#adminModal").classList.add("is-open");
}

function closeModal() {
  document.querySelector("#adminModal").classList.remove("is-open");
}

function newIngredientForm() {
  openModal(
    "Novo ingrediente",
    "Ingredientes",
    `
      <form id="ingredientForm">
        <div class="input-grid">
          <label class="field field-full"><span>Nome</span><input name="name" required></label>
          <label class="field"><span>Categoria</span><input name="category" required></label>
          <label class="field"><span>Fornecedor</span><input name="supplier" required></label>
          <label class="field"><span>Unidade de compra</span><select name="purchaseUnit"><option>kg</option><option>g</option><option>l</option><option>ml</option><option>un</option></select></label>
          <label class="field"><span>Custo por unidade</span><input name="costPerUnit" type="number" step="0.01" required></label>
          <label class="field"><span>Estoque atual</span><input name="stock" type="number" step="0.01" required></label>
          <label class="field"><span>Estoque mínimo</span><input name="min" type="number" step="0.01" required></label>
          <label class="field"><span>Vencimento</span><input name="expires" type="date"></label>
          <label class="field"><span>Local</span><input name="location"></label>
        </div>
        <button class="btn btn-primary" type="submit">Salvar ingrediente</button>
      </form>
    `,
  );
  document.querySelector("#ingredientForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    state.ingredients.push({ id: id("ing"), ...data, costPerUnit: Number(data.costPerUnit), stock: Number(data.stock), min: Number(data.min), status: "ativo" });
    addAudit("Ingrediente criado", data.name);
    closeModal();
    render();
  });
}

function newPurchaseForm() {
  openModal(
    "Registrar compra",
    "Compras",
    `
      <form id="purchaseForm">
        <div class="input-grid">
          <label class="field"><span>Data</span><input name="date" type="date" value="${todayIso()}" required></label>
          <label class="field"><span>Item</span><select name="ingredientId">${state.ingredients.map((item) => `<option value="${item.id}">${item.name}</option>`).join("")}</select></label>
          <label class="field"><span>Fornecedor</span><input name="supplier" value="${state.suppliers[0]?.name || ""}" required></label>
          <label class="field"><span>Quantidade</span><input name="qty" type="number" step="0.01" required></label>
          <label class="field"><span>Total pago</span><input name="total" type="number" step="0.01" required></label>
          <label class="field"><span>Método</span><select name="method"><option>Pix</option><option>Boleto</option><option>Cartão</option><option>Dinheiro</option></select></label>
          <label class="field"><span>Quem comprou</span><input name="buyer" value="Owner / Admin"></label>
        </div>
        <button class="btn btn-primary" type="submit">Registrar e atualizar estoque</button>
      </form>
    `,
  );
  document.querySelector("#purchaseForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const ingredient = byId("ingredients", data.ingredientId);
    const qty = Number(data.qty);
    const total = Number(data.total);
    ingredient.stock = Number(ingredient.stock || 0) + qty;
    ingredient.costPerUnit = total / Math.max(qty, 0.0001);
    state.purchases.unshift({ id: id("pur"), date: data.date, supplier: data.supplier, item: ingredient.name, qty, unit: ingredient.purchaseUnit, total, method: data.method, buyer: data.buyer });
    addAudit("Compra registrada", `${ingredient.name}: ${number(qty, 2)} ${ingredient.purchaseUnit} por ${brl(total)}`);
    closeModal();
    render();
  });
}

function newSaleForm() {
  const stockRows = finishedStockRows().filter((row) => row.stock > 0);
  openModal(
    "Nova venda",
    "Vendas",
    `
      <form id="saleForm">
        <div class="input-grid">
          <label class="field"><span>Data</span><input name="date" type="date" value="${todayIso()}" required></label>
          <label class="field"><span>Parceiro / cliente</span><select name="partner">${state.partners.map((item) => `<option>${item.name}</option>`).join("")}<option>Cliente direto</option><option>Evento Wellness</option></select></label>
          <label class="field"><span>Lote</span><select name="batchCode">${stockRows.map((row) => `<option value="${row.code}">${row.code} - ${row.flavor} (${row.stock} un)</option>`).join("")}</select></label>
          <label class="field"><span>Quantidade</span><input name="qty" type="number" min="1" required></label>
          <label class="field"><span>Preço unitário</span><input name="unitPrice" type="number" step="0.01" value="10.50" required></label>
          <label class="field"><span>Desconto</span><input name="discount" type="number" step="0.01" value="0"></label>
          <label class="field"><span>Entrega</span><input name="delivery" type="number" step="0.01" value="0"></label>
          <label class="field"><span>Canal</span><select name="channel"><option>revenda</option><option>parceiro</option><option>evento</option><option>direto</option><option>externo</option></select></label>
        </div>
        <button class="btn btn-primary" type="submit">Salvar venda</button>
      </form>
    `,
  );
  document.querySelector("#saleForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const batch = state.batches.find((item) => item.code === data.batchCode);
    state.sales.unshift({
      id: id("sale"),
      date: data.date,
      partner: data.partner,
      channel: data.channel,
      flavor: batch?.flavor || "",
      batchCode: data.batchCode,
      qty: Number(data.qty),
      unitPrice: Number(data.unitPrice),
      discount: Number(data.discount || 0),
      delivery: Number(data.delivery || 0),
    });
    addAudit("Venda registrada", `${data.qty} garrafas do lote ${data.batchCode}`);
    closeModal();
    render();
  });
}

function newBatchForm() {
  openModal(
    "Novo lote",
    "Produção",
    `
      <form id="batchForm">
        <div class="input-grid">
          <label class="field"><span>Código do lote</span><input name="code" value="KMB-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}" required></label>
          <label class="field"><span>Receita</span><select name="recipeId">${state.recipes.map((recipe) => `<option value="${recipe.id}">${recipe.flavor} ${recipe.version}</option>`).join("")}</select></label>
          <label class="field"><span>Data de produção</span><input name="date" type="date" value="${todayIso()}" required></label>
          <label class="field"><span>Responsável</span><input name="responsible" value="Equipe" required></label>
          <label class="field"><span>Rendimento esperado</span><input name="expected" type="number" value="200" required></label>
          <label class="field"><span>Rendimento real</span><input name="actual" type="number" value="0" required></label>
          <label class="field"><span>Validade</span><input name="expiry" type="date" required></label>
          <label class="field"><span>Status</span><select name="status"><option>planejado</option><option>em produção</option><option>bottled</option><option>aprovado</option><option>bloqueado</option></select></label>
        </div>
        <button class="btn btn-primary" type="submit">Criar lote</button>
      </form>
    `,
  );
  document.querySelector("#batchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const recipe = byId("recipes", data.recipeId);
    state.batches.unshift({
      id: id("bat"),
      code: data.code,
      flavor: recipe?.flavor || "",
      recipeId: data.recipeId,
      date: data.date,
      responsible: data.responsible,
      expected: Number(data.expected),
      actual: Number(data.actual),
      expiry: data.expiry,
      status: data.status,
    });
    addAudit("Lote criado", `${data.code} usando ${recipe?.flavor || "receita"}`);
    closeModal();
    render();
  });
}

function simpleRecordForm(collection, title, fields) {
  openModal(
    title,
    collection,
    `
      <form id="simpleForm">
        <div class="input-grid">
          ${fields
            .map((field) => `<label class="field ${field.full ? "field-full" : ""}"><span>${field.label}</span><input name="${field.name}" type="${field.type || "text"}" value="${field.value || ""}" ${field.required ? "required" : ""}></label>`)
            .join("")}
        </div>
        <button class="btn btn-primary" type="submit">Salvar</button>
      </form>
    `,
  );
  document.querySelector("#simpleForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    Object.entries(data).forEach(([key, value]) => {
      if (value !== "" && !Number.isNaN(Number(value)) && ["amount", "costEach", "stock", "min"].includes(key)) data[key] = Number(value);
    });
    state[collection].unshift({ id: id(collection.slice(0, 3)), ...data });
    addAudit(`${title} criado`, data.name || data.description || "");
    closeModal();
    render();
  });
}

function stockAdjustmentForm() {
  openModal(
    "Ajuste de estoque",
    "Estoque",
    `
      <form id="adjustForm">
        <div class="input-grid">
          <label class="field"><span>Ingrediente</span><select name="ingredientId">${state.ingredients.map((item) => `<option value="${item.id}">${item.name} (${number(item.stock, 2)} ${item.purchaseUnit})</option>`).join("")}</select></label>
          <label class="field"><span>Nova quantidade</span><input name="stock" type="number" step="0.01" required></label>
          <label class="field field-full"><span>Motivo obrigatório</span><input name="reason" required placeholder="Perda, inventário, devolução, correção..."></label>
        </div>
        <button class="btn btn-primary" type="submit">Registrar ajuste</button>
      </form>
    `,
  );
  document.querySelector("#adjustForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const ingredient = byId("ingredients", data.ingredientId);
    const previous = ingredient.stock;
    ingredient.stock = Number(data.stock);
    addAudit("Ajuste de estoque", `${ingredient.name}: ${previous} -> ${ingredient.stock}. Motivo: ${data.reason}`);
    closeModal();
    render();
  });
}

function exportCSV(name, rows) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  addAudit("CSV exportado", name);
}

function bindModuleEvents() {
  document.querySelector("#recipeSelector")?.addEventListener("change", (event) => {
    activeRecipeId = event.target.value;
    render();
  });
  document.querySelectorAll("[data-cost-line]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const recipe = byId("recipes", activeRecipeId);
      const { costLine, index, field } = event.target.dataset;
      const line = recipe[costLine][Number(index)];
      line[field] = field === "qty" ? Number(event.target.value) : event.target.value;
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-recipe-field]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const recipe = byId("recipes", activeRecipeId);
      recipe[event.target.dataset.recipeField] = Number(event.target.value);
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-cms-flavor]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const flavor = state.cms.flavors[Number(event.target.dataset.cmsFlavor)];
      flavor[event.target.dataset.field] = event.target.checked;
      saveState();
    });
  });
}

function handleAction(action) {
  if (!canWrite() && !["export-ingredients", "export-purchases", "export-sales", "export-reports", "export-costs"].includes(action)) return;
  const actionMap = {
    "new-ingredient": newIngredientForm,
    "new-purchase": newPurchaseForm,
    "new-sale": newSaleForm,
    "new-batch": newBatchForm,
    "stock-adjustment": stockAdjustmentForm,
    "new-supplier": () =>
      simpleRecordForm("suppliers", "Novo fornecedor", [
        { name: "name", label: "Nome", required: true },
        { name: "contact", label: "Contato" },
        { name: "whatsapp", label: "WhatsApp" },
        { name: "email", label: "Email" },
        { name: "city", label: "Cidade" },
        { name: "categories", label: "Categorias", full: true },
        { name: "leadTime", label: "Prazo médio" },
        { name: "status", label: "Status", value: "ativo" },
      ]),
    "new-packaging": () =>
      simpleRecordForm("packaging", "Novo material", [
        { name: "name", label: "Nome", required: true },
        { name: "supplier", label: "Fornecedor" },
        { name: "unit", label: "Unidade", value: "un" },
        { name: "costEach", label: "Custo unitário", type: "number" },
        { name: "stock", label: "Estoque", type: "number" },
        { name: "min", label: "Mínimo", type: "number" },
        { name: "location", label: "Local" },
      ]),
    "new-partner": () =>
      simpleRecordForm("partners", "Novo parceiro", [
        { name: "name", label: "Nome", required: true },
        { name: "type", label: "Tipo" },
        { name: "neighborhood", label: "Bairro" },
        { name: "city", label: "Cidade", value: "Manaus" },
        { name: "whatsapp", label: "WhatsApp" },
        { name: "instagram", label: "Instagram" },
        { name: "flavors", label: "Sabores", full: true },
        { name: "terms", label: "Prazo de pagamento" },
        { name: "lastDelivery", label: "Última entrega", type: "date" },
      ]),
    "new-expense": () =>
      simpleRecordForm("expenses", "Nova despesa", [
        { name: "date", label: "Data", type: "date", value: todayIso(), required: true },
        { name: "category", label: "Categoria", required: true },
        { name: "description", label: "Descrição", full: true, required: true },
        { name: "amount", label: "Valor", type: "number", required: true },
        { name: "method", label: "Método", value: "Pix" },
      ]),
    "new-recipe": () => alert("Estrutura pronta para nova receita. Próxima iteração: construtor visual de ingredientes por versão."),
    "go-costs": () => setModule("costs"),
    "save-costs": () => {
      addAudit("Simulação de custos salva", byId("recipes", activeRecipeId)?.flavor);
      render();
    },
    "save-cms": () => {
      const form = document.querySelector("#cmsForm");
      if (form) {
        const data = Object.fromEntries(new FormData(form).entries());
        state.cms = { ...state.cms, ...data };
        addAudit("CMS atualizado", "Conteúdo público salvo no protótipo.");
        saveState();
        render();
      }
    },
    "reset-demo": () => {
      state = clone(defaultState);
      saveState();
      addAudit("Demo resetada", "Dados restaurados.");
      render();
    },
    "export-ingredients": () => exportCSV("kombu-ingredientes", [["Nome", "Categoria", "Fornecedor", "Estoque", "Unidade", "Custo"], ...state.ingredients.map((i) => [i.name, i.category, i.supplier, i.stock, i.purchaseUnit, i.costPerUnit])]),
    "export-purchases": () => exportCSV("kombu-compras", [["Data", "Fornecedor", "Item", "Qtd", "Unidade", "Total"], ...state.purchases.map((p) => [p.date, p.supplier, p.item, p.qty, p.unit, p.total])]),
    "export-sales": () => exportCSV("kombu-vendas", [["Data", "Parceiro", "Canal", "Sabor", "Lote", "Qtd", "Preço"], ...state.sales.map((s) => [s.date, s.partner, s.channel, s.flavor, s.batchCode, s.qty, s.unitPrice])]),
    "export-reports": () => exportCSV("kombu-relatorio", [["Métrica", "Valor"], ["Receita", totals().salesRevenue], ["COGS", totals().cogs], ["Lucro bruto", totals().grossProfit], ["Despesas", totals().expenses], ["Líquido", totals().net]]),
    "export-costs": () => {
      const recipe = byId("recipes", activeRecipeId);
      exportCSV("kombu-custo-garrafa", [["Receita", recipe.flavor, recipe.version], ["Custo lote", recipeCost(recipe).total], ["Custo garrafa", recipeCost(recipe).costPerBottle]]);
    },
  };
  actionMap[action]?.();
}

document.querySelector("#adminNav").addEventListener("click", (event) => {
  const button = event.target.closest("[data-module]");
  if (button) setModule(button.dataset.module);
});

document.querySelector("#adminContent").addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (button && !button.disabled) handleAction(button.dataset.action);
});

document.querySelector("#quickSaleButton").addEventListener("click", newSaleForm);
document.querySelector("#closeAdminModal").addEventListener("click", closeModal);
document.querySelector("#adminModal").addEventListener("click", (event) => {
  if (event.target.id === "adminModal") closeModal();
});
document.querySelector("#globalSearch").addEventListener("input", (event) => {
  globalSearch = event.target.value.trim();
  render();
});
document.querySelector("#roleSelector").addEventListener("change", (event) => {
  currentRole = event.target.value;
  addAudit("Perfil de acesso alterado", currentRole);
  render();
});

render();
