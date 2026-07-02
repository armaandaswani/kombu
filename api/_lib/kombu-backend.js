const crypto = require("crypto");

const ADMIN_EMAIL = "armaandaswani@icloud.com";
const SESSION_COOKIE = "kombu_admin_session";
const STATE_ID = "production";
const PUBLIC_MEDIA_BUCKET = process.env.SUPABASE_PUBLIC_MEDIA_BUCKET || "public-media";

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
  });
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
    id: lead.id || `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: lead.type || "contato",
    status: lead.status || "novo",
    name: lead.name || lead.nome || "",
    business: lead.business || lead.negocio || "",
    businessType: lead.businessType || lead.tipo || "",
    location: lead.location || lead.bairro || "",
    whatsapp: lead.whatsapp || "",
    instagram: lead.instagram || "",
    message: lead.message || lead.mensagem || "",
    emailTo: lead.emailTo || process.env.LEAD_NOTIFY_EMAIL || ADMIN_EMAIL,
    source: lead.source || "site-publico",
    createdAt: lead.createdAt || new Date().toISOString(),
  };
}

function supabaseConfig() {
  return {
    url: (process.env.SUPABASE_URL || "").replace(/\/$/, ""),
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  };
}

function hasSupabase() {
  const config = supabaseConfig();
  return Boolean(config.url && config.serviceRoleKey);
}

async function supabaseFetch(path, options = {}) {
  const config = supabaseConfig();
  if (!config.url || !config.serviceRoleKey) {
    const error = new Error("missing_supabase_env");
    error.code = "missing_supabase_env";
    throw error;
  }
  const response = await fetch(`${config.url}${path}`, {
    ...options,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!response.ok) {
    const error = new Error("supabase_request_failed");
    error.status = response.status;
    error.detail = data;
    throw error;
  }
  return data;
}

async function getStateRow() {
  if (!hasSupabase()) return null;
  const rows = await supabaseFetch(`/rest/v1/app_state?id=eq.${STATE_ID}&select=id,state,updated_at`);
  return Array.isArray(rows) ? rows[0] || null : null;
}

async function getAppState() {
  const row = await getStateRow();
  return row?.state || null;
}

async function upsertAppState(state, updatedBy = "system") {
  if (!hasSupabase()) return { ok: false, reason: "missing_supabase_env" };
  const payload = {
    id: STATE_ID,
    state,
    updated_by: updatedBy,
    updated_at: new Date().toISOString(),
  };
  await supabaseFetch("/rest/v1/app_state", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(payload),
  });
  return { ok: true };
}

function sanitizePublicState(state = {}) {
  return {
    cms: state.cms || {},
    partners: Array.isArray(state.partners) ? state.partners.filter((partner) => partner.visible) : [],
    notifications: {
      adminEmail: state.notifications?.adminEmail || ADMIN_EMAIL,
    },
  };
}

async function appendLeadToState(leadPayload) {
  const lead = normalizeLead(leadPayload);
  if (!hasSupabase()) return { ok: false, reason: "missing_supabase_env", lead };
  const state = (await getAppState()) || {};
  const leads = Array.isArray(state.leads) ? state.leads : [];
  if (!leads.some((item) => item.id === lead.id)) leads.unshift(lead);
  state.leads = leads.slice(0, 500);
  state.notifications = {
    ...(state.notifications || {}),
    adminEmail: process.env.LEAD_NOTIFY_EMAIL || ADMIN_EMAIL,
    provider: "resend",
  };
  await upsertAppState(state, "public-lead");
  return { ok: true, lead };
}

function base64Url(input) {
  return Buffer.from(input).toString("base64url");
}

function adminPassword() {
  return process.env.ADMIN_PORTAL_PASSWORD || process.env.ADMIN_PASSWORD || "Rssb2010";
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PORTAL_PASSWORD || process.env.ADMIN_PASSWORD || "kombu-local-session-secret";
}

function signPayload(payload) {
  const encoded = base64Url(JSON.stringify(payload));
  const signature = crypto.createHmac("sha256", sessionSecret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function verifyToken(token = "") {
  const [encoded, signature] = String(token).split(".");
  if (!encoded || !signature) return null;
  const expected = crypto.createHmac("sha256", sessionSecret()).update(encoded).digest("base64url");
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function cookieOptions(req, maxAgeSeconds) {
  const host = req.headers.host || "";
  const secure = !host.includes("localhost") && !host.includes("127.0.0.1");
  return [
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

function setSessionCookie(req, res, payload) {
  const token = signPayload(payload);
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=${token}; ${cookieOptions(req, 60 * 60 * 12)}`);
}

function clearSessionCookie(req, res) {
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; ${cookieOptions(req, 0)}`);
}

function parseCookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || "")
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const index = item.indexOf("=");
        return index >= 0 ? [item.slice(0, index), decodeURIComponent(item.slice(index + 1))] : [item, ""];
      }),
  );
}

function requireAdmin(req, res) {
  const token = parseCookies(req)[SESSION_COOKIE];
  const session = verifyToken(token);
  if (!session) {
    json(res, 401, { ok: false, error: "not_authenticated" });
    return null;
  }
  return session;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function emailProviderReady() {
  return Boolean(process.env.RESEND_API_KEY);
}

async function sendEmail({ to, from, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "missing_resend_api_key" };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: from || process.env.LEAD_FROM_EMAIL || "Kombú <onboarding@resend.dev>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) return { ok: false, status: response.status, detail: result };
  return { ok: true, id: result.id };
}

module.exports = {
  ADMIN_EMAIL,
  PUBLIC_MEDIA_BUCKET,
  adminPassword,
  appendLeadToState,
  clearSessionCookie,
  emailProviderReady,
  escapeHtml,
  getAppState,
  getStateRow,
  hasSupabase,
  json,
  normalizeLead,
  readBody,
  requireAdmin,
  sanitizePublicState,
  sendEmail,
  setSessionCookie,
  supabaseFetch,
  upsertAppState,
};
