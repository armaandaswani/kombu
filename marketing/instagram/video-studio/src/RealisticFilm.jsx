import React from 'react';
import {AbsoluteFill,Composition,Img,OffthreadVideo,Sequence,registerRoot,staticFile,useCurrentFrame} from 'remotion';

function Packaging({shot}) {
  const frame=useCurrentFrame();
  const t=shot.tracking;
  if(!t)return null;
  const h=t.frames[Math.min(frame,t.frames.length-1)].matrix;
  const s=1080/t.width;
  const matrix=[h[0][0],h[1][0],0,h[2][0]/s,h[0][1],h[1][1],0,h[2][1]/s,0,0,1,0,h[0][2]*s,h[1][2]*s,0,h[2][2]];
  const points=t.polygon.map(([x,y])=>`${x*1080},${y*1920}`).join(' ');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920"><defs><filter id="edge"><feGaussianBlur stdDeviation="${shot.name==='close'?10:5}"/></filter></defs><polygon points="${points}" fill="white" filter="url(#edge)"/></svg>`;
  const maskImage=`url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  return <Img src={staticFile(`generated/realistic-v4/${shot.name}-reference.png`)} style={{position:'absolute',inset:0,width:1080,height:1920,maskImage,maskSize:'100% 100%',transformOrigin:'0 0',transform:`matrix3d(${matrix.join(',')})`}}/>;
}

function RealisticFilm({shots}) {
  let from=0;
  return <AbsoluteFill style={{background:'#213921'}}>
    {shots.map(shot=>{
      const start=from;from+=shot.frames;
      return <Sequence key={shot.name} from={start} durationInFrames={shot.frames}>
        <OffthreadVideo src={staticFile(`generated/realistic-v4/${shot.name}.mp4`)} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        <Packaging shot={shot}/>
      </Sequence>;
    })}
    <Img src={staticFile('generated/realistic-v4/logo.png')} style={{position:'absolute',top:180,left:80,width:76,height:76,borderRadius:'50%'}}/>
  </AbsoluteFill>;
}

registerRoot(()=> <Composition id="KombuRealistic" component={RealisticFilm} width={1080} height={1920} fps={24} durationInFrames={162} defaultProps={{shots:[{name:'close',frames:81},{name:'pour',frames:81}]}} calculateMetadata={({props})=>({durationInFrames:props.shots.reduce((sum,s)=>sum+s.frames,0)})}/>);
