#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: run-red.sh <test-command>" >&2
  exit 1
fi

command="$*"
echo "Running RED step (expected failure): $command"

set +e
bash -lc "$command"
status=$?
set -e

if [[ $status -eq 0 ]]; then
  echo "RED step failed: command passed but should fail before implementation." >&2
  exit 1
fi

echo "RED step confirmed: command failed as expected (exit code $status)."
