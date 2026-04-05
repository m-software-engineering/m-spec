import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { runInit } from "../src/commands/init.js";
import { readProjectFile, cleanupProject, createTempProject } from "./test-helpers.js";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((rootDir) => cleanupProject(rootDir)));
});

describe("runInit", () => {
  it("generates Codex scaffolding, managed instructions, and domain AGENTS files", async () => {
    const rootDir = await createTempProject();
    roots.push(rootDir);

    await runInit({
      rootDir,
      agent: "codex",
      yes: true,
      browserTools: false,
      autoresearch: true,
      domainInstructions: true
    });

    const config = await readProjectFile(rootDir, ".m-spec/config.json");
    const agents = await readProjectFile(rootDir, "AGENTS.md");
    const codexConfig = await readProjectFile(rootDir, ".codex/config.toml");
    const hooks = await readProjectFile(rootDir, ".codex/hooks.json");
    const planSkill = await readProjectFile(rootDir, ".agents/skills/m-spec-plan/SKILL.md");
    const commonHook = await readProjectFile(rootDir, ".m-spec/hooks/common.mjs");
    const createWorktree = await readProjectFile(rootDir, ".m-spec/scripts/create-worktree.sh");
    const authAgents = await readProjectFile(rootDir, path.join("src", "modules", "auth", "AGENTS.md"));

    expect(config).toContain('"agent": "codex"');
    expect(agents).toContain("M-SPEC Workflow");
    expect(codexConfig).toContain("codex_hooks = true");
    expect(codexConfig).toContain("multi_agent = true");
    expect(hooks).toContain("dangerous-command.mjs");
    expect(planSkill).toContain("m-spec/changes/<change-slug>/plan.md");
    expect(commonHook).toContain(".m-spec/policy.json");
    expect(createWorktree).toContain("git worktree add -b");
    expect(authAgents).toContain("Domain focus: Auth");
  });

  it("generates Claude scaffolding and domain rules", async () => {
    const rootDir = await createTempProject();
    roots.push(rootDir);

    await runInit({
      rootDir,
      agent: "claude",
      yes: true,
      browserTools: false,
      autoresearch: true,
      domainInstructions: true
    });

    const claudeMd = await readProjectFile(rootDir, "CLAUDE.md");
    const settings = await readProjectFile(rootDir, ".claude/settings.json");
    const agentFile = await readProjectFile(rootDir, ".claude/agents/m-spec-implement.md");
    const domainRule = await readProjectFile(rootDir, ".claude/rules/m-spec-src-modules-auth.md");

    expect(claudeMd).toContain("M-SPEC Workflow");
    expect(settings).toContain("dangerous-command.mjs");
    expect(agentFile).toContain("Red-Green-Refactor");
    expect(domainRule).toContain("src/modules/auth");
  });

  it("generates Copilot scaffolding, root instructions, and path-specific instructions", async () => {
    const rootDir = await createTempProject();
    roots.push(rootDir);

    await runInit({
      rootDir,
      agent: "copilot",
      yes: true,
      browserTools: false,
      autoresearch: true,
      domainInstructions: true
    });

    const copilotInstructions = await readProjectFile(rootDir, ".github/copilot-instructions.md");
    const hooks = await readProjectFile(rootDir, ".github/hooks/hooks.json");
    const agentFile = await readProjectFile(rootDir, ".github/agents/m-spec-plan.agent.md");
    const pathInstructions = await readProjectFile(rootDir, ".github/instructions/m-spec-src-modules-auth.instructions.md");
    const agents = await readProjectFile(rootDir, "AGENTS.md");

    expect(copilotInstructions).toContain("M-SPEC Workflow");
    expect(hooks).toContain("dangerous-command.mjs");
    expect(agentFile).toContain("m-spec/changes/<change-slug>/plan.md");
    expect(pathInstructions).toContain('applyTo: "src/modules/auth/**/*"');
    expect(agents).toContain("Parallel implementation must use disjoint ownership");
  });

  it("materializes browser tools and autoresearch templates when enabled", async () => {
    const rootDir = await createTempProject();
    roots.push(rootDir);

    await runInit({
      rootDir,
      agent: "codex",
      yes: true,
      browserTools: true,
      autoresearch: true,
      domainInstructions: false
    });

    const browserReadme = await readProjectFile(rootDir, ".m-spec/tools/browser/README.md");
    const browserEval = await readProjectFile(rootDir, ".m-spec/tools/browser/eval.mjs");
    const autoresearchTemplate = await readProjectFile(rootDir, ".m-spec/templates/autoresearch.md");

    expect(browserReadme).toContain("Browser tools");
    expect(browserEval).toContain("usage: eval.mjs <expression>");
    expect(autoresearchTemplate).toContain("# Autoresearch Session");
  });
});
