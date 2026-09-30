import { fixWebmDuration } from './vendor/fix-webm-duration.js';
// Browser-only, local recording. No microphone, display capture, upload, or
// automatic downloads. Call drawFrame immediately after the WebGL render.
const WIDTH=1600,HEIGHT=900,FPS=30;
const MIME_CANDIDATES=[
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
  'video/mp4;codecs=avc1.42E01E',
  'video/mp4'
];
const PHASE_LABELS={idle:'Bereit',running:'In Bearbeitung',processing:'In Bearbeitung',paused:'Pausiert',gate:'Entscheidung erforderlich',complete:'Abgeschlossen',returning:'Überarbeitung',rework:'Überarbeitung'};

function cleanText(value,fallback=''){
  return typeof value==='string'||typeof value==='number'?String(value).replace(/\s+/g,' ').trim():fallback;
}
function timeLabel(seconds){
  const total=Math.max(0,Math.floor(seconds||0));return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;
}
function roundedRect(ctx,x,y,w,h,r){
  r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}
function ellipsis(ctx,text,width){
  if(ctx.measureText(text).width<=width)return text;
  let shortened=text;while(shortened.length&&ctx.measureText(shortened+'…').width>width)shortened=shortened.slice(0,-1);
  return shortened.trimEnd()+'…';
}
function textLines(ctx,text,width,maxLines=2){
  const words=text.split(' ').filter(Boolean),lines=[];let current='';
  for(let i=0;i<words.length;i++){
    const next=current?`${current} ${words[i]}`:words[i];
    if(ctx.measureText(next).width<=width){current=next;continue;}
    if(!current){current=ellipsis(ctx,words[i],width);continue;}
    lines.push(current);current=words[i];
    if(lines.length===maxLines-1){lines.push(ellipsis(ctx,words.slice(i).join(' '),width));return lines;}
  }
  if(current&&lines.length<maxLines)lines.push(ellipsis(ctx,current,width));return lines;
}
function errorMessage(error){return cleanText(error?.message)||'Die Aufnahme konnte nicht erstellt werden.';}

/**
 * API:
 *   start(): boolean — false if unsupported, busy, disposed, or setup fails.
 *   stop(): Promise<{blob,url,extension,duration}|null> — safe to call twice.
 *   drawFrame(): void — invoke directly after renderer.render(scene,camera).
 *   canvas: HTMLCanvasElement — composited live preview; optional to mount.
 *
 * Blob URLs from every successful take stay valid until dispose(). The owner
 * may use them for preview/download; the recorder never triggers a download.
 * duration is in seconds. The source canvas is not resized or modified.
 */
export function createRecorder({sourceCanvas,getFrameInfo=()=>({}),onState,onFinish}={}){
  const canvas=document.createElement('canvas');canvas.width=WIDTH;canvas.height=HEIGHT;
  canvas.setAttribute('aria-label','Live-Vorschau der Software-Factory-Aufnahme');
  canvas.style.width='100%';canvas.style.height='auto';canvas.style.aspectRatio='16 / 9';
  const ctx=canvas.getContext('2d',{alpha:false});
  const candidates=typeof MediaRecorder==='function'?MIME_CANDIDATES.filter(type=>{
    try{return typeof MediaRecorder.isTypeSupported!=='function'||MediaRecorder.isTypeSupported(type);}catch{return false;}
  }):[];
  const supported=Boolean(ctx&&sourceCanvas&&typeof canvas.captureStream==='function'&&typeof MediaRecorder==='function'&&candidates.length);
  const urls=new Set();let disposed=false,session=null,status='idle',lastDuration=0,lastDraw=-Infinity,drawError=null,selectedMime=candidates[0]||'';
  const now=()=>performance.now();
  const duration=()=>session&&!session.finished?Math.max(0,((session.stoppedAt??now())-session.startedAt)/1000):lastDuration;
  function call(callback,value){try{callback?.(value);}catch(error){console.error('Factory recording callback failed',error);}}
  function emit(next,error){status=next;if(!disposed)call(onState,{status:next,duration:duration(),...(error?{error}:{})});}
  function stopTracks(stream){for(const track of stream?.getTracks?.()||[]){try{track.stop();}catch{}}}
  function cleanup(recording){
    clearInterval(recording.timer);clearTimeout(recording.timeout);stopTracks(recording.stream);
    recording.recorder.ondataavailable=null;recording.recorder.onstop=null;recording.recorder.onerror=null;
  }
  function stationLabel(station){
    if(Number.isInteger(station))return `STATION ${String(station).padStart(2,'0')}`;
    if(station&&typeof station==='object')return cleanText(station.name)||`STATION ${String((station.index??0)+1).padStart(2,'0')}`;
    return cleanText(station,'SOFTWARE FACTORY');
  }
  function renderComposite(){
    if(!ctx||disposed)return;
    let info={};try{info=getFrameInfo?.()||{};}catch(error){console.error('Factory recording metadata unavailable',error);}
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    ctx.fillStyle='#edf2ef';ctx.fillRect(0,0,WIDTH,HEIGHT);
    ctx.fillStyle='#fbfcf8';ctx.fillRect(0,0,WIDTH,64);
    ctx.fillStyle='#1b3040';ctx.font='700 24px Arial, sans-serif';ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillText('ATLAS × NORDA',36,41);
    ctx.fillStyle='#71958a';ctx.fillRect(251,24,2,21);
    ctx.fillStyle='#62776f';ctx.font='500 17px Arial, sans-serif';ctx.fillText('SOFTWARE FACTORY',276,39);
    ctx.textAlign='right';ctx.font='600 17px Arial, sans-serif';ctx.fillStyle='#466155';ctx.fillText(`DEMO  ·  ${timeLabel(duration())}`,WIDTH-36,40);ctx.textAlign='left';
    ctx.fillStyle='#dbe5de';ctx.fillRect(0,63,WIDTH,1);

    // Contain the whole source image. Side bars use the same quiet stage colour.
    const view={x:26,y:77,w:1548,h:574};
    ctx.fillStyle='#e7eeea';roundedRect(ctx,view.x,view.y,view.w,view.h,18);ctx.fill();
    const sourceWidth=sourceCanvas?.width||sourceCanvas?.videoWidth||0;
    const sourceHeight=sourceCanvas?.height||sourceCanvas?.videoHeight||0;
    if(sourceWidth>0&&sourceHeight>0){
      const scale=Math.min(view.w/sourceWidth,view.h/sourceHeight),w=sourceWidth*scale,h=sourceHeight*scale;
      ctx.save();roundedRect(ctx,view.x,view.y,view.w,view.h,18);ctx.clip();
      ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
      ctx.drawImage(sourceCanvas,view.x+(view.w-w)/2,view.y+(view.h-h)/2,w,h);ctx.restore();
    }

    ctx.fillStyle='#fbfcf8';ctx.fillRect(0,673,WIDTH,HEIGHT-673);
    ctx.fillStyle='#dbe5de';ctx.fillRect(36,672,WIDTH-72,1);
    const phase=PHASE_LABELS[info.phase]||cleanText(info.phase,'Interaktive Demo');
    ctx.fillStyle=info.phase==='gate'||info.phase==='paused'?'#d8983e':'#46a484';ctx.beginPath();ctx.arc(42,702,5,0,Math.PI*2);ctx.fill();
    ctx.font='600 15px Arial, sans-serif';ctx.fillStyle='#587568';
    ctx.fillText(ellipsis(ctx,`${stationLabel(info.station)}  ·  ${phase}`,WIDTH-90),58,708);
    const title=cleanText(info.title)||cleanText(info.operation)||'Vom Auftrag zur überprüften Anwendung.';
    ctx.font='600 31px Arial, sans-serif';ctx.fillStyle='#1b3040';ctx.fillText(ellipsis(ctx,title,WIDTH-72),36,750);
    const detail=cleanText(info.detail)||'Atlas liefert den Kontext. Norda koordiniert die Arbeit. Menschen entscheiden über das Ergebnis.';
    ctx.font='400 24px Arial, sans-serif';ctx.fillStyle='#4b645c';textLines(ctx,detail,WIDTH-72,2).forEach((line,i)=>ctx.fillText(line,36,790+i*31));
    ctx.font='600 15px Arial, sans-serif';ctx.fillStyle='#628475';
    const design=Math.max(1,Number(info.designRevision)||1),build=Math.max(1,Number(info.buildRevision)||1);
    ctx.fillText(`DESIGN v${design}    ·    BUILD v${build}`,36,871);
    ctx.textAlign='right';ctx.font='400 14px Arial, sans-serif';ctx.fillStyle='#84948b';ctx.fillText('Workflow-Simulation · Keine produktiven Systeme',WIDTH-36,871);
    ctx.restore();
  }
  function failActive(message){
    const active=session;if(!active||active.finished)return;
    active.error=message;active.stoppedAt??=now();emit('error',message);
    try{if(active.recorder.state!=='inactive')active.recorder.stop();else finish(active);}catch{finish(active);}
    if(!active.finished)active.timeout=setTimeout(()=>finish(active),1500);
  }
  function drawFrame(){
    if(disposed||!ctx)return;
    const tick=now(),interval=status==='recording'?1000/FPS:100;
    if(tick-lastDraw<interval-.5)return;lastDraw=tick;
    try{renderComposite();drawError=null;}catch(error){drawError=errorMessage(error);failActive(drawError);}
  }
  async function finish(active){
    if(active.finished)return;active.finished=true;active.stoppedAt??=now();
    lastDuration=Math.max(0,(active.stoppedAt-active.startedAt)/1000);cleanup(active);
    if(disposed){active.resolve(null);return;}
    if(active.error){if(session===active)session=null;emit('error',active.error);active.resolve(null);return;}
    const mime=active.recorder.mimeType||selectedMime||active.chunks[0]?.type||'video/webm';
    let blob=new Blob(active.chunks,{type:mime});active.chunks.length=0;
    if(blob.size&&mime.includes('webm')){emit('stopping');try{blob=await fixWebmDuration(blob,lastDuration*1000,{logger:false})}catch{}}
    if(session===active)session=null;
    if(disposed){active.resolve(null);return;}
    if(!blob.size){emit('error','Die Aufnahme enthält keine Videodaten. Starte einen neuen Durchlauf und lasse ihn kurz laufen.');active.resolve(null);return;}
    let url;try{url=URL.createObjectURL(blob);urls.add(url);}catch(error){emit('error',errorMessage(error));active.resolve(null);return;}
    const result={blob,url,extension:mime.includes('mp4')?'mp4':'webm',duration:lastDuration};
    emit('idle');call(onFinish,result);active.resolve(result);
  }
  function start(){
    if(disposed||session)return false;
    if(!supported){emit('error','Dieser Browser unterstützt die lokale Canvas-Videoaufnahme nicht.');return false;}
    let stream,recorder,setupError;
    try{
      // Preview normally already exists because the owner calls drawFrame after
      // each render. Avoid copying a potentially cleared WebGL buffer here.
      if(lastDraw===-Infinity){lastDraw=now();renderComposite();}
      if(drawError)throw new Error(drawError);
      stream=canvas.captureStream(FPS);
      for(const mimeType of candidates){
        try{recorder=new MediaRecorder(stream,{mimeType,videoBitsPerSecond:6500000});selectedMime=mimeType;break;}catch(error){setupError=error;}
      }
      if(!recorder)throw setupError||new Error('Kein unterstütztes Videoformat verfügbar.');
      let resolve;const promise=new Promise(done=>resolve=done);
      const active={recorder,stream,startedAt:now(),stoppedAt:null,chunks:[],promise,resolve,finished:false,error:null,timer:null,timeout:null};
      session=active;lastDuration=0;
      recorder.ondataavailable=event=>{if(!active.finished&&event.data?.size)active.chunks.push(event.data);};
      recorder.onstop=()=>finish(active);
      recorder.onerror=event=>failActive(errorMessage(event.error||event));
      recorder.start(1000);emit('recording');
      active.timer=setInterval(()=>{if(!active.finished&&status==='recording')emit('recording');},500);
      return true;
    }catch(error){
      stopTracks(stream);
      if(session){cleanup(session);session.finished=true;session.resolve(null);session=null;}
      emit('error',errorMessage(error));return false;
    }
  }
  function stop(){
    const active=session;if(!active||disposed)return Promise.resolve(null);
    if(active.stoppedAt!==null)return active.promise;
    active.stoppedAt=now();emit('stopping');clearInterval(active.timer);
    try{
      if(active.recorder.state!=='inactive')active.recorder.stop();
      // The final dataavailable event is delivered before onstop. Give it time
      // to flush; repeated stop calls share this same promise.
      active.timeout=setTimeout(()=>{active.error||='Die Aufnahme konnte nicht abgeschlossen werden. Bitte erneut versuchen.';finish(active);},10000);
    }catch(error){active.error=errorMessage(error);finish(active);}
    return active.promise;
  }
  function dispose(){
    if(disposed)return;disposed=true;
    if(session){
      const active=session;active.finished=true;try{if(active.recorder.state!=='inactive')active.recorder.stop();}catch{}
      cleanup(active);active.chunks.length=0;active.resolve(null);session=null;
    }
    for(const url of urls){try{URL.revokeObjectURL(url);}catch{}}urls.clear();
    canvas.width=0;canvas.height=0;
  }
  // The owner controls when the first fresh WebGL frame is copied.
  return {supported,canvas,start,stop,drawFrame,dispose,get mimeType(){return selectedMime;}};
}
