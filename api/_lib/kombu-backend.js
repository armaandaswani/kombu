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

function newLeadId() {
  return `lead-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

// Lead ids arrive from the public, unauthenticated endpoint and are later used as
// dedupe keys and rendered into admin markup, so restrict them to a safe charset.
function cleanId(value) {
  return String(value || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
}

function normalizeLead(payload) {
  const body = normalizeBody(payload);
  const lead = body.lead || body;
  return {
    id: cleanId(lead.id) || newLeadId(),
    type: cleanText(lead.type || "contato", 40),
    status: cleanText(lead.status || "novo", 40),
    name: cleanText(lead.name || lead.nome, 120),
    business: cleanText(lead.business || lead.negocio, 160),
    businessType: cleanText(lead.businessType || lead.tipo, 80),
    location: cleanText(lead.location || lead.bairro, 160),
    whatsapp: cleanText(lead.whatsapp, 40),
    instagram: cleanText(lead.instagram, 80),
    message: cleanText(lead.message || lead.mensagem, 4000),
    emailTo: cleanText(lead.emailTo, 160) || process.env.LEAD_NOTIFY_EMAIL || ADMIN_EMAIL,
    source: cleanText(lead.source, 80) || "site-publico",
    createdAt: cleanText(lead.createdAt, 40) || new Date().toISOString(),
  };
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

// Per-instance sliding window. Vercel runs several instances and recycles them,
// so this is a speed bump rather than a guarantee: it stops one source hammering
// a warm instance, which is what actually happens. A strict limit would need
// shared storage, and the only shared store here is the production state
// document, which is the thing being protected.
const rateBuckets = new Map();

function clientIp(req) {
  const forwarded = String(req?.headers?.["x-forwarded-for"] || "");
  return forwarded.split(",")[0].trim() || req?.socket?.remoteAddress || "unknown";
}

function rateLimit(key, { limit, windowMs, now = Date.now() }) {
  if (rateBuckets.size > 5000) rateBuckets.clear();
  const hits = (rateBuckets.get(key) || []).filter((at) => now - at < windowMs);
  if (hits.length >= limit) {
    rateBuckets.set(key, hits);
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - hits[0])) / 1000)) };
  }
  hits.push(now);
  rateBuckets.set(key, hits);
  return { allowed: true, retryAfterSeconds: 0 };
}

const MAX_LEADS = 500;

// Leads someone has already worked are not disposable. The old cap kept the
// newest 500 and dropped the rest, so roughly 500 submissions to the public
// form would silently flush the entire CRM. Only untouched "novo" leads are
// evicted now, oldest first, and the original ordering is preserved.
function capLeads(leads) {
  if (!Array.isArray(leads) || leads.length <= MAX_LEADS) return leads;
  const worked = [];
  const untouched = [];
  leads.forEach((lead) => {
    const status = String(lead?.status || "novo").trim().toLowerCase();
    (status === "novo" ? untouched : worked).push(lead);
  });
  if (worked.length >= MAX_LEADS) {
    const keep = new Set(worked.slice(0, MAX_LEADS));
    return leads.filter((lead) => keep.has(lead));
  }
  const keep = new Set([...worked, ...untouched.slice(0, MAX_LEADS - worked.length)]);
  return leads.filter((lead) => keep.has(lead));
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

// The entire business lives in one app_state row, so a single bad write with no
// snapshot is unrecoverable. There is no automated backup otherwise: the daily
// cron cannot help because CRON_SECRET is not configured, and it would be the
// wrong place anyway - a backup that depends on a job nobody has switched on is
// not a backup. Snapshots are therefore taken as a side effect of real use.
//
// Everything here is best-effort. A snapshot must never slow down or fail a
// save, so the common path is an in-memory timestamp comparison and every
// failure is swallowed.
const SNAPSHOT_INTERVAL_MS = 24 * 60 * 60 * 1000;
const SNAPSHOT_RETENTION_DAYS = 30;
let lastSnapshotAttemptAt = 0;

async function snapshotAppStateIfDue(state, note = "") {
  if (!hasSupabase()) return { ok: false, reason: "missing_supabase_env" };
  const now = Date.now();
  if (now - lastSnapshotAttemptAt < SNAPSHOT_INTERVAL_MS) return { ok: false, reason: "not_due" };
  // Set before the work so a failing table cannot cause a request-per-save storm.
  lastSnapshotAttemptAt = now;
  try {
    // This instance may be newly started, so confirm against the table rather
    // than trusting the in-memory marker alone.
    const recent = await supabaseFetch(
      `/rest/v1/app_state_backups?state_id=eq.${encodeURIComponent(STATE_ID)}&select=created_at&order=created_at.desc&limit=1`,
    );
    const lastAt = Array.isArray(recent) && recent[0]?.created_at ? Date.parse(recent[0].created_at) : 0;
    if (Number.isFinite(lastAt) && lastAt > 0 && now - lastAt < SNAPSHOT_INTERVAL_MS) {
      return { ok: false, reason: "not_due" };
    }

    await supabaseFetch("/rest/v1/app_state_backups", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ state_id: STATE_ID, state, note: note || "automatic daily snapshot" }),
    });

    const cutoff = new Date(now - SNAPSHOT_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    await supabaseFetch(
      `/rest/v1/app_state_backups?state_id=eq.${encodeURIComponent(STATE_ID)}&created_at=lt.${encodeURIComponent(cutoff)}`,
      { method: "DELETE", headers: { Prefer: "return=minimal" } },
    ).catch(() => {});
    return { ok: true };
  } catch (error) {
    // Most likely the table does not exist yet. Never surface this to the caller.
    return { ok: false, reason: error?.code || "snapshot_failed" };
  }
}

async function replaceAppState(state, updatedBy = "system", expectedUpdatedAt = "") {
  if (!hasSupabase()) return { ok: false, reason: "missing_supabase_env" };
  if (!expectedUpdatedAt) {
    // A caller with no version token can only ever create the very first row.
    // Without this check a client that momentarily believed no state existed
    // (a transient empty read) would overwrite the entire production document
    // with its local cache, with no concurrency check at all.
    const existing = await getStateRow();
    if (existing) throw requestError("state_conflict", 409);
    return upsertAppState(state, updatedBy);
  }

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
  // Best effort and already-written: a snapshot failure cannot affect this save.
  await snapshotAppStateIfDue(state, `snapshot after write by ${updatedBy}`);
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

// The server has never enforced a single business rule: validateAppState checks
// shapes and size, so every invariant is upheld only by browser JavaScript and a
// bug there writes straight through. These are the rules that are unambiguous
// enough to check cheaply on the server.
//
// The counts are used as a NON-REGRESSION check rather than a gate. Existing
// production data may already violate some of these, and refusing every save
// until it is clean would lock the company out of its own system. A write is
// rejected only when it makes some rule worse than the stored state already is.
function stateInvariantViolations(state) {
  const byRule = {
    delivered_over_ordered: 0,
    reserved_over_ordered: 0,
    negative_quantity: 0,
    non_finite_quantity: 0,
    allocation_unknown_batch: 0,
    batch_over_allocated: 0,
    negative_material_stock: 0,
  };
  if (!state || typeof state !== "object") return { byRule, total: 0 };

  const list = (value) => (Array.isArray(value) ? value : []);
  const orders = list(state.orders);
  const batches = list(state.batches);
  const sales = list(state.sales);

  const isBadNumber = (value) => value !== undefined && value !== null && value !== "" && !Number.isFinite(Number(value));
  const negative = (value) => Number.isFinite(Number(value)) && Number(value) < 0;

  const producedByCode = new Map();
  batches.forEach((batch) => {
    const code = String(batch?.code || batch?.id || "");
    const produced = Number(
      [batch?.actual, batch?.inventoryQty, batch?.actualYield, batch?.quantity].find(
        (value) => value !== undefined && value !== null && String(value).trim() !== "" && Number.isFinite(Number(value)),
      ) ?? 0,
    );
    if (isBadNumber(batch?.actual)) byRule.non_finite_quantity += 1;
    if (negative(produced)) byRule.negative_quantity += 1;
    if (code) producedByCode.set(code, (producedByCode.get(code) || 0) + Math.max(0, produced));
  });

  const soldByCode = new Map();
  sales.forEach((sale) => {
    const code = String(sale?.batchCode || "");
    if (!code) return;
    const qty = Number(sale?.qty || sale?.quantity || 0);
    if (isBadNumber(sale?.qty)) byRule.non_finite_quantity += 1;
    if (Number.isFinite(qty)) soldByCode.set(code, (soldByCode.get(code) || 0) + qty);
  });

  const closed = new Set(["entregue", "cancelado", "cancelada", "concluido", "concluida", "delivered", "cancelled", "canceled", "completed"]);
  const isOpen = (order) =>
    !closed.has(
      String(order?.status || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim(),
    );

  const allocatedByCode = new Map();
  orders.forEach((order) => {
    const open = isOpen(order);
    list(order?.items).forEach((item) => {
      const qty = Number(item?.qty || 0);
      if (isBadNumber(item?.qty) || isBadNumber(item?.deliveredQty) || isBadNumber(item?.reservedQty)) {
        byRule.non_finite_quantity += 1;
      }
      if (negative(item?.qty) || negative(item?.deliveredQty)) byRule.negative_quantity += 1;
      if (Number.isFinite(qty) && Number(item?.deliveredQty || 0) > qty) byRule.delivered_over_ordered += 1;
      if (Number.isFinite(qty) && Number(item?.reservedQty || 0) > qty) byRule.reserved_over_ordered += 1;

      list(item?.allocations).forEach((allocation) => {
        const code = String(allocation?.batchCode || "");
        const allocated = Number(allocation?.qty || allocation?.quantity || 0);
        if (isBadNumber(allocation?.qty)) byRule.non_finite_quantity += 1;
        if (negative(allocated)) byRule.negative_quantity += 1;
        if (code && !producedByCode.has(code)) byRule.allocation_unknown_batch += 1;
        // Only open orders hold stock; a closed order keeps its allocations as
        // a historical record and must not count against the batch.
        if (open && code && Number.isFinite(allocated)) {
          allocatedByCode.set(code, (allocatedByCode.get(code) || 0) + Math.max(0, allocated));
        }
      });
    });
  });

  producedByCode.forEach((produced, code) => {
    const committed = (allocatedByCode.get(code) || 0) + Math.max(0, soldByCode.get(code) || 0);
    // Rounded to avoid flagging floating point dust as a real over-allocation.
    if (Math.round((committed - produced) * 1000) / 1000 > 0) byRule.batch_over_allocated += 1;
  });

  [...list(state.ingredients), ...list(state.packaging)].forEach((item) => {
    if (isBadNumber(item?.stock)) byRule.non_finite_quantity += 1;
    if (negative(item?.stock)) byRule.negative_material_stock += 1;
  });

  return { byRule, total: Object.values(byRule).reduce((sum, count) => sum + count, 0) };
}

// Which rules the incoming state makes worse than the stored state already is.
function invariantRegressions(before, after) {
  return Object.keys(after?.byRule || {})
    .filter((rule) => Number(after.byRule[rule] || 0) > Number(before?.byRule?.[rule] || 0))
    .map((rule) => ({ rule, was: Number(before?.byRule?.[rule] || 0), now: Number(after.byRule[rule] || 0) }));
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
    state.leads = capLeads(leads);
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
  const explicitSecret = process.env.ADMIN_SESSION_SECRET || "";
  if (explicitSecret) return explicitSecret;

  const backendSecret = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!backendSecret) return "";
  return crypto
    .createHmac("sha256", backendSecret)
    .update("kombu-admin-session-v1")
    .digest("hex");
}

function hasSessionSecret() {
  return Boolean(sessionSecret());
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
  hasSessionSecret,
  appendLeadToState,
  capLeads,
  clearSessionCookie,
  clientIp,
  invariantRegressions,
  rateLimit,
  snapshotAppStateIfDue,
  stateInvariantViolations,
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
