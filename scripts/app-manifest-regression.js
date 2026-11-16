// "Add to Home Screen" obeys the page's manifest, so the admin and the public site
// must declare different apps. The admin shared the site's manifest, whose start
// URL is "/", so a shortcut made from /admin opened the public site. This checks
// that the admin names its own app starting at /admin, that no public page uses
// it, and that the deploy does not leave it out.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const manifestOf = (html) => html.match(/<link[^>]*rel="manifest"[^>]*href="([^"]+)"/)?.[1] || "";
const metaOf = (html, name) => html.match(new RegExp(`<meta[^>]*name="${name}"[^>]*content="([^"]*)"`))?.[1];

const admin = read("admin.html");
const adminManifestPath = manifestOf(admin);
assert.equal(adminManifestPath, "/manifest-admin.webmanifest", "the admin names its own manifest");
const manifest = JSON.parse(read(adminManifestPath.slice(1)));
assert.equal(manifest.start_url, "/admin", "a shortcut opens the admin, not the public site");
assert.equal(manifest.scope, "/admin");
assert.ok(manifest.start_url.startsWith(manifest.scope), "the start URL is inside the scope");
assert.equal(manifest.id, "/admin");
assert.match(manifest.name, /Admin/);
assert.match(manifest.short_name, /Admin/);
assert.equal(manifest.display, "standalone");
for (const icon of manifest.icons) assert.ok(fs.existsSync(path.join(root, icon.src.slice(1))), `icon ${icon.src} exists`);
assert.equal(metaOf(admin, "apple-mobile-web-app-title"), "Kombú Admin", "the iPhone names the shortcut");
assert.equal(metaOf(admin, "apple-mobile-web-app-capable"), "yes");
assert.ok(/<link[^>]*rel="apple-touch-icon"/.test(admin), "the shortcut has an icon");

// The public site keeps its own app, and nothing public points at the admin's.
const publicManifest = JSON.parse(read("manifest.webmanifest"));
assert.equal(publicManifest.start_url, "/");
assert.equal(/admin/i.test(JSON.stringify(publicManifest)), false, "the public manifest never mentions the admin");
const pages = fs.readdirSync(root).filter((file) => file.endsWith(".html") && file !== "admin.html");
for (const page of pages) {
  const used = manifestOf(read(page));
  assert.ok(used !== adminManifestPath, `${page} must not use the admin manifest`);
  if (used) assert.equal(used, "/manifest.webmanifest", `${page} uses the public manifest`);
}

// The deploy must serve it: nothing in .vercelignore matches the file, and the
// security headers do not restrict manifests.
const ignored = read(".vercelignore").split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));
const matches = (pattern, file) => (pattern.endsWith("/")
  ? file.startsWith(pattern)
  : new RegExp(`^${pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*")}$`).test(file));
assert.deepEqual(ignored.filter((pattern) => matches(pattern, "manifest-admin.webmanifest")), [], "the admin manifest is deployed");
const policy = JSON.parse(read("vercel.json")).headers.flatMap((rule) => rule.headers).find((header) => header.key === "Content-Security-Policy")?.value || "";
assert.ok(!/manifest-src/.test(policy) || /manifest-src[^;]*'self'/.test(policy), "the policy lets the site serve its own manifest");

console.log("App manifests: the admin names its own app starting at /admin, no public page uses it, the public manifest still starts at / and the deploy serves it passed.");
