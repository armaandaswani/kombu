// The operator guide names buttons and fields in bold exactly as the screen
// shows them. Every bold label must still exist in the admin, so a renamed
// button fails here instead of leaving the guide pointing at nothing.
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const guide = fs.readFileSync(path.join(root, "GUIA_DO_OPERADOR.md"), "utf8");
const screens = ["admin.html", "assets/admin.js"].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
// Examples the reader types, not labels on screen.
const examples = new Set(["em negrito", "14/11", "chave de acesso", "Responsável"]);
const labels = [...new Set([...guide.matchAll(/\*\*([^*]+)\*\*/g)].map((match) => match[1]))];
const missing = labels.filter((label) => !examples.has(label) && !screens.includes(label));
assert.deepEqual(missing, [], "labels in GUIA_DO_OPERADOR.md that no screen shows");
assert.ok(screens.includes("Responsável"), "the production form still asks for Responsável");
console.log(`Operator guide: all ${labels.length} bold labels exist on screen.`);
