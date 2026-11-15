// Lists the Portuguese interface text in assets/admin.js and admin.html that
// has no English entry in assets/admin-i18n.js. String and template literals
// are scanned; markup is split into its text fragments and each ${...} becomes
// {0}, {1}... so the keys match what the localization layer sees in the DOM.
// Usage: node scripts/i18n-extract.js [--json out.json]
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const PORTUGUESE = /[ãáàâçéêíóôõúÃÁÀÂÇÉÊÍÓÔÕÚ]|\b(de|do|da|dos|das|para|com|sem|não|ou|em|no|na|por|um|uma|ao|seu|sua|novo|nova|salvar|cancelar|excluir|editar|pedido|venda|compra|estoque|lote|cliente|parceiro|fornecedor|despesa|receita|custo|garrafa|sabor|hoje|ativo|pago|aberto|recebido|entregue|cancelado|pronto|produzido|reservado|pendente|abrir|fechar|voltar|ver|registrar|adicionar|remover|buscar|resumo|quantidade|valor|data|tipo|nome|lucro|margem|frete|desconto|pagamento|entrega|saldo|total|itens|item|mês|ano|semana|dia|dias)\b/i;

// Returns every string literal and template literal in source order. Template
// expressions are replaced by {n} placeholders and scanned recursively.
function scanLiterals(source) {
  const out = [];
  let i = 0;
  let lastSignificant = "";
  const regexAllowedAfter = new Set(["", "(", ",", "=", ":", "[", "!", "&", "|", "?", "{", "}", ";", "+", "-", "*", "%", "<", ">", "~", "^", "return", "typeof", "case", "do", "else", "in", "of", "new", "delete", "void", "throw"]);
  function readQuoted(quote) {
    let value = "";
    i += 1;
    while (i < source.length && source[i] !== quote) {
      if (source[i] === "\\") { value += source[i] + source[i + 1]; i += 2; continue; }
      value += source[i];
      i += 1;
    }
    i += 1;
    return value;
  }
  function readTemplate() {
    let text = "";
    let slot = 0;
    i += 1;
    while (i < source.length && source[i] !== "`") {
      if (source[i] === "\\") { text += unescape(source[i] + source[i + 1]); i += 2; continue; }
      if (source[i] === "$" && source[i + 1] === "{") {
        i += 2;
        const start = i;
        let depth = 1;
        while (i < source.length && depth > 0) {
          const ch = source[i];
          if (ch === "'" || ch === '"') { readQuoted(ch); continue; }
          if (ch === "`") { readTemplate(); continue; }
          if (ch === "{") depth += 1;
          if (ch === "}") depth -= 1;
          i += 1;
        }
        const inner = source.slice(start, i - 1);
        out.push(...scanLiterals(inner).map((item) => ({ ...item, nested: true })));
        text += `{${slot}}`;
        slot += 1;
        continue;
      }
      text += source[i];
      i += 1;
    }
    i += 1;
    return text;
  }
  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];
    if (ch === "/" && next === "/") { while (i < source.length && source[i] !== "\n") i += 1; continue; }
    if (ch === "/" && next === "*") { i = source.indexOf("*/", i + 2) + 2; if (i < 2) break; continue; }
    if (ch === "'" || ch === '"' || ch === "`") {
      const before = source.slice(Math.max(0, i - 40), i);
      const value = ch === "`" ? readTemplate() : unescape(readQuoted(ch));
      // Developer diagnostics stay in Portuguese; operators never see them.
      if (!/console\.(error|warn|log|info|debug)\(\s*$/.test(before)) out.push({ kind: ch === "`" ? "template" : "string", value });
      lastSignificant = "x";
      continue;
    }
    if (ch === "/" && regexAllowedAfter.has(lastSignificant)) {
      i += 1;
      let inClass = false;
      while (i < source.length) {
        if (source[i] === "\\") { i += 2; continue; }
        if (source[i] === "[") inClass = true;
        else if (source[i] === "]") inClass = false;
        else if (source[i] === "/" && !inClass) break;
        else if (source[i] === "\n") break;
        i += 1;
      }
      i += 1;
      while (/[a-z]/i.test(source[i] || "")) i += 1;
      lastSignificant = "x";
      continue;
    }
    if (/\s/.test(ch)) { i += 1; continue; }
    if (/[A-Za-z_$]/.test(ch)) {
      let word = "";
      while (/[A-Za-z0-9_$]/.test(source[i] || "")) { word += source[i]; i += 1; }
      lastSignificant = regexAllowedAfter.has(word) ? word : "x";
      continue;
    }
    if (/[0-9]/.test(ch)) { while (/[0-9.a-fA-FxXn_]/.test(source[i] || "")) i += 1; lastSignificant = "x"; continue; }
    lastSignificant = ch === ")" || ch === "]" ? "x" : ch;
    i += 1;
  }
  return out;
}

function unescape(value) {
  return value.replace(/\\(u\{?[0-9a-fA-F]+\}?|.)/g, (match, code) => {
    if (code[0] === "u") return String.fromCodePoint(parseInt(code.replace(/[u{}]/g, ""), 16));
    return { n: "\n", t: "\t" }[code] ?? code;
  });
}

// Splits markup into the text runs a browser would render between tags, and
// keeps the values of attributes people read (placeholder, title, aria-label).
function fragments(value) {
  const parts = [];
  const attributePattern = /\b(?:placeholder|title|aria-label|alt|data-tooltip)\s*=\s*"([^"]*)"/g;
  let match;
  while ((match = attributePattern.exec(value))) parts.push(match[1]);
  const withoutTags = value.replace(/<(script|style)[\s\S]*?<\/\1>/g, " ").split(/<[^>]*>/);
  withoutTags.forEach((part) => parts.push(part));
  return parts
    .map((part) => part.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim())
    .flatMap((part) => (/^\{\d+\}$/.test(part) ? [] : [part]));
}

function renumber(text) {
  let n = 0;
  const map = new Map();
  return text.replace(/\{(\d+)\}/g, (all, slot) => {
    if (!map.has(slot)) map.set(slot, n++);
    return `{${map.get(slot)}}`;
  });
}

function looksLikeInterface(text) {
  if (!text || text.length < 2 || !/[A-Za-zÀ-ú]/.test(text)) return false;
  if (/^[a-z0-9_\-.:#/[\]=*>+~()@!?$]+$/.test(text) && !/[À-ú]/.test(text)) return false; // identifiers, selectors, keys
  if (/^(https?:|mailto:|tel:|data:|\/|\.\/|#|\.)/.test(text)) return false;
  if (/^[\w-]+(\s+[\w-]+)*$/.test(text) && /(^|\s)(is|has|btn|icon|field|grid|card|notice|material|data|js)-/.test(text)) return false; // class lists
  if (/[{};]\s*$/.test(text) && /:\s*[^ ]+;/.test(text)) return false; // inline CSS
  if (/^\{\d+\}(\s*[·|,/:\-–—]\s*\{\d+\})*$/.test(text)) return false;
  if (PORTUGUESE.test(text)) return true;
  // Otherwise anything that reads as words: a capitalized word or a phrase.
  // English and code-like strings that pass go in the catalog's "same" list.
  if (/[<>=;{}]|=>|\(\)|\$\{/.test(text.replace(/\{\d+\}/g, ""))) return false;
  if (/^[a-z][a-zA-Z0-9]*$/.test(text)) return false; // camelCase keys and single lowercase tokens
  return /^[A-ZÀ-Ý]/.test(text) || /[a-zà-ÿ]{2,}\s+[a-zà-ÿ]{2,}/i.test(text);
}

// Seed records (flavor names, product descriptions, public-site copy) are
// business data, edited in the CMS and shown as entered in both languages.
function seedDataStrings() {
  const { createAdminSandbox } = require("./admin-harness");
  const strings = new Set();
  (function walk(value) {
    if (typeof value === "string") { if (value.trim()) strings.add(value.trim()); return; }
    if (Array.isArray(value)) return value.forEach(walk);
    if (value && typeof value === "object") Object.values(value).forEach(walk);
  })(createAdminSandbox().__eval("defaultState"));
  return strings;
}

function extract() {
  const admin = fs.readFileSync(path.join(root, "assets/admin.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "admin.html"), "utf8");
  const seed = seedDataStrings();
  const found = new Map();
  const add = (text, source) => {
    const key = renumber(text);
    if (!looksLikeInterface(key) || seed.has(key)) return;
    if (!found.has(key)) found.set(key, source);
  };
  scanLiterals(admin).forEach((literal) => fragments(literal.value).forEach((text) => add(text, "admin.js")));
  fragments(html.replace(/<head>[\s\S]*?<\/head>/, (head) => (head.match(/<title>[\s\S]*?<\/title>/) || [""])[0])).forEach((text) => add(text, "admin.html"));
  return found;
}

function loadCatalog() {
  const file = path.join(root, "assets/admin-i18n.js");
  if (!fs.existsSync(file)) return { en: {} };
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), sandbox);
  return sandbox.window.KOMBU_I18N || { en: {} };
}

if (require.main === module) {
  const found = extract();
  const catalog = loadCatalog();
  const missing = [...found.entries()].filter(([text]) => !(text in catalog.en) && !(catalog.same || []).includes(text));
  const jsonIndex = process.argv.indexOf("--json");
  if (jsonIndex > 0) {
    fs.writeFileSync(process.argv[jsonIndex + 1], JSON.stringify(missing.map(([text, source]) => ({ text, source })), null, 2));
  }
  console.log(`i18n extract: ${found.size} interface strings found, ${missing.length} without an English entry.`);
}

module.exports = { extract, loadCatalog, scanLiterals, fragments };
