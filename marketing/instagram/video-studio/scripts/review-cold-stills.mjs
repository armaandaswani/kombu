import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,renderMedia} from '@remotion/renderer';
import {mkdir,readFile,copyFile} from 'node:fs/promises';
import {join} from 'node:path';
import {root} from './prepare.mjs';
const id='pera-ice-v1',pub=join(root,'public/generated',id),out=join(root,'output',id,'label-review');await mkdir(pub,{recursive:true});await mkdir(out,{recursive:true});
await copyFile(join(root,'output',id,'hero.mp4'),join(pub,'hero.mp4'));await copyFile(join(root,'assets/generated',id,'hero.png'),join(pub,'hero-reference.png'));
const tracking=JSON.parse(await readFile(join(root,'output',id,'hero-tracking.json'))),inputProps={audio:false,assetDir:'generated/'+id,shots:[{clip:'hero',frames:121,sourceStart:0,tracking}]};
const serveUrl=await bundle({entryPoint:join(root,'src/ColdWaterFilm.jsx'),publicDir:join(root,'public')}),browserExecutable='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const composition=await selectComposition({serveUrl,id:'KombuColdWater',inputProps,browserExecutable});
for(const frame of [0,60,120]){await renderStill({serveUrl,composition,inputProps,browserExecutable,frame,imageFormat:'jpeg',output:join(out,'hero-'+frame+'.jpg')});console.log('Rótulo revisável, frame '+frame);}

if(process.argv.includes('--video'))await renderMedia({serveUrl,composition,inputProps,browserExecutable,codec:'h264',pixelFormat:'yuv420p',crf:21,concurrency:1,outputLocation:join(out,'Hero-Prova-Rotulo.mp4')});
