import path from "node:path";
import { loadProjectConfig, saveProjectConfig } from "../core/config.js";
import { buildBaseProjectFiles } from "../core/project-layout.js";
import { writeGeneratedFiles } from "../core/output.js";
import { buildAgentFiles, syncManagedInstructionFiles } from "../runtime/generator.js";
import type { UpdateOptions } from "../core/types.js";

export async function runUpdate(options: UpdateOptions): Promise<void> {
  const rootDir = path.resolve(options.rootDir);
  options.onProgress?.({ step: "scan", detail: `Loading M-SPEC configuration from ${rootDir}` });
  const config = await loadProjectConfig(rootDir);
  if (!config) {
    throw new Error("M-SPEC is not initialized in this repository. Run `m-spec init` first.");
  }

  config.updatedAt = new Date().toISOString();
  const generatedFiles = [...buildBaseProjectFiles(config), ...buildAgentFiles(config)];
  options.onProgress?.({ step: "scaffold", detail: `Writing ${generatedFiles.length} managed files` });
  await writeGeneratedFiles(rootDir, generatedFiles, options.onProgress);
  options.onProgress?.({ step: "sync", detail: "Updating managed instruction files" });
  await syncManagedInstructionFiles(rootDir, config, options.onProgress);
  options.onProgress?.({ step: "config", detail: "Saving project configuration" });
  await saveProjectConfig(rootDir, config);
  options.onProgress?.({ step: "done", detail: "Update complete" });
}
