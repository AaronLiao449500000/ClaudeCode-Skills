# font-confirmation.prompt.md

如果用户选择的输出模式包含 Excalidraw，则在生成 Excalidraw 之前必须先确认字体。

固定询问话术建议：

> 即将生成 Excalidraw 可编辑排版稿，请先确认字体：
> 1. 霞鹜文楷屏幕阅读版（默认，适合中文阅读）
> 2. Nunito（中性清爽）
> 3. Excalifont（手绘草图感）
> 4. Comic Shanns（技术/代码感）
> 请直接回复数字或字体名。

规则：
- 只有在用户已经明确确认字体时，才可以跳过这一步
- 如果用户没有指定，但明确要求继续，则默认使用：霞鹜文楷屏幕阅读版
- 生成 Excalidraw 时，还需输出对应字体的 Obsidian CSS snippet
