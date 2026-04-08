import path from "node:path";
import { buildProjectConfig, saveProjectConfig } from "../core/config.js";
import { DEFAULT_FEATURES } from "../core/constants.js";
import { discoverDomains, normalizeDomainPaths } from "../core/domain-discovery.js";
import { buildBaseProjectFiles } from "../core/project-layout.js";
import { promptForAgent, promptForDomains, promptForFeatures } from "../core/prompt.js";
import { writeGeneratedFiles } from "../core/output.js";
import type { InitOptions, ProjectConfig } from "../core/types.js";
import { buildAgentFiles, syncManagedInstructionFiles } from "../runtime/generator.js";

export async function runInit(options: InitOptions): Promise<ProjectConfig> {
  const rootDir = path.resolve(options.rootDir);
  options.onProgress?.({ step: "scan", detail: `Scanning project at ${rootDir}` });
  const discoveredDomains = await discoverDomains(rootDir);
  const selectedDomains = options.domains
    ? normalizeDomainPaths(options.domains)
    : options.yes
      ? discoveredDomains
      : normalizeDomainPaths(await promptForDomains(discoveredDomains.map((domain) => domain.relativePath)));

  const agent = options.agent ?? (options.yes ? "codex" : await promptForAgent());
  const features = options.yes
    ? {
        ...DEFAULT_FEATURES,
        domainInstructions: options.domainInstructions ?? DEFAULT_FEATURES.domainInstructions,
        browserTools: options.browserTools ?? DEFAULT_FEATURES.browserTools,
        autoresearch: options.autoresearch ?? DEFAULT_FEATURES.autoresearch
      }
    : await promptForFeatures({
        ...DEFAULT_FEATURES,
        domainInstructions: options.domainInstructions ?? DEFAULT_FEATURES.domainInstructions,
        browserTools: options.browserTools ?? DEFAULT_FEATURES.browserTools,
        autoresearch: options.autoresearch ?? DEFAULT_FEATURES.autoresearch
      });

  const config = buildProjectConfig({
    rootDir,
    agent,
    domains: selectedDomains,
    features
  });

  const generatedFiles = [...buildBaseProjectFiles(config), ...buildAgentFiles(config)];
  options.onProgress?.({ step: "scaffold", detail: `Writing ${generatedFiles.length} managed files` });
  await writeGeneratedFiles(rootDir, generatedFiles, options.onProgress);
  options.onProgress?.({ step: "sync", detail: "Updating managed instruction files" });
  await syncManagedInstructionFiles(rootDir, config, options.onProgress);
  options.onProgress?.({ step: "config", detail: "Saving project configuration" });
  await saveProjectConfig(rootDir, config);
  options.onProgress?.({ step: "done", detail: "Initialization complete" });

  return config;
}
