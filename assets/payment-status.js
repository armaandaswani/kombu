(() => {
  const text = document.querySelector("#paymentStatus");
  const button = document.querySelector("#checkPayment");
  async function check() {
    const id = new URLSearchParams(location.search).get("order_nsu");
    if (!id) { text.textContent = "Confira o recibo da InfinitePay ou fale com a Kombú pelo WhatsApp."; button.hidden = true; return; }
    button.disabled = true;
    try {
      const response = await fetch(`/api/payment-status?order_nsu=${encodeURIComponent(id)}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error("unavailable");
      text.textContent = result.status === "paid" ? "Pagamento confirmado. A Kombú vai combinar a entrega com você pelo WhatsApp." : ["refunded", "canceled"].includes(result.status) ? "O pagamento foi cancelado ou estornado. Fale com a Kombú para verificar o pedido." : "Ainda aguardamos a confirmação do pagamento. Se você já pagou, aguarde um instante e verifique novamente.";
    } catch { text.textContent = "Não foi possível verificar agora. Consulte o recibo da InfinitePay ou fale com a Kombú."; }
    finally { button.disabled = false; }
  }
  button.addEventListener("click", check);
  check();
})();
