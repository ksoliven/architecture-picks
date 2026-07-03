const scenarioOptions = {
  enterprise: {
    workday: {
      name: "Workday",
      role: "Primary ERP source",
      color: "#22c55e",
      data: ["procurement status", "financial data", "inventory availability"],
      implication: "Workday becomes the main enterprise source, so Oracle-specific procurement calls are removed from the critical path."
    },
    oracle: {
      name: "Oracle ERP",
      role: "Primary ERP source",
      color: "#06b6d4",
      data: ["purchase orders", "vendor data", "inventory records"],
      implication: "Oracle remains the procurement and inventory source, with Workday limited to financial context."
    }
  },
  integration: {
    mulesoft: {
      name: "MuleSoft",
      role: "Managed iPaaS",
      color: "#f97316",
      strength: "Best fit when enterprise-grade API management, reusable connectors, and governance are the priority."
    },
    boomi: {
      name: "Boomi",
      role: "Low-code iPaaS",
      color: "#f59e0b",
      strength: "Best fit when quick mapping, lower-code integration, and faster workflow prototyping are the priority."
    },
    api: {
      name: "Custom API Gateway",
      role: "PICKS-owned API",
      color: "#334155",
      strength: "Best fit when PICKS needs maximum control, but the team accepts more development and sustainment burden."
    }
  },
  mes: {
    opensource: {
      name: "Open-source MES",
      role: "InvenTree / Odoo style",
      color: "#0f766e",
      implication: "Lower cost and more flexibility, but more customization is needed for RBAC, mappings, and long-term support."
    },
    tulip: {
      name: "Tulip",
      role: "Commercial MES",
      color: "#ef4444",
      implication: "Stronger operator workflow and enterprise usability, but higher cost and vendor dependency."
    }
  }
};

const baseParticipants = [
  { id: "user", name: "User", color: "#d946ef", role: "Requester" },
  { id: "rbac", name: "RBAC / Policies", color: "#14b8a6", role: "Governance" },
  { id: "pedyn", name: "PEDYN Legacy", color: "#8b5cf6", role: "Lab records" }
];

const controls = {
  enterprise: document.querySelector("#enterpriseSelect"),
  integration: document.querySelector("#integrationSelect"),
  mes: document.querySelector("#mesSelect"),
  step: document.querySelector("#scenarioStepSelect"),
  playPause: document.querySelector("#whatifPlayPause"),
  replay: document.querySelector("#whatifReplay")
};

const layers = {
  participants: document.querySelector("#whatifParticipants"),
  messages: document.querySelector("#whatifMessages"),
  packet: document.querySelector("#whatifPacket"),
  legend: document.querySelector("#whatifLegend"),
  summary: document.querySelector("#scenarioSummary"),
  impact: document.querySelector("#impactGrid")
};

const whatifDimensions = {
  top: 44,
  bottom: 710,
  firstX: 130,
  gap: 292,
  boxWidth: 188,
  boxHeight: 82,
  firstMessageY: 158,
  messageGap: 50
};

const whatifState = {
  activeIndex: 0,
  startedAt: performance.now(),
  cycleMs: 12000,
  playing: true,
  renderVersion: 0
};

function currentScenario() {
  return {
    enterpriseKey: controls.enterprise.value,
    integrationKey: controls.integration.value,
    mesKey: controls.mes.value,
    enterprise: scenarioOptions.enterprise[controls.enterprise.value],
    integration: scenarioOptions.integration[controls.integration.value],
    mes: scenarioOptions.mes[controls.mes.value]
  };
}

function scenarioParticipants(scenario) {
  return [
    baseParticipants[0],
    baseParticipants[1],
    { id: "integration", name: scenario.integration.name, color: scenario.integration.color, role: scenario.integration.role },
    { id: "enterprise", name: scenario.enterprise.name, color: scenario.enterprise.color, role: scenario.enterprise.role },
    baseParticipants[2],
    { id: "mes", name: scenario.mes.name, color: scenario.mes.color, role: scenario.mes.role }
  ].map((participant, index) => ({
    ...participant,
    x: whatifDimensions.firstX + index * whatifDimensions.gap
  }));
}

function scenarioMessages(scenario) {
  const enterprisePayload = scenario.enterprise.data.join(", ");
  return [
    {
      from: "user",
      to: "rbac",
      label: "Request Action",
      direction: "request",
      note: "Same as baseline: user intent is checked before data moves.",
      requirements: ["3.4.1", "SYS-6.5"]
    },
    {
      from: "rbac",
      to: "user",
      label: "Authorization Granted",
      direction: "response",
      note: "Same as baseline: RBAC returns the access decision before the request is submitted.",
      requirements: ["3.4.1", "5.6.2.1"]
    },
    {
      from: "user",
      to: "integration",
      label: "Submit Request",
      direction: "request",
      note: `${scenario.integration.name} receives only authorized transactions.`,
      requirements: ["SYS-6.1", "SYS-7.1"]
    },
    {
      from: "integration",
      to: "enterprise",
      label: "Request ERP Data",
      direction: "request",
      note: `The enterprise call now targets ${scenario.enterprise.name} for ${enterprisePayload}.`,
      requirements: ["SYS-6.1", "SYS-6.2", "5.2.1"]
    },
    {
      from: "enterprise",
      to: "integration",
      label: "Procurement and Inventory Data",
      direction: "response",
      note: `${scenario.enterprise.name} returns mapped enterprise records for PICKS.`,
      requirements: ["SYS-6.2", "5.3.1.1"]
    },
    {
      from: "integration",
      to: "pedyn",
      label: "Request Legacy Data",
      direction: "request",
      note: "PEDYN remains in the architecture for existing lab history and traceability.",
      requirements: ["3.3.4", "5.2.1"]
    },
    {
      from: "pedyn",
      to: "integration",
      label: "Existing Lab Data",
      direction: "response",
      note: "Legacy records are normalized before the MES update.",
      requirements: ["3.3.4", "5.3.1.1"]
    },
    {
      from: "integration",
      to: "mes",
      label: "Create or Update Record",
      direction: "request",
      note: `${scenario.integration.name} maps enterprise and legacy fields into the ${scenario.mes.name} target model.`,
      requirements: ["SYS-6.3", "5.4.1.1", "3.3.4"]
    },
    {
      from: "mes",
      to: "integration",
      label: "Status Confirmation",
      direction: "response",
      note: `${scenario.mes.name} confirms record creation, update, or synchronization failure.`,
      requirements: ["SYS-6.3", "SYS-6.4"]
    },
    {
      from: "integration",
      to: "rbac",
      label: "Log Activity",
      direction: "request",
      note: "Governance records the systems touched, user, timestamp, and result.",
      requirements: ["5.6.2.1", "SYS-6.5"]
    }
  ];
}

function makeSvg(tag, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function splitLabel(label, maxLength = 18) {
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

function appendSvgLines(text, lines, x, y, lineHeight) {
  lines.forEach((line, index) => {
    const tspan = makeSvg("tspan", { x, y: y + index * lineHeight });
    tspan.textContent = line;
    text.appendChild(tspan);
  });
}

function renderParticipantBox(participant, y) {
  const group = makeSvg("g", {
    class: "participant",
    transform: `translate(${participant.x - whatifDimensions.boxWidth / 2} ${y})`
  });
  const rect = makeSvg("rect", {
    width: whatifDimensions.boxWidth,
    height: whatifDimensions.boxHeight,
    rx: 8,
    class: "participant-box",
    style: `--participant-color:${participant.color}`
  });
  const title = makeSvg("text", {
    x: whatifDimensions.boxWidth / 2,
    y: 0,
    "text-anchor": "middle",
    class: "participant-name"
  });
  const titleLines = splitLabel(participant.name, 16);
  appendSvgLines(title, titleLines, whatifDimensions.boxWidth / 2, titleLines.length > 1 ? 28 : 36, 18);
  const role = makeSvg("text", {
    x: whatifDimensions.boxWidth / 2,
    y: titleLines.length > 1 ? 66 : 60,
    "text-anchor": "middle",
    class: "participant-role"
  });
  role.textContent = participant.role;
  group.append(rect, title, role);
  return group;
}

function renderScenario() {
  const scenario = currentScenario();
  const participants = scenarioParticipants(scenario);
  const participantsById = Object.fromEntries(participants.map((participant) => [participant.id, participant]));
  const messages = scenarioMessages(scenario);

  whatifState.activeIndex = Math.min(whatifState.activeIndex, messages.length - 1);
  whatifState.renderVersion += 1;
  controls.playPause.textContent = whatifState.playing ? "Pause" : "Play";
  renderSummary(scenario);
  renderLegend(participants);
  renderStepOptions(messages);
  renderParticipants(participants);
  renderMessages(messages, participantsById);
  renderPacket(messages, participantsById);
  renderImpact(scenario);
}

function renderSummary(scenario) {
  layers.summary.innerHTML = `
    <article class="scenario-card">
      <span class="scenario-label">Enterprise source</span>
      <strong>${scenario.enterprise.name}</strong>
      <p>${scenario.enterprise.implication}</p>
    </article>
    <article class="scenario-card">
      <span class="scenario-label">Integration layer</span>
      <strong>${scenario.integration.name}</strong>
      <p>${scenario.integration.strength}</p>
    </article>
    <article class="scenario-card">
      <span class="scenario-label">MES option</span>
      <strong>${scenario.mes.name}</strong>
      <p>${scenario.mes.implication}</p>
    </article>
  `;
}

function renderLegend(participants) {
  layers.legend.innerHTML = participants.map((participant) => `
    <span class="legend-item">
      <span class="legend-swatch" style="--legend-color:${participant.color}"></span>
      ${participant.name}
    </span>
  `).join("");
}

function renderStepOptions(messages) {
  controls.step.innerHTML = messages.map((message, index) => {
    const selected = index === whatifState.activeIndex ? "selected" : "";
    return `<option value="${index}" ${selected}>${index + 1}. ${message.label}</option>`;
  }).join("");
}

function renderParticipants(participants) {
  layers.participants.innerHTML = "";
  participants.forEach((participant) => {
    const topBox = renderParticipantBox(participant, whatifDimensions.top);
    const line = makeSvg("line", {
      x1: participant.x,
      x2: participant.x,
      y1: whatifDimensions.top + whatifDimensions.boxHeight,
      y2: whatifDimensions.bottom,
      class: "lifeline"
    });
    const bottomBox = renderParticipantBox(participant, whatifDimensions.bottom);
    layers.participants.append(topBox, line, bottomBox);
  });
}

function renderMessages(messages, participantsById) {
  layers.messages.innerHTML = "";
  messages.forEach((message, index) => {
    const from = participantsById[message.from];
    const to = participantsById[message.to];
    const y = whatifDimensions.firstMessageY + index * whatifDimensions.messageGap;
    const startX = from.x + (to.x > from.x ? 12 : -12);
    const endX = to.x + (to.x > from.x ? -16 : 16);
    const active = index === whatifState.activeIndex;
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
      "marker-end": "url(#whatifArrowHead)"
    });
    const label = makeSvg("text", {
      x: (startX + endX) / 2,
      y: y - 12,
      "text-anchor": "middle",
      class: "message-label"
    });
    const lines = splitLabel(message.label, 24);
    appendSvgLines(label, lines, (startX + endX) / 2, y - (lines.length > 1 ? 24 : 12), 17);
    group.addEventListener("click", () => {
      whatifState.activeIndex = index;
      whatifState.startedAt = performance.now();
      renderScenario();
    });
    group.append(line, label);
    layers.messages.appendChild(group);
  });
}

function renderPacket(messages, participantsById) {
  layers.packet.innerHTML = "";
  const message = messages[whatifState.activeIndex];
  const from = participantsById[message.from];
  const y = whatifDimensions.firstMessageY + whatifState.activeIndex * whatifDimensions.messageGap;
  const group = makeSvg("g", { class: `data-packet ${message.direction}` });
  const circle = makeSvg("circle", {
    cx: from.x,
    cy: y,
    r: 13,
    fill: message.direction === "response" ? "#0f766e" : "#b45309"
  });
  const dot = makeSvg("circle", { cx: from.x, cy: y, r: 5, fill: "#ffffff" });
  group.append(circle, dot);
  layers.packet.appendChild(group);
}

function renderImpact(scenario) {
  const messages = scenarioMessages(scenario);
  layers.impact.innerHTML = messages.map((message, index) => `
    <article class="impact-card ${index === whatifState.activeIndex ? "active" : ""}">
      <strong>${index + 1}. ${message.label}</strong>
      <p>${message.note}</p>
      <div class="mini-pills">${message.requirements.map((requirement) => `<span>${requirement}</span>`).join("")}</div>
    </article>
  `).join("");
}

function animatePacket(now) {
  const scenario = currentScenario();
  const participants = scenarioParticipants(scenario);
  const participantsById = Object.fromEntries(participants.map((participant) => [participant.id, participant]));
  const messages = scenarioMessages(scenario);
  const renderVersion = whatifState.renderVersion;
  const stepMs = whatifState.cycleMs / messages.length;
  const elapsed = whatifState.playing
    ? (now - whatifState.startedAt) % whatifState.cycleMs
    : whatifState.activeIndex * stepMs + stepMs * 0.5;
  const nextIndex = Math.floor(elapsed / stepMs);

  if (whatifState.playing && nextIndex !== whatifState.activeIndex) {
    whatifState.activeIndex = nextIndex;
    renderScenario();
  }

  if (renderVersion !== whatifState.renderVersion) {
    requestAnimationFrame(animatePacket);
    return;
  }

  const message = messages[whatifState.activeIndex];
  const from = participantsById[message.from];
  const to = participantsById[message.to];
  const y = whatifDimensions.firstMessageY + whatifState.activeIndex * whatifDimensions.messageGap;
  const progress = (elapsed % stepMs) / stepMs;
  const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  const x = from.x + (to.x - from.x) * eased;
  const packet = layers.packet.querySelector(".data-packet");

  if (packet) {
    packet.querySelectorAll("circle").forEach((circle) => {
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
    });
  }

  requestAnimationFrame(animatePacket);
}

function restartScenario() {
  whatifState.activeIndex = 0;
  whatifState.playing = true;
  whatifState.startedAt = performance.now();
  renderScenario();
}

[controls.enterprise, controls.integration, controls.mes].forEach((control) => {
  control.addEventListener("change", restartScenario);
});

controls.step.addEventListener("change", () => {
  whatifState.activeIndex = Number(controls.step.value);
  whatifState.playing = false;
  whatifState.startedAt = performance.now() - whatifState.activeIndex * (whatifState.cycleMs / scenarioMessages(currentScenario()).length);
  renderScenario();
});

controls.playPause.addEventListener("click", () => {
  whatifState.playing = !whatifState.playing;
  whatifState.startedAt = performance.now() - whatifState.activeIndex * (whatifState.cycleMs / scenarioMessages(currentScenario()).length);
  renderScenario();
});

controls.replay.addEventListener("click", () => {
  restartScenario();
});

renderScenario();
requestAnimationFrame(animatePacket);
