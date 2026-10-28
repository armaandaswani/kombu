(() => {
  "use strict";
  const form = document.querySelector("#kitForm");
  if (!form || !window.KombuKits) return;
  const catalog = window.KombuKits;
  const kit = form.elements.kitId;
  const coupon = form.elements.couponCode;
  const quantity = form.elements.quantity;
  const bottles = () => kit.value === "kit-custom" ? Number(quantity.value) : (catalog.kits.find(k => k.id === kit.value)?.bottles || 0);
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector(".form-status");
  const couponStatus = document.querySelector("#couponStatus");
  const quoteText = document.querySelector("#kitQuote");
  const money = (cents) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  let products = [];
  let availability = { products: [], reservationProducts: [] };
  const mode = form.elements.orderMode;
  const isReservation = () => mode.value === "reservation";
  const submitLabel = () => isReservation() ? "Reservar lote sem pagamento" : "Solicitar frete e confirmar pedido";
  function renderProducts() {
    products = isReservation() ? availability.reservationProducts : availability.products;
    document.querySelector("#reservationHelp").hidden = !isReservation();
    button.textContent = submitLabel();
    stockProducts.replaceChildren();
    products.forEach(product => {
      const label = document.createElement("label"); label.className = "field";
      const text = document.createElement("span"); text.textContent = isReservation() ? `${product.flavor} · mínimo 5` : `${product.flavor} · ${product.available} disponíveis`;
      const input = document.createElement("input"); input.type = "number"; input.min = "0"; input.max = String(isReservation() ? (bottles() || 20) : product.available); input.step = "1"; input.value = "0"; input.dataset.productId = product.productId; input.setAttribute("aria-label", `Quantidade de ${product.flavor}`);
      label.append(text, input); stockProducts.append(label);
    });
  }
  let stockReady = false;
  const stockStatus = document.querySelector("#stockStatus");
  const stockProducts = document.querySelector("#stockProducts");
  const selectedItems = () => [...stockProducts.querySelectorAll("input")].filter(input => Number(input.value) > 0).map(input => ({ productId: input.dataset.productId, qty: Number(input.value) }));
  function selectionValid() {
    const expected = bottles();
    const count = selectedItems().reduce((sum, item) => sum + item.qty, 0);
    if (isReservation()) {
      const eligible = expected === 15 || expected >= 20;
      const minimum = selectedItems().every(item => item.qty >= 5);
      stockStatus.textContent = !eligible ? "Para reservar um lote, escolha o kit de 15, de 20 ou personalizado garrafas." : !products.length ? "Nenhum sabor disponível para reserva no momento." : `${count} de ${expected} garrafas selecionadas. ${minimum ? "Mínimo de 5 por sabor escolhido." : "Ajuste a seleção: cada sabor escolhido precisa ter pelo menos 5 garrafas."}`;
      return stockReady && eligible && count === expected && minimum;
    }
    if (stockReady) stockStatus.textContent = products.length ? `${count} de ${expected || "—"} garrafas selecionadas. Disponibilidade do nosso estoque; reserva após confirmação.` : "Nenhum sabor disponível para pronta entrega no momento.";
    const minimum = selectedItems().every(item => item.qty >= 5);
    if (stockReady && products.length && !minimum) stockStatus.textContent = `${count} de ${expected} garrafas. Cada sabor escolhido precisa ter pelo menos 5 garrafas.`;
    return stockReady && expected > 0 && count === expected && minimum;
  }
  async function loadStock() {
    stockReady = false;
    button.disabled = true;
    try {
      const response = await fetch("/api/checkout", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok || !Array.isArray(data.products)) throw new Error();
      availability = { products: data.products, reservationProducts: data.reservationProducts || [] };
      renderProducts();
      const requestedFlavor = new URLSearchParams(location.search).get("sabor");
      const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
      const chosen = products.find(product => normalize(product.flavor) === normalize(requestedFlavor));
      if (requestedFlavor && chosen && chosen.available >= 5) {
        const input = [...stockProducts.querySelectorAll("input")].find(input => input.dataset.productId === chosen.productId);
        if (input) input.value = "5";
      }
      stockReady = true;
    } catch { stockStatus.textContent = "Estoque indisponível agora. Recarregue a página para tentar novamente."; }
    refreshQuote();
  }
  stockProducts.addEventListener("input", () => { button.disabled = busy || !validQuote || !selectionValid(); });
  let revision = 0;
  let busy = false;
  let validQuote = false;
  let requestId = crypto.randomUUID();
  function renderQuote(quote) {
    quoteText.textContent = `Produtos: ${money(quote.subtotalCents)}${quote.discountCents ? ` − ${money(quote.discountCents)} de desconto = ${money(quote.productsCents)}` : ""}. Frete à parte.`;
  }
  async function refreshQuote() {
    document.querySelectorAll("[data-kit]").forEach(link => {
      const selected = link.dataset.kit === kit.value;
      link.classList.toggle("is-selected", selected);
      if (selected) link.setAttribute("aria-current", "true"); else link.removeAttribute("aria-current");
    });
    document.querySelector("#customQuantityField").hidden = kit.value !== "kit-custom";
    quantity.disabled = kit.value !== "kit-custom";
    if (isReservation()) stockProducts.querySelectorAll("input").forEach(input => { input.max = String(bottles() || 20); });
    const current = ++revision;
    validQuote = false;
    button.disabled = true;
    couponStatus.textContent = "";
    if (!kit.value) { quoteText.textContent = "Escolha um kit para ver o subtotal."; return; }
    try { renderQuote(catalog.quote(kit.value, null, 0, Number(quantity.value))); } catch { quoteText.textContent = "Informe a quantidade do kit personalizado (20 a 500 garrafas)."; return; }
    if (!coupon.value.trim()) { validQuote = true; button.disabled = busy || !selectionValid(); return; }
    couponStatus.textContent = "Validando cupom…";
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "quote", kitId: kit.value, quantity: Number(quantity.value), couponCode: coupon.value }) });
      const payload = await response.json();
      if (current !== revision) return;
      if (!response.ok || !payload.ok) {
        couponStatus.dataset.state = "error";
        couponStatus.textContent = payload.error === "invalid_creator_code" ? "Cupom não encontrado ou inativo. Confira o código ou remova-o para continuar." : "Não foi possível validar o cupom agora. Tente novamente ou remova-o para continuar.";
        return;
      }
      renderQuote(payload.quote);
      couponStatus.dataset.state = "ok";
      couponStatus.textContent = "Cupom aplicado: 5% de desconto nos produtos.";
      validQuote = true;
      button.disabled = busy || !selectionValid();
    } catch {
      if (current === revision) { couponStatus.dataset.state = "error"; couponStatus.textContent = "Não foi possível validar o cupom agora. Tente novamente ou remova-o para continuar."; }
    }
  }
  document.querySelectorAll("[data-kit]").forEach((link) => link.addEventListener("click", () => {
    kit.value = link.dataset.kit;
    requestId = crypto.randomUUID();
    refreshQuote();
  }));
  kit.addEventListener("change", refreshQuote);
  quantity.addEventListener("input", refreshQuote);
  mode.addEventListener("change", () => { requestId = crypto.randomUUID(); renderProducts(); refreshQuote(); });
  coupon.addEventListener("input", () => { ++revision; validQuote = false; button.disabled = true; couponStatus.textContent = "Termine de digitar e saia do campo para validar o cupom."; });
  coupon.addEventListener("change", refreshQuote);
  form.addEventListener("input", () => { requestId = crypto.randomUUID(); });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy || !validQuote || !selectionValid() || !form.reportValidity()) return;
    busy = true;
    button.disabled = true;
    status.hidden = true;
    button.textContent = "Enviando pedido…";
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", requestId, kitId: data.kitId, quantity: Number(quantity.value), couponCode: data.couponCode, name: data.nome, phone: data.whatsapp, email: data.email, city: data.city, cep: data.cep, address: data.address, neighborhood: data.bairro, orderMode: mode.value, items: selectedItems() }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.persisted) { if (payload.error === "stock_changed") { await loadStock(); throw new Error("stock_changed"); } throw new Error(payload.error || "not_saved"); }
      status.dataset.state = "ok";
      status.textContent = payload.reservation ? "Reserva de lote recebida, sem pagamento. Vamos entrar em contato para combinar o prazo de produção e a entrega." : "Pedido recebido. Vamos confirmar os sabores e o frete Uber pelo WhatsApp e enviar o total com o link InfinitePay. Você ainda não foi cobrado.";
      form.reset();
      renderProducts();
      coupon.value = catalog.code(data.couponCode);
      requestId = crypto.randomUUID();
      refreshQuote();
    } catch (error) {
      status.dataset.state = "error";
      status.textContent = error.message === "stock_changed" ? "O estoque mudou. Escolha novamente os sabores disponíveis." : "Não foi possível registrar agora. Seus dados continuam aqui. Tente novamente ou fale com a Kombú pelo WhatsApp.";
    } finally {
      busy = false;
      button.disabled = !validQuote || !selectionValid();
      button.textContent = submitLabel();
      status.hidden = false;
    }
  });
  const requestedKit = new URLSearchParams(location.search).get("kit");
  if (catalog.kits.some(k => k.id === requestedKit)) kit.value = requestedKit;
  loadStock();
})();
