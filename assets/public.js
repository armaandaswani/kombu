const menuBottleBase = "assets/menu-bottles/";
const ADMIN_STORAGE_KEY = "kombuAdminStateV3";
const LEGACY_ADMIN_STORAGE_KEYS = ["kombuAdminStateV2"];
const ADMIN_EMAIL = "armaandaswani@icloud.com";
const OFFICIAL_MAP_ID = "1Zn4OECfeuJkhDkCj6noQKZDeLgOUbn8";
const OFFICIAL_MAP_URL = `https://www.google.com/maps/d/viewer?mid=${OFFICIAL_MAP_ID}`;

const flavors = [
  {
    name: "Goiaba",
    slug: "goiaba",
    imageKey: "goiaba",
    profile: "Frutados",
    color: "#F5CDC3",
    image: `${menuBottleBase}goiaba.png`,
    ingredients: ["Goiaba", "chá fermentado", "vitamina C"],
    angle: "Naturalmente rica em vitamina C, nutritiva e refrescante.",
    description: "É naturalmente rica em vitamina C e traz uma proposta nutritiva e refrescante.",
  },
  {
    name: "Uva",
    slug: "uva",
    imageKey: "uva",
    profile: "Frutados",
    color: "#E5D7FF",
    image: `${menuBottleBase}uva.png`,
    ingredients: ["Uva", "chá fermentado", "antioxidantes"],
    angle: "Encorpada, levemente adocicada e associada à vitalidade.",
    description: "Encorpado e levemente adocicado, traz antioxidantes naturais associados à vitalidade e proteção celular.",
  },
  {
    name: "Maracujá",
    slug: "maracuja",
    imageKey: "maracuja",
    profile: "Frutados",
    color: "#F7D8AD",
    image: `${menuBottleBase}maracuja.png`,
    ingredients: ["Maracujá", "chá fermentado", "bem-estar"],
    angle: "Tropical, refrescante e associado à sensação de calma.",
    description: "Tropical e refrescante, com uma proposta mais leve e associada à sensação de calma e bem-estar.",
  },
  {
    name: "Rosas & Cardamomo",
    slug: "rosas-cardamomo",
    imageKey: "rosasCardamomo",
    profile: "Florais",
    color: "#F5CDC3",
    image: `${menuBottleBase}rosas-cardamomo.png`,
    ingredients: ["Rosas", "cardamomo", "chá verde"],
    angle: "Floral, elegante e associado à digestão e conforto.",
    description: "Floral e elegante, traz o cardamomo como destaque, associado à digestão e sensação de conforto.",
  },
  {
    name: "Pêra & Alecrim",
    slug: "pera-alecrim",
    imageKey: "peraAlecrim",
    profile: "Herbais",
    color: "#D9F99D",
    image: `${menuBottleBase}pera-alecrim.png`,
    ingredients: ["Pêra", "alecrim", "chá verde"],
    angle: "Leve, herbal e associada à digestão e clareza mental.",
    description: "Leve e herbal, une o frescor da pêra ao alecrim, associado à digestão e clareza mental.",
  },
  {
    name: "Hibisco & Anis Estrelado",
    slug: "hibisco-anis-estrelado",
    imageKey: "hibisco",
    profile: "Florais",
    color: "#F5CDC3",
    image: `${menuBottleBase}hibisco-anis.png`,
    ingredients: ["Hibisco", "anis estrelado", "chá fermentado"],
    angle: "Perfil detox, diurético e com sensação de leveza.",
    description: "Tem sabor com proposta mais detox, associado à ação diurética e sensação de leveza.",
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
    description: "Cítrico, floral e refrescante, une a lavanda associada ao relaxamento com o frescor natural do limão.",
  },
  {
    name: "Frutas Vermelhas",
    slug: "frutas-vermelhas",
    imageKey: "frutasVermelhas",
    profile: "Frutados",
    color: "#F5CDC3",
    image: `${menuBottleBase}frutas-vermelhas.png`,
    ingredients: ["Morango", "mirtilo", "oxicoco"],
    angle: "Frutado, levemente ácido e rico em antioxidantes naturais.",
    description: "Frutado e levemente ácido, é rico em antioxidantes naturais associados à vitalidade e proteção celular.",
  },
  {
    name: "Imunidade",
    slug: "imunidade",
    imageKey: "imunidade",
    profile: "Cítricos",
    color: "#F7D8AD",
    image: `${menuBottleBase}imunidade.png`,
    ingredients: ["Limão", "gengibre", "cúrcuma"],
    angle: "Cítrica e intensa, com ingredientes associados à vitamina C.",
    description: "Feito com limão, gengibre e cúrcuma, combina ingredientes associados à vitamina C, vitalidade e proteção natural.",
  },
  {
    name: "Flor Fada Azul & Blueberry",
    slug: "flor-fada-azul-blueberry",
    imageKey: "mirtilo",
    profile: "Florais",
    color: "#D8DDFF",
    image: `${menuBottleBase}flor-fada-blueberry.png`,
    ingredients: ["Flor fada azul", "blueberry", "chá fermentado"],
    angle: "Delicado, visualmente único e associado à ação antioxidante.",
    description: "Delicado e visualmente único, combina ingredientes associados à ação antioxidante e bem-estar.",
  },
  {
    name: "Jasmim & Manga",
    slug: "jasmim-manga",
    imageKey: "jasmimManga",
    profile: "Frutados",
    color: "#F7D8AD",
    image: `${menuBottleBase}jasmim-manga.png`,
    ingredients: ["Jasmim", "manga", "chá fermentado"],
    angle: "Doce, tropical, vibrante e naturalmente energético.",
    description: "Doce, tropical e vibrante, traz uma proposta naturalmente energética e rica em frescor.",
  },
  {
    name: "Maçã & Canela",
    slug: "maca-canela",
    imageKey: "macaCanela",
    profile: "Herbais",
    color: "#F5CDC3",
    image: `${menuBottleBase}maca-canela.png`,
    ingredients: ["Maçã", "canela", "chá fermentado"],
    angle: "Aromática, acolhedora e associada ao equilíbrio metabólico.",
    description: "Aromático e acolhedor, traz a canela como destaque, associada ao equilíbrio metabólico.",
  },
];

const benefits = [
  ["biotech", "Probiótica", "Pode contribuir para uma rotina alimentar mais equilibrada."],
  ["restaurant", "Digestiva", "Ajuda a compor um ritual leve depois das refeições."],
  ["water_drop", "Detox", "Associada a escolhas mais naturais e conscientes no dia a dia."],
  ["local_fire_department", "Baixa em calorias", "Uma alternativa mais leve aos refrigerantes tradicionais."],
  ["gluten_free", "Sem glúten", "Boa opção para diferentes estilos de alimentação."],
  ["spa", "Vegana", "Feita sem ingredientes de origem animal."],
  ["nutrition", "Ingredientes reais", "Frutas, ervas, especiarias e pétalas na saborização."],
  ["verified", "Sem aditivos artificiais", "Sem corantes, conservantes ou atalhos industriais."],
  ["forest", "Produto da Amazônia", "Marca criada em Manaus com identidade local."],
];

const partners = [];

const formatList = (items) => items.map((item) => `<span class="tag">${item}</span>`).join("");

function readAdminState() {
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY) || LEGACY_ADMIN_STORAGE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function readAdminCms() {
  return readAdminState().cms || {};
}

function getCmsImage(key, fallback) {
  const image = readAdminCms().images?.find((item) => item.key === key);
  return image?.url?.trim() || fallback;
}

function getOfficialMapUrl() {
  return readAdminCms().officialMapUrl?.trim() || OFFICIAL_MAP_URL;
}

function getMapIdFromUrl(url) {
  return url.match(/[?&]mid=([^&]+)/)?.[1] || OFFICIAL_MAP_ID;
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
  const visible = filter === "todos" ? flavors : flavors.filter((flavor) => flavor.profile === filter);
  grid.innerHTML = visible
    .map((flavor) => {
      const imageUrl = getCmsImage(flavor.imageKey, flavor.image);
      return `
        <article class="flavor-card">
          <div class="flavor-card-media">
            <img src="${imageUrl}" alt="Garrafa Kombú sabor ${flavor.name}" loading="lazy" />
          </div>
          <div class="flavor-card-body">
            <h3>${flavor.name}</h3>
            <p>${flavor.angle}</p>
            <div class="flavor-card-actions">
              <button class="btn btn-primary" type="button" data-open-flavor="${flavor.slug}">
                <span class="material-symbols-outlined" aria-hidden="true">visibility</span>
                Detalhes
              </button>
              <a class="btn btn-outline" href="${getOfficialMapUrl()}" target="_blank" rel="noreferrer">
                <span class="material-symbols-outlined" aria-hidden="true">location_on</span>
                Onde encontrar
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
  const flavor = flavors.find((item) => item.slug === slug);
  if (!flavor) return;
  document.querySelector("#flavorModalProfile").textContent = flavor.profile;
  document.querySelector("#flavorModalTitle").textContent = flavor.name;
  document.querySelector("#flavorModalBody").innerHTML = `
    <div class="flavor-detail">
      <div class="flavor-detail-media" style="background: ${flavor.color}66">
        <img src="${getCmsImage(flavor.imageKey, flavor.image)}" alt="Garrafa Kombú sabor ${flavor.name}" />
      </div>
      <div>
        <p class="lead">${flavor.description}</p>
        <h3>Ingredientes</h3>
        <div class="tag-list">${formatList(flavor.ingredients)}</div>
        <h3 style="margin-top: 24px">Ângulo funcional</h3>
        <p>${flavor.angle} A Kombú evita promessas médicas e posiciona o produto como parte de uma rotina equilibrada.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${getOfficialMapUrl()}" target="_blank" rel="noreferrer">
            <span class="material-symbols-outlined" aria-hidden="true">near_me</span>
            Onde encontrar
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
      <article class="partner-card">
        <span class="eyebrow">Mapa oficial</span>
        <h3>Veja onde comprar Kombú</h3>
        <p>Os pontos de venda serão controlados pelo admin. Por enquanto, use o mapa oficial para comprar ou encontrar a Kombú.</p>
        <div class="partner-actions">
          <a class="btn btn-primary" href="${getOfficialMapUrl()}" target="_blank" rel="noreferrer">
            <span class="material-symbols-outlined" aria-hidden="true">map</span>
            Abrir mapa
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
    const data = Object.fromEntries(new FormData(form).entries());
    const type = formId === "#resellerForm" ? "revenda" : "contato";
    const lead = normalizeLead(data, type);
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    existing.push(lead);
    localStorage.setItem(storageKey, JSON.stringify(existing));
    syncLeadToAdminCrm(lead);
    const notification = await notifyLeadByEmail(lead);
    success.classList.remove("hidden");
    success.textContent = notification.emailSent
      ? "Lead enviado para o CRM do admin. Notificação enviada para armaandaswani@icloud.com."
      : "Lead enviado para o CRM do admin. A notificação por email será ativada no Vercel com RESEND_API_KEY.";
    form.reset();
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
  const state = readAdminState();
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
    if (!response.ok) return { emailSent: false };
    return response.json();
  } catch {
    return { emailSent: false };
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

function bootPublicSite() {
  applyPublicCms();
  renderBenefits();
  renderFlavors();
  renderPartnerFilters();
  renderPartners();
  document.querySelector(".flavor-toolbar").addEventListener("click", setFlavorFilter);
  document.querySelector("#flavorGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-flavor]");
    if (button) openFlavor(button.dataset.openFlavor);
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
