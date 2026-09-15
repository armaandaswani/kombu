# Dashboard functionality and usability audit — 14 September 2026

## Implemented locally

The home page now prioritizes available inventory, monthly revenue, estimated monthly profit, stock by flavor and bottle size, and demand awaiting reservation. The default is the current calendar month, with a month picker and a return-to-current-month button. Inventory and outstanding payments remain current when the financial month changes.

Monthly revenue uses recorded sale dates and existing discount rules; gifts and losses do not generate revenue. Cost includes inventory movements, including gifts and losses. Expenses use their recorded dates. Inventory purchases linked to automatically generated expenses are excluded from operating expenses because batch costs already include them; operational purchases remain expenses. The same expense rule now applies to historical reports and their CSV export. The flavor report also uses the existing sale-revenue function so gifts cannot create fictitious revenue.

Missing batches or unknown batch costs suppress the home profit value and display “Custo incompleto.” Historical costs without snapshots remain estimates calculated by the existing recipe fallback. Freight stays separately reported, preserving the existing accounting convention. These figures are not bank balances or proof that all costs have been recorded.

Navigation groups all 19 modules by task, with equivalent optgroups in the mobile selector. Detailed reservations, recent history, financial explanations and entry guidance use expandable sections. Reservation filter changes preserve expanded sections. The home includes direct links to stock, production, purchases, costs, expenses, orders and image/content management. Stock labels distinguish 300 ml and 500 ml.

Image uploads display processing and storage-failure feedback, prevent overlapping selection through the same control, and re-enable the field for retry. An uploaded image is not described as fully saved before application-state synchronization confirms it. The existing local fallback remains in place.

Startup integrations now run after script constants are initialized. The browser suite exposed a ReferenceError involving CLOSED_ORDER_STATUSES that previously interrupted startup reservation processing.

## Process map

| User task | Flow | Decision/check |
| --- | --- | --- |
| Set up products | Products → Ingredients / Packaging → Recipes → Costs | Review ingredient costs and size-specific prices |
| Replenish supplies | Purchases → Stock item → Quantity, unit and price → Save | Confirm stock and linked expense; inventory purchases are not counted twice in profit |
| Plan production | Home demand → Stock / Reservations → Production → New batch | Reserve available stock before producing extra bottles |
| Fulfill an order | Orders → Customer and items → Reservations → Delivery → Payment / Receipt | Reservations and recorded deliveries determine remaining quantity |
| Immediate sale | Home quick sale → Flavor and size → Quantity / customer → Confirm | Use existing withdrawal and reservation safeguards |
| Review finances | Home month → Revenue / Estimated profit → Cost explanation → Expenses / Reports | Home is monthly; reports cover all recorded history |
| Update public content | Content of site → Image upload / text fields → Sync confirmation | Check upload status and global synchronization status |

Production suggestions are demand-based, not predictive forecasts. They show outstanding unreserved quantities and deadlines, with stock and production links. They do not automatically create batches or change reservations.

## Verification

- `npm run check` and `npm test`: API, reservation and admin logic suites pass.
- Added monthly financial regression cases: inclusive date boundaries, leap-year February, December rollover, empty months, discounts, freight exclusion, gifts, inventory versus operational purchases, missing costs, and overview hierarchy.
- Deliberate mutations were rejected for month filtering, double-counted stock purchases, profit arithmetic, missing batch cost, gift costs and missing-cost display.
- New `scripts/dashboard-regression.js`: all 19 modules render at 375, 768 and 1440 pixels without page errors or horizontal overflow. Tests month changes, current-month reset, module links, persistent disclosures, an order dialog and image-upload fallback feedback using local fixtures and blocked API routes.
- Existing `audit:ui`: 76 page/viewport combinations (public plus 18 admin modules at four widths), no detected page errors, horizontal overflow or unlabeled visible controls. This is an automated scan, not a full accessibility certification.
- The legacy `test:ui` is not green: it expects automatic reservation redistribution on load (1 available bottle), while current code intentionally leaves existing stock free until an explicit recalculation (5 available). Exploratory adaptation then exposed other stale expectations: “4/4” versus “4 de 4 reservadas,” and a removed `reservedNow` input. The legacy test file is unchanged; new focused browser coverage is separate.

## Limits and follow-up

No deployment, production login, production write, migration or schema change was performed. Browser checks used local fixtures; real cloud image storage and real multi-device synchronization were not exercised. Existing API tests cover concurrency and backend invariants.

Manual expenses cannot be automatically identified as duplicates of purchases unless they carry the purchase link. Recordkeeping still determines profit accuracy. Missing costs and old recipe-based estimates require operator review. Recommendations do not estimate demand from sales velocity or account for production lead time, ingredient availability or minimum stock targets.

The role selector remains a view/write-UI filter, not server-side access control. This audit did not introduce accounts, change the legacy bottle-size default, or change freight treatment. Bulk spreadsheet import is not implemented; guided entry uses existing forms and image uploads.

## Browser-suite restoration — 15 September 2026

The legacy browser-suite limitation above is resolved. `npm run test:ui` now starts its own loopback fixture server (API disabled), runs both admin and dashboard regression scripts, and exits successfully. Assertions now follow explicit FIFO recalculation, current reservation rows and menus, and explicit reservation of a partial delivery's remaining balance. Added multi-item bulk/stepper reservation checks and exact per-card financial values. Browser failures close the browser, and the runner closes its server.

Playwright 1.62.1 is pinned in `scripts/browser/package.json` and its lockfile, outside the production package. Setup: `npm run test:ui:setup`. See `scripts/browser/README.md` for Node 20+, Chromium and Poppler prerequisites. Production remains a static/no-build application with no root runtime dependencies; `.vercelignore` already excludes all test files.

Verified on local fixtures: `npm run check`, `npm test`, and `npm run test:ui` pass. The admin browser run includes PDF page-count/A4 checks using pdfinfo, receipts/payments, both partial deliveries, stock write-off, FIFO and multi-item reservation adjustment. The dashboard run covers 19 modules at 375, 768 and 1440 pixels, period selection, disclosures, navigation and upload failure feedback. No production deployment or production data access was part of this restoration.

Also verified during restoration: `npm run test:ui:setup` completed, downloaded Chromium launched, and `npm run test:public` passed against a separately started loopback static server. The broader `audit:ui` scan was not rerun in this restoration.
