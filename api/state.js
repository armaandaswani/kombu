const { backendErrorPayload, getStateRow, hasSupabase, json, readBody, replaceAppState, requireAdmin, validateAppState } = require("./_lib/kombu-backend");
const { reconcileReservations } = require("./_lib/reservations");

async function getReconciledState(updatedBy = "reservation-reconciler", retries = 4) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const row = await getStateRow();
    if (!row) return { row: null, reconciled: null };

    const reconciled = reconcileReservations(row.state, { updatedBy });
    if (!reconciled.changed) return { row, reconciled };

    try {
      const saved = await replaceAppState(reconciled.state, updatedBy, row.updated_at || "");
      return {
        row: {
          ...row,
          state: reconciled.state,
          updated_at: saved.updatedAt || row.updated_at,
        },
        reconciled,
      };
    } catch (error) {
      if (error.code !== "state_conflict" || attempt === retries - 1) throw error;
    }
  }

  return { row: null, reconciled: null };
}

module.exports = async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  if (req.method === "GET") {
    try {
      const { row, reconciled } = await getReconciledState();
      return json(res, 200, {
        ok: true,
        configured: hasSupabase(),
        exists: Boolean(row),
        state: row?.state || null,
        updatedAt: row?.updated_at || null,
        reconciled: Boolean(reconciled?.changed),
        reservations: reconciled?.summary || null,
      });
    } catch (error) {
      return json(res, 503, backendErrorPayload(error));
    }
  }

  if (req.method === "PUT" || req.method === "POST") {
    let body;
    try {
      body = await readBody(req, { maxBytes: 5 * 1024 * 1024 });
    } catch (error) {
      return json(res, error.status || 400, { ok: false, error: error.code || "invalid_request" });
    }
    if (!body.state || typeof body.state !== "object") {
      return json(res, 400, { ok: false, error: "missing_state" });
    }
    const reconciled = reconcileReservations(body.state, {
      updatedBy: session.role || "admin",
    });
    const validationError = validateAppState(reconciled.state);
    if (validationError) return json(res, validationError === "state_too_large" ? 413 : 422, { ok: false, error: validationError });
    try {
      const result = await replaceAppState(reconciled.state, session.role || "admin", String(body.updatedAt || ""));
      return json(res, result.ok ? 200 : 202, {
        ...result,
        state: reconciled.state,
        reconciled: reconciled.changed,
        reservations: reconciled.summary,
      });
    } catch (error) {
      if (error.code === "state_conflict") {
        const row = await getStateRow().catch(() => null);
        return json(res, 409, { ok: false, error: "state_conflict", updatedAt: row?.updated_at || null });
      }
      return json(res, 503, backendErrorPayload(error));
    }
  }

  res.setHeader("Allow", "GET, POST, PUT");
  return json(res, 405, { ok: false, error: "method_not_allowed" });
};
