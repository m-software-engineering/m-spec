# m-spec

m-spec is a TypeScript CLI that scaffolds and maintains a spec-driven workflow for brownfield repositories that use AI coding agents.

## What it does

- Initializes an `m-spec/` workspace with specs, workflows, and project policy files.
- Generates agent-specific wrappers and instruction files for Codex, Claude, or Copilot.
- Updates managed files from saved configuration.
- Validates generated assets and local setup.
- Reconciles change-specific deltas back into source-of-truth specs.

## Why this is aligned with Spec-Driven Development

- **Spec-first workflow**: generated plan/spec/implement/optimize wrappers keep work anchored in `m-spec/changes/...` artifacts.
- **Strict TDD helpers**: generated scripts now include `run-red.sh` (expects failing tests) and `run-green.sh` (expects passing tests).
- **Lightweight optimization loop**: autoresearch templates include benchmark + checks + ratchet scripts so experiments can be kept/discarded consistently.
- **Agent-agnostic scaffolding**: Codex skills, Claude agents, and Copilot agents/hooks are generated from the same workflow definitions.

## Requirements

- Node.js 22+
- npm

## Install globally from npm

```bash
npm i -g @m-software-engineering/m-spec
```

## Install dependencies

```bash
npm install
```

## Run locally

Use the development entrypoint:

```bash
npm run dev -- <command> [options]
```

Running without a command now opens an interactive command picker:

```bash
npm run dev
```

Common commands:

```bash
npm run dev -- init .
npm run dev -- update .
npm run dev -- doctor .
npm run dev -- reconcile <change-slug> .
```

Build the distributable CLI:

```bash
npm run build
```

After building, run the bundled binary:

```bash
node dist/cli.js <command>
```

## Test and quality checks

Run tests:

```bash
npm test
```

Run type checks:

```bash
npm run typecheck
```

Clean generated artifacts:

```bash
npm run clean
```

## Contributing best practices

- Keep changes small and focused on one behavior.
- Add or update tests for every behavior change.
- Run `npm test` and `npm run typecheck` before committing.
- Preserve generated file determinism and avoid hidden side effects.
- Update docs when command behavior or generated outputs change.

## Releases

- Add a Changeset for any publishable change with `npm run changeset`.
- Merges to `main` run CI and the release job in GitHub Actions.
- If unreleased Changesets exist, the workflow opens or updates a release PR.
- Merging that release PR publishes the package to npm using the `NPM_TOKEN` GitHub secret.
