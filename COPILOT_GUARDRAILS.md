# Copilot Guardrails for AdGenXAI

This document defines the coding standards and constraints for all Phase-2 contributions.

## Pull Request Constraints

1. **Keep PRs small** — Net change < 400 LOC per PR. Split larger features into multiple PRs.
2. **No secrets in code** — Always use `process.env` for sensitive values. Never commit API keys, tokens, or credentials.
3. **Update docs & tests** — Any behavior change must include corresponding documentation and test updates.
4. **TypeScript strict mode** — All code must compile without errors under strict TypeScript settings.
5. **ESLint clean** — All code must pass ESLint checks before merging.

## Planning & Approval Workflow

1. **Propose plans with affected files** — Before making changes, post a file-by-file plan with estimated LOC and risk notes.
2. **Link PRs to Phase-2 project** — All PRs must be linked to the "Phase-2" GitHub project.
3. **Apply appropriate labels** — Use PR-specific labels (e.g., **PR-3: Providers**, **PR-1: Supabase**, **PR-5: Auth**).

## Code Quality Standards

- Maintain existing code style and patterns
- Add comments only when they match existing style or explain complex logic
- Use existing libraries whenever possible
- Only add new dependencies when absolutely necessary
- Ensure all tests pass before submitting PR

## Security

- Never log or expose service role keys
- Implement proper RLS (Row Level Security) policies
- Validate all user inputs
- Use parameterized queries to prevent SQL injection
- Follow principle of least privilege for API access
