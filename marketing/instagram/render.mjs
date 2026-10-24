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
  return {bg: f.bg, ...MODES[f.mode]};
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

const css = `
*{box-sizing:border-box}
html,body{margin:0;width:1080px;height:1350px;overflow:hidden}
body{background:var(--bg);color:var(--fg);font-family:'Plus Jakarta Sans',sans-serif;position:relative;-webkit-font-smoothing:antialiased}
.glow{position:absolute;width:1100px;height:1100px;border-radius:50%;right:-420px;top:150px;background:radial-gradient(circle,rgba(255,255,255,.20),transparent 62%)}
.top,.foot{position:absolute;left:84px;right:84px;display:flex;justify-content:space-between;align-items:center;z-index:3}
.top{top:70px}.foot{bottom:66px}
.mark{font-family:'Playfair Display',serif;font-weight:700;font-size:34px;letter-spacing:.2em}
.slogan{font-family:'Playfair Display',serif;font-style:italic;font-weight:600;font-size:26px;color:var(--muted)}
.handle{font-weight:600;font-size:24px;color:var(--muted);letter-spacing:.02em}
.dots{display:flex;gap:10px;align-items:center}.dots i{width:12px;height:12px;border-radius:50%;background:var(--muted);opacity:.45}
.dots i.on{opacity:1;background:var(--accent);width:36px;border-radius:7px}
.copy{position:absolute;left:84px;top:200px;bottom:170px;width:912px;display:flex;flex-direction:column;justify-content:center;z-index:2}
.copy.narrow{width:540px}
.kicker{font-weight:700;font-size:25px;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);display:flex;align-items:center;gap:18px;margin-bottom:34px}
.kicker::before{content:"";width:46px;height:2px;background:var(--rule)}
h1{font-family:'Playfair Display',serif;font-weight:700;font-size:112px;line-height:1.02;letter-spacing:-.01em;margin:0;text-wrap:balance}
h2{font-family:'Playfair Display',serif;font-weight:700;font-size:90px;line-height:1.04;margin:0;text-wrap:balance}
.narrow h1,.narrow h2{font-size:84px}
.accent{display:block;font-family:'Playfair Display',serif;font-style:italic;font-weight:600;font-size:74px;line-height:1.08;color:var(--accent);margin-top:20px}
.narrow .accent{font-size:58px}
p{font-size:43px;line-height:1.36;color:var(--muted);margin:34px 0 0;white-space:pre-line;max-width:860px}
.narrow p{font-size:38px}
.orn{display:flex;align-items:center;gap:14px;margin:40px 0 0}
.orn i{display:block;height:2px;width:70px;background:var(--rule)}.orn b{width:9px;height:9px;border-radius:50%;background:var(--accent)}
.bottle{position:absolute;z-index:1;bottom:110px;right:40px;height:1090px;filter:drop-shadow(0 34px 40px rgba(0,0,0,.28))}
.lineup{position:absolute;left:0;right:0;bottom:150px;display:flex;justify-content:center;align-items:flex-end;gap:0}
.lineup img{height:650px;margin:0 -26px;filter:drop-shadow(0 26px 30px rgba(0,0,0,.22))}
.lineup img:nth-child(3){height:730px;z-index:2}
.lineup img:nth-child(2),.lineup img:nth-child(4){height:690px;z-index:1}
.addr{margin-top:40px;padding-left:26px;border-left:3px solid var(--accent);font-weight:600;font-size:36px;line-height:1.4;white-space:pre-line}
.num{font-family:'Playfair Display',serif;font-weight:700;font-size:250px;line-height:.8;color:var(--accent);opacity:.9;margin-bottom:30px}
.badge{display:inline-grid;place-items:center;width:84px;height:84px;border-radius:50%;border:2px solid var(--accent);color:var(--accent);font-family:'Playfair Display',serif;font-weight:700;font-size:44px;margin-bottom:34px}
ul{list-style:none;margin:44px 0 0;padding:0;display:grid;gap:30px}
li{font-size:42px;line-height:1.3;display:flex;gap:26px;align-items:baseline}
li::before{content:"";flex:none;width:14px;height:14px;transform:rotate(45deg) translateY(-6px);background:var(--accent)}
.cta{align-items:center;text-align:center}
.cta h2{font-size:96px}.cta p{margin-left:auto;margin-right:auto}
.cta .orn{justify-content:center;margin:0 0 46px}
`;

function slideHtml(slide, i, total, fonts) {
  const t = theme(slide);
  const vars = `--bg:${t.bg};--fg:${t.fg};--accent:${t.accent};--muted:${t.muted};--rule:${t.rule}`;
  const kicker = slide.kicker ? `<div class="kicker">${esc(slide.kicker)}</div>` : '';
  const body = slide.body ? `<p>${esc(slide.body)}</p>` : '';
  const bottleSlug = slide.bottle || (['bottle', 'cover'].includes(slide.type) && slide.flavor ? slide.flavor : null);
  const showBottle = bottleSlug && slide.type !== 'lineup';
  const narrow = showBottle ? ' narrow' : '';
  let inner = '';
  switch (slide.type) {
    case 'cover':
      inner = `<div class="copy${narrow}">${kicker}<h1>${esc(slide.title)}${slide.accent ? `<span class="accent">${esc(slide.accent)}</span>` : ''}</h1></div>`; break;
    case 'bottle':
      inner = `<div class="copy narrow">${kicker}<h1>${esc(slide.title)}</h1>${body}<div class="orn"><i></i><b></b><i></i></div></div>`; break;
    case 'text':
      inner = `<div class="copy${narrow}"><h2>${esc(slide.title)}</h2>${body}</div>`; break;
    case 'lineup':
      inner = `<div class="copy" style="justify-content:flex-start;top:210px"><h2>${esc(slide.title)}</h2>${body}</div>
        <div class="lineup">${slide.bottles.map(b => `<img src="${bottleUrl(b)}">`).join('')}</div>`; break;
    case 'partner':
      inner = `<div class="copy${narrow}">${kicker}<h1>${esc(slide.title)}</h1>${body}${slide.address ? `<div class="addr">${esc(slide.address)}</div>` : ''}</div>`; break;
    case 'step':
      inner = `<div class="copy"><div class="num">${esc(slide.n)}</div><h2>${esc(slide.title)}</h2>${body}</div>`; break;
    case 'option':
      inner = `<div class="copy${narrow}"><div class="badge">${esc(slide.n)}</div><h2>${esc(slide.title)}</h2>${body}</div>`; break;
    case 'list':
      inner = `<div class="copy"><h2>${esc(slide.title)}</h2><ul>${slide.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`; break;
    case 'cta':
      inner = `<div class="copy cta"><div class="orn"><i></i><b></b><i></i></div><h2>${esc(slide.title)}</h2>${body}</div>`; break;
    default: throw new Error(`tipo de slide desconhecido: ${slide.type}`);
  }
  const dots = total > 1 ? Array.from({length: total}, (_, n) => `<i class="${n === i ? 'on' : ''}"></i>`).join('') : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}${css}</style></head>
<body style="${vars}">${showBottle ? '<div class="glow"></div>' : ''}
<div class="top"><span class="mark">KOMBÚ</span><span class="slogan">A Arte do Natural</span></div>
${inner}${showBottle ? `<img class="bottle" src="${bottleUrl(bottleSlug)}">` : ''}
<div class="foot"><span class="handle">@kombu.amazonia</span><span class="dots">${dots}</span></div></body></html>`;
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
