# Incident Runbook — Fraud Detection Canary / Production Alerts

## Pager -> Owner
- Primary: @analytics-oncall
- Secondary: @ops-oncall
- Slack channel: #codex-fraud-canary

## When to run
- Canary failure with severity >= HIGH
- Production alert: repeated false positives > threshold, pipeline errors, data ingestion failures

## Immediate actions (First 15 minutes)
1. Acknowledge the alert in the channel and set status to **Incident — Triage**.
2. Attach the latest canary artifact: `reports/` (adgenxai-*.json, beehive-*.json) and `created-issues.jsonl`.
3. Run basic health checks:
   - Ingestion: confirm `creative_scores` table receiving new rows.
   - Fraud function: `supabase functions invoke fraud-detection-api --payload {"test":true}` (staging) and confirm response.
   - DB connectivity: `psql` / dashboard check.
4. If external APIs are failing (GPT, Veo, ElevenLabs), set the incident scope to **external** and notify platform teams.

## Triage (15–40 minutes)
- Reproduce failure with deterministic fixture (from `docs/codex/fixtures/fraud_canary/`).
- Collect logs:
  - Supabase function logs
  - Canary output in `artifact/fraud_report.md`
  - Application logs around time window
- Determine impact:
  - % of decisions impacted
  - Which customers or campaigns are affected

## Containment (40–90 minutes)
- If the fraud function is returning bad scores, *do not* change thresholds in prod. Instead:
  - Disable automated scoring write path in a controlled manner (flip `WRITE_FRAUD_RESULTS=false` feature flag).
  - Switch to “read-only” mode for scoring outputs and surface results to ops.
- If ingestion is the cause, stop ingestion (or replay backlog after fix).

## Remediation (90+ minutes)
- Root cause fix (deploy to staging -> run canary -> promote)
- Re-run full canary across AdGenXAI and Beehive fixtures
- Generate postmortem draft in `docs/codex/incidents/` with timeline and action items.

## Post-incident
- Complete postmortem within 72 hours.
- Add regression fixtures to `docs/codex/fixtures/fraud_canary/` that cover the failure mode.
- Adjust canary thresholds if the event exposed a fragile threshold.
