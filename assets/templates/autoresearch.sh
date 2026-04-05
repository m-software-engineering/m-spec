#!/usr/bin/env bash
set -euo pipefail

# Replace this command with the benchmark or workload for your repository.
start_ms=$(python3 - <<'PY'
import time
print(int(time.time() * 1000))
PY
)

bash -lc "${1:-npm test}"

end_ms=$(python3 - <<'PY'
import time
print(int(time.time() * 1000))
PY
)

elapsed_ms=$((end_ms - start_ms))
echo "METRIC elapsed_ms=${elapsed_ms}"
