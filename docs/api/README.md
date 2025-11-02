# AdGenXAI API Documentation

## 📚 Overview

The AdGenXAI API provides a comprehensive suite of endpoints for AI-powered advertising content generation and multi-platform publishing. Built on Netlify Functions with a "Sensory Cortex" architecture, the API enables seamless integration with Instagram, TikTok, YouTube, and AI content generation services.

## 🚀 Quick Start

### Base URLs

- **Production**: `https://adgenxai.netlify.app/api`
- **Local Development**: `http://localhost:8888/api`

### Authentication

Most endpoints require authentication via platform-specific credentials configured in environment variables:

```bash
# Instagram
INSTAGRAM_ACCOUNT_ID=your_account_id
INSTAGRAM_ACCESS_TOKEN=your_access_token

# TikTok
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret

# YouTube
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
```

## 📡 API Endpoints

### Health & Status

#### GET `/api/health`

Health check endpoint for the AI Sensory Cortex.

**Response:**
```json
{
  "status": "legendary",
  "uptime": "Always up",
  "models": ["GPT-4-Turbo", "Claude-3.5-Sonnet"],
  "resources": {
    "cpu": "100%",
    "memory": "Legendary"
  },
  "legendary": true,
  "timestamp": "2024-11-02T00:00:00.000Z"
}
```

#### GET `/api/status`

Comprehensive API status dashboard showing all services and platform connections.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": "12345s",
    "timestamp": "2024-11-02T00:00:00.000Z",
    "services": {
      "sensory_cortex": {
        "status": "up",
        "latency": 45,
        "message": "Service is healthy"
      },
      "instagram": {
        "status": "up",
        "message": "Credentials configured"
      },
      "tiktok": {
        "status": "down",
        "message": "Credentials not configured"
      }
    },
    "version": "1.0.0"
  },
  "meta": {
    "timestamp": "2024-11-02T00:00:00.000Z",
    "requestId": "req_123456",
    "responseTime": 125
  }
}
```

### Content Publishing

#### POST `/api/post-to-instagram`

Publish an image to Instagram.

**Request:**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "caption": "Check out this amazing AI-generated ad! #AdGenXAI"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "platform": "instagram",
    "containerId": "17895695668004550",
    "publishedId": "17895695668004551",
    "message": "Successfully published to Instagram"
  },
  "meta": {
    "timestamp": "2024-11-02T00:00:00.000Z"
  }
}
```

**Validation:**
- `imageUrl`: Must be a valid URL
- `caption`: Required, 1-2200 characters

#### POST `/api/post-to-tiktok`

Publish a video to TikTok.

**Request:**
```json
{
  "videoUrl": "https://example.com/video.mp4",
  "title": "Amazing AI-Generated Content",
  "description": "Created with AdGenXAI",
  "privacyLevel": "PUBLIC_TO_EVERYONE"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "platform": "tiktok",
    "shareId": "7123456789",
    "publishId": "7123456790",
    "message": "Successfully published to TikTok"
  }
}
```

**Privacy Levels:**
- `PUBLIC_TO_EVERYONE`
- `MUTUAL_FOLLOW_FRIENDS`
- `FOLLOWER_OF_CREATOR`
- `SELF_ONLY`

#### POST `/api/post-to-youtube`

Publish a video to YouTube.

**Request:**
```json
{
  "videoUrl": "https://example.com/video.mp4",
  "title": "AI-Generated Ad Campaign",
  "description": "Powered by AdGenXAI",
  "privacyStatus": "public",
  "tags": ["ai", "advertising", "automation"]
}
```

**Privacy Status:**
- `public`
- `private`
- `unlisted`

### Webhooks

#### POST `/api/webhook`

Main webhook endpoint for AI Sensory Cortex event processing.

**Request:**
```json
{
  "type": "legendary_ad_generation",
  "payload": {
    "prompt": "Create a stunning product ad",
    "style": "modern"
  },
  "hero_variant": "aurora",
  "timestamp": "2024-11-02T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "🎉 LEGENDARY! Your AI Sensory Cortex legendary_ad_generation completed successfully!",
  "processing_id": "adgenxai_1234567890_abc123def",
  "cortex_response": {
    "status": "legendary_success",
    "processing_id": "adgenxai_1234567890_abc123def",
    "message": "AI Sensory Cortex processing at legendary speed"
  },
  "timestamp": "2024-11-02T00:00:00.000Z"
}
```

## 📋 Standard Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-11-02T00:00:00.000Z",
    "requestId": "req_123456",
    "responseTime": 125
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": { ... },
    "timestamp": "2024-11-02T00:00:00.000Z"
  }
}
```

## 🔒 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `AUTHENTICATION_ERROR` | 401 | Authentication required or invalid |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `METHOD_NOT_ALLOWED` | 405 | HTTP method not allowed |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `NOT_IMPLEMENTED` | 501 | Feature not yet implemented |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |
| `EXTERNAL_API_ERROR` | 500 | External API call failed |
| `INVALID_CREDENTIALS` | 401 | Invalid platform credentials |
| `MISSING_CONFIGURATION` | 500 | Required configuration missing |

## 🔐 Security Best Practices

### Environment Variables
- Never commit API keys or secrets to version control
- Use Netlify environment variable management
- Prefix client-side variables with `NEXT_PUBLIC_`

### Input Validation
All request bodies are validated using Zod schemas:
```typescript
import { schemas, validateBody } from '@/lib/api/validation';

const result = validateBody(event.body, schemas.instagramPost);
if (!result.success) {
  return result.response; // Returns validation error
}
```

### CORS Headers
All responses include appropriate CORS headers:
```typescript
{
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
}
```

## 🧪 Testing

### cURL Examples

**Health Check:**
```bash
curl https://adgenxai.netlify.app/api/health
```

**API Status:**
```bash
curl https://adgenxai.netlify.app/api/status
```

**Post to Instagram:**
```bash
curl -X POST https://adgenxai.netlify.app/api/post-to-instagram \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/image.jpg",
    "caption": "Test post from API"
  }'
```

### JavaScript/TypeScript Example

```typescript
async function publishToInstagram(imageUrl: string, caption: string) {
  const response = await fetch('https://adgenxai.netlify.app/api/post-to-instagram', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageUrl,
      caption,
    }),
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('Published:', result.data);
  } else {
    console.error('Error:', result.error);
  }
}
```

## 📊 Rate Limiting

- **Default Rate**: 100 requests per minute per API key
- **Burst Rate**: 20 requests per second
- **Rate Limit Headers**: Included in responses (future implementation)
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

When rate limited, you'll receive a `429 Too Many Requests` response with a `Retry-After` header.

## 🔄 Versioning

The API uses semantic versioning. Current version: **v1.0.0**

Future versions will be indicated in the URL path:
- `/api/v1/...`
- `/api/v2/...`

## 📖 Additional Resources

- [OpenAPI Specification](./openapi.yaml) - Full API specification in OpenAPI 3.0 format
- [Main README](../../README.md) - Project overview and setup
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)

## 🆘 Support

For API support, issues, or feature requests:
- GitHub Issues: [brandonlacoste9-tech/adgenxai](https://github.com/brandonlacoste9-tech/adgenxai/issues)
- Documentation: See project README and inline code comments

## 📝 Changelog

### v1.0.0 (2024-11-02)
- Initial API release
- Health and status endpoints
- Instagram, TikTok, YouTube publishing endpoints
- Webhook processing
- Standardized response format
- Comprehensive error handling
- Input validation with Zod
- OpenAPI specification
