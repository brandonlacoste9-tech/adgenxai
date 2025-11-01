# Codex Fraud Canary — Playbook Overview

This directory contains the **Codex Fraud Canary**: a deterministic, auditable playbook
that exercises the fraud-detection pipeline end-to-end and produces human-reviewable reports.

## What’s in this folder

- `playbooks/fraud_canary.yaml` — canonical playbook definition and triggers.
- `fixtures/fraud_canary/` — deterministic campaign fixtures for repeatable tests.
- `reports/` — artifacts produced by runs (uploaded by CI).
- `README.md` — this file.

## Goals

- Continuously validate fraud detection logic (scoring, thresholds, indicators).
- Produce a digestible report with severity assessment and remediation suggestions.
- Keep PR runs safe (DRYRUN) and nightly runs configurable for production checks.

## How to run

### Locally (dry-run)
````bash
# run the canary in dry-run mode (no production writes)
node scripts/run-fraud-canary.js --fixtures docs/codex/fixtures/fraud_canary/sample_campaigns.json --out reports/fraud_summary.json --dry-run
node scripts/format-fraud-report.js --input reports/fraud_summary.json --output reports/fraud-report.md
````

### On CI (recommended)

* PR runs are configured to run in **DRYRUN** mode and produce artifacts (no prod writes).
* Nightly runs can be enabled to call the production API by setting `USE_PROD_API=true` in the workflow or using the workflow_dispatch `use_prod` input (manual opt-in required).

## Secrets needed for production runs

* `SUPABASE_URL`
* `SUPABASE_KEY` (service or function key)
* `SLACK_WEBHOOK_URL` (optional for notifications)

## Safety notes

* PR runs MUST run with `DRYRUN=1` and must never expose secrets to forked-code contexts.
* The canary logs created items to `created-issues.jsonl` and uploads artifacts for auditing.
* This playbook **does not** auto-remediate. Any operational actions require human approval.

## Contact

For questions, tag: `@analytics-team`, `@ops-team`, or `@brandonlacoste9-tech`.

