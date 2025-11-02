#!/usr/bin/env bash
set -euo pipefail

REPORT_PATH=${1:-reports/fraud-report.md}

if [[ ! -f "$REPORT_PATH" ]]; then
  echo "Report path $REPORT_PATH not found" >&2
  exit 1
fi

if [[ -n "${GITHUB_EVENT_NAME:-}" && "${GITHUB_EVENT_NAME}" == pull_request* ]]; then
  gh pr comment "${GITHUB_REF_NAME:-}" --body-file "$REPORT_PATH"
else
  gh issue create --title "Codex Fraud Canary Alert" --body-file "$REPORT_PATH" --label "codex:fraud"
fi
