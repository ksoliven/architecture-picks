const tradeStudies = {
  erp: {
    label: "ERP",
    eyebrow: "ERP Direction",
    title: "Oracle ERP Candidates",
    recommendation: "Current direction: Oracle ecosystem",
    criteria: [
      "Procurement Management",
      "Supply Chain Management",
      "Manufacturing Support",
      "Integration Capability",
      "Security / RBAC",
      "Auditability",
      "Reporting & Analytics",
      "Scalability",
      "Implementation Complexity",
      "Cost"
    ],
    options: [
      {
        name: "Oracle NetSuite",
        type: "Lower complexity ERP candidate",
        summary: "Better fit when lower implementation complexity and cost control are prioritized.",
        ratings: ["Strong", "Moderate", "Moderate", "Strong", "Strong", "Strong", "Strong", "Strong", "Lower", "Lower"]
      },
      {
        name: "Oracle Fusion",
        type: "Enterprise-scale ERP candidate",
        summary: "Better fit when scalability, supply chain strength, analytics, and enterprise maturity are prioritized.",
        ratings: ["Very Strong", "Very Strong", "Strong", "Strong", "Strong", "Strong", "Very Strong", "Very Strong", "Higher", "Higher"]
      }
    ]
  },
  mes: {
    label: "MES",
    eyebrow: "MES Direction",
    title: "MES Candidate Comparison",
    recommendation: "Shortlist: InvenTree/open source, Tulip, Oracle Manufacturing Cloud",
    criteria: [
      "Oracle Integration",
      "Inventory Management",
      "BOM Management",
      "Traceability",
      "Asset Tracking",
      "RBAC Support",
      "Legacy Data Integration",
      "Cost",
      "Implementation Complexity"
    ],
    options: [
      {
        name: "InvenTree",
        type: "Open-source MES candidate",
        summary: "Low cost and low complexity with strong inventory, BOM, and traceability support.",
        ratings: ["Good", "Strong", "Strong", "Strong", "Strong", "Native", "Good", "Low", "Low"]
      },
      {
        name: "Odoo Manufacturing",
        type: "Open-source / modular suite",
        summary: "Balanced option with strong inventory and BOM support, but broader suite fit must be validated.",
        ratings: ["Good", "Strong", "Strong", "Strong", "Strong", "Native", "Good", "Medium", "Medium"]
      },
      {
        name: "Ignition MES",
        type: "Commercial MES",
        summary: "Strong integration and traceability, but higher cost and implementation complexity.",
        ratings: ["Very Good", "Moderate", "Moderate", "Strong", "Strong", "Enterprise", "Very Good", "High", "High"]
      },
      {
        name: "Tulip",
        type: "Commercial frontline operations platform",
        summary: "Strong integration and operator workflow potential with medium implementation complexity.",
        ratings: ["Very Good", "Moderate", "Moderate", "Strong", "Moderate", "Enterprise", "Good", "High", "Medium"]
      },
      {
        name: "Oracle Manufacturing Cloud",
        type: "Oracle-native MES direction",
        summary: "Native Oracle alignment and strong capability, but highest cost profile.",
        ratings: ["Native", "Strong", "Strong", "Strong", "Strong", "Enterprise", "Moderate", "Very High", "High"]
      }
    ]
  },
  integration: {
    label: "Integration Layer",
    eyebrow: "Integration Layer",
    title: "Boomi vs MuleSoft vs Custom API",
    recommendation: "Decision driver: governance, speed, sustainment burden",
    criteria: [
      "Enterprise Governance",
      "Connector Ecosystem",
      "Implementation Speed",
      "Field Mapping",
      "Security Controls",
      "Customization Control",
      "Sustainment Burden",
      "Cost"
    ],
    options: [
      {
        name: "MuleSoft",
        type: "Managed iPaaS",
        summary: "Best fit when enterprise API governance, reusable connectors, and long-term integration management are the priority.",
        ratings: ["Very Strong", "Very Strong", "Medium", "Strong", "Very Strong", "Medium", "Medium", "High"]
      },
      {
        name: "Boomi",
        type: "Low-code iPaaS",
        summary: "Best fit when quick mapping, low-code integration, and faster workflow prototyping are the priority.",
        ratings: ["Strong", "Strong", "Very High", "Very Strong", "Strong", "Medium", "Low", "Medium"]
      },
      {
        name: "Custom API Gateway",
        type: "PICKS-owned API",
        summary: "Best fit when maximum implementation control is needed and the team can absorb development and sustainment effort.",
        ratings: ["Medium", "Medium", "Medium", "Medium", "Strong", "Very Strong", "High", "Low"]
      }
    ]
  }
};

const priorityProfiles = {
  balanced: {
    label: "Balanced",
    weights: {}
  },
  mvp: {
    label: "MVP speed / low disruption",
    weights: {
      "Implementation Complexity": 1.6,
      "Implementation Speed": 1.8,
      "Field Mapping": 1.4,
      "Sustainment Burden": 1.4,
      "Cost": 1.3
    }
  },
  enterprise: {
    label: "Enterprise governance",
    weights: {
      "Enterprise Governance": 1.8,
      "Security / RBAC": 1.5,
      "Security Controls": 1.7,
      "Auditability": 1.5,
      "Scalability": 1.4,
      "Integration Capability": 1.3,
      "Oracle Integration": 1.3
    }
  },
  traceability: {
    label: "Traceability / inventory",
    weights: {
      "Traceability": 1.8,
      "Inventory Management": 1.6,
      "BOM Management": 1.4,
      "Asset Tracking": 1.4,
      "Legacy Data Integration": 1.3,
      "Auditability": 1.4
    }
  }
};

const scoreMap = {
  "Native": 5,
  "Very Strong": 5,
  "Very High": 5,
  "Strong": 4,
  "Very Good": 4,
  "Good": 3,
  "Enterprise": 4,
  "Medium": 3,
  "Moderate": 2,
  "Low": 5,
  "Lower": 5,
  "High": 2,
  "Higher": 2,
  "Very High": 5
};

const inverseCriteria = new Set(["Cost", "Implementation Complexity", "Sustainment Burden"]);

const categorySelect = document.querySelector("#tradeCategory");
const prioritySelect = document.querySelector("#tradePriority");
const winner = document.querySelector("#tradeWinner");
const table = document.querySelector("#tradeTable");
const profiles = document.querySelector("#tradeProfiles");
const eyebrow = document.querySelector("#tradeEyebrow");
const title = document.querySelector("#tradeTitle");
const recommendation = document.querySelector("#tradeRecommendation");

function ratingScore(criteria, rating) {
  const base = scoreMap[rating] ?? 3;
  return inverseCriteria.has(criteria) ? 6 - base : base;
}

function optionScore(study, option, priorityKey) {
  const profile = priorityProfiles[priorityKey];
  let weightedScore = 0;
  let totalWeight = 0;

  study.criteria.forEach((criteria, index) => {
    const weight = profile.weights[criteria] ?? 1;
    weightedScore += ratingScore(criteria, option.ratings[index]) * weight;
    totalWeight += weight;
  });

  return Math.round((weightedScore / totalWeight) * 20);
}

function rankedOptions(study, priorityKey) {
  return study.options
    .map((option) => ({ ...option, score: optionScore(study, option, priorityKey) }))
    .sort((a, b) => b.score - a.score);
}

function renderControls() {
  categorySelect.innerHTML = Object.entries(tradeStudies)
    .map(([key, study]) => `<option value="${key}">${study.label}</option>`)
    .join("");

  prioritySelect.innerHTML = Object.entries(priorityProfiles)
    .map(([key, profile]) => `<option value="${key}">${profile.label}</option>`)
    .join("");
}

function renderTradeStudy() {
  const study = tradeStudies[categorySelect.value];
  const priorityKey = prioritySelect.value;
  const ranked = rankedOptions(study, priorityKey);
  const top = ranked[0];

  eyebrow.textContent = study.eyebrow;
  title.textContent = study.title;
  recommendation.textContent = study.recommendation;

  winner.innerHTML = `
    <span>Current top fit</span>
    <strong>${top.name}</strong>
    <p>${top.score}/100 using ${priorityProfiles[priorityKey].label.toLowerCase()} weighting</p>
  `;

  table.innerHTML = `
    <table class="trade-table dynamic-trade-table">
      <thead>
        <tr>
          <th>Criteria</th>
          ${study.options.map((option) => `<th>${option.name}<span>${optionScore(study, option, priorityKey)}/100</span></th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${study.criteria.map((criteria, index) => `
          <tr>
            <td>${criteria}</td>
            ${study.options.map((option) => {
              const score = ratingScore(criteria, option.ratings[index]);
              return `<td class="${score >= 4 ? "score-high" : ""}">${option.ratings[index]}</td>`;
            }).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  profiles.innerHTML = ranked.map((option, index) => `
    <article class="dynamic-option ${index === 0 ? "top-option" : ""}">
      <span>${option.type}</span>
      <h3>${option.name}</h3>
      <div class="score-bar" style="--score:${option.score}%"><i></i></div>
      <strong>${option.score}/100</strong>
      <p>${option.summary}</p>
    </article>
  `).join("");
}

categorySelect.addEventListener("change", renderTradeStudy);
prioritySelect.addEventListener("change", renderTradeStudy);

renderControls();
renderTradeStudy();
