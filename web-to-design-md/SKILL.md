---
name: web-to-design-md
description: Route webpage or screenshot requests into either high-fidelity HTML/CSS reconstruction or reusable design-system extraction.
type: downloaded
---

# web-to-design-md

## Purpose

This skill handles two fundamentally different jobs:

1. **clone mode**
   - reconstruct a webpage or screenshot into editable HTML/CSS
   - prioritize visual fidelity, structure, spacing, typography, and reusable code

2. **style mode**
   - extract reusable visual language from a webpage or screenshot
   - generate `DESIGN.md`, tokens, component recipes, and reuse guidance

3. **hybrid mode**
   - do both in one workflow
   - always create `style-map.json` first
   - then branch into clone and style outputs

This skill must **not** treat these as the same task.

---

## Routing rules

When a user request clearly asks for:
- HTML
- CSS
- clone
- reconstruction
- recreation
- rebuild
- pixel-perfect approximation
- editable webpage
- 复刻
- 还原
- 转成 HTML
- 转成 CSS
- 转前端

Use **clone mode**.

When a user request clearly asks for:
- design reference
- design system
- visual language
- design md
- style guide
- style extraction
- reusable style reference
- 提取风格
- 拆解设计风格
- 生成 DESIGN.md
- 设计语言
- 风格参考
- 颜色字体布局组件规则

Use **style mode**.

When the user asks for both:
- style extraction
- and code reconstruction

Use **hybrid mode**.

If the user intent is ambiguous, do not default to code generation.  
Instead:
1. classify the likely mode,
2. state the chosen mode,
3. execute it.

---

## Core operating principle

Always separate:
- **page recreation**
- from
- **design-language abstraction**

Do not let clone outputs pollute style outputs.

### Bad behavior
- jumping straight into HTML when the user asked for a design reference
- describing business copy instead of reusable design rules
- turning every screenshot into raw code without a style abstraction layer

### Correct behavior
- first infer the job
- then build a **style-map**
- then generate only the outputs required by the selected mode

---

## Mandatory intermediate layer

Before producing final artifacts, create a normalized `style-map.json`.

The style map should include, whenever possible:
- page type
- visual theme
- color roles
- typography roles
- layout rules
- spacing/radius/shadow systems
- component recipes
- responsive tendencies
- uncertainty notes

All modes must use this intermediate representation.

---

## Output contracts

## Clone mode
Must output:
1. structured analysis
2. implementation strategy
3. complete HTML
4. CSS
5. fidelity report

### Clone rules
- prioritize semantic HTML
- prefer flexbox and grid over absolute positioning
- preserve hierarchy and spacing rhythm
- infer hover/focus states only when reasonably supported
- never claim true source recovery from a screenshot
- if evidence is incomplete, mark the result as approximation

## Style mode
Must output:
1. `DESIGN.md`
2. `tokens.json`
3. `component-recipes.md`
4. `reuse-guide.md`

### Style rules
- do not rewrite the original page copy
- do not produce HTML unless explicitly requested
- abstract the design into transferable rules
- focus on visual language, not content summary
- clearly separate confirmed observations from inferred rules

## Hybrid mode
Must output:
1. `style-map.json`
2. `DESIGN.md`
3. `tokens.json`
4. `component-recipes.md`
5. `reuse-guide.md`
6. `index.html`
7. `styles.css`
8. `fidelity-report.md`

### Hybrid rules
The order must be:
1. gather evidence
2. build style map
3. generate style artifacts
4. generate clone artifacts
5. report uncertainty

---

## Evidence collection policy

### For webpage inputs
Use:
- DOM structure
- text hierarchy
- computed styles
- screenshots
- image and media references
- visible interaction clues
- container and section segmentation

### For image inputs
Use:
- aspect ratio
- dominant color palette
- tonal contrast
- whitespace density
- approximate section boundaries
- visible component shapes
- typographic scale cues
- visual hierarchy

Do not pretend an image contains recoverable DOM structure.

---

## DESIGN.md structure

When generating `DESIGN.md`, always use this structure:

1. Visual Theme & Atmosphere
2. Color System
3. Typography
4. Layout Principles
5. Component Recipes
6. Depth & Effects
7. Content Style
8. Do / Don't
9. Responsive Behavior
10. Prompt Guide

---

## Clone prompt behavior

For clone mode:
- first analyze
- then choose implementation strategy
- then generate code
- then produce fidelity report

Never skip the analysis layer.

---

## Style prompt behavior

For style mode:
- analyze the design language
- convert observations into transferable rules
- generate design-system artifacts

Never produce vague adjectives without concrete visual rules.

Bad:
- “modern”
- “clean”
- “good hierarchy”

Good:
- “uses wide section spacing around 72–120px”
- “relies on low-saturation surfaces with one accent color”
- “headlines are short, bold, and separated from body copy by large top margins”

---

## Safety against overclaiming

If any part is uncertain, label it.

Use language like:
- “inferred from visual evidence”
- “approximate rule”
- “not directly verifiable from the screenshot”
- “recommended manual review”

Never falsely claim:
- original framework identity
- exact brand font
- true source code recovery
- fully verified interaction logic

---

## Recommended file outputs

### Clone
- `index.html`
- `styles.css`
- `fidelity-report.md`

### Style
- `DESIGN.md`
- `tokens.json`
- `component-recipes.md`
- `reuse-guide.md`

### Shared
- `style-map.json`
- `page-data.json` or `image-meta.json`

---

## Included prompts

Use:
- `prompts/clone.prompt.md`
- `prompts/style.prompt.md`
- `prompts/hybrid.prompt.md`

---

## Included scripts

Use:
- `scripts/route-request.js`
- `scripts/capture-page.js`
- `scripts/analyze-screenshot.py`
- `scripts/extract-style-map.js`
- `scripts/build-design-md.js`
- `scripts/build-clone-html.js`
- `scripts/run-clone.js`
- `scripts/run-style.js`
- `scripts/run-hybrid.js`

---

## Final instruction

This skill is successful only if it produces outputs that are:
- structurally clear
- reusable
- honest about uncertainty
- aligned with the user’s actual intent
