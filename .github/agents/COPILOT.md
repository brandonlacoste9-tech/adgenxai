# Copilot Agent Script

Paste the following once the kickoff PR is open:

```
AdGenXAI Phase-2 Autonomous Execution Mode

Mission: Implement streaming AI providers, Supabase integration, and the auth system via autonomous stacked PRs.

Constraints: PRs < 400 LOC; ESLint + TypeScript strict must pass; update tests & docs; never commit secrets; maintain Aurora mobile-first styling and BEE-SHIP deploy compatibility.

PR-3 (Providers): Real streaming via OpenAI with GitHub Models fallback (AI_PROVIDER=openai|github). Implement adapter interface, concrete adapters, streaming + abort support, token counting, feature flag, error handling, and unit tests.

PR-1 (Supabase): Replace mock dashboard data with Supabase views/RPC and real-time subscriptions. Enforce RLS rules, typed server APIs, and integration tests (mocked Supabase). Add minimal server-side aggregation endpoints if needed.

PR-5 (Auth): Supabase Auth integration; session handling; middleware to enforce auth & tenant ownership; RLS examples in docs; unit tests for auth flows.

Actions: Propose a plan with file list and per-file diffs. Wait for approval. Then implement in focused branches, open PRs linking to Phase-2, label PRs (PR-3/PR-1/PR-5), request @copilot CCR, and auto-fix deterministic findings via stacked PRs. Keep all changes small and testable.
```
