/** Fictional, local presentation data. This module makes no tool or network calls. */
export const ORDER = {
  "id": "SF-001",
  "title": "Customer portal · Order status",
  "customer": "Example customer Nordhafen · fictional",
  "simulationOnly": true,
  "label": "Fictional demo order",
  "request": "Nordhafen needs a portal for three service orders: NH-1042 loading gate maintenance, NH-1043 heating system inspection and NH-1044 fire door service. Customers should understand each service status without internal abbreviations.",
  "goal": "Show the same three service orders throughout the demo. Atlas supplies the agreed terminology and design rules; ONE holds the brief, tasks and approvals. Feedback visibly changes the labels and presentation.",
  "method": "Feature enhancement",
  "scope": [
    "The order overview for NH-1042, NH-1043 and NH-1044 with the exact labels from TC-DEMO-01.",
    "A readable status presentation following DC-DEMO-01 and access restricted to the signed-in customer.",
    "The message from EC-DEMO-01 when that customer has no orders."
  ],
  "criteria": [
    {
      "id": "K-01",
      "title": "Exact Atlas terminology",
      "description": "K-01 / TC-DEMO-01: NH-1042 reads “Service in progress”, NH-1043 “Report in review” and NH-1044 “Service completed”. Raw PROC, QA and DONE remain internal codes."
    },
    {
      "id": "K-02",
      "title": "Own orders only",
      "description": "K-02 / DEC-DEMO-01: Nordhafen sees NH-1042, NH-1043 and NH-1044. A different demo customer must not receive these orders."
    },
    {
      "id": "K-03",
      "title": "Empty list explained",
      "description": "K-03 / EC-DEMO-01: C-309 is a fictional customer with 0 orders. Its empty result must display “No orders yet.” rather than an unexplained blank view."
    },
    {
      "id": "K-04",
      "title": "Easy to read",
      "description": "K-04 / DC-DEMO-01: All three full labels remain visible; text conveys status alongside colour. The contrast improvement is illustrative, not a full accessibility certification."
    }
  ],
  "sources": [
    {
      "id": "BRIEF-DEMO",
      "title": "Customer brief",
      "kind": "Fictional user input",
      "description": "Fictional Nordhafen brief for NH-1042, NH-1043 and NH-1044, including the target audience and expected customer benefit."
    },
    {
      "id": "REQ-DEMO-01",
      "title": "Orders in the customer portal",
      "kind": "Fictional Atlas requirement",
      "description": "The three Nordhafen service orders and their internal PROC, QA and DONE states; customer labels follow TC-DEMO-01."
    },
    {
      "id": "DEC-DEMO-01",
      "title": "Limit customer access",
      "kind": "Fictional Atlas decision",
      "description": "A customer should receive only their own orders. The access design must be reviewed before a real implementation."
    },
    {
      "id": "TEST-DEMO-01",
      "title": "Test cases for status, access and empty lists",
      "kind": "Fictional test plan",
      "description": "Example checks compare the same three orders against TC-DEMO-01 and DC-DEMO-01, customer access against DEC-DEMO-01, and empty results against EC-DEMO-01. No application tests run here."
    },
    {
      "id": "TC-DEMO-01",
      "title": "Approved service status labels",
      "kind": "Fictional Atlas Terminology Constraint",
      "description": "Replace internal codes with the agreed customer-facing labels for the three Nordhafen orders. PROC → Service in progress QA → Report in review DONE → Service completed Use the exact terms in the portal, design review and handover."
    },
    {
      "id": "DC-DEMO-01",
      "title": "Readable status presentation",
      "kind": "Fictional Atlas Design Constraint",
      "description": "Keep the full status label visible and distinguish it clearly from its background. Show every status label in full, without ellipsis. Use text as well as colour to communicate status. Use dark, legible text on clearly distinguishable status surfaces."
    },
    {
      "id": "EC-DEMO-01",
      "title": "Explain an empty order list",
      "kind": "Fictional Atlas Empty-state Constraint",
      "description": "Fictional customer C-309 has 0 orders and receives the exact empty-state message. Show “No orders yet.” when the order list is empty. An empty list must not be presented as a loading error."
    }
  ],
  "workPackages": [
    {
      "id": "AP-01",
      "title": "Design and build the status view",
      "role": "Design and development",
      "tool": "ONE · Codex or Claude",
      "description": "In ONE, plan the three Nordhafen rows with the exact labels from TC-DEMO-01 and the presentation rules from DC-DEMO-01. Use the before/after comparison for design approval."
    },
    {
      "id": "AP-02",
      "title": "Address customer access",
      "role": "Development",
      "tool": "ONE · selected agent",
      "description": "Prepare the selected coding agent’s assignment using the agreed Atlas constraints: restrict these orders to Nordhafen and handle an empty result using EC-DEMO-01."
    },
    {
      "id": "AP-03",
      "title": "Prepare review and handover",
      "role": "Quality assurance and business owners",
      "tool": "ONE · Atlas · Human",
      "description": "Review NH-1042, NH-1043 and NH-1044 against TC-DEMO-01/DC-DEMO-01, and the empty result against EC-DEMO-01. Record review and acceptance separately in ONE."
    }
  ],
  "roles": [
    {
      "title": "Business owners",
      "responsibility": "Decide on the goal, design, scope and acceptance."
    },
    {
      "title": "Atlas",
      "responsibility": "Provide knowledge, requirements and the explicit terminology, design and empty-state constraints for the demo."
    },
    {
      "title": "ONE",
      "responsibility": "Hold the brief, tasks and approvals in the workspace, linking Atlas knowledge and constraints with the selected coding agent."
    },
    {
      "title": "Codex or Claude",
      "responsibility": "Use the agreed brief and Atlas constraints for the planned changes in the selected project."
    }
  ],
  "exampleData": [
    {
      "id": "Auftrag 01",
      "owner": "Nordhafen · demo customer A",
      "status": "PROC",
      "readableStatus": "Service in progress",
      "reference": "NH-1042",
      "title": "Loading gate maintenance"
    },
    {
      "id": "Auftrag 02",
      "owner": "Nordhafen · demo customer A",
      "status": "QA",
      "readableStatus": "Report in review",
      "reference": "NH-1043",
      "title": "Heating system inspection"
    },
    {
      "id": "Auftrag 03",
      "owner": "Nordhafen · demo customer A",
      "status": "DONE",
      "readableStatus": "Service completed",
      "reference": "NH-1044",
      "title": "Fire door service"
    }
  ],
  "iterations": [
    {
      "code": "clarity",
      "title": "Make status labels clearer",
      "before": "PROC · QA · DONE",
      "after": "Service in progress · Report in review · Service completed",
      "constraintId": "TC-DEMO-01"
    },
    {
      "code": "accessibility",
      "title": "Improve contrast and readability",
      "before": "Pale text and weakly distinguished status surfaces",
      "after": "Full labels with dark text on distinct status surfaces",
      "constraintId": "DC-DEMO-01"
    },
    {
      "code": "empty-state",
      "title": "Explain empty lists",
      "before": "An empty view without explanation",
      "after": "“No orders yet.”",
      "constraintId": "EC-DEMO-01"
    }
  ],
  "handover": [
    "The same three Nordhafen orders with the current labels",
    "TC-DEMO-01, DC-DEMO-01 and EC-DEMO-01 with sources",
    "Before/after evidence and the revision reviewed",
    "Separate design, plan, review and acceptance decisions"
  ],
  "demoNote": "All customers, orders, sources and constraint IDs are fictional demo data, not live Atlas records. This website simulates the workflow; it does not call ONE, Atlas or agents, run application tests, or write to external systems.",
  "constraints": [
    {
      "id": "TC-DEMO-01",
      "type": "terminology",
      "title": "Approved service status labels",
      "description": "Replace internal codes with the agreed customer-facing labels for the three Nordhafen orders.",
      "rules": [
        "PROC → Service in progress",
        "QA → Report in review",
        "DONE → Service completed",
        "Use the exact terms in the portal, design review and handover."
      ],
      "source": "Atlas · fictional demo reference"
    },
    {
      "id": "DC-DEMO-01",
      "type": "design",
      "title": "Readable status presentation",
      "description": "Keep the full status label visible and distinguish it clearly from its background.",
      "rules": [
        "Show every status label in full, without ellipsis.",
        "Use text as well as colour to communicate status.",
        "Use dark, legible text on clearly distinguishable status surfaces."
      ],
      "source": "Atlas · fictional demo reference"
    },
    {
      "id": "EC-DEMO-01",
      "type": "empty-state",
      "title": "Explain an empty order list",
      "description": "Fictional customer C-309 has 0 orders and receives the exact empty-state message.",
      "rules": [
        "Show “No orders yet.” when the order list is empty.",
        "An empty list must not be presented as a loading error."
      ],
      "source": "Atlas · fictional demo reference"
    }
  ],
  "emptyCustomer": {
    "reference": "C-309",
    "name": "Fictional customer C-309",
    "orderCount": 0,
    "message": "No orders yet.",
    "constraintId": "EC-DEMO-01"
  }
};

const NAMES = ['Order', 'Atlas context', 'Design & plan', 'Implementation', 'Review & acceptance', 'Atlas feedback'];
const PERCENT = fraction => `${Math.round(Math.max(0, Math.min(1, Number(fraction) || 0)) * 100)} %`;
const revision = value => Number.isInteger(value) && value > 0 ? value : 1;
const codes = value => Array.isArray(value) ? value.filter(code => code === 'clarity' || code === 'accessibility') : [];
const feedbackText = values => values.map(code => code === 'clarity' ? 'TC-DEMO-01 labels: Service in progress, Report in review and Service completed' : 'DC-DEMO-01 presentation with full labels and stronger contrast').join(' and ');

function stationDetails(index, engineering, designRevision, buildRevision) {
  const common = [
  {
    "title": "Clarify the Nordhafen order",
    "input": "SF-001 · NH-1042, NH-1043 and NH-1044",
    "tool": "ONE · Human",
    "output": "A brief for three service orders with Atlas constraints to check",
    "decision": "Agree on the scope and request the terminology, design and empty-state rules.",
    "checks": [
      "Keep the same three order references",
      "Identify TC-DEMO-01 and DC-DEMO-01",
      "Include EC-DEMO-01 for empty results"
    ]
  },
  {
    "title": "Connect Atlas knowledge and constraints",
    "input": "REQ-DEMO-01 · TC-DEMO-01 · DC-DEMO-01 · EC-DEMO-01",
    "tool": "Atlas → ONE · simulated",
    "output": "A context package with the exact labels and presentation rules",
    "decision": "Read the fictional rules before assessing the first design.",
    "checks": [
      "TC-DEMO-01: use the agreed full labels",
      "DC-DEMO-01: keep labels visible and readable",
      "EC-DEMO-01: explain empty results"
    ]
  },
  {
    "title": `Design v${designRevision} and its constraint checklist`,
    "input": "The three Nordhafen orders and TC-DEMO-01 / DC-DEMO-01",
    "tool": "ONE · planning & design · simulated",
    "output": `Portal design v${designRevision}, before/after comparison and three work packages`,
    "decision": "Compare the current labels with the Atlas target, then approve design and plan separately.",
    "checks": [
      "Compare PROC / QA / DONE with TC-DEMO-01",
      "Check full labels and readability against DC-DEMO-01",
      "Include EC-DEMO-01 in AP-01 through AP-03"
    ]
  },
  {
    "title": `Prepare build v${buildRevision}`,
    "input": `Approved design v${designRevision} · all three Atlas constraints`,
    "tool": "ONE · Codex or Claude · simulated",
    "output": `Simulated build v${buildRevision} for the same three service orders`,
    "decision": "Changes must carry the selected design and the Atlas rules into review.",
    "checks": [
      "Retain the TC-DEMO-01 label mapping",
      "Apply the DC-DEMO-01 presentation rules",
      "Handle empty results with EC-DEMO-01"
    ]
  },
  {
    "title": `Review build v${buildRevision} against Atlas rules`,
    "input": "NH-1042 / NH-1043 / NH-1044 · TC-DEMO-01 / DC-DEMO-01 / EC-DEMO-01",
    "tool": "ONE · QA · Human · simulated",
    "output": "Example review of labels, layout, customer access and the empty state",
    "decision": "Review and acceptance remain separate decisions for this revision.",
    "checks": [
      "Compare each order label with TC-DEMO-01",
      "Check readability against DC-DEMO-01",
      "Check customer access and EC-DEMO-01"
    ]
  },
  {
    "title": "Preserve the reviewed constraint references",
    "input": `Design v${designRevision} · build v${buildRevision} · three Atlas constraint references`,
    "tool": "ONE → Atlas · simulated",
    "output": "Selected findings linking the result revision to the rules used",
    "decision": "Confirm the selected demo findings; existing Atlas rules remain the reference.",
    "checks": [
      "Keep TC-DEMO-01 and DC-DEMO-01 as sources",
      "Link EC-DEMO-01 to the empty-state revision",
      "Confirm knowledge transfer separately"
    ]
  }
];
  const businessActions = [
  [
    "The Nordhafen brief reaches the ONE workspace.",
    "NH-1042, NH-1043 and NH-1044 are identified as the three example orders.",
    "Clear customer labels and a readable layout become explicit goals.",
    "The brief requests TC-DEMO-01, DC-DEMO-01 and EC-DEMO-01 from Atlas.",
    "The same orders and success criteria move into context preparation."
  ],
  [
    "Atlas is the source of the demo knowledge and constraints.",
    "TC-DEMO-01 supplies the exact customer-facing status terms.",
    "DC-DEMO-01 requires full, readable labels with text as well as colour.",
    "EC-DEMO-01 adds the message for an empty order list.",
    "ONE holds the fictional source references alongside the brief."
  ],
  [
    "The same three service orders enter the design station.",
    "The first design exposes the internal codes PROC, QA and DONE.",
    "The before/after target follows TC-DEMO-01; visual feedback follows DC-DEMO-01.",
    "The current revision is ready to compare with the Atlas target.",
    "ONE presents the design and task plan for separate decisions."
  ],
  [
    "The selected design and Atlas rules reach implementation.",
    "The example order-list component retains NH-1042, NH-1043 and NH-1044.",
    "The selected labels and status presentation are carried into the demo build.",
    "The application preview shows the current revision, not an executed build.",
    "The result and all three constraint references move into review."
  ],
  [
    "The current revision enters review with its Atlas sources.",
    "Each Nordhafen status label is compared with TC-DEMO-01.",
    "Full label visibility and readability are assessed against DC-DEMO-01.",
    "Nordhafen ownership and customer C-309 with 0 orders are checked against DEC-DEMO-01 and EC-DEMO-01.",
    "You decide on review and acceptance separately."
  ],
  [
    "The accepted demo revision reaches the knowledge feedback stage.",
    "The selection records how the three Atlas constraints were used.",
    "NH-1042, NH-1043 and NH-1044 remain linked to the reviewed design.",
    "The proposed findings keep their constraint IDs and source references.",
    "The simulated Atlas transfer awaits your confirmation."
  ]
];
  const technicalActions = [
  [
    "ONE holds the fictional brief and task context.",
    "The example references NH-1042 / NH-1043 / NH-1044 stay unchanged.",
    "K-01 maps to TC-DEMO-01; K-04 maps to DC-DEMO-01.",
    "K-03 maps to EC-DEMO-01; customer ownership follows DEC-DEMO-01.",
    "These references form the context for the Atlas source step."
  ],
  [
    "The demo illustrates reading Atlas knowledge and constraints through MCP.",
    "TC-DEMO-01 maps PROC / QA / DONE to the agreed customer labels.",
    "DC-DEMO-01 defines full text, legibility and a colour-independent status cue.",
    "EC-DEMO-01 defines the empty-result message.",
    "ONE brings the referenced context to planning and the selected coding agent."
  ],
  [
    "ONE task planning combines the brief with the three Atlas constraint references.",
    "OrderStatusList retains the three concrete Nordhafen rows.",
    "AP-01 carries TC-DEMO-01 and DC-DEMO-01 into the design.",
    "AP-02 and AP-03 include access control and EC-DEMO-01 checks.",
    "The before/after revision is reviewed before separate plan approval."
  ],
  [
    "The demo shows an agreed assignment for the selected coding agent.",
    "Codex or Claude would update OrderStatusList using TC-DEMO-01 and DC-DEMO-01.",
    "Customer ownership must be enforced by suitable data access.",
    "EC-DEMO-01 supplies the empty-result message; no real build runs here.",
    "The simulated revision keeps all three Atlas constraint references."
  ],
  [
    "The current revision is matched to the constraint references.",
    "TC-DEMO-01 is checked against each row’s internal code and visible label.",
    "DC-DEMO-01 is checked for full labels and readable text, not inferred from colour alone.",
    "EC-DEMO-01 covers customer C-309 with 0 orders; DEC-DEMO-01 separates C-309 from the three Nordhafen orders.",
    "This review is illustrative; real acceptance needs executed evidence and observation."
  ],
  [
    "The accepted demo revision and constraint references are the handover source.",
    "The proposed Atlas findings document application of TC-DEMO-01 and DC-DEMO-01.",
    "EC-DEMO-01 remains linked to the empty-state revision.",
    "A real transfer would verify the stored content after writing.",
    "The website does not write or modify Atlas constraints."
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
  if (!state || typeof state !== 'object') throw new TypeError('A simulation state is required.');
  if (perspective !== 'business' && perspective !== 'engineering') throw new TypeError('Unknown perspective.');
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
    return constraintContext({ ...result, title: ORDER.title, action: 'Follow Nordhafen orders NH-1042–NH-1044 using TC-DEMO-01, DC-DEMO-01 and EC-DEMO-01 from Atlas.', input: ORDER.request, tool: 'Atlas × ONE · interactive demo', output: ORDER.goal, decision: 'You decide on the design, plan, review, acceptance and knowledge transfer.', progressLabel: 'Ready · Fictional demo order' });
  }
  if (state.phase === 'complete') {
    return constraintContext({ ...result, title: 'Demo order completed', action: `Design v${design} and build v${build} have passed through the simulated decisions. The demo history keeps TC-DEMO-01, DC-DEMO-01 and EC-DEMO-01 as the source references.`, input: 'Demo result, criteria and decision history', tool: 'Atlas × ONE · simulated', output: `Order file SF-001 · Design v${design} · Build v${build}`, decision: 'The decisions apply to this simulated result.', checks: ['Design and plan confirmed', 'Review and acceptance decided separately', 'Knowledge transfer confirmed'], progressLabel: 'Demo completed' });
  }

  if (state.returnRoute) {
    const designLoop = state.returnRoute === 'design';
    result = {
      ...result,
      title: designLoop ? 'Design feedback on its way back' : 'QA finding returns to implementation',
      action: designLoop
        ? `Design v${design} remains unchanged on the return path. Your request to the design station: ${feedbackText(pending.length ? pending : requested)}.`
        : `Build v${build} returns with the EC-DEMO-01 finding “C-309: 0 orders without explanation”. The next revision will be created at the implementation station.`,
      input: designLoop ? `Your feedback on design v${design}` : `EC-DEMO-01 finding for build v${build}`,
      tool: 'ONE · rework within the same demo order',
      output: designLoop ? `Planned: design v${design + 1}` : `Planned: build v${build + 1} with the EC-DEMO-01 message`,
      decision: designLoop ? 'After the revision, review the design and plan again.' : 'The new revision requires a fresh business review and separate acceptance.',
      checks: designLoop ? ['Feedback stays with the order', 'The view changes only during processing', 'The new design returns to review'] : ['The finding stays with the order', 'The correction is made at the build station', 'Review and acceptance are requested again'],
      progressLabel: `Return path · ${PERCENT(state.returnProgress)}`,
    };
  } else if (state.phase === 'gate') {
    const gates = {
      design: {
        title: `Design v${design} · Design review`,
        action: applied.length ? `The current design shows ${feedbackText(applied)}. Check whether the presentation meets the customer’s needs.` : 'NH-1042 / NH-1043 / NH-1044 still show PROC / QA / DONE. TC-DEMO-01 requires Service in progress / Report in review / Service completed; DC-DEMO-01 requires readable full labels.',
        input: `Portal design v${design}`, output: 'Your design decision or a specific revision request',
        decision: 'Approve the design, or request improvements to the status labels or readability.',
        checks: ['Compare the three Nordhafen rows with TC-DEMO-01', 'Check exact wording against TC-DEMO-01', 'Check full labels and contrast against DC-DEMO-01'],
      },
      plan: { title: 'Approve the plan separately', action: `Design v${design} is confirmed in the demo. The ONE plan carries TC-DEMO-01, DC-DEMO-01 and EC-DEMO-01 through the three work packages for the same Nordhafen orders.`, input: `Confirmed design v${design} and AP-01 through AP-03`, output: 'Explicit implementation approval for the demo plan', decision: 'Approve the proposed scope of work.', checks: ['NH-1042 / NH-1043 / NH-1044 retained', 'TC-DEMO-01 and DC-DEMO-01 included', 'EC-DEMO-01 review planned'] },
      review: { title: `Build v${build} · Business review`, action: build > 1 ? 'The revised demo build shows “No orders yet.” from EC-DEMO-01. Recheck all three orders against TC-DEMO-01 and DC-DEMO-01.' : 'Compare the three Nordhafen orders with TC-DEMO-01/DC-DEMO-01, then check ownership and EC-DEMO-01. The missing empty-list message can become a rework request.', input: `Build v${build} and example test cases`, output: 'Your demo assessment or a rework request', decision: 'Confirm the review or request an improvement to the empty view. Acceptance follows separately.', checks: ['TC-DEMO-01: exact labels on all three orders?', 'DC-DEMO-01: full readable labels; own orders only?', 'EC-DEMO-01: empty list explained?'] },
      acceptance: { title: `Build v${build} · Acceptance decision`, action: 'The business review in the demo is confirmed. Now decide separately whether to accept this result.', input: `Reviewed build v${build}`, output: 'Acceptance decision for this demo revision', decision: 'Accept this result or request further rework.', checks: ['Result revision identified', 'Criteria considered', 'Make an explicit acceptance decision'] },
      knowledge: { title: 'Transfer the selected findings', action: `Findings for build v${build} link the three Nordhafen orders to TC-DEMO-01, DC-DEMO-01 and EC-DEMO-01 for the simulated Atlas transfer.`, input: 'Selected business findings with source references', output: 'Confirmed knowledge selection in the local demo history', decision: 'Explicitly confirm the selection for the simulated transfer back to Atlas.', checks: ['TC-DEMO-01 reference retained', 'DC-DEMO-01 and EC-DEMO-01 linked', 'Result revision included'] },
    };
    const gate = gates[state.gate];
    if (gate) result = { ...result, ...gate, tool: state.gate === 'knowledge' ? 'Human · ONE → Atlas · simulated' : 'Human · ONE', progressLabel: 'Waiting for your decision' };
  } else if (state.cycle === null || state.cycle === undefined) {
    result.action = `The workpiece travels to the “${NAMES[stage]}” station. ${stage === 0 ? 'The brief is ready for intake.' : 'The existing result and its link to the order are preserved.'}`;
    result.progressLabel = `Transport · ${PERCENT(state.travelProgress)}`;
  } else {
    const cycle = Math.max(0, Math.min(1, state.cycle));
    const step = cycle < .18 ? 0 : cycle < .38 ? 1 : cycle < .58 ? 2 : cycle < .88 ? 3 : 4;
    result.action = actions[step];
    result.progressLabel = `Processing · ${PERCENT(cycle)}`;
    if (stage === 2 && pending.length) {
      result.title = `Design v${design + 1} is taking shape`;
      result.action = cycle < .38 ? `The design station receives your feedback on design v${design}: ${feedbackText(pending)}.` : `The demo prepares ${feedbackText(pending)}. The existing design remains until the visible revision is applied.`;
      result.output = `Next design v${design + 1} incorporating your feedback`;
    } else if (stage === 2 && applied.length) {
      result.action = `Design v${design} now shows ${feedbackText(applied)}. The revision is being prepared for your next review.`;
    }
    if (stage === 3 && pendingBuild) {
      result.title = `Build v${build + 1} is being improved`;
      result.action = engineering ? 'The demo prepares an empty state for the example “OrderStatusList” component. EC-DEMO-01 requires “No orders yet.” for customer C-309 with 0 orders.' : 'Implementation applies EC-DEMO-01: customer C-309 with 0 orders receives “No orders yet.”.';
      result.output = `Planned: build v${build + 1} applying EC-DEMO-01`;
    } else if (stage === 3 && build > 1) {
      result.action = `Build v${build} now shows “No orders yet.” from EC-DEMO-01. This new result goes through review again.`;
    }
  }
  if (state.phase === 'paused') {
    result.action = `Paused. ${result.action}`;
    result.progressLabel = `Paused · ${result.progressLabel.toLowerCase()}`;
  }
  return constraintContext(result);
}
