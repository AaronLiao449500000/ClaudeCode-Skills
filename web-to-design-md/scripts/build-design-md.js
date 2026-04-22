#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        args[key] = true;
      } else {
        args[key] = next;
        i += 1;
      }
    }
  }
  return args;
}

async function loadJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function mdList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function buildDesignMd(styleMap) {
  const colors = styleMap.color_system;
  const typo = styleMap.typography;
  const layout = styleMap.layout;
  const effects = styleMap.effects;
  const components = styleMap.components;
  const theme = styleMap.visual_theme.join(", ");

  const doList = [
    `Preserve the ${theme} mood across all major sections.`,
    `Keep section spacing near ${layout.section_spacing} unless the content is unusually dense.`,
    `Use ${colors.accent} sparingly for emphasis, not for every decorative element.`
  ];

  const dontList = [
    "Do not collapse the spacing rhythm into tight, crowded blocks.",
    "Do not introduce multiple competing accent colors.",
    "Do not mix highly ornamental components into an otherwise restrained system."
  ];

  const promptGuide = [
    `Create a landing page with a ${theme} visual language, using ${layout.container_max_width} containers, ${colors.background} page backgrounds, ${colors.accent} as the primary accent, and restrained section-based hierarchy.`,
    `Write an article page in this style with wide spacing, a disciplined heading scale, surfaces that stay close to ${colors.surface}, and strong clarity between primary and secondary text.`,
    `Generate a card-based page using this design system. Keep buttons around ${components.buttons.padding_hint}, preserve rounded corners near ${components.buttons.radius}, and keep the overall visual density controlled.`
  ];

  return `# DESIGN.md

## 1. Visual Theme & Atmosphere
- Overall mood: ${theme}
- Information density: ${styleMap.content_style.text_density}
- Brand signals: controlled visual hierarchy, reusable sections, component consistency
- Visual keywords: ${theme}
- Confidence level: ${styleMap.source_type === "page" ? "medium-high" : "medium, image-derived"}

## 2. Color System
- Background: ${colors.background}
- Surface: ${colors.surface}
- Primary text: ${colors.text_primary}
- Secondary text: ${colors.text_secondary}
- Accent: ${colors.accent}
- Border / divider: ${colors.border}
- CTA emphasis: rely on the accent color plus contrast rather than excessive decoration
- Semantic colors: not strongly evidenced; add only if product context requires them
- Notes: color usage should be role-based and restrained. Accent should stay purposeful.

## 3. Typography
- Primary font stack: ${typo.display.font_family}
- Display style: ${typo.display.font_size} / ${typo.display.font_weight} / line-height ${typo.display.line_height}
- Body style: ${typo.body.font_size} / ${typo.body.font_weight} / line-height ${typo.body.line_height}
- Label / badge style: compact, high-contrast, and spacing-aware
- Line-height tendencies: display stays tight; body copy stays readable and slightly looser
- Letter-spacing tendencies: display ${typo.display.letter_spacing}; body ${typo.body.letter_spacing}
- Chinese localization notes: if the original is English-first, expand line-height modestly for Chinese paragraphs and avoid overly tight tracking on body text.

## 4. Layout Principles
- Container width: ${layout.container_max_width}
- Grid behavior: ${layout.grid_columns} columns inferred
- Section spacing: ${layout.section_spacing}
- Card spacing: moderate, consistent, and visually breathable
- Alignment rules: ${layout.alignment}
- Density rules: keep major hierarchy clear before adding secondary detail
- Notes: preserve macro spacing first; fine spacing can be tuned later.

## 5. Component Recipes
### Buttons
- Visual signature: strong CTA contrast with a restrained base system
- Radius: ${components.buttons.radius}
- Padding: ${components.buttons.padding_hint}
- Weight: medium to semibold
- State behavior: subtle hover lift or tone shift; avoid dramatic motion

### Cards
- Visual signature: structured surfaces with controlled separation
- Surface behavior: reuse page surface or slightly elevated surface
- Padding: medium to generous depending on density
- Border / shadow: ${components.cards.shadow}
- Notes: radius tends toward ${components.cards.radius}

### Navigation
- Visual signature: quiet framing for top-level movement
- Spacing: comfortable, not compressed
- State behavior: use contrast or underline cues, not heavy ornament
- Notes: present = ${components.navigation.present}

### Other recurring components
- Component: badges / labels
- Signature: compact containers, strong hierarchy support, small-but-intentional emphasis
- Notes: keep them secondary to the headline and CTA structure

## 6. Depth & Effects
- Shadows: ${effects.shadow}
- Borders: use ${colors.border} for restraint and structure
- Blur: ${effects.blur}
- Gradient: ${effects.gradient}
- Overlay: use sparingly
- Motion: fast, minimal, state-oriented transitions
- Notes: the system works best when depth is subtle rather than theatrical.

## 7. Content Style
- Headline style: short, assertive, and visually separated from the supporting body
- Body copy style: clear and controlled rather than dense by default
- CTA tone: direct and explicit
- Label usage: supportive, not dominant
- Media role: ${styleMap.content_style.media_usage}
- Information hierarchy: large-to-small, with spacing doing significant hierarchy work
- Notes: preserve clarity over cleverness.

## 8. Do / Don't
### Do
${mdList(doList)}

### Don't
${mdList(dontList)}

## 9. Responsive Behavior
- Desktop: preserve wide spacing and full section rhythm
- Tablet: reduce section spacing and simplify multi-column density
- Mobile: stack sections vertically and compress padding without flattening hierarchy
- Collapse strategy: preserve CTA visibility while simplifying layout
- Compression strategy: reduce space before reducing clarity
- Notes: typography should compress less aggressively than gutters.

## 10. Prompt Guide
### Prompt 1 — recreate a page in this style
${promptGuide[0]}

### Prompt 2 — apply this style to a new article
${promptGuide[1]}

### Prompt 3 — apply this style to a card-based landing page
${promptGuide[2]}
`;
}

function buildTokens(styleMap) {
  const colors = styleMap.color_system;
  const typo = styleMap.typography;
  const layout = styleMap.layout;
  const radius = styleMap.effects.radius_scale || ["8px", "12px", "20px", "999px"];

  return {
    colors: {
      background: colors.background,
      surface: colors.surface,
      surface_alt: colors.surface,
      text_primary: colors.text_primary,
      text_secondary: colors.text_secondary,
      accent: colors.accent,
      border: colors.border,
      success: "",
      warning: "",
      danger: ""
    },
    typography: {
      font_family_display: typo.display.font_family,
      font_family_body: typo.body.font_family,
      font_family_mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      h1: {
        size: typo.display.font_size,
        weight: typo.display.font_weight,
        line_height: typo.display.line_height,
        letter_spacing: typo.display.letter_spacing
      },
      h2: {
        size: "40px",
        weight: "700",
        line_height: "1.15",
        letter_spacing: typo.display.letter_spacing
      },
      body: {
        size: typo.body.font_size,
        weight: typo.body.font_weight,
        line_height: typo.body.line_height,
        letter_spacing: typo.body.letter_spacing
      },
      caption: {
        size: "13px",
        weight: "500",
        line_height: "1.4",
        letter_spacing: "0.01em"
      }
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "40px",
      section: styleMap.layout.section_spacing
    },
    radius: {
      sm: radius[0] || "8px",
      md: radius[1] || "12px",
      lg: radius[2] || "20px",
      pill: radius.find((r) => String(r).includes("999")) || "999px"
    },
    shadows: {
      sm: "0 2px 10px rgba(0,0,0,0.06)",
      md: "0 10px 30px rgba(0,0,0,0.08)",
      lg: styleMap.effects.shadow
    },
    borders: {
      default: `1px solid ${colors.border}`,
      strong: `1px solid ${colors.text_primary}`
    },
    motion: {
      fast: "120ms",
      normal: "180ms",
      slow: "280ms",
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
    },
    layout: {
      container_max: layout.container_max_width,
      content_max: layout.content_max_width,
      grid_columns: layout.grid_columns
    }
  };
}

function buildComponentRecipes(styleMap) {
  const components = styleMap.components;
  return `# component-recipes.md

## Buttons
- Role: primary action and secondary conversion support
- Visual signature: prominent contrast with restrained surrounding UI
- Radius: ${components.buttons.radius}
- Padding: ${components.buttons.padding_hint}
- Typography: medium to semibold, compact line-height
- State behavior: slight hover tone shift, shadow, or translateY lift
- Implementation notes: avoid oversized buttons unless the page is hero-led

## Cards
- Role: grouped information containers
- Visual signature: controlled elevation and rounded framing
- Radius: ${components.cards.radius}
- Shadow: ${components.cards.shadow}
- Spacing: medium internal padding, consistent vertical rhythm
- Implementation notes: cards should feel like information zones, not ornamental tiles

## Navigation
- Role: orient the user without overpowering the content
- Visual signature: quiet framing, high readability, reserved emphasis
- Present in evidence: ${components.navigation.present}
- State behavior: underline, color emphasis, or subtle opacity change
- Implementation notes: avoid overdecorating nav unless the brand itself is expressive

## Badges and labels
- Role: lightweight metadata emphasis
- Visual signature: compact shape, tight padding, clear contrast
- Typography: small, medium-weight labels
- Implementation notes: use sparingly to support hierarchy, not replace it

## Headline blocks
- Role: establish the primary message quickly
- Visual signature: bold display type with generous surrounding whitespace
- Implementation notes: short lines typically work better than dense multi-line paragraphs
`;
}

function buildReuseGuide(styleMap) {
  const colors = styleMap.color_system;
  const layout = styleMap.layout;

  return `# reuse-guide.md

## How to apply this style to a landing page
- Keep a clear hero section with generous top and bottom spacing.
- Use ${colors.accent} only for CTA emphasis and key directional cues.
- Preserve section rhythm near ${layout.section_spacing} to maintain the same pacing.

## How to apply this style to an article page
- Use a narrower content width around ${layout.content_max_width}.
- Keep headings short and let whitespace do part of the hierarchy work.
- Do not crowd inline callouts or cards around the main body copy.

## How to apply this style to a dashboard or card grid
- Use consistent card radii and restrained shadows.
- Avoid turning every panel into a different visual treatment.
- Keep the grid readable before making it decorative.

## How to apply this style to a cover or hero section
- Pair a strong, concise headline with disciplined supporting text.
- Favor one dominant focal area rather than multiple competing visual anchors.
- Use background and surface contrast more than heavy ornament.

## Common failure modes
- Overusing the accent color until it loses its emphasis function.
- Compressing the spacing system so the page no longer breathes.
- Mixing decorative patterns that fight the system’s original restraint.
`;
}

async function main() {
  const args = parseArgs(process.argv);
  const styleMapPath = args["style-map"];
  const outDir = args.out || "./output/design";

  if (!styleMapPath) {
    throw new Error("Missing --style-map");
  }

  await fs.mkdir(outDir, { recursive: true });

  const styleMap = await loadJson(styleMapPath);
  const designMd = buildDesignMd(styleMap);
  const tokens = buildTokens(styleMap);
  const componentRecipes = buildComponentRecipes(styleMap);
  const reuseGuide = buildReuseGuide(styleMap);

  await fs.writeFile(path.join(outDir, "DESIGN.md"), designMd, "utf8");
  await fs.writeFile(path.join(outDir, "tokens.json"), JSON.stringify(tokens, null, 2), "utf8");
  await fs.writeFile(path.join(outDir, "component-recipes.md"), componentRecipes, "utf8");
  await fs.writeFile(path.join(outDir, "reuse-guide.md"), reuseGuide, "utf8");

  console.log(JSON.stringify({
    ok: true,
    files: [
      path.join(outDir, "DESIGN.md"),
      path.join(outDir, "tokens.json"),
      path.join(outDir, "component-recipes.md"),
      path.join(outDir, "reuse-guide.md")
    ]
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
