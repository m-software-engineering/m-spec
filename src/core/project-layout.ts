import { SCHEMA_VERSION } from "./constants.js";
import { renderAsset } from "./assets.js";
import type { GeneratedFile, ProjectConfig } from "./types.js";

export function buildBaseProjectFiles(config: ProjectConfig): GeneratedFile[] {
  return [
    {
      relativePath: `${config.paths.docsRoot}/README.md`,
      content: renderAsset("project/docs-readme.md", {
        AGENT: config.agent,
        DOMAIN_LIST: renderDomainList(config)
      })
    },
    {
      relativePath: `${config.paths.specsRoot}/README.md`,
      content: readProjectAsset("project/specs-readme.md")
    },
    {
      relativePath: `${config.paths.changesRoot}/README.md`,
      content: renderAsset("project/changes-readme.md", {
        CHANGES_ROOT: config.paths.changesRoot
      })
    },
    {
      relativePath: `${config.paths.runtimeRoot}/README.md`,
      content: readProjectAsset("project/runtime-readme.md")
    },
    {
      relativePath: `${config.paths.runtimeRoot}/policy.json`,
      content: `${renderAsset("project/policy.json", {
        SCHEMA_VERSION,
        PLATFORM: config.platform
      })}\n`
    }
  ];
}

function renderDomainList(config: ProjectConfig): string {
  return config.domains.map((domain) => `- \`${domain.relativePath}\``).join("\n") || "- No domains configured";
}

function readProjectAsset(relativePath: string): string {
  return renderAsset(relativePath);
}
