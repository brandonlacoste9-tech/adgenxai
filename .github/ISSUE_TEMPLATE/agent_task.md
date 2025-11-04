---
name: Agent Task
about: Autonomous agent task for code changes, refactoring, or automation
title: '[AGENT] '
labels: ['agent-task', 'automation']
assignees: ''
---

## Task Description
<!-- Clear, actionable task description for autonomous agent -->

## Context
<!-- Why is this needed? What's the background? -->

## Scope
<!-- What files/systems are affected? -->

### Files to Modify
<!-- List specific files or patterns -->
- 
- 

### Files to Create
<!-- If creating new files -->
- 
- 

## Requirements
<!-- Specific requirements the agent must follow -->

### Functional Requirements
- [ ] 
- [ ] 

### Quality Requirements
- [ ] ESLint clean & TS strict pass
- [ ] Tests added/updated
- [ ] No breaking changes to existing APIs
- [ ] Aurora theme maintained (if UI changes)
- [ ] Mobile responsive (if UI changes)
- [ ] Performance acceptable (<100ms added latency)

### Security Requirements
- [ ] No secrets in code (use env vars)
- [ ] RLS enforced (if DB changes)
- [ ] Webhook validation (if adding webhooks)
- [ ] Auth checks (if protected routes)
- [ ] Input validation & sanitization

## Constraints
<!-- Important limitations -->

### LOC Constraint
- [ ] <100 LOC (simple fix)
- [ ] <400 LOC (agent-manageable)
- [ ] >400 LOC (requires human breakdown)

### Patterns to Follow
<!-- Reference existing patterns -->
- **Sensory Cortex**: Webhook-driven architecture
- **Provider Selection**: Use `lib/providers/provider-selector.ts`
- **Caching**: Cache-first with `lib/cache/cache-adapter.ts`
- **GitHub Integration**: Use `agents/github-pr-manager/`
- **BeeHive Rituals**: Badge → Metrics → Echo → History

### Do NOT
- [ ] Break existing tests
- [ ] Remove working code
- [ ] Add new dependencies without approval
- [ ] Change Aurora theme colors/spacing
- [ ] Bypass RLS policies
- [ ] Hardcode API keys or secrets

## Acceptance Criteria
<!-- How to verify success -->
- [ ] 
- [ ] 
- [ ] 

## Testing Strategy
<!-- How should this be tested? -->
- [ ] Unit tests pass (`npm run test`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Manual testing steps:
  1. 
  2. 

## Related Work
<!-- Links to PRs, issues, or documentation -->
- Related to PR: 
- Depends on: 
- Blocks: 
- Documentation: 

---

## Agent Instructions
<!-- Note: @copilot mentions are for documentation and human workflow. Agent assignment happens via GitHub's assignment features. -->

When assigned to this task, @copilot is authorized to:

1. **Analyze** the codebase and understand the task
2. **Plan** the minimal changes needed (<400 LOC total)
3. **Implement** following all requirements above
4. **Test** thoroughly (lint, typecheck, unit tests)
5. **Create PR** with:
   - Title: `[AGENT] <scope>: <description>`
   - Description: Links to this issue, changes made, testing done
   - Labels: `agent-task`, scope label (PR-1/PR-3/PR-5/dashboard/etc)

### Workflow
```bash
# 1. Create feature branch
git checkout -b agent/<task-name>

# 2. Make minimal changes
# ... edit files ...

# 3. Validate
npm run lint
npm run typecheck
npm run test

# 4. Commit with conventional commits
git commit -m "feat(scope): description"

# 5. Push and create PR
git push origin agent/<task-name>
```

### If Blocked
If you encounter:
- **Unclear requirements** → Request clarification in this issue
- **>400 LOC needed** → Break into subtasks and request approval
- **Test failures** → Only fix related tests, ignore unrelated failures
- **Security concerns** → Flag and request human review
- **Architecture questions** → Request human review

### Success Criteria
- [ ] All requirements met
- [ ] All tests passing
- [ ] Code reviewed by CodeQL
- [ ] PR created and linked to this issue
- [ ] Documentation updated (if needed)

---

## Human Review
<!-- For maintainer use -->
- [ ] Task approved for agent execution
- [ ] Requirements clear and complete
- [ ] Constraints appropriate
- [ ] Security implications reviewed
- [ ] Ready for agent handoff
