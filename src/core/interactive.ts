import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export interface InteractiveCommandSelection {
  command: "init" | "update" | "doctor" | "reconcile";
  args: string[];
}

export async function resolveInteractiveCommand(argv: string[]): Promise<string[]> {
  if (argv.length > 2) {
    return argv;
  }

  const selected = await promptForCommand();
  return [argv[0] ?? "node", argv[1] ?? "m-spec", selected.command, ...selected.args];
}

async function promptForCommand(): Promise<InteractiveCommandSelection> {
  const rl = createInterface({ input, output });

  try {
    output.write("No command provided. Select what M-SPEC should do:\n");
    output.write("  1. init      Initialize M-SPEC in this repository\n");
    output.write("  2. update    Re-generate managed M-SPEC files\n");
    output.write("  3. doctor    Validate M-SPEC files and environment\n");
    output.write("  4. reconcile Merge change deltas back to specs\n");

    const selection = await rl.question("Choose [1-4] (default 1): ");
    const targetPath = (await rl.question("Target path (default .): ")).trim() || ".";
    const option = Number.parseInt(selection.trim(), 10);

    if (option === 2) {
      return { command: "update", args: [targetPath] };
    }

    if (option === 3) {
      return { command: "doctor", args: [targetPath] };
    }

    if (option === 4) {
      const changeSlug = (await rl.question("Change slug: ")).trim();
      if (changeSlug.length === 0) {
        throw new Error("Change slug is required for reconcile.");
      }

      return { command: "reconcile", args: [changeSlug, targetPath] };
    }

    return { command: "init", args: [targetPath] };
  } finally {
    rl.close();
  }
}
