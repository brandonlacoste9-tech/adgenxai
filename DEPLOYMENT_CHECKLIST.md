# 🚀 AdGenXAI - Netlify Deployment Checklist

Use this checklist to ensure a smooth deployment to Netlify.

## ✅ Pre-Deployment Checklist

### 1. Repository Setup
- [ ] Code is committed to GitHub
- [ ] All changes are pushed to main branch
- [ ] No uncommitted changes locally
- [ ] Build passes locally (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] Type checking passes (`npm run typecheck`)

### 2. Netlify Account Setup
- [ ] Created Netlify account at [netlify.com](https://netlify.com)
- [ ] Netlify CLI installed (`npm install -g netlify-cli`)
- [ ] Logged into Netlify CLI (`netlify login`)

### 3. Environment Variables Prepared
- [ ] Copied `.env.example` to `.env.local`
- [ ] Updated all placeholder values with actual credentials
- [ ] Verified required variables:
  - [ ] `NEXT_PUBLIC_APP_URL`
  - [ ] `LONGCAT_API_KEY` or `OPENAI_API_KEY`
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` (if using auth)
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (if using auth)
  - [ ] `GITHUB_WEBHOOK_SECRET` (if using webhooks)
  - [ ] `GITHUB_PAT` (if using GitHub integration)

### 4. Dependencies & Configuration
- [ ] All dependencies installed (`npm install`)
- [ ] `netlify.toml` reviewed and configured
- [ ] No critical TODOs in code
- [ ] Documentation is up to date

---

## 📦 Deployment Steps

### Option A: Automated Script (Recommended)

```bash
# Preview deployment
npm run deploy:preview

# Production deployment
npm run deploy
```

### Option B: Manual Netlify Dashboard

1. [ ] Go to [app.netlify.com](https://app.netlify.com)
2. [ ] Click "Add new site" → "Import an existing project"
3. [ ] Select GitHub provider
4. [ ] Choose your repository
5. [ ] Configure build settings (auto-detected from netlify.toml)
6. [ ] Add environment variables in Site settings
7. [ ] Click "Deploy site"

---

## ⚙️ Post-Deployment Setup

### 1. Verify Deployment
```bash
npm run verify https://your-site.netlify.app
```

- [ ] Homepage loads correctly
- [ ] Dashboard pages accessible
- [ ] API endpoints responding
- [ ] Static assets loading
- [ ] HTTPS enabled
- [ ] Security headers configured

### 2. Configure Domain (Optional)
- [ ] Add custom domain in Netlify Dashboard
- [ ] Update DNS records with your domain provider
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Verify HTTPS certificate issued

### 3. Set Up Integrations

#### GitHub Webhooks
- [ ] Go to GitHub repo → Settings → Webhooks
- [ ] Add webhook URL: `https://your-site.netlify.app/api/webhooks/github`
- [ ] Set content type: `application/json`
- [ ] Add secret from `GITHUB_WEBHOOK_SECRET`
- [ ] Select events: Pull requests, Issues, Push
- [ ] Save webhook

#### Environment Variables in Netlify
- [ ] Go to Site settings → Environment variables
- [ ] Import all variables from `.env.local`
- [ ] Verify scopes are set correctly
- [ ] Redeploy if variables were added after initial deploy

### 4. Enable Monitoring
- [ ] Enable Netlify Analytics (Site settings → Analytics)
- [ ] Set up Sentry error tracking (if using)
- [ ] Configure Google Analytics (if using)
- [ ] Set up uptime monitoring (e.g., UptimeRobot)

### 5. Test Key Features
- [ ] Video generation API (`/api/sora/generate`)
- [ ] Dashboard analytics
- [ ] User authentication (if enabled)
- [ ] GitHub webhook processing
- [ ] Cache functionality
- [ ] Form submissions
- [ ] Mobile responsiveness

---

## 🔍 Validation Tests

Run these manual tests after deployment:

### Homepage & Navigation
- [ ] Homepage loads within 3 seconds
- [ ] All navigation links work
- [ ] Mobile menu functions correctly
- [ ] Footer links work

### Dashboard
- [ ] Dashboard accessible
- [ ] All tabs load
- [ ] Charts render correctly
- [ ] Real-time data updates

### API Endpoints
```bash
# Test chat endpoint
curl -X POST https://your-site.netlify.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

# Test video generation
curl -X POST https://your-site.netlify.app/api/sora/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A beautiful sunset"}'
```

- [ ] `/api/chat` returns valid response
- [ ] `/api/sora/generate` accepts requests
- [ ] `/api/dashboard/stats` returns data
- [ ] Error handling works correctly

### Performance
- [ ] Lighthouse score > 90
- [ ] Time to First Byte < 500ms
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

---

## 🐛 Troubleshooting

If deployment fails, check:

1. **Build Errors**
   - [ ] Review build logs in Netlify dashboard
   - [ ] Check for TypeScript errors locally
   - [ ] Verify all dependencies installed

2. **Runtime Errors**
   - [ ] Check function logs: `netlify functions:log`
   - [ ] Verify environment variables are set
   - [ ] Test API endpoints manually

3. **Environment Issues**
   - [ ] Confirm all required env vars are in Netlify
   - [ ] Check variable names match exactly (case-sensitive)
   - [ ] Redeploy after adding variables

4. **Performance Issues**
   - [ ] Check function cold start times
   - [ ] Review bundle size
   - [ ] Enable caching in netlify.toml

---

## 📊 Ongoing Monitoring

After successful deployment, monitor:

### Daily
- [ ] Check Netlify Analytics for traffic
- [ ] Review error logs
- [ ] Monitor uptime

### Weekly
- [ ] Review performance metrics
- [ ] Check API usage/costs
- [ ] Update dependencies if needed

### Monthly
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Backup verification
- [ ] Cost analysis

---

## 🎯 Deployment Commands Quick Reference

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build locally
npm run build

# Run tests
npm test
npm run typecheck

# Deploy preview
npm run deploy:preview

# Deploy production
npm run deploy

# Verify deployment
npm run verify https://your-site.netlify.app

# Netlify CLI
netlify login
netlify link
netlify deploy
netlify deploy --prod
netlify functions:log
netlify env:list
```

---

## ✨ Success Criteria

Your deployment is successful when:

- ✅ All automated tests pass
- ✅ Manual verification succeeds
- ✅ Performance metrics meet targets
- ✅ No errors in logs
- ✅ All integrations working
- ✅ Domain configured (if applicable)
- ✅ Monitoring enabled
- ✅ Team can access dashboard

---

## 📚 Resources

- [Full Deployment Guide](./docs/NETLIFY_DEPLOYMENT_GUIDE.md)
- [Environment Variables Reference](./.env.example)
- [Netlify Configuration](./netlify.toml)
- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Questions?** Check the [troubleshooting section](./docs/NETLIFY_DEPLOYMENT_GUIDE.md#troubleshooting) or open an issue on GitHub.

**Ready to deploy?** Start with: `npm run deploy:preview` 🚀
