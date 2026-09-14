# Kombú platform — engineering handoff

You are taking on engineering work for **Kombú**, a live production ERP for a
kombucha business in Manaus, Brazil. It is in daily use by the owner to run
real orders, real stock and real money. **There is no staging environment.**
Treat every change as going straight to production, because it does.

Read this whole document before touching anything.

---

## 1. Where the code is

| | |
|---|---|
| Repo on disk | `/Users/armaandaswani/Desktop/Kombucha/Kombu New Site` |
| Git remote | `https://github.com/armaandaswani/kombu.git` |
| Working branch | `fix/xss-output-escaping` |
| Production branch | `main` (auto-deploys to Vercel on push) |
| Live site | https://www.kombukombucha.com.br — admin at `/admin` |
| Last commit | `a440cfa` (branch and `main` are identical) |

The working branch and `main` currently point at the same commit. That is
normal here — see §6 for why pushes go `branch → main` rather than committing
on `main` directly.

---

## 2. Architecture in one page

Static HTML/JS plus Vercel serverless functions. **No build step. No npm
dependencies** — `package.json` declares none, deliberately: Vercel installs
dependencies on deploy, and a postinstall failure would break the build. Do not
add a dependency without saying so explicitly and explaining why.

```
admin.html, index.html      the two pages
assets/admin.js             ~11,000 lines — ALL admin business logic lives here
assets/public.js            public site
assets/kombu.css            all styles
api/_lib/kombu-backend.js   shared backend: auth, Supabase, archives, invariants
api/_lib/reservations.js    server-side reservation engine
api/state.js                GET/PUT the whole application state
api/public-state.js         sanitised public read, no auth
api/auth/{login,logout,session}.js
api/lead.js                 public lead intake (unauthenticated!)
api/audit.js  api/leads.js  api/sales.js    read paths for the archive tables
api/media/upload.js
api/cron/payment-reminders.js               runs 13:00 UTC daily
supabase/schema.sql         every table definition
scripts/                    test suites (see §4)
```

### The data model — read this twice

**All business data lives in ONE JSONB blob**: table `public.app_state`, row
`id='production'`, column `state`. Products, batches, orders, sales, partners,
expenses, leads, the audit trail — all of it, one row.

Writes use optimistic concurrency: `replaceAppState` PATCHes with
`updated_at=eq.<token>` and a mismatch is a 409. **Never write a code path that
saves state without a version token** — it would silently overwrite everything
another device had done.

The blob is being decomposed incrementally into real tables. Three exist so far
— `audit_events`, `crm_leads`, `sales_ledger` — plus `app_state_backups` for
daily snapshots. **They are shadow writes: additive, fail-open, and the blob
remains the source of truth.** A failure to write them must never affect whether
the save succeeded. Follow that pattern exactly for any new slice
(`archiveSales` in `kombu-backend.js` is the model to copy).

---

## 3. Non-negotiable rules

1. **Never push to `main` directly.** Use the flow in §6.
2. **Never commit `.env` or any secret.** `.gitignore` covers `.env*`; check
   `git diff` before every commit anyway.
3. **Never handle the admin password.** You cannot log in to the admin and must
   not try. Verify through unauthenticated endpoints instead (§7).
4. **The owner runs all SQL manually.** If a change needs SQL, paste the
   complete statement in chat in a ```sql block for copy-paste into the Supabase
   SQL Editor. Never assume a migration has run.
5. **Ship code before the SQL is run.** New table code must degrade to a no-op
   when the table is missing, so the deploy is safe in either order. There are
   tests asserting exactly this — keep them passing.
6. **Escape all output.** `escapeHtml()` is used ~250+ times in `admin.js`. Any
   user-controlled value rendered into HTML must go through it. This was a real
   stored-XSS vulnerability injectable through the public lead form; do not
   reintroduce it.
7. **Vercel Preview shares the production database.** `SUPABASE_URL` is scoped
   to "Production and Preview", so a preview deployment reads and writes LIVE
   data. Preview is not a safe sandbox. `STAGING.md` documents how to fix this;
   the owner has decided not to, for now.
8. **Someone else may be editing in parallel.** Re-read a file immediately
   before editing it. Never revert or overwrite work you did not write. Stage
   specific paths (`git add <path>`), never `git add -A`.

---

## 4. Testing — and the standard expected of you

```bash
npm run check   # node --check across every source file
npm test        # the three suites below
```

| Suite | Command | Covers |
|---|---|---|
| API | `npm run test:api` | auth, cron, concurrency, invariants, archives, `/api/sales` |
| Reservations | `npm run test:reservations` | 26 scenarios, server engine |
| Admin logic | `npm run test:admin` | 34 scenarios, client logic in `admin.js` |

`assets/admin.js` is a classic script needing a DOM, so it cannot be `require`d.
`scripts/admin-harness.js` loads it into a Node `vm` context with a stubbed
document. The sandbox has no `require`, no `process`, no `XMLHttpRequest`, and a
`fetch` that rejects — a test cannot reach production even by accident. Keep it
that way.

Harness gotchas, all learned the hard way:
- `state` is a top-level `let` — a lexical binding, not a sandbox property. Use
  `__setState` / `__getState` / `__eval`.
- Values built inside the vm fail `deepStrictEqual` on prototype identity. Use
  the `plain()` JSON round-trip helper.
- `pendingReservationRequest` accumulates across calls by design; reset it
  between tests.
- `setOrderItemReservation` returns early when target === current, so a fixture
  must differ from the target for an override to be recorded.

### Mutation-test every assertion you add

**A passing test proves nothing until you have watched it fail.** The required
procedure: back up the file, deliberately break the behaviour, run the suite,
confirm it fails *for the right reason*, restore.

```bash
cp assets/admin.js /tmp/f.bak
# introduce the break, then:
node scripts/admin-logic-regression.js 2>&1 | grep AssertionError
cp /tmp/f.bak assets/admin.js
```

This is not ceremony. Two tests in this repo passed against their own mutation
and were worthless until rewritten:
- a manual-reservation test whose fixture never reached the branch it claimed
  to cover;
- a revenue test matching `100,00` anywhere in the document, so it hit a
  breakdown line instead of the header it was meant to assert on.

Neither would have been caught any other way.

---

## 5. How to make a change

1. `git status` first. If the tree is dirty, it is someone else's work — stop
   and ask.
2. Read the file before editing. Match the surrounding style: camelCase,
   Portuguese UI strings, comments that explain *why* rather than *what*.
3. Make the smallest change that does the job.
4. `npm run check && npm test`.
5. Add tests for the new behaviour, then mutation-test them (§4).
6. Review your own full diff: `git diff`. Scan for secrets.
7. Commit and push (§6), then verify in production (§7).

**Comment style matters here.** Comments explain the reasoning a future reader
could not recover from the code — why a rule exists, what bug it prevents, what
was tried before. Look at `removeAllocationFromItem` in `admin.js` or
`archiveSales` in `kombu-backend.js` for the register. Do not narrate what the
next line does.

**Commit messages** are a sentence of intent in the imperative, then prose
explaining the reasoning, the trade-offs, and what you verified. Read
`git log -3` before writing your first one. End with:

```
Co-Authored-By: <your name> <your email>
```

---

## 6. How to push

The working branch is fast-forwarded onto `main`. This avoids checking out
`main` while anyone's work is uncommitted.

```bash
git add <specific paths>
git commit -F <message file>
git push origin fix/xss-output-escaping:main
```

If that push is rejected as non-fast-forward, someone else has pushed. **Do not
force.** Fetch, rebase onto `origin/main`, re-run the suite, push again.

Vercel deploys automatically. Confirm the new code is actually live before
claiming anything — a deploy takes 20–60 seconds:

```bash
curl -s "https://www.kombukombucha.com.br/assets/admin.js?cb=$(date +%s)" | grep -c yourNewFunctionName
```

---

## 7. How to verify in production without logging in

You cannot log in. These checks need no credentials and catch the failures that
actually matter:

```js
// Run in a browser on https://www.kombukombucha.com.br
const pub = await fetch("/api/public-state", {cache:"no-store"}).then(r=>r.json());
({
  images: pub.state.cms.images.length,        // must be 10
  partners: (pub.state.partners||[]).length,  // must be 5
  stateGuarded: (await fetch("/api/state",{cache:"no-store"})).status,   // 401
  salesGuarded: (await fetch("/api/sales",{cache:"no-store"})).status,   // 401
  // 401 not 500 proves every function booted, i.e. kombu-backend.js parsed
  cronBoots: (await fetch("/api/cron/payment-reminders",
    {headers:{authorization:"Bearer wrong"}})).status                    // 401
})
```

**10 CMS images and 5 partners is the data-intact check.** Run it after every
deploy. If either number moves and you did not intend it, something is wrong —
say so immediately rather than continuing.

The cron check is the cheapest smoke test available: a syntax or load-time error
anywhere in `kombu-backend.js` turns that 401 into a 500, and every serverless
function imports it.

---

## 8. Current state

Complete and deployed: a full security audit and its remediation (stored XSS +
CSP, write-conflict handling, rate limiting, timing-safe login, magic-byte
upload validation, server-side business invariants); a nine-part UX feature
brief covering dashboard reservation cards, reservation adjustment, additive-only
allocation, the order flavour picker, repeat-order, quick sale from reserved
stock, and per-order/per-batch history; and three blob slices with read paths.

Open, in rough priority order:

1. **Continue decomposing the blob.** `audit_events`, `crm_leads` and
   `sales_ledger` are done. Candidates next: `orders`, `batches`, `expenses`.
   Same pattern every time: additive, fail-open, shipped before the SQL.
2. **`assets/admin.js` is ~11,000 lines in one file.** Splitting it is worth
   doing and genuinely risky — it is a classic script with implicit global
   ordering and no module system. Any plan must be incremental and provable by
   the existing suite. Propose before doing.
3. **No server-side access control.** See M2 below.
4. **Staging** (`STAGING.md`) — deliberately declined by the owner. Do not start
   it unless asked.

### Three open questions that are the owner's to answer, not yours

Documented in `AUDIT-2026-08-11.md`. Surface them; do not "fix" them unilaterally.

- **M2** — the role selector is a view filter, not access control. Anyone with
  the password has full write access regardless of the role shown. Real
  permissions need server-side accounts.
- **M12** — bottle size defaults to 500 ml when it cannot be inferred. Changing
  the default would move existing reservations.
- **M14** — freight is reported separately and is not counted as revenue.
  Whether it is revenue or a recovered cost is an accounting decision.

---

## 9. What is wanted from you

Audit the codebase and the recent work with fresh eyes, then fix what you find.
Specifically valuable:

- **Correctness in the money and stock paths.** Reservation allocation, the
  quick-sale withdrawal planner, revenue arithmetic, the invariant checks in
  `kombu-backend.js`. These move real inventory and real money.
- **Anything the existing tests assert but do not actually prove.** Given that
  two tests here were found to pass against their own mutations, assume there
  are more. Mutation-test the existing suite, not only your own additions.
- **Security.** The lead endpoint is public and unauthenticated. Output escaping
  in `admin.js`. The session cookie and token verification.
- **Disagreement, stated plainly.** If a decision recorded here or in the commit
  log is wrong, say so and explain why. Do not be deferential about it.

Report honestly. If something is broken, show the failing output. If you did not
verify something, say you did not. An unverified claim about a production
financial system is worse than an admitted gap.
