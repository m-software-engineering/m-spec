import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { CONFIG_FILE } from "./constants.js";
import { pathExists } from "./fs.js";
import type { DoctorFinding, ProjectConfig, SupportedAgent } from "./types.js";

const execFileAsync = promisify(execFile);

export async function runDoctor(rootDir: string, config: ProjectConfig): Promise<DoctorFinding[]> {
  const findings: DoctorFinding[] = [];

  if (!(await pathExists(path.join(rootDir, CONFIG_FILE)))) {
    findings.push({ level: "error", message: "Missing .m-spec/config.json" });
  }

  findings.push(...(await checkAgentBinary(config.agent)));
  findings.push(...(await checkGitWorktree(rootDir)));

  if (config.features.browserTools) {
    findings.push(...(await checkBrowserSupport()));
  }

  findings.push(...(await checkGeneratedFiles(rootDir, config.agent)));

  return findings;
}

async function checkAgentBinary(agent: SupportedAgent): Promise<DoctorFinding[]> {
  const binary = agent === "copilot" ? "copilot" : agent;
  try {
    await execFileAsync("which", [binary]);
    return [{ level: "info", message: `Found ${binary} in PATH` }];
  } catch {
    return [{ level: "warn", message: `Could not find ${binary} in PATH` }];
  }
}

async function checkGitWorktree(rootDir: string): Promise<DoctorFinding[]> {
  try {
    await execFileAsync("git", ["-C", rootDir, "worktree", "list"]);
    return [{ level: "info", message: "git worktree is available" }];
  } catch {
    return [{ level: "warn", message: "git worktree is not available for this repository" }];
  }
}

async function checkBrowserSupport(): Promise<DoctorFinding[]> {
  const candidates = ["google-chrome", "chromium", "chromium-browser", "brave-browser"];
  for (const candidate of candidates) {
    try {
      await execFileAsync("which", [candidate]);
      return [{ level: "info", message: `Found browser runtime: ${candidate}` }];
    } catch {
      continue;
    }
  }

  return [{ level: "warn", message: "Browser tools enabled, but no Chrome/Chromium binary was found" }];
}

async function checkGeneratedFiles(rootDir: string, agent: SupportedAgent): Promise<DoctorFinding[]> {
  const agentFiles: Record<SupportedAgent, string[]> = {
    codex: [".codex/hooks.json", ".agents/skills/m-spec-plan/SKILL.md", "AGENTS.md"],
    claude: [".claude/settings.json", ".claude/agents/m-spec-plan.md", "CLAUDE.md"],
    copilot: [".github/hooks/hooks.json", ".github/agents/m-spec-plan.agent.md", ".github/copilot-instructions.md"]
  };

  const findings: DoctorFinding[] = [];
  for (const relativePath of agentFiles[agent]) {
    const exists = await pathExists(path.join(rootDir, relativePath));
    findings.push({
      level: exists ? "info" : "error",
      message: exists ? `Present: ${relativePath}` : `Missing: ${relativePath}`
    });
  }

  return findings;
}
