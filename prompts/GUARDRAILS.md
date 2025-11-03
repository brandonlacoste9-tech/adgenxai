# Security Guardrails for Copilot & VS Code

## 1. No Secrets in Code

- Never commit API keys, credentials, or secrets.
- Use environment variables and `.env.example` for configuration.

## 2. Secure Coding Practices

- Validate all user input.
- Use parameterized queries for database access.
- Sanitize outputs and escape HTML where needed.

## 3. Code Review & CI

- All PRs require review and must pass security CI (Gitleaks, CodeQL, npm audit).
- Use Copilot Chat to explain code and check for vulnerabilities.

## 4. Dependency Management

- Keep dependencies up to date with Dependabot.
- Review all dependency changes for security impact.

## 5. AI Usage

- Do not blindly accept Copilot suggestions—review for security and correctness.
- Use Copilot Chat to ask for security best practices and code explanations.

## 6. Reporting Issues

- Report security issues immediately to the DevOps lead.
- Use GitHub issues for non-critical guardrail improvements.
