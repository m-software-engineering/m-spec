Use this workflow when the user asks for planning but implementation should not start yet.

1. Inspect the current repository state and brownfield constraints before making decisions.
2. Derive or confirm a kebab-case change slug, then write `{{CHANGES_ROOT}}/<change-slug>/plan.md`.
3. The plan must include summary, current state, architecture choices, affected paths, testing strategy, risks, and references.
4. Prefer concrete file paths and ownership boundaries over vague implementation advice.
5. Do not write production code as part of this workflow.
