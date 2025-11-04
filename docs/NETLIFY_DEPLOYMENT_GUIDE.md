# AdGenXAI - Netlify Deployment Guide

Complete guide for deploying AdGenXAI to Netlify with production-ready configuration.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Configuration](#environment-configuration)
4. [Deployment Methods](#deployment-methods)
5. [Post-Deployment Setup](#post-deployment-setup)
6. [Troubleshooting](#troubleshooting)
7. [Advanced Configuration](#advanced-configuration)

---

## 🚀 Prerequisites

### Required Tools

1. **Netlify CLI** (for command-line deployment)
   ```bash
   npm install -g netlify-cli
   ```

2. **Git** (for repository integration)
   ```bash
   git --version  # Verify installation
   ```

3. **Node.js 20+** and **npm 10+**
   ```bash
   node --version  # Should be 20.x or higher
   npm --version   # Should be 10.x or higher
   ```

### Required Accounts

- **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
- **GitHub Account**: For repository hosting and CI/CD
- **Supabase Account**: For database and authentication (optional)
- **LongCat/OpenAI Account**: For video generation API keys

---

## 🎯 Quick Start

### Method 1: One-Click Deploy (Recommended for Testing)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

1. Click the button above
2. Connect your GitHub account
3. Configure environment variables (see below)
4. Click "Save & Deploy"

### Method 2: CLI Deployment (Recommended for Production)

```bash
# 1. Clone and install
git clone https://github.com/brandonlacoste9-tech/adgenxai.git
cd adgenxai
npm install

# 2. Login to Netlify
netlify login

# 3. Link to existing site or create new
netlify link
# OR
netlify init

# 4. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your actual values

# 5. Deploy preview
npm run deploy:preview

# 6. Deploy to production
npm run deploy
```

### Method 3: Git-Based Continuous Deployment (Recommended for Teams)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: initial deployment"
   git push origin main
   ```

2. **Connect Repository in Netlify Dashboard**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Configure build settings (auto-detected from `netlify.toml`)
   - Click "Deploy site"

---

## 🔐 Environment Configuration

### Step 1: Copy Environment Template

```bash
cp .env.example .env.local
```

### Step 2: Configure Required Variables

#### **Essential Variables** (Required for basic functionality)

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app

# Netlify (auto-populated in production)
NETLIFY_SITE_ID=your-site-id
```

#### **Video Generation** (Required for AI features)

```bash
# LongCat API
LONGCAT_API_KEY=sk-your-longcat-api-key
LONGCAT_BASE_URL=https://api.longcat.ai/v1
USE_LONGCAT=1

# OR OpenAI Sora
OPENAI_API_KEY=sk-your-openai-api-key
```

#### **Authentication** (Optional but recommended)

```bash
# NextAuth
NEXTAUTH_URL=https://your-site.netlify.app
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### **GitHub Integration** (For webhook automation)

```bash
GITHUB_WEBHOOK_SECRET=your-webhook-secret
GITHUB_PAT=your-personal-access-token
GITHUB_APP_ID=your-app-id
GITHUB_APP_PRIVATE_KEY=your-private-key
```

### Step 3: Add Variables to Netlify

#### Via Netlify Dashboard:
1. Go to **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Add each variable from your `.env.local` file
4. Select scopes: `Production`, `Deploy Previews`, `Branch deploys`

#### Via Netlify CLI:
```bash
# Set individual variable
netlify env:set VARIABLE_NAME "value"

# Import from .env.local
netlify env:import .env.local
```

---

## 🚀 Deployment Methods

### Automated Deployment (Recommended)

Our scripts handle everything automatically:

```bash
# Deploy preview (test before production)
npm run deploy:preview

# Deploy to production
npm run deploy

# Verify deployment
npm run verify https://your-site.netlify.app
```

The deployment script will:
- ✅ Run TypeScript type checks
- ✅ Execute test suite
- ✅ Build the application
- ✅ Deploy to Netlify
- ✅ Display deployment URL

### Manual Netlify CLI Deployment

```bash
# Preview deployment
netlify deploy

# Production deployment
netlify deploy --prod

# Build and deploy in one command
netlify deploy --build --prod
```

### Git-Based Automatic Deployment

Once connected to GitHub:

1. **Production**: Push to `main` branch
   ```bash
   git push origin main
   ```

2. **Preview**: Open a pull request
   ```bash
   git checkout -b feature/new-feature
   git push origin feature/new-feature
   # Open PR on GitHub
   ```

---

## ✅ Post-Deployment Setup

### 1. Verify Deployment

Run the verification script:

```bash
npm run verify https://your-site.netlify.app
```

This checks:
- ✅ Homepage accessibility
- ✅ Dashboard pages
- ✅ API endpoints
- ✅ Static assets
- ✅ Security headers
- ✅ HTTPS configuration
- ✅ Performance metrics

### 2. Configure Custom Domain (Optional)

#### Via Netlify Dashboard:
1. Go to **Domain settings**
2. Click **Add custom domain**
3. Enter your domain (e.g., `adgenxai.com`)
4. Follow DNS configuration instructions

#### Via CLI:
```bash
netlify domains:add adgenxai.com
```

### 3. Enable HTTPS

HTTPS is automatically enabled for:
- ✅ `*.netlify.app` domains (instant)
- ✅ Custom domains (provisioned within minutes)

### 4. Set Up GitHub Webhooks

1. Go to your GitHub repository settings
2. Click **Webhooks** → **Add webhook**
3. Set Payload URL: `https://your-site.netlify.app/api/webhooks/github`
4. Content type: `application/json`
5. Secret: Use the value from `GITHUB_WEBHOOK_SECRET`
6. Select events: Pull requests, Issues, Push
7. Click **Add webhook**

### 5. Configure Netlify Functions

Functions are automatically deployed from `netlify/functions/` directory.

Test a function:
```bash
curl https://your-site.netlify.app/.netlify/functions/health
```

### 6. Set Up Monitoring

#### Netlify Analytics (Built-in):
- Enable in Site settings → Analytics
- View in Dashboard → Analytics tab

#### External Monitoring:
- **Sentry**: Add `NEXT_PUBLIC_SENTRY_DSN` to environment variables
- **Google Analytics**: Add `NEXT_PUBLIC_GA_TRACKING_ID`

---

## 🔧 Troubleshooting

### Build Failures

#### Issue: TypeScript Errors
```bash
# Check types locally
npm run typecheck

# Fix and redeploy
git add .
git commit -m "fix: resolve type errors"
git push
```

#### Issue: Missing Dependencies
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Issue: Environment Variables Not Set
1. Check Netlify Dashboard → Site settings → Environment variables
2. Ensure variables are available in correct scope (production/preview)
3. Redeploy after adding variables

### Runtime Errors

#### Issue: API Routes Return 404
**Cause**: Function not deployed properly

**Solution**:
1. Check `netlify/functions/` directory exists
2. Verify `netlify.toml` redirects configuration
3. Check function logs: `netlify functions:log`

#### Issue: Database Connection Failed
**Cause**: Missing Supabase credentials

**Solution**:
```bash
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your-key"
```

### Performance Issues

#### Issue: Slow Response Times
**Solution**:
1. Enable edge caching in `netlify.toml`
2. Optimize images with Next.js Image component
3. Enable Netlify's asset optimization
4. Review function cold start times

#### Issue: Large Bundle Size
```bash
# Analyze bundle
npm install -D @next/bundle-analyzer
npm run build

# Optimize
# - Use dynamic imports for large components
# - Remove unused dependencies
# - Enable tree-shaking
```

### Viewing Logs

```bash
# Function logs
netlify functions:log

# Deploy logs
netlify watch

# Real-time logs
netlify dev --live
```

---

## 🔬 Advanced Configuration

### Custom Build Command

Edit `netlify.toml`:

```toml
[build]
  command = "npm run build && npm run postbuild"
  publish = ".next"
```

### Environment-Specific Builds

```toml
[context.production.environment]
  NODE_ENV = "production"
  ENABLE_ANALYTICS = "true"

[context.deploy-preview.environment]
  NODE_ENV = "staging"
  ENABLE_ANALYTICS = "false"
```

### Split Testing

Set up A/B testing:

```toml
[[redirects]]
  from = "/feature"
  to = "/feature-a"
  status = 200
  conditions = {Cookie = ["ab_test=a"]}

[[redirects]]
  from = "/feature"
  to = "/feature-b"
  status = 200
  conditions = {Cookie = ["ab_test=b"]}
```

### Rate Limiting

Configure in environment variables:

```bash
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

### Netlify Blobs Storage

Enable caching with Netlify Blobs:

```typescript
// lib/cache-adapter.ts already configured
import { cacheAdapter } from '@/lib/cache';

const cached = await cacheAdapter.get('key');
await cacheAdapter.set('key', data, { ttl: 3600 });
```

---

## 📊 Monitoring Checklist

After deployment, monitor:

- [ ] **Build Status**: Green builds in Netlify dashboard
- [ ] **Function Logs**: No errors in function execution
- [ ] **Analytics**: Traffic and performance metrics
- [ ] **Uptime**: Site availability (use external monitoring)
- [ ] **Error Tracking**: Sentry error reports
- [ ] **API Performance**: Response times for key endpoints
- [ ] **Cache Hit Rate**: Netlify Blobs cache performance

---

## 🎯 Deployment Best Practices

1. **Always test in preview first**
   ```bash
   npm run deploy:preview
   ```

2. **Run tests before deploying**
   ```bash
   npm test
   npm run typecheck
   ```

3. **Use semantic versioning**
   ```bash
   git tag -a v1.0.0 -m "Production release 1.0.0"
   git push --tags
   ```

4. **Monitor after deployment**
   - Check error rates
   - Review performance metrics
   - Test critical user flows

5. **Have a rollback plan**
   ```bash
   # Rollback in Netlify Dashboard
   # Or redeploy previous commit
   git revert HEAD
   git push
   ```

---

## 📚 Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/overview/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Netlify Blobs](https://docs.netlify.com/blobs/overview/)
- [AdGenXAI Documentation](./README.md)

---

## 🆘 Getting Help

- **Netlify Support**: https://www.netlify.com/support/
- **GitHub Issues**: https://github.com/brandonlacoste9-tech/adgenxai/issues
- **Community**: Netlify Community Forums

---

**Ready to deploy?** Run `npm run deploy:preview` to get started! 🚀
