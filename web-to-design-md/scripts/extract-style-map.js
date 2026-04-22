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

function numericPx(value) {
  if (!value || typeof value !== "string") return null;
  const match = value.match(/(-?\d+(\.\d+)?)px/);
  return match ? Number(match[1]) : null;
}

function flatten(values) {
  return values.flat().filter(Boolean);
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function firstOr(values, fallback) {
  return values.find(Boolean) || fallback;
}

function guessPageType(pageData) {
  const title = (pageData?.meta?.title || "").toLowerCase();
  const buttonCount = pageData?.buttons?.length || 0;
  const sectionCount = pageData?.sections?.length || 0;
  const headingCount = pageData?.headings?.length || 0;
  const paragraphCount = pageData?.paragraphs?.length || 0;

  if (title.includes("pricing")) return "pricing-page";
  if (title.includes("docs") || title.includes("documentation")) return "documentation-page";
  if (paragraphCount > 20 && headingCount > 5) return "article-or-documentation";
  if (buttonCount >= 3 && sectionCount >= 4) return "landing-page";
  if (sectionCount <= 2 && buttonCount <= 2) return "component-or-fragment";
  return "general-page";
}

function guessVisualThemeFromPage(pageData) {
  const colors = pageData?.colors || [];
  const hasDark = colors.some((c) => /rgb\(0, 0, 0\)|rgb\(17, 17, 17\)|rgb\(28, 28, 30\)/.test(c));
  const hasWhite = colors.some((c) => /rgb\(255, 255, 255\)/.test(c));
  const bodyBg = pageData?.body?.style?.backgroundColor || "";

  const theme = [];
  if (bodyBg.includes("255, 255, 255")) theme.push("light");
  if (bodyBg.includes("0, 0, 0") || bodyBg.includes("17, 17, 17")) theme.push("dark");
  if (hasWhite && hasDark) theme.push("high-contrast");
  if ((pageData?.sections?.length || 0) >= 4) theme.push("sectioned");
  if ((pageData?.buttons?.length || 0) >= 3) theme.push("cta-driven");
  if ((pageData?.images?.length || 0) >= 3) theme.push("media-supported");

  return theme.length ? unique(theme) : ["minimal", "content-first"];
}

function guessVisualThemeFromImage(imageMeta) {
  const theme = [];
  const tone = imageMeta?.tone_guess;
  if (tone === "dark") theme.push("dark");
  if (tone === "light") theme.push("light");
  if ((imageMeta?.whitespace_ratio || 0) > 0.3) theme.push("spacious");
  if ((imageMeta?.edge_density || 0) > 0.12) theme.push("detail-heavy");
  if ((imageMeta?.section_break_candidates?.length || 0) >= 4) theme.push("sectioned");
  return theme.length ? unique(theme) : ["mixed", "approximate"];
}

function chooseColorSystem(pageData, imageMeta) {
  if (pageData) {
    const bodyBg = pageData?.body?.style?.backgroundColor || "rgb(255, 255, 255)";
    const primaryText = firstOr(
      pageData?.headings?.map((h) => h.style?.color),
      "rgb(17, 17, 17)"
    );
    const secondaryText = firstOr(
      pageData?.paragraphs?.map((p) => p.style?.color).filter((c) => c !== primaryText),
      primaryText
    );
    const accent = firstOr(
      pageData?.buttons?.map((b) => b.style?.backgroundColor).filter((c) => c && !c.includes("0, 0, 0, 0") && !c.includes("rgba(0, 0, 0, 0)")),
      "rgb(0, 113, 227)"
    );
    const border = firstOr(pageData?.colors?.filter((c) => c.includes("rgb(") && !c.includes("255, 255, 255")), "rgba(0, 0, 0, 0.08)");
    return {
      background: bodyBg,
      surface: bodyBg,
      text_primary: primaryText,
      text_secondary: secondaryText,
      accent,
      border
    };
  }

  const palette = imageMeta?.dominant_colors || [];
  return {
    background: palette[0] || "#ffffff",
    surface: palette[1] || palette[0] || "#f5f5f5",
    text_primary: palette[2] || "#111111",
    text_secondary: palette[3] || "#555555",
    accent: palette[4] || "#0a84ff",
    border: palette[5] || "#d9d9d9"
  };
}

function chooseTypography(pageData, imageMeta) {
  if (pageData) {
    const h1 = pageData?.headings?.[0]?.style || {};
    const paragraph = pageData?.paragraphs?.[0]?.style || {};
    const fonts = pageData?.fonts || [];
    return {
      display: {
        font_family: firstOr(fonts, h1.fontFamily || "Inter, system-ui, sans-serif"),
        font_size: h1.fontSize || "56px",
        font_weight: h1.fontWeight || "700",
        line_height: h1.lineHeight || "1.1",
        letter_spacing: h1.letterSpacing || "-0.02em"
      },
      body: {
        font_family: paragraph.fontFamily || firstOr(fonts, "Inter, system-ui, sans-serif"),
        font_size: paragraph.fontSize || "16px",
        font_weight: paragraph.fontWeight || "400",
        line_height: paragraph.lineHeight || "1.6",
        letter_spacing: paragraph.letterSpacing || "normal"
      }
    };
  }

  const tone = imageMeta?.tone_guess || "mixed";
  return {
    display: {
      font_family: "Inter, system-ui, sans-serif",
      font_size: tone === "dark" ? "48px" : "56px",
      font_weight: "700",
      line_height: "1.1",
      letter_spacing: "-0.02em"
    },
    body: {
      font_family: "Inter, system-ui, sans-serif",
      font_size: "16px",
      font_weight: "400",
      line_height: "1.7",
      letter_spacing: "normal"
    }
  };
}

function chooseLayout(pageData, imageMeta) {
  if (pageData) {
    const widths = pageData?.sections?.map((section) => section.rect?.width).filter(Boolean) || [];
    const maxWidth = widths.length ? Math.round(Math.max(...widths)) : 1200;
    const gapSamples = flatten([
      pageData?.headings?.map((item) => numericPx(item?.style?.marginBottom)),
      pageData?.paragraphs?.map((item) => numericPx(item?.style?.marginBottom)),
      pageData?.buttons?.map((item) => numericPx(item?.style?.marginBottom))
    ]).filter((v) => typeof v === "number" && !Number.isNaN(v));

    return {
      container_max_width: `${Math.max(960, Math.min(1440, maxWidth))}px`,
      content_max_width: `${Math.max(720, Math.min(960, maxWidth - 160))}px`,
      section_spacing: `${Math.max(64, Math.min(128, Math.round((Math.max(...(gapSamples.length ? gapSamples : [80]))) + 32)))}px`,
      grid_columns: pageData?.buttons?.length > 4 ? "12" : "8",
      alignment: "centered-content-with-structured-sections"
    };
  }

  const sectionCount = imageMeta?.section_break_candidates?.length || 0;
  return {
    container_max_width: "1200px",
    content_max_width: "820px",
    section_spacing: sectionCount >= 5 ? "96px" : "72px",
    grid_columns: "12",
    alignment: "inferred-from-image"
  };
}

function chooseEffects(pageData, imageMeta) {
  if (pageData) {
    const shadows = pageData?.sections?.map((section) => section.style?.boxShadow).filter((v) => v && v !== "none") || [];
    const radiusSamples = flatten([
      pageData?.buttons?.map((b) => b.style?.borderRadius),
      pageData?.sections?.map((s) => s.style?.borderRadius)
    ]).filter(Boolean);

    return {
      shadow: firstOr(shadows, "0 10px 30px rgba(0, 0, 0, 0.08)"),
      radius_scale: unique(radiusSamples).slice(0, 6),
      blur: "not directly verifiable",
      gradient: "inspect screenshot or rendered page manually"
    };
  }

  return {
    shadow: imageMeta?.tone_guess === "dark" ? "subtle-on-dark" : "soft-elevation",
    radius_scale: ["12px", "20px", "999px"],
    blur: "not verifiable from static metadata",
    gradient: "not verifiable from static metadata"
  };
}

function chooseComponents(pageData, imageMeta) {
  if (pageData) {
    return {
      buttons: {
        count: pageData?.buttons?.length || 0,
        primary_background: firstOr(pageData?.buttons?.map((b) => b.style?.backgroundColor).filter(Boolean), "rgb(0, 113, 227)"),
        radius: firstOr(pageData?.buttons?.map((b) => b.style?.borderRadius).filter(Boolean), "999px"),
        padding_hint: firstOr(pageData?.buttons?.map((b) => [
          b.style?.paddingTop,
          b.style?.paddingRight,
          b.style?.paddingBottom,
          b.style?.paddingLeft
        ].filter(Boolean).join(" ")).filter(Boolean), "12px 22px")
      },
      cards: {
        inferred: (pageData?.sections?.length || 0) >= 4,
        radius: firstOr(pageData?.sections?.map((s) => s.style?.borderRadius).filter(Boolean), "20px"),
        shadow: firstOr(pageData?.sections?.map((s) => s.style?.boxShadow).filter((v) => v && v !== "none"), "none")
      },
      navigation: {
        present: (pageData?.nav?.length || 0) > 0,
        style_hint: firstOr(pageData?.nav?.map((n) => n.style?.backgroundColor).filter(Boolean), "transparent")
      }
    };
  }

  return {
    buttons: {
      count: 0,
      primary_background: imageMeta?.dominant_colors?.[4] || "#0a84ff",
      radius: "999px",
      padding_hint: "12px 22px"
    },
    cards: {
      inferred: TrueIfImageHasSections(imageMeta),
      radius: "20px",
      shadow: imageMeta?.tone_guess === "dark" ? "subtle" : "soft"
    },
    navigation: {
      present: true,
      style_hint: "unknown"
    }
  };
}

function TrueIfImageHasSections(imageMeta) {
  return (imageMeta?.section_break_candidates?.length || 0) >= 3;
}

async function loadJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function main() {
  const args = parseArgs(process.argv);
  const pageDataPath = args["page-data"];
  const imageMetaPath = args["image-meta"];
  const outDir = args.out || "./output/style-map";

  if (!pageDataPath && !imageMetaPath) {
    throw new Error("Provide --page-data or --image-meta");
  }

  await fs.mkdir(outDir, { recursive: true });

  const pageData = pageDataPath ? await loadJson(pageDataPath) : null;
  const imageMeta = imageMetaPath ? await loadJson(imageMetaPath) : null;

  const sourceType = pageData ? "page" : "image";
  const pageType = pageData ? guessPageType(pageData) : "image-derived-page";
  const visualTheme = pageData ? guessVisualThemeFromPage(pageData) : guessVisualThemeFromImage(imageMeta);

  const styleMap = {
    source_type: sourceType,
    page_type: pageType,
    visual_theme: visualTheme,
    color_system: chooseColorSystem(pageData, imageMeta),
    typography: chooseTypography(pageData, imageMeta),
    layout: chooseLayout(pageData, imageMeta),
    effects: chooseEffects(pageData, imageMeta),
    components: chooseComponents(pageData, imageMeta),
    content_style: {
      heading_density: pageData ? ((pageData?.headings?.length || 0) > 6 ? "dense" : "controlled") : "inferred",
      text_density: pageData ? ((pageData?.paragraphs?.length || 0) > 12 ? "high" : "medium") : "unknown",
      media_usage: pageData ? ((pageData?.images?.length || 0) > 4 ? "strong" : "limited") : "unknown"
    },
    responsive_behavior: {
      likely_stack_on_mobile: true,
      likely_spacing_compression: true,
      likely_nav_simplification: (pageData?.nav?.length || 0) > 0
    },
    uncertainty: sourceType === "image"
      ? [
          "No DOM evidence is available.",
          "Typography, spacing, and component boundaries are inferred from image-level evidence.",
          "Interaction behavior is not directly recoverable."
        ]
      : [
          "Computed styles are sampled from visible nodes, not every state or breakpoint.",
          "Hidden interactions and JS-driven states may still require manual review."
        ]
  };

  const styleMapPath = path.join(outDir, "style-map.json");
  await fs.writeFile(styleMapPath, JSON.stringify(styleMap, null, 2), "utf8");

  console.log(JSON.stringify({
    ok: true,
    file: styleMapPath
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
