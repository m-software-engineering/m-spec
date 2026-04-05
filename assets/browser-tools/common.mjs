#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";

const stateDir = path.join(process.cwd(), ".m-spec", "state");
const stateFile = path.join(stateDir, "browser.json");

export async function requirePuppeteer() {
  try {
    return await import("puppeteer-core");
  } catch {
    console.error("Browser tools require optional dependency `puppeteer-core`. Install it in the repository to use this feature.");
    process.exit(1);
  }
}

export async function loadState() {
  try {
    return JSON.parse(await readFile(stateFile, "utf8"));
  } catch {
    return undefined;
  }
}

export async function saveState(state) {
  await mkdir(stateDir, { recursive: true });
  await writeFile(stateFile, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

export async function detectBrowserBinary() {
  const candidates = ["google-chrome", "chromium", "chromium-browser", "brave-browser"];
  for (const candidate of candidates) {
    try {
      const output = execFileSync("which", [candidate], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
      if (output) {
        return output;
      }
    } catch {
      continue;
    }
  }

  return undefined;
}

export async function connectBrowser() {
  const puppeteer = await requirePuppeteer();
  const state = await loadState();
  if (!state?.browserURL) {
    console.error("Browser session not initialized. Run start.mjs first.");
    process.exit(1);
  }

  return puppeteer.connect({ browserURL: state.browserURL });
}
