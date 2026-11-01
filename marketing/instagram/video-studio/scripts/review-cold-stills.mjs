import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,renderMedia} from '@remotion/renderer';
import {mkdir,readFile,copyFile} from 'node:fs/promises';
import {join} from 'node:path';
import {root} from './prepare.mjs';
const id=process.argv.find(v=>/^pera-ice-v[1-9][0-9]*$/.test(v))||'pera-ice-v1';
const take=(process.argv.find(v=>v.startsWith('--take='))||'--take=hero').split('=')[1];
if(!/^[a-z0-9-]+$/.test(take))throw Error('Take inválido.');
const config=JSON.parse(await readFile(join(root,'projects',id+'.json'))),shot=config.shots[take];
if(!shot)throw Error('Take ausente.');
const used=config.edit?.filter(s=>s.clip===take);
const length=used?.length?Math.max(...used.map(s=>(s.sourceStart||0)+s.frames)):(shot.frames||config.frames);
const pub=join(root,'public/generated',id),out=join(root,'output',id,'label-review');await mkdir(pub,{recursive:true});await mkdir(out,{recursive:true});
await copyFile(join(root,'output',id,take+'.mp4'),join(pub,take+'.mp4'));await copyFile(join(root,shot.image),join(pub,take+'-reference.png'));
const tracking=JSON.parse(await readFile(join(root,'output',id,take+'-tracking.json'))),inputProps={audio:false,assetDir:'generated/'+id,shots:[{clip:take,frames:length,sourceStart:0,tracking}]};
const serveUrl=await bundle({entryPoint:join(root,'src/ColdWaterFilm.jsx'),publicDir:join(root,'public')}),browserExecutable='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const composition=await selectComposition({serveUrl,id:'KombuColdWater',inputProps,browserExecutable});
for(const frame of [0,Math.floor(length/2),length-1]){await renderStill({serveUrl,composition,inputProps,browserExecutable,frame,imageFormat:'jpeg',output:join(out,take+'-'+frame+'.jpg')});console.log('Rótulo revisável, frame '+frame);}

if(process.argv.includes('--video'))await renderMedia({serveUrl,composition,inputProps,browserExecutable,codec:'h264',pixelFormat:'yuv420p',crf:21,concurrency:1,outputLocation:join(out,take+'-Prova-Rotulo.mp4')});
