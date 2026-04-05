This workflow enforces Red-Green-Refactor for any slice implementation.

- RED: write or update the test first and run it to confirm failure for the expected reason.
- GREEN: make the smallest production change that makes the test pass.
- REFACTOR: improve structure without changing behavior and rerun the checks.
- Reject shortcuts such as skipping test execution, deleting tests, weakening assertions, or using `--passWithNoTests`.
