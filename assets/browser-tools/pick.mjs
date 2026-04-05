#!/usr/bin/env node
import { connectBrowser } from "./common.mjs";

const browser = await connectBrowser();
const pages = await browser.pages();
const page = pages[0] ?? (await browser.newPage());
let selected = null;

await page.exposeFunction("__mSpecEmitSelection", (payload) => {
  selected = payload;
});

await page.evaluate(
  () =>
    new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.right = "0";
      overlay.style.padding = "8px 12px";
      overlay.style.background = "#111";
      overlay.style.color = "#fff";
      overlay.style.font = "12px monospace";
      overlay.style.zIndex = "2147483647";
      overlay.textContent = "Click an element to print a selector";
      document.body.appendChild(overlay);

      const handler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const el = event.target;
        const selector = el.id
          ? `#${el.id}`
          : `${el.tagName.toLowerCase()}${el.className ? "." + String(el.className).trim().split(/\s+/).join(".") : ""}`;

        window.__mSpecEmitSelection({
          selector,
          text: el.textContent?.trim().slice(0, 200) ?? "",
        });

        document.removeEventListener("click", handler, true);
        overlay.remove();
        resolve();
      };

      document.addEventListener("click", handler, true);
    }),
);

console.log(JSON.stringify(selected, null, 2));
await browser.disconnect();
