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

### Local Development & Debugging

### Setup
1. Copy `.env.example` → `.env` with required API keys
2. Run `npm ci --prefer-offline` for consistent dependencies
3. Use `npm run dev` for local development with hot reload
4. Access functions at `/.netlify/functions/[function-name]`

### Debug Mode
To enable runtime debug for webhook processing:
```bash
DEBUG_WEBHOOK_PROCESSING=1 npm run dev
```

To enable LongCat API debug logging:
```bash
DEBUG_LONGCAT=1 npm run dev
```

To disable LongCat adapter (rollback):
```bash
USE_LONGCAT=0 npm run dev  # Returns 501 errors
```

This prints gated debug info and is safe for local troubleshooting.

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
AdGenXAI is a Next.js AI-powered advertising platform with a "Sensory Cortex" architecture. The system generates ads/reels using AI agents, publishes to social platforms via Netlify functions, and provides a polished aurora-themed UI. Think of it as a webhook-driven AI advertising automation platform.

## Architecture ("Sensory Cortex" Pattern)
- **Frontend**: Next.js 14.2+ app with static export (`output: 'export'`) for Netlify hosting
- **Backend**: Netlify Functions act as the "sensory cortex" - serverless webhooks that orchestrate AI agents
- **AI Integration**: External "Bee Agent" API calls for content generation
- **Platform Publishing**: Modular platform adapters in `lib/platforms/` (Instagram, TikTok, YouTube)
- **Deployment**: Fully automated via "BEE-SHIP" batch scripts that commit → push → auto-deploy
- **CI/CD**: GitHub Actions with CodeQL security scanning, auto-labeling, and Copilot code reviews
- **Tech Stack**:
  - Next.js 14.2 with App Router
  - TypeScript (strict mode)
  - Tailwind CSS for styling
  - Framer Motion for animations
  - Vitest + Testing Library for testing
  - Netlify for hosting & serverless functions

## Key Developer Workflows

### Quick Development Start
```bash
npm run dev          # Start Next.js dev server
npm run test:watch   # Run Vitest in watch mode
npm run typecheck    # TypeScript validation
npm run build        # Production build
```

### Local Testing with Netlify Functions
```bash
netlify dev          # Run Netlify functions locally (test webhooks)
# POST to /.netlify/functions/<name> for testing
```

## Essential Knowledge for AI Agents

### Architecture Patterns
- **"use client"** directive: Required for components with state, browser APIs, or Framer Motion (see `TopBar.tsx`, `PromptCard.tsx`)
- **Streaming Pattern**: AbortController with `abortRef` for cancellable AI agent calls (see `PromptCard.tsx` lines 15-20)
- **Platform Adapter Contract**: All platform integrations follow same signature:
  ```typescript
  export type PlatformConfig = { accountId: string; accessToken: string };
  export async function publishContent(config: PlatformConfig, content: any): Promise<{ publishedId: string }>
  ```

### Netlify Function Conventions (CRITICAL)
- **Always include CORS headers** in all functions
- **Handle OPTIONS method** for preflight requests
- **Environment variables**: Use `NEXT_PUBLIC_SENSORY_CORTEX_URL` for frontend/function communication
- **Error handling**: Return structured JSON with `{ error: string, details?: string }`
- **Example pattern**: See `netlify/functions/post-to-instagram.ts`

### File Structure Navigation
- `app/` — React pages & components (App Router)
  - `app/components/` — Reusable UI components
  - `app/api/` — Server endpoints (complement Netlify functions)
  - `app/components/__tests__/` — Component tests with accessibility checks
- `lib/platforms/` — Platform adapters (Instagram, TikTok, YouTube)
- `netlify/functions/` — Serverless webhook functions
- `docs/bee-ship/` — BEE-SHIP deployment documentation
- `scripts/deployment/` — Automated deployment scripts (.bat files)

### Testing Patterns
- **Unit tests**: Vitest + @testing-library in jsdom environment
- **Test naming**: `ComponentName.test.tsx` or `ComponentName.feature.test.tsx`
- **Accessibility**: All components have a11y smoke tests (see `a11y.smoke.test.tsx`)
- **Streaming tests**: Mock ReadableStream for testing streaming UI components
- **Coverage**: Run `npm run test:ci` for coverage reports

### Configuration & Environment
- **Static Export**: `next.config.mjs` has `output: 'export'` for Netlify
- **Path Aliases**: Use `@/` imports (see `tsconfig.json` and `vitest.config.ts`)
- **Required env vars**: `BEE_API_URL`, `BEE_API_KEY`, `INSTAGRAM_ACCOUNT_ID`, `FB_ACCESS_TOKEN`, `SUPABASE_*`
- **Netlify redirects**: API routes redirect from `/api/*` to `/.netlify/functions/*`

### BEE-SHIP Deployment System
- **One-click deployment**: Use `.bat` scripts in `scripts/deployment/`
- **Commit → Push → Auto-deploy**: GitHub Actions handle CI/CD pipeline
- **Documentation**: See `docs/bee-ship/` for complete deployment guides
- **Local testing**: Use `netlify dev` before shipping

## Common Development Tasks

### Adding a New Platform
1. Create adapter in `lib/platforms/newplatform.ts` following the contract
2. Add Netlify function in `netlify/functions/post-to-newplatform.ts`
3. Add environment variables to `netlify.toml`
4. Write tests in `__tests__/` directory
5. Update documentation in `docs/`

### Debugging Webhooks
- Use `netlify dev` to test functions locally
- Check browser network tab for CORS issues
- Verify environment variables are set correctly
- Test with `curl` or Postman for function endpoints

### Component Development
- Add `"use client"` for interactive components
- Include accessibility attributes and ARIA labels
- Write corresponding test in `__tests__/` directory
- Use Framer Motion for animations with proper reduced motion support

## TypeScript & Code Quality
- **Strict mode**: All TypeScript errors must be resolved
- **Path imports**: Use `@/components`, `@/lib` aliases
- **No any types**: Use proper typing or unknown/object
- **ESLint compliance**: Run `npm run typecheck` before committing

## AI Video Generation Integration (LongCat)

### LongCat Client Architecture
- **Location**: `lib/providers/longcat-client.ts`
- **Purpose**: Generate videos from text prompts using LongCat API with retry/polling support
- **Key Features**:
  - Retry logic with exponential backoff (default: 3 attempts)
  - Polling with timeout (default: 5 minutes max wait)
  - Support for cinematic styles, custom durations, aspect ratios
  - Response transformation (snake_case API → camelCase internal)
- **Config**:
  ```typescript
  export interface LongCatConfig {
    apiKey: string;
    baseUrl?: string;      // Default: https://api.longcat.ai/v1
    timeout?: number;      // Default: 300000ms (5 minutes)
    retryAttempts?: number; // Default: 3
  }
  ```

### Video Provider Registry
- **Location**: `lib/providers/video-registry.ts`
- **Purpose**: Unified abstraction for multiple AI video providers (LongCat, Sora, Runway, Pika)
- **Key Pattern**: Convert unified requests to provider-specific formats
- **Cost Optimization**: Providers ranked by priority and cost-per-second
- **Fallback Support**: Chain multiple providers for reliability

### Testing LongCat Integration
- **Test File**: `app/lib/providers/__tests__/longcat-client.test.ts`
- **Coverage**: 13+ test cases including retry logic, polling, error handling
- **Mock Pattern**: Global fetch with explicit Object.defineProperty for mock response objects
- **Key Test Patterns**:
  ```typescript
  // Mock fetch response
  (fetch as any).mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: () => Promise.resolve(mockData),
  });
  
  // Mock retry logic - use mockImplementationOnce (not mockResolvedValueOnce)
  // as it can be called multiple times
  (fetch as any).mockImplementationOnce(() => 
    Promise.resolve({ ok: true, json: async () => mockData })
  );
  ```

### Common Development Tasks - LongCat
1. **Add video generation endpoint**:
   - Create API route in `app/api/video/generate/route.ts`
   - Call `client.generateVideo(request)` from `lib/providers/`
   - Return jobId for async processing
   
2. **Status polling**:
   - Use `client.getVideoStatus(videoId)` for single-shot polling
   - Use `client.waitForCompletion(videoId)` for blocking wait with timeout
   
3. **Debug video generation issues**:
   - Check `LONGCAT_API_KEY` environment variable
   - Verify request parameters match API contract (prompt, duration, aspect_ratio, style)
   - Use detailed error messages from client (includes status code + API response)

## Critical Integration Points
- **Instagram**: Uses Facebook Graph API v17.0 (two-step: create → publish)
- **AI Agents**: External BEE API with streaming response handling
- **Video Generation**: LongCat API with retry/polling, Video Provider Registry for multi-provider support
- **Supabase**: Database integration for user data and analytics
- **Netlify**: Static hosting with serverless functions for backend logic

Last updated: 2025-11-08
