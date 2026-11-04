// Comentários e insights do Instagram da Kombú (@kombukombucha.am).
// O token fica dentro deste script: é lido do arquivo local salvo pelo connect.mjs e nunca é impresso.
//
//   node comentarios.mjs listar                 comentários de clientes ainda sem resposta (JSON)
//   node comentarios.mjs responder <id> <texto>  responde um comentário (passa pela revisão de palavras)
//   node comentarios.mjs marcar <id> <motivo>    marca como tratado sem responder (spam, ofensa, já respondido à mão)
//   node comentarios.mjs insights                métricas dos últimos posts, salvas em insights/AAAA-MM-DD.json
//
// Não publica, não apaga e não esconde nada. O registro do que foi respondido fica em estado.json.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {lintWords} from '../../content-lint.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const credFile = path.join(os.homedir(), 'Library/Application Support/Kombu/instagram.json');
const estadoFile = path.join(here, 'estado.json');
const API = 'https://graph.instagram.com/v21.0';
const ACCOUNT_ID = '17841465929956612';

const cred = JSON.parse(await fs.readFile(credFile, 'utf8'));
if (String(cred.userId) !== ACCOUNT_ID) throw Error('O arquivo de conexão não é da conta da Kombú. Rode node connect.mjs.');

// Tokens de longa duração vencem em 60 dias; renova a cópia local a cada 20.
const idade = Date.now() - Date.parse(cred.refreshedAt || cred.connectedAt);
if (idade > 20 * 864e5) {
  const r = await fetch('https://graph.instagram.com/refresh_access_token?' + new URLSearchParams({grant_type: 'ig_refresh_token', access_token: cred.accessToken}));
  const j = await r.json().catch(() => ({}));
  if (r.ok && j.access_token) {
    Object.assign(cred, {accessToken: j.access_token, refreshedAt: new Date().toISOString()});
    await fs.writeFile(credFile, JSON.stringify(cred, null, 2), {mode: 0o600});
  }
}

async function api(method, p, params = {}) {
  const qs = new URLSearchParams({...params, access_token: cred.accessToken});
  const r = await fetch(`${API}${p}${method === 'GET' ? '?' + qs : ''}`, method === 'GET' ? {} : {method, body: qs});
  const j = await r.json().catch(() => ({}));
  // A mensagem de erro da Meta nunca contém o token; mesmo assim, só o código e o texto saem.
  if (!r.ok || j.error) throw Error(`Instagram ${j.error?.code || r.status}: ${j.error?.message || 'erro'}`);
  return j;
}

const estado = JSON.parse(await fs.readFile(estadoFile, 'utf8').catch(() => '{"tratados":{}}'));
const salvar = () => fs.writeFile(estadoFile, JSON.stringify(estado, null, 1) + '\n');
const [cmd, id, ...resto] = process.argv.slice(2);

if (cmd === 'listar') {
  const media = await api('GET', '/me/media', {fields: 'id,caption,timestamp,permalink,comments_count', limit: '20'});
  const out = [];
  for (const m of media.data || []) {
    if (!m.comments_count) continue;
    const c = await api('GET', `/${m.id}/comments`, {fields: 'id,text,username,timestamp,replies{id,username,text}', limit: '50'});
    for (const x of c.data || []) {
      if (x.username === cred.username || estado.tratados[x.id]) continue;
      // Já respondido pela conta (à mão, no app): registra e pula.
      if ((x.replies?.data || []).some(r => r.username === cred.username)) { estado.tratados[x.id] = {em: new Date().toISOString(), acao: 'respondido-no-app'}; continue; }
      out.push({id: x.id, de: '@' + x.username, texto: x.text, quando: x.timestamp, post: (m.caption || '').split('\n')[0].slice(0, 90), link: m.permalink});
    }
  }
  await salvar();
  console.log(JSON.stringify(out, null, 1));
} else if (cmd === 'responder') {
  const texto = resto.join(' ').trim();
  if (!id || !texto) throw Error('Uso: responder <id> <texto>');
  if (estado.tratados[id]) throw Error('Esse comentário já foi tratado.');
  const problemas = lintWords(texto);
  if (problemas.length) throw Error('Resposta recusada pela revisão: ' + problemas.map(p => p.why).join('; '));
  if (texto.length > 300) throw Error('Resposta longa demais (máximo 300 caracteres).');
  const r = await api('POST', `/${id}/replies`, {message: texto});
  estado.tratados[id] = {em: new Date().toISOString(), acao: 'respondido', texto, respostaId: r.id};
  await salvar();
  console.log('respondido', r.id);
} else if (cmd === 'marcar') {
  if (!id) throw Error('Uso: marcar <id> <motivo>');
  estado.tratados[id] = {em: new Date().toISOString(), acao: 'marcado', motivo: resto.join(' ') || 'sem motivo'};
  await salvar();
  console.log('marcado');
} else if (cmd === 'insights') {
  const media = await api('GET', '/me/media', {fields: 'id,caption,timestamp,permalink,media_type,like_count,comments_count', limit: '30'});
  const linhas = [];
  for (const m of media.data || []) {
    const linha = {quando: m.timestamp, tipo: m.media_type, abertura: (m.caption || '').split('\n')[0].slice(0, 80), curtidas: m.like_count, comentarios: m.comments_count, link: m.permalink};
    // As métricas aceitas mudam por tipo de mídia; tenta o conjunto completo e cai para o básico.
    for (const metric of ['reach,saved,shares,total_interactions,views', 'reach,saved,shares,total_interactions', 'reach,saved']) {
      try {
        const r = await api('GET', `/${m.id}/insights`, {metric});
        for (const x of r.data || []) linha[x.name] = x.values?.[0]?.value ?? x.total_value?.value;
        break;
      } catch { /* tenta o próximo conjunto */ }
    }
    linhas.push(linha);
  }
  const dir = path.join(here, 'insights');
  await fs.mkdir(dir, {recursive: true});
  const file = path.join(dir, new Date(Date.now() - 4 * 3600e3).toISOString().slice(0, 10) + '.json');
  await fs.writeFile(file, JSON.stringify(linhas, null, 1) + '\n');
  console.log(JSON.stringify(linhas, null, 1));
} else {
  console.log('Comandos: listar | responder <id> <texto> | marcar <id> <motivo> | insights');
}
