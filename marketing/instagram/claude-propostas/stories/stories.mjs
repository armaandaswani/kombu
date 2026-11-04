// Stories variados da Kombú (pedido do dono, 04/11: "não pode ficar repetindo a mesma coisa todo santo dia").
//
//   node stories.mjs biblioteca              lista as cenas com garrafa integrada (biblioteca.json)
//   node stories.mjs planejar <data> [dias]  propõe formatos, sabores e cenas sem repetir (JSON para preencher)
//   node stories.mjs render <dia.json>       desenha as 5 artes 1080×1920 em saida/<data>/
//   node stories.mjs inserir <dia.json>      copia para assets/stories-art/ e acrescenta o dia ao stories-calendar.json
//
// As artes entram no calendário como tipo `art`, com título e texto para a revisão de palavras e o @ do
// parceiro em `partner`, que o Worker marca no Story.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {lintWords} from '../../content-lint.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ig = path.resolve(here, '../..');
const repo = path.resolve(ig, '../..');
const motor = path.join(ig, 'claude-propostas/2026-11-03-direcao-criativa');
const url = p => pathToFileURL(p).href;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const [cmd, arg, extra] = process.argv.slice(2);

// Cor de cada sabor (a mesma dos Stories antigos) e nome oficial.
const COR = {'uva': '#4A2352', 'goiaba': '#D9535F', 'pera-alecrim': '#7E9A3A', 'rosas-cardamomo': '#C9687F', 'manga-jasmim': '#E0A93E', 'frutas-vermelhas': '#7A1A2B', 'lavanda-limao': '#6E63A0', 'maca-canela': '#A86A35', 'flor-fada-blueberry': '#3A2147', 'maracuja': '#D99A1E', 'imunidade': '#CF6526', 'hibisco-anis': '#B8325F'};
const NOME = {'uva': 'Uva', 'goiaba': 'Goiaba', 'pera-alecrim': 'Pêra & Alecrim', 'rosas-cardamomo': 'Rosas & Cardamomo', 'manga-jasmim': 'Manga & Jasmim', 'frutas-vermelhas': 'Frutas Vermelhas', 'lavanda-limao': 'Lavanda & Limão', 'maca-canela': 'Maçã & Canela', 'flor-fada-blueberry': 'Flor Fada Azul & Blueberry', 'maracuja': 'Maracujá', 'imunidade': 'Imunidade', 'hibisco-anis': 'Hibisco & Anis Estrelado'};
const SLUG_SABOR = {'jasmim-manga': 'manga-jasmim', 'flor-fada-azul-blueberry': 'flor-fada-blueberry', 'hibisco-anis-estrelado': 'hibisco-anis'};
// Formatos: os com foto real de cena ficam em FOTO; INTERACAO puxa resposta por mensagem.
const FORMATOS = ['cena', 'revista', 'enquete', 'fato', 'parceiro', 'detalhe', 'lista', 'pergunta', 'feed'];
const FOTO = new Set(['cena', 'revista', 'enquete', 'parceiro', 'detalhe', 'feed']);
const INTERACAO = new Set(['enquete', 'pergunta']);
// Formato dos Stories antigos (Codex), para o rodízio também enxergar o histórico.
const LEGADO = {bottle: 'garrafa', flavor: 'garrafa', botanical: 'garrafa', partner: 'parceiro', text: 'fato', lifestyle: 'cena', creator: 'texto', process: 'lista', art: 'cena'};

async function biblioteca() {
  const pos = path.join(motor, 'render/pos');
  const parceiros = {'06-la-dolce-vita': '@ladolcevitagelataria', '10-casa-agridoce': '@casaagridoceam', '13-cafeteria-garden': '@cafeteriagarden_'};
  const cenas = [];
  for (const f of (await fs.readdir(pos)).filter(f => f.endsWith('.json')).sort()) {
    const post = f.replace('.json', '');
    const {slides} = JSON.parse(await fs.readFile(path.join(pos, f), 'utf8'));
    for (const [i, s] of slides.entries()) {
      const file = path.join(motor, 'saida', post, `${i + 1}-luz.png`);
      // Layout D põe o texto num objeto da cena (cardápio, cartão): sem o texto, o objeto fica em branco.
      // As cenas de criadores (17, 20) têm um celular como protagonista, não a garrafa.
      if (!s.bottles?.length || s.bottles.some(b => b.rotate) || s.layout === 'D' || /^(17|20)-/.test(post)) continue;
      try { await fs.access(file); } catch { continue; }
      const b = s.bottles[0];
      // Foco do recorte vertical: centro da garrafa (o rótulo fica por volta do meio da altura).
      const y = Math.max(10, Math.min(90, (b.base || 80) - (b.h || 600) / 1350 * 50));
      cenas.push({id: `${post}-${i + 1}`, file: path.relative(here, file), sabor: SLUG_SABOR[b.slug] || b.slug, x: b.x || 50, y: +y.toFixed(1), garrafas: s.bottles.length, parceiro: parceiros[post] || null, manaus: post.startsWith('18-')});
    }
  }
  // Cenas feitas só para Stories (9:16, garrafa já integrada): cenas-extra.json, com
  // [{id, file (relativo a esta pasta), sabor, x, y, parceiro?}].
  const extra = JSON.parse(await fs.readFile(path.join(here, 'cenas-extra.json'), 'utf8').catch(() => '[]'));
  for (const c of extra) { try { await fs.access(path.join(here, c.file)); cenas.push({garrafas: 1, parceiro: null, manaus: false, ...c}); } catch { /* arquivo ainda não existe */ } }
  await fs.writeFile(path.join(here, 'biblioteca.json'), JSON.stringify(cenas, null, 1) + '\n');
  console.log(cenas.length + ' cenas na biblioteca.');
}

const calendario = async () => JSON.parse(await fs.readFile(path.join(ig, 'stories-calendar.json'), 'utf8'));
const formatoDe = f => f.formato || LEGADO[f.type] || f.type;

// Gerador pseudoaleatório com semente na data: o mesmo dia sempre gera o mesmo plano.
function sorteio(seed) { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; }
const embaralha = (a, r) => a.map(v => [r(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);

async function planejar(inicio, dias = 1) {
  const cal = await calendario();
  const cenas = JSON.parse(await fs.readFile(path.join(here, 'biblioteca.json'), 'utf8'));
  const historico = cal.days.filter(d => d.date < inicio).slice(-6).map(d => d.frames.map(f => ({formato: formatoDe(f), sabor: f.flavor || f.sabor, sabor2: f.flavor2, cena: f.cena, cena2: f.cena2, parceiro: f.partner})));
  // @ errado usado em Stories antigos; o certo é @ladolcevitagelataria (dono, 03/11).
  // Solar Café Regional: parceiro ativo, mas sem destaque próprio no primeiro mês (vault, Onde encontrar).
  const errados = new Set(['@ladolcevitagelateria', '@solarcaferegional']);
  const parceirosConhecidos = [...new Set(cal.days.flatMap(d => d.frames.map(f => f.partner)).filter(Boolean).concat(cenas.map(c => c.parceiro).filter(Boolean)))].filter(p => !errados.has(p.toLowerCase()));
  const planos = [];
  let data = inicio;
  for (let n = 0; n < Number(dias); n++) {
    const r = sorteio(data);
    const ultimos2 = historico.slice(-2).flat();
    const ontem = historico.at(-1) || [];
    const usoRecente = f => ultimos2.filter(x => x.formato === f).length;
    const precisaParceiro = !ontem.some(x => x.parceiro);
    // 1) formatos: 5 diferentes, nenhum usado 2 vezes nos últimos 2 dias, ao menos 2 de foto e 1 de interação.
    // Parceiro só em dias alternados; 'feed' só quando o dia pede (preenchido à mão com o post).
    const base = FORMATOS.filter(f => f !== 'feed' && f !== 'parceiro');
    const candidatos = [...embaralha(base.filter(f => usoRecente(f) < 2), r), ...base.filter(f => usoRecente(f) >= 2).sort((a, b) => usoRecente(a) - usoRecente(b))];
    const escolha = [];
    if (precisaParceiro) escolha.push('parceiro');
    for (const f of candidatos) if (escolha.length < 5 && !escolha.includes(f)) escolha.push(f);
    if (!escolha.some(f => INTERACAO.has(f))) escolha[escolha.length - 1] = [...INTERACAO].find(f => !escolha.includes(f));
    while (escolha.filter(f => FOTO.has(f)).length < 2) { const i = escolha.findIndex(f => !FOTO.has(f) && f !== 'parceiro'); escolha[i] = embaralha([...FOTO].filter(f => !escolha.includes(f) && f !== 'feed'), r)[0]; }
    // Nenhum formato no mesmo horário de ontem.
    let ordem = embaralha(escolha, r);
    for (let t = 0; t < 20 && ordem.some((f, i) => ontem[i]?.formato === f); t++) ordem = embaralha(escolha, r);
    // 2) cenas e sabores: o sabor é o da garrafa que aparece na cena. Cinco sabores diferentes no dia,
    // nenhum de ontem, e as cenas menos usadas nos últimos 6 dias.
    const saboresOntem = new Set(ontem.flatMap(x => [x.sabor, x.sabor2]));
    const saboresHoje = new Set(), cenasHoje = new Set();
    const uso = id => historico.flat().filter(x => x.cena === id || x.cena2 === id).length;
    const pegaCena = (filtro = () => true) => {
      const livre = c => filtro(c) && !cenasHoje.has(c.id);
      const opcoes = embaralha(cenas.filter(livre), r).sort((a, b) => uso(a.id) - uso(b.id));
      const c = opcoes.find(c => !saboresOntem.has(c.sabor) && !saboresHoje.has(c.sabor)) || opcoes.find(c => !saboresHoje.has(c.sabor)) || opcoes[0];
      cenasHoje.add(c.id); saboresHoje.add(c.sabor);
      return c;
    };
    const frames = ordem.map(formato => {
      const f = {id: `${formato}-${data.slice(5).replace('-', '')}`, formato};
      if (formato === 'parceiro') {
        const ult = p => historico.flat().map(x => x.parceiro).lastIndexOf(p);
        f.partner = [...parceirosConhecidos].sort((a, b) => ult(a) - ult(b))[0];
        const propria = cenas.find(c => c.parceiro === f.partner && !cenasHoje.has(c.id) && uso(c.id) === 0);
        const c = propria ? (cenasHoje.add(propria.id), saboresHoje.add(propria.sabor), propria) : pegaCena(c => !c.parceiro);
        Object.assign(f, {cena: c.id, flavor: c.sabor});
      } else {
        const c = pegaCena(c => !c.parceiro);
        Object.assign(f, {cena: c.id, flavor: c.sabor});
      }
      if (formato === 'enquete') { const c2 = pegaCena(c => !c.parceiro); Object.assign(f, {cena2: c2.id, flavor2: c2.sabor}); }
      Object.assign(f, {title: '', body: ''});
      return f;
    });
    planos.push({date: data, frames});
    historico.push(frames.map(f => ({formato: f.formato, sabor: f.flavor, sabor2: f.flavor2, cena: f.cena, cena2: f.cena2, parceiro: f.partner})));
    data = new Date(Date.parse(data + 'T12:00:00Z') + 864e5).toISOString().slice(0, 10);
  }
  console.log(JSON.stringify(planos.length === 1 ? planos[0] : planos, null, 1));
}
// ------------------------------------------------------------------ desenho
async function fontes() {
  let css = '';
  for (const file of ['Playfair+Display.css', 'Plus+Jakarta+Sans.css'])
    css += (await fs.readFile(path.join(ig, 'fonts', file), 'utf8')).replace(/url\(https:\/\/fonts\.gstatic\.com\/[^)]*\/([^/)]+\.woff2)\)/g, (_, f) => `url(${url(path.join(ig, 'fonts', f))})`);
  return css;
}
const logo = claro => url(path.join(ig, 'assets/brand', claro ? 'kombu-assinatura-colorida-creme.png' : 'kombu-assinatura-colorida-tinta.png'));
const br = s => esc(s).replace(/\n/g, '<br>');

function frameHtml(f, cenas) {
  const cena = id => cenas.find(c => c.id === id);
  const img = (c, extra = '') => c ? `<img class="foto" style="object-position:${c.x}% ${c.y}%;${extra}" src="${url(path.join(here, c.file))}">` : '';
  const cor = COR[f.flavor] || '#2D4B28';
  // Recorte redondo centrado na garrafa, não no meio da cena.
  const circulo = c => `transform:scale(1.5);transform-origin:${c.x}% ${c.y}%`;
  const c = cena(f.cena);
  const texto = (cls = '') => `<div class="texto ${cls}">${f.kicker ? `<p class="kicker">${esc(f.kicker)}</p>` : ''}<h1>${br(f.title)}</h1>${f.body ? `<p>${br(f.body)}</p>` : ''}${f.cta ? `<p class="cta">${esc(f.cta)}</p>` : ''}</div>`;
  switch (f.formato) {
    case 'cena': return {bg: '#000', html: img(c) + `<div class="grad ${f.texto === 'baixo' ? 'baixo' : 'alto'}"></div>` + texto(`claro ${f.texto === 'baixo' ? 'embaixo' : 'emcima'}`) + `<img class="logo bc" src="${logo(true)}">`};
    case 'revista': return {bg: '#FFF7ED', html: `<div class="moldura">${img(c)}</div>` + texto('revista') + `<img class="logo br" src="${logo(false)}">`};
    case 'detalhe': return {bg: '#000', html: img(c, `transform:scale(${f.zoom || 1.45});transform-origin:${c?.x}% ${c?.y}%`) + '<div class="grad baixo"></div>' + texto('claro embaixo') + `<img class="logo tc" src="${logo(true)}">`};
    case 'enquete': {
      // Pergunta numa faixa própria no alto; as duas cenas embaixo, sem texto por cima das garrafas.
      const c2 = cena(f.cena2);
      return {bg: '#FFF7ED', html: texto('faixa') + `<div class="metade cima">${img(c)}<span class="chip">${esc(NOME[f.flavor])}</span></div><div class="metade baixo2">${img(c2)}<span class="chip">${esc(NOME[f.flavor2])}</span></div><div class="ou">ou</div>`};
    }
    case 'parceiro': return {bg: '#000', html: img(c) + '<div class="grad baixo"></div>' + `<div class="cartao"><p class="kicker">${esc(f.kicker || 'Onde encontrar')}</p><h1>${br(f.title)}</h1>${f.body ? `<p>${br(f.body)}</p>` : ''}<p class="handle">${esc(f.partner || '')}</p></div>` + `<img class="logo tc" src="${logo(true)}">`};
    case 'fato': return {bg: '#F3EBDD', html: `<img class="papel" src="${url(path.join(motor, 'cenas/16-bg.png'))}">` + (c ? `<div class="circulo">${img(c, circulo(c))}</div>` : '') + texto('centro') + `<img class="logo bc" src="${logo(false)}">`};
    case 'pergunta': return {bg: cor, html: (c ? `<div class="circulo alto">${img(c, circulo(c))}</div>` : '') + texto('claro centro baixo-meio') + `${(f.opcoes || []).length ? `<div class="opcoes">${f.opcoes.map(o => `<span>${esc(o)}</span>`).join('')}</div>` : ''}` + `<img class="logo bc" src="${logo(true)}">`};
    case 'lista': return {bg: '#1B2F18', html: img(c, 'filter:blur(14px) brightness(.62);transform:scale(1.1)') + `<div class="painel"><h1>${br(f.title)}</h1><ol>${(f.itens || []).map(i => `<li>${esc(i)}</li>`).join('')}</ol>${f.body ? `<p>${br(f.body)}</p>` : ''}</div>` + `<img class="logo bc" src="${logo(true)}">`};
    case 'feed': {
      const arte = url(path.join(ig, '.render/publish', f.post, '1.jpg'));
      return {bg: '#FFF7ED', html: `<img class="foto" style="filter:blur(26px) brightness(.9);transform:scale(1.15)" src="${arte}"><img class="post" src="${arte}">` + texto('claro emcima') + `<img class="logo bc" src="${logo(true)}">`};
    }
  }
  throw Error('formato desconhecido: ' + f.formato);
}

const CSS = `*{box-sizing:border-box;margin:0}html,body{width:1080px;height:1920px;overflow:hidden}
body{position:relative;font-family:'Plus Jakarta Sans',sans-serif;color:#1B2F18}
.foto{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.grad{position:absolute;left:0;right:0;z-index:2}.grad.alto{top:0;height:62%;background:linear-gradient(rgba(0,0,0,.62),rgba(0,0,0,.25) 55%,transparent)}.grad.alto.curta{height:40%}.grad.baixo{bottom:0;height:58%;background:linear-gradient(transparent,rgba(0,0,0,.35) 40%,rgba(0,0,0,.72))}
.texto{position:absolute;left:84px;right:84px;z-index:3}.texto h1{font-family:'Playfair Display',serif;font-weight:700;font-size:78px;line-height:1.08;text-wrap:balance}
.texto p{font-size:36px;line-height:1.45;margin-top:26px;max-width:860px}.texto .kicker{font-size:28px;letter-spacing:.06em;margin:0 0 18px;opacity:.9}.texto .cta{font-weight:700;font-size:32px;margin-top:30px}
.claro{color:#FFF7ED}.emcima{top:260px}.embaixo{bottom:330px}
.centro{top:50%;transform:translateY(-50%);text-align:center}.centro p{margin-left:auto;margin-right:auto}
.baixo-meio{top:auto;bottom:520px;transform:none}
.revista{top:1300px;bottom:auto}.revista h1{font-size:66px}.revista p{font-size:32px;margin-top:18px}
.moldura{position:absolute;left:60px;right:60px;top:200px;height:1060px;overflow:hidden;border-radius:6px}
.logo{position:absolute;width:150px;z-index:5}.logo.bc{bottom:150px;left:50%;transform:translateX(-50%)}.logo.br{bottom:150px;right:84px}.logo.tc{top:110px;left:50%;transform:translateX(-50%)}
.metade{position:absolute;left:0;right:0;height:690px;overflow:hidden}.metade.cima{top:540px}.metade.baixo2{top:1230px}
.faixa{top:200px;color:#1B2F18}.faixa h1{font-size:70px}.faixa .cta{font-size:30px;margin-top:20px}
.chip{position:absolute;right:56px;background:rgba(255,247,237,.94);color:#1B2F18;font-weight:700;font-size:34px;padding:16px 34px;border-radius:999px;white-space:nowrap;z-index:3}
.metade.cima .chip{top:40px}.metade.baixo2 .chip{top:110px}
.ou{position:absolute;top:1230px;left:50%;transform:translate(-50%,-50%);width:150px;height:150px;border-radius:50%;background:#FFF7ED;display:grid;place-items:center;font-family:'Playfair Display',serif;font-size:58px;font-style:italic;z-index:4;box-shadow:0 10px 30px rgba(0,0,0,.25)}
.cartao{position:absolute;left:70px;right:70px;bottom:300px;background:#FFF7ED;border-radius:28px;padding:56px 60px;z-index:4}
.cartao h1{font-family:'Playfair Display',serif;font-size:64px;line-height:1.1}.cartao p{font-size:32px;line-height:1.45;margin-top:18px}.cartao .kicker{font-size:26px;letter-spacing:.06em;margin:0 0 14px;opacity:.75}.cartao .handle{font-weight:700;color:#7E9A3A}
.papel{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.circulo{position:absolute;left:50%;top:250px;transform:translateX(-50%);width:520px;height:520px;border-radius:50%;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.25);z-index:3}
.circulo.alto{top:300px}
.texto.centro{top:auto;bottom:540px;transform:none}
.opcoes{position:absolute;left:84px;right:84px;bottom:330px;display:flex;flex-wrap:wrap;gap:18px;justify-content:center;z-index:3}.opcoes span{background:rgba(255,247,237,.16);border:2px solid rgba(255,247,237,.7);color:#FFF7ED;font-weight:700;font-size:32px;padding:16px 30px;border-radius:999px}
.painel{position:absolute;left:70px;right:70px;top:340px;background:rgba(255,247,237,.95);border-radius:28px;padding:70px 64px;z-index:3}.painel h1{font-family:'Playfair Display',serif;font-size:68px;line-height:1.1}
.painel ol{margin-top:40px;padding-left:0;list-style:none;counter-reset:n}.painel li{counter-increment:n;font-size:38px;line-height:1.4;padding:22px 0 22px 86px;position:relative;border-top:2px solid rgba(27,47,24,.15)}.painel li::before{content:counter(n);position:absolute;left:0;top:16px;width:58px;height:58px;border-radius:50%;background:#1B2F18;color:#FFF7ED;display:grid;place-items:center;font-weight:700;font-size:30px}.painel p{font-size:32px;margin-top:30px;line-height:1.45}
.post{position:absolute;left:150px;top:620px;width:780px;height:975px;object-fit:cover;border-radius:18px;transform:rotate(-2.5deg);box-shadow:0 30px 80px rgba(0,0,0,.35);z-index:3}`;

async function render(diaFile) {
  const dia = JSON.parse(await fs.readFile(diaFile, 'utf8'));
  const cenas = JSON.parse(await fs.readFile(path.join(here, 'biblioteca.json'), 'utf8'));
  // Revisão antes de desenhar: palavras proibidas, 5 formatos diferentes, nada vazio.
  const erros = [];
  if (dia.frames.length !== 5) erros.push('o dia precisa de 5 artes');
  if (new Set(dia.frames.map(f => f.formato)).size !== 5) erros.push('formatos repetidos no mesmo dia');
  for (const f of dia.frames) {
    if (!f.title) erros.push(f.id + ': sem título');
    for (const i of lintWords([f.kicker, f.title, f.body, f.cta, ...(f.itens || []), ...(f.opcoes || [])].filter(Boolean).join('\n'))) erros.push(`${f.id}: ${i.why} (“${i.match}”)`);
    if (/responda (este|esse) story/i.test([f.title, f.body, f.cta].join(' '))) erros.push(f.id + ': "Responda este Story" não (o dono acha robótico)');
  }
  if (erros.length) { console.error('Stories recusados:\n - ' + erros.join('\n - ')); process.exit(1); }
  const {chromium} = await import(pathToFileURL(path.join(repo, 'scripts/browser/node_modules/playwright/index.mjs')));
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  const page = await browser.newPage({viewport: {width: 1080, height: 1920}});
  const fonts = await fontes();
  const out = path.join(here, 'saida', dia.date);
  await fs.mkdir(out, {recursive: true});
  for (const f of dia.frames) {
    const {bg, html} = frameHtml(f, cenas);
    // Página gravada em arquivo: só assim o Chrome carrega as fotos e fontes locais (file://).
    const htmlFile = path.join(out, f.id + '.html');
    await fs.writeFile(htmlFile, `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}${CSS}body{background:${bg}}</style></head><body>${html}</body></html>`);
    await page.goto(url(htmlFile), {waitUntil: 'load'});
    await fs.rm(htmlFile);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({path: path.join(out, f.id + '.jpg'), type: 'jpeg', quality: 90});
    console.log('ok', dia.date, f.id);
  }
  await browser.close();
}

async function inserir(diaFile) {
  const dia = JSON.parse(await fs.readFile(diaFile, 'utf8'));
  const calFile = path.join(ig, 'stories-calendar.json');
  const cal = JSON.parse(await fs.readFile(calFile, 'utf8'));
  // Um dia que já existe só é trocado com --substituir e se ainda não começou em Manaus (nada publicado).
  const hojeManaus = new Date(Date.now() - 4 * 3600e3).toISOString().slice(0, 10);
  if (cal.days.some(d => d.date === dia.date)) {
    if (!process.argv.includes('--substituir') || dia.date <= hojeManaus) { console.error(`${dia.date} já existe no calendário. Nada foi alterado (só um dia futuro pode ser trocado, com --substituir).`); process.exit(1); }
    cal.days = cal.days.filter(d => d.date !== dia.date);
  }
  const destino = path.join(ig, 'assets/stories-art');
  await fs.mkdir(destino, {recursive: true});
  const frames = [];
  for (const f of dia.frames) {
    const nome = `${dia.date}-${f.id}.jpg`;
    await fs.copyFile(path.join(here, 'saida', dia.date, f.id + '.jpg'), path.join(destino, nome));
    frames.push({id: f.id, type: 'art', formato: f.formato, title: [f.kicker, f.title].filter(Boolean).join(' '), body: [f.body, ...(f.itens || []), ...(f.opcoes || [])].filter(Boolean).join(' '), cta: f.cta, flavor: f.flavor, ...(f.flavor2 ? {flavor2: f.flavor2, cena2: f.cena2} : {}), ...(f.partner ? {partner: f.partner} : {}), cena: f.cena, imageSource: `assets/stories-art/${nome}`, image: `stories/${dia.date}/${f.id}.jpg`, source: 'claude-propostas/stories'});
  }
  cal.days.push({date: dia.date, frames});
  cal.days.sort((a, b) => a.date.localeCompare(b.date));
  await fs.writeFile(calFile, JSON.stringify(cal, null, 2) + '\n');
  console.log(`${dia.date}: 5 Stories no calendário. Agora: node render-stories.mjs --date=${dia.date}, prepare-publish e deploy do Pages.`);
}

if (cmd === 'biblioteca') await biblioteca();
else if (cmd === 'planejar') await planejar(arg, extra || 1);
else if (cmd === 'render') await render(path.resolve(arg));
else if (cmd === 'inserir') await inserir(path.resolve(arg));
else console.log('Comandos: biblioteca | planejar <data> [dias] | render <dia.json> | inserir <dia.json>');
