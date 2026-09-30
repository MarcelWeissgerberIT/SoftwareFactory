import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
async function module(path){const source=await readFile(new URL(path,import.meta.url),'utf8');return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)}
const {createSimulation,TIMING}=await module('../dist/engine.js');
const {ORDER,describeWork}=await module('../dist/order-details.js');
test('work descriptions follow the work location and never mutate the order',()=>{
 const sim=createSimulation();sim.start();sim.tick(6600);sim.state.selected=5;
 const before=sim.snapshot();
 for(const view of ['business','engineering']){const work=describeWork(sim.state,view);assert.match(work.title,/Atlas/);for(const field of ['action','input','tool','output','decision','progressLabel'])assert.equal(typeof work[field],'string');assert.ok(work.checks.length);}
 assert.deepEqual(sim.snapshot(),before);assert.equal(ORDER.simulationOnly,true);
});
test('a requested design revision is described as pending until it is processed',()=>{
 const sim=createSimulation();sim.start();sim.tick(1e6);sim.rework('design',['clarity']);
 assert.equal(sim.state.designRevision,1);assert.match(describeWork(sim.state).output,/Geplant: Entwurf v2/);assert.match(describeWork(sim.state).action,/bleibt auf dem Rückweg unverändert/);
 sim.tick(TIMING.returning+TIMING.processing*TIMING.morphAt-1);
 assert.equal(sim.state.designRevision,1);assert.match(describeWork(sim.state).output,/2/);
 sim.tick(1);assert.equal(sim.state.designRevision,2);assert.match(describeWork(sim.state).action,/zeigt jetzt/);
});
