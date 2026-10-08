export const stations=[
  {
    "name": "Auftrag klären",
    "short": "Auftrag",
    "tool": "ONE + MENSCH",
    "kicker": "DER AUSGANGSPUNKT",
    "x": 12,
    "y": 55,
    "progress": 0.03,
    "business": {
      "description": "ONE hält das Briefing für drei Nordhafen-Serviceaufträge. Atlas-Wissen sowie Terminologie-, Design- und Empty-State-Constraints bestimmen die Vorgabe.",
      "output": "Ein bestätigter Auftrag, den alle Beteiligten gleich verstehen. · Atlas-Referenzen: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exakte Servicestatus-Labels",
        "DC-DEMO-01: vollständiger lesbarer Statustext",
        "EC-DEMO-01: C-309 hat 0 Aufträge"
      ]
    },
    "engineering": {
      "description": "ONE hält das Briefing für drei Nordhafen-Serviceaufträge. Atlas-Wissen sowie Terminologie-, Design- und Empty-State-Constraints bestimmen die Vorgabe. Der gewählte Coding-Agent erhält den abgestimmten Arbeitskontext.",
      "output": "Ein konkreter Auftrag mit Projektbezug, Anforderungen und Abnahmekriterien. · Atlas-Referenzen: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exakte Servicestatus-Labels",
        "DC-DEMO-01: vollständiger lesbarer Statustext",
        "EC-DEMO-01: C-309 hat 0 Aufträge"
      ]
    },
    "example": "Nordhafen benötigt NH-1042 Wartung Ladetor, NH-1043 Prüfung Heizungsanlage und NH-1044 Service Brandschutztür in einem Portal.",
    "status": "Idee aufgenommen"
  },
  {
    "name": "Kontext verbinden",
    "short": "Kontext",
    "tool": "ATLAS",
    "kicker": "DAS GEMEINSAME WISSEN",
    "x": 28,
    "y": 70,
    "progress": 0.25,
    "business": {
      "description": "Atlas liefert Anforderungen und explizite Regeln: TC-DEMO-01 für Statuslabels, DC-DEMO-01 für die Darstellung und EC-DEMO-01 für leere Listen. Alle Referenzen hier sind fiktiv.",
      "output": "Ein nachvollziehbarer Kontext statt verteilter Einzelinformationen. · Atlas-Referenzen: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exakte Servicestatus-Labels",
        "DC-DEMO-01: vollständiger lesbarer Statustext",
        "EC-DEMO-01: C-309 hat 0 Aufträge"
      ]
    },
    "engineering": {
      "description": "Atlas liefert Anforderungen und explizite Regeln: TC-DEMO-01 für Statuslabels, DC-DEMO-01 für die Darstellung und EC-DEMO-01 für leere Listen. Alle Referenzen hier sind fiktiv. Der gewählte Coding-Agent erhält den abgestimmten Arbeitskontext.",
      "output": "Arbeitskontext mit zugeordneten Atlas-Quellen und nachvollziehbaren Beziehungen. · Atlas-Referenzen: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exakte Servicestatus-Labels",
        "DC-DEMO-01: vollständiger lesbarer Statustext",
        "EC-DEMO-01: C-309 hat 0 Aufträge"
      ]
    },
    "example": "TC-DEMO-01: PROC → Service läuft; QA → Bericht in Prüfung; DONE → Service abgeschlossen. DC-DEMO-01 definiert die lesbare Darstellung.",
    "status": "Anforderungen und Quellen verbunden"
  },
  {
    "name": "Design & Planung",
    "short": "Design & Plan",
    "tool": "ONE + MENSCH",
    "kicker": "DER VERBINDLICHE RAHMEN",
    "x": 44,
    "y": 29,
    "progress": 0.43,
    "business": {
      "description": "ONE verbindet Aufgabenplan und Freigaben. PROC / QA / DONE mit den exakten TC-DEMO-01-Labels und den DC-DEMO-01-Designregeln vergleichen, bevor Design und Plan getrennt freigegeben werden.",
      "output": "Freigegebene Arbeitspakete mit klaren Ergebnissen und Prüfkriterien. · Atlas-Referenzen: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exakte Servicestatus-Labels",
        "DC-DEMO-01: vollständiger lesbarer Statustext",
        "EC-DEMO-01: C-309 hat 0 Aufträge"
      ]
    },
    "engineering": {
      "description": "ONE verbindet Aufgabenplan und Freigaben. PROC / QA / DONE mit den exakten TC-DEMO-01-Labels und den DC-DEMO-01-Designregeln vergleichen, bevor Design und Plan getrennt freigegeben werden. Der gewählte Coding-Agent erhält den abgestimmten Arbeitskontext.",
      "output": "Ein abgestimmter Aufgabenplan als Grundlage für den ausgewählten Coding-Agenten. · Atlas-Referenzen: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exakte Servicestatus-Labels",
        "DC-DEMO-01: vollständiger lesbarer Statustext",
        "EC-DEMO-01: C-309 hat 0 Aufträge"
      ]
    },
    "gate": {
      "title": "Entscheidung · Planfreigabe",
      "copy": "Entwurf prüfen, bei Bedarf verbessern, danach Design und Plan getrennt freigeben."
    },
    "example": "Die Rohcodes bleiben bis zur Bearbeitung des Klarheitsfeedbacks sichtbar. TC-DEMO-01 liefert das Vorher/Nachher-Ziel; DC-DEMO-01 die Gestaltungsregeln.",
    "status": "Plan zur Freigabe vorbereitet"
  },
  {
    "name": "Umsetzen",
    "short": "Umsetzung",
    "tool": "ONE · CODEX / CLAUDE",
    "kicker": "DIE PRODUKTIONSLINIE",
    "x": 60,
    "y": 52,
    "progress": 0.63,
    "business": {
      "description": "Der gewählte Codex- oder Claude-Agent würde das abgestimmte Briefing und die Atlas-Constraints im gewählten Projekt verwenden. Diese Demo zeigt nur die drei Aufträge und ihre Revisionen.",
      "output": "Ein beispielhafter Umsetzungsstand, der gegen den Auftrag geprüft werden kann. · Atlas-Referenzen: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exakte Servicestatus-Labels",
        "DC-DEMO-01: vollständiger lesbarer Statustext",
        "EC-DEMO-01: C-309 hat 0 Aufträge"
      ]
    },
    "engineering": {
      "description": "Der gewählte Codex- oder Claude-Agent würde das abgestimmte Briefing und die Atlas-Constraints im gewählten Projekt verwenden. Diese Demo zeigt nur die drei Aufträge und ihre Revisionen. Der gewählte Coding-Agent erhält den abgestimmten Arbeitskontext.",
      "output": "Eine simulierte Umsetzung mit vorgesehenem Bezug zu Code, Build und Prüfungen. · Atlas-Referenzen: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exakte Servicestatus-Labels",
        "DC-DEMO-01: vollständiger lesbarer Statustext",
        "EC-DEMO-01: C-309 hat 0 Aufträge"
      ]
    },
    "gate": {
      "title": "Optional · Umsetzungsreview",
      "copy": "Ein Zwischenstand kann vor der abschließenden Prüfung mit euch abgestimmt werden."
    },
    "example": "Der gewählte Coding-Agent verwendet dieselben drei Nordhafen-Zeilen und TC-DEMO-01/DC-DEMO-01. EC-DEMO-01 deckt Kunde C-309 mit 0 Aufträgen ab.",
    "status": "Umsetzungsstand wird erstellt"
  },
  {
    "name": "Prüfen & abnehmen",
    "short": "Prüfung",
    "tool": "ONE + MENSCH",
    "kicker": "DER BELEGTE FORTSCHRITT",
    "x": 77,
    "y": 16,
    "progress": 0.8,
    "business": {
      "description": "Exakte Labels und Darstellung gegen TC-DEMO-01/DC-DEMO-01 prüfen; C-309 mit 0 Aufträgen gegen EC-DEMO-01. Prüfung und Abnahme getrennt entscheiden.",
      "output": "Ein geprüfter Ergebnisstand mit dokumentierter fachlicher Abnahme. · Atlas-Referenzen: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exakte Servicestatus-Labels",
        "DC-DEMO-01: vollständiger lesbarer Statustext",
        "EC-DEMO-01: C-309 hat 0 Aufträge"
      ]
    },
    "engineering": {
      "description": "Exakte Labels und Darstellung gegen TC-DEMO-01/DC-DEMO-01 prüfen; C-309 mit 0 Aufträgen gegen EC-DEMO-01. Prüfung und Abnahme getrennt entscheiden. Der gewählte Coding-Agent erhält den abgestimmten Arbeitskontext.",
      "output": "Eine beispielhafte Prüfübersicht mit Kriterien, Beobachtungen und Ergebnisbezug. · Atlas-Referenzen: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exakte Servicestatus-Labels",
        "DC-DEMO-01: vollständiger lesbarer Statustext",
        "EC-DEMO-01: C-309 hat 0 Aufträge"
      ]
    },
    "gate": {
      "title": "Entscheidung · Fachliche Abnahme",
      "copy": "Testausgaben unterstützen die Prüfung. Die Abnahme erteilt der verantwortliche Mensch."
    },
    "example": "NH-1042–NH-1044 mit TC-DEMO-01 und DC-DEMO-01 vergleichen. C-309 darf keine Nordhafen-Aufträge sehen und erhält nach EC-DEMO-01 „Noch keine Aufträge vorhanden.“.",
    "status": "Nachweise und Kriterien werden geprüft"
  },
  {
    "name": "Wissen sichern",
    "short": "Wissen",
    "tool": "ATLAS + ONE",
    "kicker": "DIE BASIS FÜR DEN NÄCHSTEN AUFTRAG",
    "x": 90,
    "y": 35,
    "progress": 0.97,
    "business": {
      "description": "ONE bereitet die Erkenntnisse für Atlas vor und erhält die Constraint-Referenzen des geprüften Ergebnisses. Die Simulation schreibt oder verändert keine Atlas-Daten.",
      "output": "Ausgewählte Anforderungen, Entscheidungen und Nachweise sind in Atlas bestätigt. · Atlas-Referenzen: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exakte Servicestatus-Labels",
        "DC-DEMO-01: vollständiger lesbarer Statustext",
        "EC-DEMO-01: C-309 hat 0 Aufträge"
      ]
    },
    "engineering": {
      "description": "ONE bereitet die Erkenntnisse für Atlas vor und erhält die Constraint-Referenzen des geprüften Ergebnisses. Die Simulation schreibt oder verändert keine Atlas-Daten. Der gewählte Coding-Agent erhält den abgestimmten Arbeitskontext.",
      "output": "Ein bestätigter Demo-Vorschlag für Atlas mit Quelle, Begründung und Ergebnisbezug. · Atlas-Referenzen: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exakte Servicestatus-Labels",
        "DC-DEMO-01: vollständiger lesbarer Statustext",
        "EC-DEMO-01: C-309 hat 0 Aufträge"
      ]
    },
    "gate": {
      "title": "Entscheidung · Wissen übernehmen",
      "copy": "Ihr wählt und bestätigt die fachlichen Änderungen. Der Verlauf im Arbeitsbereich bleibt von dieser Wissensübernahme getrennt."
    },
    "example": "Die Übergabe erhält die geprüfte Revision und die fiktiven Atlas-Referenzen TC-DEMO-01, DC-DEMO-01 und EC-DEMO-01.",
    "status": "Erkenntnisse zur Übernahme vorbereitet"
  }
];
