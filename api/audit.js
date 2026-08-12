const { backendErrorPayload, hasSupabase, json, requireAdmin, supabaseFetch } = require("./_lib/kombu-backend");

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

// Reads the durable audit archive. The trail inside the state document is capped
// and loses history as soon as the cap is reached; audit_events keeps it all.
// This is the read side of that table - the document is still what the rest of
// the admin renders, so a failure here degrades to "history unavailable" rather
// than breaking anything.
module.exports = async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }
  if (!hasSupabase()) return json(res, 503, { ok: false, configured: false, error: "missing_supabase_env" });

  const url = new URL(req.url || "/api/audit", "http://localhost");
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(url.searchParams.get("limit")) || DEFAULT_LIMIT));
  // Keyset pagination on `at`, so paging stays correct while new entries arrive.
  const before = String(url.searchParams.get("before") || "").trim();
  const search = String(url.searchParams.get("search") || "").trim().slice(0, 120);

  const filters = [
    "state_id=eq.production",
    "select=at,actor,action,detail,entry",
    "order=at.desc,id.desc",
    `limit=${limit + 1}`,
  ];
  if (before && Number.isFinite(Date.parse(before))) {
    filters.push(`at=lt.${encodeURIComponent(new Date(before).toISOString())}`);
  }
  if (search) {
    // PostgREST needs commas and parentheses escaped inside an or() filter.
    const safe = search.replace(/[(),*]/g, " ").trim();
    if (safe) filters.push(`or=(action.ilike.*${encodeURIComponent(safe)}*,detail.ilike.*${encodeURIComponent(safe)}*)`);
  }

  try {
    const rows = await supabaseFetch(`/rest/v1/audit_events?${filters.join("&")}`);
    const list = Array.isArray(rows) ? rows : [];
    const hasMore = list.length > limit;
    const page = hasMore ? list.slice(0, limit) : list;
    return json(res, 200, {
      ok: true,
      entries: page.map((row) => ({
        at: row.at,
        user: row.actor || row.entry?.user || "",
        action: row.action || row.entry?.action || "",
        detail: row.detail || row.entry?.detail || "",
      })),
      nextBefore: hasMore ? page.at(-1)?.at || null : null,
    });
  } catch (error) {
    // The table may not exist yet in a given environment.
    if (Number(error?.status) === 404 || error?.detail?.code === "PGRST205" || error?.detail?.code === "42P01") {
      return json(res, 200, { ok: true, entries: [], nextBefore: null, unavailable: true });
    }
    return json(res, 503, backendErrorPayload(error));
  }
};
