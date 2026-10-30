import React from 'react';
import {AbsoluteFill,Audio,Composition,Img,OffthreadVideo,Sequence,interpolate,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import {TrackedPackaging} from './TrackedPackaging';
const dir='generated/realistic-v5';
function Shot({shot,assetDir=dir}) {
  const frame=useCurrentFrame();
  return <AbsoluteFill>
    <div style={{position:'absolute',inset:0,overflow:'hidden'}}>
      <OffthreadVideo src={staticFile(`${assetDir}/${shot.clip}.mp4`)} startFrom={shot.sourceStart||0} muted style={{width:'100%',height:'100%',objectFit:'cover',transform:shot.crop?`scale(${shot.crop})`:undefined,transformOrigin:'50% 65%'}}/>
      {shot.tracking&&<TrackedPackaging tracking={shot.tracking} frame={frame} source={staticFile(`${assetDir}/${shot.clip}-reference.png`)}/>}
    </div>
    {!shot.hasLogo&&<Img src={staticFile(`${assetDir}/logo.png`)} style={{position:'absolute',top:180,left:80,width:76,height:76,borderRadius:'50%'}}/>}
  </AbsoluteFill>;
}
function Caption({cue}) {
  const f=useCurrentFrame();
  const enter=interpolate(f,[0,5],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <div style={{position:'absolute',top:cue.top||260,left:cue.left||80,right:80,fontFamily:cue.sans?'Jakarta':'Playfair',fontSize:cue.size||76,fontWeight:500,textAlign:cue.align||'left',lineHeight:cue.sans?1.22:1.12,whiteSpace:'pre-line',color:cue.light?'#fff9ec':'#173d27',WebkitTextStroke:cue.sans&&cue.light?'1px rgba(19,37,21,.6)':undefined,paintOrder:cue.sans?'stroke fill':undefined,textShadow:cue.light?(cue.sans?'0 2px 5px rgba(19,30,14,.72)':'0 2px 12px rgba(25,30,14,.42)'):undefined,transform:`translateY(${(1-enter)*10}px)`,opacity:enter}}>{cue.text}</div>;
}
function MontageFilm({shots,cues,audio=true,assetDir=dir}) {
  let cursor=0;
  return <AbsoluteFill style={{background:'#183c28'}}>
    <style>{`@font-face{font-family:Playfair;src:url('${staticFile(`${assetDir}/serif.woff2`)}')}@font-face{font-family:Jakarta;src:url('${staticFile(`${assetDir}/sans.woff2`)}')}`}</style>
    {shots.map((shot,i)=>{const from=cursor;cursor+=shot.frames;return <Sequence key={i} from={from} durationInFrames={shot.frames}><Shot shot={shot} assetDir={assetDir}/></Sequence>;})}
    {cues.map((cue,i)=><Sequence key={i} from={cue.from} durationInFrames={cue.frames}><Caption cue={cue}/></Sequence>)}
    {audio&&<Audio src={staticFile(`${assetDir}/mix.wav`)}/>}
  </AbsoluteFill>;
}
registerRoot(()=><Composition id="KombuMontage" component={MontageFilm} width={1080} height={1920} fps={24} durationInFrames={444} defaultProps={{shots:[],cues:[],audio:true}} calculateMetadata={({props})=>({durationInFrames:props.shots.reduce((sum,s)=>sum+s.frames,0)})}/>);
