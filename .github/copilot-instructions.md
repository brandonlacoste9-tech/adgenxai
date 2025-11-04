# Copilot Instructions

## Repo Context

This repo: **AdgenXAI Core** - AI-powered advertising automation platform with webhook-driven agent orchestration  
Role in stack: Main AdgenXAI platform and agent coordination  
Primary runtime: Node 20 / TypeScript + Next.js 14 (App Router)  
Deployment: Netlify static export with serverless functions

## Architecture Overview

**Sensory Cortex Pattern**: Webhook-driven AI orchestration with agent-first philosophy

```text
Frontend (Next.js) ←→ Netlify Functions ←→ AI Services
       ↓                     ↓                  ↓
   Dashboard UI         Webhook Handlers    Agent Workers
```

**Key Directories**:

- `app/` - Next.js App Router (UI components, dashboard, API routes)
- `netlify/functions/` - Serverless webhook handlers and API endpoints
- `agents/` - Specialized AI agent workers (GitHub PR manager, etc.)
- `scripts/` - Automation and deployment utilities

## Tech Stack Specifics

- **Frontend**: Next.js 14 static export, React 18, TypeScript 5, Tailwind CSS
- **Backend**: Netlify Functions (Node.js), Express.js for agents
- **AI Integration**: OpenAI API, GitHub Models, SmolLM2
- **Database**: Supabase (PostgreSQL) planned for Phase 2
- **Monitoring**: PM2, Docker Compose, Prometheus/Grafana
- **Testing**: Vitest, Testing Library, Playwright E2E

## Agent Development Patterns

**Agent-First Philosophy**: Domain-specific agents vs. monolithic AI

- Create new agents in `agents/new-agent/` directory
- Each agent should have: `src/`, `docker-compose.yml`, setup scripts
- Use existing patterns from `agents/github-pr-manager/`
- Agents run independently with fallback to rule-based analysis
- All external calls need error handling and exponential backoff

**Key Agent Components**:

```text
agents/agent-name/
├── src/index.js         // Main orchestration
├── src/ai-service.js    // AI integration layer
├── docker-compose.yml   // Deployment config
├── setup-*.ps1         // Automation scripts
└── README.md           // Documentation
```

## Development Workflows

**Build Commands**:

- `npm run dev` - Start Next.js dev server
- `npm run build` - Production build (static export)
- `npm run typecheck` - TypeScript validation
- `npm run deploy` - Deploy to Netlify

**Testing Strategy**:

- `npm run test` - Unit tests with Vitest
- `npm run test:integration` - Webhook integration tests
- E2E tests in `e2e/` using Playwright
- Agent health checks: `npm run agent:health`

**Code Quality**:

- Commit style: `feat:`, `fix:`, `ci:`, `docs:`
- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Husky pre-commit hooks

## Critical Integration Points

**Netlify Functions** (`netlify/functions/`):

- Webhook handlers: `github-webhook.ts`, `webhook.ts`
- Social media APIs: `post-to-instagram.ts`, `post-to-tiktok.ts`
- Telemetry: `telemetry-dashboard.ts`, `webhook-telemetry.ts`
- API routes mapped via `netlify.toml` redirects

**AI Service Integration**:

- Use existing utilities in `netlify/functions/lib/`
- Implement fallback patterns for AI service failures
- All AI calls require timeout and error handling
- Prefer GitHub Models for free tier, Azure AI Foundry for production

**Security Requirements**:

- Never commit API keys or secrets (use Netlify environment vars)
- Webhook signature verification required
- CORS and security headers configured in `netlify.toml`
- RLS policies for database access (Phase 2)

## Project-Specific Conventions

**File Naming**:

- React components: PascalCase (e.g., `CreatorDashboard.tsx`)
- Utilities: camelCase (e.g., `webhookHandler.ts`)
- Scripts: kebab-case (e.g., `setup-phase2.sh`)

**Error Handling Pattern**:

```typescript
try {
  const result = await aiService.analyze(data);
  return { success: true, data: result };
} catch (error) {
  logger.error('AI analysis failed:', error);
  // Fallback to rule-based analysis
  return ruleBased.analyze(data);
}
```

**Environment Configuration**:

- Development: `.env.local` (gitignored)
- Production: Netlify dashboard environment variables
- Agent services: Docker environment files

## Examples

**Adding New Agent**: Create `agents/cooking-agent/` with proper structure following `agents/github-pr-manager/` pattern  
**Adding API Endpoint**: Create in `netlify/functions/` and update `netlify.toml` redirects  
**Adding UI Component**: Place in `app/components/` with TypeScript + Tailwind CSS