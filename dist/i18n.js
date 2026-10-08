const STORAGE_KEY = 'software-factory-language';
let language = 'en';
try { if (globalThis.localStorage?.getItem(STORAGE_KEY) === 'de') language = 'de'; } catch {}

export const getLanguage = () => language;
export function setLanguage(value) {
  if (!['en', 'de'].includes(value)) throw new TypeError('Unsupported language');
  language = value;
  try { globalThis.localStorage?.setItem(STORAGE_KEY, value); } catch {}
}

const EN = {
  "Vergleiche NH-1042 bis NH-1044 mit Atlas TC-DEMO-01 und DC-DEMO-01. ONE gibt dein Feedback an die nächste Design-Iteration weiter.":"Compare NH-1042 to NH-1044 with Atlas TC-DEMO-01 and DC-DEMO-01. ONE carries your feedback into the next design iteration.",
  "ONE übernimmt die Atlas-Regeln TC-DEMO-01, DC-DEMO-01 und EC-DEMO-01 in die Arbeitspakete für die Coding Agents. Gib diesen Plan frei.":"ONE includes Atlas rules TC-DEMO-01, DC-DEMO-01 and EC-DEMO-01 in the work packages for the coding agents. Approve this plan.",
  "Vergleiche die drei Service-Aufträge mit TC-DEMO-01 und DC-DEMO-01. Prüfe auch den leeren Zustand für C-309 nach EC-DEMO-01. Ein Befund geht über ONE zurück zum Coding Agent.":"Compare the three service orders with TC-DEMO-01 and DC-DEMO-01. Also check the empty state for C-309 against EC-DEMO-01. A finding returns to the coding agent through ONE.",
  "Prüfe den aktuellen Stand und noch offene Regeln zu TC-DEMO-01, DC-DEMO-01 und EC-DEMO-01. Bestätige diesen Stand für Atlas. ONE verknüpft Auftrag und Freigabe.":"Review the current result and any open rules for TC-DEMO-01, DC-DEMO-01 and EC-DEMO-01. Confirm this state for Atlas. ONE links the order and approval.",
  "↻ TC-DEMO-01 · Labels anwenden":"↻ TC-DEMO-01 · Apply labels",
  "✓ TC-DEMO-01 · Labels anwenden":"✓ TC-DEMO-01 · Labels applied",
  "↻ DC-DEMO-01 · Design anwenden":"↻ DC-DEMO-01 · Apply design",
  "✓ DC-DEMO-01 · Design anwenden":"✓ DC-DEMO-01 · Design applied",
  "↻ EC-DEMO-01 · Leerzustand umsetzen":"↻ EC-DEMO-01 · Implement empty state",
  "✓ EC-DEMO-01 · Leerzustand umgesetzt":"✓ EC-DEMO-01 · Empty state applied",
  "↻ Statusbegriffe klären · TC-DEMO-01":"↻ Clarify status labels · TC-DEMO-01",
  "✓ Statusbegriffe klären · TC-DEMO-01":"✓ Status labels clarified · TC-DEMO-01",
  "↻ Lesbarkeit verbessern · DC-DEMO-01":"↻ Improve readability · DC-DEMO-01",
  "✓ Lesbarkeit verbessern · DC-DEMO-01":"✓ Readability improved · DC-DEMO-01",
  "✓ Leerzustand erklärt · EC-DEMO-01":"✓ Empty list explained · EC-DEMO-01",
  "↻ Leere Liste erklären · EC-DEMO-01":"↻ Explain empty list · EC-DEMO-01",
  "Die Aufnahme konnte nicht erstellt werden.":"The recording could not be created.",
  "Die Aufnahme enthält keine Videodaten. Starte einen neuen Durchlauf und lasse ihn kurz laufen.":"The recording contains no video data. Start a new run and let it play briefly.",
  "Dieser Browser unterstützt die lokale Canvas-Videoaufnahme nicht.":"This browser does not support local canvas video recording.",
  "Kein unterstütztes Videoformat verfügbar.":"No supported video format is available.",
  "Die Aufnahme konnte nicht abgeschlossen werden. Bitte erneut versuchen.":"The recording could not be finalized. Please try again.",
  'Auftrag':'Order', 'Atlas-Kontext':'Atlas context', 'Design & Plan':'Design & plan',
  'Umsetzung':'Build', 'Prüfung':'Quality', 'Wissen':'Knowledge', 'Kontext':'Context',
  'Entwurf':'Design', 'Anwendung':'Application', 'Nachweise':'Evidence', 'QA + MENSCH':'QA + HUMAN',
  'Design-Review':'Design review', 'Planfreigabe':'Plan approval', 'Fachliche Prüfung':'Business review',
  'Fachliche Abnahme':'Business acceptance', 'Atlas-Übernahme':'Atlas update',
  'Design freigeben →':'Approve design →', 'Plan in der Demo freigeben':'Approve the demo plan',
  'Prüfung in der Demo bestätigen':'Confirm the demo review', 'Abnahme in der Demo erteilen':'Accept the demo result',
  'Wissen in der Demo übernehmen':'Confirm the demo knowledge update',
  'Prüfe den Entwurf. Dein Feedback schickt dieses Werkstück zurück in die Gestaltung.':'Review the design. Your feedback sends this workpiece back for another design iteration.',
  'Design bestätigt. Jetzt die drei Arbeitspakete freigeben: Statusansicht, Kundenzugriff und passende Prüfungen.':'Design confirmed. Now approve the three work packages: order status, customer access and the corresponding tests.',
  'Prüfe Statusansicht, Kundenzugriff und leere Listen. Ein Befund führt zurück zur Umsetzung und danach erneut durch die Prüfung.':'Review order status, customer access and empty lists. A finding sends the result back to build, followed by another review.',
  'Die fachliche Prüfung ist bestätigt. Die Abnahme ist deine separate Entscheidung für diesen Ergebnisstand.':'The business review is confirmed. Acceptance is your separate decision for this version of the result.',
  'Zur Übernahme ausgewählt: Statusbegriffe, Zugriffskriterien und Prüfergebnisse. Bestätige diese Auswahl für den simulierten Atlas-Rückfluss.':'Selected for the update: status labels, access criteria and test results. Confirm this selection for the simulated return to Atlas.',
  'Briefing aufnehmen':'Capture the brief', 'Atlas-Quellen verbinden':'Connect Atlas sources',
  'Entwurf gestalten':'Shape the design', 'Anwendung zusammensetzen':'Assemble the application',
  'Ergebnis prüfen':'Review the result', 'Wissen zuordnen':'Connect the knowledge',
  'Gesamte Factory':'Factory overview', '◎ Kundenportal':'◎ Customer portal', 'Meine Aufträge':'My orders',
  'In Bearbeitung':'In progress', 'In Prüfung':'In review', 'Abgeschlossen':'Completed',
  '✓ Leere Liste: „Noch keine Aufträge vorhanden.“':'✓ Empty list: “No orders yet.”',
  '↻ Status verständlicher machen':'↻ Make status labels clearer',
  '↻ Kontrast & Lesbarkeit verbessern':'↻ Improve contrast & readability',
  '✓ Status verständlicher machen':'✓ Clearer status labels',
  '✓ Kontrast & Lesbarkeit verbessern':'✓ Better contrast & readability',
  '✓ Leere Listen verbessert':'✓ Empty lists improved', '↻ Leere Listen nachbessern':'↻ Improve empty lists',
  'Pausieren':'Pause', 'Weiterfahren':'Resume', 'Entscheidung ansehen':'Review decision',
  'Noch ein Auftrag':'Run another order', 'Auftrag starten':'Start order',
  'Ein Auftrag. Du steuerst die Verbesserung.':'One order. You guide the improvement.',
  'Feedback → zurück ins Design':'Feedback → back to design', 'Befund → zurück zur Umsetzung':'Finding → back to build',
  'Auftrag pausiert · Factory frei erkunden':'Order paused · explore the factory',
  'Ergebnis abgenommen. Wissen in Atlas bestätigt.':'Result accepted. Knowledge confirmed in Atlas.',
  'Abgenommen':'Accepted', 'Werkstück wird zur Station transportiert':'Workpiece travels to the station',
  'Design-Schleife':'Design loop', 'Nacharbeit':'Rework',
  'Greifer dockt am Werkstück an':'Gripper connects to the workpiece',
  'Hubtisch hebt den Auftrag an':'Lift table raises the order',
  'Werkzeug bearbeitet das Ergebnis':'Tool processes the result',
  'Ergebnis wird aufs Band gesetzt':'Result is placed on the conveyor',
  'Werkstück bereit für die Übergabe':'Workpiece ready for handover',
  'Wartet auf deine Entscheidung':'Waiting for your decision', 'Auftrag abgeschlossen':'Order completed',
  'Ziel, Umfang und Erfolgskriterien gehören zum Briefing.':'The brief includes the goal, scope and success criteria.',
  'Anforderungen und Zugriffskriterien bleiben mit ihrer Quelle verbunden.':'Requirements and access criteria stay linked to their sources.',
  'Prüfung & Abnahme':'Review & acceptance',
  'Nach einer Nacharbeit werden Prüfung und Abnahme erneut verlangt.':'After rework, review and acceptance are required again.',
  'Bestätigtes Wissen':'Confirmed knowledge',
  'Ausgewählte Erkenntnisse werden in Atlas übernommen und zurückgelesen.':'Selected findings are added to Atlas and read back for verification.',
  'Kommt im weiteren Verlauf dazu.':'Available later in the workflow.',
  '3D ist in diesem Browser nicht verfügbar. Stationen unten erkunden.':'3D is unavailable in this browser. Explore the stations below.',
  'Plan & Freigabe':'Plan & approval', 'Prüfen & Abnehmen':'Review & accept', 'Atlas-Rückfluss':'Return to Atlas',
  'Design prüfen':'Review design', 'Plan freigeben':'Approve plan', 'Prüfnachweise bewerten':'Assess test evidence',
  'Ergebnis fachlich abnehmen':'Accept the business result', 'Erkenntnisse in Atlas übernehmen':'Add findings to Atlas',
  'Auftrag startet in der Software Factory':'Order starts in the software factory',
  'Simulation fortgesetzt':'Simulation resumed', 'Simulation pausiert':'Simulation paused',
  'Bestätigte Erkenntnisse in Atlas übernommen':'Confirmed findings added to Atlas',
  'verständliche Statusbegriffe':'clear status labels', 'Kontrast und Lesbarkeit':'contrast and readability',
  'Leere Listen verständlich erklären':'Explain empty lists clearly',
};

const patterns = [
  [/^Auftrag (\d+)$/, (_, n) => `Order ${n}`],
  [/^Entwurf v(\d+) · Deine Entscheidung$/, (_, n) => `Design v${n} · Your decision`],
  [/^Kundenportal · Design v(\d+) · Build v(\d+)$/, (_, d, b) => `Customer portal · Design v${d} · Build v${b}`],
  [/^Geschwindigkeit (\d+)-fach\. Ändern$/, (_, n) => `Speed ${n}×. Change speed`],
  [/^Deine Entscheidung: (.+)$/, (_, s) => `Your decision: ${t(s)}`],
  [/^Feedback fährt mit → Entwurf v(\d+)$/, (_, n) => `Feedback travels with the order → design v${n}`],
  [/^Befund fährt mit → Build v(\d+)$/, (_, n) => `Finding travels with the order → build v${n}`],
  [/^Design v(\d+) · Build v(\d+) · Wissen bestätigt$/, (_, d, b) => `Design v${d} · Build v${b} · Knowledge confirmed`],
  [/^Entwurf v(\d+); (\d+) Design-Verbesserungen\. Die Planfreigabe gehört zu diesem Stand\.$/, (_, d, n) => `Design v${d}; ${n} design improvements. Plan approval applies to this version.`],
  [/^Build v(\d+) · (\d+) Nacharbeit(?:en)? im gewählten Projekt\.$/, (_, b, n) => `Build v${b} · ${n} rework ${n === '1' ? 'cycle' : 'cycles'} in the selected project.`],
  [/^Weiter zu (.+)$/, (_, s) => `Moving to ${t(s)}`],
  [/^Design (\d+) sichtbar umgesetzt$/, (_, n) => `Design ${n} visibly implemented`],
  [/^Build (\d+) nachgearbeitet$/, (_, n) => `Build ${n} reworked`],
  [/^Ergebnis aus (.+) entsteht$/, (_, s) => `Result from ${t(s)} takes shape`],
  [/^Nacharbeit in (.+) beginnt$/, (_, s) => `Rework begins in ${t(s)}`],
  [/^(.+) bearbeitet den Auftrag$/, (_, s) => `${t(s)} processes the order`],
  [/^(.+) bestätigt$/, (_, s) => `${t(s)} confirmed`],
  [/^Design überarbeiten: (.+)$/, (_, s) => `Revise design: ${s.split(', ').map(t).join(', ')}`],
  [/^QA-Nacharbeit: (.+)$/, (_, s) => `QA rework: ${t(s)}`],
];

export function t(source) {
  if (language === 'de' || typeof source !== 'string') return source;
  if (Object.hasOwn(EN, source)) return EN[source];
  for (const [pattern, replace] of patterns) if (pattern.test(source)) return source.replace(pattern, replace);
  return source;
}
