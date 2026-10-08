/** Fictional, local presentation data. This module makes no tool or network calls. */
export const ORDER = {
  "id": "SF-001",
  "title": "Kundenportal · Auftragsstatus",
  "customer": "Musterkunde Nordhafen · fiktiv",
  "simulationOnly": true,
  "label": "Fiktiver Demoauftrag",
  "request": "Nordhafen benötigt ein Portal für drei Serviceaufträge: NH-1042 Wartung Ladetor, NH-1043 Prüfung Heizungsanlage und NH-1044 Service Brandschutztür. Kunden sollen den Stand ohne interne Abkürzungen verstehen.",
  "goal": "Dieselben drei Serviceaufträge begleiten die gesamte Demo. Atlas liefert die vereinbarten Terminologie- und Designregeln; ONE hält Briefing, Aufgaben und Freigaben. Feedback verändert sichtbar die Beschriftung und Darstellung.",
  "method": "Feature-Erweiterung",
  "scope": [
    "Die Auftragsübersicht für NH-1042, NH-1043 und NH-1044 mit den exakten Labels aus TC-DEMO-01.",
    "Eine lesbare Statusdarstellung nach DC-DEMO-01 und ein Zugriff ausschließlich auf eigene Aufträge.",
    "Der Hinweis aus EC-DEMO-01, wenn für diesen Kunden noch keine Aufträge vorliegen."
  ],
  "criteria": [
    {
      "id": "K-01",
      "title": "Exakte Atlas-Terminologie",
      "description": "K-01 / TC-DEMO-01: NH-1042 zeigt „Service läuft“, NH-1043 „Bericht in Prüfung“ und NH-1044 „Service abgeschlossen“. PROC, QA und DONE bleiben interne Codes."
    },
    {
      "id": "K-02",
      "title": "Nur eigene Aufträge",
      "description": "K-02 / DEC-DEMO-01: Nordhafen sieht NH-1042, NH-1043 und NH-1044. Ein anderer Demo-Kunde darf diese Aufträge nicht erhalten."
    },
    {
      "id": "K-03",
      "title": "Leere Liste erklärt",
      "description": "K-03 / EC-DEMO-01: C-309 ist ein fiktiver Kunde mit 0 Aufträgen. Seine leere Ergebnisliste muss „Noch keine Aufträge vorhanden.“ statt einer unerklärten leeren Ansicht zeigen."
    },
    {
      "id": "K-04",
      "title": "Gut lesbar",
      "description": "K-04 / DC-DEMO-01: Alle drei Labels bleiben vollständig sichtbar; Text vermittelt den Status zusätzlich zur Farbe. Die Kontrastverbesserung ist beispielhaft und keine vollständige Barrierefreiheitsprüfung."
    }
  ],
  "sources": [
    {
      "id": "BRIEF-DEMO",
      "title": "Kundenbriefing",
      "kind": "Fiktive Nutzerangabe",
      "description": "Fiktives Nordhafen-Briefing für NH-1042, NH-1043 und NH-1044 mit Zielgruppe und erwartetem Kundennutzen."
    },
    {
      "id": "REQ-DEMO-01",
      "title": "Aufträge im Kundenportal",
      "kind": "Fiktive Atlas-Anforderung",
      "description": "Die drei Nordhafen-Serviceaufträge mit ihren internen Zuständen PROC, QA und DONE; die Kundenlabels folgen TC-DEMO-01."
    },
    {
      "id": "DEC-DEMO-01",
      "title": "Kundenzugriff begrenzen",
      "kind": "Fiktive Atlas-Entscheidung",
      "description": "Ein Kunde soll ausschließlich seine eigenen Aufträge erhalten. Das Zugriffskonzept ist vor einer echten Umsetzung zu prüfen."
    },
    {
      "id": "TEST-DEMO-01",
      "title": "Prüffälle für Status, Zugriff und leere Liste",
      "kind": "Fiktiver Prüfplan",
      "description": "Beispielprüfungen gleichen dieselben drei Aufträge mit TC-DEMO-01 und DC-DEMO-01 ab, den Kundenzugriff mit DEC-DEMO-01 und leere Ergebnisse mit EC-DEMO-01. Hier laufen keine Anwendungstests."
    },
    {
      "id": "TC-DEMO-01",
      "title": "Verbindliche Servicestatus-Begriffe",
      "kind": "Fiktiver Atlas Terminology Constraint",
      "description": "Interne Codes werden durch die vereinbarten Kundenlabels für die drei Nordhafen-Aufträge ersetzt. PROC → Service läuft QA → Bericht in Prüfung DONE → Service abgeschlossen Die exakten Begriffe gelten im Portal, im Designreview und in der Übergabe."
    },
    {
      "id": "DC-DEMO-01",
      "title": "Lesbare Statusdarstellung",
      "kind": "Fiktiver Atlas Design Constraint",
      "description": "Die vollständige Statusbeschriftung bleibt sichtbar und hebt sich klar vom Hintergrund ab. Jede Statusbeschriftung vollständig und ohne Auslassungspunkte zeigen. Status durch Text und zusätzlich durch Farbe vermitteln. Dunkle, gut lesbare Schrift auf klar unterscheidbaren Statusflächen verwenden."
    },
    {
      "id": "EC-DEMO-01",
      "title": "Leere Auftragsliste erklären",
      "kind": "Fiktiver Atlas Empty-state Constraint",
      "description": "Der fiktive Kunde C-309 hat 0 Aufträge und erhält den exakten Hinweis für die leere Liste. Bei leerer Auftragsliste „Noch keine Aufträge vorhanden.“ zeigen. Eine leere Liste darf nicht wie ein Ladefehler erscheinen."
    }
  ],
  "workPackages": [
    {
      "id": "AP-01",
      "title": "Statusansicht gestalten und bauen",
      "role": "Design und Entwicklung",
      "tool": "ONE · Codex oder Claude",
      "description": "In ONE die drei Nordhafen-Zeilen mit den exakten Labels aus TC-DEMO-01 und der Darstellung nach DC-DEMO-01 planen. Der Vorher/Nachher-Vergleich dient der Designfreigabe."
    },
    {
      "id": "AP-02",
      "title": "Kundenzugriff berücksichtigen",
      "role": "Entwicklung",
      "tool": "ONE · gewählter Agent",
      "description": "Den Auftrag für den gewählten Coding-Agenten mit den vereinbarten Atlas-Constraints vorbereiten: diese Aufträge auf Nordhafen begrenzen und leere Ergebnisse nach EC-DEMO-01 behandeln."
    },
    {
      "id": "AP-03",
      "title": "Prüfung und Übergabe vorbereiten",
      "role": "Qualitätssicherung und Fachverantwortliche",
      "tool": "ONE · Atlas · Mensch",
      "description": "NH-1042, NH-1043 und NH-1044 gegen TC-DEMO-01/DC-DEMO-01 und die leere Liste gegen EC-DEMO-01 prüfen. Fachprüfung und Abnahme in ONE getrennt festhalten."
    }
  ],
  "roles": [
    {
      "title": "Fachverantwortliche",
      "responsibility": "Ziel, Entwurf, Umfang und Abnahme entscheiden."
    },
    {
      "title": "Atlas",
      "responsibility": "Wissen, Anforderungen und die expliziten Terminologie-, Design- und Empty-State-Constraints für die Demo bereitstellen."
    },
    {
      "title": "ONE",
      "responsibility": "Briefing, Aufgaben und Freigaben im Arbeitsbereich halten und Atlas-Wissen samt Constraints mit dem ausgewählten Coding-Agenten verbinden."
    },
    {
      "title": "Codex oder Claude",
      "responsibility": "Das abgestimmte Briefing und die Atlas-Constraints für die geplanten Änderungen im gewählten Projekt nutzen."
    }
  ],
  "exampleData": [
    {
      "id": "Auftrag 01",
      "owner": "Nordhafen · Demo-Kunde A",
      "status": "PROC",
      "readableStatus": "Service läuft",
      "reference": "NH-1042",
      "title": "Wartung Ladetor"
    },
    {
      "id": "Auftrag 02",
      "owner": "Nordhafen · Demo-Kunde A",
      "status": "QA",
      "readableStatus": "Bericht in Prüfung",
      "reference": "NH-1043",
      "title": "Prüfung Heizungsanlage"
    },
    {
      "id": "Auftrag 03",
      "owner": "Nordhafen · Demo-Kunde A",
      "status": "DONE",
      "readableStatus": "Service abgeschlossen",
      "reference": "NH-1044",
      "title": "Service Brandschutztür"
    }
  ],
  "iterations": [
    {
      "code": "clarity",
      "title": "Status verständlicher machen",
      "before": "PROC · QA · DONE",
      "after": "Service läuft · Bericht in Prüfung · Service abgeschlossen",
      "constraintId": "TC-DEMO-01"
    },
    {
      "code": "accessibility",
      "title": "Kontrast und Lesbarkeit verbessern",
      "before": "Blasse Schrift und schwach unterscheidbare Statusflächen",
      "after": "Vollständige Labels mit dunkler Schrift auf unterscheidbaren Statusflächen",
      "constraintId": "DC-DEMO-01"
    },
    {
      "code": "empty-state",
      "title": "Leere Listen erklären",
      "before": "Eine leere Ansicht ohne Erläuterung",
      "after": "„Noch keine Aufträge vorhanden.“",
      "constraintId": "EC-DEMO-01"
    }
  ],
  "handover": [
    "Dieselben drei Nordhafen-Aufträge mit den aktuellen Labels",
    "TC-DEMO-01, DC-DEMO-01 und EC-DEMO-01 mit Quellen",
    "Vorher/Nachher-Belege und geprüfte Revision",
    "Getrennte Entscheidungen zu Design, Plan, Prüfung und Abnahme"
  ],
  "demoNote": "Alle Kunden, Aufträge, Quellen und Constraint-IDs sind fiktive Demodaten und keine echten Atlas-Datensätze. Diese Website simuliert den Ablauf; sie ruft weder ONE noch Atlas oder Agenten auf, führt keine Anwendungstests aus und schreibt keine externen Daten.",
  "constraints": [
    {
      "id": "TC-DEMO-01",
      "type": "terminology",
      "title": "Verbindliche Servicestatus-Begriffe",
      "description": "Interne Codes werden durch die vereinbarten Kundenlabels für die drei Nordhafen-Aufträge ersetzt.",
      "rules": [
        "PROC → Service läuft",
        "QA → Bericht in Prüfung",
        "DONE → Service abgeschlossen",
        "Die exakten Begriffe gelten im Portal, im Designreview und in der Übergabe."
      ],
      "source": "Atlas · fiktive Demo-Referenz"
    },
    {
      "id": "DC-DEMO-01",
      "type": "design",
      "title": "Lesbare Statusdarstellung",
      "description": "Die vollständige Statusbeschriftung bleibt sichtbar und hebt sich klar vom Hintergrund ab.",
      "rules": [
        "Jede Statusbeschriftung vollständig und ohne Auslassungspunkte zeigen.",
        "Status durch Text und zusätzlich durch Farbe vermitteln.",
        "Dunkle, gut lesbare Schrift auf klar unterscheidbaren Statusflächen verwenden."
      ],
      "source": "Atlas · fiktive Demo-Referenz"
    },
    {
      "id": "EC-DEMO-01",
      "type": "empty-state",
      "title": "Leere Auftragsliste erklären",
      "description": "Der fiktive Kunde C-309 hat 0 Aufträge und erhält den exakten Hinweis für die leere Liste.",
      "rules": [
        "Bei leerer Auftragsliste „Noch keine Aufträge vorhanden.“ zeigen.",
        "Eine leere Liste darf nicht wie ein Ladefehler erscheinen."
      ],
      "source": "Atlas · fiktive Demo-Referenz"
    }
  ],
  "emptyCustomer": {
    "reference": "C-309",
    "name": "Fiktiver Kunde C-309",
    "orderCount": 0,
    "message": "Noch keine Aufträge vorhanden.",
    "constraintId": "EC-DEMO-01"
  }
};

const NAMES = ['Auftrag', 'Atlas-Kontext', 'Design & Plan', 'Umsetzung', 'Prüfung & Abnahme', 'Atlas-Rückfluss'];
const PERCENT = fraction => `${Math.round(Math.max(0, Math.min(1, Number(fraction) || 0)) * 100)} %`;
const revision = value => Number.isInteger(value) && value > 0 ? value : 1;
const codes = value => Array.isArray(value) ? value.filter(code => code === 'clarity' || code === 'accessibility') : [];
const feedbackText = values => values.map(code => code === 'clarity' ? 'TC-DEMO-01-Labels: Service läuft, Bericht in Prüfung und Service abgeschlossen' : 'DC-DEMO-01-Darstellung mit vollständigen Labels und stärkerem Kontrast').join(' sowie ');

function stationDetails(index, engineering, designRevision, buildRevision) {
  const common = [
  {
    "title": "Nordhafen-Auftrag klären",
    "input": "SF-001 · NH-1042, NH-1043 und NH-1044",
    "tool": "ONE · Mensch",
    "output": "Ein Briefing für drei Serviceaufträge mit zu prüfenden Atlas-Constraints",
    "decision": "Umfang abstimmen und die Terminologie-, Design- und Empty-State-Regeln anfordern.",
    "checks": [
      "Dieselben drei Auftragsreferenzen verwenden",
      "TC-DEMO-01 und DC-DEMO-01 zuordnen",
      "EC-DEMO-01 für leere Ergebnisse aufnehmen"
    ]
  },
  {
    "title": "Atlas-Wissen und Constraints verbinden",
    "input": "REQ-DEMO-01 · TC-DEMO-01 · DC-DEMO-01 · EC-DEMO-01",
    "tool": "Atlas → ONE · simuliert",
    "output": "Ein Kontextpaket mit exakten Labels und Darstellungsregeln",
    "decision": "Die fiktiven Regeln lesen, bevor der erste Entwurf beurteilt wird.",
    "checks": [
      "TC-DEMO-01: vereinbarte volle Labels verwenden",
      "DC-DEMO-01: Labels sichtbar und lesbar halten",
      "EC-DEMO-01: leere Ergebnisse erklären"
    ]
  },
  {
    "title": `Entwurf v${designRevision} und Constraint-Checkliste`,
    "input": "Die drei Nordhafen-Aufträge und TC-DEMO-01 / DC-DEMO-01",
    "tool": "ONE · Planung & Design · simuliert",
    "output": `Portalentwurf v${designRevision}, Vorher/Nachher-Vergleich und drei Arbeitspakete`,
    "decision": "Aktuelle Labels mit der Atlas-Vorgabe vergleichen; danach Design und Plan getrennt freigeben.",
    "checks": [
      "PROC / QA / DONE mit TC-DEMO-01 vergleichen",
      "Volle Labels und Lesbarkeit gegen DC-DEMO-01 prüfen",
      "EC-DEMO-01 in AP-01 bis AP-03 aufnehmen"
    ]
  },
  {
    "title": `Build v${buildRevision} vorbereiten`,
    "input": `Freigegebener Entwurf v${designRevision} · alle drei Atlas-Constraints`,
    "tool": "ONE · Codex oder Claude · simuliert",
    "output": `Simulierter Build v${buildRevision} für dieselben drei Serviceaufträge`,
    "decision": "Änderungen tragen den gewählten Entwurf und die Atlas-Regeln in die Prüfung weiter.",
    "checks": [
      "Label-Zuordnung aus TC-DEMO-01 beibehalten",
      "Darstellungsregeln aus DC-DEMO-01 anwenden",
      "Leere Ergebnisse nach EC-DEMO-01 behandeln"
    ]
  },
  {
    "title": `Build v${buildRevision} gegen Atlas-Regeln prüfen`,
    "input": "NH-1042 / NH-1043 / NH-1044 · TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
    "tool": "ONE · QA · Mensch · simuliert",
    "output": "Beispielprüfung von Labels, Darstellung, Kundenzugriff und leerer Liste",
    "decision": "Prüfung und Abnahme bleiben getrennte Entscheidungen für diese Revision.",
    "checks": [
      "Jedes Auftragslabel mit TC-DEMO-01 vergleichen",
      "Lesbarkeit gegen DC-DEMO-01 prüfen",
      "Kundenzugriff und EC-DEMO-01 prüfen"
    ]
  },
  {
    "title": "Geprüfte Constraint-Referenzen sichern",
    "input": `Entwurf v${designRevision} · Build v${buildRevision} · drei Atlas-Constraint-Referenzen`,
    "tool": "ONE → Atlas · simuliert",
    "output": "Ausgewählte Erkenntnisse verbinden die Ergebnisrevision mit den verwendeten Regeln",
    "decision": "Ausgewählte Demo-Erkenntnisse bestätigen; bestehende Atlas-Regeln bleiben die Referenz.",
    "checks": [
      "TC-DEMO-01 und DC-DEMO-01 als Quellen erhalten",
      "EC-DEMO-01 mit der Empty-State-Revision verbinden",
      "Wissensübernahme separat bestätigen"
    ]
  }
];
  const businessActions = [
  [
    "Das Nordhafen-Briefing erreicht den ONE-Arbeitsbereich.",
    "NH-1042, NH-1043 und NH-1044 werden als drei Beispielaufträge festgehalten.",
    "Eindeutige Kundenlabels und eine lesbare Darstellung werden konkrete Ziele.",
    "Das Briefing fordert TC-DEMO-01, DC-DEMO-01 und EC-DEMO-01 aus Atlas an.",
    "Dieselben Aufträge und Erfolgskriterien gehen in die Kontextvorbereitung."
  ],
  [
    "Atlas ist die Quelle für Wissen und Constraints der Demo.",
    "TC-DEMO-01 liefert die exakten Statusbegriffe für Kunden.",
    "DC-DEMO-01 verlangt vollständige, lesbare Labels mit Text zusätzlich zur Farbe.",
    "EC-DEMO-01 ergänzt den Hinweis für eine leere Auftragsliste.",
    "ONE hält die fiktiven Quellenreferenzen zusammen mit dem Briefing."
  ],
  [
    "Dieselben drei Serviceaufträge erreichen die Designstation.",
    "Der erste Entwurf zeigt die internen Codes PROC, QA und DONE.",
    "Das Vorher/Nachher-Ziel folgt TC-DEMO-01; die Gestaltung folgt DC-DEMO-01.",
    "Die aktuelle Revision liegt zum Vergleich mit der Atlas-Vorgabe bereit.",
    "ONE stellt Design und Aufgabenplan für getrennte Entscheidungen bereit."
  ],
  [
    "Der gewählte Entwurf und die Atlas-Regeln erreichen die Umsetzung.",
    "Die beispielhafte Auftragsliste behält NH-1042, NH-1043 und NH-1044 bei.",
    "Die gewählten Labels und ihre Darstellung werden in den Demo-Build übernommen.",
    "Die Anwendungsvorschau zeigt die aktuelle Revision, keinen ausgeführten Build.",
    "Ergebnis und alle drei Constraint-Referenzen gehen in die Prüfung."
  ],
  [
    "Die aktuelle Revision geht mit ihren Atlas-Quellen in die Prüfung.",
    "Jedes Nordhafen-Statuslabel wird mit TC-DEMO-01 verglichen.",
    "Vollständige Labels und Lesbarkeit werden gegen DC-DEMO-01 beurteilt.",
    "Die Nordhafen-Zuordnung und Kunde C-309 mit 0 Aufträgen werden gegen DEC-DEMO-01 und EC-DEMO-01 betrachtet.",
    "Ihr entscheidet über Prüfung und Abnahme getrennt."
  ],
  [
    "Die abgenommene Demo-Revision erreicht den Wissensrückfluss.",
    "Die Auswahl hält fest, wie die drei Atlas-Constraints angewendet wurden.",
    "NH-1042, NH-1043 und NH-1044 bleiben mit dem geprüften Entwurf verknüpft.",
    "Die vorgeschlagenen Erkenntnisse behalten Constraint-IDs und Quellenbezug.",
    "Die simulierte Atlas-Übernahme wartet auf eure Bestätigung."
  ]
];
  const technicalActions = [
  [
    "ONE hält das fiktive Briefing und den Aufgabenkontext.",
    "Die Beispielreferenzen NH-1042 / NH-1043 / NH-1044 bleiben unverändert.",
    "K-01 verweist auf TC-DEMO-01; K-04 verweist auf DC-DEMO-01.",
    "K-03 verweist auf EC-DEMO-01; die Kundenzuordnung folgt DEC-DEMO-01.",
    "Diese Referenzen bilden den Kontext für den Atlas-Quellenschritt."
  ],
  [
    "Die Demo zeigt das Lesen von Atlas-Wissen und Constraints über MCP.",
    "TC-DEMO-01 ordnet PROC / QA / DONE den vereinbarten Kundenlabels zu.",
    "DC-DEMO-01 definiert vollständigen Text, Lesbarkeit und eine farbunabhängige Statusangabe.",
    "EC-DEMO-01 definiert den Hinweis für leere Ergebnisse.",
    "ONE führt den Quellenkontext für Planung und gewählten Coding-Agenten zusammen."
  ],
  [
    "Die Aufgabenplanung in ONE verbindet das Briefing mit den drei Atlas-Constraint-Referenzen.",
    "OrderStatusList behält die drei konkreten Nordhafen-Zeilen bei.",
    "AP-01 übernimmt TC-DEMO-01 und DC-DEMO-01 in den Entwurf.",
    "AP-02 und AP-03 enthalten Zugriffskontrolle und Prüfungen zu EC-DEMO-01.",
    "Die Vorher/Nachher-Revision wird vor der separaten Planfreigabe geprüft."
  ],
  [
    "Die Demo zeigt einen abgestimmten Auftrag für den ausgewählten Coding-Agenten.",
    "Codex oder Claude würde OrderStatusList nach TC-DEMO-01 und DC-DEMO-01 ändern.",
    "Ein passender Datenzugriff muss die Kundenzuordnung durchsetzen.",
    "EC-DEMO-01 liefert den Hinweis für leere Ergebnisse; hier läuft kein echter Build.",
    "Die simulierte Revision behält alle drei Atlas-Constraint-Referenzen."
  ],
  [
    "Die aktuelle Revision wird den Constraint-Referenzen zugeordnet.",
    "TC-DEMO-01 wird je Zeile mit internem Code und sichtbarem Label verglichen.",
    "DC-DEMO-01 wird anhand vollständiger Labels und lesbaren Texts beurteilt, nicht allein anhand der Farbe.",
    "EC-DEMO-01 deckt Kunde C-309 mit 0 Aufträgen ab; DEC-DEMO-01 trennt C-309 von den drei Nordhafen-Aufträgen.",
    "Diese Prüfung ist beispielhaft; echte Abnahme braucht ausgeführte Nachweise und Beobachtung."
  ],
  [
    "Die abgenommene Demo-Revision und Constraint-Referenzen bilden die Übergabequelle.",
    "Die Atlas-Vorschläge dokumentieren die Anwendung von TC-DEMO-01 und DC-DEMO-01.",
    "EC-DEMO-01 bleibt mit der Empty-State-Revision verbunden.",
    "Bei echter Übernahme würde der gespeicherte Inhalt nach dem Schreiben geprüft.",
    "Diese Website schreibt und verändert keine Atlas-Constraints."
  ]
];
  return { ...common[index], actions: (engineering ? technicalActions : businessActions)[index] };
}

/**
 * Describe the actual work location (runStage), independently of selected camera.
 * Accepts both engine.state and its serializable snapshot. No state is mutated.
 * All returned fields are plain text; checks is a fresh array.
 */
function constraintContext(result) {
  const suffix = ' Atlas: TC-DEMO-01 · DC-DEMO-01 · EC-DEMO-01.';
  return { ...result, action: /[TDE]C-DEMO-01/.test(result.action) ? result.action : result.action + suffix, output: /[TDE]C-DEMO-01/.test(result.output) ? result.output : result.output + suffix };
}

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
    return constraintContext({ ...result, title: ORDER.title, action: 'Begleite die Nordhafen-Aufträge NH-1042–NH-1044 mit TC-DEMO-01, DC-DEMO-01 und EC-DEMO-01 aus Atlas.', input: ORDER.request, tool: 'Atlas × ONE · interaktive Demo', output: ORDER.goal, decision: 'Du entscheidest über Design, Plan, Prüfung, Abnahme und Wissensübernahme.', progressLabel: 'Bereit · Fiktiver Demoauftrag' });
  }
  if (state.phase === 'complete') {
    return constraintContext({ ...result, title: 'Demoauftrag abgeschlossen', action: `Entwurf v${design} und Build v${build} haben die simulierten Entscheidungen durchlaufen. Der Demo-Verlauf hält TC-DEMO-01, DC-DEMO-01 und EC-DEMO-01 als Quellenreferenzen fest.`, input: 'Demo-Ergebnis, Kriterien und Entscheidungsverlauf', tool: 'Atlas × ONE · simuliert', output: `Auftragsakte SF-001 · Design v${design} · Build v${build}`, decision: 'Die Entscheidungen gelten für diesen simulierten Ergebnisstand.', checks: ['Design und Plan bestätigt', 'Prüfung und Abnahme getrennt entschieden', 'Wissensübernahme bestätigt'], progressLabel: 'Demo abgeschlossen' });
  }

  if (state.returnRoute) {
    const designLoop = state.returnRoute === 'design';
    result = {
      ...result,
      title: designLoop ? 'Design-Feedback fährt zurück' : 'QA-Befund fährt zur Umsetzung zurück',
      action: designLoop
        ? `Der Entwurf v${design} bleibt auf dem Rückweg unverändert. Dein Auftrag an die Designstation: ${feedbackText(pending.length ? pending : requested)}.`
        : `Build v${build} fährt mit dem EC-DEMO-01-Befund „C-309: 0 Aufträge ohne Erklärung“ zurück. Erst an der Umsetzung entsteht die nächste Revision.`,
      input: designLoop ? `Dein Feedback zu Entwurf v${design}` : `EC-DEMO-01-Befund zu Build v${build}`,
      tool: 'ONE · Nacharbeit im selben Demoauftrag',
      output: designLoop ? `Geplant: Entwurf v${design + 1}` : `Geplant: Build v${build + 1} mit Hinweis aus EC-DEMO-01`,
      decision: designLoop ? 'Nach der Überarbeitung prüfst du Design und Plan erneut.' : 'Die neue Revision benötigt erneut eine fachliche Prüfung und eine separate Abnahme.',
      checks: designLoop ? ['Feedback bleibt beim Auftrag', 'Darstellung ändert sich erst bei Bearbeitung', 'Neuer Entwurf geht wieder ins Review'] : ['Befund bleibt beim Auftrag', 'Korrektur entsteht an der Build-Station', 'Prüfung und Abnahme werden neu eingeholt'],
      progressLabel: `Rücklauf · ${PERCENT(state.returnProgress)}`,
    };
  } else if (state.phase === 'gate') {
    const gates = {
      design: {
        title: `Entwurf v${design} · Design-Review`,
        action: applied.length ? `Der aktuelle Entwurf zeigt ${feedbackText(applied)}. Prüfe, ob die Darstellung das Kundenanliegen trifft.` : 'NH-1042 / NH-1043 / NH-1044 zeigen noch PROC / QA / DONE. TC-DEMO-01 verlangt Service läuft / Bericht in Prüfung / Service abgeschlossen; DC-DEMO-01 verlangt lesbare volle Labels.',
        input: `Portalentwurf v${design}`, output: 'Deine Designentscheidung oder ein konkreter Überarbeitungsauftrag',
        decision: 'Entwurf freigeben oder Statusnamen beziehungsweise Lesbarkeit überarbeiten lassen.',
        checks: ['Die drei Nordhafen-Zeilen mit TC-DEMO-01 vergleichen', 'Exakte Wortwahl gegen TC-DEMO-01 prüfen', 'Volle Labels und Kontrast gegen DC-DEMO-01 prüfen'],
      },
      plan: { title: 'Plan separat freigeben', action: `Entwurf v${design} ist in der Demo bestätigt. Der Plan in ONE führt TC-DEMO-01, DC-DEMO-01 und EC-DEMO-01 durch die drei Arbeitspakete für dieselben Nordhafen-Aufträge.`, input: `Bestätigter Entwurf v${design} und AP-01 bis AP-03`, output: 'Ausdrückliche Umsetzungsfreigabe für den Demo-Plan', decision: 'Den vorgeschlagenen Arbeitsumfang freigeben.', checks: ['NH-1042 / NH-1043 / NH-1044 beibehalten', 'TC-DEMO-01 und DC-DEMO-01 enthalten', 'Prüfung zu EC-DEMO-01 vorgesehen'] },
      review: { title: `Build v${build} · Fachliche Prüfung`, action: build > 1 ? 'Der überarbeitete Demo-Build zeigt „Noch keine Aufträge vorhanden.“ aus EC-DEMO-01. Prüfe die drei Aufträge erneut gegen TC-DEMO-01 und DC-DEMO-01.' : 'Vergleiche die drei Nordhafen-Aufträge mit TC-DEMO-01/DC-DEMO-01, danach Kundenzuordnung und EC-DEMO-01. Der fehlende Leerhinweis kann einen Nacharbeitsauftrag auslösen.', input: `Build v${build} und Beispiel-Prüffälle`, output: 'Deine Demo-Bewertung oder ein Nacharbeitsauftrag', decision: 'Prüfung bestätigen oder die leere Ansicht nachbessern lassen. Die Abnahme folgt separat.', checks: ['TC-DEMO-01: exakte Labels auf allen drei Aufträgen?', 'DC-DEMO-01: volle lesbare Labels; nur eigene Aufträge?', 'EC-DEMO-01: leere Liste erklärt?'] },
      acceptance: { title: `Build v${build} · Abnahme entscheiden`, action: 'Die fachliche Demo-Prüfung ist bestätigt. Entscheide jetzt separat, ob dieser Ergebnisstand abgenommen werden soll.', input: `Bewerteter Build v${build}`, output: 'Abnahmeentscheidung für diese Demo-Revision', decision: 'Diesen Ergebnisstand abnehmen oder erneut Nacharbeit auslösen.', checks: ['Ergebnisstand eindeutig', 'Kriterien durchgesehen', 'Abnahme bewusst entscheiden'] },
      knowledge: { title: 'Ausgewählte Erkenntnisse übernehmen', action: `Die Erkenntnisse zu Build v${build} verbinden die drei Nordhafen-Aufträge mit TC-DEMO-01, DC-DEMO-01 und EC-DEMO-01 für die simulierte Atlas-Übernahme.`, input: 'Ausgewählte fachliche Erkenntnisse mit Quellenbezug', output: 'Bestätigte Wissensauswahl im lokalen Demo-Verlauf', decision: 'Die Auswahl ausdrücklich für den simulierten Atlas-Rückfluss bestätigen.', checks: ['Referenz TC-DEMO-01 erhalten', 'DC-DEMO-01 und EC-DEMO-01 zugeordnet', 'Ergebnisrevision mitgeführt'] },
    };
    const gate = gates[state.gate];
    if (gate) result = { ...result, ...gate, tool: state.gate === 'knowledge' ? 'Mensch · ONE → Atlas · simuliert' : 'Mensch · ONE', progressLabel: 'Wartet auf deine Entscheidung' };
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
      result.action = engineering ? 'Die Demo bereitet einen Empty-State für die Beispielkomponente „OrderStatusList“ vor. EC-DEMO-01 verlangt für Kunde C-309 mit 0 Aufträgen exakt „Noch keine Aufträge vorhanden.“.' : 'Die Umsetzung wendet EC-DEMO-01 an: Kunde C-309 mit 0 Aufträgen erhält „Noch keine Aufträge vorhanden.“.';
      result.output = `Geplant: Build v${build + 1} nach EC-DEMO-01`;
    } else if (stage === 3 && build > 1) {
      result.action = `Build v${build} zeigt jetzt „Noch keine Aufträge vorhanden.“ für C-309 mit 0 Aufträgen nach EC-DEMO-01. Dieser neue Stand geht erneut durch die Prüfung.`;
    }
  }
  if (state.phase === 'paused') {
    result.action = `Pausiert. ${result.action}`;
    result.progressLabel = `Pausiert · ${result.progressLabel.toLowerCase()}`;
  }
  return constraintContext(result);
}
