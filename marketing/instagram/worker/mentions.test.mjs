import {test} from 'node:test';
import assert from 'node:assert/strict';
import {handleRequest, storyMentions, validSignature, processMention} from './mentions.mjs';

const SECRET = 'app-secret-for-test';
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
async function sign(raw) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(SECRET), {name: 'HMAC', hash: 'SHA-256'}, false, ['sign']);
  return 'sha256=' + hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw)));
}
const webhook = (url = 'https://lookaside.fbsbx.com/ig_messaging_cdn/?asset_id=1') => ({object: 'instagram', entry: [{id: '178', messaging: [{sender: {id: '999'}, recipient: {id: '178'}, message: {mid: 'm1', attachments: [{type: 'story_mention', payload: {url}}]}}]}]});

function setup({mediaType = 'image/jpeg', status = 'FINISHED'} = {}) {
  const kv = new Map(), calls = [], logs = [];
  const env = {IG_APP_SECRET: SECRET, WEBHOOK_VERIFY_TOKEN: 'verify', NTFY_TOPIC: 'kombu-test', STATE: {
    get: async k => kv.get(k)?.v ?? null, put: async (k, v, o) => kv.set(k, {v, m: o?.metadata}), delete: async k => kv.delete(k),
    list: async ({prefix}) => ({keys: [...kv.keys()].filter(k => k.startsWith(prefix)).map(name => ({name}))}),
    getWithMetadata: async k => ({value: kv.get(k)?.v ?? null, metadata: kv.get(k)?.m}),
  }};
  const deps = {currentToken: async () => 'tok', account: async () => ({id: '178', username: 'kombukombucha.am'}), log: async (_, s) => logs.push(s)};
  globalThis.fetch = async (u, init = {}) => {
    const url = String(u); calls.push({url, init});
    if (url.includes('lookaside') || url.includes('fbcdn')) return new Response(new Uint8Array([1, 2, 3]), {headers: {'content-type': mediaType}});
    if (url.includes('ntfy.sh')) return new Response('ok');
    if (url.includes('/999?')) return Response.json({username: 'cliente.feliz'});
    if (url.endsWith('/178/media')) return Response.json({id: 'c1'});
    if (url.includes('/c1?')) return Response.json({status_code: status});
    if (url.endsWith('/media_publish')) return Response.json({id: 'story1'});
    if (url.endsWith('/178/messages')) return Response.json({message_id: 'dm1'});
    return new Response('{}', {status: 404});
  };
  return {env, deps, kv, calls, logs};
}

test('only Meta-signed webhooks are accepted', async () => {
  const raw = JSON.stringify(webhook());
  assert.equal(await validSignature(raw, await sign(raw), SECRET), true);
  assert.equal(await validSignature(raw, 'sha256=' + '0'.repeat(64), SECRET), false);
  assert.equal(await validSignature(raw, await sign(raw), ''), false);
  const s = setup();
  const res = await handleRequest(new Request('https://w.dev/instagram/webhook', {method: 'POST', body: raw, headers: {'X-Hub-Signature-256': 'sha256=bad'}}), s.env, {waitUntil() {}}, s.deps);
  assert.equal(res.status, 403);
  assert.equal(s.calls.length, 0);
});

test('Meta verification echoes the challenge only with the right token', async () => {
  const s = setup();
  const ok = await handleRequest(new Request('https://w.dev/instagram/webhook?hub.mode=subscribe&hub.verify_token=verify&hub.challenge=42'), s.env, {}, s.deps);
  assert.equal(await ok.text(), '42');
  const no = await handleRequest(new Request('https://w.dev/instagram/webhook?hub.mode=subscribe&hub.verify_token=x&hub.challenge=42'), s.env, {}, s.deps);
  assert.equal(no.status, 403);
});

test('a story mention is reposted, the customer is thanked and the owner gets the name', async () => {
  const s = setup();
  const [m] = storyMentions(webhook());
  await processMention(s.env, m, 'https://w.dev', s.deps);
  const container = s.calls.find(c => c.url.endsWith('/178/media'));
  const params = new URLSearchParams(container.init.body);
  assert.equal(params.get('media_type'), 'STORIES');
  assert.match(params.get('image_url'), /^https:\/\/w\.dev\/instagram\/story-media\/[a-f0-9]{32}$/);
  assert.ok(s.calls.some(c => c.url.endsWith('/media_publish')));
  const dm = JSON.parse(s.calls.find(c => c.url.endsWith('/178/messages')).init.body);
  assert.equal(dm.recipient.id, '999');
  assert.match(dm.message.text, /@cliente\.feliz/);
  assert.doesNotMatch(dm.message.text, /!/);
  const aviso = s.calls.find(c => c.url.includes('ntfy.sh/kombu-test'));
  assert.match(aviso.init.body, /@cliente\.feliz marcou a Kombú/);
  assert.equal([...s.kv.keys()].filter(k => k.startsWith('mention-media:')).length, 0, 'o arquivo é apagado depois do repost');
  // A Meta reenvia o mesmo webhook: nada se repete.
  const before = s.calls.length;
  await processMention(s.env, m, 'https://w.dev', s.deps);
  assert.equal(s.calls.length, before);
});

test('a link outside Meta is never downloaded; the owner is told to repost from the app', async () => {
  const s = setup();
  const [m] = storyMentions(webhook('https://evil.example/x.jpg'));
  await processMention(s.env, m, 'https://w.dev', s.deps);
  assert.ok(!s.calls.some(c => c.url.includes('evil.example')));
  assert.ok(!s.calls.some(c => c.url.endsWith('/media_publish')));
  assert.match(s.calls.find(c => c.url.includes('ntfy.sh')).init.body, /Adicionar ao seu story/);
  assert.ok(s.calls.some(c => c.url.endsWith('/178/messages')), 'o cliente é agradecido mesmo assim');
});

test('the one-time media link serves the stored story and nothing else', async () => {
  const s = setup();
  s.kv.set('mention-media:' + 'a'.repeat(32), {v: new Uint8Array([7]).buffer, m: {type: 'image/jpeg'}});
  const ok = await handleRequest(new Request('https://w.dev/instagram/story-media/' + 'a'.repeat(32)), s.env, {}, s.deps);
  assert.equal(ok.headers.get('content-type'), 'image/jpeg');
  assert.equal((await handleRequest(new Request('https://w.dev/instagram/story-media/../token'), s.env, {}, s.deps)).status, 404);
  assert.equal((await handleRequest(new Request('https://w.dev/'), s.env, {}, s.deps)).status, 404);
});
