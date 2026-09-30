import * as orderDE from './order-details.js';
import * as orderEN from './order-details-en.js';
import { getLanguage, t } from './i18n.js';
import { createRecorder } from './recorder.js';
const $=selector=>document.querySelector(selector);
const tr=(de,en)=>getLanguage()==='de'?de:en;
const currentOrder=()=>getLanguage()==='de'?orderDE:orderEN;
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node};
const time=duration=>`${String(Math.floor(duration/60)).padStart(2,'0')}:${String(Math.floor(duration%60)).padStart(2,'0')}`;
export function attachWorkbench({state,simulation,reset,play,approve,rework,openArtifact,selectStation,refresh}){
 let workOpen=false,workKey='',orderLanguage='',movieLanguage='',recordState={status:'idle',duration:0},lastRecording=null;
 let tour={active:false,record:false,key:'',age:0};
 const recorder=createRecorder({
  sourceCanvas:$('#factory-canvas'),
  getFrameInfo:()=>{const work=currentOrder().describeWork(state,state.view);return {language:getLanguage(),title:work.title,detail:`${work.tool} · ${work.action}`,station:state.runStage+1,phase:state.phase,designRevision:state.designRevision,buildRevision:state.buildRevision}},
  onState:next=>{recordState=next;renderRecording();if(next.error&&$('#record-dialog').open===false)$('#record-dialog').showModal()},
  onFinish:result=>{lastRecording=result;$('#record-result').hidden=false;$('#record-preview').src=result.url;$('#record-download').href=result.url;$('#record-download').download=`software-factory-SF-001-${new Date().toISOString().replace(/[:.]/g,'-')}.${result.extension}`;renderRecording();if(!$('#record-dialog').open)$('#record-dialog').showModal()}
 });
 $('#record-tour').disabled=!recorder.supported;$('#record-manual').disabled=!recorder.supported;
 function renderRecording(){
  const next=recordState;$('#record-button').classList.toggle('is-recording',next.status==='recording');
  $('#record-label').textContent=next.status==='recording'?`${tr('Stopp','Stop')} ${time(next.duration)}`:next.status==='stopping'?tr('Wird gespeichert…','Saving…'):tr('Aufnahme','Recording');
  $('#record-button').setAttribute('aria-label',next.status==='recording'?tr('Aufnahme beenden','Stop recording'):tr('Recording öffnen','Open recording studio'));
  $('#record-error').hidden=!next.error;$('#record-error').textContent=t(next.error||'');
  if(!recorder.supported)$('#record-support').textContent=tr('Dieser Browser kann keine Canvas-Videos aufnehmen. Du kannst den geführten Ablauf ansehen; für den Download nutze einen Browser mit MediaRecorder-Unterstützung.','This browser cannot record canvas videos. You can watch the guided tour; to create a recording, use a browser with MediaRecorder support.');
  if(lastRecording){const result=lastRecording;const mb=(result.blob.size/1048576).toLocaleString(getLanguage()==='de'?'de-DE':'en-GB',{minimumFractionDigits:1,maximumFractionDigits:1});$('#record-meta').textContent=`${time(result.duration)} · 1600 × 900 · ${result.extension.toUpperCase()} · ${mb} MB`;}
 }
 function renderMovie(){
  const language=getLanguage()==='de'?'de':'en',video=$('#demo-film');
  if(movieLanguage!==language){
   movieLanguage=language;video.pause();video.src=`./assets/factory-demo${language==='de'?'-de':''}.mp4`;video.poster=`./assets/factory-demo-poster${language==='de'?'-de':''}.jpg`;video.load();
  }
  const link=$('.demo-film a');if(link){link.href=`./assets/factory-demo${language==='de'?'-de':''}.mp4`;link.textContent=tr('Fertigen Demo-Film herunterladen','Download the demo video');}
 }
 function cancelTour(){tour.active=false;tour.record=false;tour.key='';tour.age=0;$('#tour-banner').hidden=true}
 function recordingStart(guided){
  if(!recorder.supported||recordState.status==='recording'||recordState.status==='stopping')return false;
  if(guided){reset();simulation.setSpeed(1)}
  const started=recorder.start();if(!started)return false;
  $('#record-dialog').close();
  if(guided){tour={active:true,record:true,key:'',age:0};$('#tour-banner').hidden=false;play()}
  return true;
 }
 async function recordingStop(){const guided=tour.record;cancelTour();if(guided)simulation.pause();const result=await recorder.stop();refresh();return Boolean(result)}
 function startTour(){reset();simulation.setSpeed(1);tour={active:true,record:false,key:'',age:0};$('#tour-banner').hidden=false;$('#record-dialog').close();play();return true}
 function tick(dt,hidden){
  if(!tour.active||hidden||state.phase==='paused')return;
  const key=[state.phase,state.gate,state.designRevision,state.buildRevision].join(':');if(key!==tour.key){tour.key=key;tour.age=0}
  if(state.phase==='gate'){
   tour.age+=dt;if(tour.age<2300)return;tour.age=0;
   if(state.gate==='design'&&!state.appliedDesignFeedback.includes('clarity'))rework('design',['clarity']);
   else if(state.gate==='design'&&!state.appliedDesignFeedback.includes('accessibility'))rework('design',['accessibility']);
   else if(state.gate==='review'&&state.buildRevision===1)rework('rework','Leere Listen verständlich erklären');
   else approve(state.gate);
  }else if(state.phase==='complete'){
   tour.age+=dt;if(tour.age<2500)return;const wasRecording=tour.record;cancelTour();if(wasRecording)recorder.stop();
  }
 }
 function toggleWork(value=!workOpen){workOpen=value;$('#work-panel').hidden=!value;$('#experience').classList.toggle('work-open',value);$('#work-button').setAttribute('aria-expanded',String(value));workKey='';updateWork()}
 function updateWork(){
  if(!workOpen)return;
  const cycle=state.cycle===null?'travel':state.cycle<.18?0:state.cycle<.38?1:state.cycle<.58?2:state.cycle<.88?3:4;
  const key=[getLanguage(),state.phase,state.runStage,state.gate,state.returnRoute,cycle,state.designRevision,state.buildRevision,state.events.length,state.view].join(':');
  if(key===workKey)return;workKey=key;
  const work=currentOrder().describeWork(state,state.view);
  $('#work-stage').textContent=`STATION ${String(state.runStage+1).padStart(2,'0')} · ${state.phase==='gate'?tr('DEINE ENTSCHEIDUNG','YOUR DECISION'):state.returnRoute?tr('VERBESSERUNGSSCHLEIFE','IMPROVEMENT LOOP'):tr('AKTUELLE ARBEIT','CURRENT WORK')}`;
  for(const key of ['title','action','input','tool','output','decision'])$(`#work-${key}`).textContent=work[key];
  $('#work-checks').replaceChildren(...work.checks.map(text=>el('li','',text)));
  $('#work-events').replaceChildren(...state.events.slice(-7).reverse().map(event=>el('li','',t(event.label))));
  if(!state.events.length)$('#work-events').append(el('li','',tr('Der Auftrag ist vorbereitet. Starte den Lauf, um die Arbeitsschritte zu sehen.','The order is ready. Start the run to see the work in progress.')));
  $('#work-gate').hidden=state.phase!=='gate';
 }
 function renderOrder(){
  const container=$('#order-details'),language=getLanguage();if(container.childElementCount&&orderLanguage===language)return;orderLanguage=language;container.replaceChildren();
  const {ORDER}=currentOrder();
  const meta=el('div','order-meta');[ORDER.id,ORDER.label,ORDER.method,ORDER.customer].forEach(text=>meta.append(el('span','',text)));container.append(meta);
  const grid=el('div','order-grid');
  function section(title,wide=false){const node=el('section',wide?'full-width':'');node.append(el('h3','',title));grid.append(node);return node}
  section(tr('Das Ziel','The goal')).append(el('p','',ORDER.goal));
  const scope=el('ul');ORDER.scope.forEach(text=>scope.append(el('li','',text)));section(tr('Was zum Auftrag gehört','Order scope')).append(scope);
  const criteria=el('ul');ORDER.criteria.forEach(item=>{const li=el('li');li.append(el('strong','',`${item.id} · ${item.title}`),el('span','',item.description));criteria.append(li)});section(tr('Erfolgskriterien','Success criteria')).append(criteria);
  const sources=el('ul');ORDER.sources.forEach(item=>{const li=el('li');li.append(el('strong','',item.title),el('span','',`${item.kind} · ${item.description}`));sources.append(li)});section(tr('Die Wissensgrundlage','The knowledge base')).append(sources);
  const packages=el('div','package-grid');ORDER.workPackages.forEach(item=>{const card=el('article','package-card');card.append(el('small','',`${item.id} · ${item.tool}`),el('h4','',item.title),el('p','',item.description));packages.append(card)});section(tr('Drei konkrete Arbeitspakete','Three concrete work packages'),true).append(packages);container.append(grid);
 }
 function render(){updateWork();renderOrder();renderRecording();renderMovie();$('#tour-banner').hidden=!tour.active}
 $('#order-button').onclick=openArtifact;$('#work-button').onclick=()=>toggleWork();$('#close-work').onclick=()=>toggleWork(false);
 $('#work-gate').onclick=()=>{toggleWork(false);selectStation(state.runStage,{pause:false})};
 $('#record-button').onclick=()=>{if(recordState.status==='recording')recordingStop();else if(recordState.status!=='stopping')$('#record-dialog').showModal()};
 $('#record-tour').onclick=()=>recordingStart(true);$('#record-manual').onclick=()=>recordingStart(false);$('#watch-tour').onclick=startTour;
 $('#stop-tour').onclick=()=>{cancelTour();render()};
 $('#record-dialog').addEventListener('close',()=>{$('#record-preview').pause();$('#demo-film').pause()});
 const languageChanged=()=>{workKey='';orderLanguage='';render()};
 addEventListener('langchange',languageChanged);addEventListener('languagechange',languageChanged);
 addEventListener('pagehide',()=>{recorder.dispose();removeEventListener('langchange',languageChanged);removeEventListener('languagechange',languageChanged)},{once:true});
 render();
 return {render,renderOrder,updateWork,tick,cancelTour,drawFrame:()=>recorder.drawFrame(),
  snapshot:()=>({recording:recordState.status,recordingDuration:recordState.duration,guidedTour:tour.active,lastRecording:lastRecording?{duration:lastRecording.duration,bytes:lastRecording.blob.size,format:lastRecording.extension}:null}),
  record:action=>{if(action==='guided')return recordingStart(true);if(action==='start')return recordingStart(false);if(action==='stop')return recordingStop();throw new Error(tr('Unbekannte Aufnahmeaktion.','Unknown recording action.'));},
  showWork:()=>toggleWork(true),startTour
 };
}
