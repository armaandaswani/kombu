import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const here=path.dirname(fileURLToPath(import.meta.url)), ig=path.resolve(here,'../..');
const {chromium}=await import(pathToFileURL(path.resolve(ig,'../../scripts/browser/node_modules/playwright/index.mjs')));
const sharp=createRequire(path.join(ig,'video-studio/package.json'))('sharp');
const url=p=>pathToFileURL(path.join(ig,p)).href;
const logo=(tone='tinta')=>`<img class="logo" src="${url('assets/brand/kombu-assinatura-colorida-'+tone+'.png')}">`;
const bottle=(id)=>`<img class="bottle" src="${url('assets/bottles/'+id+'.webp')}">`;
const scene=(p)=>`<img class="scene" src="${pathToFileURL(path.join(here,'scene-'+p+'.png')).href}">`;
const foot=(text='@kombukombucha.am')=>`<footer>${text}</footer>`;
let fonts='';
for(const file of ['Playfair+Display.css','Plus+Jakarta+Sans.css'])fonts+=(await fs.readFile(path.join(ig,'fonts',file),'utf8')).replace(/url\(https:\/\/fonts\.gstatic\.com\/[^)]*\/([^/)]+\.woff2)\)/g,(_,f)=>`url(${url('fonts/'+f)})`);
const base=`
*{box-sizing:border-box}body{width:1080px;height:1350px;margin:0;position:relative;overflow:hidden;background:#fff7ed;color:#1b2f18;font:500 28px 'Plus Jakarta Sans';-webkit-font-smoothing:antialiased}h1,h2,p{margin:0}h1,h2{font:700 84px/1.02 'Playfair Display';letter-spacing:-2.7px}p{line-height:1.35}.logo{position:absolute;top:62px;left:72px;width:154px;height:100px;object-fit:contain}footer{position:absolute;bottom:56px;left:72px;right:72px;border-top:1px solid currentColor;padding-top:20px;font-size:21px}.eyebrow{font-weight:700;font-size:21px;letter-spacing:4px;text-transform:uppercase}.bottle{position:absolute;object-fit:contain}.scene{position:absolute;width:100%;height:100%;object-fit:cover}.contact{position:absolute;border-radius:50%;background:#2c231d66;filter:blur(15px)}
`;
const slides=[
['27-manga-jasmim-manauara',1,`
<div class="field"></div>${logo()}<div class="contact"></div>${bottle('manga-jasmim')}
<div class="copy"><div class="eyebrow">Manaus · Desde 2017</div><h1>Kombucha<br>artesanal premium</h1><p>Manga &amp; Jasmim</p></div>
${foot('A Arte do Natural　 ·　 @kombukombucha.am')}`,`
.field{position:absolute;width:1070px;height:1030px;left:232px;top:182px;background:radial-gradient(ellipse at 75% 40%,#304a27,#1b2f18 70%);border-radius:58% 0 0 48%;transform:rotate(-9deg)}.copy{position:absolute;left:445px;right:55px;top:448px;color:#fff7ed}.copy .eyebrow{color:#d9f99d}.copy h1{font-size:64px;margin:25px 0 35px}.copy p{color:#d9f99d;font-size:37px;font-weight:650}.bottle{left:68px;top:262px;width:329px;height:876px;filter:drop-shadow(14px 18px 22px #101e1760)}.contact{left:99px;top:1115px;width:275px;height:35px}`],
['27-manga-jasmim-manauara',2,`
${logo()}<div class="eyebrow tag">O sabor da Kombú</div><h2>Manga madura,<br>perfume de jasmim.</h2>
<div class="notes"><p><span>NO GOLE</span>Suave ao beber,<br>com sabor intenso.</p><p><span>NO COPO</span>O gás vem da própria<br>fermentação.</p></div>
<div class="contact"></div>${bottle('manga-jasmim')}${foot()}`,`
body{background:#d9f99d}.tag{position:absolute;left:72px;top:247px}h2{position:absolute;left:72px;top:302px;font-size:73px}.notes{position:absolute;left:72px;top:610px;width:420px}.notes p{border-top:1px solid #1b2f18;padding:24px 0 28px;font-size:35px}.notes span{display:block;font-size:19px;letter-spacing:3px;margin-bottom:10px;font-weight:700}.bottle{left:565px;top:483px;width:342px;height:712px;filter:drop-shadow(8px 18px 16px #1b2f183d)}.contact{left:616px;top:1171px;width:247px;height:30px}`],
['28-uva-bem-gelada',1,`
<div class="ring"></div><div class="ring inner"></div>${logo('creme')}<div class="eyebrow tag">Kombucha de Manaus</div>
<div class="type"><h1>Uva</h1><p>Bem gelada.</p></div><div class="contact"></div>${bottle('uva')}${foot()}`,`
body{background:radial-gradient(ellipse at 65% 60%,#633268,#371a44 76%);color:#fff7ed}.tag{position:absolute;right:72px;top:103px;color:#f1d8ee}.ring{position:absolute;width:940px;height:940px;border-radius:50%;border:1px solid #dfacdf68;left:308px;top:259px}.inner{width:840px;height:840px;left:358px;top:309px}.type{position:absolute;left:66px;top:465px}.type h1{font-size:215px;letter-spacing:-12px}.type p{font-size:41px;margin-left:16px;color:#f1d8ee}.bottle{top:257px;left:540px;width:315px;height:900px;filter:drop-shadow(23px 28px 22px #1c0b28a0)}.contact{left:540px;top:1123px;width:319px;height:45px;background:#20102ac0}`],
['29-ritual-do-maracuja',1,`
<div class="photo">${scene(2)}</div>${logo()}<div class="eyebrow tag">À mesa</div>
<h1>Maracujá<br>no almoço?</h1><p class="blurb">Vai bem gelada com um sanduíche.</p>${foot()}`,`
.photo{position:absolute;left:382px;right:60px;top:208px;bottom:190px;overflow:hidden;border-radius:240px 240px 3px 3px}.photo .scene{object-position:0% center}.tag{position:absolute;top:326px;left:72px}.blurb{position:absolute;left:73px;top:731px;width:260px;font-size:27px}h1{position:absolute;left:67px;top:443px;width:310px;font-size:52px}`],
['29-ritual-do-maracuja',2,`
<div class="halo"></div>${logo('creme')}<div class="contact"></div>${bottle('maracuja')}
<div class="text"><div class="eyebrow">Kombú de Maracujá</div><h2>Feita com fruta<br>de verdade.</h2><p>O gás vem da própria fermentação.</p></div>${foot()}`,`
body{background:#1b2f18;color:#fff7ed}.halo{position:absolute;left:546px;top:250px;width:450px;height:880px;border-radius:48%;background:radial-gradient(ellipse at 52% 45%,#617638,#304726 57%,#1b2f18 73%)}.bottle{left:625px;top:275px;width:299px;height:836px;filter:drop-shadow(13px 16px 19px #101e17)}.contact{left:647px;top:1083px;width:252px;height:36px;background:#0b170c}.text{position:absolute;left:72px;top:486px;width:502px}.text .eyebrow{color:#d9f99d;margin-bottom:24px}.text h2{font-size:74px}.text p{margin-top:33px;width:370px;font-size:31px}`],
];
const temp=path.join(here,'layout.html');
const out=path.join(ig,'.render','editorial-2026-11-11');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
 const tiles=[];
 for(const [id,i,html,css] of slides){
  await fs.writeFile(temp,`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>${fonts}${base}${css}</style><body>${html}</body></html>`);
  await page.goto(pathToFileURL(temp).href);await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(x=>x.decode()));});
  const bounds=await page.locator('h1,h2,p,footer,.eyebrow').evaluateAll(nodes=>nodes.filter(n=>{const b=n.getBoundingClientRect();return b.left<30||b.top<30||b.right>1050||b.bottom>1320}).map(n=>n.innerText));
  if(bounds.length)throw Error('Texto fora da margem: '+bounds.join('; '));
  const name=`feed-${id}-${i}`;
  const png=await page.screenshot({path:path.join(out,name+'.png')});
  await sharp(png).jpeg({quality:95,chromaSubsampling:'4:4:4'}).toFile(path.join(out,name+'.jpg'));
  tiles.push(await sharp(png).resize(270,338).png().toBuffer());
 }
 await sharp({create:{width:1440,height:370,channels:3,background:'#eee8df'}}).composite(tiles.map((input,i)=>({input,left:16+286*i,top:16}))).png().toFile(path.join(out,'previa.png'));
}finally{await browser.close();await fs.rm(temp,{force:true});}
