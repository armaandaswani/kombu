// Reading a receipt photo end to end, with the real on-device recognition
// (tesseract.js) under the production Content-Security-Policy: photo, review,
// confirm, weighted-average posting, duplicate refusal, and a blurred photo that
// must not produce invented values. Receipt images are rendered here from text,
// so they are cleaner than real phone photos; real photos still need checking.
const assert = require("node:assert/strict");
const { chromium, launchOptions } = require("./browser-runtime");
const { accessKeyCheckDigit } = require("../assets/receipt-reader");

const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local fixtures only");
const storageKey = "kombuAdminStateV3";
const first43 = "13251111222333000181650010000123451" + "12345678";
const key = `${first43}${accessKeyCheckDigit(first43)}`;
const receiptHtml = (blur) => `<!doctype html><html><body style="margin:0;background:#fff">
<pre id="receipt" style="display:inline-block;margin:0;padding:28px;background:#fff;color:#000;font:20px/1.45 'Courier New',monospace;filter:blur(${blur}px)">MERCADO BOA COMPRA LTDA
CNPJ: 11.222.333/0001-81
Av. Djalma Batista 1000 Manaus AM
DANFE NFC-e
001 ACUCAR CRISTAL 1KG 2 UN X 4,99 9,98
002 GENGIBRE KG 0,500 KG X 25,90 12,95
Valor total R$ 22,93
Desconto R$ 0,00
Valor a pagar R$ 22,93
NFC-e n 000012345 Serie 001
Emissao 14/11/2025 10:32:11
Chave de acesso
${key.match(/.{1,4}/g).join(" ")}</pre></body></html>`;
const seed = {
  products: [], recipes: [], batches: [], orders: [], sales: [], expenses: [], partners: [], packaging: [], audit: [],
  suppliers: [{ id: "s", name: "MERCADO BOA COMPRA LTDA", status: "ativo" }],
  ingredients: [
    { id: "acucar", name: "Açúcar", category: "açúcar", purchaseUnit: "g", stock: 1000, costPerUnit: 0.005, min: 0, status: "ativo", stockCountedAt: "2026-11-01" },
    { id: "gengibre", name: "Gengibre", category: "especiaria", purchaseUnit: "g", stock: 0, costPerUnit: 0, min: 0, status: "ativo" },
  ],
  purchases: [],
};

(async () => {
  const browser = await chromium.launch(launchOptions);
  try {
    const imageContext = await browser.newContext({ deviceScaleFactor: 2 });
    const imagePage = await imageContext.newPage();
    const photo = async (blur) => {
      await imagePage.setContent(receiptHtml(blur));
      return imagePage.locator("#receipt").screenshot({ type: "png" });
    };
    const clear = await photo(0);
    const blurred = await photo(6);
    await imageContext.close();

    const context = await browser.newContext({ viewport: { width: 390, height: 900 }, locale: "pt-BR" });
    await context.addInitScript(({ key, value }) => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value)); }, { key: storageKey, value: seed });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error" && /Content Security Policy|Refused/i.test(message.text())) errors.push(message.text()); });
    const dialogs = [];
    page.on("dialog", (dialog) => { dialogs.push(dialog.message()); return dialog.accept(); });
    const snapshot = () => page.evaluate((storage) => JSON.parse(localStorage.getItem(storage)), storageKey);
    const response = await page.goto(`${base}/admin.html`);
    assert.match(response.headers()["content-security-policy"] || "", /script-src 'self' 'wasm-unsafe-eval'/, "runs under the production policy");
    await page.fill("#adminPassword", "local-fixture");
    await page.click('#loginForm button[type="submit"]');
    await page.waitForSelector("#adminShell:not(.is-locked)");
    const readPhoto = async (buffer) => {
      await page.evaluate(() => handleAction("read-receipt"));
      await page.waitForSelector("[data-receipt-photo]");
      await page.locator("[data-receipt-photo]").nth(1).setInputFiles({ name: "nota.png", mimeType: "image/png", buffer });
      await page.waitForFunction(() => document.querySelector("#receiptReviewForm") || /já foi registrada|Não consegui ler|demorou demais/.test(document.querySelector("#adminModal")?.innerText || ""), null, { timeout: 120000 });
    };

    // 1. Clear photo: the key is read and checked, fields are filled, items are suggested.
    await readPhoto(clear);
    const review = page.locator("#receiptReviewForm");
    assert.ok(await review.isVisible(), "the review form opens");
    const keyCard = await review.locator(".result-card").first().innerText();
    assert.match(keyCard, /Conferido/, "access key checked");
    assert.equal((await review.locator(".result-card strong").first().innerText()).replace(/\D/g, ""), key);
    assert.equal(await review.locator('[name="date"]').inputValue(), "2025-11-14");
    assert.equal(await review.locator('[name="total"]').inputValue(), "22.93");
    assert.equal(await review.locator('[name="cnpj"]').inputValue(), "11.222.333/0001-81");
    const rows = review.locator("[data-receipt-item]");
    assert.equal(await rows.count(), 2);
    assert.equal(await rows.nth(0).locator('[data-field="target"]').inputValue(), "ingredients:acucar");
    assert.equal(await rows.nth(1).locator('[data-field="target"]').inputValue(), "ingredients:gengibre");
    assert.match(await page.locator("#receiptSum").innerText(), /Os valores batem/);

    // 2. "2 UN" of "ACUCAR CRISTAL 1KG" is offered as 2 kg, the way sugar is
    // stocked. A unit that cannot convert to the stock unit is refused, and
    // nothing at all is posted while any line is wrong.
    assert.equal(await rows.nth(0).locator('[data-field="qty"]').inputValue(), "2");
    assert.equal(await rows.nth(0).locator('[data-field="unit"]').inputValue(), "kg");
    await rows.nth(1).locator('[data-field="unit"]').selectOption("un");
    await review.locator('button[type="submit"]').click();
    assert.match(dialogs.at(-1), /unidade de "GENGIBRE KG" \(un\) não combina com o estoque de Gengibre \(g\)/);
    assert.equal((await snapshot()).purchases.length, 0, "nothing is posted while a line is wrong");
    await rows.nth(1).locator('[data-field="unit"]').selectOption("kg");
    await review.locator('button[type="submit"]').click();
    await page.waitForSelector("#adminModal", { state: "hidden" });
    let state = await snapshot();
    assert.equal(state.purchases.length, 2);
    assert.ok(state.purchases.every((purchase) => purchase.documentKey === key && purchase.readFromPhoto && purchase.documentTotal === 22.93));
    const acucar = state.ingredients.find((item) => item.id === "acucar");
    const gengibre = state.ingredients.find((item) => item.id === "gengibre");
    assert.equal(acucar.stock, 3000);
    assert.ok(Math.abs(acucar.costPerUnit - (5 + 9.98) / 3000) < 1e-6, "weighted average cost");
    assert.equal(gengibre.stock, 500);
    assert.ok(Math.abs(gengibre.costPerUnit - 12.95 / 500) < 1e-6);
    assert.equal(state.expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0).toFixed(2), "22.93", "expenses add up to what was paid");

    // 3. The same photo again is refused.
    await readPhoto(clear);
    assert.match(await page.locator("#adminModal").innerText(), /Esta nota já foi registrada/);
    assert.equal((await snapshot()).purchases.length, 2);
    await page.evaluate(() => closeModal());

    // 4. A badly blurred photo: whatever comes back, the key is not trusted and
    // no total or item is invented; nothing is posted.
    await readPhoto(blurred);
    const modalText = await page.locator("#adminModal").innerText();
    if (await page.locator("#receiptReviewForm").count()) {
      assert.doesNotMatch(await page.locator("#receiptReviewForm .result-card").first().innerText(), /Conferido/);
      assert.notEqual(await page.locator('#receiptReviewForm [name="total"]').inputValue(), "22.93");
    } else {
      assert.match(modalText, /Não consegui ler/);
    }
    assert.equal((await snapshot()).purchases.length, 2);
    assert.deepEqual(errors, []);
    await context.close();

    // 5. Where WebAssembly is blocked (old iOS, or the policy without
    // 'wasm-unsafe-eval') the operator gets a message and the normal form
    // instead of waiting forever.
    const blocked = await browser.newContext({ viewport: { width: 390, height: 900 }, locale: "pt-BR" });
    await blocked.addInitScript(({ key, value }) => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value)); }, { key: storageKey, value: seed });
    await blocked.route("**/*", async (route) => {
      const original = await route.fetch();
      const headers = { ...original.headers() };
      if (headers["content-security-policy"]) headers["content-security-policy"] = headers["content-security-policy"].replace(" 'wasm-unsafe-eval'", "");
      await route.fulfill({ response: original, headers });
    });
    const old = await blocked.newPage();
    await old.goto(`${base}/admin.html`);
    await old.fill("#adminPassword", "local-fixture");
    await old.click('#loginForm button[type="submit"]');
    await old.waitForSelector("#adminShell:not(.is-locked)");
    await old.evaluate(() => { receiptReadTimeoutMs = 8000; handleAction("read-receipt"); });
    await old.locator("[data-receipt-photo]").nth(1).setInputFiles({ name: "nota.png", mimeType: "image/png", buffer: clear });
    await old.waitForFunction(() => /demorou demais|Não consegui ler/.test(document.querySelector("#receiptProgress")?.innerText || ""), null, { timeout: 60000 });
    await old.click('#receiptProgress [data-action="new-purchase"]');
    await old.waitForSelector("#purchaseForm");
    assert.equal(JSON.parse(await old.evaluate((storage) => localStorage.getItem(storage), storageKey)).purchases.length, 0);
    await blocked.close();
    console.log("Receipt capture: on-device reading under the production CSP, checked access key and fields, unit correction, weighted-average posting, duplicate refusal, blurred photo without invented values and a clear fallback where WebAssembly is blocked passed at 390px.");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
