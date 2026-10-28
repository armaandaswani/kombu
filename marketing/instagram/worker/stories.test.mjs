import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runStories,localDate,validateDay} from './stories.mjs';
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
test('publishes five Stories and does not repeat a completed day',async()=>{const s=setup();await runStories(s.env,s.deps,new Date(date+'T20:00:00Z'));assert.equal(s.calls.filter(c=>c.url.endsWith('/media_publish')).length,5);await runStories(s.env,s.deps,new Date(date+'T22:30:00Z'));assert.equal(s.calls.filter(c=>c.url.endsWith('/media_publish')).length,5)});
test('resumes only unfinished frames',async()=>{const s=setup();s.map.set('story:'+date+':frame-0',JSON.stringify({status:'published'}));await runStories(s.env,s.deps,new Date(date+'T20:00:00Z'));assert.equal(s.calls.filter(c=>c.url.endsWith('/media_publish')).length,4)});
test('uncertain publish is held for review instead of duplicated',async()=>{const s=setup();s.map.set('story:'+date+':frame-0',JSON.stringify({status:'publishing'}));await assert.rejects(runStories(s.env,s.deps,new Date(date+'T20:00:00Z')),/confirmação pendente/);assert.equal(s.calls.filter(c=>c.method==='POST').length,0)});
test('unsupported account and unavailable image cannot publish',async()=>{let s=setup({type:'MEDIA_CREATOR'});await assert.rejects(runStories(s.env,s.deps,new Date(date+'T20:00:00Z')),/Business/);s=setup({failImage:true});await assert.rejects(runStories(s.env,s.deps,new Date(date+'T20:00:00Z')),/imagem indisponível/);assert.equal(s.calls.filter(c=>c.method==='POST').length,0)});
test('missing day does not use yesterday or future content',async()=>{const s=setup();await runStories(s.env,s.deps,new Date('2026-10-29T20:00:00Z'));assert.equal(s.calls.length,0)});
