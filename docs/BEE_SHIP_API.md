# BEE-SHIP API Documentation

## Overview

The BEE-SHIP Autonomous Publishing System provides APIs for publishing content to multiple social media platforms (Instagram, YouTube, TikTok) through a unified interface.

## Base URL

```
https://your-site.netlify.app/.netlify/functions/
```

## Authentication

All webhook endpoints support signature verification using HMAC-SHA256:

```
X-Webhook-Signature: sha256=<signature>
```

Set `WEBHOOK_SECRET` environment variable to enable signature verification.

---

## Endpoints

### 1. BEE-SHIP Publishing

**Endpoint:** `POST /bee-ship`

Publish content to one or more social media platforms.

#### Request Headers

```
Content-Type: application/json
X-Signature: <optional-webhook-signature>
```

#### Request Body

```json
{
  "content": {
    "type": "image" | "video",
    "url": "https://example.com/content.jpg",
    "title": "My Video Title",
    "caption": "My caption text",
    "description": "Longer description",
    "tags": ["marketing", "ai", "automation"],
    "metadata": {
      "privacy_level": "PUBLIC_TO_EVERYONE",
      "thumbnailBase64": "base64-encoded-thumbnail"
    }
  },
  "platforms": ["instagram", "youtube", "tiktok"],
  "scheduleAt": "2024-01-15T10:00:00Z",
  "campaign_id": "optional-campaign-id",
  "retry": false
}
```

#### Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | object | Yes | Content to publish |
| `content.type` | string | Yes | Content type: "image" or "video" |
| `content.url` | string | Yes | Public URL to content file |
| `content.title` | string | No | Title (required for YouTube/TikTok) |
| `content.caption` | string | No | Caption (required for Instagram posts) |
| `content.description` | string | No | Description text |
| `content.tags` | array | No | Tags/hashtags |
| `content.metadata` | object | No | Platform-specific metadata |
| `platforms` | array | Yes | List of platforms: ["instagram", "youtube", "tiktok"] |
| `scheduleAt` | string | No | ISO timestamp for scheduled publishing |
| `campaign_id` | string | No | Custom campaign identifier |
| `retry` | boolean | No | Enable retry logic (default: false) |

#### Response

```json
{
  "success": true,
  "campaign_id": "bee-ship-1234567890-abc123",
  "results": [
    {
      "platform": "instagram",
      "success": true,
      "publishedId": "1234567890",
      "containerId": "9876543210",
      "url": "https://www.instagram.com/p/1234567890"
    },
    {
      "platform": "youtube",
      "success": true,
      "videoId": "dQw4w9WgXcQ",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      "platform": "tiktok",
      "success": true,
      "shareId": "7123456789012345678",
      "publishId": "pub-123456",
      "url": "https://www.tiktok.com/@user/video/7123456789012345678"
    }
  ],
  "timestamp": "2024-01-15T09:30:00.000Z",
  "message": "🎉 BEE-SHIP: Published to 3/3 platforms successfully"
}
```

#### Error Response

```json
{
  "error": "BEE-SHIP publishing failed",
  "details": "Missing configuration for platforms: youtube",
  "timestamp": "2024-01-15T09:30:00.000Z"
}
```

#### Status Codes

- `200` - Success (at least one platform published successfully)
- `202` - Accepted (scheduled for future publishing)
- `400` - Bad Request (missing required fields)
- `401` - Unauthorized (invalid signature)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error (all platforms failed)

---

### 2. Webhook Handler

**Endpoint:** `POST /webhook-handler`

Receive webhooks for autonomous publishing triggers and campaign management.

#### Request Headers

```
Content-Type: application/json
X-Webhook-Signature: <hmac-signature>
```

#### Request Body

```json
{
  "type": "publish" | "schedule" | "campaign_status" | "campaign_cancel",
  "data": {
    // Type-specific data (see below)
  },
  "timestamp": "2024-01-15T09:30:00.000Z"
}
```

#### Webhook Types

##### Publish Webhook

Trigger immediate publishing:

```json
{
  "type": "publish",
  "data": {
    "content_url": "https://example.com/video.mp4",
    "content_type": "video",
    "title": "My Video",
    "caption": "Check this out!",
    "description": "Full description",
    "tags": ["viral", "trending"],
    "platforms": ["instagram", "tiktok"],
    "metadata": {
      "privacy_level": "PUBLIC_TO_EVERYONE"
    }
  }
}
```

Response:
```json
{
  "success": true,
  "campaign_id": "campaign-1234567890-abc123",
  "status": "completed",
  "results": [...],
  "timestamp": "2024-01-15T09:30:00.000Z"
}
```

##### Schedule Webhook

Schedule content for future publishing:

```json
{
  "type": "schedule",
  "data": {
    "content_url": "https://example.com/video.mp4",
    "schedule_at": "2024-01-20T15:00:00Z",
    "platforms": ["youtube", "tiktok"]
  }
}
```

Response:
```json
{
  "success": true,
  "campaign_id": "campaign-1234567890-def456",
  "status": "scheduled",
  "scheduled_for": "2024-01-20T15:00:00Z",
  "message": "Campaign scheduled successfully",
  "timestamp": "2024-01-15T09:30:00.000Z"
}
```

##### Campaign Status Webhook

Check status of a campaign:

```json
{
  "type": "campaign_status",
  "data": {
    "campaign_id": "campaign-1234567890-abc123"
  }
}
```

Response:
```json
{
  "success": true,
  "campaign": {
    "id": "campaign-1234567890-abc123",
    "content_url": "https://example.com/video.mp4",
    "platforms": ["instagram", "tiktok"],
    "status": "completed",
    "results": [...],
    "created_at": "2024-01-15T09:00:00.000Z",
    "updated_at": "2024-01-15T09:30:00.000Z"
  },
  "timestamp": "2024-01-15T09:35:00.000Z"
}
```

##### Campaign Cancel Webhook

Cancel a pending campaign:

```json
{
  "type": "campaign_cancel",
  "data": {
    "campaign_id": "campaign-1234567890-abc123"
  }
}
```

Response:
```json
{
  "success": true,
  "campaign_id": "campaign-1234567890-abc123",
  "status": "cancelled",
  "message": "Campaign cancelled successfully",
  "timestamp": "2024-01-15T09:30:00.000Z"
}
```

#### Health Check

**Endpoint:** `GET /webhook-handler`

```json
{
  "status": "healthy",
  "service": "webhook-handler",
  "version": "1.0.0",
  "campaigns_count": 42
}
```

---

### 3. Instagram Publishing

**Endpoint:** `POST /post-to-instagram`

Publish images or stories to Instagram.

#### Request Body

```json
{
  "imageUrl": "https://example.com/image.jpg",
  "caption": "My Instagram post caption",
  "mediaType": "post" | "story"
}
```

#### Response

```json
{
  "success": true,
  "platform": "instagram",
  "mediaType": "post",
  "containerId": "9876543210",
  "publishedId": "1234567890",
  "message": "Successfully published post to Instagram"
}
```

---

### 4. YouTube Publishing

**Endpoint:** `POST /post-to-youtube`

Upload videos to YouTube.

#### Request Body

```json
{
  "videoBase64": "base64-encoded-video-data",
  "title": "My YouTube Video",
  "description": "Video description",
  "tags": ["tag1", "tag2"],
  "privacyStatus": "public" | "private" | "unlisted",
  "categoryId": "22",
  "thumbnailBase64": "base64-encoded-thumbnail"
}
```

#### Response

```json
{
  "success": true,
  "platform": "youtube",
  "videoId": "dQw4w9WgXcQ",
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "message": "Successfully uploaded to YouTube"
}
```

---

### 5. TikTok Publishing

**Endpoint:** `POST /post-to-tiktok`

Publish videos to TikTok.

#### Request Body

```json
{
  "videoUrl": "https://example.com/video.mp4",
  "title": "My TikTok Video",
  "description": "Video description with #hashtags",
  "privacy_level": "PUBLIC_TO_EVERYONE",
  "disable_duet": false,
  "disable_comment": false,
  "disable_stitch": false,
  "video_cover_timestamp_ms": 1000
}
```

#### Response

```json
{
  "success": true,
  "platform": "tiktok",
  "shareId": "7123456789012345678",
  "publishId": "pub-123456",
  "videoUrl": "https://www.tiktok.com/@user/video/7123456789012345678",
  "message": "Successfully published to TikTok"
}
```

---

## Rate Limiting

All endpoints are rate-limited to prevent abuse:

- **Default:** 10 requests per minute per IP
- **Configurable:** Set `RATE_LIMIT_PER_MINUTE` environment variable

Rate limit headers:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1642248600
```

When rate limit is exceeded:

```json
{
  "error": "Rate limit exceeded. Please try again later."
}
```

---

## Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Verify webhook signature |
| 404 | Not Found | Check endpoint URL |
| 405 | Method Not Allowed | Use correct HTTP method |
| 429 | Too Many Requests | Wait before retrying |
| 500 | Internal Server Error | Check logs, contact support |
| 501 | Not Implemented | Feature not yet available |

---

## Common Error Responses

### Missing Configuration

```json
{
  "error": "Instagram credentials not configured. Set INSTAGRAM_ACCOUNT_ID and INSTAGRAM_ACCESS_TOKEN environment variables."
}
```

### Invalid Content

```json
{
  "error": "Missing required fields: imageUrl and caption"
}
```

### Platform-Specific Error

```json
{
  "error": "Failed to post to Instagram",
  "details": "Instagram create media failed (400): {\"error\":{\"message\":\"Invalid URL\"}}"
}
```

---

## Platform-Specific Metadata

### Instagram

```json
{
  "metadata": {
    "mediaType": "post" | "story"
  }
}
```

### YouTube

```json
{
  "metadata": {
    "privacyStatus": "public" | "private" | "unlisted",
    "categoryId": "22",
    "thumbnailBase64": "base64-encoded-image"
  }
}
```

### TikTok

```json
{
  "metadata": {
    "privacy_level": "PUBLIC_TO_EVERYONE" | "MUTUAL_FOLLOW_FRIENDS" | "FOLLOWER_OF_CREATOR" | "SELF_ONLY",
    "disable_duet": false,
    "disable_comment": false,
    "disable_stitch": false,
    "video_cover_timestamp_ms": 1000
  }
}
```

---

## Examples

### Publish Image to Instagram

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/post-to-instagram \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/photo.jpg",
    "caption": "Beautiful sunset 🌅 #photography",
    "mediaType": "post"
  }'
```

### Multi-Platform Publishing via BEE-SHIP

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/bee-ship \
  -H "Content-Type: application/json" \
  -d '{
    "content": {
      "type": "video",
      "url": "https://example.com/promo.mp4",
      "title": "Product Launch 2024",
      "description": "Introducing our revolutionary new product!",
      "tags": ["product", "launch", "2024"]
    },
    "platforms": ["youtube", "tiktok"]
  }'
```

### Schedule Content via Webhook

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/webhook-handler \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: your-signature" \
  -d '{
    "type": "schedule",
    "data": {
      "content_url": "https://example.com/video.mp4",
      "schedule_at": "2024-01-20T15:00:00Z",
      "platforms": ["instagram", "tiktok"]
    }
  }'
```

---

## Best Practices

1. **Always use HTTPS** for content URLs
2. **Validate content** before submission
3. **Implement retry logic** for failed publishes
4. **Monitor rate limits** to avoid throttling
5. **Use webhook signatures** in production
6. **Handle errors gracefully** with proper logging
7. **Test with one platform** before multi-platform publishing
8. **Keep credentials secure** - never expose in client code

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/brandonlacoste9-tech/adgenxai/issues
- Documentation: See README.md and .env.example

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial release
- Instagram, YouTube, TikTok support
- BEE-SHIP orchestrator
- Webhook handler
- Rate limiting
- Signature verification
