import React from 'react';
import {AbsoluteFill,Audio,Composition,Img,OffthreadVideo,Sequence,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import {TrackedPackaging} from './TrackedPackaging';
function Take({shot,assetDir}){
 const frame=useCurrentFrame();
 const trackingFrame=frame+(shot.sourceStart||0);
 return <AbsoluteFill style={{overflow:'hidden'}}>
  <OffthreadVideo src={staticFile(`${assetDir}/${shot.clip}.mp4`)} startFrom={shot.sourceStart||0} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/>
  {shot.tracking&&<TrackedPackaging tracking={shot.tracking} frame={trackingFrame} source={staticFile(`${assetDir}/${shot.clip}-reference.png`)} feather={3}/>}
 </AbsoluteFill>;
}
function ColdWaterFilm({shots,assetDir,audio=true}){
 let cursor=0;
 return <AbsoluteFill style={{background:'#74836b'}}>
  {shots.map((shot,i)=>{const from=cursor;cursor+=shot.frames;return <Sequence key={i} from={from} durationInFrames={shot.frames}><Take shot={shot} assetDir={assetDir}/></Sequence>;})}
  {audio&&<Audio src={staticFile(`${assetDir}/mix.wav`)}/>}
 </AbsoluteFill>;
}
registerRoot(()=><Composition id="KombuColdWater" component={ColdWaterFilm} width={1080} height={1920} fps={24} durationInFrames={242} defaultProps={{shots:[],assetDir:'generated/pera-ice-v1',audio:true}} calculateMetadata={({props})=>({durationInFrames:props.shots.reduce((sum,s)=>sum+s.frames,0)})}/>);
