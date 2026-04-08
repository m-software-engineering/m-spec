export type SupportedAgent = "codex" | "claude" | "copilot";

export type PlatformTarget = "posix";

export interface DomainConfig {
  name: string;
  relativePath: string;
  applyTo: string;
}

export interface FeatureFlags {
  domainInstructions: boolean;
  browserTools: boolean;
  autoresearch: boolean;
}

export interface PathConfig {
  docsRoot: string;
  runtimeRoot: string;
  changesRoot: string;
  specsRoot: string;
}

export interface DefaultConfig {
  gherkinLanguage: "en";
  specGranularity: "per-slice";
  commandSurface: "native-equivalent";
  osScope: PlatformTarget;
}

export interface ProjectConfig {
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  agent: SupportedAgent;
  platform: PlatformTarget;
  domains: DomainConfig[];
  features: FeatureFlags;
  paths: PathConfig;
  defaults: DefaultConfig;
}

export interface GeneratedFile {
  relativePath: string;
  content: string;
  executable?: boolean;
}

export interface ProgressEvent {
  step: string;
  detail?: string;
}

export type ProgressReporter = (event: ProgressEvent) => void;

export interface InitOptions {
  rootDir: string;
  agent?: SupportedAgent | undefined;
  domains?: string[] | undefined;
  yes?: boolean | undefined;
  domainInstructions?: boolean | undefined;
  browserTools?: boolean | undefined;
  autoresearch?: boolean | undefined;
  onProgress?: ProgressReporter | undefined;
}

export interface UpdateOptions {
  rootDir: string;
  onProgress?: ProgressReporter | undefined;
}

export interface DoctorFinding {
  level: "info" | "warn" | "error";
  message: string;
}

export interface ReconcileOptions {
  rootDir: string;
  changeSlug: string;
}
