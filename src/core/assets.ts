import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type AssetValue = string | number | boolean;

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const assetCandidates = [
  path.resolve(currentDir, "..", "..", "assets"),
  path.resolve(currentDir, "..", "assets")
];
const assetsRoot = assetCandidates.find((candidate) => existsSync(candidate));

export function readAsset(relativePath: string): string {
  if (!assetsRoot) {
    throw new Error("Could not locate packaged assets directory.");
  }

  return readFileSync(path.join(assetsRoot, relativePath), "utf8");
}

export function renderAsset(relativePath: string, values: Record<string, AssetValue> = {}): string {
  let content = readAsset(relativePath);

  for (const [key, value] of Object.entries(values)) {
    content = content.split(`{{${key}}}`).join(String(value));
  }

  const unresolved = content.match(/{{[A-Z0-9_]+}}/g);
  if (unresolved) {
    throw new Error(`Unresolved asset placeholders in ${relativePath}: ${unresolved.join(", ")}`);
  }

  return content;
}
