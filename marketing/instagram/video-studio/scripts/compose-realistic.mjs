// Assemble actual generated video clips. Never substitutes stills or CGI.
import {execFileSync} from 'node:child_process';
import {mkdir,copyFile,writeFile,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderMedia,selectComposition} from '@remotion/renderer';
import {root} from './prepare.mjs';
import {acquireLock} from './lock.mjs';
const release=acquireLock(join(root,'output/production.lock'));process.on('exit',release);
const out=join(root,'output/realistic-v4'),pub=join(root,'public/generated/realistic-v4');
await mkdir(pub,{recursive:true});
const shots=[];
const project=JSON.parse(await readFile(join(root,'projects/realistic-v4.json'),'utf8'));
for(const name of ['close','pour']) {
  const source=join(out,name+'.mp4');
  const probe=JSON.parse(execFileSync('/opt/homebrew/bin/ffprobe',['-v','error','-show_streams','-show_format','-of','json',source],{encoding:'utf8'}));
  const video=probe.streams.find(s=>s.codec_type==='video');
  if(!video||Number(video.nb_frames)<9||Number(probe.format.duration)<.3)throw Error('Plano ausente ou inválido: '+name);
  const tracking=JSON.parse(await readFile(join(out,name+'-tracking.json'),'utf8'));
  if(tracking.coverage<.95)throw Error('Rastreamento insuficiente para preservar o rótulo: '+name);
  shots.push({name,frames:Math.round(Number(probe.format.duration)*24),tracking});
  await copyFile(source,join(pub,name+'.mp4'));
  await copyFile(join(root,project.shots[name].image),join(pub,name+'-reference.png'));
}
await copyFile(join(root,'../assets/partners/kombu-k-logo.png'),join(pub,'logo.png'));
const inputProps={shots};
const serveUrl=await bundle({entryPoint:join(root,'src/RealisticFilm.jsx'),publicDir:join(root,'public')});
const browserExecutable='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const composition=await selectComposition({serveUrl,id:'KombuRealistic',inputProps,browserExecutable});
await renderMedia({serveUrl,composition,inputProps,browserExecutable,codec:'h264',pixelFormat:'yuv420p',crf:18,concurrency:1,outputLocation:join(out,'Kombu-Realista-Previa.mp4')});
await writeFile(join(out,'assembly.json'),JSON.stringify({inputProps,duration:composition.durationInFrames/24,silent:true,approved:false},null,2));
console.log('Montagem disponível para revisão visual; ainda não aprovada.');
