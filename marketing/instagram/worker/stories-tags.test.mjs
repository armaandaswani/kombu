import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runStories, storyTags} from './stories.mjs';

const date = '2026-10-27';
const frames = [{id: 'frame-0', image: 'stories/2026-10-27/frame-0.jpg', partner: '@parceiro_x', title: 'Vai passar no Parceiro X?'},
  ...Array.from({length: 4}, (_, i) => ({id: 'frame-' + (i + 1), image: 'stories/2026-10-27/frame-' + (i + 1) + '.jpg'}))];

function setup(refuseTags) {
  const map = new Map(), calls = [], logs = [];
  const env = {IG_TOKEN: 'fake-for-unit-test', STATE: {get: async k => map.get(k), put: async (k, v) => map.set(k, v)}};
  const deps = {currentToken: async () => 'fake-for-unit-test', account: async () => ({id: 'test', username: 'kombukombucha.am'}), waitFinished: async () => {}, log: async (_, s) => logs.push(s),
    call: async (method, url, params) => {
      calls.push({method, url, params});
      if (method === 'GET') return {account_type: 'BUSINESS'};
      if (url.endsWith('/media')) { if (refuseTags && params.user_tags) throw Error('Invalid user id'); return {id: 'container'}; }
      return {id: 'published'};
    }};
  globalThis.fetch = async (url, opt) => opt?.method === 'HEAD' ? new Response('', {status: 200, headers: {'content-type': 'image/jpeg'}}) : new Response(JSON.stringify({days: [{date, frames}]}), {status: 200});
  return {env, deps, calls, logs};
}

test('tags the partner named on the art, never the account itself', () => {
  assert.deepEqual(storyTags({partner: '@CasaAgridoceAM', title: 'Vai passar na Casa Agridoce?'}, 'kombukombucha.am'), [{username: 'casaagridoceam'}]);
  assert.deepEqual(storyTags({title: 'Siga @kombukombucha.am'}, 'kombukombucha.am'), []);
  assert.deepEqual(storyTags({title: 'Sem parceiro'}), []);
});

test('the partner tag goes on the Story container', async () => {
  const s = setup(false);
  await runStories(s.env, s.deps, new Date(date + 'T11:00:00Z'));
  const media = s.calls.filter(c => c.url.endsWith('/media'));
  assert.equal(media.length, 1);
  assert.deepEqual(JSON.parse(media[0].params.user_tags), [{username: 'parceiro_x'}]);
});

test('a refused tag still publishes the Story, untagged, and logs it', async () => {
  const s = setup(true);
  await runStories(s.env, s.deps, new Date(date + 'T11:00:00Z'));
  const media = s.calls.filter(c => c.url.endsWith('/media'));
  assert.equal(media.length, 2);
  assert.equal(media[1].params.user_tags, undefined);
  assert.ok(s.logs.some(l => /marcação recusada/.test(l)));
  assert.equal(s.calls.filter(c => c.url.endsWith('/media_publish')).length, 1);
});
