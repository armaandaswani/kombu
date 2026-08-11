const { backendErrorPayload, getStateRow, hasSupabase, invariantRegressions, json, readBody, replaceAppState, requireAdmin, stateInvariantViolations, validateAppState } = require("./_lib/kombu-backend");
const { reconcileReservations } = require("./_lib/reservations");

// Reconciles for the response only. This used to persist the reconciled state and
// retry on conflict, so every authenticated read rewrote the whole production
// document and competed with real saves for the optimistic lock. Reads must not
// write: the next genuine save persists the same reconciliation.
// audit:false because entries generated on a read would otherwise be handed to
// the client and written back later, filling the capped audit log with noise.
async function getReconciledState(updatedBy = "reservation-reconciler") {
  const row = await getStateRow();
  if (!row) return { row: null, reconciled: null };
  const reconciled = reconcileReservations(row.state, { updatedBy, audit: false });
  return { row: { ...row, state: reconciled.state }, reconciled };
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

    // validateAppState only checks shapes and size, so until now a browser bug
    // could write any business nonsense it liked. Compare the incoming document
    // against the stored one and refuse a write that makes a rule worse than it
    // already is. Existing data may already violate some of these, so this is a
    // non-regression check, not a gate: it never blocks on pre-existing damage.
    // If the stored state cannot be read we cannot prove a regression, so the
    // write proceeds rather than blocking the company out of its own system.
    try {
      const current = await getStateRow();
      if (current?.state) {
        const regressions = invariantRegressions(
          stateInvariantViolations(current.state),
          stateInvariantViolations(reconciled.state),
        );
        if (regressions.length) {
          return json(res, 422, { ok: false, error: "state_invariants_regressed", regressions });
        }
      }
    } catch {
      // Fall through: a failed comparison must not stop a legitimate save.
    }

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
