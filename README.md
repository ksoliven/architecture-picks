# PICKS Capstone Site

![PICKS logo](assets/picks-logo-full.png)

Static presentation site for the Project Inventory Compliance and Kitting System (PICKS) capstone.

The site is built with plain HTML, CSS, and JavaScript. It uses clean directory routes so page URLs do not expose `.html` filenames.

## Suggested Review Path

Context -> Requirements -> Architecture -> Verification -> Final Recommendation

## Pages

- `/` - overview and navigation hub
- `/background/` - project context, problem background, and capstone scope
- `/requirements/` - stakeholder needs, highlighted requirements, and prioritization drivers
- `/interview-findings/` - lab discovery themes, pain points, and design implications
- `/baseline/` - Current Flow page showing how requests move across systems
- `/trade-study/` - implementation option comparisons
- `/what-if/` - future scenario explorer
- `/system-design/` - clickable system layout based on the final diagrams
- `/data-payloads/` - Data Payloads page with information exchange and error examples
- `/test-cases/` - verification examples and test coverage
- `/final-recommendation/` - Final Recommendation page with hybrid architecture path, known dependencies, and phased next steps
- `/final-materials/` - final presentation, MSOSA model ZIP, and SEMP report
- `/acronyms/` - acronym reference

## Final Materials

The final materials page links to:

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

Avoid opening `index.html` directly from the file system because clean directory routes such as `/system-design/` work best through a static server.

## Project Structure

- `index.html` - home page
- `baseline/`, `trade-study/`, `what-if/`, etc. - clean-route page folders
- `js/` - page interactions and data
- `styles.css` - shared styling, theme, layout, and hover states
- `assets/` - logo, favicon, presentation files, report files, and model package
- `.nojekyll` - keeps GitHub Pages from processing the site with Jekyll

## Deployment

The site is intended to deploy from the repository root on the `main` branch using GitHub Pages.

Because this is a static site, no build step or package install is required.
