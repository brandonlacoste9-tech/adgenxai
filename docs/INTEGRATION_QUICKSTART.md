# Integration Quickstart

**Phase-2: Providers, Supabase, Auth**

## Quick Start

### 1. Environment Setup
```bash
cp .env.example .env
```

Required environment variables:
```env
# Provider Selection (PR-3)
AI_PROVIDER=openai  # or 'github'
OPENAI_API_KEY=sk-...
GITHUB_TOKEN=ghp_...

# Supabase (PR-1)
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Auth (PR-5)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
```

### 2. Database Setup (PR-1)
```bash
# Apply migrations
npm run db:migrate

# Generate types
npm run db:types
```

### 3. Provider Configuration (PR-3)
Toggle between providers:
```typescript
// Automatic selection via AI_PROVIDER
const provider = createProvider();

// Manual override
const openai = new OpenAIProvider(apiKey);
const github = new GitHubModelsProvider(token);
```

### 4. Auth Integration (PR-5)
All API routes enforce authentication:
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });
  
  // Enforce user ownership
  const data = await fetchUserData(session.user.id);
  return Response.json(data);
}
```

## Testing
```bash
npm test              # Unit tests
npm run test:e2e      # E2E tests with Supabase
```
