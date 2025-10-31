# AdGenXAI Documentation

## Overview

AdGenXAI is an AI-powered advertising solution with webhook sensory cortex capabilities. This documentation provides comprehensive guides for developers working on the project.

## Documentation Structure

- **INTEGRATION_QUICKSTART.md** — Quick start guide for integrating with external services
- **PROVIDER_INTEGRATION.md** — AI provider integration guide (GitHub Models, OpenAI)
- **DATABASE_SCHEMA.md** — Database schema and RLS policies for Supabase

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- GitHub account for GitHub Models API access
- (Optional) OpenAI API key for OpenAI provider
- (Optional) Supabase account for database features
- (Optional) Netlify account for deployment

### Installation

```bash
# Clone the repository
git clone https://github.com/brandonlacoste9-tech/adgenxai.git
cd adgenxai

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

### Environment Variables

See `.env.example` for required environment variables. Key variables include:

- `AI_PROVIDER` — AI provider selection (`github` or `openai`)
- `GITHUB_TOKEN` — For GitHub Models API
- `OPENAI_API_KEY` — For OpenAI API (optional)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (optional)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key (optional)

## Development

### Running Tests

```bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:ci       # Run tests with coverage
```

### Type Checking

```bash
npm run typecheck     # Run TypeScript type checking
```

### Building

```bash
npm run build         # Build for production
npm start            # Start production server
```

## Architecture

AdGenXAI follows a modern Next.js architecture with:

- **App Router** — Server and client components
- **API Routes** — Backend endpoints for chat, usage tracking, and dashboard data
- **Supabase** — Authentication and database (optional)
- **AI Providers** — Pluggable AI provider system (GitHub Models, OpenAI)

## Contributing

Please read `COPILOT_GUARDRAILS.md` for coding standards and contribution guidelines.

## License

MIT — See LICENSE file for details.
