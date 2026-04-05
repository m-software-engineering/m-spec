import { chmod, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(targetPath: string): Promise<void> {
  await mkdir(targetPath, { recursive: true });
}

export async function writeTextFile(targetPath: string, content: string, executable = false): Promise<void> {
  await ensureDir(path.dirname(targetPath));
  await writeFile(targetPath, content, "utf8");
  if (executable) {
    await chmod(targetPath, 0o755);
  }
}

export async function readTextFile(targetPath: string): Promise<string | undefined> {
  if (!(await pathExists(targetPath))) {
    return undefined;
  }

  return readFile(targetPath, "utf8");
}

export async function readJsonFile<T>(targetPath: string): Promise<T | undefined> {
  const content = await readTextFile(targetPath);
  if (!content) {
    return undefined;
  }

  return JSON.parse(content) as T;
}

export async function writeJsonFile(targetPath: string, value: unknown): Promise<void> {
  const content = `${JSON.stringify(value, null, 2)}\n`;
  await writeTextFile(targetPath, content);
}

export async function listImmediateDirectories(targetPath: string): Promise<string[]> {
  if (!(await pathExists(targetPath))) {
    return [];
  }

  const entries = await readdir(targetPath, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

export async function hasCodeFiles(targetPath: string, depth = 3): Promise<boolean> {
  const queue: Array<{ dir: string; remainingDepth: number }> = [{ dir: targetPath, remainingDepth: depth }];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }

    const entries = await readdir(current.dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") && entry.name !== ".github" && entry.name !== ".claude" && entry.name !== ".codex") {
        continue;
      }

      const absolutePath = path.join(current.dir, entry.name);
      if (entry.isFile()) {
        const extension = path.extname(entry.name);
        if (extension) {
          return true;
        }
      }

      if (entry.isDirectory() && current.remainingDepth > 0) {
        queue.push({ dir: absolutePath, remainingDepth: current.remainingDepth - 1 });
      }
    }
  }

  return false;
}
