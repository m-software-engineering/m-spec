#!/usr/bin/env node
import path from 'node:path';
import { allow, commandText, deny, loadPolicy, readPayload, referencedPath } from './common.mjs';

const payload = await readPayload();
const cwd = payload.cwd ?? process.cwd();
const policy = loadPolicy(cwd);
const values = [commandText(payload), referencedPath(payload)].filter(Boolean);

for (const candidate of values) {
  const normalized = candidate.split(path.sep).join('/');
  for (const pattern of policy.protectedPathPatterns ?? []) {
    if (new RegExp(pattern, 'i').test(normalized)) {
      deny(payload, `Blocked access to protected path: ${candidate}`);
    }
  }
}

allow(payload);
