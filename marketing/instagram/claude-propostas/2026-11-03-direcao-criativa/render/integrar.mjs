// Leva a fila pronta para o calendário do publicador.
//
//   node integrar.mjs            confere e grava calendar.json
//   node integrar.mjs --seco     só confere, não grava nada
//
// Para cada post de fila.json (na ordem), copia saida/<post>/<n>.jpg para assets/partners/feed-<post>-<n>.jpg
// e escreve a entrada `art` no calendar.json, com a legenda de legendas.json. Posts já publicados
// (publishedAt local ou published:<id> no KV, conferido antes por quem roda) ficam como estão.
// Depois roda `node render.mjs --check`; se a revisão falhar, o calendar.json anterior volta.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {lintWords} from '../../../content-lint.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ig = path.resolve(here, '../../..');
const seco = process.argv.includes('--seco');
const publicados = new Set((process.env.PUBLICADOS || '').split(',').filter(Boolean));

const { posts: fila } = JSON.parse(await fs.readFile(path.join(here, 'fila.json'), 'utf8'));
const legendas = JSON.parse(await fs.readFile(path.join(here, 'legendas.json'), 'utf8'));
const calFile = path.join(ig, 'calendar.json');
const original = await fs.readFile(calFile, 'utf8');
const cal = JSON.parse(original);

// Nome do sabor no calendário (heroFlavor) a partir do arquivo da garrafa.
const sabor = { 'jasmim-manga': 'manga-jasmim', 'flor-fada-azul-blueberry': 'flor-fada-blueberry', 'hibisco-anis-estrelado': 'hibisco-anis' };
// Cor dominante da arte, que segue o sabor principal (o rodízio de sabor já evita vizinhos iguais).
const familia = {
  'frutas-vermelhas': 'vermelho', 'hibisco-anis': 'magenta', 'goiaba': 'rosa', 'maca-canela': 'terracota',
  'manga-jasmim': 'amarelo', 'maracuja': 'laranja', 'imunidade': 'dourado',
  'flor-fada-blueberry': 'azul', 'uva': 'roxo', 'lavanda-limao': 'lilas',
  'pera-alecrim': 'verde', 'rosas-cardamomo': 'rosa-claro',
};

const jaFoi = p => p.publishedAt || publicados.has(p.id);
const noCal = Object.fromEntries(cal.posts.map(p => [p.id, p]));
const problemas = [];
const novos = [];
for (const item of fila) {
  // Post da fila que já saiu fica como está no calendário (nunca republicar nem trocar).
  if (noCal[item.id] && jaFoi(noCal[item.id])) continue;
  const pos = await fs.readFile(path.join(here, 'pos', item.id + '.json'), 'utf8').then(JSON.parse).catch(() => null);
  const slides = pos?.slides || item.slides;
  const garrafa = slides.flatMap(s => s.bottles || [])[0];
  if (!garrafa) problemas.push(`${item.id}: nenhuma garrafa na arte`);
  const hero = item.hero || (garrafa && (sabor[garrafa.slug] || garrafa.slug));
  if (slides.some(s => (s.bottles || []).some(b => b.rotate))) problemas.push(`${item.id}: garrafa deitada (o dono proibiu)`);
  if (!legendas[item.id]) problemas.push(`${item.id}: sem legenda`);
  const arte = [];
  for (let n = 1; n <= slides.length; n++) {
    const jpg = path.join(here, '../saida', item.id, n + '.jpg');
    try { await fs.access(jpg); } catch { problemas.push(`${item.id}: falta saida/${item.id}/${n}.jpg`); }
    const s = slides[n - 1];
    arte.push({
      type: 'art', image: `feed-${item.id}-${n}.jpg`,
      // Só para a revisão de texto do render.mjs e para variar o fundo entre slides.
      bg: (s.scene || s.color || 'arte').replace(/\.png$/, '') + `-${n}`,
      title: [s.small, s.title].filter(Boolean).join('\n').replace(/\*/g, '') || undefined,
      body: [s.body, s.text && typeof s.text === 'string' && s.text.length > 12 ? s.text : null].filter(Boolean).join('\n') || undefined,
    });
  }
  // Regras de palavras, inclusive as que só valem para conteúdo novo (FORBIDDEN_NEW).
  const texto = [legendas[item.id], ...arte.flatMap(a => [a.title, a.body])].filter(Boolean).join('\n');
  for (const i of lintWords(texto)) problemas.push(`${item.id}: ${i.why} (“${i.match}”)`);
  novos.push({ id: item.id, family: familia[hero] || 'creme', format: slides.length > 1 ? 'carrossel' : 'imagem', heroFlavor: hero, slides: arte, caption: legendas[item.id], source: 'claude-propostas/2026-11-03-direcao-criativa' });
}

const filaIds = new Set(fila.map(p => p.id));
// Ficam: tudo que já foi publicado e o que não é desta fila. Os 05 a 20 antigos (não publicados) saem,
// porque a fila nova os substitui com os mesmos IDs.
const ficam = cal.posts.filter(p => jaFoi(p) || !filaIds.has(p.id) && !/^(0[5-9]|1\d|20)-/.test(p.id));
if (problemas.length) { console.error('Não integrado:\n - ' + problemas.join('\n - ')); process.exit(1); }

if (seco) { console.log(`Seco: ${novos.length} posts prontos, ${ficam.length} mantidos.`); process.exit(0); }

const backup = path.join(here, `../calendar-antes-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '')}.json`);
await fs.writeFile(backup, original);
for (const p of novos) for (let n = 1; n <= p.slides.length; n++)
  await fs.copyFile(path.join(here, '../saida', p.id, n + '.jpg'), path.join(ig, 'assets/partners', p.slides[n - 1].image));
cal.posts = [...ficam, ...novos];
await fs.writeFile(calFile, JSON.stringify(cal, null, 2) + '\n');
try {
  console.log(execFileSync('node', ['render.mjs', '--check'], { cwd: ig, encoding: 'utf8' }).trim());
} catch (e) {
  await fs.writeFile(calFile, original);
  console.error(String(e.stderr || e.stdout || e.message).trim() + '\ncalendar.json restaurado.');
  process.exit(1);
}
console.log(`Integrado: ${novos.length} posts na fila. Cópia do calendário anterior: ${path.relative(ig, backup)}`);
