// Creates five portrait Stories per dated batch. Originals are never overwritten.
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {validateDay,localDate} from './worker/stories.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const plan=JSON.parse(await fs.readFile(path.join(root,'stories-calendar.json'),'utf8'));
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=p=>pathToFileURL(path.join(root,p)).href;
for(const day of plan.days){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(day.date))throw Error('Data inválida');
 validateDay(plan,day.date);
 for(const f of day.frames){
  const text=[f.title,f.body,f.cta].join(' ');
  if(/ch[aá]\s+verde|green\s+tea|\bvitalidade\b|\bfam[ií]lia(?:s)?\b|\bfamiliar(?:es)?\b|\b(detox|emagrec\w*|probiótic\w*|intestin\w*|cura|previne)\b|sem açúcar|R\$|—|!/i.test(text))throw Error('Texto fora da voz: '+f.id);
  if(f.imageSource)await fs.access(path.join(root,f.imageSource));
  if(f.flavor)await fs.access(path.join(root,'assets/bottles',f.flavor+'.webp'));
 }
}
console.log('Stories: calendário revisado, '+plan.days.length+' dias com cinco artes.');
if(process.argv.includes('--check'))process.exit(0);
const requestedDate=process.argv.find(a=>a.startsWith('--date='))?.slice(7)||localDate();
const preview=process.argv.includes('--preview');
const outputRoot=preview?'.render/stories-preview':'out';
if(!preview&&requestedDate<localDate())throw Error('Não renderizar datas passadas: preserve as artes publicadas');
const renderDays=plan.days.filter(d=>d.date===requestedDate);
if(!renderDays.length)throw Error('Sem Stories para '+requestedDate);
const onlyIds=process.argv.find(a=>a.startsWith('--only='))?.slice(7).split(',');
if(onlyIds?.some(id=>!renderDays.some(d=>d.frames.some(f=>f.id===id))))throw Error('Arte selecionada inexistente');
let fonts='';
for(const file of ['Playfair+Display.css','Plus+Jakarta+Sans.css'])fonts+=(await fs.readFile(path.join(root,'fonts',file),'utf8')).replace(/url\(https:\/\/fonts\.gstatic\.com\/[^)]*\/([^/)]+\.woff2)\)/g,(_,f)=>`url(${url('fonts/'+f)})`);
function html(f,i){
 if(f.type==='art')return `<!doctype html><html><body style="margin:0;width:1080px;height:1920px;overflow:hidden"><img style="display:block;width:1080px;height:1920px;object-fit:cover" src="${url(f.imageSource)}"></body></html>`;

 const photo=['photo','lifestyle'].includes(f.type), light=['#F6F2E8','#C2D371','#F2C46E','#E3889E','#EDB43E','#C78E51'].includes(f.bg),fg=photo||light?'#1E2A1B':'#FFF7ED';
 const image=photo?`<img class="photo" src="${url(f.imageSource)}">`:f.flavor?`<img class="bottle" src="${url('assets/bottles/'+f.flavor+'.webp')}">`:'';
 return `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
 *{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;overflow:hidden}body{background:radial-gradient(ellipse at 80% 15%,#ffffff12,transparent 55%),${f.bg||'#F6F2E8'};color:${fg};font-family:'Plus Jakarta Sans',sans-serif;text-align:center;-webkit-font-smoothing:antialiased}.mark{position:absolute;top:220px;width:100%;font-family:'Playfair Display';font-size:38px;font-weight:700}.content{position:absolute;inset:360px 90px 340px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:42px}h1{font-family:'Playfair Display';font-size:78px;line-height:1.14;margin:0;font-weight:700;max-width:900px}p{font-size:38px;line-height:1.5;margin:0;max-width:850px}.cta{font-size:31px;line-height:1.5}.bottle{height:730px;max-width:750px;object-fit:contain;filter:drop-shadow(0 24px 28px #0003)}.photo{width:900px;height:940px;object-fit:cover;object-position:center;border-radius:8px}.content.hasphoto{inset:340px 90px 300px;gap:28px}.hasphoto h1{font-size:65px}.hasphoto p{font-size:33px}.hasphoto .partner{font-size:27px}.foot{position:absolute;bottom:220px;width:100%;font-size:26px}.story-text h1,.story-creator h1{font-size:91px}.story-text p,.story-creator p{font-size:43px;line-height:1.6}.story-creator .cta{padding-top:18px;font-size:35px;border-top:1px solid #2d4b2850}.story-text .content,.story-creator .content{gap:60px}

 .layout-partner .content{inset:380px 95px 320px;align-items:flex-start;text-align:left;padding-right:360px;gap:32px}.layout-partner h1{font-size:83px}.layout-partner p{font-size:36px}.layout-partner .bottle{position:absolute;right:-30px;top:70px;height:910px;max-width:360px;transform:rotate(7deg)}.layout-partner .partner{font-size:32px;border-top:1px solid #1e2a1b55;padding-top:28px}
 .layout-flavor .content{inset:350px 90px 320px;justify-content:flex-start;gap:32px}.layout-flavor h1{order:0;font-size:84px}.layout-flavor p{order:1;font-size:36px;max-width:800px}.layout-flavor .bottle{order:2;height:730px;margin-top:20px;transform:rotate(-7deg)}
 .layout-process .content{inset:390px 100px 330px;align-items:flex-start;text-align:left;justify-content:flex-start;gap:55px;padding-bottom:380px}.layout-process h1{font-size:91px}.layout-process p{font-size:40px}.layout-process .bottle{position:absolute;bottom:-60px;right:45px;height:570px;transform:rotate(10deg)}
 .layout-lifestyle .content.hasphoto{inset:365px 90px 300px;gap:32px}.layout-lifestyle .photo{height:850px;width:900px}.layout-lifestyle .hasphoto h1{font-size:67px}.layout-lifestyle .hasphoto p{font-size:35px}
 .layout-creator .content{align-items:flex-start;text-align:left;inset:435px 110px 350px;gap:55px}.layout-creator h1{font-size:94px}.layout-creator p{font-size:41px;line-height:1.55}.layout-creator .cta{font-size:33px;line-height:1.5}
 </style></head><body class="story-${esc(f.type)} layout-${esc(f.layout||'default')}"><div class="mark"><img src="${url('assets/partners/kombu-k-logo.svg')}" style="width:100px;height:100px"></div><main class="content ${photo?'hasphoto':''}">${photo?'':image}<h1>${esc(f.title)}</h1>${photo?image:''}<p>${esc(f.body)}</p>${f.partner?`<div class="partner">${esc(f.partner)}</div>`:''}${f.cta?`<div class="cta">${esc(f.cta)}</div>`:''}</main><footer class="foot">@kombu.amazonia</footer></body></html>`;
}
const tmp=path.join(root,'.render/stories-temp');await fs.mkdir(tmp,{recursive:true});
const port=9355,proc=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new',`--remote-debugging-port=${port}`,'--disable-gpu','--hide-scrollbars','--allow-file-access-from-files','--user-data-dir='+path.join(tmp,'profile'),'about:blank'],{stdio:'ignore'});
let target;
for(let i=0;i<60&&!target;i++){await new Promise(r=>setTimeout(r,200));target=await fetch(`http://127.0.0.1:${port}/json/list`).then(r=>r.json()).then(l=>l.find(t=>t.type==='page')).catch(()=>null)}
if(!target){proc.kill();throw Error('Chrome indisponível')}
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map();ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,m=>m.error?reject(Error(m.error.message)):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
await send('Emulation.setDeviceMetricsOverride',{width:1080,height:1920,deviceScaleFactor:1,mobile:false});
try{
 for(const day of renderDays)for(const [i,f]of day.frames.entries()){
  if(onlyIds&&!onlyIds.includes(f.id))continue;
  const file=path.join(tmp,'story.html');await fs.writeFile(file,html(f,i));await send('Page.navigate',{url:pathToFileURL(file).href});
  await send('Runtime.evaluate',{expression:'new Promise(r=>(document.readyState==="complete"?r():addEventListener("load",r))).then(()=>document.fonts.ready).then(()=>Promise.all([...document.images].map(i=>i.decode())))',awaitPromise:true});
  const check=await send('Runtime.evaluate',{expression:'JSON.stringify([...document.querySelectorAll("h1,p,.cta")].filter(e=>{const b=e.getBoundingClientRect();return b.bottom>1700||b.top<200||b.left<70||b.right>1010}).map(e=>e.textContent))',returnByValue:true});
  if(check.result.value!=='[]')throw Error('Texto fora da área segura: '+f.id);
  const {data}=await send('Page.captureScreenshot',{format:'jpeg',quality:94});const dest=path.join(root,outputRoot,f.image);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,Buffer.from(data,'base64'));
 }
 if(!preview){await fs.mkdir(path.join(root,'out/stories'),{recursive:true});await fs.writeFile(path.join(root,'out/stories/manifest.json'),JSON.stringify(plan,null,2)+'\n');}

 // Visual contact sheets for every dated batch, including the first AI-edited series.
 const review=path.join(root,'research/2026-10-27/dolce-vita-fotos');await fs.mkdir(review,{recursive:true});
 await send('Emulation.setDeviceMetricsOverride',{width:1800,height:760,deviceScaleFactor:1,mobile:false});
 for(const day of renderDays){
  const board=path.join(tmp,'board.html');
  await fs.writeFile(board,`<html><head><meta charset="utf-8"><style>${fonts}*{box-sizing:border-box}body{margin:0;padding:32px;background:#eeeae1;color:#253d26;font-family:'Plus Jakarta Sans'}h1{font-size:30px;margin:0 0 20px}.row{display:flex;gap:20px}.item{width:330px}img{width:330px;height:587px;object-fit:contain}p{font-size:16px;margin:6px 0}</style></head><body><h1>Kombú · Stories · ${day.date}</h1><div class="row">${day.frames.map((f,i)=>`<div class="item"><img src="${url(outputRoot+'/'+f.image)}"><p>${i+1}. ${esc(f.id)}</p></div>`).join('')}</div></body></html>`);
  await send('Page.navigate',{url:pathToFileURL(board).href});
  await send('Runtime.evaluate',{expression:'new Promise(r=>(document.readyState==="complete"?r():addEventListener("load",r))).then(()=>document.fonts.ready).then(()=>Promise.all([...document.images].map(i=>i.decode())))',awaitPromise:true});
  const {data}=await send('Page.captureScreenshot',{format:'jpeg',quality:92});await fs.writeFile(path.join(review,'stories-'+day.date+(preview?'-sem-contador-previa':'')+'.jpg'),Buffer.from(data,'base64'));
 }
 console.log('Stories renderizados: '+renderDays.length*5);

}finally{ws.close();proc.kill()}
