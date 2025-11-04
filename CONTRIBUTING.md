# Contributing to AdGenXAI

Thank you for your interest in contributing to AdGenXAI! This guide will help you understand our development workflow, automation systems, and contribution standards.

---

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/brandonlacoste9-tech/adgenxai.git
cd adgenxai
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build
npm run build
```

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Automation Workflow](#automation-workflow)
4. [Issue Templates](#issue-templates)
5. [Pull Request Process](#pull-request-process)
6. [Development Guidelines](#development-guidelines)
7. [Testing Requirements](#testing-requirements)
8. [Security Standards](#security-standards)
9. [Architecture Patterns](#architecture-patterns)
10. [Documentation](#documentation)

---

## 📜 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful, constructive, and collaborative in all interactions.

---

## 🎯 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: Latest version
- **GitHub CLI** (optional): For enhanced workflow automation

### Environment Setup

1. **Copy environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `GITHUB_TOKEN`: GitHub personal access token
   - `SUPABASE_URL`: Supabase project URL (if using database)
   - `SUPABASE_ANON_KEY`: Supabase anonymous key
   - `NETLIFY_AUTH_TOKEN`: Netlify authentication token

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run development server**:
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

---

## 🤖 Automation Workflow

AdGenXAI uses a sophisticated **autonomous PR/issue automation system** powered by AI agents. Understanding this workflow is key to effective contribution.

### GitHub Agent CLI

Our repository uses **GitHub Agent CLI** to automate:
- 🏷️ **Auto-labeling**: Issues and PRs are automatically labeled based on content
- 🔍 **Auto-triage**: Issues are categorized and prioritized
- 🤖 **Automated responses**: Agents provide context and guidance
- 📊 **Project tracking**: Work is automatically organized in GitHub Projects
- 🔄 **Stacked PRs**: Complex changes are broken into manageable pieces

### Workflow Triggers

Automation is triggered when:
1. **New Issue Created**: With specific labels (`automation`, `agents`)
2. **PR Opened**: Targeting `main` branch
3. **PR Labeled**: With scope labels (`PR-1`, `PR-3`, `PR-5`)
4. **Issue Comment**: Contains agent mentions or commands

### Agent Handoff

When you need AI assistance:
1. Label issue with `automation` + `agents`
2. Use the **Agent Task** template (see below)
3. Agents will automatically triage and respond
4. Complex tasks generate stacked PRs

See [PHASE2_README.md](PHASE2_README.md) for complete automation documentation.

---

## 📝 Issue Templates

We provide three standardized issue templates for optimal triage:

### 1. Bug Report (`.github/ISSUE_TEMPLATE/bug_report.md`)

Use this template to report bugs or unexpected behavior.

**When to use**:
- Application crashes or errors
- Unexpected behavior
- Performance issues
- UI/UX problems

**Key sections**:
- Bug description and location
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Impact assessment

### 2. Feature Request (`.github/ISSUE_TEMPLATE/feature_request.md`)

Use this template to propose new features or enhancements.

**When to use**:
- New functionality ideas
- Enhancement suggestions
- Architecture improvements
- Integration proposals

**Key sections**:
- Feature description
- Problem statement
- Proposed solution
- Architecture alignment
- Success metrics

### 3. Agent Task (`.github/ISSUE_TEMPLATE/agent_task.md`)

Use this template to request AI agent automation for code changes.

**When to use**:
- Automated code refactoring
- Repetitive tasks
- Pattern implementation
- Documentation generation
- Test creation

**Key sections**:
- Task objective
- Requirements and constraints
- Architecture context
- Agent guidelines
- Success criteria

**Agent Constraints**:
- Max 400 LOC per PR
- ESLint strict mode
- TypeScript strict type checking
- CodeQL security scan pass
- Tests required

---

## 🔄 Pull Request Process

### 1. Branch Naming Convention

```
<type>/<scope>-<description>

Types:
- feat/     : New features
- fix/      : Bug fixes
- docs/     : Documentation only
- refactor/ : Code refactoring
- test/     : Test additions/updates
- ci/       : CI/CD changes
- chore/    : Maintenance tasks

Examples:
- feat/provider-selection-enhancement
- fix/auth-token-validation
- docs/contributing-guide-update
```

### 2. Commit Message Format

We follow **Conventional Commits** specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Examples**:
```
feat(providers): add intelligent provider selection
fix(cache): resolve cache invalidation issue
docs(readme): update installation instructions
ci(workflows): add automated issue response
```

### 3. PR Template

When opening a PR, our template includes:

- **Summary**: What changed and why
- **Checklist**: ESLint, tests, docs, security
- **Phase-2 Integration**: Scoped labels and project linking
- **Risk & Rollback**: Impact assessment and rollback plan
- **Handoff to Agents**: Code review automation

### 4. Review Process

1. **Automated Checks** (< 5 minutes):
   - ✅ Linting (ESLint)
   - ✅ Type checking (TypeScript)
   - ✅ Tests (Vitest)
   - ✅ Build (Next.js)
   - ✅ Security (CodeQL)

2. **Agent Code Review** (< 10 minutes):
   - 🤖 Copilot reviews code
   - 🔍 Identifies issues
   - 💡 Suggests improvements

3. **Human Review**:
   - 👤 Maintainer approval
   - 💬 Discussion and iteration
   - ✅ Final approval

4. **Merge**:
   - Squash merge preferred
   - Automated deployment to Netlify
   - BEE-SHIP integration

### 5. Stacked PRs

For complex changes, agents create **stacked PRs**:

```
[stack] PR-3: Implement OpenAI streaming adapter
[stack] PR-1: Add Supabase RPC views
[stack] PR-5: Enforce RLS on API routes
```

Each stacked PR:
- < 400 LOC
- Single responsibility
- Independent tests
- Clear scope

---

## 💻 Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Follow `.eslintrc.json` configuration
- **Prettier**: Auto-formatting on save
- **Import Order**: Group by: external → internal → relative

### Component Structure

```typescript
// components/MyComponent.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { MyComponentProps } from './types';

export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // Hooks
  const [state, setState] = useState();
  
  // Handlers
  const handleClick = () => {
    // Implementation
  };
  
  // Render
  return (
    <motion.div className="...">
      {/* Content */}
    </motion.div>
  );
}
```

### Provider Pattern

Always use the **provider selector** for AI operations:

```typescript
import { selectProvider } from '@/lib/providers/provider-selector';

// ✅ Correct
const provider = await selectProvider({ mode: 'preview', quality: 'balanced' });
const result = await provider.generate(prompt);

// ❌ Incorrect
const result = await openai.chat.completions.create(...);
```

### Cache-First Strategy

Leverage Netlify Blobs cache for cost reduction:

```typescript
import { getCachedResponse, setCachedResponse } from '@/lib/cache/cache-adapter';

const hash = generateCacheKey(params);
const cached = await getCachedResponse(hash);

if (cached) {
  return cached;
}

const result = await expensiveOperation();
await setCachedResponse(hash, result, ttl);
return result;
```

### Aurora Theme

Maintain design consistency:

- **Colors**: `#35E3FF`, `#7C4DFF`, `#FFD76A`
- **Animation**: Framer Motion
- **Responsiveness**: Mobile-first
- **Accessibility**: ARIA labels, keyboard navigation

---

## 🧪 Testing Requirements

### Test Coverage

All new features require tests:

```typescript
// __tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('handles user interaction', async () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test
npm test -- MyComponent.test.tsx
```

### Test Categories

1. **Unit Tests**: Individual functions/components
2. **Integration Tests**: Component interactions
3. **E2E Tests**: Full user workflows (Playwright)

---

## 🔐 Security Standards

### Required Practices

- ✅ **No secrets in code**: Use environment variables
- ✅ **Input validation**: Sanitize all user input
- ✅ **RLS enforcement**: Database-level security (Supabase)
- ✅ **Auth gates**: Protected routes and API endpoints
- ✅ **Webhook validation**: Verify GitHub webhook signatures
- ✅ **Error handling**: Don't leak sensitive data

### Security Checklist

Before submitting PR:

- [ ] No API keys, tokens, or secrets in code
- [ ] Environment variables documented in `.env.example`
- [ ] CodeQL security scan passes
- [ ] RLS policies enforced (if DB changes)
- [ ] Auth checks on protected routes
- [ ] Webhook signatures validated
- [ ] Input sanitization implemented
- [ ] Error messages don't expose internals

---

## 🏗️ Architecture Patterns

### Sensory Cortex Pattern

AdGenXAI uses **webhook-driven AI orchestration**:

```
GitHub Event → Netlify Function → Agent Processing → Response
```

### Agent-First Philosophy

Follow domain-specific agent patterns:

1. **Chief Agent**: Delegates to specialized agents
2. **Domain Agents**: Execute specific tasks
3. **Human-in-Loop**: Approval gates for critical operations

### BeeHive Rituals

Integrate with operational rituals:

- **Badge Ritual**: Authentication and authorization
- **Metrics Ritual**: Performance monitoring
- **Echo Ritual**: Pattern learning
- **History Ritual**: Memory and context

See [docs/AGENT_FIRST_PHILOSOPHY.md](docs/AGENT_FIRST_PHILOSOPHY.md) for details.

---

## 📚 Documentation

### Documentation Updates

Update docs when:
- Adding new features
- Changing APIs
- Modifying behavior
- Adding dependencies

### Documentation Structure

```
docs/
├── README.md                    # Master index
├── AGENT_FIRST_PHILOSOPHY.md   # Architecture principles
├── BEEHIVE_RITUALS.md          # Operational framework
├── CREATOR_DASHBOARD.md        # User guide
├── PROVIDER_INTEGRATION.md     # Provider patterns
└── DATABASE_SCHEMA.md          # Database structure
```

### Code Comments

- **When to comment**: Complex logic, non-obvious solutions, architectural decisions
- **When NOT to comment**: Self-explanatory code, variable declarations
- **Format**: JSDoc for public APIs

```typescript
/**
 * Selects optimal AI provider based on mode and quality requirements.
 * 
 * @param options - Provider selection options
 * @param options.mode - Operation mode ('preview' | 'production')
 * @param options.quality - Quality tier ('fast' | 'balanced' | 'quality')
 * @returns Selected provider instance
 * 
 * @example
 * const provider = await selectProvider({ mode: 'preview', quality: 'balanced' });
 */
export async function selectProvider(options: ProviderOptions): Promise<AIProvider> {
  // Implementation
}
```

---

## 🎯 Project Scopes

Current development is organized into scopes:

- **PR-1**: Supabase Integration (database, real-time)
- **PR-3**: Provider Enhancement (OpenAI, GitHub Models)
- **PR-5**: Auth & Security (Supabase Auth, RLS)

Label your PRs with relevant scope for auto-organization.

---

## 🚀 Deployment

### BEE-SHIP Deployment

AdGenXAI uses **BEE-SHIP** automated deployment:

```bash
# Full deployment
./SHIP_IT_NOW_COMPLETE.bat   # Windows
./SHIP_BEE_SWARM_NOW.bat     # Windows (swarm mode)
```

### Netlify Deployment

- **Automatic**: Merges to `main` auto-deploy
- **Preview**: All PRs get preview deployment
- **Rollback**: Use Netlify dashboard or `rollback` API

---

## 🤝 Getting Help

### Resources

- **Documentation**: [docs/README.md](docs/README.md)
- **Quick Start**: [PHASE2_QUICKSTART.md](PHASE2_QUICKSTART.md)
- **Setup Guide**: [PHASE2_SETUP_GUIDE.md](PHASE2_SETUP_GUIDE.md)
- **Project Requirements**: [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md)

### Community

- **Issues**: Use issue templates for bug reports or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Agent Tasks**: Use Agent Task template for automation help

### Contact

For urgent issues or security concerns, contact maintainers directly via GitHub.

---

## 📄 License

By contributing to AdGenXAI, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Acknowledgments

Thank you for contributing to AdGenXAI! Your efforts help build a better AI-powered platform for content creators worldwide.

---

**Last Updated**: November 4, 2024

> 🤖 This guide is maintained by both humans and AI agents. For automation guidelines, see [.github/copilot-instructions.md](.github/copilot-instructions.md).
