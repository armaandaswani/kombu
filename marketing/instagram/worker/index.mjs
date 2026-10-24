// Kombú Instagram publisher: Cloudflare Worker on a cron trigger, no public endpoint.
// Twin of the Reveja publisher, with one change: posts go out in calendar order, one every
// `everyDays`, counted from the last real post. Reveja publishes by fixed date, which works there;
// here the account connects whenever the owner gets to it, and a date-based calendar would
// publish the whole backlog one post per run, daily, with stale content. This never bursts.
//
// Bindings: IG_TOKEN (secret, set by connect.mjs), STATE (KV).
// KV: "published:<id>" -> {mediaId, at}; "last" -> {id, at}; "token" -> {accessToken, refreshedAt};
//     "user" -> {id, username}; "log" -> last 50 runs.
import calendar from '../calendar.json';

const api = 'https://graph.instagram.com/v21.0';
const imageBase = 'https://kombu-social.pages.dev';
// A little under two days, so the daily noon run lands on alternate days and a run that slipped
// to the evening retry drifts back to noon on the next post instead of staying late forever.
const minHours = calendar.everyDays * 24 - 8;

async function call(method, endpoint, params, token) {
  const url = new URL(api + endpoint);
  const body = new URLSearchParams({...params, access_token: token});
  const res = method === 'GET' ? await fetch(url + '?' + body) : await fetch(url, {method, body});
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(`${endpoint}: ${data.error?.message || res.status}`);
  return data;
}

async function waitFinished(id, token, tries = 15, every = 2000) {
  for (let i = 0; i < tries; i++) {
    const {status_code} = await call('GET', `/${id}`, {fields: 'status_code'}, token);
    if (status_code === 'FINISHED') return;
    if (status_code === 'ERROR' || status_code === 'EXPIRED') throw new Error(`container ${id} ${status_code}`);
    await new Promise(r => setTimeout(r, every));
  }
  throw new Error(`container ${id} not ready`);
}

async function log(env, msg) {
  const entries = JSON.parse(await env.STATE.get('log') || '[]');
  entries.unshift(`${new Date().toISOString()} ${msg}`);
  await env.STATE.put('log', JSON.stringify(entries.slice(0, 50)));
}

async function currentToken(env) {
  let stored = JSON.parse(await env.STATE.get('token') || 'null');
  if (!stored) {
    // First run after connect.mjs: the secret is the token, issued moments ago.
    stored = {accessToken: env.IG_TOKEN, refreshedAt: new Date().toISOString()};
    await env.STATE.put('token', JSON.stringify(stored));
  }
  // Long-lived tokens last 60 days; refresh after 30.
  if ((Date.now() - Date.parse(stored.refreshedAt)) / 864e5 > 30) {
    try {
      const res = await fetch('https://graph.instagram.com/refresh_access_token?' + new URLSearchParams({grant_type: 'ig_refresh_token', access_token: stored.accessToken}));
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error?.message || res.status);
      stored = {accessToken: data.access_token, refreshedAt: new Date().toISOString()};
      await env.STATE.put('token', JSON.stringify(stored));
      await log(env, 'token renovado');
    } catch (e) { await log(env, 'falha ao renovar token: ' + e.message); }
  }
  return stored.accessToken;
}

async function account(env, token) {
  const cached = JSON.parse(await env.STATE.get('user') || 'null');
  if (cached) return cached;
  const me = await call('GET', '/me', {fields: 'user_id,username'}, token);
  const user = {id: me.user_id, username: me.username};
  await env.STATE.put('user', JSON.stringify(user));
  return user;
}

const sameCaption = (a, b) => (a || '').replace(/\s+/g, ' ').trim() === (b || '').replace(/\s+/g, ' ').trim();

async function publish(post, user, token) {
  if (post.slides.length === 1) {
    const c = await call('POST', `/${user.id}/media`, {image_url: `${imageBase}/${post.id}/1.jpg`, caption: post.caption}, token);
    await waitFinished(c.id, token);
    return (await call('POST', `/${user.id}/media_publish`, {creation_id: c.id}, token)).id;
  }
  const children = [];
  for (let n = 1; n <= post.slides.length; n++) {
    const c = await call('POST', `/${user.id}/media`, {image_url: `${imageBase}/${post.id}/${n}.jpg`, is_carousel_item: 'true'}, token);
    children.push(c.id);
  }
  for (const id of children) await waitFinished(id, token);
  const container = await call('POST', `/${user.id}/media`, {media_type: 'CAROUSEL', children: children.join(','), caption: post.caption}, token);
  await waitFinished(container.id, token);
  return (await call('POST', `/${user.id}/media_publish`, {creation_id: container.id}, token)).id;
}

async function run(env) {
  if (!env.IG_TOKEN) return log(env, 'aguardando conexão da conta (rode node connect.mjs)');
  const last = JSON.parse(await env.STATE.get('last') || 'null');
  if (last && (Date.now() - Date.parse(last.at)) / 36e5 < minHours) return log(env, `aguardando intervalo (último: ${last.id})`);

  let post = null;
  for (const p of calendar.posts) if (!(await env.STATE.get('published:' + p.id))) { post = p; break; }
  if (!post) return log(env, 'calendário esgotado: adicione posts e rode wrangler deploy');

  const token = await currentToken(env);
  const user = await account(env, token);

  // Duplicate guard, kept from Reveja (a run cut off after media_publish once posted twice).
  // It also picks up a post the owner published by hand with the exact caption.
  const recent = await call('GET', `/${user.id}/media`, {fields: 'id,caption,timestamp', limit: '25'}, token);
  const existing = recent.data?.find(m => sameCaption(m.caption, post.caption));
  if (existing) {
    const at = existing.timestamp ? new Date(existing.timestamp).toISOString() : new Date().toISOString();
    await env.STATE.put('published:' + post.id, JSON.stringify({mediaId: existing.id, at, byHand: true}));
    await env.STATE.put('last', JSON.stringify({id: post.id, at}));
    return log(env, `${post.id} já estava na conta (media ${existing.id}); registrado sem repostar`);
  }

  try {
    const mediaId = await publish(post, user, token);
    const at = new Date().toISOString();
    await env.STATE.put('published:' + post.id, JSON.stringify({mediaId, at}));
    await env.STATE.put('last', JSON.stringify({id: post.id, at}));
    await log(env, `publicado ${post.id} (media ${mediaId}) em @${user.username}`);
  } catch (e) {
    await log(env, `erro ao publicar ${post.id}: ${e.message}`);
    throw e;
  }
}

export default {
  // Await the run itself: waitUntil() tasks are cut off shortly after the event ends (Reveja, 23/10).
  async scheduled(event, env) { await run(env); },
  async fetch() { return new Response('Not found', {status: 404}); },
};
