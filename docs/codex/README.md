# Codex Playbooks

Codex playbooks are automation rituals that exercise critical subsystems end to end. Each playbook includes:

- **Triggering context** (PR filters or schedules)
- **Inputs and secrets** required to run
- **Steps** that invoke Supabase functions or local engines via documented scripts
- **Outputs** for CodexReplay overlays and stakeholder summaries

## Running Fraud Canary locally

```bash
npm ci
node scripts/run-fraud-canary.js \
  --supabase-url "$SUPABASE_URL" \
  --supabase-key "$FRAUD_API_KEY" \
  --fixtures docs/codex/fixtures/fraud_canary/sample_campaigns.json
node scripts/format-fraud-report.js --input fraud_summary.json --output reports/fraud-report.md
```

The scripts call the deployed Supabase function at `supabase/functions/fraud-detection-api` to ensure the same behavior observed in production. Reports land in `reports/fraud-report.md` and can be attached to PRs or incidents.

## Secrets

Add the following repository secrets before enabling the GitHub Action:

- `SUPABASE_URL`
- `FRAUD_API_KEY`

## Additional playbooks

Additional playbooks (Attribution QA, ML Drift, UI Snapshot Tour, Pricing Linter, Content Autopilot, Analytics Sanity) follow the same structure. Add new YAML definitions to `docs/codex/playbooks/` and pair them with scripts under `scripts/` plus workflows under `.github/workflows/`.
