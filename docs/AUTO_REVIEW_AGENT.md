# Auto-Review Agent

The Auto-Review Agent is an AI-powered automation system that automatically reviews all open PRs and issues across multiple GitHub repositories, provides intelligent analysis, and posts actionable feedback.

## Features

- 🔍 **Bulk Review**: Reviews all open PRs and issues in configured repositories
- 🤖 **AI-Powered Analysis**: Uses intelligent heuristics to analyze code changes and issue content
- 🏷️ **Automatic Labeling**: Adds appropriate labels based on analysis (e.g., `large-pr`, `security-review-needed`, `needs-tests`)
- 💬 **Review Comments**: Posts helpful review comments with actionable feedback
- 🧪 **Dry-Run Mode**: Test what would be done without making actual changes
- 📊 **Detailed Reporting**: Provides comprehensive summaries of actions taken

## Architecture

The Auto-Review Agent consists of three components:

1. **Core Agent** (`agents/github-pr-manager/src/auto-review-agent.ts`)
   - Main business logic for reviewing PRs and issues
   - Analyzes code changes, labels, and provides feedback
   - Integrates with GitHub API via Octokit

2. **Netlify Function** (`netlify/functions/auto-review-agent.ts`)
   - Serverless endpoint for triggering the agent
   - Accessible at: `https://www.adgenxai.pro/.netlify/functions/auto-review-agent`
   - Supports GET and POST requests

3. **GitHub Actions Workflow** (`.github/workflows/auto-review-agent.yml`)
   - Optional CI/CD integration
   - Can be manually triggered or scheduled
   - Calls the Netlify function endpoint

## Usage

### 1. Trigger via Netlify Function (Recommended)

**Simple POST request:**
```bash
curl -X POST https://www.adgenxai.pro/.netlify/functions/auto-review-agent
```

**With dry-run mode:**
```bash
curl -X POST "https://www.adgenxai.pro/.netlify/functions/auto-review-agent?dryRun=true"
```

**Custom repositories:**
```bash
curl -X POST "https://www.adgenxai.pro/.netlify/functions/auto-review-agent?repos=adgenxai,Beehive"
```

### 2. Trigger via GitHub Actions

1. Go to the **Actions** tab in your GitHub repository
2. Select **Auto-Review Agent** workflow
3. Click **Run workflow**
4. Choose options:
   - **Dry run mode**: Select `true` to preview actions without making changes
   - **Repositories**: Enter comma-separated list (default: `adgenxai,Beehive`)
5. Click **Run workflow**

### 3. Local Testing

**Prerequisites:**
- Node.js 18+
- GitHub Personal Access Token with repo permissions

**Run the test script:**
```bash
export GITHUB_TOKEN=your_github_token_here
node scripts/test-auto-review.js
```

This runs in dry-run mode by default and tests only the first 5 PRs/issues from each repository.

## Query Parameters

The Netlify function accepts the following query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `dryRun` | boolean | `false` | If `true`, only logs actions without making changes |
| `repos` | string | `adgenxai,Beehive` | Comma-separated list of repository names |

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "🤖 Auto-Review Agent completed successfully",
  "summary": {
    "prsReviewed": 12,
    "issuesReviewed": 8,
    "actionsTaken": 15,
    "errorCount": 0,
    "durationSeconds": "45.23",
    "repositories": [
      "brandonlacoste9-tech/adgenxai",
      "brandonlacoste9-tech/Beehive"
    ]
  },
  "details": {
    "results": [...],
    "errors": []
  },
  "dryRun": false,
  "timestamp": "2025-11-04T13:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Auto-review failed",
  "message": "Error message details",
  "durationSeconds": "5.12",
  "timestamp": "2025-11-04T13:00:00.000Z"
}
```

## What Gets Analyzed

### Pull Requests

The agent analyzes PRs for:

- **Size**: Large PRs (>1000 lines) get flagged
- **Security**: Files containing auth, security, secrets
- **Tests**: Missing tests for significant changes
- **Description**: Minimal or missing PR descriptions
- **Breaking Changes**: Detected from title or body

**Labels Added:**
- `large-pr` / `medium-pr`
- `security-review-needed`
- `needs-tests`
- `needs-description`
- `breaking-change`
- `auto-reviewed`

### Issues

The agent analyzes issues for:

- **Type**: Bug, feature request, or documentation
- **Priority**: Urgent, high, medium, or low
- **Description Quality**: Minimal descriptions flagged

**Labels Added:**
- `bug`
- `enhancement`
- `documentation`
- `urgent`
- `needs-more-info`
- `auto-reviewed`

## Environment Variables

Required environment variables (configured in Netlify):

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` or `GITHUB_PAT` | GitHub Personal Access Token with repo permissions |

## Security

- The agent only reads and comments on PRs/issues
- It does NOT merge PRs, close issues, or modify code
- All actions are logged for audit purposes
- Dry-run mode available for testing
- Reviews are skipped if the bot has reviewed within the last 24 hours

## Rate Limiting

The agent is designed to respect GitHub API rate limits:

- Maximum 50 PRs per repository per run
- Maximum 50 issues per repository per run
- Skips recently reviewed items (within 24 hours)
- Can be run multiple times safely

## Scheduling (Optional)

To run the agent on a schedule, uncomment the `schedule` section in `.github/workflows/auto-review-agent.yml`:

```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
```

## Monitoring

Check the agent's activity:

1. **GitHub Actions**: View workflow runs in the Actions tab
2. **Netlify Logs**: Check function logs in Netlify dashboard
3. **GitHub Comments**: Review comments posted by the agent on PRs/issues

## Troubleshooting

### Agent not posting comments

- Verify `GITHUB_TOKEN` has correct permissions
- Check that token has access to both repositories
- Ensure dry-run mode is disabled

### Rate limit errors

- Reduce `maxPRsPerRepo` and `maxIssuesPerRepo`
- Increase time between runs
- Use a different GitHub token

### TypeScript errors

- Run `npm install` to ensure all dependencies are installed
- Run `npm run typecheck` to verify TypeScript compilation

## Development

To modify the agent behavior:

1. Edit `agents/github-pr-manager/src/auto-review-agent.ts`
2. Test locally: `node scripts/test-auto-review.js`
3. Deploy changes via git push (Netlify auto-deploys)

## Support

For issues or questions:
- Open an issue in the repository
- Contact the maintainers
- Check the logs for detailed error messages
