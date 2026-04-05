import path from "node:path";
import { loadProjectConfig } from "../core/config.js";
import { runDoctor as collectDoctorFindings } from "../core/doctor.js";
import type { DoctorFinding } from "../core/types.js";

export async function runDoctor(rootDir: string): Promise<DoctorFinding[]> {
  const resolvedRoot = path.resolve(rootDir);
  const config = await loadProjectConfig(resolvedRoot);
  if (!config) {
    return [{ level: "error", message: "M-SPEC is not initialized in this repository." }];
  }

  return collectDoctorFindings(resolvedRoot, config);
}
