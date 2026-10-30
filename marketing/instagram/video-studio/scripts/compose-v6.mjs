// Continue the photographed v5 edit with one newly generated human closing take.
// No publication, credentials, paid API, or voice regeneration.
import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile,copyFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderMedia,selectComposition} from '@remotion/renderer';
import {root} from './prepare.mjs';
import {acquireLock} from './lock.mjs';
const release=acquireLock(join(root,'output/production.lock'));process.on('exit',release);
const out=join(root,'output/realistic-v6'),pub=join(root,'public/generated/realistic-v6'),v5=join(root,'output/realistic-v5');
await mkdir(out,{recursive:true});await mkdir(pub,{recursive:true});
const ff=(args)=>execFileSync('/opt/homebrew/bin/ffmpeg',['-v','error','-y',...args],{stdio:'inherit'});
const probe=JSON.parse(execFileSync('/opt/homebrew/bin/ffprobe',['-v','error','-show_streams','-show_format','-of','json',join(out,'finish.mp4')],{encoding:'utf8'}));
if(!probe.streams.some(s=>s.codec_type==='video')||Math.abs(Number(probe.format.duration)-81/24)>.1)throw Error('Novo take incompleto');
// Keep the already reviewed source intermediates intact; new edit has its own directory.
for(const f of await readdir(join(root,'public/generated/realistic-v5')))if(/\.(mp4|png|woff2)$/.test(f))await copyFile(join(root,'public/generated/realistic-v5',f),join(pub,f));
await copyFile(join(out,'finish.mp4'),join(pub,'finish.mp4'));
await copyFile(join(root,'../fonts/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_vb.woff2'),join(pub,'sans.woff2'));
// Preserve the existing private Rayssa master, extend the original score, and leave
// the last gesture with quiet music rather than a new spoken slogan or end card.
await copyFile(join(v5,'voice-master.wav'),join(out,'voice-master.wav'));
execFileSync(join(root,'../.render/video-tools/ltx-2-mlx/.venv/bin/python'),[join(root,'scripts/make-score.py'),'--project','realistic-v6','--duration','21'],{stdio:'inherit'});
const filter='[0:a]aformat=channel_layouts=stereo[v];[1:a]loudnorm=I=-31:TP=-9:LRA=5[m];[2:a]atrim=start=0.15:end=6.1,asetpts=PTS-STARTPTS,highpass=f=160,lowpass=f=7000,afade=t=in:d=0.08,afade=t=out:st=5.6:d=0.35,volume=0.17,adelay=5875|5875[s];[v][m][s]amix=inputs=3:duration=longest:normalize=0,alimiter=limit=0.891:level=0,apad,atrim=duration=21[out]';
ff(['-i',join(out,'voice-master.wav'),'-i',join(out,'music-original.wav'),'-i',join(root,'assets/audio/pouring-water-edschaefer-cc0.mp3'),'-filter_complex',filter,'-map','[out]','-ar','48000',join(out,'mix.wav')]);
await copyFile(join(out,'mix.wav'),join(pub,'mix.wav'));
const prior=JSON.parse(await readFile(join(v5,'edit.json'),'utf8'));
const shots=[...prior.shots.slice(0,6),{clip:'glass',frames:87},{clip:'finish',frames:81}];
const inputProps={audio:true,assetDir:'generated/realistic-v6',shots,cues:[
 {from:8,frames:82,text:'No calor de Manaus,\numa pausa dessas faz diferença.',size:52,top:1500,light:true,align:'center',sans:true},
 {from:97,frames:105,text:'Bem gelada, suave\ne com sabor intenso.',size:54,top:1500,light:true,align:'center',sans:true},
 {from:205,frames:40,text:'Gás da própria fermentação.',size:52,top:1530,light:false,align:'center',sans:true},
 {from:336,frames:84,text:'Kombucha artesanal premium,\nfeita em Manaus desde 2017.',size:52,top:1490,light:false,align:'center',sans:true}
]};
await writeFile(join(out,'edit.json'),JSON.stringify(inputProps,null,2));
const events=[];let frame=0;for(const shot of shots){if(frame)events.push({type:'cut',frame});frame+=shot.frames;}
if(frame!==504)throw Error('Montagem deve conter 504 frames');
await writeFile(join(out,'events.json'),JSON.stringify(events,null,2));
const serveUrl=await bundle({entryPoint:join(root,'src/MontageFilm.jsx'),publicDir:join(root,'public')});
const browserExecutable='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const composition=await selectComposition({serveUrl,id:'KombuMontage',inputProps,browserExecutable});
await renderMedia({serveUrl,composition,inputProps,browserExecutable,codec:'h264',audioCodec:'aac',audioBitrate:'192k',pixelFormat:'yuv420p',crf:17,concurrency:1,outputLocation:join(out,'Kombu-Filme-Rayssa-v6-Previa-Privada.mp4')});
// Separate export without the restricted cloned narration, retaining original score and CC0 foley.
const cleanFilter='[1:a]loudnorm=I=-21:TP=-2:LRA=5[m];[2:a]atrim=start=0.15:end=6.1,asetpts=PTS-STARTPTS,highpass=f=160,lowpass=f=7000,afade=t=in:d=0.08,afade=t=out:st=5.6:d=0.35,volume=0.2,adelay=5875|5875[s];[m][s]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.84:level=0,atrim=duration=21[a]';
ff(['-i',join(out,'Kombu-Filme-Rayssa-v6-Previa-Privada.mp4'),'-i',join(out,'music-original.wav'),'-i',join(root,'assets/audio/pouring-water-edschaefer-cc0.mp3'),'-filter_complex',cleanFilter,'-map','0:v:0','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-movflags','+faststart',join(out,'Kombu-Filme-v6-Sem-Locucao.mp4')]);
await writeFile(join(out,'USO-DA-VOZ.txt'),'Prévia privada de avaliação com Rayssa Original já produzida. O HumanVoice instalado informa pesos OmniVoice CC-BY-NC; não publicar comercialmente esta narração. Filme não enviado ao Instagram nem ao calendário.\n');
await copyFile(join(v5,'transcript.srt'),join(out,'legendas-pt-BR.srt'));
console.log('V6 renderizada: 21 segundos, oito planos, seis setups, Rayssa Original.');
