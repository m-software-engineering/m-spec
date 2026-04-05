import { MANAGED_BLOCK_PREFIX } from "./constants.js";

export function upsertManagedMarkdown(existingContent: string | undefined, blockId: string, body: string): string {
  const begin = `<!-- ${MANAGED_BLOCK_PREFIX}:BEGIN ${blockId} -->`;
  const end = `<!-- ${MANAGED_BLOCK_PREFIX}:END ${blockId} -->`;
  const block = `${begin}\n${body.trim()}\n${end}`;

  if (!existingContent || existingContent.trim().length === 0) {
    return `${block}\n`;
  }

  const pattern = new RegExp(`${escapeForRegex(begin)}[\\s\\S]*?${escapeForRegex(end)}`, "m");
  if (pattern.test(existingContent)) {
    return `${existingContent.replace(pattern, block).trimEnd()}\n`;
  }

  return `${existingContent.trimEnd()}\n\n${block}\n`;
}

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
