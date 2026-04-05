import path from "node:path";
import { loadProjectConfig, saveProjectConfig } from "../core/config.js";
import { buildBaseProjectFiles } from "../core/project-layout.js";
import { writeGeneratedFiles } from "../core/output.js";
import { buildAgentFiles, syncManagedInstructionFiles } from "../runtime/generator.js";
import type { UpdateOptions } from "../core/types.js";

export async function runUpdate(options: UpdateOptions): Promise<void> {
  const rootDir = path.resolve(options.rootDir);
  const config = await loadProjectConfig(rootDir);
  if (!config) {
    throw new Error("M-SPEC is not initialized in this repository. Run `m-spec init` first.");
  }

  config.updatedAt = new Date().toISOString();
  await writeGeneratedFiles(rootDir, [...buildBaseProjectFiles(config), ...buildAgentFiles(config)]);
  await syncManagedInstructionFiles(rootDir, config);
  await saveProjectConfig(rootDir, config);
}
