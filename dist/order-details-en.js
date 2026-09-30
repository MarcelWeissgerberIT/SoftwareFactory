/** Fictional, local presentation data. This module makes no tool or network calls. */
export const ORDER = {
  id: 'SF-001',
  title: 'Customer portal · Order status',
  customer: 'Example customer Nordhafen · fictional',
  simulationOnly: true,
  label: 'Fictional demo order',
  request: 'Our customers regularly ask about the progress of their orders. They should be able to see their own orders and their status in the portal.',
  goal: 'Customers can check their order status themselves. Clear language, a helpful message for empty lists and access limited to their own orders are part of the goal.',
  method: 'Feature enhancement',
  scope: [
    'An order overview with the states in progress, in review and completed.',
    'An access design that limits the overview to orders belonging to the signed-in customer.',
    'A clear message when this customer has no orders yet.',
  ],
  criteria: [
    { id: 'K-01', title: 'Clear status labels', description: 'Customers can distinguish the three states without internal abbreviations.' },
    { id: 'K-02', title: 'Own orders only', description: 'The intended access limits data to the signed-in customer; a second demo customer provides a contrasting test case.' },
    { id: 'K-03', title: 'Empty list explained', description: 'When there are no orders, “No orders yet.” appears instead of an empty view without explanation.' },
    { id: 'K-04', title: 'Easy to read', description: 'Status labels and other text are clearly legible. The demo shows a contrast improvement; a full accessibility review remains a separate task.' },
  ],
  sources: [
    { id: 'BRIEF-DEMO', title: 'Customer brief', kind: 'Fictional user input', description: 'Target audience, change request and expected outcome of this example order.' },
    { id: 'REQ-DEMO-01', title: 'Orders in the customer portal', kind: 'Fictional Atlas requirement', description: 'The intended status overview and assignment of orders to a customer.' },
    { id: 'DEC-DEMO-01', title: 'Limit customer access', kind: 'Fictional Atlas decision', description: 'A customer should receive only their own orders. The access design must be reviewed before a real implementation.' },
    { id: 'TEST-DEMO-01', title: 'Test cases for status, access and empty lists', kind: 'Fictional test plan', description: 'Example criteria for a future test run; this website does not execute application tests.' },
  ],
  workPackages: [
    { id: 'AP-01', title: 'Design and build the status view', role: 'Design and development', tool: 'Norda · Codex or Claude', description: 'Agree on the portal design and use it to prepare an order list with clear status labels.' },
    { id: 'AP-02', title: 'Address customer access', role: 'Development', tool: 'Norda · selected agent', description: 'Translate the Atlas requirement into an access design and suitable changes in the selected project.' },
    { id: 'AP-03', title: 'Prepare review and handover', role: 'Quality assurance and business owners', tool: 'Norda · Atlas · Human', description: 'Connect test cases to success criteria, assess the specific result and make a separate acceptance decision.' },
  ],
  roles: [
    { title: 'Business owners', responsibility: 'Decide on the goal, design, scope and acceptance.' },
    { title: 'Atlas', responsibility: 'Provide requirements, decisions and documented knowledge as the basis for the work.' },
    { title: 'Norda', responsibility: 'Bring together the order, selected agents, work steps and results.' },
    { title: 'Codex or Claude', responsibility: 'Support analysis or development in the approved Norda step.' },
  ],
  exampleData: [
    { id: 'Auftrag 01', owner: 'Demo customer A', status: 'PROC', readableStatus: 'In progress' },
    { id: 'Auftrag 02', owner: 'Demo customer A', status: 'QA', readableStatus: 'In review' },
    { id: 'Auftrag 03', owner: 'Demo customer A', status: 'DONE', readableStatus: 'Completed' },
  ],
  iterations: [
    { code: 'clarity', title: 'Make status labels clearer', before: 'PROC · QA · DONE', after: 'In progress · In review · Completed' },
    { code: 'accessibility', title: 'Improve contrast and readability', before: 'Subtle text on light surfaces', after: 'Darker labels and more distinct status fields' },
    { code: 'empty-state', title: 'Explain empty lists', before: 'An empty view without explanation', after: '“No orders yet.”' },
  ],
  handover: ['Portal design and simulated build revision', 'Success criteria and example test cases', 'Decision and rework history', 'Selected findings for Atlas'],
  demoNote: 'All customers, sources, orders and test cases are fictional. The website simulates work steps and decisions; it does not call Atlas or agents, run builds or application tests, or write to external systems.',
};

const NAMES = ['Order', 'Atlas context', 'Design & plan', 'Implementation', 'Review & acceptance', 'Atlas feedback'];
const PERCENT = fraction => `${Math.round(Math.max(0, Math.min(1, Number(fraction) || 0)) * 100)} %`;
const revision = value => Number.isInteger(value) && value > 0 ? value : 1;
const codes = value => Array.isArray(value) ? value.filter(code => code === 'clarity' || code === 'accessibility') : [];
const feedbackText = values => values.map(code => code === 'clarity' ? 'clear status labels' : 'stronger contrast and better readability').join(' and ');

function stationDetails(index, engineering, designRevision, buildRevision) {
  const common = [
    { title: 'Clarify the order', input: 'Customer brief · SF-001', tool: 'Norda · Human', output: 'Brief with a goal, scope and four success criteria', decision: 'The business owners clarify the goal and missing details.', checks: ['Identify the target audience', 'Define the scope', 'Set success criteria'] },
    { title: 'Connect the Atlas sources', input: 'Fictional requirement REQ-DEMO-01 and decision DEC-DEMO-01', tool: 'Atlas → Norda · simulated', output: 'Context package with a requirement, access design and source references', decision: 'Record missing or conflicting information as a question.', checks: ['Link the status overview', 'Consider customer access', 'Keep source references'] },
    { title: `Design v${designRevision} and work plan`, input: 'Customer brief and Atlas context', tool: 'Norda · design role · simulated', output: `Portal design v${designRevision} and three work packages`, decision: 'First review the design, then approve the plan separately.', checks: ['Inspect the status labels', 'Assess readability', 'Agree on AP-01 through AP-03'] },
    { title: `Prepare build v${buildRevision}`, input: `Approved plan and design v${designRevision}`, tool: 'Norda · Codex or Claude · simulated', output: `Simulated build v${buildRevision} with an order list and access design`, decision: 'The specific result then moves into business review.', checks: ['Compare the status view', 'Account for customer ownership', 'Handle an empty list'] },
    { title: `Check build v${buildRevision} against the criteria`, input: `Simulated build v${buildRevision} and criteria K-01 through K-04`, tool: 'Norda · QA · Human · simulated', output: 'Example review overview for the current result', decision: 'Business review and acceptance are two separate decisions.', checks: ['Compare the three status values', 'Consider access for two demo customers', 'Inspect the view without orders'] },
    { title: 'Prepare findings for transfer', input: `Design v${designRevision}, build v${buildRevision} and demo decisions`, tool: 'Norda → Atlas · simulated', output: 'Selected status terms, access criteria and review references', decision: 'Confirm the selected business findings before their simulated transfer.', checks: ['Retain the source', 'Link the result revision', 'Explicitly confirm the transfer'] },
  ];
  const businessActions = [
    ['The change request reaches Norda.', 'The goal and target audience are drawn from the brief.', 'The status view, customer access and empty list are recorded as the scope.', 'The four success criteria are included in the demo brief.', 'The order moves forward with its open questions.'],
    ['The order receives its knowledge base.', 'The demo links the Atlas requirement to the status overview.', 'The access design is connected to the requirement.', 'The requirement, decision and their origins form the context package.', 'The context package is made available for planning.'],
    ['The design is received at the design station.', 'Order rows and status fields are positioned.', 'Norda connects the design to the three work packages.', 'The portal design is visible as the workpiece.', 'The design and plan are prepared for your decision.'],
    ['The approved design reaches implementation.', 'The order list is assembled as an example component.', 'Status display and customer ownership come together in the demo build.', 'The application preview shows the new result.', 'The simulated build is prepared for review.'],
    ['The result enters review.', 'The three status values are compared with the design.', 'The test case for two separate customers and an empty list is considered.', 'The demo compares the criteria with the result.', 'You receive the review overview for assessment and acceptance.'],
    ['The accepted demo result reaches the knowledge feedback stage.', 'Status terms and access criteria are selected as findings.', 'The selection is linked to its source and result revision.', 'The proposal for Atlas is ready.', 'The transfer of business findings awaits your confirmation.'],
  ];
  const technicalActions = [
    ['Norda uses the fictional brief as the order context.', 'Inputs are organized into a goal, scope and open questions.', 'K-01 through K-04 are linked to order SF-001.', 'The brief and criteria provide the context for the next step.', 'The handover preserves the link to the order.'],
    ['A selected Atlas read step is illustrated.', 'REQ-DEMO-01 supplies the business requirement for the demo.', 'DEC-DEMO-01 adds the intended access to a customer’s own orders.', 'The source identifier and business relationship remain in the context.', 'Norda passes the context and its evidence references to the planning step.'],
    ['The planning step receives the order and sources.', 'An example “OrderStatusList” component is positioned in the design.', 'AP-01 status view, AP-02 customer access and AP-03 review are scoped.', 'The design and work packages form the proposed implementation basis.', 'Execution approval and the design decision remain separate.'],
    ['An approved Norda development step is illustrated.', 'Codex or Claude would edit “OrderStatusList” in the selected project.', 'Suitable data access would need to enforce customer ownership on the server.', 'The demo build visualizes the intended result; no build command is running.', 'The result is passed on with the intended test cases.'],
    ['The criteria are linked to the current result revision.', 'Status mapping and presentation are considered using the example values.', 'Two customer identifiers and an empty result list form the example test cases.', 'The review overview illustrates the required evidence; it is not an executed test run.', 'Real acceptance requires suitable evidence and your own observation.'],
    ['The result revision and demo decisions form the source of the transfer.', 'A proposal for business content in Atlas is illustrated.', 'Status terms, access criteria and review references are linked to the proposal.', 'After a confirmed write, Norda would read back the stored Atlas content.', 'This website shows the process without writing to external systems.'],
  ];
  return { ...common[index], actions: (engineering ? technicalActions : businessActions)[index] };
}

/**
 * Describe the actual work location (runStage), independently of selected camera.
 * Accepts both engine.state and its serializable snapshot. No state is mutated.
 * All returned fields are plain text; checks is a fresh array.
 */
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
    return { ...result, title: ORDER.title, action: 'Start the fictional order and follow it from the brief to confirmed knowledge.', input: ORDER.request, tool: 'Atlas × Norda · interactive demo', output: ORDER.goal, decision: 'You decide on the design, plan, review, acceptance and knowledge transfer.', progressLabel: 'Ready · Fictional demo order' };
  }
  if (state.phase === 'complete') {
    return { ...result, title: 'Demo order completed', action: `Design v${design} and build v${build} have passed through the simulated decisions. The selected findings are confirmed in the demo history.`, input: 'Demo result, criteria and decision history', tool: 'Atlas × Norda · simulated', output: `Order file SF-001 · Design v${design} · Build v${build}`, decision: 'The decisions apply to this simulated result.', checks: ['Design and plan confirmed', 'Review and acceptance decided separately', 'Knowledge transfer confirmed'], progressLabel: 'Demo completed' };
  }

  if (state.returnRoute) {
    const designLoop = state.returnRoute === 'design';
    result = {
      ...result,
      title: designLoop ? 'Design feedback on its way back' : 'QA finding returns to implementation',
      action: designLoop
        ? `Design v${design} remains unchanged on the return path. Your request to the design station: ${feedbackText(pending.length ? pending : requested)}.`
        : `Build v${build} returns with the finding “Empty list without explanation”. The next revision will be created at the implementation station.`,
      input: designLoop ? `Your feedback on design v${design}` : `Your demo finding for build v${build}`,
      tool: 'Norda · rework within the same demo order',
      output: designLoop ? `Planned: design v${design + 1}` : `Planned: build v${build + 1} with an empty-list message`,
      decision: designLoop ? 'After the revision, review the design and plan again.' : 'The new revision requires a fresh business review and separate acceptance.',
      checks: designLoop ? ['Feedback stays with the order', 'The view changes only during processing', 'The new design returns to review'] : ['The finding stays with the order', 'The correction is made at the build station', 'Review and acceptance are requested again'],
      progressLabel: `Return path · ${PERCENT(state.returnProgress)}`,
    };
  } else if (state.phase === 'gate') {
    const gates = {
      design: {
        title: `Design v${design} · Design review`,
        action: applied.length ? `The current design shows ${feedbackText(applied)}. Check whether the presentation meets the customer’s needs.` : 'The first design shows PROC, QA and DONE. Check clarity and readability, or send back specific feedback.',
        input: `Portal design v${design}`, output: 'Your design decision or a specific revision request',
        decision: 'Approve the design, or request improvements to the status labels or readability.',
        checks: ['Inspect the three status fields', 'Read the labels from the customer’s perspective', 'Assess contrast and readability'],
      },
      plan: { title: 'Approve the plan separately', action: `Design v${design} is confirmed in the demo. Norda presents the three work packages for the status view, customer access and review.`, input: `Confirmed design v${design} and AP-01 through AP-03`, output: 'Explicit implementation approval for the demo plan', decision: 'Approve the proposed scope of work.', checks: ['Scope understood', 'Access criterion included', 'Review planned'] },
      review: { title: `Build v${build} · Business review`, action: build > 1 ? 'The revised demo build shows the empty-list message. Assess this result against the criteria again.' : 'Examine the status view, customer access and empty list. You can turn the example empty-list finding into a rework request.', input: `Build v${build} and example test cases`, output: 'Your demo assessment or a rework request', decision: 'Confirm the review or request an improvement to the empty view. Acceptance follows separately.', checks: ['Clear status labels?', 'Access limited to own orders by design?', 'Empty list explained?'] },
      acceptance: { title: `Build v${build} · Acceptance decision`, action: 'The business review in the demo is confirmed. Now decide separately whether to accept this result.', input: `Reviewed build v${build}`, output: 'Acceptance decision for this demo revision', decision: 'Accept this result or request further rework.', checks: ['Result revision identified', 'Criteria considered', 'Make an explicit acceptance decision'] },
      knowledge: { title: 'Transfer the selected findings', action: `Status terms, access criteria and the review reference for build v${build} are ready for the simulated Atlas transfer.`, input: 'Selected business findings with source references', output: 'Confirmed knowledge selection in the local demo history', decision: 'Explicitly confirm the selection for the simulated transfer back to Atlas.', checks: ['Status terms selected', 'Access criteria linked', 'Result revision included'] },
    };
    const gate = gates[state.gate];
    if (gate) result = { ...result, ...gate, tool: state.gate === 'knowledge' ? 'Human · Norda → Atlas · simulated' : 'Human · Norda', progressLabel: 'Waiting for your decision' };
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
      result.action = engineering ? 'The demo prepares an empty state for the example “OrderStatusList” component. An empty result list should display a clear message.' : 'Implementation adds the message “No orders yet.” for an empty order list.';
      result.output = `Planned: build v${build + 1} with a clear empty state`;
    } else if (stage === 3 && build > 1) {
      result.action = `Build v${build} now shows the message “No orders yet.” This new result goes through review again.`;
    }
  }
  if (state.phase === 'paused') {
    result.action = `Paused. ${result.action}`;
    result.progressLabel = `Paused · ${result.progressLabel.toLowerCase()}`;
  }
  return result;
}
