const systemDetails = {
  governance: {
    title: "Governance System",
    icon: "fa-shield-halved",
    description: "Checks permissions, applies security rules, supports compliance, and keeps activity history.",
    subsystems: [
      { name: "Access Control", icon: "fa-user-lock", purpose: "Confirms the user is allowed to take the requested action.", interface: "Access decision", data: "User, role, requested action", quality: "Prevents unauthorized changes." },
      { name: "Security Enforcement", icon: "fa-lock", purpose: "Protects information while it moves between systems.", interface: "Protected connection", data: "Login proof, message, connection status", quality: "Protects shared information." },
      { name: "Compliance Management", icon: "fa-clipboard-check", purpose: "Keeps evidence that rules and controls were followed.", interface: "Compliance record", data: "Rule result, control reference", quality: "Supports audit readiness." },
      { name: "Audit and Traceability", icon: "fa-timeline", purpose: "Keeps a reliable record of important actions and system touchpoints.", interface: "Activity log", data: "Transaction ID, systems touched", quality: "Preserves connected history." },
      { name: "Policy and Configuration", icon: "fa-sliders", purpose: "Lets rules change by lab, program, or business need.", interface: "Rules settings", data: "Rule version, lab or program scope", quality: "Keeps rules adaptable." }
    ],
    measures: ["System uptime", "Review response time", "Maximum downtime"],
    interfaces: ["User session", "Connection hub", "Activity history"]
  },
  lab: {
    title: "Lab / MES System",
    icon: "fa-industry",
    description: "Supports build work, work orders, parts used, asset status, and lab history.",
    subsystems: [
      { name: "Manufacturing Execution", icon: "fa-list-check", purpose: "Tracks work orders, build status, steps, and parts used.", interface: "Work-order update", data: "Build ID, work status, parts used", quality: "Improves lab history." },
      { name: "Asset Management", icon: "fa-screwdriver-wrench", purpose: "Tracks asset status, use, availability, and repair history.", interface: "Asset status update", data: "Asset ID, use, repair state", quality: "Improves asset visibility." }
    ],
    measures: ["Build history coverage", "Work order completion time", "Asset use"],
    interfaces: ["Connection hub", "PEDYN lab history", "Inventory records"]
  },
  logistics: {
    title: "Logistics System",
    icon: "fa-warehouse",
    description: "Handles receiving, inventory updates, storage locations, and material movement.",
    subsystems: [
      { name: "Inventory Management", icon: "fa-boxes-stacked", purpose: "Tracks inventory records, location, and availability.", interface: "Inventory update", data: "Part number, quantity, status", quality: "Improves record accuracy." },
      { name: "Receiving", icon: "fa-truck-ramp-box", purpose: "Captures incoming material and verifies receipt details.", interface: "Receiving work process", data: "Purchase order, vendor, receipt status", quality: "Reduces intake delays." },
      { name: "Warehousing", icon: "fa-location-dot", purpose: "Tracks where material is stored and moved.", interface: "Location update", data: "Bin, warehouse, movement event", quality: "Improves material visibility." }
    ],
    measures: ["Inventory record accuracy", "Receiving cycle time", "Reconciliation time"],
    interfaces: ["Oracle ERP", "Connection hub", "Lab / MES"]
  },
  program: {
    title: "Program Management System",
    icon: "fa-diagram-project",
    description: "Maintains planning, product structure, demand, and program-level visibility.",
    subsystems: [
      { name: "Product Lifecycle Management", icon: "fa-code-branch", purpose: "Tracks build lists, versions, and product lifecycle information.", interface: "Product baseline", data: "Build list, revision, lifecycle state", quality: "Keeps product data aligned." },
      { name: "Material Requirements Planning", icon: "fa-chart-line", purpose: "Tracks forecasts, shortages, and material needs.", interface: "Planning data", data: "Forecast, shortage, demand signal", quality: "Improves planning response." }
    ],
    measures: ["Forecast accuracy", "Product data accuracy", "Report generation time"],
    interfaces: ["Workday funding", "Oracle ERP", "Inventory records"]
  },
  external: {
    title: "Connected Systems",
    icon: "fa-plug-circle-bolt",
    description: "Represents outside systems that share finance, purchasing, inventory, and lab history with PICKS.",
    subsystems: [
      { name: "Workday", icon: "fa-coins", purpose: "Provides project and funding context for inventory and purchasing activity.", interface: "Funding information", data: "Project, cost center, funding status", quality: "Keeps material activity aligned to financial controls." },
      { name: "Oracle ERP", icon: "fa-building-columns", purpose: "Provides purchase orders, vendor receipts, parts, and inventory records.", interface: "Purchasing and inventory information", data: "Purchase order, receipt, vendor, item master", quality: "Reduces duplicate entry and reconciliation effort." },
      { name: "PEDYN / Older Lab Tools", icon: "fa-database", purpose: "Provides existing lab records that must remain visible during transition.", interface: "Older lab data adapter", data: "Older part ID, lab status, historical transaction", quality: "Preserves continuity while PICKS modernizes work processes." }
    ],
    measures: ["Exchange success rate", "Data issue count", "Connection speed"],
    interfaces: ["Information examples", "Connection hub", "Activity history"]
  }
};

const subsystemPanel = document.querySelector("#subsystemPanel");
const triggers = document.querySelectorAll(".system-trigger");
const connectorLinks = document.querySelectorAll(".system-link");

function setActiveSystem(systemKey) {
  triggers.forEach((item) => item.classList.toggle("active", item.dataset.system === systemKey));
  connectorLinks.forEach((link) => link.classList.remove("active"));

  const activeLink = document.querySelector(`.${systemKey}-link`);
  if (activeLink) {
    activeLink.classList.add("active");
  }

  if (systemKey !== "external") {
    document.querySelector(".core-link")?.classList.add("active");
  }
}

function renderSubsystemPanel(systemKey) {
  const detail = systemDetails[systemKey];

  subsystemPanel.innerHTML = `
    <div class="subsystem-panel-heading">
      <div>
        <p class="eyebrow">Selected Area</p>
        <h2><i class="fa-solid ${detail.icon}" aria-hidden="true"></i>${detail.title}</h2>
        <p>${detail.description}</p>
      </div>
      <div class="mini-pills">${detail.measures.map((measure) => `<span>${measure}</span>`).join("")}</div>
    </div>
    <div class="interface-strip">
      ${detail.interfaces.map((item) => `<span><i class="fa-solid fa-plug" aria-hidden="true"></i>${item}</span>`).join("")}
    </div>
    <div class="subsystem-grid">
      ${detail.subsystems.map((subsystem, index) => `
        <button class="subsystem-card ${index === 0 ? "active" : ""}" type="button" data-index="${index}">
          <i class="fa-solid ${subsystem.icon}" aria-hidden="true"></i>
          <span>Responsibility</span>
          <strong>${subsystem.name}</strong>
          <p>${subsystem.purpose}</p>
        </button>
      `).join("")}
    </div>
    <div class="subsystem-detail" id="subsystemDetail"></div>
  `;

  const cards = subsystemPanel.querySelectorAll(".subsystem-card");
  const detailPanel = subsystemPanel.querySelector("#subsystemDetail");

  function renderSubsystemDetail(index) {
    const subsystem = detail.subsystems[index];
    detailPanel.innerHTML = `
      <article>
        <span><i class="fa-solid fa-link" aria-hidden="true"></i>How it connects</span>
        <strong>${subsystem.interface}</strong>
      </article>
      <article>
        <span><i class="fa-solid fa-database" aria-hidden="true"></i>Data</span>
        <strong>${subsystem.data}</strong>
      </article>
      <article>
        <span><i class="fa-solid fa-gauge-high" aria-hidden="true"></i>Impact</span>
        <strong>${subsystem.quality}</strong>
      </article>
    `;
    detailPanel.classList.remove("detail-refresh");
    window.requestAnimationFrame(() => {
      detailPanel.classList.add("detail-refresh");
    });
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      cards.forEach((item) => item.classList.toggle("active", item === card));
      renderSubsystemDetail(Number(card.dataset.index));
    });
  });

  renderSubsystemDetail(0);
}

triggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    setActiveSystem(trigger.dataset.system);
    renderSubsystemPanel(trigger.dataset.system);
  });
});

setActiveSystem("governance");
renderSubsystemPanel("governance");
