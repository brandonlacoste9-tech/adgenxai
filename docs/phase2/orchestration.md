# Phase-2 Autonomous Orchestrator

This document captures the guardrails for the autonomous swarm during Phase-2.

## Mission Threads
- **PR-3 (Providers):** Implement streaming AI providers with feature gating and telemetry.
- **PR-1 (Supabase):** Replace mock data with Supabase-backed views and RLS guards.
- **PR-5 (Auth):** Wire Supabase Auth, middleware enforcement, and tenant ownership checks.

## Operational Guardrails
- Keep stacked PRs under 400 LOC.
- Update tests and docs alongside functional changes.
- Never commit secrets or leak Supabase service keys.
- Maintain Aurora mobile-first styling and Netlify compatibility.
- Request Copilot CCR and Claude planning on every kickoff PR.

## Observability
- Labels seed the Phase-2 project board: `PR-3-providers`, `PR-1-supabase`, `PR-5-auth`, and `phase2-kickoff`.
- Workflow `.github/workflows/phase2.yml` orchestrates lint → typecheck → test → build.
- Comments automatically brief @copilot and @claude for review loops.
