# web-to-design-md

Turn webpages or screenshots into either:

1. **high-fidelity HTML/CSS approximations**, or  
2. **reusable design-system references** (`DESIGN.md`, tokens, component recipes), or  
3. **both** in one run.

This repository is designed as a **GitHub-uploadable skill package**. It includes:

- routing rules
- complete prompts
- templates
- CLI scripts
- Playwright-based webpage capture
- screenshot metadata analysis
- style-map extraction
- `DESIGN.md` generation
- HTML/CSS clone generation

It is intentionally built around **three modes**:

- `clone` → reconstruct HTML/CSS
- `style` → extract reusable visual language
- `hybrid` → do both

---

## What this project is for

Use this project when a user says things like:

- “把这个页面转成 HTML/CSS”
- “按这个截图复刻一个可编辑网页”
- “提取这个页面的设计风格”
- “生成类似 getdesign 的 design reference”
- “我要既复刻，又拆成风格规范”

This repository does **not** claim pixel-perfect recovery of original source code from screenshots.  
For screenshots, the output is a **visual approximation** guided by structured analysis.

---

## Output contracts

### `clone` mode
Outputs:

- `page-data.json` or `image-meta.json`
- `style-map.json`
- `index.html`
- `styles.css`
- `fidelity-report.md`

### `style` mode
Outputs:

- `page-data.json` or `image-meta.json`
- `style-map.json`
- `DESIGN.md`
- `tokens.json`
- `component-recipes.md`
- `reuse-guide.md`

### `hybrid` mode
Outputs everything in both modes.

---

## Repository structure

```txt
web-to-design-md/
├─ SKILL.md
├─ README.md
├─ LICENSE
├─ package.json
├─ requirements.txt
├─ .gitignore
├─ bin/
│  └─ web-to-design-md.js
├─ prompts/
│  ├─ clone.prompt.md
│  ├─ style.prompt.md
│  └─ hybrid.prompt.md
├─ templates/
│  ├─ DESIGN.template.md
│  ├─ tokens.template.json
│  ├─ fidelity-report.template.md
│  └─ reuse-guide.template.md
├─ references/
│  └─ design-md-notes.md
├─ scripts/
│  ├─ route-request.js
│  ├─ capture-page.js
│  ├─ analyze-screenshot.py
│  ├─ extract-style-map.js
│  ├─ build-design-md.js
│  ├─ build-clone-html.js
│  ├─ run-clone.js
│  ├─ run-style.js
│  └─ run-hybrid.js
├─ examples/
│  ├─ example-clone-request.md
│  ├─ example-style-request.md
│  └─ example-hybrid-request.md
└─ output/
   └─ .gitkeep
```

---

## Install

### 1. Node dependencies
```bash
npm install
npx playwright install
```

### 2. Python dependency
```bash
pip install -r requirements.txt
```

---

## CLI usage

### Route a request
```bash
node scripts/route-request.js "把这个页面转成css并尽量还原"
```

### Clone a webpage
```bash
node scripts/run-clone.js --url "https://example.com" --out "./output/example-clone"
```

### Extract style from a webpage
```bash
node scripts/run-style.js --url "https://example.com" --out "./output/example-style"
```

### Run hybrid mode on a webpage
```bash
node scripts/run-hybrid.js --url "https://example.com" --out "./output/example-hybrid"
```

### Extract style from a screenshot
```bash
python3 scripts/analyze-screenshot.py --image "./mockups/landing-page.png" --out "./output/from-image"
node scripts/extract-style-map.js --image-meta "./output/from-image/image-meta.json" --out "./output/from-image"
node scripts/build-design-md.js --style-map "./output/from-image/style-map.json" --out "./output/from-image"
```

---

## How the pipeline works

### A. URL input
1. `capture-page.js`
   - opens the page with Playwright
   - captures full-page screenshot
   - extracts visible text, headings, buttons, links, forms, images
   - samples computed styles from key elements
   - writes `page-data.json`

2. `extract-style-map.js`
   - converts raw page evidence into `style-map.json`

3. One of:
   - `build-design-md.js`
   - `build-clone-html.js`
   - both

### B. Screenshot input
1. `analyze-screenshot.py`
   - extracts image dimensions
   - dominant colors
   - brightness profile
   - whitespace estimate
   - edge density
   - section-break heuristics
   - writes `image-meta.json`

2. `extract-style-map.js`
   - turns image metadata into a reusable style map

3. One of:
   - `build-design-md.js`
   - `build-clone-html.js`
   - both

---

## Routing logic

The router is intentionally deterministic.

### Send to `clone`
If the request mentions:
- html
- css
- clone
- reconstruct
- rebuild
- recreate
- pixel-perfect
- 可编辑网页
- 复刻
- 还原
- 转成前端

### Send to `style`
If the request mentions:
- design reference
- design md
- design system
- visual language
- style guide
- 提取风格
- 拆设计
- 设计语言
- 风格规范
- 颜色字体布局组件

### Send to `hybrid`
If both intents are present.

---

## Important limits

### For webpages
This project can collect real DOM evidence and computed style evidence.  
That makes webpage mode substantially stronger than image-only mode.

### For screenshots
This project cannot recover original source code or true interaction logic from a static image.  
Outputs are **approximate reconstructions** and should be reviewed manually.

### For dynamic experiences
Complex WebGL, canvas, video-heavy scenes, or JS state machines will not be faithfully reconstructed without additional custom work.

---

## Recommended GitHub positioning

Recommended one-line description:

> Extract reusable design systems and high-fidelity HTML/CSS approximations from webpages or screenshots.

---

## Recommended next upgrades

If you want to turn this from a solid skill package into a stronger engineering project, add:

1. an LLM bridge that consumes `style-map.json`
2. DOM-to-component clustering
3. better image block segmentation
4. framework outputs (React / Tailwind / Vue)
5. visual regression snapshots

---

## Example workflow for an AI skill

1. User asks for a result.
2. The skill routes into `clone`, `style`, or `hybrid`.
3. Scripts collect evidence.
4. The appropriate prompt is applied.
5. Templates and builders generate output artifacts.
6. The user gets either code, a design reference, or both.
