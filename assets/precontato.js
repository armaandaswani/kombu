// Pré-contato da Kombú: revenda e parcerias.
// Uma pergunta por tela, com barra de progresso, no mesmo desenho do
// pré-contato da Orbital. Escolha única segue sozinha; escolha múltipla e
// campos mostram "Continuar". No fim, um resumo editável e o botão abre o
// WhatsApp da Kombú com as respostas organizadas. O lead também vai para o
// CRM (/api/lead) sem segurar o WhatsApp: falhar ali não impede o envio.
// Abre por qualquer [data-precontato="revenda|parceria"] ou por ?contato na URL.
(() => {
  "use strict";
  const WHATSAPP = "5592992097165";
  const AUTO_DELAY = 260;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ORIGEM = { id: "origem", kind: "single", group: "contato", label: "Como conheceu a Kombú", t: "Como você conheceu a Kombú?",
    options: ["Instagram", "Feira ou evento", "Em um parceiro da Kombú", "Amigo ou conhecido", "Outro"], other: "Outro", otherLabel: "Onde você conheceu a Kombú?" };

  const FLOWS = {
    revenda: {
      type: "revenda",
      intro: "Olá! Vim pelo site da Kombú e quero revender no meu espaço.",
      groups: { espaco: "O espaço", interesse: "Interesse", contato: "Contato" },
      done: "Você conversa direto com a equipe da Kombú.",
      steps: [
        { id: "tipo", kind: "single", group: "espaco", label: "Tipo", t: "Que tipo de espaço você tem?",
          options: ["Café ou confeitaria", "Restaurante ou bistrô", "Empório ou mercado", "Academia ou estúdio", "Hotel ou pousada", "Outro"], other: "Outro", otherLabel: "Qual é o tipo de espaço?" },
        { id: "vende", kind: "single", group: "espaco", label: "Já vende", t: "Você já vende kombucha ou outras bebidas naturais?",
          options: ["Já vendo kombucha", "Vendo outras bebidas naturais", "Ainda não"] },
        { id: "publicos", kind: "multi", max: 2, group: "espaco", label: "Público", t: "Quem mais frequenta seu espaço?", s: "Escolha até 2.",
          options: ["Alimentação natural e bem-estar", "Esporte e vida ativa", "Gastronomia e novas experiências", "Público variado do bairro"] },
        { id: "geladeira", kind: "single", group: "espaco", label: "Geladeira", t: "Seu espaço tem geladeira para bebidas?", s: "A Kombú fica sempre gelada, entre 0 e 5 °C.",
          options: ["Sim, tenho geladeira ou expositor", "Ainda não tenho", "Quero conversar sobre isso"] },
        { id: "sabores", kind: "flavors", max: 4, group: "interesse", label: "Sabores", t: "Quais sabores chamam sua atenção?", s: "Escolha até 4. Se preferir, a gente sugere na conversa.", optional: true },
        { id: "quando", kind: "single", group: "interesse", label: "Quer começar", t: "Quando você gostaria de começar?",
          options: ["Assim que possível", "Nas próximas semanas", "Ainda estou conhecendo"] },
        { id: "dados", kind: "fields", t: "Sobre o seu espaço", s: "Seu WhatsApp não é necessário: a conversa já começa por ele.",
          fields: [
            { name: "negocio", label: "Nome do estabelecimento", group: "espaco", line: "Nome", top: true, required: true, autocomplete: "organization", max: 160, first: true },
            { name: "bairro", label: "Bairro", group: "espaco", line: "Bairro", top: true, required: true, autocomplete: "address-level3", max: 160 },
            { name: "nome", label: "Seu nome", group: "contato", line: "Responsável", required: true, autocomplete: "name", max: 120 },
            { name: "instagram", label: "Instagram do espaço", group: "contato", line: "Instagram", placeholder: "@seunegocio", max: 80 },
          ] },
        ORIGEM,
      ],
    },
    parceria: {
      type: "parceria",
      intro: "Olá! Vim pelo site da Kombú e quero conversar sobre uma parceria.",
      groups: { perfil: "Sobre mim", ideia: "A ideia", contato: "Contato" },
      done: "Você conversa direto com a equipe da Kombú.",
      steps: [
        { id: "area", kind: "single", group: "perfil", label: "Área", t: "Qual é a sua área?",
          options: ["Nutricionista", "Nutrólogo(a)", "Personal trainer", "Estúdio ou academia", "Influenciador(a) ou criador(a) de conteúdo", "Eventos", "Outro"], other: "Outro", otherLabel: "Qual é a sua área?" },
        { id: "onde", kind: "multi", max: 3, group: "perfil", label: "Onde atua", t: "Onde você encontra seu público?", s: "Escolha até 3.",
          options: ["Consultório ou clínica", "Academia ou estúdio", "Instagram", "TikTok ou YouTube", "Eventos e feiras", "Outro lugar"] },
        { id: "alcance", kind: "single", group: "perfil", label: "Tamanho do público", t: "Qual é o tamanho do seu público?", s: "Pacientes, alunos ou seguidores. Não existe número mínimo.",
          options: ["Até 1 mil pessoas", "De 1 mil a 10 mil", "De 10 mil a 50 mil", "Mais de 50 mil", "Prefiro contar na conversa"] },
        { id: "conhece", kind: "single", group: "perfil", label: "Conhece a Kombú", t: "Você já conhece a Kombú?",
          options: ["Já provei", "Conheço, mas ainda não provei", "Ainda não conheço"] },
        { id: "formato", kind: "multi", max: 3, group: "ideia", label: "Formato", t: "Como você imagina essa parceria?", s: "Escolha até 3.",
          options: ["Indicar para pacientes, alunos ou seguidores", "Criar conteúdo com a Kombú", "Degustação ou evento", "Ter Kombú no meu espaço", "Outra ideia"] },
        { id: "ideia", kind: "fields", t: "Conte sua ideia", s: "Opcional. Em poucas linhas, o que você tem em mente.",
          fields: [{ name: "mensagem", label: "Sua ideia", group: "ideia", line: "Ideia", textarea: true, max: 1200, placeholder: "Ex.: quero apresentar a Kombú no meu estúdio…", first: true }] },
        { id: "dados", kind: "fields", t: "Para a gente se conhecer", s: "Seu WhatsApp não é necessário: a conversa já começa por ele.",
          fields: [
            { name: "nome", label: "Seu nome", group: "contato", line: "Nome", required: true, autocomplete: "name", max: 120, first: true },
            { name: "bairro", label: "Cidade e bairro", group: "contato", line: "Cidade", required: true, autocomplete: "address-level2", max: 160 },
            { name: "instagram", label: "Instagram", group: "contato", line: "Instagram", placeholder: "@seuperfil", max: 80 },
          ] },
        ORIGEM,
      ],
    },
  };

  // Garrafas usadas quando o CMS ainda não carregou (mesmos arquivos do site).
  const FALLBACK_FLAVORS = [
    ["Maracujá", "maracuja"], ["Frutas Vermelhas", "frutas-vermelhas"], ["Hibisco & Anis Estrelado", "hibisco-anis-estrelado"],
    ["Flor Fada Azul & Blueberry", "flor-fada-azul-blueberry"], ["Maçã & Canela", "maca-canela"], ["Pêra & Alecrim", "pera-alecrim"],
    ["Imunidade", "imunidade"], ["Rosas & Cardamomo", "rosas-cardamomo"], ["Lavanda & Limão", "lavanda-limao"],
    ["Manga & Jasmim", "jasmim-manga"], ["Goiaba", "goiaba"], ["Uva", "uva"],
  ].map(([name, slug]) => ({ name, slug, image: `/assets/bottles/${slug}.webp` }));
  const flavors = () => (Array.isArray(window.KombuFlavors) && window.KombuFlavors.length ? window.KombuFlavors : FALLBACK_FLAVORS);

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = {
    back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    next: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>',
    whats: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 012.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 00-3.48-8.41z"/></svg>',
  };

  let root, sheet, body, foot, bar, backBtn, flow, steps, answers, index, dir, autoTimer, lastFocus;

  function build() {
    root = document.createElement("div");
    root.className = "pc";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "pc-title");
    root.innerHTML = `
      <div class="pc-veil" data-pc-close></div>
      <div class="pc-sheet">
        <div class="pc-top">
          <button type="button" class="pc-icon" data-pc-back aria-label="Voltar">${icon.back}</button>
          <div class="pc-progress" role="progressbar" aria-label="Progresso" aria-valuemin="1"><span></span></div>
          <button type="button" class="pc-icon" data-pc-close aria-label="Fechar">${icon.close}</button>
        </div>
        <div class="pc-body"></div>
        <div class="pc-foot" hidden></div>
      </div>`;
    document.body.appendChild(root);
    sheet = root.querySelector(".pc-sheet");
    body = root.querySelector(".pc-body");
    foot = root.querySelector(".pc-foot");
    bar = root.querySelector(".pc-progress");
    backBtn = root.querySelector("[data-pc-back]");
    root.addEventListener("click", (e) => { if (e.target.closest("[data-pc-close]")) close(); });
    backBtn.addEventListener("click", () => go(index - 1));
    root.addEventListener("keydown", onKey);
  }

  function open(kind, trigger) {
    if (!FLOWS[kind]) return;
    if (!root) build();
    flow = FLOWS[kind];
    steps = [...flow.steps, { id: "fim", kind: "summary", t: "Tudo pronto. Vamos conversar?", s: "Suas respostas vão organizadas na mensagem. É só enviar." }];
    answers = {};
    index = 0;
    dir = 1;
    lastFocus = trigger || document.activeElement;
    root.hidden = false;
    root.dataset.flow = kind;
    document.documentElement.classList.add("pc-lock");
    render();
  }

  function close() {
    if (!root || root.hidden) return;
    clearTimeout(autoTimer);
    root.hidden = true;
    document.documentElement.classList.remove("pc-lock");
    lastFocus?.focus?.({ preventScroll: true });
  }

  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    const items = [...sheet.querySelectorAll('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter((el) => el.getClientRects().length);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function go(n) {
    clearTimeout(autoTimer);
    const target = Math.max(0, Math.min(n, steps.length - 1));
    if (target === index) return;
    dir = target > index ? 1 : -1;
    index = target;
    render();
  }

  const step = () => steps[index];
  const value = (id) => answers[id];

  function stepDone(s) {
    const v = value(s.id);
    if (s.kind === "single") return !!v && (v !== s.other || !!String(answers[`${s.id}Outro`] || "").trim());
    if (s.kind === "multi") return Array.isArray(v) && v.length > 0;
    if (s.kind === "fields") return s.fields.every((f) => !f.required || String(answers[f.name] || "").trim());
    return true;
  }

  function render() {
    const s = step();
    const total = steps.length;
    bar.setAttribute("aria-valuemax", String(total));
    bar.setAttribute("aria-valuenow", String(index + 1));
    bar.firstElementChild.style.transform = `scaleX(${(index + 1) / total})`;
    backBtn.style.visibility = index === 0 ? "hidden" : "visible";

    let html = `<div class="pc-step ${dir > 0 ? "pc-in-next" : "pc-in-back"}">`;
    html += `<p class="pc-count">${index + 1} de ${total}</p>`;
    html += `<h2 id="pc-title" tabindex="-1">${esc(s.t)}</h2>`;
    if (s.s) html += `<p class="pc-sub">${esc(s.s)}</p>`;
    html += `<div class="pc-content">${content(s)}</div></div>`;
    body.innerHTML = html;
    body.scrollTop = 0;
    renderFoot();
    bind(s);
    const focusTarget = s.kind === "fields" ? body.querySelector("[data-first]") : body.querySelector("h2");
    focusTarget?.focus({ preventScroll: true });
  }

  function content(s) {
    if (s.kind === "single") {
      const other = s.other && value(s.id) === s.other;
      return `<div class="pc-options" role="radiogroup" aria-label="${esc(s.t)}">${s.options.map((o, k) => option(o, value(s.id) === o, "radio", k)).join("")}</div>`
        + (s.other ? `<label class="pc-field pc-other" ${other ? "" : "hidden"}><span>${esc(s.otherLabel)}</span><input type="text" maxlength="160" data-other value="${esc(answers[`${s.id}Outro`] || "")}"></label>` : "");
    }
    if (s.kind === "multi") {
      const picked = value(s.id) || [];
      return `<div class="pc-options" role="group" aria-label="${esc(s.t)}">${s.options.map((o, k) => option(o, picked.includes(o), "checkbox", k, !picked.includes(o) && picked.length >= s.max)).join("")}</div>`;
    }
    if (s.kind === "flavors") {
      const picked = value(s.id) || [];
      return `<div class="pc-flavors" role="group" aria-label="${esc(s.t)}">${flavors().map((f, k) => {
        const on = picked.includes(f.name);
        const full = !on && picked.length >= s.max;
        return `<button type="button" class="pc-flavor" role="checkbox" aria-checked="${on}" aria-disabled="${full}" data-value="${esc(f.name)}" style="--i:${k}">
          <span class="pc-flavor-art"><img src="${esc(f.image)}" alt="" width="533" height="1600" loading="lazy" decoding="async">${on ? `<i class="pc-tick">${icon.check}</i>` : ""}</span>
          <span class="pc-flavor-name">${esc(f.name)}</span></button>`;
      }).join("")}</div>`;
    }
    if (s.kind === "fields") {
      return `<div class="pc-fields">${s.fields.map((f) => `<label class="pc-field"><span>${esc(f.label)}${f.required ? "" : " <small>Opcional</small>"}</span>
        ${f.textarea
          ? `<textarea name="${f.name}" rows="4" maxlength="${f.max}" placeholder="${esc(f.placeholder || "")}" ${f.first ? "data-first" : ""}>${esc(answers[f.name] || "")}</textarea>`
          : `<input name="${f.name}" type="text" maxlength="${f.max}" ${f.required ? "required" : ""} autocomplete="${f.autocomplete || "off"}" placeholder="${esc(f.placeholder || "")}" value="${esc(answers[f.name] || "")}" ${f.first ? "data-first" : ""}>`}
      </label>`).join("")}</div>`;
    }
    // Resumo: cada resposta com o atalho para alterar.
    return `<dl class="pc-summary">${summaryRows().map((r) => `<div><dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd><button type="button" class="pc-edit" data-edit="${r.step}" aria-label="Alterar ${esc(r.label)}">Alterar</button></div>`).join("")}</dl>`;
  }

  function option(label, on, role, k, disabled = false) {
    return `<button type="button" class="pc-option" role="${role}" aria-checked="${on}" aria-disabled="${disabled}" data-value="${esc(label)}" style="--i:${k}">
      <span>${esc(label)}</span><i class="pc-mark pc-mark-${role}" aria-hidden="true">${on ? (role === "radio" ? "<b></b>" : icon.check) : ""}</i></button>`;
  }

  function renderFoot() {
    const s = step();
    if (s.kind === "summary") {
      foot.hidden = false;
      foot.innerHTML = `<a class="pc-send" href="${esc(whatsappUrl())}" target="_blank" rel="noopener noreferrer" data-pc-send>${icon.whats}Enviar pelo WhatsApp</a>
        <p class="pc-foot-note">${esc(flow.done)}</p>`;
      return;
    }
    const auto = s.kind === "single" && value(s.id) !== s.other;
    if (auto) { foot.hidden = true; foot.innerHTML = ""; return; }
    const picked = Array.isArray(value(s.id)) ? value(s.id).length : 0;
    const counter = s.max && picked ? `${picked} de ${s.max}` : "";
    const ok = stepDone(s);
    const skip = s.optional && !picked;
    foot.hidden = false;
    foot.innerHTML = `<div class="pc-foot-row"><span class="pc-counter" aria-live="polite">${counter}</span>
      <button type="button" class="pc-next" data-pc-next ${ok ? "" : "disabled"}>${skip ? "Pular" : "Continuar"}${icon.next}</button></div>`;
    foot.querySelector("[data-pc-next]").addEventListener("click", () => go(index + 1));
  }

  function bind(s) {
    if (s.kind === "single") {
      body.querySelectorAll(".pc-option").forEach((b) => b.addEventListener("click", () => {
        answers[s.id] = b.dataset.value;
        if (b.dataset.value !== s.other) delete answers[`${s.id}Outro`];
        refreshOptions(s);
        if (b.dataset.value === s.other) {
          const input = body.querySelector("[data-other]");
          input.closest("label").hidden = false;
          renderFoot();
          input.focus();
          return;
        }
        renderFoot();
        autoTimer = setTimeout(() => go(index + 1), AUTO_DELAY);
      }));
      body.querySelector("[data-other]")?.addEventListener("input", (e) => {
        answers[`${s.id}Outro`] = e.target.value;
        const next = foot.querySelector("[data-pc-next]");
        if (next) next.disabled = !stepDone(s);
      });
      body.querySelector("[data-other]")?.addEventListener("keydown", (e) => { if (e.key === "Enter" && stepDone(s)) { e.preventDefault(); go(index + 1); } });
    }
    if (s.kind === "multi" || s.kind === "flavors") {
      body.querySelectorAll("[data-value]").forEach((b) => b.addEventListener("click", () => {
        const list = [...(value(s.id) || [])];
        const v = b.dataset.value;
        const at = list.indexOf(v);
        if (at >= 0) list.splice(at, 1);
        else if (list.length < s.max) list.push(v);
        else return;
        answers[s.id] = list;
        const keep = body.scrollTop;
        body.querySelector(".pc-content").innerHTML = content(s);
        body.querySelectorAll(".pc-option, .pc-flavor").forEach((el) => el.classList.add("is-static"));
        body.scrollTop = keep;
        bind(s);
        renderFoot();
        body.querySelector(`[data-value="${CSS.escape(v)}"]`)?.focus({ preventScroll: true });
      }));
    }
    if (s.kind === "fields") {
      body.querySelectorAll("input, textarea").forEach((input) => {
        input.addEventListener("input", () => {
          answers[input.name] = input.value;
          const next = foot.querySelector("[data-pc-next]");
          if (next) next.disabled = !stepDone(s);
        });
        if (input.tagName === "INPUT") input.addEventListener("keydown", (e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          const inputs = [...body.querySelectorAll("input")];
          const i = inputs.indexOf(input);
          if (i < inputs.length - 1) inputs[i + 1].focus();
          else if (stepDone(s)) go(index + 1);
        });
      });
    }
    if (s.kind === "summary") {
      body.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => go(steps.findIndex((x) => x.id === b.dataset.edit))));
      foot.querySelector("[data-pc-send]").addEventListener("click", send);
    }
  }

  function refreshOptions(s) {
    body.querySelectorAll(".pc-option").forEach((b) => {
      const on = b.dataset.value === value(s.id);
      b.setAttribute("aria-checked", String(on));
      b.classList.add("is-static");
      b.querySelector(".pc-mark").innerHTML = on ? "<b></b>" : "";
    });
  }

  // Linhas do resumo e da mensagem, na ordem das perguntas.
  function answerLines() {
    const lines = [];
    for (const s of flow.steps) {
      if (s.kind === "fields") {
        s.fields.forEach((f) => {
          const v = String(answers[f.name] || "").trim();
          if (v) lines.push({ group: f.group, label: f.line, value: v, step: s.id, top: !!f.top });
        });
        continue;
      }
      let v = value(s.id);
      if (Array.isArray(v)) v = v.join("; ");
      if (s.other && v === s.other) v = String(answers[`${s.id}Outro`] || "").trim() || v;
      if (!v && s.kind === "flavors") v = "Quero sugestões da equipe";
      if (v) lines.push({ group: s.group, label: s.label, value: v, step: s.id });
    }
    return lines;
  }

  function summaryRows() { return answerLines().sort((a, b) => Number(b.top || 0) - Number(a.top || 0)); }

  function message() {
    const lines = answerLines();
    const out = [flow.intro];
    Object.entries(flow.groups).forEach(([key, title]) => {
      const items = lines.filter((l) => l.group === key).sort((a, b) => Number(b.top || 0) - Number(a.top || 0));
      if (!items.length) return;
      out.push("", `*${title}*`, ...items.map((l) => `• ${l.label}: ${l.value}`));
    });
    return out.join("\n");
  }

  const whatsappUrl = () => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message())}`;

  // CRM: mesmo formato dos formulários anteriores, sem bloquear o WhatsApp.
  function leadData() {
    const origem = value("origem");
    const base = {
      nome: answers.nome || "",
      bairro: answers.bairro || "",
      instagram: answers.instagram || "",
      origem: origem === "Outro" ? "Outro" : origem || "",
      origemOutro: origem === "Outro" ? answers.origemOutro || "" : "",
      mensagem: message(),
    };
    if (flow.type === "revenda") {
      return { ...base, negocio: answers.negocio || "", tipo: value("tipo") === "Outro" ? answers.tipoOutro || "Outro" : value("tipo") || "", publicos: value("publicos") || [] };
    }
    return { ...base, perfilTipo: value("area") === "Outro" ? answers.areaOutro || "Outro" : value("area") || "" };
  }

  function send() {
    try { window.KombuLead?.send(leadData(), flow.type); } catch { /* o WhatsApp segue mesmo assim */ }
    const kind = flow.type;
    close();
    toast(kind === "revenda"
      ? "Abrimos o WhatsApp com suas respostas. É só enviar a mensagem."
      : "Abrimos o WhatsApp com sua proposta. É só enviar a mensagem.");
  }

  function toast(text) {
    let el = document.querySelector(".pc-toast");
    if (!el) {
      el = document.createElement("p");
      el.className = "pc-toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.classList.remove("is-on");
    void el.offsetWidth;
    el.classList.add("is-on");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("is-on"), 6000);
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest?.("[data-precontato]");
    if (!trigger) return;
    e.preventDefault();
    open(trigger.dataset.precontato, trigger);
  });

  const params = new URLSearchParams(location.search);
  if (params.has("contato")) {
    const kind = document.body.dataset.page === "partnerships" ? "parceria" : "revenda";
    requestAnimationFrame(() => open(kind));
  }

  window.KombuPrecontato = { open, close, message: () => (flow ? message() : "") };
  if (reduceMotion) document.documentElement.classList.add("pc-calm");
})();
