// An open dialog owns the scrolling. On a phone, swiping inside it or on the dim
// area around it used to scroll the page behind, and a dialog sized in 100vh was
// taller than the visible screen on an iPhone (the address bar and toolbar take
// space that 100vh ignores), which hid its bottom buttons. This drives real touch
// gestures in a phone-sized Chromium, and the mouse wheel on desktop, and checks
// that the page behind never moves while a dialog is open, that it moves again
// once the dialog closes, and that the dialog fits the visible screen.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium, launchOptions } = require("./browser-runtime");

const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local fixtures only");
const storageKey = "kombuAdminStateV3";
const seed = {
  products: [{ id: "p", item: "KMB1", flavor: "Maracujá", sizeMl: 500, retailPrice: 22, wholesalePrice: 15, status: "ativo", visible: true }],
  recipes: [], batches: [], purchases: [], sales: [], ingredients: [], packaging: [], orders: [], expenses: [], partners: [], suppliers: [], audit: [],
};
const longDialog = `${Array.from({ length: 60 }, (_, index) => `<p>Linha ${index + 1} do conteúdo da janela, longa o bastante para precisar rolar.</p>`).join("")}<button class="btn btn-primary" id="dialogEnd" type="button">Confirmar</button>`;

// The dialog is sized in dvh (the visible height), with vh only as the fallback
// for browsers that do not know it.
const css = fs.readFileSync(path.join(__dirname, "..", "assets", "kombu.css"), "utf8");
const panelRule = css.match(/\.modal-panel \{[^}]*max-height:[^}]*\}/g) || [];
assert.ok(panelRule.some((rule) => /max-height:\s*calc\(100dvh/.test(rule)), "the dialog is as tall as the visible screen (dvh), not the largest one (vh)");

(async () => {
  const browser = await chromium.launch(launchOptions);
  try {
    for (const phone of [true, false]) {
      const viewport = phone ? { width: 390, height: 700 } : { width: 1440, height: 900 };
      const context = await browser.newContext({ viewport, hasTouch: phone, isMobile: phone, deviceScaleFactor: phone ? 3 : 1, locale: "pt-BR" });
      await context.addInitScript(({ key, value }) => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value)); }, { key: storageKey, value: seed });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`${base}/admin.html`);
      await page.fill("#adminPassword", "local-fixture");
      await page.click('#loginForm button[type="submit"]');
      await page.waitForSelector("#adminShell:not(.is-locked)");
      await page.evaluate(() => { document.querySelector("#adminContent").style.minHeight = "4000px"; });
      const client = await context.newCDPSession(page);
      const scrollY = () => page.evaluate(() => Math.round(window.scrollY));
      const panelState = () => page.evaluate(() => {
        const panel = document.querySelector("#adminModal .modal-panel");
        return { top: Math.round(panel.scrollTop), max: Math.round(panel.scrollHeight - panel.clientHeight), bottom: panel.getBoundingClientRect().bottom, height: innerHeight };
      });
      // A real swipe (touch) or wheel turn, at a point of the screen.
      const scrollAt = async (x, y, distance) => {
        if (phone) {
          await client.send("Input.synthesizeScrollGesture", { x, y, yDistance: -distance, gestureSourceType: "touch", speed: 1800 });
        } else {
          await page.mouse.move(x, y);
          await page.mouse.wheel(0, distance);
        }
        await page.waitForTimeout(120);
      };
      const label = phone ? "phone" : "desktop";
      const middle = viewport.width / 2;

      await page.evaluate(() => window.scrollTo(0, 500));
      const before = await scrollY();
      assert.ok(before > 300, `${label}: the page behind is scrolled down to start with`);

      await page.evaluate((html) => openModal("Janela longa", "Teste", html), longDialog);
      await page.waitForSelector("#adminModal.is-open");
      let panel = await panelState();
      assert.ok(panel.max > 300, `${label}: the dialog has content to scroll`);
      assert.ok(panel.bottom <= panel.height + 1, `${label}: the dialog fits the visible screen (bottom ${panel.bottom}, screen ${panel.height})`);

      // Scrolling inside the dialog scrolls the dialog, all the way to its end and
      // on past it, and never the page behind.
      for (let turn = 0; turn < 8; turn += 1) await scrollAt(middle, viewport.height / 2, 700);
      panel = await panelState();
      assert.ok(panel.top >= panel.max - 2, `${label}: the dialog scrolled to its end (${panel.top} of ${panel.max})`);
      assert.equal(await scrollY(), before, `${label}: scrolling past the end of the dialog does not move the page behind`);
      const end = await page.evaluate(() => document.querySelector("#dialogEnd").getBoundingClientRect().bottom);
      assert.ok(end <= viewport.height + 1, `${label}: the last button is on screen once the dialog is scrolled to its end`);
      for (let turn = 0; turn < 8; turn += 1) await scrollAt(middle, viewport.height / 2, -700);
      assert.equal(await scrollY(), before, `${label}: scrolling past the top of the dialog does not move the page behind`);

      // The dim area around the dialog does not scroll the page either.
      await scrollAt(6, viewport.height / 2, 600);
      await scrollAt(viewport.width - 6, viewport.height / 2, 600);
      await scrollAt(middle, 6, 600);
      assert.equal(await scrollY(), before, `${label}: scrolling on the dim area does not move the page behind`);

      // Closing hands the page back where it was, scrollable again.
      await page.evaluate(() => closeModal());
      assert.equal(await scrollY(), before, `${label}: the page is where it was after the dialog closes`);
      await scrollAt(middle, viewport.height / 2, 400);
      assert.ok((await scrollY()) > before, `${label}: the page scrolls again once the dialog is closed`);

      // Opening and closing again keeps working.
      await page.evaluate((html) => openModal("Outra vez", "Teste", html), longDialog);
      const again = await scrollY();
      for (let turn = 0; turn < 4; turn += 1) await scrollAt(middle, viewport.height / 2, 700);
      assert.equal(await scrollY(), again, `${label}: the second dialog also holds the page still`);
      await page.evaluate(() => closeModal());
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("Dialog scrolling: touch swipes on a phone and the wheel on desktop scroll the dialog, never the page behind, on its content and on the dim area, the dialog fits the visible screen, and the page is released and scrollable after closing passed.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
