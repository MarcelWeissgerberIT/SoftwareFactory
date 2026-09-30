import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { createMachine, processPose } from './machines.js';

const C={floor:0xe7edea,navy:0x243b49,rail:0x9eaeb1,mint:0x64cfb0,amber:0xf1b361,blue:0x739ac7};
export function createFactory(canvas,{onSelect,onArtifact,onCameraChange,onReady,onFrame}){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0xeff3f5,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.27;
 const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xeef2f4,75,150);
 const camera=new THREE.OrthographicCamera(-30,30,20,-20,.1,180);camera.position.set(-25,27,34);
 const controls=new OrbitControls(camera,canvas);controls.target.set(0,1.8,0);controls.enableDamping=true;controls.dampingFactor=.075;controls.minPolarAngle=.23;controls.maxPolarAngle=Math.PI*.43;controls.minZoom=.65;controls.maxZoom=3.8;controls.enablePan=true;controls.rotateSpeed=.5;controls.zoomSpeed=.7;
 scene.add(new THREE.HemisphereLight(0xf6fbff,0x81948d,2.5));
 const sun=new THREE.DirectionalLight(0xfff1d9,4.1);sun.position.set(-16,28,16);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-28,right:28,top:22,bottom:-22,near:1,far:85});sun.shadow.normalBias=.055;sun.shadow.bias=-.00014;sun.shadow.radius=4;scene.add(sun);
 const fill=new THREE.DirectionalLight(0xb9d9f1,2);fill.position.set(18,18,-20);scene.add(fill);
 const materials=new Map();function mat(color,metalness=.15,roughness=.72){const key=[color,metalness,roughness].join();if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,metalness,roughness}));return materials.get(key)}
 const roundedCache=new Map();function box(w,h,d,color,x=0,y=0,z=0,r=.08){const key=[w,h,d,r].join();if(!roundedCache.has(key))roundedCache.set(key,new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/3,h/3,d/3)));const m=new THREE.Mesh(roundedCache.get(key),mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;return m}
 function textTexture(text,{color='#41606b',bg=null,width=1024,height=128,size=58}={}){const c=document.createElement('canvas');c.width=width;c.height=height;const ctx=c.getContext('2d');if(bg){ctx.fillStyle=bg;ctx.fillRect(0,0,width,height)}ctx.font=`600 ${size}px Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(text,width/2,height/2);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
 function floorText(text,x,z,w=5,color='#8e9e9d'){const texture=textTexture(text,{color});const p=new THREE.Mesh(new THREE.PlaneGeometry(w,w/8),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));p.rotation.x=-Math.PI/2;p.position.set(x,.03,z);scene.add(p);return p}
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(300,300),new THREE.MeshStandardMaterial({color:0xeff2f2,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.74;ground.receiveShadow=true;scene.add(ground);
 const foundation=box(39,.65,21,0xdfe6e5,0,-.4,1,.3);scene.add(foundation);const top=box(38.8,.16,20.8,0xf5f5ed,0,-.06,1,.12);scene.add(top);
 const grid=new THREE.GridHelper(38,38,0xd7dfda,0xe8ece6);grid.position.set(0,.029,1);grid.material.transparent=true;grid.material.opacity=.6;scene.add(grid);
 floorText('SOFTWARE  FACTORY',-11,-7.8,8,'#b4bfba');floorText('ATLAS   ×   NORDA',11,8.9,6,'#a7b6b0');
 for(const x of[-18.5,18.5])for(const z of[-8.5,10.5]){const bolt=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.025,12),mat(0x9faeaa,.7));bolt.position.set(x,.035,z);scene.add(bolt)}
 const vector=(x,z)=>new THREE.Vector3(x,1.06,z);
 const curve=new THREE.CatmullRomCurve3([vector(-18,6),vector(-13,6),vector(-10,6),vector(-7,3),vector(-7,0),vector(-4,-3.8),vector(0,-3.8),vector(3,-3.8),vector(6,-2),vector(8,.3),vector(12,.3),vector(17,.3)],false,'catmullrom',.4);
 const length=curve.getLength();const rawStations=[new THREE.Vector3(-13,1,6),new THREE.Vector3(-7,1,.7),new THREE.Vector3(-2.8,1,-3.8),new THREE.Vector3(2.7,1,-3.8),new THREE.Vector3(8.3,1,.3),new THREE.Vector3(14,1,.3)];
 const positions=rawStations.map(target=>{let best=Infinity,u=0;for(let i=0;i<=1000;i++){const d=curve.getPointAt(i/1000).distanceToSquared(target);if(d<best){best=d;u=i/1000}}return u});
 const sample=curve.getSpacedPoints(260);function rail(offset,y,r,color){const pts=sample.map((p,i)=>{const t=curve.getTangentAt(i/(sample.length-1));return new THREE.Vector3(p.x+t.z*offset,y,p.z-t.x*offset)});const railCurve=new THREE.CatmullRomCurve3(pts);const mesh=new THREE.Mesh(new THREE.TubeGeometry(railCurve,240,r,6,false),mat(color,.55,.4));mesh.castShadow=true;scene.add(mesh)}
 rail(-.95,1.11,.052,0xc3c9c5);rail(.95,1.11,.052,0xc3c9c5);rail(-1,.87,.11,0x253e4c);rail(1,.87,.11,0x253e4c);rail(-1.04,.95,.022,0x7dbbaa);rail(1.04,.95,.022,0x7dbbaa);
 const dummy=new THREE.Object3D();const slatCount=Math.floor(length/.29);const slats=new THREE.InstancedMesh(new THREE.BoxGeometry(1.83,.12,.265),mat(0x718583,.43,.6),slatCount);slats.castShadow=true;slats.receiveShadow=true;scene.add(slats);
 for(let i=0;i<length/2;i++){const u=i/(length/2),p=curve.getPointAt(u),t=curve.getTangentAt(u);for(const side of[-1,1]){const foot=box(.13,.72,.17,0x92a39e,p.x+t.z*.77*side,.39,p.z-t.x*.77*side,.025);scene.add(foot);const shoe=box(.39,.06,.35,0x4e625d,foot.position.x,.05,foot.position.z,.025);scene.add(shoe)}}
 const nodes=[],pickables=[],halos=[];
 positions.forEach((u,i)=>{const p=curve.getPointAt(u),t=curve.getTangentAt(u),angle=Math.atan2(t.x,t.z)+(t.x*(-25)+t.z*34<0?Math.PI:0);const asset=createMachine(i,{reverseGate:t.x*(-25)+t.z*34<0});asset.group.position.set(p.x,0,p.z);asset.group.rotation.y=angle;scene.add(asset.group);asset.group.traverse(m=>{if(m.isMesh){m.userData.station=i;pickables.push(m)}});nodes.push({...asset,position:p.clone(),angle});const ring=new THREE.Mesh(new THREE.RingGeometry(2.58,2.64,80),new THREE.MeshBasicMaterial({color:i===1||i===5?C.blue:C.mint,transparent:true,opacity:.22,depthWrite:false,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(p.x,.04,p.z);scene.add(ring);halos.push(ring)});
 // The same carrier physically follows these branch conveyors when feedback is requested.
 function returnBelt(points,color){
  const route=new THREE.CatmullRomCurve3(points.map(([x,z])=>vector(x,z)),false,'catmullrom',.28);
  const steps=Math.ceil(route.getLength()/.28);
  const rollers=new THREE.InstancedMesh(new THREE.BoxGeometry(1.5,.11,.23),mat(color,.32,.65),steps);
  rollers.castShadow=true;rollers.receiveShadow=true;scene.add(rollers);
  for(const side of[-1,1]){const railPoints=route.getSpacedPoints(100).map((p,i)=>{const t=route.getTangentAt(i/100);return new THREE.Vector3(p.x+t.z*.82*side,1.12,p.z-t.x*.82*side)});const r=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPoints),130,.045,6,false),mat(color));scene.add(r)}
  for(let u=.12;u<.95;u+=.14){const p=route.getPointAt(u);scene.add(box(.18,.93,.2,color,p.x,.48,p.z,.02))}
  return {route,rollers,steps};
 }
 const dp=nodes[2].position,qp=nodes[4].position,bp=nodes[3].position;
 const tangentPoint=(index,distance)=>{const p=nodes[index].position.clone().addScaledVector(curve.getTangentAt(positions[index]),distance);return [p.x,p.z]};
 const returnBelts={
  design:returnBelt([[dp.x,dp.z],tangentPoint(2,.95),[dp.x+2.2,dp.z+1.5],[dp.x+1.5,dp.z+4.6],[dp.x-1.15,dp.z+4.1],[dp.x-1.9,dp.z+1.5],tangentPoint(2,-.95),[dp.x,dp.z]],0xccaa69),
  rework:returnBelt([[qp.x,qp.z],tangentPoint(4,.95),[qp.x+1.4,qp.z+2.5],[qp.x-.5,4.5],[bp.x+.4,4.3],[bp.x-1.3,.4],[bp.x-1.5,-2.1],tangentPoint(3,-.95),[bp.x,bp.z]],0xb48d87)
 };
 floorText('DESIGN  ↻',dp.x-.4,2,3,'#ac8a4c');floorText('REWORK  ↻',6.1,5.6,4,'#a17771');
 const knowledgePoints=[nodes[5].position.clone(),new THREE.Vector3(14,.055,-7.5),new THREE.Vector3(-7,.055,-7.5),nodes[1].position.clone()];knowledgePoints.forEach(p=>p.y=.06);const knowledgeCurve=new THREE.CatmullRomCurve3(knowledgePoints);const knowledgeLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints(knowledgeCurve.getPoints(120)),new THREE.LineDashedMaterial({color:0x91a9c1,dashSize:.18,gapSize:.22,transparent:true,opacity:.35}));knowledgeLine.computeLineDistances();scene.add(knowledgeLine);
 // Accumulated software artifacts share one carrier as the Auftrag travels.
 function portalTexture(revision=1,feedback=[],buildRevision=1,language='de'){
  const c=document.createElement('canvas');c.width=512;c.height=384;const ctx=c.getContext('2d');const accessible=feedback.includes('accessibility'),clarity=feedback.includes('clarity');
  const copy=language==='en'?{title:'Customer portal',orders:'My orders',order:'Order',statuses:['In progress','In review','Completed'],empty:'✓ Empty lists include guidance'}:{title:'Kundenportal',orders:'Meine Aufträge',order:'Auftrag',statuses:['In Bearbeitung','In Prüfung','Abgeschlossen'],empty:'✓ Leere Listen mit Hinweis'};
  ctx.fillStyle='#f5faf7';ctx.fillRect(0,0,512,384);ctx.fillStyle='#213847';ctx.fillRect(0,0,512,62);ctx.fillStyle='#fff';ctx.font='bold 25px Arial';ctx.fillText(copy.title,27,41);ctx.font='18px Arial';ctx.fillText('v'+revision,445,40);ctx.fillStyle='#3c5652';ctx.font='bold 23px Arial';ctx.fillText(copy.orders,26,112);
  const statuses=clarity?copy.statuses:['PROC','QA','DONE'];statuses.forEach((text,i)=>{const y=151+i*68;ctx.fillStyle=accessible?'#d9e9e0':'#e8ede9';ctx.fillRect(22,y,468,53);ctx.fillStyle=accessible?'#243b45':'#899991';ctx.font=(accessible?'bold 20':'18')+'px Arial';ctx.fillText(copy.order+' 0'+(i+1),38,y+32);ctx.fillStyle=accessible?'#245e4a':'#85998e';ctx.fillText(text,260,y+32)});
  if(buildRevision>1){ctx.fillStyle='#2c7157';ctx.font='14px Arial';ctx.fillText(copy.empty,27,378)}
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex;
 }
 const productTexture=portalTexture();const productFaces=[];
 function makeProduct(hero=false){const group=new THREE.Group();const tray=box(1.2,.16,.95,hero?0xeab05e:0xdce5df,0,0,0,.075);group.add(tray);const stages=[];for(let i=0;i<6;i++){const form=new THREE.Group();const paper=box(.84,.025,.65,0xfff8e8,0,.1,0,.013);form.add(paper);if(i<2){for(let k=0;k<3;k++){const bar=box(.48-k*.06,.018,.038,i===0?0xb2beb9:0x7094be,0,.129,.18-k*.13,.007);form.add(bar)}if(i===1)for(let j=0;j<3;j++){const card=box(.3,.04,.44,0x9fc1d9,-.37+j*.28,.16,-.12,.02);card.rotation.z=(j-1)*.12;form.add(card)}}else if(i===2){const tablet=box(1,.07,.77,0xc7a46a,0,.165,0,.025);const tabletMaterial=new THREE.MeshBasicMaterial({map:productTexture});productFaces.push(tabletMaterial);const screen=new THREE.Mesh(new THREE.PlaneGeometry(.88,.66),tabletMaterial);screen.rotation.x=-Math.PI/2;screen.position.y=.205;form.add(tablet,screen)}else{const monitor=box(1,.77,.07,0x1b3542,0,.49,0,.04);const faceMaterial=new THREE.MeshBasicMaterial({map:productTexture});productFaces.push(faceMaterial);const face=new THREE.Mesh(new THREE.PlaneGeometry(.88,.66),faceMaterial);face.position.set(0,.49,.041);const back=face.clone();back.rotation.y=Math.PI;back.position.z=-.041;form.add(monitor,face,back);if(i>3){const seal=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.035,24),mat(i===5?0x42b88e:0x9cc9aa));seal.position.set(.37,.19,.3);form.add(seal)}}stages.push(form);group.add(form);form.visible=i===0}group.userData.product=true;group.traverse(m=>{if(m.isMesh){m.userData.product=true;m.castShadow=true}});return {group,stages}}
 const hero=makeProduct(true);scene.add(hero.group);const heroHalo=new THREE.Mesh(new THREE.RingGeometry(.83,.88,40),new THREE.MeshBasicMaterial({color:0xe6a94c,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));heroHalo.rotation.x=-Math.PI/2;hero.group.add(heroHalo);heroHalo.position.y=-.04;
 hero.group.traverse(m=>{if(m.isMesh)pickables.push(m)});
 let textureKey='',activeTexture=productTexture;
 const returnDot=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),new THREE.MeshBasicMaterial({color:C.blue}));scene.add(returnDot);returnDot.visible=false;
 let selected=-1,runStage=0,progress=positions[0],isMoving=true,phase='idle',gate=null,approved=[],follow=false,fly=null,elapsed=0,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const state={};
 function fit(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);const aspect=w/h,size=Math.max(23,42/aspect);camera.left=-size*aspect/2;camera.right=size*aspect/2;camera.top=size/2;camera.bottom=-size/2;camera.updateProjectionMatrix()}
 const resize=new ResizeObserver(fit);resize.observe(canvas);fit();
 function flyTo(target,zoom){fly={from:controls.target.clone(),to:target.clone(),fromPos:camera.position.clone(),toPos:target.clone().add(new THREE.Vector3(-25,25,34)),fromZoom:camera.zoom,toZoom:zoom,start:performance.now()};if(reduced){camera.position.copy(fly.toPos);controls.target.copy(target);camera.zoom=zoom;camera.updateProjectionMatrix();fly=null}}
 function focus(index){selected=index;follow=false;const target=nodes[index].position.clone();const narrow=canvas.clientWidth<650;target.y=narrow?-7.8:1.1;flyTo(target,narrow?2.6:2.15);onCameraChange?.('station')}
 function overview(){selected=-1;follow=false;flyTo(new THREE.Vector3(0,1.8,0),1);onCameraChange?.('overview')}
 function zoom(amount){camera.zoom=THREE.MathUtils.clamp(camera.zoom*amount,.65,3.8);camera.updateProjectionMatrix();fly=null}
 function setFollow(value){follow=value;if(value){flyTo(hero.group.position.clone(),canvas.clientWidth<650?2.6:1.85)}onCameraChange?.(value?'follow':'free')}
 controls.addEventListener('start',()=>{fly=null;follow=false;onCameraChange?.('free')});
 let pointerStart=null;canvas.addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY}});const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();canvas.addEventListener('pointerup',e=>{if(!pointerStart||Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>6)return;const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(pickables,false).find(hit=>{let node=hit.object;while(node){if(!node.visible)return false;node=node.parent}return true});if(hit?.object.userData.product)onArtifact?.();else if(Number.isInteger(hit?.object.userData.station))onSelect(hit.object.userData.station)});
 const labels=[...document.querySelectorAll('[data-scene-station]')];const labelVectors=nodes.map((n,i)=>n.position.clone().add(new THREE.Vector3(0,3.35,0)));
 function updateLabels(){labels.forEach((label,i)=>{const p=labelVectors[i].clone().project(camera);label.style.transform=`translate(-50%,-100%) translate(${(p.x*.5+.5)*canvas.clientWidth}px,${(-p.y*.5+.5)*canvas.clientHeight}px)`;label.hidden=p.z>1||p.z< -1||p.x< -1.05||p.x>1.05||p.y< -1.05||p.y>1.05;label.classList.toggle('selected',selected===i);label.classList.toggle('processing',phase==='running'&&runStage===i)})}
 function placeProduct(prod,u,stage){const p=curve.getPointAt(u),t=curve.getTangentAt(u);prod.group.position.set(p.x,1.21,p.z);prod.group.rotation.y=Math.atan2(t.x,t.z);prod.stages.forEach((s,i)=>s.visible=i===stage)}
 function poseHero(){
  placeProduct(hero,Math.max(0,Math.min(.998,progress??.022)),Math.min(5,state.formStage||0));
  if(state.returnRoute){const route=returnBelts[state.returnRoute].route,u=THREE.MathUtils.clamp(state.returnProgress||0,0,1);const p=route.getPointAt(u),t=route.getTangentAt(u);hero.group.position.set(p.x,1.21,p.z);hero.group.rotation.y=Math.atan2(t.x,t.z)}
  else if(state.cycle!==null&&state.cycle!==undefined){const pose=processPose(state.cycle);hero.group.position.y+=pose.lift;hero.group.rotation.y+=pose.turn}
 }
 function apply(next){Object.assign(state,next);selected=next.selected;runStage=next.runStage;progress=next.progress;phase=next.phase;isMoving=(phase==='running'&&next.cycle===null)||phase==='returning';gate=next.gate;approved=next.approved||[];
  const language=state.language==='en'?'en':'de';nodes.forEach(machine=>machine.setLanguage(language));
  const key=[language,next.designRevision,...(next.appliedDesignFeedback||[]),next.buildRevision].join(':');if(key!==textureKey){textureKey=key;const tex=portalTexture(next.designRevision,next.appliedDesignFeedback||[],next.buildRevision,language);for(const m of productFaces){m.map=tex;m.needsUpdate=true}activeTexture.dispose();activeTexture=tex}
  poseHero();
 }
 let last=0,frame=0,alive=true;
 function animate(now){if(!alive)return;requestAnimationFrame(animate);const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(document.hidden)return;frame++;if(isMoving&&!reduced)elapsed+=dt*(state.speed||1);const offset=(elapsed*.015)%1;for(let i=0;i<slatCount;i++){const u=(i/slatCount+offset/5)%1,p=curve.getPointAt(u),t=curve.getTangentAt(u);dummy.position.set(p.x,1.025,p.z);dummy.rotation.set(0,Math.atan2(t.x,t.z),0);dummy.updateMatrix();slats.setMatrixAt(i,dummy.matrix)}slats.instanceMatrix.needsUpdate=true;
 const time=reduced?0:now/1000;
 for(const [name,belt] of Object.entries(returnBelts)){for(let i=0;i<belt.steps;i++){const u=(i/belt.steps+(state.returnRoute===name?(state.returnProgress||0)/5:0))%1,p=belt.route.getPointAt(u),t=belt.route.getTangentAt(u);dummy.position.set(p.x,1.025,p.z);dummy.rotation.set(0,Math.atan2(t.x,t.z),0);dummy.updateMatrix();belt.rollers.setMatrixAt(i,dummy.matrix)}belt.rollers.instanceMatrix.needsUpdate=true}
 nodes.forEach((m,i)=>{const waiting=(i===2&&!approved.includes('plan'))||(i===4&&!approved.includes('acceptance'))||(i===5&&!approved.includes('knowledge'));const processing=i===runStage&&state.cycle!==null&&state.cycle!==undefined&&!state.returnRoute;const pose=processing?processPose(state.cycle):null;m.animate?.(time,processing&&phase==='running'?1:0,!waiting,processing?{cycle:state.cycle,...pose,revision:i===2?state.designRevision:state.buildRevision,mode:i===2?'design':i===3?'build':'process',appliedDesignFeedback:state.appliedDesignFeedback}: {cycle:null,revision:i===2?state.designRevision:state.buildRevision,appliedDesignFeedback:state.appliedDesignFeedback});halos[i].material.opacity=selected===i?.65:processing?.4:.12});
 poseHero();heroHalo.material.opacity=phase==='gate'?.9:.55;heroHalo.scale.setScalar(1+(reduced?0:Math.sin(time*2)*.035));returnDot.visible=phase==='complete';knowledgeLine.material.opacity=returnDot.visible?.8:.35;if(returnDot.visible){returnDot.position.copy(knowledgeCurve.getPointAt((time*.11)%1));returnDot.position.y=.15}

 if(fly){const t=Math.min(1,(now-fly.start)/950),ease=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;controls.target.lerpVectors(fly.from,fly.to,ease);camera.position.lerpVectors(fly.fromPos,fly.toPos,ease);camera.zoom=THREE.MathUtils.lerp(fly.fromZoom,fly.toZoom,ease);camera.updateProjectionMatrix();if(t===1)fly=null}else if(follow){const target=hero.group.position.clone();const delta=target.sub(controls.target).multiplyScalar(.035);controls.target.add(delta);camera.position.add(delta)}controls.update();updateLabels();renderer.render(scene,camera);onFrame?.();if(frame===2)onReady?.()}
 requestAnimationFrame(animate);
 return {focus,overview,zoom,setFollow,apply,positions,dispose(){alive=false;resize.disconnect();controls.dispose();renderer.dispose()}};
}
