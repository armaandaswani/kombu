// Prepare only the current calendar's canonical files. Ignore stale slides and iCloud conflict copies.
import fs from 'node:fs/promises';
import path from 'node:path';
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
