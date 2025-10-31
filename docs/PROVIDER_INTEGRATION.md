# Provider Integration Guide

This guide explains how to configure and use AI providers with AdGenXAI.

## Overview

AdGenXAI supports multiple AI providers through a pluggable provider system. Each provider implements the same interface for consistent chat streaming and usage tracking.

**Supported Providers:**
- **GitHub Models** (default) — Free access to various AI models via GitHub
- **OpenAI** — Direct OpenAI API access

## Architecture

The provider system consists of:

1. **Provider Interface** (`lib/providers/index.ts`) — Common interface for all providers
2. **Provider Implementations** — GitHub Models and OpenAI adapters
3. **Cost Calculator** (`lib/providers/costs.ts`) — Token cost estimation
4. **API Routes** — `/api/chat` for streaming, `/api/usage` for tracking

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AI_PROVIDER` | No | `github` | Provider to use: `github` or `openai` |
| `GITHUB_TOKEN` | Yes* | — | GitHub PAT for GitHub Models API |
| `OPENAI_API_KEY` | Yes** | — | OpenAI API key |

\* Required when `AI_PROVIDER=github` or not set  
\** Required when `AI_PROVIDER=openai`

### Example Configuration

**Using GitHub Models (default):**

```env
AI_PROVIDER=github
GITHUB_TOKEN=ghp_your_token_here
```

**Using OpenAI:**

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your_key_here
```

## Usage

### Chat Streaming

Send a POST request to `/api/chat` with messages array:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello!"}
    ],
    "model": "gpt-4o-mini"
  }'
```

**Response:** Server-sent events (SSE) stream

```
data: {"content":"Hello"}
data: {"content":"!"}
data: {"content":" How"}
data: {"content":" can"}
data: {"content":" I"}
data: {"content":" help"}
data: [DONE]
```

### Usage Tracking

Record token usage and calculate costs:

```bash
curl -X POST http://localhost:3000/api/usage \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "model": "gpt-4o-mini",
    "promptTokens": 100,
    "completionTokens": 50
  }'
```

**Response:**

```json
{
  "provider": "openai",
  "model": "gpt-4o-mini",
  "promptTokens": 100,
  "completionTokens": 50,
  "totalTokens": 150,
  "estimatedCost": 0.000045,
  "timestamp": "2024-10-31T20:00:00.000Z"
}
```

## Provider-Specific Details

### GitHub Models

**Endpoint:** `https://models.inference.ai.azure.com/chat/completions`

**Authentication:** GitHub Personal Access Token (PAT)

**Supported Models:**
- `gpt-4o` — Latest GPT-4 Optimized
- `gpt-4o-mini` — Fast and cost-effective
- `claude-3.5-sonnet` — Anthropic's Claude
- And more (check GitHub Models documentation)

**Pricing:** Free during preview period

**Rate Limits:** Subject to GitHub API rate limits

### OpenAI

**Endpoint:** `https://api.openai.com/v1/chat/completions`

**Authentication:** OpenAI API key

**Supported Models:**
- `gpt-4o` — Latest GPT-4 Optimized ($5.00/$15.00 per 1M tokens)
- `gpt-4o-mini` — Fast and affordable ($0.15/$0.60 per 1M tokens)
- `gpt-3.5-turbo` — Classic GPT-3.5 ($0.50/$1.50 per 1M tokens)

**Pricing:** Pay-per-use (see costs.ts for current rates)

**Rate Limits:** Based on your OpenAI account tier

## Testing

### Local Testing with Mock Provider

```typescript
import { getProvider } from "@/lib/providers";

const provider = await getProvider({
  provider: "github",
  githubToken: process.env.GITHUB_TOKEN,
});

const messages = [
  { role: "user" as const, content: "Hello!" }
];

for await (const chunk of provider.streamChat({ messages })) {
  console.log(chunk);
}
```

### Testing with curl

**Test chat endpoint:**

```bash
# Using GitHub Models
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Say hi"}]}'

# Using OpenAI (change AI_PROVIDER env var first)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Say hi"}],"model":"gpt-4o-mini"}'
```

**Test usage endpoint:**

```bash
curl -X POST http://localhost:3000/api/usage \
  -H "Content-Type: application/json" \
  -d '{
    "provider":"openai",
    "model":"gpt-4o-mini",
    "promptTokens":100,
    "completionTokens":50
  }'
```

## Error Handling

### Common Errors

**"Invalid API key"**
- Verify your token/key is correct
- Check environment variable is set
- Ensure token has required permissions

**"Rate limit exceeded"**
- Implement exponential backoff
- Consider using a different provider
- Upgrade your API tier

**"Model not found"**
- Check model name is correct
- Verify model is available for your provider
- See provider documentation for supported models

## Limitations

### GitHub Models
- Free during preview (pricing may change)
- Subject to GitHub API rate limits
- Requires GitHub account
- Model availability may vary

### OpenAI
- Requires paid account (free tier limited)
- Per-token pricing
- Rate limits based on account tier
- API may have downtime

## Future Enhancements

- [ ] Add Anthropic Claude direct provider
- [ ] Add Azure OpenAI provider
- [ ] Implement retry logic with exponential backoff
- [ ] Add token counting for accurate usage tracking
- [ ] Support for function calling
- [ ] Support for vision models
- [ ] Caching layer for repeated queries
- [ ] Usage analytics dashboard

## Security Considerations

1. **Never commit API keys** — Use environment variables only
2. **Rate limiting** — Implement on API routes to prevent abuse
3. **Input validation** — Validate all messages before sending to providers
4. **Error messages** — Don't expose API keys in error messages
5. **Logging** — Never log API keys or sensitive data

## Support

For issues or questions:
- Check `docs/INTEGRATION_QUICKSTART.md` for setup help
- Review `COPILOT_GUARDRAILS.md` for contribution guidelines
- Open an issue on GitHub
