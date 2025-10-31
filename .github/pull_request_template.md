## Summary
<!-- What does this change and why? -->

## Checklist
- [ ] ESLint clean
- [ ] TS strict passes
- [ ] Tests added/updated
- [ ] Docs updated (link)
- [ ] No secrets committed
- [ ] Scoped label applied (PR-3 | PR-1 | PR-5)

## Risk & Rollback
- Risk level: Low / Medium / High
- Rollback plan: Revert PR; feature flag `AI_PROVIDER` / disable route

---

### Handoff
@copilot
Please propose/apply safe fixes for any remaining ESLint/CodeQL findings. If changes are non-trivial, open a **stacked PR** titled:
`[stack] <follow-up>: <short description>`

Include:
- Diff summary
- Links to alerts you're fixing
- Any assumptions (env vars, RLS, rate limits)
