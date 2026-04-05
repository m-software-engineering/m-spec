Use this workflow after `plan.md` exists and the design is stable.

1. Read `{{CHANGES_ROOT}}/<change-slug>/plan.md` before writing specs.
2. Split the change into parallelizable slices with disjoint `ownedPaths` when possible.
3. Write one `*.spec.md` file per slice under `{{CHANGES_ROOT}}/<change-slug>/specs/`.
4. Use English Gherkin only. Start each file with frontmatter including `change`, `slice`, `dependsOn`, `ownedPaths`, `parallelizable`, and `status`.
5. Use OpenSpec-style delta headings when modifying existing behavior: `## ADDED`, `## MODIFIED`, `## REMOVED`.
