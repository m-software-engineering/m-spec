import path from "node:path";
import { CONFIG_FILE, DEFAULT_FEATURES, DEFAULT_PATHS, DEFAULTS, SCHEMA_VERSION } from "./constants.js";
import { readJsonFile, writeJsonFile } from "./fs.js";
import type { FeatureFlags, PathConfig, ProjectConfig, SupportedAgent } from "./types.js";

export function buildProjectConfig(input: {
  rootDir: string;
  agent: SupportedAgent;
  domains: ProjectConfig["domains"];
  features?: Partial<FeatureFlags>;
  paths?: Partial<PathConfig>;
}): ProjectConfig {
  const timestamp = new Date().toISOString();

  return {
    schemaVersion: SCHEMA_VERSION,
    createdAt: timestamp,
    updatedAt: timestamp,
    agent: input.agent,
    platform: DEFAULTS.osScope,
    domains: input.domains,
    features: {
      ...DEFAULT_FEATURES,
      ...input.features
    },
    paths: {
      ...DEFAULT_PATHS,
      ...input.paths
    },
    defaults: DEFAULTS
  };
}

export async function loadProjectConfig(rootDir: string): Promise<ProjectConfig | undefined> {
  return readJsonFile<ProjectConfig>(path.join(rootDir, CONFIG_FILE));
}

export async function saveProjectConfig(rootDir: string, config: ProjectConfig): Promise<void> {
  await writeJsonFile(path.join(rootDir, CONFIG_FILE), config);
}
