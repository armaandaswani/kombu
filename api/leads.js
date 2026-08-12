const { backendErrorPayload, hasSupabase, json, requireAdmin, supabaseFetch } = require("./_lib/kombu-backend");

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

// Reads the durable lead archive. Inside the state document leads are capped at
// 500 and untouched ones are evicted as new submissions arrive, so the CRM is a
// rolling window; crm_leads keeps everything. The document is still what the
// Leads module renders, so a failure here degrades to "archive unavailable"
// rather than affecting the CRM itself.
module.exports = async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }
  if (!hasSupabase()) return json(res, 503, { ok: false, configured: false, error: "missing_supabase_env" });

  const url = new URL(req.url || "/api/leads", "http://localhost");
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(url.searchParams.get("limit")) || DEFAULT_LIMIT));
  const before = String(url.searchParams.get("before") || "").trim();
  const search = String(url.searchParams.get("search") || "").trim().slice(0, 120);

  const filters = [
    "state_id=eq.production",
    "select=lead_id,type,status,name,business,business_type,location,whatsapp,instagram,message,source,lead_created_at",
    "order=lead_created_at.desc.nullslast,id.desc",
    `limit=${limit + 1}`,
  ];
  if (before && Number.isFinite(Date.parse(before))) {
    filters.push(`lead_created_at=lt.${encodeURIComponent(new Date(before).toISOString())}`);
  }
  if (search) {
    const safe = search.replace(/[(),*]/g, " ").trim();
    if (safe) {
      const like = `*${encodeURIComponent(safe)}*`;
      filters.push(`or=(name.ilike.${like},business.ilike.${like},whatsapp.ilike.${like},message.ilike.${like},location.ilike.${like})`);
    }
  }

  try {
    const rows = await supabaseFetch(`/rest/v1/crm_leads?${filters.join("&")}`);
    const list = Array.isArray(rows) ? rows : [];
    const hasMore = list.length > limit;
    const page = hasMore ? list.slice(0, limit) : list;
    return json(res, 200, {
      ok: true,
      leads: page.map((row) => ({
        id: row.lead_id,
        type: row.type || "",
        status: row.status || "",
        name: row.name || "",
        business: row.business || "",
        businessType: row.business_type || "",
        location: row.location || "",
        whatsapp: row.whatsapp || "",
        instagram: row.instagram || "",
        message: row.message || "",
        source: row.source || "",
        createdAt: row.lead_created_at || "",
      })),
      nextBefore: hasMore ? page.at(-1)?.lead_created_at || null : null,
    });
  } catch (error) {
    if (Number(error?.status) === 404 || error?.detail?.code === "PGRST205" || error?.detail?.code === "42P01") {
      return json(res, 200, { ok: true, leads: [], nextBefore: null, unavailable: true });
    }
    return json(res, 503, backendErrorPayload(error));
  }
};
