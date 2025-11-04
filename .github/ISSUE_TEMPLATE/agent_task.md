---
name: Agent Task
about: Request AI agent automation for code changes or improvements
title: '[AGENT] '
labels: ['automation', 'agents', 'needs-triage']
assignees: ''
---

## 🤖 Agent Task Description
<!-- What should the AI agent accomplish? -->

## 🎯 Task Objective
<!-- Clear, specific goal for the agent -->

## 📋 Requirements
<!-- Detailed requirements and acceptance criteria -->

### Must Have
- [ ] 
- [ ] 

### Nice to Have
- [ ] 
- [ ] 

## 🏗️ Architecture Context
<!-- Provide context about where this fits in the architecture -->

### Affected Components
- [ ] Next.js App Router (`app/`)
- [ ] Utilities (`lib/`)
- [ ] Agents (`agents/`)
- [ ] UI Components (`components/`)
- [ ] Netlify Functions (`netlify/functions/`)
- [ ] GitHub Actions (`.github/workflows/`)
- [ ] Documentation (`docs/`)

### Integration Points
- [ ] GitHub API
- [ ] AI Providers (OpenAI/GitHub Models)
- [ ] Netlify Blobs (cache)
- [ ] Supabase (database)
- [ ] BeeHive Agent Orchestration

## 📐 Agent Guidelines
<!-- Constraints and guidelines for the agent -->

### Code Constraints
- [ ] **Max LOC per PR**: < 400 lines
- [ ] **ESLint**: Must pass strict mode
- [ ] **TypeScript**: Strict type checking
- [ ] **Tests**: Required for new functionality
- [ ] **Security**: CodeQL must pass

### Design Patterns to Follow
- [ ] Provider selector pattern (`lib/providers/provider-selector.ts`)
- [ ] Cache-first strategy (Netlify Blobs)
- [ ] Circuit breaker pattern (resilient operations)
- [ ] Aurora theme consistency (Tailwind + Framer Motion)
- [ ] Agent-First philosophy principles

### Must Avoid
- [ ] ❌ Direct AI provider calls (use provider selector)
- [ ] ❌ Uncached expensive operations
- [ ] ❌ Breaking Aurora design system
- [ ] ❌ Hardcoded secrets/tokens/API keys
- [ ] ❌ GitHub API calls without circuit breakers

## 🔄 Workflow Integration
<!-- How should this integrate with automation workflows? -->

### Target Scope
- [ ] PR-1: Supabase Integration
- [ ] PR-3: Provider Enhancement
- [ ] PR-5: Auth & Security
- [ ] Independent task

### Stacked PR Strategy
- [ ] Single PR
- [ ] Stacked PRs (describe dependencies)

## 📝 Implementation Notes
<!-- Any specific implementation guidance -->

### Files to Modify
<!-- List expected files to change -->
- 
- 

### New Files to Create
<!-- List new files needed -->
- 
- 

### Examples/References
<!-- Link to similar implementations or examples -->
- 

## 🧪 Testing Strategy
<!-- How should this be tested? -->
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Manual testing steps:
  1. 
  2. 

## 📊 Success Criteria
<!-- How do we know the task is complete? -->
- [ ] All requirements met
- [ ] Tests passing (existing + new)
- [ ] ESLint clean
- [ ] TypeScript strict pass
- [ ] CodeQL security scan clean
- [ ] Documentation updated
- [ ] PR review approved

## 🔐 Security Checklist
<!-- Security requirements for agent -->
- [ ] No secrets in code (use env vars)
- [ ] RLS policies enforced (if DB changes)
- [ ] Auth checks on routes (if API changes)
- [ ] Webhook validation (if processing webhooks)
- [ ] Input sanitization
- [ ] Error handling doesn't leak sensitive data

## 🎨 Aurora Theme Compliance
<!-- For UI changes -->
- [ ] Uses Aurora colors (`#35E3FF`, `#7C4DFF`, `#FFD76A`)
- [ ] Mobile-first responsive design
- [ ] Framer Motion animations
- [ ] Accessibility (ARIA, keyboard nav)
- [ ] Command palette (⌘K) compatible

## 📚 Documentation Updates
<!-- What docs need to be updated? -->
- [ ] README.md
- [ ] CONTRIBUTING.md
- [ ] API documentation
- [ ] Component storybook
- [ ] Integration guides
- [ ] Code comments

## 🔄 BeeHive Ritual Integration
<!-- Which rituals should this integrate with? -->
- [ ] Badge Ritual (auth/permissions)
- [ ] Metrics Ritual (monitoring/analytics)
- [ ] Echo Ritual (pattern learning)
- [ ] History Ritual (memory/context)

## ⏱️ Estimated Scope
**Complexity**:
- [ ] 🟢 Simple (< 2 hours, < 100 LOC)
- [ ] 🟡 Moderate (2-4 hours, 100-300 LOC)
- [ ] 🔴 Complex (> 4 hours, 300-400 LOC)
- [ ] ⚫ Epic (needs breakdown into smaller tasks)

**If Epic**: Break down into subtasks below
1. 
2. 
3. 

## 🚀 Deployment Considerations
<!-- Deployment and rollback plan -->

### Pre-deployment Checks
- [ ] Netlify build preview successful
- [ ] All CI/CD checks pass
- [ ] No breaking changes to existing APIs
- [ ] Environment variables documented

### Rollback Plan
<!-- How to rollback if something goes wrong -->
- 

## 📞 Point of Contact
<!-- Who should the agent @ mention for questions? -->
- **Technical questions**: 
- **Business context**: 
- **Review approval**: 

---

## 🎯 Agent Invocation
<!-- Automatically triggers agent when labeled with 'automation' + 'agents' -->

**Agent Instructions**:
When processing this task:
1. Follow all constraints and guidelines above
2. Use provider selector for AI operations
3. Implement cache-first strategy
4. Include circuit breaker patterns
5. Maintain Aurora theme consistency
6. Run ESLint, TypeScript, and CodeQL checks
7. Update all relevant documentation
8. Create focused, testable PRs (< 400 LOC)

**Auto-triage**: This issue will be automatically triaged by GitHub Agent CLI when labeled appropriately.

---

**For faster agent response**: Add labels `automation`, `agents`, and relevant scope (`PR-1`, `PR-3`, `PR-5`)
