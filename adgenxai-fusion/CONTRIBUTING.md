# Contributing to AdgenxAI Fusion v2

Thank you for helping improve AdgenxAI Fusion v2.  
These guidelines ensure consistent code quality, reliable orchestration, and smooth collaboration across the team.

---

## 1 – Development Setup

1. Clone the repository  
   ```
   git clone https://github.com/your-org/adgenxai-fusion.git
   cd adgenxai-fusion
   bash install.sh
   ```
2. Verify installation by running:  
   ```
   make rehearse
   ```
   This confirms that the local environment and orchestration scripts work correctly.  
3. Launch VS Code using the provided workspace configuration (.vscode folder).  

---

## 2 – Branch Workflow

- Main branch is protected and release‑ready.  
- Create feature branches from `develop`:
  ```
  git checkout -b feature/your-feature-name develop
  ```
- For bug fixes:
  ```
  git checkout -b fix/issue-description develop
  ```

Branch naming conventions:
- `feature/<name>` for enhancements  
- `fix/<name>` for patches  
- `docs/<name>` for documentation updates  
- `release/<version>` for pre‑release preparation  

---

## 3 – Coding Standards

- Follow PEP 8 for Python and ES Lint defaults for any JavaScript.  
- Keep functions small, modular, and documented with docstrings.  
- Use environment values (`.env`) for private credentials.  
- Avoid hard‑coding API keys or secrets.  
- Maintain consistent logging using the Fusion logger interface.  
- Test endpoint functionality with `fusion_api_tests.rest` or `fusion_api_tests.http` before committing.

---

## 4 – Commits and Messages

Use semantic commit keywords:

| Type | Purpose |
|-------|----------|
| feat: | New feature |
| fix: | Bug fix |
| docs: | Documentation update |
| chore: | Routine maintenance |
| style: | Formatting or lint changes |
| test: | Adding or updating tests |

Example:
```
feat: add new endpoint for voice prompt analytics
```

---

## 5 – Pull Requests

1. Ensure local tests are clean:  
   ```
   make rehearse
   ```
2. Update `CHANGELOG.md` with a brief description under the next version section.  
3. Run `bash bump_version.sh x.y.z` if applicable.  
4. Commit, push your branch, and open a pull request into `develop`.  
5. Include a short summary of changes and screenshots or logs if needed.  

All pull requests trigger an automatic rehearsal workflow in GitHub Actions for validation.

---

## 6 – Code Reviews and Approvals

- Every PR requires at least one review from another team member.  
- Resolve merge conflicts locally before final approval.  
- Link relevant tasks or Jira tickets in the PR description when applicable.

---

## 7 – Versioning Policy

- Follows Semantic Versioning (MAJOR.MINOR.PATCH).  
- Use `bash bump_version.sh` to handle tagging and changelog entries.  
- The `fusion_banner.sh` automatically displays the active tag and latest commit.

---

## 8 – Testing and Logs

- Local test: `make rehearse`  
- Container orchestration: `make docker-rehearse`  
- Check results in `./logs` or from CI Artifacts.  
- Clear logs anytime with `make reset`.

---

## 9 – Security and Secrets

- Never commit `.env` or any file containing keys.  
- Use `.env.example` to show structure only.  
- For CI use, set secrets under GitHub → Settings → Actions → Secrets.  

---

## 10 – Contributor Recognition

All verified contributions (features, docs, orchestration improvements) are listed in the internal Codex under:
`adgenxai_fusion_contributors`.

---

### Summary

- Clone → `bash install.sh`  
- Develop & test → `make rehearse`  
- Commit with semantic message  
- Submit PR → auto CI runs → review & merge  
  
Your contributions will help keep AdgenxAI Fusion stable, traceable, and elegant for every engineer using it.

---

© 2025 AdgenxAI Labs. Internal developer documentation.