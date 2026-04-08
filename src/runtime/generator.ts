import path from "node:path";
import { readAsset, renderAsset } from "../core/assets.js";
import { mergeTomlFile } from "../core/toml.js";
import { deepMerge } from "../core/json-merge.js";
import { readJsonFile, writeJsonFile, writeTextFile } from "../core/fs.js";
import { upsertManagedMarkdownFile } from "../core/output.js";
import type { DomainConfig, GeneratedFile, ProjectConfig, ProgressReporter } from "../core/types.js";

export function buildAgentFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [
    ...buildSharedRuntimeFiles(config),
    ...buildAgentWorkflowArtifacts(config)
  ];

  if (config.features.browserTools) {
    files.push(...buildBrowserToolFiles(config));
  }

  return files;
}

export async function syncManagedInstructionFiles(rootDir: string, config: ProjectConfig, onProgress?: ProgressReporter): Promise<void> {
  onProgress?.({ step: "sync", detail: "Merging agent configuration files" });
  await syncAgentConfigFiles(rootDir, config);

  const sharedRootInstructions = buildRootInstructions(config);

  if (config.agent === "claude") {
    await upsertManagedMarkdownFile(rootDir, "CLAUDE.md", "root", sharedRootInstructions);
    onProgress?.({ step: "file", detail: "updated: CLAUDE.md" });
  } else {
    await upsertManagedMarkdownFile(rootDir, "AGENTS.md", "root", sharedRootInstructions);
    onProgress?.({ step: "file", detail: "updated: AGENTS.md" });
  }

  if (config.agent === "copilot") {
    await upsertManagedMarkdownFile(rootDir, ".github/copilot-instructions.md", "root", sharedRootInstructions);
    onProgress?.({ step: "file", detail: "updated: .github/copilot-instructions.md" });
  }

  if (!config.features.domainInstructions) {
    return;
  }

  for (const domain of config.domains) {
    if (config.agent === "claude") {
      await writeTextFile(
        path.join(rootDir, ".claude/rules", `m-spec-${domainSlug(domain)}.md`),
        buildClaudeDomainRule(domain),
      );
      onProgress?.({ step: "file", detail: `updated: .claude/rules/m-spec-${domainSlug(domain)}.md` });
      continue;
    }

    await upsertManagedMarkdownFile(rootDir, path.posix.join(domain.relativePath, "AGENTS.md"), `domain:${domainSlug(domain)}`, buildDomainInstructions(domain));
    onProgress?.({ step: "file", detail: `updated: ${path.posix.join(domain.relativePath, "AGENTS.md")}` });

    if (config.agent === "copilot") {
      await writeTextFile(
        path.join(rootDir, ".github/instructions", `m-spec-${domainSlug(domain)}.instructions.md`),
        buildCopilotDomainInstruction(domain),
      );
      onProgress?.({ step: "file", detail: `updated: .github/instructions/m-spec-${domainSlug(domain)}.instructions.md` });
    }
  }
}

async function syncAgentConfigFiles(rootDir: string, config: ProjectConfig): Promise<void> {
  if (config.agent === "codex") {
    await mergeTomlFile(path.join(rootDir, ".codex/config.toml"), {
      features: {
        codex_hooks: true,
        multi_agent: true
      }
    });

    await mergeJsonAtPath(rootDir, ".codex/hooks.json", buildCodexHooksConfig(config));
    return;
  }

  if (config.agent === "claude") {
    await mergeJsonAtPath(rootDir, ".claude/settings.json", buildClaudeSettingsConfig(config));
    return;
  }

  await mergeJsonAtPath(rootDir, ".github/hooks/hooks.json", buildCopilotHooksConfig(config));
}

async function mergeJsonAtPath(rootDir: string, relativePath: string, patch: Record<string, unknown>): Promise<void> {
  const targetPath = path.join(rootDir, relativePath);
  const existing = await readJsonFile<Record<string, unknown>>(targetPath);
  const merged = mergeHookAwareJson(existing ?? {}, patch);
  await writeJsonFile(targetPath, merged);
}

function mergeHookAwareJson(base: Record<string, unknown>, patch: Record<string, unknown>): Record<string, unknown> {
  const merged = deepMerge(base, patch);

  if (isRecord(base.hooks) && isRecord(patch.hooks) && isRecord(merged.hooks)) {
    for (const [eventName, eventValue] of Object.entries(patch.hooks)) {
      const current = Array.isArray(base.hooks[eventName]) ? base.hooks[eventName] as unknown[] : [];
      const additions = Array.isArray(eventValue) ? eventValue : [];
      merged.hooks[eventName] = dedupeByJson([...current, ...additions]);
    }
  }

  return merged;
}

function dedupeByJson(items: unknown[]): unknown[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = JSON.stringify(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function buildSharedRuntimeFiles(config: ProjectConfig): GeneratedFile[] {
  const runtimeRoot = config.paths.runtimeRoot;
  const files: GeneratedFile[] = [
    {
      relativePath: path.posix.join(runtimeRoot, "hooks", "common.mjs"),
      content: renderAsset("hooks/common.mjs", { RUNTIME_ROOT: runtimeRoot }),
      executable: true
    },
    {
      relativePath: path.posix.join(runtimeRoot, "hooks", "dangerous-command.mjs"),
      content: readAsset("hooks/dangerous-command.mjs"),
      executable: true
    },
    {
      relativePath: path.posix.join(runtimeRoot, "hooks", "protect-secrets.mjs"),
      content: readAsset("hooks/protect-secrets.mjs"),
      executable: true
    },
    {
      relativePath: path.posix.join(runtimeRoot, "hooks", "test-integrity.mjs"),
      content: readAsset("hooks/test-integrity.mjs"),
      executable: true
    },
    {
      relativePath: path.posix.join(runtimeRoot, "scripts", "create-worktree.sh"),
      content: readAsset("scripts/create-worktree.sh"),
      executable: true
    },
    {
      relativePath: path.posix.join(runtimeRoot, "scripts", "run-red.sh"),
      content: readAsset("scripts/run-red.sh"),
      executable: true
    },
    {
      relativePath: path.posix.join(runtimeRoot, "scripts", "run-green.sh"),
      content: readAsset("scripts/run-green.sh"),
      executable: true
    }
  ];

  if (config.features.autoresearch) {
    files.push(
      {
        relativePath: path.posix.join(runtimeRoot, "templates", "autoresearch.md"),
        content: readAsset("templates/autoresearch.md")
      },
      {
        relativePath: path.posix.join(runtimeRoot, "templates", "autoresearch.sh"),
        content: readAsset("templates/autoresearch.sh"),
        executable: true
      },
      {
        relativePath: path.posix.join(runtimeRoot, "templates", "autoresearch.checks.sh"),
        content: readAsset("templates/autoresearch.checks.sh"),
        executable: true
      },
      {
        relativePath: path.posix.join(runtimeRoot, "templates", "autoresearch.ratchet.sh"),
        content: readAsset("templates/autoresearch.ratchet.sh"),
        executable: true
      }
    );
  }

  return files;
}

function buildAgentWorkflowArtifacts(config: ProjectConfig): GeneratedFile[] {
  switch (config.agent) {
    case "codex":
      return buildCodexArtifacts(config);
    case "claude":
      return buildClaudeArtifacts(config);
    case "copilot":
      return buildCopilotArtifacts(config);
  }
}

function buildCodexArtifacts(config: ProjectConfig): GeneratedFile[] {
  return buildWorkflowSkills(config).map((skill) => ({
    relativePath: path.posix.join(".agents/skills", skill.name, "SKILL.md"),
    content: skill.body
  }));
}

function buildClaudeArtifacts(config: ProjectConfig): GeneratedFile[] {
  return buildWorkflowAgents(config, "claude").map((agent) => ({
    relativePath: path.posix.join(".claude/agents", `${agent.slug}.md`),
    content: agent.body
  }));
}

function buildCopilotArtifacts(config: ProjectConfig): GeneratedFile[] {
  return buildWorkflowAgents(config, "copilot").map((agent) => ({
    relativePath: path.posix.join(".github/agents", `${agent.slug}.agent.md`),
    content: agent.body
  }));
}

function buildWorkflowSkills(config: ProjectConfig): Array<{ name: string; body: string }> {
  return workflowDefinitions(config).map((definition) => ({
    name: definition.slug,
    body: renderAsset("wrappers/codex-skill.md", {
      NAME: definition.slug,
      DESCRIPTION: quoteYamlString(definition.description),
      INSTRUCTIONS: definition.instructions
    })
  }));
}

function buildWorkflowAgents(
  config: ProjectConfig,
  target: "claude" | "copilot"
): Array<{ slug: string; body: string }> {
  return workflowDefinitions(config).map((definition) => ({
    slug: definition.slug,
    body: target === "claude" ? buildClaudeAgentFile(definition.slug, definition.description, definition.instructions) : buildCopilotAgentFile(definition.slug, definition.description, definition.instructions)
  }));
}

function workflowDefinitions(config: ProjectConfig): Array<{ slug: string; description: string; instructions: string }> {
  return [
    {
      slug: "m-spec-plan",
      description: "Use when a user wants a detailed implementation plan written to m-spec/changes/<change>/plan.md before coding starts.",
      instructions: buildPlanInstructions(config)
    },
    {
      slug: "m-spec-spec",
      description: "Use when a user wants change specs generated from an approved M-SPEC plan as parallelizable Gherkin files.",
      instructions: buildSpecInstructions(config)
    },
    {
      slug: "m-spec-implement",
      description: "Use when a user wants implementation from M-SPEC plan/spec artifacts with strict TDD, isolated ownership, and delegated execution.",
      instructions: buildImplementInstructions(config)
    },
    {
      slug: "m-spec-optimize",
      description: "Use when a user wants an autoresearch-style optimization loop constrained by tests and a measurable metric.",
      instructions: buildOptimizeInstructions(config)
    },
    {
      slug: "m-spec-tdd",
      description: "Use whenever you implement behavior from an M-SPEC spec and need to enforce Red-Green-Refactor discipline.",
      instructions: buildTddInstructions(config)
    },
    {
      slug: "m-spec-autoresearch",
      description: "Use when you need to set up or resume an M-SPEC autoresearch optimization session.",
      instructions: buildAutoresearchInstructions(config)
    }
  ];
}

function buildRootInstructions(config: ProjectConfig): string {
  return renderAsset("instructions/root.md", {
    SPECS_ROOT: config.paths.specsRoot,
    CHANGES_ROOT: config.paths.changesRoot,
    AUTORESEARCH_LINE: config.features.autoresearch
      ? `- Optimization sessions should use the generated autoresearch templates under \`${config.paths.runtimeRoot}/templates/\`.`
      : "",
    BROWSER_TOOLS_LINE: config.features.browserTools
      ? `- Optional browser tools are available under \`${config.paths.runtimeRoot}/tools/browser/\`.`
      : ""
  });
}

function buildDomainInstructions(domain: DomainConfig): string {
  return renderAsset("instructions/domain.md", {
    DOMAIN_NAME: domain.name,
    DOMAIN_PATH: domain.relativePath
  });
}

function buildClaudeDomainRule(domain: DomainConfig): string {
  return renderAsset("instructions/claude-domain-rule.md", {
    DOMAIN_NAME: domain.name,
    DOMAIN_PATH: domain.relativePath
  });
}

function buildCopilotDomainInstruction(domain: DomainConfig): string {
  return renderAsset("instructions/copilot-domain.instructions.md", {
    DOMAIN_NAME: domain.name,
    DOMAIN_PATH: domain.relativePath,
    DOMAIN_APPLY_TO: domain.applyTo
  });
}

function buildClaudeAgentFile(slug: string, description: string, instructions: string): string {
  return renderAsset("wrappers/claude-agent.md", {
    NAME: slug,
    DESCRIPTION: quoteYamlString(description),
    INSTRUCTIONS: instructions
  });
}

function buildCopilotAgentFile(slug: string, description: string, instructions: string): string {
  return renderAsset("wrappers/copilot-agent.md", {
    NAME: slug,
    DESCRIPTION: quoteYamlString(description),
    INSTRUCTIONS: instructions
  });
}

function buildPlanInstructions(config: ProjectConfig): string {
  return renderAsset("workflows/plan.md", {
    CHANGES_ROOT: config.paths.changesRoot
  });
}

function buildSpecInstructions(config: ProjectConfig): string {
  return renderAsset("workflows/spec.md", {
    CHANGES_ROOT: config.paths.changesRoot
  });
}

function buildImplementInstructions(config: ProjectConfig): string {
  return renderAsset("workflows/implement.md", {
    RUNTIME_ROOT: config.paths.runtimeRoot
  });
}

function buildOptimizeInstructions(config: ProjectConfig): string {
  return renderAsset("workflows/optimize.md", {
    CHANGES_ROOT: config.paths.changesRoot
  });
}

function buildTddInstructions(config: ProjectConfig): string {
  return renderAsset("workflows/tdd.md", {
    RUNTIME_ROOT: config.paths.runtimeRoot
  });
}

function buildAutoresearchInstructions(config: ProjectConfig): string {
  return renderAsset("workflows/autoresearch.md", {
    RUNTIME_ROOT: config.paths.runtimeRoot
  });
}

function buildCodexHooksConfig(config: ProjectConfig): Record<string, unknown> {
  return JSON.parse(renderAsset("config/codex-hooks.json", {
    RUNTIME_ROOT: config.paths.runtimeRoot
  })) as Record<string, unknown>;
}

function buildClaudeSettingsConfig(config: ProjectConfig): Record<string, unknown> {
  return JSON.parse(renderAsset("config/claude-settings.json", {
    RUNTIME_ROOT: config.paths.runtimeRoot
  })) as Record<string, unknown>;
}

function buildCopilotHooksConfig(config: ProjectConfig): Record<string, unknown> {
  return JSON.parse(renderAsset("config/copilot-hooks.json", {
    RUNTIME_ROOT: config.paths.runtimeRoot
  })) as Record<string, unknown>;
}

function buildBrowserToolFiles(config: ProjectConfig): GeneratedFile[] {
  const browserRoot = path.posix.join(config.paths.runtimeRoot, "tools", "browser");
  return [
    {
      relativePath: path.posix.join(browserRoot, "README.md"),
      content: readAsset("browser-tools/README.md")
    },
    {
      relativePath: path.posix.join(browserRoot, "common.mjs"),
      content: readAsset("browser-tools/common.mjs"),
      executable: true
    },
    {
      relativePath: path.posix.join(browserRoot, "start.mjs"),
      content: readAsset("browser-tools/start.mjs"),
      executable: true
    },
    {
      relativePath: path.posix.join(browserRoot, "nav.mjs"),
      content: readAsset("browser-tools/nav.mjs"),
      executable: true
    },
    {
      relativePath: path.posix.join(browserRoot, "eval.mjs"),
      content: readAsset("browser-tools/eval.mjs"),
      executable: true
    },
    {
      relativePath: path.posix.join(browserRoot, "screenshot.mjs"),
      content: readAsset("browser-tools/screenshot.mjs"),
      executable: true
    },
    {
      relativePath: path.posix.join(browserRoot, "pick.mjs"),
      content: readAsset("browser-tools/pick.mjs"),
      executable: true
    }
  ];
}

function domainSlug(domain: DomainConfig): string {
  return domain.relativePath.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
}

function quoteYamlString(value: string): string {
  return JSON.stringify(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
