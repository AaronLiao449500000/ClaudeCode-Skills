#!/usr/bin/env node
import process from "node:process";

const CLONE_KEYWORDS = [
  "html", "css", "clone", "rebuild", "recreate", "reconstruction",
  "pixel-perfect", "editable", "front-end", "frontend",
  "复刻", "还原", "转成html", "转成css", "转前端", "可编辑网页", "高保真"
];

const STYLE_KEYWORDS = [
  "design reference", "design md", "design system", "style guide",
  "visual language", "style extraction", "tokens", "component recipes",
  "提取风格", "设计语言", "风格规范", "风格参考", "design.md", "颜色字体布局组件"
];

function containsAny(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
}

function routeRequest(text) {
  const wantsClone = containsAny(text, CLONE_KEYWORDS);
  const wantsStyle = containsAny(text, STYLE_KEYWORDS);

  if (wantsClone && wantsStyle) return "hybrid";
  if (wantsClone) return "clone";
  if (wantsStyle) return "style";
  return "style";
}

const input = process.argv.slice(2).join(" ").trim();

if (!input) {
  console.error("Usage: node scripts/route-request.js \"your request\"");
  process.exit(1);
}

const mode = routeRequest(input);

const output = {
  input,
  mode,
  reasoning: {
    wantsClone: containsAny(input, CLONE_KEYWORDS),
    wantsStyle: containsAny(input, STYLE_KEYWORDS)
  }
};

console.log(JSON.stringify(output, null, 2));
