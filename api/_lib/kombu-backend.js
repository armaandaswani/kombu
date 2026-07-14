const crypto = require("crypto");

const ADMIN_EMAIL = "armaandaswani@icloud.com";
const SESSION_COOKIE = "kombu_admin_session";
const STATE_ID = "production";
const PUBLIC_MEDIA_BUCKET = process.env.SUPABASE_PUBLIC_MEDIA_BUCKET || "public-media";
const DEFAULT_BODY_LIMIT = 1024 * 1024;
const STATE_BODY_LIMIT = 5 * 1024 * 1024;

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function requestError(code, status = 400) {
  const error = new Error(code);
  error.code = code;
  error.status = status;
  return error;
}

function readBody(req, options = {}) {
  const maxBytes = Number(options.maxBytes || DEFAULT_BODY_LIMIT);
  if (req.body !== undefined && req.body !== null) {
    const body = normalizeBody(req.body);
    const size = Buffer.byteLength(typeof req.body === "string" ? req.body : JSON.stringify(body));
    if (size > maxBytes) return Promise.reject(requestError("request_too_large", 413));
    return Promise.resolve(body);
  }

  return new Promise((resolve, reject) => {
    let raw = "";
    let size = 0;
    let failed = false;
    req.on("data", (chunk) => {
      if (failed) return;
      size += Buffer.byteLength(chunk);
      if (size > maxBytes) {
        failed = true;
        raw = "";
        reject(requestError("request_too_large", 413));
        return;
      }
      raw += chunk;
    });
    req.on("end", () => {
      if (failed) return;
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        if (String(req.headers["content-type"] || "").includes("application/x-www-form-urlencoded")) {
          return resolve(Object.fromEntries(new URLSearchParams(raw)));
        }
        reject(requestError("invalid_json", 400));
      }
    });
    req.on("error", reject);
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
    type: cleanText(lead.type || "contato", 40),
    status: cleanText(lead.status || "novo", 40),
    name: cleanText(lead.name || lead.nome, 120),
    business: cleanText(lead.business || lead.negocio, 160),
    businessType: cleanText(lead.businessType || lead.tipo, 80),
    location: cleanText(lead.location || lead.bairro, 160),
    whatsapp: cleanText(lead.whatsapp, 40),
    instagram: cleanText(lead.instagram, 80),
    message: cleanText(lead.message || lead.mensagem, 4000),
    emailTo: lead.emailTo || process.env.LEAD_NOTIFY_EMAIL || ADMIN_EMAIL,
    source: lead.source || "site-publico",
    createdAt: lead.createdAt || new Date().toISOString(),
  };
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
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

function backendErrorPayload(error) {
  const status = Number(error?.status || 500);
  const detail = error?.detail;
  const supabaseCode = detail?.code || detail?.error || "";
  const detailText = typeof detail === "string" ? detail : detail?.message || detail?.hint || supabaseCode || "";
  let code = error?.code || error?.message || "server_error";
  let hint = "Verifique as variaveis de ambiente da Vercel e o setup do Supabase.";

  if (code === "missing_supabase_env") {
    hint = "Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY na Vercel.";
  } else if (code === "fetch failed" || /fetch failed/i.test(String(error?.message || ""))) {
    code = "supabase_connection_failed";
    hint = "Nao foi possivel conectar ao Supabase. Confira se SUPABASE_URL e a Project URL correta.";
  } else if (status === 401 || status === 403) {
    code = "supabase_credentials_invalid";
    hint = "Confira se SUPABASE_SERVICE_ROLE_KEY e a chave service_role secreta, nao a anon/public key.";
  } else if (status === 404 || supabaseCode === "PGRST205" || supabaseCode === "42P01" || /app_state/i.test(detailText)) {
    code = "supabase_schema_missing";
    hint = "O Supabase esta conectado, mas a tabela app_state ainda nao existe. Rode o arquivo supabase/schema.sql no SQL Editor do Supabase.";
  } else if (code === "supabase_request_failed") {
    hint = "O Supabase respondeu erro. Confira SUPABASE_URL, SERVICE_ROLE_KEY e se o schema SQL foi executado.";
  }

  return {
    ok: false,
    configured: hasSupabase(),
    error: code,
    supabaseStatus: status,
    detail: detailText || undefined,
    hint,
  };
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
  const rows = await supabaseFetch("/rest/v1/app_state", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(payload),
  });
  return { ok: true, updatedAt: rows?.[0]?.updated_at || payload.updated_at };
}

async function replaceAppState(state, updatedBy = "system", expectedUpdatedAt = "") {
  if (!hasSupabase()) return { ok: false, reason: "missing_supabase_env" };
  if (!expectedUpdatedAt) return upsertAppState(state, updatedBy);

  const updatedAt = new Date().toISOString();
  const rows = await supabaseFetch(
    `/rest/v1/app_state?id=eq.${encodeURIComponent(STATE_ID)}&updated_at=eq.${encodeURIComponent(expectedUpdatedAt)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ state, updated_by: updatedBy, updated_at: updatedAt }),
    },
  );
  if (!Array.isArray(rows) || rows.length === 0) throw requestError("state_conflict", 409);
  return { ok: true, updatedAt: rows[0]?.updated_at || updatedAt };
}

async function mutateAppState(mutator, updatedBy = "system", retries = 4) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const row = await getStateRow();
    const current = row?.state && typeof row.state === "object" ? structuredCloneSafe(row.state) : {};
    const next = await mutator(current);
    try {
      const result = await replaceAppState(next, updatedBy, row?.updated_at || "");
      return { ...result, state: next };
    } catch (error) {
      if (error.code !== "state_conflict" || attempt === retries - 1) throw error;
    }
  }
  throw requestError("state_conflict", 409);
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function validateAppState(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) return "invalid_state";
  const serialized = JSON.stringify(state);
  if (Buffer.byteLength(serialized) > STATE_BODY_LIMIT) return "state_too_large";
  const arrayFields = [
    "products", "ingredients", "packaging", "suppliers", "partners", "recipes", "batches",
    "sales", "orders", "leads", "purchases", "expenses", "costSources", "audit",
  ];
  for (const key of arrayFields) {
    if (state[key] !== undefined && !Array.isArray(state[key])) return `invalid_${key}`;
    if (Array.isArray(state[key]) && state[key].length > 10000) return `too_many_${key}`;
  }
  for (const key of ["cms", "notifications", "settings"]) {
    if (state[key] !== undefined && (!state[key] || typeof state[key] !== "object" || Array.isArray(state[key]))) {
      return `invalid_${key}`;
    }
  }
  return "";
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
  await mutateAppState((state) => {
    const leads = Array.isArray(state.leads) ? state.leads : [];
    if (!leads.some((item) => item.id === lead.id)) leads.unshift(lead);
    state.leads = leads.slice(0, 500);
    state.notifications = {
      ...(state.notifications || {}),
      adminEmail: process.env.LEAD_NOTIFY_EMAIL || ADMIN_EMAIL,
      provider: "resend",
    };
    return state;
  }, "public-lead");
  return { ok: true, lead };
}

function base64Url(input) {
  return Buffer.from(input).toString("base64url");
}

function adminPassword() {
  return process.env.ADMIN_PORTAL_PASSWORD || process.env.ADMIN_PASSWORD || "";
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function signPayload(payload) {
  if (!sessionSecret()) throw requestError("admin_auth_not_configured", 503);
  const encoded = base64Url(JSON.stringify(payload));
  const signature = crypto.createHmac("sha256", sessionSecret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function verifyToken(token = "") {
  if (!sessionSecret()) return null;
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
  backendErrorPayload,
  json,
  normalizeLead,
  mutateAppState,
  readBody,
  replaceAppState,
  requireAdmin,
  sanitizePublicState,
  sendEmail,
  setSessionCookie,
  supabaseFetch,
  upsertAppState,
  validateAppState,
};
