---
name: Bug Report
about: Report a bug or unexpected behavior in AdGenXAI
title: '[BUG] '
labels: ['bug', 'needs-triage']
assignees: ''
---

## Bug Description
<!-- Clear description of what's broken -->

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior
<!-- What should happen -->

## Actual Behavior
<!-- What actually happens -->

## Environment
- **Browser/Platform**: 
- **AdGenXAI Version**: 
- **AI Provider**: (OpenAI / GitHub Models / Other)
- **Deployment**: (Local / Netlify)

## Error Messages & Logs
```
<!-- Paste any error messages or stack traces here -->
```

## Screenshots
<!-- If applicable, add screenshots to help explain the problem -->

## Additional Context
<!-- Any other context about the problem (recent changes, related issues, etc.) -->

## Impact
- [ ] Blocks development
- [ ] Affects production
- [ ] Security concern
- [ ] Data loss risk
- [ ] Performance issue

## Suggested Fix
<!-- Optional: If you have ideas on how to fix this -->

---

## Triage Checklist (for maintainers)
- [ ] Reproduced locally
- [ ] Labeled with scope (PR-1 | PR-3 | PR-5 | dashboard | agents | docs)
- [ ] Priority assigned (critical / high / medium / low)
- [ ] Security implications reviewed
- [ ] Assigned to milestone or agent

## Handoff to Agents
@copilot If this is a **code bug** with clear repro steps, please:
1. Reproduce the issue locally
2. Identify root cause using CodeQL/ESLint
3. Propose minimal fix
4. Run tests to verify
5. Create PR with fix if <400 LOC

If this requires design changes or affects multiple systems, request human review.
