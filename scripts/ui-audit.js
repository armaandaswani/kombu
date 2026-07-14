const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const baseUrl = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
const outputDir = process.env.AUDIT_OUTPUT_DIR || "/tmp/kombu-ui-audit";
const executablePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const viewports = [
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1440", width: 1440, height: 900 },
];
const adminModules = ["dashboard", "products", "ingredients", "purchases", "suppliers", "recipes", "costs", "batches", "stock", "packaging", "sales", "orders", "leads", "partners", "expenses", "reports", "cms", "schema"];

fs.mkdirSync(outputDir, { recursive: true });

async function inspectPage(page) {
  return page.evaluate(() => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const selector = (element) => {
      const id = element.id ? `#${element.id}` : "";
      const classes = [...element.classList].slice(0, 3).map((name) => `.${name}`).join("");
      return `${element.tagName.toLowerCase()}${id}${classes}`;
    };
    const overflow = [...document.querySelectorAll("body *")]
      .filter(visible)
      .filter((element) => element.scrollWidth > element.clientWidth + 3)
      .filter((element) => !["SELECT", "INPUT", "TEXTAREA"].includes(element.tagName))
      .slice(0, 40)
      .map((element) => ({ selector: selector(element), clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }));
    const clipped = [...document.querySelectorAll("body *")]
      .filter(visible)
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left < -2 || rect.right > window.innerWidth + 2;
      })
      .slice(0, 40)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { selector: selector(element), left: Math.round(rect.left), right: Math.round(rect.right) };
      });
    const smallTargets = [...document.querySelectorAll("button, a, input, select, textarea")]
      .filter(visible)
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width < 40 || rect.height < 40;
      })
      .slice(0, 60)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { selector: selector(element), width: Math.round(rect.width), height: Math.round(rect.height), text: (element.textContent || element.getAttribute("aria-label") || "").trim().slice(0, 60) };
      });
    const unlabeledControls = [...document.querySelectorAll("input, select, textarea, button")]
      .filter(visible)
      .filter((element) => {
        if (element.tagName === "BUTTON") return !(element.textContent || "").trim() && !element.getAttribute("aria-label") && !element.title;
        const label = element.labels?.length || element.getAttribute("aria-label") || element.getAttribute("aria-labelledby") || element.title;
        return !label;
      })
      .slice(0, 60)
      .map(selector);
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      overflow,
      clipped,
      smallTargets,
      unlabeledControls,
      imagesWithoutAlt: [...document.images].filter((image) => !image.hasAttribute("alt")).map(selector),
    };
  });
}

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath });
  const report = { baseUrl, generatedAt: new Date().toISOString(), pages: [] };
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, locale: "pt-BR" });
    const page = await context.newPage();
    const errors = [];
    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const detail = message.text();
      if (baseUrl.startsWith("http://127.0.0.1") && detail.includes("Failed to load resource")) return;
      errors.push(`console: ${detail}`);
    });
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));

    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    report.pages.push({ page: "public", viewport: viewport.name, errors: [...errors], ...(await inspectPage(page)) });
    if (viewport.name === "mobile-375" || viewport.name === "desktop-1440") {
      await page.screenshot({ path: path.join(outputDir, `public-${viewport.name}.png`), fullPage: true });
    }

    errors.length = 0;
    await page.goto(`${baseUrl}/admin.html`, { waitUntil: "domcontentloaded" });
    await page.fill("#adminPassword", "local-audit");
    await page.click('#loginForm button[type="submit"]');
    await page.waitForSelector("#adminShell:not(.is-locked)", { timeout: 10000 });
    await page.waitForTimeout(300);
    for (const moduleName of adminModules) {
      await page.evaluate((value) => {
        const select = document.querySelector("#mobileModuleSelector");
        select.value = value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }, moduleName);
      await page.waitForTimeout(80);
      report.pages.push({ page: `admin:${moduleName}`, viewport: viewport.name, errors: [...errors], ...(await inspectPage(page)) });
      errors.length = 0;
      if (viewport.name === "mobile-375" && ["dashboard", "stock", "orders"].includes(moduleName)) {
        await page.screenshot({ path: path.join(outputDir, `admin-${moduleName}-${viewport.name}.png`), fullPage: true });
      }
    }
    await context.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
  const summary = report.pages.map((entry) => ({
    page: entry.page,
    viewport: entry.viewport,
    horizontalOverflow: Math.max(entry.documentWidth, entry.bodyWidth) > entry.viewport.width + 3,
    overflowElements: entry.overflow.length,
    clippedElements: entry.clipped.length,
    smallTargets: entry.smallTargets.length,
    unlabeledControls: entry.unlabeledControls.length,
    errors: entry.errors.length,
  }));
  fs.writeFileSync(path.join(outputDir, "summary.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
