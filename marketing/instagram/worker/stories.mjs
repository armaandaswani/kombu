// Stories are published only by the existing scheduled Worker, with its existing token.
export const localDate = (now = new Date()) => new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Manaus', year: 'numeric', month: '2-digit', day: '2-digit'}).format(now);
export function validateDay(manifest, date) {
  const day = manifest.days?.find(d => d.date === date);
  if (!day) return null;
  if (!Array.isArray(day.frames) || day.frames.length !== 5) throw new Error('Stories: o dia precisa de cinco artes');
  if (new Set(day.frames.map(f => f.id)).size !== 5) throw new Error('Stories: ids repetidos');
  for (const f of day.frames) {
    if (!/^[a-z0-9-]+$/.test(f.id) || !/^stories\/[a-z0-9-]+\/[a-z0-9-]+\.jpg$/.test(f.image) || !f.image.startsWith('stories/' + date + '/')) throw new Error('Stories: caminho inválido');
  }
  return day;
}
export async function runStories(env, {call, currentToken, account, waitFinished, log}, now = new Date()) {
  if (!env.IG_TOKEN) return;
  const date = localDate(now);
  if (await env.STATE.get('stories:done:' + date)) return;
  const base = 'https://kombu-social.pages.dev/';
  const res = await fetch(base + 'stories/manifest.json', {cache: 'no-store'});
  if (!res.ok) throw new Error('Stories: manifesto indisponível (' + res.status + ')');
  const day = validateDay(await res.json(), date);
  if (!day) return log(env, 'Stories: sem artes para ' + date);
  const token = await currentToken(env);
  const user = await account(env, token);
  const info = await call('GET', '/' + user.id, {fields: 'account_type'}, token);
  if (info.account_type !== 'BUSINESS') throw new Error('Stories: a Meta exige conta Business; tipo recebido: ' + info.account_type);
  for (const frame of day.frames) {
    const key = 'story:' + date + ':' + frame.id;
    const state = JSON.parse(await env.STATE.get(key) || 'null');
    if (state?.status === 'published') continue;
    // A lost response after publishing must never cause a duplicate on the evening retry.
    if (state?.status === 'publishing') throw new Error('Stories: confirmação pendente para ' + frame.id + '; não repetir automaticamente');
    const image = await fetch(base + frame.image, {method: 'HEAD'});
    if (!image.ok || !image.headers.get('content-type')?.includes('image/jpeg')) throw new Error('Stories: imagem indisponível: ' + frame.image);
    const container = await call('POST', '/' + user.id + '/media', {media_type: 'STORIES', image_url: base + frame.image}, token);
    await waitFinished(container.id, token);
    await env.STATE.put(key, JSON.stringify({status: 'publishing', containerId: container.id, at: now.toISOString()}));
    const published = await call('POST', '/' + user.id + '/media_publish', {creation_id: container.id}, token);
    await env.STATE.put(key, JSON.stringify({status: 'published', mediaId: published.id, at: new Date().toISOString()}));
    await log(env, 'Story publicado: ' + date + '/' + frame.id);
  }
  await env.STATE.put('stories:done:' + date, JSON.stringify({count: 5, at: new Date().toISOString()}));
  await log(env, 'Stories: cinco artes publicadas para ' + date);
}
