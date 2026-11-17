// What the owner sees in the evening: with the clock at 22:56 in Manaus the panel
// must offer that day's date, not the next one (UTC was already tomorrow), in the
// date of a new order, its ready date a week on, a new production in simple mode
// and the month the dashboard opens on, including on the last evening of a month.
// The browser clock is fixed with Playwright, so this does not depend on when it runs.
const assert = require("node:assert/strict");
const { chromium, launchOptions } = require("./browser-runtime");

const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local fixtures only");
const storageKey = "kombuAdminStateV3";
const seed = {
  products: [{ id: "mar", item: "KMB1", flavor: "Maracujá", sizeMl: 500, retailPrice: 22, wholesalePrice: 15, status: "ativo", visible: true }],
  recipes: [{ id: "r-mar", productId: "mar", flavor: "Maracujá", version: "v1", status: "ativa", bottleMl: 500, yieldBottles: 1, ingredients: [], packaging: [] }],
  batches: [], purchases: [], sales: [], ingredients: [], packaging: [], orders: [], expenses: [], partners: [], suppliers: [], receipts: [], audit: [],
};
const plusDays = (iso, days) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
const CASES = [
  ["2026-11-17T02:56:00Z", "2026-11-16", "2026-11"], // 22:56 in Manaus
  ["2026-12-01T03:30:00Z", "2026-11-30", "2026-11"], // last evening of November: UTC says December
  ["2027-01-01T03:59:00Z", "2026-12-31", "2026-12"], // last evening of the year
  ["2026-11-17T04:30:00Z", "2026-11-17", "2026-11"], // just after midnight
];

(async () => {
  const browser = await chromium.launch(launchOptions);
  try {
    for (const [instant, today, month] of CASES) {
      for (const width of [390, 1440]) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, locale: "pt-BR", timezoneId: width === 390 ? "America/Manaus" : "Asia/Tokyo" });
        await context.addInitScript(({ key, value }) => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value)); }, { key: storageKey, value: seed });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.clock.setFixedTime(new Date(instant));
        await page.goto(`${base}/admin.html`);
        await page.fill("#adminPassword", "local-fixture");
        await page.click('#loginForm button[type="submit"]');
        await page.waitForSelector("#adminShell:not(.is-locked)");
        // The first run is on a phone set to Manaus, the second on a device set to Tokyo:
        // the date is Manaus's either way.
        const label = `${instant} on a ${width === 390 ? "Manaus" : "Tokyo"} device`;
        assert.equal(await page.evaluate(() => todayIso()), today, `${label}: today`);
        assert.equal(await page.evaluate(() => dashboardMonth), month, `${label}: the month the dashboard opens on`);

        await page.evaluate(() => orderForm());
        await page.waitForSelector("#orderForm");
        assert.equal(await page.inputValue('#orderForm [name="orderDate"]'), today, `${label}: a new order is dated today`);
        assert.equal(await page.inputValue('#orderForm [name="estimatedReadyDate"]'), plusDays(today, 7), `${label}: its ready date is a week on`);
        assert.match(await page.inputValue('#orderForm [name="code"]'), new RegExp(`^PED-${today.slice(2).replaceAll("-", "")}-`), `${label}: its code carries today's date`);
        await page.evaluate(() => closeModal());

        await page.evaluate(() => simpleBatchForm());
        await page.waitForSelector("#simpleBatchForm");
        assert.equal(await page.inputValue('#simpleBatchForm [name="date"]'), today, `${label}: a new production is dated today`);
        await page.evaluate(() => closeModal());

        assert.deepEqual(errors, []);
        await context.close();
      }
    }
    console.log("Evening dates: with the clock at 22:56 in Manaus, on the last evening of a month and of a year, and on a device set to Tokyo, a new order, its ready date and code, a new production and the dashboard month all use Manaus's date passed.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
