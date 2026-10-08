import { stations as stationsDE } from './data.js';
import { stations as stationsEN } from './data-en.js';
import { getLanguage, setLanguage, t } from './i18n.js';
import { captureStaticTranslations } from './static-i18n.js';
import { createFactory } from './scene.js';
import { createSimulation } from './engine.js';
import { renderDemoEvidence } from './demo-evidence.js';
import { attachWorkbench } from './workbench.js';

const applyStaticLanguage = captureStaticTranslations();
let stations = getLanguage() === 'de' ? stationsDE : stationsEN;
applyStaticLanguage(getLanguage());
document.documentElement.lang = getLanguage();
const $ = selector => document.querySelector(selector);
const simulation = createSimulation();
const state = simulation.state;
Object.assign(state, {selected:-1, view:'business', follow:false, language:getLanguage()});
let factory = null,workbench=null;
const labels = ['Auftrag','Atlas-Kontext','Design & Plan','Umsetzung','Prüfung','Wissen'];
const badges = ['BRIEFING','ATLAS','ONE · DESIGN','ONE · BUILD','QA + MENSCH','ATLAS'];
const artifactNames = ['Briefing','Kontext','Entwurf','Anwendung','Nachweise','Wissen'];
const gateNames = {design:'Design-Review',plan:'Planfreigabe',review:'Fachliche Prüfung',acceptance:'Fachliche Abnahme',knowledge:'Atlas-Übernahme'};
const gateButton = {design:'Design freigeben →',plan:'Plan in der Demo freigeben',review:'Prüfung in der Demo bestätigen',acceptance:'Abnahme in der Demo erteilen',knowledge:'Wissen in der Demo übernehmen'};
const gateCopy = {
 design:'Vergleiche NH-1042 bis NH-1044 mit Atlas TC-DEMO-01 und DC-DEMO-01. ONE gibt dein Feedback an die nächste Design-Iteration weiter.',
 plan:'ONE übernimmt die Atlas-Regeln TC-DEMO-01, DC-DEMO-01 und EC-DEMO-01 in die Arbeitspakete für die Coding Agents. Gib diesen Plan frei.',
 review:'Vergleiche die drei Service-Aufträge mit TC-DEMO-01 und DC-DEMO-01. Prüfe auch den leeren Zustand für C-309 nach EC-DEMO-01. Ein Befund geht über ONE zurück zum Coding Agent.',
 acceptance:'Die fachliche Prüfung ist bestätigt. Die Abnahme ist deine separate Entscheidung für diesen Ergebnisstand.',
 knowledge:'Prüfe den aktuellen Stand und noch offene Regeln zu TC-DEMO-01, DC-DEMO-01 und EC-DEMO-01. Bestätige diesen Stand für Atlas. ONE verknüpft Auftrag und Freigabe.'
};
const operations = ['Briefing aufnehmen','Atlas-Quellen verbinden','Entwurf gestalten','Anwendung zusammensetzen','Ergebnis prüfen','Wissen zuordnen'];
function snapshot(){return {...simulation.snapshot(),station:state.selected<0?null:state.selected+1,stationName:state.selected<0?t('Gesamte Factory'):stations[state.selected].name,perspective:state.view,runStation:state.runStage+1,pendingDemoGate:state.gate,approvedDemoGates:[...state.approved],demoReviewConfirmed:state.reviewed,cameraFollowsOrder:state.follow,simulationOnly:true,...workbench?.snapshot()}}
function setPerspective(view){if(!['business','engineering'].includes(view))throw new Error('Ungültige Perspektive.');state.view=view;render();return snapshot()}
function selectStation(index,{pause=true,focus=true}={}){
 if(!Number.isInteger(index)||index<0||index>5)throw new Error('Station muss zwischen 1 und 6 liegen.');
 if(pause){workbench?.cancelTour();simulation.pause()}state.selected=index;state.follow=false;if(focus)factory?.focus(index);render();return snapshot();
}
function overview(){state.selected=-1;state.follow=false;factory?.overview();render();return snapshot()}
function sceneState(){const start=state.runStage===0?.022:factory.positions[state.runStage-1],end=factory.positions[state.runStage];return {...state,progress:state.phase==='idle'?.022:start+(end-start)*state.travelProgress,approved:[...state.approved]}}
function reset(){workbench?.cancelTour();simulation.reset();state.selected=-1;state.follow=false;factory?.apply(sceneState());factory?.overview();render();return snapshot()}
function followMotion(){state.selected=-1;state.follow=true;factory?.setFollow(true)}
function play(){
 if(['running','returning'].includes(state.phase))simulation.pause();
 else if(state.phase==='gate'){selectStation(state.runStage,{pause:false});$('#gate-box button')?.focus();return snapshot()}
 else {if(state.phase==='complete')reset();simulation.start();followMotion()}
 render();return snapshot();
}
function setSpeed(speed){simulation.setSpeed(speed);render();return snapshot()}
function completeGate(gate){simulation.approve(gate);if(state.phase!=='gate')followMotion();render();return snapshot()}
function requestRework(kind,feedback){simulation.rework(kind,feedback);followMotion();render();return snapshot()}
function followOrder(){state.follow=!state.follow;factory?.setFollow(state.follow);render();return snapshot()}
function element(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=t(text);return node}
function portalPreview(compact=false){
 const container=element('div','demo-evidence-host');
 container.innerHTML=renderDemoEvidence(state,getLanguage(),{compact});
 return container;
}
function action(text,fn,secondary=false){const button=element('button',secondary?'feedback-button':'',text);button.onclick=fn;return button}
function renderPanel(){
 const panel=$('#station-panel');panel.hidden=state.selected<0;
 $('#experience').classList.toggle('is-focused',state.selected>=0);
 const waiting=state.phase==='gate'&&state.selected===state.runStage;
 panel.classList.toggle('waiting',waiting);panel.classList.toggle('design-review',waiting&&state.gate==='design');
 if(state.selected<0)return;
 const s=stations[state.selected],content=s[state.view];
 $('#detail-tool').textContent=t(s.tool);$('#detail-number').textContent=t(`STATION ${String(state.selected+1).padStart(2,'0')} / 06`);
 $('#detail-title').textContent=t(s.name);$('#detail-description').textContent=t(content.description);$('#detail-output').textContent=t(content.output);
 $('#detail-checks').replaceChildren(...content.checks.map(text=>element('li','',text)));
 const gate=$('#gate-box');gate.replaceChildren();
 if(waiting){
  gate.append(element('strong','',state.gate==='design'?`Entwurf v${state.designRevision} · Deine Entscheidung`:gateNames[state.gate]));
  if(['design','plan','review','acceptance','knowledge'].includes(state.gate))gate.append(portalPreview(true));
  gate.append(element('p','',gateCopy[state.gate]));
  const decisions=element('div','gate-actions');
  if(state.gate==='design'){
   const feedback=[['clarity','↻ TC-DEMO-01 · Labels anwenden'],['accessibility','↻ DC-DEMO-01 · Design anwenden']];
   feedback.forEach(([code,title])=>{const done=state.appliedDesignFeedback.includes(code);const button=action(done?'✓ '+title.slice(2):title,()=>requestRework('design',[code]),true);button.disabled=done;decisions.append(button)});
  }
  if(['review','acceptance'].includes(state.gate)){const fixed=state.buildRevision>1;const button=action(fixed?'✓ EC-DEMO-01 · Leerzustand umgesetzt':'↻ EC-DEMO-01 · Leerzustand umsetzen',()=>requestRework('rework','Leere Listen verständlich erklären'),true);button.disabled=fixed;decisions.append(button)}
  decisions.append(action(gateButton[state.gate],()=>completeGate(state.gate)));gate.append(decisions);
 }else if(s.gate)gate.append(element('strong','',s.gate.title),element('p','',s.gate.copy));
 $('#panel-artifact').textContent=t(`Kundenportal · Design v${state.designRevision} · Build v${state.buildRevision}`);
}
function render(){
 if($('#factory-canvas').hidden)$('.world-hint').textContent=t('3D ist in diesem Browser nicht verfügbar. Stationen unten erkunden.');
 document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===getLanguage())));
 document.querySelectorAll('.scene-label').forEach((b,i)=>{b.querySelector('small').textContent=t(badges[i]);b.querySelector('strong').textContent=t(labels[i]);b.setAttribute('aria-label',`Station ${i+1}: ${stations[i].name}`)});
 document.querySelectorAll('#stage-nav button').forEach((b,i)=>{b.lastChild.textContent=t(labels[i])});
 document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===state.view)));
 document.querySelectorAll('[data-stage]').forEach(b=>{b.setAttribute('aria-pressed',String(+b.dataset.stage===state.selected));b.classList.toggle('done',state.phase==='complete'||state.phase!=='idle'&&+b.dataset.stage<state.runStage)});
 renderPanel();
 const moving=['running','returning'].includes(state.phase);
 $('#play-label').textContent=t(moving?'Pausieren':state.phase==='paused'?'Weiterfahren':state.phase==='gate'?'Entscheidung ansehen':state.phase==='complete'?'Noch ein Auftrag':'Auftrag starten');
 $('#play-icon').textContent=t(moving?'Ⅱ':state.phase==='gate'?'◎':'▶');$('#speed-button').textContent=t(state.speed+'×');$('#speed-button').setAttribute('aria-label',t(`Geschwindigkeit ${state.speed}-fach. Ändern`));
 $('#follow-button').setAttribute('aria-pressed',String(state.follow));
 let status='Ein Auftrag. Du steuerst die Verbesserung.';
 if(state.phase==='running')status=`${String(state.runStage+1).padStart(2,'0')} · ${stations[state.runStage].name}`;
 if(state.phase==='returning')status=state.returnRoute==='design'?'Feedback → zurück ins Design':'Befund → zurück zur Umsetzung';
 if(state.phase==='paused')status='Auftrag pausiert · Factory frei erkunden';
 if(state.phase==='gate')status=`Deine Entscheidung: ${gateNames[state.gate]}`;
 if(state.phase==='complete')status='Ergebnis abgenommen. Wissen in Atlas bestätigt.';
 $('#run-status').textContent=t(status);$('#status-dot').style.background=state.phase==='gate'?'#d79b48':'#7baa7c';
 $('#artifact-count').textContent=t(state.phase==='complete'?'Abgenommen':state.formStage>=2?`Design v${state.designRevision} · Build v${state.buildRevision}`:artifactNames[state.formStage]);
 $('#experience').classList.toggle('has-order',state.phase!=='idle');
 updateProcess();workbench?.render();if($('#artifact-dialog').open)renderArtifact();
}
function updateProcess(){
 const strip=$('#process-strip');strip.hidden=state.phase==='idle';
 let title=operations[state.runStage],detail='Werkstück wird zur Station transportiert',fraction=state.travelProgress;
 if(state.returnRoute){title=state.returnRoute==='design'?'Design-Schleife':'Nacharbeit';detail=state.returnRoute==='design'?`Feedback fährt mit → Entwurf v${state.designRevision+1}`:`Befund fährt mit → Build v${state.buildRevision+1}`;fraction=state.returnProgress}
 else if(state.cycle!==null){fraction=state.cycle;detail=state.cycle<.18?'Greifer dockt am Werkstück an':state.cycle<.38?'Hubtisch hebt den Auftrag an':state.cycle<.68?'Werkzeug bearbeitet das Ergebnis':state.cycle<.88?'Ergebnis wird aufs Band gesetzt':'Werkstück bereit für die Übergabe'}
 if(state.phase==='gate')detail='Wartet auf deine Entscheidung';if(state.phase==='complete'){title='Auftrag abgeschlossen';detail=`Design v${state.designRevision} · Build v${state.buildRevision} · Wissen bestätigt`;fraction=1}
 $('#process-title').textContent=t(title);$('#process-detail').textContent=t(detail);$('#process-fill').style.width=`${Math.round(fraction*100)}%`;
 strip.classList.toggle('is-returning',Boolean(state.returnRoute));workbench?.updateWork();
}
function renderArtifact(){
 workbench?.renderOrder();
 const old=$('#portal-preview'),preview=portalPreview();preview.id='portal-preview';preview.hidden=state.formStage<2;old.replaceWith(preview);
 const evidence=[['Auftrag','Ziel, Umfang und Erfolgskriterien gehören zum Briefing.',true],['Atlas-Kontext','Anforderungen und Zugriffskriterien bleiben mit ihrer Quelle verbunden.',state.formStage>=1],['Design & Plan',`Entwurf v${state.designRevision}; ${state.appliedDesignFeedback.length} Design-Verbesserungen. Die Planfreigabe gehört zu diesem Stand.`,state.approved.has('plan')],['Umsetzung',`Build v${state.buildRevision} · ${state.reworkCount} ${state.reworkCount===1?'Nacharbeit':'Nacharbeiten'} im gewählten Projekt.`,state.formStage>=3],['Prüfung & Abnahme','Nach einer Nacharbeit werden Prüfung und Abnahme erneut verlangt.',state.approved.has('acceptance')],['Bestätigtes Wissen','Ausgewählte Erkenntnisse werden in Atlas übernommen und zurückgelesen.',state.approved.has('knowledge')]];
 $('#artifact-trace').replaceChildren(...evidence.map(([title,copy,available],i)=>{const li=element('li',available?'available':'');const div=element('div');div.append(element('h3','',title),element('p','',available?copy:'Kommt im weiteren Verlauf dazu.'));li.append(element('span','trace-icon',available?'✓':String(i+1)),div);return li}));
 const history=$('#iteration-history');history.replaceChildren(...state.events.filter(e=>/design|rework|revision/i.test(e.type)).map(e=>element('li','',e.label)));
 $('#iteration-section').hidden=!history.childElementCount;
}
function openArtifact(){renderArtifact();$('#artifact-dialog').showModal()}
for(let i=0;i<6;i++){
 const button=element('button','scene-label');button.dataset.sceneStation=i;button.dataset.stage=i;button.setAttribute('aria-label',`Station ${i+1}: ${stations[i].name}`);button.innerHTML=`<span>0${i+1}</span><div><small>${badges[i]}</small><strong>${labels[i]}</strong></div>`;button.onclick=()=>selectStation(i);$('#scene-labels').append(button);
 const nav=element('button');nav.dataset.stage=i;nav.innerHTML=`<span>0${i+1}</span>${labels[i]}`;nav.onclick=()=>selectStation(i);$('#stage-nav').append(nav);
}
try{factory=createFactory($('#factory-canvas'),{onFrame:()=>workbench?.drawFrame(),onSelect:i=>selectStation(i),onArtifact:openArtifact,onReady:()=>{$('#loading').hidden=true},onCameraChange:mode=>{state.follow=mode==='follow';$('#follow-button').setAttribute('aria-pressed',String(state.follow))}})}catch(error){console.error('3D factory unavailable',error);$('#factory-canvas').hidden=true;$('#scene-labels').hidden=true;$('.world-fallback').hidden=false;$('#loading').hidden=true;$('.world-hint').textContent=t('3D ist in diesem Browser nicht verfügbar. Stationen unten erkunden.');factory={positions:[.08,.24,.40,.57,.76,.92],focus(){},overview(){},zoom(){},setFollow(){},apply(){}}}
let last=0;
function tick(now){
 const dt=last?Math.min(now-last,100):0;last=now;
 if(!document.hidden){const oldPhase=state.phase;const changed=simulation.tick(dt);
  if(changed){if(state.phase==='gate'&&oldPhase!=='gate'){state.selected=state.runStage;state.follow=false;factory.focus(state.runStage)}else if(state.phase==='complete'&&oldPhase!=='complete'){state.selected=5;state.follow=false;factory.focus(5)}render()}
 }
 workbench?.tick(dt,document.hidden);factory.apply(sceneState());updateProcess();requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
$('#play-button').onclick=play;$('#reset-button').onclick=reset;$('#speed-button').onclick=()=>setSpeed(state.speed===1?2:state.speed===2?4:1);$('#follow-button').onclick=followOrder;$('#overview-button').onclick=overview;$('#close-panel').onclick=overview;$('#zoom-in').onclick=()=>factory.zoom(1.2);$('#zoom-out').onclick=()=>factory.zoom(1/1.2);$('#artifact-button').onclick=openArtifact;
$('#about-button').onclick=()=>$('#about-dialog').showModal();$('#mobile-about').onclick=()=>$('#about-dialog').showModal();document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close).close());document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setPerspective(b.dataset.view));
document.querySelectorAll('#stage-nav button').forEach((b,i)=>b.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const j=e.key==='Home'?0:e.key==='End'?5:(i+(e.key==='ArrowRight'?1:5))%6;selectStation(j);document.querySelectorAll('#stage-nav button')[j].focus()}}));render();
workbench=attachWorkbench({state,simulation,reset,play,approve:completeGate,rework:requestRework,openArtifact,selectStation,refresh:render});
document.querySelectorAll('[data-language]').forEach(button=>button.onclick=()=>{
 setLanguage(button.dataset.language);state.language=getLanguage();stations=getLanguage()==='de'?stationsDE:stationsEN;
 document.documentElement.lang=getLanguage();applyStaticLanguage(getLanguage());
 dispatchEvent(new CustomEvent('langchange',{detail:{language:getLanguage()}}));render();
});
const context=document.modelContext;
if(context?.registerTool){const lifecycle=new AbortController();const definitions=[
 {name:'record_factory_demo',description:'Startet eine lokale Videoaufnahme der Demo oder beendet sie. guided startet einen geführten Beispielauftrag mit simulierten Feedbackentscheidungen; es werden keine Daten hochgeladen.',inputSchema:{type:'object',properties:{action:{type:'string',enum:['guided','start','stop']}},required:['action'],additionalProperties:false},execute:async input=>{if(!input||!['guided','start','stop'].includes(input.action))throw new Error('Ungültige Aufnahmeaktion.');await workbench.record(input.action);return snapshot()}},
 {name:'inspect_factory_work',description:'Öffnet die Details der aktuellen simulierten Arbeit mit Eingang, Werkzeug, Ergebnis und Aktivitätsprotokoll.',inputSchema:{type:'object',properties:{},additionalProperties:false},execute:()=>{workbench.showWork();return snapshot()}},
 {name:'read_factory_simulation',description:'Liest die lokale Factory-Demo einschließlich Bearbeitung, Rücklauf und Revisionen.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>snapshot()},
 {name:'navigate_factory',description:'Wählt eine Station und pausiert die Demo. Optional Business oder Engineering.',inputSchema:{type:'object',properties:{station:{type:'integer',minimum:1,maximum:6},perspective:{type:'string',enum:['business','engineering']}},required:['station'],additionalProperties:false},execute:input=>{if(!input||!Number.isInteger(input.station)||input.station<1||input.station>6||input.perspective&&!['business','engineering'].includes(input.perspective))throw new Error('Ungültige Factory-Auswahl.');if(input.perspective)setPerspective(input.perspective);return selectStation(input.station-1)}},
 {name:'set_factory_playback',description:'Startet, pausiert oder setzt den lokalen Demo-Auftrag zurück. Bestätigt keine Gates.',inputSchema:{type:'object',properties:{action:{type:'string',enum:['start','pause','reset']},speed:{type:'integer',enum:[1,2,4]}},required:['action'],additionalProperties:false},execute:input=>{if(!input||!['start','pause','reset'].includes(input.action)||input.speed!==undefined&&![1,2,4].includes(input.speed))throw new Error('Ungültige Demo-Steuerung.');if(input.speed)setSpeed(input.speed);if(input.action==='reset')return reset();if(input.action==='pause'){simulation.pause();render();return snapshot()}return ['running','returning'].includes(state.phase)?snapshot():play()}},
 {name:'complete_factory_demo_gate',description:'Bestätigt nur die aktuell wartende simulierte Entscheidung.',inputSchema:{type:'object',properties:{gate:{type:'string',enum:['design','plan','review','acceptance','knowledge']}},required:['gate'],additionalProperties:false},execute:input=>{if(!input||!Object.hasOwn(gateNames,input.gate))throw new Error('Unbekanntes Demo-Gate.');return completeGate(input.gate)}},
 {name:'request_factory_rework',description:'Gibt dem wartenden Entwurf Design-Feedback oder schickt das geprüfte Ergebnis auf dem Rücklaufband zur Nacharbeit. Nur Simulation.',inputSchema:{type:'object',properties:{kind:{type:'string',enum:['design','rework']},feedback:{type:'string',enum:['clarity','accessibility','empty-state']}},required:['kind','feedback'],additionalProperties:false},execute:input=>{if(!input||!['design','rework'].includes(input.kind)||(input.kind==='design'?!['clarity','accessibility'].includes(input.feedback):input.feedback!=='empty-state'))throw new Error('Ungültiges Feedback.');return requestRework(input.kind,input.kind==='design'?[input.feedback]:'Leere Listen verständlich erklären')}}
 ];for(const tool of definitions){try{Promise.resolve(context.registerTool({...tool,annotations:{readOnlyHint:false,untrustedContentHint:false,...tool.annotations}},{signal:lifecycle.signal})).catch(()=>{})}catch{}}addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
