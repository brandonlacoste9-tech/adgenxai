---
name: Auto-Review Agent - Bulk Run Instructions
about: Instructions for running bulk auto-review on all open PRs and issues
title: 'How to Run Bulk Auto-Review Agent for ALL Open PRs and Issues'
labels: documentation, automation
assignees: ''
---

# Automation Agent Bulk Run Instructions

## 1. Trigger via Netlify (Recommended Configuration)

**All secrets are stored in Netlify (GitHub token etc.)**
- The agent code: `agents/github-pr-manager/src/auto-review-agent.ts`
- Netlify Function wrapper: `netlify/functions/auto-review-agent.ts`
- Production: [adgenxai.pro](https://www.adgenxai.pro)

### To trigger automation:

**Browser:**
Open in browser:
```
https://www.adgenxai.pro/.netlify/functions/auto-review-agent
```

**Terminal:**
```bash
curl -X POST https://www.adgenxai.pro/.netlify/functions/auto-review-agent
```

This triggers review + auto-fix on ALL open PRs/issues in both repos (`adgenxai` & `Beehive`).

---

## 2. Trigger from GitHub Actions (optional, scheduled or manual)

**Manual Trigger:**
1. Go to: https://github.com/brandonlacoste9-tech/adgenxai/actions/workflows/auto-review-agent.yml
2. Click "Run workflow"
3. Optionally provide a reason
4. Click "Run workflow" button

**Add to other workflows:**
```yaml
  - name: Run Netlify Bulk Auto Agent
    run: curl -X POST https://www.adgenxai.pro/.netlify/functions/auto-review-agent
```

---

## Agent Overview

- Reviews every open pull request and issue in both target repos
- Places comments, auto-fixes, and creates PRs as per current logic
- Output is visible in GitHub threads, issue comments, and (if configured) Beehive logs

---

## Monitoring

Check the following after running:

- [adgenxai open PRs](https://github.com/brandonlacoste9-tech/adgenxai/pulls?state=open)
- [adgenxai open issues](https://github.com/brandonlacoste9-tech/adgenxai/issues?state=open)
- [Beehive open PRs](https://github.com/brandonlacoste9-tech/Beehive/pulls?state=open)
- [Beehive open issues](https://github.com/brandonlacoste9-tech/Beehive/issues?state=open)

Re-run as needed for continuous review/fix cycles.

---

Say **"ready"** after triggering, and support/triage can proceed!

For more details, see: [`docs/AUTO_REVIEW_AGENT.md`](../../docs/AUTO_REVIEW_AGENT.md)
