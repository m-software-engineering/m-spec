import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { SUPPORTED_AGENTS } from "./constants.js";
import type { FeatureFlags, SupportedAgent } from "./types.js";

export async function promptForAgent(): Promise<SupportedAgent> {
  const answer = await promptWithChoices(
    "Select your primary AI agent",
    SUPPORTED_AGENTS.map((agent) => ({
      value: agent,
      label: agent
    })),
    "codex"
  );

  return answer as SupportedAgent;
}

export async function promptForFeatures(current: FeatureFlags): Promise<FeatureFlags> {
  return {
    domainInstructions: await confirm("Generate nested domain instruction files?", current.domainInstructions),
    browserTools: await confirm("Enable optional no-MCP browser tools?", current.browserTools),
    autoresearch: await confirm("Install autoresearch runtime and workflow assets?", current.autoresearch)
  };
}

export async function promptForDomains(discovered: string[]): Promise<string[]> {
  if (discovered.length === 0) {
    return [];
  }

  const rl = createInterface({ input, output });
  try {
    output.write("Discovered domain roots:\n");
    discovered.forEach((domain, index) => {
      output.write(`  ${index + 1}. ${domain}\n`);
    });
    const answer = await rl.question("Select domains by number (comma-separated, blank = all): ");
    if (answer.trim().length === 0) {
      return discovered;
    }

    const indexes = answer
      .split(",")
      .map((chunk) => Number.parseInt(chunk.trim(), 10))
      .filter((value) => Number.isFinite(value) && value > 0 && value <= discovered.length)
      .map((value) => value - 1);

    return [...new Set(indexes.map((index) => discovered[index]).filter((value): value is string => Boolean(value)))];
  } finally {
    rl.close();
  }
}

export async function confirm(message: string, defaultValue: boolean): Promise<boolean> {
  const rl = createInterface({ input, output });
  try {
    const suffix = defaultValue ? " [Y/n]: " : " [y/N]: ";
    const answer = await rl.question(`${message}${suffix}`);
    if (answer.trim().length === 0) {
      return defaultValue;
    }
    return ["y", "yes"].includes(answer.trim().toLowerCase());
  } finally {
    rl.close();
  }
}

async function promptWithChoices(
  message: string,
  choices: Array<{ value: string; label: string }>,
  defaultValue: string
): Promise<string> {
  const rl = createInterface({ input, output });
  try {
    output.write(`${message}:\n`);
    choices.forEach((choice, index) => {
      output.write(`  ${index + 1}. ${choice.label}\n`);
    });

    const answer = await rl.question(`Choose a number (default ${defaultValue}): `);
    if (answer.trim().length === 0) {
      return defaultValue;
    }

    const index = Number.parseInt(answer.trim(), 10) - 1;
    const choice = choices[index];
    return choice?.value ?? defaultValue;
  } finally {
    rl.close();
  }
}
