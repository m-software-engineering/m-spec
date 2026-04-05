import path from "node:path";
import { loadProjectConfig } from "../core/config.js";
import { reconcileChange } from "../core/reconcile.js";

export async function runReconcile(rootDir: string, changeSlug: string): Promise<string[]> {
  const resolvedRoot = path.resolve(rootDir);
  const config = await loadProjectConfig(resolvedRoot);
  if (!config) {
    throw new Error("M-SPEC is not initialized in this repository. Run `m-spec init` first.");
  }

  return reconcileChange(resolvedRoot, config, changeSlug);
}
