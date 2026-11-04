// Quanto falta na fila do feed e dos Stories. Só leitura: lista nomes de chaves published:* e lê `last`
// no KV do publicador. Nunca lê o token nem chama a API do Instagram.
//
//   node estado.mjs        imprime JSON: publicados, pendentes, dias de fila, último dia de Stories
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';

const exec = promisify(execFile);
const here = path.dirname(fileURLToPath(import.meta.url));
const ig = path.resolve(here, '../../..');
const env = { ...process.env, CI: '1', CLOUDFLARE_ACCOUNT_ID: 'd96b1341ef54c6d28ad6415f18220aaf' };
const ns = ['--namespace-id', 'b59df63d5f8d4b91a087a818f4252c3e', '--remote'];
const wr = (args) => exec('npx', ['--yes', 'wrangler@4.156.0', ...args], { cwd: path.join(ig, 'worker'), env, maxBuffer: 4 << 20, timeout: 60000 });

async function kv(args, tentativa = 0) {
  try { return (await wr(['kv', 'key', ...args, ...ns])).stdout; }
  catch (e) {
    const msg = String(e.stderr || e.stdout || '');
    if (/404: Not Found/.test(msg)) return null;
    if (/401/.test(msg) && tentativa < 2) { await wr(['whoami']).catch(() => {}); return kv(args, tentativa + 1); }
    throw Error('consulta ao KV falhou' + (/401/.test(msg) ? ' (autenticação do Cloudflare)' : ''));
  }
}

const nomes = JSON.parse(await kv(['list', '--prefix', 'published:'])).map(k => k.name.slice('published:'.length));
const last = JSON.parse((await kv(['get', 'last'])) || 'null');
const cal = JSON.parse(await fs.readFile(path.join(ig, 'calendar.json'), 'utf8'));
const reels = JSON.parse(await fs.readFile(path.join(ig, 'reels-calendar.json'), 'utf8').catch(() => '{"reels":[]}'));
const stories = JSON.parse(await fs.readFile(path.join(ig, 'stories-calendar.json'), 'utf8'));
const pub = new Set(nomes);
const pendentes = cal.posts.filter(p => !pub.has(p.id) && !p.publishedAt).map(p => p.id);
const reelsPend = (reels.reels || reels.posts || []).filter(r => !pub.has(r.id)).map(r => r.id);
const hoje = new Date(Date.now() - 4 * 3600e3).toISOString().slice(0, 10);
const diasStories = stories.days.map(d => d.date).filter(d => d >= hoje);
console.log(JSON.stringify({
  hoje, publicados: nomes, last,
  feedPendentes: pendentes, reelsPendentes: reelsPend,
  // Um post a cada dois dias.
  diasDeFeed: (pendentes.length + reelsPend.length) * cal.everyDays,
  storiesAte: stories.days.at(-1)?.date, diasDeStories: diasStories.length,
}, null, 1));
