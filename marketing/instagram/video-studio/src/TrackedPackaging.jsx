import React from 'react';
import {Img} from 'remotion';

export function TrackedPackaging({tracking:t,frame,source,feather=5}) {
  if(!t)return null;
  const row=t.frames[Math.min(Math.floor(frame),t.frames.length-1)];
  if(row.visible===false||row.matched===false)return null;
  const h=row.matrix;
  const s=1080/t.width;
  const matrix=[h[0][0],h[1][0],0,h[2][0]/s,h[0][1],h[1][1],0,h[2][1]/s,0,0,1,0,h[0][2]*s,h[1][2]*s,0,h[2][2]];
  const points=t.polygon.map(([x,y])=>`${x*1080},${y*1920}`).join(' ');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920"><defs><filter id="edge"><feGaussianBlur stdDeviation="${feather}"/></filter></defs><polygon points="${points}" fill="white" filter="url(#edge)"/></svg>`;
  return <Img src={source} style={{position:'absolute',inset:0,width:1080,height:1920,maskImage:`url("data:image/svg+xml,${encodeURIComponent(svg)}")`,maskSize:'100% 100%',transformOrigin:'0 0',transform:`matrix3d(${matrix.join(',')})`}}/>;
}
