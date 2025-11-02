#!/usr/bin/env bash
set -euo pipefail

if ! command -v git >/dev/null 2>&1; then
  echo "git is required to run this script" >&2
  exit 1
fi

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is dirty. Please commit or stash changes before running." >&2
  exit 1
fi

TARGET_BRANCH="feat/phase2-autonomous-kickoff"

if git show-ref --verify --quiet "refs/heads/$TARGET_BRANCH"; then
  git checkout "$TARGET_BRANCH"
else
  git checkout -b "$TARGET_BRANCH"
fi

mkdir -p .github/workflows

cat <<'YAML' > .github/workflows/phase2.yml
name: Phase-2 Autonomous Orchestrator

on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
  workflow_dispatch:

permissions:
  contents: read
  pull-requests: write
  issues: write
  checks: read

concurrency:
  group: phase2-${{ github.ref }}
  cancel-in-progress: false

jobs:
  lint:
    name: ESLint
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint --if-present

  typecheck:
    name: TypeScript
    runs-on: ubuntu-latest
    permissions:
      contents: read
    needs: lint
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run typecheck

  test:
    name: Unit tests
    runs-on: ubuntu-latest
    needs: typecheck
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run test

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build

  label:
    name: Apply labels
    runs-on: ubuntu-latest
    needs: lint
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/labeler@v5
        with:
          configuration-path: .github/labeler.yml

  request-copilot-review:
    name: Request Copilot CCR
    runs-on: ubuntu-latest
    needs:
      - build
      - label
    if: github.event.pull_request.draft == false
    permissions:
      contents: read
      pull-requests: write
      issues: write
    steps:
      - name: Summon Copilot CCR
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const body = [
              "@copilot",
              "Phase-2 kickoff complete. Please initiate Code Review with tool-calling support.",
              "Ensure ESLint/CodeQL suggestions are surfaced as stacked PR stubs."
            ].join("\n\n");
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body,
            });

  brief-claude:
    name: Brief Claude
    runs-on: ubuntu-latest
    needs: request-copilot-review
    if: github.event.pull_request.draft == false
    permissions:
      contents: read
      pull-requests: write
      issues: write
    steps:
      - name: Ping Claude
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const body = `@claude
Phase-2 orchestration initiated. Please provide an implementation plan covering PR-3 (Providers), PR-1 (Supabase), and PR-5 (Auth). Include risk notes and required secrets.`;
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body,
            });
YAML

cat <<'YAML' > .github/labeler.yml
PR-3-providers:
  - 'app/**'
  - 'lib/providers/**'
  - 'scripts/providers/**'
PR-1-supabase:
  - 'lib/supabase/**'
  - 'app/**/supabase/**'
  - 'docs/supabase/**'
PR-5-auth:
  - 'lib/auth/**'
  - 'app/**/auth/**'
  - 'docs/auth/**'
phase2-kickoff:
  - '.github/workflows/phase2.yml'
  - 'setup-phase2-automation.sh'
  - '.github/labeler.yml'
YAML

mkdir -p docs/phase2
cat <<'EOF_DOC' > docs/phase2/orchestration.md
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
EOF_DOC

cat <<'EOF_TEMPLATE' > .github/pull_request_template.md
### Summary
<!-- What changed and why -->

### Checklist
- [ ] ESLint is clean (no errors)
- [ ] TypeScript passes in `npm run typecheck`
- [ ] Tests added/updated and `npm run test` passes
- [ ] `npm run build` succeeds locally
- [ ] Docs updated for config/API changes

### Handoff
@copilot
Please propose/apply safe fixes for any remaining ESLint/CodeQL findings. If changes are non-trivial, open a **stacked PR** titled:
`[stack] <follow-up>: <short description>`

Include:
- Diff summary
- Links to alerts you’re fixing
- Any assumptions (env vars, RLS, rate limits)
EOF_TEMPLATE

mkdir -p .github/agents
cat <<'EOF_AGENT' > .github/agents/COPILOT.md
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
EOF_AGENT

git add .github/workflows/phase2.yml \
        .github/labeler.yml \
        docs/phase2/orchestration.md \
        .github/pull_request_template.md \
        .github/agents/COPILOT.md \
        setup-phase2-automation.sh

git commit -m "feat(phase2): bootstrap autonomous orchestration"

echo "Phase-2 automation assets committed on branch $TARGET_BRANCH."
echo "Next steps: push via 'git push -u origin $TARGET_BRANCH' and open the kickoff PR."
