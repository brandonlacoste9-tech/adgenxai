# AdgenXAI - GitHub Copilot Instructions

## Project Overview

AdgenXAI is an AI-powered advertising solution with a webhook sensory cortex for real-time GitHub event processing. The platform includes the BEE-SHIP autonomous social media publishing system that allows programmatic posting to Instagram, YouTube, and TikTok (coming soon).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with Framer Motion for animations
- **Deployment**: Netlify (with serverless functions)
- **Testing**: Vitest with React Testing Library
- **Validation**: Zod schemas
- **External APIs**: Instagram Graph API, YouTube Data API, GitHub API

## Repository Structure

```
├── app/                      # Next.js app directory
│   ├── components/          # React components
│   │   ├── __tests__/      # Component tests
│   │   └── *.tsx           # Component files
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── lib/                     # Shared libraries
│   └── platforms/          # Social media platform integrations
│       ├── instagram.ts    # Instagram posting logic
│       ├── youtube.ts      # YouTube posting logic
│       └── tiktok.ts       # TikTok stub (coming soon)
├── netlify/
│   └── functions/          # Netlify serverless functions
│       ├── post-to-instagram.ts
│       ├── post-to-youtube.ts
│       ├── post-to-tiktok.ts
│       ├── webhook.ts      # GitHub webhook handler
│       └── *.ts           # Other utility functions
├── public/                 # Static assets
├── examples/               # Example implementations
├── .github/
│   ├── workflows/         # CI/CD workflows
│   └── agents/           # Custom agent configurations
└── scripts/               # Utility scripts
```

## Development Commands

### Installation
```bash
npm install
```

### Development
```bash
npm run dev          # Start Next.js dev server
```

### Building
```bash
npm run build        # Build for production
npm run typecheck    # Run TypeScript type checking
```

### Testing
```bash
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:ci      # Run tests with coverage
```

### Deployment
```bash
npm run deploy       # Deploy to Netlify production
```

## Coding Standards

### TypeScript
- Use TypeScript strict mode (already configured)
- Always define explicit types for function parameters and return values
- Use `interface` for object shapes, `type` for unions/intersections
- Avoid `any` - use `unknown` if type is truly unknown

### React Components
- Use functional components with hooks
- Props should be explicitly typed with interfaces
- Use proper semantic HTML elements
- Add accessibility attributes (aria-label, role, etc.)
- Follow the existing component naming pattern (PascalCase)

### Testing
- Write tests for all new components in `app/components/__tests__/`
- Use React Testing Library best practices (query by role, text, label)
- Test user interactions, not implementation details
- Maintain test coverage for critical paths
- Follow the existing test file naming: `ComponentName.test.tsx`

### Code Style
- Use 2-space indentation (configured in project)
- Import order: React → External packages → Internal modules → Types
- Use path alias `@/` for imports from `app/` directory
- Validate all external inputs with Zod schemas
- Log all webhook events and important operations
- Handle errors gracefully with try/catch and meaningful error messages

### API Functions (Netlify Functions)
- All functions in `netlify/functions/` are serverless endpoints
- Use async/await for asynchronous operations
- Always return proper HTTP status codes
- Validate request bodies with Zod
- Include proper error handling and logging
- Set appropriate CORS headers when needed

## Environment Variables

Required environment variables are documented in `.env.example`. Key variables:

### Instagram
- `INSTAGRAM_ACCOUNT_ID` - Instagram account ID
- `INSTAGRAM_ACCESS_TOKEN` - Instagram API access token

### YouTube
- `YOUTUBE_CLIENT_ID` - Google OAuth client ID
- `YOUTUBE_CLIENT_SECRET` - Google OAuth client secret
- `YOUTUBE_REFRESH_TOKEN` - OAuth refresh token

Set environment variables in Netlify dashboard: Settings → Build & deploy → Environment

## Testing Guidelines

### Running Tests
- Run `npm test` before committing
- Existing test failures in `TopBar.test.tsx` and `a11y.smoke.test.tsx` are known issues (missing `@/lib/theme` file)
- Do not break existing passing tests when adding new features

### Writing Tests
- Place test files in `app/components/__tests__/`
- Use descriptive test names: `it("should render the component with correct props")`
- Test accessibility with `toHaveAccessibleName()`, `toHaveAccessibleDescription()`
- Mock external API calls in tests
- Use `vitest.config.ts` for test configuration

## Common Patterns

### Social Media Posting
```typescript
import { postToInstagram } from '@/lib/platforms/instagram';

const result = await postToInstagram({
  imageUrl: "https://example.com/image.jpg",
  caption: "My caption"
});
```

### Netlify Function Structure
```typescript
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  try {
    // Parse and validate request
    const body = JSON.parse(event.body || '{}');
    
    // Process request
    const result = await processRequest(body);
    
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### Zod Validation
```typescript
import { z } from 'zod';

const schema = z.object({
  imageUrl: z.string().url(),
  caption: z.string().max(2200)
});

const validated = schema.parse(data);
```

## Known Issues

1. **Missing Theme File**: `app/components/TopBar.tsx` imports from `@/lib/theme` which doesn't exist
   - This causes TypeScript errors and test failures
   - Tests in `TopBar.test.tsx` and `a11y.smoke.test.tsx` are currently failing
   - When working on theme-related features, this file needs to be created

2. **Security Vulnerabilities**: Run `npm audit` to see current vulnerabilities
   - 6 moderate severity vulnerabilities exist
   - Review before production deployment

## CI/CD

### GitHub Actions Workflows
- **CI** (`.github/workflows/ci.yml`): Type checking and build on PR/push
- **Test** (`.github/workflows/test.yml`): Run test suite
- **CodeQL** (`.github/workflows/codeql.yml`): Security scanning

### Branch Protection
- All PRs should pass CI before merging
- Code review required for main branch

## Documentation

Key documentation files:
- `START_HERE_BEE_SHIP.md` - Overview and documentation map
- `BEE_SHIP_QUICKSTART.md` - Quick setup guide
- `BEE_SHIP_API_DOCS.md` - Complete API reference
- `BEE_SHIP_LOCAL_TESTING.md` - Local development guide
- `BEE_SHIP_NETLIFY_AGENTS.md` - AI automation guide

## Security Best Practices

1. **Never commit secrets**: Use environment variables for all credentials
2. **Validate all inputs**: Use Zod schemas for request validation
3. **Sanitize outputs**: Escape user-generated content before display
4. **Rate limiting**: Consider implementing rate limits for API endpoints
5. **CORS**: Configure CORS headers appropriately for public endpoints
6. **Authentication**: Implement authentication for sensitive endpoints

## Getting Help

- Check existing documentation in the repository root
- Review `BEE_SHIP_API_DOCS.md` for API-specific questions
- Look at examples in `examples/` directory
- Review test files for usage patterns
- Check GitHub Issues for known problems
