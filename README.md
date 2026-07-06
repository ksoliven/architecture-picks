# PICKS Capstone Site

![PICKS logo](assets/picks-logo-full.png)

An interactive static presentation site for the Project Inventory Compliance and Kitting System (PICKS) capstone. The site packages the project background, stakeholder findings, current-state flow, option comparisons, architecture views, payload examples, verification coverage, and final recommendation into a clean browser-based review experience.

The implementation uses plain HTML, CSS, and JavaScript with clean directory routes so page URLs stay readable and do not expose `.html` filenames.

## Review Path

For the clearest walkthrough, review the site in the same order as the navigation:

1. Background
2. Requirements
3. Interview Findings
4. Current Flow
5. Compare Options
6. What-if
7. System Layout
8. Data Payloads
9. Test Cases
10. Final Recommendation
11. Final Materials

## Site Map

| Route | Purpose |
| --- | --- |
| `/` | Overview and navigation hub |
| `/background/` | Project context, problem background, and capstone scope |
| `/requirements/` | Stakeholder needs, highlighted requirements, and prioritization drivers |
| `/interview-findings/` | Discovery themes, pain points, and design implications |
| `/baseline/` | Current Flow view showing how requests move across systems |
| `/trade-study/` | Option comparison for ERP, MES, and integration-layer choices |
| `/what-if/` | Scenario explorer for future architecture choices |
| `/system-design/` | Clickable system layout based on the final diagrams |
| `/data-payloads/` | Data Payloads reference with information exchange and error examples |
| `/test-cases/` | Verification examples and test coverage |
| `/final-recommendation/` | Recommended architecture path, dependencies, and phased next steps |
| `/final-materials/` | Final presentation, MSOSA model package, and SEMP report |
| `/acronyms/` | Acronym reference |

## Final Materials

The final materials page links to the deliverable package:

- `assets/materials/final-presentation.pptx`
- `assets/materials/picks-capstone-msosa-model.zip`
- `assets/materials/final-system-engineering-document.pdf`

The PDF previews in the browser. The PowerPoint and MSOSA model package are provided as downloadable files.

The materials folder also includes source/export versions of the SEMP report:

- `assets/materials/final-system-engineering-document.docx`
- `assets/materials/final-system-engineering-document.html`

## Run Locally

Run a local static server from the project root:

```sh
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Use a local server instead of opening `index.html` directly from the file system. Clean directory routes such as `/system-design/` work best through a static server.

## External Libraries

The site is static and does not require a package install. It uses CDN-hosted frontend libraries for presentation polish:

| Library | Use |
| --- | --- |
| Font Awesome | Navigation and interface icons |
| AOS | Scroll animation effects |
| Choices.js | Styled dropdowns on Current Flow, Compare Options, and What-if |

## Project Structure

```text
.
├── index.html
├── background/
├── requirements/
├── interview-findings/
├── baseline/
├── trade-study/
├── what-if/
├── system-design/
├── data-payloads/
├── test-cases/
├── final-recommendation/
├── final-materials/
├── acronyms/
├── js/
├── assets/
├── styles.css
└── .nojekyll
```

## Deployment

The site is intended to deploy from the repository root on the `main` branch using GitHub Pages.

Because this is a static site, no build step or package installation is required.
