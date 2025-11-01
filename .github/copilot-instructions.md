# Copilot Instructions for AdGenXAI - AI Sensory Cortex

## Project Overview
AdGenXAI is a TypeScript-based AI automation platform that operates as a "Sensory Cortex" - processing webhooks to orchestrate AI-powered advertising workflows. The architecture is serverless-first, using Netlify Functions as the primary compute layer.

## Core Architecture Patterns

### Sensory Cortex Design
- **Webhook-driven**: All interactions flow through GitHub webhooks processed by Netlify Functions
- **Event-based**: Functions respond to events and trigger downstream AI workflows
- **Telemetry-focused**: Built-in monitoring and observability via `telemetry-dashboard.ts` and `webhook-telemetry.ts`
- **Health monitoring**: Real-time status via `/health` endpoint with cortex configuration details

### Function Structure (`netlify/functions/`)
All functions follow this pattern:
```typescript
import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  // 1. Validate HTTP method and headers
  // 2. Parse and log event data with deliveryId
  // 3. Process business logic
  // 4. Return structured JSON response
};
```

## Critical Development Workflows

### Local Development
```bash
npm run dev          # Starts netlify dev server (not standard Next.js)
npm run typecheck    # TypeScript validation (required before PRs)  
npm run build        # Compiles TypeScript to dist/
npm run deploy       # Production deployment to Netlify
```

### CI/CD Pipeline
- **Trigger**: All PRs and pushes to main
- **Jobs**: typecheck → build (sequential)
- **Node version**: 18 (locked for consistency)
- **Cache strategy**: npm cache with `--prefer-offline`

## Project-Specific Conventions

### TypeScript Configuration
- **Target**: ES2022 with ES modules (`"type": "module"` in package.json)
- **Strict mode**: Enabled with comprehensive type checking
- **Output**: Compiled to `dist/` directory
- **Include paths**: `netlify/functions/**/*` and `packages/**/*`

### Security & Monitoring Patterns
- **No PII logging**: Strict policy against logging sensitive data
- **Auth middleware**: Required on all routes returning sensitive data
- **Webhook validation**: All GitHub webhooks include deliveryId tracking
- **Network policy**: External API calls restricted (see `docs/Codex_NETWORK_POLICY.md`)

### Error Handling
```typescript
// Standard error response pattern
return {
  statusCode: 405,
  body: JSON.stringify({ error: 'Method not allowed' })
};
```

### Telemetry Integration
- All functions log structured events with timestamps
- Delivery IDs track webhook processing end-to-end
- Health endpoint exposes cortex configuration state
- 30-day telemetry retention policy

## Integration Points

### External Dependencies
- **OpenAI**: AI model integration (`openai` package v6.7.0)
- **Netlify**: Serverless runtime and blob storage (`@netlify/functions`, `@netlify/blobs`)
- **Zod**: Runtime type validation for webhook payloads
- **Express**: Used within functions for routing (not standalone server)

### GitHub Integration
- **Webhook events**: Processed via `github-webhook.ts`
- **Event types**: Repository, PR, and issue events
- **Validation**: Headers include `x-github-event` and `x-github-delivery`

### AI Workflow Orchestration
- **Sora integration**: Video generation via `sora-generate.ts`
- **Content processing**: AI-powered advertising content creation
- **Event-driven**: Triggered by GitHub repository activities

## Key Files & Directories

### Essential Architecture Files
- `netlify/functions/github-webhook.ts` - Main webhook entry point
- `netlify/functions/health.ts` - System health and configuration
- `netlify/functions/telemetry-dashboard.ts` - Monitoring interface
- `tsconfig.json` - TypeScript configuration with ES2022 modules

### Documentation & Conventions
- `AGENTS.md` - AI agent guidelines and security policies
- `docs/Codex_NETWORK_POLICY.md` - External API access restrictions  
- `.github/workflows/ci.yml` - CI pipeline configuration
- `scripts/` - Automation and operations scripts

### Development Guidelines
- `package.json` - Scripts use `netlify dev` not standard Node.js patterns
- `.env.example` - Environment variable templates
- `netlify.toml` - Deployment and function configuration

## Testing & Quality Assurance

### Required Checks
- **TypeScript**: `npm run typecheck` must pass
- **Unit tests**: Required for behavior changes (`pnpm test`)
- **Security scan**: `npm run codeql` for vulnerability detection
- **Lint**: `pnpm lint` for code quality

### Review Standards
- No secrets or PII in logs
- Auth middleware on sensitive endpoints
- Structured error responses
- Event tracking with delivery IDs
- Network policy compliance for external calls

This codebase prioritizes observability, security, and event-driven AI automation within a serverless architecture.

## Local Development & Tests (Quickstart)

1. Copy `.env.example` → `.env.local` and fill keys (no secrets in Git).
2. Start Netlify dev (serverless + frontend):
   ```bash
   npm ci
   npm run dev        # uses netlify dev; runs functions + Next.js
   ```
3. Run unit tests:
   ```bash
   npm test
   ```
4. Run integration tests (Playwright or API mocks):
   ```bash
   npx playwright test   # if configured
   ```
5. Lint & typecheck:
   ```bash
   npm run lint
   npm run typecheck
   ```

## Provider Adapter Interface

```typescript
// lib/providers/types.ts
export type Msg = { role: 'user'|'assistant'|'system'; content: string };

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  extra?: Record<string, any>;
}

export interface StreamingChunk {
  text: string;
  done?: boolean;
  meta?: Record<string, any>;
}

export interface ProviderAdapter {
  name: string; // 'openai' | 'github'
  init(config: ProviderConfig): Promise<void>;
  // streaming generator for server-sent events
  stream(messages: Msg[], opts?: { model?: string; stop?: string[] }):
    AsyncGenerator<StreamingChunk, void, unknown>;
  // optional token accounting helper
  countTokens?(text: string): Promise<{ promptTokens: number; completionTokens: number }>;
}
```

## Telemetry / Echo Event Schema

```json
{
  "event_type": "dispatch|response|error|approval",
  "agent": "string",
  "run_id": "string",
  "thread_id": "string|null",
  "payload": { /* domain object */ },
  "ts": "ISO-8601 timestamp",
  "meta": { "duration_ms": 123, "tokens_used": 456, "status": "ok|error|aborted" }
}
```

## Webhook Processing Rules

- Always parse `X-Hub-Signature` (or provider signature) and verify before processing.
- Use `delivery_id` or `X-Request-Id` to detect duplicates. Persist processed delivery IDs with TTL.
- Design handlers to be idempotent: if processing a second time, skip side effects.
- Emit Echo events at: received → validated → dispatched → completed/failed.
- For long-running jobs, return 202 with `run_id` and use Echo/History for follow-up.

## Supabase RLS Example

```sql
-- Example: restrict `projects` rows to owner_id = auth.uid()
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_owner_only" ON projects
  FOR SELECT USING (owner_id = auth.uid());

-- For inserts you might require:
CREATE POLICY "project_insert_own" ON projects
  FOR INSERT WITH CHECK (owner_id = auth.uid());
```

## CCR Autofix Policy

### Safe autofixes:
- ESLint `--fix` formatting & trivial refactors
- Typo fixes in comments, README
- Minor test assertions when unit test rerun passes

### Require human review (no auto-apply):
- RLS or auth changes
- Provider credentials or runtime changes
- Large refactors or changes that affect data model
- Any change that increases attack surface (CORS, network rules)

## Example PR Template for Agent PRs

```markdown
PR title: feat(pr-3): provider - <short description>

Body:
- Summary: what changed and why
- Files changed (bullet list)
- Tests: how they were run
- Env required: e.g., AI_PROVIDER=openai
- Risk: Low/Medium/High
- Rollback: revert commit or feature flag AI_PROVIDER=github
- Checklist:
  - [ ] ESLint passes
  - [ ] TS strict passes
  - [ ] Unit tests pass
  - [ ] Integration smoke tested with netlify dev
```

## Monitoring & Alerts

- Define thresholds for metrics (Echo/Metric ritual):
  - errors_per_minute > 5 → alert
  - avg_latency_ms > 2000 → warn
  - token_spend_per_day > budget_threshold → alert
- All alerts must map to a runbook: doc/incident-runbooks.md
- Snapshot Postgres nightly, rotate service role keys monthly.