import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Load the browser-targeted .js ES module independently of any parent package.
const source = await readFile(new URL('../dist/engine.js', import.meta.url), 'utf8');
const { createSimulation, TIMING } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const STATION_TIME = TIMING.travel + TIMING.processing;
const untilDesign = simulation => {
  simulation.start();
  simulation.tick(STATION_TIME * 3);
  assert.equal(simulation.state.gate, 'design');
};
const untilReview = simulation => {
  untilDesign(simulation);
  simulation.approve('design');
  simulation.approve('plan');
  simulation.tick(STATION_TIME * 2);
  assert.equal(simulation.state.gate, 'review');
};
function unchangedAfterFailure(simulation, action) {
  const before = simulation.snapshot();
  assert.throws(action);
  assert.deepEqual(simulation.snapshot(), before);
}

test('a large tick cannot skip gates; design, plan, review, acceptance and knowledge stay separate', () => {
  const simulation = createSimulation();
  simulation.start();
  simulation.tick(1e9);
  assert.equal(simulation.state.gate, 'design');
  assert.equal(simulation.state.runStage, 2);
  unchangedAfterFailure(simulation, () => simulation.approve('plan'));
  assert.equal(simulation.start(), false);
  assert.equal(simulation.tick(1e9), false);
  simulation.approve('design');
  assert.equal(simulation.state.gate, 'plan');
  unchangedAfterFailure(simulation, () => simulation.approve('acceptance'));
  simulation.approve('plan');
  simulation.tick(1e9);
  assert.equal(simulation.state.gate, 'review');
  assert.equal(simulation.state.reviewed, false);
  simulation.approve('review');
  assert.equal(simulation.state.gate, 'acceptance');
  assert.equal(simulation.state.reviewed, true);
  simulation.approve('acceptance');
  simulation.tick(1e9);
  assert.equal(simulation.state.gate, 'knowledge');
  simulation.approve('knowledge');
  assert.equal(simulation.state.phase, 'complete');
  assert.deepEqual(simulation.snapshot().approved, ['design', 'plan', 'review', 'acceptance', 'knowledge']);
});

test('design rework physically returns and applies feedback only at 58% of reprocessing', () => {
  const simulation = createSimulation();
  untilDesign(simulation);
  simulation.rework('design', ['clarity']);
  assert.equal(simulation.state.phase, 'returning');
  assert.equal(simulation.state.returnRoute, 'design');
  assert.equal(simulation.state.formStage, 2);
  assert.equal(simulation.state.designRevision, 1);
  assert.deepEqual(simulation.state.designFeedback, ['clarity']);
  assert.deepEqual(simulation.state.appliedDesignFeedback, []);
  assert.equal(simulation.tick(TIMING.returning - 1), false);
  assert.equal(simulation.state.designRevision, 1);
  assert.equal(simulation.tick(1), true);
  assert.equal(simulation.state.phase, 'running');
  assert.equal(simulation.state.runStage, 2);
  assert.equal(simulation.state.cycle, 0);
  assert.equal(simulation.state.elapsed, TIMING.travel);
  simulation.tick(TIMING.processing * TIMING.morphAt - 1);
  assert.equal(simulation.state.designRevision, 1);
  assert.deepEqual(simulation.state.appliedDesignFeedback, []);
  assert.equal(simulation.tick(1), true);
  assert.equal(simulation.state.designRevision, 2);
  assert.deepEqual(simulation.state.appliedDesignFeedback, ['clarity']);
  simulation.tick(TIMING.processing);
  assert.equal(simulation.state.gate, 'design');
  simulation.rework('design', ['accessibility']);
  simulation.tick(TIMING.returning + TIMING.processing * TIMING.morphAt);
  assert.equal(simulation.state.designRevision, 3);
  assert.deepEqual(simulation.state.appliedDesignFeedback, ['clarity', 'accessibility']);
  simulation.tick(TIMING.processing);
  simulation.approve('design');
  assert.equal(simulation.state.gate, 'plan');
});

test('QA rework retains form 4 during return, creates build 2 and requires fresh review and acceptance', () => {
  const simulation = createSimulation();
  untilReview(simulation);
  simulation.approve('review');
  simulation.rework('rework');
  assert.equal(simulation.state.returnRoute, 'rework');
  assert.equal(simulation.state.formStage, 4);
  assert.equal(simulation.state.reviewed, false);
  assert.equal(simulation.state.approved.has('review'), false);
  assert.equal(simulation.state.approved.has('acceptance'), false);
  assert.equal(simulation.state.approved.has('design'), true);
  assert.equal(simulation.state.approved.has('plan'), true);
  assert.equal(simulation.state.reworkCount, 1);
  assert.match(simulation.state.events.at(-1).label, /Leere Listen verständlich erklären/);
  simulation.tick(TIMING.returning + TIMING.processing * TIMING.morphAt - 1);
  assert.equal(simulation.state.runStage, 3);
  assert.equal(simulation.state.formStage, 4);
  assert.equal(simulation.state.buildRevision, 1);
  simulation.tick(1);
  assert.equal(simulation.state.formStage, 3);
  assert.equal(simulation.state.buildRevision, 2);
  simulation.tick(1e9);
  assert.equal(simulation.state.gate, 'review');
  unchangedAfterFailure(simulation, () => simulation.approve('acceptance'));
  simulation.approve('review');
  simulation.approve('acceptance');
  simulation.tick(1e9);
  assert.equal(simulation.state.gate, 'knowledge');
  simulation.approve('knowledge');
  assert.equal(simulation.state.phase, 'complete');
});

test('pause freezes travel, processing and a return; start resumes the exact motion phase', () => {
  const simulation = createSimulation();
  simulation.start();
  simulation.tick(900);
  simulation.pause();
  let frozen = simulation.snapshot();
  assert.equal(simulation.tick(1e9), false);
  assert.deepEqual(simulation.snapshot(), frozen);
  simulation.start();
  simulation.tick(TIMING.travel - 900 + 500);
  assert.equal(simulation.state.cycle, 500 / TIMING.processing);
  simulation.pause();
  frozen = simulation.snapshot();
  simulation.tick(1e9);
  assert.deepEqual(simulation.snapshot(), frozen);
  simulation.start();
  simulation.tick(1e9);
  simulation.rework('design', ['accessibility']);
  simulation.tick(1000);
  simulation.pause();
  frozen = simulation.snapshot();
  assert.equal(frozen.resumePhase, 'returning');
  simulation.tick(1e9);
  assert.deepEqual(simulation.snapshot(), frozen);
  simulation.start();
  assert.equal(simulation.state.phase, 'returning');
  simulation.tick(TIMING.returning - 1000);
  assert.equal(simulation.state.phase, 'running');
  assert.equal(simulation.state.cycle, 0);
});

test('reset during a paused return removes pending revisions, decisions, feedback and history but retains speed', () => {
  const simulation = createSimulation();
  const stateIdentity = simulation.state;
  untilDesign(simulation);
  simulation.rework('design', ['clarity']);
  simulation.tick(600);
  simulation.pause();
  simulation.setSpeed(4);
  simulation.reset();
  const fresh = createSimulation();
  fresh.setSpeed(4);
  assert.equal(simulation.state, stateIdentity);
  assert.deepEqual(simulation.snapshot(), fresh.snapshot());
  untilDesign(simulation);
  assert.equal(simulation.state.designRevision, 1);
  assert.deepEqual(simulation.state.appliedDesignFeedback, []);
});

test('invalid inputs and out-of-order actions leave all state unchanged', () => {
  const simulation = createSimulation();
  for (const value of [-1, NaN, Infinity, '10', undefined]) {
    unchangedAfterFailure(simulation, () => simulation.tick(value));
  }
  for (const value of [0, 3, '2', NaN]) {
    unchangedAfterFailure(simulation, () => simulation.setSpeed(value));
  }
  unchangedAfterFailure(simulation, () => simulation.approve('design'));
  unchangedAfterFailure(simulation, () => simulation.rework('design', ['clarity']));
  untilDesign(simulation);
  for (const feedback of [undefined, [], ['unknown'], ['clarity', 'unknown'], 'clarity']) {
    unchangedAfterFailure(simulation, () => simulation.rework('design', feedback));
  }
  unchangedAfterFailure(simulation, () => simulation.rework('unknown', ['clarity']));
  unchangedAfterFailure(simulation, () => simulation.rework('rework'));
  simulation.approve('design');
  simulation.approve('plan');
  simulation.tick(1e9);
  for (const feedback of ['', '   ', [], 42, null]) {
    unchangedAfterFailure(simulation, () => simulation.rework('rework', feedback));
  }
  unchangedAfterFailure(simulation, () => simulation.approve('unknown'));
  simulation.setSpeed(4);
  unchangedAfterFailure(simulation, () => simulation.tick(Number.MAX_VALUE));
});

test('progress-only frames are quiet and forms change only at the processing threshold', () => {
  const simulation = createSimulation();
  simulation.start();
  assert.equal(simulation.tick(100), false);
  assert.equal(simulation.state.travelProgress, 100 / TIMING.travel);
  assert.equal(simulation.tick(TIMING.travel - 100), true);
  assert.equal(simulation.state.cycle, 0);
  assert.equal(simulation.tick(100), false);
  simulation.tick(STATION_TIME - TIMING.travel - 100);
  assert.equal(simulation.state.runStage, 1);
  assert.equal(simulation.state.formStage, 0);
  simulation.tick(TIMING.travel + TIMING.processing * TIMING.morphAt - 1);
  assert.equal(simulation.state.formStage, 0);
  assert.equal(simulation.tick(1), true);
  assert.equal(simulation.state.formStage, 1);
  assert.equal(simulation.tick(10), false);
});

test('speed affects all motion and snapshots are serializable detached copies', () => {
  const simulation = createSimulation();
  simulation.setSpeed(2);
  simulation.start();
  simulation.tick(TIMING.travel / 2);
  assert.equal(simulation.state.elapsed, TIMING.travel);
  simulation.tick(1e9);
  simulation.rework('design', ['clarity']);
  simulation.tick(TIMING.returning / 4);
  assert.equal(simulation.state.returnProgress, 0.5);
  const snapshot = simulation.snapshot();
  assert.deepEqual(JSON.parse(JSON.stringify(snapshot)), snapshot);
  snapshot.approved.push('knowledge');
  snapshot.designFeedback.push('accessibility');
  snapshot.events[0].label = 'changed';
  assert.equal(simulation.state.approved.has('knowledge'), false);
  assert.deepEqual(simulation.state.designFeedback, ['clarity']);
  assert.notEqual(simulation.state.events[0].label, 'changed');
});
