# m-spec

m-spec is a TypeScript CLI that scaffolds and maintains a spec-driven workflow for brownfield repositories that use AI coding agents.

## What it does

- Initializes an `m-spec/` workspace with specs, workflows, and project policy files.
- Generates agent-specific wrappers and instruction files for Codex, Claude, or Copilot.
- Updates managed files from saved configuration.
- Validates generated assets and local setup.
- Reconciles change-specific deltas back into source-of-truth specs.

## Requirements

- Node.js 22+
- npm

## Install dependencies

```bash
npm install
```

## Run locally

Use the development entrypoint:

```bash
npm run dev -- <command> [options]
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
