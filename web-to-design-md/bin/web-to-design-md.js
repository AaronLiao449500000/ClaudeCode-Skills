#!/usr/bin/env node
import { spawn } from "node:child_process";
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

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed with code ${code}`));
    });
  });
}

async function main() {
  const args = parseArgs(process.argv);
  const mode = args.mode;
  const url = args.url;
  const image = args.image;
  const out = args.out || "./output/default-run";

  if (!mode || !["clone", "style", "hybrid"].includes(mode)) {
    throw new Error("Use --mode clone|style|hybrid");
  }

  if (!url && !image) {
    throw new Error("Provide --url or --image");
  }

  const runner = {
    clone: "./scripts/run-clone.js",
    style: "./scripts/run-style.js",
    hybrid: "./scripts/run-hybrid.js"
  }[mode];

  const runnerArgs = [runner, "--out", out];
  if (url) runnerArgs.push("--url", url);
  if (image) runnerArgs.push("--image", image);

  await run("node", runnerArgs);
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
