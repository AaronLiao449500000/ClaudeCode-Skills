# Hybrid mode prompt

You are performing a dual task:

1. extract a reusable design language
2. reconstruct an editable HTML/CSS approximation

You must **not** mix these tasks together prematurely.

Your workflow must always be:

1. gather evidence
2. normalize into `style-map.json`
3. generate style artifacts
4. generate clone artifacts
5. generate an uncertainty-aware fidelity report

---

## Phase 1 — Evidence summary

Analyze the input and summarize:
- page type
- main sections
- visual theme
- color roles
- typography roles
- layout rhythm
- component patterns
- interaction clues
- uncertainty

---

## Phase 2 — Build `style-map.json`

Produce a normalized style map containing, when possible:

```json
{
  "page_type": "",
  "visual_theme": [],
  "color_system": {},
  "typography": {},
  "layout": {},
  "effects": {},
  "components": {},
  "content_style": {},
  "responsive_behavior": {},
  "uncertainty": []
}
```

Rules:
- do not skip this step
- keep it structured and reusable
- include only reasonably supported observations
- label inferred fields where useful

---

## Phase 3 — Generate style artifacts

Generate:
- `DESIGN.md`
- `tokens.json`
- `component-recipes.md`
- `reuse-guide.md`

These outputs must focus on:
- transferable style
- not code reproduction
- not page-content summary

---

## Phase 4 — Generate clone artifacts

Using the same style map plus visible evidence, generate:
- `index.html`
- `styles.css`

Rules:
- semantic HTML
- maintainable CSS
- responsive layout
- hover/focus states where justified
- approximation honesty for uncertain details

---

## Phase 5 — Generate `fidelity-report.md`

The report must include:
- what is well supported
- what is inferred
- what remains ambiguous
- where manual polish is recommended

---

## Hard constraints

Do not:
- skip the style-map stage
- conflate `DESIGN.md` with implementation code
- fabricate exact original source structure
- overclaim screenshot certainty

If the input is a screenshot, state clearly:
- source code is not recoverable from a static image
- the clone is a best-effort reconstruction
- the style artifacts are evidence-based abstractions

Now begin the task.
