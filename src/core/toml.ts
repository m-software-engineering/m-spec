import TOML from "@iarna/toml";
import { pathExists, readTextFile, writeTextFile } from "./fs.js";

export async function mergeTomlFile(targetPath: string, patch: Record<string, unknown>): Promise<void> {
  const existing = (await pathExists(targetPath)) ? TOML.parse((await readTextFile(targetPath)) ?? "") as Record<string, unknown> : {};
  const merged = deepMerge(existing, patch);
  await writeTextFile(targetPath, `${TOML.stringify(merged as TOML.JsonMap).trimEnd()}\n`);
}

function deepMerge(base: Record<string, unknown>, patch: Record<string, unknown>): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(patch)) {
    const previous = merged[key];
    if (isObject(previous) && isObject(value)) {
      merged[key] = deepMerge(previous, value);
      continue;
    }

    merged[key] = value;
  }

  return merged;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
