const imageBase = "https://static.wixstatic.com/media/";

const flavors = [
  {
    name: "Maracujá",
    slug: "maracuja",
    profile: "Cítrico e marcante",
    color: "#F7D8AD",
    image: `${imageBase}716adf_5b0b2489ee914e53b15b4a590915d974~mv2.png/v1/crop/x_6,y_0,w_1068,h_1920/fill/w_520,h_936,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/4_edited.png`,
    ingredients: ["Maracujá", "chá verde", "fermentação natural"],
    angle: "Refrescância tropical com acidez viva para substituir refrigerantes artificiais.",
    description:
      "A versão mais solar da Kombú: aromática, refrescante e equilibrada, com presença de fruta real e final levemente ácido.",
  },
  {
    name: "Maçã e Canela",
    slug: "maca-canela",
    profile: "Doce e suave",
    color: "#F5CDC3",
    image:
      "https://static.wixstatic.com/media/716adf_673e38f87b0e41bd9972f7b8a5fda104~mv2.png/v1/fill/w_520,h_693,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_6619_edited.png",
    ingredients: ["Maçã", "canela", "chá fermentado"],
    angle: "Conforto aromático, leve dulçor natural e experiência clássica.",
    description:
      "Inspirada em memórias boas, combina a doçura delicada da maçã ao toque aromático da canela.",
  },
  {
    name: "Pêra e Alecrim",
    slug: "pera-alecrim",
    profile: "Doce e suave",
    color: "#D9F99D",
    image: `${imageBase}716adf_2b695c9743c344a2a91acf67ed69ff5f~mv2.png/v1/fill/w_520,h_936,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/6_edited_edited.png`,
    ingredients: ["Pêra", "alecrim", "chá verde"],
    angle: "Suavidade herbal para um gole fresco, leve e gastronômico.",
    description:
      "Uma combinação elegante de fruta e erva, com final aromático e perfil fácil de harmonizar.",
  },
  {
    name: "Frutas Vermelhas",
    slug: "frutas-vermelhas",
    profile: "Doce e suave",
    color: "#F5CDC3",
    image: `${imageBase}716adf_5c8cd66d9eb842a0940b212d250fd255~mv2.png/v1/fill/w_520,h_936,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/IMG_2897_PNG.png`,
    ingredients: ["Morango", "mirtilo", "oxicoco"],
    angle: "Colorida, vibrante e associada a uma rotina mais equilibrada.",
    description:
      "Explosão de frutas com acidez controlada, dulçor natural e presença marcante no copo.",
  },
  {
    name: "Mirtilo e Flor Borboleta Azul",
    slug: "mirtilo-flor-borboleta",
    profile: "Exótico",
    color: "#D8DDFF",
    image: `${imageBase}716adf_8da298261b9a4acd8e9e2264491cee1d~mv2.png/v1/fill/w_520,h_936,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/7.png`,
    ingredients: ["Mirtilo", "flor borboleta azul", "chá fermentado"],
    angle: "Perfil sensorial diferenciado, visual expressivo e proposta premium.",
    description:
      "Um sabor mais autoral, feito para quem quer sair do comum sem perder leveza.",
  },
  {
    name: "Rosas e Cardamomo",
    slug: "rosas-cardamomo",
    profile: "Exótico",
    color: "#E5D7FF",
    image: `${imageBase}716adf_4d2ae2c8e77d48ea8aa11ceffef05be4~mv2.png/v1/fill/w_520,h_936,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/3_edited.png`,
    ingredients: ["Pétalas de rosa", "cardamomo", "chá verde"],
    angle: "Floral, aromático e sofisticado para uma experiência de baixa doçura.",
    description:
      "Uma versão elegante e perfumada, feita para consumo lento e ocasiões especiais.",
  },
  {
    name: "Imunidade",
    slug: "imunidade",
    profile: "Cítrico e marcante",
    color: "#F7D8AD",
    image:
      "https://static.wixstatic.com/media/716adf_c9ac20cf991c4796b8be299c33e22abc~mv2.png/v1/crop/x_62,y_0,w_931,h_1920/fill/w_520,h_1071,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/2.png",
    ingredients: ["Limão", "gengibre", "cúrcuma"],
    angle: "Cítrica, intensa e conectada a uma rotina de cuidado consciente.",
    description:
      "A acidez do limão se une ao calor do gengibre e à potência terrosa da cúrcuma.",
  },
  {
    name: "Hibisco com Anis Estrelado",
    slug: "hibisco-anis-estrelado",
    profile: "Exótico",
    color: "#F5CDC3",
    image: `${imageBase}716adf_4d2ae2c8e77d48ea8aa11ceffef05be4~mv2.png/v1/fill/w_520,h_936,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/3_edited.png`,
    ingredients: ["Hibisco", "anis estrelado", "chá fermentado"],
    angle: "Floral intenso, acidez presente e toque especiado.",
    description:
      "Vibrante e marcante, com hibisco intenso e anis estrelado para uma experiência ousada.",
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

const partners = [
  {
    name: "Empório Amazônia Viva",
    type: "empório",
    neighborhood: "Adrianópolis",
    address: "Av. Umberto Calderaro, 980",
    hours: "Seg a Sáb, 09h às 20h",
    whatsapp: "5592992097165",
    instagram: "@emporioamazoniaviva",
    flavors: ["Maracujá", "Frutas Vermelhas", "Imunidade"],
    pin: [62, 34],
  },
  {
    name: "Solar Café Regional",
    type: "café",
    neighborhood: "Centro",
    address: "Rua Bernardo Ramos, 120",
    hours: "Todos os dias, 08h às 18h",
    whatsapp: "5592992097165",
    instagram: "@solarcaferegional",
    flavors: ["Hibisco com Anis", "Maçã e Canela"],
    pin: [44, 53],
  },
  {
    name: "Studio Corpo Leve",
    type: "academia",
    neighborhood: "Vieiralves",
    address: "Rua Rio Madeira, 440",
    hours: "Seg a Sex, 06h às 21h",
    whatsapp: "5592992097165",
    instagram: "@studiocorpoleve",
    flavors: ["Imunidade", "Pêra e Alecrim"],
    pin: [53, 41],
  },
  {
    name: "Mercado Natural Ponta Negra",
    type: "mercado",
    neighborhood: "Ponta Negra",
    address: "Av. Coronel Teixeira, 4300",
    hours: "Seg a Sáb, 10h às 21h",
    whatsapp: "5592992097165",
    instagram: "@mercadonaturalpn",
    flavors: ["Maracujá", "Mirtilo", "Frutas Vermelhas"],
    pin: [28, 24],
  },
  {
    name: "Folha Restaurante",
    type: "restaurante",
    neighborhood: "Nossa Senhora das Graças",
    address: "Rua Pará, 620",
    hours: "Ter a Dom, 11h às 23h",
    whatsapp: "5592992097165",
    instagram: "@folharestaurante",
    flavors: ["Rosas e Cardamomo", "Hibisco"],
    pin: [58, 48],
  },
];

const formatList = (items) => items.map((item) => `<span class="tag">${item}</span>`).join("");

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
    .map(
      (flavor) => `
        <article class="flavor-card" style="background: linear-gradient(180deg, ${flavor.color}66 0%, #fff 58%);">
          <div class="flavor-card-media">
            <img src="${flavor.image}" alt="Garrafa Kombú sabor ${flavor.name}" loading="lazy" />
          </div>
          <div class="flavor-card-body">
            <span class="eyebrow">${flavor.profile}</span>
            <h3>${flavor.name}</h3>
            <p>${flavor.angle}</p>
            <div class="tag-list">${formatList(flavor.ingredients)}</div>
            <div class="flavor-card-actions">
              <button class="btn btn-primary" type="button" data-open-flavor="${flavor.slug}">
                <span class="material-symbols-outlined" aria-hidden="true">visibility</span>
                Detalhes
              </button>
              <a class="btn btn-outline" href="#onde-encontrar">
                <span class="material-symbols-outlined" aria-hidden="true">location_on</span>
                Onde encontrar
              </a>
            </div>
          </div>
        </article>
      `,
    )
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
        <img src="${flavor.image}" alt="Garrafa Kombú sabor ${flavor.name}" />
      </div>
      <div>
        <p class="lead">${flavor.description}</p>
        <h3>Ingredientes</h3>
        <div class="tag-list">${formatList(flavor.ingredients)}</div>
        <h3 style="margin-top: 24px">Ângulo funcional</h3>
        <p>${flavor.angle} A Kombú evita promessas médicas e posiciona o produto como parte de uma rotina equilibrada.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#onde-encontrar">
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
  return ["todos", ...Array.from(new Set(partners.map((partner) => partner.type)))];
}

function neighborhoods() {
  return ["Todos os bairros", ...Array.from(new Set(partners.map((partner) => partner.neighborhood)))];
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
  return partners.filter((partner) => {
    const typeMatch = type === "todos" || partner.type === type;
    const neighborhoodMatch = neighborhood === "Todos os bairros" || partner.neighborhood === neighborhood;
    return typeMatch && neighborhoodMatch;
  });
}

function renderPartners() {
  const visible = filteredPartners();
  document.querySelector("#mapPins").innerHTML = visible
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
    : `<p class="empty-note">Nenhum parceiro encontrado com esses filtros.</p>`;
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
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    existing.push({ ...data, createdAt: new Date().toISOString() });
    localStorage.setItem(storageKey, JSON.stringify(existing));
    success.classList.remove("hidden");
    form.reset();
  });
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
