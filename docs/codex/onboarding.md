# Onboarding — Codex Fraud Canary

Quick guide to get started:
1. Clone the repo and `npm ci`
2. Run fixtures validator:
   `node scripts/validate-fixtures.js docs/codex/*/fixtures/*.json`
3. Run all fixtures in dry-run:
   `DRYRUN=1 node scripts/run-fraud-canary-all.sh`
4. Inspect `reports/` and open PRs for any fixes
