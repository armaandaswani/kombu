const {
  ADMIN_EMAIL,
  escapeHtml,
  getAppState,
  json,
  sendEmail,
  upsertAppState,
} = require("../_lib/kombu-backend");

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysIso(dateIso, days) {
  const date = new Date(`${dateIso || todayIso()}T00:00:00`);
  date.setDate(date.getDate() + Number(days || 0));
  return date.toISOString().slice(0, 10);
}

function orderItems(order) {
  return Array.isArray(order?.items) ? order.items : [];
}

function orderTotal(order) {
  return orderItems(order).reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.unitPrice || 0), 0);
}

function paymentDueDate(order) {
  if (order.paymentDueDate) return order.paymentDueDate;
  if (order.deliveredAt) return addDaysIso(order.deliveredAt, 15);
  return "";
}

function isReceivable(order) {
  return order?.status === "entregue" && !["pago", "cancelado"].includes(order.paymentStatus);
}

function brl(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));
}

function authorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return req.headers.authorization === `Bearer ${secret}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }
  if (!authorized(req)) return json(res, 401, { ok: false, error: "invalid_cron_secret" });

  const state = (await getAppState()) || {};
  const today = todayIso();
  const reminders = state.notifications?.paymentReminders || {};
  const adminEmail = state.notifications?.adminEmail || process.env.LEAD_NOTIFY_EMAIL || ADMIN_EMAIL;
  const dueOrders = (state.orders || []).filter((order) => {
    const due = paymentDueDate(order);
    if (!isReceivable(order) || !due || due > today) return false;
    return !reminders[`${order.id || order.code}:${due}`];
  });

  const sent = [];
  for (const order of dueOrders) {
    const due = paymentDueDate(order);
    const subject = `Cobrança Kombú: ${order.code} vence ${due <= today ? "hoje/está em aberto" : due}`;
    const lines = [
      `Pedido: ${order.code}`,
      `Cliente: ${order.customerName || "-"}`,
      `Negócio: ${order.businessName || "-"}`,
      `WhatsApp: ${order.whatsapp || "-"}`,
      `Entrega: ${order.deliveredAt || "-"}`,
      `Receber até: ${due}`,
      `Valor: ${brl(orderTotal(order))}`,
      "",
      "Itens:",
      ...orderItems(order).map((item) => `- ${item.qty}x ${item.flavor || item.productName || item.productId || "item"}`),
    ];
    const email = await sendEmail({
      to: adminEmail,
      subject,
      text: lines.join("\n"),
      html: `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#191c1c"><h1 style="font-size:22px;color:#2d4b28">${escapeHtml(subject)}</h1><pre style="white-space:pre-wrap;font-family:Arial,sans-serif">${escapeHtml(lines.join("\n"))}</pre></div>`,
    });
    if (email.ok) {
      reminders[`${order.id || order.code}:${due}`] = { sentAt: new Date().toISOString(), emailId: email.id };
      sent.push(order.code);
    }
  }

  state.notifications = { ...(state.notifications || {}), paymentReminders: reminders };
  if (sent.length) await upsertAppState(state, "payment-reminder-cron");
  return json(res, 200, { ok: true, due: dueOrders.length, sent });
};
