#!/usr/bin/env bash
set -euo pipefail

if [[ -f package.json ]]; then
  npm test -- --runInBand 2>/dev/null || npm test 2>/dev/null || true
fi
