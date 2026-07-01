const STORAGE_KEY = "kombuAdminStateV2";
const ADMIN_PASSWORD = "Rssb2009";

const defaultState = {
  ingredients: [],
  packaging: [],
  suppliers: [],
  partners: [],
  recipes: [],
  batches: [],
  sales: [],
  purchases: [],
  expenses: [],
  cms: {
    headline: "Refrigerante saudável, natural e cheio de sabor.",
    subheadline: "Feita com ingredientes reais, fermentação natural e uma proposta simples: cuidar da saúde sem abrir mão do sabor.",
    whatsapp: "(92) 99209-7165",
    announcement: "",
    officialMapUrl: "https://www.google.com/maps/d/u/0/edit?mid=1Zn4OECfeuJkhDkCj6noQKZDeLgOUbn8",
    images: [
      {
        key: "heroBottle",
        label: "Hero - garrafa principal",
        recommended: "760 x 1367 px",
        url: "https://static.wixstatic.com/media/716adf_5b0b2489ee914e53b15b4a590915d974~mv2.png/v1/crop/x_6,y_0,w_1068,h_1920/fill/w_760,h_1367,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/4_edited.png",
      },
      {
        key: "maracuja",
        label: "Sabor - Maracujá",
        recommended: "520 x 936 px",
        url: "https://static.wixstatic.com/media/716adf_5b0b2489ee914e53b15b4a590915d974~mv2.png/v1/crop/x_6,y_0,w_1068,h_1920/fill/w_520,h_936,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/4_edited.png",
      },
      {
        key: "imunidade",
        label: "Sabor - Imunidade",
        recommended: "520 x 1071 px",
        url: "https://static.wixstatic.com/media/716adf_c9ac20cf991c4796b8be299c33e22abc~mv2.png/v1/crop/x_62,y_0,w_931,h_1920/fill/w_520,h_1071,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/2.png",
      },
      {
        key: "macaCanela",
        label: "Sabor - Maçã e Canela",
        recommended: "520 x 693 px",
        url: "https://static.wixstatic.com/media/716adf_673e38f87b0e41bd9972f7b8a5fda104~mv2.png/v1/fill/w_520,h_693,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_6619_edited.png",
      },
      {
        key: "peraAlecrim",
        label: "Sabor - Pêra e Alecrim",
        recommended: "520 x 936 px",
        url: "https://static.wixstatic.com/media/716adf_2b695c9743c344a2a91acf67ed69ff5f~mv2.png/v1/fill/w_520,h_936,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/6_edited_edited.png",
      },
      {
        key: "frutasVermelhas",
        label: "Sabor - Frutas Vermelhas",
        recommended: "520 x 936 px",
        url: "https://static.wixstatic.com/media/716adf_5c8cd66d9eb842a0940b212d250fd255~mv2.png/v1/fill/w_520,h_936,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/IMG_2897_PNG.png",
      },
      {
        key: "mirtilo",
        label: "Sabor - Mirtilo e Flor Borboleta Azul",
        recommended: "520 x 936 px",
        url: "https://static.wixstatic.com/media/716adf_8da298261b9a4acd8e9e2264491cee1d~mv2.png/v1/fill/w_520,h_936,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/7.png",
      },
      {
        key: "rosasCardamomo",
        label: "Sabor - Rosas e Cardamomo",
        recommended: "520 x 936 px",
        url: "https://static.wixstatic.com/media/716adf_4d2ae2c8e77d48ea8aa11ceffef05be4~mv2.png/v1/fill/w_520,h_936,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/3_edited.png",
      },
      {
        key: "hibisco",
        label: "Sabor - Hibisco com Anis Estrelado",
        recommended: "520 x 936 px",
        url: "https://static.wixstatic.com/media/716adf_4d2ae2c8e77d48ea8aa11ceffef05be4~mv2.png/v1/fill/w_520,h_936,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/3_edited.png",
      },
      {
        key: "ogImage",
        label: "Imagem social/SEO",
        recommended: "1200 x 630 px",
        url: "https://static.wixstatic.com/media/716adf_5b0b2489ee914e53b15b4a590915d974~mv2.png/v1/crop/x_6,y_0,w_1068,h_1920/fill/w_1200,h_630,al_c,q_90,enc_auto/4_edited.png",
      },
    ],
    flavors: [],
  },
  audit: [],
};

let state = loadState();
let currentModule = "dashboard";
let globalSearch = "";
let activeRecipeId = state.recipes[0]?.id || "";
let currentRole = "Owner / Admin";

function isAuthenticated() {
  return sessionStorage.getItem("kombuAdminAuthenticated") === "true";
}

function unlockAdmin() {
  document.querySelector("#loginScreen")?.classList.add("is-hidden");
  const shell = document.querySelector("#adminShell");
  shell?.classList.remove("is-locked");
  shell?.removeAttribute("aria-hidden");
}

function lockAdmin() {
  sessionStorage.removeItem("kombuAdminAuthenticated");
  document.querySelector("#loginScreen")?.classList.remove("is-hidden");
  const shell = document.querySelector("#adminShell");
  shell?.classList.add("is-locked");
  shell?.setAttribute("aria-hidden", "true");
  document.querySelector("#adminPassword")?.focus();
}

function bindAuth() {
  const loginForm = document.querySelector("#loginForm");
  const passwordInput = document.querySelector("#adminPassword");
  const loginError = document.querySelector("#loginError");
  const togglePassword = document.querySelector("#togglePassword");
  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (passwordInput.value === ADMIN_PASSWORD) {
      sessionStorage.setItem("kombuAdminAuthenticated", "true");
      passwordInput.value = "";
      loginError?.classList.add("hidden");
      unlockAdmin();
      render();
      return;
    }
    loginError?.classList.remove("hidden");
    passwordInput.select();
  });
  togglePassword?.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.setAttribute("aria-label", isPassword ? "Ocultar senha" : "Mostrar senha");
    togglePassword.querySelector(".material-symbols-outlined").textContent = isPassword ? "visibility_off" : "visibility";
  });
  document.querySelector("#logoutButton")?.addEventListener("click", lockAdmin);
}

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

function normalizeState(savedState) {
  const base = clone(defaultState);
  const saved = savedState || {};
  const merged = { ...base, ...saved };
  merged.cms = {
    ...base.cms,
    ...(saved.cms || {}),
    images: saved.cms?.images?.length ? saved.cms.images : base.cms.images,
    flavors: saved.cms?.flavors || base.cms.flavors,
  };
  ["ingredients", "packaging", "suppliers", "partners", "recipes", "batches", "sales", "purchases", "expenses", "audit"].forEach((key) => {
    merged[key] = Array.isArray(saved[key]) ? saved[key] : base[key];
  });
  return merged;
}

function loadState() {
  try {
    return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)));
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
  if (!recipe) {
    return {
      ingredientCost: 0,
      packagingCost: 0,
      direct: 0,
      total: 0,
      costPerBottle: 0,
      costPerLiter: 0,
      wholesaleProfit: 0,
      wholesaleMargin: 0,
      retailProfit: 0,
      retailMargin: 0,
    };
  }
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
  if (!recipe) return { ...recipeCost(null), batchTotal: 0, batchCostPerBottle: 0 };
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

function monthlySalesRows(limit = 6) {
  const rowsByMonth = state.sales.reduce((acc, sale) => {
    if (!sale.date) return acc;
    const monthKey = sale.date.slice(0, 7);
    acc[monthKey] = acc[monthKey] || { key: monthKey, revenue: 0, qty: 0 };
    acc[monthKey].revenue += Number(sale.qty || 0) * Number(sale.unitPrice || 0) - Number(sale.discount || 0);
    acc[monthKey].qty += Number(sale.qty || 0);
    return acc;
  }, {});
  return Object.values(rowsByMonth)
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-limit)
    .map((row) => {
      const date = new Date(`${row.key}-01T00:00:00`);
      return {
        ...row,
        label: date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }).replace(".", ""),
      };
    });
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
          ${flavorRows.length ? flavorRows
            .slice(0, 6)
            .map(([flavor, qty]) => `<div class="bar" title="${flavor}"><i style="height:${Math.max(8, Math.min(100, qty / 2.4))}%"></i><span>${shortFlavor(flavor)}</span></div>`)
            .join("") : `<p class="empty-note">Crie lotes aprovados para visualizar estoque por sabor.</p>`}
        </div>
      </article>
    </section>
    <section class="admin-grid">
      <article class="admin-card">
        <h3>Parceiros com maior volume</h3>
        <div class="stack-list">
          ${partnerRows.length ? partnerRows.map(([partner, qty]) => `<div class="report-row"><strong>${partner}</strong><span>${number(qty)} garrafas vendidas</span></div>`).join("") : `<p class="empty-note">Registre vendas para ver parceiros por volume.</p>`}
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
  const bodyRows = rows.length
    ? rows.join("")
    : `<tr><td colspan="${headers.length}"><p class="empty-note">Nenhum registro ainda. Use os botões acima para começar.</p></td></tr>`;
  return `
    <article class="admin-card table-card">
      <div class="table-scroll">
        <table class="data-table" style="min-width:${minWidth}px">
          <thead><tr>${headers.map((header) => `<th class="${header.num ? "num" : ""}">${header.label}</th>`).join("")}</tr></thead>
          <tbody>${bodyRows}</tbody>
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
  if (!recipe) {
    return `
      ${pageHead(
        "Custo por Garrafa",
        "Crie uma receita para o sistema calcular custo por lote, custo por garrafa e margem automaticamente.",
        actionButton("new-recipe", "Criar primeira receita", "add"),
      )}
      <article class="admin-card">
        <h3>Nenhuma receita cadastrada</h3>
        <p class="lead" style="font-size:1rem">A calculadora depende de uma receita com rendimento, ingredientes, custos de compra, embalagens e perdas. Ao criar a receita, novos ingredientes e embalagens informados serão adicionados automaticamente aos respectivos módulos.</p>
      </article>
    `;
  }
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
  const monthlyRows = monthlySalesRows();
  const monthlyMax = Math.max(1, ...monthlyRows.map((row) => row.revenue));
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
        <h3>Vendas por mês</h3>
        <div class="bar-chart">
          ${monthlyRows.length ? monthlyRows.map((row) => `<div class="bar" title="${row.label}: ${brl(row.revenue)}"><i style="height:${Math.max(8, (row.revenue / monthlyMax) * 100)}%"></i><span>${row.label}</span></div>`).join("") : `<p class="empty-note">Registre vendas para visualizar receita mensal.</p>`}
        </div>
      </article>
      <article class="admin-card">
        <h3>Lucro por sabor</h3>
        <div class="stack-list">${reportRows || `<p class="empty-note">Registre vendas para visualizar lucro por sabor.</p>`}</div>
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
  const imageRows = (state.cms.images || []).map(
    (image, index) => `
      <article class="image-control">
        <div class="image-preview">
          <img src="${image.url}" alt="${image.label}" loading="lazy">
        </div>
        <div class="image-fields">
          <input type="hidden" data-cms-image="${index}" data-field="key" value="${image.key}">
          <label class="field"><span>Imagem</span><input data-cms-image="${index}" data-field="label" value="${image.label}"></label>
          <label class="field"><span>Tamanho perfeito</span><input data-cms-image="${index}" data-field="recommended" value="${image.recommended}" readonly></label>
          <label class="field field-full"><span>URL da imagem</span><input data-cms-image="${index}" data-field="url" value="${image.url}"></label>
        </div>
      </article>
    `,
  ).join("");
  return `
    ${pageHead("CMS Público", "Controle headlines, sabores, parceiros, SEO, WhatsApp e anúncios do site público.", actionButton("save-cms", "Salvar CMS", "save"))}
    <section class="admin-grid">
      <form class="admin-card" id="cmsForm">
        <div class="input-grid">
          <label class="field field-full"><span>Headline da home</span><input name="headline" value="${state.cms.headline}"></label>
          <label class="field field-full"><span>Subheadline</span><textarea name="subheadline">${state.cms.subheadline}</textarea></label>
          <label class="field"><span>WhatsApp</span><input name="whatsapp" value="${state.cms.whatsapp}"></label>
          <label class="field field-full"><span>Link oficial comprar / onde encontrar</span><input name="officialMapUrl" value="${state.cms.officialMapUrl || ""}"></label>
          <label class="field"><span>Anúncio</span><input name="announcement" value="${state.cms.announcement}"></label>
        </div>
      </form>
      <article class="admin-card">
        <h3>Como publicar alterações</h3>
        <p class="lead" style="font-size:1rem">Neste protótipo estático, as alterações ficam no navegador via localStorage. Para que imagens e textos mudem para todos os visitantes, precisamos ligar o site a um backend, como Supabase.</p>
      </article>
    </section>
    <section class="admin-card" style="margin-top:16px">
      <h3>Imagens do site público</h3>
      <p class="lead" style="font-size:1rem">Cole uma URL nova para trocar rapidamente a imagem. O campo "tamanho perfeito" mostra a dimensão recomendada em pixels para evitar corte estranho no layout.</p>
      <div class="image-control-grid">${imageRows}</div>
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
    ${pageHead("Arquitetura e Banco de Dados", "Estrutura sugerida para evoluir este protótipo estático para um sistema seguro com autenticação, roles e histórico.", actionButton("reset-demo", "Limpar dados", "restart_alt", "btn-danger", "schema"))}
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
  if (!state.ingredients.length) {
    openModal(
      "Cadastre um ingrediente primeiro",
      "Compras",
      `<p class="empty-note">Para registrar uma compra e atualizar estoque, primeiro crie um ingrediente. Você também pode criar ingredientes automaticamente ao criar uma receita.</p>
       <button class="btn btn-primary" type="button" data-action="new-ingredient"><span class="material-symbols-outlined" aria-hidden="true">add</span>Novo ingrediente</button>`,
    );
    return;
  }
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
  if (!stockRows.length) {
    openModal(
      "Sem estoque disponível",
      "Vendas",
      `<p class="empty-note">Para vender, crie uma receita, registre um lote produzido/aprovado e só então lance a venda. Assim o sistema calcula COGS e margem corretamente.</p>
       <button class="btn btn-primary" type="button" data-action="new-batch"><span class="material-symbols-outlined" aria-hidden="true">factory</span>Criar lote</button>`,
    );
    return;
  }
  openModal(
    "Nova venda",
    "Vendas",
    `
      <form id="saleForm">
        <div class="input-grid">
          <label class="field"><span>Data</span><input name="date" type="date" value="${todayIso()}" required></label>
          <label class="field"><span>Parceiro / cliente</span><select name="partner">${state.partners.map((item) => `<option>${item.name}</option>`).join("")}<option>Cliente direto</option><option>Venda avulsa</option></select></label>
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
  if (!state.recipes.length) {
    openModal(
      "Crie uma receita primeiro",
      "Produção",
      `<p class="empty-note">Para criar um lote, primeiro cadastre uma receita/fórmula. Assim o lote já nasce com custo histórico calculado.</p>
       <button class="btn btn-primary" type="button" data-action="new-recipe"><span class="material-symbols-outlined" aria-hidden="true">add</span>Criar receita</button>`,
    );
    return;
  }
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

function unitOptions(selected = "kg") {
  return ["kg", "g", "l", "ml", "un"].map((unit) => `<option value="${unit}" ${unit === selected ? "selected" : ""}>${unit}</option>`).join("");
}

function recipeIngredientRowTemplate() {
  return `
    <div class="builder-row recipe-ingredient-row">
      <label class="field"><span>Ingrediente</span><input data-field="name" required placeholder="Ex: gengibre"></label>
      <label class="field"><span>Categoria</span><input data-field="category" placeholder="fruta, chá, especiaria..."></label>
      <label class="field"><span>Fornecedor</span><input data-field="supplier"></label>
      <label class="field"><span>Un. compra</span><select data-field="purchaseUnit">${unitOptions("kg")}</select></label>
      <label class="field"><span>Custo/un.</span><input data-field="costPerUnit" type="number" min="0" step="0.01" required></label>
      <label class="field"><span>Estoque inicial</span><input data-field="stock" type="number" min="0" step="0.01" placeholder="0"></label>
      <label class="field"><span>Estoque mínimo</span><input data-field="min" type="number" min="0" step="0.01" placeholder="0"></label>
      <label class="field"><span>Qtd. usada no lote</span><input data-field="usageQty" type="number" min="0" step="0.001" required></label>
      <label class="field"><span>Un. uso</span><select data-field="usageUnit">${unitOptions("g")}</select></label>
      <button class="icon-btn" type="button" data-remove-builder-row aria-label="Remover ingrediente">
        <span class="material-symbols-outlined" aria-hidden="true">delete</span>
      </button>
    </div>
  `;
}

function recipePackagingRowTemplate() {
  return `
    <div class="builder-row recipe-packaging-row">
      <label class="field"><span>Embalagem/material</span><input data-field="name" required placeholder="Ex: garrafa 500ml"></label>
      <label class="field"><span>Fornecedor</span><input data-field="supplier"></label>
      <label class="field"><span>Custo por unidade</span><input data-field="costEach" type="number" min="0" step="0.01" required></label>
      <label class="field"><span>Estoque inicial</span><input data-field="stock" type="number" min="0" step="1" placeholder="0"></label>
      <label class="field"><span>Estoque mínimo</span><input data-field="min" type="number" min="0" step="1" placeholder="0"></label>
      <label class="field"><span>Qtd. por garrafa</span><input data-field="qtyPerBottle" type="number" min="0" step="0.001" value="1" required></label>
      <button class="icon-btn" type="button" data-remove-builder-row aria-label="Remover embalagem">
        <span class="material-symbols-outlined" aria-hidden="true">delete</span>
      </button>
    </div>
  `;
}

function readBuilderRow(row) {
  return Array.from(row.querySelectorAll("[data-field]")).reduce((data, input) => {
    data[input.dataset.field] = input.value.trim();
    return data;
  }, {});
}

function findOrCreateIngredient(data) {
  const normalizedName = data.name.toLowerCase();
  let ingredient = state.ingredients.find((item) => item.name.toLowerCase() === normalizedName);
  if (!ingredient) {
    ingredient = {
      id: id("ing"),
      name: data.name,
      category: data.category || "outro",
      supplier: data.supplier || "",
      purchaseUnit: data.purchaseUnit || "kg",
      costPerUnit: Number(data.costPerUnit || 0),
      stock: Number(data.stock || 0),
      min: Number(data.min || 0),
      expires: "",
      location: "",
      status: "ativo",
    };
    state.ingredients.push(ingredient);
    return ingredient;
  }
  ingredient.category = data.category || ingredient.category;
  ingredient.supplier = data.supplier || ingredient.supplier;
  ingredient.purchaseUnit = data.purchaseUnit || ingredient.purchaseUnit;
  ingredient.costPerUnit = Number(data.costPerUnit || ingredient.costPerUnit || 0);
  if (data.stock !== "") ingredient.stock = Number(data.stock);
  if (data.min !== "") ingredient.min = Number(data.min);
  return ingredient;
}

function findOrCreatePackaging(data) {
  const normalizedName = data.name.toLowerCase();
  let material = state.packaging.find((item) => item.name.toLowerCase() === normalizedName);
  if (!material) {
    material = {
      id: id("pkg"),
      name: data.name,
      supplier: data.supplier || "",
      unit: "un",
      costEach: Number(data.costEach || 0),
      stock: Number(data.stock || 0),
      min: Number(data.min || 0),
      location: "",
    };
    state.packaging.push(material);
    return material;
  }
  material.supplier = data.supplier || material.supplier;
  material.costEach = Number(data.costEach || material.costEach || 0);
  if (data.stock !== "") material.stock = Number(data.stock);
  if (data.min !== "") material.min = Number(data.min);
  return material;
}

function newRecipeForm() {
  openModal(
    "Nova receita",
    "Receitas / custos",
    `
      <form id="recipeForm">
        <div class="input-grid">
          <label class="field"><span>Sabor</span><input name="flavor" required placeholder="Ex: Maracujá"></label>
          <label class="field"><span>Versão</span><input name="version" value="v1" required></label>
          <label class="field"><span>Tamanho da garrafa (ml)</span><input name="bottleMl" type="number" min="1" value="500" required></label>
          <label class="field"><span>Rendimento esperado (garrafas)</span><input name="yieldBottles" type="number" min="1" value="1" required></label>
          <label class="field"><span>Perda / quebra (%)</span><input name="wastePct" type="number" min="0" step="0.01" value="0"></label>
          <label class="field"><span>Preço atacado desejado</span><input name="wholesalePrice" type="number" min="0" step="0.01" value="0"></label>
          <label class="field"><span>Preço varejo desejado</span><input name="retailPrice" type="number" min="0" step="0.01" value="0"></label>
          <label class="field"><span>Mão de obra por lote</span><input name="labor" type="number" min="0" step="0.01" value="0"></label>
          <label class="field"><span>Água/luz/gás por lote</span><input name="utilities" type="number" min="0" step="0.01" value="0"></label>
          <label class="field"><span>Outros custos variáveis</span><input name="other" type="number" min="0" step="0.01" value="0"></label>
        </div>

        <div class="builder-section">
          <div class="table-toolbar">
            <div>
              <h3>Ingredientes da receita</h3>
              <p>Se o ingrediente não existir, ele será criado automaticamente no estoque.</p>
            </div>
            <button class="btn btn-outline" type="button" data-add-ingredient-row>
              <span class="material-symbols-outlined" aria-hidden="true">add</span>
              Ingrediente
            </button>
          </div>
          <div id="recipeIngredientRows">${recipeIngredientRowTemplate()}</div>
        </div>

        <div class="builder-section">
          <div class="table-toolbar">
            <div>
              <h3>Embalagens e materiais</h3>
              <p>Garrafa, tampa, rótulo, caixa, lacre ou qualquer material por garrafa.</p>
            </div>
            <button class="btn btn-outline" type="button" data-add-packaging-row>
              <span class="material-symbols-outlined" aria-hidden="true">add</span>
              Material
            </button>
          </div>
          <div id="recipePackagingRows">${recipePackagingRowTemplate()}</div>
        </div>

        <button class="btn btn-primary" type="submit">
          <span class="material-symbols-outlined" aria-hidden="true">calculate</span>
          Salvar receita e calcular garrafa
        </button>
      </form>
    `,
  );
  bindRecipeBuilder();
}

function bindRecipeBuilder() {
  const form = document.querySelector("#recipeForm");
  form.querySelector("[data-add-ingredient-row]").addEventListener("click", () => {
    document.querySelector("#recipeIngredientRows").insertAdjacentHTML("beforeend", recipeIngredientRowTemplate());
  });
  form.querySelector("[data-add-packaging-row]").addEventListener("click", () => {
    document.querySelector("#recipePackagingRows").insertAdjacentHTML("beforeend", recipePackagingRowTemplate());
  });
  form.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-builder-row]");
    if (!removeButton) return;
    const parent = removeButton.closest(".builder-row");
    const container = parent.parentElement;
    if (container.children.length > 1) parent.remove();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const ingredients = Array.from(form.querySelectorAll(".recipe-ingredient-row"))
      .map(readBuilderRow)
      .filter((row) => row.name && Number(row.usageQty) > 0)
      .map((row) => {
        const ingredient = findOrCreateIngredient(row);
        return {
          ingredientId: ingredient.id,
          qty: Number(row.usageQty),
          unit: row.usageUnit || ingredient.purchaseUnit,
        };
      });
    const packaging = Array.from(form.querySelectorAll(".recipe-packaging-row"))
      .map(readBuilderRow)
      .filter((row) => row.name && Number(row.qtyPerBottle) > 0)
      .map((row) => {
        const material = findOrCreatePackaging(row);
        return {
          itemId: material.id,
          qty: Number(row.qtyPerBottle),
        };
      });
    const recipe = {
      id: id("rec"),
      flavor: data.flavor,
      version: data.version,
      status: "ativa",
      bottleMl: Number(data.bottleMl),
      yieldBottles: Number(data.yieldBottles),
      wastePct: Number(data.wastePct || 0),
      labor: Number(data.labor || 0),
      utilities: Number(data.utilities || 0),
      other: Number(data.other || 0),
      wholesalePrice: Number(data.wholesalePrice || 0),
      retailPrice: Number(data.retailPrice || 0),
      ingredients,
      packaging,
    };
    state.recipes.push(recipe);
    activeRecipeId = recipe.id;
    addAudit("Receita criada", `${recipe.flavor} ${recipe.version} com ${ingredients.length} ingredientes e ${packaging.length} materiais.`);
    closeModal();
    setModule("costs");
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
  document.querySelectorAll("[data-cms-image]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const image = state.cms.images[Number(event.target.dataset.cmsImage)];
      image[event.target.dataset.field] = event.target.value;
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
    "new-recipe": newRecipeForm,
    "go-costs": () => setModule("costs"),
    "save-costs": () => {
      addAudit("Simulação de custos salva", byId("recipes", activeRecipeId)?.flavor);
      render();
    },
    "save-cms": () => {
      const form = document.querySelector("#cmsForm");
      if (form) {
        const data = Object.fromEntries(new FormData(form).entries());
        document.querySelectorAll("[data-cms-image]").forEach((input) => {
          const image = state.cms.images[Number(input.dataset.cmsImage)];
          image[input.dataset.field] = input.value;
        });
        state.cms = { ...state.cms, ...data };
        addAudit("CMS atualizado", "Conteúdo público salvo no protótipo.");
        saveState();
        render();
      }
    },
    "reset-demo": () => {
      state = clone(defaultState);
      saveState();
      addAudit("Dados limpos", "Admin reiniciado sem registros operacionais.");
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
  const button = event.target.closest("[data-action]");
  if (button && !button.disabled) handleAction(button.dataset.action);
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

function initializeAdmin() {
  bindAuth();
  if (isAuthenticated()) {
    unlockAdmin();
    render();
  } else {
    lockAdmin();
  }
}

initializeAdmin();
