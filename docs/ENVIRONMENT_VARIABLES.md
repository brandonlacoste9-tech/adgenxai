# Environment Variables & Secrets Management

## Overview
This guide explains how to manage environment variables and secrets for AdGenXAI across different environments.

## 🔐 Security Principles

1. **Never commit secrets to Git**
2. **Use different secrets for each environment**
3. **Rotate secrets regularly**
4. **Limit access to production secrets**
5. **Use environment-specific configurations**

## 📝 Environment Files

### Local Development (`.env.local`)
Create this file locally (ignored by Git):

```env
# Bee Agent API
BEE_API_URL=https://www.adgenxai.pro/api
BEE_API_KEY=your_development_bee_agent_api_key

# Sensory Cortex
SENSORY_CORTEX_URL=http://localhost:8888

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_development_key
SUPABASE_ANON_KEY=your_anon_key

# Social Platform APIs
INSTAGRAM_ACCOUNT_ID=your_test_account_id
FB_ACCESS_TOKEN=your_test_token
TIKTOK_CLIENT_KEY=your_test_client_key
TIKTOK_CLIENT_SECRET=your_test_client_secret

# Optional: Feature Flags
ENABLE_SORA=false
ENABLE_ANALYTICS=true
```

### Example Template (`.env.example`)
Committed to Git (no secrets):

```env
# Bee Agent API
BEE_API_URL=
BEE_API_KEY=

# Sensory Cortex
SENSORY_CORTEX_URL=

# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=

# Social Platform APIs
INSTAGRAM_ACCOUNT_ID=
FB_ACCESS_TOKEN=
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
```

## ☁️ Netlify Configuration

### Setting Environment Variables

1. **Via Netlify Dashboard:**
   - Go to Site Settings → Environment Variables
   - Add each variable with appropriate scopes
   - Set different values for production vs. deploy previews

2. **Via Netlify CLI:**
```bash
netlify env:set BEE_API_KEY "your-secret-key"
netlify env:set SUPABASE_URL "https://xxx.supabase.co"
```

3. **Via `netlify.toml` (Non-secret values only):**
```toml
[build.environment]
  NODE_VERSION = "20"
  NEXT_PUBLIC_APP_NAME = "AdGenXAI"
  NEXT_PUBLIC_API_VERSION = "v1"
```

### Required Netlify Variables

#### Production Environment
```
BEE_API_URL                 # Bee Agent API endpoint
BEE_API_KEY                 # Bee Agent authentication
SENSORY_CORTEX_URL          # External cortex URL (if separate)
SUPABASE_URL                # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY   # Supabase admin key
INSTAGRAM_ACCOUNT_ID        # Instagram business account ID
FB_ACCESS_TOKEN             # Facebook/Instagram access token
TIKTOK_CLIENT_KEY          # TikTok OAuth client key
TIKTOK_CLIENT_SECRET       # TikTok OAuth secret
YOUTUBE_CLIENT_ID          # YouTube API client ID
YOUTUBE_CLIENT_SECRET      # YouTube API secret
```

#### Preview Environment (Optional)
Use separate test accounts and keys for preview deployments.

## 🔄 GitHub Actions Secrets

### Setting Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add the following secrets:

```
NETLIFY_AUTH_TOKEN    # Required for deployment
NETLIFY_SITE_ID       # Required for deployment
```

### Optional CI/CD Secrets
```
CODECOV_TOKEN         # If using Codecov for coverage
SLACK_WEBHOOK_URL     # For build notifications
```

## 🌐 Browser-Accessible Variables

Variables with `NEXT_PUBLIC_` prefix are bundled into the client:

```env
# These are PUBLIC - do not put secrets here!
NEXT_PUBLIC_APP_NAME=AdGenXAI
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXX
```

**Warning:** Never use `NEXT_PUBLIC_` for secret keys or tokens!

## 📚 Variable Reference

### By Category

#### Authentication & APIs
| Variable | Required | Environment | Description |
|----------|----------|-------------|-------------|
| `BEE_API_KEY` | Yes | Server | Bee Agent API key |
| `BEE_API_URL` | Yes | Server | Bee Agent endpoint |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server | Supabase admin key |

#### Social Platforms
| Variable | Required | Environment | Description |
|----------|----------|-------------|-------------|
| `INSTAGRAM_ACCOUNT_ID` | No | Server | Instagram business account |
| `FB_ACCESS_TOKEN` | No | Server | Facebook access token |
| `TIKTOK_CLIENT_KEY` | No | Server | TikTok OAuth key |
| `TIKTOK_CLIENT_SECRET` | No | Server | TikTok OAuth secret |

#### Infrastructure
| Variable | Required | Environment | Description |
|----------|----------|-------------|-------------|
| `SENSORY_CORTEX_URL` | No | Server | External cortex endpoint |
| `NODE_ENV` | Auto | Both | Environment mode |

## 🔧 Best Practices

### 1. Separate Development and Production
```bash
# Development
BEE_API_KEY=dev_key_xxxx
SUPABASE_URL=https://dev-project.supabase.co

# Production
BEE_API_KEY=prod_key_xxxx
SUPABASE_URL=https://prod-project.supabase.co
```

### 2. Use Descriptive Names
```bash
# Good
INSTAGRAM_BUSINESS_ACCOUNT_ID=123456789

# Bad
ACCOUNT_ID=123456789
```

### 3. Document Required Variables
Update `.env.example` whenever you add new variables.

### 4. Validate on Startup
Add validation in your code:

```typescript
// lib/env.ts
export function validateEnv() {
  const required = ['BEE_API_KEY', 'SUPABASE_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

### 5. Use Type-Safe Access
```typescript
// lib/env.ts
export const env = {
  beeApiKey: process.env.BEE_API_KEY!,
  beeApiUrl: process.env.BEE_API_URL || 'https://default.api.com',
  supabaseUrl: process.env.SUPABASE_URL!,
} as const;
```

## 🚨 Troubleshooting

### Variables Not Available in Build
- Check if they're set in Netlify (not just locally)
- Verify spelling and case sensitivity
- Rebuild the site after adding variables

### Variables Not Available in Functions
- Ensure they're set in Netlify (not just in `netlify.toml`)
- Functions have access to all environment variables
- Don't use `NEXT_PUBLIC_` prefix for server-only variables

### Build Fails with Missing Variables
- Add to Netlify environment variables
- Check if required in build step vs. runtime
- Use default values where appropriate

## 🔄 Rotating Secrets

### When to Rotate
- After a team member leaves
- If a secret is compromised
- Regularly (every 90 days for production)

### How to Rotate
1. Generate new secret in the service (Supabase, Facebook, etc.)
2. Update in Netlify environment variables
3. Trigger a new deployment
4. Verify the new secret works
5. Revoke the old secret

## 📞 Support

For issues with:
- **Netlify variables**: Check Netlify docs
- **Supabase keys**: Regenerate in Supabase dashboard
- **Social API tokens**: Refer to platform documentation
- **GitHub secrets**: Repository admin access required

## ✅ Checklist

Before deploying:
- [ ] All required variables set in Netlify
- [ ] No secrets committed to Git
- [ ] `.env.example` is up to date
- [ ] Different keys for prod/staging
- [ ] Variables validated on startup
- [ ] Documentation updated

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)
- [Supabase API Keys](https://supabase.com/docs/guides/api/api-keys)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
