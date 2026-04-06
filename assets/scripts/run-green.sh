#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: run-green.sh <test-command>" >&2
  exit 1
fi

command="$*"
echo "Running GREEN step (expected pass): $command"

bash -lc "$command"

echo "GREEN step confirmed: command passed."
