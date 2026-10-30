import {test} from 'node:test';
import assert from 'node:assert/strict';
import {isMorningPublicationTime} from './publication-window.mjs';
import {readFile} from 'node:fs/promises';
test('actual Manaus clock blocks every afternoon, evening and overnight minute',()=>{
 for(let hour=0;hour<24;hour++)for(let minute=0;minute<60;minute++){
  const utc=new Date(Date.UTC(2026,9,31,hour,minute));
  const localHour=(hour+20)%24;
  assert.equal(isMorningPublicationTime(utc),localHour>=7&&localHour<12);
 }
});
test('a delayed morning cron is blocked at noon rather than using only scheduledTime',async()=>{
 assert.equal(isMorningPublicationTime(new Date('2026-10-31T11:00:00Z')),true);
 assert.equal(isMorningPublicationTime(new Date('2026-10-31T13:00:00Z')),true);
 assert.equal(isMorningPublicationTime(new Date('2026-10-31T16:00:00Z')),false);
 const source=await readFile(new URL('./index.mjs',import.meta.url),'utf8');
 const handler=source.slice(source.indexOf('async scheduled(event, env)'));
 assert.ok(source.includes("endpoint.endsWith('/media_publish')&&!isMorningPublicationTime(new Date())"));
 assert.ok(handler.indexOf('isMorningPublicationTime(new Date())')<handler.indexOf('await runStories'));
});
