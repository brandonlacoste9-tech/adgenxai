# Branch Protection Configuration Guide

## Overview
This guide helps you configure branch protection rules for the AdGenXAI repository to ensure code quality and prevent direct pushes to protected branches.

## 🛡️ Main Branch Protection

### Quick Setup Steps

1. **Navigate to Settings**
   - Go to your repository on GitHub
   - Click `Settings` → `Branches`
   - Click `Add branch protection rule`

2. **Branch Name Pattern**
   ```
   main
   ```

3. **Protection Settings**

#### Require Pull Request Reviews
```
☑ Require a pull request before merging
  ☑ Require approvals: 1
  ☑ Dismiss stale pull request approvals when new commits are pushed
  ☑ Require review from Code Owners (if CODEOWNERS exists)
```

#### Require Status Checks
```
☑ Require status checks to pass before merging
  ☑ Require branches to be up to date before merging
  
  Status checks to require:
  ☑ test
  ☑ lint (ESLint)
  ☑ format (Prettier)
  ☑ security (npm audit)
  ☑ CodeQL
```

#### Additional Settings
```
☑ Require conversation resolution before merging
☑ Require signed commits (recommended for production)
☐ Require linear history
☑ Include administrators (turn OFF to allow admin overrides)
☑ Allow force pushes: Specify who can force push (nobody recommended)
☑ Allow deletions: OFF
```

### YAML Configuration (via API)

If you prefer to use GitHub CLI or API:

```yaml
required_status_checks:
  strict: true
  checks:
    - context: "test"
    - context: "lint"
    - context: "format"
    - context: "security"
    - context: "CodeQL"

required_pull_request_reviews:
  required_approving_review_count: 1
  dismiss_stale_reviews: true
  require_code_owner_reviews: true

restrictions: null
enforce_admins: false
require_linear_history: false
allow_force_pushes: false
allow_deletions: false
required_conversation_resolution: true
```

## 🔄 Development Branch Protection (Optional)

For `develop` or `staging` branches:

### Settings
```
Branch name pattern: develop

☑ Require a pull request before merging
  ☑ Require approvals: 1
☑ Require status checks to pass before merging
  ☑ test
  ☑ lint
☐ Require conversation resolution (optional)
☐ Include administrators
```

## 🚨 Hotfix Process

When you need to bypass protection for urgent fixes:

1. **Option 1: Temporary Disable (Admin only)**
   - Disable branch protection
   - Push hotfix
   - Re-enable protection immediately

2. **Option 2: Emergency PR**
   - Create PR with `[HOTFIX]` tag
   - Request expedited review
   - Merge after required checks pass

3. **Option 3: Admin Override**
   - Use admin privileges to merge
   - Document reason in PR
   - Ensure post-merge review

## 📋 CODEOWNERS File

Create `.github/CODEOWNERS` to automatically request reviews:

```
# Default owners for everything
* @brandonlacoste9-tech

# Workflows
/.github/workflows/ @brandonlacoste9-tech

# Infrastructure
/netlify/ @brandonlacoste9-tech
/netlify.toml @brandonlacoste9-tech

# Documentation
/docs/ @brandonlacoste9-tech
*.md @brandonlacoste9-tech
```

## ✅ Verification

After setting up branch protection:

1. **Test PR Process**
   ```bash
   git checkout -b test-branch-protection
   echo "test" >> test.txt
   git add test.txt
   git commit -m "Test branch protection"
   git push origin test-branch-protection
   ```

2. **Try Direct Push** (should fail)
   ```bash
   git checkout main
   echo "test" >> test.txt
   git add test.txt
   git commit -m "Test direct push"
   git push origin main
   # Should see: "protected branch hook declined"
   ```

3. **Verify Status Checks**
   - Create a PR
   - Verify all status checks appear
   - Verify merge button is disabled until checks pass

## 🔧 Troubleshooting

### Status Checks Not Appearing
- Ensure workflows have run at least once
- Check workflow triggers include `pull_request`
- Verify workflow names match status check names

### Can't Merge Despite Passing Checks
- Verify branch is up to date with main
- Check if conversation resolution is required
- Ensure all required reviewers have approved

### Admin Can't Push
- Check "Include administrators" setting
- Verify you have admin permissions
- Consider temporarily disabling for hotfix

## 📚 Best Practices

1. **Always Use PRs**
   - Even for small changes
   - Enables code review and CI checks
   - Maintains audit trail

2. **Keep Checks Fast**
   - Optimize test suite
   - Use caching effectively
   - Run expensive checks async

3. **Review Requirements**
   - Small teams: 1 reviewer
   - Large teams: 2+ reviewers
   - Critical code: require code owner review

4. **Update Protection Rules**
   - Review quarterly
   - Add new status checks as needed
   - Remove deprecated checks

## 🎯 Next Steps

- [ ] Configure main branch protection
- [ ] Set up CODEOWNERS file
- [ ] Test protection with sample PR
- [ ] Document any team-specific rules
- [ ] Train team on PR process
- [ ] Configure notification settings

## 📞 Support

If you encounter issues:
1. Check [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
2. Review workflow logs in Actions tab
3. Test with a simple PR first
4. Contact repository admin for access issues
