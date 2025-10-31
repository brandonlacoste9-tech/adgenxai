# Integration Quickstart

This guide helps you quickly integrate AdGenXAI with external services.

## Table of Contents

- [AI Provider Setup](#ai-provider-setup)
- [Supabase Setup](#supabase-setup)
- [Deployment](#deployment)

## AI Provider Setup

AdGenXAI supports multiple AI providers. Configure your preferred provider using environment variables.

### GitHub Models (Default)

GitHub Models provides free access to various AI models for GitHub users.

**Setup:**

1. Ensure you have a GitHub account
2. Generate a GitHub Personal Access Token (PAT) with appropriate scopes
3. Add to `.env`:

```env
AI_PROVIDER=github
GITHUB_TOKEN=ghp_your_token_here
```

**Supported Models:**
- GPT-4o
- GPT-4o-mini
- Claude 3.5 Sonnet
- And more

### OpenAI

For direct OpenAI API access:

1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add to `.env`:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your_key_here
```

## Supabase Setup

Supabase provides authentication and database features.

### Prerequisites

1. Create a project at [supabase.com](https://supabase.com)
2. Note your project URL and API keys

### Environment Configuration

Add to `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Security Note:** Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client. Use only in server-side code.

### Database Schema

After creating your Supabase project, apply the schema from `docs/DATABASE_SCHEMA.md`:

1. Open the Supabase SQL Editor
2. Copy and execute the SQL from the schema documentation
3. Verify tables and RLS policies are created

### Testing the Connection

```bash
# Run the development server
npm run dev

# Visit http://localhost:3000/dashboard
# You should see the dashboard with data from Supabase
```

## Deployment

### Netlify Deployment

AdGenXAI is configured for Netlify deployment.

**Quick Deploy:**

1. Connect your GitHub repository to Netlify
2. Configure environment variables in Netlify dashboard
3. Deploy!

**Environment Variables to Set:**

- `AI_PROVIDER`
- `GITHUB_TOKEN` or `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NODE_ENV=production`

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm start
```

## Troubleshooting

### AI Provider Issues

- **"Invalid API key"** — Verify your token/key is correct and has proper permissions
- **"Rate limit exceeded"** — GitHub Models and OpenAI have rate limits; implement retry logic

### Supabase Issues

- **"Failed to connect"** — Check your URL and keys are correct
- **"Permission denied"** — Verify RLS policies are configured correctly
- **"No data returned"** — Ensure tables are populated or graceful fallbacks are in place

### Build Issues

- **Type errors** — Run `npm run typecheck` to identify issues
- **Test failures** — Run `npm test` to see failing tests

## Next Steps

- Read `PROVIDER_INTEGRATION.md` for detailed AI provider documentation
- Read `DATABASE_SCHEMA.md` for database structure and RLS policies
- Review `COPILOT_GUARDRAILS.md` for contribution guidelines
