// Connects @kombu.amazonia to the publisher. The token never appears on screen or in chat.
//
//   cd "~/Desktop/Kombucha/Kombu New Site/marketing/instagram" && node connect.mjs
//
// Asks for the long-lived token (hidden input; pasting works), confirms with Instagram that it
// belongs to @kombu.amazonia, stores it as the Worker's IG_TOKEN secret, and keeps a local copy
// readable only by you. Run it again whenever you generate a new token.
import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const EXPECTED = 'kombu.amazonia';
const KV_ID = 'b59df63d5f8d4b91a087a818f4252c3e';
const root = path.dirname(fileURLToPath(import.meta.url));
const credFile = path.join(os.homedir(), 'Library/Application Support/Kombu/instagram.json');
const env = {...process.env, CI: '1', WRANGLER_SEND_METRICS: 'false', CLOUDFLARE_ACCOUNT_ID: 'd96b1341ef54c6d28ad6415f18220aaf'};

async function wranglerBin() {
  const base = path.join(os.homedir(), '.npm/_npx');
  for (const dir of await fs.readdir(base).catch(() => [])) {
    const bin = path.join(base, dir, 'node_modules/.bin/wrangler');
    if (await fs.access(bin).then(() => true, () => false)) return [bin];
  }
  return ['npx', '-y', 'wrangler@4'];
}

function run(cmd, args, input) {
  return new Promise(resolve => {
    const p = spawn(cmd, args, {cwd: path.join(root, 'worker'), env, stdio: ['pipe', 'pipe', 'pipe']});
    let out = '';
    p.stdout.on('data', d => (out += d));
    p.stderr.on('data', d => (out += d));
    p.on('close', code => resolve({code, out}));
    p.stdin.end(input ?? '');
  });
}

function askHidden(question) {
  return new Promise(resolve => {
    process.stdout.write(question);
    const stdin = process.stdin;
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    let value = '';
    const finish = () => { stdin.setRawMode?.(false); stdin.pause(); stdin.off('data', onData); process.stdout.write('\n'); resolve(value.trim()); };
    const onData = chunk => {
      for (const ch of chunk.replace(/\x1b\[20[01]~/g, '')) {
        if (ch === '\r' || ch === '\n' || ch === '\u0004') return finish();
        if (ch === '\u0003') { process.stdout.write('\n'); process.exit(1); }
        if (ch === '\u007f') { value = value.slice(0, -1); continue; }
        if (ch < ' ' || ch === '\x1b') continue;
        value += ch;
      }
      process.stdout.write(`\r\x1b[2K${question}${'•'.repeat(Math.min(value.length, 40))} (${value.length} caracteres)`);
    };
    stdin.on('data', onData);
  });
}

const token = process.stdin.isTTY
  ? await askHidden('Cole o token do Instagram da Kombú e aperte Enter: ')
  : (await new Promise(r => { let d = ''; process.stdin.setEncoding('utf8'); process.stdin.on('data', c => (d += c)); process.stdin.on('end', () => r(d)); })).replace(/\s+/g, '');
if (token.length < 50) { console.log('Isso não parece um token completo. Nada foi alterado.'); process.exit(1); }

const res = await fetch('https://graph.instagram.com/v21.0/me?' + new URLSearchParams({fields: 'user_id,username,account_type', access_token: token}));
const me = await res.json().catch(() => ({}));
if (!res.ok || me.error) { console.log('O Instagram recusou o token: ' + (me.error?.message || res.status) + '\nNada foi alterado.'); process.exit(1); }
if (me.username !== EXPECTED) {
  console.log(`Este token é da conta @${me.username}, não de @${EXPECTED}. Nada foi alterado.`);
  console.log('Gere o token logado na conta da Kombú.');
  process.exit(1);
}

const W = await wranglerBin();
const put = await run(W[0], [...W.slice(1), 'secret', 'put', 'IG_TOKEN'], token);
if (put.code !== 0) { console.log('Não consegui salvar o token no Cloudflare:\n' + put.out.replaceAll(token, '[token]')); process.exit(1); }
// A previous connection may have left a refreshed token and account id cached; start clean.
for (const key of ['token', 'user']) await run(W[0], [...W.slice(1), 'kv', 'key', 'delete', key, '--namespace-id', KV_ID, '--remote']);

await fs.mkdir(path.dirname(credFile), {recursive: true});
await fs.writeFile(credFile, JSON.stringify({userId: me.user_id, username: me.username, accessToken: token, connectedAt: new Date().toISOString()}, null, 2), {mode: 0o600});
await fs.chmod(credFile, 0o600);

console.log(`\nConectado: @${me.username} (${me.account_type || 'conta profissional'}).`);
console.log('O publicador posta às 12:30 de Manaus, um post a cada dois dias, com uma nova tentativa às 18:30.');
console.log('Se você já publicou o primeiro post à mão com a legenda exata, ele é reconhecido e não se repete.');
console.log('Pode voltar para o Claude.');
