#!/usr/bin/env node
import path from "node:path";
import { connectBrowser } from "./common.mjs";

const outputFile = process.argv[2] ?? path.join(process.cwd(), ".m-spec", "state", "browser.png");
const browser = await connectBrowser();
const pages = await browser.pages();
const page = pages[0] ?? (await browser.newPage());
await page.screenshot({ path: outputFile, fullPage: true });
console.log(outputFile);
await browser.disconnect();
