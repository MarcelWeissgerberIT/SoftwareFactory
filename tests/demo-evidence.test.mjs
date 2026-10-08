import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

// Load browser ES modules without relying on the parent directory's package type.
const asURL = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const read = path => readFile(new URL(path,import.meta.url),'utf8');
const deSource = await read('../dist/order-details.js');
const enSource = await read('../dist/order-details-en.js');
const evidenceSource = (await read('../dist/demo-evidence.js'))
  .replace("'./order-details.js'",JSON.stringify(asURL(deSource)))
  .replace("'./order-details-en.js'",JSON.stringify(asURL(enSource)));
const {getDemoEvidence,renderDemoEvidence} = await import(asURL(evidenceSource));
const {createSimulation,TIMING} = await import(asURL(await read('../dist/engine.js')));
const reachDesign = sim => {sim.start();sim.tick(1e6);assert.equal(sim.state.gate,'design');};
const finishDesignReturn = sim => sim.tick(TIMING.returning + TIMING.processing);
const statuses = evidence => evidence.rows.map(row => row.current);
const rule = (evidence,id) => evidence.rules.find(item => item.id === id);

test('the initial artifact has concrete bilingual service orders and three fictional Atlas targets',()=>{
  const sim=createSimulation(),before=sim.snapshot();
  const en=getDemoEvidence(sim.state,'en'),de=getDemoEvidence(sim.state,'de');
  assert.deepEqual(en.rows.map(row=>row.reference),['NH-1042','NH-1043','NH-1044']);
  assert.deepEqual(en.rows.map(row=>row.title),['Loading gate maintenance','Heating system inspection','Fire door service']);
  assert.deepEqual(de.rows.map(row=>row.title),['Wartung Ladetor','Prüfung Heizungsanlage','Service Brandschutztür']);
  assert.deepEqual(statuses(en),['PROC','QA','DONE']);
  assert.deepEqual(en.rows.map(row=>row.target),['Service in progress','Report in review','Service completed']);
  assert.deepEqual(de.rows.map(row=>row.target),['Service läuft','Bericht in Prüfung','Service abgeschlossen']);
  assert.deepEqual(en.rules.map(item=>item.id),['TC-DEMO-01','DC-DEMO-01','EC-DEMO-01']);
  assert.ok(en.rules.every(item=>item.status==='target'&&item.reference===`Atlas · ${item.id}`));
  assert.equal(en.emptyState.current,'');assert.equal(en.emptyState.target,'No orders yet.');
  assert.deepEqual(sim.snapshot(),before);
});

test('clarity remains pending on return and before the morph, then changes only labels',()=>{
  const sim=createSimulation();reachDesign(sim);
  const initial=getDemoEvidence(sim.state,'en');sim.rework('design',['clarity']);
  for(const input of [sim.state,sim.snapshot()]){
    const pending=getDemoEvidence(input,'en');
    assert.equal(rule(pending,'TC-DEMO-01').status,'pending');
    assert.deepEqual(statuses(pending),['PROC','QA','DONE']);
    assert.equal(pending.clarityApplied,false);
  }
  sim.tick(TIMING.returning+TIMING.processing*TIMING.morphAt-1);
  assert.equal(sim.state.returnRoute,null);
  assert.equal(rule(getDemoEvidence(sim.state),'TC-DEMO-01').status,'pending');
  sim.tick(1);const applied=getDemoEvidence(sim.state,'en');
  assert.equal(rule(applied,'TC-DEMO-01').status,'applied');
  assert.deepEqual(statuses(applied),initial.rows.map(row=>row.target));
  assert.deepEqual(applied.visual.current,initial.visual.current);
  assert.equal(applied.accessibilityApplied,false);
  assert.equal(applied.emptyState.current,'');
});

test('accessibility improves the format while keeping unapproved terminology unchanged',()=>{
  const sim=createSimulation();reachDesign(sim);sim.rework('design',['accessibility']);finishDesignReturn(sim);
  const evidence=getDemoEvidence(sim.state,'de');
  assert.deepEqual(statuses(evidence),['PROC','QA','DONE']);
  assert.equal(rule(evidence,'TC-DEMO-01').status,'target');
  assert.equal(rule(evidence,'DC-DEMO-01').status,'applied');
  assert.deepEqual(evidence.visual.current,evidence.visual.target);
  assert.notDeepEqual(evidence.visual.current,evidence.visual.before);
  assert.equal(evidence.visual.before.fontSize,11);
});

test('a second feedback loop preserves applied evidence while the new request is pending',()=>{
  const sim=createSimulation();reachDesign(sim);sim.rework('design',['clarity']);finishDesignReturn(sim);
  const previous=getDemoEvidence(sim.state,'en');sim.rework('design',['accessibility']);sim.pause();
  const pending=getDemoEvidence(sim.state,'en');
  assert.equal(rule(pending,'TC-DEMO-01').status,'applied');
  assert.equal(rule(pending,'DC-DEMO-01').status,'pending');
  assert.deepEqual(statuses(pending),statuses(previous));
  assert.deepEqual(pending.visual.current,previous.visual.current);
  sim.start();finishDesignReturn(sim);
  const applied=getDemoEvidence(sim.state,'en');
  assert.equal(applied.pending,false);assert.equal(applied.clarityApplied,true);assert.equal(applied.accessibilityApplied,true);
});

test('the empty-state result appears only when QA rework reaches the build morph',()=>{
  const sim=createSimulation();reachDesign(sim);sim.approve('design');sim.approve('plan');sim.tick(1e6);
  sim.rework('rework');const pending=getDemoEvidence(sim.state,'de');
  assert.equal(rule(pending,'EC-DEMO-01').status,'pending');assert.equal(pending.emptyState.current,'');
  sim.tick(TIMING.returning+TIMING.processing*TIMING.morphAt-1);
  assert.equal(getDemoEvidence(sim.state,'de').emptyState.current,'');
  sim.tick(1);const applied=getDemoEvidence(sim.state,'de');
  assert.equal(applied.buildRevision,2);assert.equal(rule(applied,'EC-DEMO-01').status,'applied');
  assert.equal(applied.emptyState.before,'');assert.equal(applied.emptyState.current,'Noch keine Aufträge vorhanden.');
  assert.deepEqual(statuses(applied),['PROC','QA','DONE']);
  sim.reset();assert.equal(getDemoEvidence(sim.state,'de').emptyState.current,'');
});

test('HTML is reusable across touchpoints and keeps the target separate from the actual draft',()=>{
  const sim=createSimulation();const before=sim.snapshot();
  const html=renderDemoEvidence(sim.state,'en',{compact:true});
  assert.match(html,/demo-evidence--compact/);assert.match(html,/NH-1042/);assert.match(html,/Atlas target/);
  for(const id of ['TC-DEMO-01','DC-DEMO-01','EC-DEMO-01'])assert.match(html,new RegExp(id));
  assert.match(html,/class="demo-evidence-current">PROC/);
  assert.match(html,/class="demo-evidence-target"[\s\S]*Service in progress/);
  assert.doesNotMatch(html,/\sid=|href="https?:|GetOneCMS/);
  assert.deepEqual(sim.snapshot(),before);
  sim.state.appliedDesignFeedback=['clarity'];sim.state.designRevision=2;
  const clearer=renderDemoEvidence(sim.state,'en');
  assert.match(clearer,/class="demo-evidence-current">Service in progress/);
  assert.doesNotMatch(clearer,/demo-evidence-current is-accessible/);
});
