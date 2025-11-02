# AdgenxAI Fusion v2 Developer Guide

Welcome to the AdgenxAI Fusion Developer Suite.  
This quick guide explains how to work efficiently within VS Code or any compatible IDE to install, run, rehearse, and manage your environment.

---

## 1 – Initial Setup

1. Clone the repository  
   ```
   git clone https://github.com/your-org/adgenxai-fusion.git
   cd adgenxai-fusion
   ```
2. Run the installer  
   ```
   bash install.sh
   ```
3. Fill in required keys inside `.env`:  
   ```
   GOOGLE_API_KEY=your_gemini_key
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
   ```

When setup finishes, the Fusion banner displays environment details, commands, and the current git tag.

---

## 2 – Using VS Code Tasks

Press **Shift + Alt + T** (or open Command Palette → Run Task).  
Choose one of the predefined tasks:

| Task | Description |
|------|-------------|
| Install Environment | Runs complete dependency setup |
| Run Local Server | Starts FastAPI dashboard |
| Rehearse (local) | Full orchestration rehearsal on host |
| Docker Rehearsal | Executes the containerized rehearsal |
| Reset / Cleanup | Calls uninstall script; removes venv, logs, containers |
| Run Endpoint Tests | Runs CLI validation of all endpoints |
| Bump Version | Prompts for version number and updates metadata |

You can monitor console output directly inside VS Code.

---

## 3 – VS Code Launch Configurations

Open the **Run and Debug** panel (Ctrl + Shift + D).  
Available profiles:

- **Run Server** – Launches FastAPI directly (loads `.env`).  
- **Rehearse (local)** – Executes `rehearse.sh dev`.  
- **Docker Rehearsal** – Calls `make docker-rehearse`.  
- **Cleanup / Reset** – Removes environment safely.  
- **Run Tests** – Executes endpoint verification script.

---

## 4 – Recommended Extensions

VS Code automatically suggests these, but you can install manually:

- Python (ms-python.python)  
- Docker (ms-azuretools.vscode-docker)  
- REST Client (humao.rest-client)  
- Git Extension Pack (donjayamanne.git-extension-pack)

---

## 5 – Common Commands

| Action | Command |
|--------|----------|
| Run app manually | `python app.py` |
| Makefile orchestration | `make rehearse` |
| Dockerized rehearsal | `make docker-rehearse` |
| Cleanup environment | `make reset` |
| Update version | `bash bump_version.sh 2.1.0` |
| View changelog | `cat CHANGELOG.md` |

---

## 6 – Developer Workflow

1. **Pull latest main branch**  
2. **Run `make rehearse`** to verify integration  
3. **Use `fusion_api_tests.rest`** to test endpoints interactively  
4. **Commit and push changes**; CI pipeline runs rehearsal automatically  
5. **Check logs** in `Actions → Artifacts → fusion‑logs`

---

## 7 – Resetting Environment

If something breaks or dependencies change:

```
make reset
bash install.sh
```

This resets containers, logs, and virtualenv, recreating everything fresh.

---

## 8 – Versioning and Documentation

- Update version with `bash bump_version.sh x.y.z`  
- Review `CHANGELOG.md` for previous releases  
- Main runbook is in `docs/orchestration.md`  
- Internal codex pages (Notion / Supabase) mirror the same content

---

After following this guide, every developer can:
- Reproduce any test or CI build  
- Debug directly inside VS Code  
- Manage versions and logs consistently  

AdgenxAI Fusion v2 is fully synchronized across local, Docker, and CI environments.

---

© 2025 AdgenxAI Labs. Internal developer use only.