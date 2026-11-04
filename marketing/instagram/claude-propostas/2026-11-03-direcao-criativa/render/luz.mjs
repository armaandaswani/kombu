// Etapa de luz. A IA devolve a cena com a garrafa integrada (luz, sombra, reflexo), mas pode
// mover, aumentar e mexer nas letras do rótulo. Aqui:
// 1. acha onde a IA pôs a garrafa (escala e posição), comparando o formato da garrafa oficial
//    com a imagem da IA (correlação normalizada, em escala reduzida e depois refinada);
// 2. põe a foto oficial exatamente ali, pixel a pixel, com a luz de baixa frequência da IA
//    (razão entre as duas versões desfocadas dentro do formato da garrafa).
// Rótulo, letras e formato ficam os do arquivo oficial; sombra, reflexo, o que está na frente
// (occluders, ex.: o copo) e o resto da cena ficam os da IA.
// Uso: node luz.mjs <post> <slide> <entrada.png>   →  ../saida/<post>/<slide>-luz.png
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const ig = path.resolve(here, '../../..');
const repo = path.resolve(ig, '../..');
const sharp = createRequire(path.join(ig, 'video-studio/package.json'))('sharp');
const W = 1080, H = 1350, SIGMA = 7;
const fileSlug = (s) => ({ 'manga-jasmim': 'jasmim-manga', 'flor-fada-blueberry': 'flor-fada-azul-blueberry', 'hibisco-anis': 'hibisco-anis-estrelado' }[s] || s);

const [postId, slideN, input] = process.argv.slice(2);
const { posts } = JSON.parse(await fs.readFile(path.join(here, 'fila.json'), 'utf8'));
for (const p of posts) {
  try { p.slides = JSON.parse(await fs.readFile(path.join(here, 'pos', p.id + '.json'), 'utf8')).slides; } catch { /* sem ajuste */ }
}
const slide = posts.find((p) => p.id === postId).slides[Number(slideN) - 1];
const occ = slide.occludersLuz || slide.occluders || [];
const hidden = (x, y) => occ.some((o) => x >= o.x && x < o.x + o.w && y >= o.y && y < o.y + o.h);

const canvas = await sharp(input).resize(W, H, { fit: 'fill' }).removeAlpha().raw().toBuffer();
const gray = (buf, w, h, ch) => { const g = new Float32Array(w * h); for (let i = 0; i < w * h; i++) g[i] = 0.299 * buf[i * ch] + 0.587 * buf[i * ch + 1] + 0.114 * buf[i * ch + 2]; return g; };

async function officialAt(file, w, h) {
  return sharp(file).resize(Math.max(1, Math.round(w)), Math.max(1, Math.round(h)), { fit: 'fill' }).ensureAlpha().raw().toBuffer();
}

// Correlação normalizada entre a garrafa oficial (escalada) e a imagem da IA, numa escala reduzida f.
async function score(file, ratio, sceneG, f, cx, base, h) {
  const bh = Math.round(h * f), bw = Math.round(h * ratio * f);
  const off = await officialAt(file, bw, bh);
  const og = gray(off, bw, bh, 4);
  const left = Math.round(cx * f - bw / 2), top = Math.round(base * f - bh);
  const SW = Math.round(W * f), SH = Math.round(H * f);
  let n = 0, total = 0, sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0;
  for (let y = 0; y < bh; y += 1) for (let x = 0; x < bw; x += 1) {
    const a = off[(y * bw + x) * 4 + 3]; if (a < 200) continue;
    total++;
    const sx = left + x, sy = top + y; if (sx < 0 || sy < 0 || sx >= SW || sy >= SH) continue;
    if (hidden(sx / f, sy / f)) continue;
    const va = og[y * bw + x], vb = sceneG[sy * SW + sx];
    n++; sa += va; sb += vb; saa += va * va; sbb += vb * vb; sab += va * vb;
  }
  // A garrafa precisa estar quase toda visível no candidato: senão um pedaço do copo "parece" garrafa.
  if (n < 200 || n < total * 0.6) return -1;
  const cov = sab - sa * sb / n, da = saa - sa * sa / n, db = sbb - sb * sb / n;
  return cov / Math.sqrt(Math.max(da * db, 1e-6));
}

for (const b0 of slide.bottles || []) {
  let file = path.join(repo, 'assets/bottles', fileSlug(b0.slug) + '.webp');
  let meta = await sharp(file).metadata();
  let guessH = b0.h, guessBase = (b0.base / 100) * H;
  if (b0.rotate) {
    // Garrafa deitada (cena vista de cima): gira a foto oficial e trata o retângulo girado
    // como se fosse uma garrafa em pé; x/y do fila.json são o centro.
    const rotated = await sharp(file).rotate(b0.rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    const rmeta = await sharp(rotated).metadata();
    file = path.join(here, '..', 'saida', postId, `.girada-${b0.slug}.png`);
    await fs.writeFile(file, rotated);
    guessH = b0.h * rmeta.height / meta.height;
    guessBase = (b0.y / 100) * H + guessH / 2;
    meta = rmeta;
  }
  const ratio = meta.width / meta.height;
  // Busca grossa a 1/6, depois fina a 1/2.
  let best = { s: -2, cx: (b0.x / 100) * W, base: guessBase, h: guessH };
  for (const [f, hs, steps, dxy] of [[1 / 6, [0.8, 1.6, 0.04], 1, 150], [1 / 2, null, 0, 14]]) {
    const SW = Math.round(W * f), SH = Math.round(H * f);
    const sceneG = gray(await sharp(canvas, { raw: { width: W, height: H, channels: 3 } }).resize(SW, SH).raw().toBuffer(), SW, SH, 3);
    const start = { ...best };
    const scales = hs ? [] : [0.97, 0.985, 1, 1.015, 1.03];
    if (hs) for (let k = hs[0]; k <= hs[1] + 1e-9; k += hs[2]) scales.push(k);
    const stepPx = hs ? 12 : 3;
    for (const k of scales) {
      const h = hs ? guessH * k : start.h * k;
      for (let dx = -dxy; dx <= dxy; dx += stepPx) for (let dy = -dxy; dy <= dxy; dy += stepPx) {
        const cx = start.cx + dx, base = start.base + dy;
        const s = await score(file, ratio, sceneG, f, cx, base, h);
        if (s > best.s) best = { s, cx, base, h };
      }
    }
  }
  console.log(`${b0.slug}: correlação ${best.s.toFixed(3)}, altura ${Math.round(best.h)} px, centro x ${Math.round(best.cx)}, base y ${Math.round(best.base)}`);
  if (best.s < 0.5) { console.log('Garrafa não encontrada com segurança; nada aplicado.'); process.exitCode = 2; continue; }

  const h = Math.round(best.h), w = Math.round(best.h * ratio);
  const left = Math.round(best.cx - w / 2), top = Math.round(best.base - h);
  const off = await officialAt(file, w, h);
  const ai = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sy = top + y, sx = left + x;
    if (sy < 0 || sy >= H || sx < 0 || sx >= W) continue;
    canvas.copy(ai, (y * w + x) * 3, (sy * W + sx) * 3, (sy * W + sx) * 3 + 3);
  }
  const mAi = Buffer.alloc(w * h * 3), mOff = Buffer.alloc(w * h * 3), mask = Buffer.alloc(w * h * 3);
  for (let i = 0; i < w * h; i++) {
    const a = off[i * 4 + 3] / 255;
    for (let c = 0; c < 3; c++) {
      mAi[i * 3 + c] = Math.round(ai[i * 3 + c] * a);
      mOff[i * 3 + c] = Math.round(off[i * 4 + c] * a);
      mask[i * 3 + c] = Math.round(255 * a);
    }
  }
  const blur = (buf) => sharp(buf, { raw: { width: w, height: h, channels: 3 } }).blur(SIGMA).raw().toBuffer();
  const [bAi, bOff, bM] = await Promise.all([blur(mAi), blur(mOff), blur(mask)]);
  // Luz de cilindro: lado oposto à janela mais escuro, borda acesa pela contraluz, um brilho
  // vertical no plástico e o líquido brilhando com a luz atrás. Só luz: o desenho do rótulo
  // continua o da foto oficial. Ajuste por garrafa em fila.json → "luz".
  const L = { dir: 'direita', sombra: 0.42, borda: 0.35, brilho: 0.38, posBrilho: 0.72, quente: 0.10, contraste: 1.12, ...(b0.luz || {}) };
  const warm = [1 + L.quente, 1 + L.quente * 0.35, 1 - L.quente * 0.5];
  // Fora da faixa do rótulo (tampa, gargalo, líquido) não há letra: fica o pixel da IA, que tem
  // a luz e a condensação reais. Dentro do rótulo entra a foto oficial com a luz abaixo, mais os
  // brilhos fortes da IA (gotas, reflexo), que não carregam letra.
  const faixa = L.rotulo || (b0.rotate ? [-1, 2] : [0.31, 0.80]);
  const aiBlur = await sharp(ai, { raw: { width: w, height: h, channels: 3 } }).blur(2.5).raw().toBuffer();
  for (let i = 0; i < w * h; i++) {
    const a = off[i * 4 + 3] / 255;
    if (a === 0) continue;
    const y = Math.floor(i / w), x = i % w, sy = top + y, sx = left + x;
    if (sy < 0 || sy >= H || sx < 0 || sx >= W || hidden(sx, sy)) continue;
    const m = Math.max(bM[i * 3], 1) / 255;
    let u = x / Math.max(w - 1, 1); if (L.dir === 'esquerda') u = 1 - u;
    const v = y / Math.max(h - 1, 1);
    const shade = (1 - L.sombra) + L.sombra * Math.pow(Math.sin(Math.min(u * 1.15, 1) * Math.PI / 2), 0.8);
    const rim = u > 0.86 ? L.borda * ((u - 0.86) / 0.14) : 0;
    const spec = L.brilho * Math.exp(-Math.pow((u - L.posBrilho) / 0.035, 2)) * (v > 0.06 && v < 0.97 ? 1 : 0.3);
    const base = v > 0.93 ? 0.82 + 0.18 * (1 - (v - 0.93) / 0.07) : 1;
    if (v < faixa[0] || v > faixa[1]) {
      // Transição suave de 2% nas bordas da faixa para não marcar uma linha.
      for (let c = 0; c < 3; c++) { const o = (sy * W + sx) * 3 + c; canvas[o] = Math.round(ai[i * 3 + c] * a + canvas[o] * (1 - a)); }
      continue;
    }
    const edge = Math.min(1, Math.min(v - faixa[0], faixa[1] - v) / 0.02);
    for (let c = 0; c < 3; c++) {
      const avgAi = bAi[i * 3 + c] / 255 / m, avgOff = Math.max(bOff[i * 3 + c] / 255 / m, 4 / 255);
      const r = Math.min(1.6, Math.max(0.25, avgAi / avgOff));
      let px = off[i * 4 + c] * r;
      px = 128 + (px - 128) * L.contraste;          // devolve o contraste que a foto de estúdio não tem
      px = px * shade * base * warm[c];
      px = px + (255 - px) * Math.min(1, rim * (c === 2 ? 0.8 : 1) + spec);
      const hp = ai[i * 3 + c] - aiBlur[i * 3 + c];   // brilho fino da IA (gota, reflexo)
      if (hp > 22) px += (hp - 22) * 1.2;
      px = px * edge + ai[i * 3 + c] * (1 - edge);
      const o = (sy * W + sx) * 3 + c;
      canvas[o] = Math.round(Math.max(0, Math.min(255, px)) * a + canvas[o] * (1 - a));
    }
  }
}

const out = path.resolve(here, '../saida', postId, `${slideN}-luz.png`);
await sharp(canvas, { raw: { width: W, height: H, channels: 3 } }).png().toFile(out);
console.log('ok', out);
