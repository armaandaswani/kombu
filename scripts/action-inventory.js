// Every button in the admin is a data-action handled by handleAction. This
// lists the action names the screens render and the names handleAction knows,
// and fails when a rendered button has no handler: a button that does nothing.
// Usage: node scripts/action-inventory.js [--list]
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const admin = fs.readFileSync(path.join(root, "assets/admin.js"), "utf8");
const html = fs.readFileSync(path.join(root, "admin.html"), "utf8");

function handledActions() {
  const start = admin.indexOf("function handleAction(action) {");
  const end = admin.indexOf("\n}\n", start);
  if (start < 0 || end < 0) throw new Error("handleAction not found");
  return new Set([...admin.slice(start, end).matchAll(/^\s{4}"([a-z0-9-]+)":/gm)].map((match) => match[1]));
}

function renderedActions() {
  const source = `${admin}\n${html}`;
  const patterns = [
    /data-action="([a-z][a-z0-9-]*)/g,
    /actionButton\([`"]([a-z][a-z0-9-]*)/g,
    /tableAction\([`"]([a-z][a-z0-9-]*)/g,
    /operatorTask\("([a-z][a-z0-9-]*)"/g,
    /action: `([a-z][a-z0-9-]*):/g,
  ];
  const found = new Map();
  patterns.forEach((pattern) => {
    for (const match of source.matchAll(pattern)) {
      const line = source.slice(0, match.index).split("\n").length;
      if (!found.has(match[1])) found.set(match[1], line);
    }
  });
  return found;
}

const handled = handledActions();
const rendered = renderedActions();
// "noop" sits on a <summary>: the click opens the menu natively and the empty
// action keeps it from reaching other handlers.
const ALLOWED_WITHOUT_HANDLER = new Set(["noop"]);
// A name built at runtime ("global-prices-${sizeMl}") is seen as its prefix.
const covers = (action, handler) => action === handler || (action.endsWith("-") && handler.startsWith(action));
const unhandled = [...rendered.entries()].filter(([action]) => !ALLOWED_WITHOUT_HANDLER.has(action) && ![...handled].some((handler) => covers(action, handler)));
const unused = [...handled].filter((handler) => ![...rendered.keys()].some((action) => covers(action, handler)));

if (process.argv.includes("--list")) {
  console.log([...rendered.keys()].sort().join("\n"));
}
if (require.main === module) {
  if (unhandled.length) {
    console.error(`Buttons with no handler:\n${unhandled.map(([action, line]) => `  ${action} (first seen near line ${line})`).join("\n")}`);
    process.exitCode = 1;
  }
  console.log(`Action inventory: ${rendered.size} rendered actions, ${handled.size} handled, ${unhandled.length} without a handler, ${unused.length} handlers never rendered${unused.length ? ` (${unused.join(", ")})` : ""}.`);
}

module.exports = { handledActions, renderedActions };
