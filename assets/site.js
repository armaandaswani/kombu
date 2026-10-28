// Kombú public site. Serves "/" (para consumo próprio), "/revenda" (para revenda) and "/legal".
// Replaces public.js. The data layer is carried over unchanged in behaviour: content still comes
// from the admin through /api/public-state (flavour order, visibility, texts and images, partners,
// WhatsApp, announcement), and both forms still post to /api/lead.
(() => {
  "use strict";

  const page = document.body.dataset.page || "consumer";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (!reduceMotion) document.documentElement.classList.add("js-motion");

  const ADMIN_EMAIL = "armaandaswani@icloud.com";
  const DEFAULT_WHATSAPP = "5592992097165";
  const OFFICIAL_MAP_URL = "https://www.google.com/maps/d/viewer?mid=1Zn4OECfeuJkhDkCj6noQKZDeLgOUbn8";

  // ------------------------------------------------------------ flavours
  // Base catalogue. The admin can override order, visibility, family, texts, ingredients and image
  // for each of these, and add new flavours of its own.
  const FLAVORS = [
    { slug: "maracuja", name: "Maracujá", imageKey: "maracuja", profile: "Frutados", ingredients: ["Maracujá", "chá verde"], angle: "Tropical, ácida e refrescante.", description: "Polpa de maracujá de verdade, com as sementes." },
    { slug: "frutas-vermelhas", name: "Frutas Vermelhas", imageKey: "frutasVermelhas", profile: "Frutados", ingredients: ["Morango", "blueberry", "oxicoco"], angle: "Frutada, vibrante e equilibrada.", description: "Morango, blueberry e oxicoco num perfil frutado e levemente ácido." },
    { slug: "hibisco-anis-estrelado", name: "Hibisco & Anis Estrelado", imageKey: "hibisco", profile: "Florais", ingredients: ["Hibisco", "anis estrelado", "chá verde"], angle: "Floral, acidulada e aromática.", description: "O hibisco traz a cor e a acidez. O anis estrelado, o perfume." },
    { slug: "flor-fada-azul-blueberry", name: "Flor Fada Azul & Blueberry", imageKey: "mirtilo", profile: "Florais", ingredients: ["Flor fada azul", "blueberry", "chá verde"], angle: "Floral e frutada.", description: "A cor vem da flor e da fruta. Nenhum corante." },
    { slug: "maca-canela", name: "Maçã & Canela", imageKey: "macaCanela", profile: "Especiados", ingredients: ["Maçã", "canela em pau", "chá verde"], angle: "Aconchegante, frutada e especiada.", description: "Maçã e canela em pau sobre uma base de chá verde fermentado." },
    { slug: "pera-alecrim", name: "Pêra & Alecrim", imageKey: "peraAlecrim", profile: "Herbais", ingredients: ["Pêra", "alecrim", "chá verde"], angle: "Delicada, herbal e aromática.", description: "O frescor da pêra com o aroma do alecrim." },
    { slug: "imunidade", name: "Imunidade", imageKey: "imunidade", profile: "Cítricos", ingredients: ["Limão", "gengibre", "cúrcuma"], angle: "Cítrica, picante e terrosa.", description: "Limão, gengibre e cúrcuma: cítrica, com a picância do gengibre." },
    { slug: "rosas-cardamomo", name: "Rosas & Cardamomo", imageKey: "rosasCardamomo", profile: "Florais", ingredients: ["Rosas", "cardamomo", "chá verde"], angle: "Floral e levemente especiada.", description: "Pétalas de rosa e o toque especiado do cardamomo." },
    { slug: "lavanda-limao", name: "Lavanda & Limão", imageKey: "lavandaLimao", profile: "Cítricos", ingredients: ["Lavanda", "limão", "chá verde"], angle: "Cítrica à frente, floral no fim.", description: "O limão abre. A lavanda fica." },
    { slug: "jasmim-manga", name: "Manga & Jasmim", imageKey: "jasmimManga", profile: "Frutados", ingredients: ["Manga", "jasmim", "chá verde"], angle: "Tropical, perfumada e floral.", description: "Manga madura com o perfume do jasmim." },
    { slug: "goiaba", name: "Goiaba", imageKey: "goiaba", profile: "Frutados", ingredients: ["Goiaba", "chá verde"], angle: "Tropical e naturalmente frutada.", description: "Goiaba de verdade, suave e refrescante." },
    { slug: "uva", name: "Uva", imageKey: "uva", profile: "Frutados", ingredients: ["Uva", "chá verde"], angle: "Frutada, encorpada e refrescante.", description: "Uva de verdade, encorpada e refrescante." },
  ];

  // Each bottle's label colour, tuned for a full-screen background (same values as the Instagram
  // posts, so the feed and the site read as one brand). "light" = cream type on a deep ground.
  const COLORS = {
    "uva": ["#4A2352", "light"], "goiaba": ["#D9535F", "light"], "maracuja": ["#EDB43E", "dark"],
    "rosas-cardamomo": ["#E3889E", "dark"], "pera-alecrim": ["#C2D371", "dark"], "hibisco-anis-estrelado": ["#D63E79", "light"],
    "lavanda-limao": ["#8277AE", "light"], "frutas-vermelhas": ["#7A1A2B", "light"], "imunidade": ["#CF6526", "light"],
    "flor-fada-azul-blueberry": ["#3A2147", "light"], "jasmim-manga": ["#F2C46E", "dark"], "maca-canela": ["#A9351F", "light"],
  };
  const MODES = {
    light: { fg: "#FFF7ED", fg2: "rgba(255,247,237,.8)", acc: "#F4D58D" },
    dark: { fg: "#1C2418", fg2: "rgba(28,36,24,.74)", acc: "#2D4B28" },
  };

  // The photos uploaded through the admin before this redesign are ~1.1 MB PNGs; twelve of them
  // would put 13 MB on a phone. The same photos ship here as ~140 KB WebP. A known upload is served
  // from the bundled copy; anything uploaded later is used as-is, so the admin stays in control.
  const KNOWN_UPLOADS = [
    "flavor/flor-fada-azul-blueberry/1783052090837-14.png", "flavor/frutas-vermelhas/1783052071258-12.png",
    "flavor/goiaba/1783052434858-6.png", "flavor/hibisco-anis-estrelado/1783052081529-10.png",
    "flavor/imunidade/1783052361703-13.png", "flavor/jasmim-manga/1783052410423-15.png",
    "flavor/lavanda-limao/1783052397710-11.png", "flavor/maca-canela/1783052100339-16.png",
    "flavor/maracuja/1783052064398-7.png", "flavor/pera-alecrim/1783052204845-9.png",
    "flavor/rosas-cardamomo/1783052376051-8.png", "flavor/uva/1783052460721-5.png",
    "image/frutasvermelhas/1783052001519-12.png", "image/herobottle/1783051786100-11.png",
    "image/hibisco/1783052039306-10.png", "image/imunidade/1783051813870-13.png",
    "image/macacanela/1783051823665-16.png", "image/maracuja/1783051805979-7.png",
    "image/mirtilo/1783052008038-14.png", "image/peraalecrim/1783051938726-9.png",
    "image/rosascardamomo/1783052015640-8.png",
  ];
  const bundled = (slug) => (COLORS[slug] ? `/assets/bottles/${slug}.webp` : "");

  // ------------------------------------------------------------ helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  const ICONS = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    glass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10l-1.2 15.2a2 2 0 0 1-2 1.8h-3.6a2 2 0 0 1-2-1.8z"/><path d="M7.5 9h9"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    route: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z"/></svg>',
  };

  // ------------------------------------------------------------ admin content
  let cloud = {};
  async function loadState() {
    try {
      const response = await fetch("/api/public-state", { credentials: "same-origin" });
      if (!response.ok) return;
      const payload = await response.json();
      if (payload.state) cloud = payload.state;
    } catch {
      cloud = {};
    }
  }
  const cms = () => cloud.cms || {};

  function whatsappNumber() {
    const digits = String(cms().whatsapp || "").replace(/\D/g, "");
    if (digits.length >= 12) return digits;
    if (digits.length >= 10) return `55${digits}`;
    return DEFAULT_WHATSAPP;
  }
  const whatsappUrl = (message) => `https://api.whatsapp.com/send?phone=${whatsappNumber()}&text=${encodeURIComponent(message)}`;

  function cmsImage(key) {
    return cms().images?.find((item) => item.key === key)?.url?.trim() || "";
  }
  function resolveBottle(slug, url) {
    const clean = String(url || "").trim();
    // The admin's own defaults point at 150px thumbnails in assets/menu-bottles/; on a full-screen
    // stage those would show blurred, so they count as "no custom image" too.
    const isDefault = !clean || clean.includes("menu-bottles/") || KNOWN_UPLOADS.some((path) => clean.endsWith(path));
    if (!isDefault) return clean;
    return bundled(slug) || clean;
  }

  function flavorOverrides() {
    const saved = Array.isArray(cms().flavors) ? cms().flavors : [];
    return new Map(saved.filter((item) => item && item.slug).map((item) => [item.slug, item]));
  }

  function mergedFlavors() {
    const overrides = flavorOverrides();
    const base = FLAVORS.map((flavor, index) => {
      const o = overrides.get(flavor.slug) || {};
      overrides.delete(flavor.slug);
      const ingredients = o.ingredients ? String(o.ingredients).split(",").map((s) => s.trim()).filter(Boolean) : flavor.ingredients;
      return {
        ...flavor,
        profile: o.profile || flavor.profile,
        order: Number.isFinite(Number(o.order)) ? Number(o.order) : index + 1,
        visible: o.visible !== false,
        angle: String(o.angle || "").trim() || flavor.angle,
        description: String(o.description || "").trim() || flavor.description,
        ingredients,
        image: resolveBottle(flavor.slug, o.imageUrl || cmsImage(flavor.imageKey)),
      };
    });
    // Flavours created in the admin that are not in the base catalogue.
    const custom = [...overrides.values()].map((o, index) => ({
      slug: o.slug,
      name: o.name || o.slug,
      profile: o.profile || "Frutados",
      order: Number.isFinite(Number(o.order)) ? Number(o.order) : FLAVORS.length + index + 1,
      visible: o.visible !== false,
      angle: o.angle || "",
      description: o.description || o.angle || "",
      ingredients: String(o.ingredients || "").split(",").map((s) => s.trim()).filter(Boolean),
      image: String(o.imageUrl || "").trim(),
      color: o.color,
    }));
    return [...base, ...custom]
      .filter((flavor) => flavor.visible && flavor.image)
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  }

  function palette(flavor) {
    const [bg, mode] = COLORS[flavor.slug] || [flavor.color || "#2D4B28", "light"];
    return { bg, ...MODES[mode] };
  }

  // ------------------------------------------------------------ partners
  // Partner flavour lists are typed by hand in the admin ("Maçã c/Canela", "Mirtilo c/Flor
  // Borboleta Azul"...). Mapped back onto the canonical names; unplaceable text is shown as typed.
  function tokens(value) {
    return String(value || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/\bc\//g, " ").replace(/[^a-z0-9]+/g, " ").split(" ")
      .filter((w) => w.length > 2 && !["com", "e", "de", "da", "do"].includes(w));
  }
  function canonicalFlavorName(value) {
    const typed = tokens(value);
    if (!typed.length) return String(value || "").trim();
    let best = null;
    let bestScore = 0;
    FLAVORS.forEach((flavor) => {
      const known = tokens(flavor.name);
      const score = known.filter((w) => typed.includes(w)).length / known.length;
      if (score > bestScore) { bestScore = score; best = flavor.name; }
    });
    return bestScore >= 0.5 ? best : String(value || "").trim();
  }

  // Solar Café Regional is an active partner, but the owner's last choice of where to send people
  // (2026-10-24). It is listed after everyone else rather than hidden.
  const LISTED_LAST = [/solar\s*caf/i];

  function partners() {
    const list = (cloud.partners || []).map((p, index) => ({
      index,
      name: p.name || "",
      neighborhood: p.neighborhood || "",
      address: p.address || "",
      city: p.city || "Manaus",
      hours: p.hours || "",
      whatsapp: String(p.whatsapp || "").replace(/\D/g, ""),
      instagram: String(p.instagram || "").trim(),
      flavors: [...new Set(String(p.flavors || "").split(",").map((s) => canonicalFlavorName(s.trim())).filter(Boolean))],
    })).filter((p) => p.name);
    const rank = (p) => (LISTED_LAST.some((re) => re.test(p.name)) ? 1 : 0);
    return list.sort((a, b) => rank(a) - rank(b) || a.index - b.index);
  }

  const instagramUrl = (handle) => `https://www.instagram.com/${encodeURIComponent(handle.replace(/^@/, ""))}/`;
  const routeUrl = (p) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([p.name, p.address || p.neighborhood, p.city].filter(Boolean).join(", "))}`;

  // ------------------------------------------------------------ announcement
  function renderAnnouncement() {
    const text = String(cms().announcement || "").trim();
    if (!text) return;
    const bar = document.createElement("div");
    bar.className = "announce";
    bar.textContent = text;
    document.body.prepend(bar);
  }

  // ------------------------------------------------------------ hero (consumer)
  function initHero(flavors) {
    const stage = $("#heroStage");
    if (!stage || !flavors.length) return;
    const holder = $(".hero-bottle", stage);
    const dots = $(".hero-dots", stage.parentElement) || $(".hero-dots");
    const nowName = $("#heroNow");
    const sub = $("#heroSub");
    const lead = $("#heroLead");
    if (sub && String(cms().headline || "").trim()) sub.textContent = cms().headline.trim();
    if (lead && String(cms().subheadline || "").trim()) lead.textContent = cms().subheadline.trim();

    holder.innerHTML = flavors.map((f, i) => `<img src="${esc(f.image)}" alt="Garrafa Kombú ${esc(f.name)}" width="533" height="1600" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">`).join("");
    dots.innerHTML = flavors.map((f, i) => `<button type="button" aria-label="Ver ${esc(f.name)}" aria-pressed="${i === 0}" data-i="${i}"></button>`).join("");
    const imgs = $$("img", holder);
    let current = -1;
    let timer = null;
    let pausedUntil = 0;

    function show(i) {
      if (i === current) return;
      current = (i + flavors.length) % flavors.length;
      imgs.forEach((img, n) => img.classList.toggle("is-on", n === current));
      $$("button", dots).forEach((b, n) => b.setAttribute("aria-pressed", String(n === current)));
      stage.style.setProperty("--glow", palette(flavors[current]).bg);
      if (nowName) nowName.textContent = flavors[current].name;
    }
    show(0);
    // The visitor can browse the flavours here too: dots, arrows, a tap on the bottle, or a swipe.
    // Any of them pauses the rotation for a while so it doesn't move on under the visitor's finger.
    const pick = (i) => { show(i); pausedUntil = Date.now() + 9000; };
    // A pointer resting on the bottles holds the rotation, so it never changes under the cursor.
    stage.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") pausedUntil = Infinity; });
    stage.addEventListener("pointerleave", (event) => { if (event.pointerType === "mouse") pausedUntil = Date.now() + 1500; });
    dots.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-i]");
      if (button) pick(Number(button.dataset.i));
    });
    $(".hero-arrow.prev", stage)?.addEventListener("click", () => pick(current - 1));
    $(".hero-arrow.next", stage)?.addEventListener("click", () => pick(current + 1));
    holder.addEventListener("click", () => pick(current + 1));
    let touchX = null;
    holder.addEventListener("touchstart", (event) => { touchX = event.touches[0].clientX; }, { passive: true });
    holder.addEventListener("touchend", (event) => {
      if (touchX === null) return;
      const dx = event.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 40) pick(current + (dx < 0 ? 1 : -1));
    });
    if (reduceMotion) return;
    const tick = () => { if (Date.now() > pausedUntil && !document.hidden) show(current + 1); };
    const visible = new IntersectionObserver(([entry]) => {
      clearInterval(timer);
      if (entry.isIntersecting) timer = setInterval(tick, 2700);
    });
    visible.observe(stage);

    if (finePointer) {
      stage.addEventListener("pointermove", (event) => {
        const r = stage.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width - 0.5;
        const y = (event.clientY - r.top) / r.height - 0.5;
        holder.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 8}deg)`;
      });
      stage.addEventListener("pointerleave", () => { holder.style.transform = ""; });
      holder.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)";
    }
    initBubbles(stage);
  }

  // Natural carbonation is one of the things that sets Kombú apart, so the hero shows it: small
  // bubbles rising behind the bottle. Paused off-screen, in background tabs and for reduced motion.
  function initBubbles(stage) {
    const canvas = $(".bubbles", stage);
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1, running = false, raf = 0;
    const bubbles = [];
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(initial) {
      return {
        x: w * (0.18 + Math.random() * 0.64),
        y: initial ? Math.random() * h : h + 10,
        r: 1.6 + Math.random() * 5.2,
        v: 0.25 + Math.random() * 0.7,
        p: Math.random() * Math.PI * 2,
        a: 0.18 + Math.random() * 0.32,
      };
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const b of bubbles) {
        b.y -= b.v; b.p += 0.025;
        const x = b.x + Math.sin(b.p) * 6;
        if (b.y < -12) Object.assign(b, spawn(false));
        ctx.beginPath();
        ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,247,237,${b.a})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${b.a * 0.9})`;
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(frame);
    }
    function start() { if (!running && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } }
    function stop() { running = false; cancelAnimationFrame(raf); }
    size();
    for (let i = 0; i < 30; i++) bubbles.push(spawn(true));
    window.addEventListener("resize", size, { passive: true });
    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(stage);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  }

  // ------------------------------------------------------------ marquee
  function initMarquee(flavors) {
    const track = $(".marquee-track");
    if (!track) return;
    const words = [...new Set(["chá verde", ...flavors.flatMap((f) => f.ingredients.map((i) => i.toLowerCase()))])].filter((w) => w !== "chá fermentado");
    const run = words.map((w) => `<span>${esc(w)}</span>`).join("");
    track.innerHTML = run + run; // twice, so the -50% loop is seamless
  }

  // ------------------------------------------------------------ flavour walk
  function initWalk(flavors) {
    const walk = $(".walk");
    if (!walk || !flavors.length) return;
    const stage = $(".walk-stage", walk);
    const steps = $(".walk-steps", walk);
    const bottle = $(".walk-bottle", walk);
    const rail = $(".walk-rail", walk);
    const srList = $("#flavorList");
    steps.innerHTML = flavors.map((f, i) => `<div class="walk-step" id="sabor-${esc(f.slug)}" data-i="${i}" aria-hidden="true"></div>`).join("");
    // Same files as the hero, so they are usually cached by the time the visitor gets here.
    bottle.innerHTML = flavors.map((f) => `<img src="${esc(f.image)}" alt="" width="533" height="1600" decoding="async">`).join("");
    rail.innerHTML = flavors.map((f, i) => `<button type="button" style="--sw:${palette(f).bg}" aria-label="Ver sabor ${esc(f.name)}" title="${esc(f.name)}" aria-controls="flavorStage" data-i="${i}"></button>`).join("");
    stage.id = "flavorStage";
    rail.setAttribute("aria-label", "Escolher sabor");
    $$("img", bottle).forEach((img) => { img.draggable = false; });
    if (srList) srList.innerHTML = flavors.map((f) => `<li>${esc(f.name)}: ${esc(f.angle)} ${esc(f.ingredients.join(", "))}.</li>`).join("");
    const imgs = $$("img", bottle);
    const stepEls = $$(".walk-step", steps);
    let current = -1;

    function show(i) {
      if (i === current || i < 0 || i >= flavors.length) return;
      current = i;
      const f = flavors[i];
      const c = palette(f);
      stage.style.setProperty("--c", c.bg);
      stage.style.setProperty("--sfg", c.fg);
      stage.style.setProperty("--sfg2", c.fg2);
      stage.style.setProperty("--acc", c.acc);
      stage.style.setProperty("--p", `${((i + 1) / flavors.length) * 100}%`);
      $(".walk-count", stage).textContent = `${String(i + 1).padStart(2, "0")} / ${String(flavors.length).padStart(2, "0")}`;
      $(".walk-family", stage).textContent = f.profile;
      $(".walk-name", stage).textContent = f.name;
      $(".walk-angle", stage).textContent = f.angle;
      $(".walk-desc", stage).textContent = f.description;
      $(".walk-ing", stage).innerHTML = f.ingredients.map((x) => `<li>${esc(x)}</li>`).join("");
      imgs.forEach((img, n) => img.classList.toggle("is-on", n === i));
      $$("button", rail).forEach((b, n) => b.setAttribute("aria-current", String(n === i)));
    }
    show(0);

    // The flavour on stage is whichever step spans the middle of the screen, read on each scroll
    // frame. An IntersectionObserver on a zero-height line was tried first: it lagged and skipped
    // flavours under fast scrolling, and Safari is inconsistent with zero-area roots.
    let queued = false;
    function sync() {
      queued = false;
      const box = walk.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return;
      const mid = window.innerHeight / 2;
      for (let n = 0; n < stepEls.length; n++) {
        const r = stepEls[n].getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) { show(n); return; }
      }
    }
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(sync); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    sync();

    rail.addEventListener("click", (event) => {
      const b = event.target.closest("button[data-i]");
      if (b) goToStep(Number(b.dataset.i));
    });
    function goToStep(i) {
      i = Math.max(0, Math.min(flavors.length - 1, i));
      const el = stepEls[i];
      if (!el) return;
      const start = walk.getBoundingClientRect().top + window.scrollY;
      const centered = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.5 + 2;
      const top = Math.max(start, Math.min(start + walk.offsetHeight - window.innerHeight, centered));
      // Move the scroll position immediately: animating past all intervening
      // steps made a dot selection cycle through flavours before settling.
      const previous = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo({ top, behavior: "auto" });
      document.documentElement.style.scrollBehavior = previous;
      show(i);
    }
    rail.addEventListener("keydown", (event) => {
      const button = event.target.closest("button[data-i]");
      if (!button) return;
      const i = Number(button.dataset.i);
      const next = { ArrowLeft: i - 1, ArrowRight: i + 1, Home: 0, End: flavors.length - 1 }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      const target = Math.max(0, Math.min(flavors.length - 1, next));
      goToStep(target);
      rail.querySelector(`button[data-i="${target}"]`).focus({ preventScroll: true });
    });
    // Horizontal touch swipes browse flavours; vertical gestures retain normal
    // page scrolling. Desktop visitors can drag the bottle in either direction.
    let gesture = null;
    stage.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0 || event.target.closest("a, button, input, select, textarea")) return;
      if (event.pointerType === "mouse" && !event.target.closest(".walk-bottle")) return;
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
      stage.setPointerCapture(event.pointerId);
      bottle.classList.add("is-dragging");
    });
    stage.addEventListener("pointerup", (event) => {
      if (!gesture || event.pointerId !== gesture.id) return;
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      gesture = null;
      bottle.classList.remove("is-dragging");
      if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.25) goToStep(current + (dx < 0 ? 1 : -1));
    });
    const cancelGesture = () => { gesture = null; bottle.classList.remove("is-dragging"); };
    stage.addEventListener("pointercancel", cancelGesture);
    stage.addEventListener("lostpointercapture", cancelGesture);
    // Old links like /#sabor-maracuja still land on that flavour.
    const fromHash = () => {
      if (!location.hash.startsWith("#sabor-")) return;
      const i = flavors.findIndex((f) => `#sabor-${f.slug}` === location.hash);
      if (i >= 0) setTimeout(() => goToStep(i), 60);
    };
    window.addEventListener("hashchange", fromHash);
    fromHash();
  }

  // ------------------------------------------------------------ partners (consumer)
  function initPartners() {
    const grid = $("#partnerGrid");
    if (!grid) return;
    const filters = $("#partnerFilters");
    const list = partners();
    let bairro = "todos";
    const names = $("#buyPartners");
    if (names) names.innerHTML = list.map((p) => `<li>${esc(p.name)}</li>`).join("");

    if (!list.length) {
      grid.innerHTML = `<div class="partner-empty"><h3>Os pontos de venda estão no mapa.</h3><p class="lead" style="margin:12px auto 22px">Abra o mapa oficial para ver onde encontrar Kombú gelada.</p><a class="btn btn-dark" href="${esc(cms().officialMapUrl || OFFICIAL_MAP_URL)}" target="_blank" rel="noreferrer">${ICONS.pin}Abrir mapa</a></div>`;
      return;
    }
    const bairros = [...new Set(list.map((p) => p.neighborhood).filter(Boolean))];
    if (filters && bairros.length > 1) {
      filters.innerHTML = ["todos", ...bairros].map((b) => `<button class="chip" type="button" data-b="${esc(b)}" aria-pressed="${b === "todos"}">${b === "todos" ? "Todos os bairros" : esc(b)}</button>`).join("");
      filters.addEventListener("click", (event) => {
        const chip = event.target.closest("[data-b]");
        if (!chip) return;
        bairro = chip.dataset.b;
        $$("[data-b]", filters).forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
        draw();
      });
    }
    function draw() {
      const shown = list.filter((p) => bairro === "todos" || p.neighborhood === bairro);
      grid.innerHTML = shown.map((p, i) => `
        <article class="partner" data-reveal style="--i:${i % 3}">
          <span class="kind">${esc(p.neighborhood || p.city)}</span>
          <h3>${esc(p.name)}</h3>
          <dl>
            ${p.address ? `<div>${ICONS.pin}<dd>${esc(p.address)}</dd></div>` : ""}
            ${p.hours ? `<div>${ICONS.clock}<dd>${esc(p.hours)}</dd></div>` : ""}
            ${p.flavors.length ? `<div class="flv">${ICONS.glass}<dd>${esc(p.flavors.join(", "))}</dd></div>` : ""}
            ${p.instagram ? `<div>${ICONS.ig}<dd><a href="${esc(instagramUrl(p.instagram))}" target="_blank" rel="noreferrer">${esc(p.instagram.startsWith("@") ? p.instagram : "@" + p.instagram)}</a></dd></div>` : ""}
          </dl>
          <div class="actions">
            <a class="btn btn-dark" href="${esc(routeUrl(p))}" target="_blank" rel="noreferrer">${ICONS.route}Ver rota</a>
            ${p.whatsapp ? `<a class="btn btn-ghost" href="https://api.whatsapp.com/send?phone=${esc(p.whatsapp)}" target="_blank" rel="noreferrer">${ICONS.chat}WhatsApp</a>` : ""}
          </div>
        </article>`).join("");
      observeReveals(grid);
    }
    draw();
  }

  // ------------------------------------------------------------ revenda
  function initRevenda(flavors) {
    const fan = $("#fan");
    if (fan) {
      const pick = ["goiaba", "maracuja", "uva", "pera-alecrim", "hibisco-anis-estrelado"]
        .map((slug) => flavors.find((f) => f.slug === slug)).filter(Boolean);
      const chosen = pick.length >= 3 ? pick : flavors.slice(0, 5);
      fan.innerHTML = chosen.map((f) => `<img src="${esc(f.image)}" alt="Garrafa Kombú ${esc(f.name)}" width="533" height="1600" decoding="async">`).join("");
    }
    const proof = $("#proofNames");
    if (proof) {
      const names = partners().map((p) => p.name);
      if (names.length) proof.innerHTML = names.map((n) => `<b>${esc(n)}</b>`).join("");
      else proof.closest(".proof")?.remove();
    }
    const count = $("#flavorCount");
    if (count) count.textContent = String(flavors.length);
  }

  // Referral codes are captured for the current browsing session. The backend
  // treats them as unverified labels; payment pricing must use an approved code table.
  const REFERRAL_KEY = "kombuReferral";
  function referralCode(value) {
    const code = String(value || "").trim().toUpperCase();
    return /^[A-Z0-9_-]{1,40}$/.test(code) ? code : "";
  }
  function initReferrals() {
    const query = new URLSearchParams(location.search);
    const supplied = query.get("cupom") || query.get("ref");
    let code = referralCode(supplied);
    try {
      if (supplied !== null) sessionStorage.setItem(REFERRAL_KEY, code);
      else code = referralCode(sessionStorage.getItem(REFERRAL_KEY));
    } catch { /* The form still works when storage is disabled. */ }
    $$("input[name='couponCode']").forEach((input) => {
      input.value = code;
      input.addEventListener("change", () => {
        input.value = referralCode(input.value);
        try { sessionStorage.setItem(REFERRAL_KEY, input.value); } catch { /* optional */ }
      });
    });
  }

  // ------------------------------------------------------------ forms → /api/lead
  function normalizeLead(data, type) {
    return {
      id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      status: "novo",
      source: type === "criador" ? "site-criadores" : page === "revenda" ? "site-revenda" : page === "tasting" ? "site-kits" : "site-publico",
      name: data.nome || "",
      business: data.negocio || "",
      businessType: data.tipo || "",
      location: data.bairro || "",
      whatsapp: data.whatsapp || "",
      instagram: data.instagram || "",
      message: data.mensagem || "",
      couponCode: referralCode(data.couponCode),
      emailTo: ADMIN_EMAIL,
      createdAt: new Date().toISOString(),
    };
  }

  function initForm(form, type, success) {
    if (!form) return;
    const status = $(".form-status", form);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (form.dataset.busy === "1") return;
      form.dataset.busy = "1";
      const button = $('button[type="submit"]', form);
      const label = button.innerHTML;
      button.disabled = true;
      button.textContent = "Enviando…";
      status.hidden = true;
      const data = Object.fromEntries(new FormData(form).entries());
      if (form.dataset.prefix) data.mensagem = `${form.dataset.prefix} ${data.mensagem || ""}`.trim();
      try {
        const response = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lead: normalizeLead(data, type) }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.persisted) throw new Error("not saved");
        status.dataset.state = "ok";
        status.textContent = success;
        form.reset();
        initReferrals();
      } catch {
        status.dataset.state = "error";
        status.textContent = "Não foi possível enviar agora. Seus dados continuam aqui; tente de novo em instantes ou chame no WhatsApp.";
      } finally {
        status.hidden = false;
        form.dataset.busy = "0";
        button.disabled = false;
        button.innerHTML = label;
      }
    });
  }

  // ------------------------------------------------------------ chrome & motion
  function initHeader() {
    const header = $(".site-header");
    if (!header) return;
    // Light pages declare their initial header style in the markup. Preserve
    // it when scrolling instead of resetting it based on a page-name list.
    const solidAtTop = header.classList.contains("is-solid");
    const toggle = $(".menu-btn", header);
    toggle?.addEventListener("click", () => {
      const open = header.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$(".nav a", header).forEach((a) => a.addEventListener("click", () => {
      header.classList.remove("menu-open");
      toggle?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }));
    const first = document.querySelector("main > section, main > header");
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      const pastHero = first ? y > first.offsetHeight - 90 : y > 60;
      header.classList.toggle("is-solid", pastHero || solidAtTop);
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      if (goingDown && y > 320 && !header.classList.contains("menu-open")) header.classList.add("is-hidden");
      if (goingUp || y < 120) header.classList.remove("is-hidden");
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  let revealObserver = null;
  function observeReveals(root = document) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      $$("[data-reveal]", root).forEach((el) => el.classList.add("is-in"));
      return;
    }
    revealObserver ||= new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); revealObserver.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    $$("[data-reveal]:not(.is-in)", root).forEach((el) => revealObserver.observe(el));
  }

  function initMagnetic() {
    if (reduceMotion || !finePointer) return;
    document.addEventListener("pointermove", (event) => {
      const button = event.target.closest?.("[data-magnetic]");
      $$("[data-magnetic].is-pulled").forEach((b) => { if (b !== button) { b.style.transform = ""; b.classList.remove("is-pulled"); } });
      if (!button) return;
      const r = button.getBoundingClientRect();
      const dx = event.clientX - (r.left + r.width / 2);
      const dy = event.clientY - (r.top + r.height / 2);
      button.style.transform = `translate(${dx * 0.18}px, ${dy * 0.28}px)`;
      button.classList.add("is-pulled");
    }, { passive: true });
  }

  function initLinks() {
    $$("[data-whatsapp]").forEach((a) => {
      a.href = whatsappUrl(a.dataset.whatsapp);
      a.target = "_blank";
      a.rel = "noreferrer";
    });
    $$("[data-map]").forEach((a) => { a.href = cms().officialMapUrl || OFFICIAL_MAP_URL; });
    $$("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });
  }

  function legacyLegalLinks() {
    // The privacy and terms texts used to live on the home page. Checked on load and on hash
    // changes, since following /#termos from the home page itself does not reload it.
    const check = () => {
      if (page === "consumer" && (location.hash === "#privacidade" || location.hash === "#termos")) {
        location.replace(`/legal${location.hash}`);
      }
    };
    check();
    window.addEventListener("hashchange", check);
  }

  // ------------------------------------------------------------ direct orders
  // Ordering direct used to sit near the end of the page and was easy to miss (owner, 24/10). On
  // smaller screens a button follows the visitor; it steps aside over the hero, where the same
  // action is already on screen, over the flavour stage, which has its own "Pedir este sabor", and
  // over the order form and footer, where it would cover fields.
  function initOrdering() {
    const fab = $(".order-fab");
    if (fab && "IntersectionObserver" in window) {
      const covering = new Set();
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? covering.add(e.target) : covering.delete(e.target)));
        fab.classList.toggle("is-away", covering.size > 0);
      });
      $$(".hero, .walk-stage, #comprar, .site-footer").forEach((el) => io.observe(el));
      fab.hidden = false;
    }
    // "Pedir este sabor" starts the order with the flavour that is on screen.
    $$(".walk-order").forEach((link) => link.addEventListener("click", () => {
      const field = $("#order-mensagem");
      const name = $(".walk-name")?.textContent.trim();
      if (!field || !name || field.value.includes(name)) return;
      field.value = field.value.trim() ? `${field.value.trim()}, ${name}` : name;
    }));
  }

  // ------------------------------------------------------------ audience chooser
  // A first visit to the home page asks whether this is for the visitor's own consumption or for
  // resale, so the reseller path is not left to a pill in the corner (owner, 2026-10-24). Asked
  // once: any answer, or closing it, is remembered. Someone arriving by a direct link (#sabores,
  // #onde...) came for that and is not interrupted.
  const AUDIENCE_KEY = "kombuAudience";
  const readAudience = () => { try { return localStorage.getItem(AUDIENCE_KEY); } catch { return "unknown"; } };
  const saveAudience = (value) => { try { localStorage.setItem(AUDIENCE_KEY, value); } catch { /* private mode */ } };

  function initChooser() {
    if (page === "revenda") saveAudience("revenda");
    $$('.nav a[href="/revenda"]').forEach((a) => a.addEventListener("click", () => saveAudience("revenda")));
    $$('.site-header .logo[href="/"], .nav-consumer').forEach((a) => a.addEventListener("click", () => saveAudience("consumo")));
    const dialog = $("#audienceChooser");
    if (!dialog || typeof dialog.showModal !== "function") return;
    if (readAudience() || location.hash) return;
    dialog.addEventListener("click", (event) => {
      const choice = event.target.closest("[data-choice]");
      if (choice) {
        saveAudience(choice.dataset.choice);
        if (choice.dataset.choice === "consumo") dialog.close();
        return;
      }
      // a click on the backdrop lands on the dialog element itself
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => { if (!readAudience()) saveAudience("fechado"); });
    dialog.showModal();
  }

  // ------------------------------------------------------------ boot
  async function boot() {
    legacyLegalLinks();
    initChooser();
    initReferrals();
    if (page === "consumer") initOrdering();
    initHeader();
    observeReveals();
    initMagnetic();
    await loadState();
    renderAnnouncement();
    initLinks();
    const flavors = mergedFlavors();
    if (page === "consumer") {
      initHero(flavors);
      initMarquee(flavors);
      initWalk(flavors);
      initPartners();
      initForm($("#orderForm"), "contato", "Recebemos seu pedido. A Kombú vai chamar você no WhatsApp para combinar sabores e entrega.");
    }
    if (page === "revenda") {
      initRevenda(flavors);
      initForm($("#resellerForm"), "revenda", "Recebemos seus dados. A Kombú vai retornar pelo contato informado com sabores, valores e condições.");
    }
    initForm($("#creatorForm"), "criador", "Recebemos sua proposta. Vamos conversar pelo contato informado antes de definir a parceria.");
    observeReveals();
  }
  boot();
})();
