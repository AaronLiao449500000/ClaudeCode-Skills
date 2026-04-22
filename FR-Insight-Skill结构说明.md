# FR-Insight Skill 文件结构

```
.claude/skills/fr-insight/
│
├── SKILL.md                              # 主指令文件（1432行）
│                                         # Skill 入口，定义完整工作流：
│                                         # - 输入检测与模式判定（A/B/C 三种模式）
│                                         # - Phase 1: 并行数据提取（5 个 Agent-Scout）
│                                         # - Phase 2: 深度分析（Wave 1 + Wave 2）
│                                         # - Phase 3: HTML 看板生成
│                                         # - Phase 4: 交付与摘要输出
│                                         # - 每个 Agent 的完整 Prompt 模板
│
├── references/                           # 分析参考文档
│   ├── analysis-framework.md             # 分析方法论框架（723行）
│   │                                     # 10 节：盈利能力、杜邦分解、成长性、
│   │                                     # 现金流、资产负债表、估值、行业对标、
│   │                                     # 风险评估、投资评级、投资论点
│   │
│   ├── us-stock-guide.md                 # 美股财报分析指南（573行）
│   │                                     # 10-K/10-Q 结构、US GAAP 科目映射、
│   │                                     # SEC 披露规则、美股特有指标
│   │
│   └── hk-stock-guide.md                 # 港股财报分析指南（648行）
│                                         # 年报/中期报告结构、IFRS 科目映射、
│                                         # 港交所披露规则、港股特有指标
│
└── templates/                            # 前端模板
    └── dashboard-template.html           # 交互式看板模板（2792行）
                                          # 单文件 HTML（内联 ECharts + Tailwind）
                                          # 两个 Tab：专业分析 + 白话解读
                                          # DATA 对象由 Agent 填充后输出
```

> 抓取来源：https://vcn5y6q5vxhe.feishu.cn/wiki/XdP1waNUti7bSpkVrvlcoCvXnHf
> 保存时间：2026年3月30日
