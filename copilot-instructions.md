## Scope & priorities
- This is a Next.js 14 + TypeScript + Supabase project. Favor explicit types, strict null checks, and small composable modules.
- Prefer pure functions and server actions over ad-hoc API routes when possible.
- Never commit secrets; read from `process.env` only. Redact in logs.
- Keep PRs small (<400 net LOC). If a change touches DB + API + UI, propose a stacked PR set.

## Required checks before LGTM
1. ESLint: zero errors; warnings allowed only with inline justification.
2. CodeQL: no new alerts at `warning` or `error` severity.
3. Tests: all unit tests pass, add/adjust tests when changing behavior.
4. Docs: update relevant docs/README whenever API or config changes.

## Fix strategies you may apply automatically
- Use ESLint `--fix` where safe; otherwise propose a follow-up commit.
- For CodeQL findings: prefer least-privilege fixes and constant-time patterns where relevant.
- For flaky async code: add timeouts, abort signals, and proper error typing.
- For Supabase queries: always validate inputs, enforce RLS assumptions in code comments, and handle nulls.

## Review tone
- Be specific: cite files and lines.
- Link to code where the invariant is enforced/violated.
- When in doubt, open a small stacked PR and request review.
