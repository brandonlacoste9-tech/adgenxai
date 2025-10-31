# Provider Integration

**Phase-2 PR-3: Providers**

## Goal
Implement real streaming via OpenAI with GitHub Models fallback keyed by `AI_PROVIDER=openai|github`.

## TODO
- [ ] Provider adapter interface
- [ ] OpenAI adapter with streaming support
- [ ] GitHub Models adapter with fallback logic
- [ ] Feature flag implementation (`AI_PROVIDER` env var)
- [ ] Error handling and retry logic
- [ ] Integration tests
- [ ] Update INTEGRATION_QUICKSTART.md

## Architecture
```
lib/providers/
  ├── interface.ts        # Provider adapter interface
  ├── openai.ts          # OpenAI streaming implementation
  ├── github-models.ts   # GitHub Models fallback
  └── factory.ts         # Provider selection by AI_PROVIDER
```

## Usage
```typescript
const provider = createProvider(process.env.AI_PROVIDER);
const stream = await provider.chat(messages);
```
