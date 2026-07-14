const menuBottleBase = "assets/menu-bottles/";
const ADMIN_STORAGE_KEY = "kombuAdminStateV3";
const LEGACY_ADMIN_STORAGE_KEYS = ["kombuAdminStateV2"];
const ADMIN_EMAIL = "armaandaswani@icloud.com";
const OFFICIAL_MAP_ID = "1Zn4OECfeuJkhDkCj6noQKZDeLgOUbn8";
const OFFICIAL_MAP_URL = `https://www.google.com/maps/d/viewer?mid=${OFFICIAL_MAP_ID}`;
const KOMBU_WHATSAPP = "5592992097165";
const BUY_MESSAGE = "Olá! Quero comprar Kombú. Pode me enviar os sabores disponíveis e a melhor forma de retirada/entrega?";
const FLAVOR_CATEGORIES = ["Frutados", "Cítricos", "Florais", "Herbais", "Especiados"];
let publicCloudState = null;

function isLocalPreview() {
  return ["localhost", "127.0.0.1", ""].includes(window.location.hostname);
}

const DEFAULT_PUBLIC_IMAGES = {
  heroBottle:
    "https://static.wixstatic.com/media/716adf_5b0b2489ee914e53b15b4a590915d974~mv2.png/v1/crop/x_6,y_0,w_1068,h_1920/fill/w_760,h_1367,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/4_edited.png",
  maracuja:
    "https://static.wixstatic.com/media/716adf_5b0b2489ee914e53b15b4a590915d974~mv2.png/v1/crop/x_6,y_0,w_1068,h_1920/fill/w_760,h_1367,al_c,q_92,usm_0.66_1.00_0.01,enc_auto/4_edited.png",
  imunidade:
    "https://static.wixstatic.com/media/716adf_c9ac20cf991c4796b8be299c33e22abc~mv2.png/v1/crop/x_62,y_0,w_931,h_1920/fill/w_760,h_1565,al_c,q_92,usm_0.66_1.00_0.01,enc_auto/2.png",
  macaCanela:
    "https://static.wixstatic.com/media/716adf_673e38f87b0e41bd9972f7b8a5fda104~mv2.png/v1/fill/w_760,h_1013,al_c,q_92,usm_0.66_1.00_0.01,enc_auto/IMG_6619_edited.png",
  peraAlecrim:
    "https://static.wixstatic.com/media/716adf_2b695c9743c344a2a91acf67ed69ff5f~mv2.png/v1/fill/w_760,h_1368,al_c,q_92,usm_0.66_1.00_0.01,enc_auto/6_edited_edited.png",
  frutasVermelhas:
    "https://static.wixstatic.com/media/716adf_5c8cd66d9eb842a0940b212d250fd255~mv2.png/v1/fill/w_760,h_1368,al_c,q_92,usm_0.66_1.00_0.01,enc_auto/IMG_2897_PNG.png",
  mirtilo:
    "https://static.wixstatic.com/media/716adf_8da298261b9a4acd8e9e2264491cee1d~mv2.png/v1/fill/w_760,h_1368,al_c,q_92,usm_0.66_1.00_0.01,enc_auto/7.png",
  rosasCardamomo:
    "https://static.wixstatic.com/media/716adf_4d2ae2c8e77d48ea8aa11ceffef05be4~mv2.png/v1/fill/w_760,h_1368,al_c,q_92,usm_0.66_1.00_0.01,enc_auto/3_edited.png",
};

const DEFAULT_FLAVOR_SETTINGS = [
  { slug: "maracuja", profile: "Frutados", order: 1, visible: true, imageUrl: DEFAULT_PUBLIC_IMAGES.maracuja },
  { slug: "frutas-vermelhas", profile: "Frutados", order: 2, visible: true, imageUrl: DEFAULT_PUBLIC_IMAGES.frutasVermelhas },
  { slug: "hibisco-anis-estrelado", profile: "Florais", order: 3, visible: true, imageUrl: "" },
  { slug: "flor-fada-azul-blueberry", profile: "Florais", order: 4, visible: true, imageUrl: DEFAULT_PUBLIC_IMAGES.mirtilo },
  { slug: "maca-canela", profile: "Especiados", order: 5, visible: true, imageUrl: DEFAULT_PUBLIC_IMAGES.macaCanela },
  { slug: "pera-alecrim", profile: "Herbais", order: 6, visible: true, imageUrl: DEFAULT_PUBLIC_IMAGES.peraAlecrim },
  { slug: "imunidade", profile: "Cítricos", order: 7, visible: true, imageUrl: DEFAULT_PUBLIC_IMAGES.imunidade },
  { slug: "rosas-cardamomo", profile: "Florais", order: 8, visible: true, imageUrl: DEFAULT_PUBLIC_IMAGES.rosasCardamomo },
  { slug: "lavanda-limao", profile: "Cítricos", order: 9, visible: true, imageUrl: "" },
  { slug: "jasmim-manga", profile: "Frutados", order: 10, visible: true, imageUrl: "" },
  { slug: "goiaba", profile: "Frutados", order: 11, visible: true, imageUrl: "" },
  { slug: "uva", profile: "Frutados", order: 12, visible: true, imageUrl: "" },
];

const flavors = [
  {
    name: "Goiaba",
    slug: "goiaba",
    imageKey: "goiaba",
    profile: "Frutados",
    color: "#F5CDC3",
    image: `${menuBottleBase}goiaba.png`,
    ingredients: ["Goiaba", "chá fermentado"],
    angle: "Frutada, suave e refrescante.",
    description: "Uma kombucha frutada, suave e refrescante, com sabor de goiaba em destaque.",
  },
  {
    name: "Uva",
    slug: "uva",
    imageKey: "uva",
    profile: "Frutados",
    color: "#E5D7FF",
    image: `${menuBottleBase}uva.png`,
    ingredients: ["Uva", "chá fermentado"],
    angle: "Encorpada e levemente adocicada.",
    description: "Uma kombucha frutada, encorpada e levemente adocicada.",
  },
  {
    name: "Maracujá",
    slug: "maracuja",
    imageKey: "maracuja",
    profile: "Frutados",
    color: "#F7D8AD",
    image: `${menuBottleBase}maracuja.png`,
    ingredients: ["Maracujá", "chá fermentado"],
    angle: "Tropical, ácida na medida e refrescante.",
    description: "Uma kombucha tropical, refrescante e com acidez equilibrada.",
  },
  {
    name: "Rosas & Cardamomo",
    slug: "rosas-cardamomo",
    imageKey: "rosasCardamomo",
    profile: "Florais",
    color: "#F5CDC3",
    image: `${menuBottleBase}rosas-cardamomo.png`,
    ingredients: ["Rosas", "cardamomo", "chá verde"],
    angle: "Floral, aromática e especiada.",
    description: "Uma combinação floral e aromática, com o toque especiado do cardamomo.",
  },
  {
    name: "Pêra & Alecrim",
    slug: "pera-alecrim",
    imageKey: "peraAlecrim",
    profile: "Herbais",
    color: "#D9F99D",
    image: `${menuBottleBase}pera-alecrim.png`,
    ingredients: ["Pêra", "alecrim", "chá verde"],
    angle: "Leve, frutada e herbal.",
    description: "Une o frescor da pêra ao aroma herbal do alecrim.",
  },
  {
    name: "Hibisco & Anis Estrelado",
    slug: "hibisco-anis-estrelado",
    imageKey: "hibisco",
    profile: "Florais",
    color: "#F5CDC3",
    image: `${menuBottleBase}hibisco-anis.png`,
    ingredients: ["Hibisco", "anis estrelado", "chá fermentado"],
    angle: "Floral, ácido e especiado.",
    description: "Combina a intensidade do hibisco com o aroma do anis estrelado.",
  },
  {
    name: "Lavanda & Limão",
    slug: "lavanda-limao",
    imageKey: "lavandaLimao",
    profile: "Cítricos",
    color: "#E5D7FF",
    image: `${menuBottleBase}lavanda-limao.png`,
    ingredients: ["Lavanda", "limão", "chá fermentado"],
    angle: "Cítrico, floral e refrescante.",
    description: "Cítrico, floral e refrescante, com lavanda e limão.",
  },
  {
    name: "Frutas Vermelhas",
    slug: "frutas-vermelhas",
    imageKey: "frutasVermelhas",
    profile: "Frutados",
    color: "#F5CDC3",
    image: `${menuBottleBase}frutas-vermelhas.png`,
    ingredients: ["Morango", "mirtilo", "oxicoco"],
    angle: "Frutada, levemente ácida e vibrante.",
    description: "Mistura morango, mirtilo e oxicoco em um perfil frutado e levemente ácido.",
  },
  {
    name: "Imunidade",
    slug: "imunidade",
    imageKey: "imunidade",
    profile: "Cítricos",
    color: "#F7D8AD",
    image: `${menuBottleBase}imunidade.png`,
    ingredients: ["Limão", "gengibre", "cúrcuma"],
    angle: "Cítrica, intensa e especiada.",
    description: "Feita com limão, gengibre e cúrcuma, com perfil cítrico e marcante.",
  },
  {
    name: "Flor Fada Azul & Blueberry",
    slug: "flor-fada-azul-blueberry",
    imageKey: "mirtilo",
    profile: "Florais",
    color: "#D8DDFF",
    image: `${menuBottleBase}flor-fada-blueberry.png`,
    ingredients: ["Flor fada azul", "blueberry", "chá fermentado"],
    angle: "Delicada, floral e frutada.",
    description: "Uma combinação delicada de flor fada azul e blueberry.",
  },
  {
    name: "Jasmim & Manga",
    slug: "jasmim-manga",
    imageKey: "jasmimManga",
    profile: "Frutados",
    color: "#F7D8AD",
    image: `${menuBottleBase}jasmim-manga.png`,
    ingredients: ["Jasmim", "manga", "chá fermentado"],
    angle: "Tropical, floral e vibrante.",
    description: "Combina manga e jasmim em um sabor tropical com toque floral.",
  },
  {
    name: "Maçã & Canela",
    slug: "maca-canela",
    imageKey: "macaCanela",
    profile: "Herbais",
    color: "#F5CDC3",
    image: `${menuBottleBase}maca-canela.png`,
    ingredients: ["Maçã", "canela", "chá fermentado"],
    angle: "Aromática, frutada e especiada.",
    description: "Combina maçã e canela em um sabor aromático e acolhedor.",
  },
];

const benefits = [
  ["nutrition", "Ingredientes reais", "Frutas, especiarias e flores comestíveis na saborização."],
  ["bubble_chart", "Gaseificação natural", "Efervescência criada pelo próprio processo de fermentação."],
  ["verified", "Sem conservantes", "Sem corantes, conservantes ou aditivos artificiais."],
  ["forest", "Feita em Manaus", "Uma marca local, com produção artesanal e identidade amazônica."],
];

const partners = [];

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatList = (items) => items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("");

function whatsappUrl(message = BUY_MESSAGE) {
  return `https://api.whatsapp.com/send?phone=${KOMBU_WHATSAPP}&text=${encodeURIComponent(message)}`;
}

function readLocalAdminState() {
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY) || LEGACY_ADMIN_STORAGE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function readAdminState() {
  if (publicCloudState) return publicCloudState;
  return isLocalPreview() ? readLocalAdminState() : {};
}

async function loadPublicCloudState() {
  try {
    const response = await fetch("/api/public-state", { credentials: "same-origin" });
    if (!response.ok) return;
    const payload = await response.json();
    if (payload.state) publicCloudState = payload.state;
  } catch {
    publicCloudState = null;
  }
}

function readAdminCms() {
  return readAdminState().cms || {};
}

function getCmsImage(key, fallback) {
  const image = readAdminCms().images?.find((item) => item.key === key);
  return image?.url?.trim() || DEFAULT_PUBLIC_IMAGES[key] || fallback;
}

function getFlavorOverrides() {
  const overrides = readAdminCms().flavors;
  const saved = Array.isArray(overrides) ? overrides : [];
  const savedBySlug = new Map(saved.map((flavor) => [flavor.slug, flavor]));
  const merged = DEFAULT_FLAVOR_SETTINGS.map((flavor) => {
    const override = savedBySlug.get(flavor.slug) || {};
    savedBySlug.delete(flavor.slug);
    return { ...flavor, ...override };
  });
  return [...merged, ...savedBySlug.values()];
}

function mergeFlavor(flavor, index) {
  const override = getFlavorOverrides().find((item) => item.slug === flavor.slug || item.imageKey === flavor.imageKey) || {};
  const ingredientText = override.ingredients || "";
  const ingredients = ingredientText
    ? ingredientText.split(",").map((item) => item.trim()).filter(Boolean)
    : flavor.ingredients;
  return {
    ...flavor,
    profile: override.profile || flavor.profile,
    order: Number.isFinite(Number(override.order)) ? Number(override.order) : index + 1,
    visible: override.visible === false ? false : true,
    image: override.imageUrl?.trim() || getCmsImage(flavor.imageKey, flavor.image),
    angle: override.angle?.trim() || flavor.angle,
    description: override.description?.trim() || flavor.description,
    ingredients,
  };
}

function getMergedFlavors({ includeHidden = false } = {}) {
  const baseSlugs = new Set(flavors.map((flavor) => flavor.slug));
  const customFlavors = getFlavorOverrides()
    .filter((override) => override.slug && !baseSlugs.has(override.slug))
    .map((override, index) => {
      const ingredientText = override.ingredients || "";
      return {
        name: override.name || override.slug,
        slug: override.slug,
        imageKey: override.imageKey || override.slug,
        profile: override.profile || "Frutados",
        color: override.color || "#D9F99D",
        order: Number.isFinite(Number(override.order)) ? Number(override.order) : flavors.length + index + 1,
        visible: override.visible === false ? false : true,
        image: override.imageUrl?.trim() || DEFAULT_PUBLIC_IMAGES.heroBottle,
        ingredients: ingredientText.split(",").map((item) => item.trim()).filter(Boolean),
        angle: override.angle || "",
        description: override.description || override.angle || "",
      };
    });
  return [...flavors.map(mergeFlavor), ...customFlavors]
    .filter((flavor) => includeHidden || flavor.visible)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

function renderFlavorFilters() {
  const activeFilters = Array.from(new Set(getMergedFlavors().map((flavor) => flavor.profile))).filter(Boolean);
  const filters = ["todos", ...FLAVOR_CATEGORIES.filter((category) => activeFilters.includes(category)), ...activeFilters.filter((category) => !FLAVOR_CATEGORIES.includes(category))];
  document.querySelector(".flavor-toolbar .segmented").innerHTML = filters
    .map((filter, index) => {
      const label = filter === "todos" ? "Todos" : filter;
      return `<button class="${index === 0 ? "is-active" : ""}" type="button" data-flavor-filter="${escapeHtml(filter)}">${escapeHtml(label)}</button>`;
    })
    .join("");
}

function getOfficialMapUrl() {
  return readAdminCms().officialMapUrl?.trim() || OFFICIAL_MAP_URL;
}

function getMapIdFromUrl(url) {
  return url.match(/[?&]mid=([^&]+)/)?.[1] || OFFICIAL_MAP_ID;
}

function getOfficialMapViewerUrl() {
  const url = getOfficialMapUrl();
  const mapId = getMapIdFromUrl(url);
  return mapId ? `https://www.google.com/maps/d/viewer?mid=${encodeURIComponent(mapId)}` : url;
}

function getOfficialMapEmbedUrl() {
  return `https://www.google.com/maps/d/embed?mid=${encodeURIComponent(getMapIdFromUrl(getOfficialMapUrl()))}`;
}

function getPublicPartners() {
  try {
    const adminState = readAdminState();
    return (adminState?.partners || [])
      .filter((partner) => partner.visible)
      .map((partner, index) => ({
        name: partner.name,
        type: partner.type || "ponto de venda",
        neighborhood: partner.neighborhood || "Manaus",
        address: partner.address || partner.city || "Manaus",
        hours: partner.hours || "Consulte o parceiro",
        whatsapp: String(partner.whatsapp || "").replace(/\D/g, "") || "5592992097165",
        instagram: partner.instagram || "",
        flavors: String(partner.flavors || "").split(",").map((item) => item.trim()).filter(Boolean),
        pin: [24 + ((index * 17) % 58), 24 + ((index * 13) % 48)],
      }));
  } catch {
    return partners;
  }
}

function applyPublicCms() {
  const cms = readAdminCms();
  const heroImage = document.querySelector(".bottle-stage img");
  if (heroImage) heroImage.src = getCmsImage("heroBottle", heroImage.src);
  if (cms.headline) {
    const lines = cms.headline.split(/\s+/);
    const title = document.querySelector("#hero-title");
    if (title && lines.length > 0) {
      title.textContent = cms.headline;
    }
  }
  if (cms.subheadline) {
    document.querySelector(".hero-copy .lead").textContent = cms.subheadline;
  }
  const mapFrame = document.querySelector("#officialMapFrame");
  if (mapFrame) mapFrame.src = getOfficialMapEmbedUrl();
  document.querySelectorAll("[data-buy-map], [data-buy-whatsapp]").forEach((link) => {
    link.href = getOfficialMapViewerUrl();
    link.target = "_blank";
    link.rel = "noreferrer";
  });
}

function renderBenefits() {
  const grid = document.querySelector("#benefitGrid");
  grid.innerHTML = benefits
    .map(
      ([icon, title, text]) => `
        <article class="benefit-card">
          <span class="material-symbols-outlined" aria-hidden="true">${icon}</span>
          <h3>${title}</h3>
          <p>${text}</p>
        </article>
      `,
    )
    .join("");
}

function renderFlavors(filter = "todos") {
  const grid = document.querySelector("#flavorGrid");
  const visible = filter === "todos" ? getMergedFlavors() : getMergedFlavors().filter((flavor) => flavor.profile === filter);
  grid.innerHTML = visible
    .map((flavor) => {
      return `
        <article class="flavor-card" style="--flavor-color: ${escapeHtml(flavor.color)}">
          <button class="flavor-card-mobile-open" type="button" data-open-flavor="${escapeHtml(flavor.slug)}" aria-label="Ver detalhes e comprar ${escapeHtml(flavor.name)}"></button>
          <div class="flavor-card-media">
            <img src="${escapeHtml(flavor.image)}" alt="Garrafa Kombú sabor ${escapeHtml(flavor.name)}" loading="lazy" />
          </div>
          <div class="flavor-card-body">
            <span class="flavor-kicker">${escapeHtml(flavor.profile)}</span>
            <h3>${escapeHtml(flavor.name)}</h3>
            <p>${escapeHtml(flavor.angle)}</p>
            <div class="flavor-card-actions">
              <button class="btn btn-primary" type="button" data-open-flavor="${escapeHtml(flavor.slug)}">
                <span class="material-symbols-outlined" aria-hidden="true">visibility</span>
                Detalhes
              </button>
              <a class="btn btn-outline" href="${escapeHtml(getOfficialMapViewerUrl())}" target="_blank" rel="noreferrer">
                <span class="material-symbols-outlined" aria-hidden="true">map</span>
                Comprar
              </a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function setFlavorFilter(event) {
  const button = event.target.closest("[data-flavor-filter]");
  if (!button) return;
  document.querySelectorAll("[data-flavor-filter]").forEach((item) => item.classList.remove("is-active"));
  button.classList.add("is-active");
  renderFlavors(button.dataset.flavorFilter);
}

function openFlavor(slug) {
  const flavor = getMergedFlavors({ includeHidden: true }).find((item) => item.slug === slug);
  if (!flavor) return;
  document.querySelector("#flavorModalProfile").textContent = flavor.profile;
  document.querySelector("#flavorModalTitle").textContent = flavor.name;
  document.querySelector("#flavorModalBody").innerHTML = `
    <div class="flavor-detail" style="--flavor-color: ${escapeHtml(flavor.color)}">
      <div class="flavor-detail-media">
        <img src="${escapeHtml(flavor.image)}" alt="Garrafa Kombú sabor ${escapeHtml(flavor.name)}" />
      </div>
      <div>
        <p class="lead">${escapeHtml(flavor.description)}</p>
        <h3>Ingredientes</h3>
        <div class="tag-list">${formatList(flavor.ingredients)}</div>
        <h3 style="margin-top: 18px">Perfil do sabor</h3>
        <p>${escapeHtml(flavor.angle)}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${escapeHtml(getOfficialMapViewerUrl())}" target="_blank" rel="noreferrer">
            <span class="material-symbols-outlined" aria-hidden="true">map</span>
            Comprar este sabor
          </a>
          <a class="btn btn-outline" href="#revenda">
            <span class="material-symbols-outlined" aria-hidden="true">storefront</span>
            Quero revender
          </a>
        </div>
      </div>
    </div>
  `;
  document.querySelector("#flavorModal").classList.add("is-open");
  history.replaceState(null, "", `#sabor-${slug}`);
}

function closeFlavor() {
  document.querySelector("#flavorModal").classList.remove("is-open");
  if (location.hash.startsWith("#sabor-")) {
    history.replaceState(null, "", "#sabores");
  }
}

function partnerTypes() {
  const visiblePartners = getPublicPartners();
  return ["todos", ...Array.from(new Set(visiblePartners.map((partner) => partner.type)))];
}

function neighborhoods() {
  const visiblePartners = getPublicPartners();
  return ["Todos os bairros", ...Array.from(new Set(visiblePartners.map((partner) => partner.neighborhood)))];
}

function renderPartnerFilters() {
  const visiblePartners = getPublicPartners();
  document.querySelector(".locator-toolbar")?.classList.toggle("is-hidden", visiblePartners.length === 0);
  document.querySelector("#typeFilters").innerHTML = partnerTypes()
    .map(
      (type, index) =>
        `<button type="button" class="${index === 0 ? "is-active" : ""}" data-partner-type="${type}">${type}</button>`,
    )
    .join("");
  document.querySelector("#neighborhoodFilter").innerHTML = neighborhoods()
    .map((neighborhood) => `<option value="${neighborhood}">${neighborhood}</option>`)
    .join("");
}

function getPartnerFilterState() {
  const type = document.querySelector("[data-partner-type].is-active")?.dataset.partnerType || "todos";
  const neighborhood = document.querySelector("#neighborhoodFilter").value || "Todos os bairros";
  return { type, neighborhood };
}

function filteredPartners() {
  const { type, neighborhood } = getPartnerFilterState();
  return getPublicPartners().filter((partner) => {
    const typeMatch = type === "todos" || partner.type === type;
    const neighborhoodMatch = neighborhood === "Todos os bairros" || partner.neighborhood === neighborhood;
    return typeMatch && neighborhoodMatch;
  });
}

function renderPartners() {
  const visible = filteredPartners();
  const hasPartners = getPublicPartners().length > 0;
  document.querySelector(".locator-layout")?.classList.toggle("no-partners", !hasPartners);
  const pins = document.querySelector("#mapPins");
  if (pins) pins.innerHTML = visible
    .map(
      (partner) => `
        <span class="map-pin" style="left:${partner.pin[0]}%; top:${partner.pin[1]}%" title="${partner.name}">
          <span class="material-symbols-outlined" aria-hidden="true">storefront</span>
        </span>
      `,
    )
    .join("");
  document.querySelector("#partnerList").innerHTML = visible.length
    ? visible
        .map(
          (partner) => `
            <article class="partner-card">
              <span class="eyebrow">${partner.type} - ${partner.neighborhood}</span>
              <h3>${partner.name}</h3>
              <p>${partner.address}</p>
              <div class="partner-meta">
                <span><span class="material-symbols-outlined" aria-hidden="true">schedule</span> ${partner.hours}</span>
                <span><span class="material-symbols-outlined" aria-hidden="true">local_bar</span> ${partner.flavors.join(", ")}</span>
                <span><span class="material-symbols-outlined" aria-hidden="true">alternate_email</span> ${partner.instagram}</span>
              </div>
              <div class="partner-actions">
                <a class="btn btn-primary" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${partner.name} ${partner.address} Manaus`,
                )}" target="_blank" rel="noreferrer">
                  <span class="material-symbols-outlined" aria-hidden="true">route</span>
                  Ver rota
                </a>
                <a class="btn btn-outline" href="https://api.whatsapp.com/send?phone=${partner.whatsapp}" target="_blank" rel="noreferrer">
                  <span class="material-symbols-outlined" aria-hidden="true">chat</span>
                  WhatsApp
                </a>
              </div>
            </article>
          `,
        )
        .join("")
    : `
      <article class="partner-card partner-card-cta">
        <span class="eyebrow">Mapa oficial</span>
        <h3>Quer comprar Kombú hoje?</h3>
        <p>Abra o mapa oficial para ver os parceiros e pontos de venda cadastrados.</p>
        <div class="partner-actions">
          <a class="btn btn-primary" href="${escapeHtml(getOfficialMapViewerUrl())}" target="_blank" rel="noreferrer">
            <span class="material-symbols-outlined" aria-hidden="true">map</span>
            Abrir mapa
          </a>
          <a class="btn btn-outline" href="#sabores">
            <span class="material-symbols-outlined" aria-hidden="true">local_bar</span>
            Ver sabores
          </a>
        </div>
      </article>
    `;
}

function setPartnerFilter(event) {
  const button = event.target.closest("[data-partner-type]");
  if (!button) return;
  document.querySelectorAll("[data-partner-type]").forEach((item) => item.classList.remove("is-active"));
  button.classList.add("is-active");
  renderPartners();
}

function persistForm(formId, successId, storageKey) {
  const form = document.querySelector(formId);
  const success = document.querySelector(successId);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.dataset.submitting === "true") return;
    form.dataset.submitting = "true";
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.innerHTML || "";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";
    }
    success.classList.add("hidden");
    const data = Object.fromEntries(new FormData(form).entries());
    const type = formId === "#resellerForm" ? "revenda" : "contato";
    const lead = normalizeLead(data, type);
    try {
      const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
      existing.push(lead);
      localStorage.setItem(storageKey, JSON.stringify(existing));
      if (isLocalPreview()) syncLeadToAdminCrm(lead);
      const result = await notifyLeadByEmail(lead);
      if (!result.persisted && !isLocalPreview()) {
        throw new Error("O contato não foi salvo no servidor.");
      }
      success.classList.remove("hidden");
      success.textContent =
        type === "revenda"
          ? "Recebemos seus dados. A Kombú vai retornar pelo contato informado."
          : "Recebemos sua mensagem. A Kombú vai retornar pelo contato informado.";
      form.reset();
    } catch {
      success.classList.remove("hidden");
      success.textContent = "Não foi possível enviar agora. Seus dados continuam preenchidos; tente novamente em instantes.";
    } finally {
      form.dataset.submitting = "false";
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    }
  });
}

function normalizeLead(data, type) {
  return {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    status: "novo",
    source: "site-publico",
    name: data.nome || "",
    business: data.negocio || "",
    businessType: data.tipo || "",
    location: data.bairro || "",
    whatsapp: data.whatsapp || "",
    instagram: data.instagram || "",
    message: data.mensagem || "",
    emailTo: ADMIN_EMAIL,
    createdAt: new Date().toISOString(),
  };
}

function syncLeadToAdminCrm(lead) {
  const state = readLocalAdminState();
  const leads = Array.isArray(state.leads) ? state.leads : [];
  if (!leads.some((item) => item.id === lead.id)) leads.unshift(lead);
  state.leads = leads.slice(0, 200);
  state.notifications = { ...(state.notifications || {}), adminEmail: ADMIN_EMAIL };
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(state));
}

async function notifyLeadByEmail(lead) {
  try {
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead }),
    });
    const payload = await response.json().catch(() => ({}));
    return { ok: response.ok, persisted: false, emailSent: false, ...payload };
  } catch {
    return { ok: false, persisted: false, emailSent: false };
  }
}

function handleHash() {
  document.querySelectorAll(".legal-page").forEach((page) => page.classList.remove("is-visible"));
  if (location.hash === "#privacidade" || location.hash === "#termos") {
    document.querySelector(location.hash)?.classList.add("is-visible");
  }
  if (location.hash.startsWith("#sabor-")) {
    openFlavor(location.hash.replace("#sabor-", ""));
  }
}

async function bootPublicSite() {
  await loadPublicCloudState();
  const currentYear = document.querySelector("#currentYear");
  if (currentYear) currentYear.textContent = new Date().getFullYear();
  applyPublicCms();
  renderBenefits();
  renderFlavorFilters();
  renderFlavors();
  renderPartnerFilters();
  renderPartners();
  document.querySelector(".flavor-toolbar").addEventListener("click", setFlavorFilter);
  document.querySelector("#flavorGrid").addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open-flavor]");
    if (trigger) openFlavor(trigger.dataset.openFlavor);
  });
  document.querySelector("#closeFlavorModal").addEventListener("click", closeFlavor);
  document.querySelector("#flavorModal").addEventListener("click", (event) => {
    if (event.target.id === "flavorModal") closeFlavor();
  });
  document.querySelector("#typeFilters").addEventListener("click", setPartnerFilter);
  document.querySelector("#neighborhoodFilter").addEventListener("change", renderPartners);
  document.querySelector("#menuToggle").addEventListener("click", () => {
    document.querySelector("#publicNav").classList.toggle("is-open");
  });
  document.querySelector("#publicNav").addEventListener("click", () => {
    document.querySelector("#publicNav").classList.remove("is-open");
  });
  persistForm("#resellerForm", "#resellerSuccess", "kombuResellerLeads");
  persistForm("#contactForm", "#contactSuccess", "kombuContactMessages");
  window.addEventListener("hashchange", handleHash);
  handleHash();
}

bootPublicSite();
