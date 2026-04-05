import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export async function createTempProject(): Promise<string> {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "m-spec-"));
  await mkdir(path.join(rootDir, "src", "modules", "auth"), { recursive: true });
  await mkdir(path.join(rootDir, "src", "modules", "billing"), { recursive: true });
  await writeFile(
    path.join(rootDir, "package.json"),
    `${JSON.stringify({ name: "fixture-project", version: "1.0.0", type: "module" }, null, 2)}\n`,
    "utf8",
  );
  await writeFile(path.join(rootDir, "src", "modules", "auth", "service.ts"), "export const auth = true;\n", "utf8");
  await writeFile(path.join(rootDir, "src", "modules", "billing", "service.ts"), "export const billing = true;\n", "utf8");
  return rootDir;
}

export async function readProjectFile(rootDir: string, relativePath: string): Promise<string> {
  return readFile(path.join(rootDir, relativePath), "utf8");
}

export async function cleanupProject(rootDir: string): Promise<void> {
  await rm(rootDir, { recursive: true, force: true });
}
