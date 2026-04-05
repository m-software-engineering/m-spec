import path from "node:path";
import { CODE_EXTENSIONS, DOMAIN_BASE_DIRECTORIES } from "./constants.js";
import { listImmediateDirectories, pathExists } from "./fs.js";
import type { DomainConfig } from "./types.js";

export async function discoverDomains(rootDir: string): Promise<DomainConfig[]> {
  const domains = new Map<string, DomainConfig>();

  for (const baseDirectory of DOMAIN_BASE_DIRECTORIES) {
    const absoluteBase = path.join(rootDir, baseDirectory);
    if (!(await pathExists(absoluteBase))) {
      continue;
    }

    const childDirectories = await listImmediateDirectories(absoluteBase);
    for (const child of childDirectories) {
      const relativePath = path.posix.join(toPosix(baseDirectory), child);
      const name = slugToTitle(child);
      domains.set(relativePath, {
        name,
        relativePath,
        applyTo: `${relativePath}/**/*`
      });
    }
  }

  if (domains.size === 0) {
    const srcDir = path.join(rootDir, "src");
    if (await pathExists(srcDir)) {
      const children = await listImmediateDirectories(srcDir);
      for (const child of children) {
        if (child === "lib" || child === "shared" || child === "common") {
          continue;
        }

        const relativePath = path.posix.join("src", child);
        domains.set(relativePath, {
          name: slugToTitle(child),
          relativePath,
          applyTo: `${relativePath}/**/*`
        });
      }
    }
  }

  if (domains.size === 0) {
    const packageFile = path.join(rootDir, "package.json");
    if (await pathExists(packageFile)) {
      domains.set("src", {
        name: "Source",
        relativePath: "src",
        applyTo: "src/**/*"
      });
    }
  }

  return [...domains.values()].sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

export function normalizeDomainPaths(domainPaths: string[]): DomainConfig[] {
  return domainPaths.map((relativePath) => {
    const normalized = toPosix(relativePath).replace(/^\.?\//, "").replace(/\/+$/, "");
    return {
      name: slugToTitle(path.posix.basename(normalized)),
      relativePath: normalized,
      applyTo: `${normalized}/**/*`
    };
  });
}

export function looksLikeCodePath(relativePath: string): boolean {
  return CODE_EXTENSIONS.has(path.extname(relativePath));
}

function slugToTitle(value: string): string {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join(" ");
}

function toPosix(value: string): string {
  return value.split(path.sep).join(path.posix.sep);
}
