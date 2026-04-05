## M-SPEC Workflow

- Source specs live in `{{SPECS_ROOT}}`.
- Change-specific artifacts live in `{{CHANGES_ROOT}}/<change-slug>`.
- Prefer the generated M-SPEC workflow artifacts before inventing ad-hoc process.
- Planning must write a human-readable `plan.md` before implementation starts.
- Specs must be generated in English Gherkin and split by parallelizable slice.
- Implementation must use TDD and show a real RED step before GREEN.
- Parallel implementation must use disjoint ownership and isolated worktrees.
{{AUTORESEARCH_LINE}}
{{BROWSER_TOOLS_LINE}}
