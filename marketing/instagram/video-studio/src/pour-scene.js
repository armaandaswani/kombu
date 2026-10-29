import * as THREE from 'three';
import {gsap} from 'gsap';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
(async()=>{
 const p=await(await fetch('project.json')).json(), duration=p.duration||13.7;
 const renderer=new THREE.WebGLRenderer({canvas:document.querySelector('canvas'),antialias:true,alpha:true,preserveDrawingBuffer:true});
 renderer.setSize(1080,1920);renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.localClippingEnabled=true;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 const scene=new THREE.Scene();const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new RoomEnvironment(),.035).texture;
 const backdrop=await new THREE.TextureLoader().loadAsync('assets/veranda.png');backdrop.colorSpace=THREE.SRGBColorSpace;scene.background=backdrop;
 const camera=new THREE.PerspectiveCamera(35,1080/1920,.05,80);
 const key=new THREE.DirectionalLight('#fff0d3',2.2);key.position.set(-4,7,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-6,right:6,top:8,bottom:-4});key.shadow.bias=-.0002;scene.add(key);scene.add(new THREE.HemisphereLight('#fff8ec','#8e7558',.85));
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({opacity:.22}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
 const photo=await new THREE.TextureLoader().loadAsync('assets/'+p.flavors[0]+'.webp');photo.colorSpace=THREE.SRGBColorSpace;photo.repeat.set(1,.52);photo.offset.set(0,.18);
 const bottle=new THREE.Group();scene.add(bottle);
 const profile=[[.12,.04],[.39,.035],[.52,.11],[.565,.24],[.575,.5],[.575,2.78],[.56,2.91],[.5,3.08],[.35,3.28],[.22,3.44],[.215,3.7],[.225,3.73]];
 const points=profile.map(([r,y])=>new THREE.Vector2(r,y));
 const bodyGeo=new THREE.LatheGeometry(points,128);const pos=bodyGeo.attributes.position;
 for(let i=0;i<pos.count;i++){const y=pos.getY(i);if(y<.27){const a=Math.atan2(pos.getX(i),pos.getZ(i)),f=1+Math.cos(a*5)*.045*(1-y/.3);pos.setX(i,pos.getX(i)*f);pos.setZ(i,pos.getZ(i)*f)}}bodyGeo.computeVertexNormals();
 const pet=new THREE.MeshPhysicalMaterial({color:'#ffffff',roughness:.08,metalness:0,transmission:1,thickness:.07,ior:1.46,envMapIntensity:1.1,side:THREE.DoubleSide,clearcoat:.4,depthWrite:false});
 const body=new THREE.Mesh(bodyGeo,pet);body.castShadow=true;body.renderOrder=3;bottle.add(body);
 const label=new THREE.Mesh(new THREE.CylinderGeometry(.581,.581,1.97,96,1,true,-1.07,2.14),new THREE.MeshBasicMaterial({map:photo,toneMapped:false,side:THREE.DoubleSide}));label.position.y=1.66;label.castShadow=true;bottle.add(label);
 const backLabel=new THREE.Mesh(new THREE.CylinderGeometry(.580,.580,1.97,96,1,true,1.07,Math.PI*2-2.14),new THREE.MeshStandardMaterial({color:'#c14b80',roughness:.56}));backLabel.position.y=1.66;bottle.add(backLabel);
 const neck=new THREE.Mesh(new THREE.TorusGeometry(.225,.015,8,64),pet);neck.rotation.x=Math.PI/2;neck.position.y=3.72;bottle.add(neck);
 function makeCap(){const g=new THREE.Group(),mat=new THREE.MeshStandardMaterial({color:'#f7f5ee',roughness:.38});const c=new THREE.Mesh(new THREE.CylinderGeometry(.244,.244,.23,64),mat);g.add(c);for(let i=0;i<44;i++){const a=i*Math.PI*2/44,m=new THREE.Mesh(new THREE.BoxGeometry(.012,.20,.014),mat);m.position.set(Math.sin(a)*.243,0,Math.cos(a)*.243);m.rotation.y=a;g.add(m)}return g;}
 const cap=makeCap();cap.position.y=3.83;bottle.add(cap);const tableCap=makeCap();tableCap.position.set(-.06,.12,.4);tableCap.rotation.z=.12;scene.add(tableCap);
 const amber=new THREE.Color('#dc861b');
 const bottlePlane=new THREE.Plane(new THREE.Vector3(0,-1,0),3.2);
 const drinkMat=new THREE.MeshPhysicalMaterial({color:amber,roughness:.08,metalness:0,clearcoat:1,transparent:true,opacity:.86,side:THREE.DoubleSide,envMapIntensity:.4,clippingPlanes:[bottlePlane]});
 const innerGeo=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(Math.max(0,r-.025),y)),96);const bottleDrink=new THREE.Mesh(innerGeo,drinkMat);bottleDrink.renderOrder=2;bottle.add(bottleDrink);
 const glassX=.84,glass=new THREE.Group();glass.position.x=glassX;scene.add(glass);
 const glassProfile=[[0,.025],[.38,.025],[.48,.07],[.54,.19],[.61,.55],[.64,1.04],[.615,1.56],[.555,2.1],[.535,2.1],[.595,1.56],[.62,1.04],[.59,.55],[.52,.2],[.44,.12],[0,.12]];
 const glassMat=new THREE.MeshPhysicalMaterial({color:'#ffffff',roughness:.025,transmission:1,thickness:.075,ior:1.51,envMapIntensity:1.4,side:THREE.DoubleSide,depthWrite:false});
 const glassBody=new THREE.Mesh(new THREE.LatheGeometry(glassProfile.map(([r,y])=>new THREE.Vector2(r,y)),128),glassMat);glassBody.castShadow=true;glassBody.renderOrder=4;glass.add(glassBody);
 const rim=new THREE.Mesh(new THREE.TorusGeometry(.545,.012,12,128),new THREE.MeshPhysicalMaterial({color:'#ffffff',metalness:0,roughness:.045,transmission:.8,thickness:.025,ior:1.51}));rim.rotation.x=Math.PI/2;rim.position.y=2.1;glass.add(rim);
 const glassDrinkMat=new THREE.MeshPhysicalMaterial({color:'#be7a21',roughness:.08,metalness:0,clearcoat:.3,envMapIntensity:.5,transparent:true,opacity:.88,side:THREE.DoubleSide});
 const glassDrink=new THREE.Mesh(new THREE.CylinderGeometry(.44,.44,.01,96),glassDrinkMat);glassDrink.renderOrder=2;glass.add(glassDrink);
 const rand=i=>{const n=Math.sin(i*127.1+42.7)*43758.5453;return n-Math.floor(n)};
 const beadGeo=new THREE.SphereGeometry(1,10,8);const dewMat=new THREE.MeshPhysicalMaterial({color:'#ffffff',roughness:.025,transmission:1,thickness:.025,ior:1.333,envMapIntensity:1.2,depthWrite:false});
 const dew=[];for(let i=0;i<74;i++){const a=(rand(i+10)-.5)*2.3,y=i<52?2.73+rand(i+100)*.48:.35+rand(i+100)*.25,r=.003+rand(i+200)*.009;const radius=y>2.9?.54-(y-2.9)*.55:.578;const m=new THREE.Mesh(beadGeo,dewMat);m.position.set(Math.sin(a)*(radius+.005),y,Math.cos(a)*(radius+.005));m.scale.set(r,r*1.25,r*.55);bottle.add(m);dew.push({m,y,r,a,radius,seed:rand(i+300)});}
 const fizzMat=new THREE.MeshPhysicalMaterial({color:'#fff4dc',roughness:.07,metalness:0,transmission:.6,thickness:.02,transparent:true,opacity:.38,depthWrite:false});
 const fizz=[];for(let i=0;i<38;i++){const m=new THREE.Mesh(beadGeo,fizzMat),r=.006+rand(i+500)*.007;m.scale.setScalar(r);glass.add(m);fizz.push({m,x:(rand(i+600)-.5)*.8,z:(rand(i+700)-.5)*.7,seed:rand(i+800)})}
 const streamMat=new THREE.MeshPhysicalMaterial({color:'#d9942a',roughness:.025,metalness:0,clearcoat:1,transparent:true,opacity:.86,envMapIntensity:1.4,side:THREE.DoubleSide});const stream=new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0,3,0),new THREE.Vector3(0,0,0)),48,.038,10,false),streamMat);stream.renderOrder=3;scene.add(stream);
 const ripples=[];for(let i=0;i<3;i++){const mat=new THREE.MeshBasicMaterial({color:'#f9d58a',transparent:true,opacity:.15,depthWrite:false}),m=new THREE.Mesh(new THREE.TorusGeometry(1,.007,6,80),mat);m.rotation.x=-Math.PI/2;glass.add(m);ripples.push(m)}
 const sample=[];for(let j=0;j<44;j++){let y=.15+j*3.45/43;let radius=y<2.8?.54:Math.max(.18,.54-(y-2.8)*.8);let count=Math.max(3,Math.round(radius*radius*65));for(let k=0;k<count;k++){const a=k*2.399963,r=radius*Math.sqrt(rand(j*90+k+900));sample.push(new THREE.Vector3(Math.sin(a)*r,y,Math.cos(a)*r))}}
 const neckPoint=new THREE.Vector3(0,3.73,0),temp=new THREE.Vector3();
 const ease=x=>x*x*(3-2*x),clamp=x=>Math.max(0,Math.min(1,x));let lastLevel=-1;
 function glassRadius(y){return .48+.13*Math.sin(Math.min(1,y/2.1)*Math.PI)}
 function draw(t){
  const pouring=t>=4.6&&t<10.5;const amount=t<4.6?0:t>=10.5?1:ease(clamp((t-4.8)/5.3));const level=.13+amount*1.25;
  if(pouring){const angle=-1.82+Math.sin(t*.7)*.025;bottle.rotation.z=angle;const mouth=new THREE.Vector3(glassX-.025,2.97+Math.sin(t*.5)*.025,.02);const offset=neckPoint.clone().applyAxisAngle(new THREE.Vector3(0,0,1),angle);bottle.position.copy(mouth.sub(offset));cap.visible=false;tableCap.visible=true;}
  else{bottle.rotation.set(0,0,0);bottle.position.set(-.83,0,0);cap.visible=t<4.6;tableCap.visible=t>=4.6;}
  bottle.updateMatrixWorld(true);
  const heights=sample.map(v=>temp.copy(v).applyMatrix4(bottle.matrixWorld).y).sort((a,b)=>a-b);bottlePlane.constant=heights[Math.min(heights.length-1,Math.floor((.98-amount*.4)*heights.length))];
  if(Math.abs(level-lastLevel)>1e-8){const pts=[new THREE.Vector2(0,.12),new THREE.Vector2(.44,.12)];for(let i=0;i<20;i++){const y=.13+(level-.13)*i/19;pts.push(new THREE.Vector2(glassRadius(y),y))}pts.push(new THREE.Vector2(0,level));glassDrink.geometry.dispose();glassDrink.geometry=new THREE.LatheGeometry(pts,96);lastLevel=level;}glassDrink.visible=amount>.005;
  const flow=pouring?clamp((t-4.7)/.22)*clamp((10.4-t)/.3):0;stream.visible=flow>.001;
  if(stream.visible){const start=bottle.localToWorld(neckPoint.clone());start.y-=.055;const end=new THREE.Vector3(glassX+Math.sin(t*3)*.035,level+.018,.025);const curve=new THREE.CubicBezierCurve3(start,start.clone().add(new THREE.Vector3(.08,-.22,0)),end.clone().add(new THREE.Vector3(-.025,.62,0)),end);stream.geometry.dispose();stream.geometry=new THREE.TubeGeometry(curve,64,.036*Math.sqrt(flow),12,false);const a=stream.geometry.attributes.position;for(let i=0;i<a.count;i++){const u=Math.floor(i/13)/64,c=curve.getPoint(clamp(u)),wave=1+Math.sin(u*34-t*19)*.055;a.setXYZ(i,c.x+(a.getX(i)-c.x)*wave,a.getY(i),c.z+(a.getZ(i)-c.z)*wave)}stream.geometry.computeVertexNormals();}
  for(const f of fizz){f.m.visible=amount>.03;f.m.position.set(f.x,.14+((t*.24+f.seed)%1)*Math.max(.01,level-.18),f.z);}
  for(let i=0;i<ripples.length;i++){const f=((t*1.3+i/3)%1),m=ripples[i];m.visible=flow>.05;m.position.set(Math.sin(t*3)*.035,level+.008,.025);m.scale.setScalar(.035+f*.38);m.material.opacity=(1-f)*.22;}
  for(let i=0;i<dew.length;i++){const d=dew[i],run=i%19===0&&t<4.6?Math.pow(clamp((t-1.5-d.seed)/2.5),2)*.22:0;d.m.position.y=d.y-run;d.m.scale.y=d.r*(1.25+run*3);}
  if(t<2.3){camera.position.set(.05,2.3,13.3-t*.85);camera.lookAt(0,1.45,0)}
  else if(t<4.6){const u=(t-2.3)/2.3;camera.position.set(-.83,3.04,5.9-u*.8);camera.lookAt(-.83,2.67,0)}
  else if(t<10.5){camera.position.set(.10,2.6,12.3-(t-4.6)*.42);camera.lookAt(.05,1.75,0)}
  else{const u=clamp((t-10.5)/(duration-10.5-.65));camera.position.set(0,2.3,14.4-u*3.5);camera.lookAt(0,1.43,0)}
  // The distant set follows the dolly more slowly than foreground objects.
  const endMove=clamp((t-10.5)/(duration-10.5-.65));
  const crop=t<2.3?1-t*.03:t<4.6?.87-(t-2.3)*.02:t<10.5?.97-(t-4.6)*.021:.97-endMove*.16;
  backdrop.repeat.set(crop,crop);backdrop.offset.set((1-crop)/2,(1-crop)/2);
  renderer.render(scene,camera);
 }
 const clock={t:0};const tl=gsap.timeline({paused:true});tl.to(clock,{t:duration,duration,ease:'none',onUpdate:()=>draw(clock.t)},0);
 const head=document.querySelector('#heading'),origin=document.querySelector('#origin'),mark=document.querySelector('#mark'),close=document.querySelector('#closing');
 gsap.set(origin,{opacity:0});tl.fromTo(head,{opacity:0,y:16},{opacity:1,y:0,duration:.5},.1).to(head,{opacity:0,duration:.25},1.9);for(const el of [mark,close])tl.fromTo(el,{opacity:0,y:12},{opacity:1,y:0,duration:.45},10.6);
 window.__timelines={kombu:tl};window.__kombuSeek=t=>{tl.seek(t,false);draw(t)};draw(0);window.__kombuReady=true;
})();
