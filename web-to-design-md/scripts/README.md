# scripts

This folder contains the executable pipeline.

## route-request.js
Keyword-based mode router:
- clone
- style
- hybrid

## capture-page.js
Uses Playwright to:
- open a URL
- capture a full-page screenshot
- extract basic DOM evidence
- sample visible computed styles
- write `page-data.json`

## analyze-screenshot.py
Uses Pillow to extract image-level evidence:
- dominant colors
- brightness profile
- whitespace ratio
- edge density
- section-break candidates

## extract-style-map.js
Normalizes raw page or image evidence into a reusable `style-map.json`.

## build-design-md.js
Builds:
- `DESIGN.md`
- `tokens.json`
- `component-recipes.md`
- `reuse-guide.md`

## build-clone-html.js
Builds:
- `index.html`
- `styles.css`
- `fidelity-report.md`

## run-clone.js
Complete clone pipeline runner.

## run-style.js
Complete style pipeline runner.

## run-hybrid.js
Complete hybrid pipeline runner.
