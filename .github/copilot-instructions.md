# Copilot Instructions for AdGenXAI - AI Sensory Cortex

## Project Overview
AdGenXAI is a TypeScript serverless platform that acts as an "AI Sensory Cortex" - processing GitHub webhooks to orchestrate AI-powered advertising workflows. Built on Netlify Functions with LongCat integration for video generation.

## Development: Package Manager & Workflows

This repository uses **npm** as the canonical package manager.

Common commands:
- Install deps: `npm ci` (CI) or `npm install` (local)
- Dev (Netlify): `npm run dev`  # runs Netlify dev which proxies functions + SSR
- Build: `npm run build`        # production build (TypeScript compilation)
- Test: TypeScript validation with `npm run typecheck`
- Deploy: `npm run deploy`      # production deployment to Netlify

If you prefer `pnpm`, update the lockfile and CI config accordingly — but open a PR to avoid merge conflicts. We standardize on `npm` to match Netlify and the existing CI configuration.

## Core Architecture

### Serverless Functions (`netlify/functions/`)
All functions follow this pattern:
```typescript
import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  // 1. Validate HTTP method (POST only for webhooks)
  // 2. Extract GitHub headers (x-github-event, x-github-delivery)
  // 3. Parse payload and log with deliveryId for tracing
  // 4. Process business logic
  // 5. Return structured JSON with statusCode
};
```

**Key Functions:**
- `github-webhook.ts` - Main webhook processor, logs all GitHub events
- `sora-generate.ts` - LongCat video generation API (adapter preserving Sora routes)
- `health.ts` - System health with cortex configuration details
- `telemetry-dashboard.ts` - Real-time monitoring interface
- `webhook-telemetry.ts` - Event tracking and observability

### TypeScript Configuration
- **ES Modules**: `"type": "module"` with ES2022 target
- **Strict mode**: Full type checking enabled
- **Paths**: Functions in `netlify/functions/**/*`, packages in `packages/**/*`
- **Output**: Compiled to `dist/` directory

## Sensory Cortex: Webhook Event Mapping

We receive GitHub webhooks at `/.netlify/functions/github-webhook` and route them into the Sensory Cortex. Major event handlers:

- `push` → indexer + echo ritual (updates repo memory)
- `pull_request` → PR telemetry & policy gating
- `pull_request_review` → triggers CodeX knowledge sync
- `issue_comment` → triggers bot responses or agent workflows
- `workflow_run` → CI telemetry + automated agent training

Example: `push` handling pseudo-code:
1. Validate signature with `GITHUB_WEBHOOK_SECRET`
2. Extract `commits[]`, `pusher`, `ref`
3. Normalize to internal `Event` schema → push to `telemetry` queue
4. Trigger downstream `bee-swarm` tasks when necessary

## Environment Variables

| Name | Required | Purpose | Example / Notes |
|---|---:|---|---|
| LONGCAT_API_KEY | yes | LongCat API access for video generation | `sk-xxxxx` (store in Netlify env) |
| LONGCAT_BASE_URL | optional | LongCat API endpoint | `https://api.longcat.ai/v1` |
| GITHUB_WEBHOOK_SECRET | yes | GitHub webhook signature validation | store in GitHub secrets |
| NETLIFY_AUTH_TOKEN | optional | Netlify CLI / deploy tokens | store in GitHub secrets |
| NETLIFY_SITE_ID | optional | Site id for CLI deploys | used by `ntl deploy` |

**Security**: Never log or expose API keys. Use Netlify environment variables for production and `.env` (gitignored) for local development.

## Telemetry Event Schema

```json
{
  "eventId": "uuid-v4",
  "source": "github",
  "type": "push|pr|telemetry|codex",
  "timestamp": "2025-11-03T10:00:00Z",
  "payload": { /* event-specific object */ },
  "level": "info|warn|error",
  "meta": {
    "repo": "owner/repo",
    "actor": "username",
    "requestId": "tracing-id"
  },
  "tags": ["sensory","webhook","build"]
}
```

**Retention:**
- Raw events: 30 days
- Aggregated metrics: 365 days

## Netlify & Deployment

Key `netlify.toml` settings:
- `build.command = "npm run build"`
- `functions.directory = "netlify/functions"`

**Deployment Notes:**
- Ensure `package-lock.json` is in sync with `package.json` (Netlify uses `npm ci`)
- TypeScript compilation required before deployment
- If you see `Module not found` on Netlify, check `tsconfig` path mappings and package-lock.json sync

## Project-Specific Patterns

### Webhook Processing
- **Validation**: Always check `x-github-event` and `x-github-delivery` headers
- **Logging**: Structure logs with deliveryId, repository, action, timestamp
- **Idempotency**: Functions designed to handle duplicate deliveries safely
- **Error handling**: Return 405 for wrong methods, structured JSON for all responses

### Security & Monitoring
- **No PII**: Strict policy against logging sensitive data (see AGENTS.md)
- **Auth middleware**: Required on sensitive endpoints
- **Network policy**: External API calls restricted (see AGENTS.md)
- **Telemetry**: 30-day retention with structured event tracking

### AI Integration
- **LongCat**: Video generation via adapter preserving `/api/sora/*` routes
- **Request format**: Zod validation for prompts, duration, aspect ratio, style
- **CORS**: All AI endpoints include proper CORS headers
- **Error handling**: Graceful fallbacks with proper status codes and error details

## Testing & Quality Assurance

### Required Checks (per AGENTS.md)
```bash
npm run typecheck           # TypeScript validation (required)
pnpm lint                   # Code quality (if pnpm configured)
pnpm test -- --coverage    # Unit tests with coverage
npm run codeql             # Security scanning
```

### CI/CD Pipeline (.github/workflows/ci.yml)
- **Triggers**: PRs and pushes to main
- **Jobs**: typecheck → build (sequential)
- **Node**: Version 18 locked, npm cache with `--prefer-offline`
- **Required**: TypeScript must compile without errors

### Review Standards
- Auth middleware on routes returning sensitive data
- No secrets in logs or responses
- Unit tests required for behavior changes
- Delivery ID tracking for all webhook events

## Integration Points

### External Dependencies
- **@netlify/functions**: Serverless runtime
- **@netlify/blobs**: Persistent storage
- **LongCat client**: Video generation integration
- **zod**: Runtime validation for webhook payloads
- **express**: Internal routing within functions

### Local Development Setup
1. Copy `.env.example` → `.env` with required API keys
2. Run `npm ci --prefer-offline` for consistent dependencies
3. Use `npm run dev` for local development with hot reload
4. Access functions at `/.netlify/functions/[function-name]`

## Key Files Reference

**Core Architecture:**
- `netlify/functions/github-webhook.ts` - Webhook entry point
- `tsconfig.json` - ES2022 modules configuration
- `package.json` - Netlify-specific scripts, ES module type

**Documentation:**
- `AGENTS.md` - Security policies and test commands
- `WELCOME.md` - Onboarding for new contributors
- `.github/workflows/ci.yml` - Build pipeline

**Configuration:**
- `.env.example` - Required environment variables
- `netlify.toml` - Function configuration and routing

This codebase prioritizes webhook-driven automation, comprehensive telemetry, and secure AI integration within a serverless architecture.