# Auto-Review Agent - Bulk PR & Issue Review

This automation agent performs bulk review and auto-fix operations on ALL open PRs and issues in both the `brandonlacoste9-tech/adgenxai` and `brandonlacoste9-tech/Beehive` repositories.

## 🎯 Purpose

The Auto-Review Agent automates the review process for:
- ✅ All open Pull Requests
- ✅ All open Issues
- ✅ Both `adgenxai` and `Beehive` repositories

## 📁 Architecture

### Core Components

1. **Auto-Review Agent** (`agents/github-pr-manager/src/auto-review-agent.ts`)
   - Core logic for fetching and reviewing PRs/issues
   - Analyzes PR complexity and requirements
   - Posts automated review comments
   - Handles both repositories

2. **Netlify Function** (`netlify/functions/auto-review-agent.ts`)
   - Serverless function wrapper
   - Accessible at: `https://www.adgenxai.pro/.netlify/functions/auto-review-agent`
   - Uses GitHub token from Netlify environment variables
   - Returns detailed results with links

3. **GitHub Actions Workflow** (`.github/workflows/auto-review-agent.yml`)
   - Optional scheduled or manual trigger
   - Calls the Netlify function
   - Displays formatted results

## 🚀 Usage

### Method 1: Browser (Recommended for Quick Testing)

Simply open in your browser:
```
https://www.adgenxai.pro/.netlify/functions/auto-review-agent
```

### Method 2: Command Line (Recommended for Automation)

```bash
curl -X POST https://www.adgenxai.pro/.netlify/functions/auto-review-agent
```

### Method 3: GitHub Actions (Scheduled or Manual)

**Manual Trigger:**
1. Go to: https://github.com/brandonlacoste9-tech/adgenxai/actions/workflows/auto-review-agent.yml
2. Click "Run workflow"
3. Optionally provide a reason
4. Click "Run workflow" button

**Scheduled Trigger (Optional):**
Uncomment the schedule section in `.github/workflows/auto-review-agent.yml`:
```yaml
schedule:
  - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

## 🔧 Configuration

### Required Environment Variables (Netlify)

Set these in your Netlify dashboard under **Site settings → Environment variables**:

- `GITHUB_TOKEN` or `GH_TOKEN`: GitHub Personal Access Token with permissions:
  - `repo` (full repository access)
  - `write:discussion` (for posting comments)

### Repository Configuration

The agent is configured to review these repositories (hardcoded in `auto-review-agent.ts`):
```typescript
repositories = [
  { owner: 'brandonlacoste9-tech', repo: 'adgenxai' },
  { owner: 'brandonlacoste9-tech', repo: 'Beehive' }
]
```

To add more repositories, edit the `repositories` array in `agents/github-pr-manager/src/auto-review-agent.ts`.

## 📊 What It Does

### For Pull Requests:
- ✅ Analyzes PR title, description, and labels
- ✅ Checks for conventional commit format
- ✅ Verifies PR has adequate description
- ✅ Posts automated review comments with suggestions
- ✅ Identifies draft PRs

### For Issues:
- ✅ Checks if issue has adequate description
- ✅ Identifies new issues that need triage
- ✅ Posts helpful comments when needed
- ✅ Tracks issues without comments

## 📈 Response Format

Success response example:
```json
{
  "success": true,
  "message": "Bulk auto-review completed",
  "summary": {
    "timestamp": "2025-11-04T13:00:00.000Z",
    "totalProcessed": 15,
    "successful": 14,
    "failed": 1,
    "repositories": [
      "brandonlacoste9-tech/adgenxai",
      "brandonlacoste9-tech/Beehive"
    ]
  },
  "results": [...],
  "nextSteps": [...],
  "links": {...}
}
```

## 🔍 Monitoring

After running the agent, check:

- [AdgenXAI Open PRs](https://github.com/brandonlacoste9-tech/adgenxai/pulls?state=open)
- [AdgenXAI Open Issues](https://github.com/brandonlacoste9-tech/adgenxai/issues?state=open)
- [Beehive Open PRs](https://github.com/brandonlacoste9-tech/Beehive/pulls?state=open)
- [Beehive Open Issues](https://github.com/brandonlacoste9-tech/Beehive/issues?state=open)

## ⚡ Rate Limiting

The agent includes built-in rate limiting:
- 1 second delay between each PR/issue review
- Respects GitHub API rate limits
- Processes items sequentially to avoid overwhelming the API

## 🔒 Security

- ✅ GitHub token stored securely in Netlify environment
- ✅ Token never exposed in code or logs
- ✅ Function can only be triggered via POST request
- ✅ All GitHub API calls use authentication

## 🐛 Troubleshooting

### Error: "GitHub token not configured"
- **Solution:** Set `GITHUB_TOKEN` or `GH_TOKEN` in Netlify environment variables

### Error: "Failed to fetch PRs/issues"
- **Solution:** Verify GitHub token has correct permissions (`repo`, `write:discussion`)

### Error: "Rate limit exceeded"
- **Solution:** Wait for rate limit to reset (typically 1 hour) or use a GitHub App token

### Empty results
- **Solution:** Check that repositories have open PRs/issues

## 📝 Development

### Local Testing

To test locally:

1. Set environment variable:
```bash
export GITHUB_TOKEN="your_token_here"
```

2. Run Netlify dev:
```bash
netlify dev
```

3. Trigger the function:
```bash
curl -X POST http://localhost:8888/.netlify/functions/auto-review-agent
```

### Extending the Agent

To add custom review logic, edit `agents/github-pr-manager/src/auto-review-agent.ts`:

- **`analyzePR()`**: Add more PR checks
- **`analyzeIssue()`**: Add more issue checks
- **`generateReviewComment()`**: Customize PR comments
- **`generateIssueComment()`**: Customize issue comments

## 📚 Related Documentation

- [GitHub REST API](https://docs.github.com/en/rest)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [GitHub Actions](https://docs.github.com/en/actions)

## 🎉 Ready!

Say "ready" after triggering, and support/triage can proceed!
