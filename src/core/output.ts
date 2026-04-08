import path from "node:path";
import { ensureDir, readTextFile, writeTextFile } from "./fs.js";
import { upsertManagedMarkdown } from "./managed-content.js";
import type { GeneratedFile, ProgressReporter } from "./types.js";

export async function writeGeneratedFiles(rootDir: string, files: GeneratedFile[], onProgress?: ProgressReporter): Promise<void> {
  for (const file of files) {
    const targetPath = path.join(rootDir, file.relativePath);
    const previous = await readTextFile(targetPath);
    await writeTextFile(targetPath, file.content, file.executable);
    const outcome = previous === undefined ? "created" : previous === file.content ? "unchanged" : "updated";
    onProgress?.({
      step: "file",
      detail: `${outcome}: ${file.relativePath}`
    });
  }
}

export async function upsertManagedMarkdownFile(
  rootDir: string,
  relativePath: string,
  blockId: string,
  body: string
): Promise<void> {
  const targetPath = path.join(rootDir, relativePath);
  await ensureDir(path.dirname(targetPath));
  const existing = await readTextFile(targetPath);
  const content = upsertManagedMarkdown(existing, blockId, body);
  await writeTextFile(targetPath, content);
}
