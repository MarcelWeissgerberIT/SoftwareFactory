/**
 * Deterministic software-factory simulation. No browser or rendering dependencies.
 *
 * Controls return whether they changed semantic state. tick() returns false for
 * movement alone; renderers may still read progress fields on every frame.
 * A reset preserves the chosen playback speed and the identity of `state`.
 */
export const TIMING = Object.freeze({
  travel: 2600,
  processing: 4000,
  returning: 4800,
  morphAt: 0.58,
});

const GATES = new Set(['design', 'plan', 'review', 'acceptance', 'knowledge']);
const DESIGN_CODES = new Set(['clarity', 'accessibility']);
const STATIONS = [
  'Auftrag', 'Atlas-Kontext', 'Plan & Freigabe',
  'Umsetzung', 'Prüfen & Abnehmen', 'Atlas-Rückfluss',
];
const GATE_LABELS = {
  design: 'Design prüfen',
  plan: 'Plan freigeben',
  review: 'Prüfnachweise bewerten',
  acceptance: 'Ergebnis fachlich abnehmen',
  knowledge: 'Erkenntnisse in Atlas übernehmen',
};
const MORPH_TIME = TIMING.travel + TIMING.processing * TIMING.morphAt;
const FINISH_TIME = TIMING.travel + TIMING.processing;
const QA_DEFAULT = 'Leere Listen verständlich erklären';

function initialState(speed = 1) {
  return {
    phase: 'idle',
    runStage: 0,
    elapsed: 0,
    speed,
    gate: null,
    approved: new Set(),
    reviewed: false,
    formStage: 0,
    cycle: null,
    travelProgress: 0,
    returnRoute: null,
    returnProgress: 0,
    designRevision: 1,
    buildRevision: 1,
    designFeedback: [],
    appliedDesignFeedback: [],
    reworkCount: 0,
    events: [],
  };
}

export function createSimulation() {
  const state = initialState();
  let resumePhase = null;
  let pendingRevision = null;
  let stationMorphed = false;

  function event(type, label, revision = state.buildRevision) {
    state.events.push({ type, label, revision });
  }

  function progress() {
    state.travelProgress = Math.min(1, state.elapsed / TIMING.travel);
    state.cycle = state.elapsed < TIMING.travel
      ? null
      : Math.min(1, (state.elapsed - TIMING.travel) / TIMING.processing);
  }

  function enterGate(gate) {
    state.phase = 'gate';
    state.gate = gate;
    event('gate', GATE_LABELS[gate], gate === 'design' ? state.designRevision : state.buildRevision);
  }

  function nextStation() {
    state.runStage += 1;
    state.elapsed = 0;
    state.cycle = null;
    state.travelProgress = 0;
    state.phase = 'running';
    state.gate = null;
    stationMorphed = false;
    event('station', `Weiter zu ${STATIONS[state.runStage]}`);
  }

  function finishStation() {
    if (state.runStage === 2) enterGate('design');
    else if (state.runStage === 4) enterGate('review');
    else if (state.runStage === 5) enterGate('knowledge');
    else nextStation();
  }

  function morph() {
    const previousForm = state.formStage;
    state.formStage = state.runStage;
    stationMorphed = true;
    if (pendingRevision === 'design') {
      state.designRevision += 1;
      state.appliedDesignFeedback = [...state.designFeedback];
      pendingRevision = null;
      event('revision', `Design ${state.designRevision} sichtbar umgesetzt`, state.designRevision);
      return true;
    }
    if (pendingRevision === 'rework') {
      state.buildRevision += 1;
      pendingRevision = null;
      event('revision', `Build ${state.buildRevision} nachgearbeitet`, state.buildRevision);
      return true;
    }
    if (previousForm !== state.formStage) {
      event('artifact', `Ergebnis aus ${STATIONS[state.runStage]} entsteht`);
      return true;
    }
    return false;
  }

  function tick(dtMs) {
    if (typeof dtMs !== 'number' || !Number.isFinite(dtMs) || dtMs < 0) {
      throw new TypeError('tick erwartet endliche, nichtnegative Millisekunden.');
    }
    const scaled = dtMs * state.speed;
    if (!Number.isFinite(scaled)) throw new RangeError('Die Zeitspanne ist zu groß.');
    if (!scaled || (state.phase !== 'running' && state.phase !== 'returning')) return false;
    let remaining = scaled;
    let changed = false;

    // Each iteration ends at an actual event boundary. Surplus time may cross
    // stations, but never a human gate. Rework arrival starts processing in place.
    while (remaining > 0 && (state.phase === 'running' || state.phase === 'returning')) {
      if (state.phase === 'returning') {
        const consumed = Math.min(remaining, TIMING.returning - state.elapsed);
        state.elapsed += consumed;
        remaining -= consumed;
        state.returnProgress = Math.min(1, state.elapsed / TIMING.returning);
        if (state.elapsed < TIMING.returning) break;
        state.runStage = state.returnRoute === 'design' ? 2 : 3;
        state.returnRoute = null;
        state.returnProgress = 0;
        state.elapsed = TIMING.travel;
        state.travelProgress = 1;
        state.cycle = 0;
        state.phase = 'running';
        stationMorphed = false;
        event('arrival', `Nacharbeit in ${STATIONS[state.runStage]} beginnt`);
        changed = true;
        continue;
      }

      const boundary = state.elapsed < TIMING.travel
        ? TIMING.travel
        : !stationMorphed ? MORPH_TIME : FINISH_TIME;
      const consumed = Math.min(remaining, boundary - state.elapsed);
      state.elapsed += consumed;
      remaining -= consumed;
      progress();
      if (state.elapsed < boundary) break;
      if (boundary === TIMING.travel) {
        event('arrival', `${STATIONS[state.runStage]} bearbeitet den Auftrag`);
        changed = true;
      } else if (boundary === MORPH_TIME) {
        changed = morph() || changed;
      } else {
        finishStation();
        changed = true;
      }
    }
    return changed;
  }

  function start() {
    if (state.phase === 'idle') {
      state.phase = 'running';
      event('start', 'Auftrag startet in der Software Factory');
      return true;
    }
    if (state.phase === 'paused') {
      state.phase = resumePhase;
      resumePhase = null;
      event('resume', 'Simulation fortgesetzt');
      return true;
    }
    // Starting playback is never an implicit approval or a fresh run.
    return false;
  }

  function pause() {
    if (state.phase !== 'running' && state.phase !== 'returning') return false;
    resumePhase = state.phase;
    state.phase = 'paused';
    event('pause', 'Simulation pausiert');
    return true;
  }

  function reset() {
    Object.assign(state, initialState(state.speed));
    resumePhase = null;
    pendingRevision = null;
    stationMorphed = false;
    return true;
  }

  function approve(gate) {
    if (!GATES.has(gate)) throw new TypeError('Unbekannte Freigabe.');
    if (state.phase !== 'gate' || state.gate !== gate) {
      throw new Error(`Die Freigabe „${gate}“ ist aktuell nicht möglich.`);
    }
    state.approved.add(gate);
    event('approval', `${GATE_LABELS[gate]} bestätigt`, gate === 'design' ? state.designRevision : state.buildRevision);
    if (gate === 'design') {
      enterGate('plan');
    } else if (gate === 'review') {
      state.reviewed = true;
      enterGate('acceptance');
    } else if (gate === 'knowledge') {
      state.gate = null;
      state.phase = 'complete';
      event('complete', 'Bestätigte Erkenntnisse in Atlas übernommen');
    } else {
      nextStation();
    }
    return true;
  }

  function rework(kind, feedback) {
    if (kind !== 'design' && kind !== 'rework') throw new TypeError('Unbekannter Nacharbeitsweg.');
    if (state.phase !== 'gate' || (kind === 'design'
      ? state.gate !== 'design'
      : state.gate !== 'review' && state.gate !== 'acceptance')) {
      throw new Error('Nacharbeit ist an diesem Punkt nicht möglich.');
    }
    let selectedFeedback = null;
    let qaFeedback = QA_DEFAULT;
    if (kind === 'design') {
      if (!Array.isArray(feedback) || feedback.length === 0 || feedback.some(code => !DESIGN_CODES.has(code))) {
        throw new TypeError('Design-Feedback benötigt clarity und/oder accessibility.');
      }
      selectedFeedback = [...new Set([...state.designFeedback, ...feedback])];
    } else if (feedback !== undefined) {
      if (typeof feedback !== 'string' || !feedback.trim()) throw new TypeError('QA-Feedback muss ein nichtleerer Text sein.');
      qaFeedback = feedback.trim();
    }

    // All validation is complete before the first state mutation.
    if (kind === 'design') {
      state.designFeedback = selectedFeedback;
      state.approved.delete('design');
      state.approved.delete('plan');
    } else {
      state.reworkCount += 1;
    }
    state.approved.delete('review');
    state.approved.delete('acceptance');
    state.approved.delete('knowledge');
    state.reviewed = false;
    state.phase = 'returning';
    state.gate = null;
    state.returnRoute = kind;
    state.returnProgress = 0;
    state.elapsed = 0;
    state.cycle = null;
    state.travelProgress = 1;
    pendingRevision = kind;
    stationMorphed = false;
    resumePhase = null;
    event('rework', kind === 'design'
      ? `Design überarbeiten: ${feedback.map(code => code === 'clarity' ? 'verständliche Statusbegriffe' : 'Kontrast und Lesbarkeit').join(', ')}`
      : `QA-Nacharbeit: ${qaFeedback}`, kind === 'design' ? state.designRevision : state.buildRevision);
    return true;
  }

  function setSpeed(speed) {
    if (speed !== 1 && speed !== 2 && speed !== 4) throw new RangeError('Erlaubte Geschwindigkeiten sind 1, 2 und 4.');
    if (speed === state.speed) return false;
    state.speed = speed;
    return true;
  }

  function snapshot() {
    return {
      ...state,
      approved: [...state.approved],
      designFeedback: [...state.designFeedback],
      appliedDesignFeedback: [...state.appliedDesignFeedback],
      events: state.events.map(item => ({ ...item })),
      resumePhase,
      pendingRevision,
      timing: { ...TIMING },
    };
  }

  return { state, tick, start, pause, reset, approve, rework, setSpeed, snapshot };
}
