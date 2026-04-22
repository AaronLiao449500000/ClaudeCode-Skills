#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        args[key] = true;
      } else {
        args[key] = next;
        i += 1;
      }
    }
  }
  return args;
}

async function loadJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function sanitizeText(text, fallback) {
  const value = (text || "").trim().replace(/\s+/g, " ");
  return value || fallback;
}

function makeSections(pageData) {
  const headings = pageData?.headings || [];
  const paragraphs = pageData?.paragraphs || [];
  const buttons = pageData?.buttons || [];
  const images = pageData?.images || [];

  const heroTitle = sanitizeText(headings?.[0]?.text, "Reconstructed headline");
  const heroSubtitle = sanitizeText(paragraphs?.[0]?.text, "This section is a best-effort approximation generated from visual evidence.");
  const primaryButton = sanitizeText(buttons?.[0]?.text, "Primary action");
  const secondaryButton = sanitizeText(buttons?.[1]?.text, "Secondary action");

  const featureCards = Array.from({ length: 3 }).map((_, index) => ({
    title: sanitizeText(headings?.[index + 1]?.text, `Feature ${index + 1}`),
    body: sanitizeText(paragraphs?.[index + 1]?.text, "Replace this content with the original intent after visual review."),
    image: images?.[index]?.src || ""
  }));

  return {
    heroTitle,
    heroSubtitle,
    primaryButton,
    secondaryButton,
    featureCards
  };
}

function makeApproxSectionsFromStyle(styleMap) {
  return {
    heroTitle: "Reconstructed visual system",
    heroSubtitle: "This image-derived layout is a structured approximation based on palette, section rhythm, and design-language inference.",
    primaryButton: "Primary action",
    secondaryButton: "Secondary action",
    featureCards: [
      { title: "Section one", body: "Approximate block generated from the inferred layout rhythm.", image: "" },
      { title: "Section two", body: "Replace with the original content after manual review.", image: "" },
      { title: "Section three", body: "Use this as a scaffold rather than final source recovery.", image: "" }
    ]
  };
}

function buildCss(styleMap) {
  const colors = styleMap.color_system;
  const typo = styleMap.typography;
  const layout = styleMap.layout;
  const radiusScale = styleMap.effects.radius_scale || ["8px", "14px", "24px", "999px"];
  const shadow = styleMap.effects.shadow || "0 10px 30px rgba(0,0,0,0.08)";
  const cardRadius = radiusScale[2] || "24px";
  const buttonRadius = styleMap.components?.buttons?.radius || radiusScale.find((v) => String(v).includes("999")) || "999px";

  return `:root {
  --background: ${colors.background};
  --surface: ${colors.surface};
  --text-primary: ${colors.text_primary};
  --text-secondary: ${colors.text_secondary};
  --accent: ${colors.accent};
  --border: ${colors.border};
  --container-max: ${layout.container_max_width};
  --content-max: ${layout.content_max_width};
  --section-space: ${layout.section_spacing};
  --radius-sm: ${radiusScale[0] || "8px"};
  --radius-md: ${radiusScale[1] || "14px"};
  --radius-lg: ${cardRadius};
  --radius-pill: ${buttonRadius};
  --shadow-soft: ${shadow};
  --display-font: ${typo.display.font_family};
  --body-font: ${typo.body.font_family};
  --display-size: ${typo.display.font_size};
  --display-weight: ${typo.display.font_weight};
  --display-line-height: ${typo.display.line_height};
  --display-letter-spacing: ${typo.display.letter_spacing};
  --body-size: ${typo.body.font_size};
  --body-weight: ${typo.body.font_weight};
  --body-line-height: ${typo.body.line_height};
  --body-letter-spacing: ${typo.body.letter_spacing};
  --transition-fast: 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--text-primary);
  font-family: var(--body-font);
  font-size: var(--body-size);
  font-weight: var(--body-weight);
  line-height: var(--body-line-height);
  letter-spacing: var(--body-letter-spacing);
}

img {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

.page-shell {
  min-height: 100vh;
}

.container {
  width: min(calc(100% - 32px), var(--container-max));
  margin: 0 auto;
}

.hero {
  padding: 88px 0 56px;
}

.hero__inner {
  display: grid;
  gap: 32px;
  align-items: center;
  min-height: 54vh;
}

.hero__copy {
  max-width: var(--content-max);
}

.hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  background: color-mix(in srgb, var(--surface) 92%, white 8%);
  font-size: 13px;
  line-height: 1;
  margin-bottom: 20px;
}

.hero__title {
  margin: 0 0 18px;
  font-family: var(--display-font);
  font-size: clamp(40px, 7vw, var(--display-size));
  font-weight: var(--display-weight);
  line-height: var(--display-line-height);
  letter-spacing: var(--display-letter-spacing);
}

.hero__subtitle {
  margin: 0;
  max-width: 70ch;
  color: var(--text-secondary);
  font-size: clamp(16px, 2vw, 18px);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 22px;
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  font-weight: 600;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast);
}

.button--primary {
  background: var(--accent);
  color: white;
  box-shadow: var(--shadow-soft);
}

.button--secondary {
  background: transparent;
  color: var(--text-primary);
  border-color: var(--border);
}

.button:hover,
.button:focus-visible {
  transform: translateY(-1px);
}

.button--primary:hover,
.button--primary:focus-visible {
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.14);
}

.button--secondary:hover,
.button--secondary:focus-visible {
  background: color-mix(in srgb, var(--surface) 92%, white 8%);
}

.section {
  padding: var(--section-space) 0 0;
}

.section__header {
  margin-bottom: 28px;
  max-width: 760px;
}

.section__title {
  margin: 0 0 10px;
  font-family: var(--display-font);
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.section__description {
  margin: 0;
  color: var(--text-secondary);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.card {
  height: 100%;
  background: color-mix(in srgb, var(--surface) 96%, white 4%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}

.card__media {
  aspect-ratio: 16 / 10;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--accent) 18%, var(--surface) 82%), var(--surface));
  border-bottom: 1px solid var(--border);
}

.card__body {
  padding: 22px;
}

.card__title {
  margin: 0 0 10px;
  font-size: 20px;
  line-height: 1.2;
}

.card__text {
  margin: 0;
  color: var(--text-secondary);
}

.footer {
  padding: calc(var(--section-space) * 0.9) 0 48px;
  color: var(--text-secondary);
}

.notice {
  margin-top: 24px;
  padding: 16px 18px;
  border-radius: var(--radius-md);
  border: 1px dashed var(--border);
  color: var(--text-secondary);
  background: color-mix(in srgb, var(--surface) 96%, white 4%);
  font-size: 14px;
}

@media (max-width: 1024px) {
  .hero {
    padding-top: 72px;
  }

  .card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .container {
    width: min(calc(100% - 24px), var(--container-max));
  }

  .hero {
    padding-top: 56px;
  }

  .hero__inner,
  .card-grid {
    grid-template-columns: 1fr;
  }

  .card__body {
    padding: 18px;
  }
}
`;
}

function buildHtml(styleMap, content, approximation) {
  const cardsHtml = content.featureCards.map((card) => `
        <article class="card">
          <div class="card__media" aria-hidden="true"></div>
          <div class="card__body">
            <h3 class="card__title">${escapeHtml(card.title)}</h3>
            <p class="card__text">${escapeHtml(card.body)}</p>
          </div>
        </article>
  `).join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Reconstructed page</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <div class="page-shell">
      <header class="hero">
        <div class="container hero__inner">
          <div class="hero__copy">
            <div class="hero__eyebrow">Reconstructed from ${styleMap.source_type === "page" ? "webpage evidence" : "image evidence"}</div>
            <h1 class="hero__title">${escapeHtml(content.heroTitle)}</h1>
            <p class="hero__subtitle">${escapeHtml(content.heroSubtitle)}</p>
            <div class="hero__actions">
              <a class="button button--primary" href="#">${escapeHtml(content.primaryButton)}</a>
              <a class="button button--secondary" href="#">${escapeHtml(content.secondaryButton)}</a>
            </div>
            <div class="notice">
              ${escapeHtml(approximation)}
            </div>
          </div>
        </div>
      </header>

      <main>
        <section class="section">
          <div class="container">
            <div class="section__header">
              <h2 class="section__title">Structured feature blocks</h2>
              <p class="section__description">This editable scaffold preserves hierarchy, spacing, component rhythm, and visual balance first. Fine-grained accuracy should be refined against the source.</p>
            </div>
            <div class="card-grid">
${cardsHtml}
            </div>
          </div>
        </section>
      </main>

      <footer class="footer">
        <div class="container">
          <p>This output is a reconstruction scaffold designed for manual refinement. It is not a claim of original source recovery.</p>
        </div>
      </footer>
    </div>
  </body>
</html>
`;
}

function buildFidelityReport(styleMap, sourceType) {
  return `# fidelity-report.md

## High-confidence observations
- Base visual theme: ${styleMap.visual_theme.join(", ")}
- Color roles were normalized into a reusable palette.
- Layout pacing centers around ${styleMap.layout.section_spacing} section spacing.

## Inferred implementation decisions
- Buttons are implemented with restrained hover motion and pill-like rounding where supported.
- Cards use a reusable elevated surface treatment to preserve hierarchy.
- Responsive behavior compresses gutters and stacks columns rather than flattening hierarchy.

## Ambiguities
${styleMap.uncertainty.map((item) => `- ${item}`).join("\n")}

## Manual refinement priorities
1. Compare the headline scale and section spacing against the source image or live page.
2. Adjust button radius, shadow softness, and surface contrast to better match the reference.
3. If the source uses custom media, replace scaffold content blocks with the original asset layout.

## Reconstruction note
This output is based on ${sourceType === "page" ? "captured webpage evidence" : "image-derived evidence"} and should be treated as a high-utility approximation, not original source recovery.
`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function main() {
  const args = parseArgs(process.argv);
  const styleMapPath = args["style-map"];
  const pageDataPath = args["page-data"];
  const outDir = args.out || "./output/clone";

  if (!styleMapPath) {
    throw new Error("Missing --style-map");
  }

  await fs.mkdir(outDir, { recursive: true });

  const styleMap = await loadJson(styleMapPath);
  const pageData = pageDataPath ? await loadJson(pageDataPath) : null;
  const content = pageData ? makeSections(pageData) : makeApproxSectionsFromStyle(styleMap);

  const approximation = styleMap.source_type === "page"
    ? "The structure is informed by real DOM and computed-style sampling, but hidden states and edge cases still require review."
    : "This is a visual approximation built from image-level evidence. Original DOM structure, true interaction logic, and source code are not recoverable from a static image.";

  const css = buildCss(styleMap);
  const html = buildHtml(styleMap, content, approximation);
  const fidelityReport = buildFidelityReport(styleMap, styleMap.source_type);

  await fs.writeFile(path.join(outDir, "styles.css"), css, "utf8");
  await fs.writeFile(path.join(outDir, "index.html"), html, "utf8");
  await fs.writeFile(path.join(outDir, "fidelity-report.md"), fidelityReport, "utf8");

  console.log(JSON.stringify({
    ok: true,
    files: [
      path.join(outDir, "index.html"),
      path.join(outDir, "styles.css"),
      path.join(outDir, "fidelity-report.md")
    ]
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
