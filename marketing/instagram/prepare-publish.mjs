// Prepare only the current calendar's canonical files. Ignore stale slides and iCloud conflict copies.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const calendar = JSON.parse(await fs.readFile(path.join(root, 'calendar.json'), 'utf8'));
const target = path.join(root, '.render', 'publish');
await fs.rm(target, {recursive: true, force: true});
let images = 0;
for (const post of calendar.posts) {
  if (!/^[a-z0-9-]+$/.test(post.id)) throw new Error('id inválido: ' + post.id);
  const source = path.join(root, 'out', post.id);
  const dest = path.join(target, post.id);
  await fs.mkdir(dest, {recursive: true});
  for (let i = 1; i <= post.slides.length; i++) {
    const filename = `${i}.jpg`;
    await fs.copyFile(path.join(source, filename), path.join(dest, filename));
    images++;
  }
  await fs.copyFile(path.join(source, 'legenda.txt'), path.join(dest, 'legenda.txt'));
}
console.log(`${images} imagens de ${calendar.posts.length} posts prontas em ${target}`);

// Include dated Story batches without dropping the existing feed assets.
const stories = JSON.parse(await fs.readFile(path.join(root, 'out/stories/manifest.json'), 'utf8'));
for (const day of stories.days) for (const frame of day.frames) {
  if (!/^stories\/\d{4}-\d{2}-\d{2}\/[a-z0-9-]+\.jpg$/.test(frame.image)) throw new Error('Story inválido');
  const dest = path.join(target, frame.image);
  await fs.mkdir(path.dirname(dest), {recursive: true});
  await fs.copyFile(path.join(root, 'out', frame.image), dest);
}
await fs.copyFile(path.join(root, 'out/stories/manifest.json'), path.join(target, 'stories/manifest.json'));
console.log(stories.days.length * 5 + ' Stories incluídos.');

// Include only explicitly approved exports. Never copy the private evaluation soundtrack.
const reels=JSON.parse(await fs.readFile(path.join(root,'reels-calendar.json'),'utf8'));
for(const post of reels.posts){
 if(!/^[a-z0-9-]+$/.test(post.id)||!post.approvedAt||post.voice!=='none')throw Error('Reel não liberado');
 const sourceVideo=await fs.readFile(path.join(root,'out',post.id,post.video));
 if(createHash('sha256').update(sourceVideo).digest('hex')!==post.sha256)throw Error('Reel diverge da versão liberada');
 const dest=path.join(target,post.id);await fs.mkdir(dest,{recursive:true});
 for(const file of [post.video,post.cover,'legenda.txt']){
  if(!/^[a-z0-9.-]+$/.test(file))throw Error('Arquivo de Reel inválido');
  const source=path.join(root,'out',post.id,file);
  if((await fs.stat(source)).size>25*1024*1024)throw Error('Arquivo acima do limite Pages: '+file);
  await fs.copyFile(source,path.join(dest,file));
 }
}
console.log(reels.posts.length+' Reels aprovados incluídos.');
