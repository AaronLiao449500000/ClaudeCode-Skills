# Example Request: HTML + Excalidraw

用户：

> 这个页面我想同时要 html 和 Excalidraw

如果用户已经明确给出双输出，可以跳过模式追问。

接着 Skill 必须问字体：

> 即将生成 Excalidraw 可编辑排版稿，请先确认字体：
> 1. 霞鹜文楷屏幕阅读版（默认，适合中文阅读）
> 2. Nunito（中性清爽）
> 3. Excalifont（手绘草图感）
> 4. Comic Shanns（技术/代码感）
> 请直接回复数字或字体名。

然后生成：

- `index.html`
- `layout.excalidraw.md`
- `obsidian-snippets/<font-name>.css`
- `INSTALL-OBSIDIAN-SNIPPET.md`
