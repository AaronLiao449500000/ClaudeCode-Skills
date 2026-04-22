#!/usr/bin/env node
import { chromium } from "playwright";
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

function uniqueStrings(values) {
  return Array.from(new Set(values.filter(Boolean).map((v) => String(v).trim()).filter(Boolean)));
}

async function main() {
  const args = parseArgs(process.argv);
  const url = args.url;
  const outDir = args.out || "./output/capture";
  const timeout = Number(args.timeout || 45000);
  const width = Number(args.width || 1440);
  const height = Number(args.height || 1200);

  if (!url) {
    throw new Error("Missing --url");
  }

  await fs.mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1
  });

  await page.goto(url, {
    waitUntil: "networkidle",
    timeout
  });

  await page.screenshot({
    path: path.join(outDir, "page.png"),
    fullPage: true
  });

  const data = await page.evaluate(() => {
    const sampleStyle = (element) => {
      const style = window.getComputedStyle(element);
      return {
        color: style.color,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        paddingTop: style.paddingTop,
        paddingRight: style.paddingRight,
        paddingBottom: style.paddingBottom,
        paddingLeft: style.paddingLeft,
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
        display: style.display,
        position: style.position,
        gap: style.gap,
        maxWidth: style.maxWidth,
        width: style.width,
        textAlign: style.textAlign,
        opacity: style.opacity
      };
    };

    const rectData = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      };
    };

    const collectText = (selector, limit = 20) => {
      return Array.from(document.querySelectorAll(selector))
        .slice(0, limit)
        .map((el) => ({
          text: (el.textContent || "").trim().replace(/\s+/g, " "),
          tag: el.tagName.toLowerCase(),
          rect: rectData(el),
          style: sampleStyle(el)
        }))
        .filter((item) => item.text);
    };

    const headingSamples = collectText("h1,h2,h3,h4,h5,h6", 30);
    const paragraphSamples = collectText("p,li", 40);
    const buttonSamples = Array.from(document.querySelectorAll("button, a, [role='button'], input[type='button'], input[type='submit']"))
      .slice(0, 30)
      .map((el) => ({
        text: (el.textContent || el.getAttribute("value") || "").trim().replace(/\s+/g, " "),
        tag: el.tagName.toLowerCase(),
        href: el.getAttribute("href") || null,
        role: el.getAttribute("role") || null,
        rect: rectData(el),
        style: sampleStyle(el)
      }))
      .filter((item) => item.text || item.href);

    const imageSamples = Array.from(document.querySelectorAll("img"))
      .slice(0, 30)
      .map((el) => ({
        alt: el.getAttribute("alt") || "",
        src: el.getAttribute("src") || "",
        rect: rectData(el)
      }));

    const navSamples = Array.from(document.querySelectorAll("nav, header"))
      .slice(0, 10)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 300),
        rect: rectData(el),
        style: sampleStyle(el)
      }));

    const sectionSamples = Array.from(document.querySelectorAll("main section, section, article, aside, footer"))
      .slice(0, 30)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        className: el.className || "",
        id: el.id || "",
        rect: rectData(el),
        style: sampleStyle(el)
      }));

    const bodyStyle = sampleStyle(document.body);
    const bodyRect = rectData(document.body);

    const allText = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,a,button,span"))
      .map((el) => (el.textContent || "").trim().replace(/\s+/g, " "))
      .filter(Boolean)
      .slice(0, 500);

    const fonts = uniqueStrings(
      Array.from(document.querySelectorAll("*"))
        .slice(0, 500)
        .map((el) => window.getComputedStyle(el).fontFamily)
    );

    const colors = uniqueStrings(
      Array.from(document.querySelectorAll("*"))
        .slice(0, 600)
        .flatMap((el) => {
          const style = window.getComputedStyle(el);
          return [
            style.color,
            style.backgroundColor,
            style.borderColor
          ];
        })
    ).slice(0, 100);

    return {
      meta: {
        url: location.href,
        title: document.title,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        pageHeight: document.documentElement.scrollHeight
      },
      body: {
        rect: bodyRect,
        style: bodyStyle
      },
      headings: headingSamples,
      paragraphs: paragraphSamples,
      buttons: buttonSamples,
      images: imageSamples,
      nav: navSamples,
      sections: sectionSamples,
      fonts,
      colors,
      textSample: allText.slice(0, 80)
    };

    function uniqueStrings(arr) {
      return Array.from(new Set(arr.filter(Boolean).map((v) => String(v).trim()).filter(Boolean)));
    }
  });

  await fs.writeFile(
    path.join(outDir, "page-data.json"),
    JSON.stringify(data, null, 2),
    "utf8"
  );

  await browser.close();

  console.log(JSON.stringify({
    ok: true,
    outDir,
    files: [
      path.join(outDir, "page.png"),
      path.join(outDir, "page-data.json")
    ]
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
