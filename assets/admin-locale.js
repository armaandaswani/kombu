// Localization layer for the admin. Interface text is written in Portuguese in
// assets/admin.js and admin.html; assets/admin-i18n.js holds the English text
// keyed by that Portuguese source (gettext style). Keys may contain {0}, {1}...
// for interpolated values, which are matched in rendered text and translated
// recursively, so "Lote {0}" covers every batch code.
//
// Every render goes through innerHTML, so instead of threading tr() through
// thousands of template literals the layer observes the document and
// translates text nodes and readable attributes as they are inserted. Stored
// data is never touched: inputs, textareas and [data-i18n-skip] subtrees keep
// their content, and Portuguese originals are kept so switching back restores
// them exactly. Anything with no entry is recorded in misses for the coverage
// test (scripts/i18n-coverage.js).
(function initKombuLocale(global) {
  const catalog = global.KOMBU_I18N || { en: {}, same: [] };
  const ATTRIBUTES = ["placeholder", "title", "aria-label", "alt", "data-tooltip"];
  const SEPARATOR = /(\s+[·|–—-]\s+|\s+\/\s+|:\s+|,\s+|\s+\(|[.?!]\s+(?=[A-ZÀ-Ý]))/;
  const TEXT_SKIP = "script, style, textarea, [contenteditable='true'], [data-i18n-skip], .material-symbols-outlined";
  // Attributes of a textarea (its placeholder) are interface text; only its
  // content is data.
  const ATTRIBUTE_SKIP = "script, style, [data-i18n-skip]";
  const LETTERS = /[A-Za-zÀ-ÿ]/;

  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const collapse = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

  function compile(dictionary) {
    const exact = new Map();
    const templates = [];
    Object.entries(dictionary || {}).forEach(([key, value]) => {
      const source = collapse(key);
      exact.set(source, value);
      if (!/\{\d+\}/.test(source)) return;
      const literals = source.split(/\{\d+\}/);
      const anchor = literals.reduce((best, part) => (part.trim().length > best.trim().length ? part : best), "");
      if (!anchor.trim()) return;
      // A short literal such as "de {0}" would match nearly any text, so its
      // slots only accept numbers ("de 12").
      const slot = anchor.replace(/[^A-Za-zÀ-ÿ]/g, "").length < 3 ? "([\\d.,]+)" : "([\\s\\S]*?)";
      templates.push({
        pattern: new RegExp(`^${literals.map(escapeRegex).join(slot)}$`),
        slots: [...source.matchAll(/\{(\d+)\}/g)].map((match) => match[1]),
        anchor: anchor.trim(),
        value,
        weight: literals.join("").length,
      });
    });
    templates.sort((a, b) => b.weight - a.weight);
    return { exact, templates, english: new Set(Object.values(dictionary || {}).map(collapse)), same: new Set((catalog.same || []).map(collapse)) };
  }

  const compiled = { en: compile(catalog.en) };
  const cache = { en: new Map() };
  const misses = new Map();
  let locale = "pt";

  function fillTemplate(template, match, depth) {
    const values = {};
    template.slots.forEach((slot, index) => {
      if (slot in values) return;
      const captured = match[index + 1];
      const core = captured.trim();
      values[slot] = core ? captured.replace(core, translateCore(core, depth + 1).text) : captured;
    });
    return template.value.replace(/\{(\d+)\}/g, (all, slot) => (slot in values ? values[slot] : all));
  }

  // Returns { text, known }. known is false when some interface-looking part
  // had no entry; such parts are recorded as misses.
  function translateCore(core, depth = 0) {
    const dictionary = compiled[locale];
    if (!dictionary || !core || !LETTERS.test(core)) return { text: core, known: true };
    const cached = cache[locale].get(core);
    if (cached) return cached;
    let result = null;
    if (dictionary.exact.has(core)) result = { text: dictionary.exact.get(core), known: true };
    else if (dictionary.english.has(core) || dictionary.same.has(core)) result = { text: core, known: true };
    if (!result && depth < 3) {
      for (const template of dictionary.templates) {
        if (!core.includes(template.anchor)) continue;
        const match = core.match(template.pattern);
        if (match) { result = { text: fillTemplate(template, match, depth), known: true }; break; }
      }
    }
    // "13 livre(s))" after a split at " (": the closing parenthesis belongs to
    // the enclosing text.
    if (!result && depth < 3 && core.endsWith(")") && (core.match(/\)/g) || []).length > (core.match(/\(/g) || []).length) {
      const inner = translateCore(core.slice(0, -1), depth + 1);
      if (inner.known) result = { text: `${inner.text})`, known: true };
    }
    // "13 disp.", "- 2 vendas deste lote": a count or list marker before a
    // known label.
    if (!result && depth < 3) {
      const counted = core.match(/^((?:[-•]\s+)?(?:\d[\d.,]*\s*(?:x\s+)?)?)(\S[\s\S]*)$/);
      if (counted && counted[1]) {
        const rest = translateCore(counted[2], depth + 1);
        if (rest.known) result = { text: `${counted[1]}${rest.text}`, known: true };
      }
    }
    if (!result && depth < 3) {
      const parts = core.split(SEPARATOR);
      if (parts.length > 1) {
        let known = true;
        const text = parts.map((part, index) => {
          if (index % 2 === 1 || !part.trim()) return part;
          const translated = translateCore(part.trim(), depth + 1);
          if (!translated.known) known = false;
          return part.replace(part.trim(), translated.text);
        }).join("");
        result = { text, known };
      }
    }
    if (!result) {
      result = { text: core, known: false };
      if (depth > 0 || core.length > 1) misses.set(core, (misses.get(core) || 0) + 1);
    }
    cache[locale].set(core, result);
    return result;
  }

  function translate(value) {
    const raw = String(value ?? "");
    if (locale === "pt" || !raw.trim()) return raw;
    const lead = raw.match(/^\s*/)[0];
    const trail = raw.match(/\s*$/)[0];
    const core = collapse(raw);
    return `${lead ? " " : ""}${translateCore(core).text}${trail ? " " : ""}`.replace(/^ /, lead ? " " : "").replace(/ $/, trail ? " " : "");
  }

  // Dialog text keeps its line breaks: a single-line message is translated
  // whole, a multi-line one line by line.
  function translateMessage(value) {
    const text = String(value ?? "");
    if (locale === "pt" || !text.trim()) return text;
    if (!text.includes("\n")) return translateCore(collapse(text)).text;
    return text.split("\n").map((line) => (line.trim() ? line.replace(line.trim(), translateCore(collapse(line)).text) : line)).join("\n");
  }

  // Node bookkeeping: the Portuguese source and the value we last wrote, so our
  // own writes are not re-translated and pt can be restored.
  const textSource = new WeakMap();
  const textWritten = new WeakMap();
  const attributeSource = new WeakMap();

  function skipped(element, selector = TEXT_SKIP) {
    return !element || Boolean(element.closest(selector));
  }

  function localizeText(node) {
    const current = node.nodeValue;
    if (textWritten.get(node) === current) return;
    if (!current || !current.trim() || skipped(node.parentElement)) return;
    textSource.set(node, current);
    const next = translate(current);
    if (next !== current) {
      textWritten.set(node, next);
      node.nodeValue = next;
    } else textWritten.delete(node);
  }

  function localizeAttributes(element, only) {
    if (skipped(element, ATTRIBUTE_SKIP)) return;
    const names = only ? [only] : ATTRIBUTES;
    let sources = attributeSource.get(element);
    names.forEach((name) => {
      if (!element.hasAttribute(name)) return;
      const current = element.getAttribute(name);
      const record = sources?.[name];
      if (record && record.written === current) return;
      const next = translate(current);
      if (!sources) { sources = {}; attributeSource.set(element, sources); }
      sources[name] = { source: current, written: next };
      if (next !== current) element.setAttribute(name, next);
    });
  }

  function localizeTree(root) {
    if (!root || locale === "pt") return;
    if (root.nodeType === 3) return localizeText(root);
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    const document = root.ownerDocument || root;
    const walker = document.createTreeWalker(root, 5 /* SHOW_ELEMENT | SHOW_TEXT */);
    let node = root.nodeType === 1 ? root : walker.nextNode();
    while (node) {
      if (node.nodeType === 3) localizeText(node);
      else localizeAttributes(node);
      node = walker.nextNode();
    }
  }

  function restoreTree(root) {
    const document = root.ownerDocument || root;
    const walker = document.createTreeWalker(root, 5);
    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === 3) {
        if (textWritten.get(node) === node.nodeValue && textSource.has(node)) node.nodeValue = textSource.get(node);
        textWritten.delete(node);
      } else {
        const sources = attributeSource.get(node);
        if (sources) {
          Object.entries(sources).forEach(([name, record]) => {
            if (node.getAttribute(name) === record.written) node.setAttribute(name, record.source);
          });
          attributeSource.delete(node);
        }
      }
      node = walker.nextNode();
    }
  }

  let observer = null;
  function observe(document) {
    if (observer || typeof MutationObserver === "undefined") return;
    observer = new MutationObserver((records) => {
      if (locale === "pt") return;
      records.forEach((record) => {
        if (record.type === "childList") record.addedNodes.forEach(localizeTree);
        else if (record.type === "characterData") localizeText(record.target);
        else if (record.type === "attributes") localizeAttributes(record.target, record.attributeName);
      });
    });
    observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRIBUTES });
  }

  function setLocale(next, document) {
    const previous = locale;
    locale = compiled[next] ? next : "pt";
    if (!document) return;
    if (previous !== "pt" && locale === "pt") restoreTree(document.documentElement);
    if (locale !== "pt") {
      observe(document);
      localizeTree(document.documentElement);
    }
  }

  global.KombuLocale = {
    setLocale,
    translate,
    translateMessage,
    localizeTree,
    misses: () => [...misses.entries()].map(([text, count]) => ({ text, count })),
    clearMisses: () => misses.clear(),
    has: (text) => compiled.en.exact.has(collapse(text)),
    get locale() { return locale; },
  };
})(typeof window !== "undefined" ? window : globalThis);
