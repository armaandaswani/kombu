import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runStories,localDate,validateDay,storySlot,isFeedTime} from './stories.mjs';
const date='2026-10-27';
const frames=Array.from({length:5},(_,i)=>({id:'frame-'+i,image:'stories/2026-10-27/frame-'+i+'.jpg'}));
const manifest={days:[{date,frames}]};
function setup({type='BUSINESS',failImage=false}={}){
 const map=new Map(), calls=[],logs=[];
 const env={IG_TOKEN:'fake-for-unit-test',STATE:{get:async k=>map.get(k),put:async(k,v)=>map.set(k,v)}};
 const deps={currentToken:async()=> 'fake-for-unit-test',account:async()=>({id:'test'}),waitFinished:async()=>{},log:async(_,s)=>logs.push(s),call:async(method,url,params)=>{calls.push({method,url,params});if(method==='GET')return{account_type:type};if(url.endsWith('/media')){assert.equal(params.media_type,'STORIES');return{id:'container'}};return{id:'published'}}};
 globalThis.fetch=async(url,opt)=>opt?.method==='HEAD'?new Response('',{status:failImage?404:200,headers:{'content-type':'image/jpeg'}}):new Response(JSON.stringify(manifest),{status:200});
 return {env,deps,map,calls,logs};
}
test('Manaus date remains local across UTC midnight',()=>{assert.equal(localDate(new Date('2026-10-28T02:00:00Z')),date)});
test('requires five unique frames and safe image paths',()=>{assert.throws(()=>validateDay({days:[{date,frames:frames.slice(1)}]},date));assert.throws(()=>validateDay({days:[{date,frames:frames.map(f=>({...f,id:'same'}))}]},date));assert.throws(()=>validateDay({days:[{date,frames:frames.map(f=>({...f,image:'../token'}))}]},date))});
test('publishes exactly one Story per five-minute slot and does not repeat',async()=>{
 const s=setup();
 for(let i=0;i<5;i++){
  const now=new Date(date+'T11:'+String(i*5).padStart(2,'0')+':00Z');
  await runStories(s.env,s.deps,now);
  assert.equal(s.calls.filter(c=>c.url.endsWith('/media_publish')).length,i+1);
  await runStories(s.env,s.deps,now);
  assert.equal(s.calls.filter(c=>c.url.endsWith('/media_publish')).length,i+1);
 }
 assert.equal(JSON.parse(s.map.get('stories:done:'+date)).count,5);
});
test('retries an unfinished earlier frame without sending a batch',async()=>{
 const s=setup();s.map.set('story:'+date+':frame-0',JSON.stringify({status:'published'}));
 await runStories(s.env,s.deps,new Date(date+'T11:10:00Z'));
 assert.equal(s.calls.filter(c=>c.url.endsWith('/media_publish')).length,1);
 assert.equal(JSON.parse(s.map.get('story:'+date+':frame-1')).status,'published');
 assert.equal(s.map.has('story:'+date+':frame-2'),false);
 await runStories(s.env,s.deps,new Date(date+'T11:10:00Z'));
 assert.equal(s.calls.filter(c=>c.url.endsWith('/media_publish')).length,1);
});
test('uncertain publish is held for review instead of duplicated',async()=>{const s=setup();s.map.set('story:'+date+':frame-0',JSON.stringify({status:'publishing'}));await assert.rejects(runStories(s.env,s.deps,new Date(date+'T11:00:00Z')),/confirmação pendente/);assert.equal(s.calls.filter(c=>c.method==='POST').length,0)});
test('unsupported account and unavailable image cannot publish',async()=>{let s=setup({type:'MEDIA_CREATOR'});await assert.rejects(runStories(s.env,s.deps,new Date(date+'T11:00:00Z')),/Business/);s=setup({failImage:true});await assert.rejects(runStories(s.env,s.deps,new Date(date+'T11:00:00Z')),/imagem indisponível/);assert.equal(s.calls.filter(c=>c.method==='POST').length,0)});
test('missing day does not use yesterday or future content',async()=>{const s=setup();await assert.rejects(runStories(s.env,s.deps,new Date('2026-10-29T11:00:00Z')),/sem artes/);assert.equal(s.calls.length,0)});

test('outside Stories slots, including feed schedules, cannot publish Stories',async()=>{
 const s=setup();
 for(const hour of ['10:55','11:03','13:00','16:30','22:30']) await runStories(s.env,s.deps,new Date(date+'T'+hour+':00Z'));
 assert.equal(s.calls.length,0);
});
test('incident catch-up exists only on October 30 after 08:30 Manaus',()=>{
 assert.equal(storySlot(new Date('2026-10-30T12:30:00Z')),5);
 assert.equal(storySlot(new Date('2026-10-30T12:55:00Z')),10);
 assert.equal(storySlot(new Date('2026-10-31T12:30:00Z')),null);
 assert.equal(storySlot(new Date('2026-10-30T13:55:00Z')),22);
 assert.equal(storySlot(new Date('2026-10-31T13:00:00Z')),null);
 assert.equal(storySlot(new Date('2026-10-30T12:25:00Z')),null);
});

test('feed publishes only at 09:00 Manaus and the deployed cron includes every allowed slot',async()=>{
 const {readFile}=await import('node:fs/promises');
 const config=await readFile(new URL('./wrangler.toml',import.meta.url),'utf8');
 assert.ok(config.includes('crons = ["*/5 11,12,13 * * *"]'));
 const calendar=JSON.parse(await readFile(new URL('../calendar.json',import.meta.url),'utf8'));
 assert.equal(calendar.postTime,'09:00');
 for(let hour=0;hour<24;hour++)for(let minute=0;minute<60;minute++){
  const now=new Date('2026-10-30T'+String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0')+':00Z');
  assert.equal(isFeedTime(now),hour===13&&minute===0);
  if(isFeedTime(now)||storySlot(now)!==null){
   assert.ok([11,12,13].includes(hour)&&minute%5===0);
  }
 }
});

test('reconciles already published container without publishing it again',async()=>{
 const s=setup();s.map.set('story:'+date+':frame-0',JSON.stringify({status:'publishing',containerId:'old',at:date+'T11:00:00Z'}));
 const original=s.deps.call;s.deps.call=async(method,url,params)=>url==='/old'?{status_code:'PUBLISHED'}:original(method,url,params);
 await runStories(s.env,s.deps,new Date(date+'T11:05:00Z'));
 assert.equal(JSON.parse(s.map.get('story:'+date+':frame-0')).status,'published');
 assert.equal(s.calls.filter(c=>c.url.endsWith('/media_publish')).length,1);
 assert.equal(JSON.parse(s.map.get('story:'+date+':frame-1')).status,'published');
});
test('FINISHED pending container resumes using its exact creation id, not a new upload',async()=>{
 const s=setup();s.map.set('story:'+date+':frame-0',JSON.stringify({status:'publishing',containerId:'old',at:date+'T11:00:00Z'}));
 const original=s.deps.call;s.deps.call=async(method,url,params)=>url==='/old'?{status_code:'FINISHED'}:original(method,url,params);
 await runStories(s.env,s.deps,new Date(date+'T11:05:00Z'));
 assert.equal(s.calls.filter(c=>c.url.endsWith('/media')).length,0);
 assert.equal(s.calls.find(c=>c.url.endsWith('/media_publish')).params.creation_id,'old');
});
test('lost response and unavailable status do not create a replacement or duplicate',async()=>{
 const s=setup();const original=s.deps.call;
 s.deps.call=async(method,url,params)=>{if(url.endsWith('/media_publish'))throw Error('connection lost');return original(method,url,params)};
 await assert.rejects(runStories(s.env,s.deps,new Date(date+'T11:00:00Z')),/connection lost/);
 assert.equal(JSON.parse(s.map.get('story:'+date+':frame-0')).status,'publishing');
 const before=s.calls.filter(c=>c.method==='POST').length;
 s.deps.call=async(method,url,params)=>{if(url==='/container')throw Error('status unavailable');return original(method,url,params)};
 await assert.rejects(runStories(s.env,s.deps,new Date(date+'T11:05:00Z')),/status unavailable/);
 assert.equal(s.calls.filter(c=>c.method==='POST').length,before);
});
test('a failed first slot recovers the remaining five with five-minute spacing',async()=>{
 const s=setup();let fail=true;const original=s.deps.call;
 s.deps.call=async(method,url,params)=>{if(url==='/container')return {status_code:'FINISHED'};if(url.endsWith('/media_publish')&&fail){fail=false;throw Object.assign(Error('Meta refused'),{definitive:true,httpStatus:400})}return original(method,url,params)};
 await assert.rejects(runStories(s.env,s.deps,new Date(date+'T11:00:00Z')),/Meta refused/);
 for(const minute of [5,10,15,20,25])await runStories(s.env,s.deps,new Date(date+'T11:'+String(minute).padStart(2,'0')+':00Z'));
 assert.equal(JSON.parse(s.map.get('stories:done:'+date)).count,5);
 assert.equal(s.calls.filter(c=>c.url.endsWith('/media_publish')).length,5);
});

test('expired or failed container can be replaced only after Meta confirms its terminal state',async()=>{
 for(const status of ['ERROR','EXPIRED']){
  const s=setup();s.map.set('story:'+date+':frame-0',JSON.stringify({status:'publishing',containerId:'old',at:date+'T11:00:00Z'}));
  const original=s.deps.call;s.deps.call=async(method,url,params)=>url==='/old'?{status_code:status}:original(method,url,params);
  await runStories(s.env,s.deps,new Date(date+'T11:05:00Z'));
  assert.equal(s.calls.filter(c=>c.url.endsWith('/media')).length,1);
  assert.equal(s.calls.filter(c=>c.url.endsWith('/media_publish')).length,1);
 }
});
test('recovery ticks do nothing after all five Stories are confirmed',async()=>{
 const s=setup();s.map.set('stories:done:'+date,JSON.stringify({count:5}));
 for(const minute of [25,30,35,40,45,50,55])await runStories(s.env,s.deps,new Date(date+'T11:'+minute+':00Z'));
 assert.equal(s.calls.length,0);
});
