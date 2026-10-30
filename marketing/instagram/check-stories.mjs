// Read-only verification. Never reads tokens or calls the Instagram API.
import fs from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
import {localDate} from './worker/stories.mjs';
const exec=promisify(execFile),root=fileURLToPath(new URL('.',import.meta.url));
const date=process.argv[2]||localDate();
if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Data inválida');
const plan=JSON.parse(await fs.readFile(new URL('./stories-calendar.json',import.meta.url),'utf8'));
const day=plan.days.find(d=>d.date===date);
if(!day)throw Error('Sem artes para '+date);
const env={...process.env,CI:'1',CLOUDFLARE_ACCOUNT_ID:'d96b1341ef54c6d28ad6415f18220aaf'};
async function read(key){
 try{
  const {stdout}=await exec('npx',['--yes','wrangler@4.156.0','kv','key','get',key,'--namespace-id','b59df63d5f8d4b91a087a818f4252c3e','--remote'],{cwd:root+'worker',env,maxBuffer:1024*1024});
  return JSON.parse(stdout);
 }catch(e){
  const message=String(e.stderr||e.stdout||'');
  if(/404: Not Found/.test(message))return null;
  throw Error('Não foi possível consultar '+key+(/401: Unauthorized/.test(message)?': autenticação do Cloudflare recusada':': consulta remota falhou'));
 }
}
const done=await read('stories:done:'+date);
const health=await read('stories:health:'+date);
const log=(await read('log')||[]).filter(line=>line.startsWith(date)&&/Stor(?:y|ies)/.test(line));
const states=[];
for(const frame of day.frames){
 const state=await read('story:'+date+':'+frame.id);
 states.push({id:frame.id,status:state?.status||'not-started',at:state?.at,confirmedAt:state?.confirmedAt,lastError:state?.lastError});
}
console.log(JSON.stringify({date,checkedAt:new Date().toISOString(),complete:done?.count===5&&states.every(s=>s.status==='published'),done,health,states,log},null,2));
