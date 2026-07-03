# PICKS Capstone Final

Presentation package for the PICKS capstone architecture.

## Open the Dynamic View

Open [index.html](/Users/katesoliven/Desktop/capstone/index.html) in a browser for the landing page.

Open [baseline.html](/Users/katesoliven/Desktop/capstone/html/baseline.html) for the animated baseline integration data flow.

Open [what-if.html](/Users/katesoliven/Desktop/capstone/html/what-if.html) to compare alternate enterprise, integration-layer, and MES choices.

Open [trade-study.html](/Users/katesoliven/Desktop/capstone/html/trade-study.html) to view ERP, MES, and integration-layer trade studies.

Open [system-design.html](/Users/katesoliven/Desktop/capstone/html/system-design.html) to view the high-level system design.

The page is based on the Integration Framework Workflow from the capstone PowerPoint:

- User
- RBAC / Policies
- Integration Layer
- Oracle ERP
- Workday
- PEDYN Legacy
- Potential MES Candidate

## What It Shows

- Data movement between architecture participants.
- Request and response messages in sequence order.
- Animated data packet movement using JavaScript.
- Requirement filtering.
- Requirement traceability for each message.
- Active-step details including payload and requirement tie.

## File Layout

- [index.html](/Users/katesoliven/Desktop/capstone/index.html): landing page.
- [html/baseline.html](/Users/katesoliven/Desktop/capstone/html/baseline.html): baseline integration data-flow page.
- [html/trade-study.html](/Users/katesoliven/Desktop/capstone/html/trade-study.html): ERP, MES, and integration-layer trade study page.
- [html/what-if.html](/Users/katesoliven/Desktop/capstone/html/what-if.html): alternate architecture scenario page.
- [html/system-design.html](/Users/katesoliven/Desktop/capstone/html/system-design.html): high-level system design page.
- [styles.css](/Users/katesoliven/Desktop/capstone/styles.css): all visual styling.
- [js/app.js](/Users/katesoliven/Desktop/capstone/js/app.js): architecture data and JavaScript animation.
- [js/trade-study.js](/Users/katesoliven/Desktop/capstone/js/trade-study.js): dynamic trade study data, scoring, and rendering.
- [js/whatif.js](/Users/katesoliven/Desktop/capstone/js/whatif.js): what-if scenario data and JavaScript animation.
- [js/system-design.js](/Users/katesoliven/Desktop/capstone/js/system-design.js): click-to-reveal subsystem panel for the system design page.

## Edit the Architecture

The architecture model lives in [js/app.js](/Users/katesoliven/Desktop/capstone/js/app.js) inside the `architecture` object.

Update:

- `participants`: systems shown as vertical lifelines.
- `requirements`: requirement IDs, names, and descriptions.
- `messages`: request/response flow, data payloads, and requirement mapping.
