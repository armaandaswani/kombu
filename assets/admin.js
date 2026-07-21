const STORAGE_KEY = "kombuAdminStateV3";
const LOCALE_KEY = "kombuAdminLocale";
const ADMIN_NOTIFICATION_EMAIL = "armaandaswani@icloud.com";
const FLAVOR_CATEGORIES = ["Frutados", "Cítricos", "Florais", "Herbais", "Especiados"];
const FLAVOR_IMAGE_RECOMMENDED = "mín. 760 x 1368 px; ideal 1040 x 1872 px";
const ORDER_STATUSES = ["recebido", "confirmado", "em produção", "produzido", "pronto", "entregue", "cancelado"];
const ORDER_FLOW_STATUSES = ["recebido", "em produção", "produzido", "pronto", "entregue"];
const ORDER_ITEM_STATUSES = ["pendente", "em produção", "produzido", "reservado", "entregue"];
const ORDER_CLIENT_TYPES = [
  { value: "novo_cliente", label: "Novo cliente", price: "retail" },
  { value: "varejo_recorrente", label: "Cliente varejo recorrente", price: "recurringRetail" },
  { value: "novo_parceiro", label: "Novo parceiro", price: "wholesale" },
  { value: "parceiro_recorrente", label: "Parceiro recorrente", price: "wholesale" },
];
const PAYMENT_STATUSES = ["aberto", "aguardando pagamento", "pago", "atrasado", "cancelado"];
const PAYMENT_METHODS = ["Pix", "Dinheiro", "Cartão", "Boleto", "Transferência", "A prazo", "Outro"];
const DELIVERY_PROOF_DEFAULT_PAYMENT_METHOD = "Prazo – 15 dias corridos após a entrega";
const DELIVERY_PROOF_PAYMENT_NOTE =
  "O link de pagamento será gerado pela plataforma Infinite Pay e enviado via WhatsApp ao responsável pelo pedido.";
const RECURRING_RETAIL_PRICE = 20;
const GLOBAL_RETAIL_PRICE = 22;
const GLOBAL_WHOLESALE_PRICE = 15;
const GLOBAL_PRICE_VERSION = "2026-07-04-22-15";
const BASE_BOTTLE_SIZE_ML = 500;
const SMALL_BOTTLE_SIZE_ML = 300;
const SMALL_BOTTLE_RECIPE_RATIO = SMALL_BOTTLE_SIZE_ML / BASE_BOTTLE_SIZE_ML;

const ADMIN_I18N = {
  en: {
    "Acesso protegido": "Protected access",
    "Acesso validado no servidor. A senha nunca deve aparecer na URL; use apenas este campo para entrar.": "Access is validated on the server. The password should never appear in the URL; use only this field to sign in.",
    "Ações": "Actions",
    "Admin": "Admin",
    "Arquitetura": "Architecture",
    "Atualizar item existente": "Update existing item",
    "Atenção necessária": "Needs attention",
    "A receber": "Receivable",
    "Busca": "Search",
    "Buscar EAN, lotes, ingredientes, pedidos, clientes ou vendas...": "Search barcode, batches, ingredients, orders, customers or sales...",
    "Cadastrar novo item": "Add new item",
    "Cliente varejo recorrente": "Recurring retail customer",
    "Cobranças próximas": "Upcoming collections",
    "Compras": "Purchases",
    "Controle operacional e financeiro da Kombú: produção, estoque, custo por garrafa, vendas e alertas.": "Operational and financial control for Kombú: production, inventory, bottle cost, sales and alerts.",
    "Custo": "Cost",
    "Custos": "Costs",
    "Dashboard": "Dashboard",
    "Data": "Date",
    "Despesas": "Expenses",
    "Disponível": "Available",
    "Embalagens": "Packaging",
    "Entrar no portal": "Enter portal",
    "Entre com a senha do admin.": "Enter the admin password.",
    "Este painel controla custos, receitas, estoque, vendas, CMS e dados operacionais da Kombú.": "This panel controls costs, recipes, inventory, sales, CMS and operational data for Kombú.",
    "Estoque": "Stock",
    "Estoque geral por sabor": "Total stock by flavor",
    "Estoque por sabor": "Stock by flavor",
    "Fornecedor": "Supplier",
    "Fornecedores": "Suppliers",
    "Garrafas": "Bottles",
    "Ingredientes": "Ingredients",
    "Item existente": "Existing item",
    "Lead CRM": "CRM leads",
    "Leads CRM": "CRM leads",
    "Novo cliente": "New customer",
    "Novo lote": "New batch",
    "Novo parceiro": "New partner",
    "Novo pedido": "New order",
    "Nenhum alerta crítico no momento.": "No critical alerts right now.",
    "Nenhum registro ainda. Use os botões acima para começar.": "No records yet. Use the buttons above to start.",
    "Owner / Admin": "Owner / Admin",
    "Parceiro recorrente": "Recurring partner",
    "Parceiros": "Partners",
    "Painel Operacional": "Operations Panel",
    "Portal interno": "Internal portal",
    "Produtos": "Products",
    "Produção": "Production",
    "Produção faltante": "Missing production",
    "Produção puxada por pedidos": "Production pulled by orders",
    "Pronto por cliente": "Ready by customer",
    "Quantidade": "Quantity",
    "Receitas": "Recipes",
    "Receita do período": "Period revenue",
    "Registrar compra": "Register purchase",
    "Registrar venda": "Register sale",
    "Relatórios": "Reports",
    "Reservado": "Reserved",
    "Rótulos": "Labels",
    "Sair": "Log out",
    "Senha": "Password",
    "Senha incorreta.": "Incorrect password.",
    "Site público": "Public site",
    "Sincronizacao na nuvem ativa.": "Cloud sync active.",
    "Alteracoes salvas aqui aparecem no site publico, no desktop e no celular.": "Changes saved here appear on the public site, desktop and phone.",
    "Ultimo salvamento": "Last save",
    "Leitura rápida para ver o que existe agora, sem abrir lote por lote.": "Quick view of what exists now, without opening each batch.",
    "Nenhum sabor encontrado.": "No flavor found.",
    "Resumo simples por sabor, reservas por cliente e lotes disponíveis.": "Simple view by flavor, customer reservations and available batches.",
    "Separado agora": "Separated now",
    "Separado para entrega": "Separated for delivery",
    "disponíveis": "available",
    "reservadas": "reserved",
    "disp.": "avail.",
    "Vendas": "Sales",
    "Venda rápida": "Quick sale",
    "Visão Geral": "Overview",
  },
};

const MODULE_LABELS = {
  dashboard: "Dashboard",
  products: "Produtos",
  ingredients: "Ingredientes",
  purchases: "Compras",
  suppliers: "Fornecedores",
  recipes: "Receitas",
  costs: "Custos",
  batches: "Produção",
  stock: "Estoque",
  packaging: "Embalagens",
  sales: "Vendas",
  orders: "Pedidos",
  leads: "Leads CRM",
  partners: "Parceiros",
  expenses: "Despesas",
  reports: "Relatórios",
  cms: "CMS",
  schema: "Arquitetura",
};

function tr(value) {
  const text = String(value ?? "");
  if (currentLocale !== "en") return text;
  return ADMIN_I18N.en[text] || text;
}

function setInlineLabel(element, label) {
  if (!element) return;
  const icon = element.querySelector(".material-symbols-outlined");
  element.textContent = "";
  if (icon) element.append(icon);
  element.append(document.createTextNode(` ${tr(label)}`));
}

function applyLocaleToShell() {
  document.documentElement.lang = currentLocale === "en" ? "en" : "pt-BR";
  document.querySelectorAll("[data-locale]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.locale === currentLocale);
    button.setAttribute("aria-pressed", button.dataset.locale === currentLocale ? "true" : "false");
  });
  const loginScreen = document.querySelector("#loginScreen");
  if (loginScreen) {
    const brandLabel = loginScreen.querySelector(".brand-name span");
    if (brandLabel) brandLabel.textContent = tr("Acesso protegido");
    setInlineLabel(loginScreen.querySelector(".eyebrow"), "Portal interno");
    const title = loginScreen.querySelector("#loginTitle");
    if (title) title.textContent = tr("Entre com a senha do admin.");
    const copy = loginScreen.querySelector("#loginTitle + p");
    if (copy) copy.textContent = tr("Este painel controla custos, receitas, estoque, vendas, CMS e dados operacionais da Kombú.");
    const label = loginScreen.querySelector("label[for='adminPassword']");
    if (label) label.textContent = tr("Senha");
    setInlineLabel(loginScreen.querySelector("#loginForm .btn-primary"), "Entrar no portal");
    const error = loginScreen.querySelector("#loginError");
    if (error && error.textContent.trim() === "Senha incorreta.") error.textContent = tr("Senha incorreta.");
    const note = loginScreen.querySelector(".login-note");
    if (note) note.textContent = tr("Acesso validado no servidor. A senha nunca deve aparecer na URL; use apenas este campo para entrar.");
  }
  const sidebarLabel = document.querySelector(".admin-sidebar .brand-name span");
  if (sidebarLabel) sidebarLabel.textContent = tr("Painel Operacional");
  document.querySelectorAll("#adminNav [data-module]").forEach((button) => {
    const label = MODULE_LABELS[button.dataset.module] || button.dataset.module;
    const translated = tr(label);
    const labelNode = button.querySelector(".label");
    if (labelNode) labelNode.textContent = translated;
    button.title = translated;
  });
  const mobileSelect = document.querySelector("#mobileModuleSelector");
  if (mobileSelect) {
    Array.from(mobileSelect.options).forEach((option) => {
      option.textContent = tr(MODULE_LABELS[option.value] || option.textContent);
    });
  }
  const search = document.querySelector("#globalSearch");
  if (search) search.placeholder = tr("Buscar EAN, lotes, ingredientes, pedidos, clientes ou vendas...");
  setInlineLabel(document.querySelector("#logoutButton"), "Sair");
  setInlineLabel(document.querySelector(".admin-user a.btn-outline"), "Site público");
}

const PRODUCT_CATALOG_SEED = [
  { id: "prod-kmb001", ean: "7890528600010", item: "KMB001", flavor: "Maracujá", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Maracujá", wholesalePrice: GLOBAL_WHOLESALE_PRICE, retailPrice: GLOBAL_RETAIL_PRICE, baselineCost: 3.29, status: "ativo", visible: true },
  { id: "prod-kmb002", ean: "7890528600027", item: "KMB002", flavor: "Frutas Vermelhas", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Frutas Vermelhas (Morango, Mirtilo, Oxicoco)", wholesalePrice: GLOBAL_WHOLESALE_PRICE, retailPrice: GLOBAL_RETAIL_PRICE, baselineCost: 4.74, status: "ativo", visible: true },
  { id: "prod-kmb003", ean: "7890528600034", item: "KMB003", flavor: "Hibisco com Anis Estrelado", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Hibisco c/Anis Estrelado", wholesalePrice: GLOBAL_WHOLESALE_PRICE, retailPrice: GLOBAL_RETAIL_PRICE, baselineCost: 2.29, status: "ativo", visible: true },
  { id: "prod-kmb004", ean: "7890528600041", item: "KMB004", flavor: "Mirtilo c/Flor Borboleta Azul", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Mirtilo c/Flor Borboleta Azul", wholesalePrice: GLOBAL_WHOLESALE_PRICE, retailPrice: GLOBAL_RETAIL_PRICE, baselineCost: 4.47, status: "ativo", visible: true },
  { id: "prod-kmb005", ean: "7890528600058", item: "KMB005", flavor: "Maçã c/Canela", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Maçã c/Canela", wholesalePrice: GLOBAL_WHOLESALE_PRICE, retailPrice: GLOBAL_RETAIL_PRICE, baselineCost: 2.9, status: "ativo", visible: true },
  { id: "prod-kmb006", ean: "7890528600065", item: "KMB006", flavor: "Pêra c/Alecrim", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Pêra c/Alecrim", wholesalePrice: GLOBAL_WHOLESALE_PRICE, retailPrice: GLOBAL_RETAIL_PRICE, baselineCost: 2.77, status: "ativo", visible: true },
  { id: "prod-kmb007", ean: "7890528600072", item: "KMB007", flavor: "Imunidade", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Imunidade (Limão, Gengibre, Cúrcuma)", wholesalePrice: GLOBAL_WHOLESALE_PRICE, retailPrice: GLOBAL_RETAIL_PRICE, baselineCost: 2.63, status: "ativo", visible: true },
  { id: "prod-kmb008", ean: "7890528600447", item: "KMB008", flavor: "Rosas & Cardamomo", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Rosas & Cardamomo", wholesalePrice: GLOBAL_WHOLESALE_PRICE, retailPrice: GLOBAL_RETAIL_PRICE, baselineCost: 2.44, status: "ativo", visible: true },
  { id: "prod-kmb009", ean: "7890528600812", item: "KMB009", flavor: "Lavanda & Limão", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Lavanda & Limão", wholesalePrice: GLOBAL_WHOLESALE_PRICE, retailPrice: GLOBAL_RETAIL_PRICE, baselineCost: 0, status: "planejado", visible: false },
  { id: "prod-kmb010", ean: "7890528601222", item: "KMB010", flavor: "Manga & Jasmim", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Manga & Jasmim", wholesalePrice: GLOBAL_WHOLESALE_PRICE, retailPrice: GLOBAL_RETAIL_PRICE, baselineCost: 0, status: "planejado", visible: false },
  { id: "prod-kmb011", ean: "7890528601420", item: "KMB011", flavor: "Goiaba", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Goiaba", wholesalePrice: GLOBAL_WHOLESALE_PRICE, retailPrice: GLOBAL_RETAIL_PRICE, baselineCost: 0, status: "planejado", visible: false },
  { id: "prod-kmb012", ean: "7890528601314", item: "KMB012", flavor: "Uva", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Uva", wholesalePrice: GLOBAL_WHOLESALE_PRICE, retailPrice: GLOBAL_RETAIL_PRICE, baselineCost: 0, status: "planejado", visible: false },
];

const COST_INGREDIENT_SEED = [
  { id: "ing-strawberry", name: "Morango", category: "fruta", packageGram: 250, packageCost: 19, grams500: 20, grams300: 13.2 },
  { id: "ing-cranberry", name: "Oxicoco", category: "fruta", packageGram: 1010, packageCost: 81.67, grams500: 5, grams300: 3.3 },
  { id: "ing-blueberry", name: "Mirtilo", category: "fruta", packageGram: 1000, packageCost: 177, grams500: 3, grams300: 1.98 },
  { id: "ing-passion", name: "Maracujá", category: "fruta", packageGram: 1000, packageCost: 25, grams500: 40, grams300: 26.4 },
  { id: "ing-apple", name: "Maçã", category: "fruta", packageGram: 1000, packageCost: 20.25, grams500: 30, grams300: 19.8 },
  { id: "ing-pear", name: "Pêra", category: "fruta", packageGram: 1000, packageCost: 15.99, grams500: 30, grams300: 19.8 },
  { id: "ing-ginger", name: "Gengibre", category: "especiaria", packageGram: 1000, packageCost: 25.45, grams500: 10, grams300: 6.6 },
  { id: "ing-butterfly-pea", name: "Flor Borboleta Azul", category: "flor", packageGram: 100, packageCost: 110, grams500: 1.5, grams300: 0.99 },
  { id: "ing-lime", name: "Limão", category: "fruta", packageGram: 1000, packageCost: 8.99, grams500: 10, grams300: 6.6 },
  { id: "ing-cinnamon", name: "Canela", category: "especiaria", packageGram: 1, packageCost: 0, grams500: 8, grams300: 5.28 },
  { id: "ing-turmeric", name: "Cúrcuma", category: "especiaria", packageGram: 1, packageCost: 0, grams500: 4.5, grams300: 2.97 },
  { id: "ing-sugar", name: "Açúcar", category: "açúcar", packageGram: 1000, packageCost: 4.9, grams500: 45, grams300: 29.7 },
  { id: "ing-tea", name: "Chá", category: "chá", packageGram: 5000, packageCost: 478.69, grams500: 4, grams300: 2.64 },
  { id: "ing-rose", name: "Rosa", category: "flor", packageGram: 100, packageCost: 5, grams500: 3, grams300: 1.98 },
  { id: "ing-rosemary", name: "Alecrim", category: "erva", packageGram: 1000, packageCost: 149.9, grams500: 1, grams300: 0.66 },
  { id: "ing-cardamom", name: "Cardamomo", category: "especiaria", packageGram: 1, packageCost: 0, grams500: 0.5, grams300: 0.33 },
  { id: "ing-hibiscus", name: "Hibisco", category: "flor", packageGram: 100, packageCost: 5.99, grams500: 3, grams300: 1.98 },
  { id: "ing-star-anis", name: "Anis Estrelado", category: "especiaria", packageGram: 1, packageCost: 0, grams500: 0.2, grams300: 0.132 },
].map((item) => ({
  ...item,
  supplier: "Base de custos Kombú",
  purchaseUnit: "g",
  costPerUnit: item.packageGram ? Number((item.packageCost / item.packageGram).toFixed(6)) : 0,
  stock: 0,
  min: 0,
  expires: "",
  location: "",
  status: "ativo",
}));

const PACKAGING_SEED = [
  { id: "pkg-bottle-500", name: "Garrafa 500ml", type: "bottle", productId: "", supplier: "Base de custos Kombú", unit: "un", costEach: 0.84, stock: 0, min: 0, location: "" },
  { id: "pkg-bottle-300", name: "Garrafa 300ml", type: "bottle", productId: "", supplier: "Thoten Pac", unit: "un", costEach: 1.2, stock: 0, min: 0, location: "" },
  { id: "pkg-label-500", name: "Rótulo 500ml", type: "label", productId: "", supplier: "Base de custos Kombú", unit: "un", costEach: 0.85, stock: 0, min: 0, location: "" },
  { id: "pkg-datador", name: "Datador por garrafa", type: "material", productId: "", supplier: "Base de custos Kombú", unit: "un", costEach: 0, stock: 0, min: 0, location: "" },
];

const KOMBUCHA_BASE_INGREDIENTS = [
  { name: "Chá", category: "chá", usageQty: 4, usageUnit: "g" },
  { name: "Açúcar", category: "açúcar", usageQty: 45, usageUnit: "g" },
];

function labelPackagingIdForProduct(product) {
  return `pkg-label-${String(product?.item || product?.id || "produto").toLowerCase()}-${Number(product?.sizeMl || 500)}`;
}

function labelPackagingForProduct(product, costEach = 0.85) {
  return {
    id: labelPackagingIdForProduct(product),
    name: `Rótulo ${product.flavor} ${product.sizeMl}ml`,
    type: "label",
    productId: product.id,
    supplier: "Base de custos Kombú",
    unit: "un",
    costEach,
    stock: 0,
    min: 0,
    location: "",
  };
}

const PRODUCT_LABEL_PACKAGING_SEED = PRODUCT_CATALOG_SEED.map((product) => labelPackagingForProduct(product));

const RECIPE_BLUEPRINTS = [
  { productId: "prod-kmb001", flavor: "Maracujá", ingredients: [["ing-tea", 4], ["ing-sugar", 45], ["ing-passion", 40]] },
  { productId: "prod-kmb002", flavor: "Frutas Vermelhas", ingredients: [["ing-tea", 4], ["ing-sugar", 45], ["ing-strawberry", 20], ["ing-cranberry", 5], ["ing-blueberry", 3]] },
  { productId: "prod-kmb003", flavor: "Hibisco com Anis Estrelado", ingredients: [["ing-tea", 4], ["ing-sugar", 45], ["ing-hibiscus", 3], ["ing-star-anis", 0.2]] },
  { productId: "prod-kmb004", flavor: "Mirtilo c/Flor Borboleta Azul", ingredients: [["ing-tea", 4], ["ing-sugar", 45], ["ing-blueberry", 3], ["ing-butterfly-pea", 1.5]] },
  { productId: "prod-kmb005", flavor: "Maçã c/Canela", ingredients: [["ing-tea", 4], ["ing-sugar", 45], ["ing-apple", 30], ["ing-cinnamon", 8]] },
  { productId: "prod-kmb006", flavor: "Pêra c/Alecrim", ingredients: [["ing-tea", 4], ["ing-sugar", 45], ["ing-pear", 30], ["ing-rosemary", 1]] },
  { productId: "prod-kmb007", flavor: "Imunidade", ingredients: [["ing-tea", 4], ["ing-sugar", 45], ["ing-lime", 10], ["ing-ginger", 10], ["ing-turmeric", 4.5]] },
  { productId: "prod-kmb008", flavor: "Rosas & Cardamomo", ingredients: [["ing-tea", 4], ["ing-sugar", 45], ["ing-rose", 3], ["ing-cardamom", 0.5]] },
];

const RECIPE_SEED = RECIPE_BLUEPRINTS.map((recipe) => {
  const product = PRODUCT_CATALOG_SEED.find((item) => item.id === recipe.productId);
  return {
    id: `rec-${product.item.toLowerCase()}-500`,
    productId: product.id,
    flavor: recipe.flavor,
    version: "base 500ml",
    status: "ativa",
    bottleMl: 500,
    yieldBottles: 1,
    wastePct: 0,
    labor: 0,
    utilities: 0,
    other: 0,
    wholesalePrice: product.wholesalePrice,
    retailPrice: product.retailPrice,
    ingredients: recipe.ingredients.map(([ingredientId, qty]) => ({ ingredientId, qty, unit: "g" })),
    packaging: [
      { itemId: "pkg-bottle-500", qty: 1 },
      { itemId: labelPackagingIdForProduct(product), qty: 1 },
    ],
  };
});

const CMS_FLAVOR_SEED = [
  {
    slug: "maracuja",
    imageKey: "maracuja",
    name: "Maracujá",
    profile: "Frutados",
    order: 1,
    visible: true,
    recommended: FLAVOR_IMAGE_RECOMMENDED,
    imageUrl:
      "https://static.wixstatic.com/media/716adf_5b0b2489ee914e53b15b4a590915d974~mv2.png/v1/crop/x_6,y_0,w_1068,h_1920/fill/w_760,h_1367,al_c,q_92,usm_0.66_1.00_0.01,enc_auto/4_edited.png",
    ingredients: "Maracujá, chá fermentado",
    angle: "Tropical, ácida na medida e refrescante.",
    description: "Uma kombucha tropical, refrescante e com acidez equilibrada.",
  },
  {
    slug: "frutas-vermelhas",
    imageKey: "frutasVermelhas",
    name: "Frutas Vermelhas",
    profile: "Frutados",
    order: 2,
    visible: true,
    recommended: FLAVOR_IMAGE_RECOMMENDED,
    imageUrl:
      "https://static.wixstatic.com/media/716adf_5c8cd66d9eb842a0940b212d250fd255~mv2.png/v1/fill/w_760,h_1368,al_c,q_92,usm_0.66_1.00_0.01,enc_auto/IMG_2897_PNG.png",
    ingredients: "Morango, mirtilo, oxicoco",
    angle: "Frutada, levemente ácida e vibrante.",
    description: "Mistura morango, mirtilo e oxicoco em um perfil frutado e levemente ácido.",
  },
  {
    slug: "hibisco-anis-estrelado",
    imageKey: "hibisco",
    name: "Hibisco & Anis Estrelado",
    profile: "Florais",
    order: 3,
    visible: true,
    recommended: FLAVOR_IMAGE_RECOMMENDED,
    imageUrl: "assets/menu-bottles/hibisco-anis.png",
    ingredients: "Hibisco, anis estrelado, chá fermentado",
    angle: "Floral, ácido e especiado.",
    description: "Combina a intensidade do hibisco com o aroma do anis estrelado.",
  },
  {
    slug: "flor-fada-azul-blueberry",
    imageKey: "mirtilo",
    name: "Flor Fada Azul & Blueberry",
    profile: "Florais",
    order: 4,
    visible: true,
    recommended: FLAVOR_IMAGE_RECOMMENDED,
    imageUrl:
      "https://static.wixstatic.com/media/716adf_8da298261b9a4acd8e9e2264491cee1d~mv2.png/v1/fill/w_760,h_1368,al_c,q_92,usm_0.66_1.00_0.01,enc_auto/7.png",
    ingredients: "Flor fada azul, blueberry, chá fermentado",
    angle: "Delicada, floral e frutada.",
    description: "Uma combinação delicada de flor fada azul e blueberry.",
  },
  {
    slug: "maca-canela",
    imageKey: "macaCanela",
    name: "Maçã & Canela",
    profile: "Especiados",
    order: 5,
    visible: true,
    recommended: FLAVOR_IMAGE_RECOMMENDED,
    imageUrl:
      "https://static.wixstatic.com/media/716adf_673e38f87b0e41bd9972f7b8a5fda104~mv2.png/v1/fill/w_760,h_1013,al_c,q_92,usm_0.66_1.00_0.01,enc_auto/IMG_6619_edited.png",
    ingredients: "Maçã, canela, chá fermentado",
    angle: "Aromática, frutada e especiada.",
    description: "Combina maçã e canela em um sabor aromático e acolhedor.",
  },
  {
    slug: "pera-alecrim",
    imageKey: "peraAlecrim",
    name: "Pêra & Alecrim",
    profile: "Herbais",
    order: 6,
    visible: true,
    recommended: FLAVOR_IMAGE_RECOMMENDED,
    imageUrl:
      "https://static.wixstatic.com/media/716adf_2b695c9743c344a2a91acf67ed69ff5f~mv2.png/v1/fill/w_760,h_1368,al_c,q_92,usm_0.66_1.00_0.01,enc_auto/6_edited_edited.png",
    ingredients: "Pêra, alecrim, chá verde",
    angle: "Leve, frutada e herbal.",
    description: "Une o frescor da pêra ao aroma herbal do alecrim.",
  },
  {
    slug: "imunidade",
    imageKey: "imunidade",
    name: "Imunidade",
    profile: "Cítricos",
    order: 7,
    visible: true,
    recommended: FLAVOR_IMAGE_RECOMMENDED,
    imageUrl:
      "https://static.wixstatic.com/media/716adf_c9ac20cf991c4796b8be299c33e22abc~mv2.png/v1/crop/x_62,y_0,w_931,h_1920/fill/w_760,h_1565,al_c,q_92,usm_0.66_1.00_0.01,enc_auto/2.png",
    ingredients: "Limão, gengibre, cúrcuma",
    angle: "Cítrica, intensa e especiada.",
    description: "Feita com limão, gengibre e cúrcuma, com perfil cítrico e marcante.",
  },
  {
    slug: "rosas-cardamomo",
    imageKey: "rosasCardamomo",
    name: "Rosas & Cardamomo",
    profile: "Florais",
    order: 8,
    visible: true,
    recommended: FLAVOR_IMAGE_RECOMMENDED,
    imageUrl:
      "https://static.wixstatic.com/media/716adf_4d2ae2c8e77d48ea8aa11ceffef05be4~mv2.png/v1/fill/w_760,h_1368,al_c,q_92,usm_0.66_1.00_0.01,enc_auto/3_edited.png",
    ingredients: "Rosas, cardamomo, chá verde",
    angle: "Floral, aromática e especiada.",
    description: "Uma combinação floral e aromática, com o toque especiado do cardamomo.",
  },
  {
    slug: "lavanda-limao",
    imageKey: "lavandaLimao",
    name: "Lavanda & Limão",
    profile: "Cítricos",
    order: 9,
    visible: true,
    recommended: FLAVOR_IMAGE_RECOMMENDED,
    imageUrl: "assets/menu-bottles/lavanda-limao.png",
    ingredients: "Lavanda, limão, chá fermentado",
    angle: "Cítrico, floral e refrescante.",
    description: "Cítrico, floral e refrescante, com lavanda e limão.",
  },
  {
    slug: "jasmim-manga",
    imageKey: "jasmimManga",
    name: "Jasmim & Manga",
    profile: "Frutados",
    order: 10,
    visible: true,
    recommended: FLAVOR_IMAGE_RECOMMENDED,
    imageUrl: "assets/menu-bottles/jasmim-manga.png",
    ingredients: "Jasmim, manga, chá fermentado",
    angle: "Tropical, floral e vibrante.",
    description: "Combina manga e jasmim em um sabor tropical com toque floral.",
  },
  {
    slug: "goiaba",
    imageKey: "goiaba",
    name: "Goiaba",
    profile: "Frutados",
    order: 11,
    visible: true,
    recommended: FLAVOR_IMAGE_RECOMMENDED,
    imageUrl: "assets/menu-bottles/goiaba.png",
    ingredients: "Goiaba, chá fermentado",
    angle: "Frutada, suave e refrescante.",
    description: "Uma kombucha frutada, suave e refrescante, com sabor de goiaba em destaque.",
  },
  {
    slug: "uva",
    imageKey: "uva",
    name: "Uva",
    profile: "Frutados",
    order: 12,
    visible: true,
    recommended: FLAVOR_IMAGE_RECOMMENDED,
    imageUrl: "assets/menu-bottles/uva.png",
    ingredients: "Uva, chá fermentado",
    angle: "Encorpada e levemente adocicada.",
    description: "Uma kombucha frutada, encorpada e levemente adocicada.",
  },
];

const defaultState = {
  products: PRODUCT_CATALOG_SEED,
  ingredients: COST_INGREDIENT_SEED,
  packaging: [...PACKAGING_SEED, ...PRODUCT_LABEL_PACKAGING_SEED],
  suppliers: [],
  partners: [],
  recipes: RECIPE_SEED,
  batches: [],
  sales: [],
  orders: [],
  leads: [],
  purchases: [],
  expenses: [],
  cms: {
    headline: "Kombucha artesanal da Amazônia.",
    subheadline: "Feita em Manaus, com fermentação natural, gaseificação natural e sabores criados com frutas, especiarias e flores comestíveis.",
    whatsapp: "(92) 99209-7165",
    announcement: "",
    officialMapUrl: "https://www.google.com/maps/d/viewer?mid=1Zn4OECfeuJkhDkCj6noQKZDeLgOUbn8",
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
    flavors: CMS_FLAVOR_SEED,
  },
  costSources: [
    {
      id: "cost-sheet-2026-06-30",
      name: "Base de custos dos prints",
      labelCost500: 0.85,
      bottleCost500: 0.84,
      retailPrice500: GLOBAL_RETAIL_PRICE,
      wholesalePrice500: GLOBAL_WHOLESALE_PRICE,
    },
  ],
  notifications: {
    adminEmail: ADMIN_NOTIFICATION_EMAIL,
    provider: "resend",
  },
  settings: {
    globalRetailPrice: GLOBAL_RETAIL_PRICE,
    globalWholesalePrice: GLOBAL_WHOLESALE_PRICE,
    priceVersion: GLOBAL_PRICE_VERSION,
  },
  audit: [],
};

let state = loadState();
let currentModule = "dashboard";
let globalSearch = "";
let activeRecipeId = state.recipes[0]?.id || "";
let currentRole = "Owner / Admin";
let currentStockView = "kombuchas";
let currentLocale = localStorage.getItem(LOCALE_KEY) || "pt";
let currentSalesPeriod = "month";
let currentDashboardOrderView = "summary";
let salesCustomStart = "";
let salesCustomEnd = "";
let cloudSyncReady = false;
let cloudSyncEnabled = false;
let cloudSyncConfigured = false;
let cloudSyncLastError = "";
let cloudSaveTimer = null;
let lastCloudSaveAt = "";
let cloudStateUpdatedAt = "";

function runStartupIntegrations() {
  try {
    (state.purchases || []).forEach((purchase) => {
      try {
        syncPurchaseExpense(purchase);
      } catch (error) {
        console.error("Falha ao sincronizar compra no boot do admin", error);
      }
    });
    (state.orders || []).forEach((order) => {
      try {
        syncOrderIntegrations(order);
      } catch (error) {
        console.error("Falha ao sincronizar pedido no boot do admin", error);
      }
    });
    reconcileOrderReservations();
    saveState();
  } catch (error) {
    console.error("Falha ao preparar estado inicial do admin", error);
  }
}

runStartupIntegrations();

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

function isLocalPreview() {
  return ["localhost", "127.0.0.1", ""].includes(window.location.hostname);
}

function stripSensitiveUrlParams() {
  const url = new URL(window.location.href);
  const sensitive = ["password", "adminPassword", "senha"];
  const hadSensitiveParam = sensitive.some((key) => url.searchParams.has(key));
  if (!hadSensitiveParam) return;
  sensitive.forEach((key) => url.searchParams.delete(key));
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, document.title, nextUrl || url.pathname);
}

async function authenticateAdmin(password) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (response.ok) return { ok: true, backend: true };
    if (response.status === 401) return { ok: false, backend: true };
    if (!isLocalPreview()) return { ok: false, backend: true, error: "backend_unavailable" };
  } catch {
    // Local static previews do not serve Vercel API routes.
    if (!isLocalPreview()) return { ok: false, backend: true, error: "backend_unavailable" };
  }
  return { ok: isLocalPreview() && Boolean(password), backend: false };
}

async function startAuthenticatedSession() {
  unlockAdmin();
  try {
    render();
    const result = await syncFromCloud();
    if (result === "unauthorized" && !isLocalPreview()) {
      sessionStorage.removeItem("kombuAdminAuthenticated");
      lockAdmin();
      const loginError = document.querySelector("#loginError");
      if (loginError) {
        loginError.textContent = "Sessão expirada ou API de login indisponível. Entre novamente.";
        loginError.classList.remove("hidden");
      }
      return;
    }
    render();
  } catch (error) {
    console.error("Falha ao abrir painel admin", error);
    unlockAdmin();
    const content = document.querySelector("#adminContent");
    if (content) {
      content.innerHTML = `
        ${cloudSyncNotice()}
        <div class="notice notice-danger">
          <span class="material-symbols-outlined" aria-hidden="true">error</span>
          <div>
            <strong>O login foi aceito, mas o painel encontrou um erro ao carregar.</strong>
            <p>Recarregue a página. Se persistir, envie o erro do console para corrigirmos o módulo específico sem bloquear o acesso.</p>
          </div>
        </div>
      `;
    }
  }
}

async function logoutAdmin() {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
  } catch {
    // Static preview fallback.
  }
  lockAdmin();
}

async function restoreServerSession() {
  try {
    const response = await fetch("/api/auth/session", { credentials: "same-origin" });
    if (!response.ok) return false;
    const payload = await readJsonSafe(response);
    if (payload.role) currentRole = payload.role;
    sessionStorage.setItem("kombuAdminAuthenticated", "true");
    return true;
  } catch {
    return false;
  }
}

function bindAuth() {
  const loginForm = document.querySelector("#loginForm");
  const passwordInput = document.querySelector("#adminPassword");
  const loginError = document.querySelector("#loginError");
  const togglePassword = document.querySelector("#togglePassword");
  if (!loginForm || !passwordInput) return;
  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginError?.classList.add("hidden");
    try {
      const auth = await authenticateAdmin(passwordInput.value);
      if (auth.ok) {
        sessionStorage.setItem("kombuAdminAuthenticated", "true");
        await startAuthenticatedSession();
        passwordInput.value = "";
        return;
      }
      if (auth.error === "backend_unavailable") {
        loginError.textContent = "API de login indisponível. Confira o deploy/variáveis da Vercel.";
      } else {
        loginError.textContent = "Senha incorreta.";
      }
      loginError?.classList.remove("hidden");
      passwordInput.select();
    } catch (error) {
      console.error("Falha no login admin", error);
      if (loginError) {
        loginError.textContent = "Não consegui concluir o login. Recarregue a página e tente novamente.";
        loginError.classList.remove("hidden");
      }
      passwordInput.focus();
    }
  });
  togglePassword?.addEventListener("click", (event) => {
    event.preventDefault();
    const selectionStart = passwordInput.selectionStart;
    const selectionEnd = passwordInput.selectionEnd;
    const shouldShow = passwordInput.type === "password";
    passwordInput.type = shouldShow ? "text" : "password";
    togglePassword.setAttribute("aria-label", shouldShow ? "Ocultar senha" : "Mostrar senha");
    togglePassword.setAttribute("aria-pressed", shouldShow ? "true" : "false");
    const icon = togglePassword.querySelector(".material-symbols-outlined");
    if (icon) icon.textContent = shouldShow ? "visibility_off" : "visibility";
    passwordInput.focus({ preventScroll: true });
    if (selectionStart != null && selectionEnd != null) passwordInput.setSelectionRange(selectionStart, selectionEnd);
  });
  document.querySelector("#logoutButton")?.addEventListener("click", logoutAdmin);
}

const brl = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));

const number = (value, digits = 0) =>
  new Intl.NumberFormat("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number(value || 0));

function inputNumber(value, digits = 6) {
  if (value === "" || value == null) return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "";
  return Number(parsed.toFixed(digits)).toString();
}

function setInputNumber(input, value, digits = 6) {
  if (!input) return;
  input.value = Number(value || 0) > 0 ? inputNumber(value, digits) : "";
}

const pct = (value) => `${number(value, 1)}%`;
const id = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
const todayIso = () => new Date().toISOString().slice(0, 10);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function addDaysIso(dateIso, days) {
  const date = new Date(`${dateIso || todayIso()}T00:00:00`);
  date.setDate(date.getDate() + Number(days || 0));
  return date.toISOString().slice(0, 10);
}

function addMonthsIso(dateIso, months) {
  const date = new Date(`${dateIso || todayIso()}T00:00:00`);
  date.setMonth(date.getMonth() + Number(months || 0));
  return date.toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function inferPackagingType(item = {}) {
  const name = String(item.name || "").toLowerCase();
  if (item.type) return item.type;
  if (name.includes("rótulo") || name.includes("rotulo") || name.includes("label")) return "label";
  if (name.includes("garrafa") || name.includes("tampa") || name.includes("frasco")) return "bottle";
  return "material";
}

function normalizeCmsFlavors(savedFlavors = []) {
  const savedBySlug = new Map((Array.isArray(savedFlavors) ? savedFlavors : []).map((flavor) => [flavor.slug, flavor]));
  const normalized = CMS_FLAVOR_SEED.map((seed) => {
    const saved = savedBySlug.get(seed.slug) || {};
    savedBySlug.delete(seed.slug);
    return {
      ...seed,
      ...saved,
      order: Number.isFinite(Number(saved.order)) ? Number(saved.order) : seed.order,
      visible: saved.visible === false ? false : true,
      recommended: saved.recommended || seed.recommended,
    };
  });
  return [...normalized, ...savedBySlug.values()];
}

function ensureCorePackagingInventory(data) {
  PACKAGING_SEED.forEach((seed) => {
    if (!data.packaging.some((item) => item.id === seed.id)) data.packaging.push(clone(seed));
  });
}

function ensureProductLabelInventory(data) {
  const labelCostBySize = (sizeMl) => Number(data.packaging.find((item) => item.id === `pkg-label-${sizeMl}`)?.costEach || 0);
  if (!data.packaging.some((item) => item.id === "pkg-datador")) {
    data.packaging.push({ id: "pkg-datador", name: "Datador por garrafa", type: "material", productId: "", supplier: "Base de custos Kombú", unit: "un", costEach: 0, stock: 0, min: 0, location: "" });
  }
  data.products.forEach((product) => {
    const labelId = labelPackagingIdForProduct(product);
    if (!data.packaging.some((item) => item.id === labelId)) data.packaging.push(labelPackagingForProduct(product, labelCostBySize(Number(product.sizeMl || BASE_BOTTLE_SIZE_ML))));
  });
  data.recipes.forEach((recipe) => {
    const product = data.products.find((item) => item.id === recipe.productId);
    if (!product) return;
    const labelId = labelPackagingIdForProduct(product);
    const packaging = Array.isArray(recipe.packaging) ? recipe.packaging : [];
    const genericIndex = packaging.findIndex((line) => line.itemId === "pkg-label-500");
    if (genericIndex >= 0) {
      packaging[genericIndex] = { ...packaging[genericIndex], itemId: labelId };
    } else if (!packaging.some((line) => line.itemId === labelId)) {
      packaging.push({ itemId: labelId, qty: 1 });
    }
    if (!packaging.some((line) => line.itemId === "pkg-datador")) {
      packaging.push({ itemId: "pkg-datador", qty: 1 });
    }
    recipe.packaging = packaging;
  });
}

function proportionalRecipeQuantity(value) {
  return Number((Number(value || 0) * SMALL_BOTTLE_RECIPE_RATIO).toFixed(6));
}

function ensure300MlProductVariants(data) {
  const baseProducts = data.products.filter((product) => Number(product.sizeMl || BASE_BOTTLE_SIZE_ML) === BASE_BOTTLE_SIZE_ML);
  baseProducts.forEach((product) => {
    const existing = data.products.find((candidate) =>
      Number(candidate.sizeMl) === SMALL_BOTTLE_SIZE_ML && normalizeText(candidate.flavor) === normalizeText(product.flavor),
    );
    if (existing) return;
    data.products.push({
      ...clone(product),
      id: `${product.id}-300`,
      ean: "",
      item: `${product.item}-300`,
      sizeMl: SMALL_BOTTLE_SIZE_ML,
      description: String(product.description || "").replace(/500\s*ml/gi, "300ml"),
      baselineCost: 0,
      visible: false,
      sourceProductId: product.id,
    });
  });
}

function ensure300MlRecipeVariants(data) {
  const sourceRecipes = data.recipes.filter((recipe) => Number(recipe.bottleMl || BASE_BOTTLE_SIZE_ML) === BASE_BOTTLE_SIZE_ML);
  sourceRecipes.forEach((recipe) => {
    const sourceProduct = data.products.find((product) => product.id === recipe.productId);
    if (!sourceProduct) return;
    const targetProduct = data.products.find((product) =>
      Number(product.sizeMl) === SMALL_BOTTLE_SIZE_ML && normalizeText(product.flavor) === normalizeText(sourceProduct.flavor),
    );
    if (!targetProduct) return;
    const existing = data.recipes.find((candidate) =>
      candidate.productId === targetProduct.id && Number(candidate.bottleMl) === SMALL_BOTTLE_SIZE_ML,
    );
    if (existing) return;
    const targetLabelId = labelPackagingIdForProduct(targetProduct);
    const packaging = (Array.isArray(recipe.packaging) ? recipe.packaging : []).map((line) => {
      const sourceMaterial = data.packaging.find((item) => item.id === line.itemId);
      if (line.itemId === "pkg-bottle-500" || (sourceMaterial?.type === "bottle" && Number(sourceMaterial?.productId ? sourceProduct.sizeMl : BASE_BOTTLE_SIZE_ML) === BASE_BOTTLE_SIZE_ML)) {
        return { ...line, itemId: "pkg-bottle-300" };
      }
      if (sourceMaterial?.type === "label") return { ...line, itemId: targetLabelId };
      return { ...line };
    });
    if (!packaging.some((line) => line.itemId === "pkg-bottle-300")) packaging.unshift({ itemId: "pkg-bottle-300", qty: 1 });
    if (!packaging.some((line) => line.itemId === targetLabelId)) packaging.push({ itemId: targetLabelId, qty: 1 });
    data.recipes.push({
      ...clone(recipe),
      id: `${recipe.id}-300`,
      productId: targetProduct.id,
      flavor: targetProduct.flavor,
      version: /500\s*ml/i.test(String(recipe.version || ""))
        ? String(recipe.version).replace(/500\s*ml/gi, "300ml")
        : `${String(recipe.version || "base").trim()} 300ml`,
      bottleMl: SMALL_BOTTLE_SIZE_ML,
      ingredients: (Array.isArray(recipe.ingredients) ? recipe.ingredients : []).map((line) => ({
        ...line,
        qty: proportionalRecipeQuantity(line.qty),
      })),
      packaging,
    });
  });
}

function normalizeState(savedState) {
  const base = clone(defaultState);
  const saved = savedState || {};
  const merged = { ...base, ...saved };
  merged.cms = {
    ...base.cms,
    ...(saved.cms || {}),
    images: saved.cms?.images?.length ? saved.cms.images : base.cms.images,
    flavors: normalizeCmsFlavors(saved.cms?.flavors || base.cms.flavors),
  };
  merged.notifications = { ...base.notifications, ...(saved.notifications || {}) };
  merged.settings = { ...base.settings, ...(saved.settings || {}) };
  ["products", "ingredients", "packaging", "suppliers", "partners", "recipes", "batches", "sales", "orders", "leads", "purchases", "expenses", "costSources", "audit"].forEach((key) => {
    merged[key] = Array.isArray(saved[key]) ? saved[key] : base[key];
  });
  merged.orders = merged.orders.map((order, orderIndex) => {
    const deliveries = Array.isArray(order.deliveries) ? order.deliveries : [];
    const deliveredByItem = deliveries.flatMap((delivery) => delivery.items || []).reduce((totals, item) => {
      const key = item.orderItemKey || "";
      if (key) totals[key] = Number(totals[key] || 0) + Number(item.qty || 0);
      return totals;
    }, {});
    return {
      ...order,
      deliveries,
      items: orderItems(order).map((item, itemIndex) => {
        const key = item.key || `oi-${order.id || orderIndex}-${itemIndex}`;
        return {
          ...item,
          key,
          deliveredQty: Math.max(Number(item.deliveredQty || 0), Number(deliveredByItem[key] || 0)),
        };
      }),
    };
  });
  merged.packaging = merged.packaging.map((item) => ({ ...item, type: inferPackagingType(item), productId: item.productId || "" }));
  ensureCorePackagingInventory(merged);
  ensure300MlProductVariants(merged);
  ensureProductLabelInventory(merged);
  ensure300MlRecipeVariants(merged);
  if (merged.settings.priceVersion !== GLOBAL_PRICE_VERSION) {
    merged.products.forEach((product) => {
      product.retailPrice = GLOBAL_RETAIL_PRICE;
      product.wholesalePrice = GLOBAL_WHOLESALE_PRICE;
    });
    merged.recipes.forEach((recipe) => {
      recipe.retailPrice = GLOBAL_RETAIL_PRICE;
      recipe.wholesalePrice = GLOBAL_WHOLESALE_PRICE;
    });
    merged.costSources.forEach((source) => {
      source.retailPrice500 = GLOBAL_RETAIL_PRICE;
      source.wholesalePrice500 = GLOBAL_WHOLESALE_PRICE;
    });
    merged.settings.globalRetailPrice = GLOBAL_RETAIL_PRICE;
    merged.settings.globalWholesalePrice = GLOBAL_WHOLESALE_PRICE;
    merged.settings.priceVersion = GLOBAL_PRICE_VERSION;
  }
  return merged;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return normalizeState(saved ? JSON.parse(saved) : null);
  } catch (error) {
    console.error("Falha ao carregar estado local do admin; usando base inicial.", error);
    return clone(defaultState);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Falha ao salvar estado local do admin.", error);
  }
  if (!cloudSyncReady) cloudSyncEnabled = false;
  scheduleCloudSave();
}

async function pushStateToCloud() {
  if (!cloudSyncReady || !isAuthenticated()) return;
  try {
    const response = await fetch("/api/state", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state, updatedAt: cloudStateUpdatedAt }),
    });
    if (response.ok || response.status === 202) {
      const payload = await readJsonSafe(response);
      cloudSyncEnabled = true;
      cloudSyncConfigured = true;
      cloudSyncLastError = "";
      cloudStateUpdatedAt = payload.updatedAt || cloudStateUpdatedAt;
      lastCloudSaveAt = cloudStateUpdatedAt || new Date().toISOString();
    } else if (response.status === 401) {
      cloudSyncEnabled = false;
      cloudSyncLastError = "Sessão expirada. Entre novamente para salvar na nuvem.";
    } else if (response.status === 409) {
      const payload = await readJsonSafe(response);
      cloudSyncEnabled = false;
      cloudSyncConfigured = true;
      cloudSyncLastError = "Existem alterações mais recentes na nuvem. Recarregue o painel antes de continuar para não apagar dados de outro dispositivo.";
      cloudStateUpdatedAt = payload.updatedAt || cloudStateUpdatedAt;
    } else {
      const payload = await readJsonSafe(response);
      cloudSyncEnabled = false;
      cloudSyncConfigured = payload.configured === true;
      cloudSyncLastError = syncErrorMessage(payload, "A API não aceitou o salvamento na nuvem.");
    }
  } catch {
    cloudSyncEnabled = false;
    cloudSyncLastError = "Não foi possível conectar ao backend de sincronização.";
  }
}

function scheduleCloudSave() {
  if (!cloudSyncReady || !isAuthenticated()) return;
  window.clearTimeout(cloudSaveTimer);
  cloudSaveTimer = window.setTimeout(pushStateToCloud, 800);
}

async function readJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function syncErrorMessage(payload = {}, fallback = "API de sincronização indisponível.") {
  if (payload.hint) return payload.hint;
  if (payload.error === "missing_supabase_env" || payload.reason === "missing_supabase_env") {
    return "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY ainda não estão configurados na Vercel.";
  }
  if (payload.error === "supabase_schema_missing") {
    return "Supabase conectado, mas falta criar a tabela app_state. Rode supabase/schema.sql no SQL Editor do Supabase.";
  }
  if (payload.error === "supabase_credentials_invalid") {
    return "A chave do Supabase parece incorreta. Use a service_role secret key, não a anon/public key.";
  }
  if (payload.error === "supabase_connection_failed") {
    return "Não foi possível conectar ao Supabase. Confira se SUPABASE_URL é a Project URL correta.";
  }
  if (payload.error === "supabase_request_failed") {
    return "Supabase respondeu erro. Confira a URL, a service_role key e se o schema SQL foi executado.";
  }
  return fallback;
}

async function syncFromCloud() {
  try {
    const response = await fetch("/api/state", { credentials: "same-origin" });
    if (response.status === 401) {
      cloudSyncReady = false;
      cloudSyncEnabled = false;
      cloudSyncLastError = "Sessão expirada.";
      return "unauthorized";
    }
    if (!response.ok) {
      const payload = await readJsonSafe(response);
      cloudSyncReady = false;
      cloudSyncEnabled = false;
      cloudSyncConfigured = payload.configured === true;
      cloudSyncLastError = syncErrorMessage(payload, "API de sincronização indisponível.");
      return false;
    }
    const payload = await readJsonSafe(response);
    if (payload.configured === false) {
      cloudSyncReady = false;
      cloudSyncEnabled = false;
      cloudSyncConfigured = false;
      cloudSyncLastError = syncErrorMessage(payload, "Supabase ainda não está configurado na Vercel.");
      return false;
    }
    cloudSyncReady = true;
    cloudSyncEnabled = true;
    cloudSyncConfigured = true;
    cloudSyncLastError = "";
    cloudStateUpdatedAt = payload.updatedAt || "";
    if (payload.exists && payload.state) {
      state = normalizeState(payload.state);
      runStartupIntegrations();
      activeRecipeId = state.recipes.find((recipe) => recipe.id === activeRecipeId)?.id || state.recipes[0]?.id || "";
      saveState();
    } else {
      await pushStateToCloud();
    }
    return true;
  } catch {
    cloudSyncReady = false;
    cloudSyncEnabled = false;
    cloudSyncLastError = "Não foi possível conectar ao backend de sincronização.";
    return false;
  }
}

function addAudit(action, detail = "") {
  state.audit.unshift({ at: new Date().toISOString(), user: currentRole, action, detail });
  state.audit = state.audit.slice(0, 80);
  saveState();
}

function canWrite(module = currentModule) {
  if (currentRole === "Viewer") return false;
  if (currentRole === "Produção") return ["dashboard", "products", "ingredients", "recipes", "costs", "batches", "stock", "packaging", "orders"].includes(module);
  if (currentRole === "Financeiro") return ["dashboard", "products", "purchases", "suppliers", "costs", "expenses", "reports", "orders"].includes(module);
  if (currentRole === "Vendas") return ["dashboard", "products", "sales", "orders", "leads", "partners", "cms", "reports"].includes(module);
  return true;
}

function byId(collection, itemId) {
  return state[collection].find((item) => item.id === itemId);
}

function productForRecipe(recipe) {
  return byId("products", recipe?.productId);
}

function recipeForProduct(product) {
  if (!product) return null;
  return (
    state.recipes.find((recipe) => recipe.productId === product.id) ||
    state.recipes.find((recipe) => recipe.flavor === product.flavor && Number(recipe.bottleMl) === Number(product.sizeMl))
  );
}

function productForBatch(batch) {
  return byId("products", batch?.productId) || productForRecipe(byId("recipes", batch?.recipeId));
}

function ingredientForPurchase(purchase) {
  return byId("ingredients", purchase?.ingredientId) || state.ingredients.find((item) => normalizeText(item.name) === normalizeText(purchase?.item));
}

function purchaseStockKey(collection, itemId) {
  return `${collection}:${itemId}`;
}

function parsePurchaseStockKey(value = "") {
  const [collection, itemId] = String(value).split(":");
  return { collection, itemId };
}

function stockItemFromKey(value = "") {
  const { collection, itemId } = parsePurchaseStockKey(value);
  if (collection === "ingredients") return { collection, item: byId("ingredients", itemId) };
  if (collection === "packaging") return { collection, item: byId("packaging", itemId) };
  return { collection, item: null };
}

function stockItemForPurchase(purchase) {
  if (!purchase) return null;
  if (purchase.stockCollection && purchase.stockItemId) {
    const target = stockItemFromKey(purchaseStockKey(purchase.stockCollection, purchase.stockItemId));
    if (target.item) return target;
  }
  if (purchase.packagingId) {
    const material = byId("packaging", purchase.packagingId);
    if (material) return { collection: "packaging", item: material };
  }
  const ingredient = ingredientForPurchase(purchase);
  if (ingredient) return { collection: "ingredients", item: ingredient };
  const material = state.packaging.find((item) => normalizeText(item.name) === normalizeText(purchase.item));
  if (material) return { collection: "packaging", item: material };
  return null;
}

function stockUnitFor(collection, item, fallback = "g") {
  if (collection === "packaging") return item?.unit || fallback || "un";
  return item?.purchaseUnit || fallback || "g";
}

function stockCollectionItems(collection) {
  if (collection === "packaging") return state.packaging;
  return state.ingredients;
}

function stockItemByName(collection, name = "") {
  const normalized = normalizeText(name);
  if (!normalized) return null;
  return stockCollectionItems(collection).find((item) => normalizeText(item.name) === normalized) || null;
}

function purchaseStockOptions(selected = "", { includeNew = true } = {}) {
  const ingredients = state.ingredients
    .map((item) => `<option value="${purchaseStockKey("ingredients", item.id)}" ${selected === purchaseStockKey("ingredients", item.id) ? "selected" : ""}>${escapeHtml(item.name)} (${escapeHtml(item.purchaseUnit || "g")})</option>`)
    .join("");
  const materials = state.packaging
    .map((item) => `<option value="${purchaseStockKey("packaging", item.id)}" ${selected === purchaseStockKey("packaging", item.id) ? "selected" : ""}>${escapeHtml(item.name)} (${escapeHtml(item.unit || "un")})</option>`)
    .join("");
  const newOptions = includeNew
    ? `<optgroup label="Novo item">
        <option value="new:ingredients" ${selected === "new:ingredients" ? "selected" : ""}>+ Novo ingrediente</option>
        <option value="new:packaging" ${selected === "new:packaging" ? "selected" : ""}>+ Novo material / outro item</option>
      </optgroup>`
    : "";
  return `
    <optgroup label="Ingredientes">${ingredients}</optgroup>
    <optgroup label="Embalagens, rótulos e materiais">${materials}</optgroup>
    ${newOptions}
  `;
}

function productLabel(product) {
  if (!product) return "Produto não vinculado";
  return `${product.item} - ${product.flavor} ${product.sizeMl}ml`;
}

function recipeLabel(recipe) {
  const product = productForRecipe(recipe);
  return product ? `${product.item} - ${recipe.flavor} ${recipe.version}` : `${recipe.flavor} ${recipe.version}`;
}

function productDisplayCost(product) {
  const recipe = recipeForProduct(product);
  return recipe ? recipeCost(recipe).costPerBottle : Number(product?.baselineCost || 0);
}

function productIsOperational(product) {
  return product?.visible !== false && normalizeText(product?.status || "ativo") === "ativo";
}

function productWholesalePrice(product) {
  return Number(product?.wholesalePrice || 0);
}

function productRetailPrice(product) {
  return Number(product?.retailPrice || 0);
}

function orderClientTypeLabel(value) {
  return ORDER_CLIENT_TYPES.find((type) => type.value === value)?.label || "Novo cliente";
}

function orderClientDisplayName(order = {}) {
  const customer = String(order.customerName || "").trim();
  const business = String(order.businessName || "").trim();
  if (customer && business && normalizeText(customer) !== normalizeText(business)) return `${customer} (${business})`;
  return customer || business || "Cliente sem nome";
}

function partnerOptionLabel(partner = {}) {
  return [partner.name, partner.neighborhood || partner.city, partner.whatsapp].filter(Boolean).join(" - ");
}

function selectedPartnerForOrder(order = {}) {
  if (order.partnerId) {
    const partner = byId("partners", order.partnerId);
    if (partner) return partner;
  }
  const business = normalizeText(order.businessName || order.customerName || "");
  const whatsapp = normalizeText(order.whatsapp || "");
  return (
    state.partners.find((partner) => whatsapp && normalizeText(partner.whatsapp || "") === whatsapp) ||
    state.partners.find((partner) => business && normalizeText(partner.name || "") === business) ||
    null
  );
}

function priceForOrderClientType(product, clientType) {
  const type = ORDER_CLIENT_TYPES.find((item) => item.value === clientType) || ORDER_CLIENT_TYPES[0];
  if (type.price === "wholesale") return productWholesalePrice(product) || state.settings.globalWholesalePrice || GLOBAL_WHOLESALE_PRICE;
  if (type.price === "recurringRetail") return RECURRING_RETAIL_PRICE;
  return productRetailPrice(product) || productWholesalePrice(product) || 0;
}

function commonProductPrice(field, fallback = 0) {
  const counts = state.products.reduce((acc, product) => {
    const price = Number(product[field] || 0);
    if (!price) return acc;
    const key = price.toFixed(2);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const common = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  return Number(common || fallback || 0);
}

const unitFactor = { g: 1, kg: 1000, ml: 1, l: 1000, L: 1000, un: 1 };
const unitFamily = { g: "mass", kg: "mass", ml: "volume", l: "volume", L: "volume", un: "unit" };

function convertedAmount(qty, fromUnit, toUnit) {
  if (fromUnit === toUnit) return Number(qty || 0);
  if (unitFamily[fromUnit] !== unitFamily[toUnit]) return Number(qty || 0);
  return (Number(qty || 0) * unitFactor[fromUnit]) / unitFactor[toUnit];
}

function purchaseQuantityInStockUnit({ packageCount, packageSize, packageUnit }, stockUnit) {
  const count = Number(packageCount || 0);
  const size = Number(packageSize || 0) || (stockUnit === "un" && count ? 1 : 0);
  const unit = packageUnit || stockUnit || "g";
  const rawTotal = count * size;
  return convertedAmount(rawTotal, unit, stockUnit);
}

function ingredientPackageCost(data = {}, stockUnit = "g") {
  const packageSize = Number(data.packageSize || 0);
  const packageCount = Number(data.packageCount || (packageSize ? 1 : 0));
  const packageUnit = data.packageUnit || stockUnit || "g";
  const total = Number(data.packageTotal ?? data.purchaseTotal ?? data.total ?? 0);
  const qty = purchaseQuantityInStockUnit({ packageCount, packageSize, packageUnit }, stockUnit);
  const hasPurchaseQty = qty > 0;
  const hasPurchaseCost = hasPurchaseQty && total > 0;
  return {
    packageCount,
    packageSize,
    packageUnit,
    total,
    qty,
    hasPurchaseQty,
    hasPurchaseCost,
    costPerUnit: hasPurchaseCost ? total / qty : 0,
  };
}

function applyIngredientPackageCost(ingredient, data = {}, { usePackageQtyAsStock = false } = {}) {
  if (!ingredient) return ingredient;
  const stockUnit = data.purchaseUnit || ingredient.purchaseUnit || "g";
  const calc = ingredientPackageCost(data, stockUnit);
  const manualCostWasProvided = String(data.costPerUnit ?? "").trim() !== "";
  const nextCost = calc.hasPurchaseCost ? calc.costPerUnit : Number(data.costPerUnit || 0);
  if (calc.hasPurchaseCost || manualCostWasProvided) {
    ingredient.costPerUnit = Number(nextCost || 0);
    ingredient.needsCost = Number(nextCost || 0) <= 0;
    ingredient.status = Number(nextCost || 0) > 0 ? "ativo" : "custo pendente";
  }
  if (String(data.stock ?? "").trim() !== "") {
    ingredient.stock = Number(data.stock || 0);
  } else if (usePackageQtyAsStock && calc.hasPurchaseQty) {
    ingredient.stock = calc.qty;
  }
  if (calc.hasPurchaseQty || calc.hasPurchaseCost) {
    ingredient.packageCount = calc.packageCount || "";
    ingredient.packageSize = calc.packageSize || "";
    ingredient.packageUnit = calc.packageUnit || stockUnit;
    ingredient.packageTotal = calc.total || "";
  }
  return ingredient;
}

function nextBatchCode(recipe, dateIso) {
  const product = productForRecipe(recipe);
  const base = product?.item || recipe?.flavor || "KMB";
  const compactDate = String(dateIso || todayIso()).slice(2).replaceAll("-", "");
  const prefix = `${base}-${compactDate}`.toUpperCase().replace(/[^A-Z0-9-]/g, "");
  const existing = state.batches.filter((batch) => String(batch.code || "").startsWith(prefix)).length;
  return existing ? `${prefix}-${existing + 1}` : prefix;
}

function batchDatePlan(dateIso) {
  return {
    idealSellBy: addMonthsIso(dateIso, 1),
    sellBy: addMonthsIso(dateIso, 2),
    expiry: addMonthsIso(dateIso, 4),
  };
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

function batchUsage(recipe, bottles) {
  const multiplier = Number(bottles || 0) / Math.max(Number(recipe?.yieldBottles || 1), 1);
  const ingredients = (recipe?.ingredients || []).map((line) => {
    const ingredient = byId("ingredients", line.ingredientId);
    const qty = convertedAmount(Number(line.qty || 0) * multiplier, line.unit, ingredient?.purchaseUnit || line.unit);
    return { ingredient, qty };
  });
  const packaging = (recipe?.packaging || []).map((line) => {
    const item = byId("packaging", line.itemId);
    return { item, qty: Number(line.qty || 0) * Number(bottles || 0) };
  });
  return { ingredients, packaging };
}

function applyBatchInventory(recipe, bottles, direction) {
  const usage = batchUsage(recipe, bottles);
  usage.ingredients.forEach(({ ingredient, qty }) => {
    if (!ingredient) return;
    ingredient.stock = Number((Number(ingredient.stock || 0) + Number(direction || 0) * qty).toFixed(6));
  });
  usage.packaging.forEach(({ item, qty }) => {
    if (!item) return;
    item.stock = Number((Number(item.stock || 0) + Number(direction || 0) * qty).toFixed(6));
  });
}

function adjustBatchInventoryTo(batch, nextActual) {
  const recipe = byId("recipes", batch?.recipeId);
  if (!recipe) return { ok: false, message: "Este lote não tem receita vinculada para recalcular insumos." };
  const previousInventoryQty = batch.inventoryAdjusted ? Number(batch.inventoryQty || batch.actual || 0) : 0;
  const nextInventoryQty = shouldConsumeBatch({ ...batch, actual: nextActual }) ? Number(nextActual || 0) : 0;
  const delta = nextInventoryQty - previousInventoryQty;
  if (delta > 0) applyBatchInventory(recipe, delta, -1);
  if (delta < 0) applyBatchInventory(recipe, Math.abs(delta), 1);
  batch.inventoryAdjusted = nextInventoryQty > 0;
  batch.inventoryQty = nextInventoryQty;
  return { ok: true, delta };
}

function shouldConsumeBatch(batch) {
  return Number(batch?.actual || 0) > 0 && !["planejado", "bloqueado", "descartado"].includes(batch?.status);
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
  const ingredientCost = (recipe.ingredients || []).reduce((sum, line) => sum + ingredientLineCost(line), 0);
  const packagingCost = (recipe.packaging || []).reduce((sum, line) => sum + packagingLineCost(line, recipe.yieldBottles), 0);
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
    .map((batch) => {
      const sold = soldFromBatch(batch.code);
      const reserved = reservedFromBatch(batch.code);
      return {
        ...batch,
        product: productForBatch(batch),
        sold,
        reserved,
        stock: Math.max(0, Number(batch.actual || 0) - sold - reserved),
        cost: batchCost(batch),
      };
    });
}

function totals() {
  const salesRevenue = state.sales.reduce((sum, sale) => sum + saleRevenue(sale), 0);
  const cogs = state.sales.reduce((sum, sale) => {
    const batch = state.batches.find((item) => item.code === sale.batchCode);
    return sum + Number(sale.qty || 0) * (batch ? batchCost(batch).batchCostPerBottle : 0);
  }, 0);
  const expenses = state.expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const finishedStock = finishedStockRows().reduce((sum, row) => sum + row.stock, 0);
  const produced = state.batches.reduce((sum, batch) => sum + Number(batch.actual || 0), 0);
  const sold = state.sales.reduce((sum, sale) => sum + Number(sale.qty || 0), 0);
  const openOrders = (state.orders || []).filter(isOpenOrder);
  const openOrderValue = openOrders.reduce((sum, order) => sum + orderTotal(order), 0);
  const openOrderQty = openOrders.reduce((sum, order) => sum + orderQuantity(order), 0);
  const receivable = (state.orders || []).reduce((sum, order) => sum + orderReceivableValue(order), 0);
  const productionMissing = orderProductionRows().reduce((sum, row) => sum + row.missing, 0);
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
    openOrderValue,
    openOrderQty,
    receivable,
    productionMissing,
    purchasesTotal: state.purchases.reduce((sum, purchase) => sum + Number(purchase.total || 0), 0),
    avgCost: state.recipes.reduce((sum, recipe) => sum + recipeCost(recipe).costPerBottle, 0) / Math.max(1, state.recipes.length),
  };
}

function saleRevenue(sale) {
  if (sale.movementType && sale.movementType !== "venda") return 0;
  return Number(sale.qty || 0) * Number(sale.unitPrice || 0) - Number(sale.discount || 0);
}

function salesPeriodRange() {
  const today = todayIso();
  if (currentSalesPeriod === "day") return { start: today, end: today };
  if (currentSalesPeriod === "week") {
    const date = new Date(`${today}T12:00:00`);
    const mondayOffset = (date.getDay() + 6) % 7;
    return { start: addDaysIso(today, -mondayOffset), end: addDaysIso(today, 6 - mondayOffset) };
  }
  if (currentSalesPeriod === "custom") {
    return { start: salesCustomStart || "", end: salesCustomEnd || "" };
  }
  return { start: `${today.slice(0, 7)}-01`, end: addDaysIso(addMonthsIso(`${today.slice(0, 7)}-01`, 1), -1) };
}

function saleDateInRange(date, range) {
  const value = String(date || "").slice(0, 10);
  if (!value) return false;
  if (range.start && value < range.start) return false;
  if (range.end && value > range.end) return false;
  return true;
}

function salesPeriodLabel(range) {
  if (!range.start && !range.end) return "Todo o histórico";
  if (range.start === range.end) return range.start ? `Em ${shortDate(range.start)}` : "Todo o histórico";
  if (range.start && range.end) return `${shortDate(range.start)} a ${shortDate(range.end)}`;
  if (range.start) return `Desde ${shortDate(range.start)}`;
  return `Até ${shortDate(range.end)}`;
}

function customerStats() {
  const rows = new Map();
  const register = ({ name, qty, revenue, date }) => {
    const key = (name || "Cliente sem nome").trim();
    const current = rows.get(key) || { name: key, orders: 0, qty: 0, revenue: 0, dates: [] };
    current.orders += 1;
    current.qty += Number(qty || 0);
    current.revenue += Number(revenue || 0);
    if (date) current.dates.push(date);
    rows.set(key, current);
  };
  state.sales
    .filter((sale) => !sale.movementType || sale.movementType === "venda")
    .forEach((sale) => register({ name: sale.customerName || sale.partner, qty: sale.qty, revenue: saleRevenue(sale), date: sale.date }));
  (state.orders || [])
    .filter((order) => !state.sales.some((sale) => sale.orderId === order.id) && order.status !== "cancelado")
    .forEach((order) => register({ name: order.customerName || order.businessName, qty: orderQuantity(order), revenue: orderTotal(order), date: order.deliveredAt || order.orderDate }));
  return [...rows.values()]
    .map((row) => {
      const dates = [...new Set(row.dates)].sort();
      const intervals = dates.slice(1).map((date, index) => (new Date(`${date}T00:00:00`) - new Date(`${dates[index]}T00:00:00`)) / 86400000);
      const avgInterval = intervals.length ? intervals.reduce((sum, days) => sum + days, 0) / intervals.length : 0;
      const nextOrder = avgInterval && dates.length ? addDaysIso(dates.at(-1), Math.round(avgInterval)) : "";
      return { ...row, lastOrder: dates.at(-1) || "", avgInterval, nextOrder };
    })
    .sort((a, b) => b.revenue - a.revenue || b.qty - a.qty);
}

function orderItems(order) {
  return Array.isArray(order?.items) ? order.items : [];
}

function orderQuantity(order) {
  return orderItems(order).reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

function orderDeliveries(order = {}) {
  return Array.isArray(order.deliveries) ? order.deliveries : [];
}

function orderItemDeliveredQty(item = {}) {
  return Math.max(0, Math.min(Number(item.qty || 0), Number(item.deliveredQty || 0)));
}

function orderItemOutstandingQty(item = {}) {
  return Math.max(0, Number(item.qty || 0) - orderItemDeliveredQty(item));
}

function orderDeliveredQuantity(order) {
  return orderItems(order).reduce((sum, item) => sum + orderItemDeliveredQty(item), 0);
}

function orderOutstandingQuantity(order) {
  return orderItems(order).reduce((sum, item) => sum + orderItemOutstandingQty(item), 0);
}

function orderTotal(order) {
  return orderItems(order).reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.unitPrice || 0), 0);
}

function isOpenOrder(order) {
  return !["entregue", "cancelado"].includes(order?.status);
}

function orderReservationTimestamp(order = {}) {
  const createdAt = Date.parse(String(order.createdAt || ""));
  if (Number.isFinite(createdAt)) return createdAt;
  const orderDate = Date.parse(String(order.orderDate || ""));
  return Number.isFinite(orderDate) ? orderDate : Number.MAX_SAFE_INTEGER;
}

function compareOrdersByReservationPriority(a = {}, b = {}) {
  const timestampDifference = orderReservationTimestamp(a) - orderReservationTimestamp(b);
  if (timestampDifference) return timestampDifference;
  const orderDateDifference = String(a.orderDate || "").localeCompare(String(b.orderDate || ""));
  if (orderDateDifference) return orderDateDifference;
  const codeDifference = String(a.code || "").localeCompare(String(b.code || ""));
  if (codeDifference) return codeDifference;
  return String(a.id || "").localeCompare(String(b.id || ""));
}

function openOrdersByReservationPriority() {
  return (state.orders || []).filter(isOpenOrder).sort(compareOrdersByReservationPriority);
}

function orderItemAllocations(item = {}) {
  const clean = (Array.isArray(item.allocations) ? item.allocations : [])
    .map((allocation) => ({
      batchCode: String(allocation.batchCode || "").trim(),
      qty: Number(allocation.qty || 0),
      date: allocation.date || "",
      manual: allocation.manual === true,
      note: allocation.note || "",
    }))
    .filter((allocation) => allocation.batchCode && allocation.qty > 0);
  if (clean.length) return clean;
  const legacyCode = String(item.batchCode || "").trim();
  const legacyQty = Math.max(Number(item.reservedQty || 0), Number(item.producedQty || 0));
  if (legacyCode && !legacyCode.includes(",") && legacyQty > 0) {
    return [{ batchCode: legacyCode, qty: legacyQty, date: item.readyDate || "", manual: false, note: "" }];
  }
  return [];
}

function orderItemReservedQty(item = {}) {
  const allocated = orderItemAllocations(item).reduce((sum, allocation) => sum + Number(allocation.qty || 0), 0);
  const legacy = Math.max(Number(item.reservedQty || 0), Number(item.producedQty || 0));
  const total = Math.max(allocated, legacy);
  const qty = orderItemOutstandingQty(item);
  return Math.min(qty, total);
}

function orderItemAutomaticReservationLimit(item = {}) {
  const ordered = orderItemOutstandingQty(item);
  const overrideQty = Number(item.reservationOverride?.reservedNow ?? item.reservationOverride?.targetQty);
  if (Number.isFinite(overrideQty)) return Math.max(0, Math.min(ordered, overrideQty));
  if (item.reservationTarget === "" || item.reservationTarget == null) return ordered;
  const target = Number(item.reservationTarget);
  if (!Number.isFinite(target)) return ordered;
  return Math.max(0, Math.min(ordered, target));
}

function trimItemAllocationsTo(item, targetQty) {
  const target = Math.max(0, Number(targetQty || 0));
  const allocations = orderItemAllocations(item).map((allocation) => ({ ...allocation }));
  let excess = Math.max(0, allocations.reduce((sum, allocation) => sum + Number(allocation.qty || 0), 0) - target);
  const reductionOrder = allocations
    .map((allocation, index) => ({ allocation, index }))
    .sort((a, b) => Number(a.allocation.manual) - Number(b.allocation.manual) || b.index - a.index);
  reductionOrder.forEach(({ allocation }) => {
    if (!excess) return;
    const reduction = Math.min(excess, Number(allocation.qty || 0));
    allocation.qty = Number(allocation.qty || 0) - reduction;
    excess -= reduction;
  });
  const remaining = allocations.filter((allocation) => Number(allocation.qty || 0) > 0);
  const reserved = remaining.reduce((sum, allocation) => sum + Number(allocation.qty || 0), 0);
  item.allocations = remaining;
  item.batchCode = remaining.map((allocation) => allocation.batchCode).join(", ");
  item.reservedQty = reserved;
  item.producedQty = reserved;
  return reserved;
}

function orderItemBatchCodes(item = {}) {
  return [...new Set(orderItemAllocations(item).map((allocation) => allocation.batchCode).filter(Boolean))];
}

function orderItemAllocationLabel(item = {}) {
  const allocations = orderItemAllocations(item);
  return allocations.length
    ? allocations.map((allocation) => `${number(allocation.qty)}x ${escapeHtml(allocation.batchCode)}`).join(" | ")
    : "Ainda sem lote reservado";
}

function orderItemSelectionKey(order, index) {
  return `${order.id}::${index}`;
}

function findOrderItemBySelection(value = "") {
  const [orderId, indexRaw] = String(value).split("::");
  const order = byId("orders", orderId);
  const index = Number(indexRaw);
  const item = orderItems(order)[index];
  return { order, item, index };
}

function nextOrderCode(dateIso = todayIso()) {
  const compactDate = String(dateIso || todayIso()).slice(2).replaceAll("-", "");
  const prefix = `PED-${compactDate}`;
  const existing = (state.orders || []).filter((order) => String(order.code || "").startsWith(prefix)).length;
  return `${prefix}-${String(existing + 1).padStart(2, "0")}`;
}

function orderProductText(item) {
  const product = byId("products", item.productId);
  return product ? productLabel(product) : item.productName || item.flavor || "Produto não informado";
}

function orderFlavorText(item) {
  const product = byId("products", item.productId);
  const flavor = item.flavor || product?.flavor || item.productName || product?.title || "Kombucha";
  const sizeMl = Number(item.sizeMl || product?.sizeMl || 0);
  if (!sizeMl || new RegExp(`${sizeMl}\\s*ml`, "i").test(flavor)) return flavor;
  return `${flavor} ${sizeMl}ml`;
}

function orderStatusBadge(status) {
  const current = ORDER_STATUSES.includes(status) ? status : "recebido";
  return `<span class="status ${statusClass(current, "general")}">${current}</span>`;
}

function shortDate(dateIso) {
  const value = String(dateIso || "").slice(0, 10);
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}` : value;
}

function daysUntil(dateIso) {
  if (!dateIso) return null;
  return Math.ceil((new Date(`${dateIso}T00:00:00`) - new Date(`${todayIso()}T00:00:00`)) / 86400000);
}

function orderDateNote(order) {
  const days = daysUntil(order.estimatedReadyDate);
  if (days == null) return "Sem previsão";
  if (days < 0) return `${Math.abs(days)} dia(s) em atraso`;
  if (days === 0) return "Pronto hoje";
  return `${days} dia(s) restantes`;
}

function orderPaymentDueDate(order) {
  if (order?.paymentDueDate) return order.paymentDueDate;
  if (order?.deliveredAt) return addDaysIso(order.deliveredAt, 15);
  return "";
}

function orderReceivableStatus(order) {
  if (order?.status === "cancelado") return "cancelado";
  if (order?.paymentStatus === "pago") return "pago";
  if (order?.status !== "entregue") return "em produção";
  const due = orderPaymentDueDate(order);
  if (due && daysUntil(due) < 0) return "atrasado";
  return order.paymentStatus || "aguardando pagamento";
}

function orderReceivableValue(order) {
  return order?.status === "entregue" && orderReceivableStatus(order) !== "pago" ? orderTotal(order) : 0;
}

function orderItemRemainingQty(item = {}) {
  return Math.max(0, orderItemOutstandingQty(item) - orderItemReservedQty(item));
}

function orderItemAutomaticReservationNeed(item = {}) {
  return Math.max(0, orderItemAutomaticReservationLimit(item) - orderItemReservedQty(item));
}

function reservedFromBatch(code) {
  return (state.orders || [])
    .filter(isOpenOrder)
    .flatMap((order) => orderItems(order))
    .reduce((sum, item) => {
      return sum + orderItemAllocations(item)
        .filter((allocation) => allocation.batchCode === code)
        .reduce((allocationSum, allocation) => allocationSum + Number(allocation.qty || 0), 0);
    }, 0);
}

function batchReservationRows(code) {
  return (state.orders || [])
    .filter(isOpenOrder)
    .flatMap((order) =>
      orderItems(order).flatMap((item) =>
        orderItemAllocations(item)
          .filter((allocation) => allocation.batchCode === code)
          .map((allocation) => ({ order, item, allocation, qty: Number(allocation.qty || 0), manual: allocation.manual === true })),
      ),
    )
    .filter((row) => row.qty > 0);
}

function batchReservationText(code) {
  const rows = batchReservationRows(code);
  if (!rows.length) return "-";
  return rows
    .map((row) => {
      const client = orderClientDisplayName(row.order);
      return `${number(row.qty)}x ${escapeHtml(client)}`;
    })
    .join("<br>");
}

function batchSaleRows(code) {
  return (state.sales || [])
    .filter((sale) => sale.batchCode === code && Number(sale.qty || 0) !== 0)
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
    .map((sale) => {
      const qty = Number(sale.qty || 0);
      const movement = qty < 0 ? "devolução" : sale.movementType || "venda";
      return {
        sale,
        qty,
        movement,
        customer: sale.customerName || sale.partner || sale.orderCode || "Destino não informado",
      };
    });
}

function batchAvailableStock(code) {
  return finishedStockRows().find((row) => row.code === code)?.stock || 0;
}

function batchMatchesOrderItem(batch, item = {}) {
  if (!batch || !item) return false;
  const recipe = byId("recipes", batch.recipeId);
  const productId = batch.productId || recipe?.productId || "";
  if (productId && item.productId === productId) return true;
  return normalizeText(item.flavor || item.productName) === normalizeText(batch.flavor);
}

function reservationOptionsForBatch(batch) {
  if (!batch) return [];
  return openOrdersByReservationPriority()
    .flatMap((order) =>
      orderItems(order)
        .map((item, index) => ({ order, item, index, need: orderItemRemainingQty(item) }))
        .filter((row) => row.need > 0 && batchMatchesOrderItem(batch, row.item)),
    );
}

function refreshOrderReservationStatus(order) {
  if (!order) return;
  const items = orderItems(order);
  let anyReserved = false;
  let allReserved = items.length > 0;
  items.forEach((item) => {
    const reserved = orderItemReservedQty(item);
    const qty = orderItemOutstandingQty(item);
    const allocations = orderItemAllocations(item);
    const batchCodes = orderItemBatchCodes(item);
    item.allocations = allocations;
    item.reservedQty = qty ? Math.min(qty, reserved) : 0;
    item.producedQty = item.reservedQty;
    item.batchCode = batchCodes.join(", ");
    item.readyDate = allocations.at(-1)?.date || item.readyDate || "";
    item.productionStatus = qty <= 0 ? "entregue" : item.reservedQty >= qty ? "reservado" : item.reservedQty > 0 ? "em produção" : "pendente";
    anyReserved = anyReserved || item.reservedQty > 0;
    allReserved = allReserved && (qty <= 0 || item.reservedQty >= qty);
  });
  if (items.length && items.every((item) => orderItemOutstandingQty(item) <= 0)) {
    order.status = "entregue";
    return;
  }
  if (!isOpenOrder(order)) return;
  if (allReserved) order.status = "pronto";
  else if (anyReserved) order.status = "em produção";
  else if (!["recebido", "confirmado"].includes(order.status)) order.status = "confirmado";
}

function reserveBatchForOrderItem(batchCode, order, item, qty, note = "", manual = true) {
  const amount = Number(qty || 0);
  if (!order || !item || amount <= 0) return 0;
  const allocations = orderItemAllocations(item);
  const existing = allocations.find((allocation) => allocation.batchCode === batchCode && allocation.manual === manual && normalizeText(allocation.note) === normalizeText(note));
  if (existing) existing.qty = Number(existing.qty || 0) + amount;
  else allocations.push({ batchCode, qty: amount, date: todayIso(), manual, note });
  item.allocations = allocations;
  refreshOrderReservationStatus(order);
  return amount;
}

function orderProductionRows() {
  const rows = new Map();
  (state.orders || [])
    .filter((order) => !["entregue", "cancelado"].includes(order.status))
    .forEach((order) => {
      orderItems(order).forEach((item) => {
        const key = item.productId || item.flavor || item.productName;
        const current = rows.get(key) || {
          productId: item.productId,
          flavor: item.flavor || orderProductText(item),
          ordered: 0,
          reserved: 0,
          produced: 0,
          missing: 0,
          nextDue: "",
          orders: [],
          clients: [],
        };
        const ordered = orderItemOutstandingQty(item);
        const reserved = orderItemReservedQty(item);
        const missing = orderItemRemainingQty(item);
        current.ordered += ordered;
        current.reserved += reserved;
        current.produced += reserved;
        current.missing += missing;
        const due = item.readyDate || order.estimatedReadyDate || order.neededBy || "";
        if (due && (!current.nextDue || due < current.nextDue)) current.nextDue = due;
        current.orders.push(order.code);
        current.clients.push({
          name: orderClientDisplayName(order),
          ordered,
          reserved,
          missing,
          due,
        });
        rows.set(key, current);
      });
    });
  return [...rows.values()].sort((a, b) => b.missing - a.missing || String(a.nextDue).localeCompare(String(b.nextDue)));
}

function productionClientRows(row) {
  const grouped = new Map();
  (row.clients || []).forEach((client) => {
    const key = normalizeText(client.name);
    const current = grouped.get(key) || { name: client.name, ordered: 0, reserved: 0, missing: 0, due: "" };
    current.ordered += Number(client.ordered || 0);
    current.reserved += Number(client.reserved || 0);
    current.missing += Number(client.missing || 0);
    if (client.due && (!current.due || client.due < current.due)) current.due = client.due;
    grouped.set(key, current);
  });
  return [...grouped.values()].sort((a, b) => b.missing - a.missing || a.name.localeCompare(b.name));
}

function renderProductionClientList(row, limit = 4) {
  const clients = productionClientRows(row);
  if (!clients.length) return "";
  const visible = clients.slice(0, limit);
  const extra = clients.length - visible.length;
  return `
    <div class="production-client-list" aria-label="Clientes deste sabor">
      ${visible
        .map(
          (client) => `
            <span class="production-client-pill">
              <strong>${escapeHtml(client.name)}</strong>
              <small>${number(client.reserved)}/${number(client.ordered)} reservado${client.missing ? ` | ${number(client.missing)} falta` : ""}</small>
            </span>
          `,
        )
        .join("")}
      ${extra > 0 ? `<span class="production-client-pill is-more"><strong>+${extra}</strong><small>cliente(s)</small></span>` : ""}
    </div>
  `;
}

function orderReadyRows() {
  return (state.orders || [])
    .filter(isOpenOrder)
    .map((order) => {
      const items = orderItems(order)
        .map((item) => {
          const qty = orderItemOutstandingQty(item);
          const ready = orderItemReservedQty(item);
          return {
            product: orderFlavorText(item),
            qty,
            originalQty: Number(item.qty || 0),
            delivered: orderItemDeliveredQty(item),
            ready,
            missing: Math.max(0, qty - ready),
          };
        })
        .filter((item) => item.qty > 0);
      const qty = items.reduce((sum, item) => sum + item.qty, 0);
      const ready = items.reduce((sum, item) => sum + item.ready, 0);
      const missing = Math.max(0, qty - ready);
      const delivered = orderDeliveredQuantity(order);
      return {
        order,
        partner: selectedPartnerForOrder(order),
        client: orderClientDisplayName(order),
        date: order.orderDate || order.createdAt?.slice(0, 10) || "",
        due: order.neededBy || order.estimatedReadyDate || "",
        qty,
        originalQty: orderQuantity(order),
        delivered,
        ready,
        missing,
        percent: qty ? Math.min(100, (ready / qty) * 100) : 0,
        items,
      };
    })
    .filter((row) => row.qty > 0)
    .sort((a, b) => {
      const status = (row) => (row.ready >= row.qty ? 0 : row.ready > 0 ? 1 : 2);
      return status(a) - status(b) || String(a.due || "9999-99-99").localeCompare(String(b.due || "9999-99-99")) || a.client.localeCompare(b.client);
    });
}

function orderReadyCard(row, view = "summary") {
  const status = row.ready >= row.qty ? "completo" : row.ready > 0 ? "parcial" : "aguardando";
  const readyItems = row.items.filter((item) => item.ready > 0);
  const missingItems = row.items.filter((item) => item.missing > 0);
  const selectedItems = row.missing > 0 || view === "missing" ? missingItems : readyItems;
  const visibleItems = row.missing > 0 || view === "missing" ? selectedItems : selectedItems.slice(0, 4);
  const extra = selectedItems.length - visibleItems.length;
  const itemListLabel = row.missing > 0 ? "Sabores que faltam" : "Sabores separados";
  return `
    <article class="order-ready-card is-${status}" data-order-ready-card="${row.order.id}">
      <div class="order-ready-head">
        <div>
          <strong>${escapeHtml(row.client)}</strong>
          <small>${row.date ? `Pedido ${escapeHtml(shortDate(row.date))}` : "Pedido aberto"}${row.due ? ` | precisa ${escapeHtml(shortDate(row.due))}` : ""}</small>
        </div>
        <span>${status}</span>
      </div>
      <div class="order-ready-total">
        <strong>${number(row.ready)}/${number(row.qty)}</strong>
        <span>${row.missing ? `${number(row.missing)} faltando` : "pronto para entregar"}</span>
      </div>
      ${row.delivered ? `<p class="order-ready-delivered">${number(row.delivered)} já entregue(s) de ${number(row.originalQty)} no pedido</p>` : ""}
      <div class="order-ready-meter" aria-label="${number(row.ready)} de ${number(row.qty)} garrafas separadas">
        <i style="width:${row.percent}%"></i>
      </div>
      <div class="order-ready-items ${row.missing > 0 ? "is-missing" : "is-ready"}">
        <div class="order-ready-items-title">
          <strong>${itemListLabel}</strong>
          <span>${row.missing > 0 ? `${number(missingItems.length)} sabor(es)` : "pedido completo"}</span>
        </div>
        ${
          visibleItems.length
            ? visibleItems
                .map(
                  (item) => `
                    <div>
                      <strong>${escapeHtml(item.product)}</strong>
                      <span>${
                        row.missing > 0 || view === "missing"
                          ? `<b>${number(item.missing)} faltando</b> de ${number(item.qty)}`
                          : item.ready
                            ? `${number(item.ready)} pronta(s) de ${number(item.qty)}`
                            : `${number(item.missing)} faltando`
                      }</span>
                    </div>
                  `,
                )
                .join("")
            : `<p class="mini-empty">Sem itens neste pedido.</p>`
        }
        ${extra > 0 ? `<div class="order-ready-more">+${extra} sabor(es)</div>` : ""}
      </div>
      <div class="order-ready-actions">
        ${actionButton(`delivery-proof:${row.order.id}`, "PDF da entrega", "picture_as_pdf", "btn-primary")}
        ${actionButton(`adjust-order-reservation:${row.order.id}`, "Ajustar reserva", "tune", "btn-outline")}
        ${row.partner ? actionButton(`dashboard-edit-partner:${row.partner.id}`, "Editar parceiro", "edit", "btn-outline") : ""}
      </div>
    </article>
  `;
}

function dashboardReadyOrders() {
  const allRows = orderReadyRows();
  const rows = currentDashboardOrderView === "missing" ? allRows.filter((row) => row.missing > 0) : allRows;
  return `
    <section class="admin-card dashboard-ready-card">
      <div class="dashboard-card-head">
        <div>
          <h3>${tr("Pronto por cliente")}</h3>
          <span>${tr("Separado para entrega")}</span>
        </div>
        <div class="segmented dashboard-order-view" aria-label="Filtrar pedidos do dashboard">
          <button type="button" data-dashboard-order-view="summary" class="${currentDashboardOrderView === "summary" ? "is-active" : ""}">Resumo</button>
          <button type="button" data-dashboard-order-view="missing" class="${currentDashboardOrderView === "missing" ? "is-active" : ""}">Só faltantes</button>
        </div>
      </div>
      <div class="order-ready-grid">
        ${
          rows.length
            ? rows.slice(0, 6).map((row) => orderReadyCard(row, currentDashboardOrderView)).join("")
            : `<p class="empty-note">${currentDashboardOrderView === "missing" ? "Nenhuma garrafa faltando nos pedidos abertos." : "Nenhum pedido aberto com garrafas para separar."}</p>`
        }
      </div>
    </section>
  `;
}

function fullDate(dateIso) {
  if (!dateIso) return "-";
  const date = new Date(`${String(dateIso).slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? String(dateIso) : new Intl.DateTimeFormat("pt-BR").format(date);
}

function deliveryProofDefaultQty(item = {}) {
  return Math.max(0, Math.min(orderItemOutstandingQty(item), orderItemReservedQty(item)));
}

function deliveryProofPaymentMethod(order = {}) {
  const storedMethod = String(order.paymentMethod || "").trim();
  if (!storedMethod || normalizeText(storedMethod) === "a prazo") return DELIVERY_PROOF_DEFAULT_PAYMENT_METHOD;
  return storedMethod;
}

function deliveryProofPaymentOptions(selectedMethod) {
  const methods = [
    DELIVERY_PROOF_DEFAULT_PAYMENT_METHOD,
    ...PAYMENT_METHODS.filter((method) => method !== "A prazo" && method !== DELIVERY_PROOF_DEFAULT_PAYMENT_METHOD),
  ];
  if (selectedMethod && !methods.includes(selectedMethod)) methods.push(selectedMethod);
  return methods
    .map(
      (method) =>
        `<option value="${escapeHtml(method)}" ${selectedMethod === method ? "selected" : ""}>${escapeHtml(method)}</option>`,
    )
    .join("");
}

function deliveryProofHistory(order = {}) {
  const deliveries = orderDeliveries(order).slice().sort((a, b) => String(b.createdAt || b.deliveredAt || "").localeCompare(String(a.createdAt || a.deliveredAt || "")));
  if (!deliveries.length) return "";
  return `
    <details class="delivery-history">
      <summary>Entregas anteriores (${deliveries.length})</summary>
      <div class="delivery-history-list">
        ${deliveries
          .map(
            (delivery) => `
              <div class="delivery-history-row">
                <span><strong>Remessa ${number(delivery.number || 1)}</strong><small>${fullDate(delivery.deliveredAt)} | ${number(delivery.totalQty)} garrafa(s) | ${brl(delivery.total)}</small></span>
                <button class="btn btn-outline" type="button" data-action="delivery-proof-reprint:${order.id}:${delivery.id}">
                  <span class="material-symbols-outlined" aria-hidden="true">picture_as_pdf</span>Reemitir
                </button>
              </div>
            `,
          )
          .join("")}
      </div>
    </details>
  `;
}

function deliveryAllocationPlan(item = {}, quantity = 0) {
  let remaining = Math.max(0, Number(quantity || 0));
  const planned = [];
  orderItemAllocations(item).forEach((allocation) => {
    if (remaining <= 0) return;
    const qty = Math.min(remaining, Number(allocation.qty || 0));
    if (qty > 0) planned.push({ ...allocation, qty });
    remaining -= qty;
  });
  if (remaining > 0) throw new Error("A quantidade escolhida não está totalmente reservada em lotes.");
  return planned;
}

function buildOrderDelivery(order, form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const items = orderItems(order)
    .map((item, index) => {
      const ready = deliveryProofDefaultQty(item);
      const qty = Math.max(0, Math.min(ready, Number(data[`deliveredQty_${index}`] || 0)));
      if (!qty) return null;
      return {
        orderItemKey: item.key,
        productId: item.productId || "",
        flavor: orderFlavorText(item),
        qty,
        unitPrice: Number(item.unitPrice || 0),
        allocations: deliveryAllocationPlan(item, qty),
      };
    })
    .filter(Boolean);
  if (!items.length) throw new Error("Informe pelo menos uma garrafa nesta remessa.");
  const deliveryFee = Math.max(0, Number(data.deliveryFee || 0));
  const productsTotal = items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.unitPrice || 0), 0);
  return {
    id: id("delivery"),
    number: orderDeliveries(order).length + 1,
    deliveredAt: data.deliveryDate || todayIso(),
    createdAt: new Date().toISOString(),
    paymentMethod: data.paymentMethod || DELIVERY_PROOF_DEFAULT_PAYMENT_METHOD,
    paymentDueDate: addDaysIso(data.deliveryDate || todayIso(), 15),
    deliveryFee,
    notes: String(data.notes || "").trim(),
    items,
    totalQty: items.reduce((sum, item) => sum + Number(item.qty || 0), 0),
    productsTotal,
    total: productsTotal + deliveryFee,
  };
}

function consumeDeliveryReservation(item, deliveryItem) {
  let remaining = Number(deliveryItem.qty || 0);
  const allocations = orderItemAllocations(item).map((allocation) => ({ ...allocation }));
  deliveryItem.allocations.forEach((planned) => {
    for (const allocation of allocations) {
      if (remaining <= 0) break;
      if (allocation.batchCode !== planned.batchCode || Number(allocation.qty || 0) <= 0) continue;
      const reduction = Math.min(Number(planned.qty || 0), Number(allocation.qty || 0), remaining);
      allocation.qty -= reduction;
      remaining -= reduction;
      break;
    }
  });
  if (remaining > 0) throw new Error("A reserva mudou antes da confirmação. Abra a remessa novamente.");
  item.deliveredQty = orderItemDeliveredQty(item) + Number(deliveryItem.qty || 0);
  item.allocations = allocations.filter((allocation) => Number(allocation.qty || 0) > 0);
  item.reservationOverride = null;
  item.reservationTarget = null;
  item.batchCode = orderItemBatchCodes(item).join(", ");
  item.reservedQty = item.allocations.reduce((sum, allocation) => sum + Number(allocation.qty || 0), 0);
  item.producedQty = item.reservedQty;
}

function registerOrderDelivery(order, delivery) {
  delivery.items.forEach((deliveryItem) => {
    const item = orderItems(order).find((candidate) => candidate.key === deliveryItem.orderItemKey);
    if (!item) throw new Error(`Sabor da remessa não encontrado: ${deliveryItem.flavor}`);
    consumeDeliveryReservation(item, deliveryItem);
  });
  order.deliveries = [...orderDeliveries(order), delivery];
  order.firstDeliveryAt = order.firstDeliveryAt || delivery.deliveredAt;
  order.lastDeliveryAt = delivery.deliveredAt;
  order.paymentMethod = delivery.paymentMethod;
  order.deliveryFee = delivery.deliveryFee;
  order.deliveryNotes = delivery.notes;
  order.updatedAt = new Date().toISOString();
  refreshOrderReservationStatus(order);
  if (orderOutstandingQuantity(order) <= 0) {
    order.status = "entregue";
    order.deliveredAt = delivery.deliveredAt;
    order.paymentDueDate = delivery.paymentDueDate;
  } else {
    order.deliveredAt = "";
  }
  syncOrderIntegrations(order);
  reconcileOrderReservations();
  refreshOrderReservationStatus(order);
}

function deliveryProofForm(orderId) {
  const order = byId("orders", orderId);
  if (!order) {
    window.alert("Pedido não encontrado. Atualize a página e tente novamente.");
    return;
  }
  const items = orderItems(order).map((item, index) => ({ item, index })).filter(({ item }) => deliveryProofDefaultQty(item) > 0);
  const selectedPaymentMethod = deliveryProofPaymentMethod(order);
  openModal(
    "Comprovante de entrega - 2 vias",
    "Pedidos",
    `
      <form id="deliveryProofForm" data-order-id="${escapeHtml(order.id)}">
        <div class="result-card delivery-proof-customer">
          <small>Cliente</small>
          <strong>${escapeHtml(orderClientDisplayName(order))}</strong>
          <span>${number(orderDeliveredQuantity(order))} entregue(s) | ${number(orderOutstandingQuantity(order))} restante(s) de ${number(orderQuantity(order))}</span>
        </div>
        <div class="input-grid delivery-proof-meta">
          <label class="field"><span>Data da entrega</span><input name="deliveryDate" type="date" value="${escapeHtml(order.deliveredAt || todayIso())}" required></label>
          <label class="field delivery-proof-payment"><span>Forma de pagamento</span><select name="paymentMethod" class="admin-select">${deliveryProofPaymentOptions(selectedPaymentMethod)}</select><small>${escapeHtml(DELIVERY_PROOF_PAYMENT_NOTE)}</small></label>
          <label class="field"><span>Frete / entrega</span><input name="deliveryFee" type="number" min="0" step="0.01" value="${inputNumber(orderDeliveries(order).length ? 0 : order.deliveryFee || 0, 2)}" inputmode="decimal"></label>
        </div>
        ${items.length ? `<fieldset class="delivery-proof-items">
          <legend>Nova remessa</legend>
          <p>Inclua somente as garrafas que sairão agora. O que já foi entregue não aparece novamente.</p>
          ${items.map(
              ({ item, index }) => `
                <label class="delivery-proof-item">
                  <span><strong>${escapeHtml(orderFlavorText(item))}</strong><small>${number(orderItemDeliveredQty(item))} já entregue(s) | ${number(orderItemOutstandingQty(item))} restante(s)</small></span>
                  <input name="deliveredQty_${index}" type="number" min="0" max="${deliveryProofDefaultQty(item)}" step="1" value="${deliveryProofDefaultQty(item)}" inputmode="numeric" data-proof-qty data-unit-price="${Number(item.unitPrice || 0)}" required>
                </label>
              `,
            )
            .join("")}
        </fieldset>` : `<p class="empty-note">Nenhuma nova garrafa está reservada e pronta para outra remessa. As entregas anteriores continuam disponíveis abaixo.</p>`}
        <label class="field"><span>Observações no comprovante</span><textarea name="notes" placeholder="Condição da entrega, caixas, devoluções ou outra observação.">${escapeHtml(order.deliveryNotes || "")}</textarea></label>
        <div class="result-card delivery-proof-total" aria-live="polite">
          <small>Total desta entrega</small>
          <strong id="deliveryProofTotal">${brl(0)}</strong>
          <span id="deliveryProofQuantity">0 garrafa(s)</span>
        </div>
        ${items.length ? `<button class="btn btn-primary" type="submit">
          <span class="material-symbols-outlined" aria-hidden="true">picture_as_pdf</span>
          Registrar entrega e baixar PDF
        </button>` : ""}
        ${deliveryProofHistory(order)}
      </form>
    `,
  );
  const form = document.querySelector("#deliveryProofForm");
  const updateTotal = () => {
    const quantity = [...form.querySelectorAll("[data-proof-qty]")].reduce((sum, input) => sum + Number(input.value || 0), 0);
    const productsTotal = [...form.querySelectorAll("[data-proof-qty]")].reduce(
      (sum, input) => sum + Number(input.value || 0) * Number(input.dataset.unitPrice || 0),
      0,
    );
    const total = productsTotal + Number(form.elements.deliveryFee.value || 0);
    form.querySelector("#deliveryProofTotal").textContent = brl(total);
    form.querySelector("#deliveryProofQuantity").textContent = `${number(quantity)} garrafa(s)`;
  };
  form.addEventListener("input", updateTotal);
  updateTotal();
  if (!items.length) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selectedQuantity = [...form.querySelectorAll("[data-proof-qty]")].reduce(
      (sum, input) => sum + Number(input.value || 0),
      0,
    );
    if (selectedQuantity <= 0) {
      window.alert("Informe pelo menos uma garrafa entregue.");
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.querySelector(".material-symbols-outlined").textContent = "hourglass_top";
    try {
      const delivery = buildOrderDelivery(order, form);
      generateDeliveryProofPdf(order, delivery);
      registerOrderDelivery(order, delivery);
      addAudit("Entrega parcial registrada", `${orderClientDisplayName(order)} | remessa ${delivery.number} | ${number(delivery.totalQty)} garrafa(s)`);
      closeModal();
      render();
    } catch (error) {
      console.error(error);
      window.alert("Não foi possível gerar o PDF. Atualize a página e tente novamente.");
    } finally {
      button.disabled = false;
      button.querySelector(".material-symbols-outlined").textContent = "picture_as_pdf";
    }
  });
}

function fileSlug(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "cliente";
}

function reprintDeliveryProof(payload = "") {
  const [orderId, deliveryId] = String(payload).split(":");
  const order = byId("orders", orderId);
  const delivery = orderDeliveries(order).find((item) => item.id === deliveryId);
  if (!order || !delivery) {
    window.alert("Não encontrei esta remessa. Atualize a página e tente novamente.");
    return;
  }
  generateDeliveryProofPdf(order, delivery);
}

function generateDeliveryProofPdf(order, delivery) {
  const jsPdf = window.jspdf?.jsPDF;
  if (!jsPdf) throw new Error("jsPDF não foi carregado.");
  const data = {
    deliveryDate: delivery.deliveredAt,
    paymentMethod: delivery.paymentMethod,
    notes: delivery.notes,
  };
  const proofItems = (delivery.items || []).map((item) => ({ flavor: item.flavor, qty: Number(item.qty || 0), unitPrice: Number(item.unitPrice || 0) }));
  if (!proofItems.length) throw new Error("Comprovante sem itens.");
  const deliveryFee = Math.max(0, Number(delivery.deliveryFee || 0));
  const productsTotal = Number(delivery.productsTotal || proofItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0));
  const deliveredQuantity = Number(delivery.totalQty || proofItems.reduce((sum, item) => sum + item.qty, 0));
  const total = Number(delivery.total || productsTotal + deliveryFee);
  const doc = new jsPdf({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const green = [40, 85, 42];
  const ink = [28, 32, 29];
  const muted = [91, 101, 94];
  const line = [215, 223, 215];
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  doc.setProperties({
    title: `Comprovante de entrega - ${orderClientDisplayName(order)}`,
    subject: "Comprovante de entrega Kombú - Via Estabelecimento e Via Cliente",
    author: "Kombú Kombucha",
  });

  const renderCopy = (copyLabel, pageIndex) => {
    if (pageIndex > 0) doc.addPage();
    doc.setFillColor(...green);
    doc.rect(0, 0, pageWidth, 31, "F");
    // Keep PDF creation synchronous so iOS Safari retains the user's download gesture.
    doc.setFillColor(255, 255, 255);
    doc.circle(margin + 9.5, 15.5, 9.5, "F");
    doc.setTextColor(...green);
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("K", margin + 9.5, 19.5, { align: "center" });
    doc.setTextColor(255, 255, 255);
    doc.setFont("times", "bold");
    doc.setFontSize(17);
    doc.text("Kombú Kombucha", 39, 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("KOMBUCHA DA AMAZÔNIA", 39, 20);
    doc.setFontSize(10);
    doc.text("COMPROVANTE DE ENTREGA", pageWidth - margin, 13.5, { align: "right" });
    doc.setFontSize(8);
    doc.text(`${copyLabel.toUpperCase()} | REMESSA ${String(delivery.number || 1).padStart(2, "0")}`, pageWidth - margin, 20, { align: "right" });

    let y = 42;
    doc.setTextColor(...ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(orderClientDisplayName(order), margin, y);
    y += 7;
    doc.setDrawColor(...line);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;
    const detailRows = [
      ["Entrega", fullDate(data.deliveryDate), "Quantidade entregue", `${number(deliveredQuantity)} garrafa(s)`],
      ["Negócio", order.businessName || "-", "WhatsApp", order.whatsapp || "-"],
    ];
    doc.setFontSize(8);
    detailRows.forEach(([labelA, valueA, labelB, valueB]) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...muted);
      doc.text(labelA.toUpperCase(), margin, y);
      doc.text(labelB.toUpperCase(), 111, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...ink);
      doc.text(doc.splitTextToSize(String(valueA), 78)[0], margin, y + 4.5);
      doc.text(doc.splitTextToSize(String(valueB), 82)[0], 111, y + 4.5);
      y += 11;
    });

    const paymentNoteLines = doc.splitTextToSize(DELIVERY_PROOF_PAYMENT_NOTE, contentWidth - 6);
    const paymentBoxHeight = 14 + paymentNoteLines.length * 3.4;
    doc.setFillColor(247, 249, 245);
    doc.roundedRect(margin, y, contentWidth, paymentBoxHeight, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...muted);
    doc.text("FORMA DE PAGAMENTO", margin + 3, y + 4.5);
    doc.setFontSize(9);
    doc.setTextColor(...ink);
    doc.text(String(data.paymentMethod || DELIVERY_PROOF_DEFAULT_PAYMENT_METHOD), margin + 3, y + 9);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(...muted);
    doc.text(paymentNoteLines, margin + 3, y + 13.5);
    y += paymentBoxHeight + 3;

    doc.setFillColor(239, 244, 237);
    doc.rect(margin, y, contentWidth, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...green);
    doc.text("SABOR", margin + 3, y + 5.3);
    doc.text("QTD.", 137, y + 5.3, { align: "right" });
    doc.text("UNITÁRIO", 165, y + 5.3, { align: "right" });
    doc.text("TOTAL", pageWidth - margin - 3, y + 5.3, { align: "right" });
    y += 8;
    proofItems.forEach((item) => {
      const flavorLines = doc.splitTextToSize(item.flavor, 94);
      const rowHeight = Math.max(8.5, flavorLines.length * 4 + 3.5);
      doc.setDrawColor(...line);
      doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.7);
      doc.setTextColor(...ink);
      doc.text(flavorLines, margin + 3, y + 5.3);
      doc.text(number(item.qty), 137, y + 5.3, { align: "right" });
      doc.text(brl(item.unitPrice), 165, y + 5.3, { align: "right" });
      doc.text(brl(item.qty * item.unitPrice), pageWidth - margin - 3, y + 5.3, { align: "right" });
      y += rowHeight;
    });
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...muted);
    doc.text("Produtos", 160, y, { align: "right" });
    doc.setTextColor(...ink);
    doc.text(brl(productsTotal), pageWidth - margin, y, { align: "right" });
    if (deliveryFee > 0) {
      y += 5.5;
      doc.setTextColor(...muted);
      doc.text("Frete / entrega", 160, y, { align: "right" });
      doc.setTextColor(...ink);
      doc.text(brl(deliveryFee), pageWidth - margin, y, { align: "right" });
    }
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(...green);
    doc.text("TOTAL", 160, y, { align: "right" });
    doc.text(brl(total), pageWidth - margin, y, { align: "right" });
    y += 7;
    if (data.notes) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...muted);
      doc.text("OBSERVAÇÕES", margin, y);
      y += 4.5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...ink);
      const noteLines = doc.splitTextToSize(String(data.notes), contentWidth);
      doc.text(noteLines.slice(0, 2), margin, y);
      y += Math.min(noteLines.length, 2) * 3.7 + 3;
    }
    y = Math.max(y, 244);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text("Declaro ter recebido os produtos e quantidades descritos neste comprovante.", margin, y);
    y += 16;
    doc.setDrawColor(...muted);
    doc.line(margin, y, 91, y);
    doc.line(119, y, pageWidth - margin, y);
    doc.setFontSize(7.5);
    doc.text("Nome e assinatura do recebedor", margin, y + 4);
    doc.text("Kombú Kombucha", 119, y + 4);
  };

  renderCopy("Via Estabelecimento", 0);
  renderCopy("Via Cliente", 1);
  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...muted);
    doc.text("Kombú Kombucha da Amazônia | Manaus - AM | @kombu.amazonia", margin, 289);
    doc.text(`${page}/${pageCount}`, pageWidth - margin, 289, { align: "right" });
  }
  const filename = `comprovante-entrega-${fileSlug(orderClientDisplayName(order))}-remessa-${String(delivery.number || 1).padStart(2, "0")}-${data.deliveryDate}.pdf`;
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function paymentReminderRows() {
  return (state.orders || [])
    .filter((order) => order.status === "entregue" && orderReceivableStatus(order) !== "pago")
    .map((order) => ({
      order,
      due: orderPaymentDueDate(order),
      days: daysUntil(orderPaymentDueDate(order)),
      value: orderReceivableValue(order),
    }))
    .sort((a, b) => String(a.due).localeCompare(String(b.due)));
}

function paymentReminderMailto(order) {
  const subject = encodeURIComponent(`Lembrete de cobrança Kombú - ${order.code}`);
  const body = encodeURIComponent(
    [
      `Pedido: ${order.code}`,
      `Cliente: ${order.customerName || "-"}`,
      `Negócio: ${order.businessName || "-"}`,
      `Valor: ${brl(orderTotal(order))}`,
      `Entrega: ${order.deliveredAt || "-"}`,
      `Receber até: ${orderPaymentDueDate(order) || "-"}`,
      "",
      "Ação: enviar lembrete de pagamento ao cliente.",
    ].join("\n"),
  );
  return `mailto:${state.notifications.adminEmail}?subject=${subject}&body=${body}`;
}

function syncOrderPartner(order) {
  const clientType = order.clientType || "novo_cliente";
  if (!clientType.includes("parceiro")) return;
  const name = (order.businessName || order.customerName || "").trim();
  if (!name) return;
  const key = normalizeText(`${name}|${order.whatsapp || ""}`);
  const existing =
    state.partners.find((partner) => normalizeText(`${partner.name}|${partner.whatsapp || ""}`) === key) ||
    state.partners.find((partner) => normalizeText(partner.name) === normalizeText(name));
  const flavors = [...new Set(orderItems(order).map((item) => item.flavor || orderProductText(item)).filter(Boolean))].join(", ");
  const payload = {
    name,
    type: orderClientTypeLabel(clientType),
    neighborhood: order.neighborhood || "",
    city: order.city || "Manaus",
    whatsapp: order.whatsapp || "",
    instagram: order.instagram || "",
    flavors,
    terms: "15 dias após entrega",
    lastDelivery: order.lastDeliveryAt || order.deliveredAt || order.orderDate || "",
    visible: existing?.visible ?? false,
    sourceOrderId: order.id,
  };
  if (existing) Object.assign(existing, payload);
  else state.partners.unshift({ id: id("par"), ...payload });
}

function salePayloadFromOrderItem(order, item, delivery = {}) {
  return {
    date: delivery.deliveredAt || order.deliveredAt || order.orderDate || todayIso(),
    partner: order.customerName,
    customerName: order.customerName,
    channel: order.clientType?.includes("parceiro") ? "atacado" : "pedido",
    movementType: "venda",
    priceType: order.clientType || "novo_cliente",
    flavor: item.flavor || "",
    productId: item.productId || "",
    batchCode: item.batchCode || "",
    qty: Number(item.qty || 0),
    unitPrice: Number(item.unitPrice || 0),
    discount: 0,
    delivery: Number(delivery.deliveryFee ?? order.deliveryFee ?? 0),
    note: delivery.id ? `Gerado pela remessa ${delivery.number || 1} do pedido ${order.code}` : `Gerado pelo pedido ${order.code}`,
    orderId: order.id,
    orderCode: order.code,
    deliveryId: delivery.id || "",
    deliveryNumber: Number(delivery.number || 0),
    orderItemKey: item.key || `${item.productId || item.flavor}-${item.qty}-${item.unitPrice}`,
  };
}

function syncOrderSales(order) {
  state.sales = state.sales.filter((sale) => sale.orderId !== order.id);
  const deliveries = orderDeliveries(order);
  if (deliveries.length) {
    deliveries.forEach((delivery) => {
      let deliveryFeePending = Number(delivery.deliveryFee || 0);
      (delivery.items || []).forEach((deliveryItem) => {
        const allocations = Array.isArray(deliveryItem.allocations) && deliveryItem.allocations.length
          ? deliveryItem.allocations
          : [{ batchCode: "", qty: Number(deliveryItem.qty || 0) }];
        allocations.forEach((allocation) => {
          const qty = Number(allocation.qty || 0);
          if (qty <= 0) return;
          const item = {
            key: deliveryItem.orderItemKey,
            productId: deliveryItem.productId || "",
            flavor: deliveryItem.flavor || "",
            batchCode: allocation.batchCode || "",
            qty,
            unitPrice: Number(deliveryItem.unitPrice || 0),
          };
          state.sales.unshift({
            id: id("sale"),
            ...salePayloadFromOrderItem(order, item, { ...delivery, deliveryFee: deliveryFeePending }),
            orderItemKey: `${deliveryItem.orderItemKey}-${delivery.id}-${allocation.batchCode || "sem-lote"}`,
          });
          deliveryFeePending = 0;
        });
      });
    });
    return;
  }
  if (order.status !== "entregue") return;
  orderItems(order).forEach((item) => {
    if (Number(item.qty || 0) <= 0) return;
    const allocations = orderItemAllocations(item);
    if (allocations.length) {
      const allocatedQty = allocations.reduce((sum, allocation) => sum + Number(allocation.qty || 0), 0);
      allocations.forEach((allocation) => {
        state.sales.unshift({
          id: id("sale"),
          ...salePayloadFromOrderItem(order, { ...item, qty: allocation.qty, batchCode: allocation.batchCode }),
          orderItemKey: `${item.key || item.productId || item.flavor}-${allocation.batchCode}`,
        });
      });
      const remainingQty = Math.max(0, Number(item.qty || 0) - allocatedQty);
      if (remainingQty > 0) {
        state.sales.unshift({
          id: id("sale"),
          ...salePayloadFromOrderItem(order, { ...item, qty: remainingQty, batchCode: "" }),
          orderItemKey: `${item.key || item.productId || item.flavor}-sem-lote`,
        });
      }
      return;
    }
    state.sales.unshift({ id: id("sale"), ...salePayloadFromOrderItem(order, item) });
  });
}

function syncOrderIntegrations(order) {
  if (!order) return;
  if (order.status === "entregue" && !order.deliveredAt) order.deliveredAt = todayIso();
  if (order.deliveredAt && !order.paymentDueDate) order.paymentDueDate = addDaysIso(order.deliveredAt, 15);
  order.paymentStatus = order.paymentStatus || (order.status === "entregue" ? "aguardando pagamento" : "aberto");
  syncOrderPartner(order);
  syncOrderSales(order);
}

function updateOrderStatus(payload = "") {
  const [orderId, ...statusParts] = String(payload).split(":");
  const status = statusParts.join(":");
  const order = byId("orders", orderId);
  if (!order || !ORDER_STATUSES.includes(status)) return;
  if (status === "entregue" && orderOutstandingQuantity(order) > 0) {
    window.alert("Ainda há itens pendentes. Registre a remessa pelo botão PDF da entrega; o pedido será concluído automaticamente quando todo o saldo for entregue.");
    return;
  }
  order.status = status;
  if (status === "entregue" && !order.deliveredAt) {
    order.deliveredAt = todayIso();
    order.paymentDueDate = order.paymentDueDate || addDaysIso(order.deliveredAt, 15);
  }
  if (status !== "entregue" && order.paymentStatus === "aguardando pagamento" && !order.deliveredAt) {
    order.paymentStatus = "aberto";
  }
  order.updatedAt = new Date().toISOString();
  syncOrderIntegrations(order);
  addAudit("Status do pedido atualizado", `${orderClientDisplayName(order)}: ${status}`);
  saveState();
  render();
}

function syncPurchaseExpense(purchase) {
  if (!purchase || !Number(purchase.total || 0)) return;
  const existing = state.expenses.find((expense) => expense.purchaseId === purchase.id);
  const description = purchase.kind === "operational" ? purchase.item : `Compra: ${purchase.item}`;
  const payload = {
    date: purchase.date || todayIso(),
    category: purchase.kind === "operational" ? "Compra operacional" : "Compra de estoque",
    description,
    amount: Number(purchase.total || 0),
    method: purchase.method || "Pix",
    recurring: false,
    purchaseId: purchase.id,
    source: "purchase",
  };
  if (existing) Object.assign(existing, payload);
  else state.expenses.unshift({ id: id("exp"), ...payload });
}

function allocateBatchToOrders(batch) {
  if (!batch || !Number(batch.actual || 0)) return 0;
  const alreadyReserved = reservedFromBatch(batch.code);
  let available = Math.max(0, Number(batch.actual || 0) - soldFromBatch(batch.code) - alreadyReserved);
  const recipe = byId("recipes", batch.recipeId);
  const productId = batch.productId || recipe?.productId || "";
  const openOrders = openOrdersByReservationPriority();
  openOrders.forEach((order) => {
    orderItems(order).forEach((item) => {
      if (!available) return;
      const matchesProduct = productId && item.productId === productId;
      const matchesFlavor = !productId && normalizeText(item.flavor) === normalizeText(batch.flavor);
      if (!matchesProduct && !matchesFlavor) return;
      const need = orderItemAutomaticReservationNeed(item);
      if (!need) return;
      const allocated = Math.min(need, available);
      item.allocations = [...orderItemAllocations(item), { batchCode: batch.code, qty: allocated, date: batch.date, manual: false, note: "" }];
      refreshOrderReservationStatus(order);
      available -= allocated;
    });
  });
  return Math.max(0, Number(batch.actual || 0) - soldFromBatch(batch.code) - alreadyReserved - available);
}

function resetOpenOrderReservations() {
  (state.orders || []).filter(isOpenOrder).forEach((order) => {
    orderItems(order).forEach((item) => {
      const target = orderItemAutomaticReservationLimit(item);
      const manualAllocations = orderItemAllocations(item).filter((allocation) => allocation.manual);
      item.allocations = manualAllocations;
      item.batchCode = "";
      item.reservedQty = 0;
      item.producedQty = 0;
      trimItemAllocationsTo(item, target);
      const manualReserved = orderItemAllocations(item).reduce((sum, allocation) => sum + Number(allocation.qty || 0), 0);
      const outstanding = orderItemOutstandingQty(item);
      item.reservedQty = Math.min(outstanding, manualReserved);
      item.producedQty = item.reservedQty;
      item.batchCode = orderItemBatchCodes(item).join(", ");
      item.readyDate = manualAllocations.at(-1)?.date || "";
      item.productionStatus = outstanding <= 0 ? "entregue" : item.reservedQty > 0 ? (item.reservedQty >= outstanding ? "reservado" : "em produção") : "pendente";
    });
    refreshOrderReservationStatus(order);
  });
}

function reconcileOrderReservations() {
  resetOpenOrderReservations();
  const byBatch = {};
  (state.batches || [])
    .filter(shouldConsumeBatch)
    .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")) || String(a.code || "").localeCompare(String(b.code || "")))
    .forEach((batch) => {
      const reserved = allocateBatchToOrders(batch);
      if (reserved > 0) byBatch[batch.code] = reserved;
    });
  return {
    byBatch,
    total: Object.values(byBatch).reduce((sum, qty) => sum + Number(qty || 0), 0),
  };
}

function monthlySalesRows(limit = 6) {
  const rowsByMonth = state.sales.reduce((acc, sale) => {
    if (!sale.date) return acc;
    const monthKey = sale.date.slice(0, 7);
    acc[monthKey] = acc[monthKey] || { key: monthKey, revenue: 0, qty: 0 };
    acc[monthKey].revenue += saleRevenue(sale);
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
  return state.ingredients.filter((item) => Number(item.min) > 0 && Number(item.stock) <= Number(item.min));
}

function ingredientNeedsCost(item) {
  return item?.needsCost || item?.status === "custo pendente";
}

function missingCostIngredients() {
  return state.ingredients.filter(ingredientNeedsCost);
}

function ingredientStatusBadge(item) {
  if (ingredientNeedsCost(item)) return `<span class="status warn">custo pendente</span>`;
  const hasMinimum = Number(item.min) > 0;
  return `<span class="status ${hasMinimum ? statusClass(item.stock / item.min) : "warn"}">${hasMinimum ? (Number(item.stock) <= Number(item.min) ? "baixo" : "bom") : "sem mínimo"}</span>`;
}

function lowStockPackaging() {
  return state.packaging.filter((item) => Number(item.min) > 0 && Number(item.stock) <= Number(item.min));
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
        <h1>${tr(title)}</h1>
        <p>${tr(description)}</p>
      </div>
      <div class="admin-actions">${actions}</div>
    </div>
    ${roleAlert}
  `;
}

function cloudSyncNotice() {
  if (!isAuthenticated()) return "";
  const local = isLocalPreview();
  const savedAt = lastCloudSaveAt ? new Date(lastCloudSaveAt).toLocaleString("pt-BR") : "";
  if (cloudSyncEnabled && cloudSyncConfigured) {
    return `
      <section class="cloud-sync-notice good" aria-live="polite">
        <span class="material-symbols-outlined" aria-hidden="true">cloud_done</span>
        <div>
          <strong>${tr("Sincronizacao na nuvem ativa.")}</strong>
          <p>${tr("Alteracoes salvas aqui aparecem no site publico, no desktop e no celular.")}${savedAt ? ` ${tr("Ultimo salvamento")}: ${savedAt}.` : ""}</p>
        </div>
      </section>
    `;
  }
  if (local) {
    return `
      <section class="cloud-sync-notice warn" aria-live="polite">
        <span class="material-symbols-outlined" aria-hidden="true">developer_mode</span>
        <div>
          <strong>Preview local.</strong>
          <p>Este navegador usa dados locais para teste. O site publicado precisa do Supabase configurado para sincronizar entre dispositivos.</p>
        </div>
      </section>
    `;
  }
  return `
    <section class="cloud-sync-notice bad" aria-live="assertive">
      <span class="material-symbols-outlined" aria-hidden="true">cloud_off</span>
      <div>
        <strong>As alteracoes nao estao publicando para todos os dispositivos.</strong>
        <p>${escapeHtml(cloudSyncLastError || "Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY na Vercel para desktop e celular usarem a mesma base.")}</p>
      </div>
      <button class="btn btn-outline" type="button" data-action="sync-cloud">
        <span class="material-symbols-outlined" aria-hidden="true">sync</span>Testar nuvem
      </button>
    </section>
  `;
}

function actionButton(action, label, icon, variant = "btn-primary", module = currentModule) {
  const disabled = canWrite(module) ? "" : "disabled aria-disabled=\"true\"";
  return `<button class="btn ${variant}" type="button" data-action="${action}" ${disabled}>
    <span class="material-symbols-outlined" aria-hidden="true">${icon}</span>${tr(label)}
  </button>`;
}

function tableAction(action, label, icon = "edit", variant = "") {
  const disabled = canWrite() ? "" : "disabled aria-disabled=\"true\"";
  return `
    <button class="icon-btn table-action ${variant}" type="button" data-action="${escapeHtml(action)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}" ${disabled}>
      <span class="material-symbols-outlined" aria-hidden="true">${icon}</span>
    </button>
  `;
}

function rowActions(actions) {
  return `<div class="row-actions">${actions.join("")}</div>`;
}

function metric(label, value, note, icon = "monitoring") {
  return `
    <article class="admin-card metric-card">
      <small><span class="material-symbols-outlined" aria-hidden="true">${icon}</span> ${tr(label)}</small>
      <strong>${value}</strong>
      <span>${tr(note)}</span>
    </article>
  `;
}

function dashboardStockChart() {
  const rows = stockByFlavorRows()
    .sort((a, b) => (b.available + b.reserved) - (a.available + a.reserved) || a.flavor.localeCompare(b.flavor))
    .slice(0, 12);
  const max = Math.max(1, ...rows.map((row) => row.available + row.reserved));
  if (!rows.length) {
    return `<p class="empty-note">Crie lotes aprovados para visualizar estoque por sabor.</p>`;
  }
  return `
    <div class="dashboard-stock-list">
      ${rows
        .map((row) => {
          const availableWidth = Math.min(100, (row.available / max) * 100);
          const reservedWidth = Math.min(100, (row.reserved / max) * 100);
          return `
            <div class="dashboard-stock-row ${row.available + row.reserved <= 0 ? "is-empty" : ""}">
              <div class="dashboard-stock-head">
                <strong>${escapeHtml(row.flavor)}</strong>
                <span>${number(row.available)} disp.${row.reserved ? ` | ${number(row.reserved)} res.` : ""}</span>
              </div>
              <div class="dashboard-stock-track" aria-label="${escapeHtml(row.flavor)}: ${number(row.available)} disponível, ${number(row.reserved)} reservado">
                <i class="is-available" style="width:${availableWidth}%"></i>
                <i class="is-reserved" style="width:${reservedWidth}%"></i>
              </div>
            </div>
          `;
        })
        .join("")}
      <div class="dashboard-stock-legend">
        <span><i class="is-available"></i> Disponível</span>
        <span><i class="is-reserved"></i> Reservado</span>
      </div>
    </div>
  `;
}

function renderDashboard() {
  const total = totals();
  const productionRows = orderProductionRows();
  const receivableRows = paymentReminderRows();
  const partnerRows = Object.entries(
    state.sales
      .filter((sale) => !sale.movementType || sale.movementType === "venda")
      .reduce((acc, sale) => {
        const partner = sale.customerName || sale.partner || "Cliente sem nome";
        acc[partner] = (acc[partner] || 0) + Number(sale.qty || 0);
        return acc;
      }, {}),
  ).sort((a, b) => b[1] - a[1]);
  return `
    ${pageHead(
      "Visão Geral",
      "Controle operacional e financeiro da Kombú: produção, estoque, custo por garrafa, vendas e alertas.",
      `${actionButton("quick-sale", "Venda rápida", "point_of_sale")} ${actionButton("new-order", "Novo pedido", "assignment", "btn-outline")} ${actionButton("new-batch", "Novo lote", "science", "btn-outline")} ${actionButton("new-purchase", "Registrar compra", "shopping_bag", "btn-outline")}`,
    )}
    ${dashboardReadyOrders()}
    <section class="metric-grid">
      ${metric("Garrafas em estoque", number(total.finishedStock), "Prontas para venda por lote", "water_bottle")}
      ${metric("Pedidos em aberto", number(total.openOrderQty), `${brl(total.openOrderValue)} em pipeline`, "assignment")}
      ${metric("A receber", brl(total.receivable), `${receivableRows.length} cobrança(s) pendentes`, "event_available")}
      ${metric("Produção faltante", number(total.productionMissing), "Garrafas necessárias para pedidos", "factory")}
      ${metric("Receita do período", brl(total.salesRevenue), `Lucro bruto ${brl(total.grossProfit)} (${pct(total.grossMargin)})`, "account_balance_wallet")}
      ${metric("Despesas + compras", brl(total.expenses), `Compras registradas: ${brl(total.purchasesTotal)}`, "receipt_long")}
    </section>
    <section class="admin-grid">
      <article class="admin-card">
        <h3>Atenção necessária</h3>
        <div class="alert-list">
          ${missingCostIngredients()
            .slice(0, 5)
            .map((item) => `<div class="alert-item"><strong>Custo pendente: ${item.name}</strong><span>Complete o custo unitário para a receita calcular margem real.</span></div>`)
            .join("")}
          ${[...lowStockIngredients(), ...lowStockPackaging()]
            .slice(0, 5)
            .map((item) => `<div class="alert-item"><strong>Estoque baixo: ${item.name}</strong><span>Atual ${number(item.stock, 2)} | mínimo ${number(item.min, 2)}</span></div>`)
            .join("")}
          ${nearExpiryBatches()
            .map((batch) => `<div class="alert-item"><strong>Lote próximo ao vencimento: ${batch.code}</strong><span>${batch.stock} garrafas vencem em ${batch.expiry}</span></div>`)
            .join("")}
          ${missingCostIngredients().length || lowStockIngredients().length || lowStockPackaging().length || nearExpiryBatches().length ? "" : `<div class="empty-note">Nenhum alerta crítico no momento.</div>`}
        </div>
      </article>
      <article class="admin-card dashboard-stock-card">
        <div class="dashboard-card-head">
          <h3>Estoque por sabor</h3>
          <span>disponível / reservado</span>
        </div>
        ${dashboardStockChart()}
      </article>
    </section>
    <section class="admin-grid">
      <article class="admin-card">
        <h3>Produção puxada por pedidos</h3>
        <div class="stack-list">
          ${productionRows.length ? productionRows.slice(0, 6).map((row) => `<div class="report-row"><strong>${escapeHtml(row.flavor)}</strong><span>${number(row.missing)} faltando de ${number(row.ordered)} | ${productionClientRows(row).slice(0, 2).map((client) => escapeHtml(client.name)).join(", ") || "sem cliente"}</span></div>`).join("") : `<p class="empty-note">Sem pedido aberto exigindo produção.</p>`}
        </div>
      </article>
      <article class="admin-card">
        <h3>Cobranças próximas</h3>
        <div class="stack-list">
          ${receivableRows.length ? receivableRows.slice(0, 6).map(({ order, due, days, value }) => `<div class="report-row"><strong>${escapeHtml(orderClientDisplayName(order))}</strong><span>${brl(value)} | vence ${due || "-"}${days != null ? ` (${days < 0 ? `${Math.abs(days)} dias atrasado` : `${days} dias`})` : ""} | <a href="${paymentReminderMailto(order)}">preparar lembrete</a></span></div>`).join("") : `<p class="empty-note">Nenhuma cobrança em aberto por entrega.</p>`}
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
  if (["aprovado", "ativo", "ativa", "pago", "confirmado", "produzido", "pronto", "entregue"].includes(value)) return "good";
  if (["planejado", "bottled", "pendente", "custo pendente", "recebido", "em produção", "aberto", "aguardando pagamento"].includes(value)) return "warn";
  return "bad";
}

function tableRowsWithLabels(headers, rows) {
  return rows.map((row) => {
    let index = 0;
    return row.replace(/<td(\s[^>]*)?>/g, (match, attrs = "") => {
      const header = tr(headers[index]?.label || "");
      index += 1;
      return `<td data-label="${escapeHtml(header)}"${attrs}>`;
    });
  });
}

function table(headers, rows) {
  const bodyRows = rows.length
    ? tableRowsWithLabels(headers, rows).join("")
    : `<tr><td colspan="${headers.length}"><p class="empty-note">${tr("Nenhum registro ainda. Use os botões acima para começar.")}</p></td></tr>`;
  return `
    <article class="admin-card table-card">
      <div class="table-scroll" role="region" aria-label="Tabela responsiva">
        <table class="data-table">
          <thead><tr>${headers.map((header) => `<th class="${header.num ? "num" : ""}">${tr(header.label)}</th>`).join("")}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
    </article>
  `;
}

function renderIngredients() {
  const rows = state.ingredients
    .filter((item) => matchesSearch(item))
    .map((item) => {
      return `
        <tr>
          <td><strong>${item.name}</strong><br><span>${item.location}</span></td>
          <td>${item.category}</td>
          <td>${item.supplier}</td>
          <td class="num">${number(item.stock, 2)} ${item.purchaseUnit}</td>
          <td class="num">${brl(item.costPerUnit)} / ${item.purchaseUnit}</td>
          <td>${ingredientStatusBadge(item)}</td>
          <td>${item.expires}</td>
          <td>${rowActions([tableAction(`edit-ingredient:${item.id}`, "Editar ingrediente"), tableAction(`delete-ingredient:${item.id}`, "Excluir ingrediente", "delete", "danger")])}</td>
        </tr>
      `;
    });
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
        { label: "Ações" },
      ],
      rows,
      1040,
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
          <td><strong>${item.item}</strong><br><span>${item.supplier}</span><br><span>${item.kind === "operational" ? "Despesa operacional" : "Estoque/custo"}</span></td>
          <td class="num">${item.kind === "operational" ? "-" : item.packageCount ? `${number(item.packageCount)} x ${number(item.packageSize, 3)} ${item.packageUnit}` : `${number(item.qty, 2)} ${item.unit}`}</td>
          <td class="num"><strong>${item.kind === "operational" ? "-" : `${number(item.qty, 3)} ${item.unit}`}</strong></td>
          <td class="num">${brl(item.total)}</td>
          <td class="num">${item.kind === "operational" ? "não entra" : `${brl(item.costPerUnit || Number(item.total || 0) / Math.max(Number(item.qty || 0), 0.000001))} / ${item.unit}`}</td>
          <td>${item.method}</td>
          <td>${item.buyer}</td>
          <td>${rowActions([tableAction(`edit-purchase:${item.id}`, "Editar compra"), tableAction(`delete-purchase:${item.id}`, "Excluir compra", "delete", "danger")])}</td>
        </tr>
      `,
    );
  return `
    ${pageHead(
      "Compras",
      "Registre estoque e despesas operacionais em um só lugar. Compras entram automaticamente em Despesas.",
      `${actionButton("new-purchase", "Registrar compra", "add")} ${actionButton("export-purchases", "CSV", "download", "btn-outline")}`,
    )}
    ${table(
      [
        { label: "Data" },
        { label: "Item / fornecedor" },
        { label: "Compra", num: true },
        { label: "Entra no estoque", num: true },
        { label: "Total", num: true },
        { label: "Custo unitário", num: true },
        { label: "Pagamento" },
        { label: "Comprador" },
        { label: "Ações" },
      ],
      rows,
      960,
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
          <td>${rowActions([tableAction(`edit-supplier:${item.id}`, "Editar fornecedor"), tableAction(`delete-supplier:${item.id}`, "Excluir fornecedor", "delete", "danger")])}</td>
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
        { label: "Ações" },
      ],
      rows,
      1080,
    )}
  `;
}

function renderProducts() {
  const currentRetail = commonProductPrice("retailPrice", state.settings.globalRetailPrice || GLOBAL_RETAIL_PRICE);
  const currentWholesale = commonProductPrice("wholesalePrice", state.settings.globalWholesalePrice || GLOBAL_WHOLESALE_PRICE);
  const rows = state.products
    .filter((item) => matchesSearch(item))
    .map((product) => {
      const recipe = recipeForProduct(product);
      const calculatedCost = productDisplayCost(product);
      const operational = productIsOperational(product);
      const wholesale = productWholesalePrice(product);
      const margin = wholesale ? ((wholesale - calculatedCost) / wholesale) * 100 : 0;
      return `
        <tr>
          <td><strong>#${product.ean || "sem EAN"}</strong><br><span>${product.item}</span></td>
          <td><strong>${product.flavor}</strong><br><span>${product.description}</span></td>
          <td class="num">${number(product.sizeMl)}ml</td>
          <td class="num">${brl(product.retailPrice)}</td>
          <td class="num">${brl(product.wholesalePrice)}</td>
          <td class="num"><strong>${recipe ? brl(calculatedCost) : "Custo pendente"}</strong></td>
          <td class="num">${recipe ? pct(margin) : "-"}</td>
          <td><span class="status ${operational ? "good" : "warn"}">${operational ? "Disponível" : "Indisponível"}</span></td>
          <td>${rowActions([tableAction(`edit-product:${product.id}`, "Editar produto"), tableAction(`delete-product:${product.id}`, "Excluir produto", "delete", "danger")])}</td>
        </tr>
      `;
    });
  const compactProducts = state.products
    .filter((item) => matchesSearch(item))
    .map(
      (product) => {
        const recipe = recipeForProduct(product);
        const operational = productIsOperational(product);
        return `
        <article class="product-compact-card">
          <div>
            <strong>${escapeHtml(product.flavor)}</strong>
            <span>${escapeHtml(product.item || product.ean || "sem codigo")} | ${number(product.sizeMl)}ml</span>
          </div>
          <div class="product-compact-meta">
            <span class="status ${operational ? "good" : "warn"}">${operational ? "Disponível" : "Indisponível"}</span>
          </div>
          <div class="product-compact-prices">
            <span>Varejo ${brl(product.retailPrice)}</span>
            <span>Atacado ${brl(product.wholesalePrice)}</span>
            <span>${recipe ? `Custo ${brl(productDisplayCost(product))}` : "Custo pendente"}</span>
          </div>
          <div class="product-compact-actions">
            ${rowActions([tableAction(`edit-product:${product.id}`, "Editar sabor"), tableAction(`delete-product:${product.id}`, "Excluir sabor", "delete", "danger")])}
          </div>
        </article>
      `;
      },
    )
    .join("");
  return `
    ${pageHead(
      "Produtos / EAN",
      "Catálogo de sabores e tamanhos. O custo é calculado automaticamente pela receita vinculada.",
      `${actionButton("new-product", "Novo produto", "add")} ${actionButton("global-prices", "Preço global", "price_change", "btn-outline")} ${actionButton("export-products", "CSV", "download", "btn-outline")}`,
    )}
    <section class="metric-grid">
      ${metric("Produtos cadastrados", number(state.products.length), "Itens KMB e variações", "barcode_scanner")}
      ${metric("Com receita vinculada", number(state.products.filter((product) => recipeForProduct(product)).length), "Calculam custo automaticamente", "calculate")}
      ${metric("Disponíveis", number(state.products.filter(productIsOperational).length), "Catálogo operacional", "check_circle")}
      ${metric("Custo médio calculado", brl(state.products.filter((product) => recipeForProduct(product)).reduce((sum, product) => sum + productDisplayCost(product), 0) / Math.max(1, state.products.filter((product) => recipeForProduct(product)).length)), "Somente receitas vinculadas", "price_check")}
    </section>
    <section class="admin-card">
      <div class="table-toolbar">
        <div>
          <h3>Preço global das kombuchas</h3>
          <p>Use este controle para alterar varejo e atacado de todos os sabores de uma vez.</p>
        </div>
        ${actionButton("global-prices", "Alterar preços", "price_change", "btn-outline")}
      </div>
      <div class="metric-grid compact">
        ${metric("Varejo atual", brl(currentRetail), "Aplicado como referência dos pedidos de varejo", "sell")}
        ${metric("Atacado atual", brl(currentWholesale), "Aplicado para parceiros novos e recorrentes", "storefront")}
      </div>
    </section>
    <section class="admin-card product-compact-panel">
      <div class="table-toolbar">
        <div>
          <h3>Sabores</h3>
          <p>Lista rápida para abrir, conferir disponibilidade e editar sem procurar na tabela.</p>
        </div>
      </div>
      <div class="product-compact-list">${compactProducts || `<p class="empty-note">Nenhum sabor encontrado.</p>`}</div>
    </section>
    ${table(
      [
        { label: "EAN / item" },
        { label: "Produto" },
        { label: "Tamanho", num: true },
        { label: "Varejo", num: true },
        { label: "Atacado", num: true },
        { label: "Custo da receita", num: true },
        { label: "Margem atacado", num: true },
        { label: "Disponibilidade" },
        { label: "Ações" },
      ],
      rows,
      1120,
    )}
  `;
}

function renderRecipes() {
  const rows = state.recipes
    .filter((recipe) => matchesSearch(recipe))
    .map((recipe) => {
      const cost = recipeCost(recipe);
      const product = productForRecipe(recipe);
      return `
        <tr>
          <td><strong>${recipe.flavor}</strong><br><span>${recipe.version} | ${recipe.bottleMl}ml</span></td>
          <td>${product ? `<strong>${product.item}</strong><br><span>#${product.ean}</span>` : "Sem produto"}</td>
          <td class="num">${number(recipe.yieldBottles)} garrafas</td>
          <td class="num">${brl(cost.ingredientCost)}</td>
          <td class="num">${brl(cost.packagingCost)}</td>
          <td class="num">${brl(cost.total)}</td>
          <td class="num"><strong>${brl(cost.costPerBottle)}</strong></td>
          <td class="num">${pct(cost.wholesaleMargin)}</td>
          <td><span class="status ${statusClass(recipe.status, "general")}">${recipe.status}</span></td>
          <td>${rowActions([tableAction(`edit-recipe:${recipe.id}`, "Editar receita"), tableAction(`delete-recipe:${recipe.id}`, "Excluir receita", "delete", "danger")])}</td>
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
        { label: "Produto / EAN" },
        { label: "Rendimento", num: true },
        { label: "Ingredientes", num: true },
        { label: "Embalagem", num: true },
        { label: "Custo lote", num: true },
        { label: "Custo/garrafa", num: true },
        { label: "Margem atacado", num: true },
        { label: "Status" },
        { label: "Ações" },
      ],
      rows,
      1200,
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
  const ingredientRows = (recipe.ingredients || [])
    .map((line, index) => {
      const ingredient = byId("ingredients", line.ingredientId);
      return `
        <tr>
          <td data-label="Grupo">Ingrediente</td>
          <td data-label="Insumo">${ingredient?.name || "Não encontrado"}</td>
          <td data-label="Qtd."><input type="number" min="0" step="0.01" value="${line.qty}" aria-label="Quantidade de ${escapeHtml(ingredient?.name || "ingrediente")}" data-cost-line="ingredients" data-index="${index}" data-field="qty"></td>
          <td data-label="Unidade">
            <select aria-label="Unidade de ${escapeHtml(ingredient?.name || "ingrediente")}" data-cost-line="ingredients" data-index="${index}" data-field="unit">
              ${["g", "kg", "ml", "l", "un"].map((unit) => `<option ${line.unit === unit ? "selected" : ""}>${unit}</option>`).join("")}
            </select>
          </td>
          <td data-label="Custo compra" class="num">${brl(ingredient?.costPerUnit || 0)} / ${ingredient?.purchaseUnit || ""}</td>
          <td data-label="Custo no lote" class="num">${brl(ingredientLineCost(line))}</td>
          <td data-label="Ações">${rowActions([tableAction(`remove-recipe-ingredient:${recipe.id}:${index}`, "Remover ingrediente", "delete", "danger")])}</td>
        </tr>
      `;
    })
    .join("");
  const packagingRows = (recipe.packaging || [])
    .map((line, index) => {
      const item = byId("packaging", line.itemId);
      return `
        <tr>
          <td data-label="Grupo">Embalagem</td>
          <td data-label="Insumo">${item?.name || "Não encontrado"}</td>
          <td data-label="Qtd."><input type="number" min="0" step="0.001" value="${line.qty}" aria-label="Quantidade de ${escapeHtml(item?.name || "material")}" data-cost-line="packaging" data-index="${index}" data-field="qty"></td>
          <td data-label="Unidade">un/garrafa</td>
          <td data-label="Custo compra" class="num">${brl(item?.costEach || 0)}</td>
          <td data-label="Custo no lote" class="num">${brl(packagingLineCost(line, recipe.yieldBottles))}</td>
          <td data-label="Ações">${rowActions([tableAction(`remove-recipe-packaging:${recipe.id}:${index}`, "Remover material", "delete", "danger")])}</td>
        </tr>
      `;
    })
    .join("");
  return `
    ${pageHead(
      "Custo por Garrafa",
      "Tabela editável inspirada em Excel, com conversão de unidades, custo por lote e simulação de margem.",
      `${actionButton(`add-recipe-ingredient:${recipe.id}`, "Ingrediente", "add", "btn-outline")} ${actionButton(`add-recipe-packaging:${recipe.id}`, "Material", "inventory_2", "btn-outline")} ${actionButton("save-costs", "Salvar simulação", "save")} ${actionButton("export-costs", "CSV", "download", "btn-outline")}`,
    )}
    <div class="calculator-grid">
      <article class="admin-card table-card">
        <div class="table-toolbar" style="padding:16px 16px 0">
          <label class="field" style="min-width:260px">
            <span>Receita ativa</span>
            <select id="recipeSelector" class="admin-select" aria-label="Receita ativa">
              ${state.recipes.map((item) => `<option value="${item.id}" ${item.id === recipe.id ? "selected" : ""}>${recipeLabel(item)}</option>`).join("")}
            </select>
          </label>
          <div class="admin-actions">
            <label class="field">
              <span>Rendimento</span>
              <input class="admin-input" type="number" value="${recipe.yieldBottles}" aria-label="Rendimento em garrafas" data-recipe-field="yieldBottles" />
            </label>
            <label class="field">
              <span>Perda %</span>
              <input class="admin-input" type="number" value="${recipe.wastePct}" aria-label="Percentual de perda" data-recipe-field="wastePct" />
            </label>
            <label class="field">
              <span>Atacado</span>
              <input class="admin-input" type="number" step="0.01" value="${recipe.wholesalePrice}" aria-label="Preço de atacado" data-recipe-field="wholesalePrice" />
            </label>
            <label class="field">
              <span>Varejo</span>
              <input class="admin-input" type="number" step="0.01" value="${recipe.retailPrice}" aria-label="Preço de varejo" data-recipe-field="retailPrice" />
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
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${ingredientRows}
              <tr class="subtotal-row"><td colspan="6">Subtotal ingredientes</td><td data-label="Total" class="num">${brl(cost.ingredientCost)}</td></tr>
              ${packagingRows}
              <tr class="subtotal-row"><td colspan="6">Subtotal embalagens</td><td data-label="Total" class="num">${brl(cost.packagingCost)}</td></tr>
              <tr><td data-label="Grupo">Operação</td><td data-label="Insumo">Mão de obra por lote</td><td data-label="Qtd."><input type="number" value="${recipe.labor}" aria-label="Custo de mão de obra por lote" data-recipe-field="labor"></td><td data-label="Unidade">R$</td><td data-label="Custo compra"></td><td data-label="Custo no lote" class="num">${brl(recipe.labor)}</td><td data-label="Ações"></td></tr>
              <tr><td data-label="Grupo">Operação</td><td data-label="Insumo">Água, energia e gás</td><td data-label="Qtd."><input type="number" value="${recipe.utilities}" aria-label="Custo de água, energia e gás por lote" data-recipe-field="utilities"></td><td data-label="Unidade">R$</td><td data-label="Custo compra"></td><td data-label="Custo no lote" class="num">${brl(recipe.utilities)}</td><td data-label="Ações"></td></tr>
              <tr><td data-label="Grupo">Operação</td><td data-label="Insumo">Transporte, sanitização e outros</td><td data-label="Qtd."><input type="number" value="${recipe.other}" aria-label="Outros custos por lote" data-recipe-field="other"></td><td data-label="Unidade">R$</td><td data-label="Custo compra"></td><td data-label="Custo no lote" class="num">${brl(recipe.other)}</td><td data-label="Ações"></td></tr>
              <tr class="subtotal-row"><td colspan="6">Custo direto com perda</td><td data-label="Total" class="num">${brl(cost.total)}</td></tr>
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
  const productionRows = orderProductionRows();
  const rows = state.batches
    .filter((item) => matchesSearch(item))
    .map((batch) => {
      const cost = batchCost(batch);
      const loss = Number(batch.expected || 0) - Number(batch.actual || 0);
      const product = productForBatch(batch);
      return `
        <tr>
          <td><strong>${batch.code}</strong><br><span>${batch.flavor}</span></td>
          <td>${product ? `<strong>${product.item}</strong><br><span>#${product.ean}</span>` : "Sem produto"}</td>
          <td>${batch.date}</td>
          <td>${batch.responsible}</td>
          <td class="num">${number(batch.expected)} / ${number(batch.actual)}</td>
          <td class="num">${number(loss)}</td>
          <td class="num">${brl(cost.batchCostPerBottle)}</td>
          <td>${batch.idealSellBy || "-"}</td>
          <td>${batch.sellBy || "-"}</td>
          <td>${batch.expiry}</td>
          <td><span class="status ${statusClass(batch.status, "general")}">${batch.status}</span></td>
          <td>${rowActions([tableAction(`edit-batch:${batch.id}`, "Editar lote"), tableAction(`delete-batch:${batch.id}`, "Excluir lote", "delete", "danger")])}</td>
        </tr>
      `;
    });
  return `
    ${pageHead(
      "Produção / Lotes",
      "Controle de lotes, versão da receita, rendimento real, vencimento, custo histórico e rastreabilidade.",
      `${actionButton("new-batch", "Novo lote", "add")} ${actionButton("stock-adjustment", "Ajuste de estoque", "tune", "btn-outline")}`,
    )}
    <section class="admin-card order-production-card">
      <h3>O que precisa ser produzido</h3>
      <div class="production-chip-grid">
        ${productionRows.length ? productionRows.map((row) => `<div class="production-chip"><strong>${escapeHtml(row.flavor)}</strong><span>${number(row.missing)} faltando</span><small>${number(row.reserved)} reservado de ${number(row.ordered)}</small>${renderProductionClientList(row)}</div>`).join("") : `<p class="empty-note">Nenhum pedido aberto exigindo produção.</p>`}
      </div>
    </section>
    ${table(
      [
        { label: "Lote / sabor" },
        { label: "Produto / EAN" },
        { label: "Produção" },
        { label: "Responsável" },
        { label: "Esperado / real", num: true },
        { label: "Perda", num: true },
        { label: "Custo/garrafa", num: true },
        { label: "Ideal até" },
        { label: "Vender até" },
        { label: "Validade" },
        { label: "Status" },
        { label: "Ações" },
      ],
      rows,
      1260,
    )}
  `;
}

function stockFlowChip(label, detail, tone = "") {
  return `<span class="stock-flow-chip ${tone}"><strong>${label}</strong><small>${detail}</small></span>`;
}

function stockByFlavorRows() {
  const batches = finishedStockRows();
  const usedBatchCodes = new Set();
  const productRows = state.products.map((product) => {
    const matching = batches.filter((row) => {
      const sameProduct = row.product?.id === product.id || row.productId === product.id;
      const sameFlavor = normalizeText(row.flavor || row.product?.flavor) === normalizeText(product.flavor);
      if (sameProduct || sameFlavor) usedBatchCodes.add(row.code);
      return sameProduct || sameFlavor;
    });
    return {
      key: product.id,
      item: product.item || "",
      flavor: product.flavor || product.item || "Kombucha",
      product,
      available: matching.reduce((sum, row) => sum + Number(row.stock || 0), 0),
      reserved: matching.reduce((sum, row) => sum + Number(row.reserved || 0), 0),
      sold: matching.reduce((sum, row) => sum + Number(row.sold || 0), 0),
      produced: matching.reduce((sum, row) => sum + Number(row.actual || 0), 0),
      batches: matching.length,
    };
  });
  const extraRows = batches
    .filter((row) => !usedBatchCodes.has(row.code))
    .map((row) => ({
      key: row.code,
      item: row.product?.item || row.code,
      flavor: row.flavor || row.product?.flavor || "Kombucha",
      product: row.product || null,
      available: Number(row.stock || 0),
      reserved: Number(row.reserved || 0),
      sold: Number(row.sold || 0),
      produced: Number(row.actual || 0),
      batches: 1,
    }));
  return [...productRows, ...extraRows].sort((a, b) => {
    const itemCompare = String(a.item || "").localeCompare(String(b.item || ""), "pt-BR", { numeric: true });
    return itemCompare || String(a.flavor).localeCompare(String(b.flavor), "pt-BR");
  });
}

function stockFlavorOverview() {
  const rows = stockByFlavorRows().filter((row) => {
    if (!globalSearch) return true;
    const haystack = normalizeText(`${row.item} ${row.flavor} ${row.product?.description || ""}`);
    return haystack.includes(normalizeText(globalSearch));
  });
  const totalAvailable = rows.reduce((sum, row) => sum + Number(row.available || 0), 0);
  const totalReserved = rows.reduce((sum, row) => sum + Number(row.reserved || 0), 0);
  const maxQty = Math.max(1, ...rows.map((row) => Number(row.available || 0) + Number(row.reserved || 0)));
  return `
    <article class="admin-card stock-overview-card">
      <div class="stock-overview-head">
        <div>
          <h3>${tr("Estoque geral por sabor")}</h3>
          <p>${tr("Leitura rápida para ver o que existe agora, sem abrir lote por lote.")}</p>
        </div>
        <div class="stock-overview-total">
          <strong>${number(totalAvailable)}</strong>
          <span>${tr("disponíveis")}</span>
          ${totalReserved ? `<small>${number(totalReserved)} ${tr("reservadas")}</small>` : ""}
        </div>
      </div>
      <div class="stock-overview-list">
        ${
          rows.length
            ? rows
                .map((row) => {
                  const width = Math.max(3, ((Number(row.available || 0) + Number(row.reserved || 0)) / maxQty) * 100);
                  const isEmpty = Number(row.available || 0) <= 0 && Number(row.reserved || 0) <= 0;
                  return `
                    <div class="stock-overview-row ${isEmpty ? "is-empty" : ""}">
                      <div class="stock-overview-name">
                        <strong>${escapeHtml(row.flavor)}</strong>
                        <span>${escapeHtml(row.item || "Sem código")}${row.reserved ? ` | ${number(row.reserved)} ${tr("reservadas")}` : ""}</span>
                      </div>
                      <div class="stock-overview-qty">
                        <strong>${number(row.available)}</strong>
                        <span>${tr("disp.")}</span>
                      </div>
                      <div class="stock-overview-bar" aria-hidden="true"><i style="width:${width}%"></i></div>
                    </div>
                  `;
                })
                .join("")
            : `<p class="empty-note">${tr("Nenhum sabor encontrado.")}</p>`
        }
      </div>
    </article>
  `;
}

function stockBatchCard(row) {
  const reservations = batchReservationRows(row.code);
  const sales = batchSaleRows(row.code);
  const reservationList = reservations.length
    ? reservations
        .map((reservation) => {
          const client = orderClientDisplayName(reservation.order);
          return stockFlowChip(`${number(reservation.qty)} reservada(s)`, escapeHtml(client), reservation.manual ? "is-manual" : "");
        })
        .join("")
    : `<p class="mini-empty">Nada reservado neste lote.</p>`;
  const salesList = sales.length
    ? sales
        .slice(0, 5)
        .map((rowSale) => {
          const qtyLabel = rowSale.qty < 0 ? `+${number(Math.abs(rowSale.qty))}` : number(rowSale.qty);
          return stockFlowChip(`${qtyLabel} ${escapeHtml(rowSale.movement)}`, `${escapeHtml(rowSale.customer)} | ${rowSale.sale.date || "-"}`, rowSale.qty < 0 ? "is-return" : "");
        })
        .join("")
    : `<p class="mini-empty">Nenhuma saída registrada.</p>`;
  return `
    <article class="stock-batch-card">
      <div class="stock-card-head">
        <div>
          <span class="eyebrow">Lote ${escapeHtml(row.code)}</span>
          <strong>${escapeHtml(row.flavor || row.product?.flavor || "Kombucha")}</strong>
          <small>${escapeHtml(row.product ? productLabel(row.product) : "Produto sem vínculo")}</small>
        </div>
        <span class="status ${statusClass(row.stock)}">${row.stock > 0 ? "disponível" : "sem saldo"}</span>
      </div>
      <div class="stock-stat-grid">
        <div class="stock-stat is-available"><span>Disponível</span><strong>${number(row.stock)}</strong></div>
        <div class="stock-stat"><span>Reservado</span><strong>${number(row.reserved)}</strong></div>
        <div class="stock-stat"><span>Saídas</span><strong>${number(row.sold)}</strong></div>
        <div class="stock-stat"><span>Produzido</span><strong>${number(row.actual)}</strong></div>
      </div>
      <div class="stock-card-meta">
        <span>Ideal ${row.idealSellBy || "-"}</span>
        <span>Vender até ${row.sellBy || "-"}</span>
        <span>Validade ${row.expiry || "-"}</span>
      </div>
      <div class="stock-flow-grid">
        <div class="stock-flow-box">
          <h4>Reservado para</h4>
          <div class="stock-flow-list">${reservationList}</div>
        </div>
        <div class="stock-flow-box">
          <h4>Saídas e vendas</h4>
          <div class="stock-flow-list">${salesList}</div>
        </div>
      </div>
      <div class="stock-card-actions">
        ${actionButton(`correct-batch-qty:${row.id}`, "Corrigir quantidade", "edit_square", "btn-outline")}
        ${actionButton(`reserve-stock:${row.code}`, "Reservar", "assignment_turned_in", "btn-outline")}
        ${actionButton(`write-off-stock:${row.code}`, "Dar baixa", "remove_circle", "btn-outline")}
        ${actionButton(`stock-sale:${row.code}`, "Venda/saída", "point_of_sale", "btn-outline")}
        ${actionButton(`reverse-stock:${row.code}`, "Devolução", "undo", "btn-outline")}
      </div>
    </article>
  `;
}

function renderStock() {
  const viewButtons = [
    ["kombuchas", "Kombuchas"],
    ["ingredients", "Ingredientes"],
    ["labels", "Rótulos"],
    ["bottles", "Garrafas"],
  ]
    .map((view) => `<button class="segment ${currentStockView === view[0] ? "is-active" : ""}" type="button" data-stock-view="${view[0]}">${view[1]}</button>`)
    .join("");
  const materialRows = (items) =>
    items.map((item) => {
      const hasMinimum = Number(item.min) > 0;
      const product = byId("products", item.productId);
      return `
        <tr>
          <td><strong>${item.name}</strong><br><span>${product ? product.flavor : "Genérico"}</span></td>
          <td>${item.supplier || "-"}</td>
          <td class="num">${number(item.stock, 2)} ${item.unit}</td>
          <td class="num">${number(item.min, 2)} ${item.unit}</td>
          <td class="num">${brl(item.costEach)}</td>
          <td><span class="status ${hasMinimum ? statusClass(item.stock / item.min) : "warn"}">${hasMinimum ? (item.stock <= item.min ? "baixo" : "bom") : "sem mínimo"}</span></td>
        </tr>
      `;
    });
  const stockRows = finishedStockRows().filter((row) => matchesSearch(row) || matchesSearch(row.product || {}));
  const stockAlerts = `
    <article class="admin-card stock-alert-card">
      <h3>Alertas de estoque</h3>
      <div class="stack-list">
        ${[...lowStockIngredients(), ...lowStockPackaging()]
          .map((item) => `<div class="stock-row"><strong>${item.name}</strong><span>Atual ${number(item.stock, 2)} | mínimo ${number(item.min, 2)}</span></div>`)
          .join("") || `<div class="empty-note">Sem alertas de mínimo.</div>`}
      </div>
    </article>
  `;
  const inventoryViews = {
    kombuchas: () => {
      return `
        <section class="stock-kombucha-layout">
          ${stockFlavorOverview()}
          <div class="stock-main-grid">
            <section class="stock-batch-list">
              ${stockRows.length ? stockRows.map(stockBatchCard).join("") : `<article class="admin-card"><p class="empty-note">Nenhum lote aprovado ainda.</p></article>`}
            </section>
            ${stockAlerts}
          </div>
        </section>
      `;
    },
    ingredients: () =>
      table(
        [
          { label: "Ingrediente" },
          { label: "Categoria" },
          { label: "Fornecedor" },
          { label: "Estoque", num: true },
          { label: "Mínimo", num: true },
          { label: "Custo", num: true },
          { label: "Status" },
        ],
        state.ingredients.map((item) => {
          return `
            <tr>
              <td><strong>${item.name}</strong><br><span>${item.location || ""}</span></td>
              <td>${item.category || "-"}</td>
              <td>${item.supplier || "-"}</td>
              <td class="num">${number(item.stock, 3)} ${item.purchaseUnit}</td>
              <td class="num">${number(item.min, 3)} ${item.purchaseUnit}</td>
              <td class="num">${brl(item.costPerUnit)} / ${item.purchaseUnit}</td>
              <td>${ingredientStatusBadge(item)}</td>
            </tr>
          `;
        }),
      ),
    labels: () =>
      table(
        [
          { label: "Rótulo" },
          { label: "Fornecedor" },
          { label: "Estoque", num: true },
          { label: "Mínimo", num: true },
          { label: "Custo", num: true },
          { label: "Status" },
        ],
        materialRows(state.packaging.filter((item) => inferPackagingType(item) === "label")),
      ),
    bottles: () =>
      table(
        [
          { label: "Garrafa / tampa" },
          { label: "Fornecedor" },
          { label: "Estoque", num: true },
          { label: "Mínimo", num: true },
          { label: "Custo", num: true },
          { label: "Status" },
        ],
        materialRows(state.packaging.filter((item) => inferPackagingType(item) === "bottle")),
      ),
  };
  if (currentStockView === "kombuchas") {
    return `
      ${pageHead("Estoque", "Resumo simples por sabor, reservas por cliente e lotes disponíveis.", actionButton("stock-adjustment", "Ajuste com motivo", "tune"))}
      <div class="module-tabs">${viewButtons}</div>
      ${inventoryViews.kombuchas()}
    `;
  }
  return `
    ${pageHead("Estoque", "Escolha o tipo de estoque para ver saldos sem poluição visual.", actionButton("stock-adjustment", "Ajuste com motivo", "tune"))}
    <div class="module-tabs">${viewButtons}</div>
    ${inventoryViews[currentStockView]?.() || inventoryViews.kombuchas()}
  `;
}

function renderPackaging() {
  const rows = state.packaging
    .filter((item) => matchesSearch(item))
    .map((item) => {
      const hasMinimum = Number(item.min) > 0;
      const product = byId("products", item.productId);
      return `
        <tr>
          <td><strong>${item.name}</strong><br><span>${item.location}</span></td>
          <td>${inferPackagingType(item)}<br><span>${product ? product.flavor : "Genérico"}</span></td>
          <td>${item.supplier}</td>
          <td class="num">${number(item.stock)} ${item.unit}</td>
          <td class="num">${number(item.min)} ${item.unit}</td>
          <td class="num">${brl(item.costEach)}</td>
          <td><span class="status ${hasMinimum ? statusClass(item.stock / item.min) : "warn"}">${hasMinimum ? (item.stock <= item.min ? "baixo" : "bom") : "sem mínimo"}</span></td>
          <td>${rowActions([tableAction(`edit-packaging:${item.id}`, "Editar material"), tableAction(`delete-packaging:${item.id}`, "Excluir material", "delete", "danger")])}</td>
        </tr>
      `;
    });
  return `
    ${pageHead("Embalagens", "Garrafas, tampas, rótulos, caixas e materiais que entram no custo por garrafa.", actionButton("new-packaging", "Novo material", "add"))}
    ${table(
      [
        { label: "Item" },
        { label: "Tipo / sabor" },
        { label: "Fornecedor" },
        { label: "Estoque", num: true },
        { label: "Mínimo", num: true },
        { label: "Custo unitário", num: true },
        { label: "Status" },
        { label: "Ações" },
      ],
      rows,
      940,
    )}
  `;
}

function renderSales() {
  const range = salesPeriodRange();
  const periodSales = state.sales
    .filter((sale) => saleDateInRange(sale.date, range))
    .filter((item) => matchesSearch(item));
  const periodRevenue = periodSales.reduce((sum, sale) => sum + saleRevenue(sale), 0);
  const periodQty = periodSales.reduce((sum, sale) => sum + Number(sale.qty || 0), 0);
  const periodCustomers = new Set(periodSales.map((sale) => normalizeText(sale.customerName || sale.partner)).filter(Boolean)).size;
  const customerRows = customerStats()
    .slice(0, 8)
    .map((customer) => `
      <tr>
        <td><strong>${customer.name}</strong></td>
        <td class="num">${number(customer.orders)}</td>
        <td class="num">${number(customer.qty)}</td>
        <td class="num">${brl(customer.revenue)}</td>
        <td>${customer.lastOrder || "-"}</td>
        <td>${customer.nextOrder || "Sem padrão ainda"}</td>
      </tr>
    `);
  const salesCards = periodSales
    .map((sale) => {
      const revenue = saleRevenue(sale);
      const batch = state.batches.find((item) => item.code === sale.batchCode);
      const product = byId("products", sale.productId) || productForBatch(batch);
      const cogs = Number(sale.qty) * (batch ? batchCost(batch).batchCostPerBottle : 0);
      return `
        <article class="sale-compact-card">
          <div class="sale-compact-head">
            <div>
              <strong>${escapeHtml(sale.customerName || sale.partner || "Sem cliente")}</strong>
              <span>${escapeHtml(shortDate(sale.date))} | ${escapeHtml(sale.movementType || "venda")}</span>
            </div>
            <b>${number(sale.qty)} un</b>
          </div>
          <div class="sale-compact-product">
            <strong>${escapeHtml(product ? product.flavor : sale.flavor || "Produto")}</strong>
            <span>${escapeHtml(sale.batchCode || "Sem lote")}${sale.note ? ` | ${escapeHtml(sale.note)}` : ""}</span>
          </div>
          <div class="sale-compact-totals">
            <span><small>Valor</small><strong>${brl(revenue)}</strong></span>
            <span><small>Lucro</small><strong>${brl(revenue - cogs)}</strong></span>
          </div>
          <div class="sale-compact-actions">${rowActions([tableAction(`edit-sale:${sale.id}`, "Editar venda"), tableAction(`delete-sale:${sale.id}`, "Excluir venda", "delete", "danger")])}</div>
        </article>
      `;
    })
    .join("");
  return `
    ${pageHead("Vendas", "Registre vendas, perdas, brindes e consumo próprio por lote para manter estoque e CRM atualizados.", `${actionButton("new-sale", "Nova saída", "add")} ${actionButton("export-sales", "CSV", "download", "btn-outline")}`)}
    <section class="admin-card sales-period-panel">
      <div class="sales-period-head">
        <div>
          <h3>Movimentações do período</h3>
          <p>${escapeHtml(salesPeriodLabel(range))}</p>
        </div>
        <div class="segmented sales-period-filter" aria-label="Filtrar vendas por período">
          ${[
            ["day", "Dia"],
            ["week", "Semana"],
            ["month", "Mês"],
            ["custom", "Personalizado"],
          ].map(([value, label]) => `<button type="button" class="${currentSalesPeriod === value ? "is-active" : ""}" data-sales-period="${value}" aria-pressed="${currentSalesPeriod === value}">${label}</button>`).join("")}
        </div>
      </div>
      ${currentSalesPeriod === "custom" ? `
        <div class="sales-custom-range">
          <label class="field"><span>De</span><input type="date" data-sales-custom="start" value="${salesCustomStart}"></label>
          <label class="field"><span>Até</span><input type="date" data-sales-custom="end" value="${salesCustomEnd}"></label>
        </div>
      ` : ""}
      <div class="sales-period-summary">
        <span><small>Garrafas</small><strong>${number(periodQty)}</strong></span>
        <span><small>Valor</small><strong>${brl(periodRevenue)}</strong></span>
        <span><small>Clientes</small><strong>${number(periodCustomers)}</strong></span>
      </div>
    </section>
    <section class="sales-compact-list">${salesCards || `<article class="admin-card"><p class="empty-note">Nenhuma movimentação encontrada neste período.</p></article>`}</section>
    <details class="admin-card order-secondary-panel sales-customer-history">
      <summary>Histórico e frequência por cliente</summary>
      ${table(
        [
          { label: "Cliente" },
          { label: "Pedidos", num: true },
          { label: "Garrafas", num: true },
          { label: "Receita", num: true },
          { label: "Último pedido" },
          { label: "Próximo estimado" },
        ],
        customerRows,
      )}
    </details>
  `;
}

function orderCard(order) {
  const items = orderItems(order);
  const due = orderPaymentDueDate(order);
  const receivableStatus = orderReceivableStatus(order);
  const itemRows = items.length
    ? items
        .map((item) => {
          const reserved = orderItemReservedQty(item);
          const qty = orderItemOutstandingQty(item);
          const delivered = orderItemDeliveredQty(item);
          const missing = Math.max(0, qty - reserved);
          const percent = qty ? Math.min(100, (reserved / qty) * 100) : 0;
          const batches = orderItemBatchCodes(item).join(", ");
          return `
            <div class="order-mini-row">
              <div class="order-mini-main">
                <strong>${escapeHtml(orderProductText(item))}</strong>
                <span>${number(reserved)}/${number(qty)} reservado${delivered ? ` | ${number(delivered)} entregue` : ""}${batches ? ` | lote ${escapeHtml(batches)}` : ""}</span>
                <i><b style="width:${percent}%"></b></i>
              </div>
              <div class="order-mini-count ${missing ? "is-missing" : "is-ready"}">
                <strong>${missing ? `${number(missing)} faltando` : "completo"}</strong>
                <span>${escapeHtml(item.productionStatus || "pendente")}</span>
              </div>
            </div>
          `;
        })
        .join("")
    : `<p class="mini-empty">Pedido sem itens.</p>`;
  return `
    <article class="order-card">
      <div class="order-card-head">
        <div>
          <span class="eyebrow">${escapeHtml(order.orderDate || "Pedido")}</span>
          <strong>${escapeHtml(orderClientDisplayName(order))}</strong>
          <small>${escapeHtml(orderClientTypeLabel(order.clientType))}${order.whatsapp ? ` | ${escapeHtml(order.whatsapp)}` : ""}</small>
        </div>
        <div class="order-card-side">
          ${orderStatusBadge(order.status)}
          <strong>${brl(orderTotal(order))}</strong>
        </div>
      </div>
      <div class="order-meta-grid">
        <span><b>Tipo</b>${escapeHtml(orderClientTypeLabel(order.clientType))}</span>
        <span><b>Quantidade</b>${number(orderOutstandingQuantity(order))} pendente(s)<small>${number(orderDeliveredQuantity(order))} entregue(s) de ${number(orderQuantity(order))}</small></span>
        <span><b>Previsão</b>${order.estimatedReadyDate || "-"}<small>${escapeHtml(orderDateNote(order))}</small></span>
        <span><b>Entrega</b>${order.deliveredAt || "pendente"}<small>${due ? `Receber até ${due}` : "Sem cobrança aberta"}</small></span>
        <span><b>Pagamento</b>${order.status === "entregue" ? receivableStatus : "ainda não entregue"}</span>
      </div>
      <div class="order-mini-list">
        ${itemRows}
      </div>
      <div class="order-card-actions">
        ${rowActions([tableAction(`delivery-proof:${order.id}`, "PDF da entrega", "picture_as_pdf"), tableAction(`edit-order:${order.id}`, "Editar pedido"), tableAction(`delete-order:${order.id}`, "Excluir pedido", "delete", "danger")])}
      </div>
    </article>
  `;
}

function orderFlowStatusButton(order, status) {
  const current = order.status || "recebido";
  return `
    <button class="order-status-chip ${current === status ? "is-active" : ""}" type="button" data-action="order-status:${order.id}:${status}" ${current === status ? "aria-current=\"true\"" : ""}>
      ${escapeHtml(status)}
    </button>
  `;
}

function orderCompactCard(order) {
  const items = orderItems(order);
  const qty = orderOutstandingQuantity(order);
  const originalQty = orderQuantity(order);
  const delivered = orderDeliveredQuantity(order);
  const reserved = items.reduce((sum, item) => sum + orderItemReservedQty(item), 0);
  const missing = Math.max(0, qty - reserved);
  const percent = qty ? Math.min(100, (reserved / qty) * 100) : 0;
  const due = order.neededBy || order.estimatedReadyDate || "";
  const itemRows = items.length
    ? items
        .map((item) => {
          const itemQty = orderItemOutstandingQty(item);
          const itemDelivered = orderItemDeliveredQty(item);
          const itemReady = orderItemReservedQty(item);
          const itemMissing = Math.max(0, itemQty - itemReady);
          return `
            <li>
              <span>${escapeHtml(orderFlavorText(item))}</span>
              <strong>${number(itemReady)}/${number(itemQty)}</strong>
              <small>${itemMissing ? `${number(itemMissing)} faltando` : "ok"}${itemDelivered ? ` | ${number(itemDelivered)} entregue` : ""}</small>
            </li>
          `;
        })
        .join("")
    : `<li><span>Sem itens</span><strong>-</strong><small>-</small></li>`;
  return `
    <details class="order-compact-card">
      <summary>
        <div class="order-compact-main">
          <strong>${escapeHtml(orderClientDisplayName(order))}</strong>
          <span>${number(reserved)}/${number(qty)} pronto${missing ? ` | ${number(missing)} faltando` : " | completo"}</span>
        </div>
        <div class="order-compact-side">
          ${orderStatusBadge(order.status)}
          <b>${due ? shortDate(due) : "sem prazo"}</b>
        </div>
      </summary>
      <div class="order-compact-body">
        <div class="order-compact-progress" aria-label="${number(reserved)} de ${number(qty)} garrafas separadas">
          <i style="width:${percent}%"></i>
        </div>
        <div class="order-compact-facts">
          <span><b>Prazo</b>${due ? escapeHtml(shortDate(due)) : "-"}</span>
          <span><b>Valor</b>${brl(orderTotal(order))}</span>
          <span><b>Saldo</b>${number(qty)} pendente(s)<small>${number(delivered)} entregue(s) de ${number(originalQty)}</small></span>
        </div>
        <ul class="order-compact-items">${itemRows}</ul>
        <div class="order-status-rail" aria-label="Alterar status do pedido">
          ${ORDER_FLOW_STATUSES.map((status) => orderFlowStatusButton(order, status)).join("")}
        </div>
        <div class="order-compact-actions">
          ${actionButton(`delivery-proof:${order.id}`, "PDF da entrega", "picture_as_pdf", "btn-primary")}
          ${actionButton(`edit-order:${order.id}`, "Editar detalhes", "edit", "btn-outline")}
        </div>
      </div>
    </details>
  `;
}

function renderOrders() {
  const orders = state.orders || [];
  const filteredOrders = orders.filter((order) => matchesSearch(order));
  const openOrders = orders.filter(isOpenOrder);
  const inProduction = orders.filter((order) => order.status === "em produção");
  const dueSoon = openOrders.filter((order) => {
    const days = daysUntil(order.estimatedReadyDate);
    return days != null && days <= 7;
  });
  return `
    ${pageHead(
      "Pedidos",
      "Acompanhe pedidos por cliente e atualize status em poucos toques.",
      `${actionButton("new-order", "Novo pedido", "add")} ${actionButton("export-orders", "CSV", "download", "btn-outline")}`,
    )}
    <section class="order-list order-compact-list">
      ${filteredOrders.length ? filteredOrders.map(orderCompactCard).join("") : `<article class="admin-card"><p class="empty-note">Nenhum pedido ainda. Use “Novo pedido” para começar.</p></article>`}
    </section>
    <section class="metric-grid order-metrics-compact">
      ${metric("Pedidos abertos", number(openOrders.length), `${number(openOrders.reduce((sum, order) => sum + orderOutstandingQuantity(order), 0))} garrafas no pipeline`, "pending_actions")}
      ${metric("Em produção", number(inProduction.length), "Pedidos marcados como em produção", "factory")}
      ${metric("Atenção 7 dias", number(dueSoon.length), "Prontos, atrasados ou próximos da data", "event_upcoming")}
      ${metric("Valor em pedidos", brl(openOrders.reduce((sum, order) => sum + orderTotal(order), 0)), "Receita prevista em pipeline", "request_quote")}
      ${metric("A receber", brl(orders.reduce((sum, order) => sum + orderReceivableValue(order), 0)), "15 dias após entrega", "payments")}
    </section>
    <details class="admin-card order-production-card order-secondary-panel">
      <summary>Fila de produção por sabor</summary>
      <div class="production-chip-grid">
        ${orderProductionRows().length ? orderProductionRows().map((row) => `<div class="production-chip"><strong>${escapeHtml(row.flavor)}</strong><span>${number(row.missing)} faltando</span><small>${number(row.reserved)} reservado de ${number(row.ordered)}${row.nextDue ? ` | pronto até ${row.nextDue}` : ""}</small>${renderProductionClientList(row)}</div>`).join("") : `<p class="empty-note">Sem produção pendente para pedidos abertos.</p>`}
      </div>
    </details>
  `;
}

function renderLeads() {
  const rows = state.leads
    .filter((lead) => matchesSearch(lead))
    .map((lead) => `
      <tr>
        <td><strong>${lead.type === "revenda" ? "Revenda" : "Contato"}</strong><br><span>${new Date(lead.createdAt).toLocaleString("pt-BR")}</span></td>
        <td><strong>${lead.name || "Sem nome"}</strong><br><span>${lead.whatsapp || "Sem WhatsApp"}</span></td>
        <td>${lead.business || "-"}<br><span>${lead.businessType || ""}${lead.location ? ` | ${lead.location}` : ""}</span></td>
        <td>${lead.instagram || "-"}</td>
        <td>${lead.message || "-"}</td>
        <td>
          <select class="admin-select compact-select" data-lead-status="${lead.id}">
            ${["novo", "contatado", "qualificado", "ganho", "perdido"].map((status) => `<option value="${status}" ${lead.status === status ? "selected" : ""}>${status}</option>`).join("")}
          </select>
        </td>
        <td>${rowActions([tableAction(`delete-lead:${lead.id}`, "Excluir lead", "delete", "danger")])}</td>
      </tr>
    `);
  return `
    ${pageHead(
      "Leads CRM",
      `Leads capturados no site público e notificações enviadas para ${state.notifications.adminEmail}.`,
      `${actionButton("export-leads", "Exportar CSV", "download", "btn-outline")}`,
    )}
    <section class="metric-grid">
      ${metric("Leads novos", number(state.leads.filter((lead) => lead.status === "novo").length), "Ainda sem contato", "mark_email_unread")}
      ${metric("Revenda", number(state.leads.filter((lead) => lead.type === "revenda").length), "Formulário seja revendedor", "storefront")}
      ${metric("Contato geral", number(state.leads.filter((lead) => lead.type === "contato").length), "Mensagens do site", "chat")}
      ${metric("Email admin", state.notifications.adminEmail, "Canal de notificação", "alternate_email")}
    </section>
    ${table(
      [
        { label: "Origem / data" },
        { label: "Contato" },
        { label: "Negócio / região" },
        { label: "Instagram" },
        { label: "Mensagem" },
        { label: "Status" },
        { label: "Ações" },
      ],
      rows,
      1240,
    )}
  `;
}

function renderPartners() {
  const statsByName = new Map(customerStats().map((customer) => [normalizeText(customer.name), customer]));
  const rows = state.partners
    .filter((item) => matchesSearch(item))
    .map(
      (partner) => {
        const stats = statsByName.get(normalizeText(partner.name));
        return `
        <tr>
          <td><strong>${partner.name}</strong><br><span>${partner.type} | ${partner.neighborhood}</span></td>
          <td>${partner.whatsapp}</td>
          <td>${partner.instagram}</td>
          <td>${partner.flavors}</td>
          <td>${partner.terms}</td>
          <td>${partner.lastDelivery || stats?.lastOrder || "-"}</td>
          <td>${stats?.nextOrder || "Sem padrão ainda"}<br><span>${stats ? `${number(stats.qty)} garrafas no histórico` : ""}</span></td>
          <td><span class="status ${partner.visible ? "good" : "warn"}">${partner.visible ? "público" : "oculto"}</span></td>
          <td>${rowActions([tableAction(`edit-partner:${partner.id}`, "Editar parceiro"), tableAction(`delete-partner:${partner.id}`, "Excluir parceiro", "delete", "danger")])}</td>
        </tr>
      `;
      },
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
        { label: "Próximo estimado" },
        { label: "Visibilidade" },
        { label: "Ações" },
      ],
      rows,
      1140,
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
          <td>${rowActions([tableAction(`edit-expense:${expense.id}`, "Editar despesa"), tableAction(`delete-expense:${expense.id}`, "Excluir despesa", "delete", "danger")])}</td>
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
        { label: "Ações" },
      ],
      rows,
      940,
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
          <img data-cms-preview="image-${index}" src="${escapeHtml(image.url)}" alt="${escapeHtml(image.label)}" loading="lazy">
        </div>
        <div class="image-fields">
          <input type="hidden" data-cms-image="${index}" data-field="key" value="${escapeHtml(image.key)}">
          <label class="field"><span>Imagem</span><input data-cms-image="${index}" data-field="label" value="${escapeHtml(image.label)}"></label>
          <label class="field"><span>Tamanho perfeito</span><input data-cms-image="${index}" data-field="recommended" value="${escapeHtml(image.recommended)}" readonly></label>
          <label class="field field-full upload-field"><span>Upload com ajuste automático</span><input type="file" accept="image/*" data-cms-image-upload="${index}"><small>${escapeHtml(image.uploadedName ? `${image.uploadedName} ajustada para ${image.resizedSize || image.recommended}` : `A imagem será encaixada em ${image.recommended}, sem distorcer.`)}</small></label>
          <label class="field field-full"><span>URL da imagem</span><input data-cms-image="${index}" data-field="url" value="${escapeHtml(image.url)}"></label>
        </div>
      </article>
    `,
  ).join("");
  const flavorRows = normalizeCmsFlavors(state.cms.flavors).map((flavor, index) => {
    const categoryOptions = Array.from(new Set([...FLAVOR_CATEGORIES, flavor.profile].filter(Boolean)))
      .map((category) => `<option value="${escapeHtml(category)}" ${category === flavor.profile ? "selected" : ""}>${escapeHtml(category)}</option>`)
      .join("");
    return `
      <article class="flavor-cms-control">
        <div class="image-preview flavor-admin-preview">
          <img data-cms-preview="flavor-${index}" src="${escapeHtml(flavor.imageUrl || `assets/menu-bottles/${flavor.slug}.png`)}" alt="${escapeHtml(flavor.name)}" loading="lazy">
        </div>
        <div class="flavor-cms-fields">
          <input type="hidden" data-cms-flavor="${index}" data-field="slug" value="${escapeHtml(flavor.slug)}">
          <input type="hidden" data-cms-flavor="${index}" data-field="imageKey" value="${escapeHtml(flavor.imageKey)}">
          <label class="field"><span>Sabor</span><input data-cms-flavor="${index}" data-field="name" value="${escapeHtml(flavor.name)}"></label>
          <label class="field"><span>Categoria</span><select class="admin-select" data-cms-flavor="${index}" data-field="profile">${categoryOptions}</select></label>
          <label class="field"><span>Ordem</span><input type="number" min="1" step="1" data-cms-flavor="${index}" data-field="order" value="${escapeHtml(flavor.order)}"></label>
          <label class="field checkbox-field"><span>Visível no site</span><input type="checkbox" data-cms-flavor="${index}" data-field="visible" ${flavor.visible ? "checked" : ""}></label>
          <label class="field"><span>Tamanho perfeito</span><input data-cms-flavor="${index}" data-field="recommended" value="${escapeHtml(flavor.recommended || FLAVOR_IMAGE_RECOMMENDED)}" readonly></label>
          <label class="field field-full upload-field"><span>Upload com ajuste automático</span><input type="file" accept="image/*" data-cms-flavor-upload="${index}"><small>${escapeHtml(flavor.uploadedName ? `${flavor.uploadedName} ajustada para ${flavor.resizedSize || flavor.recommended || FLAVOR_IMAGE_RECOMMENDED}` : `A imagem será encaixada em ${flavor.recommended || FLAVOR_IMAGE_RECOMMENDED}, sem distorcer.`)}</small></label>
          <label class="field field-full"><span>URL da foto</span><input data-cms-flavor="${index}" data-field="imageUrl" value="${escapeHtml(flavor.imageUrl || "")}"></label>
          <label class="field field-full"><span>Ingredientes separados por vírgula</span><input data-cms-flavor="${index}" data-field="ingredients" value="${escapeHtml(flavor.ingredients || "")}"></label>
          <label class="field field-full"><span>Texto do card</span><input data-cms-flavor="${index}" data-field="angle" value="${escapeHtml(flavor.angle || "")}"></label>
          <label class="field field-full"><span>Texto do detalhe</span><textarea data-cms-flavor="${index}" data-field="description">${escapeHtml(flavor.description || "")}</textarea></label>
        </div>
      </article>
    `;
  }).join("");
  return `
    ${pageHead("CMS Público", "Controle headlines, sabores, parceiros, SEO, WhatsApp e anúncios do site público.", `${actionButton("new-cms-flavor", "Novo sabor", "add", "btn-outline")} ${actionButton("save-cms", "Salvar CMS", "save")}`)}
    <section class="admin-grid">
      <form class="admin-card" id="cmsForm">
        <div class="input-grid">
          <label class="field field-full"><span>Headline da home</span><input name="headline" value="${escapeHtml(state.cms.headline)}"></label>
          <label class="field field-full"><span>Subheadline</span><textarea name="subheadline">${escapeHtml(state.cms.subheadline)}</textarea></label>
          <label class="field"><span>WhatsApp</span><input name="whatsapp" value="${escapeHtml(state.cms.whatsapp)}"></label>
          <label class="field field-full"><span>Link oficial comprar / onde encontrar</span><input name="officialMapUrl" value="${escapeHtml(state.cms.officialMapUrl || "")}"></label>
          <label class="field"><span>Anúncio</span><input name="announcement" value="${escapeHtml(state.cms.announcement)}"></label>
        </div>
      </form>
      <article class="admin-card">
        <h3>Como publicar alterações</h3>
        <p class="lead" style="font-size:1rem">${cloudSyncEnabled && cloudSyncConfigured ? "Salvar CMS publica imagens, textos, sabores e parceiros na base da nuvem, visivel em qualquer dispositivo apos o deploy/cache atualizar." : "No momento isto ainda nao esta publicando de forma global. Configure Supabase na Vercel para que celular, desktop e site publico leiam a mesma informacao."}</p>
      </article>
    </section>
    <section class="admin-card" style="margin-top:16px">
      <h3>Imagens gerais do site público</h3>
      <p class="lead" style="font-size:1rem">Cole uma URL ou envie um arquivo. Se a imagem for maior que o espaço, o sistema redimensiona e encaixa no tamanho recomendado sem distorcer.</p>
      <div class="image-control-grid">${imageRows}</div>
    </section>
    <section class="admin-card" style="margin-top:16px">
      <h3>Cardápio público: fotos, ordem e categorias</h3>
      <p class="lead" style="font-size:1rem">Reordene sabores, mude categorias, esconda itens e envie fotos melhores sem editar código. Use imagens verticais em alta para o modal abrir nítido.</p>
      <div class="flavor-cms-grid">${flavorRows}</div>
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
    "Users", "Roles", "Products / EAN", "Product Variants", "Ingredients", "Ingredient Categories", "Suppliers", "Purchases", "Purchase Items", "Packaging Materials",
    "Recipes", "Recipe Ingredients", "Recipe Versions", "Production Batches", "Batch Ingredients Used", "Finished Product Stock",
    "Stock Movements", "Flavors", "Partners", "Sales", "Sale Items", "Leads", "Lead Status History",
    "Expenses", "Expense Categories", "Cost Assumptions", "Reports", "CMS Pages", "Media Library", "Audit Logs",
  ];
  return `
    ${pageHead("Arquitetura e Banco de Dados", "Estrutura sugerida para evoluir o site atual para um sistema seguro com autenticação, roles e histórico.", actionButton("reset-demo", "Limpar dados", "restart_alt", "btn-danger", "schema"))}
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

function auditDetailWithFlavor(detail) {
  return state.batches.reduce((result, batch) => {
    const code = String(batch.code || "").trim();
    const product = productForBatch(batch);
    const flavor = String(batch.flavor || product?.flavor || product?.name || "").trim();
    if (!code || !flavor || !result.includes(code) || normalizeText(result).includes(normalizeText(flavor))) return result;

    const escapedCode = code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const withLabeledBatch = result.replace(new RegExp(`lote\\s+${escapedCode}`, "gi"), `sabor ${flavor} | lote ${code}`);
    return withLabeledBatch === result ? result.split(code).join(`${flavor} | lote ${code}`) : withLabeledBatch;
  }, String(detail || ""));
}

function renderAuditRows(limit) {
  return state.audit
    .slice(0, limit)
    .map((entry) => `<div class="audit-row"><strong>${escapeHtml(entry.action)}</strong><span>${escapeHtml(new Date(entry.at).toLocaleString("pt-BR"))} | ${escapeHtml(entry.user)}</span><span>${escapeHtml(auditDetailWithFlavor(entry.detail))}</span></div>`)
    .join("");
}

function matchesSearch(item) {
  if (!globalSearch) return true;
  return normalizeText(JSON.stringify(item)).includes(normalizeText(globalSearch));
}

function enhanceSelectSearch(container = document) {
  if (!container) return;
  container.querySelectorAll("select").forEach((select) => {
    if (select.dataset.searchEnhanced === "true" || (select.options.length < 8 && select.dataset.forceSearch !== "true")) return;
    select.dataset.searchEnhanced = "true";
    const wrapper = document.createElement("div");
    wrapper.className = "select-search-wrap";
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    const input = document.createElement("input");
    input.type = "search";
    input.className = "select-search";
    input.placeholder = "Digite para filtrar...";
    input.autocomplete = "off";
    wrapper.insertBefore(input, select);
    const options = Array.from(select.options).map((option) => ({
      option,
      haystack: normalizeText(`${option.textContent} ${option.value}`),
    }));
    input.addEventListener("input", () => {
      const query = normalizeText(input.value);
      options.forEach(({ option, haystack }) => {
        option.hidden = Boolean(query) && !haystack.includes(query);
      });
    });
  });
}

function variantPickerTemplate(choices, selectedId, fieldAttribute = 'name="productId"') {
  const selected = choices.find((choice) => choice.id === selectedId) || choices[0] || {};
  const flavors = [...new Set(choices.map((choice) => choice.flavor).filter(Boolean))];
  const sizes = choices
    .filter((choice) => choice.flavor === selected.flavor)
    .sort((a, b) => Number(a.sizeMl || 0) - Number(b.sizeMl || 0));
  return `
    <div class="variant-picker" data-variant-picker>
      <label class="field"><span>Sabor</span><select data-variant-flavor data-force-search="true">${flavors.map((flavor) => `<option value="${escapeHtml(flavor)}" ${flavor === selected.flavor ? "selected" : ""}>${escapeHtml(flavor)}</option>`).join("")}</select></label>
      <label class="field"><span>Tamanho</span><select data-variant-size>${sizes.map((choice) => `<option value="${choice.sizeMl}" ${choice.id === selected.id ? "selected" : ""}>${number(choice.sizeMl)}ml</option>`).join("")}</select></label>
      <input type="hidden" ${fieldAttribute} data-variant-choice value="${escapeHtml(selected.id || "")}">
    </div>
  `;
}

function bindVariantPicker(root, choices, onChange = () => {}) {
  const picker = root?.matches?.("[data-variant-picker]") ? root : root?.querySelector?.("[data-variant-picker]");
  if (!picker || picker.dataset.variantBound === "true") return;
  picker.dataset.variantBound = "true";
  const flavorSelect = picker.querySelector("[data-variant-flavor]");
  const sizeSelect = picker.querySelector("[data-variant-size]");
  const valueField = picker.querySelector("[data-variant-choice]");
  const currentChoice = () => choices.find((choice) => choice.id === valueField.value) || null;
  const renderSizes = (preferredSize) => {
    const available = choices
      .filter((choice) => choice.flavor === flavorSelect.value)
      .sort((a, b) => Number(a.sizeMl || 0) - Number(b.sizeMl || 0));
    const selected = available.find((choice) => Number(choice.sizeMl) === Number(preferredSize)) || available[0];
    sizeSelect.innerHTML = available.map((choice) => `<option value="${choice.sizeMl}" ${choice.id === selected?.id ? "selected" : ""}>${number(choice.sizeMl)}ml</option>`).join("");
    valueField.value = selected?.id || "";
    onChange(selected || null);
  };
  flavorSelect.addEventListener("change", () => renderSizes(currentChoice()?.sizeMl));
  sizeSelect.addEventListener("change", () => {
    const selected = choices.find((choice) => choice.flavor === flavorSelect.value && Number(choice.sizeMl) === Number(sizeSelect.value));
    valueField.value = selected?.id || "";
    onChange(selected || null);
  });
}

function productVariantChoices(products = state.products) {
  return products.map((product) => ({ id: product.id, flavor: product.flavor || product.name || "Kombucha", sizeMl: Number(product.sizeMl || BASE_BOTTLE_SIZE_ML) }));
}

function recipeVariantChoices(recipes = state.recipes) {
  return recipes.map((recipe) => {
    const product = byId("products", recipe.productId);
    return { id: recipe.id, flavor: recipe.flavor || product?.flavor || "Kombucha", sizeMl: Number(recipe.bottleMl || product?.sizeMl || BASE_BOTTLE_SIZE_ML) };
  });
}

function populateSaleBatchOptions(form, stockRows, productId, preferredBatchCode = "") {
  const batchSelect = form.elements.batchCode;
  const matches = stockRows.filter((row) => row.product?.id === productId || row.productId === productId);
  const selectedCode = matches.some((row) => row.code === preferredBatchCode) ? preferredBatchCode : matches[0]?.code || "";
  batchSelect.innerHTML = matches.map((row) => `<option value="${escapeHtml(row.code)}" data-retail="${productRetailPrice(row.product)}" data-wholesale="${productWholesalePrice(row.product)}" data-stock="${row.stock}" ${row.code === selectedCode ? "selected" : ""}>${escapeHtml(row.code)} (${number(row.stock)} disp.)</option>`).join("");
  batchSelect.disabled = !matches.length;
  return selectedCode;
}

function render() {
  const view = {
    dashboard: renderDashboard,
    products: renderProducts,
    ingredients: renderIngredients,
    purchases: renderPurchases,
    suppliers: renderSuppliers,
    recipes: renderRecipes,
    costs: renderCosts,
    batches: renderBatches,
    stock: renderStock,
    packaging: renderPackaging,
    sales: renderSales,
    orders: renderOrders,
    leads: renderLeads,
    partners: renderPartners,
    expenses: renderExpenses,
    reports: renderReports,
    cms: renderCMS,
    schema: renderSchema,
  }[currentModule];
  document.querySelector("#adminContent").innerHTML = `${cloudSyncNotice()}${view()}`;
  applyLocaleToShell();
  bindModuleEvents();
  enhanceSelectSearch(document.querySelector("#adminContent"));
}

function setModule(module) {
  currentModule = module;
  document.querySelectorAll("#adminNav button").forEach((button) => button.classList.toggle("is-active", button.dataset.module === module));
  const mobileModuleSelector = document.querySelector("#mobileModuleSelector");
  if (mobileModuleSelector && mobileModuleSelector.value !== module) mobileModuleSelector.value = module;
  render();
}

function openPartnerEditorFromDashboard(partnerId) {
  const partner = byId("partners", partnerId);
  if (!partner) {
    window.alert("Parceiro não encontrado. Atualize a página e tente novamente.");
    return;
  }
  if (!canWrite("partners")) {
    window.alert("O perfil selecionado não tem permissão para editar parceiros.");
    return;
  }
  setModule("partners");
  window.requestAnimationFrame(() => editRecordForm("partners", partnerId, "Editar parceiro", partnerFields));
}

function openModal(title, eyebrow, body) {
  document.querySelector("#adminModalTitle").textContent = tr(title);
  document.querySelector("#adminModalEyebrow").textContent = tr(eyebrow);
  document.querySelector("#adminModalBody").innerHTML = body;
  document.querySelector("#adminModal").classList.add("is-open");
  applyLocaleToShell();
  enhanceSelectSearch(document.querySelector("#adminModalBody"));
}

function closeModal() {
  document.querySelector("#adminModal").classList.remove("is-open");
}

function upsertById(collection, records) {
  records.forEach((record) => {
    const nextRecord = clone(record);
    const index = state[collection].findIndex((item) => item.id === nextRecord.id);
    if (index >= 0) state[collection][index] = { ...state[collection][index], ...nextRecord };
    else state[collection].push(nextRecord);
  });
}

function restoreCostBase() {
  upsertById("products", PRODUCT_CATALOG_SEED);
  upsertById("ingredients", COST_INGREDIENT_SEED);
  upsertById("packaging", PACKAGING_SEED);
  upsertById("recipes", RECIPE_SEED);
  activeRecipeId = state.recipes[0]?.id || "";
  addAudit("Base dos prints restaurada", "Produtos EAN, ingredientes, embalagens e receitas 500ml atualizados.");
  render();
}

function productsForPriceScope(scope) {
  const filters = {
    all: () => true,
    operational: productIsOperational,
    active: productIsOperational,
    visible: productIsOperational,
    size500: (product) => Number(product.sizeMl) === 500,
    search: (product) => matchesSearch(product),
  };
  const filter = filters[scope] || filters.all;
  return state.products.filter(filter);
}

function syncRecipePricesForProducts(products, prices) {
  let recipeCount = 0;
  state.recipes.forEach((recipe) => {
    const product = products.find(
      (item) =>
        recipe.productId === item.id ||
        (!recipe.productId && recipe.flavor === item.flavor && Number(recipe.bottleMl) === Number(item.sizeMl)),
    );
    if (!product) return;
    if (prices.hasRetail) recipe.retailPrice = prices.retailPrice;
    if (prices.hasWholesale) recipe.wholesalePrice = prices.wholesalePrice;
    recipeCount += 1;
  });
  return recipeCount;
}

function globalPriceForm() {
  const retailDefault = commonProductPrice("retailPrice", state.settings.globalRetailPrice || GLOBAL_RETAIL_PRICE).toFixed(2);
  const wholesaleDefault = commonProductPrice("wholesalePrice", state.settings.globalWholesalePrice || GLOBAL_WHOLESALE_PRICE).toFixed(2);
  const searchLabel = globalSearch ? `Busca atual (${productsForPriceScope("search").length})` : "Busca atual";
  openModal(
    "Preço global",
    "Produtos / EAN",
    `
      <form id="globalPriceForm">
        <div class="input-grid">
          <label class="field field-full">
            <span>Aplicar em</span>
            <select name="scope">
              <option value="all">Todos os produtos (${state.products.length})</option>
              <option value="operational">Somente disponíveis (${productsForPriceScope("operational").length})</option>
              <option value="size500">Somente 500ml (${productsForPriceScope("size500").length})</option>
              <option value="search">${searchLabel}</option>
            </select>
          </label>
          <label class="field">
            <span>Novo preço varejo</span>
            <input name="retailPrice" type="number" min="0" step="0.01" placeholder="${retailDefault}" />
          </label>
          <label class="field">
            <span>Novo preço atacado</span>
            <input name="wholesalePrice" type="number" min="0" step="0.01" placeholder="${wholesaleDefault}" />
          </label>
          <label class="check-row field-full">
            <input name="syncRecipes" type="checkbox" checked />
            <span>Atualizar também os preços das receitas vinculadas para manter custos e margens alinhados</span>
          </label>
          <p class="empty-note field-full">Preencha varejo, atacado ou os dois. Campo em branco não será alterado.</p>
        </div>
        <button class="btn btn-primary" type="submit">
          <span class="material-symbols-outlined" aria-hidden="true">price_change</span>
          Aplicar preço global
        </button>
      </form>
    `,
  );
  document.querySelector("#globalPriceForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const retailRaw = String(data.get("retailPrice") || "").trim();
    const wholesaleRaw = String(data.get("wholesalePrice") || "").trim();
    const hasRetail = retailRaw !== "";
    const hasWholesale = wholesaleRaw !== "";
    if (!hasRetail && !hasWholesale) {
      window.alert("Informe pelo menos um preço para atualizar.");
      return;
    }
    const retailPrice = Number(retailRaw);
    const wholesalePrice = Number(wholesaleRaw);
    if ((hasRetail && !Number.isFinite(retailPrice)) || (hasWholesale && !Number.isFinite(wholesalePrice))) {
      window.alert("Informe preços válidos.");
      return;
    }
    const products = productsForPriceScope(data.get("scope"));
    if (!products.length) {
      window.alert("Nenhum produto encontrado para este filtro.");
      return;
    }
    products.forEach((product) => {
      if (hasRetail) product.retailPrice = retailPrice;
      if (hasWholesale) product.wholesalePrice = wholesalePrice;
    });
    if (hasRetail) state.settings.globalRetailPrice = retailPrice;
    if (hasWholesale) state.settings.globalWholesalePrice = wholesalePrice;
    state.settings.priceVersion = GLOBAL_PRICE_VERSION;
    const recipeCount = data.get("syncRecipes") === "on" ? syncRecipePricesForProducts(products, { hasRetail, hasWholesale, retailPrice, wholesalePrice }) : 0;
    const changed = [hasRetail ? `varejo ${brl(retailPrice)}` : "", hasWholesale ? `atacado ${brl(wholesalePrice)}` : ""].filter(Boolean).join(" | ");
    addAudit("Preço global atualizado", `${products.length} produtos | ${changed}${recipeCount ? ` | ${recipeCount} receitas` : ""}`);
    closeModal();
    render();
  });
}

function newProductForm() {
  const retailDefault = commonProductPrice("retailPrice", state.settings.globalRetailPrice || GLOBAL_RETAIL_PRICE).toFixed(2);
  const wholesaleDefault = commonProductPrice("wholesalePrice", state.settings.globalWholesalePrice || GLOBAL_WHOLESALE_PRICE).toFixed(2);
  openModal(
    "Novo produto",
    "Produtos / EAN",
    `
      <form id="productForm">
        <div class="input-grid">
          <label class="field"><span>Item</span><input name="item" placeholder="KMB013" required></label>
          <label class="field"><span>EAN-13</span><input name="ean" inputmode="numeric" placeholder="789..." maxlength="13"></label>
          <label class="field"><span>Sabor</span><input name="flavor" required></label>
          <label class="field"><span>Tamanho ml</span><input name="sizeMl" type="number" min="1" value="500" required></label>
          <label class="field"><span>Preço varejo</span><input name="retailPrice" type="number" min="0" step="0.01" value="${retailDefault}"></label>
          <label class="field"><span>Preço atacado</span><input name="wholesalePrice" type="number" min="0" step="0.01" value="${wholesaleDefault}"></label>
          <label class="field field-full"><span>Descrição</span><input name="description" placeholder="Kombucha Premium de 500ml - Sabor ..."></label>
          <div class="product-cost-summary field-full">
            <small>Custo por garrafa</small>
            <strong>Calculado após vincular a receita</strong>
            <span>Ingredientes e materiais definem este valor automaticamente.</span>
          </div>
          <label class="check-row field-full"><input name="operational" type="checkbox" checked> <span>Disponível no catálogo operacional</span></label>
          <p class="field-help field-full">Desative apenas se este sabor e tamanho não puderem ser usados em novos lançamentos internos. A publicação no site é controlada no CMS.</p>
        </div>
        <button class="btn btn-primary" type="submit">Salvar produto</button>
      </form>
    `,
  );
  document.querySelector("#productForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const product = {
      id: id("prod"),
      ean: data.ean,
      item: data.item,
      flavor: data.flavor,
      sizeMl: Number(data.sizeMl),
      description: data.description || `Kombucha Premium de ${data.sizeMl}ml - Sabor ${data.flavor}`,
      wholesalePrice: Number(data.wholesalePrice || 0),
      retailPrice: Number(data.retailPrice || 0),
      baselineCost: 0,
      status: data.operational === "on" ? "ativo" : "inativo",
      visible: data.operational === "on",
    };
    state.products.unshift(product);
    addAudit("Produto criado", productLabel(product));
    closeModal();
    render();
  });
}

function newIngredientForm() {
  openModal(
    "Novo ingrediente",
    "Ingredientes",
    `
      <form id="ingredientForm">
        <div class="input-grid">
          <label class="field field-full"><span>Nome</span><input name="name" required></label>
          <label class="field"><span>Categoria</span><input name="category" placeholder="fruta, chá, flor..."></label>
          <label class="field"><span>Fornecedor</span><input name="supplier"></label>
          <label class="field"><span>Unidade de estoque/custo</span><select name="purchaseUnit">${unitOptions("g")}</select></label>
          <label class="field"><span>Pacotes comprados</span><input name="packageCount" type="number" min="0" step="1" value="1"></label>
          <label class="field"><span>Conteúdo por pacote</span><input name="packageSize" type="number" min="0" step="0.001" placeholder="Ex: 100"></label>
          <label class="field"><span>Unidade do pacote</span><select name="packageUnit">${unitOptions("g")}</select></label>
          <label class="field"><span>Total pago</span><input name="packageTotal" type="number" min="0" step="0.01" placeholder="Ex: 40"></label>
          <label class="field"><span>Estoque atual</span><input name="stock" type="number" step="0.001" placeholder="auto"></label>
          <label class="field"><span>Estoque mínimo</span><input name="min" type="number" step="0.001" value="0"></label>
          <label class="field"><span>Vencimento</span><input name="expires" type="date"></label>
          <label class="field"><span>Local</span><input name="location"></label>
          <div class="result-card field-full" id="ingredientCostPreview">
            <small>Custo calculado</small>
            <strong>Preencha quantidade e valor</strong>
            <span>Ex.: 1 pacote x 100g por R$ 40 = R$ 0,40/g.</span>
          </div>
        </div>
        <button class="btn btn-primary" type="submit">Salvar ingrediente</button>
      </form>
    `,
  );
  const form = document.querySelector("#ingredientForm");
  const preview = document.querySelector("#ingredientCostPreview");
  const updatePreview = () => {
    const data = Object.fromEntries(new FormData(form).entries());
    const calc = ingredientPackageCost(data, data.purchaseUnit || "g");
    if (!calc.hasPurchaseCost) {
      preview.innerHTML = `<small>Custo calculado</small><strong>Preencha quantidade e valor</strong><span>Ex.: 1 pacote x 100g por R$ 40 = R$ 0,40/g.</span>`;
      return calc;
    }
    preview.innerHTML = `
      <small>Custo calculado</small>
      <strong>${brl(calc.costPerUnit)} / ${data.purchaseUnit || "g"}</strong>
      <span>${number(calc.qty, 3)} ${data.purchaseUnit || "g"} entram no estoque por ${brl(calc.total)}.</span>
    `;
    if (!form.elements.stock.value.trim()) form.elements.stock.value = inputNumber(calc.qty, 3);
    return calc;
  };
  form.addEventListener("input", updatePreview);
  form.addEventListener("change", updatePreview);
  updatePreview();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const calc = ingredientPackageCost(data, data.purchaseUnit || "g");
    const ingredient = findOrCreateIngredient({
      ...data,
      costPerUnit: calc.hasPurchaseCost ? calc.costPerUnit : "",
      stock: data.stock || (calc.hasPurchaseQty ? calc.qty : 0),
      min: data.min || 0,
    });
    ingredient.expires = data.expires || "";
    ingredient.location = data.location || "";
    addAudit("Ingrediente criado", `${ingredient.name}${calc.hasPurchaseCost ? ` | ${brl(calc.costPerUnit)}/${ingredient.purchaseUnit}` : " | custo pendente"}`);
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
          <label class="field"><span>Tipo de compra</span><select name="kind"><option value="stock">Entra no estoque/custo</option><option value="operational">Despesa operacional</option></select></label>
          <label class="field" data-purchase-mode-field><span>O que deseja fazer?</span><select name="itemMode"><option value="existing" selected>Atualizar item existente</option><option value="new">Cadastrar novo item</option></select></label>
          <label class="field" data-existing-purchase-field><span>Item existente</span><select name="stockKey" data-force-search="true"><option value="">Selecione para atualizar...</option>${purchaseStockOptions("", { includeNew: false })}</select></label>
          <label class="field"><span>Fornecedor</span><input name="supplier" value="${state.suppliers[0]?.name || ""}" required></label>
          <label class="field" data-new-purchase-field data-new-item-type><span>Tipo do novo item</span><select name="newItemCollection"><option value="ingredients" selected>Ingrediente</option><option value="packaging">Material / embalagem / outro</option></select></label>
          <label class="field" data-new-purchase-field><span data-new-description-label>Nome do novo item</span><input name="newItemName" placeholder="Ex: flor jasmim, lavanda, datador, caixa"></label>
          <label class="field" data-new-purchase-field data-new-stock-field><span>Categoria / tipo</span><input name="newCategory" placeholder="fruta, chá, embalagem..."></label>
          <label class="field" data-new-purchase-field data-new-stock-field><span>Unidade de estoque</span><select name="newPurchaseUnit">${unitOptions("g")}</select></label>
          <label class="field" data-stock-quantity-field><span data-package-count-label>Pacotes / unidades compradas</span><input name="packageCount" type="number" min="0" step="1" value="1" required></label>
          <label class="field" data-stock-quantity-field data-package-size-field><span>Conteúdo de cada pacote</span><input name="packageSize" type="number" min="0" step="0.001" required placeholder="Ex: 200"></label>
          <label class="field" data-stock-quantity-field data-package-unit-field><span>Unidade do pacote</span><select name="packageUnit">${unitOptions("g")}</select></label>
          <label class="field"><span>Total pago</span><input name="total" type="number" step="0.01" required></label>
          <label class="field" data-stock-cost-field><span data-unit-cost-label>Custo por unidade</span><input name="unitCost" type="number" min="0" step="0.000001" placeholder="Preenche o total automaticamente"></label>
          <label class="field"><span>Método</span><select name="method"><option>Pix</option><option>Boleto</option><option>Cartão</option><option>Dinheiro</option></select></label>
          <label class="field"><span>Quem comprou</span><input name="buyer" value="Owner / Admin"></label>
          <div class="result-card field-full" id="purchasePreview">
            <small>Total que entra no estoque</small>
            <strong>Preencha quantidade e valor</strong>
            <span>O custo unitário será calculado automaticamente.</span>
          </div>
        </div>
        <button class="btn btn-primary" type="submit">Registrar e atualizar estoque</button>
      </form>
    `,
  );
  const form = document.querySelector("#purchaseForm");
  const preview = document.querySelector("#purchasePreview");
  let purchaseCostSource = "total";
  const currentPurchaseStockUnit = () => {
    if (form.elements.kind.value === "operational") return "";
    if (form.elements.itemMode.value === "existing") {
      const target = stockItemFromKey(form.elements.stockKey.value);
      return stockUnitFor(target.collection, target.item, form.elements.packageUnit.value);
    }
    const matchingExisting = stockItemByName(form.elements.newItemCollection.value, form.elements.newItemName.value.trim());
    return matchingExisting ? stockUnitFor(form.elements.newItemCollection.value, matchingExisting, form.elements.packageUnit.value) : form.elements.newPurchaseUnit.value;
  };
  const updateNewFields = ({ suggestUnit = false } = {}) => {
    const isOperational = form.elements.kind.value === "operational";
    const isNewMode = form.elements.itemMode.value === "new";
    if (isNewMode && suggestUnit) {
      form.elements.newPurchaseUnit.value = form.elements.newItemCollection.value === "packaging" ? "un" : "g";
      form.elements.packageUnit.value = form.elements.newPurchaseUnit.value;
    }
    const stockUnit = currentPurchaseStockUnit();
    const buysLooseUnits = stockUnit === "un";
    const existingField = form.elements.stockKey.closest(".field");
    const modeField = form.elements.itemMode.closest(".field");
    const descriptionLabel = form.querySelector("[data-new-description-label]");
    const countLabel = form.querySelector("[data-package-count-label]");
    const unitCostLabel = form.querySelector("[data-unit-cost-label]");
    modeField.hidden = isOperational;
    existingField.hidden = isOperational || isNewMode;
    form.elements.stockKey.required = !isOperational && !isNewMode;
    form.elements.newItemName.required = isOperational || isNewMode;
    form.elements.packageCount.required = !isOperational;
    form.elements.packageSize.required = !isOperational && !buysLooseUnits;
    form.querySelectorAll("[data-new-purchase-field]").forEach((field) => {
      field.hidden = !isOperational && !isNewMode;
    });
    form.querySelectorAll("[data-new-item-type]").forEach((field) => {
      field.hidden = isOperational || !isNewMode;
    });
    form.querySelectorAll("[data-new-stock-field]").forEach((field) => {
      field.hidden = isOperational || !isNewMode;
    });
    form.querySelectorAll("[data-stock-quantity-field]").forEach((field) => {
      field.hidden = isOperational;
    });
    form.querySelectorAll("[data-stock-cost-field]").forEach((field) => {
      field.hidden = isOperational;
    });
    form.querySelectorAll("[data-package-size-field], [data-package-unit-field]").forEach((field) => {
      field.hidden = isOperational || buysLooseUnits;
    });
    if (buysLooseUnits) {
      form.elements.packageSize.value = "";
      form.elements.packageUnit.value = "un";
    }
    if (descriptionLabel) descriptionLabel.textContent = isOperational ? "Descrição da despesa" : "Nome do novo item";
    if (countLabel) countLabel.textContent = buysLooseUnits ? "Unidades compradas" : "Pacotes / unidades compradas";
    if (unitCostLabel) unitCostLabel.textContent = stockUnit ? `Custo por ${stockUnit}` : "Custo por unidade";
    if (!isOperational && !isNewMode) {
      form.elements.newItemName.value = "";
      form.elements.newCategory.value = "";
    }
  };
  const syncPurchaseMoneyFields = (qty) => {
    const totalInput = form.elements.total;
    const unitCostInput = form.elements.unitCost;
    const hasTotal = String(totalInput.value || "").trim() !== "";
    const hasUnitCost = String(unitCostInput.value || "").trim() !== "";
    if (!qty) {
      if (purchaseCostSource === "total" && !hasTotal) unitCostInput.value = "";
      if (purchaseCostSource === "unitCost" && !hasUnitCost) totalInput.value = "";
      return { total: Number(totalInput.value || 0), costPerUnit: Number(unitCostInput.value || 0) };
    }
    if (purchaseCostSource === "unitCost") {
      const costPerUnit = Number(unitCostInput.value || 0);
      const total = costPerUnit * qty;
      if (hasUnitCost) setInputNumber(totalInput, total, 2);
      if (!hasUnitCost) totalInput.value = "";
      return { total: Number(totalInput.value || 0), costPerUnit };
    }
    const total = Number(totalInput.value || 0);
    const costPerUnit = total / qty;
    if (hasTotal) setInputNumber(unitCostInput, costPerUnit, 6);
    if (!hasTotal) unitCostInput.value = "";
    return { total, costPerUnit: Number(unitCostInput.value || 0) };
  };
  const purchaseCalc = () => {
    const isOperational = form.elements.kind.value === "operational";
    const isExistingMode = !isOperational && form.elements.itemMode.value === "existing";
    const newName = form.elements.newItemName.value.trim();
    const collection = isExistingMode ? parsePurchaseStockKey(form.elements.stockKey.value).collection : form.elements.newItemCollection.value;
    const matchingExisting = !isOperational && !isExistingMode ? stockItemByName(collection, newName) : null;
    const target = isExistingMode
      ? stockItemFromKey(form.elements.stockKey.value)
      : { collection, item: matchingExisting };
    const isNewItem = !isOperational && !isExistingMode && !matchingExisting;
    const packageCount = Number(form.elements.packageCount.value || 0);
    const packageUnit = form.elements.packageUnit.value || form.elements.newPurchaseUnit.value || "g";
    const stockUnit = isExistingMode || matchingExisting ? stockUnitFor(target.collection, target.item, packageUnit) : form.elements.newPurchaseUnit.value;
    const packageSize = Number(form.elements.packageSize.value || 0) || (stockUnit === "un" && packageCount ? 1 : 0);
    const qty = purchaseQuantityInStockUnit({ packageCount, packageSize, packageUnit }, stockUnit);
    const { total, costPerUnit } = isOperational ? { total: Number(form.elements.total.value || 0), costPerUnit: 0 } : syncPurchaseMoneyFields(qty);
    const itemName = isOperational ? newName || "Despesa operacional" : target.item?.name || newName || "Novo item";
    if (isOperational) {
      preview.innerHTML = `
        <small>Despesa operacional</small>
        <strong>${brl(total)}</strong>
        <span>${itemName}: entra em Despesas e não altera estoque/custo da garrafa.</span>
      `;
      return { target, isNewItem: false, isOperational, isExistingMode: false, packageCount, packageSize, packageUnit, stockUnit, qty: 0, total, costPerUnit: 0 };
    }
    const modeText = isExistingMode
      ? target.item
        ? `Atualizando item existente: ${target.item.name}.`
        : "Escolha o item existente que será atualizado."
      : matchingExisting
        ? `Já existe "${matchingExisting.name}". A compra atualizará este item, não criará duplicado.`
        : `Novo ${collection === "packaging" ? "material" : "ingrediente"}: ${newName || "digite o nome do item"}.`;
    preview.innerHTML = `
      <small>Total que entra no estoque</small>
      <strong>${number(qty, 3)} ${stockUnit}</strong>
      <span>${modeText} ${brl(costPerUnit)} por ${stockUnit} | total ${brl(total)}</span>
    `;
    return { target, isNewItem, isOperational, isExistingMode, packageCount, packageSize, packageUnit, stockUnit, qty, total, costPerUnit };
  };
  form.elements.newItemName.addEventListener("input", () => {
    if (form.elements.kind.value !== "operational" && form.elements.itemMode.value !== "new") {
      form.elements.itemMode.value = "new";
      updateNewFields({ suggestUnit: true });
    }
    purchaseCalc();
  });
  form.addEventListener("input", (event) => {
    if (event.target.name === "unitCost") purchaseCostSource = "unitCost";
    if (event.target.name === "total") purchaseCostSource = "total";
    purchaseCalc();
  });
  form.addEventListener("change", () => {
    updateNewFields();
    purchaseCalc();
  });
  form.elements.itemMode.addEventListener("change", () => {
    if (form.elements.itemMode.value === "existing") form.elements.newItemName.value = "";
    updateNewFields({ suggestUnit: true });
    purchaseCalc();
  });
  form.elements.stockKey.addEventListener("change", () => {
    if (form.elements.stockKey.value) form.elements.itemMode.value = "existing";
    const target = stockItemFromKey(form.elements.stockKey.value);
    const unit = stockUnitFor(target.collection, target.item, form.elements.packageUnit.value);
    if (unit) form.elements.packageUnit.value = unit;
    updateNewFields();
    purchaseCalc();
  });
  form.elements.newItemCollection.addEventListener("change", () => updateNewFields({ suggestUnit: true }));
  updateNewFields({ suggestUnit: true });
  purchaseCalc();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const { target, isNewItem, isOperational, isExistingMode, packageCount, packageSize, packageUnit, stockUnit, qty, total, costPerUnit } = purchaseCalc();
    if ((isNewItem || isOperational) && !data.newItemName.trim()) {
      window.alert("Informe o nome do novo item.");
      return;
    }
    if (isExistingMode && !target.item) {
      window.alert("Escolha o item existente que será atualizado.");
      return;
    }
    if ((!qty && !isOperational) || !total) {
      window.alert("Informe item, quantidade comprada e total pago.");
      return;
    }
    if (isOperational) {
      const purchase = {
        id: id("pur"),
        kind: "operational",
        date: data.date,
        supplier: data.supplier,
        item: data.newItemName || "Despesa operacional",
        stockCollection: "expense",
        stockItemId: "",
        packageCount: 0,
        packageSize: 0,
        packageUnit: "",
        qty: 0,
        unit: "",
        total,
        costPerUnit: 0,
        method: data.method,
        buyer: data.buyer,
      };
      state.purchases.unshift(purchase);
      syncPurchaseExpense(purchase);
      addAudit("Despesa operacional registrada", `${purchase.item}: ${brl(total)}`);
      closeModal();
      render();
      return;
    }
    let collection = target.collection;
    let stockItem = target.item;
    if (!stockItem && isNewItem && collection === "ingredients") {
      stockItem = findOrCreateIngredient({
        name: data.newItemName,
        category: data.newCategory || "outro",
        supplier: data.supplier,
        purchaseUnit: stockUnit,
        packageCount,
        packageSize,
        packageUnit,
        packageTotal: total,
        costPerUnit: "",
        stock: 0,
        min: 0,
      });
    }
    if (!stockItem && isNewItem && collection === "packaging") {
      const materialType = ["bottle", "label", "box", "material"].includes(data.newCategory) ? data.newCategory : "material";
      stockItem = findOrCreatePackaging({
        name: data.newItemName,
        type: materialType,
        supplier: data.supplier,
        unit: stockUnit,
        costEach: costPerUnit,
        stock: 0,
        min: 0,
      });
    }
    if (!stockItem) {
      window.alert("Escolha um item válido.");
      return;
    }
    stockItem.stock = Number(stockItem.stock || 0) + qty;
    stockItem.supplier = data.supplier || stockItem.supplier;
    stockItem.packageCount = packageCount;
    stockItem.packageSize = packageSize;
    stockItem.packageUnit = packageUnit;
    stockItem.packageTotal = total;
    stockItem.needsCost = false;
    stockItem.status = "ativo";
    if (collection === "packaging") {
      stockItem.unit = stockUnit;
      stockItem.costEach = costPerUnit;
    } else {
      stockItem.purchaseUnit = stockUnit;
      stockItem.costPerUnit = costPerUnit;
    }
    const purchase = {
      id: id("pur"),
      kind: "stock",
      date: data.date,
      supplier: data.supplier,
      item: stockItem.name,
      ingredientId: collection === "ingredients" ? stockItem.id : "",
      packagingId: collection === "packaging" ? stockItem.id : "",
      stockCollection: collection,
      stockItemId: stockItem.id,
      packageCount,
      packageSize,
      packageUnit,
      qty,
      unit: stockUnit,
      total,
      costPerUnit,
      method: data.method,
      buyer: data.buyer,
    };
    state.purchases.unshift(purchase);
    syncPurchaseExpense(purchase);
    addAudit("Compra registrada", `${stockItem.name}: ${number(qty, 3)} ${stockUnit} por ${brl(total)} (${brl(costPerUnit)}/${stockUnit})`);
    closeModal();
    render();
  });
}

function reserveStockForm(batchCode) {
  const batch = state.batches.find((item) => item.code === batchCode);
  const product = productForBatch(batch);
  const available = batchAvailableStock(batchCode);
  const options = reservationOptionsForBatch(batch);
  openModal(
    "Reservar lote para pedido",
    "Estoque",
    `
      <form id="reserveStockForm">
        <div class="result-card field-full">
          <small>Lote</small>
          <strong>${escapeHtml(batchCode)} - ${escapeHtml(product ? product.flavor : batch?.flavor || "Kombucha")}</strong>
          <span>Disponível agora: ${number(available)} garrafa(s)</span>
        </div>
        ${
          options.length
            ? `<div class="input-grid">
                <label class="field field-full"><span>Cliente / sabor</span><select name="orderItemKey">${options.map((option) => `<option value="${orderItemSelectionKey(option.order, option.index)}">${escapeHtml(orderClientDisplayName(option.order))} | ${escapeHtml(orderProductText(option.item))} | falta ${number(option.need)}</option>`).join("")}</select></label>
                <label class="field"><span>Quantidade para reservar</span><input name="qty" type="number" min="1" max="${available}" value="${Math.min(available, options[0]?.need || 1)}" required></label>
                <label class="field field-full"><span>Observação</span><input name="note" placeholder="Ex: reservado manualmente para retirada de sexta"></label>
              </div>
              <button class="btn btn-primary" type="submit">Reservar para pedido</button>`
            : `<p class="empty-note">Não há pedido aberto desse sabor precisando de reserva. Crie ou ajuste um pedido primeiro.</p>`
        }
      </form>
    `,
  );
  const form = document.querySelector("#reserveStockForm");
  if (!form || !options.length) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const qty = Number(data.qty || 0);
    const currentAvailable = batchAvailableStock(batchCode);
    const selection = findOrderItemBySelection(data.orderItemKey);
    if (!selection.order || !selection.item) {
      window.alert("Pedido não encontrado. Atualize a página e tente novamente.");
      return;
    }
    const need = orderItemRemainingQty(selection.item);
    if (qty <= 0 || qty > currentAvailable) {
      window.alert(`Estoque insuficiente neste lote. Disponível: ${number(currentAvailable)} garrafa(s).`);
      return;
    }
    if (qty > need) {
      window.alert(`Esse item precisa de ${number(need)} garrafa(s). Ajuste a quantidade para não reservar a mais.`);
      return;
    }
    reserveBatchForOrderItem(batchCode, selection.order, selection.item, qty, data.note || "", true);
    addAudit("Reserva manual", `${number(qty)} garrafa(s) do lote ${batchCode} para ${orderClientDisplayName(selection.order)}`);
    closeModal();
    render();
  });
}

function adjustOrderReservationForm(orderId) {
  const order = byId("orders", orderId);
  if (!order || !isOpenOrder(order)) return;
  const items = orderItems(order).filter((item) => Number(item.qty || 0) > 0);
  if (!items.length) {
    window.alert("Este pedido não tem itens para ajustar.");
    return;
  }
  openModal(
    "Ajustar reserva",
    "Pedidos",
    `
      <form id="adjustOrderReservationForm">
        <div class="input-grid">
          <div class="result-card field-full">
            <small>Cliente</small>
            <strong>${escapeHtml(orderClientDisplayName(order))}</strong>
            <span>Este ajuste altera somente as garrafas separadas agora. A quantidade pedida não será modificada.</span>
          </div>
          <label class="field field-full"><span>Sabor</span><select name="itemIndex" class="admin-select" data-force-search="true">${items
            .map((item) => {
              const index = orderItems(order).indexOf(item);
              return `<option value="${index}">${escapeHtml(orderFlavorText(item))} | ${number(orderItemReservedQty(item))} de ${number(item.qty || 0)} reservada(s)</option>`;
            })
            .join("")}</select></label>
          <div class="result-card field-full" id="reservationCurrentSummary"></div>
          <label class="field"><span>Reservada agora</span><input name="reservedNow" type="number" min="0" step="1" inputmode="numeric" required></label>
          <label class="field field-full"><span>Motivo do ajuste</span><input name="reason" required maxlength="240" placeholder="Ex: liberar 1 garrafa para venda, avaria identificada..."></label>
          <div class="result-card field-full" id="reservationAdjustmentPreview"></div>
        </div>
        <div class="modal-action-row">
          <button class="btn btn-primary" type="submit">Salvar ajuste</button>
          <button class="btn btn-outline" type="button" id="restoreAutomaticReservation">Voltar ao automático</button>
        </div>
      </form>
    `,
  );
  const form = document.querySelector("#adjustOrderReservationForm");
  const preview = document.querySelector("#reservationAdjustmentPreview");
  const summary = document.querySelector("#reservationCurrentSummary");
  const selectedItem = () => orderItems(order)[Number(form.elements.itemIndex.value)];
  const updatePreview = (resetValue = false) => {
    const item = selectedItem();
    if (!item) return;
    const current = orderItemReservedQty(item);
    const ordered = Number(item.qty || 0);
    const available = availableStockForProduct(item.productId);
    const maximumNow = Math.min(ordered, current + available);
    if (resetValue) form.elements.reservedNow.value = String(current);
    form.elements.reservedNow.max = String(maximumNow);
    const reservedNow = Number(form.elements.reservedNow.value || 0);
    const delta = reservedNow - current;
    const missingAfter = Math.max(0, ordered - reservedNow);
    summary.innerHTML = `<small>Situação atual</small><strong>Pedido: ${number(ordered)} | Reservada: ${number(current)} | Disponível: ${number(available)}</strong><span>Você pode separar agora entre 0 e ${number(maximumNow)} garrafa(s), sem alterar o pedido.</span>`;
    preview.innerHTML = `<small>Impacto imediato</small><strong>${number(current)} reservada(s) agora -> ${number(reservedNow)}</strong><span>O pedido continua com ${number(ordered)} garrafa(s); ${number(missingAfter)} continuarão faltando. ${delta < 0 ? `${number(Math.abs(delta))} garrafa(s) voltarão ao estoque disponível.` : delta > 0 ? `${number(delta)} garrafa(s) disponíveis serão separadas agora.` : "Nenhuma mudança na separação."}</span>`;
  };
  form.elements.itemIndex.addEventListener("change", () => updatePreview(true));
  form.elements.reservedNow.addEventListener("input", () => updatePreview(false));
  updatePreview(true);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const item = selectedItem();
    const reservedNow = Number(form.elements.reservedNow.value);
    const ordered = Number(item?.qty || 0);
    const before = orderItemReservedQty(item);
    const maximumNow = Math.min(ordered, before + availableStockForProduct(item?.productId));
    const reason = String(form.elements.reason.value || "").trim();
    if (!item || !Number.isInteger(reservedNow) || reservedNow < 0 || reservedNow > maximumNow) {
      window.alert(`Informe quantas estão reservadas agora, entre 0 e ${number(maximumNow)}.`);
      return;
    }
    if (!reason) {
      window.alert("Informe o motivo do ajuste para manter o histórico confiável.");
      return;
    }
    item.reservationTarget = null;
    item.reservationOverride = {
      reservedNow,
      previousQty: before,
      orderedQty: ordered,
      reason,
      updatedAt: new Date().toISOString(),
      updatedBy: currentRole,
    };
    trimItemAllocationsTo(item, reservedNow);
    reconcileOrderReservations();
    const after = orderItemReservedQty(item);
    addAudit(
      "Reserva ajustada manualmente",
      `${orderClientDisplayName(order)} | ${orderFlavorText(item)}: ${number(before)} -> ${number(after)} reservada(s) agora; pedido permanece em ${number(ordered)}. Motivo: ${reason}`,
    );
    closeModal();
    render();
    if (after !== reservedNow) window.alert(`Não foi possível separar ${number(reservedNow)} agora. A reserva atual ficou em ${number(after)} garrafa(s).`);
  });
  document.querySelector("#restoreAutomaticReservation")?.addEventListener("click", () => {
    const item = selectedItem();
    if (!item) return;
    const before = orderItemReservedQty(item);
    const reason = String(form.elements.reason.value || "").trim();
    if (!reason) {
      window.alert("Informe o motivo antes de restaurar a reserva automática.");
      return;
    }
    item.reservationTarget = null;
    item.reservationOverride = null;
    reconcileOrderReservations();
    const after = orderItemReservedQty(item);
    addAudit("Reserva automática restaurada", `${orderClientDisplayName(order)} | ${orderFlavorText(item)}: ${number(before)} -> ${number(after)}. Motivo: ${reason}`);
    closeModal();
    render();
  });
}

function writeOffStockForm(batchCode) {
  const batch = state.batches.find((item) => item.code === batchCode);
  const product = productForBatch(batch);
  const available = batchAvailableStock(batchCode);
  if (!batch || available <= 0) {
    window.alert("Este lote não tem garrafas disponíveis para baixa.");
    return;
  }
  openModal(
    "Dar baixa no estoque",
    "Estoque",
    `
      <form id="writeOffStockForm">
        <div class="input-grid">
          <div class="result-card field-full">
            <small>Lote</small>
            <strong>${escapeHtml(product?.flavor || batch.flavor || "Kombucha")}</strong>
            <span>${escapeHtml(batchCode)} | ${number(available)} garrafa(s) disponível(is). Reservas não serão consumidas.</span>
          </div>
          <label class="field"><span>Quantidade</span><input name="qty" type="number" min="1" max="${available}" step="1" value="1" required></label>
          <label class="field"><span>Motivo</span><select name="reasonType"><option value="vencida">Vencida</option><option value="danificada">Danificada</option><option value="impropria">Imprópria para venda</option><option value="consumo">Consumo interno</option><option value="outro">Outro</option></select></label>
          <label class="field field-full"><span>Detalhe</span><input name="note" maxlength="240" required placeholder="Descreva o ocorrido"></label>
        </div>
        <button class="btn btn-primary" type="submit">Confirmar baixa</button>
      </form>
    `,
  );
  document.querySelector("#writeOffStockForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const qty = Number(data.qty || 0);
    const currentAvailable = batchAvailableStock(batchCode);
    if (!Number.isInteger(qty) || qty <= 0 || qty > currentAvailable) {
      window.alert(`Informe uma quantidade entre 1 e ${number(currentAvailable)}.`);
      return;
    }
    state.sales.unshift({
      id: id("sale"),
      date: todayIso(),
      partner: "Baixa de estoque",
      customerName: "Baixa de estoque",
      channel: "perda",
      movementType: "perda",
      priceType: "gratis",
      flavor: batch.flavor || product?.flavor || "",
      productId: product?.id || "",
      batchCode,
      qty,
      unitPrice: 0,
      discount: 0,
      delivery: 0,
      note: `${data.reasonType}: ${data.note}`,
    });
    addAudit("Baixa definitiva de estoque", `${batchCode}: ${number(qty)} garrafa(s). Motivo: ${data.reasonType}. ${data.note}`);
    closeModal();
    render();
  });
}

function correctBatchQuantityForm(batchId) {
  const batch = byId("batches", batchId);
  if (!batch) return;
  const row = finishedStockRows().find((item) => item.id === batchId || item.code === batch.code) || batch;
  const recipe = byId("recipes", batch.recipeId);
  const committed = Number(row.sold || 0) + Number(row.reserved || 0);
  const currentActual = Number(batch.actual || 0);
  const currentAvailable = Math.max(0, currentActual - committed);
  openModal(
    "Corrigir quantidade",
    "Estoque",
    `
      <form id="correctBatchQtyForm">
        <div class="input-grid">
          <div class="result-card field-full">
            <small>Lote</small>
            <strong>${escapeHtml(batch.flavor || row.flavor || "Kombucha")}</strong>
            <span>${escapeHtml(batch.code)} | ${number(row.reserved || 0)} reservada(s), ${number(row.sold || 0)} saída(s), ${number(currentAvailable)} disponível(is)</span>
          </div>
          <label class="field"><span>Quantidade produzida correta</span><input name="actual" type="number" min="${committed}" step="1" value="${currentActual}" required></label>
          <label class="field field-full"><span>Motivo da correção</span><input name="reason" required placeholder="Ex: erro de contagem, quebra, garrafas encontradas..."></label>
          <div class="result-card field-full" id="batchCorrectionPreview"></div>
        </div>
        <button class="btn btn-primary" type="submit">Salvar correção</button>
      </form>
    `,
  );
  const form = document.querySelector("#correctBatchQtyForm");
  const preview = document.querySelector("#batchCorrectionPreview");
  const updatePreview = () => {
    const nextActual = Number(form.elements.actual.value || 0);
    const delta = nextActual - currentActual;
    const nextAvailable = nextActual - committed;
    if (!recipe) {
      preview.innerHTML = `<small>Atenção</small><strong>Receita não vinculada</strong><span>Sem receita, o sistema não consegue devolver ou baixar ingredientes automaticamente.</span>`;
      return;
    }
    if (nextAvailable < 0) {
      preview.innerHTML = `<small>Bloqueado</small><strong>Quantidade menor que reservas/saídas</strong><span>Libere reservas ou faça logística reversa antes de reduzir abaixo de ${number(committed)} garrafas.</span>`;
      return;
    }
    const directionText = delta === 0 ? "Nenhuma mudança de insumos." : delta > 0 ? `Baixa adicional proporcional para ${number(delta)} garrafa(s).` : `Devolve insumos proporcionais de ${number(Math.abs(delta))} garrafa(s).`;
    preview.innerHTML = `<small>Impacto automático</small><strong>${number(nextAvailable)} disponível(is) após a correção</strong><span>${directionText} Reservas de pedidos serão recalculadas.</span>`;
  };
  form.addEventListener("input", updatePreview);
  updatePreview();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const nextActual = Number(data.actual || 0);
    if (nextActual < committed) {
      window.alert(`Não dá para reduzir para ${number(nextActual)} porque ${number(committed)} já estão reservadas/vendidas. Libere reservas ou faça devolução primeiro.`);
      return;
    }
    const inventoryResult = adjustBatchInventoryTo(batch, nextActual);
    if (!inventoryResult.ok) {
      window.alert(inventoryResult.message);
      return;
    }
    batch.actual = nextActual;
    if (!Number(batch.expected || 0)) batch.expected = nextActual;
    batch.correctedAt = todayIso();
    batch.correctionReason = data.reason;
    const beforeReserved = Number(row.reserved || 0);
    const reservationReport = reconcileOrderReservations();
    const afterReserved = reservationReport.byBatch[batch.code] || 0;
    addAudit("Quantidade do lote corrigida", `${batch.code}: ${number(currentActual)} -> ${number(nextActual)}. ${inventoryResult.delta < 0 ? "Insumos devolvidos" : inventoryResult.delta > 0 ? "Insumos baixados" : "Sem mudança de insumos"}. Motivo: ${data.reason}`);
    closeModal();
    render();
    if (afterReserved > beforeReserved) window.alert(`${number(afterReserved)} garrafa(s) deste lote estão reservadas para pedidos após a correção.`);
  });
}

function reverseStockForm(batchCode) {
  const batch = state.batches.find((item) => item.code === batchCode);
  const soldQty = Math.max(0, soldFromBatch(batchCode));
  const saleOptions = batchSaleRows(batchCode)
    .filter((row) => row.qty > 0)
    .map((row) => `<option value="${row.sale.id}">${escapeHtml(row.customer)} | ${number(row.qty)} un | ${row.sale.date || "-"}</option>`)
    .join("");
  openModal(
    "Logística reversa",
    "Estoque",
    `
      <form id="reverseStockForm">
        <div class="result-card field-full">
          <small>Lote</small>
          <strong>${escapeHtml(batchCode)} - ${escapeHtml(batch?.flavor || "Kombucha")}</strong>
          <span>Saídas líquidas neste lote: ${number(soldQty)} garrafa(s)</span>
        </div>
        <div class="input-grid">
          <label class="field field-full"><span>Venda/saída de referência</span><select name="saleId"><option value="">Sem referência específica</option>${saleOptions}</select></label>
          <label class="field"><span>Data de retorno</span><input name="date" type="date" value="${todayIso()}" required></label>
          <label class="field"><span>Quantidade que voltou</span><input name="qty" type="number" min="1" max="${Math.max(1, soldQty)}" value="1" required></label>
          <label class="field"><span>Cliente / origem</span><input name="customerName" list="customerOptionsReverse" placeholder="Quem devolveu ou de onde voltou"></label>
          <datalist id="customerOptionsReverse">${[...new Set(batchSaleRows(batchCode).map((row) => row.customer).filter(Boolean))].map((name) => `<option value="${escapeHtml(name)}"></option>`).join("")}</datalist>
          <label class="field field-full"><span>Motivo</span><input name="note" placeholder="Ex: devolução, troca, erro de separação"></label>
        </div>
        <button class="btn btn-primary" type="submit">Registrar retorno ao estoque</button>
      </form>
    `,
  );
  const form = document.querySelector("#reverseStockForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const reference = byId("sales", data.saleId);
    const qty = Number(data.qty || 0);
    if (qty <= 0 || qty > Math.max(1, soldQty)) {
      window.alert(`Quantidade inválida. Saídas líquidas neste lote: ${number(soldQty)}.`);
      return;
    }
    state.sales.unshift({
      id: id("sale"),
      date: data.date,
      partner: data.customerName || reference?.customerName || reference?.partner || "Logística reversa",
      customerName: data.customerName || reference?.customerName || reference?.partner || "Logística reversa",
      channel: "devolução",
      movementType: "devolucao",
      priceType: "devolucao",
      flavor: batch?.flavor || "",
      productId: reference?.productId || productForBatch(batch)?.id || "",
      batchCode,
      qty: -qty,
      unitPrice: 0,
      discount: 0,
      delivery: 0,
      note: data.note || "Retorno ao estoque",
      referenceSaleId: data.saleId || "",
    });
    addAudit("Logística reversa", `${number(qty)} garrafa(s) retornaram ao lote ${batchCode}`);
    closeModal();
    render();
  });
}

function quickSaleForm() {
  const stockRows = finishedStockRows()
    .filter((row) => row.stock > 0 && row.product)
    .sort((a, b) => (a.flavor || "").localeCompare(b.flavor || "") || a.code.localeCompare(b.code));
  if (!stockRows.length) {
    openModal(
      "Sem estoque disponível",
      "Vendas",
      `<p class="empty-note">Não há garrafas livres para venda agora. Registre um lote aprovado ou confira se o estoque está reservado para pedidos.</p>
       <button class="btn btn-primary" type="button" data-action="new-batch"><span class="material-symbols-outlined" aria-hidden="true">science</span>Criar lote</button>`,
    );
    return;
  }
  openModal(
    "Venda rápida",
    "Dashboard",
    `
      <form id="quickSaleForm">
        <div class="input-grid">
          <label class="field field-full"><span>Cliente</span><input name="customerName" list="quickCustomerOptions" value="Balcão" required></label>
          <datalist id="quickCustomerOptions">${[...new Set([...state.partners.map((item) => item.name), ...state.sales.map((sale) => sale.customerName || sale.partner).filter(Boolean)])].map((name) => `<option value="${escapeHtml(name)}"></option>`).join("")}</datalist>
          ${variantPickerTemplate(productVariantChoices([...new Map(stockRows.map((row) => [row.product.id, row.product])).values()]), stockRows[0]?.product?.id)}
          <label class="field field-full"><span>Lote disponível</span><select name="batchCode"></select></label>
          <label class="field"><span>Quantidade</span><input name="qty" type="number" min="1" step="1" value="1" required></label>
          <label class="field"><span>Preço</span><select name="priceType"><option value="varejo">Varejo</option><option value="atacado">Atacado</option><option value="custom">Valor combinado</option><option value="gratis">Sem cobrança</option></select></label>
          <label class="field"><span>Preço unitário</span><input name="unitPrice" type="number" step="0.01" required></label>
          <label class="field"><span>Data</span><input name="date" type="date" value="${todayIso()}" required></label>
          <div class="result-card field-full" id="quickSalePreview"></div>
        </div>
        <button class="btn btn-primary" type="submit">
          <span class="material-symbols-outlined" aria-hidden="true">point_of_sale</span>
          Registrar venda
        </button>
      </form>
    `,
  );
  const form = document.querySelector("#quickSaleForm");
  const preview = document.querySelector("#quickSalePreview");
  const updateQuickSale = (forcePrice = false) => {
    const option = form.elements.batchCode.selectedOptions[0];
    const type = form.elements.priceType.value;
    const qty = Number(form.elements.qty.value || 0);
    const available = Number(option?.dataset.stock || 0);
    if (type === "gratis") {
      if (forcePrice) form.elements.unitPrice.value = "0";
    } else if (forcePrice && type !== "custom") {
      const price = type === "atacado" ? Number(option?.dataset.wholesale || 0) : Number(option?.dataset.retail || 0);
      form.elements.unitPrice.value = Number.isFinite(price) ? String(price) : "0";
    }
    const unit = form.elements.unitPrice.value === "" ? 0 : Number(form.elements.unitPrice.value || 0);
    preview.innerHTML = `
      <small>Resumo</small>
      <strong>${number(qty)} garrafa(s) | ${brl(qty * unit)}</strong>
      <span>${number(available)} disponível(is) neste lote.</span>
    `;
  };
  populateSaleBatchOptions(form, stockRows, form.elements.productId.value);
  bindVariantPicker(form, productVariantChoices([...new Map(stockRows.map((row) => [row.product.id, row.product])).values()]), (choice) => {
    populateSaleBatchOptions(form, stockRows, choice?.id || "");
    updateQuickSale(true);
  });
  form.elements.batchCode.addEventListener("change", () => updateQuickSale(true));
  form.elements.priceType.addEventListener("change", () => updateQuickSale(true));
  form.elements.qty.addEventListener("input", () => updateQuickSale(false));
  form.elements.unitPrice.addEventListener("input", () => {
    form.elements.priceType.value = "custom";
    updateQuickSale(false);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const batch = state.batches.find((item) => item.code === data.batchCode);
    const product = productForBatch(batch);
    const qty = Number(data.qty || 0);
    const available = finishedStockRows().find((row) => row.code === data.batchCode)?.stock || 0;
    if (qty > available) {
      window.alert(`Estoque insuficiente neste lote. Disponível: ${number(available)} garrafas.`);
      return;
    }
    state.sales.unshift({
      id: id("sale"),
      date: data.date,
      partner: data.customerName,
      customerName: data.customerName,
      channel: data.priceType,
      movementType: data.priceType === "gratis" ? "presente" : "venda",
      priceType: data.priceType,
      flavor: batch?.flavor || "",
      productId: product?.id || "",
      batchCode: data.batchCode,
      qty,
      unitPrice: Number(data.unitPrice || 0),
      discount: 0,
      delivery: 0,
      note: "Venda rápida pelo dashboard",
    });
    addAudit(
      data.priceType === "gratis" ? "Saída registrada" : "Venda registrada",
      `${number(qty)} garrafa(s) de ${batch?.flavor || product?.name || "sabor não identificado"} | lote ${data.batchCode} | ${data.customerName}`,
    );
    closeModal();
    render();
  });
  updateQuickSale(true);
}

function newSaleForm(batchCode = "") {
  const allStockRows = finishedStockRows().filter((row) => row.stock > 0 && row.product);
  const stockRows = allStockRows;
  if (!stockRows.length) {
    openModal(
      "Sem estoque disponível",
      "Vendas",
      `<p class="empty-note">Para vender, crie uma receita, registre um lote produzido/aprovado e só então lance a venda. Assim o sistema calcula COGS e margem corretamente.</p>
       <button class="btn btn-primary" type="button" data-action="new-batch"><span class="material-symbols-outlined" aria-hidden="true">factory</span>Criar lote</button>`,
    );
    return;
  }
  const selectedStock = stockRows.find((row) => row.code === batchCode) || stockRows[0];
  const saleProducts = [...new Map(stockRows.map((row) => [row.product.id, row.product])).values()];
  openModal(
    batchCode ? "Saída deste lote" : "Nova saída",
    "Vendas",
    `
      <form id="saleForm">
        <div class="input-grid">
          <label class="field"><span>Data</span><input name="date" type="date" value="${todayIso()}" required></label>
          <label class="field"><span>Tipo de saída</span><select name="movementType"><option value="venda">Venda</option><option value="consumo">Consumo próprio</option><option value="presente">Presente / amostra</option><option value="perda">Perda / quebra</option></select></label>
          <label class="field field-full"><span>Cliente / destino</span><input name="customerName" list="customerOptions" placeholder="Nome do cliente, parceiro ou destino" required></label>
          <datalist id="customerOptions">${[...new Set([...state.partners.map((item) => item.name), ...state.sales.map((sale) => sale.customerName || sale.partner).filter(Boolean)])].map((name) => `<option value="${escapeHtml(name)}"></option>`).join("")}</datalist>
          ${variantPickerTemplate(productVariantChoices(saleProducts), selectedStock?.product?.id)}
          <label class="field field-full"><span>Lote disponível</span><select name="batchCode"></select></label>
          <label class="field"><span>Quantidade</span><input name="qty" type="number" min="1" required></label>
          <label class="field"><span>Preço</span><select name="priceType"><option value="varejo">Varejo</option><option value="atacado">Atacado</option><option value="custom">Valor combinado</option><option value="gratis">Sem cobrança</option></select></label>
          <label class="field"><span>Preço unitário</span><input name="unitPrice" type="number" step="0.01" value="${productRetailPrice(selectedStock?.product) || productWholesalePrice(selectedStock?.product) || 0}" required></label>
          <label class="field"><span>Desconto</span><input name="discount" type="number" step="0.01" value="0"></label>
          <label class="field"><span>Entrega</span><input name="delivery" type="number" step="0.01" value="0"></label>
          <label class="field field-full"><span>Observação</span><input name="note" placeholder="Ex: recorrente com preço diferenciado, brinde, garrafa quebrada..."></label>
        </div>
        <button class="btn btn-primary" type="submit">Registrar saída</button>
      </form>
    `,
  );
  const saleForm = document.querySelector("#saleForm");
  const updateSalePrice = (forcePrice = false) => {
    const option = saleForm.elements.batchCode.selectedOptions[0];
    const movement = saleForm.elements.movementType.value;
    const type = saleForm.elements.priceType.value;
    if (movement !== "venda" || type === "gratis") {
      if (forcePrice) saleForm.elements.unitPrice.value = "0";
      if (forcePrice) saleForm.elements.discount.value = "0";
      return;
    }
    if (!forcePrice || type === "custom") return;
    if (type === "varejo") saleForm.elements.unitPrice.value = String(Number(option?.dataset.retail || 0));
    if (type === "atacado") saleForm.elements.unitPrice.value = String(Number(option?.dataset.wholesale || 0));
  };
  populateSaleBatchOptions(saleForm, stockRows, selectedStock?.product?.id || "", batchCode);
  bindVariantPicker(saleForm, productVariantChoices(saleProducts), (choice) => {
    populateSaleBatchOptions(saleForm, stockRows, choice?.id || "");
    updateSalePrice(true);
  });
  saleForm.elements.batchCode.addEventListener("change", () => updateSalePrice(true));
  saleForm.elements.priceType.addEventListener("change", () => updateSalePrice(true));
  saleForm.elements.movementType.addEventListener("change", () => updateSalePrice(true));
  saleForm.elements.unitPrice.addEventListener("input", () => {
    if (saleForm.elements.movementType.value === "venda") saleForm.elements.priceType.value = "custom";
  });
  saleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const batch = state.batches.find((item) => item.code === data.batchCode);
    const product = productForBatch(batch);
    const qty = Number(data.qty || 0);
    const available = finishedStockRows().find((row) => row.code === data.batchCode)?.stock || 0;
    if (qty > available) {
      window.alert(`Estoque insuficiente neste lote. Disponível: ${number(available)} garrafas.`);
      return;
    }
    state.sales.unshift({
      id: id("sale"),
      date: data.date,
      partner: data.customerName,
      customerName: data.customerName,
      channel: data.movementType === "venda" ? data.priceType : data.movementType,
      movementType: data.movementType,
      priceType: data.priceType,
      flavor: batch?.flavor || "",
      productId: product?.id || "",
      batchCode: data.batchCode,
      qty,
      unitPrice: Number(data.unitPrice),
      discount: Number(data.discount || 0),
      delivery: Number(data.delivery || 0),
      note: data.note || "",
    });
    addAudit(
      data.movementType === "venda" ? "Venda registrada" : "Saída registrada",
      `${number(qty)} garrafa(s) de ${batch?.flavor || product?.name || "sabor não identificado"} | lote ${data.batchCode} | ${data.customerName}`,
    );
    closeModal();
    render();
  });
  updateSalePrice(true);
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
          ${variantPickerTemplate(recipeVariantChoices(), state.recipes[0]?.id, 'name="recipeId"')}
          <label class="field"><span>Data de entrada / produção</span><input name="date" type="date" value="${todayIso()}" required></label>
          <label class="field"><span>Garrafas produzidas</span><input name="actual" type="number" min="1" step="1" value="20" required></label>
          <label class="field"><span>Código do lote</span><input name="code" required></label>
          <label class="field"><span>Responsável</span><input name="responsible" value="Equipe"></label>
          <div class="result-card field-full" id="batchDatePreview"></div>
        </div>
        <button class="btn btn-primary" type="submit">Criar lote e baixar insumos</button>
      </form>
    `,
  );
  const form = document.querySelector("#batchForm");
  const updateBatchPreview = () => {
    const recipe = byId("recipes", form.elements.recipeId.value);
    const date = form.elements.date.value || todayIso();
    const plan = batchDatePlan(date);
    form.elements.code.value = nextBatchCode(recipe, date);
    document.querySelector("#batchDatePreview").innerHTML = `
      <small>Datas automáticas do lote</small>
      <strong>Validade: ${plan.expiry}</strong>
      <span>Ideal vender até ${plan.idealSellBy}; obrigatório vender até ${plan.sellBy}.</span>
    `;
  };
  bindVariantPicker(form, recipeVariantChoices(), updateBatchPreview);
  form.addEventListener("change", updateBatchPreview);
  updateBatchPreview();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const recipe = byId("recipes", data.recipeId);
    const plan = batchDatePlan(data.date);
    const bottles = Number(data.actual || 0);
    if (!recipe || !bottles) return;
    const batch = {
      id: id("bat"),
      code: data.code,
      flavor: recipe?.flavor || "",
      productId: recipe?.productId || "",
      recipeId: data.recipeId,
      date: data.date,
      responsible: data.responsible,
      expected: bottles,
      actual: bottles,
      idealSellBy: plan.idealSellBy,
      sellBy: plan.sellBy,
      expiry: plan.expiry,
      status: "aprovado",
      inventoryAdjusted: true,
      inventoryQty: bottles,
    };
    state.batches.unshift(batch);
    applyBatchInventory(recipe, bottles, -1);
    const reservationReport = reconcileOrderReservations();
    const reserved = reservationReport.byBatch[batch.code] || 0;
    addAudit("Lote criado", `${data.code}: ${number(bottles)} garrafas de ${recipe?.flavor || "receita"}; ${number(reserved)} reservadas para pedidos.`);
    closeModal();
    render();
  });
}

function unitOptions(selected = "kg") {
  return ["kg", "g", "l", "ml", "un"].map((unit) => `<option value="${unit}" ${unit === selected ? "selected" : ""}>${unit}</option>`).join("");
}

function ingredientSelectOptions(selected = "__new__") {
  return [
    `<option value="__new__" ${selected === "__new__" ? "selected" : ""}>Novo ingrediente</option>`,
    ...state.ingredients.map((item) => `<option value="${item.id}" ${selected === item.id ? "selected" : ""}>${escapeHtml(item.name)} (${escapeHtml(item.purchaseUnit)})</option>`),
  ].join("");
}

function packagingSelectOptions(selected = "__new__") {
  return [
    `<option value="__new__" ${selected === "__new__" ? "selected" : ""}>Novo material</option>`,
    ...state.packaging.map((item) => `<option value="${item.id}" ${selected === item.id ? "selected" : ""}>${escapeHtml(item.name)} (${escapeHtml(item.unit || "un")})</option>`),
  ].join("");
}

function recipeIngredientPreset(line = {}) {
  const ingredient = byId("ingredients", line.ingredientId) || state.ingredients.find((item) => normalizeText(item.name) === normalizeText(line.name));
  return {
    ingredientId: ingredient?.id || line.ingredientId || "__new__",
    name: ingredient?.name || line.name || "",
    category: ingredient?.category || line.category || "",
    purchaseUnit: ingredient?.purchaseUnit || line.purchaseUnit || "g",
    usageQty: line.usageQty ?? "",
    usageUnit: line.usageUnit || "g",
    base: line.base || false,
  };
}

function recipeIngredientRowTemplate(line = {}) {
  const preset = recipeIngredientPreset(line);
  return `
    <div class="builder-row recipe-ingredient-row simple-recipe-row" ${preset.base ? "data-kombucha-base-row" : ""}>
      <label class="field"><span>Ingrediente</span><select data-field="ingredientId">${ingredientSelectOptions(preset.ingredientId)}</select></label>
      <label class="field" data-new-ingredient-field><span>Novo ingrediente</span><input data-field="name" value="${preset.ingredientId === "__new__" ? escapeHtml(preset.name) : ""}" placeholder="Use só se for novo"></label>
      <label class="field" data-new-ingredient-field><span>Categoria</span><input data-field="category" value="${preset.ingredientId === "__new__" ? escapeHtml(preset.category) : ""}" placeholder="fruta, chá, flor..."></label>
      <label class="field"><span>Qtd. usada</span><input data-field="usageQty" type="number" min="0" step="0.001" value="${preset.usageQty}"></label>
      <label class="field"><span>Un.</span><select data-field="usageUnit">${unitOptions(preset.usageUnit)}</select></label>
      <button class="icon-btn" type="button" data-remove-builder-row aria-label="Remover ingrediente">
        <span class="material-symbols-outlined" aria-hidden="true">delete</span>
      </button>
    </div>
  `;
}

function kombuchaBaseIngredientRows() {
  return KOMBUCHA_BASE_INGREDIENTS.map((line) => recipeIngredientRowTemplate({ ...line, base: true })).join("");
}

function recipePackagingPreset(line = {}) {
  const material = byId("packaging", line.itemId) || state.packaging.find((item) => normalizeText(item.name) === normalizeText(line.name));
  return {
    itemId: material?.id || line.itemId || "__new__",
    name: material?.name || line.name || "",
    type: material?.type || line.type || "material",
    qtyPerBottle: line.qtyPerBottle ?? "",
    base: line.base || false,
  };
}

function recipePackagingRowTemplate(line = {}) {
  const preset = recipePackagingPreset(line);
  return `
    <div class="builder-row recipe-packaging-row simple-packaging-row" ${preset.base ? "data-kombucha-base-row" : ""}>
      <label class="field"><span>Material</span><select data-field="itemId">${packagingSelectOptions(preset.itemId)}</select></label>
      <label class="field" data-new-packaging-field><span>Novo material</span><input data-field="name" value="${preset.itemId === "__new__" ? escapeHtml(preset.name) : ""}" placeholder="Use só se for novo"></label>
      <label class="field" data-new-packaging-field><span>Tipo</span><select data-field="type"><option value="bottle" ${preset.type === "bottle" ? "selected" : ""}>Garrafa/tampa</option><option value="label" ${preset.type === "label" ? "selected" : ""}>Rótulo</option><option value="box" ${preset.type === "box" ? "selected" : ""}>Caixa</option><option value="material" ${preset.type === "material" ? "selected" : ""}>Outro</option></select></label>
      <label class="field"><span>Qtd. por garrafa</span><input data-field="qtyPerBottle" type="number" min="0" step="0.001" value="${preset.qtyPerBottle}"></label>
      <button class="icon-btn" type="button" data-remove-builder-row aria-label="Remover embalagem">
        <span class="material-symbols-outlined" aria-hidden="true">delete</span>
      </button>
    </div>
  `;
}

function kombuchaBasePackagingRows() {
  return [
    { name: "Garrafa 500ml", type: "bottle", qtyPerBottle: 1 },
    { name: "Rótulo 500ml", type: "label", qtyPerBottle: 1 },
    { name: "Datador por garrafa", type: "material", qtyPerBottle: 1 },
  ].map((line) => recipePackagingRowTemplate({ ...line, base: true })).join("");
}

function readBuilderRow(row) {
  return Array.from(row.querySelectorAll("[data-field]")).reduce((data, input) => {
    data[input.dataset.field] = input.value.trim();
    return data;
  }, {});
}

function setRowField(row, field, value) {
  const control = row.querySelector(`[data-field="${field}"]`);
  if (control) control.value = value ?? "";
}

function updateIngredientPurchasePreview(row) {
  const data = readBuilderRow(row);
  const stockUnit = data.purchaseUnit || "g";
  const calc = ingredientPackageCost(data, stockUnit);
  const costInput = row.querySelector('[data-field="costPerUnit"]');
  const stockInput = row.querySelector('[data-field="stock"]');
  const preview = row.querySelector("[data-ingredient-cost-preview]");
  if (calc.hasPurchaseCost) {
    if (costInput) costInput.value = inputNumber(calc.costPerUnit);
    if (stockInput && !stockInput.value.trim()) stockInput.value = inputNumber(calc.qty, 3);
    if (preview) preview.innerHTML = `<strong>${brl(calc.costPerUnit)} / ${stockUnit}</strong><span>${number(calc.qty, 3)} ${stockUnit} entram no estoque por ${brl(calc.total)}.</span>`;
    return;
  }
  const manualCost = Number(costInput?.value || 0);
  if (preview) {
    preview.innerHTML = manualCost > 0
      ? `<strong>${brl(manualCost)} / ${stockUnit}</strong><span>Custo salvo para este ingrediente.</span>`
      : `<span>Sem custo ainda. Informe embalagem comprada e total pago, ou deixe pendente para preencher depois.</span>`;
  }
}

function fillIngredientRowFromExisting(row, ingredientId) {
  const ingredient = byId("ingredients", ingredientId);
  if (!ingredient) {
    setRowField(row, "name", "");
    setRowField(row, "category", "");
    setRowField(row, "supplier", "");
    setRowField(row, "purchaseUnit", "g");
    setRowField(row, "packageCount", "");
    setRowField(row, "packageSize", "");
    setRowField(row, "packageUnit", "g");
    setRowField(row, "packageTotal", "");
    setRowField(row, "costPerUnit", "");
    setRowField(row, "stock", "");
    setRowField(row, "min", "");
    updateIngredientPurchasePreview(row);
    return;
  }
  setRowField(row, "name", "");
  setRowField(row, "category", "");
  setRowField(row, "supplier", ingredient.supplier || "");
  setRowField(row, "purchaseUnit", ingredient.purchaseUnit || "g");
  setRowField(row, "packageCount", ingredient.packageCount || (ingredient.packageGram ? 1 : ""));
  setRowField(row, "packageSize", ingredient.packageSize || ingredient.packageGram || "");
  setRowField(row, "packageUnit", ingredient.packageUnit || (ingredient.packageGram ? "g" : ingredient.purchaseUnit || "g"));
  setRowField(row, "packageTotal", ingredient.packageTotal || ingredient.packageCost || "");
  setRowField(row, "costPerUnit", inputNumber(ingredient.costPerUnit || 0));
  setRowField(row, "stock", inputNumber(ingredient.stock || 0, 3));
  setRowField(row, "min", inputNumber(ingredient.min || 0, 3));
  updateIngredientPurchasePreview(row);
}

function refreshIngredientBuilderRows(container = document) {
  container.querySelectorAll(".recipe-ingredient-row, .recipe-edit-ingredient-row").forEach(updateIngredientPurchasePreview);
}

function refreshCompactBuilderRows(container = document) {
  container.querySelectorAll(".recipe-ingredient-row, .recipe-edit-ingredient-row").forEach((row) => {
    const isNew = row.querySelector('[data-field="ingredientId"]')?.value === "__new__";
    row.querySelectorAll("[data-new-ingredient-field]").forEach((field) => {
      field.hidden = !isNew;
    });
  });
  container.querySelectorAll(".recipe-packaging-row, .recipe-edit-packaging-row").forEach((row) => {
    const isNew = row.querySelector('[data-field="itemId"]')?.value === "__new__";
    row.querySelectorAll("[data-new-packaging-field]").forEach((field) => {
      field.hidden = !isNew;
    });
  });
}

function bindIngredientBuilderRows(form) {
  form.addEventListener("change", (event) => {
    const row = event.target.closest(".recipe-ingredient-row, .recipe-edit-ingredient-row");
    const packagingRow = event.target.closest(".recipe-packaging-row, .recipe-edit-packaging-row");
    if (row && event.target.dataset.field === "ingredientId") {
      fillIngredientRowFromExisting(row, event.target.value);
      refreshCompactBuilderRows(form);
      return;
    }
    if (packagingRow && event.target.dataset.field === "itemId") {
      if (event.target.value !== "__new__") {
        setRowField(packagingRow, "name", "");
      }
      refreshCompactBuilderRows(form);
      return;
    }
    if (row && ["purchaseUnit", "packageCount", "packageSize", "packageUnit", "packageTotal"].includes(event.target.dataset.field)) {
      updateIngredientPurchasePreview(row);
    }
  });
  form.addEventListener("input", (event) => {
    const row = event.target.closest(".recipe-ingredient-row, .recipe-edit-ingredient-row");
    if (!row || !event.target.dataset.field) return;
    if (["packageCount", "packageSize", "packageTotal"].includes(event.target.dataset.field)) {
      updateIngredientPurchasePreview(row);
    }
  });
  refreshIngredientBuilderRows(form);
  refreshCompactBuilderRows(form);
}

function findOrCreateIngredient(data) {
  const normalizedName = normalizeText(data.name);
  let ingredient = state.ingredients.find((item) => normalizeText(item.name) === normalizedName);
  const costCalc = ingredientPackageCost(data, data.purchaseUnit || ingredient?.purchaseUnit || "g");
  const costWasProvided = costCalc.hasPurchaseCost || String(data.costPerUnit ?? "").trim() !== "";
  const costValue = costCalc.hasPurchaseCost ? costCalc.costPerUnit : Number(data.costPerUnit || 0);
  if (!ingredient) {
    ingredient = {
      id: id("ing"),
      name: data.name,
      category: data.category || "outro",
      supplier: data.supplier || "",
      purchaseUnit: data.purchaseUnit || "g",
      costPerUnit: costWasProvided ? costValue : 0,
      stock: String(data.stock ?? "").trim() !== "" ? Number(data.stock || 0) : Number(costCalc.qty || 0),
      min: Number(data.min || 0),
      packageCount: costCalc.packageCount || "",
      packageSize: costCalc.packageSize || "",
      packageUnit: costCalc.packageUnit || data.purchaseUnit || "g",
      packageTotal: costCalc.total || "",
      expires: "",
      location: "",
      status: costWasProvided && costValue > 0 ? "ativo" : "custo pendente",
      needsCost: !(costWasProvided && costValue > 0),
    };
    state.ingredients.push(ingredient);
    return ingredient;
  }
  ingredient.category = data.category || ingredient.category;
  ingredient.supplier = data.supplier || ingredient.supplier;
  ingredient.purchaseUnit = data.purchaseUnit || ingredient.purchaseUnit;
  if (costWasProvided) {
    ingredient.costPerUnit = costValue;
    ingredient.needsCost = costValue <= 0;
    if (ingredient.status === "custo pendente" && costValue > 0) ingredient.status = "ativo";
    if (costValue <= 0) ingredient.status = "custo pendente";
  }
  applyIngredientPackageCost(ingredient, data);
  if (data.stock !== "") ingredient.stock = Number(data.stock);
  if (data.min !== "") ingredient.min = Number(data.min);
  return ingredient;
}

function findOrCreatePackaging(data) {
  const normalizedName = normalizeText(data.name);
  let material = state.packaging.find((item) => normalizeText(item.name) === normalizedName);
  if (!material) {
    material = {
      id: id("pkg"),
      name: data.name,
      type: data.type || inferPackagingType(data),
      productId: data.productId || "",
      supplier: data.supplier || "",
      unit: data.unit || "un",
      costEach: Number(data.costEach || 0),
      stock: Number(data.stock || 0),
      min: Number(data.min || 0),
      location: "",
    };
    state.packaging.push(material);
    return material;
  }
  material.type = data.type || material.type || inferPackagingType(material);
  material.productId = data.productId || material.productId || "";
  material.supplier = data.supplier || material.supplier;
  material.unit = data.unit || material.unit || "un";
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
          <label class="field field-full"><span>Essa receita é Kombucha?</span><select name="isKombucha"><option value="yes" selected>Sim - usar base fixa de chá + açúcar</option><option value="no">Não - começar sem base automática</option></select></label>
          ${
            state.products.length
              ? `<label class="field field-full"><span>Produto / EAN</span><select name="productId"><option value="">Sem produto vinculado</option>${state.products.map((product) => `<option value="${product.id}">${productLabel(product)}${product.ean ? ` - #${product.ean}` : ""}</option>`).join("")}</select></label>`
              : ""
          }
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
              <p>Escolha o ingrediente e a quantidade usada. Preços e compras ficam na aba Ingredientes/Compras.</p>
            </div>
          </div>
          <div id="recipeIngredientRows">${kombuchaBaseIngredientRows()}${recipeIngredientRowTemplate()}</div>
          <div class="builder-bottom-actions">
            <button class="btn btn-outline" type="button" data-add-ingredient-row>
              <span class="material-symbols-outlined" aria-hidden="true">add</span>
              Adicionar ingrediente
            </button>
          </div>
        </div>

        <div class="builder-section">
          <div class="table-toolbar">
            <div>
              <h3>Embalagens e materiais</h3>
              <p>Garrafa, tampa, rótulo, caixa, lacre ou qualquer material por garrafa.</p>
            </div>
          </div>
          <div id="recipePackagingRows">${kombuchaBasePackagingRows()}${recipePackagingRowTemplate()}</div>
          <div class="builder-bottom-actions">
            <button class="btn btn-outline" type="button" data-add-packaging-row>
              <span class="material-symbols-outlined" aria-hidden="true">add</span>
              Adicionar material
            </button>
          </div>
        </div>

        <label class="check-row field-full">
          <input name="editPricesAfterSave" type="checkbox">
          <span>Editar preços dos ingredientes depois de salvar</span>
        </label>

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
  const ingredientRows = document.querySelector("#recipeIngredientRows");
  const packagingRows = document.querySelector("#recipePackagingRows");
  form.querySelector("[name='isKombucha']")?.addEventListener("change", (event) => {
    const isKombucha = event.target.value === "yes";
    ingredientRows.innerHTML = isKombucha ? `${kombuchaBaseIngredientRows()}${recipeIngredientRowTemplate()}` : recipeIngredientRowTemplate();
    packagingRows.innerHTML = isKombucha ? `${kombuchaBasePackagingRows()}${recipePackagingRowTemplate()}` : recipePackagingRowTemplate();
    enhanceSelectSearch(form);
  });
  form.querySelector("[name='productId']")?.addEventListener("change", (event) => {
    const product = byId("products", event.target.value);
    if (!product) return;
    form.querySelector("[name='flavor']").value = product.flavor;
    form.querySelector("[name='bottleMl']").value = product.sizeMl;
    form.querySelector("[name='wholesalePrice']").value = product.wholesalePrice || 0;
    form.querySelector("[name='retailPrice']").value = product.retailPrice || 0;
  });
  form.querySelector("[data-add-ingredient-row]").addEventListener("click", () => {
    ingredientRows.insertAdjacentHTML("beforeend", recipeIngredientRowTemplate());
    enhanceSelectSearch(ingredientRows);
  });
  form.querySelector("[data-add-packaging-row]").addEventListener("click", () => {
    packagingRows.insertAdjacentHTML("beforeend", recipePackagingRowTemplate());
    enhanceSelectSearch(packagingRows);
  });
  bindIngredientBuilderRows(form);
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
      .filter((row) => (row.ingredientId !== "__new__" || row.name) && Number(row.usageQty) > 0)
      .map((row) => {
        const ingredient = row.ingredientId && row.ingredientId !== "__new__"
          ? byId("ingredients", row.ingredientId)
          : findOrCreateIngredient({
              name: row.name,
              category: row.category || "outro",
              purchaseUnit: row.usageUnit || "g",
              costPerUnit: "",
              stock: 0,
              min: 0,
            });
        if (!ingredient) return null;
        return {
          ingredientId: ingredient.id,
          qty: Number(row.usageQty),
          unit: row.usageUnit || ingredient.purchaseUnit,
        };
      })
      .filter(Boolean);
    const packaging = Array.from(form.querySelectorAll(".recipe-packaging-row"))
      .map(readBuilderRow)
      .filter((row) => (row.itemId !== "__new__" || row.name) && Number(row.qtyPerBottle) > 0)
      .map((row) => {
        const material = row.itemId && row.itemId !== "__new__"
          ? byId("packaging", row.itemId)
          : findOrCreatePackaging({
              name: row.name,
              type: row.type || "material",
              unit: "un",
              costEach: 0,
              stock: 0,
              min: 0,
            });
        if (!material) return null;
        return {
          itemId: material.id,
          qty: Number(row.qtyPerBottle),
        };
      })
      .filter(Boolean);
    const recipe = {
      id: id("rec"),
      productId: data.productId || "",
      recipeType: data.isKombucha === "yes" ? "kombucha" : "outro",
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
    const pendingCostNames = ingredients.map((line) => byId("ingredients", line.ingredientId)).filter(ingredientNeedsCost).map((ingredient) => ingredient.name);
    addAudit("Receita criada", `${recipe.flavor} ${recipe.version} com ${ingredients.length} ingredientes e ${packaging.length} materiais${pendingCostNames.length ? `. Custos pendentes: ${pendingCostNames.join(", ")}` : "."}`);
    closeModal();
    setModule(data.editPricesAfterSave === "on" ? "ingredients" : "costs");
  });
}

function fieldInput(field, value) {
  const name = escapeHtml(field.name);
  const label = escapeHtml(field.label);
  const full = field.full ? "field-full" : "";
  const required = field.required ? "required" : "";
  const current = value ?? field.value ?? "";
  if (field.type === "checkbox") {
    return `<label class="check-row ${full}"><input name="${name}" type="checkbox" ${current ? "checked" : ""}> <span>${label}</span></label>`;
  }
  if (field.type === "select") {
    const options = (field.options || []).map((option) =>
      typeof option === "object" ? option : { value: option, label: option },
    );
    return `
      <label class="field ${full}">
        <span>${label}</span>
        <select name="${name}" class="admin-select" ${required}>
          ${options.map((option) => `<option value="${escapeHtml(option.value)}" ${String(option.value) === String(current) ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
        </select>
      </label>
    `;
  }
  if (field.type === "textarea") {
    return `<label class="field ${full}"><span>${label}</span><textarea name="${name}" ${required}>${escapeHtml(current)}</textarea></label>`;
  }
  return `<label class="field ${full}"><span>${label}</span><input name="${name}" type="${field.type || "text"}" value="${escapeHtml(current)}" ${field.type === "number" ? 'inputmode="decimal"' : ""} ${field.min != null ? `min="${field.min}"` : ""} ${field.step ? `step="${field.step}"` : ""} ${required}></label>`;
}

function readRecordForm(form, fields) {
  return fields.reduce((data, field) => {
    const control = form.elements[field.name];
    if (!control) return data;
    if (field.type === "checkbox") data[field.name] = control.checked;
    else if (field.type === "number") data[field.name] = Number(control.value || 0);
    else data[field.name] = control.value;
    return data;
  }, {});
}

function editRecordForm(collection, recordId, title, fields, afterSave) {
  const record = byId(collection, recordId);
  if (!record) return;
  openModal(
    title,
    collection,
    `
      <form id="editRecordForm">
        <div class="input-grid">
          ${fields.map((field) => fieldInput(field, record[field.name])).join("")}
        </div>
        <button class="btn btn-primary" type="submit">
          <span class="material-symbols-outlined" aria-hidden="true">save</span>
          Salvar alterações
        </button>
      </form>
    `,
  );
  document.querySelector("#editRecordForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = readRecordForm(event.target, fields);
    Object.assign(record, data);
    afterSave?.(record, data);
    addAudit(`${title} atualizado`, record.name || record.flavor || record.code || record.description || record.item || record.id);
    closeModal();
    render();
  });
}

function deleteRecord(collection, recordId, label) {
  const record = byId(collection, recordId);
  if (!record) return;
  const name = label || record.name || record.flavor || record.code || record.description || record.item || record.id;
  if (!window.confirm(`Excluir "${name}"? Esta ação remove o registro deste painel.`)) return;
  state[collection] = state[collection].filter((item) => item.id !== recordId);
  addAudit("Registro excluído", `${collection}: ${name}`);
  render();
}

function deletePurchase(recordId) {
  const purchase = byId("purchases", recordId);
  if (!purchase) return;
  if (!window.confirm(`Excluir compra de "${purchase.item}"? O estoque correspondente será ajustado quando possível.`)) return;
  const target = stockItemForPurchase(purchase);
  if (target?.item) target.item.stock = Math.max(0, Number(target.item.stock || 0) - Number(purchase.qty || 0));
  state.purchases = state.purchases.filter((item) => item.id !== recordId);
  state.expenses = state.expenses.filter((expense) => expense.purchaseId !== recordId);
  addAudit("Compra excluída", purchase.item);
  render();
}

function deleteOrder(recordId) {
  const order = byId("orders", recordId);
  if (!order) return;
  if (!window.confirm(`Excluir pedido de ${orderClientDisplayName(order)}? Vendas automáticas vinculadas a ele também serão removidas.`)) return;
  state.orders = state.orders.filter((item) => item.id !== recordId);
  state.sales = state.sales.filter((sale) => sale.orderId !== recordId);
  reconcileOrderReservations();
  addAudit("Pedido excluído", orderClientDisplayName(order));
  render();
}

function editProductForm(productId) {
  const product = byId("products", productId);
  if (!product) return;
  const recipe = recipeForProduct(product);
  const cost = recipe ? recipeCost(recipe).costPerBottle : 0;
  openModal(
    "Editar produto",
    "Produtos",
    `
      <form id="editProductForm">
        <div class="input-grid">
          <label class="field"><span>Item</span><input name="item" value="${escapeHtml(product.item || "")}" required></label>
          <label class="field"><span>EAN-13</span><input name="ean" value="${escapeHtml(product.ean || "")}" inputmode="numeric" maxlength="13"></label>
          <label class="field"><span>Sabor</span><input name="flavor" value="${escapeHtml(product.flavor || "")}" required></label>
          <label class="field"><span>Tamanho ml</span><input name="sizeMl" type="number" inputmode="numeric" min="1" value="${Number(product.sizeMl || 0)}" required></label>
          <label class="field"><span>Preço varejo</span><input name="retailPrice" type="number" inputmode="decimal" min="0" step="0.01" value="${Number(product.retailPrice || 0)}"></label>
          <label class="field"><span>Preço atacado</span><input name="wholesalePrice" type="number" inputmode="decimal" min="0" step="0.01" value="${Number(product.wholesalePrice || 0)}"></label>
          <label class="field field-full"><span>Descrição</span><input name="description" value="${escapeHtml(product.description || "")}"></label>
          <div class="product-cost-summary field-full">
            <small>Custo atual por garrafa</small>
            <strong>${recipe ? brl(cost) : "Custo pendente"}</strong>
            <span>${recipe ? `Calculado automaticamente pela receita ${escapeHtml(recipe.version || "vinculada")}. Altere ingredientes e materiais na aba Receitas.` : "Este produto ainda não tem receita vinculada. Crie ou vincule a receita para calcular o custo."}</span>
          </div>
          <label class="check-row field-full">
            <input name="operational" type="checkbox" ${productIsOperational(product) ? "checked" : ""}>
            <span>Disponível no catálogo operacional</span>
          </label>
          <p class="field-help field-full">Desative apenas se este sabor e tamanho não puderem ser usados em novos lançamentos internos. A publicação no site é controlada no CMS.</p>
        </div>
        <button class="btn btn-primary" type="submit">
          <span class="material-symbols-outlined" aria-hidden="true">save</span>
          Salvar alterações
        </button>
      </form>
    `,
  );
  document.querySelector("#editProductForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const operational = data.get("operational") === "on";
    Object.assign(product, {
      item: String(data.get("item") || "").trim(),
      ean: String(data.get("ean") || "").trim(),
      flavor: String(data.get("flavor") || "").trim(),
      sizeMl: Number(data.get("sizeMl") || 0),
      retailPrice: Number(data.get("retailPrice") || 0),
      wholesalePrice: Number(data.get("wholesalePrice") || 0),
      description: String(data.get("description") || "").trim(),
      visible: operational,
      status: operational ? "ativo" : "inativo",
    });
    addAudit("Produto atualizado", productLabel(product));
    closeModal();
    render();
  });
}

const ingredientFields = [
  { name: "name", label: "Nome", required: true },
  { name: "category", label: "Categoria" },
  { name: "supplier", label: "Fornecedor" },
  { name: "purchaseUnit", label: "Unidade de estoque/custo", type: "select", options: ["kg", "g", "l", "ml", "un"] },
  { name: "packageCount", label: "Pacotes comprados", type: "number", min: 0, step: "1" },
  { name: "packageSize", label: "Conteúdo por pacote", type: "number", min: 0, step: "0.001" },
  { name: "packageUnit", label: "Unidade do pacote", type: "select", value: "g", options: ["kg", "g", "l", "ml", "un"] },
  { name: "packageTotal", label: "Total pago", type: "number", min: 0, step: "0.01" },
  { name: "costPerUnit", label: "Custo calculado/un.", type: "number", min: 0, step: "0.000001" },
  { name: "stock", label: "Estoque atual", type: "number", min: 0, step: "0.01" },
  { name: "min", label: "Estoque mínimo", type: "number", min: 0, step: "0.01" },
  { name: "expires", label: "Vencimento", type: "date" },
  { name: "location", label: "Local" },
  { name: "status", label: "Status", type: "select", options: ["ativo", "custo pendente", "pausado", "inativo"] },
];

const packagingFields = [
  { name: "name", label: "Nome", required: true },
  { name: "type", label: "Tipo", type: "select", options: [{ value: "bottle", label: "Garrafa/tampa" }, { value: "label", label: "Rótulo" }, { value: "box", label: "Caixa" }, { value: "material", label: "Outro material" }] },
  { name: "productId", label: "Sabor/produto do rótulo", type: "select", options: [{ value: "", label: "Genérico" }, ...state.products.map((product) => ({ value: product.id, label: productLabel(product) }))] },
  { name: "supplier", label: "Fornecedor" },
  { name: "unit", label: "Unidade", type: "select", options: ["un", "kg", "g", "l", "ml"] },
  { name: "costEach", label: "Custo unitário", type: "number", min: 0, step: "0.01" },
  { name: "stock", label: "Estoque", type: "number", min: 0, step: "1" },
  { name: "min", label: "Mínimo", type: "number", min: 0, step: "1" },
  { name: "location", label: "Local" },
];

const supplierFields = [
  { name: "name", label: "Nome", required: true },
  { name: "contact", label: "Contato" },
  { name: "whatsapp", label: "WhatsApp" },
  { name: "email", label: "Email" },
  { name: "city", label: "Cidade" },
  { name: "categories", label: "Categorias", full: true },
  { name: "leadTime", label: "Prazo médio" },
  { name: "status", label: "Status", type: "select", options: ["ativo", "pausado", "inativo"] },
];

const partnerFields = [
  { name: "name", label: "Nome", required: true },
  { name: "type", label: "Tipo" },
  { name: "neighborhood", label: "Bairro" },
  { name: "city", label: "Cidade" },
  { name: "whatsapp", label: "WhatsApp" },
  { name: "instagram", label: "Instagram" },
  { name: "flavors", label: "Sabores", full: true },
  { name: "terms", label: "Prazo de pagamento" },
  { name: "lastDelivery", label: "Última entrega", type: "date" },
  { name: "visible", label: "Aparecer no site público", type: "checkbox", full: true },
];

const expenseFields = [
  { name: "date", label: "Data", type: "date", required: true },
  { name: "category", label: "Categoria", required: true },
  { name: "description", label: "Descrição", full: true, required: true },
  { name: "amount", label: "Valor", type: "number", min: 0, step: "0.01", required: true },
  { name: "method", label: "Método" },
  { name: "recurring", label: "Despesa recorrente", type: "checkbox", full: true },
];

function recipeIngredientEditRow(line = {}) {
  const ingredient = byId("ingredients", line.ingredientId) || {};
  const selectedId = line.ingredientId || "__new__";
  return `
    <div class="builder-row recipe-edit-ingredient-row simple-recipe-row">
      <label class="field"><span>Ingrediente</span><select data-field="ingredientId">${ingredientSelectOptions(selectedId)}</select></label>
      <label class="field" data-new-ingredient-field><span>Novo ingrediente</span><input data-field="name" value="${selectedId === "__new__" ? escapeHtml(ingredient.name || line.name || "") : ""}" placeholder="Use só se for novo"></label>
      <label class="field" data-new-ingredient-field><span>Categoria</span><input data-field="category" value="${selectedId === "__new__" ? escapeHtml(ingredient.category || line.category || "") : ""}" placeholder="fruta, chá, flor..."></label>
      <label class="field"><span>Qtd. usada</span><input data-field="qty" type="number" min="0" step="0.001" value="${line.qty ?? 0}"></label>
      <label class="field"><span>Un.</span><select data-field="unit">${unitOptions(line.unit || "g")}</select></label>
      <button class="icon-btn" type="button" data-remove-builder-row aria-label="Remover ingrediente">
        <span class="material-symbols-outlined" aria-hidden="true">delete</span>
      </button>
    </div>
  `;
}

function recipePackagingEditRow(line = {}) {
  const material = byId("packaging", line.itemId) || {};
  const selectedId = line.itemId || state.packaging[0]?.id || "__new__";
  return `
    <div class="builder-row recipe-edit-packaging-row simple-packaging-row">
      <label class="field"><span>Material</span><select data-field="itemId">${packagingSelectOptions(selectedId)}</select></label>
      <label class="field" data-new-packaging-field><span>Novo material</span><input data-field="name" value="${selectedId === "__new__" ? escapeHtml(material.name || line.name || "") : ""}" placeholder="Use só se for novo"></label>
      <label class="field" data-new-packaging-field><span>Tipo</span><select data-field="type"><option value="bottle" ${inferPackagingType(material) === "bottle" ? "selected" : ""}>Garrafa/tampa</option><option value="label" ${inferPackagingType(material) === "label" ? "selected" : ""}>Rótulo</option><option value="box" ${inferPackagingType(material) === "box" ? "selected" : ""}>Caixa</option><option value="material" ${inferPackagingType(material) === "material" ? "selected" : ""}>Outro</option></select></label>
      <label class="field"><span>Qtd. por garrafa</span><input data-field="qty" type="number" min="0" step="0.001" value="${line.qty ?? 1}"></label>
      <button class="icon-btn" type="button" data-remove-builder-row aria-label="Remover material">
        <span class="material-symbols-outlined" aria-hidden="true">delete</span>
      </button>
    </div>
  `;
}

function editRecipeForm(recipeId) {
  const recipe = byId("recipes", recipeId);
  if (!recipe) return;
  openModal(
    "Editar receita",
    "Receitas",
    `
      <form id="recipeEditForm">
        <div class="input-grid">
          <label class="field field-full"><span>Produto / EAN</span><select name="productId"><option value="">Sem produto vinculado</option>${state.products.map((product) => `<option value="${product.id}" ${recipe.productId === product.id ? "selected" : ""}>${productLabel(product)}</option>`).join("")}</select></label>
          <label class="field"><span>Sabor</span><input name="flavor" value="${escapeHtml(recipe.flavor)}" required></label>
          <label class="field"><span>Versão</span><input name="version" value="${escapeHtml(recipe.version)}" required></label>
          <label class="field"><span>Status</span><select name="status">${["ativa", "rascunho", "pausada", "arquivada"].map((status) => `<option ${recipe.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
          <label class="field"><span>Tamanho ml</span><input name="bottleMl" type="number" min="1" value="${recipe.bottleMl}" required></label>
          <label class="field"><span>Rendimento da receita</span><input name="yieldBottles" type="number" min="1" value="${recipe.yieldBottles}" required></label>
          <label class="field"><span>Perda %</span><input name="wastePct" type="number" min="0" step="0.01" value="${recipe.wastePct || 0}"></label>
          <label class="field"><span>Atacado</span><input name="wholesalePrice" type="number" min="0" step="0.01" value="${recipe.wholesalePrice || 0}"></label>
          <label class="field"><span>Varejo</span><input name="retailPrice" type="number" min="0" step="0.01" value="${recipe.retailPrice || 0}"></label>
          <label class="field"><span>Mão de obra</span><input name="labor" type="number" min="0" step="0.01" value="${recipe.labor || 0}"></label>
          <label class="field"><span>Água/luz/gás</span><input name="utilities" type="number" min="0" step="0.01" value="${recipe.utilities || 0}"></label>
          <label class="field"><span>Outros custos</span><input name="other" type="number" min="0" step="0.01" value="${recipe.other || 0}"></label>
        </div>

        <div class="builder-section">
          <div class="table-toolbar">
            <div>
              <h3>Ingredientes usados</h3>
              <p>Escolha somente o ingrediente e a quantidade usada. Custo e estoque são editados em Ingredientes/Compras.</p>
            </div>
          </div>
          <div id="recipeEditIngredientRows">${(recipe.ingredients?.length ? recipe.ingredients : [{}]).map(recipeIngredientEditRow).join("")}</div>
          <div class="builder-bottom-actions">
            <button class="btn btn-outline" type="button" data-add-edit-ingredient>
              <span class="material-symbols-outlined" aria-hidden="true">add</span>
              Adicionar ingrediente
            </button>
          </div>
        </div>

        <div class="builder-section">
          <div class="table-toolbar">
            <div>
              <h3>Embalagens e rótulos</h3>
              <p>Inclua garrafa, rótulo do sabor, tampa, caixa ou qualquer material consumido.</p>
            </div>
          </div>
          <div id="recipeEditPackagingRows">${(recipe.packaging?.length ? recipe.packaging : [{}]).map(recipePackagingEditRow).join("")}</div>
          <div class="builder-bottom-actions">
            <button class="btn btn-outline" type="button" data-add-edit-packaging>
              <span class="material-symbols-outlined" aria-hidden="true">add</span>
              Adicionar material
            </button>
          </div>
        </div>

        <label class="check-row field-full">
          <input name="editPricesAfterSave" type="checkbox">
          <span>Editar preços dos ingredientes depois de salvar</span>
        </label>

        <button class="btn btn-primary" type="submit">
          <span class="material-symbols-outlined" aria-hidden="true">save</span>
          Salvar receita completa
        </button>
      </form>
    `,
  );
  const form = document.querySelector("#recipeEditForm");
  form.querySelector("[data-add-edit-ingredient]").addEventListener("click", () => {
    const target = document.querySelector("#recipeEditIngredientRows");
    target.insertAdjacentHTML("beforeend", recipeIngredientEditRow());
    enhanceSelectSearch(target);
  });
  form.querySelector("[data-add-edit-packaging]").addEventListener("click", () => {
    const target = document.querySelector("#recipeEditPackagingRows");
    target.insertAdjacentHTML("beforeend", recipePackagingEditRow());
    enhanceSelectSearch(target);
  });
  bindIngredientBuilderRows(form);
  form.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-builder-row]");
    if (!removeButton) return;
    const parent = removeButton.closest(".builder-row");
    const container = parent.parentElement;
    if (container.children.length > 1) parent.remove();
  });
  form.querySelector("[name='productId']").addEventListener("change", (event) => {
    const product = byId("products", event.target.value);
    if (!product) return;
    form.elements.flavor.value = product.flavor;
    form.elements.bottleMl.value = product.sizeMl;
    form.elements.wholesalePrice.value = product.wholesalePrice || 0;
    form.elements.retailPrice.value = product.retailPrice || 0;
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    Object.assign(recipe, {
      productId: data.productId || "",
      flavor: data.flavor,
      version: data.version,
      status: data.status,
      bottleMl: Number(data.bottleMl),
      yieldBottles: Number(data.yieldBottles),
      wastePct: Number(data.wastePct || 0),
      wholesalePrice: Number(data.wholesalePrice || 0),
      retailPrice: Number(data.retailPrice || 0),
      labor: Number(data.labor || 0),
      utilities: Number(data.utilities || 0),
      other: Number(data.other || 0),
      ingredients: Array.from(form.querySelectorAll(".recipe-edit-ingredient-row"))
        .map(readBuilderRow)
        .filter((row) => row.ingredientId && Number(row.qty) > 0)
        .map((row) => {
          let ingredient = row.ingredientId === "__new__" ? null : byId("ingredients", row.ingredientId);
          if (!ingredient && row.name) {
            ingredient = findOrCreateIngredient({
              name: row.name,
              category: row.category || "outro",
              purchaseUnit: row.unit || "g",
              costPerUnit: "",
              stock: 0,
              min: 0,
            });
          }
          if (!ingredient) return null;
          return { ingredientId: ingredient.id, qty: Number(row.qty), unit: row.unit || ingredient.purchaseUnit || "g" };
        })
        .filter(Boolean),
      packaging: Array.from(form.querySelectorAll(".recipe-edit-packaging-row"))
        .map(readBuilderRow)
        .filter((row) => (row.itemId !== "__new__" || row.name) && Number(row.qty) > 0)
        .map((row) => {
          let material = row.itemId === "__new__" ? null : byId("packaging", row.itemId);
          if (!material && row.name) {
            material = findOrCreatePackaging({
              name: row.name,
              type: row.type || "material",
              unit: "un",
              costEach: 0,
              stock: 0,
              min: 0,
            });
          }
          if (!material) return null;
          return { itemId: material.id, qty: Number(row.qty) };
        })
        .filter(Boolean),
    });
    activeRecipeId = recipe.id;
    addAudit("Receita atualizada", recipeLabel(recipe));
    closeModal();
    if (data.editPricesAfterSave === "on") setModule("ingredients");
    else render();
  });
}

function editBatchForm(batchId) {
  const original = clone(byId("batches", batchId));
  const batchFields = [
    { name: "code", label: "Código do lote", required: true },
    { name: "recipeId", label: "Receita", type: "select", options: state.recipes.map((recipe) => ({ value: recipe.id, label: recipeLabel(recipe) })) },
    { name: "date", label: "Data de produção", type: "date", required: true },
    { name: "responsible", label: "Responsável" },
    { name: "actual", label: "Garrafas produzidas", type: "number", min: 0 },
    { name: "idealSellBy", label: "Ideal vender até", type: "date" },
    { name: "sellBy", label: "Vender até", type: "date" },
    { name: "expiry", label: "Validade", type: "date" },
    { name: "status", label: "Status", type: "select", options: ["planejado", "em produção", "bottled", "aprovado", "bloqueado"] },
  ];
  editRecordForm("batches", batchId, "Editar lote", batchFields, (batch) => {
    const originalRecipe = byId("recipes", original?.recipeId);
    if (original?.inventoryAdjusted && originalRecipe) applyBatchInventory(originalRecipe, Number(original.inventoryQty || original.actual || 0), 1);
    const recipe = byId("recipes", batch.recipeId);
    batch.flavor = recipe?.flavor || batch.flavor;
    batch.productId = recipe?.productId || batch.productId || "";
    batch.expected = Number(batch.actual || 0);
    const plan = batchDatePlan(batch.date);
    batch.idealSellBy = batch.idealSellBy || plan.idealSellBy;
    batch.sellBy = batch.sellBy || plan.sellBy;
    batch.expiry = batch.expiry || plan.expiry;
    if (recipe && shouldConsumeBatch(batch)) {
      applyBatchInventory(recipe, Number(batch.actual || 0), -1);
      batch.inventoryAdjusted = true;
      batch.inventoryQty = Number(batch.actual || 0);
    } else {
      batch.inventoryAdjusted = false;
      batch.inventoryQty = 0;
    }
    reconcileOrderReservations();
  });
}

function deleteBatch(batchId) {
  const batch = byId("batches", batchId);
  if (!batch) return;
  if (!window.confirm(`Excluir lote "${batch.code}"? O estoque de ingredientes e materiais será restaurado quando este lote já tiver dado baixa.`)) return;
  const recipe = byId("recipes", batch.recipeId);
  if (batch.inventoryAdjusted && recipe) applyBatchInventory(recipe, Number(batch.inventoryQty || batch.actual || 0), 1);
  state.batches = state.batches.filter((item) => item.id !== batchId);
  reconcileOrderReservations();
  addAudit("Lote excluído", batch.code);
  render();
}

function editSaleForm(saleId) {
  const sale = byId("sales", saleId);
  const batchOptions = state.batches
    .filter((batch) => batch.status !== "descartado")
    .map((batch) => ({ value: batch.code, label: `${batch.code} - ${batch.flavor}` }));
  if (sale?.batchCode && !batchOptions.some((option) => option.value === sale.batchCode)) {
    batchOptions.unshift({ value: sale.batchCode, label: sale.batchCode });
  }
  const saleFields = [
    { name: "date", label: "Data", type: "date", required: true },
    { name: "movementType", label: "Tipo de saída", type: "select", options: [{ value: "venda", label: "Venda" }, { value: "consumo", label: "Consumo próprio" }, { value: "presente", label: "Presente / amostra" }, { value: "perda", label: "Perda / quebra" }] },
    { name: "customerName", label: "Cliente / destino" },
    { name: "batchCode", label: "Lote", type: "select", options: batchOptions },
    { name: "qty", label: "Quantidade", type: "number", min: 0, step: "1" },
    { name: "priceType", label: "Preço", type: "select", options: [{ value: "varejo", label: "Varejo" }, { value: "atacado", label: "Atacado" }, { value: "custom", label: "Valor combinado" }, { value: "gratis", label: "Sem cobrança" }] },
    { name: "unitPrice", label: "Preço unitário", type: "number", min: 0, step: "0.01" },
    { name: "discount", label: "Desconto", type: "number", min: 0, step: "0.01" },
    { name: "delivery", label: "Entrega", type: "number", min: 0, step: "0.01" },
    { name: "note", label: "Observação", full: true },
  ];
  editRecordForm("sales", saleId, "Editar venda", saleFields, (sale) => {
    const batch = state.batches.find((item) => item.code === sale.batchCode);
    const product = productForBatch(batch);
    sale.flavor = batch?.flavor || sale.flavor || "";
    sale.productId = product?.id || sale.productId || "";
    sale.partner = sale.customerName || sale.partner;
    sale.channel = sale.movementType === "venda" ? sale.priceType : sale.movementType;
  });
}

function orderItemRowTemplate(item = {}, clientType = "novo_cliente") {
  const selectedProductId = item.productId || state.products[0]?.id || "";
  const selectedProduct = byId("products", selectedProductId) || state.products[0];
  const defaultPrice = item.unitPrice ?? priceForOrderClientType(selectedProduct, clientType);
  const status = item.productionStatus || "pendente";
  const allocationsJson = JSON.stringify(orderItemAllocations(item));
  const reservationOverrideJson = JSON.stringify(item.reservationOverride || null);
  return `
    <div class="builder-row order-item-row" hidden>
      ${variantPickerTemplate(productVariantChoices(), selectedProductId, 'data-field="productId"')}
      <label class="field"><span>Qtd. garrafas</span><input data-field="qty" type="number" min="${Math.max(1, orderItemDeliveredQty(item))}" step="1" value="${item.qty || 1}"></label>
      <label class="field"><span>Preço unitário</span><input data-field="unitPrice" type="number" min="0" step="0.01" value="${defaultPrice}"></label>
      <label class="field"><span>Status produção</span><select data-field="productionStatus">${ORDER_ITEM_STATUSES.map((option) => `<option value="${option}" ${status === option ? "selected" : ""}>${option}</option>`).join("")}</select></label>
      <label class="field"><span>Pronto em</span><input data-field="readyDate" type="date" value="${item.readyDate || ""}"></label>
      <label class="field"><span>Obs. do item</span><input data-field="note" value="${escapeHtml(item.note || "")}" placeholder="Ex: caixa, entrega, condição..."></label>
      <div class="result-card reservation-note">
        <small>Reserva automática</small>
        <span>${orderItemAllocationLabel(item)}</span>
      </div>
      <input type="hidden" data-field="batchCode" value="${escapeHtml(item.batchCode || "")}">
      <input type="hidden" data-field="producedQty" value="${Number(item.producedQty || 0)}">
      <input type="hidden" data-field="reservedQty" value="${Number(item.reservedQty || 0)}">
      <input type="hidden" data-field="deliveredQty" value="${Number(item.deliveredQty || 0)}">
      <input type="hidden" data-field="allocations" value="${escapeHtml(allocationsJson)}">
      <input type="hidden" data-field="reservationTarget" value="${item.reservationTarget == null ? "" : Number(item.reservationTarget)}">
      <input type="hidden" data-field="reservationOverride" value="${escapeHtml(reservationOverrideJson)}">
      <input type="hidden" data-field="key" value="${escapeHtml(item.key || id("oi"))}">
      <button class="icon-btn" type="button" data-remove-builder-row aria-label="Remover item">
        <span class="material-symbols-outlined" aria-hidden="true">delete</span>
      </button>
    </div>
  `;
}

function availableStockForProduct(productId) {
  return finishedStockRows()
    .filter((row) => row.product?.id === productId || row.productId === productId)
    .reduce((sum, row) => sum + Number(row.stock || 0), 0);
}

function orderItemEditorKey(row) {
  return row?.querySelector('[data-field="key"]')?.value || "";
}

function renderOrderItemNavigator(form, preferredKey = "") {
  const rowsContainer = form.querySelector("#orderItemsRows");
  const navigator = form.querySelector("#orderItemNavigator");
  const activeTitle = form.querySelector("#orderActiveItemTitle");
  if (!rowsContainer || !navigator) return;
  const rows = Array.from(rowsContainer.querySelectorAll(".order-item-row"));
  if (!rows.length) {
    navigator.innerHTML = "";
    return;
  }
  const currentRow = rows.find((row) => row.classList.contains("is-active"));
  const activeKey = preferredKey || orderItemEditorKey(currentRow) || orderItemEditorKey(rows[0]);
  navigator.innerHTML = rows
    .map((row) => {
      const key = orderItemEditorKey(row);
      const item = readOrderItemRow(row) || {};
      const product = byId("products", item.productId);
      const available = availableStockForProduct(item.productId);
      const reserved = orderItemReservedQty(item);
      const requested = Number(item.qty || 0);
      const remaining = Math.max(0, requested - reserved);
      const availability = remaining <= 0 ? "reserva completa" : available <= 0 ? "sem estoque" : available < remaining ? "parcial" : "disponível";
      return `
        <button type="button" class="order-item-selector ${key === activeKey ? "is-active" : ""}" data-order-item-select="${escapeHtml(key)}" aria-pressed="${key === activeKey}">
          <span class="order-item-selector-head"><strong>${escapeHtml(product ? `${product.flavor} · ${number(product.sizeMl)}ml` : item.flavor || "Novo sabor")}</strong><i class="material-symbols-outlined" aria-hidden="true">edit</i></span>
          <span class="order-item-selector-stock"><b>Disp. ${number(available)}</b><b>Res. ${number(reserved)}/${number(requested)}</b></span>
          <small class="${availability === "sem estoque" ? "is-empty" : availability === "parcial" ? "is-partial" : "is-available"}">${availability} | ${escapeHtml(item.productionStatus || "pendente")}</small>
        </button>
      `;
    })
    .join("");
  rows.forEach((row) => {
    const isActive = orderItemEditorKey(row) === activeKey;
    row.classList.toggle("is-active", isActive);
    row.hidden = !isActive;
    if (isActive && activeTitle) {
      const product = byId("products", row.querySelector('[data-field="productId"]')?.value);
      activeTitle.textContent = product ? `${product.flavor} · ${number(product.sizeMl)}ml` : "Editar sabor";
    }
  });
}

function readOrderItemRow(row) {
  const data = readBuilderRow(row);
  const product = byId("products", data.productId);
  if (!product || Number(data.qty || 0) <= 0) return null;
  let allocations = [];
  try {
    allocations = JSON.parse(data.allocations || "[]");
  } catch {
    allocations = [];
  }
  allocations = allocations
    .map((allocation) => ({
      batchCode: String(allocation.batchCode || "").trim(),
      qty: Number(allocation.qty || 0),
      date: allocation.date || "",
      manual: allocation.manual === true,
      note: allocation.note || "",
    }))
    .filter((allocation) => allocation.batchCode && allocation.qty > 0);
  const qty = Number(data.qty || 0);
  const deliveredQty = Math.max(0, Math.min(qty, Number(data.deliveredQty || 0)));
  const outstandingQty = Math.max(0, qty - deliveredQty);
  const allocatedQty = allocations.reduce((sum, allocation) => sum + Number(allocation.qty || 0), 0);
  const reservedQty = Math.min(outstandingQty, Math.max(Number(data.reservedQty || 0), allocatedQty));
  let reservationOverride = null;
  try {
    reservationOverride = JSON.parse(data.reservationOverride || "null");
  } catch {
    reservationOverride = null;
  }
  const reservationTarget = data.reservationTarget === "" ? null : Math.max(0, Math.min(outstandingQty, Number(data.reservationTarget || 0)));
  return {
    productId: product.id,
    productName: productLabel(product),
    flavor: product.flavor,
    sizeMl: Number(product.sizeMl || BASE_BOTTLE_SIZE_ML),
    key: data.key || id("oi"),
    qty,
    deliveredQty,
    unitPrice: Number(data.unitPrice || 0),
    productionStatus: data.productionStatus || "pendente",
    producedQty: reservedQty,
    reservedQty,
    readyDate: data.readyDate || "",
    batchCode: allocations.length ? allocations.map((allocation) => allocation.batchCode).join(", ") : data.batchCode || "",
    allocations,
    reservationTarget,
    reservationOverride,
    note: data.note || "",
  };
}

function updateOrderPreview(form) {
  const preview = form.querySelector("#orderPreview");
  const items = Array.from(form.querySelectorAll(".order-item-row")).map(readOrderItemRow).filter(Boolean);
  const totalQty = items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const totalValue = items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.unitPrice || 0), 0);
  if (preview) {
    preview.innerHTML = `
      <small>Resumo do pedido</small>
      <strong>${number(totalQty)} garrafas | ${brl(totalValue)}</strong>
      <span>Pedido alimenta produção; ao marcar entregue, vira venda e cobrança automaticamente.</span>
    `;
  }
  return { items, totalQty, totalValue };
}

function bindOrderForm(form) {
  const rows = form.querySelector("#orderItemsRows");
  const partnerField = form.querySelector("[data-recurring-partner-field]");
  const partnerSelect = form.elements.partnerId;
  const applyPartnerVisibility = () => {
    const isRecurringPartner = form.elements.clientType?.value === "parceiro_recorrente";
    if (partnerField) partnerField.hidden = !isRecurringPartner;
    if (partnerSelect) {
      partnerSelect.required = isRecurringPartner && state.partners.length > 0;
      if (!isRecurringPartner) partnerSelect.value = "";
    }
  };
  const applySelectedPartner = () => {
    const partner = byId("partners", partnerSelect?.value);
    if (!partner) return;
    form.elements.customerName.value = partner.name || form.elements.customerName.value;
    form.elements.businessName.value = partner.name || form.elements.businessName.value;
    form.elements.whatsapp.value = partner.whatsapp || form.elements.whatsapp.value;
    if (form.elements.instagram) form.elements.instagram.value = partner.instagram || "";
    if (form.elements.neighborhood) form.elements.neighborhood.value = partner.neighborhood || "";
    if (form.elements.city) form.elements.city.value = partner.city || "Manaus";
    if (!form.elements.source.value) form.elements.source.value = "Parceiro cadastrado";
  };
  const applyClientPricing = (row) => {
    const product = byId("products", row.querySelector('[data-field="productId"]')?.value);
    setRowField(row, "unitPrice", priceForOrderClientType(product, form.elements.clientType?.value || "novo_cliente"));
  };
  const bindProductPicker = (row) => {
    bindVariantPicker(row, productVariantChoices(), () => {
      applyClientPricing(row);
      updateOrderPreview(form);
      renderOrderItemNavigator(form, orderItemEditorKey(row));
    });
  };
  form.querySelector("[data-add-order-item]")?.addEventListener("click", () => {
    rows.insertAdjacentHTML("beforeend", orderItemRowTemplate({}, form.elements.clientType?.value || "novo_cliente"));
    enhanceSelectSearch(rows);
    bindProductPicker(rows.lastElementChild);
    applyClientPricing(rows.lastElementChild);
    updateOrderPreview(form);
    renderOrderItemNavigator(form, orderItemEditorKey(rows.lastElementChild));
  });
  form.addEventListener("click", (event) => {
    const itemSelector = event.target.closest("[data-order-item-select]");
    if (itemSelector) {
      renderOrderItemNavigator(form, itemSelector.dataset.orderItemSelect);
      return;
    }
    const removeButton = event.target.closest("[data-remove-builder-row]");
    if (!removeButton) return;
    const row = removeButton.closest(".order-item-row");
    if (row && rows.children.length > 1) {
      const nextRow = row.nextElementSibling || row.previousElementSibling;
      row.remove();
      renderOrderItemNavigator(form, orderItemEditorKey(nextRow));
    }
    updateOrderPreview(form);
  });
  form.addEventListener("change", (event) => {
    const row = event.target.closest(".order-item-row");
    if (row && event.target.dataset.field === "productId") {
      applyClientPricing(row);
    }
    if (event.target.name === "clientType") {
      applyPartnerVisibility();
      if (event.target.value === "parceiro_recorrente") applySelectedPartner();
      rows.querySelectorAll(".order-item-row").forEach(applyClientPricing);
    }
    if (event.target.name === "partnerId") applySelectedPartner();
    if (event.target.name === "status" && event.target.value === "entregue" && !form.elements.deliveredAt.value) {
      form.elements.deliveredAt.value = todayIso();
      form.elements.paymentDueDate.value = addDaysIso(todayIso(), 15);
    }
    if (event.target.name === "deliveredAt" && event.target.value && !form.elements.paymentDueDate.value) {
      form.elements.paymentDueDate.value = addDaysIso(event.target.value, 15);
    }
    updateOrderPreview(form);
    if (row || event.target.name === "clientType") renderOrderItemNavigator(form, orderItemEditorKey(row));
  });
  form.addEventListener("input", (event) => {
    updateOrderPreview(form);
    const row = event.target.closest(".order-item-row");
    if (row) renderOrderItemNavigator(form, orderItemEditorKey(row));
  });
  rows.querySelectorAll(".order-item-row").forEach((row) => {
    bindProductPicker(row);
    if (!Number(row.querySelector('[data-field="unitPrice"]')?.value || 0)) applyClientPricing(row);
  });
  applyPartnerVisibility();
  updateOrderPreview(form);
  renderOrderItemNavigator(form);
}

function orderForm(orderId) {
  if (!state.products.length) {
    openModal(
      "Cadastre produtos primeiro",
      "Pedidos",
      `<p class="empty-note">Pedidos precisam de produtos/sabores cadastrados para calcular quantidade e valor.</p>
       <button class="btn btn-primary" type="button" data-action="new-product"><span class="material-symbols-outlined" aria-hidden="true">add</span>Novo produto</button>`,
    );
    return;
  }
  const existing = orderId ? byId("orders", orderId) : null;
  const orderDate = existing?.orderDate || todayIso();
  const readyDate = existing?.estimatedReadyDate || addDaysIso(orderDate, 7);
  const deliveredAt = existing?.deliveredAt || "";
  const paymentDueDate = existing?.paymentDueDate || (deliveredAt ? addDaysIso(deliveredAt, 15) : "");
  const clientType = existing?.clientType || "novo_cliente";
  const selectedPartner = selectedPartnerForOrder(existing || {});
  const selectedPartnerId = existing?.partnerId || selectedPartner?.id || "";
  const partnerOptions = state.partners.length
    ? `<option value="">Escolha um parceiro cadastrado</option>${state.partners
        .map((partner) => `<option value="${partner.id}" ${selectedPartnerId === partner.id ? "selected" : ""}>${escapeHtml(partnerOptionLabel(partner))}</option>`)
        .join("")}`
    : `<option value="">Nenhum parceiro cadastrado ainda</option>`;
  const orderItemsSection = `
    <div class="builder-section order-items-editor">
      <div class="table-toolbar">
        <div>
          <h3>Sabores do pedido</h3>
          <p>Toque em um sabor para ver e editar somente aquele item.</p>
        </div>
      </div>
      <div class="order-item-navigator" id="orderItemNavigator" aria-label="Sabores do pedido"></div>
      <button class="btn btn-outline order-add-item" type="button" data-add-order-item>
        <span class="material-symbols-outlined" aria-hidden="true">add</span>
        Adicionar sabor
      </button>
      <div class="order-active-editor-head">
        <span>Editar sabor selecionado</span>
        <strong id="orderActiveItemTitle"></strong>
      </div>
      <div id="orderItemsRows">${(existing && orderItems(existing).length ? orderItems(existing) : [{}]).map((item) => orderItemRowTemplate(item, clientType)).join("")}</div>
    </div>
  `;
  openModal(
    existing ? "Editar pedido" : "Novo pedido",
    "Pedidos",
    `
      <form id="orderForm">
        ${existing ? orderItemsSection : ""}

        <details class="form-section" ${existing ? "" : "open"}>
          <summary>Operação do pedido</summary>
          <div class="input-grid">
            <label class="field"><span>Cliente</span><input name="customerName" value="${escapeHtml(existing?.customerName || "")}" required></label>
            <label class="field"><span>Negócio / empresa</span><input name="businessName" value="${escapeHtml(existing?.businessName || "")}"></label>
            <label class="field"><span>Tipo de cliente</span><select name="clientType" class="admin-select">${ORDER_CLIENT_TYPES.map((type) => `<option value="${type.value}" ${clientType === type.value ? "selected" : ""}>${type.label}</option>`).join("")}</select></label>
            <label class="field"><span>Status</span><select name="status" class="admin-select">${ORDER_STATUSES.map((status) => `<option value="${status}" ${existing?.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
            <label class="field field-full" data-recurring-partner-field><span>Parceiro cadastrado</span><select name="partnerId" class="admin-select" data-force-search="true" ${state.partners.length ? "" : "disabled"}>${partnerOptions}</select></label>
            <label class="field"><span>Previsão de pronto</span><input name="estimatedReadyDate" type="date" value="${readyDate}"></label>
            <label class="field"><span>Cliente precisa até</span><input name="neededBy" type="date" value="${existing?.neededBy || ""}"></label>
            <label class="field"><span>Data de entrega</span><input name="deliveredAt" type="date" value="${deliveredAt}"></label>
            <div class="result-card field-full" id="orderPreview"></div>
          </div>
        </details>

        <details class="form-section">
          <summary>Detalhes e cobrança</summary>
          <div class="input-grid">
            <label class="field"><span>Código</span><input name="code" value="${escapeHtml(existing?.code || nextOrderCode(orderDate))}" required></label>
            <label class="field"><span>Data do pedido</span><input name="orderDate" type="date" value="${orderDate}" required></label>
            <label class="field"><span>Receber até</span><input name="paymentDueDate" type="date" value="${paymentDueDate}"></label>
            <label class="field"><span>Status pagamento</span><select name="paymentStatus" class="admin-select">${PAYMENT_STATUSES.map((status) => `<option value="${status}" ${orderReceivableStatus(existing || {}) === status || existing?.paymentStatus === status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
            <label class="field"><span>Forma de pagamento</span><select name="paymentMethod" class="admin-select"><option value="">Não informada</option>${PAYMENT_METHODS.map((method) => `<option value="${method}" ${existing?.paymentMethod === method ? "selected" : ""}>${method}</option>`).join("")}</select></label>
            <label class="field"><span>WhatsApp</span><input name="whatsapp" value="${escapeHtml(existing?.whatsapp || "")}"></label>
            <label class="field"><span>Origem</span><input name="source" value="${escapeHtml(existing?.source || "")}" placeholder="WhatsApp, feira, revendedor..."></label>
            <label class="field field-full"><span>Observações do pedido</span><textarea name="notes" placeholder="Condição comercial, entrega, prioridade, cobrança...">${escapeHtml(existing?.notes || "")}</textarea></label>
            <input type="hidden" name="instagram" value="${escapeHtml(existing?.instagram || selectedPartner?.instagram || "")}">
            <input type="hidden" name="neighborhood" value="${escapeHtml(existing?.neighborhood || selectedPartner?.neighborhood || "")}">
            <input type="hidden" name="city" value="${escapeHtml(existing?.city || selectedPartner?.city || "Manaus")}">
          </div>
        </details>

        ${existing ? "" : orderItemsSection}

        <button class="btn btn-primary" type="submit">
          <span class="material-symbols-outlined" aria-hidden="true">save</span>
          Salvar pedido
        </button>
      </form>
    `,
  );
  const form = document.querySelector("#orderForm");
  form.elements.orderDate.addEventListener("change", () => {
    if (!form.elements.estimatedReadyDate.value) form.elements.estimatedReadyDate.value = addDaysIso(form.elements.orderDate.value, 7);
    if (!existing) form.elements.code.value = nextOrderCode(form.elements.orderDate.value);
  });
  bindOrderForm(form);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const { items, totalQty, totalValue } = updateOrderPreview(form);
    if (!items.length) {
      window.alert("Adicione pelo menos um item ao pedido.");
      return;
    }
    if (data.status === "entregue" && items.some((item) => orderItemOutstandingQty(item) > 0)) {
      window.alert("Para concluir um pedido, registre a entrega pelo botão PDF da entrega. Assim o sistema baixa somente a remessa enviada e mantém o saldo pendente corretamente.");
      return;
    }
    const payload = {
      code: data.code,
      orderDate: data.orderDate,
      estimatedReadyDate: data.estimatedReadyDate,
      deliveredAt: data.deliveredAt,
      paymentDueDate: data.paymentDueDate || (data.deliveredAt ? addDaysIso(data.deliveredAt, 15) : ""),
      paymentStatus: data.paymentStatus,
      paymentMethod: data.paymentMethod || "",
      neededBy: data.neededBy,
      status: data.status,
      clientType: data.clientType || "novo_cliente",
      partnerId: data.partnerId || "",
      customerName: data.customerName,
      businessName: data.businessName,
      whatsapp: data.whatsapp,
      instagram: data.instagram,
      neighborhood: data.neighborhood,
      city: data.city || "Manaus",
      source: data.source,
      notes: data.notes,
      items,
      totalQty,
      totalValue,
      updatedAt: new Date().toISOString(),
    };
    if (existing) {
      Object.assign(existing, payload);
      syncOrderIntegrations(existing);
      reconcileOrderReservations();
      addAudit("Pedido atualizado", `${payload.code}: ${payload.customerName}`);
    } else {
      const order = { id: id("ord"), createdAt: new Date().toISOString(), ...payload };
      syncOrderIntegrations(order);
      state.orders.unshift(order);
      reconcileOrderReservations();
      addAudit("Pedido criado", `${payload.code}: ${payload.customerName} | ${number(totalQty)} garrafas`);
    }
    closeModal();
    setModule("orders");
  });
}

function editPurchaseForm(purchaseId) {
  const purchase = byId("purchases", purchaseId);
  if (purchase?.kind === "operational") {
    editRecordForm(
      "purchases",
      purchaseId,
      "Editar despesa operacional",
      [
        { name: "date", label: "Data", type: "date", required: true },
        { name: "supplier", label: "Fornecedor" },
        { name: "item", label: "Descrição", full: true, required: true },
        { name: "total", label: "Total pago", type: "number", min: 0, step: "0.01" },
        { name: "method", label: "Método" },
        { name: "buyer", label: "Comprador" },
      ],
      (record) => {
        record.kind = "operational";
        record.qty = 0;
        record.unit = "";
        record.costPerUnit = 0;
        syncPurchaseExpense(record);
      },
    );
    return;
  }
  if (purchase && !purchase.packageCount) {
    purchase.packageCount = 1;
    purchase.packageSize = Number(purchase.qty || 0);
    purchase.packageUnit = purchase.unit || "g";
  }
  const currentTarget = stockItemForPurchase(purchase);
  if (purchase && currentTarget?.item) {
    purchase.stockKey = purchaseStockKey(currentTarget.collection, currentTarget.item.id);
    purchase.stockCollection = currentTarget.collection;
    purchase.stockItemId = currentTarget.item.id;
  }
  const previousTarget = currentTarget ? { collection: currentTarget.collection, itemId: currentTarget.item.id } : null;
  const previousQty = Number(purchase?.qty || 0);
  const purchaseFields = [
    { name: "date", label: "Data", type: "date", required: true },
    { name: "supplier", label: "Fornecedor" },
    {
      name: "stockKey",
      label: "Item de estoque",
      type: "select",
      options: [
        ...state.ingredients.map((ingredient) => ({ value: purchaseStockKey("ingredients", ingredient.id), label: `${ingredient.name} (${ingredient.purchaseUnit})` })),
        ...state.packaging.map((material) => ({ value: purchaseStockKey("packaging", material.id), label: `${material.name} (${material.unit || "un"})` })),
      ],
    },
    { name: "packageCount", label: "Pacotes / unidades", type: "number", min: 0, step: "1" },
    { name: "packageSize", label: "Conteúdo por pacote", type: "number", min: 0, step: "0.001" },
    { name: "packageUnit", label: "Unidade do pacote", type: "select", options: ["kg", "g", "l", "ml", "un"] },
    { name: "total", label: "Total pago", type: "number", min: 0, step: "0.01" },
    { name: "method", label: "Método" },
    { name: "buyer", label: "Comprador" },
  ];
  editRecordForm("purchases", purchaseId, "Editar compra", purchaseFields, (record) => {
    const previousItem = previousTarget ? stockItemFromKey(purchaseStockKey(previousTarget.collection, previousTarget.itemId)) : null;
    const nextTarget = stockItemFromKey(record.stockKey);
    const unit = stockUnitFor(nextTarget.collection, nextTarget.item, record.packageUnit || record.unit);
    const nextQty = purchaseQuantityInStockUnit(record, unit);
    const nextCost = Number(record.total || 0) / Math.max(nextQty, 0.000001);
    if (previousItem?.item) previousItem.item.stock = Math.max(0, Number(previousItem.item.stock || 0) - previousQty);
    if (nextTarget.item) {
      nextTarget.item.stock = Number(nextTarget.item.stock || 0) + nextQty;
      nextTarget.item.supplier = record.supplier || nextTarget.item.supplier;
      nextTarget.item.packageCount = Number(record.packageCount || 0);
      nextTarget.item.packageSize = Number(record.packageSize || 0);
      nextTarget.item.packageUnit = record.packageUnit;
      nextTarget.item.packageTotal = Number(record.total || 0);
      if (nextTarget.collection === "packaging") {
        nextTarget.item.unit = unit;
        nextTarget.item.costEach = nextCost;
      } else {
        nextTarget.item.purchaseUnit = unit;
        nextTarget.item.costPerUnit = nextCost;
      }
    }
    record.item = nextTarget.item?.name || record.item;
    record.qty = nextQty;
    record.unit = unit;
    record.costPerUnit = nextCost;
    record.stockCollection = nextTarget.collection;
    record.stockItemId = nextTarget.item?.id || "";
    record.ingredientId = nextTarget.collection === "ingredients" ? nextTarget.item?.id || "" : "";
    record.packagingId = nextTarget.collection === "packaging" ? nextTarget.item?.id || "" : "";
    syncPurchaseExpense(record);
  });
}

function addRecipeIngredientForm(recipeId) {
  const recipe = byId("recipes", recipeId);
  if (!recipe) return;
  openModal(
    "Adicionar ingrediente à receita",
    recipeLabel(recipe),
    `
      <form id="recipeLineForm">
        <div class="input-grid">
          <label class="field field-full"><span>Usar ingrediente existente</span><select name="ingredientId" class="admin-select"><option value="">Criar novo ingrediente</option>${state.ingredients.map((item) => `<option value="${item.id}">${escapeHtml(item.name)} (${escapeHtml(item.purchaseUnit)})</option>`).join("")}</select></label>
          <label class="field"><span>Novo ingrediente</span><input name="name" placeholder="Use se não escolheu existente"></label>
          <label class="field"><span>Categoria</span><input name="category"></label>
          <label class="field"><span>Fornecedor</span><input name="supplier"></label>
          <label class="field"><span>Un. compra</span><select name="purchaseUnit" class="admin-select">${unitOptions("kg")}</select></label>
          <label class="field"><span>Custo/un.</span><input name="costPerUnit" type="number" min="0" step="0.000001" value="0"></label>
          <label class="field"><span>Qtd. usada</span><input name="qty" type="number" min="0" step="0.001" required></label>
          <label class="field"><span>Un. uso</span><select name="unit" class="admin-select">${unitOptions("g")}</select></label>
        </div>
        <button class="btn btn-primary" type="submit">Adicionar ingrediente</button>
      </form>
    `,
  );
  document.querySelector("#recipeLineForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const ingredient = data.ingredientId
      ? byId("ingredients", data.ingredientId)
      : findOrCreateIngredient({ ...data, usageQty: data.qty, usageUnit: data.unit, stock: 0, min: 0 });
    if (!ingredient) return;
    recipe.ingredients.push({ ingredientId: ingredient.id, qty: Number(data.qty || 0), unit: data.unit || ingredient.purchaseUnit });
    addAudit("Ingrediente adicionado à receita", `${recipe.flavor}: ${ingredient.name}`);
    closeModal();
    render();
  });
}

function addRecipePackagingForm(recipeId) {
  const recipe = byId("recipes", recipeId);
  if (!recipe) return;
  openModal(
    "Adicionar material à receita",
    recipeLabel(recipe),
    `
      <form id="recipePackagingForm">
        <div class="input-grid">
          <label class="field field-full"><span>Usar material existente</span><select name="itemId" class="admin-select"><option value="">Criar novo material</option>${state.packaging.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join("")}</select></label>
          <label class="field"><span>Novo material</span><input name="name" placeholder="Use se não escolheu existente"></label>
          <label class="field"><span>Fornecedor</span><input name="supplier"></label>
          <label class="field"><span>Custo por unidade</span><input name="costEach" type="number" min="0" step="0.01" value="0"></label>
          <label class="field"><span>Qtd. por garrafa</span><input name="qty" type="number" min="0" step="0.001" value="1" required></label>
        </div>
        <button class="btn btn-primary" type="submit">Adicionar material</button>
      </form>
    `,
  );
  document.querySelector("#recipePackagingForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const material = data.itemId ? byId("packaging", data.itemId) : findOrCreatePackaging({ ...data, qtyPerBottle: data.qty, stock: 0, min: 0 });
    if (!material) return;
    recipe.packaging.push({ itemId: material.id, qty: Number(data.qty || 0) });
    addAudit("Material adicionado à receita", `${recipe.flavor}: ${material.name}`);
    closeModal();
    render();
  });
}

function removeRecipeLine(payload, collection) {
  const [recipeId, indexText] = payload.split(":");
  const recipe = byId("recipes", recipeId);
  const index = Number(indexText);
  if (!recipe || !Array.isArray(recipe[collection]) || !recipe[collection][index]) return;
  recipe[collection].splice(index, 1);
  addAudit("Linha removida da receita", recipeLabel(recipe));
  render();
}

function newCmsFlavorForm() {
  openModal(
    "Novo sabor público",
    "CMS / Cardápio",
    `
      <form id="cmsFlavorForm">
        <div class="input-grid">
          <label class="field"><span>Nome</span><input name="name" required></label>
          <label class="field"><span>Slug</span><input name="slug" placeholder="ex: cupuacu-baunilha" required></label>
          <label class="field"><span>Categoria</span><select name="profile" class="admin-select">${FLAVOR_CATEGORIES.map((category) => `<option>${category}</option>`).join("")}</select></label>
          <label class="field"><span>Ordem</span><input name="order" type="number" min="1" value="${state.cms.flavors.length + 1}"></label>
          <label class="field field-full"><span>URL da foto</span><input name="imageUrl" required></label>
          <label class="field field-full"><span>Ingredientes separados por vírgula</span><input name="ingredients"></label>
          <label class="field field-full"><span>Texto do card</span><input name="angle"></label>
          <label class="field field-full"><span>Texto do detalhe</span><textarea name="description"></textarea></label>
          <label class="check-row field-full"><input name="visible" type="checkbox" checked> <span>Visível no site</span></label>
        </div>
        <button class="btn btn-primary" type="submit">Adicionar sabor</button>
      </form>
    `,
  );
  document.querySelector("#cmsFlavorForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    state.cms.flavors.push({
      slug: data.slug,
      imageKey: data.slug,
      name: data.name,
      profile: data.profile,
      order: Number(data.order || state.cms.flavors.length + 1),
      visible: data.visible === "on",
      recommended: FLAVOR_IMAGE_RECOMMENDED,
      imageUrl: data.imageUrl,
      ingredients: data.ingredients || "",
      angle: data.angle || "",
      description: data.description || data.angle || "",
    });
    addAudit("Sabor público criado", data.name);
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
          ${fields.map((field) => fieldInput(field, field.value)).join("")}
        </div>
        <button class="btn btn-primary" type="submit">Salvar</button>
      </form>
    `,
  );
  document.querySelector("#simpleForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = readRecordForm(event.target, fields);
    state[collection].unshift({ id: id(collection.slice(0, 3)), ...data });
    addAudit(`${title} criado`, data.name || data.description || "");
    closeModal();
    render();
  });
}

function stockAdjustmentForm() {
  const options = [
    ...state.ingredients.map((item) => ({ key: `ingredients:${item.id}`, label: `Ingrediente - ${item.name}`, stock: item.stock, unit: item.purchaseUnit })),
    ...state.packaging.map((item) => ({ key: `packaging:${item.id}`, label: `${inferPackagingType(item) === "label" ? "Rótulo" : inferPackagingType(item) === "bottle" ? "Garrafa/material" : "Material"} - ${item.name}`, stock: item.stock, unit: item.unit })),
  ];
  openModal(
    "Ajuste de estoque",
    "Estoque",
    `
      <form id="adjustForm">
        <div class="input-grid">
          <label class="field field-full"><span>Item de estoque</span><select name="stockKey">${options.map((item) => `<option value="${item.key}">${item.label} (${number(item.stock, 2)} ${item.unit})</option>`).join("")}</select></label>
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
    const [collection, itemId] = data.stockKey.split(":");
    const item = byId(collection, itemId);
    if (!item) return;
    const previous = item.stock;
    item.stock = Number(data.stock);
    addAudit("Ajuste de estoque", `${item.name}: ${previous} -> ${item.stock}. Motivo: ${data.reason}`);
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
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  addAudit("CSV exportado", name);
}

function parseRecommendedSize(value) {
  const text = String(value || "");
  const pairs = [...text.matchAll(/(\d{2,5})\s*x\s*(\d{2,5})/gi)];
  const pair = pairs.at(-1);
  if (pair) return { width: Number(pair[1]), height: Number(pair[2]) };
  const numbers = text.match(/\d{2,5}/g)?.map(Number) || [];
  if (numbers.length >= 2) return { width: numbers[0], height: numbers[1] };
  return { width: 1200, height: 1200 };
}

function readFileDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function resizeImageFile(file, recommended) {
  const { width, height } = parseRecommendedSize(recommended);
  const source = await readFileDataUrl(file);
  const image = await loadImage(source);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = Math.round(image.naturalWidth * scale);
  const drawHeight = Math.round(image.naturalHeight * scale);
  const x = Math.round((width - drawWidth) / 2);
  const y = Math.round((height - drawHeight) / 2);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, x, y, drawWidth, drawHeight);
  return {
    dataUrl: canvas.toDataURL("image/webp", 0.9),
    sourceSize: `${image.naturalWidth} x ${image.naturalHeight}px`,
    resizedSize: `${width} x ${height}px`,
  };
}

function setCmsPreview(key, url) {
  const preview = document.querySelector(`[data-cms-preview="${key}"]`);
  if (preview && url) preview.src = url;
}

async function uploadCmsImageToCloud(kind, index, fileName, dataUrl) {
  try {
    const target = kind === "flavor" ? state.cms.flavors[Number(index)] : state.cms.images[Number(index)];
    const response = await fetch("/api/media/upload", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        key: target?.slug || target?.key || String(index),
        fileName,
        dataUrl,
      }),
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload.url || null;
  } catch {
    return null;
  }
}

async function handleCmsImageUpload(kind, index, file) {
  if (!file) return;
  try {
    const target = kind === "flavor" ? state.cms.flavors[Number(index)] : state.cms.images[Number(index)];
    if (!target) return;
    const urlField = kind === "flavor" ? "imageUrl" : "url";
    const recommended = target.recommended || FLAVOR_IMAGE_RECOMMENDED;
    const resized = await resizeImageFile(file, recommended);
    const cloudUrl = await uploadCmsImageToCloud(kind, index, file.name, resized.dataUrl);
    const finalUrl = cloudUrl || resized.dataUrl;
    target[urlField] = finalUrl;
    target.uploadedName = file.name;
    target.sourceSize = resized.sourceSize;
    target.resizedSize = resized.resizedSize;
    target.storage = cloudUrl ? "supabase" : "local";
    saveState();
    setCmsPreview(`${kind}-${index}`, finalUrl);
    const urlInput = document.querySelector(kind === "flavor" ? `[data-cms-flavor="${index}"][data-field="imageUrl"]` : `[data-cms-image="${index}"][data-field="url"]`);
    if (urlInput) urlInput.value = finalUrl;
  } catch (error) {
    window.alert("Não consegui processar essa imagem. Tente PNG, JPG, WebP ou uma imagem menor.");
    console.error(error);
  }
}

function fieldValue(input) {
  if (input.type === "checkbox") return input.checked;
  if (input.dataset.field === "order") return Number(input.value || 0);
  return input.value;
}

function bindModuleEvents() {
  document.querySelectorAll("[data-dashboard-order-view]").forEach((button) => {
    button.addEventListener("click", () => {
      currentDashboardOrderView = button.dataset.dashboardOrderView === "missing" ? "missing" : "summary";
      render();
    });
  });
  document.querySelectorAll("[data-sales-period]").forEach((button) => {
    button.addEventListener("click", () => {
      currentSalesPeriod = button.dataset.salesPeriod;
      render();
    });
  });
  document.querySelectorAll("[data-sales-custom]").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.dataset.salesCustom === "start") salesCustomStart = input.value;
      if (input.dataset.salesCustom === "end") salesCustomEnd = input.value;
      render();
    });
  });
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
    const eventType = input.type === "checkbox" || input.tagName === "SELECT" ? "change" : "input";
    input.addEventListener(eventType, (event) => {
      const index = Number(event.target.dataset.cmsFlavor);
      const flavor = state.cms.flavors[index];
      const field = event.target.dataset.field;
      flavor[field] = fieldValue(event.target);
      if (field === "imageUrl") setCmsPreview(`flavor-${index}`, event.target.value);
      saveState();
    });
  });
  document.querySelectorAll("[data-cms-image]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const index = Number(event.target.dataset.cmsImage);
      const image = state.cms.images[index];
      const field = event.target.dataset.field;
      image[field] = event.target.value;
      if (field === "url") setCmsPreview(`image-${index}`, event.target.value);
      saveState();
    });
  });
  document.querySelectorAll("[data-cms-image-upload]").forEach((input) => {
    input.addEventListener("change", (event) => handleCmsImageUpload("image", event.target.dataset.cmsImageUpload, event.target.files?.[0]));
  });
  document.querySelectorAll("[data-cms-flavor-upload]").forEach((input) => {
    input.addEventListener("change", (event) => handleCmsImageUpload("flavor", event.target.dataset.cmsFlavorUpload, event.target.files?.[0]));
  });
  document.querySelectorAll("[data-lead-status]").forEach((select) => {
    select.addEventListener("change", (event) => {
      const lead = state.leads.find((item) => item.id === event.target.dataset.leadStatus);
      if (!lead) return;
      lead.status = event.target.value;
      addAudit("Lead atualizado", `${lead.name || lead.whatsapp || lead.id}: ${lead.status}`);
      render();
    });
  });
  document.querySelectorAll("[data-stock-view]").forEach((button) => {
    button.addEventListener("click", () => {
      currentStockView = button.dataset.stockView;
      render();
    });
  });
}

function handleAction(action) {
  if (!canWrite() && !["export-products", "export-ingredients", "export-purchases", "export-sales", "export-orders", "export-leads", "export-reports", "export-costs"].includes(action)) return;
  const [dynamicAction, ...dynamicParts] = action.split(":");
  const dynamicPayload = dynamicParts.join(":");
  const dynamicMap = {
    "edit-product": editProductForm,
    "delete-product": (itemId) => deleteRecord("products", itemId),
    "edit-ingredient": (itemId) => editRecordForm("ingredients", itemId, "Editar ingrediente", ingredientFields, (record) => {
      record.packageUnit = record.packageUnit || record.purchaseUnit || "g";
      applyIngredientPackageCost(record, record);
      if (Number(record.costPerUnit || 0) > 0) {
        record.needsCost = false;
        if (record.status === "custo pendente") record.status = "ativo";
      } else if (ingredientNeedsCost(record)) {
        record.needsCost = true;
        record.status = "custo pendente";
      }
    }),
    "delete-ingredient": (itemId) => deleteRecord("ingredients", itemId),
    "edit-packaging": (itemId) => editRecordForm("packaging", itemId, "Editar material", packagingFields),
    "delete-packaging": (itemId) => deleteRecord("packaging", itemId),
    "edit-supplier": (itemId) => editRecordForm("suppliers", itemId, "Editar fornecedor", supplierFields),
    "delete-supplier": (itemId) => deleteRecord("suppliers", itemId),
    "edit-partner": (itemId) => editRecordForm("partners", itemId, "Editar parceiro", partnerFields),
    "dashboard-edit-partner": openPartnerEditorFromDashboard,
    "delete-partner": (itemId) => deleteRecord("partners", itemId),
    "edit-expense": (itemId) => editRecordForm("expenses", itemId, "Editar despesa", expenseFields),
    "delete-expense": (itemId) => deleteRecord("expenses", itemId),
    "edit-recipe": editRecipeForm,
    "delete-recipe": (itemId) => deleteRecord("recipes", itemId),
    "edit-batch": editBatchForm,
    "delete-batch": deleteBatch,
    "edit-sale": editSaleForm,
    "delete-sale": (itemId) => deleteRecord("sales", itemId),
    "correct-batch-qty": correctBatchQuantityForm,
    "reserve-stock": reserveStockForm,
    "adjust-order-reservation": adjustOrderReservationForm,
    "delivery-proof": deliveryProofForm,
    "delivery-proof-reprint": reprintDeliveryProof,
    "write-off-stock": writeOffStockForm,
    "stock-sale": newSaleForm,
    "reverse-stock": reverseStockForm,
    "edit-order": orderForm,
    "order-status": updateOrderStatus,
    "delete-order": deleteOrder,
    "edit-purchase": editPurchaseForm,
    "delete-purchase": deletePurchase,
    "delete-lead": (itemId) => deleteRecord("leads", itemId),
    "add-recipe-ingredient": addRecipeIngredientForm,
    "add-recipe-packaging": addRecipePackagingForm,
    "remove-recipe-ingredient": (payload) => removeRecipeLine(payload, "ingredients"),
    "remove-recipe-packaging": (payload) => removeRecipeLine(payload, "packaging"),
  };
  if (dynamicMap[dynamicAction]) {
    dynamicMap[dynamicAction](dynamicPayload);
    return;
  }
  const actionMap = {
    "new-product": newProductForm,
    "global-prices": globalPriceForm,
    "import-cost-base": restoreCostBase,
    "new-ingredient": newIngredientForm,
    "new-purchase": newPurchaseForm,
    "quick-sale": quickSaleForm,
    "new-sale": newSaleForm,
    "new-order": () => orderForm(),
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
        { name: "status", label: "Status", type: "select", options: ["ativo", "pausado", "inativo"], value: "ativo" },
      ]),
    "new-packaging": () =>
      simpleRecordForm("packaging", "Novo material", [
        { name: "name", label: "Nome", required: true },
        { name: "type", label: "Tipo", type: "select", options: [{ value: "bottle", label: "Garrafa/tampa" }, { value: "label", label: "Rótulo" }, { value: "box", label: "Caixa" }, { value: "material", label: "Outro material" }], value: "material" },
        { name: "productId", label: "Sabor/produto do rótulo", type: "select", options: [{ value: "", label: "Genérico" }, ...state.products.map((product) => ({ value: product.id, label: productLabel(product) }))] },
        { name: "supplier", label: "Fornecedor" },
        { name: "unit", label: "Unidade", value: "un" },
        { name: "costEach", label: "Custo unitário", type: "number", min: 0, step: "0.01" },
        { name: "stock", label: "Estoque", type: "number", min: 0, step: "1" },
        { name: "min", label: "Mínimo", type: "number", min: 0, step: "1" },
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
        { name: "visible", label: "Aparecer no site público", type: "checkbox", full: true, value: true },
      ]),
    "new-expense": () =>
      simpleRecordForm("expenses", "Nova despesa", [
        { name: "date", label: "Data", type: "date", value: todayIso(), required: true },
        { name: "category", label: "Categoria", required: true },
        { name: "description", label: "Descrição", full: true, required: true },
        { name: "amount", label: "Valor", type: "number", required: true },
        { name: "method", label: "Método", value: "Pix" },
        { name: "recurring", label: "Despesa recorrente", type: "checkbox", full: true },
      ]),
    "new-recipe": newRecipeForm,
    "new-cms-flavor": newCmsFlavorForm,
    "sync-cloud": () => syncFromCloud().then(render),
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
        document.querySelectorAll("[data-cms-flavor]").forEach((input) => {
          const flavor = state.cms.flavors[Number(input.dataset.cmsFlavor)];
          flavor[input.dataset.field] = fieldValue(input);
        });
        state.cms.flavors = normalizeCmsFlavors(state.cms.flavors);
        state.cms = { ...state.cms, ...data };
        addAudit("CMS atualizado", "Conteúdo público salvo.");
        saveState();
        render();
      }
    },
    "reset-demo": () => {
      state = clone(defaultState);
      saveState();
      addAudit("Dados operacionais limpos", "Base de produtos e custos dos prints preservada.");
      render();
    },
    "export-products": () => exportCSV("kombu-produtos-ean", [["EAN-13", "Item", "Sabor", "Tamanho ml", "Descricao", "Varejo", "Atacado", "Custo receita", "Disponibilidade"], ...state.products.map((p) => [p.ean, p.item, p.flavor, p.sizeMl, p.description, p.retailPrice, p.wholesalePrice, recipeForProduct(p) ? productDisplayCost(p) : "", productIsOperational(p) ? "disponível" : "indisponível"])]),
    "export-ingredients": () => exportCSV("kombu-ingredientes", [["Nome", "Categoria", "Fornecedor", "Estoque", "Unidade", "Custo", "Status"], ...state.ingredients.map((i) => [i.name, i.category, i.supplier, i.stock, i.purchaseUnit, i.costPerUnit, ingredientNeedsCost(i) ? "custo pendente" : i.status])]),
    "export-purchases": () => exportCSV("kombu-compras", [["Data", "Fornecedor", "Item", "Pacotes", "Conteúdo pacote", "Unidade pacote", "Entra estoque", "Unidade estoque", "Total", "Custo unitário", "Método", "Comprador"], ...state.purchases.map((p) => [p.date, p.supplier, p.item, p.packageCount || "", p.packageSize || "", p.packageUnit || "", p.qty, p.unit, p.total, p.costPerUnit || "", p.method, p.buyer])]),
    "export-sales": () => exportCSV("kombu-saidas-vendas", [["Data", "Tipo", "Cliente/destino", "Preço", "Sabor", "Lote", "Qtd", "Preço unitário", "Receita", "Desconto", "Entrega", "Observação"], ...state.sales.map((s) => [s.date, s.movementType || "venda", s.customerName || s.partner, s.priceType || s.channel, s.flavor, s.batchCode, s.qty, s.unitPrice, saleRevenue(s), s.discount, s.delivery, s.note || ""])]),
    "export-orders": () => exportCSV("kombu-pedidos", [["Código", "Data", "Tipo cliente", "Status", "Cliente", "Negócio", "WhatsApp", "Previsão pronto", "Entrega", "Receber até", "Pagamento", "Precisa até", "Qtd", "Valor", "Itens", "Observações"], ...(state.orders || []).map((order) => [order.code, order.orderDate, orderClientTypeLabel(order.clientType), order.status, order.customerName, order.businessName, order.whatsapp, order.estimatedReadyDate, order.deliveredAt || "", orderPaymentDueDate(order), orderReceivableStatus(order), order.neededBy, orderQuantity(order), orderTotal(order), orderItems(order).map((item) => `${item.qty}x ${orderProductText(item)} | ${item.productionStatus || "pendente"} | reservado ${orderItemReservedQty(item)} | lotes ${orderItemBatchCodes(item).join(" + ") || "-"} @ ${brl(item.unitPrice)}`).join("; "), order.notes || ""])]),
    "export-leads": () => exportCSV("kombu-leads-crm", [["Criado em", "Tipo", "Status", "Nome", "Negócio", "Tipo negócio", "Local", "WhatsApp", "Instagram", "Mensagem"], ...state.leads.map((lead) => [lead.createdAt, lead.type, lead.status, lead.name, lead.business, lead.businessType, lead.location, lead.whatsapp, lead.instagram, lead.message])]),
    "export-reports": () => exportCSV("kombu-relatorio", [["Métrica", "Valor"], ["Receita", totals().salesRevenue], ["COGS", totals().cogs], ["Lucro bruto", totals().grossProfit], ["Despesas", totals().expenses], ["Líquido", totals().net], ["Pedidos em aberto", totals().openOrderValue], ["A receber", totals().receivable], ["Produção faltante", totals().productionMissing]]),
    "export-costs": () => {
      const recipe = byId("recipes", activeRecipeId);
      exportCSV("kombu-custo-garrafa", [["Receita", recipe.flavor, recipe.version], ["Custo lote", recipeCost(recipe).total], ["Custo garrafa", recipeCost(recipe).costPerBottle]]);
    },
  };
  actionMap[action]?.();
}

document.querySelector("#adminNav")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-module]");
  if (button) setModule(button.dataset.module);
});

document.querySelector("#mobileModuleSelector")?.addEventListener("change", (event) => {
  setModule(event.target.value);
});

document.querySelector("#adminContent")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (button && !button.disabled) handleAction(button.dataset.action);
});

document.querySelectorAll("[data-locale]")?.forEach((button) => {
  button.addEventListener("click", () => {
    currentLocale = button.dataset.locale || "pt";
    localStorage.setItem(LOCALE_KEY, currentLocale);
    applyLocaleToShell();
    if (isAuthenticated()) render();
  });
});
document.querySelector("#closeAdminModal")?.addEventListener("click", closeModal);
document.querySelector("#adminModal")?.addEventListener("click", (event) => {
  if (event.target.id === "adminModal") closeModal();
  const button = event.target.closest("[data-action]");
  if (button && !button.disabled) handleAction(button.dataset.action);
});
document.querySelector("#globalSearch")?.addEventListener("input", (event) => {
  globalSearch = event.target.value.trim();
  render();
});
document.querySelector("#roleSelector")?.addEventListener("change", (event) => {
  currentRole = event.target.value;
  addAudit("Perfil de acesso alterado", currentRole);
  render();
});

async function initializeAdmin() {
  try {
    stripSensitiveUrlParams();
    applyLocaleToShell();
    bindAuth();
    if (isAuthenticated() || await restoreServerSession()) {
      await startAuthenticatedSession();
    } else {
      lockAdmin();
    }
  } catch (error) {
    console.error("Falha ao inicializar admin", error);
    bindAuth();
    lockAdmin();
    const loginError = document.querySelector("#loginError");
    if (loginError) {
      loginError.textContent = "O painel encontrou um erro ao iniciar. Recarregue a página e tente novamente.";
      loginError.classList.remove("hidden");
    }
  }
}

initializeAdmin();
