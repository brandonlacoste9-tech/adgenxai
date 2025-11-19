# AdGenXAI Integrations

## Overview

AdGenXAI integrates with popular content management systems and platforms to seamlessly publish AI-generated content.

## Available Integrations

### Ghost CMS

Publish AI-generated content to your Ghost website.

- **Status**: ✅ Available
- **Documentation**: [Ghost Integration Guide](./GHOST.md)
- **Features**:
  - Publish posts (draft or published)
  - Update existing posts
  - Batch publishing
  - Tag management
  - SEO metadata support

[→ Get started with Ghost](./GHOST.md)

## Coming Soon

### WordPress

Publish to WordPress sites via the WordPress REST API.

- **Status**: 🚧 In Development
- **Planned Features**:
  - Post publishing
  - Custom post types
  - Category management
  - Media library integration

### Medium

Cross-post your content to Medium.

- **Status**: 📋 Planned
- **Planned Features**:
  - Story publishing
  - Publication support
  - Tag management

### Social Media

Direct publishing to social media platforms.

- **Status**: 📋 Planned
- **Platforms**:
  - Twitter/X
  - LinkedIn
  - Facebook
  - Instagram

## Integration Architecture

All integrations follow a consistent pattern:

```
app/lib/integrations/
├── ghost/
│   ├── ghost-client.ts      # API client
│   ├── ghost-publisher.ts   # Publishing service
│   └── index.ts             # Public exports
└── [platform]/
    ├── [platform]-client.ts
    ├── [platform]-publisher.ts
    └── index.ts
```

### Key Components

1. **Client**: Low-level API wrapper
2. **Publisher**: High-level publishing service integrated with AI
3. **API Routes**: Next.js API endpoints for frontend integration
4. **UI Components**: React components for dashboard

## Developer Guide

### Adding a New Integration

To add a new integration:

1. Create directory structure:
   ```bash
   mkdir -p app/lib/integrations/[platform]
   ```

2. Implement client:
   ```typescript
   // [platform]-client.ts
   export class PlatformClient {
     constructor(config: PlatformConfig) {
       // Initialize API client
     }
     
     async testConnection() {
       // Test API connectivity
     }
     
     async publish(content: Content) {
       // Publish content
     }
   }
   ```

3. Implement publisher:
   ```typescript
   // [platform]-publisher.ts
   import { PlatformClient } from './[platform]-client';
   
   export class PlatformPublisher {
     private client: PlatformClient;
     
     async publishAIContent(content: AIGeneratedContent) {
       // Bridge AI content to platform
     }
   }
   ```

4. Create API routes:
   ```typescript
   // app/api/[platform]/test-connection/route.ts
   // app/api/[platform]/publish/route.ts
   ```

5. Add UI component:
   ```typescript
   // app/components/[Platform]Integration.tsx
   ```

6. Write documentation:
   ```markdown
   // docs/integrations/[PLATFORM].md
   ```

### Testing

All integrations should include:

- Unit tests for client methods
- Integration tests for publishing workflows
- End-to-end tests for UI components

Example:

```typescript
import { describe, it, expect } from 'vitest';
import { createGhostClient } from '@/lib/integrations/ghost';

describe('Ghost Client', () => {
  it('should connect to Ghost site', async () => {
    const client = createGhostClient({
      url: 'https://demo.ghost.io',
      contentApiKey: 'test-key'
    });
    
    const result = await client.testConnection();
    expect(result.success).toBe(true);
  });
});
```

## Security Considerations

### API Keys

- **Never commit API keys** to version control
- Store keys in environment variables
- Use secure key rotation practices

### Rate Limiting

- Respect platform API rate limits
- Implement exponential backoff
- Cache responses when appropriate

### Data Validation

- Validate all content before publishing
- Sanitize HTML/Markdown
- Check content length limits

## Support

For integration support:

- 📖 Read the specific integration docs
- 💬 Ask in our [Discord community](https://discord.gg/adgenxai)
- 🐛 Report issues on [GitHub](https://github.com/brandonlacoste9-tech/adgenxai/issues)

## Contributing

We welcome contributions for new integrations! Please:

1. Check existing issues/PRs for duplicates
2. Follow our integration architecture
3. Include comprehensive tests
4. Write clear documentation
5. Submit a pull request

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for more details.
