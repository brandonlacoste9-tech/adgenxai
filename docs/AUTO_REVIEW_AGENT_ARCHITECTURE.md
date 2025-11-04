# Auto-Review Agent Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TRIGGER OPTIONS                              │
└─────────────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
    ┌────────────┐      ┌────────────┐      ┌────────────┐
    │   cURL     │      │  GitHub    │      │   Local    │
    │  Command   │      │  Actions   │      │   Test     │
    └────────────┘      └────────────┘      └────────────┘
           │                    │                    │
           └────────────────────┴────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│               Netlify Function: auto-review-agent                    │
│                                                                       │
│  /.netlify/functions/auto-review-agent                              │
│                                                                       │
│  • Validates environment (GITHUB_TOKEN)                             │
│  • Parses query parameters (dryRun, repos)                          │
│  • Calls core agent logic                                           │
│  • Returns JSON response                                            │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│            Core Agent: AutoReviewAgent Class                         │
│                                                                       │
│  agents/github-pr-manager/src/auto-review-agent.ts                  │
│                                                                       │
│  ┌─────────────────────────────────────────────────────┐           │
│  │  runBulkReview()                                     │           │
│  │    ├─ For each repository:                          │           │
│  │    │   ├─ reviewPullRequests()                      │           │
│  │    │   └─ reviewIssues()                            │           │
│  │    └─ Return summary                                │           │
│  └─────────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
           │                                          │
           ▼                                          ▼
┌──────────────────────────┐          ┌──────────────────────────┐
│   GitHub API (Octokit)   │          │   Analysis Engine         │
│                          │          │                          │
│  • List PRs              │          │  • analyzePR()           │
│  • List Issues           │          │    - Size check          │
│  • Get Files             │          │    - Security check      │
│  • Get Comments          │          │    - Tests check         │
│  • Add Labels            │          │    - Description check   │
│  • Post Comments         │          │                          │
│                          │          │  • analyzeIssue()        │
│                          │          │    - Type detection      │
│                          │          │    - Priority calc       │
│                          │          │    - Quality check       │
└──────────────────────────┘          └──────────────────────────┘
           │                                          │
           └──────────────────┬───────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         ACTIONS TAKEN                                │
│                                                                       │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐│
│  │  Add Labels     │    │ Post Comments   │    │ Skip if Recent  ││
│  │                 │    │                 │    │                 ││
│  │ • large-pr      │    │ • Review notes  │    │ • 24hr cooldown ││
│  │ • security      │    │ • Suggestions   │    │ • Already done  ││
│  │ • needs-tests   │    │ • Feedback      │    │                 ││
│  │ • auto-reviewed │    │                 │    │                 ││
│  └─────────────────┘    └─────────────────┘    └─────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      RESPONSE & LOGGING                              │
│                                                                       │
│  {                                                                   │
│    "success": true,                                                  │
│    "summary": {                                                      │
│      "prsReviewed": 12,                                             │
│      "issuesReviewed": 8,                                           │
│      "actionsTaken": 15,                                            │
│      "errorCount": 0,                                               │
│      "durationSeconds": "45.23"                                     │
│    }                                                                 │
│  }                                                                   │
│                                                                       │
│  + Netlify Logs                                                      │
│  + GitHub Audit Trail                                                │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **Trigger** → User/Workflow calls Netlify function
2. **Validate** → Check environment and parse parameters
3. **Fetch** → Get all open PRs and issues from repositories
4. **Analyze** → Run heuristics on each item
5. **Filter** → Skip recently reviewed items (24hr cooldown)
6. **Action** → Add labels and post comments (if not dry-run)
7. **Report** → Return summary with results and errors
8. **Log** → Record all actions for monitoring

## Repository Coverage

```
brandonlacoste9-tech/adgenxai
  ├─ Open PRs (max 50)
  │   ├─ Analyze each PR
  │   ├─ Add labels
  │   └─ Post comments
  │
  └─ Open Issues (max 50)
      ├─ Analyze each issue
      ├─ Add labels
      └─ Post comments

brandonlacoste9-tech/Beehive
  ├─ Open PRs (max 50)
  │   ├─ Analyze each PR
  │   ├─ Add labels
  │   └─ Post comments
  │
  └─ Open Issues (max 50)
      ├─ Analyze each issue
      ├─ Add labels
      └─ Post comments
```

## Safety Features

- ✅ **Read-Only by Default**: Only reads data from GitHub
- ✅ **Dry-Run Mode**: Test without making changes
- ✅ **Cooldown**: 24-hour period prevents spam
- ✅ **Rate Limits**: Configurable max items per repo
- ✅ **Error Handling**: Graceful failures, continues on errors
- ✅ **Audit Trail**: All actions logged

## Configuration Points

| Component | Configuration |
|-----------|--------------|
| Environment | `GITHUB_TOKEN` required |
| Query Params | `dryRun`, `repos` |
| Code Constants | `maxPRsPerRepo: 50`, `maxIssuesPerRepo: 50` |
| Cooldown | `24 hours` (hardcoded) |

## Integration Points

```
GitHub API (REST)
  ↕
Octokit Client
  ↕
Auto-Review Agent
  ↕
Netlify Functions
  ↕
HTTPS Endpoint
```

## Future Enhancements

- [ ] AI-powered analysis (GPT-4, GitHub Models)
- [ ] Scheduled runs (cron in GitHub Actions)
- [ ] Webhook integration (real-time)
- [ ] Custom label configuration
- [ ] Priority-based processing
- [ ] Multi-language support
- [ ] Advanced metrics dashboard
