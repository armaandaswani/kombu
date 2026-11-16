# Release check: Kombú admin, branch `admin/recovery-phase2`

Date: 15 November 2026 · Base: `179fc51` · Head: see `git log` (9 commits, listed below) · Not pushed, not deployed.

## Verdict

**Release blocked under the brief's own gates.** Two P0 items are open, and three gates can only be passed on a staging copy of the database, which does not exist yet. Every change is tested locally and the branch is safe to keep building on.

**Practical recommendation:** do not merge to production yet. First create the staging database (`STAGING.md`, about 20 minutes), then run the checks in "What a release needs" below on a copy of production data. If those pass, merging is low risk: nothing in this branch rewrites stored data, and rolling back is a single revert (see "Rollback").

## What this branch changes

| Commit | Change |
| --- | --- |
| `5b639d0` | Full English/Portuguese coverage (1,599 catalog entries); customer documents stay in Portuguese |
| `53b3bfb` | Ingredients and packaging valued at weighted average cost |
| `0f7255f` | Warning before production takes supplies below zero; negative supplies flagged |
| `5c25769` | Bottles can be sold beyond stock as sales waiting for the next batch |
| `4cb00b1` | One access level with full access (view selector that disabled buttons removed); receipt reader core |
| `ab14ea9` | "Ler nota (foto)": receipts read on the device (tesseract.js 7.0.0, audited) |
| `685ab37` | "Modo simples" for operators and `GUIA_DO_OPERADOR.md` |
| `f234021` | Financial reconciliation; unknown costs no longer shown as profit |
| (this check) | Test server serves clean URLs; public site suites added to the default run |

## Evidence (run on 15 November 2026, all passing)

- `npm test`: 10 test scripts with 16 result groups. Areas covered:
  - API: auth, state validation, concurrency, business invariants, sales ledger.
  - Reservations: 27 scenarios.
  - Admin logic: 37 scenarios plus the new scenario groups for weighted cost, supply shortfalls, pending-batch sales, access and financial reconciliation.
  - Cloud save, i18n, receipt reading and the operator guide.
  - Storefront stock and checkout.
- `npm run check`: syntax of every shipped script.
- `node scripts/run-browser-tests.js`: 12 browser suites, all under the production security headers read from `vercel.json`.
  - Admin, dashboard (19 modules at 3 widths), orders and production, reservations, purchase cost, supply shortfall, oversell, receipt capture, operator mode, English coverage, public site, storefront.
  - Mobile (390 px) and desktop (1440 px) widths are covered.
- Contrast of the new colour pairs, measured: all pass WCAG AA. The lowest is 4.81:1, the "Confira" badge.
- Mutation checks: the purchase-cost, supply-shortfall, oversell and receipt-document tests were run against the previous code and fail there.

## Release gates (from the brief)

| Gate | Status | Evidence or gap |
| --- | --- | --- |
| All P0 issues resolved | **Fail** | Open: the server-side posting contracts, so each purchase, production and sale becomes its own atomic, auditable event (needs staging), and the staging run with a backup restore drill. The interaction inventory was completed afterwards (see the update below). |
| Core workflows pass end to end | Pass locally | Purchase (form and photo), production, sale, oversell, correction, stock, orders and reservations, receipts, all in browser suites. Not yet run against staging. |
| Both languages fully covered and tested | Pass (admin) | The browser walk opens every module and dialog in English and fails on any untranslated string. Switching back to PT restores the page, and the choice survives a reload. The public site's own text is out of scope. |
| Every visible primary action works | Pass (update) | All 99 rendered actions have handlers, and the browser crawl presses 157 distinct controls on 20 screens with every one responding. Three dead buttons were found and fixed: dashboard "Ver pedido" and "Histórico", and batch "Histórico". Buttons inside opened forms are covered by the workflow suites. |
| Financial calculations reconcile | Pass | Two-month fixture checked to the cent, with months adding up to totals and CSV in cents. Four accounting classifications await the accountant (plan, "Accounting questions"). |
| Inventory integrity | Partial | Weighted cost, shortfalls, pending sales, the server's over-allocation check and reconciliation are tested. Concurrent edits from two devices, and retries after a lost response at the movement level, need the posting contracts. |
| Charts and reports show verified data | Pass | Dashboard, Vendas, Despesas and Reports use one cost rule, and incomplete costs are labeled, never shown as profit. |
| No critical console errors in tested workflows | Pass | Every browser suite fails on page errors. The receipt suite also fails on CSP violations. |
| Critical workflows pass accessibility checks | Partial | Targets of at least 44 px, visible focus, no horizontal scroll at 390 px, and AA contrast on the new screens are verified. No screen-reader pass and no full WCAG audit of older screens. |
| Receipt capture works on agreed cases | Partial | Real on-device reading passes on rendered receipt images, blur and blocked-WebAssembly cases. Real phone photos of the company's receipts have not been tested. |
| Production data stays intact | Pass by design, not drilled | No server, schema or data-loading code changed. New fields are additive. No backup restore drill was run. |
| No critical regressions | Pass | All 10 node test scripts and all 12 browser suites pass. |

## Risks to know before deploying

1. **Preview deployments use the live database.** Per `STAGING.md`, Vercel previews read and write production data. Pushing this branch could create a preview that touches real data. Set up staging first.
2. **The first load will show new alerts.** Supplies with purchases on record and negative stock appear in red under "Atenção necessária". Bottles sold without stock appear the same way. These are real problems that were previously silent.
3. **Opening average costs** are each item's current unit cost, which is its last purchase price. History is not recomputed.
4. **The CSP now allows WebAssembly** (`'wasm-unsafe-eval'`) site-wide, as approved. On iOS before 16 the receipt reader shows a message and the normal form.
5. **About 13 MB of reader files** are added under `assets/vendor/tesseract-7.0.0/`. They load only when a receipt is read.
6. **Development machine:** the disk is 97% full and iCloud is offloading project files. That made two test runs fail on files that read as empty, which was fixed by reading the files back. Free disk space, or keep the project out of the iCloud Desktop folder, before relying on local test runs.

## What a release needs

1. Create the staging Supabase project and scope the Vercel variables (`STAGING.md`).
2. Seed staging with a copy of production. Deploy this branch as a preview and open it once on the owner's phone and computer.
3. In the preview, check:
   - The dashboard figures for last month against the owner's own numbers.
   - One purchase by photo with a real receipt.
   - One production and one sale.
   - "Modo simples" with an older operator, using `GUIA_DO_OPERADOR.md`.
4. Take a database backup (Supabase dashboard) and confirm it restores into staging.
5. Merge to `main` only after the owner approves.

## Rollback

Revert the merge commit and redeploy. Fields this branch adds are ignored by the previous code: `pendingBatch` sales, `stockCountedAt`, the receipt `document*` fields on purchases, and the device's `kombuAdminHome` setting. One effect remains after a rollback: sales recorded without a batch keep an unknown cost until edited.

## Update, same day: interaction inventory

The interaction inventory is complete. Three dead buttons were found and fixed. The browser run now has 13 suites, all passing, and `npm test` includes the action inventory. The verdict is unchanged: blocked until the staging run, the posting contracts and the restore drill are done.

## Update, 16 November: data-loss button removed, replenishment added

- **P0 found and fixed:** "Limpar dados" on the Arquitetura screen replaced all data with the empty default and saved it to the cloud on one tap, with no confirmation. The server's checks allowed it. The button, its handler and the unreachable seed-restore (`restoreCostBase`) are removed. `npm test` now fails if a handler is unreachable or if any action replaces the whole saved state.
- **Added:** Estoque → "Reposição", a read-only view of what to produce and buy, from the last 8 weeks of records. It gives no forecast with under 4 weeks of history.
- **Evidence:** `npm run check` and every node suite pass. All 14 browser suites pass under the production headers, including the new `replenishment-regression.js`. The button crawl now presses 158 controls.
- **Verdict unchanged:** blocked until staging, the posting contracts and the restore drill are done. Nothing in this update changes stored data or the server.

## Update, 16 November: the wipe removal is live

On the owner's go-ahead, the "Limpar dados" removal went to production alone, as commit `2e5b9bb` on `main`, built from `main`. `npm run check`, `npm test` (with a new guard that failed before the fix) and main's four browser suites passed. The served `assets/admin.js` matches the commit byte for byte. The no-login checks pass: pages 200, `/api/state` and `/api/sales` 401, 10 CMS images, 5 partners. The rest of this branch is still not deployed, and the verdict for it is unchanged.

## Update, 16 November: simple mode rebuilt around orders and production

At the owner's request, simple mode is now built for an older operator around four tasks: new order, see orders, record production and check stock. The new order and production forms are one column with large − / + controls, and they save through the same code as the full panel (`commitOrder`, `recordProduction`). Editing an order keeps its negotiated price, partner and history. Evidence: the new `simple-orders-regression.js` (390 and 1440 px, PT and EN), every node suite and all 15 browser suites pass, and the button crawl presses 158 controls. Not in simple mode yet: delivery, charging and cancelling, which stay in the full panel. Not tested with a real older operator. Not deployed. The verdict for this branch is unchanged.

## Update, 16 November: delivery in simple mode

At the owner's go-ahead ("Yes, add delivery"), simple mode can now deliver an order. An "Entregar" button appears when bottles are set aside for the order. The delivery screen offers those bottles (never more), the way to pay (the panel's 15-day default preselected, or Pix, cash or card) and the date. It records through the same code as the full panel's "Dar baixa nos prontos" (`buildReadyOrderDelivery` and `registerOrderDelivery`), so sales, reservations, the payment due date and the proof-of-delivery PDF follow. Bottles not yet produced stay on the order. Evidence: `simple-orders-regression.js` delivers 8 of 10 bottles by Pix and checks the delivery record, the 8 sales, the order staying open, the PDF download and the order edit stopping at 8 delivered. Breaking the "no more than set aside" limit makes it fail. Every node suite and all 15 browser suites pass, and the button crawl presses 159 controls. Not deployed. Not tested with a real older operator.

## Update, 16 November: published to production

The owner chose to publish the whole reform ("Copiei, pode publicar") after copying the live data in Supabase. The verdict above stands as a risk statement, not as a block: staging was declined on 11 August and the owner accepted the risks listed here. Pushed as a fast-forward, `2e5b9bb..8c10d51`. Checked live without logging in: the served assets match the commit, the Tesseract files return 200, the CSP allows `'wasm-unsafe-eval'`, `/api/state` and `/api/sales` return 401, 10 CMS images and 5 partners, and the public regression passes against production. The admin screens could not be checked live. A restore from backup has still not been tried. Rollback is reverting `8c10d51`.

## Update, 16 November: order-edit fixes published

On the owner's "sim", commit `7a55b91` went to production (`7222c44..7a55b91`) after review and a full test run. It fixes renaming and repricing in simple-mode order edits, closing dates for orders cut to what was delivered, and a bug in the full panel: its "Novo pedido" form pre-selected the payment status "pago", so orders saved without changing it were recorded as paid. The live `admin.js` is byte-identical to the commit; `/api/state` and `/api/sales` still return 401. Not verified: the admin screens, which the check cannot log in to. Open: orders already created through the full panel's "Novo pedido" may be stored as "pago" and were not changed. The owner should check recent orders.

## Update, 16 November: direct stock count and supplies that never block (not published)

Built on the owner's request, on branch `feature/stock-count-2026-11-16` from `main` at `d238d98`. Not deployed. "Contar garrafas" (Estoque) and "Contar o estoque" (simple mode) let the operator type what is on the shelf: more bottles enter as a batch made by the recipe, fewer are a loss that takes reserved bottles from the order needed latest. The yes/no dialog about supplies is gone from every production path; a notice after saving replaces it. A supply at 0 asks "É 0 mesmo?". The only server-side contact is the stored state: batches gain optional `source` and `note`, sales gain `source: "contagem"`, and supplies gain an optional `zeroConfirmed`. The server's `validateAppState` and its over-allocation check accept all of it, and nothing in `api/` changed. Rollback is reverting the commit. Evidence is in the plan. Open: no real older operator has used the count, and the "start from zero" request for old orders is waiting on the owner.

## Update, 16 November: "Encerrar pedidos antigos" built, not run (not published)

Built on the owner's answer "Só fechar", in commit on branch `feature/stock-count-2026-11-16`, on top of the stock count. A button on the full panel's Pedidos page, behind a preview and the typed word ENCERRAR, makes every order that is not cancelled delivered and paid: no sale, revenue, cost, receipt or stock movement. It was not run on any real data. Before the owner runs it: take a fresh copy of the data, because the panel has no undo. Risk that was found and closed: an order marked delivered with no deliveries is read as a sale of its whole quantity on every page load, so a marker (`closedFreshStart`, set only on orders that were open) keeps closed orders out of that path while orders already delivered keep the sales they have. The stored state gains `closedFreshStart` on closed orders; `validateAppState`, the server's invariant check and its reservation reconciliation accept it and add nothing. Rollback of the code is reverting the commit; rollback of the data is the copy. Evidence is in the plan. Open: not deployed, and it should be run once, in the admin, by the owner.

## Update, 16 November: admin shortcut fixed

On the owner's "Sim, publicar", commit `c690304` went to production (`d238d98..c690304`). The admin page used the public site's manifest, whose start URL is `/`, so a home-screen shortcut opened the public site. The admin now has its own manifest starting at `/admin`. Live checks: the admin page links `/manifest-admin.webmanifest`, which serves 200 as `application/manifest+json` with `start_url` `/admin`; the public site still links `/manifest.webmanifest` starting at `/`; `/api/state` still returns 401. Not verified on a real iPhone. A shortcut made before this must be deleted and added again.

## Update, 16 November: stock count and "Encerrar pedidos antigos" published

On the owner's "Sim, publicar", commit `1b4dfd4` went to production (`54cf94d..1b4dfd4`). It carries "Contar garrafas" and "Contar o estoque", supplies that never block (no yes/no dialog, a notice after saving, "É 0 mesmo?"), and "Encerrar pedidos antigos". Checked live without logging in: the served assets match the commit, `/api/state` and `/api/sales` return 401, the CSP is unchanged, 10 CMS images and 5 partners, and the public regression passes. The admin screens could not be opened live. No SQL, no server change. The closing action has not been run: the owner takes a fresh copy of the data first, because the panel has no undo, runs it once from Pedidos, then counts the stock. Rollback of the code is reverting `1b4dfd4`; rollback of the data is the copy.
