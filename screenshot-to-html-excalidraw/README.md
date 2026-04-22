# screenshot-to-html-excalidraw

一个专门用于**网页截图高保真复刻**的 Skill，默认支持两类产物：

- `index.html`：高还原、可运行、可继续修改的网页文件
- `layout.excalidraw.md`：兼容 Obsidian Excalidraw 的可编辑排版稿

如果生成 Excalidraw，还会同步生成：

- `obsidian-snippets/<font-name>.css`
- `INSTALL-OBSIDIAN-SNIPPET.md`

## 这个 Skill 解决什么问题

你可能会遇到两类需求：

1. 想把一张网页截图尽量复刻成 HTML
2. 想把同一个页面同时做成 Obsidian 里可拖拽编辑的 Excalidraw 稿

这个 Skill 的设计目标不是做设计系统抽象，而是把**单张图的还原度**优先做到更高。

## 核心规则

### 规则 1：每次复刻都必须先确认输出模式

不允许直接开始生成，必须先和用户确认：

1. 只生成 HTML
2. 只生成 Excalidraw
3. HTML 和 Excalidraw 都生成

### 规则 2：如果包含 Excalidraw，必须先确认字体

生成 `layout.excalidraw.md` 之前，必须先问用户字体：

1. 霞鹜文楷屏幕阅读版（默认）
2. Nunito
3. Excalifont
4. Comic Shanns

## 输出文件

### 模式 A：只生成 HTML

输出：

- `index.html`

### 模式 B：只生成 Excalidraw

输出：

- `layout.excalidraw.md`
- `obsidian-snippets/<font-name>.css`
- `INSTALL-OBSIDIAN-SNIPPET.md`

### 模式 C：同时生成 HTML 和 Excalidraw

输出：

- `index.html`
- `layout.excalidraw.md`
- `obsidian-snippets/<font-name>.css`
- `INSTALL-OBSIDIAN-SNIPPET.md`

## 目录结构

```text
screenshot-to-html-excalidraw/
├─ SKILL.md
├─ README.md
├─ LICENSE
├─ .gitignore
├─ prompts/
│  ├─ clone-fast.prompt.md
│  ├─ excalidraw-layout.prompt.md
│  ├─ mode-confirmation.prompt.md
│  ├─ font-confirmation.prompt.md
│  └─ output-policy.prompt.md
├─ templates/
│  ├─ excalidraw-md.template.md
│  ├─ install-font-snippet.md
│  ├─ html-output-notes.md
│  ├─ obsidian-font-lxgw-wenkai-screen.css
│  ├─ obsidian-font-nunito.css
│  ├─ obsidian-font-excalifont.css
│  └─ obsidian-font-comic-shanns.css
├─ examples/
│  ├─ example-request-html.md
│  ├─ example-request-excalidraw.md
│  ├─ example-request-both.md
│  └─ example-font-confirmation.md
├─ references/
│  ├─ excalidraw-font-notes.md
│  ├─ obsidian-compatibility-notes.md
│  └─ design-boundaries.md
├─ scripts/
│  └─ README.md
└─ assets/
   └─ README.md
```

## 使用方式

### 第一步：用户发截图

例如：

- “帮我复刻这个页面”
- “把这个截图转成网页”
- “把这个页面同时做成 HTML 和 Excalidraw”

### 第二步：先确认输出模式

Skill 必须先问：

> 在开始复刻前，请先确认输出方式：
> 1. 只生成 HTML
> 2. 只生成 Excalidraw
> 3. HTML 和 Excalidraw 都生成
> 请直接回复数字或对应文字。

### 第三步：如果包含 Excalidraw，再确认字体

> 即将生成 Excalidraw 可编辑排版稿，请先确认字体：
> 1. 霞鹜文楷屏幕阅读版（默认，适合中文阅读）
> 2. Nunito（中性清爽）
> 3. Excalifont（手绘草图感）
> 4. Comic Shanns（技术/代码感）
> 请直接回复数字或字体名。

### 第四步：生成文件

- HTML 走高保真主路径
- Excalidraw 走可编辑排版稿路径
- 如果有 Excalidraw，同时生成对应字体的 CSS snippet

## HTML 与 Excalidraw 的关系

### HTML

HTML 是主产物，目标是：

- 尽量像
- 尽量可运行
- 尽量保留布局、字体层级、颜色和间距节奏

### Excalidraw

Excalidraw 是副产物，目标是：

- 在 Obsidian 里自由拖拽
- 调整模块顺序
- 修改排版关系
- 保留标题、正文、按钮、卡片、图片区块、背景块等结构

它不是网页源码等价物，也不负责完整交互。

## 关于字体

默认推荐 Excalidraw 在 Obsidian 中使用：

- `LXGW WenKai Screen / 霞鹜文楷屏幕阅读版`

这个字体不是 Excalidraw 原生内置字体，因此通过 Obsidian CSS snippet 实现显示映射。

## 最适合的使用场景

- 营销页截图转网页
- 科技风页面复刻
- 卡片/专题页复刻
- 图文封面转可编辑版式
- 需要在 Obsidian 里进一步拖拽微调的排版任务

## 不适合的场景

- 从单张静态图恢复真实源代码
- 完整恢复复杂运行时交互
- 完整复刻 CSS 级模糊、动画、响应式状态机

## 建议

如果你的首要目标是“像”，优先看 HTML。
如果你的首要目标是“后续继续拖拽和改排版”，同时生成 Excalidraw。
