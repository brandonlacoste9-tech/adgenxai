# Ghost CMS Integration - Quick Start Guide

Get your Ghost CMS integration up and running in 5 minutes!

## Prerequisites

- ✅ AdGenXAI installed and running
- ✅ Ghost site (self-hosted or Ghost(Pro))
- ✅ Admin access to your Ghost site

## Step 1: Get Your Ghost API Keys

1. **Log in to Ghost Admin**
   ```
   Navigate to: https://your-ghost-site.com/ghost
   ```

2. **Create Custom Integration**
   - Go to **Settings** → **Integrations**
   - Click **+ Add custom integration**
   - Name it "AdGenXAI" (or any name you prefer)
   - Click **Create**

3. **Copy Your API Keys**
   
   You'll see two keys displayed:
   
   - **Content API Key**: Long hexadecimal string (e.g., `22444f78447824223f10f...`)
   - **Admin API Key**: Longer format with ID and secret (e.g., `507f1f77bcf86cd799439011:abc123...`)
   
   ⚠️ **Important**: Keep these keys secure! Don't commit them to version control.

## Step 2: Configure AdGenXAI

### Option A: Via Dashboard (Recommended)

1. **Navigate to Integrations**
   ```
   Go to: Dashboard → Integrations
   ```

2. **Connect Ghost**
   - Click **Connect Ghost Site**
   - Enter your Ghost URL (e.g., `https://your-site.com`)
   - Paste your **Content API Key**
   - Paste your **Admin API Key**
   - Click **Connect**

3. **Verify Connection**
   - You should see "✓ Connected to [Your Site Name]"
   - If connection fails, verify your URL and keys

### Option B: Via Environment Variables

1. **Create/Edit `.env` file**
   ```bash
   cd /path/to/adgenxai
   cp .env.example .env
   ```

2. **Add Ghost Configuration**
   ```bash
   GHOST_URL=https://your-ghost-site.com
   GHOST_CONTENT_API_KEY=your_content_api_key_here
   GHOST_ADMIN_API_KEY=your_admin_api_key_here
   ```

3. **Restart AdGenXAI**
   ```bash
   npm run dev
   ```

## Step 3: Generate and Publish Content

### Via Dashboard

1. **Navigate to Publisher**
   ```
   Go to: Dashboard → Publish
   ```

2. **Generate Content**
   - Choose content type (Blog, Ad, Social)
   - Select AI provider (OpenAI or GitHub Models)
   - Enter your content prompt
   - Click **Generate Content**

3. **Review and Configure**
   - Preview the generated content
   - Set publish status (Draft or Published)
   - Add tags
   - Toggle featured post if desired
   - Click **Publish to Ghost**

4. **View Your Post**
   - Click **View on Ghost** to see your published content
   - Or check your Ghost Admin panel

### Via API

You can also publish programmatically:

```typescript
// Example: Publish AI content to Ghost
const response = await fetch('/api/ghost/publish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    config: {
      url: process.env.GHOST_URL,
      contentApiKey: process.env.GHOST_CONTENT_API_KEY,
      adminApiKey: process.env.GHOST_ADMIN_API_KEY
    },
    content: {
      title: 'My AI-Generated Post',
      content: '<h1>Hello World</h1><p>This is AI-generated content!</p>',
      format: 'html',
      metadata: {
        provider: 'openai',
        generatedAt: new Date()
      }
    },
    options: {
      status: 'draft', // or 'published'
      tags: ['ai-generated', 'tech'],
      featured: false,
      addAIMetadata: true
    }
  })
});

const result = await response.json();
console.log('Published to:', result.postUrl);
```

## Step 4: Verify Everything Works

### Test Connection

```bash
# Using curl
curl -X POST http://localhost:3000/api/ghost/test-connection \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-ghost-site.com",
    "contentApiKey": "your_content_key",
    "adminApiKey": "your_admin_key"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Connected to Your Site Name",
  "siteName": "Your Site Name",
  "version": "5.0"
}
```

### Test Publishing

```bash
# Publish a test post
curl -X POST http://localhost:3000/api/ghost/publish \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "url": "https://your-ghost-site.com",
      "contentApiKey": "your_content_key",
      "adminApiKey": "your_admin_key"
    },
    "content": {
      "title": "Test Post from AdGenXAI",
      "content": "<p>This is a test post!</p>",
      "format": "html"
    },
    "options": {
      "status": "draft"
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "postUrl": "https://your-ghost-site.com/test-post-from-adgenxai",
  "postId": "507f1f77bcf86cd799439011",
  "message": "Content published successfully"
}
```

## Common Issues & Solutions

### Connection Failed

**Problem**: "Failed to connect to Ghost"

**Solutions**:
- ✅ Verify Ghost URL is correct (include `https://`)
- ✅ Check that Ghost site is accessible
- ✅ Confirm API keys are copied correctly (no extra spaces)
- ✅ Ensure Ghost version is 5.0 or higher

### Publishing Failed

**Problem**: "Failed to publish content"

**Solutions**:
- ✅ Verify Admin API key is provided (not just Content API)
- ✅ Check that content has both title and body
- ✅ Ensure API key has write permissions
- ✅ Check Ghost Admin logs for errors

### Missing Features

**Problem**: Some features don't work

**Solutions**:
- ✅ Update Ghost to latest version (5.0+)
- ✅ Check your Ghost plan supports the feature
- ✅ Verify integration has correct permissions

## Next Steps

Now that you're set up, explore these advanced features:

1. **[Batch Publishing](./integrations/GHOST.md#batch-publishing)** - Publish multiple posts at once
2. **[Scheduled Posts](./integrations/GHOST.md#scheduling)** - Schedule posts for future publication
3. **[SEO Optimization](./integrations/GHOST.md#seo-optimization)** - Add meta descriptions and images
4. **[Custom Workflows](./integrations/GHOST.md#workflows)** - Automate your publishing pipeline

## Resources

- 📖 [Full Ghost Integration Guide](./integrations/GHOST.md)
- 🔗 [Ghost API Documentation](https://ghost.org/docs/content-api/)
- 💬 [Community Support](https://discord.gg/adgenxai)
- 🐛 [Report Issues](https://github.com/brandonlacoste9-tech/adgenxai/issues)

## Getting Help

If you're stuck:

1. Check the [troubleshooting section](./integrations/GHOST.md#troubleshooting)
2. Search [existing issues](https://github.com/brandonlacoste9-tech/adgenxai/issues)
3. Ask in our [Discord community](https://discord.gg/adgenxai)
4. Email support: support@adgenxai.com

---

**Ready to publish?** Head to [Dashboard → Publish](http://localhost:3000/dashboard/publish) and start creating! 🚀
