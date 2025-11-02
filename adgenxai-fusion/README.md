# AdgenxAI Fusion v2 Developer Suite

This repository contains the complete voice‑enabled Gemini orchestration platform for AdgenxAI. It enables developers to run, rehearse, test, and deploy the Fusion suite with a single command—locally, in Docker, or via CI/CD.

---

## Features

- Full‑stack FastAPI + Gemini 2.5 Pro backend  
- Streaming text and TTS voice integration  
- Persistent JSON logging with in‑dashboard filtering and export  
- Makefile, NPM, and Docker orchestration  
- Rehearsal automation with Slack notifications  
- GitHub Actions CI pipeline  
- Developer tools for VS Code and JetBrains  
- Auto‑loading session banner displaying commands and environment status  

---

## Quickstart (VS Code)

```bash
git clone https://github.com/your-org/adgenxai-fusion.git
cd adgenxai-fusion
cp .env.example .env
pip install -r requirements.txt
python app.py
```

Visit [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## Orchestration Commands

| Task | Command |
|------|----------|
| Run local server | `python app.py` |
| Full rehearsal | `make rehearse CONTEXT=dev` |
| Dockerized rehearsal | `make docker-rehearse` |
| Cross‑platform script | `npm run rehearse --context=staging` |
| CI execution | Automated via GitHub Actions |

---

## Files of Interest

| File | Purpose |
|------|----------|
| `app.py` | FastAPI Gemini dashboard |
| `rehearse.sh` | Orchestration runner |
| `fusion_banner.sh` | Developer banner when terminal opens |
| `test_fusion_endpoints.sh` | CLI endpoint tester |
| `fusion_api_tests.rest` | VS Code API tests |
| `fusion_api_tests.http` | JetBrains API tests |
| `docs/orchestration.md` | Full runbook and CI reference |
| `.github/workflows/fusion-rehearsal.yml` | CI/CD automation |

---

## Docker Workflow

```bash
docker compose up --build rehearsal
```

This launches the Fusion app container and runs the rehearsal suite, posting results to Slack and saving logs in `./logs`.

---

## CI/CD Integration

Each push to `main` triggers the GitHub Actions workflow:
- Builds the Docker image  
- Executes the orchestrated rehearsal inside the container  
- Uploads logs as artifacts  
- Notifies Slack (optional)  

Monitor results under Actions → Fusion Rehearsal.

---

## Developer Experience

### VS Code
- Auto banner on terminal open  
- Built‑in FastAPI debug configuration  
- REST Client for one‑click endpoint testing  

### JetBrains
- `.http` API request file for inline testing  
- Full Docker integration  

---

## Documentation and Codex Sync

- Repository: `docs/orchestration.md`  
- Notion Runbook: Embed Markdown version  
- Supabase Codex entry: `slug = "adgenxai_fusion_orchestration"`  
- Optional public Gist for sharing  

---

## License

Distributed internally under the AdgenxAI Developer License.  
All rights reserved © 2025 AdgenxAI Labs.