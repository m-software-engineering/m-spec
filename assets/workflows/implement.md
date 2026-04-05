Use this workflow only when plan and slice specs already exist.

1. Read the relevant slice specs and honor `ownedPaths` boundaries.
2. Delegate work using agent-native subagents or tasks when slices are independent.
3. Create isolated git worktrees for parallel slices with `{{RUNTIME_ROOT}}/scripts/create-worktree.sh`.
4. Follow Red-Green-Refactor strictly. A failing test must exist before production code changes.
5. Never bypass tests, never weaken assertions to make the run pass, and never overlap file ownership across subagents.
6. Keep the human-facing summary anchored to the slice specs that were implemented.
