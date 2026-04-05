#!/usr/bin/env node
import { connectBrowser } from "./common.mjs";

const expression = process.argv[2];
if (!expression) {
  console.error("usage: eval.mjs <expression>");
  process.exit(1);
}

const browser = await connectBrowser();
const pages = await browser.pages();
const page = pages[0] ?? (await browser.newPage());
const result = await page.evaluate(async (source) => {
  const fn = new Function(`return (async () => (${source}))()`);
  return await fn();
}, expression);

console.log(JSON.stringify(result, null, 2));
await browser.disconnect();
