---
name: screenshot-to-html-excalidraw
description: Reconstruct webpage screenshots into high-fidelity HTML and/or Obsidian-compatible Excalidraw layout files, with mandatory output-mode confirmation and font confirmation for Excalidraw.
type: local
version: 1.0.0
author: OpenAI
---

# screenshot-to-html-excalidraw

## Purpose

This skill is a **single-purpose reconstruction skill**.
It takes a webpage screenshot, long image, component screenshot, card screenshot, poster-like UI, or layout reference and produces one or both of the following:

1. `index.html`
   - the primary high-fidelity reconstruction output
   - optimized for visual similarity, semantic structure, and practical editability

2. `layout.excalidraw.md`
   - the secondary editable layout output
   - optimized for editing, dragging, regrouping, and re-layout inside Obsidian Excalidraw
   - not treated as a source-code-equivalent webpage

When Excalidraw output is requested, this skill also generates a matching Obsidian CSS snippet and installation instructions.

---

## Non-Negotiable Interaction Rules

These rules are mandatory and must always be followed.

### Rule 1: Output mode must be confirmed before reconstruction

For **every reconstruction request**, do not immediately generate files.
Always ask the user to confirm which output they want:

- HTML only
- Excalidraw only
- Both HTML and Excalidraw

Use this confirmation step even if the request seems obvious.

### Required confirmation wording

Use wording equivalent to:

> 在开始复刻前，请先确认输出方式：
> 1. 只生成 HTML
> 2. 只生成 Excalidraw
> 3. HTML 和 Excalidraw 都生成
> 请直接回复数字或对应文字。

If the user already explicitly confirmed the mode in the same turn, you may proceed without repeating the question.

### Rule 2: Font must be confirmed before generating Excalidraw

If the selected output mode includes Excalidraw, pause before generating the Excalidraw file and ask the user to confirm the font option.

Use wording equivalent to:

> 即将生成 Excalidraw 可编辑排版稿，请先确认字体：
> 1. 霞鹜文楷屏幕阅读版（默认，适合中文阅读）
> 2. Nunito（中性清爽）
> 3. Excalifont（手绘草图感）
> 4. Comic Shanns（技术/代码感）
> 请直接回复数字或字体名。

If the user does not specify a font but explicitly asks to continue, default to:

- `LXGW WenKai Screen / 霞鹜文楷屏幕阅读版`

### Rule 3: HTML is the primary fidelity path

Whenever HTML is requested, prioritize HTML fidelity first.
The HTML branch is the main reconstruction path.
Excalidraw should be derived from the same layout understanding, but it must not degrade the HTML reconstruction.

---

## Supported Inputs

This skill is designed for:

- webpage screenshots
- full-page long screenshots
- landing page screenshots
- card/component screenshots
- article layout screenshots
- dashboard-like screenshots
- visual blocks with typography-heavy layout

It may also be used for:

- screenshots of posters or static cover layouts
- mobile-style UI screenshots
- information-card compositions

It is not intended for:

- pixel-faithful recovery of hidden source code
- recreating inaccessible animation systems from a single static image
- exact recovery of unknown JS logic from a screenshot alone

---

## Core Product Definition

### HTML output

The HTML output is:
- the main deliverable
- high-fidelity
- visually prioritized
- semantic where practical
- editable
- allowed to make reasonable assumptions for unclear details

### Excalidraw output

The Excalidraw output is:
- an editable layout reconstruction
- compatible with Obsidian Excalidraw
- intended for dragging, resizing, regrouping, and manual polish
- as visually faithful as practical within Excalidraw constraints
- **not** a source-code-equivalent webpage
- **not** a full interaction-equivalent output

### CSS snippet output

When Excalidraw output is requested, also generate a matching Obsidian CSS snippet.
The snippet controls how text appears inside Obsidian Excalidraw.
Its main purpose is to support the chosen font, especially the default Chinese reading option:

- `LXGW WenKai Screen / 霞鹜文楷屏幕阅读版`

---

## Mandatory Output Modes

### Mode A — HTML only
Generate:
- `index.html`

### Mode B — Excalidraw only
Generate:
- `layout.excalidraw.md`
- `obsidian-snippets/<font-name>.css`
- `INSTALL-OBSIDIAN-SNIPPET.md`

### Mode C — HTML + Excalidraw
Generate:
- `index.html`
- `layout.excalidraw.md`
- `obsidian-snippets/<font-name>.css`
- `INSTALL-OBSIDIAN-SNIPPET.md`

---

## Reconstruction Philosophy

This skill is intentionally optimized for **high reconstruction quality** rather than heavy system abstraction.
It does not begin by extracting a design system or writing a design reference.
It begins by reconstructing the actual screenshot as faithfully as possible.

The preferred sequence is:

1. visually inspect the screenshot
2. analyze layout, hierarchy, spacing, color, type, components, and likely states
3. generate HTML when requested
4. derive Excalidraw layout from the same understanding when requested
5. generate the matching Obsidian font snippet when Excalidraw is requested

Do not weaken HTML fidelity in order to over-normalize the system.

---

## HTML Branch Instructions

When HTML output is requested, use the reconstruction logic in `prompts/clone-fast.prompt.md`.

### HTML goals

- maximize visual similarity
- preserve layout rhythm
- preserve hierarchy and spacing
- preserve typography scale and contrast
- infer likely hover/focus states when reasonable
- keep code editable and understandable
- use modern CSS
- output a complete, runnable HTML file

### HTML requirements

The generated HTML should:
- be a full document
- contain inline `<style>`
- include light `<script>` only if truly needed
- use semantic HTML where practical
- include responsive adaptation when reasonably inferable
- include accessible labels or alt text when possible
- include comments only when useful

### HTML-specific tolerance

Reasonable assumptions are allowed.
You do not need to halt on every uncertainty.
This skill is allowed to choose the visually most plausible implementation.

---

## Excalidraw Branch Instructions

When Excalidraw output is requested, use the layout conversion logic in `prompts/excalidraw-layout.prompt.md`.

### Excalidraw goals

- preserve overall layout structure
- preserve section grouping
- preserve title/body/button/card/image placeholder hierarchy
- preserve alignment relationships
- preserve spacing rhythm as much as practical
- preserve background blocks and major visual emphasis areas
- remain easy to edit inside Obsidian Excalidraw

### Excalidraw required element types

When possible, represent the layout using:
- frames or large rectangles for sections
- grouped text elements for text areas
- rounded rectangles for cards and buttons
- placeholder rectangles for imagery or media
- labels/badges as separate grouped units
- soft color blocks for major background areas

### Excalidraw limitations

Do not claim that Excalidraw output preserves:
- full responsive behavior
- real hover/focus interactivity
- exact CSS blur and backdrop effects
- complex runtime animation
- exact font rendering parity across all environments

### Excalidraw file shape

The output must be Obsidian-compatible and saved as:
- `layout.excalidraw.md`

---

## Font Handling for Excalidraw

Font handling must only occur **after** the user confirms Excalidraw mode and confirms the font choice.

### Supported font options

1. `LXGW WenKai Screen / 霞鹜文楷屏幕阅读版`
2. `Nunito`
3. `Excalifont`
4. `Comic Shanns`

### Default Excalidraw font policy

If the user does not specify a font and still wants to continue, default to:
- `LXGW WenKai Screen / 霞鹜文楷屏幕阅读版`

### Font mapping implementation

For `LXGW WenKai Screen`, generate a CSS snippet that maps common Excalidraw font-family targets used in Obsidian display to the selected font.

For the other options, generate the corresponding CSS snippet or plain note as appropriate.

---

## Obsidian CSS Snippet Rules

When Excalidraw output is generated, also generate a snippet file under:
- `obsidian-snippets/`

### Required snippet output names

- `obsidian-snippets/excalidraw-lxgw-wenkai-screen.css`
- `obsidian-snippets/excalidraw-nunito.css`
- `obsidian-snippets/excalidraw-excalifont.css`
- `obsidian-snippets/excalidraw-comic-shanns.css`

Generate the one that matches the chosen font.

### Installation instruction file

Always generate:
- `INSTALL-OBSIDIAN-SNIPPET.md`

This file must explain:
- where to put the CSS snippet
- how to enable the snippet in Obsidian
- that the font must exist locally if a local font family is used
- that HTML output is unaffected by the snippet

---

## Execution Order

Follow this sequence strictly.

### If the user has not confirmed output mode
1. ask output mode question
2. wait for answer

### If the user selected HTML only
1. reconstruct screenshot
2. generate `index.html`

### If the user selected Excalidraw only
1. ask font confirmation question
2. wait for answer
3. reconstruct layout
4. generate `layout.excalidraw.md`
5. generate matching snippet
6. generate install instructions

### If the user selected both HTML and Excalidraw
1. ask font confirmation question
2. wait for answer
3. reconstruct screenshot with HTML fidelity priority
4. generate `index.html`
5. derive Excalidraw layout from the same layout understanding
6. generate `layout.excalidraw.md`
7. generate matching snippet
8. generate install instructions

---

## Ambiguity Handling

If the screenshot is unclear:
- prefer visually plausible assumptions
- keep the HTML strong
- keep the Excalidraw layout editable
- do not block progress unless the screenshot is too incomplete to interpret

If the screenshot includes large text in English but the intended editing context is Chinese:
- preserve the visual hierarchy
- adapt line height and spacing to Chinese readability if appropriate
- do not over-tighten Chinese tracking

---

## Success Criteria

A successful run should satisfy all of the following:

### HTML success
- visually close to the screenshot
- editable
- runnable
- maintains hierarchy and spacing rhythm

### Excalidraw success
- visually recognizable as the same layout
- easy to drag and modify in Obsidian
- preserves core grouping and emphasis
- uses the confirmed font strategy

### Workflow success
- output mode was confirmed first
- Excalidraw font was confirmed before generation
- generated files match the requested mode exactly

---

## Included Prompts and Templates

This skill uses:
- `prompts/clone-fast.prompt.md`
- `prompts/excalidraw-layout.prompt.md`
- `prompts/mode-confirmation.prompt.md`
- `prompts/font-confirmation.prompt.md`
- `prompts/output-policy.prompt.md`

It also includes:
- `templates/excalidraw-md.template.md`
- `templates/install-font-snippet.md`
- `templates/html-output-notes.md`
- font snippets under `templates/`

---

## Summary

This is a reconstruction-first skill.
It always confirms output mode first.
If Excalidraw is requested, it always confirms font before generating the Excalidraw file.
HTML is the primary fidelity path.
Excalidraw is the editable layout companion for Obsidian.
