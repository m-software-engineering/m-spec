Use this workflow to set up or resume an autoresearch session for the current repository.

1. Capture the optimization goal, metric, command, scope, and keep/discard criteria in `autoresearch.md`.
2. Use `{{RUNTIME_ROOT}}/templates/autoresearch.sh` as the baseline benchmark driver.
3. Use `autoresearch.checks.sh` to gate correctness after each passing benchmark.
4. Log every result append-only in `autoresearch.jsonl`.
5. Resume from the existing session files if they already exist.
