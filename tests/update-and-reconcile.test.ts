import { afterEach, describe, expect, it } from "vitest";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { runInit } from "../src/commands/init.js";
import { runUpdate } from "../src/commands/update.js";
import { runReconcile } from "../src/commands/reconcile.js";
import { cleanupProject, createTempProject, readProjectFile } from "./test-helpers.js";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((rootDir) => cleanupProject(rootDir)));
});

describe("update and reconcile", () => {
  it("preserves user content while refreshing the managed AGENTS block", async () => {
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

    await writeFile(
      path.join(rootDir, "AGENTS.md"),
      "# Team notes\n\nRemember local coding conventions.\n\n<!-- M-SPEC:BEGIN root -->\noutdated\n<!-- M-SPEC:END root -->\n",
      "utf8",
    );

    await runUpdate({ rootDir });

    const agents = await readProjectFile(rootDir, "AGENTS.md");
    expect(agents).toContain("# Team notes");
    expect(agents).toContain("Remember local coding conventions.");
    expect(agents).toContain("M-SPEC Workflow");
    expect(agents).not.toContain("\noutdated\n");
  });

  it("merges delta specs back into the source-of-truth spec tree", async () => {
    const rootDir = await createTempProject();
    roots.push(rootDir);

    await runInit({
      rootDir,
      agent: "codex",
      yes: true,
      browserTools: false,
      autoresearch: true,
      domainInstructions: false
    });

    const specsDir = path.join(rootDir, "m-spec", "changes", "add-auth-cache", "specs");
    await mkdir(specsDir, { recursive: true });
    await writeFile(
      path.join(specsDir, "auth-cache.spec.md"),
      [
        "---",
        "change: add-auth-cache",
        "slice: auth-cache",
        "dependsOn: []",
        "ownedPaths:",
        "  - src/modules/auth/**/*",
        "parallelizable: true",
        "status: draft",
        "---",
        "",
        "## ADDED",
        "",
        "Feature: Auth cache",
        "  Scenario: Cache successful auth lookups",
        "    Given the auth service has a warm cache",
        "    When the same credential is checked twice",
        "    Then the second lookup should avoid the primary backing store"
      ].join("\n"),
      "utf8",
    );

    const updated = await runReconcile(rootDir, "add-auth-cache");
    const rootSpec = await readProjectFile(rootDir, "m-spec/specs/auth-cache/spec.md");

    expect(updated).toEqual(["m-spec/specs/auth-cache/spec.md"]);
    expect(rootSpec).toContain("Feature: Auth cache");
    expect(rootSpec).toContain("M-SPEC:BEGIN slice:auth-cache.spec");
  });
});
