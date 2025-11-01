# Operational Readiness Playbook — Fraud Canary

## Purpose
Ensure codex and fraud systems are ready for production monitoring and on-call response.

## Pre-flight checklist (weekly)
- [ ] Canary workflow runs cleanly in dry-run mode
- [ ] Canary artifacts are uploaded and preserved (30-day retention)
- [ ] All secrets validated: `SUPABASE_URL`, `SUPABASE_KEY`, `SLACK_WEBHOOK_URL`
- [ ] CODEOWNERS and oncall rotation are up-to-date
- [ ] Instrumentation: APM, logs, and metrics dashboards defined

## Deployment checklist
- Run canary in staging against staging functions
- Validate reports
- Smoke test UI flows (publish, scoring, analytics)

## Runbook for changing thresholds
- Create a PR with test fixtures demonstrating new threshold
- Ensure two sigs: analytics-team + ops-team
- Use canary to validate historical fixtures before merge
