const STORAGE_KEY = "kombuAdminStateV3";
const ADMIN_PASSWORD = "Rssb2010";
const ADMIN_NOTIFICATION_EMAIL = "armaandaswani@icloud.com";
const FLAVOR_CATEGORIES = ["Frutados", "Cítricos", "Florais", "Herbais", "Especiados"];
const FLAVOR_IMAGE_RECOMMENDED = "mín. 760 x 1368 px; ideal 1040 x 1872 px";

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
  { id: "pkg-bottle-500", name: "Garrafa 500ml", supplier: "Base de custos Kombú", unit: "un", costEach: 0.84, stock: 0, min: 0, location: "" },
  { id: "pkg-label-500", name: "Rótulo 500ml", supplier: "Base de custos Kombú", unit: "un", costEach: 0.85, stock: 0, min: 0, location: "" },
];

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
      { itemId: "pkg-label-500", qty: 1 },
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
  packaging: PACKAGING_SEED,
  suppliers: [],
  partners: [],
  recipes: RECIPE_SEED,
  batches: [],
  sales: [],
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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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
  ["products", "ingredients", "packaging", "suppliers", "partners", "recipes", "batches", "sales", "leads", "purchases", "expenses", "costSources", "audit"].forEach((key) => {
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
  if (currentRole === "Produção") return ["dashboard", "products", "ingredients", "recipes", "costs", "batches", "stock", "packaging"].includes(module);
  if (currentRole === "Financeiro") return ["dashboard", "products", "purchases", "suppliers", "costs", "expenses", "reports"].includes(module);
  if (currentRole === "Vendas") return ["dashboard", "products", "sales", "leads", "partners", "cms", "reports"].includes(module);
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
    .map((batch) => ({
      ...batch,
      product: productForBatch(batch),
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
  return state.ingredients.filter((item) => Number(item.min) > 0 && Number(item.stock) <= Number(item.min));
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
      const hasMinimum = Number(item.min) > 0;
      return `
        <tr>
          <td><strong>${item.name}</strong><br><span>${item.location}</span></td>
          <td>${item.category}</td>
          <td>${item.supplier}</td>
          <td class="num">${number(item.stock, 2)} ${item.purchaseUnit}</td>
          <td class="num">${brl(item.costPerUnit)} / ${item.purchaseUnit}</td>
          <td><span class="status ${hasMinimum ? statusClass(item.stock / item.min) : "warn"}">${hasMinimum ? (item.stock <= item.min ? "baixo" : "bom") : "sem mínimo"}</span></td>
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
          <td><strong>${item.item}</strong><br><span>${item.supplier}</span></td>
          <td class="num">${number(item.qty, 2)} ${item.unit}</td>
          <td class="num">${brl(item.total)}</td>
          <td>${item.method}</td>
          <td>${item.buyer}</td>
          <td>${rowActions([tableAction(`edit-purchase:${item.id}`, "Editar compra"), tableAction(`delete-purchase:${item.id}`, "Excluir compra", "delete", "danger")])}</td>
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
    ${table(
      [
        { label: "Lote / sabor" },
        { label: "Produto / EAN" },
        { label: "Produção" },
        { label: "Responsável" },
        { label: "Esperado / real", num: true },
        { label: "Perda", num: true },
        { label: "Custo/garrafa", num: true },
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
  const finishedRows = finishedStockRows().map(
    (row) => `
      <tr>
        <td><strong>${row.flavor}</strong><br><span>${row.product ? productLabel(row.product) : row.code}</span></td>
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
    .map((item) => {
      const hasMinimum = Number(item.min) > 0;
      return `
        <tr>
          <td><strong>${item.name}</strong><br><span>${item.location}</span></td>
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
  const rows = state.sales
    .filter((item) => matchesSearch(item))
    .map((sale) => {
      const revenue = Number(sale.qty) * Number(sale.unitPrice) - Number(sale.discount || 0);
      const batch = state.batches.find((item) => item.code === sale.batchCode);
      const product = byId("products", sale.productId) || productForBatch(batch);
      const cogs = Number(sale.qty) * (batch ? batchCost(batch).batchCostPerBottle : 0);
      return `
        <tr>
          <td>${sale.date}</td>
          <td><strong>${sale.partner}</strong><br><span>${sale.channel}</span></td>
          <td>${product ? productLabel(product) : sale.flavor}<br><span>${sale.batchCode}</span></td>
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
    ${pageHead("Vendas", "Registre vendas por canal, parceiro, lote e sabor para calcular COGS, lucro e margem.", `${actionButton("new-sale", "Nova venda", "add")} ${actionButton("export-sales", "CSV", "download", "btn-outline")}`)}
    ${table(
      [
        { label: "Data" },
        { label: "Cliente / canal" },
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
          <td>${rowActions([tableAction(`edit-partner:${partner.id}`, "Editar parceiro"), tableAction(`delete-partner:${partner.id}`, "Excluir parceiro", "delete", "danger")])}</td>
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
          <img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.label)}" loading="lazy">
        </div>
        <div class="image-fields">
          <input type="hidden" data-cms-image="${index}" data-field="key" value="${escapeHtml(image.key)}">
          <label class="field"><span>Imagem</span><input data-cms-image="${index}" data-field="label" value="${escapeHtml(image.label)}"></label>
          <label class="field"><span>Tamanho perfeito</span><input data-cms-image="${index}" data-field="recommended" value="${escapeHtml(image.recommended)}" readonly></label>
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
          <img src="${escapeHtml(flavor.imageUrl || `assets/menu-bottles/${flavor.slug}.png`)}" alt="${escapeHtml(flavor.name)}" loading="lazy">
        </div>
        <div class="flavor-cms-fields">
          <input type="hidden" data-cms-flavor="${index}" data-field="slug" value="${escapeHtml(flavor.slug)}">
          <input type="hidden" data-cms-flavor="${index}" data-field="imageKey" value="${escapeHtml(flavor.imageKey)}">
          <label class="field"><span>Sabor</span><input data-cms-flavor="${index}" data-field="name" value="${escapeHtml(flavor.name)}"></label>
          <label class="field"><span>Categoria</span><select class="admin-select" data-cms-flavor="${index}" data-field="profile">${categoryOptions}</select></label>
          <label class="field"><span>Ordem</span><input type="number" min="1" step="1" data-cms-flavor="${index}" data-field="order" value="${escapeHtml(flavor.order)}"></label>
          <label class="field checkbox-field"><span>Visível no site</span><input type="checkbox" data-cms-flavor="${index}" data-field="visible" ${flavor.visible ? "checked" : ""}></label>
          <label class="field"><span>Tamanho perfeito</span><input data-cms-flavor="${index}" data-field="recommended" value="${escapeHtml(flavor.recommended || FLAVOR_IMAGE_RECOMMENDED)}" readonly></label>
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
      <p class="lead" style="font-size:1rem">Cole uma URL nova para trocar rapidamente hero e imagens gerais. O campo "tamanho perfeito" mostra a dimensão recomendada em pixels.</p>
      <div class="image-control-grid">${imageRows}</div>
    </section>
    <section class="admin-card" style="margin-top:16px">
      <h3>Cardápio público: fotos, ordem e categorias</h3>
      <p class="lead" style="font-size:1rem">Reordene sabores, mude categorias, esconda itens e cole fotos melhores sem editar código. Use imagens verticais em alta para o modal abrir nítido.</p>
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
  return JSON.stringify(item).toLowerCase().includes(globalSearch.toLowerCase());
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
    leads: renderLeads,
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
  const mobileModuleSelector = document.querySelector("#mobileModuleSelector");
  if (mobileModuleSelector && mobileModuleSelector.value !== module) mobileModuleSelector.value = module;
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
          <label class="field"><span>Lote</span><select name="batchCode">${stockRows.map((row) => `<option value="${row.code}" data-price="${productWholesalePrice(row.product)}">${row.code} - ${row.product ? productLabel(row.product) : row.flavor} (${row.stock} un)</option>`).join("")}</select></label>
          <label class="field"><span>Quantidade</span><input name="qty" type="number" min="1" required></label>
          <label class="field"><span>Preço unitário</span><input name="unitPrice" type="number" step="0.01" value="${productWholesalePrice(stockRows[0]?.product) || 10.5}" required></label>
          <label class="field"><span>Desconto</span><input name="discount" type="number" step="0.01" value="0"></label>
          <label class="field"><span>Entrega</span><input name="delivery" type="number" step="0.01" value="0"></label>
          <label class="field"><span>Canal</span><select name="channel"><option>revenda</option><option>parceiro</option><option>evento</option><option>direto</option><option>externo</option></select></label>
        </div>
        <button class="btn btn-primary" type="submit">Salvar venda</button>
      </form>
    `,
  );
  const saleForm = document.querySelector("#saleForm");
  saleForm.querySelector("[name='batchCode']").addEventListener("change", (event) => {
    const price = event.target.selectedOptions[0]?.dataset.price;
    if (price && Number(price) > 0) saleForm.querySelector("[name='unitPrice']").value = price;
  });
  saleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const batch = state.batches.find((item) => item.code === data.batchCode);
    const product = productForBatch(batch);
    state.sales.unshift({
      id: id("sale"),
      date: data.date,
      partner: data.partner,
      channel: data.channel,
      flavor: batch?.flavor || "",
      productId: product?.id || "",
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
          <label class="field"><span>Receita</span><select name="recipeId">${state.recipes.map((recipe) => `<option value="${recipe.id}">${recipeLabel(recipe)}</option>`).join("")}</select></label>
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
      productId: recipe?.productId || "",
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
  form.querySelector("[name='productId']")?.addEventListener("change", (event) => {
    const product = byId("products", event.target.value);
    if (!product) return;
    form.querySelector("[name='flavor']").value = product.flavor;
    form.querySelector("[name='bottleMl']").value = product.sizeMl;
    form.querySelector("[name='wholesalePrice']").value = product.wholesalePrice || 0;
    form.querySelector("[name='retailPrice']").value = product.retailPrice || 0;
  });
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
      productId: data.productId || "",
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
  const ingredient = state.ingredients.find((item) => item.name === purchase.item);
  if (ingredient) ingredient.stock = Math.max(0, Number(ingredient.stock || 0) - Number(purchase.qty || 0));
  state.purchases = state.purchases.filter((item) => item.id !== recordId);
  addAudit("Compra excluída", purchase.item);
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
  { name: "purchaseUnit", label: "Unidade de compra", type: "select", options: ["kg", "g", "l", "ml", "un"] },
  { name: "costPerUnit", label: "Custo por unidade", type: "number", min: 0, step: "0.000001" },
  { name: "stock", label: "Estoque atual", type: "number", min: 0, step: "0.01" },
  { name: "min", label: "Estoque mínimo", type: "number", min: 0, step: "0.01" },
  { name: "expires", label: "Vencimento", type: "date" },
  { name: "location", label: "Local" },
  { name: "status", label: "Status", type: "select", options: ["ativo", "pausado", "inativo"] },
];

const packagingFields = [
  { name: "name", label: "Nome", required: true },
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

function editRecipeForm(recipeId) {
  const recipeFields = [
    { name: "productId", label: "Produto / EAN", type: "select", options: [{ value: "", label: "Sem produto vinculado" }, ...state.products.map((product) => ({ value: product.id, label: productLabel(product) }))] },
    { name: "flavor", label: "Sabor", required: true },
    { name: "version", label: "Versão", required: true },
    { name: "status", label: "Status", type: "select", options: ["ativa", "rascunho", "pausada", "arquivada"] },
    { name: "bottleMl", label: "Tamanho ml", type: "number", min: 1, required: true },
    { name: "yieldBottles", label: "Rendimento", type: "number", min: 1, required: true },
    { name: "wastePct", label: "Perda %", type: "number", min: 0, step: "0.01" },
    { name: "wholesalePrice", label: "Preço atacado", type: "number", min: 0, step: "0.01" },
    { name: "retailPrice", label: "Preço varejo", type: "number", min: 0, step: "0.01" },
    { name: "labor", label: "Mão de obra", type: "number", min: 0, step: "0.01" },
    { name: "utilities", label: "Água/luz/gás", type: "number", min: 0, step: "0.01" },
    { name: "other", label: "Outros custos", type: "number", min: 0, step: "0.01" },
  ];
  editRecordForm("recipes", recipeId, "Editar receita", recipeFields, (recipe) => {
    const product = byId("products", recipe.productId);
    if (product) {
      recipe.flavor = recipe.flavor || product.flavor;
      recipe.bottleMl = Number(recipe.bottleMl || product.sizeMl);
    }
    activeRecipeId = recipe.id;
  });
}

function editBatchForm(batchId) {
  const batchFields = [
    { name: "code", label: "Código do lote", required: true },
    { name: "recipeId", label: "Receita", type: "select", options: state.recipes.map((recipe) => ({ value: recipe.id, label: recipeLabel(recipe) })) },
    { name: "date", label: "Data de produção", type: "date", required: true },
    { name: "responsible", label: "Responsável" },
    { name: "expected", label: "Rendimento esperado", type: "number", min: 0 },
    { name: "actual", label: "Rendimento real", type: "number", min: 0 },
    { name: "expiry", label: "Validade", type: "date" },
    { name: "status", label: "Status", type: "select", options: ["planejado", "em produção", "bottled", "aprovado", "bloqueado"] },
  ];
  editRecordForm("batches", batchId, "Editar lote", batchFields, (batch) => {
    const recipe = byId("recipes", batch.recipeId);
    batch.flavor = recipe?.flavor || batch.flavor;
    batch.productId = recipe?.productId || batch.productId || "";
  });
}

function editSaleForm(saleId) {
  const saleFields = [
    { name: "date", label: "Data", type: "date", required: true },
    { name: "partner", label: "Parceiro / cliente" },
    { name: "batchCode", label: "Lote" },
    { name: "qty", label: "Quantidade", type: "number", min: 0, step: "1" },
    { name: "unitPrice", label: "Preço unitário", type: "number", min: 0, step: "0.01" },
    { name: "discount", label: "Desconto", type: "number", min: 0, step: "0.01" },
    { name: "delivery", label: "Entrega", type: "number", min: 0, step: "0.01" },
    { name: "channel", label: "Canal", type: "select", options: ["revenda", "parceiro", "evento", "direto", "externo"] },
  ];
  editRecordForm("sales", saleId, "Editar venda", saleFields, (sale) => {
    const batch = state.batches.find((item) => item.code === sale.batchCode);
    const product = productForBatch(batch);
    sale.flavor = batch?.flavor || sale.flavor || "";
    sale.productId = product?.id || sale.productId || "";
  });
}

function editPurchaseForm(purchaseId) {
  const purchase = byId("purchases", purchaseId);
  const previousItem = purchase?.item;
  const previousQty = Number(purchase?.qty || 0);
  const purchaseFields = [
    { name: "date", label: "Data", type: "date", required: true },
    { name: "supplier", label: "Fornecedor" },
    { name: "item", label: "Item", required: true },
    { name: "qty", label: "Quantidade", type: "number", min: 0, step: "0.01" },
    { name: "unit", label: "Unidade", type: "select", options: ["kg", "g", "l", "ml", "un"] },
    { name: "total", label: "Total pago", type: "number", min: 0, step: "0.01" },
    { name: "method", label: "Método" },
    { name: "buyer", label: "Comprador" },
  ];
  editRecordForm("purchases", purchaseId, "Editar compra", purchaseFields, (record) => {
    const previousIngredient = state.ingredients.find((item) => item.name === previousItem);
    const nextIngredient = state.ingredients.find((item) => item.name === record.item);
    if (previousIngredient && previousIngredient === nextIngredient) {
      previousIngredient.stock = Number(previousIngredient.stock || 0) - previousQty + Number(record.qty || 0);
      previousIngredient.costPerUnit = Number(record.total || 0) / Math.max(Number(record.qty || 0), 0.0001);
    }
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
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  addAudit("CSV exportado", name);
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
      const flavor = state.cms.flavors[Number(event.target.dataset.cmsFlavor)];
      flavor[event.target.dataset.field] = fieldValue(event.target);
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
  document.querySelectorAll("[data-lead-status]").forEach((select) => {
    select.addEventListener("change", (event) => {
      const lead = state.leads.find((item) => item.id === event.target.dataset.leadStatus);
      if (!lead) return;
      lead.status = event.target.value;
      addAudit("Lead atualizado", `${lead.name || lead.whatsapp || lead.id}: ${lead.status}`);
      render();
    });
  });
}

function handleAction(action) {
  if (!canWrite() && !["export-products", "export-ingredients", "export-purchases", "export-sales", "export-leads", "export-reports", "export-costs"].includes(action)) return;
  const [dynamicAction, ...dynamicParts] = action.split(":");
  const dynamicPayload = dynamicParts.join(":");
  const dynamicMap = {
    "edit-product": (itemId) => editRecordForm("products", itemId, "Editar produto", productFields),
    "delete-product": (itemId) => deleteRecord("products", itemId),
    "edit-ingredient": (itemId) => editRecordForm("ingredients", itemId, "Editar ingrediente", ingredientFields),
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
    "delete-batch": (itemId) => deleteRecord("batches", itemId),
    "edit-sale": editSaleForm,
    "delete-sale": (itemId) => deleteRecord("sales", itemId),
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
    "export-ingredients": () => exportCSV("kombu-ingredientes", [["Nome", "Categoria", "Fornecedor", "Estoque", "Unidade", "Custo"], ...state.ingredients.map((i) => [i.name, i.category, i.supplier, i.stock, i.purchaseUnit, i.costPerUnit])]),
    "export-purchases": () => exportCSV("kombu-compras", [["Data", "Fornecedor", "Item", "Qtd", "Unidade", "Total"], ...state.purchases.map((p) => [p.date, p.supplier, p.item, p.qty, p.unit, p.total])]),
    "export-sales": () => exportCSV("kombu-vendas", [["Data", "Parceiro", "Canal", "Sabor", "Lote", "Qtd", "Preço"], ...state.sales.map((s) => [s.date, s.partner, s.channel, s.flavor, s.batchCode, s.qty, s.unitPrice])]),
    "export-leads": () => exportCSV("kombu-leads-crm", [["Criado em", "Tipo", "Status", "Nome", "Negócio", "Tipo negócio", "Local", "WhatsApp", "Instagram", "Mensagem"], ...state.leads.map((lead) => [lead.createdAt, lead.type, lead.status, lead.name, lead.business, lead.businessType, lead.location, lead.whatsapp, lead.instagram, lead.message])]),
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
