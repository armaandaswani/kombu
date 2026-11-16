// Serve only local fixtures, with no backend or production credentials involved.
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");
require("./browser-runtime");
if (spawnSync("pdfinfo", ["-v"]).error) {
  throw new Error("PDF assertions require pdfinfo (Poppler). See scripts/browser/README.md.");
}
const root = path.resolve(__dirname, "..");
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".traineddata": "application/octet-stream" };
// The production security headers (vercel.json, rule "/(.*)"), so every suite
// runs under the real Content-Security-Policy.
const productionHeaders = Object.fromEntries(
  (JSON.parse(require("node:fs").readFileSync(path.join(root, "vercel.json"), "utf8")).headers.find((rule) => rule.source === "/(.*)")?.headers || [])
    .filter((header) => header.key !== "Strict-Transport-Security")
    .map((header) => [header.key, header.value]),
);
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (pathname.startsWith("/api/")) {
      res.writeHead(503, { "Content-Type": "application/json" });
      return res.end('{"error":"Local fixture server: backend disabled"}');
    }
    if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); return res.end(); }
    // vercel.json sets cleanUrls: "/experimente" serves experimente.html.
    const requested = pathname === "/" ? "index.html" : pathname.slice(1);
    const filename = path.extname(requested) ? requested : `${requested}.html`;
    const file = path.resolve(root, filename);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    const body = await fs.readFile(file);
    res.writeHead(200, { ...productionHeaders, "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch { res.writeHead(404); res.end(); }
});
(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  console.log(`Local browser fixtures: ${baseUrl} (API disabled)`);
  try {
    // Pass suite file names to run only those, e.g. node scripts/run-browser-tests.js i18n-coverage.js
    const suites = process.argv.slice(2).length ? process.argv.slice(2)
      : ["admin-regression.js", "dashboard-regression.js", "order-production-regression.js", "reservation-workflow-regression.js", "purchase-cost-regression.js", "supply-shortfall-regression.js", "passkey-browser-regression.js", "replenishment-regression.js", "stock-count-regression.js", "fresh-start-regression.js", "oversell-regression.js", "receipt-capture-regression.js", "operator-regression.js", "simple-orders-regression.js", "button-crawl-regression.js", "i18n-coverage.js", "public-regression.js", "storefront-browser-regression.js"];
    for (const suite of suites) {
      const code = await new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [path.join(__dirname, suite)], {
          timeout: 300000, stdio: "inherit", env: { ...process.env, AUDIT_BASE_URL: baseUrl },
        });
        child.once("error", reject);
        child.once("exit", code => resolve(code ?? 1));
      });
      if (code !== 0) { process.exitCode = code; break; }
    }
  } finally { await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
