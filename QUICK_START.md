# 🚀 GitHub PR Manager Agent - Quick Start

## TL;DR

The GitHub PR Manager Agent is now **fully operational**! Here's how to get started in 3 steps:

## Step 1: Install Dependencies

```bash
# From repository root
npm install

# Install agent dependencies
cd agents/github-pr-manager
npm install
```

## Step 2: Configure Environment

```bash
# Copy environment template
cd agents/github-pr-manager
cp .env.example .env

# Edit .env and add your GitHub token
# Minimum required:
#   GITHUB_TOKEN=ghp_your_token_here
#   GITHUB_REPOSITORY=owner/repo
```

## Step 3: Start the Agent

```bash
# From agents/github-pr-manager directory
npm start
```

## ✅ Verify It's Working

```bash
# Check health status
curl http://localhost:3001/health

# Expected response:
# {
#   "status": "HEALTHY",
#   "uptime": "...",
#   "repo": "your/repo",
#   "circuit_breakers": {
#     "ai": {"state": "CLOSED"},
#     "github": {"state": "CLOSED"}
#   }
# }
```

## 📚 Full Documentation

- [SETUP_GUIDE.md](agents/github-pr-manager/SETUP_GUIDE.md) - Complete setup instructions
- [SYSTEM_VALIDATION_REPORT.md](SYSTEM_VALIDATION_REPORT.md) - System validation details
- [FIX_SUMMARY.md](FIX_SUMMARY.md) - All fixes and changes made

## 🎯 What the Agent Does

- ✅ Automated PR review and analysis
- ✅ Intelligent issue triage
- ✅ Risk assessment and labeling
- ✅ AI-powered code review (optional)
- ✅ Circuit breaker resilience
- ✅ Health monitoring and metrics
- ✅ Prometheus metrics export

## 🔧 Key Endpoints

- `GET /health` - Health check
- `GET /ready` - Readiness probe
- `GET /metrics` - Prometheus metrics
- `GET /status` - System status
- `POST /webhook` - GitHub webhook endpoint

## 💡 Pro Tips

1. **Development Mode:** Set `ENABLE_AI_ANALYSIS=false` to disable AI features during development
2. **Webhook Testing:** Use `/trigger/pr-review` endpoint to manually trigger PR reviews
3. **Monitoring:** Connect Prometheus to `/metrics` endpoint for observability
4. **Production:** Follow [PRODUCTION_GUIDE.md](agents/github-pr-manager/PRODUCTION_GUIDE.md) for production deployment

## 🆘 Troubleshooting

**Agent won't start?**
- Check Node.js version (need >= 18.0.0)
- Verify dependencies are installed
- Check `.env` file exists with required variables

**Can't connect to GitHub?**
- Verify `GITHUB_TOKEN` is valid and not expired
- Check token has `repo` permissions
- Ensure repository name format is `owner/repo`

**Circuit breaker is OPEN?**
- Check health of GitHub API or AI service
- Wait for automatic recovery (30-60 seconds)
- Review logs for error details

## 🎉 Success!

If you see this output when starting the agent:

```
✅ GitHub PR Manager with AI listening on port 3001
✅ Circuit Breaker initialized
✅ Health Monitor started
```

**You're all set!** The agent is running and ready to process webhooks.

---

Need help? Check the full [SETUP_GUIDE.md](agents/github-pr-manager/SETUP_GUIDE.md)
