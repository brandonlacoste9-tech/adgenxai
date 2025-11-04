# GitHub PR Manager Agent - Complete Setup Guide

## 🎯 Overview

This guide walks you through setting up the GitHub PR Manager Agent system from scratch. The agent provides intelligent PR management, issue triage, and automated code review with AI integration.

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- GitHub Account with repository access
- (Optional) Redis for webhook queue management
- (Optional) AI service endpoint for enhanced analysis

## 🚀 Quick Start

### 1. Install Dependencies

#### Root Project
```bash
cd /path/to/adgenxai
npm install
```

#### GitHub PR Manager Agent
```bash
cd agents/github-pr-manager
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in `agents/github-pr-manager/`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# GitHub Configuration
GITHUB_TOKEN=ghp_your_personal_access_token_here
GITHUB_REPOSITORY=owner/repo
WEBHOOK_SECRET=your_webhook_secret_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Features
PROMOTE_DRAFTS=false
ENABLE_AI_ANALYSIS=true
AI_SERVICE_URL=http://localhost:8000

# Optional: Redis for webhook queue
REDIS_URL=redis://localhost:6379
```

### 3. Build the Agent

```bash
cd agents/github-pr-manager
npm run build
```

This creates `dist/index.js` from the source files.

### 4. Start the Agent

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The agent will start on port 3001 (or your configured PORT).

## 🔧 Configuration Details

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GITHUB_TOKEN` | GitHub Personal Access Token with repo permissions | `ghp_xxxxxxxxxxxxx` |
| `GITHUB_REPOSITORY` | Repository to manage (owner/repo format) | `brandonlacoste9-tech/adgenxai` |

### Optional Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `WEBHOOK_SECRET` | `""` | GitHub webhook secret for signature verification |
| `PROMOTE_DRAFTS` | `false` | Automatically promote draft PRs to ready for review |
| `ENABLE_AI_ANALYSIS` | `true` | Enable AI-powered PR and issue analysis |
| `AI_SERVICE_URL` | `http://localhost:8000` | AI service endpoint |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL |
| `NODE_ENV` | `development` | Environment mode |

## 🏗️ Architecture

### Components

1. **Main Agent (src/index.js)**
   - Express server handling webhooks
   - Health monitoring and metrics
   - Circuit breaker patterns for resilience

2. **AI Service (src/ai-service.js)**
   - PR and issue analysis
   - Risk assessment
   - Label suggestions

3. **Circuit Breaker (src/circuit-breaker.js)**
   - Prevents cascading failures
   - Automatic recovery
   - State tracking (CLOSED, OPEN, HALF_OPEN)

4. **Health Monitor (src/health-monitor.js)**
   - System health tracking
   - Performance metrics
   - Alert generation

5. **Retry Logic (src/retry-logic.js)**
   - Exponential backoff
   - Configurable retry strategies
   - Error classification

## 🔗 API Endpoints

### Health & Status

- `GET /health` - Basic health check
- `GET /ready` - Kubernetes-style readiness probe
- `GET /status` - Detailed system status
- `GET /metrics` - Prometheus metrics

### Webhook

- `POST /webhook` - GitHub webhook endpoint

### Manual Testing

- `POST /trigger/pr-review` - Manually trigger PR review
- `POST /trigger/issue-triage` - Manually trigger issue triage

## 🧪 Testing the Agent

### 1. Health Check

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "HEALTHY",
  "timestamp": "2025-11-04T12:00:00.000Z",
  "uptime": "5 minutes",
  "repo": "brandonlacoste9-tech/adgenxai",
  "mode": "development",
  "ai_enabled": true,
  "circuit_breakers": {
    "ai": { "state": "CLOSED", "canExecute": true },
    "github": { "state": "CLOSED", "canExecute": true }
  }
}
```

### 2. Metrics

```bash
curl http://localhost:3001/metrics
```

Returns Prometheus-formatted metrics.

### 3. Manual PR Review

```bash
curl -X POST http://localhost:3001/trigger/pr-review \
  -H "Content-Type: application/json" \
  -d '{
    "repository": "brandonlacoste9-tech/adgenxai",
    "prNumber": 123
  }'
```

## 🔐 GitHub Token Permissions

Your GitHub token needs the following permissions:

- `repo` - Full repository access
- `read:org` - Read organization data (if applicable)
- `workflow` - Update GitHub Actions workflows (if needed)

### Creating a Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `read:org`, `workflow`
4. Generate and copy the token
5. Add to `.env` as `GITHUB_TOKEN`

## 🎯 Features

### Automated PR Management

- ✅ Automatic labeling based on AI analysis
- ✅ Risk assessment (low, medium, high, critical)
- ✅ Priority classification
- ✅ Automated review comments for high-risk PRs
- ✅ Draft PR promotion (optional)

### Issue Triage

- ✅ Automatic categorization
- ✅ Priority assignment
- ✅ Complexity analysis
- ✅ Label suggestions

### Resilience

- ✅ Circuit breaker pattern for external services
- ✅ Exponential backoff retry logic
- ✅ Health monitoring and alerts
- ✅ Graceful degradation

### Observability

- ✅ Prometheus metrics
- ✅ Structured logging
- ✅ Performance tracking
- ✅ Error rate monitoring

## 🐛 Troubleshooting

### Issue: Agent not starting

**Check:**
1. Node.js version (must be >= 18.0.0)
2. Dependencies installed (`npm install`)
3. Build completed (`npm run build`)
4. Environment variables set correctly

### Issue: "GITHUB_TOKEN not provided" warning

**Solution:**
Add `GITHUB_TOKEN` to your `.env` file with a valid GitHub Personal Access Token.

### Issue: Agent can't connect to GitHub

**Check:**
1. GitHub token is valid and not expired
2. Token has correct permissions
3. Network connectivity
4. No rate limiting

### Issue: Circuit breaker is OPEN

**Explanation:**
The circuit breaker opens after too many failures to prevent cascading errors.

**Solution:**
1. Check the health of the downstream service (GitHub API or AI service)
2. Wait for the circuit breaker to automatically attempt recovery
3. Check logs for the root cause of failures

### Issue: Redis connection errors

**Solution:**
1. Ensure Redis is running: `redis-cli ping` should return `PONG`
2. Check `REDIS_URL` in `.env`
3. Redis is optional - the agent will still work without it

## 📊 Monitoring

### Health Status Levels

- `HEALTHY` - All systems operational
- `DEGRADED` - Some issues but still functional
- `UNHEALTHY` - Critical issues, service may be unavailable

### Circuit Breaker States

- `CLOSED` - Normal operation, requests pass through
- `OPEN` - Too many failures, requests are blocked
- `HALF_OPEN` - Testing if service has recovered

## 🔄 Updates and Maintenance

### Updating Dependencies

```bash
cd agents/github-pr-manager
npm update
npm audit fix
```

### Rebuilding After Code Changes

```bash
npm run build
```

### Running in Production

For production deployment, consider:

1. Using PM2 or similar process manager
2. Setting up proper logging (Winston, etc.)
3. Configuring monitoring alerts
4. Using environment-specific configuration
5. Setting up Redis for webhook queue management
6. Implementing backup and recovery procedures

See [PRODUCTION_GUIDE.md](./PRODUCTION_GUIDE.md) for detailed production setup.

## 📚 Additional Resources

- [README.md](./README.md) - Project overview
- [OPERATIONAL_RUNBOOK.md](./OPERATIONAL_RUNBOOK.md) - Day-to-day operations
- [PRODUCTION_GUIDE.md](./PRODUCTION_GUIDE.md) - Production deployment
- [.env.example](./.env.example) - Environment variable template

## 🆘 Support

For issues or questions:
1. Check existing documentation
2. Review logs for error messages
3. Check GitHub Issues
4. Contact the development team

## ✅ Checklist

Before starting the agent in production:

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Health check passes
- [ ] GitHub token has correct permissions
- [ ] Webhook secret configured (if using webhooks)
- [ ] Redis running (if using Redis)
- [ ] AI service accessible (if using AI features)
- [ ] Monitoring configured
- [ ] Logs being captured
- [ ] Backup strategy in place

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-04
