/** Fictional, local presentation data. This module makes no tool or network calls. */
export const ORDER = {
  id: 'SF-001',
  title: 'Kundenportal · Auftragsstatus',
  customer: 'Musterkunde Nordhafen · fiktiv',
  simulationOnly: true,
  label: 'Fiktiver Demoauftrag',
  request: 'Unsere Kunden fragen regelmäßig nach dem Stand ihrer Aufträge. Sie sollen im Portal ihre eigenen Aufträge und deren Status sehen können.',
  goal: 'Kunden erkennen ihren Auftragsstand selbst. Verständliche Begriffe, ein klarer Hinweis bei leeren Listen und der Zugriff auf ausschließlich eigene Aufträge gehören zum Ziel.',
  method: 'Feature-Erweiterung',
  scope: [
    'Eine Auftragsübersicht mit den Zuständen Bearbeitung, Prüfung und Abschluss.',
    'Ein Zugriffskonzept, das die Übersicht auf die Aufträge des angemeldeten Kunden begrenzt.',
    'Ein verständlicher Hinweis, wenn für diesen Kunden noch keine Aufträge vorliegen.',
  ],
  criteria: [
    { id: 'K-01', title: 'Status verständlich', description: 'Kunden können die drei Zustände ohne interne Abkürzungen unterscheiden.' },
    { id: 'K-02', title: 'Nur eigene Aufträge', description: 'Der vorgesehene Zugriff begrenzt die Daten auf den angemeldeten Kunden; ein zweiter Demo-Kunde dient als Gegenbeispiel.' },
    { id: 'K-03', title: 'Leere Liste erklärt', description: 'Ohne Aufträge erscheint „Noch keine Aufträge vorhanden.“ statt einer kommentarlos leeren Ansicht.' },
    { id: 'K-04', title: 'Gut lesbar', description: 'Status und Beschriftungen sind klar lesbar. Die Demo zeigt eine Kontrastverbesserung; eine vollständige Barrierefreiheitsprüfung bleibt eine eigene Aufgabe.' },
  ],
  sources: [
    { id: 'BRIEF-DEMO', title: 'Kundenbriefing', kind: 'Fiktive Nutzerangabe', description: 'Zielgruppe, Änderungswunsch und erwartetes Ergebnis dieses Beispielauftrags.' },
    { id: 'REQ-DEMO-01', title: 'Aufträge im Kundenportal', kind: 'Fiktive Atlas-Anforderung', description: 'Vorgesehene Statusübersicht und Zuordnung der Aufträge zu einem Kunden.' },
    { id: 'DEC-DEMO-01', title: 'Kundenzugriff begrenzen', kind: 'Fiktive Atlas-Entscheidung', description: 'Ein Kunde soll ausschließlich seine eigenen Aufträge erhalten. Das Zugriffskonzept ist vor einer echten Umsetzung zu prüfen.' },
    { id: 'TEST-DEMO-01', title: 'Prüffälle für Status, Zugriff und leere Liste', kind: 'Fiktiver Prüfplan', description: 'Beispielkriterien für einen späteren Prüflauf; in dieser Website werden keine Anwendungstests ausgeführt.' },
  ],
  workPackages: [
    { id: 'AP-01', title: 'Statusansicht gestalten und bauen', role: 'Design und Entwicklung', tool: 'Norda · Codex oder Claude', description: 'Den Portalentwurf abstimmen und daraus eine Auftragsliste mit nachvollziehbaren Statusbeschriftungen vorbereiten.' },
    { id: 'AP-02', title: 'Kundenzugriff berücksichtigen', role: 'Entwicklung', tool: 'Norda · gewählter Agent', description: 'Die Atlas-Anforderung in ein Zugriffskonzept und passende Änderungen im gewählten Projekt übersetzen.' },
    { id: 'AP-03', title: 'Prüfung und Übergabe vorbereiten', role: 'Qualitätssicherung und Fachverantwortliche', tool: 'Norda · Atlas · Mensch', description: 'Prüffälle mit Erfolgskriterien verbinden, den konkreten Ergebnisstand bewerten und die Abnahme separat entscheiden.' },
  ],
  roles: [
    { title: 'Fachverantwortliche', responsibility: 'Ziel, Entwurf, Umfang und Abnahme entscheiden.' },
    { title: 'Atlas', responsibility: 'Anforderungen, Entscheidungen und dokumentiertes Wissen als Arbeitsgrundlage bereitstellen.' },
    { title: 'Norda', responsibility: 'Auftrag, ausgewählte Agenten, Arbeitsschritte und Ergebnisse zusammenführen.' },
    { title: 'Codex oder Claude', responsibility: 'Im freigegebenen Norda-Schritt Analyse oder Entwicklungsarbeit unterstützen.' },
  ],
  exampleData: [
    { id: 'Auftrag 01', owner: 'Demo-Kunde A', status: 'PROC', readableStatus: 'In Bearbeitung' },
    { id: 'Auftrag 02', owner: 'Demo-Kunde A', status: 'QA', readableStatus: 'In Prüfung' },
    { id: 'Auftrag 03', owner: 'Demo-Kunde A', status: 'DONE', readableStatus: 'Abgeschlossen' },
  ],
  iterations: [
    { code: 'clarity', title: 'Status verständlicher machen', before: 'PROC · QA · DONE', after: 'In Bearbeitung · In Prüfung · Abgeschlossen' },
    { code: 'accessibility', title: 'Kontrast und Lesbarkeit verbessern', before: 'Zurückhaltende Schrift auf hellen Flächen', after: 'Dunklere Beschriftungen und deutlichere Statusfelder' },
    { code: 'empty-state', title: 'Leere Listen erklären', before: 'Eine leere Ansicht ohne Erläuterung', after: '„Noch keine Aufträge vorhanden.“' },
  ],
  handover: ['Portalentwurf und simulierte Build-Revision', 'Erfolgskriterien und beispielhafte Prüffälle', 'Entscheidungs- und Nacharbeitsverlauf', 'Auswahl der Erkenntnisse für Atlas'],
  demoNote: 'Alle Kunden, Quellen, Aufträge und Prüffälle sind fiktiv. Die Website simuliert Arbeitsschritte und Entscheidungen; sie ruft weder Atlas noch Agenten auf und führt keine Builds, Anwendungstests oder externen Schreibvorgänge aus.',
};

const NAMES = ['Auftrag', 'Atlas-Kontext', 'Design & Plan', 'Umsetzung', 'Prüfung & Abnahme', 'Atlas-Rückfluss'];
const PERCENT = fraction => `${Math.round(Math.max(0, Math.min(1, Number(fraction) || 0)) * 100)} %`;
const revision = value => Number.isInteger(value) && value > 0 ? value : 1;
const codes = value => Array.isArray(value) ? value.filter(code => code === 'clarity' || code === 'accessibility') : [];
const feedbackText = values => values.map(code => code === 'clarity' ? 'verständliche Statusnamen' : 'stärkeren Kontrast und bessere Lesbarkeit').join(' sowie ');

function stationDetails(index, engineering, designRevision, buildRevision) {
  const common = [
    { title: 'Auftrag konkretisieren', input: 'Kundenbriefing · SF-001', tool: 'Norda · Mensch', output: 'Briefing mit Ziel, Umfang und vier Erfolgskriterien', decision: 'Die Fachverantwortlichen klären Ziel und offene Angaben.', checks: ['Zielgruppe benennen', 'Umfang begrenzen', 'Erfolgskriterien formulieren'] },
    { title: 'Atlas-Grundlagen zuordnen', input: 'Fiktive Anforderung REQ-DEMO-01 und Entscheidung DEC-DEMO-01', tool: 'Atlas → Norda · simuliert', output: 'Kontextpaket mit Anforderung, Zugriffskonzept und Quellenbezug', decision: 'Fehlende oder widersprüchliche Grundlagen als Rückfrage festhalten.', checks: ['Statusübersicht zuordnen', 'Kundenzugriff beachten', 'Quellen mitführen'] },
    { title: `Entwurf v${designRevision} und Arbeitsplan`, input: 'Kundenbriefing und Atlas-Kontext', tool: 'Norda · Designrolle · simuliert', output: `Portalentwurf v${designRevision} und drei Arbeitspakete`, decision: 'Du prüfst zuerst den Entwurf und gibst anschließend den Plan separat frei.', checks: ['Statusnamen ansehen', 'Lesbarkeit beurteilen', 'AP-01 bis AP-03 abstimmen'] },
    { title: `Build v${buildRevision} vorbereiten`, input: `Freigegebener Plan und Entwurf v${designRevision}`, tool: 'Norda · Codex oder Claude · simuliert', output: `Simulierter Build v${buildRevision} mit Auftragsliste und Zugriffskonzept`, decision: 'Der konkrete Ergebnisstand geht anschließend in die fachliche Prüfung.', checks: ['Statusansicht abgleichen', 'Kundenzuordnung berücksichtigen', 'Leere Liste behandeln'] },
    { title: `Build v${buildRevision} an Kriterien prüfen`, input: `Simulierter Build v${buildRevision} und Kriterien K-01 bis K-04`, tool: 'Norda · QA · Mensch · simuliert', output: 'Beispielhafte Prüfübersicht für den aktuellen Ergebnisstand', decision: 'Fachliche Prüfung und Abnahme sind zwei getrennte Entscheidungen.', checks: ['Drei Statuswerte vergleichen', 'Zugriff mit zwei Demo-Kunden durchdenken', 'Ansicht ohne Aufträge prüfen'] },
    { title: 'Erkenntnisse zur Übernahme vorbereiten', input: `Entwurf v${designRevision}, Build v${buildRevision} und Demo-Entscheidungen`, tool: 'Norda → Atlas · simuliert', output: 'Auswahl aus Statusbegriffen, Zugriffskriterien und Prüfbezug', decision: 'Du bestätigst die ausgewählten fachlichen Erkenntnisse vor der simulierten Übernahme.', checks: ['Quelle beibehalten', 'Ergebnisrevision zuordnen', 'Übernahme ausdrücklich bestätigen'] },
  ];
  const businessActions = [
    ['Der Änderungswunsch erreicht Norda.', 'Ziel und Zielgruppe werden aus dem Briefing herausgearbeitet.', 'Statusansicht, Kundenzugriff und leere Liste werden als Umfang festgehalten.', 'Die vier Erfolgskriterien stehen im Demo-Briefing.', 'Der Auftrag wird mit seinen offenen Punkten weitergegeben.'],
    ['Der Auftrag erhält seine Wissensgrundlage.', 'Die Demo ordnet die Atlas-Anforderung zur Statusübersicht zu.', 'Das Zugriffskonzept wird mit der Anforderung verbunden.', 'Anforderung, Entscheidung und Herkunft bilden das Kontextpaket.', 'Das Kontextpaket wird für die Planung bereitgestellt.'],
    ['Der Entwurf wird an der Designstation aufgenommen.', 'Auftragszeilen und Statusfelder erhalten ihren Platz.', 'Norda ordnet den Entwurf den drei Arbeitspaketen zu.', 'Der Portalentwurf ist als Werkstück sichtbar.', 'Entwurf und Plan werden für deine Entscheidung bereitgestellt.'],
    ['Der freigegebene Entwurf erreicht die Umsetzung.', 'Die Auftragsliste wird als Beispielkomponente aufgebaut.', 'Statusanzeige und Kundenzuordnung werden im Demo-Build zusammengeführt.', 'Die Anwendungsvorschau zeigt den neuen Ergebnisstand.', 'Der simulierte Build wird zur Prüfung vorbereitet.'],
    ['Der Ergebnisstand wird in die Prüfung aufgenommen.', 'Die drei Statuswerte werden mit dem Entwurf verglichen.', 'Der Prüffall für zwei getrennte Kunden und eine leere Liste wird durchgegangen.', 'Die Demo stellt Kriterien und Ergebnisstand gegenüber.', 'Du erhältst die Prüfübersicht für Bewertung und Abnahme.'],
    ['Der abgenommene Demo-Stand erreicht den Wissensrückfluss.', 'Statusbegriffe und Zugriffskriterien werden als Erkenntnisse ausgewählt.', 'Die Auswahl wird mit Quelle und Ergebnisrevision verbunden.', 'Der Vorschlag für Atlas ist vorbereitet.', 'Die fachliche Übernahme wartet auf deine Bestätigung.'],
  ];
  const technicalActions = [
    ['Norda übernimmt das fiktive Briefing als Auftragskontext.', 'Eingaben werden in Ziel, Scope und offene Fragen gegliedert.', 'K-01 bis K-04 werden dem Auftrag SF-001 zugeordnet.', 'Briefing und Kriterien bilden den Kontext für den nächsten Schritt.', 'Die Übergabe behält den Auftragsbezug.'],
    ['Ein ausgewählter Atlas-Leseschritt wird dargestellt.', 'REQ-DEMO-01 liefert die fachliche Anforderung der Demo.', 'DEC-DEMO-01 ergänzt den vorgesehenen Zugriff auf eigene Aufträge.', 'Quellenkennung und fachliche Zuordnung bleiben im Kontext erhalten.', 'Norda reicht den belegbezogenen Kontext an den Planungsschritt weiter.'],
    ['Der Planungsschritt übernimmt Auftrag und Quellen.', 'Eine Beispielkomponente „OrderStatusList“ wird im Entwurf angeordnet.', 'AP-01 Statusansicht, AP-02 Kundenzugriff und AP-03 Prüfung werden zugeschnitten.', 'Entwurf und Arbeitspakete bilden die vorgeschlagene Umsetzungsgrundlage.', 'Ausführungsfreigabe und Designentscheidung bleiben getrennt.'],
    ['Ein freigegebener Norda-Entwicklungsschritt wird dargestellt.', 'Codex oder Claude würde „OrderStatusList“ im gewählten Projekt bearbeiten.', 'Ein passender Datenzugriff müsste die Kundenzuordnung serverseitig berücksichtigen.', 'Der Demo-Build visualisiert das geplante Ergebnis; es läuft kein Build-Befehl.', 'Der Ergebnisstand wird mit den vorgesehenen Prüffällen weitergereicht.'],
    ['Kriterien und aktuelle Ergebnisrevision werden einander zugeordnet.', 'Status-Mapping und Darstellung werden anhand der Beispielwerte durchgegangen.', 'Zwei Kundenkennungen und eine leere Ergebnisliste bilden die Beispiel-Prüffälle.', 'Die Prüfübersicht illustriert Nachweisbedarf; sie ist kein ausgeführter Testlauf.', 'Eine reale Abnahme benötigt passende Nachweise und eine eigene Beobachtung.'],
    ['Ergebnisrevision und Demo-Entscheidungen bilden die Quelle der Übernahme.', 'Ein Vorschlag für fachliche Atlas-Inhalte wird dargestellt.', 'Statusbegriffe, Zugriffskriterien und Prüfbezug werden dem Vorschlag zugeordnet.', 'Norda würde nach bestätigtem Schreiben den gespeicherten Atlas-Stand zurücklesen.', 'Diese Website zeigt den Ablauf ohne externe Schreibaktion.'],
  ];
  return { ...common[index], actions: (engineering ? technicalActions : businessActions)[index] };
}

/**
 * Describe the actual work location (runStage), independently of selected camera.
 * Accepts both engine.state and its serializable snapshot. No state is mutated.
 * All returned fields are plain text; checks is a fresh array.
 */
export function describeWork(state, perspective = 'business') {
  if (!state || typeof state !== 'object') throw new TypeError('Ein Simulationszustand wird benötigt.');
  if (perspective !== 'business' && perspective !== 'engineering') throw new TypeError('Unbekannte Perspektive.');
  const engineering = perspective === 'engineering';
  const stage = Number.isInteger(state.runStage) && state.runStage >= 0 && state.runStage <= 5 ? state.runStage : 0;
  const design = revision(state.designRevision), build = revision(state.buildRevision);
  const requested = codes(state.designFeedback), applied = codes(state.appliedDesignFeedback);
  const pending = requested.filter(code => !applied.includes(code));
  const pendingBuild = (state.reworkCount || 0) >= build;
  const base = stationDetails(stage, engineering, design, build);
  const { actions, ...details } = base;
  let result = { ...details, action: '', checks: [...details.checks], progressLabel: '' };

  if (state.phase === 'idle') {
    return { ...result, title: ORDER.title, action: 'Starte den fiktiven Auftrag und begleite ihn vom Briefing bis zum bestätigten Wissen.', input: ORDER.request, tool: 'Atlas × Norda · interaktive Demo', output: ORDER.goal, decision: 'Du entscheidest über Design, Plan, Prüfung, Abnahme und Wissensübernahme.', progressLabel: 'Bereit · Fiktiver Demoauftrag' };
  }
  if (state.phase === 'complete') {
    return { ...result, title: 'Demoauftrag abgeschlossen', action: `Entwurf v${design} und Build v${build} haben die simulierten Entscheidungen durchlaufen. Die ausgewählten Erkenntnisse sind im Demo-Verlauf bestätigt.`, input: 'Demo-Ergebnis, Kriterien und Entscheidungsverlauf', tool: 'Atlas × Norda · simuliert', output: `Auftragsakte SF-001 · Design v${design} · Build v${build}`, decision: 'Die Entscheidungen gelten für diesen simulierten Ergebnisstand.', checks: ['Design und Plan bestätigt', 'Prüfung und Abnahme getrennt entschieden', 'Wissensübernahme bestätigt'], progressLabel: 'Demo abgeschlossen' };
  }

  if (state.returnRoute) {
    const designLoop = state.returnRoute === 'design';
    result = {
      ...result,
      title: designLoop ? 'Design-Feedback fährt zurück' : 'QA-Befund fährt zur Umsetzung zurück',
      action: designLoop
        ? `Der Entwurf v${design} bleibt auf dem Rückweg unverändert. Dein Auftrag an die Designstation: ${feedbackText(pending.length ? pending : requested)}.`
        : `Build v${build} fährt mit dem Befund „Leere Liste ohne Erklärung“ zurück. Erst an der Umsetzung entsteht die nächste Revision.`,
      input: designLoop ? `Dein Feedback zu Entwurf v${design}` : `Dein Demo-Befund zu Build v${build}`,
      tool: 'Norda · Nacharbeit im selben Demoauftrag',
      output: designLoop ? `Geplant: Entwurf v${design + 1}` : `Geplant: Build v${build + 1} mit Hinweis für leere Listen`,
      decision: designLoop ? 'Nach der Überarbeitung prüfst du Design und Plan erneut.' : 'Die neue Revision benötigt erneut eine fachliche Prüfung und eine separate Abnahme.',
      checks: designLoop ? ['Feedback bleibt beim Auftrag', 'Darstellung ändert sich erst bei Bearbeitung', 'Neuer Entwurf geht wieder ins Review'] : ['Befund bleibt beim Auftrag', 'Korrektur entsteht an der Build-Station', 'Prüfung und Abnahme werden neu eingeholt'],
      progressLabel: `Rücklauf · ${PERCENT(state.returnProgress)}`,
    };
  } else if (state.phase === 'gate') {
    const gates = {
      design: {
        title: `Entwurf v${design} · Design-Review`,
        action: applied.length ? `Der aktuelle Entwurf zeigt ${feedbackText(applied)}. Prüfe, ob die Darstellung das Kundenanliegen trifft.` : 'Der erste Entwurf zeigt PROC, QA und DONE. Prüfe die Verständlichkeit und Lesbarkeit oder schicke gezieltes Feedback zurück.',
        input: `Portalentwurf v${design}`, output: 'Deine Designentscheidung oder ein konkreter Überarbeitungsauftrag',
        decision: 'Entwurf freigeben oder Statusnamen beziehungsweise Lesbarkeit überarbeiten lassen.',
        checks: ['Drei Statusfelder ansehen', 'Beschriftungen aus Kundensicht lesen', 'Kontrast und Lesbarkeit beurteilen'],
      },
      plan: { title: 'Plan separat freigeben', action: `Entwurf v${design} ist in der Demo bestätigt. Norda legt die drei Arbeitspakete für Statusansicht, Kundenzugriff und Prüfung vor.`, input: `Bestätigter Entwurf v${design} und AP-01 bis AP-03`, output: 'Ausdrückliche Umsetzungsfreigabe für den Demo-Plan', decision: 'Den vorgeschlagenen Arbeitsumfang freigeben.', checks: ['Umfang verstanden', 'Zugriffskriterium enthalten', 'Prüfung vorgesehen'] },
      review: { title: `Build v${build} · Fachliche Prüfung`, action: build > 1 ? 'Der überarbeitete Demo-Build zeigt den Hinweis für leere Listen. Beurteile diesen Stand erneut anhand der Kriterien.' : 'Betrachte Statusansicht, Kundenzugriff und leere Liste. Du kannst den beispielhaften Befund für leere Listen in eine Nacharbeit überführen.', input: `Build v${build} und Beispiel-Prüffälle`, output: 'Deine Demo-Bewertung oder ein Nacharbeitsauftrag', decision: 'Prüfung bestätigen oder die leere Ansicht nachbessern lassen. Die Abnahme folgt separat.', checks: ['Status verständlich?', 'Zugriff auf eigene Aufträge vorgesehen?', 'Leere Liste erklärt?'] },
      acceptance: { title: `Build v${build} · Abnahme entscheiden`, action: 'Die fachliche Demo-Prüfung ist bestätigt. Entscheide jetzt separat, ob dieser Ergebnisstand abgenommen werden soll.', input: `Bewerteter Build v${build}`, output: 'Abnahmeentscheidung für diese Demo-Revision', decision: 'Diesen Ergebnisstand abnehmen oder erneut Nacharbeit auslösen.', checks: ['Ergebnisstand eindeutig', 'Kriterien durchgesehen', 'Abnahme bewusst entscheiden'] },
      knowledge: { title: 'Ausgewählte Erkenntnisse übernehmen', action: `Zur simulierten Atlas-Übernahme stehen Statusbegriffe, Zugriffskriterien und der Prüfbezug von Build v${build} bereit.`, input: 'Ausgewählte fachliche Erkenntnisse mit Quellenbezug', output: 'Bestätigte Wissensauswahl im lokalen Demo-Verlauf', decision: 'Die Auswahl ausdrücklich für den simulierten Atlas-Rückfluss bestätigen.', checks: ['Statusbegriffe ausgewählt', 'Zugriffskriterien zugeordnet', 'Ergebnisrevision mitgeführt'] },
    };
    const gate = gates[state.gate];
    if (gate) result = { ...result, ...gate, tool: state.gate === 'knowledge' ? 'Mensch · Norda → Atlas · simuliert' : 'Mensch · Norda', progressLabel: 'Wartet auf deine Entscheidung' };
  } else if (state.cycle === null || state.cycle === undefined) {
    result.action = `Das Werkstück fährt zur Station „${NAMES[stage]}“. ${stage === 0 ? 'Das Briefing liegt für die Aufnahme bereit.' : 'Der bisherige Ergebnisstand und sein Auftragsbezug bleiben erhalten.'}`;
    result.progressLabel = `Transport · ${PERCENT(state.travelProgress)}`;
  } else {
    const cycle = Math.max(0, Math.min(1, state.cycle));
    const step = cycle < .18 ? 0 : cycle < .38 ? 1 : cycle < .58 ? 2 : cycle < .88 ? 3 : 4;
    result.action = actions[step];
    result.progressLabel = `Bearbeitung · ${PERCENT(cycle)}`;
    if (stage === 2 && pending.length) {
      result.title = `Entwurf v${design + 1} entsteht`;
      result.action = cycle < .38 ? `Die Designstation nimmt dein Feedback zu Entwurf v${design} auf: ${feedbackText(pending)}.` : `Die Demo bereitet ${feedbackText(pending)} vor. Der bisherige Entwurf bleibt bis zur sichtbaren Überarbeitung erhalten.`;
      result.output = `Nächster Entwurf v${design + 1} mit deinem Feedback`;
    } else if (stage === 2 && applied.length) {
      result.action = `Entwurf v${design} zeigt jetzt ${feedbackText(applied)}. Die Überarbeitung wird für dein erneutes Review bereitgestellt.`;
    }
    if (stage === 3 && pendingBuild) {
      result.title = `Build v${build + 1} wird nachgebessert`;
      result.action = engineering ? 'Die Demo bereitet einen Empty-State für die Beispielkomponente „OrderStatusList“ vor. Eine leere Ergebnisliste soll einen verständlichen Hinweis ausgeben.' : 'Die Umsetzung ergänzt den Hinweis „Noch keine Aufträge vorhanden.“ für eine leere Auftragsliste.';
      result.output = `Geplant: Build v${build + 1} mit verständlichem Leerzustand`;
    } else if (stage === 3 && build > 1) {
      result.action = `Build v${build} zeigt jetzt den Hinweis „Noch keine Aufträge vorhanden.“. Dieser neue Stand geht erneut durch die Prüfung.`;
    }
  }
  if (state.phase === 'paused') {
    result.action = `Pausiert. ${result.action}`;
    result.progressLabel = `Pausiert · ${result.progressLabel.toLowerCase()}`;
  }
  return result;
}
