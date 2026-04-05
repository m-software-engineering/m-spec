#!/usr/bin/env node
import { allow, commandText, deny, loadPolicy, readPayload } from './common.mjs';

const payload = await readPayload();
const command = commandText(payload);
if (!command) allow(payload);
const policy = loadPolicy(payload.cwd ?? process.cwd());
for (const pattern of policy.dangerousCommandPatterns ?? []) {
  if (new RegExp(pattern, 'i').test(command)) {
    deny(payload, `Blocked dangerous shell command: ${command}`);
  }
}
allow(payload);
