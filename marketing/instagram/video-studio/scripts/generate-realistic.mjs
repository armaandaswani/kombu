// Local image-to-video only. No cloud fallback, credentials or voice engine.
import {spawn,execFileSync} from 'node:child_process';
import {access,readFile,mkdir,writeFile,stat} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {root} from './prepare.mjs';
import {acquireLock} from './lock.mjs';
const shot=process.argv[2]||'pour';
if(!['pour','close'].includes(shot))throw Error('Escolha pour ou close.');
const p=JSON.parse(await readFile(join(root,'projects/realistic-v4.json'),'utf8'));
const s=p.shots[shot];
if(s.frames!==undefined)p.frames=s.frames;
if(!Number.isInteger(p.frames)||p.frames<9||(p.frames-1)%8||p.frameRate!==24||![p.height,p.width].every(n=>Number.isInteger(n)&&n>=256&&n<=1024&&n%64===0))throw Error('Dimensões ou duração inválidas.');
const runtime=resolve(root,'../.render/video-tools/ltx-2-mlx');
const models=resolve(root,'../.render/video-tools/realistic-models');
const model=join(models,'ltx-q4'),gemma=join(models,'gemma-q4');
const manifest=JSON.parse(await readFile(join(root,'output/realistic-v4/models.json'),'utf8'));
for(const pack of manifest)for(const filename of pack.files){
  const expected=pack.sizes?.[filename];
  if(!Number.isInteger(expected)||expected<1)throw Error('Manifesto sem tamanhos verificados; execute setup-realistic-video.py.');
  const file=join(models,pack.name,filename);
  if((await stat(file)).size!==expected)throw Error('Modelo incompleto: '+filename);
}
for(const f of [join(runtime,'.venv/bin/ltx-2-mlx'),join(model,'transformer-distilled.safetensors'),join(model,'connector.safetensors'),join(model,'vae_encoder.safetensors'),join(model,'vae_decoder.safetensors'),join(gemma,'config.json'),join(root,s.image)]) {
  try{await access(f)}catch{throw Error('Componente local ausente: '+f+'. Conclua setup-realistic-video.py antes da geração.');}
}
const out=join(root,'output',p.id);await mkdir(out,{recursive:true});
const release=acquireLock(join(root,'output/production.lock'));process.on('exit',release);
const video=join(out,shot+'.mp4');
const args=['generate','--prompt',s.prompt,'--output',video,'--model',model,'--gemma',gemma,'--distilled','--low-ram','--no-audio','--height',String(p.height),'--width',String(p.width),'--frames',String(p.frames),'--frame-rate',String(p.frameRate),'--seed',String(p.seed),'--image',join(root,s.image),'0','1.0'];
if(s.anchorEnd)args.push('--image',join(root,s.image),String(p.frames-1),'1.0');
await writeFile(join(out,shot+'-input.json'),JSON.stringify({project:p,shot,runtimeCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:runtime,encoding:'utf8'}).trim()},null,2));
console.log('Gerando plano '+shot+' localmente; sem API paga.');
const pythonPath=['ltx-core-mlx','ltx-pipelines-mlx'].map(name=>join(runtime,'packages',name,'src')).join(':');
const child=spawn(join(runtime,'.venv/bin/ltx-2-mlx'),args,{cwd:root,stdio:'inherit',env:{...process.env,PYTHONPATH:pythonPath,PATH:'/opt/homebrew/bin:'+process.env.PATH,HF_HUB_OFFLINE:'1',HF_HUB_DISABLE_IMPLICIT_TOKEN:'1'}});
const code=await new Promise((res,rej)=>{child.once('error',rej);child.once('exit',res)});
if(code!==0)throw Error('O motor local terminou com código '+code+'. O plano ainda não está pronto.');
const probe=JSON.parse(execFileSync('/opt/homebrew/bin/ffprobe',['-v','error','-show_streams','-show_format','-of','json',video],{encoding:'utf8'}));
if(!probe.streams.some(s=>s.codec_type==='video')||Math.abs(Number(probe.format.duration)-p.frames/p.frameRate)>.2)throw Error('Saída de vídeo inválida.');
await writeFile(join(out,shot+'-result.json'),JSON.stringify({completed:true,at:new Date().toISOString(),probe},null,2));
console.log('Plano renderizado para revisão: '+video);
