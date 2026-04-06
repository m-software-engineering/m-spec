This workflow enforces Red-Green-Refactor for any slice implementation.

- RED: write or update the test first and run it with `{{RUNTIME_ROOT}}/scripts/run-red.sh <test-command>` so failure is explicit.
- GREEN: make the smallest production change that makes the test pass, then run `{{RUNTIME_ROOT}}/scripts/run-green.sh <test-command>`.
- REFACTOR: improve structure without changing behavior and rerun the checks.
- Reject shortcuts such as skipping test execution, deleting tests, weakening assertions, or using `--passWithNoTests`.
