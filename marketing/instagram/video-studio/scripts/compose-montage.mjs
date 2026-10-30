import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
import {join} from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderMedia,selectComposition} from '@remotion/renderer';
import {root} from './prepare.mjs';
import {acquireLock} from './lock.mjs';
const release=acquireLock(join(root,'output/production.lock'));process.on('exit',release);
const out=join(root,'output/realistic-v5'),pub=join(root,'public/generated/realistic-v5');
await mkdir(pub,{recursive:true});
const run=(args)=>execFileSync('/opt/homebrew/bin/ffmpeg',['-v','error','-y',...args],{stdio:'inherit'});
const v4=join(root,'output/realistic-v4/Kombu-Realista-Previa.mp4');
for(const name of ['macro','overhead','glass']) {
  const probe=JSON.parse(execFileSync('/opt/homebrew/bin/ffprobe',['-v','error','-show_format','-show_streams','-of','json',join(out,name+'.mp4')],{encoding:'utf8'}));
  if(!probe.streams.some(s=>s.codec_type==='video')||Number(probe.format.duration)<3.3)throw Error('Plano incompleto: '+name);
}
if(!process.argv.includes('--render-only')) {
run(['-i',v4,'-vf','trim=start_frame=0:end_frame=49,setpts=PTS-STARTPTS','-frames:v','49','-an','-c:v','libx264','-crf','17','-pix_fmt','yuv420p',join(pub,'hero.mp4')]);
run(['-i',v4,'-vf','trim=start_frame=49:end_frame=109,setpts=(PTS-STARTPTS)/0.75,minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,tpad=stop_mode=clone:stop_duration=0.25','-frames:v','81','-an','-c:v','libx264','-crf','17','-pix_fmt','yuv420p',join(pub,'pour.mp4')]);
run(['-i',join(out,'glass.mp4'),'-vf','setpts=(PTS-STARTPTS)/0.75,minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,tpad=stop_mode=clone:stop_duration=0.25','-frames:v','108','-an','-c:v','libx264','-crf','17','-pix_fmt','yuv420p',join(pub,'glass.mp4')]);
run(['-i',join(out,'macro.mp4'),'-vf','setpts=(PTS-STARTPTS)/0.8804347826,minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,tpad=stop_mode=clone:stop_duration=0.25','-frames:v','92','-an','-c:v','libx264','-crf','17','-pix_fmt','yuv420p',join(pub,'macro.mp4')]);
await copyFile(join(out,'overhead.mp4'),join(pub,'overhead.mp4'));
await copyFile(join(root,'assets/generated/realistic-v5/overhead.png'),join(pub,'overhead-reference.png'));
}
await copyFile(join(root,'../assets/partners/kombu-k-logo.png'),join(pub,'logo.png'));
await copyFile(join(root,'../fonts/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xQ.woff2'),join(pub,'serif.woff2'));
await copyFile(join(out,'mix.wav'),join(pub,'mix.wav'));
const tracking=JSON.parse(await readFile(join(out,'overhead-tracking.json'),'utf8'));
if(!tracking.frames.slice(0,65).every(row=>row.matched))throw Error('Rastreamento insuficiente nos quadros usados do plano visto de cima.');
const inputProps={audio:true,shots:[
  {clip:'macro',frames:42},{clip:'hero',frames:49,hasLogo:true},
  {clip:'macro',frames:50,sourceStart:42,crop:1.08},
  {clip:'pour',frames:81,hasLogo:true},
  {clip:'overhead',frames:65,tracking},
  {clip:'hero',frames:49,hasLogo:true},
  {clip:'glass',frames:108}],cues:[
    {from:8,frames:34,text:'No calor de Manaus,',size:76,top:265},
    {from:140,frames:48,text:'Suave, com\nsabor intenso.',size:76,top:300,light:true},
    {from:222,frames:37,text:'Gás da própria\nfermentação.',size:70,top:1460,left:450},
    {from:360,frames:73,text:'Artesanal premium\nde Manaus, desde 2017.',size:64,top:1440}
  ]};
await writeFile(join(out,'edit.json'),JSON.stringify(inputProps,null,2));
const serveUrl=await bundle({entryPoint:join(root,'src/MontageFilm.jsx'),publicDir:join(root,'public')});
const browserExecutable='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const composition=await selectComposition({serveUrl,id:'KombuMontage',inputProps,browserExecutable});
await renderMedia({serveUrl,composition,inputProps,browserExecutable,codec:'h264',audioCodec:'aac',audioBitrate:'192k',pixelFormat:'yuv420p',crf:17,concurrency:1,outputLocation:join(out,'Kombu-Filme-Rayssa-Previa-Privada.mp4')});
await writeFile(join(out,'USO-DA-VOZ.txt'),'Prévia privada de avaliação com Rayssa Original. O motor instalado informa pesos OmniVoice CC-BY-NC. Esta exportação não está liberada para publicação comercial. Não foi enviada ao calendário ou ao Instagram.\n');
console.log('Filme com sete planos montado: 18,5 s, cinco setups de câmera e narração Rayssa Original.');
