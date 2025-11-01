# PR Consolidation Quick Checklist

Use this checklist when executing the consolidation plan outlined in `PR_CONSOLIDATION_EXECUTION_PLAN.md`.

## Pre-Consolidation

- [x] All PRs have green Netlify deploy status
- [x] All PRs are mergeable (no conflicts)
- [x] Consolidation execution plan created
- [ ] Team notified of upcoming consolidation

## Execution Order

### 1. Merge PR #4 (Netlify Blobs upgrade)
```bash
# Verify PR status
gh pr view 4 --json mergeable,mergeStateStatus

# Merge PR
gh pr merge 4 --squash

# Validate
npm install
npm run build
npm test
```

### 2. Merge PR #7 (@types/node upgrade)
```bash
# Verify PR status
gh pr view 7 --json mergeable,mergeStateStatus

# Merge PR
gh pr merge 7 --squash

# Validate
npm install
npm run build
npm test
```

### 3. Merge PR #32 (CodeQL revert)
```bash
# Verify PR status
gh pr view 32 --json mergeable,mergeStateStatus

# Merge PR
gh pr merge 32 --squash

# Validate
git log --oneline -n 5
ls -la .github/workflows/
```

### 4. Merge PR #38 (Copilot instructions)
```bash
# Verify PR status
gh pr view 38 --json mergeable,mergeStateStatus

# Merge PR
gh pr merge 38 --squash

# Validate
cat .github/copilot-instructions.md
npm run build
```

## Post-Consolidation

- [ ] Run full integration tests
  ```bash
  npm run build
  npm run typecheck
  npm test
  ```

- [ ] Verify Netlify production deployment
  - Check https://app.netlify.com/sites/adgenxai/deploys
  - Verify application at https://adgenxai.pro

- [ ] Delete merged branches
  ```bash
  git branch -d copilot/setup-copilot-instructions
  git branch -d revert-31-brandonlacoste9-tech-patch-6
  git branch -d dependabot/npm_and_yarn/types/node-24.9.1
  git branch -d dependabot/npm_and_yarn/netlify/blobs-10.3.0
  ```

- [ ] Update documentation
  - [ ] Add entry to CHANGELOG.md (if exists)
  - [ ] Update README.md with new dependency versions
  - [ ] Mark Phase 2.1 complete in project roadmap

- [ ] Close related issues
  - [ ] Close issue #37 (Copilot instructions)

- [ ] Notify team of completion

## Rollback Procedure (If Needed)

If something goes wrong:

```bash
# Find the merge commit
git log --oneline --merges -n 10

# Revert the problematic merge
git revert -m 1 <merge-commit-sha>

# Push the revert
git push origin main

# Investigate the issue
# Fix in a new PR
# Re-attempt consolidation
```

## Success Criteria

✅ Consolidation is complete when:
- All 4 PRs merged to main
- No merge conflicts
- All builds passing
- Production deploy successful
- Branches cleaned up
- Documentation updated

## Next Phase

After successful consolidation, proceed with **Phase 2.2: Serverless Publishing Pipeline**

See `PR_CONSOLIDATION_EXECUTION_PLAN.md` for details on Phase 2.2 features and timeline.
