# 🚀 GitHub Automation Quick Start Guide
**AdGenXAI Repository - Issue #110 Implementation**

---

## What Is This?

The AdGenXAI repository has a **GitHub automation infrastructure** designed to help manage issues, PRs, and code quality automatically using AI agents and GitHub Actions workflows.

This guide helps you understand what's automated and how to use it.

---

## ✅ What's Automated Right Now

### 1. **Continuous Integration (CI/CD)**
Every time you push code or open a PR:
- ✅ TypeScript type checking runs automatically
- ✅ Build verification ensures code compiles
- ✅ Unit tests run with coverage reports
- ✅ CodeQL security scanning checks for vulnerabilities

**You don't need to do anything** - these run automatically!

### 2. **Health Monitoring**
- ✅ **Cortex Observer** - Runs hourly, posts telemetry to Issue #110
- ✅ **Automation Health Monitor** - Runs every 6 hours, reports system status
- ✅ Both workflows verify everything is working

### 3. **Auto-Labeling**
When you open a PR that touches certain files:
- Changes to `lib/providers/` → Gets labeled `PR-3: Providers`
- Changes to `lib/db/` → Gets labeled `PR-1: Supabase`
- Changes to `lib/auth/` → Gets labeled `PR-5: Auth`
- And more!

**Labels help organize work automatically.**

### 4. **Issue Response System**
When you create an issue with `automation` or `agents` labels:
- ✅ GitHub Agent CLI deploys automatically
- ✅ Webhook processing starts
- ✅ Automated response posted to issue

---

## 🤖 How to Request Agent Help

### Option 1: Use the Agent Coordination Template

1. Go to GitHub Issues → **New Issue**
2. Select **"Agent Coordination Task"** template
3. Fill in:
   - What you need (PR review, security scan, etc.)
   - Priority level
   - Which agents to involve
4. Submit - agents will respond automatically!

### Option 2: Label Your Issue

Add these labels to any issue:
- `automation` - Triggers automated response
- `agents` - Involves agent system
- `coordination` - Multi-agent coordination needed

---

## 📊 Checking Automation Status

### View Overall Status
Read the latest report:
```bash
cat GITHUB_AUTOMATION_STATUS_REPORT.md
```

### Run Verification Locally
```bash
npm install
node scripts/verify-automation.js
```

You should see:
```
✅ All critical checks passed!
📊 Pass Rate: 100.0%
```

### Check Workflow Status
1. Go to GitHub Actions tab
2. Look for:
   - ✅ Green checkmarks = working
   - ❌ Red X = failed (check logs)

---

## 🔧 For Developers: Agent Framework

### Available Agent Types

| Agent | Purpose | Status |
|-------|---------|--------|
| **Security Agent** | Vulnerability scanning, security review | Framework ready |
| **Code Review Agent** | Code quality, maintainability | Framework ready |
| **Testing Agent** | Test coverage, test generation | Framework ready |
| **Documentation Agent** | Docs completeness, updates | Framework ready |
| **Performance Agent** | Performance impact analysis | Framework ready |
| **Deployment Agent** | Deployment readiness checks | Framework ready |

**Note:** Agent framework exists in `agents/github-pr-manager/` but is not deployed to production yet. You can run agents locally for testing.

### Run Agents Locally

```bash
# Install dependencies
cd agents/github-pr-manager
npm install

# Start agent server (if configured)
npm start

# Or test specific agent
node src/agents/security-agent.js
```

---

## 🎯 Common Tasks

### Task 1: Get My PR Reviewed
1. Open PR as normal
2. CI/CD runs automatically
3. Check results in PR checks section
4. For agent review, add comment: `/full-review`

### Task 2: Triage an Issue
1. Create issue with clear description
2. Add labels: `automation`, `agents`
3. Automated response will post within minutes
4. Agent will suggest priority, labels, and next steps

### Task 3: Check Security
1. Security scan runs automatically on PRs
2. For manual scan: Go to Actions → CodeQL → Run workflow
3. Results appear in Security tab

### Task 4: Monitor Health
1. Check Issue #110 for latest telemetry
2. Health reports posted every 6 hours
3. Cortex status posted every hour

---

## 📖 Documentation Links

| Document | Purpose |
|----------|---------|
| [Automation Status Report](GITHUB_AUTOMATION_STATUS_REPORT.md) | Complete implementation analysis |
| [Agent Quick Reference](GITHUB_AGENT_QUICK_REF.md) | Quick commands reference |
| [Installation Guide](GITHUB_AGENT_INSTALLATION_PLAN.md) | Detailed installation steps |
| [Agent Orchestration](docs/AGENT_ORCHESTRATION.md) | Multi-agent architecture |
| [Copilot Agent README](.github/COPILOT_AGENT_README.md) | Copilot integration guide |

---

## ⚡ Quick Reference Commands

### Check Automation
```bash
# Verify all components
node scripts/verify-automation.js

# Check workflows
ls .github/workflows/

# Check agent framework
ls agents/github-pr-manager/
```

### Agent Operations (when deployed)
```bash
# Deploy agent platform
npm run agent:deploy

# Check health
npm run agent:health

# View status
npm run agent:status

# Monitor continuously
npm run agent:monitor
```

### Development
```bash
# Type check
npm run typecheck

# Build
npm run build

# Run tests
npm run test
```

---

## 🐛 Troubleshooting

### Workflow Not Running?
1. Check workflow file syntax (YAML validation)
2. Verify triggers are correct (on: push, etc.)
3. Check GitHub Actions tab for errors

### Agent Not Responding?
1. Verify labels are correct (`automation`, `agents`)
2. Check workflow run logs in Actions tab
3. Ensure Issue #110 is still open (agents post there)

### CI/CD Failing?
1. Run locally: `npm run typecheck && npm run build`
2. Fix any errors shown
3. Push again - CI will re-run

---

## 🎓 Learning More

### For Users
- Just use GitHub normally!
- Add `automation` label when you want agent help
- Check Issue #110 for system status

### For Developers
- Read `GITHUB_AUTOMATION_STATUS_REPORT.md` for deep dive
- Explore `agents/github-pr-manager/` for agent code
- Check `.github/workflows/` for automation workflows

### For Maintainers
- Review agent deployment status
- Monitor health reports in Issue #110
- Use verification script regularly

---

## 📞 Getting Help

**Found a problem?**
1. Create issue with `automation` label
2. Describe what's not working
3. Agents will analyze and respond

**Want to improve automation?**
1. Read implementation status in `GITHUB_AUTOMATION_STATUS_REPORT.md`
2. Check "What's Missing" section
3. Submit PR with improvements!

**Questions about agents?**
- Check `agents/README.md`
- Review `docs/AGENT_ORCHESTRATION.md`
- Ask in Issue #110

---

## 🎉 Current Status

**Overall:** ✅ Automation Foundation Complete
- 7 active workflows
- 6 agent types defined
- 100% verification pass rate
- Comprehensive documentation
- Ready for expansion

**What's Live:**
- CI/CD pipeline ✅
- Security scanning ✅
- Auto-labeling ✅
- Health monitoring ✅
- Issue response system ✅

**What's Next:**
- Deploy agents to production 🔄
- Automated PR merge queue 🔄
- Real-time metrics dashboard 🔄
- Predictive analytics 🔄

---

**Last Updated:** 2025-11-04  
**Issue Reference:** #110  
**Status:** ✅ Active & Operational

Happy automating! 🤖✨
