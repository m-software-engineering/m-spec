import { Command } from "commander";
import { readFileSync } from "node:fs";
import { APP_NAME } from "./core/constants.js";
import { runInit } from "./commands/init.js";
import { runUpdate } from "./commands/update.js";
import { runDoctor } from "./commands/doctor.js";
import { runReconcile } from "./commands/reconcile.js";
import { resolveInteractiveCommand } from "./core/interactive.js";
import { printBanner, printProgress } from "./core/ui.js";

const APP_VERSION = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as { version: string };

export async function runCli(argv = process.argv): Promise<void> {
  const resolvedArgv = await resolveInteractiveCommand(argv);
  printBanner();

  const program = new Command();

  program.name(APP_NAME).description("Lightweight spec-driven development framework for brownfield AI agent workflows.").version(APP_VERSION.version);

  program
    .command("init")
    .description("Initialize M-SPEC in the current repository")
    .argument("[path]", "Target directory", ".")
    .option("--agent <agent>", "Primary AI agent (codex|claude|copilot)")
    .option("--domains <domains>", "Comma-separated domain roots")
    .option("--with-browser-tools", "Enable optional no-MCP browser tools")
    .option("--without-browser-tools", "Disable optional no-MCP browser tools")
    .option("--with-domain-instructions", "Enable nested domain instructions")
    .option("--without-domain-instructions", "Disable nested domain instructions")
    .option("--with-autoresearch", "Enable autoresearch assets")
    .option("--without-autoresearch", "Disable autoresearch assets")
    .option("-y, --yes", "Use defaults without prompting")
    .action(async (targetPath, options: Record<string, unknown>) => {
      const config = await runInit({
        rootDir: targetPath,
        agent: options.agent as "codex" | "claude" | "copilot" | undefined,
        domains: typeof options.domains === "string" ? options.domains.split(",").map((chunk) => chunk.trim()).filter(Boolean) : undefined,
        yes: Boolean(options.yes),
        browserTools: resolveBooleanOption(options.withBrowserTools, options.withoutBrowserTools),
        domainInstructions: resolveBooleanOption(options.withDomainInstructions, options.withoutDomainInstructions),
        autoresearch: resolveBooleanOption(options.withAutoresearch, options.withoutAutoresearch),
        onProgress: (event) => event.detail && printProgress(event.detail)
      });

      console.log(`Initialized M-SPEC for ${config.agent} in ${targetPath}`);
    });

  program
    .command("update")
    .description("Re-generate managed files from the saved M-SPEC configuration")
    .argument("[path]", "Target directory", ".")
    .action(async (targetPath) => {
      await runUpdate({
        rootDir: targetPath,
        onProgress: (event) => event.detail && printProgress(event.detail)
      });
      console.log(`Updated managed M-SPEC files in ${targetPath}`);
    });

  program
    .command("doctor")
    .description("Validate generated M-SPEC assets and local prerequisites")
    .argument("[path]", "Target directory", ".")
    .action(async (targetPath) => {
      const findings = await runDoctor(targetPath);
      for (const finding of findings) {
        console.log(`[${finding.level}] ${finding.message}`);
      }

      if (findings.some((finding) => finding.level === "error")) {
        process.exitCode = 1;
      }
    });

  program
    .command("reconcile")
    .description("Merge delta specs from a change back into the source-of-truth spec tree")
    .argument("<change-slug>", "Change slug under m-spec/changes")
    .argument("[path]", "Target directory", ".")
    .action(async (changeSlug, targetPath) => {
      const written = await runReconcile(targetPath, changeSlug);
      written.forEach((item) => console.log(`Updated ${item}`));
    });

  await program.parseAsync(resolvedArgv);
}

function resolveBooleanOption(enabled: unknown, disabled: unknown): boolean | undefined {
  if (enabled === true) {
    return true;
  }

  if (disabled === true) {
    return false;
  }

  return undefined;
}

void runCli();
