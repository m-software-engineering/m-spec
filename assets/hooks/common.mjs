#!/usr/bin/env node
import { readFileSync } from 'node:fs';

export async function readPayload() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  return raw ? JSON.parse(raw) : {};
}

export function parseToolArgs(payload) {
  if (payload.tool_input && typeof payload.tool_input === 'object') return payload.tool_input;
  if (payload.toolArgs && typeof payload.toolArgs === 'string') {
    try { return JSON.parse(payload.toolArgs); } catch { return {}; }
  }
  return {};
}

export function toolName(payload) {
  return payload.tool_name ?? payload.toolName ?? '';
}

export function commandText(payload) {
  const args = parseToolArgs(payload);
  return args.command ?? payload.command ?? '';
}

export function referencedPath(payload) {
  const args = parseToolArgs(payload);
  return args.file_path ?? args.filePath ?? args.path ?? '';
}

export function isCopilotPayload(payload) {
  return 'toolName' in payload || 'toolArgs' in payload;
}

export function deny(payload, reason) {
  if (isCopilotPayload(payload)) {
    process.stdout.write(JSON.stringify({ permissionDecision: 'deny', permissionDecisionReason: reason }));
    process.exit(0);
  }
  process.stderr.write(`${reason}\n`);
  process.exit(2);
}

export function allow(payload) {
  if (isCopilotPayload(payload)) {
    process.stdout.write(JSON.stringify({ permissionDecision: 'allow' }));
  }
  process.exit(0);
}

export function loadPolicy(cwd) {
  return JSON.parse(readFileSync(`${cwd}/{{RUNTIME_ROOT}}/policy.json`, 'utf8'));
}
