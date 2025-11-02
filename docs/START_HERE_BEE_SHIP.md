# 🐝 BEE-SHIP - Start Here

**Autonomous Social Media Publishing Platform for AdGenXAI**

Welcome! This is your complete guide to the BEE-SHIP platform.

---

## 🎯 What is BEE-SHIP?

BEE-SHIP is an autonomous social media publishing platform that allows you to programmatically post content to:

- **Instagram** - Images with captions
- **YouTube** - Video uploads with metadata
- **TikTok** - Videos (coming soon)

All powered by serverless Netlify Functions that scale automatically! 🚀

---

## 📚 Documentation Map

Choose your path based on what you need:

### 🚀 For Quick Setup (5 minutes)
**→ [BEE_SHIP_QUICKSTART.md](BEE_SHIP_QUICKSTART.md)**
- Get started immediately
- Add credentials
- Test your first post

### 📖 For Complete API Reference
**→ [BEE_SHIP_API_DOCS.md](BEE_SHIP_API_DOCS.md)**
- Full API documentation
- Request/response examples
- Troubleshooting guide
- Security best practices

### 🧪 For Local Development
**→ [BEE_SHIP_LOCAL_TESTING.md](BEE_SHIP_LOCAL_TESTING.md)**
- Test locally with Netlify CLI
- VS Code debugger setup
- Mock testing for development
- Pre-deploy checklist

### 🤖 For AI-Powered Automation
**→ [BEE_SHIP_NETLIFY_AGENTS.md](BEE_SHIP_NETLIFY_AGENTS.md)**
- Use Netlify AI agents
- Automate feature development
- Ready-to-use agent prompts
- CI/CD integration

---

## 🏗️ Project Structure

```
AdGenXAI/
│
├── 📂 lib/platforms/              # Platform integration modules
│   ├── instagram.ts               # Instagram Graph API
│   ├── youtube.ts                 # YouTube Data API v3
│   └── tiktok.ts                  # TikTok API (stub)
│
├── 📂 netlify/functions/          # Serverless functions
│   ├── post-to-instagram.ts       # Instagram endpoint
│   ├── post-to-youtube.ts         # YouTube endpoint
│   └── post-to-tiktok.ts          # TikTok endpoint (stub)
│
├── 📂 examples/                   # Client code & demos
│   ├── social-posting-client.ts   # TypeScript client library
│   └── social-posting-demo.html   # Interactive testing UI
│
└── 📂 docs/                       # Documentation (you are here!)
    ├── START_HERE_BEE_SHIP.md     # ← This file
    ├── BEE_SHIP_QUICKSTART.md     # Quick setup guide
    ├── BEE_SHIP_API_DOCS.md       # Complete API reference
    ├── BEE_SHIP_LOCAL_TESTING.md  # Local dev guide
    └── BEE_SHIP_NETLIFY_AGENTS.md # AI agents guide
```

---

## ⚡ Quick Start (3 Steps)

### Step 1: Add Environment Variables

Go to your [Netlify Environment Variables](https://app.netlify.com/sites/adgenxai/settings/deploys#environment):

```bash
# Instagram
INSTAGRAM_ACCOUNT_ID=your_id
INSTAGRAM_ACCESS_TOKEN=your_token

# YouTube
YOUTUBE_CLIENT_ID=your_id
YOUTUBE_CLIENT_SECRET=your_secret
YOUTUBE_REFRESH_TOKEN=your_token
```

**Where to get these?** See [BEE_SHIP_QUICKSTART.md](BEE_SHIP_QUICKSTART.md#how-to-get-api-credentials)

### Step 2: Wait for Deployment

Netlify auto-deploys in ~2-3 minutes after you add variables.

### Step 3: Test!

**Option A:** Use the demo page
```
https://adgenxai.pro/examples/social-posting-demo.html
```

**Option B:** Use cURL
```bash
curl -X POST https://adgenxai.pro/.netlify/functions/post-to-instagram \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://picsum.photos/1080", "caption": "My first post! 🐝"}'
```

**Option C:** Integrate in your app
```javascript
const response = await fetch('/.netlify/functions/post-to-instagram', {
  method: 'POST',
  body: JSON.stringify({ imageUrl, caption })
});
```

---

## 🎯 API Endpoints

All functions are available at: `https://adgenxai.pro/.netlify/functions/`

| Endpoint | Status | Purpose |
|----------|--------|---------|
| `/post-to-instagram` | ✅ Ready | Post images to Instagram |
| `/post-to-youtube` | ✅ Ready | Upload videos to YouTube |
| `/post-to-tiktok` | ⚠️ Stub | Post to TikTok (not yet implemented) |

**See full API docs:** [BEE_SHIP_API_DOCS.md](BEE_SHIP_API_DOCS.md)

---

## 🔧 Development Workflows

### Local Testing

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Create .env file with your credentials
# 3. Start local dev server
netlify dev

# 4. Test at http://localhost:8888
```

**Full guide:** [BEE_SHIP_LOCAL_TESTING.md](BEE_SHIP_LOCAL_TESTING.md)

### Using AI Agents

```bash
# Test all functions
netlify agents:create "Test all social media posting functions"

# Add new feature
netlify agents:create "Add rate limiting to Instagram function" --branch feature/rate-limit

# Fix bugs
netlify agents:create "Fix CORS errors in posting functions"
```

**Full guide:** [BEE_SHIP_NETLIFY_AGENTS.md](BEE_SHIP_NETLIFY_AGENTS.md)

---

## 💡 Common Use Cases

### 1. Automated Content Publishing

Schedule and publish content across multiple platforms from your application:

```typescript
import { postToInstagram, postToYouTube } from './examples/social-posting-client';

async function publishContent(content) {
  // Post to Instagram
  await postToInstagram(content.imageUrl, content.caption);

  // Upload to YouTube
  await postToYouTube(content.videoFile, content.title);
}
```

### 2. Social Media Dashboard

Build a dashboard that posts to multiple platforms simultaneously:

```typescript
async function postToAll(content) {
  const results = await Promise.allSettled([
    fetch('/.netlify/functions/post-to-instagram', { /* ... */ }),
    fetch('/.netlify/functions/post-to-youtube', { /* ... */ }),
    fetch('/.netlify/functions/post-to-tiktok', { /* ... */ })
  ]);

  return results.map(r => r.status === 'fulfilled' ? r.value : null);
}
```

### 3. Webhook-Triggered Posts

Automatically post when new content is created:

```typescript
// netlify/functions/content-webhook.ts
export const handler = async (event) => {
  const content = JSON.parse(event.body);

  // Post to Instagram when webhook triggered
  await fetch('/.netlify/functions/post-to-instagram', {
    method: 'POST',
    body: JSON.stringify(content)
  });

  return { statusCode: 200 };
};
```

### 4. Scheduled Publishing

Use Netlify Scheduled Functions to publish at specific times:

```typescript
// netlify/functions/scheduled-posts.ts
export const handler = async () => {
  const scheduledPosts = await getScheduledPosts(); // from database

  for (const post of scheduledPosts) {
    if (post.publishTime <= Date.now()) {
      await publishPost(post);
    }
  }
};

export const schedule = '@hourly'; // Run every hour
```

---

## 🔐 Security Best Practices

1. **Never expose credentials** in frontend code
2. **Use environment variables** for all secrets
3. **Validate all inputs** on the server side
4. **Implement rate limiting** to prevent abuse
5. **Use HTTPS** for all URLs
6. **Add authentication** before production use

**See full security guide:** [BEE_SHIP_API_DOCS.md](BEE_SHIP_API_DOCS.md#security-best-practices)

---

## 📊 Feature Status

| Feature | Status | Documentation |
|---------|--------|---------------|
| Instagram Posting | ✅ Production Ready | [API Docs](BEE_SHIP_API_DOCS.md#1-post-post-to-instagram) |
| YouTube Upload | ✅ Production Ready | [API Docs](BEE_SHIP_API_DOCS.md#2-post-post-to-youtube) |
| TikTok Posting | ⚠️ Stub Implementation | [API Docs](BEE_SHIP_API_DOCS.md#3-post-post-to-tiktok) |
| Demo UI | ✅ Ready | [examples/social-posting-demo.html](examples/social-posting-demo.html) |
| TypeScript Client | ✅ Ready | [examples/social-posting-client.ts](examples/social-posting-client.ts) |
| Local Testing | ✅ Documented | [Local Testing Guide](BEE_SHIP_LOCAL_TESTING.md) |
| AI Agents | ✅ Documented | [Netlify Agents Guide](BEE_SHIP_NETLIFY_AGENTS.md) |

---

## 🆘 Getting Help

### Quick Troubleshooting

| Problem | Solution | Docs |
|---------|----------|------|
| "Credentials not configured" | Add environment variables in Netlify | [Quickstart](BEE_SHIP_QUICKSTART.md#step-1-add-environment-variables) |
| "Failed to post" | Check image URL is publicly accessible | [API Docs - Troubleshooting](BEE_SHIP_API_DOCS.md#troubleshooting) |
| Function timeout | Reduce video file size | [API Docs - Troubleshooting](BEE_SHIP_API_DOCS.md#function-timeout) |
| Local testing issues | Follow local testing guide | [Local Testing](BEE_SHIP_LOCAL_TESTING.md) |

### Documentation Index

- **Setup**: [BEE_SHIP_QUICKSTART.md](BEE_SHIP_QUICKSTART.md)
- **API Reference**: [BEE_SHIP_API_DOCS.md](BEE_SHIP_API_DOCS.md)
- **Local Dev**: [BEE_SHIP_LOCAL_TESTING.md](BEE_SHIP_LOCAL_TESTING.md)
- **AI Agents**: [BEE_SHIP_NETLIFY_AGENTS.md](BEE_SHIP_NETLIFY_AGENTS.md)

### Support Resources

- Check Netlify function logs in dashboard
- Review [API documentation](BEE_SHIP_API_DOCS.md#troubleshooting)
- Test with [demo page](examples/social-posting-demo.html)
- Use [Netlify agents](BEE_SHIP_NETLIFY_AGENTS.md) to debug issues

---

## 🚀 What's Next?

### Immediate Next Steps

1. ✅ Add your API credentials to Netlify
2. ✅ Wait for deployment
3. ✅ Test with the demo page
4. ✅ Integrate into your application

### Future Enhancements

Use [Netlify Agents](BEE_SHIP_NETLIFY_AGENTS.md) to add:

- **Rate limiting** - Prevent API quota exhaustion
- **Queue system** - Handle multiple concurrent requests
- **Scheduled posts** - Publish content at specific times
- **Analytics** - Track posting success rates
- **More platforms** - LinkedIn, Twitter/X, Facebook
- **Image optimization** - Auto-resize and compress
- **Video processing** - Generate thumbnails
- **Webhook notifications** - Alert on success/failure
- **Admin dashboard** - Monitor posting activity
- **Authentication** - Secure your endpoints

**See ready-to-use agent prompts:** [BEE_SHIP_NETLIFY_AGENTS.md](BEE_SHIP_NETLIFY_AGENTS.md#-useful-agent-prompts-for-bee-ship)

---

## 🎓 Learn More

### Platform-Specific Documentation

- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [TikTok Content Posting API](https://developers.tiktok.com)

### Netlify Resources

- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- [Netlify AI Agents](https://docs.netlify.com/cli/agents/)

---

## 📝 Quick Reference

### Essential Commands

```bash
# Local development
netlify dev

# List environment variables
netlify env:list

# Create AI agent task
netlify agents:create "Your task here"

# Deploy manually
netlify deploy --prod
```

### Essential Links

- **Demo Page**: https://adgenxai.pro/examples/social-posting-demo.html
- **Netlify Dashboard**: https://app.netlify.com/sites/adgenxai
- **Environment Variables**: https://app.netlify.com/sites/adgenxai/settings/deploys#environment
- **Function Logs**: https://app.netlify.com/sites/adgenxai/functions

---

## 🎉 You're Ready!

Your BEE-SHIP autonomous social publishing platform is ready to fly! 🐝

**Next:** Open [BEE_SHIP_QUICKSTART.md](BEE_SHIP_QUICKSTART.md) to get started in 5 minutes.

---

**Built with ❤️ by AdGenXAI** | Powered by Netlify | Automated with AI 🤖
