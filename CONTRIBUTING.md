# Contributing to AdGenXAI

Thank you for your interest in contributing to AdGenXAI! We're building an AI-powered advertising automation platform with autonomous agent orchestration.

## 🌟 Quick Start

1. **Fork & Clone**: Fork the repo and clone your fork
2. **Install**: `npm install`
3. **Setup**: Copy `.env.example` to `.env.local` and add your API keys
4. **Dev**: `npm run dev` → http://localhost:3000
5. **Test**: `npm run test && npm run typecheck && npm run lint`

## 🤖 Autonomous PR Workflow

AdGenXAI uses **autonomous agents** for code review and implementation. Here's how it works:

### For Contributors

1. **Create Issue** using our templates:
   - 🐛 [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) - Report bugs
   - ✨ [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) - Suggest features
   - 🤖 [Agent Task](.github/ISSUE_TEMPLATE/agent_task.md) - Agent-executable tasks

2. **Create Branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Changes** following our guidelines (see below)

4. **Test Thoroughly**:
   ```bash
   npm run lint        # ESLint + Prettier
   npm run typecheck   # TypeScript validation
   npm run test        # Vitest unit tests
   npm run build       # Production build test
   ```

5. **Create PR** using our [PR template](.github/pull_request_template.md)

6. **Agent Review**: @copilot will automatically:
   - Review code for security, patterns, and quality
   - Run CodeQL security scanning
   - Suggest improvements
   - Auto-approve simple fixes (<100 LOC)

### For Agents

See [Agent Task Template](.github/ISSUE_TEMPLATE/agent_task.md) for autonomous task execution.

**Agent Constraints**:
- ✅ <400 LOC changes (agent-manageable)
- ✅ Well-scoped, clear requirements
- ❌ >400 LOC (requires human breakdown)
- ❌ Architecture changes (requires human review)
- ❌ Breaking changes (requires human approval)

## 📋 Contribution Guidelines

### Code Style

We follow strict code quality standards:

**TypeScript**:
- Strict mode enabled (`tsconfig.json`)
- No `any` types without justification
- Explicit return types for functions
- Proper error handling

**ESLint**:
- All rules must pass
- Run `npm run lint:fix` to auto-fix
- No console.log in production code (use proper logging)

**Formatting**:
- Prettier configured in `.prettierrc`
- Run on save or `npm run format`
- 2-space indentation
- Single quotes for strings

### Architecture Patterns

Follow the **Sensory Cortex** architecture:

**Frontend** (Next.js App Router):
```
app/
├── dashboard/        # Creator dashboard pages
├── api/             # API routes (webhooks)
└── lib/             # Utilities & providers
```

**Key Patterns**:

1. **Provider Selection**: Always use intelligent routing
   ```typescript
   import { selectProvider } from "@/lib/providers/provider-selector";
   const provider = await selectProvider({ mode: "preview", quality: "balanced" });
   ```

2. **Cache-First**: Reduce AI costs
   ```typescript
   import { getCachedResponse, setCachedResponse } from "@/lib/cache/cache-adapter";
   const cached = await getCachedResponse(hash);
   if (!cached) {
     const result = await aiProvider.generate(prompt);
     await setCachedResponse(hash, result, ttl);
   }
   ```

3. **GitHub Automation**: Use resilient PR manager
   ```typescript
   import { GitHubPRManager } from "@/agents/github-pr-manager";
   const prManager = new GitHubPRManager();
   await prManager.processWithCircuitBreaker(webhook);
   ```

4. **BeeHive Rituals**: Agent learning framework
   - **Badge**: Authentication & permissions
   - **Metrics**: Performance monitoring
   - **Echo**: Pattern learning
   - **History**: Memory & context

### UI/UX Standards

**Aurora Theme**:
- Use Tailwind classes from `tailwind.config.ts`
- Gradient buttons: `bg-gradient-to-r from-purple-500 to-blue-500`
- Animations: Framer Motion for smooth transitions
- Dark mode: All components must support it
- Mobile-first: Responsive design required

**Accessibility**:
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast WCAG AA minimum

### Testing

**Unit Tests** (Vitest):
```typescript
// app/lib/__tests__/example.test.ts
import { describe, it, expect } from 'vitest';

describe('MyComponent', () => {
  it('should render correctly', () => {
    // Test implementation
  });
});
```

**Integration Tests**:
- Test API routes with mock providers
- Test database operations (when available)
- Test authentication flows (when available)

**Coverage**:
- Aim for >80% coverage on new code
- Critical paths must be tested

### Security

**Required Checks**:
- [ ] No hardcoded API keys (use `.env.local`)
- [ ] Input validation on all API routes
- [ ] Webhook signature validation
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS prevention (sanitize user input)
- [ ] CSRF tokens where needed
- [ ] RLS policies enforced (Supabase)

**Secret Management**:
```bash
# .env.local (NEVER commit)
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=eyJ...
```

**CodeQL**: Runs automatically on PRs

### Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(scope): add new feature
fix(scope): fix bug
docs(scope): update documentation
style(scope): formatting changes
refactor(scope): code refactoring
test(scope): add/update tests
chore(scope): maintenance tasks
ci(scope): CI/CD changes
```

**Scopes**:
- `dashboard` - Creator dashboard
- `api` - API routes
- `agents` - Agent orchestration
- `providers` - AI provider integration
- `auth` - Authentication
- `db` - Database
- `ui` - UI components
- `docs` - Documentation

**Examples**:
```bash
git commit -m "feat(dashboard): add agent performance chart"
git commit -m "fix(api): handle OpenAI rate limits"
git commit -m "docs(readme): update setup instructions"
```

### Pull Request Process

1. **Update Documentation**: If you change functionality
2. **Update Tests**: Add/update tests for changes
3. **Update CHANGELOG**: Add entry under "Unreleased"
4. **Fill PR Template**: Complete all sections
5. **Link Issues**: Reference related issues (#123)
6. **Request Review**: Tag @copilot for agent review
7. **Address Feedback**: Respond to review comments
8. **Squash Commits**: Keep history clean

**PR Checklist** (from template):
- [ ] ESLint clean & TS strict pass
- [ ] Tests added/updated
- [ ] Docs updated
- [ ] No secrets
- [ ] Aurora theme maintained
- [ ] Works with BEE-SHIP deploy
- [ ] Sensory Cortex patterns followed

### Branch Strategy

```
main                    # Production-ready code
├── feature/*          # New features
├── fix/*              # Bug fixes
├── refactor/*         # Code refactoring
├── docs/*             # Documentation updates
└── agent/*            # Agent-generated changes
```

**Branch Naming**:
- `feature/add-sora-video-generation`
- `fix/chat-streaming-timeout`
- `refactor/provider-selection-logic`
- `docs/update-api-reference`
- `agent/pr-3-provider-integration`

## 🎯 Project Roadmap

### Phase 1: MVP ✅ Complete
- Core platform with AI content generation
- Creator dashboard (8 pages)
- BeeHive Rituals framework
- Comprehensive documentation

### Phase 2: Real Integration 🚀 In Progress
- **PR-1**: Supabase database connection
- **PR-3**: Real AI provider integration
- **PR-5**: Supabase authentication
- **PR-2**: CrewAI agent framework
- **PR-4**: Sora video generation

### Phase 3: Advanced Features 📋 Planned
- Social media publishing
- A/B testing framework
- Advanced analytics
- Pattern learning dashboard
- n8n workflow templates

See [GITHUB_ISSUE_TEMPLATE.md](GITHUB_ISSUE_TEMPLATE.md) for detailed PR breakdown.

## 📚 Documentation

**Essential Reading**:
- [README.md](README.md) - Project overview
- [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md) - Goals & features
- [docs/README.md](docs/README.md) - Documentation hub
- [PHASE2_README.md](PHASE2_README.md) - Autonomous workflow

**Deep Dives**:
- [docs/AGENT_FIRST_PHILOSOPHY.md](docs/AGENT_FIRST_PHILOSOPHY.md) - Architecture principles
- [docs/BEEHIVE_RITUALS.md](docs/BEEHIVE_RITUALS.md) - Agent learning framework
- [docs/CREATOR_DASHBOARD.md](docs/CREATOR_DASHBOARD.md) - Dashboard guide
- [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) - Database design
- [docs/PROVIDER_INTEGRATION.md](docs/PROVIDER_INTEGRATION.md) - AI providers

## 🐛 Reporting Issues

Use our issue templates:

**Bug Report**: Something's broken
- Include reproduction steps
- Attach error logs/screenshots
- Specify environment (browser, OS, deployment)

**Feature Request**: New capability
- Describe problem & solution
- Provide user story
- Estimate effort & priority

**Agent Task**: Autonomous work
- Clear requirements
- File scope (<400 LOC)
- Acceptance criteria

## 💬 Community & Support

- **Issues**: [GitHub Issues](https://github.com/brandonlacoste9-tech/adgenxai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/brandonlacoste9-tech/adgenxai/discussions)
- **Pull Requests**: [GitHub PRs](https://github.com/brandonlacoste9-tech/adgenxai/pulls)

## 🎖️ Recognition

Contributors are recognized in:
- `CONTRIBUTORS.md` (top contributors)
- Release notes (feature attributions)
- Documentation credits

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the MIT License.

See [LICENSE](LICENSE) for details.

## 🙏 Thank You

Every contribution helps make AdGenXAI better for creators worldwide. Whether it's code, documentation, bug reports, or feature ideas—we appreciate your support!

---

**Questions?** Open an issue or check [docs/README.md](docs/README.md)

**Ready to contribute?** Create an issue using our templates and let's build together! 🚀
