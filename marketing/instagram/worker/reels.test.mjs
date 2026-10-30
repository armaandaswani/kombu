import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runReel,reelPreparationTime} from './reels.mjs';
const post={format:'reel',approvedAt:'2026-10-30',voice:'none',id:'approved-reel',video:'video.mp4',cover:'cover.jpg',caption:'Legenda aprovada'};
function setup(){
 const map=new Map(),calls=[];let remoteStatus='FINISHED';
 const env={STATE:{get:async k=>map.get(k),put:async(k,v)=>map.set(k,v)}};
 const deps={user:{id:'own'},token:'test',imageBase:'https://assets.test',log:async()=>{},call:async(method,url,params)=>{calls.push({method,url,params});if(method==='GET')return url==='/own/media'?{data:[{id:'media',caption:post.caption,timestamp:'2026-11-01T13:00:00Z'}]}:{status_code:remoteStatus};return {id:url.endsWith('media_publish')?'media':'container'};}};
 return {map,calls,env,deps,status:s=>remoteStatus=s};
}
globalThis.fetch=async url=>new Response('',{headers:{'content-type':url.endsWith('.mp4')?'video/mp4':'image/jpeg'}});
test('preparation never publishes and 09:00 resumes the same container',async()=>{const s=setup();await runReel(s.env,s.deps,post);assert.equal(s.calls.filter(c=>c.url.endsWith('media_publish')).length,0);await runReel(s.env,s.deps,post,{publishAllowed:true});assert.equal(s.calls.filter(c=>c.method==='POST'&&c.url==='/own/media').length,1);assert.equal(s.calls.find(c=>c.url.endsWith('media_publish')).params.creation_id,'container');assert.equal(JSON.parse(s.map.get('published:'+post.id)).mediaId,'media');await runReel(s.env,s.deps,post,{publishAllowed:true});assert.equal(s.calls.filter(c=>c.url.endsWith('media_publish')).length,1)});
test('processing does not publish prematurely',async()=>{const s=setup();s.status('IN_PROGRESS');await runReel(s.env,s.deps,post,{publishAllowed:true});assert.equal(s.calls.filter(c=>c.url.endsWith('media_publish')).length,0)});
test('ambiguous publish response does not trigger a new upload or publish',async()=>{const s=setup(),original=s.deps.call;s.deps.call=async(m,u,p)=>{if(u.endsWith('media_publish'))throw Error('connection lost');return original(m,u,p)};await assert.rejects(runReel(s.env,s.deps,post,{publishAllowed:true}),/connection lost/);const before=s.calls.length;await assert.rejects(runReel(s.env,s.deps,post,{publishAllowed:true}),/incerta/);assert.equal(s.calls.slice(before).filter(c=>c.method==='POST').length,0);s.status('PUBLISHED');await runReel(s.env,s.deps,post);assert.ok(s.map.has('published:'+post.id))});
test('lost creation response blocks replacement containers',async()=>{const s=setup();s.deps.call=async()=>{throw Error('timeout')};await assert.rejects(runReel(s.env,s.deps,post),/timeout/);await assert.rejects(runReel(s.env,s.deps,post),/criação incerta/)});
test('Meta processing failures require review without recreation',async()=>{const s=setup();s.status('ERROR');await assert.rejects(runReel(s.env,s.deps,post),/ERROR/);assert.equal(JSON.parse(s.map.get('reel:'+post.id)).status,'failed')});
test('preparation slots do not add evening publication windows',()=>{for(let h=0;h<24;h++)for(let m=0;m<60;m++)assert.equal(reelPreparationTime(new Date(`2026-11-01T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00Z`)),h===12&&[50,55].includes(m))});

test('private voice exports cannot enter the commercial publisher',async()=>{const s=setup();await assert.rejects(runReel(s.env,s.deps,{...post,voice:'rayssa'}),/não liberado/);assert.equal(s.calls.length,0)});
