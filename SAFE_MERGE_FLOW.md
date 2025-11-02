# 🟢 Safe Minimal Merge Request Flow

Use these steps to safely merge a feature branch PR in your repository with the GitHub CLI.

---

## 1. Get PR Number for Your Branch

```
PR=$(gh pr list --head infra/dev-machine --json number --jq '.[0].number')
echo "PR=$PR"
```

---

## 2. Check CI Status Before Merge

```
gh pr view "$PR" --json statusCheckRollup -q '.statusCheckRollup.state'
```
- Only proceed if the output is `SUCCESS`.
- If `PENDING`, monitor until CI completes.
- If `FAILURE`, run `gh run list` or check the Actions tab for details.

---

## 3. Merge, Squash, and Delete Branch

```
gh pr merge "$PR" --squash --delete-branch --subject "feat(dev): Playwright+LLM agent, healthchecks & caching" --body "Merging infra/dev-machine"
```

---

## 4. (Optional) Enable Auto-Merge

```
gh pr edit "$PR" --add-label auto-merge
```
- Only use if your repo supports auto-merge by label.

---

## ⚠️ Safety Tips

- Never merge without green CI.
- Always verify the PR number and branch.
- Use auto-merge only for trusted, stable pipelines.

---

## Need Automation?

Let me know if you want these steps as:
- A ready-to-run shell script
- A reusable GitHub Actions workflow
- Or live monitoring/auto-merge support (just paste your PR number!)

---
