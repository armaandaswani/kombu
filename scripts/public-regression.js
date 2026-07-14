const assert = require("assert");
const { chromium } = require("playwright");

const baseUrl = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
const executablePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const officialMap = "https://www.google.com/maps/d/viewer?mid=1Zn4OECfeuJkhDkCj6noQKZDeLgOUbn8";

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "pt-BR" });
  const page = await context.newPage();
  let leadRequests = 0;

  await page.route("**/api/public-state", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, configured: true, state: { cms: {}, partners: [] } }) }),
  );
  await page.route("**/api/lead", async (route) => {
    leadRequests += 1;
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, persisted: true, emailSent: true }) });
  });

  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  assert.ok((await page.locator("#flavorGrid .flavor-card").count()) >= 3, "catalog should expose multiple flavors");
  assert.strictEqual(await page.locator("#flavorGrid .flavor-card[role=button]").count(), 0, "cards with nested actions cannot be buttons");

  const buyLinks = page.locator("[data-buy-map], #flavorGrid .flavor-card-actions a");
  for (let index = 0; index < (await buyLinks.count()); index += 1) {
    assert.strictEqual(await buyLinks.nth(index).getAttribute("href"), officialMap);
  }

  await page.locator('#flavorGrid .flavor-card-mobile-open[data-open-flavor="maracuja"]').click();
  await page.waitForSelector("#flavorModal.is-open");
  assert.strictEqual(await page.locator('#flavorModal a:has-text("Comprar este sabor")').getAttribute("href"), officialMap);
  await page.click("#closeFlavorModal");

  await page.click("#menuToggle");
  assert.ok(await page.locator("#publicNav").evaluate((element) => element.classList.contains("is-open")));
  await page.click('#publicNav a[href="#sabores"]');
  assert.ok(!(await page.locator("#publicNav").evaluate((element) => element.classList.contains("is-open"))));

  await page.fill('#resellerForm input[name="nome"]', "Teste Público");
  await page.fill('#resellerForm input[name="negocio"]', "Mercado Teste");
  await page.selectOption('#resellerForm select[name="tipo"]', { index: 1 });
  await page.fill('#resellerForm input[name="bairro"]', "Centro");
  await page.fill('#resellerForm input[name="whatsapp"]', "92999999999");
  await page.click('#resellerForm button[type="submit"]');
  await page.waitForFunction(() => !document.querySelector("#resellerSuccess").classList.contains("hidden"));
  assert.strictEqual(leadRequests, 1, "one submit must produce exactly one API request");
  assert.match(await page.locator("#resellerSuccess").innerText(), /Recebemos seus dados/);

  const width = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  assert.ok(width.document <= width.viewport + 3, `public page overflows horizontally: ${JSON.stringify(width)}`);

  await browser.close();
  console.log("Public regression: map CTAs, flavor details, mobile menu, lead persistence and responsive width passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
