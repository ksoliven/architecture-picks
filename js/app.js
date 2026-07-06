const architecture = {
  participants: [
    { id: "user", name: "User", color: "#b3a369", role: "Requester" },
    { id: "rbac", name: "Access Rules", color: "#003057", role: "Approves actions" },
    { id: "integration", name: "Integration Layer", color: "#004f9f", role: "Routes information" },
    { id: "oracle", name: "Oracle ERP", color: "#857437", role: "Purchasing" },
    { id: "workday", name: "Workday", color: "#4b5563", role: "Finance" },
    { id: "pedyn", name: "PEDYN Lab History", color: "#64748b", role: "Older lab records" },
    { id: "mes", name: "Future MES Candidate", color: "#0f766e", role: "Lab execution" }
  ],
  requirements: [
    { id: "SYS-6.1", title: "Share information across systems", description: "PICKS needs to move useful information between ERP, Workday, inventory, and lab systems." },
    { id: "SYS-6.2", title: "Find purchasing and inventory data", description: "PICKS needs to pull part, asset, purchasing, and inventory information from the ERP." },
    { id: "SYS-6.3", title: "Keep inventory status aligned", description: "PICKS needs connected systems to agree on item availability and asset status." },
    { id: "SYS-6.4", title: "Keep working during outages", description: "PICKS should continue the work process when another system is temporarily unavailable." },
    { id: "SYS-6.5", title: "Protect shared information", description: "PICKS must protect information as it moves between people and systems." },
    { id: "SYS-7.1", title: "Guide the user", description: "PICKS should help users understand what to do during the work process." },
    { id: "3.4.1", title: "Check permission first", description: "PICKS should prevent users from making changes they are not allowed to make." },
    { id: "5.6.2.1", title: "Keep an activity record", description: "PICKS should record important activity for review, troubleshooting, and compliance evidence." },
    { id: "5.2.1", title: "Bring in outside data", description: "PICKS should be able to use information from connected systems." },
    { id: "5.3.1.1", title: "Translate data between systems", description: "PICKS should turn outside data into a format the receiving system can use." },
    { id: "5.4.1.1", title: "Support receiving work", description: "PICKS should use connected information to support receiving and inventory updates." },
    { id: "3.3.4", title: "Keep part history connected", description: "PICKS should keep part, project, and lab history connected across systems." }
  ],
  messages: [
    {
      id: "request-action",
      from: "user",
      to: "rbac",
      label: "Ask to Take Action",
      direction: "request",
      payload: ["User identity", "Requested action", "Target system"],
      requirements: ["3.4.1", "SYS-6.5"],
      description: "A user starts a task, and PICKS checks the action before ERP, Workday, or lab information is accessed."
    },
    {
      id: "authorization-granted",
      from: "rbac",
      to: "user",
      label: "Approve or Block Action",
      direction: "response",
      payload: ["User role", "Allowed action", "Decision"],
      requirements: ["3.4.1", "5.6.2.1"],
      description: "PICKS returns a clear yes or no decision and keeps that decision for later review."
    },
    {
      id: "submit-request",
      from: "user",
      to: "integration",
      label: "Send Approved Request",
      direction: "request",
      payload: ["Approved request", "Part number", "Build or work context"],
      requirements: ["SYS-6.1", "SYS-7.1"],
      description: "The approved request goes to the integration layer so PICKS can gather the right supporting information."
    },
    {
      id: "request-erp-data",
      from: "integration",
      to: "oracle",
      label: "Ask for Purchasing Data",
      direction: "request",
      payload: ["Purchasing lookup", "Inventory lookup", "Asset identifier"],
      requirements: ["SYS-6.1", "SYS-6.2", "5.2.1"],
      description: "The integration layer asks Oracle ERP for purchasing, inventory, and asset information."
    },
    {
      id: "erp-data",
      from: "oracle",
      to: "integration",
      label: "Return Purchasing Data",
      direction: "response",
      payload: ["Purchase order", "Vendor", "Part number", "Quantity", "Inventory status"],
      requirements: ["SYS-6.2", "5.2.1", "5.3.1.1"],
      description: "Oracle returns purchasing and inventory details that PICKS can use in the work process."
    },
    {
      id: "request-financial-data",
      from: "integration",
      to: "workday",
      label: "Ask for Funding Data",
      direction: "request",
      payload: ["Project account", "Cost object", "Funding reference"],
      requirements: ["SYS-6.1", "5.2.1"],
      description: "The integration layer asks Workday for project and funding context."
    },
    {
      id: "financial-data",
      from: "workday",
      to: "integration",
      label: "Return Funding Data",
      direction: "response",
      payload: ["Funding status", "Financial reference", "Project cost data"],
      requirements: ["SYS-6.1", "5.2.1", "5.3.1.1"],
      description: "Workday returns funding information so the request has the right business context."
    },
    {
      id: "request-legacy-data",
      from: "integration",
      to: "pedyn",
      label: "Ask for Existing Lab Data",
      direction: "request",
      payload: ["Part number", "Build identifier", "Lab record lookup"],
      requirements: ["SYS-6.1", "3.3.4", "5.2.1"],
      description: "The integration layer asks PEDYN for older lab records that may still matter."
    },
    {
      id: "legacy-data",
      from: "pedyn",
      to: "integration",
      label: "Return Existing Lab Data",
      direction: "response",
      payload: ["Older part record", "Build history", "Lab status"],
      requirements: ["3.3.4", "5.2.1", "5.3.1.1"],
      description: "PEDYN returns existing lab history so PICKS can keep older records connected."
    },
    {
      id: "create-update-record",
      from: "integration",
      to: "mes",
      label: "Create or Update Lab Record",
      direction: "request",
      payload: ["Item record", "Inventory update", "Work status", "History link"],
      requirements: ["SYS-6.3", "5.4.1.1", "3.3.4"],
      description: "The integration layer creates or updates a MES lab record using the information gathered from other systems."
    },
    {
      id: "status-confirmation",
      from: "mes",
      to: "integration",
      label: "Confirm Update Status",
      direction: "response",
      payload: ["Update result", "MES record ID", "Sharing status"],
      requirements: ["SYS-6.3", "SYS-6.4", "5.6.2.1"],
      description: "The future MES candidate confirms whether the record was created or updated."
    },
    {
      id: "log-activity",
      from: "integration",
      to: "rbac",
      label: "Record What Happened",
      direction: "request",
      payload: ["Transaction ID", "User", "Systems touched", "Timestamp", "Decision outcome"],
      requirements: ["5.6.2.1", "SYS-6.5"],
      description: "PICKS records what happened, who was involved, and which systems were touched."
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
const detailsPanel = document.querySelector(".details-panel");
const stepCount = document.querySelector("#stepCount");
const stepTitle = document.querySelector("#stepTitle");
const stepRoute = document.querySelector("#stepRoute");
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

function initializeRequirementChoices() {
  if (typeof Choices === "undefined") return;

  try {
    new Choices(requirementFilter, {
      allowHTML: false,
      itemSelectText: "",
      searchEnabled: true,
      searchPlaceholderValue: "Find a focus area",
      shouldSort: false
    });
  } catch (error) {
    console.warn("Choices.js could not initialize for the focus area filter.", error);
  }
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
      y: y + 20,
      "text-anchor": "middle",
      class: "message-label"
    });
    const labelLines = splitLabel(message.label, 24);
    appendMessageLabel(text, labelLines, (startX + endX) / 2, y + (labelLines.length > 1 ? 18 : 20), 15);
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
  const messages = matchingMessages();
  const messageIndex = messages.indexOf(message);
  const from = participantById[message.from].name;
  const to = participantById[message.to].name;
  detailsPanel.scrollTop = 0;
  stepCount.textContent = `Step ${messageIndex + 1} of ${messages.length}`;
  stepTitle.textContent = message.label;
  stepRoute.textContent = `${from} to ${to}`;
  stepDescription.textContent = message.description;
  payloadList.innerHTML = message.payload.map((item) => `<span class="pill">${item}</span>`).join("");
  requirementList.innerHTML = message.requirements.map((id) => {
    const requirement = requirementById[id];
    return `
      <article class="requirement-card">
        <span class="requirement-id">${id}</span>
        <strong>${requirement.title}</strong>
        <p>${requirement.description}</p>
      </article>
    `;
  }).join("");
}

function renderTimeline() {
  const messages = matchingMessages();
  timeline.innerHTML = messages.map((message, index) => {
    const active = index === state.activeIndex % messages.length;
    const from = participantById[message.from].name;
    const to = participantById[message.to].name;
    const requirements = message.requirements
      .map((id) => `<span title="${requirementById[id].title}">${id}</span>`)
      .join("");
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
        <span class="requirement-id">${requirement.id}</span>
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
  playPause.innerHTML = state.playing
    ? '<i class="fa-solid fa-pause" aria-hidden="true"></i>Pause'
    : '<i class="fa-solid fa-play" aria-hidden="true"></i>Play';
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
initializeRequirementChoices();
renderLegend();
renderParticipants();
renderTraceGrid();
render();
requestAnimationFrame(updatePacket);
