// Passkey sign-in in a real Chromium with a virtual authenticator (the same
// facility Chrome uses to test Face ID and Touch ID), talking to the real API
// handlers through an in-memory Supabase. It starts its own server because the
// shared fixture server turns the API off. Covers: adding a device (wrong password
// refused), signing in with it from the login screen, a device that cannot verify
// the user, removing it, English, phone width and the production security headers.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium, launchOptions } = require("./browser-runtime");
const { SUPABASE_URL, installFakeSupabase } = require("./passkey-helpers");

process.env.ADMIN_PORTAL_PASSWORD = "senha-de-teste";
process.env.ADMIN_SESSION_SECRET = "a-long-test-session-secret";
process.env.SUPABASE_URL = SUPABASE_URL;
process.env.SUPABASE_SERVICE_ROLE_KEY = "a-long-test-supabase-service-role-key";
const database = installFakeSupabase();

const root = path.resolve(__dirname, "..");
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg" };
const productionHeaders = Object.fromEntries(
  (JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8")).headers.find((rule) => rule.source === "/(.*)")?.headers || [])
    .filter((header) => header.key !== "Strict-Transport-Security")
    .map((header) => [header.key, header.value]),
);
const routes = {
  "/api/auth/passkey": require("../api/auth/passkey"),
  "/api/auth/login": require("../api/auth/login"),
  "/api/auth/session": require("../api/auth/session"),
  "/api/auth/logout": require("../api/auth/logout"),
};
const server = http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (routes[pathname]) return routes[pathname](req, res);
  if (pathname.startsWith("/api/")) { res.writeHead(503, { "Content-Type": "application/json" }); return res.end('{"error":"fixture"}'); }
  try {
    const requested = pathname === "/" ? "index.html" : pathname === "/admin" ? "admin.html" : pathname.slice(1);
    const file = path.resolve(root, path.extname(requested) ? requested : `${requested}.html`);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    res.writeHead(200, { ...productionHeaders, "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(fs.readFileSync(file));
  } catch {
    res.writeHead(404);
    res.end();
  }
});

(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://localhost:${server.address().port}`;
  const browser = await chromium.launch(launchOptions);
  let round = 0;
  try {
    for (const width of [390, 1440]) {
      for (const locale of ["pt", "en"]) {
        const T = (pt, en) => (locale === "en" ? en : pt);
        database.rows.clear();
        const context = await browser.newContext({ viewport: { width, height: 900 }, locale: locale === "en" ? "en-US" : "pt-BR" });
        // Each round signs in as a different visitor: password attempts are rate
        // limited per address, and the four rounds would otherwise share one budget.
        round += 1;
        await context.setExtraHTTPHeaders({ "x-forwarded-for": `10.20.0.${round}` });
        await context.addInitScript((lang) => localStorage.setItem("kombuAdminLocale", lang), locale);
        const page = await context.newPage();
        const errors = [];
        const optionRequests = [];
        page.on("request", (request) => {
          if (request.url().endsWith("/api/auth/passkey") && /login-options/.test(request.postData() || "")) optionRequests.push(request.url());
        });
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("dialog", (dialog) => dialog.accept());
        const client = await context.newCDPSession(page);
        await client.send("WebAuthn.enable");
        const { authenticatorId } = await client.send("WebAuthn.addVirtualAuthenticator", {
          options: { protocol: "ctap2", transport: "internal", hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true },
        });
        const credentials = async () => (await client.send("WebAuthn.getCredentials", { authenticatorId })).credentials;
        const noOverflow = async (where) => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `no horizontal scroll: ${where} at ${width}px`);
        const loginError = () => page.locator("#loginError");

        // The security headers of production are on the page, and the login screen offers the button.
        const response = await page.goto(`${base}/admin`);
        assert.match(response.headers()["content-security-policy"], /script-src 'self' 'wasm-unsafe-eval'/);
        await page.waitForSelector("#loginScreen:not(.is-hidden)");
        const passkeyButton = page.locator("#passkeyLoginButton");
        assert.equal(await passkeyButton.isVisible(), true, "the login screen offers the passkey button");
        assert.equal(await passkeyButton.evaluate((node) => [...node.childNodes].filter((child) => child.nodeType === 3).map((child) => child.textContent).join(" ").trim()), T("Entrar com Face ID ou digital", "Sign in with Face ID or fingerprint"));
        assert.ok((await passkeyButton.boundingBox()).height >= 44, "the button is large enough to tap");
        await noOverflow("login screen");
        if (process.env.PASSKEY_SHOTS) await page.screenshot({ path: `${process.env.PASSKEY_SHOTS}/login-${locale}-${width}.png` });

        // No passkey yet: the screen says what to do, and nothing opens.
        await passkeyButton.click();
        await loginError().waitFor({ state: "visible" });
        assert.equal(await loginError().innerText(), T("Nenhum passkey cadastrado ainda. Entre com a senha e cadastre pelo botão Passkey.", "No passkey is set up yet. Sign in with the password and add one with the Passkey button."));
        assert.equal(await page.locator("#adminShell.is-locked").count(), 1);

        // Sign in with the password, then add this device.
        await page.fill("#adminPassword", "senha-de-teste");
        await page.click('#loginForm button[type="submit"]');
        await page.waitForSelector("#adminShell:not(.is-locked)");
        await page.click("#passkeyButton");
        const form = page.locator("#passkeyForm");
        await form.waitFor();
        await page.locator("#passkeyList .empty-note").filter({ hasText: T("Nenhum aparelho cadastrado ainda.", "No device registered yet.") }).waitFor();
        await form.locator('[name="label"]').fill("iPhone de teste");
        await form.locator('[name="password"]').fill("errada");
        await form.locator('button[type="submit"]').click();
        await page.locator("#passkeyStatus").filter({ hasText: T("Senha incorreta.", "Incorrect password.") }).waitFor();
        assert.equal((await credentials()).length, 0, "a wrong password adds nothing");
        await form.locator('[name="password"]').fill("senha-de-teste");
        await form.locator('button[type="submit"]').click();
        await page.locator("#passkeyStatus").filter({ hasText: T("Aparelho cadastrado", "Device registered") }).waitFor();
        await page.locator(".passkey-item").filter({ hasText: "iPhone de teste" }).waitFor();
        const stored = await credentials();
        assert.equal(stored.length, 1, "the authenticator holds the new passkey");
        assert.equal(stored[0].isResidentCredential, true);
        assert.equal(database.rows.get("admin_passkeys").state.credentials.length, 1, "the server stored its public half");
        assert.equal(JSON.stringify(await page.evaluate(() => document.querySelector("#adminModalBody").innerText)).includes("publicKey"), false);
        assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll("#adminModal button")].filter((node) => node.offsetParent && node.getBoundingClientRect().height < 40).map((node) => node.innerText)), [], "every button in the dialog is easy to tap");
        await noOverflow("passkey dialog");
        if (process.env.PASSKEY_SHOTS) await page.screenshot({ path: `${process.env.PASSKEY_SHOTS}/passkey-${locale}-${width}.png` });
        await page.evaluate(() => closeModal());

        // Log out and sign in again with the passkey only.
        await page.click("#logoutButton");
        await page.waitForSelector("#loginScreen:not(.is-hidden)");
        const cookieAfterLogout = (await context.cookies()).find((cookie) => cookie.name === "kombu_admin_session");
        assert.ok(!cookieAfterLogout || !cookieAfterLogout.value, "logging out clears the session");
        // Safari wants the Face ID prompt right after the tap, so the challenge is
        // fetched when the login screen shows and the tap makes no request first.
        await page.waitForFunction(() => passkeyPrefetch !== null);
        const requestsBeforeTap = optionRequests.length;
        await passkeyButton.click();
        await page.waitForSelector("#adminShell:not(.is-locked)");
        assert.equal(optionRequests.length, requestsBeforeTap, "the tap used the challenge fetched when the screen appeared");
        assert.equal((await page.evaluate(() => fetch("/api/auth/session", { credentials: "same-origin" }).then((r) => r.status))), 200, "the passkey gave a real server session");
        assert.equal(database.rows.get("admin_passkeys").state.credentials[0].lastUsedAt !== null, true);
        await page.reload();
        await page.waitForSelector("#adminShell:not(.is-locked)");

        // A challenge fetched long ago is not used; the tap fetches a fresh one.
        await page.click("#logoutButton");
        await page.waitForSelector("#loginScreen:not(.is-hidden)");
        await page.waitForFunction(() => passkeyPrefetch !== null);
        await page.evaluate(() => { passkeyPrefetch.at -= 200000; });
        const requestsBeforeStale = optionRequests.length;
        await passkeyButton.click();
        await page.waitForSelector("#adminShell:not(.is-locked)");
        assert.equal(optionRequests.length, requestsBeforeStale + 1, "an old challenge is replaced by a new request");
        await page.reload();
        await page.waitForSelector("#adminShell:not(.is-locked)");

        // A device that cannot verify the user (no Face ID match) gets in nowhere.
        await page.click("#logoutButton");
        await page.waitForSelector("#loginScreen:not(.is-hidden)");
        await client.send("WebAuthn.setUserVerified", { authenticatorId, isUserVerified: false });
        await passkeyButton.click();
        await loginError().waitFor({ state: "visible" });
        assert.equal(await page.locator("#adminShell.is-locked").count(), 1, "no entry without user verification");
        assert.equal(await loginError().innerText(), T("Entrada cancelada. Você pode tentar de novo ou usar a senha.", "Sign-in cancelled. You can try again or use the password."));
        await client.send("WebAuthn.setUserVerified", { authenticatorId, isUserVerified: true });

        // Removing the device ends it.
        await page.fill("#adminPassword", "senha-de-teste");
        await page.click('#loginForm button[type="submit"]');
        await page.waitForSelector("#adminShell:not(.is-locked)");
        await page.click("#passkeyButton");
        await page.locator(".passkey-item").filter({ hasText: "iPhone de teste" }).locator("[data-passkey-remove]").click();
        await page.locator("#passkeyList .empty-note").filter({ hasText: T("Nenhum aparelho cadastrado ainda.", "No device registered yet.") }).waitFor();
        assert.equal(database.rows.get("admin_passkeys").state.credentials.length, 0);
        await page.evaluate(() => closeModal());
        await page.click("#logoutButton");
        await page.waitForSelector("#loginScreen:not(.is-hidden)");
        await passkeyButton.click();
        await loginError().waitFor({ state: "visible" });
        assert.equal(await page.locator("#adminShell.is-locked").count(), 1, "a removed device cannot sign in");

        if (locale === "en") {
          const leftovers = await page.evaluate(() => window.KombuLocale.misses().map((miss) => miss.text));
          assert.deepEqual(leftovers.filter((text) => /^ou$|passkey|aparelho|senha|Face ID|digital|cadastr|Entrar|Remover/i.test(text)), [], "the passkey screens have untranslated text");
        }
        assert.deepEqual(errors, []);
        await context.close();
      }
    }
    console.log("Passkey browser: real Chromium and virtual authenticator, add a device (wrong password refused), sign in with it, session works after reload, unverified device refused, removal, production CSP, PT/EN, 390/1440px and no page errors passed.");
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
  server.close();
});
