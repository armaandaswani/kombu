const fs = require("node:fs");
let playwright;
try {
  playwright = require("./browser/node_modules/playwright");
} catch (error) {
  throw new Error("Browser tests need Playwright. Run npm run test:ui:setup first.", { cause: error });
}
const localChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const launchOptions = {
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH }
    : fs.existsSync(localChrome) ? { executablePath: localChrome } : {}),
};
module.exports = { ...playwright, launchOptions };
