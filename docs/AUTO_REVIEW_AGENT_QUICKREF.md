# Auto-Review Agent - Quick Reference

## 🚀 Quick Start

### Run the Agent NOW

```bash
curl -X POST https://www.adgenxai.pro/.netlify/functions/auto-review-agent
```

## 📋 Common Commands

### Test in Dry-Run Mode
```bash
curl -X POST "https://www.adgenxai.pro/.netlify/functions/auto-review-agent?dryRun=true"
```

### Review Specific Repos
```bash
curl -X POST "https://www.adgenxai.pro/.netlify/functions/auto-review-agent?repos=adgenxai"
```

### Local Testing
```bash
export GITHUB_TOKEN=your_token_here
npm run test:auto-review
```

### GitHub Actions
1. Go to **Actions** tab
2. Select **Auto-Review Agent**
3. Click **Run workflow**

## 🎯 What It Does

- ✅ Reviews all open PRs and issues
- ✅ Adds smart labels automatically
- ✅ Posts helpful review comments
- ✅ Skips recently reviewed items
- ✅ Works across multiple repositories

## 📊 Expected Output

```json
{
  "success": true,
  "summary": {
    "prsReviewed": 12,
    "issuesReviewed": 8,
    "actionsTaken": 15,
    "errorCount": 0,
    "durationSeconds": "45.23"
  }
}
```

## 🏷️ Labels Added

**PRs:**
- `large-pr` / `medium-pr`
- `security-review-needed`
- `needs-tests`
- `needs-description`
- `breaking-change`
- `auto-reviewed`

**Issues:**
- `bug`
- `enhancement`
- `documentation`
- `urgent`
- `needs-more-info`
- `auto-reviewed`

## ⚙️ Configuration

**Environment Variables:**
- `GITHUB_TOKEN` or `GITHUB_PAT` - Required in Netlify

**Query Parameters:**
- `dryRun=true` - Test mode (no changes)
- `repos=repo1,repo2` - Specific repositories

## 🔍 Monitoring

- **Netlify Logs**: Check function execution logs
- **GitHub**: View comments on PRs/issues
- **Actions**: See workflow runs

## 📖 Full Documentation

See [docs/AUTO_REVIEW_AGENT.md](docs/AUTO_REVIEW_AGENT.md) for complete details.

## 🆘 Troubleshooting

**No comments appearing?**
- Check GITHUB_TOKEN is set
- Ensure token has repo access
- Verify dry-run mode is disabled

**Rate limit errors?**
- Wait a few minutes and retry
- Use dry-run mode to test

**Function timeout?**
- Reduce maxPRsPerRepo/maxIssuesPerRepo
- Run for specific repos only

## 💡 Tips

- Run in dry-run mode first to preview
- Check the 24-hour cooldown if items are skipped
- Use GitHub Actions for scheduled runs
- Monitor Netlify logs for detailed output

---

**Last Updated**: 2025-11-04
