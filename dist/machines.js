import * as THREE from 'three';
import { getDemoEvidence } from './demo-evidence.js';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';

// Local space: the carrier travels +Z at y=1.0, within x=±0.85.
// All presentation, simulation state and lighting remain owned by the scene.
const C = { ivory: '#eef1eb', graphite: '#1b3040', mint: '#52c6a4', blue: '#577dae', amber: '#efa754', base: '#b9c1ba', pale: '#d5dcd5', dark: '#10202c' };
const geometries = new Map();
const materials = new Map();
const TAU = Math.PI * 2;
const LABEL_EN = {
  'KUNDENPORTAL':'CUSTOMER PORTAL',
  'ZIEL  ·  UMFANG  ·  ERFOLG':'GOAL  ·  SCOPE  ·  SUCCESS',
  'QUELLEN':'SOURCES',
  '3 ARBEITSPAKETE':'3 WORK PACKAGES',
  'FREIGABE':'APPROVAL',
  'PRÜFUNG':'REVIEW',
  'ABNAHME':'ACCEPTANCE',
  'ABGENOMMEN':'ACCEPTED',
  'WISSEN':'KNOWLEDGE'
};
function translatedLabel(text,language){return language==='en'?(LABEL_EN[text]||text.replace(/^VARIANTE /,'VARIANT ')):text;}
function paintLabel(face,language){
  const {text,fg,bg,size}=face.userData.label;
  const canvas=face.material.map.image,ctx=canvas.getContext('2d');
  ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle=fg;ctx.font=`600 ${size}px Arial, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(translatedLabel(text,language),canvas.width/2,canvas.height/2,472);
  face.material.map.needsUpdate=true;
}
function mat(color, metalness = .12, roughness = .55) {
  const key = `${color}:${metalness}:${roughness}`;
  if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({ color, metalness, roughness }));
  return materials.get(key);
}
function roundGeo(w,h,d,r=.07) {
  r = Math.min(r, w*.24, h*.24, d*.24);
  const key = `r:${w}:${h}:${d}:${r}`;
  if (!geometries.has(key)) geometries.set(key, new RoundedBoxGeometry(w,h,d,2,r));
  return geometries.get(key);
}
function mesh(parent, geometry, material, x=0,y=0,z=0) {
  const m = new THREE.Mesh(geometry,material);
  m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m;
}
function box(p,w,h,d,x,y,z,color=C.ivory,r=.055) { return mesh(p,roundGeo(w,h,d,r),mat(color),x,y,z); }
function cylinder(p,radius,height,x,y,z,color=C.graphite,topRadius=radius) {
  const key=`c:${radius}:${height}:${topRadius}`;
  if(!geometries.has(key)) geometries.set(key,new THREE.CylinderGeometry(topRadius,radius,height,24));
  return mesh(p,geometries.get(key),mat(color,.35,.4),x,y,z);
}
function sphere(p,r,x,y,z,color) {
  const key=`s:${r}`; if(!geometries.has(key))geometries.set(key,new THREE.SphereGeometry(r,16,12));
  return mesh(p,geometries.get(key),mat(color,.3,.35),x,y,z);
}
function label(p,text,w,h,x,y,z,fg=C.graphite,bg=C.ivory,size=44) {
  const canvas=document.createElement('canvas'); canvas.width=512; canvas.height=Math.max(64,Math.round(512*h/w));
  const texture=new THREE.CanvasTexture(canvas); texture.colorSpace=THREE.SRGBColorSpace; texture.anisotropy=4;
  const surface=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,toneMapped:false});
  const face=mesh(p,new THREE.PlaneGeometry(w,h),surface,x,y,z);face.castShadow=false;face.userData.label={text,fg,bg,size};paintLabel(face,'en');return face;
}
function bolt(p,x,y,z) { const b=cylinder(p,.025,.017,x,y,z,C.graphite);b.rotation.x=Math.PI/2;return b; }
function panel(p,w,h,d,x,y,z,color=C.ivory) {
  const body=box(p,w,h,d,x,y,z,color);
  for(const dx of [-w/2+.07,w/2-.07])for(const dy of [-h/2+.07,h/2-.07])bolt(p,x+dx,y+dy,z+d/2+.01);
  return body;
}
function vents(p,x,y,z,count=5,width=.5) {for(let i=0;i<count;i++)box(p,width,.026,.018,x,y-i*.09,z,C.graphite,.006);}
function statusLight(p,x,y,z,color=C.mint) {
  const housing=cylinder(p,.10,.065,x,y,z,C.graphite); housing.rotation.x=Math.PI/2;
  const m = mesh(p,new THREE.SphereGeometry(.065,16,10),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.30,roughness:.25}),x,y,z+.047);
  m.scale.z=.45; return m;
}
function foot(p,x,z,w=.6,d=.6) {box(p,w,.13,d,x,.065,z,C.base);box(p,w*.7,.13,d*.7,x,.18,z,C.graphite);}
function pillar(p,x,z,h=2.6,color=C.ivory) {foot(p,x,z);panel(p,.22,h,.28,x,h/2+.22,z,color);}
function badge(p,text,x,y,z,color=C.mint,w=.84) {box(p,w+.06,.27,.045,x,y,z,C.graphite,.035);label(p,text,w,.20,x,y,z+.028,color,C.graphite,46);}
function paper(p,x,y,z,w=.8,h=.06,d=.72,color=C.ivory) {
  const doc=new THREE.Group();p.add(doc);doc.position.set(x,y,z);box(doc,w,h,d,0,0,0,color,.025);
  for(let i=0;i<3;i++)box(doc,w*(i===0?.57:.72),.007,.025,-w*.05,h/2+.007,-d*.22+i*.12,i===0?C.blue:C.base,.002);
  return doc;
}
function monitor(p,x,y,z,w=1.65,h=1.08,title='KUNDENPORTAL') {
  const screen=new THREE.Group();screen.position.set(x,y,z);p.add(screen);
  box(screen,w,h,.14,0,0,0,C.graphite,.07);box(screen,w-.13,h-.13,.035,0,0,.09,C.ivory,.025);
  box(screen,w-.15,.17,.025,0,h/2-.15,.12,C.graphite,.014);
  label(screen,title,w-.24,.115,0,h/2-.15,.137,C.ivory,C.graphite,32);
  const rowWidth=w-.4;
  for(let i=0;i<3;i++){
    const yy=h*.16-i*h*.23;
    box(screen,rowWidth,.12,.015,0,yy,.12,'#dce5df',.018);
    box(screen,rowWidth*.38,.032,.009,-rowWidth*.21,yy,.135,C.blue,.008);
    box(screen,rowWidth*.20,.058,.012,rowWidth*.30,yy,.14,i===2?C.amber:C.mint,.014);
  }
  return screen;
}
function barrier(p,z=1.3) {
  if(p.userData.reverseGate) z=-z;
  const x=-1.27;foot(p,x,z,.46,.48);panel(p,.30,1.12,.34,x,.83,z,C.graphite);
  statusLight(p,x,1.02,z+.19,C.amber);
  const pivot=new THREE.Group();pivot.position.set(x,1.48,z);p.add(pivot);
  box(pivot,2.52,.15,.14,1.20,0,0,C.amber,.04);
  for(let i=0;i<5;i++)box(pivot,.16,.154,.145,.34+i*.44,0,0,C.ivory,.012);
  const cap=cylinder(p,.16,.36,x,1.48,z,C.graphite);cap.rotation.x=Math.PI/2;
  return open=>{pivot.rotation.z=open?Math.PI*.47:0;};
}
function sourceShelf(p,x,y,z,w=1.08,levels=4,color=C.blue) {
  panel(p,w,levels*.26+.3,.58,x,y,z,C.ivory);
  box(p,w-.11,levels*.26+.12,.027,x,y,z+.304,C.graphite,.025);
  const plates=[];
  for(let i=0;i<levels;i++){
    const yy=y-(levels-1)*.13+i*.26;
    box(p,w-.20,.04,.38,x,yy-.09,z+.2,C.base,.01);
    const plate=box(p,w-.32,.12,.34,x,yy,z+.28,color,.018);plates.push(plate);
    box(p,.25,.025,.014,x-.19,yy,z+.459,C.ivory,.005);
    statusLight(p,x+w*.30,yy,z+.464,i%2?C.mint:color).scale.setScalar(.45);
  }
  return plates;
}

function intake(p) {
  // Side desk, actual document stack, folded feeder and an articulated brass lamp.
  foot(p,-1.92,-.1,1.40,1.63);panel(p,1.25,.88,1.38,-1.92,.70,-.10);
  box(p,1.55,.15,1.60,-1.85,1.21,-.10,C.graphite,.065);
  panel(p,.87,.7,.70,-1.91,1.62,-.46,C.ivory);
  box(p,.66,.16,.026,-1.91,1.63,-.09,C.graphite,.025);
  badge(p,'BRIEF',-1.91,1.85,-.082,C.mint,.6);
  const feed=paper(p,-1.48,1.39,.17,.69,.045,.85);feed.rotation.z=-.12;
  box(p,.65,.065,1.1,-1.30,1.22,.04,C.base); // Cantilever stops outside carrier clearance.
  for(let i=0;i<4;i++)paper(p,-2.2,1.32+i*.055,.41,.54,.043,.50);
  vents(p,-1.91,.90,.602,4,.72);
  const lamp=new THREE.Group();lamp.position.set(-2.32,1.32,-.72);p.add(lamp);
  cylinder(lamp,.15,.055,0,0,0,C.amber);cylinder(lamp,.037,.65,0,.32,0,C.amber);
  const neck=box(lamp,.58,.047,.047,.20,.63,0,C.amber,.01);neck.rotation.z=-.18;
  const shade=cylinder(lamp,.17,.16,.47,.57,0,C.amber,.075);shade.rotation.z=.15;
  cylinder(lamp,.135,.01,.47,.493,0,'#fff1c7');
  const sign=label(p,'ZIEL  ·  UMFANG  ·  ERFOLG',1.08,.16,-1.90,1.07,.706,C.graphite,C.ivory,31);
  return (t,a,g,process)=>{feed.position.z=.17+(process?Math.sin(process.work*Math.PI)*.12:0);};
}
function atlas(p) {
  foot(p,-1.93,-.12,1.48,1.42);panel(p,1.30,2.62,1.12,-1.94,1.60,-.15,C.ivory);
  box(p,1.12,.24,1.0,-1.94,2.87,-.14,C.blue);
  badge(p,'ATLAS',-1.94,2.91,.43,C.ivory,.9);
  const plates=sourceShelf(p,-1.94,1.70,.19,1.10,5,C.blue);
  label(p,'QUELLEN',.8,.15,-1.94,.82,.437,C.graphite,C.ivory,44);
  vents(p,-1.94,.60,.42,3,.85);
  // Visible knowledge bridge conveys that context enters, rather than an opaque machine.
  pillar(p,1.27,-.78,1.80,C.blue);box(p,3.34,.12,.19,-.40,2.27,-.78,C.graphite);
  box(p,2.70,.027,.21,-.21,2.35,-.78,C.blue,.009);
  const sources=[];for(let i=0;i<3;i++){const s=paper(p,-.8+i*.6,2.08,-.78,.37,.055,.36,i===1?C.pale:C.ivory);sources.push(s);}
  const scanner=box(p,.20,.18,.35,.70,2.10,-.78,C.blue);
  statusLight(p,1.27,1.9,-.60,C.blue);
  return(t,a,g,process)=>{sources.forEach((s,i)=>{s.position.y=2.08;});plates.forEach((s,i)=>s.position.z=.47+(process&&i===(process.revision%5)?process.engaged*.12:0));scanner.position.x=process?-.7+1.4*process.work:.70;};
}
function plan(p) {
  foot(p,-2.05,-.12,1.15,1.72);box(p,.14,1.95,.17,-2.48,1.17,-.23,C.graphite);box(p,.14,1.95,.17,-1.28,1.17,-.23,C.graphite);
  panel(p,1.50,1.58,.16,-1.89,2.24,-.16,C.ivory);
  box(p,1.37,.29,.03,-1.89,2.86,-.055,C.graphite,.02);label(p,'DESIGN + PLAN',1.24,.18,-1.89,2.86,-.035,C.mint,C.graphite,37);
  const tiles=[];
  for(let col=0;col<3;col++){
    const x=-2.37+col*.48;box(p,.405,.91,.028,x,2.10,-.052,'#e0e5dd',.027);
    box(p,.35,.09,.034,x,2.63,-.031,[C.blue,C.mint,C.amber][col],.015);
    for(let row=0;row<(col===0?3:2);row++){
      const tile=box(p,.32,.18,.055,x,2.38-row*.26,-.025,[C.blue,C.mint,C.amber][col],.024);tiles.push(tile);
      box(p,.19,.023,.012,x-.015,2.38-row*.26,.010,C.ivory,.004);
    }
  }
  label(p,'3 ARBEITSPAKETE',1.2,.12,-1.89,1.60,-.047,C.graphite,C.ivory,35);
  // Human decision console is visually different from automatic processing.
  foot(p,1.45,.76,.58,.72);box(p,.17,1.26,.17,1.45,.83,.76,C.graphite);panel(p,.70,.30,.59,1.45,1.50,.76,C.ivory);
  const approve=cylinder(p,.14,.07,1.45,1.70,.85,C.amber);badge(p,'FREIGABE',1.45,1.49,1.063,C.amber,.56);
  const open=barrier(p,1.30);
  return(t,a,g,process)=>{open(g);approve.position.y=1.70;tiles.forEach((tile,i)=>tile.position.z=-.025+(process&&i===process.revision%tiles.length?.03*process.engaged:0));};
}
function robotArm(p,x,z,mirror=1) {
  foot(p,x,z,.72,.83);cylinder(p,.24,.75,x,.58,z,C.graphite);cylinder(p,.27,.13,x,.99,z,C.ivory);
  const base=new THREE.Vector3(x,1.10,z);
  const shoulder=sphere(p,.16,x,1.10,z,C.mint);
  const elbow=sphere(p,.135,x,1.90,z,C.graphite);
  const upper=box(p,.18,1,.22,0,0,0,C.ivory);
  const forearm=box(p,.15,1,.19,0,0,0,C.ivory);
  const upperStripe=box(p,.055,1,.232,0,0,0,C.graphite,.01);
  const foreStripe=box(p,.065,1,.202,0,0,0,C.mint,.018);
  const wrist=new THREE.Group();p.add(wrist);box(wrist,.16,.20,.22,0,0,0,C.graphite);
  const fingers=[];
  for(const zz of [-1,1])fingers.push(box(wrist,.14,.085,.036,-mirror*.055,0,zz*.12,C.base,.012));
  const pad=box(wrist,.035,.14,.13,-mirror*.09,0,0,C.mint,.011);
  return(t,a,process)=>{
    const engage=process?.engaged||0;
    const park=new THREE.Vector3(x*.79,2.21,z);
    const grip=new THREE.Vector3(mirror*.708,1.21+(process?.lift||0),mirror*.18);
    // Grip the same pallet edge as the lift clamps, using the root's exact yaw.
    grip.applyAxisAngle(new THREE.Vector3(0,1,0),process?.turn||0);
    const target=park.lerp(grip,engage);
    const delta=target.clone().sub(base);const distance=delta.length();const direction=delta.clone().normalize();
    const L1=.96,L2=.97;const along=(L1*L1-L2*L2+distance*distance)/(2*distance);
    const bend=new THREE.Vector3(0,1,0).addScaledVector(direction,-direction.y).normalize();
    const joint=base.clone().addScaledVector(direction,along).addScaledVector(bend,Math.sqrt(Math.max(0,L1*L1-along*along)));
    elbow.position.copy(joint);poseLink(upper,base,joint);poseLink(upperStripe,base,joint,.68);
    poseLink(forearm,joint,target);poseLink(foreStripe,joint,target,.63);
    wrist.position.copy(target);wrist.rotation.y=process?.turn||0;
    fingers.forEach((f,i)=>f.position.z=(i?1:-1)*(.12-.045*engage));
  };
}
function build(p) {
  const arm1=robotArm(p,-1.54,-.70,-1),arm2=robotArm(p,1.54,.58,1);
  // Rear engineering monitor and perimeter frame, with fully open belt.
  pillar(p,-1.26,-1.15,2.70);pillar(p,1.26,-1.15,2.70);
  box(p,2.89,.22,.29,0,2.99,-1.15,C.ivory);badge(p,'ONE',0,3.00,-.991,C.mint,.84);
  box(p,.15,.55,.15,-2.18,1.14,.57,C.graphite);foot(p,-2.18,.57,.80,.80);
  const screen=monitor(p,-2.15,1.85,.66,1.14,.87,'BUILD');screen.rotation.y=.30;
  const fan=new THREE.Group();fan.position.set(1.29,2.72,-.965);p.add(fan);
  for(let i=0;i<4;i++){const blade=box(fan,.19,.06,.012,.07,0,0,C.graphite,.015);blade.rotation.z=i*Math.PI/2;blade.position.set(Math.cos(i*Math.PI/2)*.09,Math.sin(i*Math.PI/2)*.09,0);}
  box(p,.12,.09,2.01,-1.09,2.65,-.18,C.graphite);box(p,.12,.09,2.01,1.09,2.65,-.18,C.graphite);
  return(t,a,g,process)=>{arm1(t,a,process);arm2(t,a,process);fan.rotation.z=process?process.work*TAU*2:0;};
}
function quality(p) {
  for(const x of [-1.23,1.23]){
    pillar(p,x,-.65,2.39);box(p,.13,.10,2.08,x,2.66,.0,C.graphite);
    foot(p,x,1.05,.45,.50);box(p,.16,2.40,.16,x,1.4,1.05,C.ivory);
  }
  panel(p,2.89,.36,.37,0,2.84,-.68,C.ivory);badge(p,'QA',0,2.85,-.48,C.blue,.65);
  const scan=new THREE.Group();p.add(scan);scan.position.set(0,2.51,-.25);
  box(scan,2.55,.15,.27,0,0,0,C.graphite);box(scan,1.96,.025,.16,0,-.09,0,C.blue,.01);
  const beamMaterial=new THREE.MeshBasicMaterial({color:C.blue,transparent:true,opacity:.07,side:THREE.DoubleSide,depthWrite:false});
  const beam=mesh(scan,new THREE.PlaneGeometry(1.85,1.25),beamMaterial,0,-.72,0);beam.castShadow=false;
  foot(p,1.91,-.34,.60,.96);panel(p,.50,1.66,.62,1.91,1.05,-.34,C.graphite);
  const lights=[];for(let i=0;i<3;i++){lights.push(statusLight(p,1.91,1.57-i*.29,-.005,C.mint));}
  label(p,'PRÜFUNG',.42,.11,1.91,.47,-.023,C.ivory,C.graphite,35);
  badge(p,'ABNAHME',-1.72,.72,1.25,C.amber,.78);
  const open=barrier(p,1.30);
  return(t,a,g,process)=>{const work=process?.work||0;scan.position.set(0,2.76,process?-.78+1.42*work:-.78);const lower=1.12+(process?.lift||0);const upper=2.66;beam.position.y=(lower+upper)/2-2.76;beam.scale.y=(upper-lower)/1.25;beamMaterial.opacity=process?.engaged?(.035+.065*process.working):0;lights.forEach((l,i)=>l.material.emissiveIntensity=process&&work>(i+1)/4?.8:.15);open(g);};
}
function knowledge(p) {
  // Product remains visible; only knowledge plates travel back to the archive.
  for(const x of [-1.26,1.26]){foot(p,x,-1.20,.48,.65);box(p,.16,1.50,.20,x,.97,-1.20,C.graphite);}
  const display=monitor(p,0,2.11,-1.12,2.08,1.41,'KUNDENPORTAL');
  box(p,1.36,.09,.46,0,1.36,-.94,C.base);badge(p,'ABGENOMMEN',0,1.42,-.689,C.mint,1.26);
  foot(p,-2.05,.22,1.40,1.47);panel(p,1.26,2.02,1.04,-2.05,1.34,.20,C.ivory);
  badge(p,'ATLAS',-2.05,2.13,.749,C.blue,.9);
  const plates=sourceShelf(p,-2.05,1.39,.39,1.08,3,C.blue);
  label(p,'WISSEN',.8,.15,-2.05,.62,.729,C.graphite,C.ivory,42);
  // Small return conveyor beside, above, and separate from the main production belt.
  box(p,1.02,.09,.45,-1.27,1.54,.22,C.graphite);
  for(let i=0;i<6;i++){const roller=cylinder(p,.045,.39,-1.70+i*.15,1.61,.22,C.base);roller.rotation.x=Math.PI/2;}
  const copy=paper(p,-1.22,1.69,.22,.46,.065,.34,C.blue);
  box(copy,.31,.016,.018,0,.040,-.03,C.ivory,.003);
  const arch=box(p,.065,.61,.59,-1.69,1.84,.23,C.blue);
  box(p,.20,.09,.60,-1.68,2.17,.23,C.blue);
  statusLight(p,-1.69,2.14,.54,C.mint);
  return(t,a,g,process)=>{copy.visible=Boolean(process&&process.cycle>.32&&process.cycle<.90);if(process){const k=process.work;copy.position.set(THREE.MathUtils.lerp(-.20,-1.90,k),THREE.MathUtils.lerp(1.38+process.lift,1.69,k)+Math.sin(k*Math.PI)*.25,THREE.MathUtils.lerp(.27,.45,k));copy.rotation.y=process.turn*(1-k);}plates.forEach((s,i)=>s.position.z=.67+(process&&i===process.revision%3?process.work*.07:0));};
}

const Y_AXIS = new THREE.Vector3(0,1,0);
const clamp01=value=>THREE.MathUtils.clamp(Number(value)||0,0,1);
function smooth(a,b,value){const t=clamp01((value-a)/(b-a));return t*t*(3-2*t);}
function poseLink(object,from,to,lengthScale=1){
  const delta=to.clone().sub(from);object.position.copy(from).add(to).multiplyScalar(.5);
  object.quaternion.setFromUnitVectors(Y_AXIS,delta.clone().normalize());object.scale.y=delta.length()*lengthScale;
}

/** Exact shared carrier pose, in metres/radians. Cycles may be sampled in any order.
 *  0–.18 clamp; .18–.38 lift; .38–.68 work; .68–.88 lower; .88–1 release.
 *  The hero's centre is (0, 1.21 + lift, 0), rotated locally around Y by turn.
 */
export function processPose(cycle){
  const c=clamp01(cycle);
  return {
    lift:.5*smooth(.18,.38,c)*(1-smooth(.68,.88,c)),
    turn:c>.38&&c<.68?Math.sin(Math.PI*smooth(.38,.68,c))*.16:0
  };
}
function resolvedProcess(input){
  if(!input||!Number.isFinite(input.cycle))return null;
  const cycle=clamp01(input.cycle),pose=processPose(cycle);
  return {...input,cycle,
    lift:Number.isFinite(input.lift)?THREE.MathUtils.clamp(input.lift,0,.5):pose.lift,
    turn:Number.isFinite(input.turn)?input.turn:pose.turn,
    revision:Math.max(0,Math.floor(Number(input.revision)||0)),
    engaged:smooth(0,.18,cycle)*(1-smooth(.88,1,cycle)),
    working:smooth(.38,.43,cycle)*(1-smooth(.63,.68,cycle)),
    work:smooth(.38,.68,cycle)
  };
}

// Shared precision lift. Its rubber pads meet the carrier's x=±.60 sides and
// its platform meets the carrier underside y=1.13, so the lift never floats.
function liftCradle(parent,index){
  const frame=new THREE.Group();frame.name='carrier-lift';parent.add(frame);
  box(frame,.85,.13,.71,0,.27,0,C.graphite);cylinder(frame,.20,.38,0,.49,0,C.base);
  const piston=cylinder(frame,.09,1,0,.6,0,C.ivory);
  const cradle=new THREE.Group();cradle.name='carrier-contact-frame';frame.add(cradle);
  box(cradle,.99,.08,.80,0,0,0,C.graphite,.035);
  for(const x of [-.36,.36])box(cradle,.19,.014,.74,x,.047,0,C.base,.014);
  box(cradle,.92,.028,.025,0,-.018,.412,index===1||index===5?C.blue:C.mint,.008);
  const jaws=[];
  for(const side of [-1,1]){
    box(cradle,.60,.058,.18,side*.79,-.035,-.30,C.base,.018);
    const jaw=new THREE.Group();jaw.name=side<0?'carrier-clamp-left':'carrier-clamp-right';cradle.add(jaw);jaws.push({jaw,side});
    box(jaw,.115,.23,.24,side*.049,.087,-.30,C.graphite,.026);
    // Contact face at x=±.60; centre height 1.21 matches the tray centre.
    box(jaw,.09,.16,.20,0,.12,-.30,C.mint,.015);
    bolt(jaw,side*.083,.16,-.165);
  }
  const braces=[];
  for(const z of [-.24,.24])for(const side of [-1,1]){
    const rod=box(frame,.06,1,.07,0,0,0,C.base,.018);braces.push({rod,z,side});
  }
  return process=>{
    const lift=process?.lift||0,engage=process?.engaged||0;
    cradle.position.y=1.005+.085*engage+lift;cradle.rotation.y=process?.turn||0;
    piston.scale.y=cradle.position.y-.48;piston.position.y=(cradle.position.y+.48)/2;
    jaws.forEach(({jaw,side})=>jaw.position.x=side*THREE.MathUtils.lerp(1.055,.645,engage));
    braces.forEach(({rod,z,side})=>poseLink(rod,new THREE.Vector3(side*.33,.35,z),new THREE.Vector3(-side*.33,cradle.position.y-.05,z)));
  };
}

function intakePress(parent){
  pillar(parent,1.18,-.35,2.23,C.ivory);
  box(parent,1.45,.14,.22,.54,2.61,-.35,C.graphite);
  box(parent,.23,.14,.60,-.07,2.61,-.09,C.graphite);
  badge(parent,'BRIEFING',1.18,2.11,-.192,C.mint,.56);
  const guide=cylinder(parent,.045,1,0,2.08,0,C.base);
  const head=new THREE.Group();head.name='brief-contact-stamp';parent.add(head);
  cylinder(head,.13,.14,0,.18,0,C.ivory);box(head,.26,.075,.18,0,.047,0,C.graphite,.025);
  box(head,.23,.015,.15,0,.002,0,C.mint,.011);
  return process=>{
    const e=process?.engaged||0;
    const contactY=1.347+(process?.lift||0);
    head.position.set(0,THREE.MathUtils.lerp(2.21,contactY+.12*(1-(process?.working||0)),e),0);
    head.rotation.y=process?.turn||0;
    const lo=head.position.y+.25,hi=2.60;guide.position.y=(hi+lo)/2;guide.scale.y=Math.max(.01,hi-lo);
  };
}

function contextConnector(parent){
  // A telescoping source connector meets the moving carrier, then retracts.
  const body=box(parent,.13,1,.12,0,0,0,C.graphite,.025);
  const inner=box(parent,.072,1,.085,0,0,0,C.blue,.018);
  const socket=new THREE.Group();parent.add(socket);socket.name='atlas-carrier-connector';
  box(socket,.095,.15,.20,0,0,0,C.blue,.022);
  box(socket,.025,.10,.13,.055,0,0,C.mint,.01);
  const point=new THREE.Vector3(-.675,1.21,0),from=new THREE.Vector3(-1.43,1.24,.0);
  return process=>{
    point.set(-.675,1.21+(process?.lift||0),0).applyAxisAngle(Y_AXIS,process?.turn||0);
    const tip=new THREE.Vector3(-1.16,1.24,0).lerp(point,process?.engaged||0);
    socket.position.copy(tip);socket.rotation.y=process?.turn||0;
    const middle=from.clone().lerp(tip,.53);poseLink(body,from,middle);poseLink(inner,middle,tip);
  };
}

function designPlotter(parent){
  // The existing plan board stays readable. The second display is the actual
  // evolving design; revision state changes both the screen and the tool path.
  foot(parent,1.52,-.96,.69,.68);box(parent,.13,1.61,.15,1.52,.96,-.96,C.graphite);
  const display=monitor(parent,1.55,2.27,-.94,1.11,.88,'UI DESIGN');display.rotation.y=-.20;
  const imageCanvas=document.createElement('canvas');imageCanvas.width=384;imageCanvas.height=240;
  const texture=new THREE.CanvasTexture(imageCanvas);texture.colorSpace=THREE.SRGBColorSpace;
  const image=new THREE.Mesh(new THREE.PlaneGeometry(.92,.51),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));
  image.position.set(0,-.06,.145);display.add(image);
  const caption=label(parent,'VARIANTE 01',.97,.15,1.55,1.71,-.804,C.blue,C.ivory,35);
  const cursor=box(display,.066,.066,.009,-.18,.03,.160,C.amber,.01);
  pillar(parent,-1.16,-1.24,2.58,C.base);
  box(parent,2.58,.13,.20,.02,2.89,-1.24,C.graphite);
  const carriage=new THREE.Group();parent.add(carriage);
  box(carriage,.25,.17,.26,0,0,0,C.ivory);box(carriage,.07,.06,.275,0,.005,0,C.mint,.01);
  const rail=box(parent,.07,1,.085,0,0,0,C.base,.015);
  const spindle=cylinder(parent,.036,1,0,2.20,0,C.graphite);
  const stylus=new THREE.Group();stylus.name='design-contact-stylus';parent.add(stylus);
  cylinder(stylus,.055,.24,0,.15,0,C.ivory);cylinder(stylus,.026,.05,0,.016,0,C.amber,.012);
  let shownKey='';
  function redraw(revision,feedback=[]){
    const language=parent.userData.language||'en',key=`${language}:${revision}:${feedback.join(',')}`;
    if(key===shownKey)return;shownKey=key;
    const ctx=imageCanvas.getContext('2d');ctx.fillStyle='#f0f5ef';ctx.fillRect(0,0,384,240);
    const evidence=getDemoEvidence({designRevision:revision,appliedDesignFeedback:feedback},language),refined=evidence.accessibilityApplied;
    ctx.fillStyle='#1b3040';ctx.fillRect(12,12,360,36);
    ctx.fillStyle='#ffffff';ctx.font='600 14px Arial';ctx.fillText('ATLAS · TC-DEMO-01 / DC-DEMO-01',22,35);
    evidence.rows.forEach((row,i)=>{
      const yy=59+i*55;ctx.fillStyle=refined?'#e1ebe4':'#e2e6e0';ctx.fillRect(12,yy,360,49);
      ctx.fillStyle='#52675f';ctx.font='12px Arial';ctx.fillText(row.reference+' · '+row.title,22,yy+16);
      ctx.fillStyle=refined?'#245e4a':'#85998e';ctx.font=(refined?'bold 17':'14')+'px Arial';ctx.fillText(row.current,22,yy+37);
    });
    texture.needsUpdate=true;
    caption.userData.label.text=`VARIANTE ${String(revision).padStart(2,'0')}`;caption.userData.label.fg=revision?C.mint:C.blue;paintLabel(caption,language);
  }
  return process=>{
    redraw(parent.userData.designRevision||1,parent.userData.appliedDesignFeedback||[]);
    const e=process?.engaged||0,w=process?.work||0;
    const x=Math.sin(w*Math.PI*4)*.24,z=THREE.MathUtils.lerp(-.23,.23,w);
    const point=new THREE.Vector3(x,1.415+(process?.lift||0)+.10*(1-(process?.working||0)),z).applyAxisAngle(Y_AXIS,process?.turn||0);
    stylus.position.copy(new THREE.Vector3(.78,2.42,-.90).lerp(point,e));stylus.rotation.y=process?.turn||0;
    carriage.position.set(stylus.position.x,2.89,stylus.position.z);
    poseLink(rail,new THREE.Vector3(stylus.position.x,2.89,-1.24),carriage.position);
    const lo=stylus.position.y+.27,hi=2.85;spindle.position.set(stylus.position.x,(lo+hi)/2,stylus.position.z);spindle.scale.y=Math.max(.02,hi-lo);
    cursor.position.set(-.30+w*.56,.08-Math.sin(w*Math.PI)*.14,.16);cursor.visible=Boolean(process);
  };
}

function buildContactTool(parent){
  // Small off-centre torque head: its pad contacts the carrier's forward edge,
  // keeping the growing monitor and the robot grippers completely visible.
  const arm=box(parent,.10,1,.11,0,0,0,C.graphite,.025);
  const spindle=cylinder(parent,.035,1,0,0,0,C.base);
  const tool=new THREE.Group();tool.name='build-contact-head';parent.add(tool);
  cylinder(tool,.07,.20,0,.12,0,C.ivory);cylinder(tool,.027,.035,0,.007,0,C.mint);
  return process=>{
    const e=process?.engaged||0;
    const target=new THREE.Vector3(.26,1.293+(process?.lift||0)+.08*(1-(process?.working||0)),.37).applyAxisAngle(Y_AXIS,process?.turn||0);
    tool.position.copy(new THREE.Vector3(.92,2.34,.64).lerp(target,e));tool.rotation.y=(process?.turn||0)+(process?.work||0)*TAU*2;
    const anchor=new THREE.Vector3(1.08,2.65,.64),elbow=new THREE.Vector3(tool.position.x,2.55,tool.position.z);
    poseLink(arm,anchor,elbow);poseLink(spindle,elbow,tool.position.clone().add(new THREE.Vector3(0,.23,0)));
  };
}

export function createMachine(index,{reverseGate=false}={}){
  if(!Number.isInteger(index)||index<0||index>5)throw new RangeError('Machine index must be 0–5');
  const group=new THREE.Group();group.userData.reverseGate=reverseGate;group.userData.language='en';group.name=['brief-intake','atlas-context','one-design-plan','one-build','quality-acceptance','atlas-knowledge'][index];
  const motion=[intake,atlas,plan,build,quality,knowledge][index](group);
  const cradle=liftCradle(group,index);
  const tool=[intakePress,contextConnector,designPlotter,buildContactTool,null,null][index]?.(group);
  const hitMeshes=[];group.traverse(object=>{if(object.isMesh){object.userData.machineIndex=index;hitMeshes.push(object);}});
  function setLanguage(language){
    language=language==='en'?'en':'de';if(group.userData.language===language)return;
    group.userData.language=language;group.traverse(object=>{if(object.userData.label)paintLabel(object,language);});
  }
  function animate(time,activity=0,gateOpen=false,process=null){
    group.userData.designRevision=process?.revision||1;
    group.userData.appliedDesignFeedback=process?.appliedDesignFeedback||[];
    const resolved=resolvedProcess(process);
    // Pose derives only from explicit cycle state. time/activity never run an
    // independent animation that could drift when the application pauses.
    motion(0,0,Boolean(gateOpen),resolved);cradle(resolved);tool?.(resolved);
    group.userData.process=resolved?{cycle:resolved.cycle,lift:resolved.lift,turn:resolved.turn,revision:resolved.revision,mode:resolved.mode||null}:null;
  }
  animate(0,0,false,null);
  return {group,animate,setLanguage,focusHeight:[1.6,1.7,2.05,1.65,1.85,1.65][index],hitMeshes};
}
