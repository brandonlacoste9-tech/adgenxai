#!/usr/bin/env bash
set -euo pipefail
echo "Codex setup starting..."

# Node example; adapt for your stack
export CI=true
# Use lockfiles; do not use `latest`
pnpm install --frozen-lockfile

# Install dev tools used by agent verification
pnpm add -D eslint jest @types/jest

# Run safe quick checks (do not run long integration tests)
pnpm run lint || true
pnpm run test -- --runInBand --silent || true

echo "Codex setup complete."
