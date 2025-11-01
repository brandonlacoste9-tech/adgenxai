# Architecture Overview — Fraud Canary & Fraud Detection Pipeline

## Components
- **UI**: Next.js frontend (AdGenXAI)
- **Generator**: Video/voice generator microservices (Veo3, ElevenLabs)
- **Fraud detection**: `supabase/functions/fraud-detection-api` (business rules + ML model)
- **Reporting**: Codex scripts produce JSON artifacts and Markdown reports
- **Storage**: `creative_scores` table in Supabase
- **Runner**: GitHub Actions Canary runs, uploads artifacts

## Flow
1. Canary invokes `fraud-detection-api` with deterministic campaign fixtures.
2. Fraud function returns structured results (scores, indicators).
3. Runner aggregates results into `fraud_summary.json`.
4. Formatter (`format-fraud-report.js`) creates `fraud-report.md`.
5. Report is uploaded as artifact and optionally posted as PR comment or Slack message.

## Best practices
- Use staging endpoints for PR runs whenever possible.
- Namespace created logs per codex: `created-adgenxai.jsonl` and `created-beehive.jsonl`.
