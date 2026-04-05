#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { detectBrowserBinary, saveState } from "./common.mjs";

const browserBinary = await detectBrowserBinary();
if (!browserBinary) {
  console.error("Could not locate Chrome/Chromium.");
  process.exit(1);
}

const port = process.env.M_SPEC_BROWSER_PORT ?? "9222";
const userDataDir = path.join(process.cwd(), ".m-spec", "browser-profile");
const child = spawn(
  browserBinary,
  [`--remote-debugging-port=${port}`, `--user-data-dir=${userDataDir}`, "--no-first-run", "--no-default-browser-check"],
  { detached: true, stdio: "ignore" },
);

child.unref();
await saveState({ pid: child.pid, browserURL: `http://127.0.0.1:${port}` });
console.log(`Started browser on http://127.0.0.1:${port}`);
