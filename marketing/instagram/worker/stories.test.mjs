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
test('missing day does not use yesterday or future content',async()=>{const s=setup();await runStories(s.env,s.deps,new Date('2026-10-29T11:00:00Z'));assert.equal(s.calls.length,0)});

test('outside Stories slots, including feed schedules, cannot publish Stories',async()=>{
 const s=setup();
 for(const hour of ['10:55','11:03','11:25','16:30','22:30']) await runStories(s.env,s.deps,new Date(date+'T'+hour+':00Z'));
 assert.equal(s.calls.length,0);
});
test('one-day catch-up uses 10:00 Manaus, never on a later date',()=>{
 assert.equal(storySlot(new Date('2026-10-28T14:00:00Z')),0);
 assert.equal(storySlot(new Date('2026-10-28T14:20:00Z')),4);
 assert.equal(storySlot(new Date('2026-10-29T14:00:00Z')),null);
 assert.equal(storySlot(new Date('2027-10-28T14:00:00Z')),null);
});

test('shared free-plan trigger preserves feed times and excludes Stories slots',()=>{
 for(const time of ['16:30','22:30'])assert.equal(isFeedTime(new Date(date+'T'+time+':00Z')),true);
 for(const hour of [11,14,16,22])for(const minute of [0,5,10,15,20,30]){
  if((hour===16||hour===22)&&minute===30)continue;
  assert.equal(isFeedTime(new Date(date+'T'+hour+':'+String(minute).padStart(2,'0')+':00Z')),false);
 }
});
