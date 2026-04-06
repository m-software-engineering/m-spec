#!/usr/bin/env bash
set -euo pipefail

# usage:
#   autoresearch.ratchet.sh <direction: lower|higher> <baseline> <candidate> [run-checks-command]
# examples:
#   ./autoresearch.ratchet.sh lower 1200 1110 "bash .m-spec/templates/autoresearch.checks.sh"

if [[ $# -lt 3 ]]; then
  echo "usage: autoresearch.ratchet.sh <direction: lower|higher> <baseline> <candidate> [run-checks-command]" >&2
  exit 1
fi

direction="$1"
baseline="$2"
candidate="$3"
checks_command="${4:-bash .m-spec/templates/autoresearch.checks.sh}"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "working tree must be clean before ratchet decisions" >&2
  exit 1
fi

if [[ "$direction" != "lower" && "$direction" != "higher" ]]; then
  echo "direction must be lower or higher" >&2
  exit 1
fi

improved="false"
if [[ "$direction" == "lower" ]]; then
  awk -v c="$candidate" -v b="$baseline" 'BEGIN {exit !(c < b)}' && improved="true"
else
  awk -v c="$candidate" -v b="$baseline" 'BEGIN {exit !(c > b)}' && improved="true"
fi

if [[ "$improved" != "true" ]]; then
  echo "discard: metric did not improve (${baseline} -> ${candidate})"
  git reset --hard HEAD
  exit 0
fi

if ! bash -lc "$checks_command"; then
  echo "discard: checks failed after improvement candidate"
  git reset --hard HEAD
  exit 0
fi

echo "keep: metric improved and checks passed (${baseline} -> ${candidate})"
