const systemDetails = {
  governance: {
    title: "Governance System",
    description: "Controls access, policy enforcement, compliance evidence, and auditability across PICKS.",
    subsystems: [
      { name: "Access Control", purpose: "Role-based permissions for users and connected systems." },
      { name: "Security Enforcement", purpose: "TLS, encryption, and protected data exchange." },
      { name: "Compliance Management", purpose: "Compliance evidence, CMMC readiness, and policy checks." },
      { name: "Audit and Traceability", purpose: "Tamper-evident activity records and queryable transaction history." },
      { name: "Policy and Configuration", purpose: "Configurable rules that can evolve by lab, program, or enterprise need." }
    ],
    measures: ["System availability", "Audit response time", "Maximum downtime"]
  },
  lab: {
    title: "Lab / MES System",
    description: "Supports build execution, work orders, component usage, and lab-side traceability.",
    subsystems: [
      { name: "Manufacturing Execution", purpose: "Work orders, build status, routers, and component consumption." },
      { name: "Asset Management", purpose: "Asset status, usage, availability, and repair history." }
    ],
    measures: ["Build traceability coverage", "Work order completion time", "Asset utilization"]
  },
  logistics: {
    title: "Logistics System",
    description: "Handles receiving, inventory updates, warehousing, and material movement.",
    subsystems: [
      { name: "Inventory Management", purpose: "Inventory records, reconciliation, location, and availability." },
      { name: "Receiving", purpose: "Material intake, data capture, and receipt verification." },
      { name: "Warehousing", purpose: "Storage location, order fulfillment, and movement support." }
    ],
    measures: ["Inventory record accuracy", "Receiving cycle time", "Reconciliation time"]
  },
  program: {
    title: "Program Management",
    description: "Maintains planning, configuration, demand, and program-level visibility.",
    subsystems: [
      { name: "Product Lifecycle Management", purpose: "BOMs, configuration baseline, and lifecycle artifacts." },
      { name: "Material Requirements Planning", purpose: "Demand forecasts, shortage awareness, and material planning." }
    ],
    measures: ["Forecast accuracy", "Configuration baseline accuracy", "Report generation time"]
  }
};

const subsystemPanel = document.querySelector("#subsystemPanel");
const triggers = document.querySelectorAll(".system-trigger");

function renderSubsystemPanel(systemKey) {
  const detail = systemDetails[systemKey];

  subsystemPanel.innerHTML = `
    <div class="subsystem-panel-heading">
      <div>
        <p class="eyebrow">Selected System</p>
        <h2>${detail.title}</h2>
        <p>${detail.description}</p>
      </div>
      <div class="mini-pills">${detail.measures.map((measure) => `<span>${measure}</span>`).join("")}</div>
    </div>
    <div class="subsystem-grid">
      ${detail.subsystems.map((subsystem) => `
        <article class="subsystem-card">
          <span>&lt;&lt;subsystem&gt;&gt;</span>
          <strong>${subsystem.name}</strong>
          <p>${subsystem.purpose}</p>
        </article>
      `).join("")}
    </div>
  `;
}

triggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    triggers.forEach((item) => item.classList.toggle("active", item === trigger));
    renderSubsystemPanel(trigger.dataset.system);
  });
});

renderSubsystemPanel("governance");
