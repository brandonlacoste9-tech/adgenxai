#!/usr/bin/env bash
set -euo pipefail
echo "Codex maintenance: refreshing cache..."

# Safe refresh: update lockfile-based installs
pnpm install

# Lightweight checks to ensure container health
pnpm run lint || true
