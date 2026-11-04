// Liga o repost automático de quem marca a Kombú no Story (worker/mentions.mjs). Ação do titular, uma vez.
//
//   cd "~/Desktop/Kombucha/Kombu New Site/marketing/instagram" && node webhook-setup.mjs
//
// Pede a "Chave secreta do app" do Instagram (entrada oculta; colar funciona) e a guarda como segredo do
// Worker, junto com um token de verificação e um canal ntfy gerados aqui. Depois inscreve a conta para
// receber as mensagens (onde chegam as marcações em Story) usando a conexão salva pelo connect.mjs.
// Nenhum segredo aparece na tela; o token de verificação e o canal ntfy aparecem porque você vai colá-los.
import {spawn} from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const env = {...process.env, CI: '1', WRANGLER_SEND_METRICS: 'false', CLOUDFLARE_ACCOUNT_ID: 'd96b1341ef54c6d28ad6415f18220aaf'};
const W = ['npx', '--yes', 'wrangler@4.156.0'];

function run(args, input) {
  return new Promise(resolve => {
    const p = spawn(W[0], [...W.slice(1), ...args], {cwd: path.join(root, 'worker'), env});
    let out = '';
    p.stdout.on('data', d => (out += d)); p.stderr.on('data', d => (out += d));
    p.on('close', code => resolve({code, out}));
    if (input !== undefined) p.stdin.end(input); else p.stdin.end();
  });
}
// Same hidden input as connect.mjs: strips the terminal's bracketed-paste markers and shows a count.
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

// Segundo passo, depois de colar a URL no app da Meta: só inscreve a conta, sem trocar os segredos.
async function inscrever() {
  const cred = JSON.parse(await fs.readFile(path.join(os.homedir(), 'Library/Application Support/Kombu/instagram.json'), 'utf8'));
  const res = await fetch('https://graph.instagram.com/v21.0/me/subscribed_apps?' + new URLSearchParams({subscribed_fields: 'messages', access_token: cred.accessToken}), {method: 'POST'});
  const data = await res.json().catch(() => ({}));
  return res.ok && data.success ? null : (data.error?.message || String(res.status));
}
if (process.argv.includes('--inscrever')) {
  const erro = await inscrever();
  console.log(erro ? 'A Meta não confirmou a inscrição: ' + erro : 'Conta inscrita. A partir de agora, cada marcação em Story é repostada, agradecida e avisada no ntfy.');
  process.exit(erro ? 1 : 0);
}

const secret = await askHidden('Cole a Chave secreta do app do Instagram e aperte Enter: ');
if (!/^[a-f0-9]{32}$/i.test(secret)) {
  console.log(`Isso não parece a chave secreta do app: ela tem 32 letras e números, e chegaram ${secret.length} caracteres. Nada foi alterado.`);
  console.log('Confira se copiou a "Chave secreta do app do Instagram" (Instagram > Configuração da API com login do Instagram), depois de clicar em Mostrar.');
  process.exit(1);
}

const verify = 'kombu-' + crypto.randomBytes(12).toString('hex');
const topic = 'kombu-avisos-' + crypto.randomBytes(8).toString('hex');
for (const [name, value] of [['IG_APP_SECRET', secret], ['WEBHOOK_VERIFY_TOKEN', verify], ['NTFY_TOPIC', topic]]) {
  const r = await run(['secret', 'put', name], value);
  if (r.code !== 0) { console.log(`Não consegui salvar ${name} no Cloudflare:\n` + r.out.replaceAll(secret, '[chave]')); process.exit(1); }
}

console.log(`
Segredos salvos no publicador.

1) No app da Meta, em Webhooks do Instagram, cole:
   URL de retorno:       https://kombu-instagram.adaswani.workers.dev/instagram/webhook
   Token de verificação: ${verify}
   Clique em "Verificar e salvar" e assine o campo "messages".

2) No celular, instale o app ntfy e assine este canal (é o seu canal privado de avisos):
   ${topic}

3) Depois do passo 1, rode:  node webhook-setup.mjs --inscrever
`);
