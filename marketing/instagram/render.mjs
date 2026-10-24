// Renders every post in calendar.json to 1080x1350 JPEGs (the Instagram API only accepts JPEG).
// Output: out/<post-id>/<n>.jpg. Those are published to Cloudflare Pages (kombu-social) so the API
// can fetch them by URL. Same engine as the Reveja publisher: one headless Chrome over DevTools.
//
//   node render.mjs            render everything
//   node render.mjs 02-maracuja  render one post
//
// The calendar is checked before anything is drawn. A caption that promises a health effect, names
// a price, says "sem açúcar" or breaks the colour rhythm of the grid stops the render instead of
// reaching the feed.
import {fileURLToPath, pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const calendar = JSON.parse(await fs.readFile(path.join(root, 'calendar.json'), 'utf8'));
const only = process.argv[2];

// ---------------------------------------------------------------- rules
const FORBIDDEN = [
  [/\b(cura|curar|previne|prevenir|trata|tratar)\b/i, 'promessa de tratamento'],
  [/\b(detox|desintox\w*|emagre\w*|fortalec\w*|metabolismo)\b/i, 'alegação de saúde'],
  [/\b(probi[oó]tic\w*|intestin\w*)\b/i, 'alegação de saúde (probiótico/intestino)'],
  [/\b(sem|zero)\s+a[çc][úu]car\b/i, '"sem açúcar" não é verdade: a fermentação consome a maior parte, não todo'],
  [/R\$\s*\d|\bpre[çc]o\b/i, 'preço não aparece no Instagram'],
  [/\bmirtilo\b/i, 'o nome oficial é Blueberry'],
  [/\bjasmim\s*&\s*manga\b/i, 'o nome oficial é Manga & Jasmim'],
  [/goiába/i, 'o nome oficial é Goiaba, sem acento'],
];
function lint() {
  const problems = [];
  let previous = null;
  for (const post of calendar.posts) {
    const text = [post.caption, ...post.slides.flatMap(s => [s.kicker, s.title, s.accent, s.body, ...(s.items || [])])].filter(Boolean).join('\n');
    for (const [re, why] of FORBIDDEN) if (re.test(text)) problems.push(`${post.id}: ${why} (“${text.match(re)[0]}”)`);
    const tags = post.caption.match(/#[\p{L}\d_]+/gu) || [];
    if (tags.length > 5) problems.push(`${post.id}: ${tags.length} hashtags, o máximo é 5`);
    if (!tags.some(t => t.toLowerCase() === '#manaus')) problems.push(`${post.id}: falta #manaus`);
    if (post.family && post.family === previous) problems.push(`${post.id}: mesma família de cor do post anterior (${post.family})`);
    previous = post.family;
    if (post.slides.length > 10) problems.push(`${post.id}: o Instagram aceita no máximo 10 imagens`);
  }
  // Variety inside a carousel too (owner, 24/10): the same background twice in a row reads as one
  // long slide. Flavour slides take the flavour's colour, so two flavours in a row are fine.
  // Posts already on Instagram (publishedAt) are history, not something to fix.
  for (const post of calendar.posts.filter(p => !p.publishedAt)) post.slides.forEach((sl, i) => {
    const bg = x => x.bg || x.flavor;
    if (i && bg(sl) === bg(post.slides[i - 1])) problems.push(`${post.id}: slides ${i} e ${i + 1} com o mesmo fundo (${bg(sl)})`);
  });
  // The owner wants a mix of formats (24/10): a single image and a carousel read differently in the
  // feed, and a long run of either makes the grid monotonous.
  const formats = calendar.posts.map(p => p.slides.length > 1 ? 'carrossel' : 'imagem');
  formats.forEach((f, i) => { if (i >= 3 && formats.slice(i - 3, i + 1).every(x => x === f)) problems.push(`${calendar.posts[i].id}: quatro posts seguidos em ${f}`); });
  // A partner named on the slides must be @mentioned in the caption, which is where the publisher
  // takes the handles it tags from.
  for (const post of calendar.posts) for (const s of post.slides) if (s.type === 'partner' && !/@\w/.test(post.caption)) problems.push(`${post.id}: parceiro sem @ na legenda (não seria marcado)`);
  const ids = calendar.posts.map(p => p.id);
  if (new Set(ids).size !== ids.length) problems.push('ids repetidos no calendário');
  return problems;
}
const problems = lint();
if (problems.length) {
  console.error('O calendário não passou na revisão:\n - ' + problems.join('\n - '));
  process.exit(1);
}

// ---------------------------------------------------------------- palette
// Label colours, tuned for full-bleed backgrounds. "light" means cream type on a deep ground.
const FLAVORS = {
  'uva':                 {bg: '#4A2352', mode: 'light'},
  'goiaba':              {bg: '#D9535F', mode: 'light'},
  'maracuja':            {bg: '#EDB43E', mode: 'dark'},
  'rosas-cardamomo':     {bg: '#E3889E', mode: 'dark'},
  'pera-alecrim':        {bg: '#C2D371', mode: 'dark'},
  'hibisco-anis':        {bg: '#D63E79', mode: 'light'},
  'lavanda-limao':       {bg: '#8277AE', mode: 'light'},
  'frutas-vermelhas':    {bg: '#7A1A2B', mode: 'light'},
  'imunidade':           {bg: '#CF6526', mode: 'light'},
  'flor-fada-blueberry': {bg: '#3A2147', mode: 'light'},
  'manga-jasmim':        {bg: '#F2C46E', mode: 'dark'},
  'maca-canela':         {bg: '#A9351F', mode: 'light'},
};
const MODES = {
  light: {fg: '#FFF7ED', accent: '#F4D58D', muted: 'rgba(255,247,237,.74)', rule: 'rgba(244,213,141,.75)'},
  dark:  {fg: '#1C2418', accent: '#2D4B28', muted: 'rgba(28,36,24,.72)',    rule: 'rgba(45,75,40,.6)'},
};
function theme(slide) {
  if (slide.bg === 'brand') return {bg: '#2D4B28', fg: '#FFF7ED', accent: '#D9F99D', muted: 'rgba(255,247,237,.74)', rule: 'rgba(217,249,157,.7)'};
  if (slide.bg === 'cream') return {bg: '#F6F2E8', fg: '#1E2A1B', accent: '#2D4B28', muted: '#5F675A', rule: 'rgba(45,75,40,.45)'};
  const f = FLAVORS[slide.flavor];
  if (!f) throw new Error(`sabor desconhecido: ${slide.flavor}`);
  return {bg: f.bg, mode: f.mode, ...MODES[f.mode]};
}

// ---------------------------------------------------------------- fonts
async function fontCss() {
  let css = '';
  for (const file of ['Playfair+Display.css', 'Plus+Jakarta+Sans.css']) {
    css += (await fs.readFile(path.join(root, 'fonts', file), 'utf8'))
      .replace(/url\(https:\/\/fonts\.gstatic\.com\/[^)]*\/([^/)]+\.woff2)\)/g, (_, f) => `url(${pathToFileURL(path.join(root, 'fonts', f)).href})`);
  }
  return css;
}
const bottleUrl = slug => pathToFileURL(path.join(root, 'assets/bottles', `${slug}.webp`)).href;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

// Every slide is one centred composition (owner, 24/10: the first template read as robotic and
// lopsided). Wordmark at the top, handle and progress at the bottom, and in between the bottle
// when there is one, then the words. No tracked capitals, no italic accent words.
const css = `
*{box-sizing:border-box}
html,body{margin:0;width:1080px;height:1350px;overflow:hidden}
body{position:relative;background:var(--bg);color:var(--fg);font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased}
.glow{position:absolute;left:50%;top:44%;width:900px;height:900px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,var(--glow) 0%,transparent 62%);opacity:.55;z-index:0}
.top{position:absolute;top:64px;left:0;right:0;text-align:center;z-index:3}
.mark{font-family:'Playfair Display',serif;font-weight:700;font-size:38px;letter-spacing:.24em;padding-left:.24em}
.foot{position:absolute;bottom:58px;left:0;right:0;display:grid;justify-items:center;gap:20px;z-index:3}
.handle{font-weight:600;font-size:26px;color:var(--muted)}
.dots{display:flex;gap:10px;align-items:center;height:12px}.dots i{width:11px;height:11px;border-radius:50%;background:var(--muted);opacity:.4}
.dots i.on{opacity:1;background:var(--accent);width:34px;border-radius:6px}
.stage{position:absolute;top:150px;bottom:170px;left:90px;right:90px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;z-index:2}
.bottle{display:block;height:var(--bh,640px);width:auto;margin-bottom:46px;filter:drop-shadow(0 34px 40px rgba(0,0,0,.28))}
.lineup{display:flex;justify-content:center;align-items:flex-end;margin-bottom:46px}
.lineup img{height:500px;margin:0 -24px;filter:drop-shadow(0 26px 30px rgba(0,0,0,.22))}
.lineup img:nth-child(3){height:580px;z-index:2}.lineup img:nth-child(2),.lineup img:nth-child(4){height:540px;z-index:1}
.label{font-weight:600;font-size:32px;color:var(--accent);margin:0 0 22px}
h1{font-family:'Playfair Display',serif;font-weight:700;font-size:118px;line-height:1.04;letter-spacing:-.01em;margin:0;text-wrap:balance}
h2{font-family:'Playfair Display',serif;font-weight:700;font-size:96px;line-height:1.08;margin:0;text-wrap:balance}
.with-bottle h1{font-size:76px}.with-bottle h2{font-size:64px}
p{font-size:44px;line-height:1.38;color:var(--muted);margin:30px 0 0;max-width:840px;text-wrap:pretty;white-space:pre-line}
.with-bottle p{font-size:34px;margin-top:20px;max-width:800px}
.num{font-family:'Playfair Display',serif;font-weight:700;font-size:200px;line-height:1;color:var(--accent);margin-bottom:24px}
.with-bottle .num{font-size:120px;margin-bottom:6px}
.items{list-style:none;margin:40px 0 0;padding:0;display:grid;gap:0;justify-items:center}
.items li{font-family:'Playfair Display',serif;font-weight:600;font-size:60px;line-height:1.15;padding:18px 0}
.items li+li{border-top:2px solid var(--rule);min-width:320px}
.addr{margin-top:26px;font-weight:600;font-size:32px;line-height:1.4;white-space:pre-line}
`;

function slideHtml(slide, i, total, fonts) {
  const t = theme(slide);
  const vars = `--bg:${t.bg};--fg:${t.fg};--accent:${t.accent};--muted:${t.muted};--rule:${t.rule};--glow:${t.mode === 'dark' ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.22)'}`;
  const bottleSlug = slide.bottle || (['bottle', 'cover', 'partner'].includes(slide.type) && slide.flavor ? slide.flavor : null);
  const label = slide.kicker ? `<div class="label">${esc(slide.kicker)}</div>` : '';
  const body = slide.body ? `<p>${esc(slide.body)}</p>` : '';
  const H = slide.type === 'cover' || slide.type === 'bottle' || slide.type === 'partner' ? 'h1' : 'h2';
  const title = slide.title ? `<${H}>${esc(slide.title)}</${H}>` : '';
  const sub = slide.accent ? `<p>${esc(slide.accent)}</p>` : '';
  let visual = '';
  if (slide.type === 'lineup') visual = `<div class="lineup">${slide.bottles.map(b => `<img src="${bottleUrl(b)}">`).join('')}</div>`;
  else if (bottleSlug) visual = `<img class="bottle" style="--bh:${slide.n ? 430 : slide.items || slide.body && slide.body.length > 70 || slide.address ? 520 : 640}px" src="${bottleUrl(bottleSlug)}">`;
  let words;
  switch (slide.type) {
    case 'step': case 'option':
      words = `<div class="num">${esc(slide.n)}</div>${title}${body}`; break;
    case 'list':
      words = `${title}<ul class="items">${slide.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`; break;
    case 'partner':
      words = `${label}${title}${body}${slide.address ? `<div class="addr">${esc(slide.address)}</div>` : ''}`; break;
    case 'cover': case 'bottle': case 'text': case 'cta': case 'lineup':
      words = `${label}${title}${sub}${body}`; break;
    default: throw new Error(`tipo de slide desconhecido: ${slide.type}`);
  }
  const dots = total > 1 ? Array.from({length: total}, (_, n) => `<i class="${n === i ? 'on' : ''}"></i>`).join('') : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}${css}</style></head>
<body style="${vars}">${visual ? '<div class="glow"></div>' : ''}
<div class="top"><span class="mark">KOMBÚ</span></div>
<div class="stage${visual ? ' with-bottle' : ''}">${visual}${words}</div>
<div class="foot">${dots ? `<span class="dots">${dots}</span>` : ''}<span class="handle">@kombu.amazonia</span></div></body></html>`;
}

// ---------------------------------------------------------------- render
const fonts = await fontCss();
const tmp = path.join(root, '.render');
await fs.mkdir(tmp, {recursive: true});
const port = 9344;
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--user-data-dir=' + path.join(tmp, 'profile'), 'about:blank'], {stdio: 'ignore'});
let target;
for (let i = 0; i < 60 && !target; i++) {
  await new Promise(r => setTimeout(r, 200));
  target = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json()).then(l => l.find(t => t.type === 'page')).catch(() => null);
}
if (!target) { proc.kill(); throw new Error('Chrome não abriu'); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, {once: true}));
let seq = 0;
const pending = new Map();
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++seq; pending.set(id, m => m.error ? reject(new Error(method + ': ' + m.error.message)) : resolve(m.result)); ws.send(JSON.stringify({id, method, params})); });
await send('Emulation.setDeviceMetricsOverride', {width: 1080, height: 1350, deviceScaleFactor: 1, mobile: false});
try {
  for (const post of calendar.posts) {
    if (only && post.id !== only) continue;
    const dir = path.join(root, 'out', post.id);
    await fs.rm(dir, {recursive: true, force: true});
    await fs.mkdir(dir, {recursive: true});
    for (const [i, slide] of post.slides.entries()) {
      const html = path.join(tmp, `${post.id}-${i + 1}.html`);
      await fs.writeFile(html, slideHtml(slide, i, post.slides.length, fonts));
      await send('Page.navigate', {url: pathToFileURL(html).href});
      await send('Runtime.evaluate', {expression: 'new Promise(r => (document.readyState === "complete" ? r() : addEventListener("load", r))).then(() => document.fonts.ready).then(() => Promise.all([...document.images].map(i => i.decode().catch(() => null))))', awaitPromise: true});
      const {data} = await send('Page.captureScreenshot', {format: 'jpeg', quality: 90});
      await fs.writeFile(path.join(dir, `${i + 1}.jpg`), Buffer.from(data, 'base64'));
    }
    await fs.writeFile(path.join(dir, 'legenda.txt'), post.caption + '\n');
    console.log('ok', post.id, `${post.slides.length} imagens`);
  }
} finally {
  ws.close();
  // Chrome keeps writing to its profile until it has really exited; removing the folder first races it.
  const exited = new Promise(r => proc.once('exit', r));
  proc.kill();
  await Promise.race([exited, new Promise(r => setTimeout(r, 5000))]);
  await fs.rm(tmp, {recursive: true, force: true, maxRetries: 5, retryDelay: 200});
}
