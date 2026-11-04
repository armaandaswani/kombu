// Alguém marcou a Kombú no Story: repostamos no nosso Story na hora, agradecemos no Direct e avisamos o dono
// no celular (ntfy). Pedido do dono, 04/11/2026: "toda vez que alguém marcar ... automaticamente reposta",
// "agradeça o cliente também" e "me envia na hora o nome da pessoa". O dono autorizou o repost a qualquer hora;
// feed e Stories programados continuam só de manhã.
//
// A Meta não tem a função "Adicionar ao seu story", então o Story da pessoa é baixado, servido por um link de
// uso único (KV, expira em 1 h) e publicado como nosso Story; o arquivo é apagado logo depois (igual à Ste e à
// Sofia, atendente-vm/src/story-repost.ts). Webhooks só são aceitos com a assinatura da Meta (IG_APP_SECRET).
//
// Segredos do Worker: IG_APP_SECRET, WEBHOOK_VERIFY_TOKEN, NTFY_TOPIC (configurados por webhook-setup.mjs).

const api = 'https://graph.instagram.com/v21.0';
// O Story marcado só pode vir dos servidores da Meta: nada de baixar um endereço qualquer.
const META_CDN = /(^|\.)(fbsbx\.com|fbcdn\.net|cdninstagram\.com)$/;
const MAX_MEDIA = 24 * 1024 * 1024;

// Sem "!" e sem emoji (voz da marca). `n` é o @ da pessoa, ou vazio quando o perfil não aparece.
const v = n => (n ? ', ' + n : '');
const OBRIGADO = [
  n => `Obrigado por marcar a Kombú${v(n)}. Já repostamos no nosso perfil.`,
  n => `Que bom ver a Kombú no seu story${v(n)}. Obrigado pela marcação, já está no nosso perfil.`,
  n => `Obrigado por compartilhar a sua Kombú${v(n)}. Repostamos no nosso story.`,
];
const OBRIGADO_SEM_REPOST = n => `Obrigado por marcar a Kombú${v(n)}. Ficamos muito felizes em ver a sua Kombú por aí.`;

async function graph(method, endpoint, token, {params, json} = {}) {
  const url = new URL(api + endpoint);
  const init = {method, headers: {Authorization: 'Bearer ' + token}};
  if (method === 'GET') for (const [k, v] of Object.entries(params || {})) url.searchParams.set(k, v);
  else if (json) Object.assign(init, {body: JSON.stringify(json), headers: {...init.headers, 'Content-Type': 'application/json'}});
  else init.body = new URLSearchParams(params || {});
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(`${endpoint}: ${data.error?.message || res.status}`);
  return data;
}

const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
export async function validSignature(raw, header, secret) {
  if (!secret || !header?.startsWith('sha256=')) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), {name: 'HMAC', hash: 'SHA-256'}, false, ['sign']);
  const expected = 'sha256=' + hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw)));
  // Comparação de tempo constante.
  if (expected.length !== header.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ header.charCodeAt(i);
  return diff === 0;
}

/** Marcações em Story dentro de um webhook do Instagram. */
export function storyMentions(body) {
  const out = [];
  for (const entry of body?.entry || []) for (const m of entry.messaging || []) {
    if (m.message?.is_echo) continue;
    for (const a of m.message?.attachments || []) if (a.type === 'story_mention' && a.payload?.url)
      out.push({mid: m.message.mid, sender: String(m.sender?.id || ''), recipient: String(m.recipient?.id || entry.id || ''), url: a.payload.url});
  }
  return out;
}

async function notifyOwner(env, title, text, click) {
  if (!env.NTFY_TOPIC) return;
  await fetch('https://ntfy.sh/' + env.NTFY_TOPIC, {method: 'POST', body: text, headers: {Title: title, Tags: 'camera', ...(click ? {Click: click} : {})}}).catch(() => {});
}

async function publishStory(env, token, user, mediaUrl, video, {wait = 22000} = {}) {
  const c = await graph('POST', `/${user.id}/media`, token, {params: {media_type: 'STORIES', [video ? 'video_url' : 'image_url']: mediaUrl}});
  for (const t0 = Date.now(); ;) {
    const {status_code} = await graph('GET', `/${c.id}`, token, {params: {fields: 'status_code'}});
    if (status_code === 'FINISHED') break;
    if (status_code === 'ERROR' || status_code === 'EXPIRED') throw new Error('a Meta recusou o arquivo (' + status_code + ')');
    if (Date.now() - t0 > wait) return {pending: c.id};
    await new Promise(r => setTimeout(r, 2000));
  }
  return {id: (await graph('POST', `/${user.id}/media_publish`, token, {params: {creation_id: c.id}})).id};
}

export async function processMention(env, m, origin, {currentToken, account, log}) {
  const key = 'mention:' + m.mid;
  if (await env.STATE.get(key)) return; // a Meta reenvia webhooks: cada marcação só uma vez
  await env.STATE.put(key, JSON.stringify({status: 'received', at: new Date().toISOString()}), {expirationTtl: 7 * 86400});
  const token = await currentToken(env);
  const user = await account(env, token);
  if (m.recipient && String(user.id) !== m.recipient) return log(env, 'menção ignorada: destinatário não é a Kombú');

  let who = null;
  try { who = (await graph('GET', `/${m.sender}`, token, {params: {fields: 'username,name'}})).username || null; } catch { /* perfil privado */ }
  const nome = who ? '@' + who : 'um cliente';
  const perfil = who ? `https://www.instagram.com/${who}/` : 'https://www.instagram.com/direct/inbox/';

  let repost = null, motivo = '';
  const file = crypto.randomUUID().replace(/-/g, '');
  try {
    const host = new URL(m.url).hostname;
    if (!META_CDN.test(host)) throw new Error('endereço fora da Meta');
    const dl = await fetch(m.url);
    if (!dl.ok) throw new Error('download ' + dl.status);
    const type = dl.headers.get('content-type') || '';
    const video = type.startsWith('video/');
    if (!video && !type.startsWith('image/')) throw new Error('tipo inesperado ' + (type || '?'));
    const data = await dl.arrayBuffer();
    if (data.byteLength > MAX_MEDIA) throw new Error('arquivo grande demais para repostar sozinho');
    await env.STATE.put('mention-media:' + file, data, {expirationTtl: 3600, metadata: {type}});
    repost = await publishStory(env, token, user, `${origin}/instagram/story-media/${file}`, video);
    if (repost.pending) await env.STATE.put('mention-pending:' + m.mid, JSON.stringify({containerId: repost.pending, who, file, at: new Date().toISOString()}), {expirationTtl: 86400});
    else await env.STATE.delete('mention-media:' + file);
  } catch (e) {
    motivo = e.message;
    await env.STATE.delete('mention-media:' + file);
  }

  const ok = repost && !repost.pending;
  try {
    const texto = (ok ? OBRIGADO[Math.floor(Math.random() * OBRIGADO.length)] : OBRIGADO_SEM_REPOST)(who ? '@' + who : '');
    await graph('POST', `/${user.id}/messages`, token, {json: {recipient: {id: m.sender}, message: {text: texto}}});
  } catch (e) { await log(env, 'agradecimento não enviado: ' + e.message); }

  if (ok) await notifyOwner(env, 'Kombu: marcacao no story', `${nome} marcou a Kombú no story. Já repostamos e agradecemos no Direct.`, perfil);
  else if (repost?.pending) await notifyOwner(env, 'Kombu: marcacao no story', `${nome} marcou a Kombú no story (vídeo). A Meta ainda está processando; o repost sai assim que terminar. Agradecemos no Direct.`, perfil);
  else await notifyOwner(env, 'Kombu: reposte pelo app', `${nome} marcou a Kombú no story, mas não consegui repostar sozinho (${motivo}). Abra o Direct e toque em "Adicionar ao seu story". Já agradecemos.`, perfil);
  await env.STATE.put(key, JSON.stringify({status: ok ? 'reposted' : repost?.pending ? 'pending' : 'failed', who, mediaId: repost?.id, motivo, at: new Date().toISOString()}), {expirationTtl: 7 * 86400});
  await log(env, `menção de ${nome}: ${ok ? 'repostada' : repost?.pending ? 'vídeo em processamento' : 'falhou (' + motivo + ')'}`);
}

/** Vídeos que a Meta não terminou dentro do webhook: publica assim que ficarem prontos. */
export async function finishPending(env, {currentToken, account, log}) {
  const {keys} = await env.STATE.list({prefix: 'mention-pending:'});
  if (!keys.length) return;
  const token = await currentToken(env);
  const user = await account(env, token);
  for (const {name} of keys) {
    const p = JSON.parse(await env.STATE.get(name) || 'null');
    if (!p) continue;
    try {
      const {status_code} = await graph('GET', `/${p.containerId}`, token, {params: {fields: 'status_code'}});
      if (status_code === 'IN_PROGRESS') continue;
      if (status_code !== 'FINISHED') throw new Error(status_code);
      const {id} = await graph('POST', `/${user.id}/media_publish`, token, {params: {creation_id: p.containerId}});
      await log(env, `menção de @${p.who || '?'}: vídeo repostado (${id})`);
    } catch (e) {
      await notifyOwner(env, 'Kombu: reposte pelo app', `O vídeo em que ${p.who ? '@' + p.who : 'um cliente'} marcou a Kombú não pôde ser repostado (${e.message}). Reposte pelo Direct.`);
    }
    await env.STATE.delete(name);
    await env.STATE.delete('mention-media:' + p.file);
  }
}

export async function handleRequest(request, env, ctx, deps) {
  const url = new URL(request.url);
  if (url.pathname === '/instagram/webhook' && request.method === 'GET') {
    // Verificação da Meta ao configurar o webhook.
    const ok = env.WEBHOOK_VERIFY_TOKEN && url.searchParams.get('hub.mode') === 'subscribe' && url.searchParams.get('hub.verify_token') === env.WEBHOOK_VERIFY_TOKEN;
    return ok ? new Response(url.searchParams.get('hub.challenge') || '') : new Response('Forbidden', {status: 403});
  }
  if (url.pathname === '/instagram/webhook' && request.method === 'POST') {
    const raw = await request.text();
    if (!(await validSignature(raw, request.headers.get('X-Hub-Signature-256'), env.IG_APP_SECRET))) return new Response('Forbidden', {status: 403});
    let body;
    try { body = JSON.parse(raw); } catch { return new Response('Bad request', {status: 400}); }
    const work = Promise.all([
      ...storyMentions(body).map(m => processMention(env, m, url.origin, deps).catch(e => deps.log(env, 'erro na menção: ' + e.message))),
      finishPending(env, deps).catch(() => {}),
    ]);
    ctx.waitUntil(work);
    return new Response('ok');
  }
  const media = url.pathname.match(/^\/instagram\/story-media\/([a-f0-9]{32})$/);
  if (media && request.method === 'GET') {
    const {value, metadata} = await env.STATE.getWithMetadata('mention-media:' + media[1], {type: 'arrayBuffer'});
    return value ? new Response(value, {headers: {'Content-Type': metadata?.type || 'application/octet-stream'}}) : new Response('Not found', {status: 404});
  }
  return new Response('Not found', {status: 404});
}
