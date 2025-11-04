# GitHub Agent CLI Response Test

## Overview

This test suite verifies that the GitHub Agent CLI is working correctly and can automatically respond with comments and labels to issues.

## Test Coverage

The test suite includes the following test cases:

### 1. Health Check Endpoint
- ✅ Verifies the health endpoint returns a healthy status
- ✅ Confirms all required health fields are present (timestamp, uptime, version, project)

### 2. Root Endpoint
- ✅ Validates the root endpoint returns project information
- ✅ Ensures all API endpoints are properly documented

### 3. Webhook Endpoint Availability
- ✅ Tests webhook endpoint accessibility
- ✅ Confirms webhook events are processed correctly

### 4. Issue Event Processing
- ✅ Verifies issue webhooks are accepted
- ✅ Confirms issue events are processed successfully

### 5. Comment Response Generation
- ✅ Tests labeled issue processing
- ✅ Validates automation label recognition

### 6. Issue Comment Event Processing
- ✅ Confirms issue comment events are processed
- ✅ Validates comment event recognition

## Running the Tests

### Prerequisites
- Node.js 18+ installed
- Dependencies installed (`npm install`)

### Run the Test Suite

```bash
npm run test:agent-cli
```

## Test Results

### Latest Test Run

```
🧪 GitHub Agent CLI Test Summary
============================================================

📊 Results:
   Total Tests: 12
   ✅ Passed: 12
   ❌ Failed: 0
   Success Rate: 100.0%

🎉 All tests passed! GitHub Agent CLI is working correctly.
✅ The agent can respond to issues with comments and labels.
```

## How It Works

1. **Server Startup**: The test suite automatically starts the GitHub Agent server on port 3001
2. **Test Execution**: Runs 6 test suites with 12 individual test cases
3. **Webhook Simulation**: Sends simulated GitHub webhook events to test processing
4. **Validation**: Verifies responses and event handling
5. **Cleanup**: Automatically stops the server after tests complete

## Integration with GitHub Actions

The GitHub Agent CLI is integrated with the repository through the `.github/workflows/automated-issue-response.yml` workflow, which:

- Triggers on issue events (opened, labeled, assigned)
- Triggers on issue comment events (created)
- Deploys the GitHub Agent automatically
- Processes webhook events in real-time
- Generates automated responses for issues

## Expected Behavior

When the GitHub Agent CLI is working correctly:

1. **Health Monitoring**: The `/health` endpoint returns status information
2. **Webhook Processing**: The `/webhook` endpoint accepts and processes GitHub events
3. **Event Recognition**: The agent correctly identifies different event types (issues, issue_comment, etc.)
4. **Repository Tracking**: The agent tracks which repository events are coming from
5. **Action Processing**: The agent processes different actions (opened, labeled, created, etc.)

## Troubleshooting

### Server Won't Start
- Check if port 3001 is already in use
- Verify `dist/index.js` exists
- Run `node dist/index.js` manually to see error messages

### Tests Failing
- Ensure all dependencies are installed: `npm install`
- Check that the server starts successfully
- Review server logs for errors

### Webhook Events Not Processing
- Verify the webhook payload structure matches GitHub's format
- Check server logs for processing errors
- Ensure the event type is supported

## Files

- `tests/github-agent-cli-test.js` - Main test suite
- `dist/index.js` - GitHub Agent server
- `.github/workflows/automated-issue-response.yml` - GitHub Actions workflow

## Next Steps

To verify the GitHub Agent CLI in production:

1. Create a test issue in the repository
2. Label it with `automation` or `agents`
3. Observe the automated response
4. Check that labels are applied correctly

## Support

For issues or questions about the GitHub Agent CLI, please:
- Check the server logs
- Review the test output
- Consult the main README.md
- Open an issue in the repository
