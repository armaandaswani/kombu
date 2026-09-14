const { backendErrorPayload, hasSupabase, json, requireAdmin, supabaseFetch } = require("./_lib/kombu-backend");

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

// Reads the durable sales ledger. Inside the state document a sale disappears
// with the order it belongs to, and its revenue is recomputed from whatever the
// prices say today; sales_ledger keeps the row and the figure that was true when
// it was written. The document is still what the Vendas module renders, so a
// failure here degrades to "ledger unavailable" rather than affecting sales.
//
// Paging is keyset rather than offset, but unlike the audit trail the sort key
// is a DATE, and a day usually holds several sales. Paging on the date alone
// would silently drop every other sale sharing the last date on the page, so the
// cursor is the pair (sale_date, id) and the filter compares them together.
// Rows with no date sort last, and the cursor moves into that block once the
// dated rows run out.
function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

function encodeCursor(row) {
  if (!row) return null;
  return `${row.sale_date || ""}|${row.id}`;
}

function cursorFilter(cursor) {
  const [rawDate, rawId] = String(cursor || "").split("|");
  const id = Number(rawId);
  if (!Number.isFinite(id)) return null;
  if (!isIsoDate(rawDate)) {
    // Already inside the undated block: only older ledger rows remain.
    return [`sale_date=is.null`, `id=lt.${id}`];
  }
  // Earlier date, OR same date but further down the page, OR the undated tail.
  return [`or=(sale_date.lt.${rawDate},and(sale_date.eq.${rawDate},id.lt.${id}),sale_date.is.null)`];
}

module.exports = async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }
  if (!hasSupabase()) return json(res, 503, { ok: false, configured: false, error: "missing_supabase_env" });

  const url = new URL(req.url || "/api/sales", "http://localhost");
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(url.searchParams.get("limit")) || DEFAULT_LIMIT));
  const cursor = String(url.searchParams.get("cursor") || "").trim();
  const search = String(url.searchParams.get("search") || "").trim().slice(0, 120);
  const from = String(url.searchParams.get("from") || "").trim();
  const to = String(url.searchParams.get("to") || "").trim();

  const filters = [
    "state_id=eq.production",
    "select=id,sale_id,sale_date,movement_type,channel,price_type,customer_name,flavor,product_id,batch_code,order_id,qty,unit_price,discount,delivery,revenue,note",
    "order=sale_date.desc.nullslast,id.desc",
    `limit=${limit + 1}`,
  ];
  if (isIsoDate(from)) filters.push(`sale_date=gte.${from}`);
  if (isIsoDate(to)) filters.push(`sale_date=lte.${to}`);
  const paging = cursorFilter(cursor);
  if (paging) filters.push(...paging);
  if (search) {
    const safe = search.replace(/[(),*]/g, " ").trim();
    if (safe) {
      const like = `*${encodeURIComponent(safe)}*`;
      filters.push(
        `or=(customer_name.ilike.${like},flavor.ilike.${like},batch_code.ilike.${like},order_id.ilike.${like},note.ilike.${like})`,
      );
    }
  }

  try {
    const rows = await supabaseFetch(`/rest/v1/sales_ledger?${filters.join("&")}`);
    const list = Array.isArray(rows) ? rows : [];
    const hasMore = list.length > limit;
    const page = hasMore ? list.slice(0, limit) : list;
    const number = (value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };
    return json(res, 200, {
      ok: true,
      sales: page.map((row) => ({
        id: row.sale_id,
        date: row.sale_date || "",
        movementType: row.movement_type || "",
        channel: row.channel || "",
        priceType: row.price_type || "",
        customerName: row.customer_name || "",
        flavor: row.flavor || "",
        productId: row.product_id || "",
        batchCode: row.batch_code || "",
        orderId: row.order_id || "",
        qty: number(row.qty),
        unitPrice: number(row.unit_price),
        discount: number(row.discount),
        delivery: number(row.delivery),
        revenue: number(row.revenue),
        note: row.note || "",
      })),
      nextCursor: hasMore ? encodeCursor(page.at(-1)) : null,
    });
  } catch (error) {
    if (Number(error?.status) === 404 || error?.detail?.code === "PGRST205" || error?.detail?.code === "42P01") {
      return json(res, 200, { ok: true, sales: [], nextCursor: null, unavailable: true });
    }
    return json(res, 503, backendErrorPayload(error));
  }
};
