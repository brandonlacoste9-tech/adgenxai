# Copilot Guardrails

- Keep PRs **under 400 LOC** net change.
- Never commit secrets. Read from `process.env` only.
- Preserve TypeScript strictness; ESLint must pass.
- Update tests and docs with any behavior change.
- Propose a plan (files+diff summary) before large edits.
- Link PRs to **Phase-2** project and apply labels:
  - `PR-3: Providers`
  - `PR-1: Supabase`
  - `PR-5: Auth`
