const architecture = {
  participants: [
    { id: "user", name: "User", color: "#d946ef", role: "Requester" },
    { id: "rbac", name: "RBAC / Policies", color: "#14b8a6", role: "Governance" },
    { id: "integration", name: "Integration Layer", color: "#f97316", role: "Orchestration" },
    { id: "oracle", name: "Oracle ERP", color: "#06b6d4", role: "Procurement" },
    { id: "workday", name: "Workday", color: "#22c55e", role: "Finance" },
    { id: "pedyn", name: "PEDYN Legacy", color: "#8b5cf6", role: "Lab records" },
    { id: "mes", name: "Potential MES Candidate", color: "#ef4444", role: "Future MES" }
  ],
  requirements: [
    { id: "SYS-6.1", title: "Enterprise data exchange", description: "System shall exchange data with enterprise systems to support workflow automation, traceability, and inventory visibility." },
    { id: "SYS-6.2", title: "ERP retrieval", description: "System shall interface with an ERP to retrieve inventory, asset, and procurement information." },
    { id: "SYS-6.3", title: "Inventory synchronization", description: "System shall synchronize inventory availability and asset status with approved enterprise systems." },
    { id: "SYS-6.4", title: "Fallback operation", description: "System shall continue workflow execution when enterprise systems are temporarily unavailable." },
    { id: "SYS-6.5", title: "Protected exchange", description: "System shall protect data exchanged with enterprise systems." },
    { id: "SYS-7.1", title: "In-system guidance", description: "System shall provide user guidance such as help notes or tooltips during operation." },
    { id: "3.4.1", title: "Access control", description: "Role-based access validation and permission checks prevent unauthorized record changes." },
    { id: "5.6.2.1", title: "Audit subsystem", description: "Integration activity is logged to support traceability, auditing, and compliance evidence." },
    { id: "5.2.1", title: "Data retrieval", description: "External source data can be retrieved and used by downstream workflows." },
    { id: "5.3.1.1", title: "Field mapping", description: "Source fields are mapped into usable target fields for the integration layer or MES." },
    { id: "5.4.1.1", title: "Receiving interface", description: "Receiving workflows use mapped interface data for downstream inventory updates." },
    { id: "3.3.4", title: "Component traceability", description: "Component, part, and project records remain traceable across source systems." }
  ],
  messages: [
    {
      id: "request-action",
      from: "user",
      to: "rbac",
      label: "Request Action",
      direction: "request",
      payload: ["User identity", "Requested action", "Target system"],
      requirements: ["3.4.1", "SYS-6.5"],
      description: "The user initiates an action that must be checked before any enterprise or lab data is accessed."
    },
    {
      id: "authorization-granted",
      from: "rbac",
      to: "user",
      label: "Authorization Granted",
      direction: "response",
      payload: ["Role match", "Allowed permission", "Session decision"],
      requirements: ["3.4.1", "5.6.2.1"],
      description: "RBAC and policy checks return an allow or block decision and create an auditable access event."
    },
    {
      id: "submit-request",
      from: "user",
      to: "integration",
      label: "Submit Request",
      direction: "request",
      payload: ["Approved request", "Part number", "BOM or workflow context"],
      requirements: ["SYS-6.1", "SYS-7.1"],
      description: "The approved user request enters the integration layer for routing, data mapping, and downstream coordination."
    },
    {
      id: "request-erp-data",
      from: "integration",
      to: "oracle",
      label: "Request ERP Data",
      direction: "request",
      payload: ["Procurement lookup", "Inventory lookup", "Asset identifier"],
      requirements: ["SYS-6.1", "SYS-6.2", "5.2.1"],
      description: "The integration layer asks Oracle ERP for procurement, inventory, and asset data needed by PICKS."
    },
    {
      id: "erp-data",
      from: "oracle",
      to: "integration",
      label: "Procurement and Inventory Data",
      direction: "response",
      payload: ["Purchase order", "Vendor", "Part number", "Quantity", "Inventory status"],
      requirements: ["SYS-6.2", "5.2.1", "5.3.1.1"],
      description: "Oracle returns structured procurement and inventory data that can be mapped for PICKS workflows."
    },
    {
      id: "request-financial-data",
      from: "integration",
      to: "workday",
      label: "Request Financial Data",
      direction: "request",
      payload: ["Project account", "Cost object", "Funding reference"],
      requirements: ["SYS-6.1", "5.2.1"],
      description: "The integration layer requests financial context from Workday to support planning and downstream visibility."
    },
    {
      id: "financial-data",
      from: "workday",
      to: "integration",
      label: "Financial Data",
      direction: "response",
      payload: ["Funding status", "Financial reference", "Project cost data"],
      requirements: ["SYS-6.1", "5.2.1", "5.3.1.1"],
      description: "Workday returns financial data used to enrich the transaction and keep enterprise records aligned."
    },
    {
      id: "request-legacy-data",
      from: "integration",
      to: "pedyn",
      label: "Request Legacy Data",
      direction: "request",
      payload: ["Part number", "Build identifier", "Lab record lookup"],
      requirements: ["SYS-6.1", "3.3.4", "5.2.1"],
      description: "The integration layer requests historical lab execution records from PEDYN."
    },
    {
      id: "legacy-data",
      from: "pedyn",
      to: "integration",
      label: "Existing Lab Data",
      direction: "response",
      payload: ["Legacy part record", "Build history", "Lab status"],
      requirements: ["3.3.4", "5.2.1", "5.3.1.1"],
      description: "PEDYN returns existing laboratory data so PICKS can preserve traceability across legacy records."
    },
    {
      id: "create-update-record",
      from: "integration",
      to: "mes",
      label: "Create or Update Record",
      direction: "request",
      payload: ["Mapped item record", "Inventory update", "Operation status", "Trace link"],
      requirements: ["SYS-6.3", "5.4.1.1", "3.3.4"],
      description: "The integration layer creates or updates a record in the future MES candidate using mapped ERP, Workday, and PEDYN data."
    },
    {
      id: "status-confirmation",
      from: "mes",
      to: "integration",
      label: "Status Confirmation",
      direction: "response",
      payload: ["Update result", "MES record ID", "Synchronization status"],
      requirements: ["SYS-6.3", "SYS-6.4", "5.6.2.1"],
      description: "The MES candidate confirms whether the record was created or updated, including failure state if synchronization cannot complete."
    },
    {
      id: "log-activity",
      from: "integration",
      to: "rbac",
      label: "Log Activity",
      direction: "request",
      payload: ["Transaction ID", "User", "Systems touched", "Timestamp", "Decision outcome"],
      requirements: ["5.6.2.1", "SYS-6.5"],
      description: "The integration layer logs the completed activity through governance controls for auditability and compliance."
    }
  ]
};

const svg = document.querySelector("#sequenceDiagram");
const participantLayer = document.querySelector("#participantLayer");
const messageLayer = document.querySelector("#messageLayer");
const packetLayer = document.querySelector("#packetLayer");
const legend = document.querySelector("#legend");
const requirementFilter = document.querySelector("#requirementFilter");
const timeline = document.querySelector("#timeline");
const traceGrid = document.querySelector("#traceGrid");
const stepTitle = document.querySelector("#stepTitle");
const stepDescription = document.querySelector("#stepDescription");
const payloadList = document.querySelector("#payloadList");
const requirementList = document.querySelector("#requirementList");
const playPause = document.querySelector("#playPause");
const replay = document.querySelector("#replay");

const dimensions = {
  top: 44,
  bottom: 750,
  firstX: 130,
  gap: 250,
  boxWidth: 188,
  boxHeight: 82,
  firstMessageY: 158,
  messageGap: 50
};

const state = {
  activeIndex: 0,
  selectedRequirement: "all",
  playing: true,
  startedAt: performance.now(),
  cycleMs: 18000
};

const participantById = Object.fromEntries(architecture.participants.map((participant, index) => {
  return [participant.id, { ...participant, x: dimensions.firstX + index * dimensions.gap }];
}));
const requirementById = Object.fromEntries(architecture.requirements.map((requirement) => [requirement.id, requirement]));

function makeSvg(tag, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function splitLabel(label, maxLength = 17) {
  const words = label.split(" ");
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) lines.push(current);
  return lines;
}

function appendTextLines(textElement, lines, startY, lineHeight) {
  lines.forEach((line, index) => {
    const tspan = makeSvg("tspan", {
      x: dimensions.boxWidth / 2,
      y: startY + index * lineHeight
    });
    tspan.textContent = line;
    textElement.appendChild(tspan);
  });
}

function appendMessageLabel(textElement, lines, centerX, firstY, lineHeight) {
  lines.forEach((line, index) => {
    const tspan = makeSvg("tspan", {
      x: centerX,
      y: firstY + index * lineHeight
    });
    tspan.textContent = line;
    textElement.appendChild(tspan);
  });
}

function matchingMessages() {
  return architecture.messages.filter((message) => {
    return state.selectedRequirement === "all" || message.requirements.includes(state.selectedRequirement);
  });
}

function currentMessage() {
  const messages = matchingMessages();
  return messages[state.activeIndex % messages.length] || architecture.messages[0];
}

function renderRequirementOptions() {
  architecture.requirements.forEach((requirement) => {
    const option = document.createElement("option");
    option.value = requirement.id;
    option.textContent = `${requirement.id} - ${requirement.title}`;
    requirementFilter.appendChild(option);
  });
}

function renderLegend() {
  legend.innerHTML = architecture.participants.map((participant) => {
    return `
      <span class="legend-item">
        <span class="legend-swatch" style="--legend-color:${participant.color}"></span>
        ${participant.name}
      </span>
    `;
  }).join("");
}

function renderParticipants() {
  participantLayer.innerHTML = "";
  architecture.participants.forEach((participant) => {
    const model = participantById[participant.id];
    const topBox = participantBox(model, dimensions.top);
    const line = makeSvg("line", {
      x1: model.x,
      x2: model.x,
      y1: dimensions.top + dimensions.boxHeight,
      y2: dimensions.bottom,
      class: "lifeline"
    });
    const bottomBox = participantBox(model, dimensions.bottom);
    participantLayer.append(topBox, line, bottomBox);
  });
}

function participantBox(participant, y) {
  const group = makeSvg("g", { class: "participant", transform: `translate(${participant.x - dimensions.boxWidth / 2} ${y})` });
  const rect = makeSvg("rect", {
    width: dimensions.boxWidth,
    height: dimensions.boxHeight,
    rx: 8,
    class: "participant-box",
    style: `--participant-color:${participant.color}`
  });
  const text = makeSvg("text", {
    x: dimensions.boxWidth / 2,
    y: 0,
    "text-anchor": "middle",
    class: "participant-name"
  });
  const nameLines = splitLabel(participant.name);
  appendTextLines(text, nameLines, nameLines.length > 1 ? 28 : 36, 19);
  const role = makeSvg("text", {
    x: dimensions.boxWidth / 2,
    y: nameLines.length > 1 ? 67 : 61,
    "text-anchor": "middle",
    class: "participant-role"
  });
  role.textContent = participant.role;
  group.append(rect, text, role);
  return group;
}

function renderMessages() {
  messageLayer.innerHTML = "";
  const visibleMessages = matchingMessages();
  visibleMessages.forEach((message, index) => {
    const y = dimensions.firstMessageY + index * dimensions.messageGap;
    const from = participantById[message.from];
    const to = participantById[message.to];
    const active = index === state.activeIndex % visibleMessages.length;
    const startX = from.x + (to.x > from.x ? 12 : -12);
    const endX = to.x + (to.x > from.x ? -16 : 16);
    const group = makeSvg("g", {
      class: `message ${active ? "active" : ""} ${message.direction}`,
      "data-index": index
    });
    const line = makeSvg("line", {
      x1: startX,
      y1: y,
      x2: endX,
      y2: y,
      class: "message-line",
      "marker-end": "url(#arrowHead)"
    });
    const text = makeSvg("text", {
      x: (startX + endX) / 2,
      y: y - 12,
      "text-anchor": "middle",
      class: "message-label"
    });
    const labelLines = splitLabel(message.label, 24);
    appendMessageLabel(text, labelLines, (startX + endX) / 2, y - (labelLines.length > 1 ? 24 : 12), 17);
    group.addEventListener("click", () => {
      state.activeIndex = index;
      state.playing = false;
      render();
    });
    group.append(line, text);
    messageLayer.appendChild(group);
  });
}

function renderPacket() {
  packetLayer.innerHTML = "";
  const message = currentMessage();
  const messages = matchingMessages();
  const index = messages.indexOf(message);
  const y = dimensions.firstMessageY + index * dimensions.messageGap;
  const from = participantById[message.from];
  const to = participantById[message.to];
  const color = message.direction === "response" ? "#0f766e" : "#b45309";
  const group = makeSvg("g", { class: `data-packet ${message.direction}` });
  const circle = makeSvg("circle", {
    cx: from.x,
    cy: y,
    r: 13,
    fill: color
  });
  const dot = makeSvg("circle", {
    cx: from.x,
    cy: y,
    r: 5,
    fill: "#ffffff"
  });
  group.append(circle, dot);
  packetLayer.appendChild(group);
}

function renderDetails() {
  const message = currentMessage();
  stepTitle.textContent = message.label;
  stepDescription.textContent = message.description;
  payloadList.innerHTML = message.payload.map((item) => `<span class="pill">${item}</span>`).join("");
  requirementList.innerHTML = message.requirements.map((id) => {
    const requirement = requirementById[id];
    return `<article class="requirement-card"><strong>${id}: ${requirement.title}</strong><p>${requirement.description}</p></article>`;
  }).join("");
}

function renderTimeline() {
  const messages = matchingMessages();
  timeline.innerHTML = messages.map((message, index) => {
    const active = index === state.activeIndex % messages.length;
    const from = participantById[message.from].name;
    const to = participantById[message.to].name;
    const requirements = message.requirements.map((id) => `<span>${id}</span>`).join("");
    return `
      <button class="timeline-item ${active ? "active" : ""}" type="button" data-index="${index}">
        <span class="step-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="step-copy">
          <strong>${message.label}</strong>
          <small>${from} to ${to}</small>
          <span class="mini-pills">${requirements}</span>
        </span>
      </button>
    `;
  }).join("");
}

function renderTraceGrid() {
  traceGrid.innerHTML = architecture.requirements.map((requirement) => {
    const related = architecture.messages
      .filter((message) => message.requirements.includes(requirement.id))
      .map((message) => message.label);
    return `
      <article class="trace-card">
        <strong>${requirement.id}</strong>
        <h3>${requirement.title}</h3>
        <p>${requirement.description}</p>
        <div class="mini-pills">${related.map((label) => `<span>${label}</span>`).join("")}</div>
      </article>
    `;
  }).join("");
}

function updatePacket(now) {
  const messages = matchingMessages();
  if (!messages.length) return;
  const stepMs = state.cycleMs / messages.length;
  if (state.playing) {
    const elapsed = (now - state.startedAt) % state.cycleMs;
    const nextIndex = Math.floor(elapsed / stepMs);
    if (nextIndex !== state.activeIndex) {
      state.activeIndex = nextIndex;
      render();
    }
  }

  const message = currentMessage();
  const index = matchingMessages().indexOf(message);
  const y = dimensions.firstMessageY + index * dimensions.messageGap;
  const from = participantById[message.from];
  const to = participantById[message.to];
  const elapsed = state.playing ? ((now - state.startedAt) % stepMs) : stepMs * 0.5;
  const progress = Math.min(1, Math.max(0, elapsed / stepMs));
  const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  const x = from.x + (to.x - from.x) * ease;
  const packet = packetLayer.querySelector(".data-packet");
  if (packet) {
    packet.querySelectorAll("circle").forEach((circle) => {
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
    });
  }
  requestAnimationFrame(updatePacket);
}

function render() {
  const messages = matchingMessages();
  state.activeIndex = Math.min(state.activeIndex, Math.max(0, messages.length - 1));
  svg.classList.toggle("paused", !state.playing);
  playPause.textContent = state.playing ? "Pause" : "Play";
  renderMessages();
  renderPacket();
  renderDetails();
  renderTimeline();
}

requirementFilter.addEventListener("change", () => {
  state.selectedRequirement = requirementFilter.value;
  state.activeIndex = 0;
  state.startedAt = performance.now();
  state.playing = true;
  render();
});

timeline.addEventListener("click", (event) => {
  const item = event.target.closest("[data-index]");
  if (!item) return;
  state.activeIndex = Number(item.dataset.index);
  state.playing = false;
  render();
});

playPause.addEventListener("click", () => {
  state.playing = !state.playing;
  state.startedAt = performance.now() - state.activeIndex * (state.cycleMs / matchingMessages().length);
  render();
});

replay.addEventListener("click", () => {
  state.activeIndex = 0;
  state.playing = true;
  state.startedAt = performance.now();
  render();
});

renderRequirementOptions();
renderLegend();
renderParticipants();
renderTraceGrid();
render();
requestAnimationFrame(updatePacket);
