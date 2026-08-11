const {
  ADMIN_EMAIL,
  escapeHtml,
  getAppState,
  hasSupabase,
  json,
  mutateAppState,
  sendEmail,
  supabaseFetch,
} = require("../_lib/kombu-backend");

// A serverless invocation can be cut short. Sending an unbounded number of
// emails and only recording them at the very end meant a timeout halfway through
// lost every marker and sent the whole batch again the next day.
const MAX_REMINDERS_PER_RUN = 25;

// email_events existed in the schema but nothing ever wrote to it. Using it as
// the record of what has been sent means a reminder survives even when the
// state write afterwards fails, which is what made duplicates possible.
async function reminderAlreadySent(referenceId) {
  if (!hasSupabase()) return false;
  const rows = await supabaseFetch(
    `/rest/v1/email_events?event_type=eq.payment_reminder&reference_id=eq.${encodeURIComponent(referenceId)}&select=id&limit=1`,
  ).catch(() => null);
  return Array.isArray(rows) && rows.length > 0;
}

async function recordEmailEvent({ referenceId, recipient, subject, providerId }) {
  if (!hasSupabase()) return;
  await supabaseFetch("/rest/v1/email_events", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      event_type: "payment_reminder",
      reference_id: referenceId,
      recipient,
      subject,
      provider: "resend",
      provider_id: providerId || null,
      status: "sent",
      payload: {},
    }),
  }).catch(() => {
    // The state marker below is the fallback; never fail a run over bookkeeping.
  });
}

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
  if (!secret) return false;
  return req.headers.authorization === `Bearer ${secret}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }
  if (!process.env.CRON_SECRET) return json(res, 503, { ok: false, error: "cron_not_configured", missing: ["CRON_SECRET"] });
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
  const alreadySent = [];
  let deferred = 0;
  for (const order of dueOrders) {
    if (sent.length >= MAX_REMINDERS_PER_RUN) {
      deferred = dueOrders.length - sent.length - alreadySent.length;
      break;
    }
    const due = paymentDueDate(order);
    const referenceId = `${order.id || order.code}:${due}`;
    if (await reminderAlreadySent(referenceId)) {
      // Backfill the state marker so the pre-filter catches it next time.
      reminders[referenceId] = reminders[referenceId] || { sentAt: new Date().toISOString(), source: "email_events" };
      alreadySent.push(order.code);
      continue;
    }
    // dueOrders already excludes anything not yet due, so this is due or overdue.
    const subject = `Cobrança Kombú: ${order.code} - vencimento ${due}`;
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
      // Recorded before the state write so a later failure cannot cause a resend.
      await recordEmailEvent({ referenceId, recipient: adminEmail, subject, providerId: email.id });
      reminders[referenceId] = { sentAt: new Date().toISOString(), emailId: email.id };
      sent.push(order.code);
    }
  }

  if (sent.length || alreadySent.length) {
    await mutateAppState((latestState) => {
      const latestReminders = latestState.notifications?.paymentReminders || {};
      latestState.notifications = {
        ...(latestState.notifications || {}),
        paymentReminders: { ...latestReminders, ...reminders },
      };
      return latestState;
    }, "payment-reminder-cron");
  }
  // `deferred` is not an error: the remaining reminders go out on the next run,
  // and email_events stops the ones already sent from going out twice.
  return json(res, 200, { ok: true, due: dueOrders.length, sent, alreadySent, deferred });
};
