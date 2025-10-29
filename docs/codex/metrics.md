# Metrics & Dashboards — Fraud Detection

## Key metrics
- **fraud_score_distribution** — histogram of scores (by campaign)
- **false_positive_rate** — FP / total flagged (daily)
- **false_negative_rate** — FN / total missed (requires label data)
- **canary_pass_rate** — fraction of canary fixtures passing threshold checks
- **canary_latency_ms** — time per fixture / function invocation
- **ingestion_lag_seconds** — time between event timestamp and DB insert

## Dashboards
- Daily overview with fraud_score_distribution, FP/FN trends
- Canary dashboard: last 7 runs with pass/fail, artifact links
- Alert rules:
  - `canary_pass_rate < 90%` → P1
  - `false_positive_rate > 5%` and rising → P2
