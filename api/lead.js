const ADMIN_EMAIL = "armaandaswani@icloud.com";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

function normalizeLead(payload) {
  const body = normalizeBody(payload);
  const lead = body.lead || body;
  return {
    type: lead.type || "contato",
    status: lead.status || "novo",
    name: lead.name || lead.nome || "",
    business: lead.business || lead.negocio || "",
    businessType: lead.businessType || lead.tipo || "",
    location: lead.location || lead.bairro || "",
    whatsapp: lead.whatsapp || "",
    instagram: lead.instagram || "",
    message: lead.message || lead.mensagem || "",
    source: lead.source || "site-publico",
    createdAt: lead.createdAt || new Date().toISOString(),
  };
}

function leadSubject(lead) {
  const prefix = lead.type === "revenda" ? "Novo lead de revenda" : "Novo contato";
  const name = lead.name || lead.business || lead.whatsapp || "sem nome";
  return `${prefix} Kombú: ${name}`;
}

function leadText(lead) {
  return [
    leadSubject(lead),
    "",
    `Tipo: ${lead.type}`,
    `Status: ${lead.status}`,
    `Nome: ${lead.name || "-"}`,
    `Negócio: ${lead.business || "-"}`,
    `Tipo de negócio: ${lead.businessType || "-"}`,
    `Local: ${lead.location || "-"}`,
    `WhatsApp: ${lead.whatsapp || "-"}`,
    `Instagram: ${lead.instagram || "-"}`,
    `Origem: ${lead.source || "-"}`,
    `Criado em: ${lead.createdAt}`,
    "",
    "Mensagem:",
    lead.message || "-",
  ].join("\n");
}

function leadHtml(lead) {
  const rows = [
    ["Tipo", lead.type],
    ["Status", lead.status],
    ["Nome", lead.name || "-"],
    ["Negócio", lead.business || "-"],
    ["Tipo de negócio", lead.businessType || "-"],
    ["Local", lead.location || "-"],
    ["WhatsApp", lead.whatsapp || "-"],
    ["Instagram", lead.instagram || "-"],
    ["Origem", lead.source || "-"],
    ["Criado em", lead.createdAt],
  ]
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;color:#59635d;font-weight:700;border-bottom:1px solid #dfe5df">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;color:#191c1c;border-bottom:1px solid #dfe5df">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#191c1c;line-height:1.5">
      <h1 style="margin:0 0 14px;font-size:24px;color:#2d4b28">${escapeHtml(leadSubject(lead))}</h1>
      <table style="width:100%;border-collapse:collapse;border:1px solid #dfe5df">${rows}</table>
      <h2 style="margin:22px 0 8px;font-size:18px;color:#2d4b28">Mensagem</h2>
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(lead.message || "-")}</p>
    </div>
  `;
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const lead = normalizeLead(req.body);
  if (!lead.name && !lead.business && !lead.whatsapp && !lead.message) {
    return res.status(400).json({ ok: false, error: "missing_lead_data" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL || ADMIN_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL || "Kombú Leads <onboarding@resend.dev>";

  if (!apiKey) {
    return res.status(202).json({
      ok: true,
      emailSent: false,
      reason: "missing_resend_api_key",
      to,
    });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: leadSubject(lead),
        html: leadHtml(lead),
        text: leadText(lead),
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        emailSent: false,
        error: "resend_error",
        detail: result,
      });
    }

    return res.status(200).json({ ok: true, emailSent: true, to, id: result.id });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      emailSent: false,
      error: "notification_failed",
      detail: error.message,
    });
  }
};
