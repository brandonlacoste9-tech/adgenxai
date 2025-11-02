#!/bin/bash
#!/usr/bin/env bash
# Dynamic AdgenxAI Fusion banner with git integration

# Attempt to read version from git tags
GIT_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v2.0.0")
LAST_COMMIT=$(git log -1 --format="%h (%cr)" 2>/dev/null || echo "no commit data")

VERSION=$GIT_TAG
DATE=$(date +"%A, %B %d, %Y %H:%M")

# Color codes
GREEN="\033[1;32m"
BLUE="\033[1;34m"
YELLOW="\033[1;33m"
RESET="\033[0m"

cat <<EOF

${BLUE}───────────────────────────────────────────────${RESET}
  ${GREEN}AdgenxAI Fusion Suite ${VERSION}${RESET}
${BLUE}───────────────────────────────────────────────${RESET}
Environment  : ${YELLOW}${CONTEXT:-dev}${RESET}
Current Date : ${YELLOW}${DATE}${RESET}
FastAPI Port : ${YELLOW}${PORT:-8000}${RESET}
Last Commit  : ${YELLOW}${LAST_COMMIT}${RESET}
Logs Path    : ./logs
Speech Path  : ./speech

Commands:
  python app.py              - Launch FastAPI server
  make rehearse              - Run rehearsal orchestration
  make docker-rehearse       - Containerized rehearsal
  make reset                 - Reset environment via uninstall.sh
  npm run rehearse           - Cross‑platform local rehearsal
  bash install.sh            - Setup environment
  bash uninstall.sh          - Cleanup environment
  bash bump_version.sh x.x.x - Auto‑update version and changelog

Docs & Tools:
  ./docs/orchestration.md    - Full runbook
  ./fusion_api_tests.rest    - VS Code API tests
  ./fusion_api_tests.http    - JetBrains requests
  ./CHANGELOG.md             - Release history

───────────────────────────────────────────────
EOF