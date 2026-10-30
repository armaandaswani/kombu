// Build the approved commercial Reel without ever opening the private voice export.
import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const file=path.join(root,'reels-calendar.json'),plan=JSON.parse(await fs.readFile(file));
for(const post of plan.posts){
 if(!post.approvedAt||post.voice!=='none'||!post.source.endsWith('/Kombu-Filme-v6-Sem-Locucao.mp4'))throw Error('Exportação não liberada');
 const tags=post.caption.match(/#[\p{L}\d_]+/gu)||[];
 if(tags.length>5||!tags.includes('#manaus')||post.caption.split('\n')[0].length>125||/ch[aá]\s+verde|green\s+tea|\bfam[ií]lia\b|\bfamiliar\b|\bvitalidade\b|detox|probiótic|intestin|emagre|R\$|sem açúcar/i.test(post.caption))throw Error('Legenda fora das regras da marca');
 const dir=path.join(root,'out',post.id);await fs.mkdir(dir,{recursive:true});
 const dest=path.join(dir,post.video);
 if(!await fs.access(dest).then(()=>true,()=>false))execFileSync('/opt/homebrew/bin/ffmpeg',['-v','error','-y','-i',path.join(root,post.source),'-c:v','libx264','-preset','medium','-crf','22','-maxrate','5M','-bufsize','10M','-pix_fmt','yuv420p','-c:a','aac','-ar','48000','-b:a','192k','-movflags','+faststart',dest],{stdio:'inherit'});
 const probe=JSON.parse(execFileSync('/opt/homebrew/bin/ffprobe',['-v','error','-show_streams','-show_format','-of','json',dest],{encoding:'utf8'}));
 const v=probe.streams.find(s=>s.codec_type==='video'),a=probe.streams.find(s=>s.codec_type==='audio');
 if(v?.codec_name!=='h264'||v.width!==1080||v.height!==1920||a?.codec_name!=='aac'||Number(a.sample_rate)!==48000||Number(probe.format.duration)<3||Number(probe.format.size)>25*1024*1024)throw Error('Reel fora das especificações');
 const hash=createHash('sha256').update(await fs.readFile(dest)).digest('hex');
 if(post.sha256&&post.sha256!==hash)throw Error('O arquivo mudou desde a aprovação do pipeline');
 post.sha256=hash;post.bytes=Number(probe.format.size);post.durationSeconds=Number(probe.format.duration);
 execFileSync('/opt/homebrew/bin/ffmpeg',['-v','error','-y','-ss','3','-i',dest,'-frames:v','1','-q:v','2',path.join(dir,post.cover)]);
 await fs.writeFile(path.join(dir,'legenda.txt'),post.caption+'\n');
 console.log(post.id+': '+post.durationSeconds+'s, '+Math.round(post.bytes/1024/1024)+' MiB, 1080×1920, H.264/AAC 48kHz');
}
await fs.writeFile(file,JSON.stringify(plan,null,2)+'\n');
