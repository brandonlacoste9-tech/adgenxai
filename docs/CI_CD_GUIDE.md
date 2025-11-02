# CI/CD Pipeline Documentation

## Overview
AdGenXAI uses GitHub Actions for continuous integration and deployment. This document outlines the automated workflows and best practices.

## 🔄 Workflows

### 1. Test Suite (`test.yml`)
**Triggers:** All pushes and pull requests

**Steps:**
- Checkout code
- Install dependencies with caching
- Run TypeScript type checking
- Execute Vitest test suite with coverage
- Upload coverage reports

**Environment:**
- Node.js: 20.x
- Package Manager: npm

### 2. Code Quality (`quality.yml`)
**Triggers:** PRs and pushes to main

**Jobs:**
- **ESLint:** Code quality and style enforcement
- **Prettier:** Code formatting verification
- **Security Audit:** npm audit for vulnerabilities
- **Bundle Size:** Track and report bundle sizes

### 3. Deploy to Netlify (`deploy.yml`)
**Triggers:** PRs and pushes to main

**Flow:**
1. Run type checking
2. Execute tests
3. Build production bundle
4. Deploy to Netlify (production or preview)
5. Upload build artifacts
6. Status reporting

**Environments:**
- `production`: Deploys from main branch
- `preview`: Deploys from pull requests

**Rollback:** Automatic notification on failure with rollback instructions

### 4. Lighthouse CI (`lighthouse.yml`)
**Triggers:** PRs and pushes to main

**Metrics:**
- Performance: Target 80%+
- Accessibility: Target 90%+
- Best Practices: Target 90%+
- SEO: Target 90%+

### 5. CodeQL Analysis (`codeql.yml`)
**Triggers:** PRs to main, pushes to main, weekly schedule

**Languages:** JavaScript/TypeScript, GitHub Actions

**Security:** Analyzes code for security vulnerabilities

### 6. Dependabot (`dependabot.yml`)
**Schedule:** Weekly

**Ecosystems:**
- npm packages
- GitHub Actions

## 🔒 Required Secrets

Configure these in GitHub repository settings → Secrets and variables → Actions:

```
NETLIFY_AUTH_TOKEN    # Netlify authentication token
NETLIFY_SITE_ID       # Netlify site identifier
```

### Getting Netlify Credentials:
1. Go to https://app.netlify.com/user/applications
2. Create a new personal access token
3. Copy the token to `NETLIFY_AUTH_TOKEN`
4. Find your site ID in Netlify site settings
5. Copy the site ID to `NETLIFY_SITE_ID`

## 🛡️ Branch Protection

### Recommended Settings for `main` branch:

```yaml
Require pull request reviews: 1 reviewer
Require status checks to pass:
  - test
  - lint
  - format
  - build
Require branches to be up to date: true
Require conversation resolution: true
Require signed commits: false (recommended true for production)
Include administrators: false
```

### Enable via GitHub Settings:
1. Go to Settings → Branches
2. Add branch protection rule for `main`
3. Enable the settings above

## 📊 Quality Gates

### Test Coverage
- Minimum coverage tracked via Vitest
- Coverage reports uploaded to artifacts
- Configure thresholds in `vitest.config.ts`

### Code Quality
- ESLint must pass (no errors)
- Prettier formatting enforced
- TypeScript strict mode enabled

### Security
- npm audit runs on every PR
- CodeQL scans weekly + on PRs
- Dependabot updates dependencies weekly

### Performance
- Lighthouse CI tracks performance metrics
- Bundle size analysis on every build
- Reports added to PR comments

## 🚀 Deployment Flow

### Pull Request Flow:
```
PR Created → Tests Run → Quality Checks → Preview Deploy
                                              ↓
                                    Preview URL in PR comment
```

### Main Branch Flow:
```
Merge to main → Tests → Quality → Build → Production Deploy
                                              ↓
                                    Live on Netlify
```

## 📝 Local Development Commands

```bash
# Install dependencies
npm ci

# Run tests
npm test
npm run test:watch
npm run test:ci

# Type checking
npm run typecheck

# Linting & Formatting
npm run lint
npm run lint:fix
npm run format
npm run format:check

# Build
npm run build

# Deploy
npm run deploy
```

## 🐛 Troubleshooting

### Tests Failing
1. Check test logs in GitHub Actions
2. Run tests locally: `npm test`
3. Check for missing dependencies: `npm ci`

### Build Failing
1. Verify TypeScript errors: `npm run typecheck`
2. Check build logs in Actions
3. Test build locally: `npm run build`

### Deployment Failing
1. Verify `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` are set
2. Check Netlify build logs
3. Verify `netlify.toml` configuration

### Coverage Not Uploading
1. Ensure tests complete successfully
2. Check coverage files are generated: `coverage/` directory
3. Verify artifact upload step in workflow

## 🔧 Customization

### Adding New Workflows
1. Create `.github/workflows/my-workflow.yml`
2. Define triggers and jobs
3. Test with a PR
4. Update this documentation

### Modifying Quality Gates
- **ESLint:** Edit `.eslintrc.json`
- **Prettier:** Edit `.prettierrc.json`
- **Coverage:** Edit `vitest.config.ts`
- **Lighthouse:** Edit `.lighthouserc.json`

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Netlify Deploy Documentation](https://docs.netlify.com/site-deploys/overview/)
- [Vitest CI Configuration](https://vitest.dev/guide/ci.html)
- [CodeQL Documentation](https://docs.github.com/en/code-security/code-scanning)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

## 🎯 Next Steps

- [ ] Configure branch protection rules
- [ ] Set up Netlify secrets in GitHub
- [ ] Enable status checks requirement
- [ ] Configure notification webhooks (Slack/Discord)
- [ ] Set up performance budgets
- [ ] Add custom quality gates as needed
