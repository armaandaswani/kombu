// Original photographed-style Pera & Alecrim Reel. Does not publish or modify the feed queue.
import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile,copyFile,rename} from 'node:fs/promises';
import {join} from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderMedia,selectComposition} from '@remotion/renderer';
import {root} from './prepare.mjs';
import {acquireLock} from './lock.mjs';
const id=process.argv[2]||'pera-ice-v1';
if(!/^pera-ice-v[1-9][0-9]*$/.test(id))throw Error('Projeto inválido.');
const out=join(root,'output',id),pub=join(root,'public/generated',id);
const release=acquireLock(join(root,'output/production.lock'));process.on('exit',release);
await mkdir(pub,{recursive:true});
const config=JSON.parse(await readFile(join(root,'projects',id+'.json')));
const tracks={};
for(const clip of Object.keys(config.shots)){
 const probe=JSON.parse(execFileSync('/opt/homebrew/bin/ffprobe',['-v','error','-show_streams','-of','json',join(out,clip+'.mp4')],{encoding:'utf8'}));
 if(!probe.streams.some(s=>s.codec_type==='video'))throw Error('Take ausente: '+clip);
 await copyFile(join(out,clip+'.mp4'),join(pub,clip+'.mp4'));
 await copyFile(join(root,config.shots[clip].image),join(pub,clip+'-reference.png'));
 try{tracks[clip]=JSON.parse(await readFile(join(out,clip+'-tracking.json')));}catch(e){if(e.code!=='ENOENT')throw e;}
 if(config.shots[clip].labelPolygon&&!tracks[clip])throw Error('Rótulo ainda não revisado: '+clip);
}
const shots=(config.edit||[{clip:'hero',frames:48,sourceStart:0},{clip:'detail',frames:42,sourceStart:0},{clip:'hero',frames:45,sourceStart:48},{clip:'detail',frames:54,sourceStart:42},{clip:'hero',frames:28,sourceStart:93},{clip:'detail',frames:25,sourceStart:96}]).map(s=>({...s,tracking:tracks[s.clip]}));
for(const shot of shots){if(!config.shots[shot.clip]||shot.sourceStart+shot.frames>(config.shots[shot.clip].frames||config.frames))throw Error('Trecho excede o take: '+shot.clip);}
if(config.uniqueTakes&&new Set(shots.map(s=>config.shots[s.clip].image)).size!==shots.length)throw Error('Cada corte deve usar um take distinto; repetição bloqueada.');
const frames=shots.reduce((n,s)=>n+s.frames,0),duration=frames/24;
let cue=0;const accents=[0],pourCue=[];for(const shot of shots){if(cue)accents.push(cue/24);if(shot.clip==='pour')pourCue.push(cue/24,(cue+shot.frames)/24);cue+=shot.frames;}
const soundArgs=id==='pera-ice-v1'?[]:['--cuts',accents.filter((_,i)=>i%2===0).join(','),...(pourCue.length?['--pour-start',String(pourCue[0]),'--pour-end',String(pourCue[1])]:[])];
execFileSync(join(root,'../.render/video-tools/ltx-2-mlx/.venv/bin/python'),[join(root,'scripts/make-cold-score.py'),'--project',id,'--duration',String(duration),...soundArgs],{stdio:'inherit'});
execFileSync('/opt/homebrew/bin/ffmpeg',['-v','error','-y','-i',join(out,'score-original.wav'),'-af','loudnorm=I=-16:TP=-2:LRA=5','-ar','48000',join(out,'mix.wav')],{stdio:'inherit'});
await copyFile(join(out,'mix.wav'),join(pub,'mix.wav'));
let at=0;const events=[];for(const shot of shots){if(at)events.push({type:'cut',frame:at});at+=shot.frames;}
const inputProps={shots,assetDir:'generated/'+id,audio:true};
await writeFile(join(out,'edit.json'),JSON.stringify(inputProps,null,2));await writeFile(join(out,'events.json'),JSON.stringify(events,null,2));
const serveUrl=await bundle({entryPoint:join(root,'src/ColdWaterFilm.jsx'),publicDir:join(root,'public')});
const browserExecutable='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const composition=await selectComposition({serveUrl,id:'KombuColdWater',inputProps,browserExecutable});
await renderMedia({serveUrl,composition,inputProps,browserExecutable,codec:'h264',audioCodec:'aac',audioBitrate:'192k',pixelFormat:'yuv420p',crf:21,encodingMaxRate:'8M',encodingBufferSize:'16M',sampleRate:48000,concurrency:1,outputLocation:join(out,`Kombu-Pera-Alecrim-Gelo-${id.split('-').at(-1)}.mp4`)});
const final=join(out,`Kombu-Pera-Alecrim-Gelo-${id.split('-').at(-1)}.mp4`);
const meta=JSON.parse(execFileSync('/opt/homebrew/bin/ffprobe',['-v','error','-show_streams','-of','json',final],{encoding:'utf8'}));
if(meta.streams.find(s=>s.codec_type==='audio')?.sample_rate!=='48000'){
 const normalized=join(out,'release-48k.mp4');execFileSync('/opt/homebrew/bin/ffmpeg',['-v','error','-y','-i',final,'-c:v','copy','-c:a','aac','-ar','48000','-b:a','192k','-movflags','+faststart',normalized]);await rename(normalized,final);
}
await writeFile(join(out,'legenda.txt'),'Uma pausa bem gelada, com o sabor de Pera & Alecrim.\n\nA Kombú combina suavidade com sabor intenso e o gás da própria fermentação. Nossa kombucha artesanal premium é feita em Manaus desde 2017.\n\nEncontre sua Kombú nos parceiros. Link na bio.\n\n#kombucha #manaus #kombuchaartesanal #kombu\n');
console.log('Reel pronto para revisão: '+duration.toFixed(3)+' s, '+shots.length+' planos, '+Object.keys(config.shots).length+' setups, trilha original, sem publicação automática.');
