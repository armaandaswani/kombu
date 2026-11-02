// Isolated lead regression: no network, real email, credentials or production state.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const backendPath = require.resolve('../api/_lib/kombu-backend');
const backend = require(backendPath);

async function run() {
  const input = { type: 'parceria', nome: 'Ana', perfilTipo: 'Nutricionista', email: ' ana@example.test ',
    publicos: ['  Alimentação natural e bem-estar  ', 'Esporte e vida ativa', 'Esporte e vida ativa', { bad: 1 }, '', 'Outro\u0000 público'],
    origem: 'Outro', origemOutro: 'Evento\nlocal', mensagem: 'Quero conversar.', couponCode: ' teste5 ' };
  const normalized = backend.normalizeLead(input);
  assert.deepEqual(normalized.audiences, ['Alimentação natural e bem-estar', 'Esporte e vida ativa', 'Outro  público']);
  assert.equal(normalized.profileType, 'Nutricionista');
  assert.equal(normalized.email, 'ana@example.test');
  assert.equal(normalized.discoveryOther, 'Evento local');
  assert.match(normalized.message, /Públicos principais: Alimentação natural e bem-estar; Esporte e vida ativa/);
  assert.match(normalized.message, /Como conheceu a Kombú: Outro — Evento local/);
  assert.equal(backend.normalizeLead(normalized).message, normalized.message, 'normalization must not duplicate summary');
  assert.equal(backend.normalizeLead({ origem: 'Instagram', origemOutro: 'stale' }).discoveryOther, '');
  assert.equal(backend.normalizeLead({ publicos: Array.from({ length: 8 }, (_, n) => `Grupo ${n}`) }).audiences.length, 4);
  assert.equal(backend.normalizeLead({ perfilTipo: { bad: true }, email: ['x'] }).profileType, '');
  const longInquiry = `${'x'.repeat(3950)}MARCADOR-FINAL!`;
  assert.equal(longInquiry.length, 3965);
  const longLead = backend.normalizeLead({ ...input, mensagem: longInquiry });
  assert.ok(longLead.message.endsWith('MARCADOR-FINAL!'), 'metadata must not truncate the inquiry ending');
  assert.ok(longLead.message.endsWith(longInquiry), 'the complete original inquiry is preserved');
  assert.equal(backend.normalizeLead(longLead).message, longLead.message, 'long normalized summaries stay idempotent');
  const maxInquiry = `${'x'.repeat(3986)}MARCADOR-FINAL!`;
  assert.equal(maxInquiry.length, 4001);
  const maxLead = backend.normalizeLead({ ...input, mensagem: maxInquiry.slice(1) });
  assert.ok(maxLead.message.endsWith(maxInquiry.slice(1)), 'full legacy 4000-character allowance survives metadata');
  assert.equal(backend.normalizeLead(maxLead).message, maxLead.message);
  const legacy = backend.normalizeLead({ type: 'criador', name: 'Criador antigo', message: 'Seguidores: 100', couponCode: 'amazonia10' });
  assert.equal(legacy.type, 'criador');
  assert.equal(legacy.message, 'Seguidores: 100');
  assert.equal(legacy.couponCode, 'AMAZONIA10');

  const source = fs.readFileSync(require.resolve('../assets/site.js'), 'utf8');
  function readFunction(name) {
    const start = source.indexOf(`  function ${name}(`);
    const end = source.indexOf('\n  function ', start + 1);
    return source.slice(start, end).trim();
  }
  const context = { FormData: class { constructor(form) { this.form = form; } entries() { return this.form.entries[Symbol.iterator](); } } };
  vm.createContext(context);
  vm.runInContext(`${readFunction('serializeLeadForm')}\nthis.serialize = serializeLeadForm;`, context);
  const fields = context.serialize({ entries: [['nome', 'Ana'], ['publicos', 'Natural'], ['publicos', 'Esporte']] });
  assert.equal(fields.nome, 'Ana');
  assert.equal(JSON.stringify(fields.publicos), JSON.stringify(['Natural', 'Esporte']), 'checkboxes must not collapse to their last value');

  const container = { hidden: true };
  const other = { value: 'Old', required: true, disabled: false, setCustomValidity(value) { this.validity = value; } };
  let change;
  const origin = { value: 'Instagram', addEventListener(event, fn) { change = fn; } };
  context.$ = (selector) => selector.includes('origemOutro') ? other : selector.includes('data-origin-other') ? container : origin;
  vm.runInContext(`${readFunction('initDiscoveryField')}\nthis.initDiscovery = initDiscoveryField;`, context);
  const sync = context.initDiscovery({});
  assert.equal(other.disabled, true);
  assert.equal(other.required, false);
  assert.equal(other.value, '');
  origin.value = 'Outro'; change();
  assert.equal(container.hidden, false);
  assert.equal(other.required, true);
  assert.equal(other.disabled, false);
  origin.value = 'Feira'; sync();
  assert.equal(container.hidden, true);

  // A failed notification may return HTTP 500 even though the CRM saved the
  // lead. The form must acknowledge that capture rather than invite duplicates.
  for (const persisted of [true, false]) {
    let submit;
    let resetCount = 0;
    const button = { innerHTML: 'Enviar', disabled: false, textContent: '' };
    const status = { dataset: {}, hidden: true, textContent: '' };
    const form = { dataset: {}, entries: [['nome', 'Ana']], reportValidity: () => true,
      addEventListener(event, callback) { if (event === 'submit') submit = callback; },
      reset() { resetCount += 1; } };
    context.$ = (selector) => selector === '.form-status' ? status : selector === 'button[type="submit"]' ? button : null;
    context.normalizeLead = (data) => data;
    context.initReferrals = () => {};
    context.fetch = async () => ({ ok: false, status: 500, json: async () => ({ persisted, emailSent: false }) });
    vm.runInContext(`${readFunction('initForm')}\nthis.initializeForm = initForm;`, context);
    context.initializeForm(form, 'parceria', 'Contato recebido.');
    await submit({ preventDefault() {} });
    assert.equal(status.dataset.state, persisted ? 'ok' : 'error');
    assert.equal(resetCount, persisted ? 1 : 0, 'reset only when CRM capture is confirmed');
    assert.equal(button.disabled, false);
  }

  const saved = [];
  const emails = [];
  const mockBackend = { ...backend,
    appendLeadToState: async (lead) => { saved.push(backend.normalizeLead(lead)); return { ok: true }; },
    rateLimit: () => ({ allowed: true }),
    sendEmail: async (email) => { emails.push(email); return { ok: true, id: 'fixture-email' }; },
  };
  const originalExports = require.cache[backendPath].exports;
  const previousKey = process.env.RESEND_API_KEY;
  try {
    require.cache[backendPath].exports = mockBackend;
    process.env.RESEND_API_KEY = 'isolated-test-not-a-real-key';
    delete require.cache[require.resolve('../api/lead')];
    const handler = require('../api/lead');
    const response = () => ({ statusCode: 0, setHeader() {}, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });
    for (const payload of [input, { type: 'revenda', nome: 'Bia', negocio: 'Café', publicos: ['Gastronomia e novas experiências', 'Público variado do bairro'], origem: 'Instagram' }, { type: 'criador', nome: 'Legado', mensagem: 'Uma ideia' }]) {
      const res = response();
      await handler({ method: 'POST', headers: {}, body: { lead: payload } }, res);
      assert.equal(res.statusCode, 200);
      assert.equal(res.body.persisted, true);
    }
    assert.equal(saved[0].profileType, 'Nutricionista');
    assert.equal(saved[1].audiences.length, 2);
    assert.equal(saved[2].type, 'criador');
    assert.match(emails[0].subject, /Nova proposta de parceria/);
    assert.match(emails[0].text, /E-mail: ana@example.test/);
    assert.match(emails[1].html, /Gastronomia e novas experiências; Público variado do bairro/);
    const res = response();
    await handler({ method: 'POST', headers: {}, body: { nome: '<script>alert(1)</script>', perfilTipo: '<img src=x>', origem: 'Outro', origemOutro: '<b>Evento</b>' } }, res);
    assert.ok(!emails.at(-1).html.includes('<script>'));
    assert.match(emails.at(-1).html, /&lt;img src=x&gt;/);
  } finally {
    require.cache[backendPath].exports = originalExports;
    delete require.cache[require.resolve('../api/lead')];
    if (previousKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = previousKey;
  }
  console.log('Partnership leads: multi-select, normalization, conditional source, CRM and escaped email pass; legacy creators preserved.');
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
