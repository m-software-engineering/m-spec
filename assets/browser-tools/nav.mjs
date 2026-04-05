#!/usr/bin/env node
import { connectBrowser } from "./common.mjs";

const url = process.argv[2];
if (!url) {
  console.error("usage: nav.mjs <url>");
  process.exit(1);
}

const browser = await connectBrowser();
const pages = await browser.pages();
const page = pages[0] ?? (await browser.newPage());
await page.goto(url, { waitUntil: "domcontentloaded" });
console.log(`Navigated to ${url}`);
await browser.disconnect();
