#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: run-red.sh <test-command>" >&2
  exit 1
fi

command="$*"
echo "Running RED step: $command"
bash -lc "$command"
