export const stations=[
  {
    "name": "Clarify the brief",
    "short": "Brief",
    "tool": "ONE + HUMAN",
    "kicker": "THE STARTING POINT",
    "x": 12,
    "y": 55,
    "progress": 0.03,
    "business": {
      "description": "ONE holds the brief for three Nordhafen service orders. Atlas knowledge and the terminology, design and empty-state constraints define the target.",
      "output": "A confirmed brief that everyone involved understands in the same way. · Atlas references: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exact service labels",
        "DC-DEMO-01: full readable status text",
        "EC-DEMO-01: C-309 has 0 orders"
      ]
    },
    "engineering": {
      "description": "ONE holds the brief for three Nordhafen service orders. Atlas knowledge and the terminology, design and empty-state constraints define the target. The chosen coding agent receives the agreed workspace context.",
      "output": "A concrete brief linked to a project, with requirements and acceptance criteria. · Atlas references: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exact service labels",
        "DC-DEMO-01: full readable status text",
        "EC-DEMO-01: C-309 has 0 orders"
      ]
    },
    "example": "Nordhafen needs NH-1042 Loading gate maintenance, NH-1043 Heating system inspection and NH-1044 Fire door service in one portal.",
    "status": "Idea captured"
  },
  {
    "name": "Connect the context",
    "short": "Context",
    "tool": "ATLAS",
    "kicker": "SHARED KNOWLEDGE",
    "x": 28,
    "y": 70,
    "progress": 0.25,
    "business": {
      "description": "Atlas supplies requirements and explicit rules: TC-DEMO-01 for status labels, DC-DEMO-01 for presentation and EC-DEMO-01 for an empty list. All references here are fictional.",
      "output": "Traceable context that brings scattered information together. · Atlas references: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exact service labels",
        "DC-DEMO-01: full readable status text",
        "EC-DEMO-01: C-309 has 0 orders"
      ]
    },
    "engineering": {
      "description": "Atlas supplies requirements and explicit rules: TC-DEMO-01 for status labels, DC-DEMO-01 for presentation and EC-DEMO-01 for an empty list. All references here are fictional. The chosen coding agent receives the agreed workspace context.",
      "output": "Working context with linked Atlas sources and traceable relationships. · Atlas references: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exact service labels",
        "DC-DEMO-01: full readable status text",
        "EC-DEMO-01: C-309 has 0 orders"
      ]
    },
    "example": "TC-DEMO-01: PROC → Service in progress; QA → Report in review; DONE → Service completed. DC-DEMO-01 defines the readable presentation.",
    "status": "Requirements and sources connected"
  },
  {
    "name": "Design & plan",
    "short": "Design & plan",
    "tool": "ONE + HUMAN",
    "kicker": "THE AGREED FRAMEWORK",
    "x": 44,
    "y": 29,
    "progress": 0.43,
    "business": {
      "description": "ONE brings together the task plan and approvals. Compare PROC / QA / DONE with the exact TC-DEMO-01 labels and the DC-DEMO-01 design rules before separate design and plan approval.",
      "output": "Approved work packages with clear outcomes and verification criteria. · Atlas references: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exact service labels",
        "DC-DEMO-01: full readable status text",
        "EC-DEMO-01: C-309 has 0 orders"
      ]
    },
    "engineering": {
      "description": "ONE brings together the task plan and approvals. Compare PROC / QA / DONE with the exact TC-DEMO-01 labels and the DC-DEMO-01 design rules before separate design and plan approval. The chosen coding agent receives the agreed workspace context.",
      "output": "An agreed task plan as the basis for the selected coding agent. · Atlas references: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exact service labels",
        "DC-DEMO-01: full readable status text",
        "EC-DEMO-01: C-309 has 0 orders"
      ]
    },
    "gate": {
      "title": "Decision · Plan approval",
      "copy": "Review the design, improve it if needed, then approve the design and plan separately."
    },
    "example": "The initial raw codes remain visible until the clarity revision is processed. TC-DEMO-01 supplies the before/after target; DC-DEMO-01 supplies the design rules.",
    "status": "Plan ready for approval"
  },
  {
    "name": "Implement",
    "short": "Implementation",
    "tool": "ONE · CODEX / CLAUDE",
    "kicker": "THE PRODUCTION LINE",
    "x": 60,
    "y": 52,
    "progress": 0.63,
    "business": {
      "description": "The selected Codex or Claude agent would use the agreed brief and Atlas constraints in the chosen project. This demo only visualizes the three orders and their revisions.",
      "output": "An example implementation that can be checked against the brief. · Atlas references: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exact service labels",
        "DC-DEMO-01: full readable status text",
        "EC-DEMO-01: C-309 has 0 orders"
      ]
    },
    "engineering": {
      "description": "The selected Codex or Claude agent would use the agreed brief and Atlas constraints in the chosen project. This demo only visualizes the three orders and their revisions. The chosen coding agent receives the agreed workspace context.",
      "output": "A simulated implementation with intended links to code, builds and verification. · Atlas references: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exact service labels",
        "DC-DEMO-01: full readable status text",
        "EC-DEMO-01: C-309 has 0 orders"
      ]
    },
    "gate": {
      "title": "Optional · Implementation review",
      "copy": "An interim result can be reviewed with you before final verification."
    },
    "example": "The selected coding agent uses the same three Nordhafen rows and the agreed TC-DEMO-01/DC-DEMO-01 rules. EC-DEMO-01 covers customer C-309 with 0 orders.",
    "status": "Implementation in progress"
  },
  {
    "name": "Verify & accept",
    "short": "Verification",
    "tool": "ONE + HUMAN",
    "kicker": "EVIDENCE OF PROGRESS",
    "x": 77,
    "y": 16,
    "progress": 0.8,
    "business": {
      "description": "Review the exact labels and presentation against TC-DEMO-01/DC-DEMO-01, and C-309 with 0 orders against EC-DEMO-01. Decide review and acceptance separately.",
      "output": "A verified result with documented business acceptance. · Atlas references: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exact service labels",
        "DC-DEMO-01: full readable status text",
        "EC-DEMO-01: C-309 has 0 orders"
      ]
    },
    "engineering": {
      "description": "Review the exact labels and presentation against TC-DEMO-01/DC-DEMO-01, and C-309 with 0 orders against EC-DEMO-01. Decide review and acceptance separately. The chosen coding agent receives the agreed workspace context.",
      "output": "An example review overview with criteria, observations and a reference to the result. · Atlas references: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exact service labels",
        "DC-DEMO-01: full readable status text",
        "EC-DEMO-01: C-309 has 0 orders"
      ]
    },
    "gate": {
      "title": "Decision · Business acceptance",
      "copy": "Test output supports verification. The responsible person grants acceptance."
    },
    "example": "Compare NH-1042–NH-1044 with TC-DEMO-01 and DC-DEMO-01. Customer C-309 must see no Nordhafen orders and the EC-DEMO-01 message “No orders yet.”.",
    "status": "Evidence and criteria under review"
  },
  {
    "name": "Preserve knowledge",
    "short": "Knowledge",
    "tool": "ATLAS + ONE",
    "kicker": "THE FOUNDATION FOR THE NEXT BRIEF",
    "x": 90,
    "y": 35,
    "progress": 0.97,
    "business": {
      "description": "ONE prepares the findings for Atlas, preserving which constraint references guided the reviewed result. The simulation does not write or change Atlas data.",
      "output": "Selected requirements, decisions and evidence are confirmed in Atlas. · Atlas references: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exact service labels",
        "DC-DEMO-01: full readable status text",
        "EC-DEMO-01: C-309 has 0 orders"
      ]
    },
    "engineering": {
      "description": "ONE prepares the findings for Atlas, preserving which constraint references guided the reviewed result. The simulation does not write or change Atlas data. The chosen coding agent receives the agreed workspace context.",
      "output": "A confirmed demo proposal for Atlas with a source, rationale and link to the result. · Atlas references: TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
      "checks": [
        "TC-DEMO-01: exact service labels",
        "DC-DEMO-01: full readable status text",
        "EC-DEMO-01: C-309 has 0 orders"
      ]
    },
    "gate": {
      "title": "Decision · Save knowledge",
      "copy": "You select and confirm the business changes. The workspace history remains separate from this knowledge transfer."
    },
    "example": "The handover retains the reviewed revision and the fictional Atlas references TC-DEMO-01, DC-DEMO-01 and EC-DEMO-01.",
    "status": "Findings ready to save"
  }
];
