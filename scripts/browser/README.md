# Local browser regression tests

Prerequisites: Node.js 20 or later for the test tools, npm, and Poppler's `pdfinfo` on PATH. The production application retains its existing Node >=18 declaration and has no build step or package dependencies.

Install Poppler with `brew install poppler` on macOS or `sudo apt-get install poppler-utils` on Debian/Ubuntu. The PDF assertions inspect page counts and A4 size; they are not skipped when the tool is missing.

From the repository root:

```sh
npm run test:ui:setup
npm run test:ui
```

Setup uses `npm ci --prefix scripts/browser --include=dev` with the committed lockfile and installs Playwright's Chromium. Playwright is a development dependency of this isolated package, not the production root package. All of `scripts/` is excluded by `.vercelignore`, and `node_modules/` is ignored by git. On Linux, Playwright may also require system browser libraries (`node scripts/browser/node_modules/playwright/cli.js install-deps chromium`).

The runtime uses `CHROME_PATH` when supplied, otherwise installed Google Chrome on macOS, otherwise Playwright's downloaded Chromium. No `NODE_PATH` or Codex-specific package path is required.

`npm run test:ui` starts a temporary HTTP server bound to 127.0.0.1 on a free port, runs the admin regression and dashboard regression sequentially, and closes the server on completion/failure. Its API routes always return 503; browser-local authentication and isolated fixture storage are used. It never connects to the production backend. Do not point fixture tests at a real deployment. Individual admin/dashboard scripts reject non-local base URLs. Expected local API failures exercise the app's local fallback.

The admin regression covers explicit reservation recalculation (including no allocation on page load), FIFO allocation, per-item and bulk reservation controls, partial deliveries, stock, sales, receipts, PDF output, and payments. The dashboard regression covers 19 modules at three widths, exact monthly revenue/profit values, date controls, disclosure persistence, navigation, an order dialog, and upload failure feedback.

For the existing public regression and broader layout audit, start a local fixture/static server separately and set `AUDIT_BASE_URL` before `npm run test:public` or `npm run audit:ui`. They use the same isolated Playwright installation.
