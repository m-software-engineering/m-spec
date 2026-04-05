Use this workflow to run a constrained optimization loop after the functional implementation is already correct.

1. Create or resume the session files under `{{CHANGES_ROOT}}/<change-slug>/optimize/`.
2. Keep a fixed evaluation command and metric for the current session.
3. Only keep an experiment if tests still pass and the metric improves in the desired direction.
4. Record each run in `autoresearch.jsonl` and summarize wins, losses, and dead ends in `autoresearch.md`.
5. Do not relax correctness checks to chase the metric.
