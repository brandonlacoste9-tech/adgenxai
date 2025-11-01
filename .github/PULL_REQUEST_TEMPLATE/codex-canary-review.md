## Codex Fraud Canary Review Checklist

- [ ] Confirm `DRYRUN=1` for all `pull_request` runs
- [ ] Verify production secrets NOT used in PR context or forks
- [ ] Validate artifact contains expected fields (`fraud_summary.json`, `fraud-report.md`)
- [ ] Check fixtures in `docs/codex/fixtures/fraud_canary/` are deterministic and safe
- [ ] Confirm `scripts/run-fraud-canary.js` logs but does NOT auto-remediate
- [ ] Verify `SUPABASE_KEY` usage is minimal and properly scoped
- [ ] Review error handling and failure modes
- [ ] Confirm artifact retention period is appropriate (30 days)
- [ ] Ensure `CODEOWNERS` includes the right teams (analytics-team, ops-team)
