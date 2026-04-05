import path from "node:path";
import { readdir } from "node:fs/promises";
import { readTextFile, writeTextFile } from "./fs.js";
import { upsertManagedMarkdown } from "./managed-content.js";
import type { ProjectConfig } from "./types.js";

export async function reconcileChange(rootDir: string, config: ProjectConfig, changeSlug: string): Promise<string[]> {
  const specsDir = path.join(rootDir, config.paths.changesRoot, changeSlug, "specs");
  const entries = await readdir(specsDir, { withFileTypes: true });
  const specFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".md"));

  const written: string[] = [];

  for (const entry of specFiles) {
    const sourcePath = path.join(specsDir, entry.name);
    const content = (await readTextFile(sourcePath)) ?? "";
    const targetCapability = capabilityFromFilename(entry.name);
    const targetPath = path.join(rootDir, config.paths.specsRoot, targetCapability, "spec.md");
    const existing = await readTextFile(targetPath);
    const merged = upsertManagedMarkdown(existing, `slice:${entry.name.replace(/\.md$/, "")}`, content.trim());
    await writeTextFile(targetPath, merged);
    written.push(path.relative(rootDir, targetPath));
  }

  return written;
}

function capabilityFromFilename(filename: string): string {
  return filename.replace(/\.spec\.md$/, "").replace(/\.md$/, "");
}
