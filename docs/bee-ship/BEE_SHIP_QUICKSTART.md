# 🐝 BEE-SHIP Quick Start Guide

**Autonomous Social Media Publishing Platform for AdGenXAI**

Get started in 5 minutes! 🚀

---

## 📦 What's Included

Your BEE-SHIP platform includes:

- ✅ **Instagram** - Post images with captions
- ✅ **YouTube** - Upload videos with metadata
- ✅ **TikTok** - Publish videos via Content Posting API

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Add Environment Variables

Go to: https://app.netlify.com/sites/adgenxai/settings/deploys#environment

**Required for Instagram:**
```
INSTAGRAM_ACCOUNT_ID=your_account_id
INSTAGRAM_ACCESS_TOKEN=your_access_token
```

**Required for YouTube:**
```
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REFRESH_TOKEN=your_refresh_token
```

**Optional for TikTok (enable video publishing):**
```
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
TIKTOK_ACCESS_TOKEN=your_tiktok_user_access_token
TIKTOK_OPEN_ID=your_tiktok_open_id
```

### Step 2: Wait for Deployment

Netlify will automatically rebuild with your new environment variables. This takes ~2-3 minutes.

### Step 3: Test Your Functions!

**Option A: Use the Demo Page**
```
https://adgenxai.pro/examples/social-posting-demo.html
```

**Option B: Use cURL**
```bash
curl -X POST https://adgenxai.pro/.netlify/functions/post-to-instagram \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://picsum.photos/1080",
    "caption": "My first BEE-SHIP post! 🐝"
  }'
```

**Option C: Integrate in Your App**
```typescript
const response = await fetch('/.netlify/functions/post-to-instagram', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ imageUrl, caption })
});
const result = await response.json();
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [BEE_SHIP_API_DOCS.md](BEE_SHIP_API_DOCS.md) | Complete API reference, examples, troubleshooting |
| [BEE_SHIP_LOCAL_TESTING.md](BEE_SHIP_LOCAL_TESTING.md) | Local development & testing guide |
| [examples/social-posting-client.ts](examples/social-posting-client.ts) | TypeScript client library |
| [examples/social-posting-demo.html](examples/social-posting-demo.html) | Interactive testing UI |

---

## 🎯 API Endpoints

All functions are available at: `https://adgenxai.pro/.netlify/functions/`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/post-to-instagram` | POST | Publish image to Instagram |
| `/post-to-youtube` | POST | Upload video to YouTube |
| `/post-to-tiktok` | POST | Publish video to TikTok |

---

## 💡 Quick Examples

### Instagram Post

```javascript
const result = await fetch('/.netlify/functions/post-to-instagram', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageUrl: 'https://example.com/image.jpg',
    caption: 'Amazing content! 🚀 #adgenxai'
  })
});
```

### YouTube Upload

```javascript
// Convert file to base64 first
const videoBase64 = await fileToBase64(videoFile);

const result = await fetch('/.netlify/functions/post-to-youtube', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    videoBase64,
    title: 'My Video Title',
    description: 'Optional description',
    tags: ['tag1', 'tag2'],
    privacyStatus: 'public' // or 'private', 'unlisted'
  })
});
```

---

## 🔑 How to Get API Credentials

### Instagram (Facebook Graph API)

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new app
3. Add "Instagram Graph API" product
4. Generate a User Access Token with:
   - `instagram_basic`
   - `instagram_content_publish`
5. Get your Instagram Business Account ID from the API

**Helpful Links:**
- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [Access Token Tool](https://developers.facebook.com/tools/accesstoken)

### YouTube (Google API)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Enable "YouTube Data API v3"
4. Create OAuth 2.0 credentials
5. Use [OAuth Playground](https://developers.google.com/oauthplayground/) to get refresh token
   - Select: `https://www.googleapis.com/auth/youtube.upload`
   - Authorize and get refresh token

**Helpful Links:**
- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [OAuth Playground](https://developers.google.com/oauthplayground/)

### TikTok (Content Posting API)

1. Go to [developers.tiktok.com](https://developers.tiktok.com)
2. Create an app and request access to the **Content Posting API**
3. Complete the OAuth flow to obtain a **user access token** and `open_id`
4. Store the following variables in Netlify:
   - `TIKTOK_CLIENT_KEY`
   - `TIKTOK_CLIENT_SECRET`
   - `TIKTOK_ACCESS_TOKEN`
   - `TIKTOK_OPEN_ID`
5. Ensure your videos are hosted on HTTPS URLs reachable by TikTok's fetcher

---

## 🧪 Local Development

Want to test locally before deploying?

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Create `.env` file with your credentials
3. Run: `netlify dev`
4. Test at: `http://localhost:8888`

See [BEE_SHIP_LOCAL_TESTING.md](BEE_SHIP_LOCAL_TESTING.md) for details.

---

## 🆘 Troubleshooting

### "Credentials not configured"
➡️ Add environment variables in Netlify dashboard and redeploy

### "Failed to create Instagram media"
➡️ Ensure image URL is publicly accessible (try opening in browser)

### "Invalid credentials" (YouTube)
➡️ Make sure you're using a refresh token, not an access token

### Function timeout
➡️ Compress videos before uploading (keep under 100MB)

**More help:** See [BEE_SHIP_API_DOCS.md](BEE_SHIP_API_DOCS.md#troubleshooting)

---

## 📊 Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| Instagram Posting | ✅ Ready | Requires credentials |
| YouTube Upload | ✅ Ready | Requires credentials |
| TikTok Posting | ✅ Ready | Requires Content Posting API access |
| Demo Page | ✅ Ready | At `/examples/social-posting-demo.html` |
| API Docs | ✅ Complete | See BEE_SHIP_API_DOCS.md |
| Local Testing | ✅ Complete | See BEE_SHIP_LOCAL_TESTING.md |

---

## 🎉 You're Ready!

1. Add your API credentials to Netlify
2. Wait for deployment
3. Start posting to social media!

**Need help?** Check the full docs in [BEE_SHIP_API_DOCS.md](BEE_SHIP_API_DOCS.md)

---

**Built with ❤️ by AdGenXAI BEE-SHIP Platform** 🐝✨
