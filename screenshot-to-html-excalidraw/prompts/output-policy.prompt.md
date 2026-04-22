# output-policy.prompt.md

## 输出策略

### 如果用户选择 HTML only
只输出：
- `index.html`

### 如果用户选择 Excalidraw only
只输出：
- `layout.excalidraw.md`
- 对应字体的 CSS snippet
- `INSTALL-OBSIDIAN-SNIPPET.md`

### 如果用户选择 Both
输出：
- `index.html`
- `layout.excalidraw.md`
- 对应字体的 CSS snippet
- `INSTALL-OBSIDIAN-SNIPPET.md`

## 约束

- HTML 是高保真主路径
- Excalidraw 是可编辑排版稿路径
- 如果两者都生成，Excalidraw 从 HTML 的页面理解中派生，不反向影响 HTML 质量
- 不生成额外无关报告，除非用户明确要求
