// Loads assets/admin.js in a headless sandbox so its business logic can be
// tested without a browser. The admin is a classic script rather than a module,
// so there is nothing to require: it is evaluated in a vm context with just
// enough of a DOM for its load-time wiring to no-op. Every DOM lookup in the
// file uses optional chaining, so returning null is enough.
//
// This exists because all of the order, reservation and quick-sale logic lives
// in that file and had no automated coverage at all - it was only ever checked
// by hand in a browser.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
  };
}

function stubElement() {
  const element = {
    style: {},
    dataset: {},
    value: "",
    innerHTML: "",
    textContent: "",
    hidden: false,
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    setAttribute() {},
    removeAttribute() {},
    getAttribute: () => null,
    appendChild() {},
    insertAdjacentHTML() {},
    remove() {},
    click() {},
    focus() {},
    addEventListener() {},
    querySelector: () => null,
    querySelectorAll: () => [],
    closest: () => null,
    dispatchEvent: () => true,
  };
  return element;
}

function createAdminSandbox() {
  const document = {
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {},
    createElement: () => stubElement(),
    body: stubElement(),
    documentElement: { style: { setProperty() {} }, lang: "pt", classList: { add() {}, remove() {} } },
    fonts: { status: "loaded" },
    title: "",
    activeElement: null,
  };

  const sandbox = {
    console,
    document,
    localStorage: memoryStorage(),
    sessionStorage: memoryStorage(),
    location: { hostname: "localhost", href: "http://localhost/admin", pathname: "/admin", search: "", hash: "" },
    history: { replaceState() {} },
    navigator: { userAgent: "node" },
    // Nothing in a test should reach the network; anything that tries fails loudly.
    fetch: () => Promise.reject(new Error("network disabled in tests")),
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    queueMicrotask,
    Intl,
    URL,
    URLSearchParams,
    crypto: require("crypto").webcrypto,
    alert() {},
    confirm: () => true,
    Image: function Image() {},
    FormData: function FormData() {},
    Event: function Event() {},
    CustomEvent: function CustomEvent() {},
    Response: function Response() {},
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  const source = fs.readFileSync(path.join(__dirname, "..", "assets", "admin.js"), "utf8");
  vm.runInContext(source, sandbox, { filename: "assets/admin.js" });

  // `state` is a top-level `let`, so it is a lexical binding in the context
  // rather than a property of the sandbox object and cannot be read or written
  // directly. Evaluating in the same context resolves it.
  sandbox.__setState = (value) => {
    sandbox.__incoming = value;
    vm.runInContext("state = __incoming;", sandbox);
  };
  sandbox.__getState = () => vm.runInContext("state", sandbox);
  sandbox.__eval = (expression) => vm.runInContext(expression, sandbox);
  return sandbox;
}

module.exports = { createAdminSandbox };
