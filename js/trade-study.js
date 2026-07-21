const tradeStudies = {
  erp: {
    label: "ERP",
    eyebrow: "ERP Direction",
    title: "Oracle ERP Options",
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
        type: "Lower-complexity ERP option",
        summary: "Better fit when lower setup complexity and cost control matter most, while still covering production, inventory, supply chain, and purchasing needs.",
        ratings: ["Strong", "Moderate", "Moderate", "Strong", "Strong", "Strong", "Strong", "Strong", "Lower", "Lower"],
        sourceUrl: "https://www.netsuite.com/portal/products/erp.shtml",
        sourceLabel: "NetSuite product page"
      },
      {
        name: "Oracle Fusion",
        type: "Larger enterprise ERP option",
        summary: "Better fit when growth capacity, supply chain strength, analytics, and maturity matter most.",
        ratings: ["Very Strong", "Very Strong", "Strong", "Strong", "Strong", "Strong", "Very Strong", "Very Strong", "Higher", "Higher"],
        sourceUrl: "https://www.oracle.com/scm/",
        sourceLabel: "Oracle SCM"
      }
    ]
  },
  mes: {
    label: "MES",
    eyebrow: "MES Direction",
    title: "MES Options",
    recommendation: "Client feedback ranking: Tulip first, Odoo second, do not advance InvenTree",
    criteria: [
      "FedRAMP / Security Fit",
      "Workday Integration",
      "Systems Integration",
      "Inventory Management",
      "BOM Management",
      "History Tracking",
      "Asset Tracking",
      "Access Control",
      "Older Data Support",
      "Cost",
      "Setup Complexity"
    ],
    options: [
      {
        name: "Tulip",
        type: "Recommended MES solution",
        summary: "Client feedback favors Tulip because it has validated FedRAMP status and appears able to integrate with other systems, including Workday, with some implementation effort.",
        ratings: ["Very Strong", "Strong", "Very Strong", "Good", "Good", "Strong", "Good", "Advanced", "Strong", "High", "Medium"],
        sourceUrl: "https://tulip.co/platform/security/",
        sourceLabel: "Tulip Security"
      },
      {
        name: "Odoo Manufacturing",
        type: "Strong alternative MES candidate",
        summary: "Client feedback places Odoo second because it appears to have better Workday and systems integration than other open-source options. It lacks FedRAMP authorization, but an on-prem option may reduce deployment risk.",
        ratings: ["Moderate", "Very Good", "Strong", "Strong", "Strong", "Strong", "Good", "Advanced", "Good", "Medium", "Medium"],
        sourceUrl: "https://www.odoo.com/app/inventory",
        sourceLabel: "Odoo Inventory"
      },
      {
        name: "InvenTree",
        type: "Not recommended for next phase",
        summary: "Client feedback does not identify enough additional value beyond current tools. InvenTree appears to have less mature integration mapping and the least desirable security posture for supported projects.",
        ratings: ["Weak", "Limited", "Limited", "Strong", "Strong", "Strong", "Good", "Moderate", "Limited", "Low", "High"],
        sourceUrl: "https://docs.inventree.org/en/latest/",
        sourceLabel: "InvenTree docs"
      }
    ]
  },
  integration: {
    label: "Integration Layer",
    eyebrow: "Integration Layer",
    title: "Boomi vs MuleSoft vs Custom Build",
    recommendation: "Decision driver: oversight, speed, and upkeep",
    criteria: [
      "Oversight",
      "Ready-made Connections",
      "Setup Speed",
      "Data Matching",
      "Security Controls",
      "Customization Control",
      "Upkeep Burden",
      "Cost"
    ],
    options: [
      {
        name: "MuleSoft",
        type: "Managed connection platform",
        summary: "Best fit when strong oversight, reusable connections, and long-term management are the priority.",
        ratings: ["Very Strong", "Very Strong", "Medium", "Strong", "Very Strong", "Medium", "Medium", "High"],
        sourceUrl: "https://www.mulesoft.com/platform/api/manager",
        sourceLabel: "MuleSoft platform"
      },
      {
        name: "Boomi",
        type: "Low-code connection platform",
        summary: "Best fit when quick data matching, broad connection coverage, and faster work-process testing are the priority.",
        ratings: ["Very Strong", "Very Strong", "Very High", "Very Strong", "Strong", "Medium", "Low", "Medium"],
        sourceUrl: "https://boomi.com/",
        sourceLabel: "Boomi platform"
      },
      {
        name: "Custom API Gateway",
        type: "PICKS-owned API",
        summary: "Best fit when maximum control is needed and the team can absorb extra build and upkeep effort.",
        ratings: ["Medium", "Medium", "Medium", "Medium", "Strong", "Very Strong", "High", "Low"],
        sourceUrl: "../data-payloads/",
        sourceLabel: "PICKS information examples"
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
    label: "First version / low disruption",
    weights: {
      "Setup Complexity": 1.6,
      "Setup Speed": 1.8,
      "Data Matching": 1.4,
      "Upkeep Burden": 1.4,
      "Cost": 1.3
    }
  },
  enterprise: {
    label: "Oversight and security",
    weights: {
      "Oversight": 1.8,
      "FedRAMP / Security Fit": 1.9,
      "Access Control": 1.5,
      "Security Controls": 1.7,
      "Auditability": 1.5,
      "Scalability": 1.4,
      "Integration Capability": 1.3,
      "Oracle Connection": 1.3,
      "Workday Integration": 1.4,
      "Systems Integration": 1.3
    }
  },
  traceability: {
    label: "Inventory and history",
    weights: {
      "History Tracking": 1.8,
      "Inventory Management": 1.6,
      "BOM Management": 1.4,
      "Asset Tracking": 1.4,
      "Older Data Support": 1.3,
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
  "Advanced": 4,
  "Medium": 3,
  "Moderate": 2,
  "Limited": 2,
  "Weak": 1,
  "Low": 5,
  "Lower": 5,
  "High": 2,
  "Higher": 2,
  "Very High": 5
};

const inverseScoreMap = {
  "Low": 5,
  "Lower": 5,
  "Medium": 3,
  "Moderate": 3,
  "High": 2,
  "Higher": 2,
  "Very High": 1
};

const inverseCriteria = new Set(["Cost", "Setup Complexity", "Upkeep Burden"]);

const categorySelect = document.querySelector("#tradeCategory");
const prioritySelect = document.querySelector("#tradePriority");
const winner = document.querySelector("#tradeWinner");
const table = document.querySelector("#tradeTable");
const profiles = document.querySelector("#tradeProfiles");
const eyebrow = document.querySelector("#tradeEyebrow");
const title = document.querySelector("#tradeTitle");
const recommendation = document.querySelector("#tradeRecommendation");
const scoreChart = document.querySelector("#tradeScoreChart");
const weightList = document.querySelector("#tradeWeightList");
const tradeChoiceControls = {};

function ratingScore(criteria, rating) {
  if (inverseCriteria.has(criteria)) {
    return inverseScoreMap[rating] ?? 3;
  }

  return scoreMap[rating] ?? 3;
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

function optionStrengths(study, option) {
  return study.criteria
    .map((criteria, index) => ({
      criteria,
      rating: option.ratings[index],
      score: ratingScore(criteria, option.ratings[index])
    }))
    .filter((item) => item.score >= 4)
    .slice(0, 3);
}

function optionRisks(study, option) {
  return study.criteria
    .map((criteria, index) => ({
      criteria,
      rating: option.ratings[index],
      score: ratingScore(criteria, option.ratings[index])
    }))
    .filter((item) => item.score <= 2)
    .slice(0, 3);
}

function shouldHighlightRating(study, criteria, rating, optionIndex) {
  if (study.label === "ERP") {
    const criteriaIndex = study.criteria.indexOf(criteria);
    const scores = study.options.map((option) => ratingScore(criteria, option.ratings[criteriaIndex]));
    const maxScore = Math.max(...scores);
    return scores[optionIndex] === maxScore;
  }

  return ratingScore(criteria, rating) >= 4;
}

function weightedCriteria(study, priorityKey) {
  const weights = priorityProfiles[priorityKey].weights;
  return study.criteria
    .map((criteria) => ({ criteria, weight: weights[criteria] ?? 1 }))
    .filter((item) => item.weight > 1)
    .sort((a, b) => b.weight - a.weight);
}

function renderControls() {
  categorySelect.innerHTML = Object.entries(tradeStudies)
    .map(([key, study]) => `<option value="${key}">${study.label}</option>`)
    .join("");

  prioritySelect.innerHTML = Object.entries(priorityProfiles)
    .map(([key, profile]) => `<option value="${key}">${profile.label}</option>`)
    .join("");
}

function initializeTradeChoices() {
  if (typeof Choices === "undefined") return;

  const baseOptions = {
    allowHTML: false,
    itemSelectText: "",
    searchEnabled: false,
    shouldSort: false
  };

  try {
    tradeChoiceControls.category = new Choices(categorySelect, baseOptions);
    tradeChoiceControls.priority = new Choices(prioritySelect, baseOptions);
  } catch (error) {
    console.warn("Choices.js could not initialize for Compare Options.", error);
  }
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
    <span><i class="fa-solid fa-trophy" aria-hidden="true"></i>Current top fit</span>
    <strong>${top.name}</strong>
    <p>${top.score}/100 using ${priorityProfiles[priorityKey].label.toLowerCase()} weighting</p>
  `;

  const maxScore = Math.max(...ranked.map((option) => option.score));
  scoreChart.innerHTML = ranked.map((option, index) => `
    <article class="trade-score-row ${index === 0 ? "top-score" : ""}">
      <div>
        <span>${index + 1}</span>
        <strong>${option.name}</strong>
      </div>
      <div class="trade-score-track" aria-label="${option.name} score ${option.score} out of 100">
        <i style="--score:${option.score}%; --relative:${Math.max(8, Math.round((option.score / maxScore) * 100))}%"></i>
      </div>
      <em>${option.score}</em>
    </article>
  `).join("");

  const activeWeights = weightedCriteria(study, priorityKey);
  weightList.innerHTML = activeWeights.length
    ? activeWeights.map((item) => `
      <span>
        <i class="fa-solid fa-weight-hanging" aria-hidden="true"></i>
        ${item.criteria}
        <strong>${item.weight}x</strong>
      </span>
    `).join("")
    : `<span><i class="fa-solid fa-scale-balanced" aria-hidden="true"></i>All factors weighted evenly<strong>1x</strong></span>`;

  table.innerHTML = `
    <table class="trade-table dynamic-trade-table">
      <thead>
        <tr>
          <th>Factor</th>
          ${study.options.map((option) => `<th>${option.name}<span>${optionScore(study, option, priorityKey)}/100</span></th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${study.criteria.map((criteria, index) => `
          <tr>
            <td>${criteria}</td>
            ${study.options.map((option, optionIndex) => {
              const rating = option.ratings[index];
              return `<td class="${shouldHighlightRating(study, criteria, rating, optionIndex) ? "score-high" : ""}">${rating}</td>`;
            }).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  profiles.innerHTML = ranked.map((option, index) => {
    const strengths = optionStrengths(study, option);
    const risks = optionRisks(study, option);
    return `
    <article class="dynamic-option ${index === 0 ? "top-option" : ""}">
      <span>${index === 0 ? '<i class="fa-solid fa-star" aria-hidden="true"></i>' : '<i class="fa-solid fa-circle-dot" aria-hidden="true"></i>'}${option.type}</span>
      <h3>${option.name}</h3>
      <a class="source-link" href="${option.sourceUrl}" target="_blank" rel="noopener noreferrer">
        <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
        ${option.sourceLabel}
      </a>
      <div class="score-bar" style="--score:${option.score}%"><i></i></div>
      <strong>${option.score}/100</strong>
      <p>${option.summary}</p>
      <div class="trade-profile-details">
        <div>
          <small>Strengths</small>
          ${strengths.map((item) => `<b>${item.criteria}</b>`).join("") || "<b>No standout strengths</b>"}
        </div>
        <div>
          <small>Watch items</small>
          ${risks.map((item) => `<b>${item.criteria}</b>`).join("") || "<b>No major watch item</b>"}
        </div>
      </div>
    </article>
  `;
  }).join("");
}

categorySelect.addEventListener("change", renderTradeStudy);
prioritySelect.addEventListener("change", renderTradeStudy);

renderControls();
initializeTradeChoices();
renderTradeStudy();
