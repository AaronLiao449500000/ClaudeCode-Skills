#!/usr/bin/env node
import { spawn } from "node:child_process";
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

function run(command, args, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed with code ${code}`));
    });
  });
}

async function main() {
  const args = parseArgs(process.argv);
  const url = args.url;
  const image = args.image;
  const outDir = path.resolve(args.out || "./output/clone-run");

  if (!url && !image) {
    throw new Error("Provide --url or --image");
  }

  await fs.mkdir(outDir, { recursive: true });

  if (url) {
    await run("node", ["./scripts/capture-page.js", "--url", url, "--out", outDir]);
    await run("node", ["./scripts/extract-style-map.js", "--page-data", path.join(outDir, "page-data.json"), "--out", outDir]);
    await run("node", ["./scripts/build-clone-html.js", "--style-map", path.join(outDir, "style-map.json"), "--page-data", path.join(outDir, "page-data.json"), "--out", outDir]);
  } else {
    await run("python3", ["./scripts/analyze-screenshot.py", "--image", image, "--out", outDir]);
    await run("node", ["./scripts/extract-style-map.js", "--image-meta", path.join(outDir, "image-meta.json"), "--out", outDir]);
    await run("node", ["./scripts/build-clone-html.js", "--style-map", path.join(outDir, "style-map.json"), "--out", outDir]);
  }
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
