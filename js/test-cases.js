const testCases = [
  {
    title: "Verify ERP purchase order data exchange",
    category: "Data Exchange",
    icon: "fa-file-invoice-dollar",
    purpose: "Confirm that purchase order information can move from the ERP direction into the connected environment.",
    status: "Planned"
  },
  {
    title: "Verify vendor data mapping",
    category: "Data Exchange",
    icon: "fa-address-card",
    purpose: "Confirm that vendor fields are retrieved, mapped, compared, and usable downstream.",
    status: "Detailed"
  },
  {
    title: "Verify part number synchronization",
    category: "Traceability",
    icon: "fa-barcode",
    purpose: "Confirm that part numbers stay consistent across ERP/source data, the integration layer, MES, and PEDYN.",
    status: "Detailed"
  },
  {
    title: "Verify PEDYN legacy data access",
    category: "Data Exchange",
    icon: "fa-folder-tree",
    purpose: "Confirm that legacy lab data can be accessed without losing important lab history.",
    status: "Planned"
  },
  {
    title: "Verify MES inventory updates",
    category: "Data Exchange",
    icon: "fa-warehouse",
    purpose: "Confirm that MES inventory changes can be reflected in the enterprise environment.",
    status: "Planned"
  },
  {
    title: "Verify RBAC enforcement",
    category: "Controls",
    icon: "fa-user-shield",
    purpose: "Confirm that role-based access control allows approved actions and blocks unauthorized changes.",
    status: "Detailed"
  },
  {
    title: "Verify audit logging",
    category: "Controls",
    icon: "fa-clipboard-list",
    purpose: "Confirm that important system activity is recorded for review, troubleshooting, and compliance evidence.",
    status: "Planned"
  },
  {
    title: "Verify exception handling",
    category: "Errors",
    icon: "fa-triangle-exclamation",
    purpose: "Confirm the system catches shortages, incomplete stations, incorrect data types, and synchronization failures.",
    status: "Detailed"
  },
  {
    title: "Verify duplicate record detection",
    category: "Errors",
    icon: "fa-copy",
    purpose: "Confirm that duplicate part, vendor, or inventory records are detected before they create downstream confusion.",
    status: "Planned"
  },
  {
    title: "Verify end-to-end traceability",
    category: "Traceability",
    icon: "fa-timeline",
    purpose: "Confirm that build completion and data transfer can be traced between MES and ERP in both directions.",
    status: "Detailed"
  }
];

const detailedTests = [
  {
    title: "Exception Handling",
    icon: "fa-triangle-exclamation",
    summary: "Use an example BOM and build flow to confirm the system handles bad or incomplete actions.",
    confirms: [
      "A user cannot issue more components than inventory allows.",
      "A station cannot close until required steps are complete.",
      "The system rejects an incorrect data type before it moves downstream."
    ],
    requirements: ["6.2.3 Synchronization Failures", "6.2.2 Inventory records", "1.3.2.2 Configurable Data Fields"]
  },
  {
    title: "End-to-End Traceability",
    icon: "fa-timeline",
    summary: "Simulate a build and confirm that completion and data transfer can be followed across systems.",
    confirms: [
      "Build completion is captured.",
      "MES-to-ERP data transfer is visible.",
      "ERP-to-MES data transfer is visible."
    ],
    requirements: ["1.3.4.1 Router Component ID", "1.3.4.2 BOM Loading", "1.3.2.3 Data Storage", "6.1.1 Retrieve Inventory"]
  },
  {
    title: "Vendor Data Mapping",
    icon: "fa-address-card",
    summary: "Retrieve an ERP vendor record and confirm that mapped fields match what downstream systems need.",
    confirms: [
      "Vendor ID, name, and related fields remain consistent.",
      "The integration layer can compare source and target fields.",
      "Missing, unmapped, or unusable vendor data follows a clear fail path."
    ],
    requirements: ["5.2.1 Data Retrieval", "5.3.1 Autopopulated Fields", "5.3.1.1 Field Mapping", "5.4.1.1 Receiving Interface"]
  },
  {
    title: "Part Number Synchronization",
    icon: "fa-barcode",
    summary: "Check that part numbers match across ERP/source data, the integration layer, MES, and PEDYN.",
    confirms: [
      "Part numbers remain consistent across systems.",
      "Mapping rules are validated before synchronization.",
      "Missing or mismatched part numbers follow a clear fail path."
    ],
    requirements: ["1.2.1.1 Part Number Identification", "1.2.1.2 Part Number Identification Association", "1.2.1.5 Associated Projects", "3.3.4 Component Traceability"]
  },
  {
    title: "RBAC Enforcement",
    icon: "fa-user-shield",
    summary: "Validate that the system recognizes a user role before allowing protected actions.",
    confirms: [
      "The user's role is recognized by the access-control policy.",
      "Restricted actions are checked before changes are accepted.",
      "Undefined roles or unauthorized changes are blocked and recorded."
    ],
    requirements: ["3.4.1 Access Control", "5.6.2.1 Audit Subsystem", "1.3.3 Access Control"]
  }
];

const refinementSteps = [
  { icon: "fa-bullseye", text: "Tie each test case to specific requirement IDs and verification objectives." },
  { icon: "fa-border-all", text: "Confirm system boundaries for ERP, MES, PEDYN, RBAC, and the integration layer." },
  { icon: "fa-list-check", text: "Define preconditions, inputs, expected outputs, and pass/fail criteria." },
  { icon: "fa-database", text: "Add representative data such as PO numbers, part numbers, BOMs, quantities, and user roles." },
  { icon: "fa-code-branch", text: "Separate data errors, interface failures, authorization failures, and workflow failures." },
  { icon: "fa-comments", text: "Validate test flows with sponsor feedback and final ERP/MES architecture direction." },
  { icon: "fa-link", text: "Trace each test back to visibility, traceability, kitting, compliance, and interface readiness." }
];

const testCaseGrid = document.querySelector("#testCaseGrid");
const testDetailList = document.querySelector("#testDetailList");
const testRefinementGrid = document.querySelector("#testRefinementGrid");
const filterButtons = [...document.querySelectorAll(".test-filter")];

function formatRequirement(requirement) {
  const [id, ...labelParts] = requirement.split(" ");
  return `<span><b>${id}</b>${labelParts.join(" ")}</span>`;
}

function renderTestCards(filter = "all") {
  const visibleCases = filter === "all" ? testCases : testCases.filter((testCase) => testCase.category === filter);
  testCaseGrid.innerHTML = visibleCases.map((testCase, index) => `
    <article class="test-card" data-aos="fade-up" data-aos-delay="${index * 35}">
      <div class="test-card-heading">
        <i class="fa-solid ${testCase.icon}" aria-hidden="true"></i>
        <span>${testCase.category}</span>
      </div>
      <h3>${testCase.title}</h3>
      <p>${testCase.purpose}</p>
      <strong>${testCase.status}</strong>
    </article>
  `).join("");
}

testDetailList.innerHTML = detailedTests.map((test) => `
  <article class="test-detail-card">
    <div class="test-detail-icon" aria-hidden="true"><i class="fa-solid ${test.icon}"></i></div>
    <div>
      <h3>${test.title}</h3>
      <p>${test.summary}</p>
      <div class="test-confirm-grid">
        ${test.confirms.map((item) => `<span><i class="fa-solid fa-check" aria-hidden="true"></i>${item}</span>`).join("")}
      </div>
      <div class="mini-pills test-requirement-pills">${test.requirements.map(formatRequirement).join("")}</div>
    </div>
  </article>
`).join("");

testRefinementGrid.innerHTML = refinementSteps.map((step) => `
  <article>
    <i class="fa-solid ${step.icon}" aria-hidden="true"></i>
    <p>${step.text}</p>
  </article>
`).join("");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((filterButton) => filterButton.classList.remove("active"));
    button.classList.add("active");
    renderTestCards(button.dataset.filter);
  });
});

renderTestCards();
