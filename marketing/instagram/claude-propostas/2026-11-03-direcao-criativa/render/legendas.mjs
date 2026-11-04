// Junta as legendas aprovadas (FILA-NOVA.md e CONCEITOS.md) em legendas.json, por post.
// node legendas.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const { posts } = JSON.parse(await fs.readFile(path.join(here, 'fila.json'), 'utf8'));
const idByNum = Object.fromEntries(posts.map(p => [p.id.slice(0, 2), p.id]));
const conceito = { 1: '09', 2: '12', 3: '08', 4: '23', 5: '24', 6: '17' };
function captions(md, keyOf) {
  const out = {};
  for (const sec of md.split(/^## /m).slice(1)) {
    const key = keyOf(sec.split('\n')[0]);
    const m = sec.match(/\*\*Legenda\*\*\s*\n```\n([\s\S]*?)\n```/);
    if (key && m) out[idByNum[key]] = m[1].trim();
  }
  return out;
}
const fila = captions(await fs.readFile(path.join(here, '../FILA-NOVA.md'), 'utf8'), h => (h.match(/^(\d\d) ·/) || [])[1]);
const conc = captions(await fs.readFile(path.join(here, '../CONCEITOS.md'), 'utf8'), h => conceito[(h.match(/^(\d)\./) || [])[1]]);
const file = path.join(here, 'legendas.json');
const atual = JSON.parse(await fs.readFile(file, 'utf8').catch(() => '{}'));
// Legenda escrita direto no legendas.json (posts novos) é mantida; as dos .md têm prioridade.
const todas = { ...atual, ...conc, ...fila };
await fs.writeFile(file, JSON.stringify(todas, null, 1) + '\n');
const faltam = posts.map(p => p.id).filter(id => !todas[id]);
console.log(Object.keys(todas).length, 'legendas', faltam.length ? 'faltam: ' + faltam.join(', ') : 'completas');
