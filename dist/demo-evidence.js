import { ORDER as orderDE } from './order-details.js';
import { ORDER as orderEN } from './order-details-en.js';

// Fictional Atlas references only. This module is a pure projection of engine
// state: requesting feedback never changes the current artifact prematurely.
const COPY = {
  en: {
    title:'From Atlas rule to visible result', before:'Before', current:'Current', target:'Atlas target', applied:'Applied', pending:'Pending',
    source:'Fictional Atlas reference', rules:'Atlas rules', design:'Design', build:'Build',
    pendingNote:'ONE has received the feedback. The current result stays unchanged until reprocessing applies it.',
    idleNote:'Atlas supplies the target. The current draft still shows the internal status codes.',
    appliedNote:'The current result reflects the applied feedback; each change retains its Atlas reference.',
    emptyTitle:'C-309 · Customer with no orders', noMessage:'No message', emptyTarget:'No orders yet.',
    designBefore:'Small, muted text without distinct status fields', designTarget:'Larger, darker text and distinct status fields',
    comparison:'Before and current result for three fictional Nordhafen service orders',
    thisChange:'This change',why:'Why',after:'After',requested:'Requested; the current result stays unchanged until reprocessing applies this change.',
  },
  de: {
    title:'Von der Atlas-Regel zum sichtbaren Ergebnis', before:'Vorher', current:'Aktuell', target:'Atlas-Ziel', applied:'Angewendet', pending:'Ausstehend',
    source:'Fiktive Atlas-Referenz', rules:'Atlas-Regeln', design:'Design', build:'Build',
    pendingNote:'ONE hat das Feedback erhalten. Das aktuelle Ergebnis bleibt unverändert, bis die erneute Bearbeitung es anwendet.',
    idleNote:'Atlas liefert das Ziel. Der aktuelle Entwurf zeigt noch die internen Statuscodes.',
    appliedNote:'Das aktuelle Ergebnis zeigt das angewendete Feedback; jede Änderung behält ihren Atlas-Bezug.',
    emptyTitle:'C-309 · Kunde ohne Aufträge', noMessage:'Kein Hinweis', emptyTarget:'Noch keine Aufträge vorhanden.',
    designBefore:'Kleine, zurückhaltende Schrift ohne deutliche Statusfelder', designTarget:'Größere, dunklere Schrift und deutliche Statusfelder',
    comparison:'Vorher und aktuelles Ergebnis für drei fiktive Nordhafen-Serviceaufträge',
    thisChange:'Diese Änderung',why:'Warum',after:'Danach',requested:'Beauftragt; das aktuelle Ergebnis bleibt unverändert, bis die erneute Bearbeitung diese Änderung anwendet.',
  },
};
const BASE_VISUAL = Object.freeze({fontSize:11,fontWeight:450,textColor:'#8b9790',statusColor:'#85998e',rowColor:'#edf1eb',badge:false});
const TARGET_VISUAL = Object.freeze({fontSize:13,fontWeight:650,textColor:'#243b45',statusColor:'#245e4a',rowColor:'#dcebe1',badge:true});
const revision = value => Number.isInteger(value) && value > 0 ? value : 1;
const feedbackCodes = values => new Set(Array.isArray(values) ? values.filter(code => code === 'clarity' || code === 'accessibility') : []);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

function describeChange(state, language, rows, applied, requested, buildRevision, copy) {
  const pendingDesign = [...requested].filter(code => !applied.has(code));
  const pendingBuild = state.pendingRevision === 'rework' || Number(state.reworkCount || 0) > buildRevision - 1;
  const kind = pendingBuild ? 'empty-state' : pendingDesign.at(-1) || (buildRevision > 1 ? 'empty-state' : [...applied].at(-1)) || 'intro';
  const pending = pendingBuild || pendingDesign.length > 0;
  const status = pending ? 'pending' : kind === 'intro' ? 'target' : 'applied';
  const de = language === 'de', done = status === 'applied';
  const currentLabels = rows.map(row => row.current).join(' · ');
  const labelChanges = rows.map(row => `${row.before} → ${row.target}`).join('; ');
  const descriptions = {
    intro:{
      title:de ? 'So kann der Entwurf besser werden' : 'How this draft can improve',
      before:de ? 'Interne Codes und zurückhaltende Schrift' : 'Internal codes and muted text',
      after:de ? 'Verständliche Servicebegriffe und gut lesbarer Status' : 'Clear service labels and readable status text',
      reason:de ? 'Kunden sollen ihren Servicezustand ohne interne Codes erkennen und den Status auch ohne Farbunterscheidung lesen können. Atlas TC-DEMO-01 und DC-DEMO-01 geben das Ziel vor.' : 'Customers need to understand their service status without internal codes and read it without relying on colour. Atlas TC-DEMO-01 and DC-DEMO-01 define the target.',
      sourceId:'TC-DEMO-01 / DC-DEMO-01',sourceIds:['TC-DEMO-01','DC-DEMO-01'],unchanged:'',
    },
    clarity:{
      title:de ? (done ? 'Interne Codes durch Servicebegriffe ersetzt' : 'Interne Codes durch Servicebegriffe ersetzen') : (done ? 'Internal codes replaced with service labels' : 'Replace internal codes with service labels'),
      before:rows.map(row => row.before).join(' · '),after:rows.map(row => row.target).join(' · '),
      reason:de ? 'Kunden sollen den Servicezustand ohne interne Codes verstehen. Atlas TC-DEMO-01 legt dafür genau diese Begriffe fest.' : 'Customers should understand their service status without internal codes. Atlas TC-DEMO-01 specifies these exact labels.',
      sourceId:'TC-DEMO-01',sourceIds:['TC-DEMO-01'],
      unchanged:de ? 'Schrift und Kontrast bleiben in diesem Schritt unverändert.' : 'Typography and contrast stay unchanged in this step.',
      examples:labelChanges,
    },
    accessibility:{
      title:de ? (done ? 'Schrift und Kontrast verbessert' : 'Schrift und Kontrast verbessern') : (done ? 'Typography and contrast improved' : 'Improve typography and contrast'),
      before:de ? 'Kleinere normale Schrift · blasses Graugrün' : 'Smaller regular-weight text · muted grey-green',
      after:de ? 'Größere halbfette Schrift · dunkles Grün · deutliches Statusfeld' : 'Larger semibold text · dark green · distinct status field',
      reason:de ? 'Kunden sollen den vollständigen Status schnell und auch ohne Farbunterscheidung lesen können. Atlas DC-DEMO-01 verlangt lesbare Beschriftungen und Text zusätzlich zur Farbe.' : 'Customers should quickly read the full status without relying on colour. Atlas DC-DEMO-01 requires readable labels and text alongside colour.',
      sourceId:'DC-DEMO-01',sourceIds:['DC-DEMO-01'],
      unchanged:de ? `Statusbegriffe bleiben in diesem Schritt unverändert: ${currentLabels}.` : `Labels unchanged in this step: ${currentLabels}.`,
    },
    'empty-state':{
      title:de ? (done ? 'Leere Liste für C-309 erklärt' : 'Leere Liste für C-309 erklären') : (done ? 'Empty list for C-309 explained' : 'Explain the empty list for C-309'),
      before:de ? 'C-309 · 0 Aufträge · kein Hinweis' : 'C-309 · 0 orders · no message',
      after:copy.emptyTarget,
      reason:de ? 'Der Kunde soll erkennen, dass keine Aufträge vorliegen, statt einen Ladefehler zu vermuten. Atlas EC-DEMO-01 verlangt diesen Hinweis.' : 'The customer should know there are no orders, rather than suspect a loading error. Atlas EC-DEMO-01 requires this message.',
      sourceId:'EC-DEMO-01',sourceIds:['EC-DEMO-01'],
      unchanged:de ? 'Die drei vorhandenen Serviceaufträge und ihre Statusbegriffe bleiben unverändert.' : 'The three existing service orders and their status labels stay unchanged.',
    },
  };
  return {kind,status,pending,statusLabel:copy[status],...descriptions[kind]};
}

/** A serializable, bilingual evidence model. Accepts engine state or snapshot. */
export function getDemoEvidence(state = {}, language = 'en') {
  language = language === 'de' ? 'de' : 'en';
  const copy = COPY[language], order = language === 'de' ? orderDE : orderEN;
  const applied = feedbackCodes(state.appliedDesignFeedback), requested = feedbackCodes(state.designFeedback);
  const clarityApplied = applied.has('clarity'), accessibilityApplied = applied.has('accessibility');
  const designRevision = revision(state.designRevision), buildRevision = revision(state.buildRevision);
  const emptyStateApplied = buildRevision > 1;
  const statusFor = (code, isApplied) => isApplied ? 'applied' : requested.has(code) ? 'pending' : 'target';
  const emptyStatus = emptyStateApplied ? 'applied' : state.reworkCount > 0 || state.pendingRevision === 'rework' ? 'pending' : 'target';
  const rows = order.exampleData.map(row => ({
    id:row.id, reference:row.reference, title:row.title, owner:row.owner,
    before:row.status, current:clarityApplied ? row.readableStatus : row.status,
    target:row.readableStatus, sourceId:'TC-DEMO-01',
  }));
  const terminologyBefore = rows.map(row => row.before).join(' · '), terminologyTarget = rows.map(row => row.target).join(' · ');
  const states = {
    'TC-DEMO-01':{status:statusFor('clarity',clarityApplied),before:terminologyBefore,current:rows.map(row => row.current).join(' · '),target:terminologyTarget},
    'DC-DEMO-01':{status:statusFor('accessibility',accessibilityApplied),before:copy.designBefore,current:accessibilityApplied ? copy.designTarget : copy.designBefore,target:copy.designTarget},
    'EC-DEMO-01':{status:emptyStatus,before:'',current:emptyStateApplied ? copy.emptyTarget : '',target:copy.emptyTarget},
  };
  const rules = order.constraints.map(rule => ({
    id:rule.id,type:rule.type,title:rule.title,description:rule.description,
    requirements:[...rule.rules],source:rule.source,reference:`Atlas · ${rule.id}`,
    ...states[rule.id],statusLabel:copy[states[rule.id].status],
  }));
  const change = describeChange(state,language,rows,applied,requested,buildRevision,copy);
  const pending = change.pending || rules.some(rule => rule.status === 'pending');
  return {
    language,designRevision,buildRevision,clarityApplied,accessibilityApplied,emptyStateApplied,pending,
    rows,rules,change,
    emptyState:{...states['EC-DEMO-01'],applied:emptyStateApplied,sourceId:'EC-DEMO-01'},
    visual:{before:{...BASE_VISUAL},current:{...(accessibilityApplied ? TARGET_VISUAL : BASE_VISUAL)},target:{...TARGET_VISUAL}},
    labels:{...copy},note:pending ? copy.pendingNote : clarityApplied || accessibilityApplied || emptyStateApplied ? copy.appliedNote : copy.idleNote,
  };
}

/** Escaped HTML string; no DOM dependency or duplicate IDs across touchpoints. */
export function renderDemoEvidence(state, language = 'en', {compact = false} = {}) {
  const evidence = getDemoEvidence(state, language), c = evidence.labels;
  const change = evidence.change;
  const statusPill = rule => `<span class="demo-evidence-status is-${rule.status}">${escapeHTML(rule.statusLabel)}</span>`;
  const rows = evidence.rows.map(row => `<div class="demo-evidence-order">
    <div class="demo-evidence-order-title"><span>${escapeHTML(row.reference)}</span><strong>${escapeHTML(row.title)}</strong></div>
    <div class="demo-evidence-values"><span class="demo-evidence-before">${escapeHTML(row.before)}</span><span class="demo-evidence-current${evidence.accessibilityApplied ? ' is-accessible' : ''}">${escapeHTML(row.current)}</span></div>
    ${evidence.clarityApplied ? '' : `<div class="demo-evidence-target"><span>${escapeHTML(c.target)}</span> ${escapeHTML(row.target)}</div>`}
  </div>`).join('');
  const empty = evidence.emptyState;
  const rules = evidence.rules.map(rule => `<details class="demo-evidence-rule" data-evidence-rule="${escapeHTML(rule.id)}" data-evidence-status="${rule.status}">
    <summary><span><code>${escapeHTML(rule.id)}</code><strong>${escapeHTML(rule.title)}</strong></span>${statusPill(rule)}</summary>
    <div class="demo-evidence-rule-body"><p>${escapeHTML(rule.description)}</p><ul>${rule.requirements.map(text => `<li>${escapeHTML(text)}</li>`).join('')}</ul>
      <dl><div><dt>${escapeHTML(c.before)}</dt><dd>${escapeHTML(rule.before || c.noMessage)}</dd></div><div><dt>${escapeHTML(c.current)}</dt><dd>${escapeHTML(rule.current || c.noMessage)}</dd></div>${rule.status === 'applied' ? '' : `<div><dt>${escapeHTML(c.target)}</dt><dd>${escapeHTML(rule.target)}</dd></div>`}</dl>
      <p class="demo-evidence-reference">${escapeHTML(c.source)}: ${escapeHTML(rule.reference)} · ${escapeHTML(rule.source)}</p>
    </div>
  </details>`).join('');
  return `<section class="demo-evidence${compact ? ' demo-evidence--compact' : ''}" lang="${evidence.language}" aria-label="${escapeHTML(c.comparison)}">
    <div class="demo-evidence-change is-${change.status}" data-change-kind="${change.kind}">
      <div class="demo-evidence-change-top"><span>${escapeHTML(c.thisChange)} · ${escapeHTML(change.sourceId)}</span>${statusPill(change)}</div>
      <strong class="demo-evidence-change-title">${escapeHTML(change.title)}</strong>
      <p class="demo-evidence-change-reason"><b>${escapeHTML(c.why)}:</b> ${escapeHTML(change.reason)}</p>
      <div class="demo-evidence-change-delta"><div><span>${escapeHTML(c.before)}</span><p>${escapeHTML(change.before)}</p></div><div><span>${escapeHTML(change.status === 'applied' ? c.after : c.target)}</span><p>${escapeHTML(change.after)}</p></div></div>
      ${change.unchanged ? `<p class="demo-evidence-change-unchanged">${escapeHTML(change.unchanged)}</p>` : ''}
      ${change.pending ? `<p class="demo-evidence-change-pending">${escapeHTML(c.requested)}</p>` : ''}
    </div>
    <div class="demo-evidence-heading"><div><span>ATLAS → ONE</span><strong>${escapeHTML(c.title)}</strong></div></div>
    <p class="demo-evidence-meta">${escapeHTML(c.design)} v${evidence.designRevision} · ${escapeHTML(c.build)} v${evidence.buildRevision} · Atlas / ${escapeHTML(change.sourceId)}</p>
    <div class="demo-evidence-column-labels"><span>${escapeHTML(c.before)}</span><span>${escapeHTML(c.current)}</span></div>
    <div class="demo-evidence-orders">${rows}</div>
    <div class="demo-evidence-empty"><div><strong>${escapeHTML(c.emptyTitle)}</strong><code>EC-DEMO-01</code></div><div class="demo-evidence-values"><span class="demo-evidence-before">${escapeHTML(c.noMessage)}</span><span class="demo-evidence-current${evidence.accessibilityApplied ? ' is-accessible' : ''}">${escapeHTML(empty.current || c.noMessage)}</span></div>${empty.applied ? '' : `<div class="demo-evidence-target"><span>${escapeHTML(c.target)}</span> ${escapeHTML(empty.target)}</div>`}</div>
    <p class="demo-evidence-note${evidence.pending ? ' is-pending' : ''}">${escapeHTML(evidence.note)}</p>
    <div class="demo-evidence-rules" aria-label="${escapeHTML(c.rules)}">${rules}</div>
  </section>`;
}
