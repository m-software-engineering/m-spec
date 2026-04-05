#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "usage: create-worktree.sh <branch-name> <target-dir> [base-ref]" >&2
  exit 1
fi

branch_name="$1"
target_dir="$2"
base_ref="${3:-HEAD}"

git worktree add -b "$branch_name" "$target_dir" "$base_ref"
