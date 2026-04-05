import type { DefaultConfig, FeatureFlags, PathConfig, SupportedAgent } from "./types.js";

export const APP_NAME = "m-spec";
export const SCHEMA_VERSION = 1;
export const CONFIG_FILE = ".m-spec/config.json";

export const DEFAULT_PATHS: PathConfig = {
  docsRoot: "m-spec",
  runtimeRoot: ".m-spec",
  changesRoot: "m-spec/changes",
  specsRoot: "m-spec/specs"
};

export const DEFAULT_FEATURES: FeatureFlags = {
  domainInstructions: true,
  browserTools: false,
  autoresearch: true
};

export const DEFAULTS: DefaultConfig = {
  gherkinLanguage: "en",
  specGranularity: "per-slice",
  commandSurface: "native-equivalent",
  osScope: "posix"
};

export const SUPPORTED_AGENTS: SupportedAgent[] = ["codex", "claude", "copilot"];

export const DOMAIN_BASE_DIRECTORIES = [
  "apps",
  "packages",
  "services",
  "src/modules",
  "src/domains",
  "src/features"
];

export const CODE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".py",
  ".go",
  ".rb",
  ".rs",
  ".java",
  ".kt"
]);

export const SECRET_PATH_PATTERNS = [
  "\\.env(\\..+)?$",
  "\\.pem$",
  "\\.p12$",
  "\\.key$",
  "id_rsa$",
  "id_ed25519$",
  "secrets?/",
  "credentials?/",
  "tokens?/"
];

export const MANAGED_BLOCK_PREFIX = "M-SPEC";
