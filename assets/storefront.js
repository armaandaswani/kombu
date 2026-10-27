(() => {
  "use strict";
  const form = document.querySelector("#kitForm");
  if (!form || !window.KombuKits) return;
  const catalog = window.KombuKits;
  const kit = form.elements.kitId;
  const coupon = form.elements.couponCode;
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector(".form-status");
  const couponStatus = document.querySelector("#couponStatus");
  const quoteText = document.querySelector("#kitQuote");
  const money = (cents) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  let revision = 0;
  let busy = false;
  let validQuote = false;
  let requestId = crypto.randomUUID();
  function renderQuote(quote) {
    quoteText.textContent = `Produtos: ${money(quote.subtotalCents)}${quote.discountCents ? ` − ${money(quote.discountCents)} de desconto = ${money(quote.productsCents)}` : ""}. Frete à parte.`;
  }
  async function refreshQuote() {
    const current = ++revision;
    validQuote = false;
    button.disabled = true;
    couponStatus.textContent = "";
    if (!kit.value) { quoteText.textContent = "Escolha um kit para ver o subtotal."; return; }
    renderQuote(catalog.quote(kit.value));
    if (!coupon.value.trim()) { validQuote = true; button.disabled = busy; return; }
    couponStatus.textContent = "Validando cupom…";
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "quote", kitId: kit.value, couponCode: coupon.value }) });
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
      button.disabled = busy;
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
  coupon.addEventListener("input", () => { ++revision; validQuote = false; button.disabled = true; couponStatus.textContent = "Termine de digitar e saia do campo para validar o cupom."; });
  coupon.addEventListener("change", refreshQuote);
  form.addEventListener("input", () => { requestId = crypto.randomUUID(); });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy || !validQuote || !form.reportValidity()) return;
    busy = true;
    button.disabled = true;
    status.hidden = true;
    button.textContent = "Enviando pedido…";
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", requestId, kitId: data.kitId, couponCode: data.couponCode, name: data.nome, phone: data.whatsapp, email: data.email, city: data.city, cep: data.cep, address: data.address, neighborhood: data.bairro, flavors: data.flavors }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.persisted) throw new Error(payload.error || "not_saved");
      status.dataset.state = "ok";
      status.textContent = "Pedido recebido. Vamos confirmar os sabores e o frete Uber pelo WhatsApp e enviar o total com o link InfinitePay. Você ainda não foi cobrado.";
      form.reset();
      coupon.value = catalog.code(data.couponCode);
      requestId = crypto.randomUUID();
      refreshQuote();
    } catch {
      status.dataset.state = "error";
      status.textContent = "Não foi possível registrar agora. Seus dados continuam aqui. Tente novamente ou fale com a Kombú pelo WhatsApp.";
    } finally {
      busy = false;
      button.disabled = !validQuote;
      button.textContent = "Solicitar frete e confirmar pedido";
      status.hidden = false;
    }
  });
  refreshQuote();
})();
