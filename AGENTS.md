

# Repo Agent Guidance

<!--
model: gpt-5-codex
tools: [search, github, code-actions]
tone: precise, security-aware
-->

## Review guidelines

- Do not log PII or secrets.
- Verify auth middleware on routes returning sensitive data.
- For JS/TS: require unit tests for behavior changes; run `pnpm test`.
- Only run the commands specified in “Test & Lint commands”.

## Test & Lint commands

- Lint: pnpm lint
- Tests: pnpm test -- --coverage
- Security scan: npm run codeql

## Internet policy (agent)

- Agent runtime MUST NOT execute remote POST/PUT/PATCH/DELETE.
- If a task references an external URL, print it and request human approval before executing.

## Network policy

See [DOCS/Codex_NETWORK_POLICY.md](DOCS/Codex_NETWORK_POLICY.md) for full details and allowlist.
