// Compositor da fila nova (FILA-NOVA.md). Lê fila.json e as cenas em ../cenas/,
// aplica a garrafa oficial (assets/bottles, sem alteração), a assinatura da marca e o texto,
// e grava ../saida/<post>/<n>.jpg (1080 × 1350) mais ../saida/previa.jpg.
// Cena que ainda não existe vira um fundo neutro marcado "cena pendente", para a prévia
// mostrar o que falta sem travar o resto.
// Uso: node render.mjs            (todos os posts)
//      node render.mjs 09-hibisco (só um)
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const ig = path.resolve(here, '../../..');
const repo = path.resolve(ig, '../..');
const scenes = path.resolve(here, '../cenas');
const outDir = path.resolve(here, '../saida');
const sharp = createRequire(path.join(ig, 'video-studio/package.json'))('sharp');
const { chromium } = await import(pathToFileURL(path.join(repo, 'scripts/browser/node_modules/playwright/index.mjs')));

const W = 1080, H = 1350;
// Aceita o nome curto do calendar.json (heroFlavor) e devolve o nome do arquivo em assets/bottles.
const canonicalSlug=s=>({'manga-jasmim':'jasmim-manga','flor-fada-blueberry':'flor-fada-azul-blueberry','hibisco-anis':'hibisco-anis-estrelado'}[s]||s);
const url = (p) => pathToFileURL(p).href;
const esc = (s) => String(s ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const exists = (p) => fs.access(p).then(() => true, () => false);

let fonts = '';
for (const f of ['Playfair+Display.css', 'Plus+Jakarta+Sans.css']) {
  const css = await fs.readFile(path.join(ig, 'fonts', f), 'utf8');
  fonts += css.replace(/https:\/\/fonts\.gstatic\.com\/[^)]+/g, (u) => url(path.join(ig, 'fonts', u.split('/').pop())));
}
// Radley: a fonte de "Da Amazônia para você" no rótulo. Usada só no destaque pedido pelo dono.
fonts += `@font-face{font-family:'Radley';font-style:italic;font-weight:400;src:url(${url(path.join(here, 'fonts/radley-italic.woff2'))}) format('woff2')}`
  + `@font-face{font-family:'Radley';font-style:normal;font-weight:400;src:url(${url(path.join(here, 'fonts/radley.woff2'))}) format('woff2')}`;
// Título: "*palavra*" vira destaque em Radley itálico; "\n" quebra a linha.
const titleHtml = (t) => esc(t).replace(/\*([^*]+)\*/g, '<span class="destaque">$1</span>').replace(/\n/g, '<br>');

const light = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) > 150;
};
const logoFor = (ink) => url(path.join(ig, 'assets/brand', light(ink) ? 'kombu-assinatura-colorida-creme.png' : 'kombu-assinatura-colorida-tinta.png'));

const bottleRatio = {};
async function bottleW(slug, h) {
  slug=canonicalSlug(slug);
  if (!bottleRatio[slug]) {
    const m = await sharp(path.join(repo, 'assets/bottles', slug + '.webp')).metadata();
    bottleRatio[slug] = m.width / m.height;
  }
  return Math.round(h * bottleRatio[slug]);
}

// Máscara da luz em data URI: o Chromium não aplica mask-image vindo de file:// (CORS).
const maskCache = {};
async function maskUri(slug) {
  slug=canonicalSlug(slug);
  if (!maskCache[slug]) {
    const png = await sharp(path.join(repo, 'assets/bottles', slug + '.webp')).resize({ height: 600 }).png().toBuffer();
    maskCache[slug] = 'data:image/png;base64,' + png.toString('base64');
  }
  return maskCache[slug];
}

// Garrafa oficial + sombra de contato e sombra projetada, desenhadas fora da garrafa.
async function bottles(list = [], lightDir = 'esquerda') {
  const dx = lightDir === 'esquerda' ? 22 : lightDir === 'direita' ? -22 : 0;
  let html = '';
  for (const raw of list) {
    const b={...raw,slug:canonicalSlug(raw.slug)};
    const w = await bottleW(b.slug, b.h);
    if (b.rotate) {
      // Garrafa deitada, para cena vista de cima: x/y = centro da garrafa; sombra em volta.
      const cx = (b.x / 100) * W, cy = (b.y / 100) * H;
      html += `<img class="bottle" src="${url(path.join(repo, 'assets/bottles', b.slug + '.webp'))}" style="left:${cx - w / 2}px;top:${cy - b.h / 2}px;height:${b.h}px;transform:rotate(${b.rotate}deg);filter:drop-shadow(${dx * 0.5}px 14px 14px rgba(0,0,0,.32))" alt="">`;
      continue;
    }
    const left = (b.x / 100) * W - w / 2, top = (b.base / 100) * H - b.h;
    const src = url(path.join(repo, 'assets/bottles', b.slug + '.webp'));
    html += `<div class="contact" style="left:${left - w * 0.08 + dx * 0.6}px;top:${top + b.h - 16}px;width:${w * 1.16}px"></div>`
      + `<img class="bottle" src="${src}" style="left:${left}px;top:${top}px;height:${b.h}px;filter:drop-shadow(${dx}px 26px 26px rgba(0,0,0,.28))" alt="">`;
    // Luz da cena por cima da garrafa: sombra do lado oposto à luz e, se pedido, um tom quente.
    // É uma camada recortada no formato da garrafa; a foto oficial embaixo não muda.
    const shade = lightDir === 'esquerda' ? 'to left' : lightDir === 'direita' ? 'to right' : 'to bottom';
    const tone = { quente: 'rgba(255,170,90,.16)', frio: 'rgba(150,190,255,.10)' }[b.tom] || 'rgba(255,255,255,0)';
    const dark = b.sombra ?? 0.28;
    const dim = b.escurecer ?? 0;
    html += `<div class="shade" style="left:${left}px;top:${top}px;width:${w}px;height:${b.h}px;-webkit-mask-image:url('${await maskUri(b.slug)}');background:linear-gradient(${shade},rgba(15,10,5,${dark}),rgba(15,10,5,${dark * 0.25}) 55%,${tone}),linear-gradient(rgba(15,10,5,${dim}),rgba(15,10,5,${dim}))"></div>`;
  }
  return html;
}

async function sceneTag(file, cls = 'scene') {
  if (!file) return '';
  const p = path.isAbsolute(file)?file:path.join(scenes,file);
  if (await exists(p)) return `<img class="${cls}" src="${url(p)}" alt="">`;
  return `<div class="${cls} pending"><span>cena pendente<br>${esc(file)}</span></div>`;
}

// Project a real screenshot of the coupon field onto the generated blank screen.
function quadMatrix(points,w=300,h=650){
 const src=[[0,0],[w,0],[w,h],[0,h]],a=[];
 for(let i=0;i<4;i++){const[x,y]=src[i],[u,v]=points[i];a.push([x,y,1,0,0,0,-u*x,-u*y,u],[0,0,0,x,y,1,-v*x,-v*y,v]);}
 for(let i=0;i<8;i++){let k=i;for(let j=i+1;j<8;j++)if(Math.abs(a[j][i])>Math.abs(a[k][i]))k=j;[a[i],a[k]]=[a[k],a[i]];const q=a[i][i];a[i]=a[i].map(n=>n/q);for(let j=0;j<8;j++)if(j!==i){const m=a[j][i];a[j]=a[j].map((n,k)=>n-m*a[i][k]);}}
 const[t,b,c,d,e,f,g,h2]=a.map(r=>r[8]);return[t,d,0,g,b,e,0,h2,0,0,1,0,c,f,0,1].join(',');
}
function couponScreen(){return `<div class="coupon-screen" style="transform:matrix3d(${quadMatrix([[380,171],[577,225],[395,700],[207,633]])})"><img class="phone-logo" src="${logoFor('#191C1C')}" alt=""><img class="real-coupon" src="${url(path.join(here,'cupom-site-real.png'))}" alt="Captura real do campo de cupom"><span>kombukombucha.com.br</span></div>`;}

const textBlock = (s, cls = '') => `<div class="text ${cls}">${s.small && cls.includes('small-top') ? `<p class="small">${esc(s.small)}</p>` : ''}${s.title ? `<h1>${titleHtml(s.title)}</h1>` : ''}${s.body ? `<p class="body">${esc(s.body)}</p>` : ''}${s.list ? `<ul>${s.list.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}${s.steps ? `<ol>${s.steps.map((i) => `<li>${esc(i)}</li>`).join('')}</ol>` : ''}${s.small && !cls.includes('small-top') ? `<p class="small">${esc(s.small)}</p>` : ''}</div>`;

async function slideHtml(s) {
  const ink = s.ink || s.band?.ink || s.panel?.ink || '#191C1C';
  let body = '', css = '';
  if (s.layout === 'A') {
    const c = s.corner || 'bl';
    body = await sceneTag(s.scene) + `<div class="scrim ${c}"></div>` + await bottles(s.bottles, s.light) + textBlock(s, `corner ${c}`)
      + `<img class="logo ${s.logo || 'tr'}" src="${logoFor(ink)}" alt="">`;
    css = `.text{color:${ink}}${s.titleSize ? `.corner h1{font-size:${s.titleSize}px}` : ''}${s.textWidth ? `.corner{max-width:${s.textWidth}px}` : ''}`;
  } else if (s.layout === 'B') {
    const b = s.band, bh = Math.round(b.size * H);
    body = await sceneTag(s.scene) + await bottles(s.bottles, s.light)
      + `<div class="band ${b.side}" style="height:${bh}px;background:${b.color}"></div>`
      + textBlock(s, `inband ${b.side}`) + `<img class="logo band-logo ${b.side}" src="${logoFor(b.ink)}" alt="">`;
    if (s.seal) {
      const w = await bottleW(s.seal.slug, s.seal.d * 0.86);
      body += `<div class="seal" style="left:${(s.seal.x / 100) * W - s.seal.d / 2}px;top:${(s.seal.y / 100) * H - s.seal.d / 2}px;width:${s.seal.d}px;height:${s.seal.d}px;background:${s.seal.color}"><img src="${url(path.join(repo, 'assets/bottles', canonicalSlug(s.seal.slug) + '.webp'))}" style="height:${s.seal.d * 0.86}px;width:${w}px" alt=""></div>`;
    }
    css = `.text{color:${b.ink};${b.side === 'top' ? 'top:0' : 'bottom:0'};height:${bh}px}`;
  } else if (s.layout === 'C') {
    const p = s.panel;
    body = await sceneTag(s.scene, `scene half-${p.side}`) + await bottles(s.bottles, s.light)
      + `<div class="panel ${p.side}" style="background:${p.color}"></div>` + textBlock(s, `inpanel ${p.side}`)
      + `<img class="logo panel-logo ${p.side}" src="${logoFor(p.ink)}" alt="">`;
    css = `.text{color:${p.ink}}`;
  } else if (s.layout === 'D') {
    body = await sceneTag(s.scene) + await bottles(s.bottles, s.light);
    if (s.menu) {
      const m = s.menu;
      body += `<div class="menu" style="left:${m.x}%;top:${m.y}%;width:${m.w}%;height:${m.h}%;color:${ink}"><img class="menu-logo" src="${logoFor(ink)}" alt=""><h2>${esc(s.menuTitle)}</h2><ul>${s.menuItems.map((i) => `<li><span>${esc(i)}</span></li>`).join('')}<li class="new"><span>${esc(s.menuNew)}</span></li></ul></div>`
        + `<p class="stone" style="color:${s.captionInk}">${esc(s.caption)}</p>`;
    } else if (s.card) {
      const c = s.card;
      body += `<div class="card" style="left:${c.x - c.w / 2}%;top:${c.y}%;width:${c.w}%;color:${ink}"><img class="card-logo" src="${logoFor(ink)}" alt=""><p class="small">${esc(s.small)}</p><h1>${esc(s.title)}</h1></div>`;
    } else if (s.box) {
      const b = s.box;
      body += `<div class="tag" style="left:${b.x}%;top:${b.y}%;width:${b.w}%;transform:rotate(${b.rotate}deg);color:${ink};font-size:${b.font}px">${esc(s.title)}</div>`
        + `<img class="logo tr" src="${logoFor('#FFF7ED')}" alt="">`;
    }
  } else if (s.layout === 'E') {
    body = `<div class="frame">${await sceneTag(s.scene, 'scene framed')}${await bottles(s.bottles, s.light)}${s.scene==='20-1.png'?couponScreen():''}</div>` + textBlock(s, 'under')
      + `<img class="logo under-logo" src="${logoFor('#191C1C')}" alt="">`;
    css = `body{background:#FFF7ED}.text{color:#1B2F18}`;
  } else if (s.layout === 'F') {
    body = await sceneTag(s.scene) + await bottles(s.bottles, s.light) + textBlock(s, `side ${s.text || 'right'}`)
      + `<img class="logo br" src="${logoFor(ink)}" alt="">`;
    css = `.text{color:${ink}}`;
  } else if (s.layout === 'G') {
    body = (s.scene ? await sceneTag(s.scene) : '') + textBlock(s, 'center') + `<img class="logo bc" src="${logoFor(ink)}" alt="">`;
    css = `body{background:${s.color || '#FFF7ED'}}.text{color:${ink}}`;
  }
  // Objeto da cena na frente da garrafa (ex.: o copo): a própria cena é redesenhada por cima,
  // recortada no retângulo do objeto, e a garrafa fica atrás dele.
  if (s.occluders?.length && s.bottles?.length && s.scene && (await exists(path.join(scenes, s.scene)))) {
    for (const o of s.occluders) {
      body += `<img class="scene" src="${url(path.join(scenes, s.scene))}" style="z-index:4;clip-path:inset(${o.y}px ${W - o.x - o.w}px ${H - o.y - o.h}px ${o.x}px round ${o.r ?? 18}px)" alt="">`;
    }
  }
  return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>${fonts}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{position:relative;background:#E9E2D6;font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased}
.scene{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.pending{display:grid;place-items:center;background:linear-gradient(160deg,#CFC6B8,#A69C8D);color:#5A5246;font:600 30px/1.4 'Plus Jakarta Sans';text-align:center}
.pending span{border:2px dashed #5A524680;padding:26px 34px;border-radius:12px}
.bottle{position:absolute;width:auto;z-index:3}
.shade{position:absolute;z-index:3;-webkit-mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mix-blend-mode:multiply;pointer-events:none}
.contact{position:absolute;height:30px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.5),rgba(0,0,0,0));filter:blur(5px);z-index:2}
.logo{position:absolute;width:150px;z-index:6}
.logo.tr{top:56px;right:64px}.logo.tl{top:56px;left:64px}.logo.br{bottom:56px;right:64px}.logo.bl{bottom:56px;left:64px}.logo.bc{bottom:60px;left:50%;transform:translateX(-50%)}
h1{font:600 60px/1.14 'Playfair Display',serif;letter-spacing:-.6px;text-wrap:balance}
.destaque{font-family:'Radley',serif;font-style:italic;font-weight:400;font-size:1.12em;letter-spacing:0}
.body{font-size:30px;line-height:1.55;margin-top:22px}
.small{font-size:24px;line-height:1.45;margin-top:18px;opacity:.9}
.text{position:absolute;z-index:5}
.scrim{position:absolute;inset:0;z-index:4;pointer-events:none}
.scrim.bl{background:radial-gradient(120% 70% at 0% 100%,rgba(0,0,0,.55),rgba(0,0,0,0) 60%)}
.scrim.tl{background:radial-gradient(120% 70% at 0% 0%,rgba(0,0,0,.42),rgba(0,0,0,0) 60%)}
.scrim.tr{background:radial-gradient(120% 70% at 100% 0%,rgba(255,255,255,.55),rgba(255,255,255,0) 60%)}
.corner{max-width:600px}.corner.bl{left:68px;bottom:76px}.corner.tl{left:68px;top:76px}.corner.tr{right:68px;top:150px;text-align:right}
.corner h1{font-size:56px}
.band{position:absolute;left:0;right:0;z-index:4}.band.top{top:0}.band.bottom{bottom:0}
.inband{left:68px;right:250px;display:flex;flex-direction:column;justify-content:center}
.band-logo{right:64px}.band-logo.top{top:52px}.band-logo.bottom{bottom:52px}
.half-left{left:50%;width:50%}.half-bottom{height:50%}
.panel{position:absolute;z-index:4}.panel.left{left:0;top:0;bottom:0;width:50%}.panel.bottom{left:0;right:0;bottom:0;height:50%}
.inpanel.left{left:64px;width:420px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center}
.inpanel.bottom{left:68px;right:68px;bottom:0;height:50%;display:flex;flex-direction:column;justify-content:center}
.panel-logo.left{top:60px;left:64px}.panel-logo.bottom{bottom:56px;right:64px}
.frame{position:absolute;left:70px;right:70px;top:70px;height:960px;overflow:hidden;border-radius:4px}
.frame .bottle,.frame .contact,.frame .shade{translate:-70px -70px}
.under{left:70px;right:260px;top:1066px}.under h1{font-size:44px}.under .small{font-size:22px}
.under-logo{right:70px;bottom:70px;width:140px}
.side{top:230px;bottom:auto;display:flex;flex-direction:column;justify-content:flex-start}.side.right{left:55%;right:64px}.side.left{left:64px;right:55%}
.center{left:110px;right:110px;top:0;bottom:120px;display:flex;flex-direction:column;justify-content:center;text-align:center}
.center h1{font-size:68px}.center .body{font-size:36px;line-height:1.5}
.center ul,.center ol{list-style:none;margin-top:34px;font-size:32px;line-height:1.5;display:grid;gap:14px}
.center ol{counter-reset:s;text-align:left;max-width:720px;margin-left:auto;margin-right:auto}
.center ol li{counter-increment:s;display:grid;grid-template-columns:64px 1fr;align-items:baseline}
.center ol li::before{content:counter(s);font:600 44px 'Playfair Display'}
.menu{position:absolute;z-index:5;padding:5% 7%;display:flex;flex-direction:column}
.menu-logo{width:120px;margin:0 auto 18px}
.menu h2{font:600 44px 'Playfair Display';text-align:center;margin-bottom:26px}
.menu ul{list-style:none;display:grid;gap:18px;font-size:26px}
.menu li{border-bottom:1px dotted currentColor;padding-bottom:10px}
.menu li.new{font-weight:700;color:#2D4B28;border-bottom-style:solid}
.stone{position:absolute;left:68px;bottom:70px;z-index:5;font:600 46px 'Playfair Display'}
.card{position:absolute;z-index:5;transform:translateY(-50%);text-align:center;padding:0 3%}
.card-logo{width:130px;margin:0 auto 26px;display:block}
.card .small{font-size:21px;margin:0 0 18px}
.card h1{font-size:46px}
.tag{position:absolute;z-index:5;font-family:'Playfair Display';font-weight:600;line-height:1.2;text-align:center}
.coupon-screen{position:absolute;left:0;top:0;width:300px;height:650px;transform-origin:0 0;background:#fff;z-index:5;overflow:hidden;border-radius:20px;padding:24px 16px;color:#23351e}.phone-logo{display:block;width:110px;height:80px;object-fit:contain;margin:30px auto 140px}.real-coupon{display:block;width:268px;height:auto}.coupon-screen span{position:absolute;bottom:28px;left:18px;font:13px Arial;color:#555}.seal{position:absolute;z-index:5;border-radius:50%;display:grid;place-items:center;box-shadow:0 18px 40px rgba(0,0,0,.25)}
${css}${s.destaqueCor ? `.destaque{color:${s.destaqueCor}}` : ''}${process.env.SO_GARRAFA ? '.text,.logo,.band,.panel,.scrim,.menu,.card,.tag,.stone,.seal{display:none!important}' : ''}</style><body>${body}</body></html>`;
}

const only = process.argv[2];
const { posts } = JSON.parse(await fs.readFile(path.join(here, 'fila.json'), 'utf8'));
// pos/<post>.json, se existir, substitui os slides daquele post (cada agente edita só o seu arquivo).
for (const p of posts) {
  try { p.slides = JSON.parse(await fs.readFile(path.join(here, 'pos', p.id + '.json'), 'utf8')).slides; } catch { /* sem ajuste */ }
}
const browser = await chromium.launch({channel:'chrome',headless:true});
const page = await browser.newPage({ viewport: { width: W, height: H } });
const tmp = path.join(outDir, '.html');
await fs.mkdir(tmp, { recursive: true });
const done = [];
const audit=[];
let pending = 0;
for (const p of posts) {
  if (only && p.id !== only) continue;
  await fs.mkdir(path.join(outDir, p.id), { recursive: true });
  const files = [];
  for (const [i, raw] of p.slides.entries()) {
    // Etapa de luz: se existir saida/<post>/<n>-luz.png (cena + garrafa já integradas pela IA
    // e conferidas), ela vira o fundo e a garrafa não é colada de novo.
    let s = raw;
    const luz = path.join(outDir, p.id, `${i + 1}-luz.png`);
    if (!process.env.SO_GARRAFA && (await exists(luz))) {
      s = { ...raw, scene: luz, bottles: [], seal: null };
    }
    if (s.scene && !(await exists(path.isAbsolute(s.scene)?s.scene:path.join(scenes,s.scene)))) pending++;
    const html = await slideHtml(s);
    const hp = path.join(tmp, `${p.id}-${i + 1}.html`);
    await fs.writeFile(hp, html);
    await page.goto(url(hp));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');
    await page.evaluate(async()=>Promise.all([...document.images].map(i=>i.decode())));
    audit.push({id:p.id,slide:i+1,layout:s.layout,bounds:await page.locator('h1,h2,p,li,.tag').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return {text:e.textContent,left:b.left,top:b.top,right:b.right,bottom:b.bottom};}))});
    // SO_GARRAFA=1: só cena + garrafa, para a etapa de integração da luz.
    const out = path.join(outDir, p.id, process.env.SO_GARRAFA ? `${i + 1}-base.png` : `${i + 1}.jpg`);
    const shot = await page.screenshot({ type: 'png' });
    if (process.env.SO_GARRAFA) await fs.writeFile(out, shot);
    else await sharp(shot).jpeg({ quality: 92 }).toFile(out);
    files.push(out);
  }
  done.push({ id: p.id, files });
}
await browser.close();
await fs.writeFile(path.join(outDir,'revisao-layout.json'),JSON.stringify(audit,null,2));
for(const p of posts)if(!only||p.id===only){const caps=JSON.parse(await fs.readFile(path.join(here,'legendas.json'),'utf8'));await fs.writeFile(path.join(outDir,p.id,'legenda.txt'),caps[p.id]+'\n');}

// Prévia: uma linha por post, slides lado a lado.
const tw = 324, th = 405, gap = 14, label = 34, cols = 3;
const rows = done.length;
const comps = [];
for (const [r, d] of done.entries()) {
  const y = r * (th + label + gap);
  comps.push({ input: Buffer.from(`<svg width="${cols * (tw + gap)}" height="${label}"><text x="4" y="24" font-family="Helvetica" font-size="20" fill="#333">${esc(d.id)}</text></svg>`), left: 0, top: y });
  for (const [c, f] of d.files.entries()) {
    comps.push({ input: await sharp(f).resize(tw, th).toBuffer(), left: c * (tw + gap), top: y + label });
  }
}
await sharp({ create: { width: cols * (tw + gap), height: rows * (th + label + gap), channels: 3, background: '#FFFFFF' } })
  .composite(comps).jpeg({ quality: 88 }).toFile(path.join(outDir, only ? `previa-${only}.jpg` : 'previa.jpg'));
console.log(`${done.length} posts renderizados em ${outDir}. Cenas pendentes: ${pending}.`);
