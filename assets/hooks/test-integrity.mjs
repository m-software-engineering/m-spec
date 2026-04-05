#!/usr/bin/env node
import path from 'node:path';
import { allow, commandText, deny, loadPolicy, parseToolArgs, readPayload, referencedPath, toolName } from './common.mjs';

const payload = await readPayload();
const cwd = payload.cwd ?? process.cwd();
const policy = loadPolicy(cwd);
const command = commandText(payload);
const args = parseToolArgs(payload);
const targetPath = referencedPath(payload);

for (const pattern of policy.testIntegrityPatterns?.deniedShell ?? []) {
  if (command && command.includes(pattern)) {
    deny(payload, `Blocked test-bypass shell pattern: ${pattern}`);
  }
}

const candidatePaths = [targetPath, args.old_string, args.new_string, command]
  .filter(Boolean)
  .map((value) => String(value).split(path.sep).join('/'));

for (const value of candidatePaths) {
  for (const pattern of policy.testIntegrityPatterns?.deniedPathRegexes ?? []) {
    if (new RegExp(pattern, 'i').test(value) && /(rm|mv|del|remove-item|write|edit)/i.test(`${toolName(payload)} ${command}`)) {
      deny(payload, `Blocked modification that appears to target tests: ${value}`);
    }
  }
}

allow(payload);
