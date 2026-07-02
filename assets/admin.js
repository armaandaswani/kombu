const STORAGE_KEY = "kombuAdminStateV3";
const ADMIN_PASSWORD = "Rssb2010";
const ADMIN_NOTIFICATION_EMAIL = "armaandaswani@icloud.com";
const FLAVOR_CATEGORIES = ["Frutados", "Cítricos", "Florais", "Herbais", "Especiados"];
const FLAVOR_IMAGE_RECOMMENDED = "mín. 760 x 1368 px; ideal 1040 x 1872 px";
const ORDER_STATUSES = ["recebido", "confirmado", "em produção", "pronto", "entregue", "cancelado"];
const ORDER_ITEM_STATUSES = ["pendente", "em produção", "produzido", "reservado", "entregue"];
const ORDER_CLIENT_TYPES = [
  { value: "novo_cliente", label: "Novo cliente", price: "retail" },
  { value: "varejo_recorrente", label: "Cliente varejo recorrente", price: "recurringRetail" },
  { value: "novo_parceiro", label: "Novo parceiro", price: "wholesale" },
  { value: "parceiro_recorrente", label: "Parceiro recorrente", price: "wholesale" },
];
const PAYMENT_STATUSES = ["aberto", "aguardando pagamento", "pago", "atrasado", "cancelado"];
const RECURRING_RETAIL_PRICE = 20;

const PRODUCT_CATALOG_SEED = [
  { id: "prod-kmb001", ean: "7890528600010", item: "KMB001", flavor: "Maracujá", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Maracujá", wholesalePrice: 13, retailPrice: 18.5, baselineCost: 3.29, status: "ativo", visible: true },
  { id: "prod-kmb002", ean: "7890528600027", item: "KMB002", flavor: "Frutas Vermelhas", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Frutas Vermelhas (Morango, Mirtilo, Oxicoco)", wholesalePrice: 13, retailPrice: 18.5, baselineCost: 4.74, status: "ativo", visible: true },
  { id: "prod-kmb003", ean: "7890528600034", item: "KMB003", flavor: "Hibisco com Anis Estrelado", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Hibisco c/Anis Estrelado", wholesalePrice: 13, retailPrice: 18.5, baselineCost: 2.29, status: "ativo", visible: true },
  { id: "prod-kmb004", ean: "7890528600041", item: "KMB004", flavor: "Mirtilo c/Flor Borboleta Azul", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Mirtilo c/Flor Borboleta Azul", wholesalePrice: 13, retailPrice: 18.5, baselineCost: 4.47, status: "ativo", visible: true },
  { id: "prod-kmb005", ean: "7890528600058", item: "KMB005", flavor: "Maçã c/Canela", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Maçã c/Canela", wholesalePrice: 13, retailPrice: 18.5, baselineCost: 2.9, status: "ativo", visible: true },
  { id: "prod-kmb006", ean: "7890528600065", item: "KMB006", flavor: "Pêra c/Alecrim", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Pêra c/Alecrim", wholesalePrice: 13, retailPrice: 18.5, baselineCost: 2.77, status: "ativo", visible: true },
  { id: "prod-kmb007", ean: "7890528600072", item: "KMB007", flavor: "Imunidade", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Imunidade (Limão, Gengibre, Cúrcuma)", wholesalePrice: 13, retailPrice: 18.5, baselineCost: 2.63, status: "ativo", visible: true },
  { id: "prod-kmb008", ean: "7890528600447", item: "KMB008", flavor: "Rosas & Cardamomo", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Rosas & Cardamomo", wholesalePrice: 13, retailPrice: 18.5, baselineCost: 2.44, status: "ativo", visible: true },
  { id: "prod-kmb009", ean: "7890528600812", item: "KMB009", flavor: "Lavanda & Limão", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Lavanda & Limão", wholesalePrice: 13, retailPrice: 18.5, baselineCost: 0, status: "planejado", visible: false },
  { id: "prod-kmb010", ean: "7890528601222", item: "KMB010", flavor: "Manga & Jasmim", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Manga & Jasmim", wholesalePrice: 13, retailPrice: 18.5, baselineCost: 0, status: "planejado", visible: false },
  { id: "prod-kmb011", ean: "7890528601420", item: "KMB011", flavor: "Goiaba", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Goiaba", wholesalePrice: 13, retailPrice: 18.5, baselineCost: 0, status: "planejado", visible: false },
  { id: "prod-kmb012", ean: "7890528601314", item: "KMB012", flavor: "Uva", sizeMl: 500, description: "Kombucha Premium de 500ml - Sabor Uva", wholesalePrice: 13, retailPrice: 18.5, baselineCost: 0, status: "planejado", visible: false },
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
      retailPrice500: 18.5,
      wholesalePrice500: 13,
    },
  ],
  notifications: {
    adminEmail: ADMIN_NOTIFICATION_EMAIL,
    provider: "resend",
  },
  audit: [],
};

let state = loadState();
let currentModule = "dashboard";
let globalSearch = "";
let activeRecipeId = state.recipes[0]?.id || "";
let currentRole = "Owner / Admin";
let currentStockView = "kombuchas";
let cloudSyncReady = false;
let cloudSyncEnabled = false;
let cloudSaveTimer = null;
let lastCloudSaveAt = "";

(state.purchases || []).forEach(syncPurchaseExpense);
(state.orders || []).forEach(syncOrderIntegrations);
saveState();

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
  } catch {
    // Local static previews do not serve Vercel API routes.
  }
  return { ok: password === ADMIN_PASSWORD, backend: false };
}

async function startAuthenticatedSession() {
  unlockAdmin();
  render();
  await syncFromCloud();
  render();
}

async function logoutAdmin() {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
  } catch {
    // Static preview fallback.
  }
  lockAdmin();
}

function bindAuth() {
  const loginForm = document.querySelector("#loginForm");
  const passwordInput = document.querySelector("#adminPassword");
  const loginError = document.querySelector("#loginError");
  const togglePassword = document.querySelector("#togglePassword");
  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const auth = await authenticateAdmin(passwordInput.value);
    if (auth.ok) {
      sessionStorage.setItem("kombuAdminAuthenticated", "true");
      passwordInput.value = "";
      loginError?.classList.add("hidden");
      await startAuthenticatedSession();
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

function ensureProductLabelInventory(data) {
  const genericLabelCost = Number(data.packaging.find((item) => item.id === "pkg-label-500")?.costEach || 0.85);
  if (!data.packaging.some((item) => item.id === "pkg-datador")) {
    data.packaging.push({ id: "pkg-datador", name: "Datador por garrafa", type: "material", productId: "", supplier: "Base de custos Kombú", unit: "un", costEach: 0, stock: 0, min: 0, location: "" });
  }
  data.products.forEach((product) => {
    const labelId = labelPackagingIdForProduct(product);
    if (!data.packaging.some((item) => item.id === labelId)) data.packaging.push(labelPackagingForProduct(product, genericLabelCost));
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
  ["products", "ingredients", "packaging", "suppliers", "partners", "recipes", "batches", "sales", "orders", "leads", "purchases", "expenses", "costSources", "audit"].forEach((key) => {
    merged[key] = Array.isArray(saved[key]) ? saved[key] : base[key];
  });
  merged.packaging = merged.packaging.map((item) => ({ ...item, type: inferPackagingType(item), productId: item.productId || "" }));
  ensureProductLabelInventory(merged);
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
  scheduleCloudSave();
}

async function pushStateToCloud() {
  if (!cloudSyncReady || !isAuthenticated()) return;
  try {
    const response = await fetch("/api/state", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state }),
    });
    if (response.ok || response.status === 202) {
      cloudSyncEnabled = true;
      lastCloudSaveAt = new Date().toISOString();
    }
  } catch {
    cloudSyncEnabled = false;
  }
}

function scheduleCloudSave() {
  if (!cloudSyncReady || !isAuthenticated()) return;
  window.clearTimeout(cloudSaveTimer);
  cloudSaveTimer = window.setTimeout(pushStateToCloud, 800);
}

async function syncFromCloud() {
  try {
    const response = await fetch("/api/state", { credentials: "same-origin" });
    if (!response.ok) {
      cloudSyncReady = false;
      cloudSyncEnabled = false;
      return false;
    }
    const payload = await response.json();
    if (payload.configured === false) {
      cloudSyncReady = false;
      cloudSyncEnabled = false;
      return false;
    }
    cloudSyncReady = true;
    cloudSyncEnabled = true;
    if (payload.exists && payload.state) {
      state = normalizeState(payload.state);
      (state.purchases || []).forEach(syncPurchaseExpense);
      (state.orders || []).forEach(syncOrderIntegrations);
      activeRecipeId = state.recipes.find((recipe) => recipe.id === activeRecipeId)?.id || state.recipes[0]?.id || "";
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      await pushStateToCloud();
    }
    return true;
  } catch {
    cloudSyncReady = false;
    cloudSyncEnabled = false;
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

function productWholesalePrice(product) {
  return Number(product?.wholesalePrice || 0);
}

function productRetailPrice(product) {
  return Number(product?.retailPrice || 0);
}

function orderClientTypeLabel(value) {
  return ORDER_CLIENT_TYPES.find((type) => type.value === value)?.label || "Novo cliente";
}

function priceForOrderClientType(product, clientType) {
  const type = ORDER_CLIENT_TYPES.find((item) => item.value === clientType) || ORDER_CLIENT_TYPES[0];
  if (type.price === "wholesale") return productWholesalePrice(product) || 15;
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
  const rawTotal = Number(packageCount || 0) * Number(packageSize || 0);
  return convertedAmount(rawTotal, packageUnit, stockUnit);
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

function orderTotal(order) {
  return orderItems(order).reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.unitPrice || 0), 0);
}

function isOpenOrder(order) {
  return !["entregue", "cancelado"].includes(order?.status);
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

function orderStatusBadge(status) {
  const current = ORDER_STATUSES.includes(status) ? status : "recebido";
  return `<span class="status ${statusClass(current, "general")}">${current}</span>`;
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

function orderItemRemainingQty(item) {
  return Math.max(0, Number(item.qty || 0) - Math.max(Number(item.reservedQty || 0), Number(item.producedQty || 0)));
}

function reservedFromBatch(code) {
  return (state.orders || [])
    .filter((order) => !["entregue", "cancelado"].includes(order.status))
    .flatMap((order) => orderItems(order))
    .filter((item) => item.batchCode === code)
    .reduce((sum, item) => sum + Number(item.reservedQty || item.producedQty || 0), 0);
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
        };
        current.ordered += Number(item.qty || 0);
        current.reserved += Number(item.reservedQty || 0);
        current.produced += Number(item.producedQty || 0);
        current.missing += orderItemRemainingQty(item);
        const due = item.readyDate || order.estimatedReadyDate || order.neededBy || "";
        if (due && (!current.nextDue || due < current.nextDue)) current.nextDue = due;
        current.orders.push(order.code);
        rows.set(key, current);
      });
    });
  return [...rows.values()].sort((a, b) => b.missing - a.missing || String(a.nextDue).localeCompare(String(b.nextDue)));
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
    lastDelivery: order.deliveredAt || order.orderDate || "",
    visible: existing?.visible ?? false,
    sourceOrderId: order.id,
  };
  if (existing) Object.assign(existing, payload);
  else state.partners.unshift({ id: id("par"), ...payload });
}

function salePayloadFromOrderItem(order, item) {
  return {
    date: order.deliveredAt || order.orderDate || todayIso(),
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
    delivery: Number(order.deliveryFee || 0),
    note: `Gerado pelo pedido ${order.code}`,
    orderId: order.id,
    orderCode: order.code,
    orderItemKey: item.key || `${item.productId || item.flavor}-${item.qty}-${item.unitPrice}`,
  };
}

function syncOrderSales(order) {
  state.sales = state.sales.filter((sale) => sale.orderId !== order.id);
  if (order.status !== "entregue") return;
  orderItems(order).forEach((item) => {
    if (Number(item.qty || 0) <= 0) return;
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
  let available = Number(batch.actual || 0);
  const recipe = byId("recipes", batch.recipeId);
  const productId = batch.productId || recipe?.productId || "";
  const openOrders = (state.orders || [])
    .filter((order) => !["entregue", "cancelado"].includes(order.status))
    .sort((a, b) => String(a.neededBy || a.estimatedReadyDate || a.orderDate).localeCompare(String(b.neededBy || b.estimatedReadyDate || b.orderDate)));
  openOrders.forEach((order) => {
    orderItems(order).forEach((item) => {
      if (!available) return;
      const matchesProduct = productId && item.productId === productId;
      const matchesFlavor = !productId && normalizeText(item.flavor) === normalizeText(batch.flavor);
      if (!matchesProduct && !matchesFlavor) return;
      const need = orderItemRemainingQty(item);
      if (!need) return;
      const allocated = Math.min(need, available);
      item.reservedQty = Number(item.reservedQty || 0) + allocated;
      item.producedQty = Number(item.producedQty || 0) + allocated;
      item.batchCode = batch.code;
      item.productionStatus = Number(item.reservedQty || 0) >= Number(item.qty || 0) ? "reservado" : "produzido";
      item.readyDate = batch.date;
      available -= allocated;
    });
    const allReady = orderItems(order).length && orderItems(order).every((item) => Number(item.reservedQty || 0) >= Number(item.qty || 0));
    if (allReady && !["pronto", "entregue"].includes(order.status)) order.status = "pronto";
    else if (!["pronto", "entregue"].includes(order.status) && orderItems(order).some((item) => Number(item.producedQty || 0) > 0)) order.status = "em produção";
  });
  return Number(batch.actual || 0) - available;
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
      <small><span class="material-symbols-outlined" aria-hidden="true">${icon}</span> ${label}</small>
      <strong>${value}</strong>
      <span>${note}</span>
    </article>
  `;
}

function renderDashboard() {
  const total = totals();
  const productionRows = orderProductionRows();
  const receivableRows = paymentReminderRows();
  const flavorRows = Object.entries(
    finishedStockRows().reduce((acc, row) => {
      acc[row.flavor] = (acc[row.flavor] || 0) + row.stock;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const partnerRows = Object.entries(
    state.sales
      .filter((sale) => !sale.movementType || sale.movementType === "venda")
      .reduce((acc, sale) => {
        const partner = sale.customerName || sale.partner || "Cliente sem nome";
        acc[partner] = (acc[partner] || 0) + Number(sale.qty || 0);
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
      `${actionButton("new-order", "Novo pedido", "assignment", "btn-outline")} ${actionButton("new-batch", "Novo lote", "science", "btn-outline")} ${actionButton("new-purchase", "Registrar compra", "shopping_bag", "btn-outline")} ${actionButton("new-sale", "Nova saída", "receipt_long")}`,
    )}
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
        <h3>Produção puxada por pedidos</h3>
        <div class="stack-list">
          ${productionRows.length ? productionRows.slice(0, 6).map((row) => `<div class="report-row"><strong>${escapeHtml(row.flavor)}</strong><span>${number(row.missing)} faltando de ${number(row.ordered)} | próximo: ${row.nextDue || "-"}</span></div>`).join("") : `<p class="empty-note">Sem pedido aberto exigindo produção.</p>`}
        </div>
      </article>
      <article class="admin-card">
        <h3>Cobranças próximas</h3>
        <div class="stack-list">
          ${receivableRows.length ? receivableRows.slice(0, 6).map(({ order, due, days, value }) => `<div class="report-row"><strong>${escapeHtml(order.customerName || order.code)}</strong><span>${brl(value)} | vence ${due || "-"}${days != null ? ` (${days < 0 ? `${Math.abs(days)} dias atrasado` : `${days} dias`})` : ""} | <a href="${paymentReminderMailto(order)}">preparar lembrete</a></span></div>`).join("") : `<p class="empty-note">Nenhuma cobrança em aberto por entrega.</p>`}
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
  if (["aprovado", "ativo", "ativa", "pago", "confirmado", "pronto", "entregue"].includes(value)) return "good";
  if (["planejado", "bottled", "pendente", "custo pendente", "recebido", "em produção", "aberto", "aguardando pagamento"].includes(value)) return "warn";
  return "bad";
}

function tableRowsWithLabels(headers, rows) {
  return rows.map((row) => {
    let index = 0;
    return row.replace(/<td(\s[^>]*)?>/g, (match, attrs = "") => {
      const header = headers[index]?.label || "";
      index += 1;
      return `<td data-label="${escapeHtml(header)}"${attrs}>`;
    });
  });
}

function table(headers, rows) {
  const bodyRows = rows.length
    ? tableRowsWithLabels(headers, rows).join("")
    : `<tr><td colspan="${headers.length}"><p class="empty-note">Nenhum registro ainda. Use os botões acima para começar.</p></td></tr>`;
  return `
    <article class="admin-card table-card">
      <div class="table-scroll" role="region" aria-label="Tabela responsiva">
        <table class="data-table">
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
  const rows = state.products
    .filter((item) => matchesSearch(item))
    .map((product) => {
      const recipe = recipeForProduct(product);
      const calculatedCost = productDisplayCost(product);
      const wholesale = productWholesalePrice(product);
      const margin = wholesale ? ((wholesale - calculatedCost) / wholesale) * 100 : 0;
      return `
        <tr>
          <td><strong>#${product.ean || "sem EAN"}</strong><br><span>${product.item}</span></td>
          <td><strong>${product.flavor}</strong><br><span>${product.description}</span></td>
          <td class="num">${number(product.sizeMl)}ml</td>
          <td class="num">${brl(product.retailPrice)}</td>
          <td class="num">${brl(product.wholesalePrice)}</td>
          <td class="num">${product.baselineCost ? brl(product.baselineCost) : "Pendente"}</td>
          <td class="num"><strong>${recipe ? brl(calculatedCost) : "Sem receita"}</strong></td>
          <td class="num">${recipe ? pct(margin) : "-"}</td>
          <td><span class="status ${statusClass(product.status, "general")}">${product.status}</span></td>
          <td>${rowActions([tableAction(`edit-product:${product.id}`, "Editar produto"), tableAction(`delete-product:${product.id}`, "Excluir produto", "delete", "danger")])}</td>
        </tr>
      `;
    });
  return `
    ${pageHead(
      "Produtos / EAN",
      "Catálogo operacional com código de barras, item, descrição, preço e vínculo com receitas/custos.",
      `${actionButton("new-product", "Novo produto", "add")} ${actionButton("global-prices", "Preço global", "price_change", "btn-outline")} ${actionButton("import-cost-base", "Restaurar base dos prints", "upload_file", "btn-outline")} ${actionButton("export-products", "CSV", "download", "btn-outline")}`,
    )}
    <section class="metric-grid">
      ${metric("Produtos cadastrados", number(state.products.length), "Itens KMB e variações", "barcode_scanner")}
      ${metric("Com receita vinculada", number(state.products.filter((product) => recipeForProduct(product)).length), "Calculam custo automaticamente", "calculate")}
      ${metric("Ativos públicos", number(state.products.filter((product) => product.visible).length), "Controle de visibilidade", "visibility")}
      ${metric("Custo médio calculado", brl(state.products.reduce((sum, product) => sum + productDisplayCost(product), 0) / Math.max(1, state.products.length)), "Média do catálogo", "price_check")}
    </section>
    ${table(
      [
        { label: "EAN / item" },
        { label: "Produto" },
        { label: "Tamanho", num: true },
        { label: "Varejo", num: true },
        { label: "Atacado", num: true },
        { label: "Custo print", num: true },
        { label: "Custo receita", num: true },
        { label: "Margem atacado", num: true },
        { label: "Status" },
        { label: "Ações" },
      ],
      rows,
      1260,
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
          <td data-label="Qtd."><input type="number" min="0" step="0.01" value="${line.qty}" data-cost-line="ingredients" data-index="${index}" data-field="qty"></td>
          <td data-label="Unidade">
            <select data-cost-line="ingredients" data-index="${index}" data-field="unit">
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
          <td data-label="Qtd."><input type="number" min="0" step="0.001" value="${line.qty}" data-cost-line="packaging" data-index="${index}" data-field="qty"></td>
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
            <select id="recipeSelector" class="admin-select">
              ${state.recipes.map((item) => `<option value="${item.id}" ${item.id === recipe.id ? "selected" : ""}>${recipeLabel(item)}</option>`).join("")}
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
            <label class="field">
              <span>Atacado</span>
              <input class="admin-input" type="number" step="0.01" value="${recipe.wholesalePrice}" data-recipe-field="wholesalePrice" />
            </label>
            <label class="field">
              <span>Varejo</span>
              <input class="admin-input" type="number" step="0.01" value="${recipe.retailPrice}" data-recipe-field="retailPrice" />
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
              <tr><td data-label="Grupo">Operação</td><td data-label="Insumo">Mão de obra por lote</td><td data-label="Qtd."><input type="number" value="${recipe.labor}" data-recipe-field="labor"></td><td data-label="Unidade">R$</td><td data-label="Custo compra"></td><td data-label="Custo no lote" class="num">${brl(recipe.labor)}</td><td data-label="Ações"></td></tr>
              <tr><td data-label="Grupo">Operação</td><td data-label="Insumo">Água, energia e gás</td><td data-label="Qtd."><input type="number" value="${recipe.utilities}" data-recipe-field="utilities"></td><td data-label="Unidade">R$</td><td data-label="Custo compra"></td><td data-label="Custo no lote" class="num">${brl(recipe.utilities)}</td><td data-label="Ações"></td></tr>
              <tr><td data-label="Grupo">Operação</td><td data-label="Insumo">Transporte, sanitização e outros</td><td data-label="Qtd."><input type="number" value="${recipe.other}" data-recipe-field="other"></td><td data-label="Unidade">R$</td><td data-label="Custo compra"></td><td data-label="Custo no lote" class="num">${brl(recipe.other)}</td><td data-label="Ações"></td></tr>
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
        ${productionRows.length ? productionRows.map((row) => `<div class="production-chip"><strong>${escapeHtml(row.flavor)}</strong><span>${number(row.missing)} faltando</span><small>${number(row.reserved)} reservado de ${number(row.ordered)} | pedido(s): ${escapeHtml([...new Set(row.orders)].slice(0, 3).join(", "))}</small></div>`).join("") : `<p class="empty-note">Nenhum pedido aberto exigindo produção.</p>`}
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
  const inventoryViews = {
    kombuchas: () =>
      table(
        [
          { label: "Sabor / lote" },
          { label: "Produzido", num: true },
          { label: "Saídas", num: true },
          { label: "Reservado", num: true },
          { label: "Saldo", num: true },
          { label: "Ideal até" },
          { label: "Vender até" },
          { label: "Validade" },
          { label: "Valor em estoque", num: true },
        ],
        finishedStockRows().map(
          (row) => `
            <tr>
              <td><strong>${row.flavor}</strong><br><span>${row.product ? productLabel(row.product) : row.code}</span></td>
              <td class="num">${number(row.actual)}</td>
              <td class="num">${number(row.sold)}</td>
              <td class="num">${number(row.reserved)}</td>
              <td class="num"><strong>${number(row.stock)}</strong></td>
              <td>${row.idealSellBy || "-"}</td>
              <td>${row.sellBy || "-"}</td>
              <td>${row.expiry}</td>
              <td class="num">${brl(row.stock * row.cost.batchCostPerBottle)}</td>
            </tr>
          `,
        ),
      ),
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
  return `
    ${pageHead("Estoque", "Escolha o tipo de estoque para ver saldos sem poluição visual.", actionButton("stock-adjustment", "Ajuste com motivo", "tune"))}
    <div class="module-tabs">${viewButtons}</div>
    <section class="admin-grid">
      ${inventoryViews[currentStockView]?.() || inventoryViews.kombuchas()}
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
  const rows = state.sales
    .filter((item) => matchesSearch(item))
    .map((sale) => {
      const revenue = saleRevenue(sale);
      const batch = state.batches.find((item) => item.code === sale.batchCode);
      const product = byId("products", sale.productId) || productForBatch(batch);
      const cogs = Number(sale.qty) * (batch ? batchCost(batch).batchCostPerBottle : 0);
      return `
        <tr>
          <td>${sale.date}</td>
          <td><strong>${sale.customerName || sale.partner}</strong><br><span>${sale.movementType || "venda"} | ${sale.priceType || sale.channel}</span></td>
          <td>${product ? productLabel(product) : sale.flavor}<br><span>${sale.batchCode}${sale.note ? ` | ${sale.note}` : ""}</span></td>
          <td class="num">${number(sale.qty)}</td>
          <td class="num">${brl(revenue)}</td>
          <td class="num">${brl(cogs)}</td>
          <td class="num"><strong>${brl(revenue - cogs)}</strong></td>
          <td class="num">${pct(revenue ? ((revenue - cogs) / revenue) * 100 : 0)}</td>
          <td>${rowActions([tableAction(`edit-sale:${sale.id}`, "Editar venda"), tableAction(`delete-sale:${sale.id}`, "Excluir venda", "delete", "danger")])}</td>
        </tr>
      `;
    });
  return `
    ${pageHead("Vendas", "Registre vendas, perdas, brindes e consumo próprio por lote para manter estoque e CRM atualizados.", `${actionButton("new-sale", "Nova saída", "add")} ${actionButton("export-sales", "CSV", "download", "btn-outline")}`)}
    <section class="admin-grid">
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
      <article class="admin-card">
        <h3>Como usar</h3>
        <p class="empty-note">Use “Nova saída” também para perda, presente ou consumo próprio. Só movimentos marcados como venda entram como receita, mas todos baixam estoque do lote.</p>
      </article>
    </section>
    ${table(
      [
        { label: "Data" },
        { label: "Cliente / tipo" },
        { label: "Produto / lote" },
        { label: "Qtd.", num: true },
        { label: "Receita", num: true },
        { label: "COGS", num: true },
        { label: "Lucro", num: true },
        { label: "Margem", num: true },
        { label: "Ações" },
      ],
      rows,
      1160,
    )}
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
  const rows = filteredOrders.map((order) => {
    const items = orderItems(order);
    const itemSummary = items.length
      ? items
          .slice(0, 3)
          .map((item) => {
            const ready = Number(item.reservedQty || 0) || Number(item.producedQty || 0);
            return `${number(item.qty)}x ${escapeHtml(orderProductText(item))} <span class="inline-muted">${number(ready)}/${number(item.qty)} ${escapeHtml(item.productionStatus || "pendente")}</span>${item.note ? ` (${escapeHtml(item.note)})` : ""}`;
          })
          .join("<br>")
      : "Sem itens";
    const extra = items.length > 3 ? `<br><span>+${items.length - 3} item(ns)</span>` : "";
    const receivableStatus = orderReceivableStatus(order);
    const due = orderPaymentDueDate(order);
    return `
      <tr>
        <td><strong>${escapeHtml(order.code || "Pedido")}</strong><br><span>${order.orderDate || "-"}</span></td>
        <td><strong>${escapeHtml(order.customerName || "Cliente sem nome")}</strong><br><span>${escapeHtml(order.businessName || order.whatsapp || "")}</span><br><span>${escapeHtml(orderClientTypeLabel(order.clientType))}</span></td>
        <td>${itemSummary}${extra}</td>
        <td class="num">${number(orderQuantity(order))}</td>
        <td>${orderStatusBadge(order.status)}</td>
        <td>${order.estimatedReadyDate || "-"}<br><span>${escapeHtml(orderDateNote(order))}</span></td>
        <td>${order.deliveredAt || "-"}<br><span>${due ? `Receber até ${due}` : "Entrega pendente"}</span></td>
        <td>${order.status === "entregue" ? `<span class="status ${statusClass(receivableStatus, "general")}">${receivableStatus}</span>` : "-"}</td>
        <td class="num"><strong>${brl(orderTotal(order))}</strong></td>
        <td>${rowActions([tableAction(`edit-order:${order.id}`, "Editar pedido"), tableAction(`delete-order:${order.id}`, "Excluir pedido", "delete", "danger")])}</td>
      </tr>
    `;
  });
  return `
    ${pageHead(
      "Pedidos",
      "Acompanhe encomendas grandes antes da venda: cliente, itens, status de produção, previsão de pronto e valor estimado.",
      `${actionButton("new-order", "Novo pedido", "add")} ${actionButton("export-orders", "CSV", "download", "btn-outline")}`,
    )}
    <section class="metric-grid">
      ${metric("Pedidos abertos", number(openOrders.length), `${number(openOrders.reduce((sum, order) => sum + orderQuantity(order), 0))} garrafas no pipeline`, "pending_actions")}
      ${metric("Em produção", number(inProduction.length), "Pedidos marcados como em produção", "factory")}
      ${metric("Atenção 7 dias", number(dueSoon.length), "Prontos, atrasados ou próximos da data", "event_upcoming")}
      ${metric("Valor em pedidos", brl(openOrders.reduce((sum, order) => sum + orderTotal(order), 0)), "Receita prevista em pipeline", "request_quote")}
      ${metric("A receber", brl(orders.reduce((sum, order) => sum + orderReceivableValue(order), 0)), "15 dias após entrega", "payments")}
    </section>
    <section class="admin-card order-production-card">
      <h3>Fila de produção por sabor</h3>
      <div class="production-chip-grid">
        ${orderProductionRows().length ? orderProductionRows().map((row) => `<div class="production-chip"><strong>${escapeHtml(row.flavor)}</strong><span>${number(row.missing)} faltando</span><small>${number(row.reserved)} reservado de ${number(row.ordered)} | ${row.nextDue || "sem data"}</small></div>`).join("") : `<p class="empty-note">Sem produção pendente para pedidos abertos.</p>`}
      </div>
    </section>
    ${table(
      [
        { label: "Pedido / data" },
        { label: "Cliente" },
        { label: "Itens" },
        { label: "Qtd.", num: true },
        { label: "Status" },
        { label: "Previsão" },
        { label: "Entrega / cobrança" },
        { label: "Pagamento" },
        { label: "Valor", num: true },
        { label: "Ações" },
      ],
      rows,
    )}
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
        <p class="lead" style="font-size:1rem">As alterações ficam salvas neste navegador. Para que imagens e textos mudem para todos os visitantes, precisamos ligar o site a um backend, como Supabase.</p>
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

function renderAuditRows(limit) {
  return state.audit
    .slice(0, limit)
    .map((entry) => `<div class="audit-row"><strong>${entry.action}</strong><span>${new Date(entry.at).toLocaleString("pt-BR")} | ${entry.user}</span><span>${entry.detail}</span></div>`)
    .join("");
}

function matchesSearch(item) {
  if (!globalSearch) return true;
  return normalizeText(JSON.stringify(item)).includes(normalizeText(globalSearch));
}

function enhanceSelectSearch(container = document) {
  if (!container) return;
  container.querySelectorAll("select").forEach((select) => {
    if (select.dataset.searchEnhanced === "true" || select.options.length < 8) return;
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
  document.querySelector("#adminContent").innerHTML = view();
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

function openModal(title, eyebrow, body) {
  document.querySelector("#adminModalTitle").textContent = title;
  document.querySelector("#adminModalEyebrow").textContent = eyebrow;
  document.querySelector("#adminModalBody").innerHTML = body;
  document.querySelector("#adminModal").classList.add("is-open");
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
    active: (product) => product.status === "ativo",
    visible: (product) => product.visible,
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
  const retailDefault = commonProductPrice("retailPrice", 18.5).toFixed(2);
  const wholesaleDefault = commonProductPrice("wholesalePrice", 13).toFixed(2);
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
              <option value="active">Somente status ativo (${productsForPriceScope("active").length})</option>
              <option value="visible">Somente públicos/visíveis (${productsForPriceScope("visible").length})</option>
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
    const recipeCount = data.get("syncRecipes") === "on" ? syncRecipePricesForProducts(products, { hasRetail, hasWholesale, retailPrice, wholesalePrice }) : 0;
    const changed = [hasRetail ? `varejo ${brl(retailPrice)}` : "", hasWholesale ? `atacado ${brl(wholesalePrice)}` : ""].filter(Boolean).join(" | ");
    addAudit("Preço global atualizado", `${products.length} produtos | ${changed}${recipeCount ? ` | ${recipeCount} receitas` : ""}`);
    closeModal();
    render();
  });
}

function newProductForm() {
  const retailDefault = commonProductPrice("retailPrice", 18.5).toFixed(2);
  const wholesaleDefault = commonProductPrice("wholesalePrice", 13).toFixed(2);
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
          <label class="field"><span>Custo base</span><input name="baselineCost" type="number" min="0" step="0.01" value="0"></label>
          <label class="field"><span>Status</span><select name="status"><option>ativo</option><option>planejado</option><option>pausado</option></select></label>
          <label class="field field-full"><span>Descrição</span><input name="description" placeholder="Kombucha Premium de 500ml - Sabor ..."></label>
          <label class="check-row field-full"><input name="visible" type="checkbox" checked> <span>Visível/ativo para operação</span></label>
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
      baselineCost: Number(data.baselineCost || 0),
      status: data.status || "ativo",
      visible: data.visible === "on",
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
  const defaultKey = state.ingredients[0]
    ? purchaseStockKey("ingredients", state.ingredients[0].id)
    : state.packaging[0]
      ? purchaseStockKey("packaging", state.packaging[0].id)
      : "new:ingredients";
  openModal(
    "Registrar compra",
    "Compras",
    `
      <form id="purchaseForm">
        <div class="input-grid">
          <label class="field"><span>Data</span><input name="date" type="date" value="${todayIso()}" required></label>
          <label class="field"><span>Tipo de compra</span><select name="kind"><option value="stock">Entra no estoque/custo</option><option value="operational">Despesa operacional</option></select></label>
          <label class="field"><span>Item de estoque</span><select name="stockKey">${purchaseStockOptions(defaultKey)}</select></label>
          <label class="field"><span>Fornecedor</span><input name="supplier" value="${state.suppliers[0]?.name || ""}" required></label>
          <label class="field" data-new-purchase-field><span>Nome do novo item</span><input name="newItemName" placeholder="Ex: lavanda, datador, caixa"></label>
          <label class="field" data-new-purchase-field><span>Categoria / tipo</span><input name="newCategory" placeholder="fruta, chá, embalagem..."></label>
          <label class="field" data-new-purchase-field><span>Unidade de estoque</span><select name="newPurchaseUnit">${unitOptions("g")}</select></label>
          <label class="field"><span>Pacotes / unidades compradas</span><input name="packageCount" type="number" min="0" step="1" value="1" required></label>
          <label class="field"><span>Conteúdo de cada pacote</span><input name="packageSize" type="number" min="0" step="0.001" required placeholder="Ex: 200"></label>
          <label class="field"><span>Unidade do pacote</span><select name="packageUnit">${unitOptions("g")}</select></label>
          <label class="field"><span>Total pago</span><input name="total" type="number" step="0.01" required></label>
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
  const updateNewFields = ({ suggestUnit = false } = {}) => {
    const isOperational = form.elements.kind.value === "operational";
    const isNewItem = isOperational || form.elements.stockKey.value.startsWith("new:");
    form.elements.stockKey.closest(".field").hidden = isOperational;
    form.elements.packageCount.required = !isOperational;
    form.elements.packageSize.required = !isOperational;
    form.querySelectorAll("[data-new-purchase-field]").forEach((field) => {
      field.hidden = !isNewItem;
    });
    if (isNewItem && suggestUnit) {
      const newType = parsePurchaseStockKey(form.elements.stockKey.value).itemId;
      form.elements.newPurchaseUnit.value = newType === "packaging" ? "un" : "g";
    }
  };
  const purchaseCalc = () => {
    const isOperational = form.elements.kind.value === "operational";
    const stockKey = form.elements.stockKey.value;
    const isNewItem = isOperational || stockKey.startsWith("new:");
    const target = isNewItem ? { collection: parsePurchaseStockKey(stockKey).itemId, item: null } : stockItemFromKey(stockKey);
    const packageCount = Number(form.elements.packageCount.value || 0);
    const packageSize = Number(form.elements.packageSize.value || 0);
    const packageUnit = form.elements.packageUnit.value;
    const stockUnit = isNewItem ? form.elements.newPurchaseUnit.value : stockUnitFor(target.collection, target.item, packageUnit);
    const total = Number(form.elements.total.value || 0);
    const qty = purchaseQuantityInStockUnit({ packageCount, packageSize, packageUnit }, stockUnit);
    const costPerUnit = total / Math.max(qty, 0.000001);
    const itemName = isNewItem ? form.elements.newItemName.value || "Novo item" : target.item?.name || "Item";
    if (isOperational) {
      preview.innerHTML = `
        <small>Despesa operacional</small>
        <strong>${brl(total)}</strong>
        <span>${itemName}: entra em Despesas e não altera estoque/custo da garrafa.</span>
      `;
      return { target, isNewItem, isOperational, packageCount, packageSize, packageUnit, stockUnit, qty: 0, total, costPerUnit: 0 };
    }
    preview.innerHTML = `
      <small>Total que entra no estoque</small>
      <strong>${number(qty, 3)} ${stockUnit}</strong>
      <span>${itemName}: ${brl(costPerUnit)} por ${stockUnit}</span>
    `;
    return { target, isNewItem, packageCount, packageSize, packageUnit, stockUnit, qty, total, costPerUnit };
  };
  form.addEventListener("input", purchaseCalc);
  form.addEventListener("change", () => {
    updateNewFields();
    purchaseCalc();
  });
  form.elements.stockKey.addEventListener("change", () => updateNewFields({ suggestUnit: true }));
  updateNewFields();
  purchaseCalc();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const { target, isNewItem, isOperational, packageCount, packageSize, packageUnit, stockUnit, qty, total, costPerUnit } = purchaseCalc();
    if (isNewItem && !data.newItemName.trim()) {
      window.alert("Informe o nome do novo item.");
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
    if (isNewItem && collection === "ingredients") {
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
    if (isNewItem && collection === "packaging") {
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
    "Nova saída",
    "Vendas",
    `
      <form id="saleForm">
        <div class="input-grid">
          <label class="field"><span>Data</span><input name="date" type="date" value="${todayIso()}" required></label>
          <label class="field"><span>Tipo de saída</span><select name="movementType"><option value="venda">Venda</option><option value="consumo">Consumo próprio</option><option value="presente">Presente / amostra</option><option value="perda">Perda / quebra</option></select></label>
          <label class="field field-full"><span>Cliente / destino</span><input name="customerName" list="customerOptions" placeholder="Nome do cliente, parceiro ou destino" required></label>
          <datalist id="customerOptions">${[...new Set([...state.partners.map((item) => item.name), ...state.sales.map((sale) => sale.customerName || sale.partner).filter(Boolean)])].map((name) => `<option value="${escapeHtml(name)}"></option>`).join("")}</datalist>
          <label class="field"><span>Lote</span><select name="batchCode">${stockRows.map((row) => `<option value="${row.code}" data-retail="${productRetailPrice(row.product)}" data-wholesale="${productWholesalePrice(row.product)}" data-stock="${row.stock}">${row.code} - ${row.product ? productLabel(row.product) : row.flavor} (${row.stock} un)</option>`).join("")}</select></label>
          <label class="field"><span>Quantidade</span><input name="qty" type="number" min="1" required></label>
          <label class="field"><span>Preço</span><select name="priceType"><option value="varejo">Varejo</option><option value="atacado">Atacado</option><option value="custom">Valor combinado</option><option value="gratis">Sem cobrança</option></select></label>
          <label class="field"><span>Preço unitário</span><input name="unitPrice" type="number" step="0.01" value="${productRetailPrice(stockRows[0]?.product) || productWholesalePrice(stockRows[0]?.product) || 0}" required></label>
          <label class="field"><span>Desconto</span><input name="discount" type="number" step="0.01" value="0"></label>
          <label class="field"><span>Entrega</span><input name="delivery" type="number" step="0.01" value="0"></label>
          <label class="field field-full"><span>Observação</span><input name="note" placeholder="Ex: recorrente com preço diferenciado, brinde, garrafa quebrada..."></label>
        </div>
        <button class="btn btn-primary" type="submit">Registrar saída</button>
      </form>
    `,
  );
  const saleForm = document.querySelector("#saleForm");
  const updateSalePrice = () => {
    const option = saleForm.elements.batchCode.selectedOptions[0];
    const movement = saleForm.elements.movementType.value;
    const type = saleForm.elements.priceType.value;
    if (movement !== "venda" || type === "gratis") {
      saleForm.elements.unitPrice.value = 0;
      saleForm.elements.discount.value = 0;
      return;
    }
    if (type === "varejo") saleForm.elements.unitPrice.value = Number(option?.dataset.retail || 0);
    if (type === "atacado") saleForm.elements.unitPrice.value = Number(option?.dataset.wholesale || 0);
  };
  saleForm.elements.batchCode.addEventListener("change", updateSalePrice);
  saleForm.elements.priceType.addEventListener("change", updateSalePrice);
  saleForm.elements.movementType.addEventListener("change", updateSalePrice);
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
    addAudit(data.movementType === "venda" ? "Venda registrada" : "Saída registrada", `${number(qty)} garrafas do lote ${data.batchCode} para ${data.customerName}`);
    closeModal();
    render();
  });
  updateSalePrice();
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
          <label class="field field-full"><span>Sabor produzido</span><select name="recipeId">${state.recipes.map((recipe) => `<option value="${recipe.id}">${recipeLabel(recipe)}</option>`).join("")}</select></label>
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
    const reserved = allocateBatchToOrders(batch);
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
  return `<label class="field ${full}"><span>${label}</span><input name="${name}" type="${field.type || "text"}" value="${escapeHtml(current)}" ${field.min != null ? `min="${field.min}"` : ""} ${field.step ? `step="${field.step}"` : ""} ${required}></label>`;
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
  if (!window.confirm(`Excluir pedido "${order.code}"? Vendas automáticas vinculadas a ele também serão removidas.`)) return;
  state.orders = state.orders.filter((item) => item.id !== recordId);
  state.sales = state.sales.filter((sale) => sale.orderId !== recordId);
  addAudit("Pedido excluído", order.code);
  render();
}

const productFields = [
  { name: "item", label: "Item", required: true },
  { name: "ean", label: "EAN-13" },
  { name: "flavor", label: "Sabor", required: true },
  { name: "sizeMl", label: "Tamanho ml", type: "number", min: 1, required: true },
  { name: "retailPrice", label: "Preço varejo", type: "number", min: 0, step: "0.01" },
  { name: "wholesalePrice", label: "Preço atacado", type: "number", min: 0, step: "0.01" },
  { name: "baselineCost", label: "Custo base", type: "number", min: 0, step: "0.01" },
  { name: "status", label: "Status", type: "select", options: ["ativo", "planejado", "pausado", "inativo"] },
  { name: "description", label: "Descrição", full: true },
  { name: "visible", label: "Visível/ativo para operação", type: "checkbox", full: true },
];

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
  });
}

function deleteBatch(batchId) {
  const batch = byId("batches", batchId);
  if (!batch) return;
  if (!window.confirm(`Excluir lote "${batch.code}"? O estoque de ingredientes e materiais será restaurado quando este lote já tiver dado baixa.`)) return;
  const recipe = byId("recipes", batch.recipeId);
  if (batch.inventoryAdjusted && recipe) applyBatchInventory(recipe, Number(batch.inventoryQty || batch.actual || 0), 1);
  state.batches = state.batches.filter((item) => item.id !== batchId);
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
  return `
    <div class="builder-row order-item-row">
      <label class="field"><span>Produto / sabor</span><select data-field="productId">${state.products.map((product) => `<option value="${product.id}" ${selectedProductId === product.id ? "selected" : ""}>${escapeHtml(productLabel(product))}</option>`).join("")}</select></label>
      <label class="field"><span>Qtd. garrafas</span><input data-field="qty" type="number" min="1" step="1" value="${item.qty || 1}"></label>
      <label class="field"><span>Preço unitário</span><input data-field="unitPrice" type="number" min="0" step="0.01" value="${defaultPrice}"></label>
      <label class="field"><span>Status produção</span><select data-field="productionStatus">${ORDER_ITEM_STATUSES.map((option) => `<option value="${option}" ${status === option ? "selected" : ""}>${option}</option>`).join("")}</select></label>
      <label class="field"><span>Qtd. reservada</span><input data-field="reservedQty" type="number" min="0" step="1" value="${item.reservedQty || 0}"></label>
      <label class="field"><span>Pronto em</span><input data-field="readyDate" type="date" value="${item.readyDate || ""}"></label>
      <label class="field"><span>Obs. do item</span><input data-field="note" value="${escapeHtml(item.note || "")}" placeholder="Ex: caixa, entrega, condição..."></label>
      <input type="hidden" data-field="batchCode" value="${escapeHtml(item.batchCode || "")}">
      <input type="hidden" data-field="producedQty" value="${Number(item.producedQty || 0)}">
      <input type="hidden" data-field="key" value="${escapeHtml(item.key || id("oi"))}">
      <button class="icon-btn" type="button" data-remove-builder-row aria-label="Remover item">
        <span class="material-symbols-outlined" aria-hidden="true">delete</span>
      </button>
    </div>
  `;
}

function readOrderItemRow(row) {
  const data = readBuilderRow(row);
  const product = byId("products", data.productId);
  if (!product || Number(data.qty || 0) <= 0) return null;
  return {
    productId: product.id,
    productName: productLabel(product),
    flavor: product.flavor,
    key: data.key || id("oi"),
    qty: Number(data.qty || 0),
    unitPrice: Number(data.unitPrice || 0),
    productionStatus: data.productionStatus || "pendente",
    producedQty: Number(data.producedQty || 0),
    reservedQty: Math.min(Number(data.reservedQty || 0), Number(data.qty || 0)),
    readyDate: data.readyDate || "",
    batchCode: data.batchCode || "",
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
  const applyClientPricing = (row) => {
    const product = byId("products", row.querySelector('[data-field="productId"]')?.value);
    setRowField(row, "unitPrice", priceForOrderClientType(product, form.elements.clientType?.value || "novo_cliente"));
  };
  form.querySelector("[data-add-order-item]")?.addEventListener("click", () => {
    rows.insertAdjacentHTML("beforeend", orderItemRowTemplate({}, form.elements.clientType?.value || "novo_cliente"));
    enhanceSelectSearch(rows);
    applyClientPricing(rows.lastElementChild);
    updateOrderPreview(form);
  });
  form.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-builder-row]");
    if (!removeButton) return;
    const row = removeButton.closest(".order-item-row");
    if (row && rows.children.length > 1) row.remove();
    updateOrderPreview(form);
  });
  form.addEventListener("change", (event) => {
    const row = event.target.closest(".order-item-row");
    if (row && event.target.dataset.field === "productId") {
      applyClientPricing(row);
    }
    if (event.target.name === "clientType") {
      rows.querySelectorAll(".order-item-row").forEach(applyClientPricing);
    }
    if (event.target.name === "status" && event.target.value === "entregue" && !form.elements.deliveredAt.value) {
      form.elements.deliveredAt.value = todayIso();
      form.elements.paymentDueDate.value = addDaysIso(todayIso(), 15);
    }
    if (event.target.name === "deliveredAt" && event.target.value && !form.elements.paymentDueDate.value) {
      form.elements.paymentDueDate.value = addDaysIso(event.target.value, 15);
    }
    updateOrderPreview(form);
  });
  form.addEventListener("input", () => updateOrderPreview(form));
  rows.querySelectorAll(".order-item-row").forEach((row) => {
    if (!Number(row.querySelector('[data-field="unitPrice"]')?.value || 0)) applyClientPricing(row);
  });
  updateOrderPreview(form);
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
  openModal(
    existing ? "Editar pedido" : "Novo pedido",
    "Pedidos",
    `
      <form id="orderForm">
        <div class="input-grid">
          <label class="field"><span>Código</span><input name="code" value="${escapeHtml(existing?.code || nextOrderCode(orderDate))}" required></label>
          <label class="field"><span>Data do pedido</span><input name="orderDate" type="date" value="${orderDate}" required></label>
          <label class="field"><span>Status</span><select name="status" class="admin-select">${ORDER_STATUSES.map((status) => `<option value="${status}" ${existing?.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
          <label class="field"><span>Tipo de cliente</span><select name="clientType" class="admin-select">${ORDER_CLIENT_TYPES.map((type) => `<option value="${type.value}" ${clientType === type.value ? "selected" : ""}>${type.label}</option>`).join("")}</select></label>
          <label class="field"><span>Previsão de pronto</span><input name="estimatedReadyDate" type="date" value="${readyDate}"></label>
          <label class="field"><span>Data de entrega</span><input name="deliveredAt" type="date" value="${deliveredAt}"></label>
          <label class="field"><span>Receber até</span><input name="paymentDueDate" type="date" value="${paymentDueDate}"></label>
          <label class="field"><span>Status pagamento</span><select name="paymentStatus" class="admin-select">${PAYMENT_STATUSES.map((status) => `<option value="${status}" ${orderReceivableStatus(existing || {}) === status || existing?.paymentStatus === status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
          <label class="field"><span>Cliente</span><input name="customerName" value="${escapeHtml(existing?.customerName || "")}" required></label>
          <label class="field"><span>Negócio / empresa</span><input name="businessName" value="${escapeHtml(existing?.businessName || "")}"></label>
          <label class="field"><span>WhatsApp</span><input name="whatsapp" value="${escapeHtml(existing?.whatsapp || "")}"></label>
          <label class="field"><span>Cliente precisa até</span><input name="neededBy" type="date" value="${existing?.neededBy || ""}"></label>
          <label class="field"><span>Origem</span><input name="source" value="${escapeHtml(existing?.source || "")}" placeholder="WhatsApp, feira, revendedor..."></label>
          <label class="field field-full"><span>Observações do pedido</span><textarea name="notes" placeholder="Condição comercial, entrega, prioridade, cobrança...">${escapeHtml(existing?.notes || "")}</textarea></label>
          <div class="result-card field-full" id="orderPreview"></div>
        </div>

        <div class="builder-section">
          <div class="table-toolbar">
            <div>
              <h3>Itens do pedido</h3>
              <p>Cada sabor tem seu próprio andamento. Lotes produzidos reservam garrafas automaticamente para pedidos abertos.</p>
            </div>
            <button class="btn btn-outline" type="button" data-add-order-item>
              <span class="material-symbols-outlined" aria-hidden="true">add</span>
              Item
            </button>
          </div>
          <div id="orderItemsRows">${(existing && orderItems(existing).length ? orderItems(existing) : [{}]).map((item) => orderItemRowTemplate(item, clientType)).join("")}</div>
        </div>

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
    const payload = {
      code: data.code,
      orderDate: data.orderDate,
      estimatedReadyDate: data.estimatedReadyDate,
      deliveredAt: data.deliveredAt,
      paymentDueDate: data.paymentDueDate || (data.deliveredAt ? addDaysIso(data.deliveredAt, 15) : ""),
      paymentStatus: data.paymentStatus,
      neededBy: data.neededBy,
      status: data.status,
      clientType: data.clientType || "novo_cliente",
      customerName: data.customerName,
      businessName: data.businessName,
      whatsapp: data.whatsapp,
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
      addAudit("Pedido atualizado", `${payload.code}: ${payload.customerName}`);
    } else {
      const order = { id: id("ord"), createdAt: new Date().toISOString(), ...payload };
      syncOrderIntegrations(order);
      state.orders.unshift(order);
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
    "edit-product": (itemId) => editRecordForm("products", itemId, "Editar produto", productFields),
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
    "delete-partner": (itemId) => deleteRecord("partners", itemId),
    "edit-expense": (itemId) => editRecordForm("expenses", itemId, "Editar despesa", expenseFields),
    "delete-expense": (itemId) => deleteRecord("expenses", itemId),
    "edit-recipe": editRecipeForm,
    "delete-recipe": (itemId) => deleteRecord("recipes", itemId),
    "edit-batch": editBatchForm,
    "delete-batch": deleteBatch,
    "edit-sale": editSaleForm,
    "delete-sale": (itemId) => deleteRecord("sales", itemId),
    "edit-order": orderForm,
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
    "export-products": () => exportCSV("kombu-produtos-ean", [["EAN-13", "Item", "Sabor", "Tamanho ml", "Descricao", "Varejo", "Atacado", "Custo base"], ...state.products.map((p) => [p.ean, p.item, p.flavor, p.sizeMl, p.description, p.retailPrice, p.wholesalePrice, p.baselineCost])]),
    "export-ingredients": () => exportCSV("kombu-ingredientes", [["Nome", "Categoria", "Fornecedor", "Estoque", "Unidade", "Custo", "Status"], ...state.ingredients.map((i) => [i.name, i.category, i.supplier, i.stock, i.purchaseUnit, i.costPerUnit, ingredientNeedsCost(i) ? "custo pendente" : i.status])]),
    "export-purchases": () => exportCSV("kombu-compras", [["Data", "Fornecedor", "Item", "Pacotes", "Conteúdo pacote", "Unidade pacote", "Entra estoque", "Unidade estoque", "Total", "Custo unitário", "Método", "Comprador"], ...state.purchases.map((p) => [p.date, p.supplier, p.item, p.packageCount || "", p.packageSize || "", p.packageUnit || "", p.qty, p.unit, p.total, p.costPerUnit || "", p.method, p.buyer])]),
    "export-sales": () => exportCSV("kombu-saidas-vendas", [["Data", "Tipo", "Cliente/destino", "Preço", "Sabor", "Lote", "Qtd", "Preço unitário", "Receita", "Desconto", "Entrega", "Observação"], ...state.sales.map((s) => [s.date, s.movementType || "venda", s.customerName || s.partner, s.priceType || s.channel, s.flavor, s.batchCode, s.qty, s.unitPrice, saleRevenue(s), s.discount, s.delivery, s.note || ""])]),
    "export-orders": () => exportCSV("kombu-pedidos", [["Código", "Data", "Tipo cliente", "Status", "Cliente", "Negócio", "WhatsApp", "Previsão pronto", "Entrega", "Receber até", "Pagamento", "Precisa até", "Qtd", "Valor", "Itens", "Observações"], ...(state.orders || []).map((order) => [order.code, order.orderDate, orderClientTypeLabel(order.clientType), order.status, order.customerName, order.businessName, order.whatsapp, order.estimatedReadyDate, order.deliveredAt || "", orderPaymentDueDate(order), orderReceivableStatus(order), order.neededBy, orderQuantity(order), orderTotal(order), orderItems(order).map((item) => `${item.qty}x ${orderProductText(item)} | ${item.productionStatus || "pendente"} | reservado ${item.reservedQty || 0} @ ${brl(item.unitPrice)}`).join("; "), order.notes || ""])]),
    "export-leads": () => exportCSV("kombu-leads-crm", [["Criado em", "Tipo", "Status", "Nome", "Negócio", "Tipo negócio", "Local", "WhatsApp", "Instagram", "Mensagem"], ...state.leads.map((lead) => [lead.createdAt, lead.type, lead.status, lead.name, lead.business, lead.businessType, lead.location, lead.whatsapp, lead.instagram, lead.message])]),
    "export-reports": () => exportCSV("kombu-relatorio", [["Métrica", "Valor"], ["Receita", totals().salesRevenue], ["COGS", totals().cogs], ["Lucro bruto", totals().grossProfit], ["Despesas", totals().expenses], ["Líquido", totals().net], ["Pedidos em aberto", totals().openOrderValue], ["A receber", totals().receivable], ["Produção faltante", totals().productionMissing]]),
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

document.querySelector("#mobileModuleSelector")?.addEventListener("change", (event) => {
  setModule(event.target.value);
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

async function initializeAdmin() {
  stripSensitiveUrlParams();
  bindAuth();
  if (isAuthenticated()) {
    await startAuthenticatedSession();
  } else {
    lockAdmin();
  }
}

initializeAdmin();
