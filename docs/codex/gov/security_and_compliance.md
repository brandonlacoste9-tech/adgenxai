# Security & Compliance Guidance — Codex Fraud Canary

## Secrets
- Restrict `SUPABASE_KEY` to service-role minimal scope or function-specific key.
- Store secrets in repo settings → Secrets. Never hardcode keys in fixtures or artifacts.

## Data retention
- Canary artifacts kept 30 days. For PII or production-sensitive blobs, redact before storing.
- If a report contains any customer-identifiable info, mark it private and restrict access.

## Access control
- Use CODEOWNERS & GitHub teams for review gating.
- Scheduled production runs require an explicit `use_prod=true` in `workflow_dispatch`.

## Logging
- Avoid logging keys or raw payloads. Mask PII at the source (scripts format).
