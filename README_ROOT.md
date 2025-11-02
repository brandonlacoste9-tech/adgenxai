# AdGenXAI — Unified Repository  
Creative v1 • Fusion v2 • Docs • CI/CD Suite

---

## Overview

This repository unites both creative and engineering phases of AdGenXAI:

| Phase | Version | Codename | Focus |
|-------|----------|-----------|--------|
| Creative Production | v1.0.0 | Sentiment Sentinel | Launch‑phase film and brand proof |
| Engineering Orchestration | v2.0.0 | Fusion Suite | Fully functional live sentiment platform |

- **v1** shows what AdGenXAI looks like.  
- **v2** powers how AdGenXAI actually works.  

---

## Quick Structure

```
AdGenXAI/
│
├─ adgenxai-fusion/             → Fusion Suite v2.0.0 (Current Active)
│  ├─ app.py                    → FastAPI voice-enabled dashboard
│  ├─ rehearse.sh              → 9-phase orchestration suite
│  ├─ install.sh / uninstall.sh → Environment management
│  ├─ bump_version.sh          → Automated version control
│  ├─ fusion_banner.sh         → Dynamic git-aware banner
│  ├─ Makefile                 → Unified command interface
│  ├─ .vscode/                 → VS Code integration
│  ├─ .github/workflows/       → CI/CD automation
│  └─ docs/                    → Technical documentation
│
├─ adgenxai-gemini-cookbook/    → Gemini API integration examples
├─ app/                        → Next.js frontend components
├─ netlify/functions/          → Serverless backend functions
├─ examples/                   → Usage demonstrations
├─ docs/                       → Repository-wide documentation
├─ CHANGELOG.md
├─ CONTRIBUTING.md
└─ README.md                   → This file
```

---

## Getting Started

### Quick Setup (Fusion v2)

1. **Clone and install**
   ```bash
   git clone https://github.com/brandonlacoste9-tech/adgenxai.git
   cd adgenxai/adgenxai-fusion
   bash install.sh
   ```

2. **Run Fusion locally**
   ```bash
   python app.py
   ```
   Default URL: `http://127.0.0.1:8000`

3. **Full orchestration test**
   ```bash
   make rehearse
   ```

4. **Container validation**
   ```bash
   make docker-rehearse
   ```

### Environment Reset
```bash
make reset
bash install.sh
```

---

## Developer Toolkit (VS Code)

The Fusion suite includes complete VS Code integration:

- **Launch & Debug** → *Run and Debug panel* with server, rehearsal, and test configurations
- **Tasks** → **Shift + Alt + T** or Command Palette → *Run Task*
- **Automation** → Install, Rehearse, Docker-Rehearsal, Reset, Version Bump
- **API Testing** → REST Client integration with `.rest` and `.http` files
- **Extensions** → Auto-suggested Python, Docker, REST Client, Git tools

---

## Documentation Index

| File | Description |
|------|-------------|
| `adgenxai-fusion/docs/orchestration.md` | Complete developer runbook and pipeline overview |
| `adgenxai-fusion/docs/deployment.md` | Cloud deployment guide (AWS ECS / Google Cloud Run) |
| `adgenxai-fusion/docs/transition_v1_to_v2.md` | Evolution from creative to engineering platform |
| `adgenxai-fusion/README_DEV.md` | VS Code developer guide and workflow |
| `adgenxai-fusion/CHANGELOG.md` | Version history and release notes |
| `adgenxai-fusion/CONTRIBUTING.md` | Team collaboration standards |

---

## Key Commands Reference

| Use Case | Command |
|-----------|----------|
| Install dependencies | `bash install.sh` |
| Run voice dashboard | `python app.py` |
| Full rehearsal test | `make rehearse` |
| Dockerized validation | `make docker-rehearse` |
| Environment reset | `make reset` |
| Version management | `bash bump_version.sh 2.1.0` |
| Cloud deployment | See `docs/deployment.md` |
| Endpoint testing | `./test_fusion_endpoints.sh` |

---

## Project Evolution Timeline  

| Date | Milestone | Description |
|------|------------|-------------|
| 2025‑10‑15 | v1.0.0 Sentiment Sentinel | Creative foundation and brand narrative |
| 2025‑11‑02 | v2.0.0 Fusion Suite | Complete engineering orchestration platform |
| 2025‑Q1 (Planned) | v2.1.x | Enhanced analytics and cloud deployment automation |
| 2025‑Q2 (Planned) | v3.0 | Unified Creative + Live Operations Intelligence |

---

## 🎯 Campaign Orchestration Engine

**Revolutionary one-call campaign creation across 11+ AI models and platforms**

The AdGenXAI Campaign Orchestration Engine unifies multiple AI capabilities into a seamless workflow:

### Core Capabilities

1. **🤖 Unified AI Integration (11+ Models)**
   - Gemini 2.5 Pro for content generation
   - Multi-platform publishing (Instagram, YouTube, TikTok)
   - BeeHive Studio for persona-driven creativity
   - Real-time analytics and optimization

2. **🎨 BeeHive Studio - Interactive Demo**
   - SwarmFeed: Real-time creative collaboration
   - PersonaBoard: 6 unique creative personas
   - Live metrics and swarm intelligence
   - Mythic UI with aurora effects

3. **💰 Cost Optimization (80-90% Savings)**
   - Efficient AI model usage
   - Serverless architecture
   - Smart resource allocation
   - Pay-per-use model

4. **⚡ One-Click Complete Campaigns**
   - Single API call for full campaign
   - Automatic content generation
   - Multi-platform deployment
   - Real-time performance tracking

### Quick Start

```bash
# Explore BeeHive Studio Demo
cd beeswarm
npm install
npm run dev
# Opens at http://localhost:5173

# Deploy full platform
npm run build
npm run deploy
```

### Documentation

- [Campaign Orchestration Guide](./docs/CAMPAIGN_ORCHESTRATION_ENGINE.md)
- [BeeHive Studio README](./beeswarm/README.md)
- [API Documentation](./docs/BEE_SHIP_API_DOCS.md)

---

## Architecture Highlights

### AdgenxAI Fusion v2.0.0 Features

- **🎤 Voice-Enabled Dashboard** - Real-time TTS/STT with Gemini 2.5 Pro
- **🔄 9-Phase Orchestration** - Comprehensive validation and health checking
- **🐳 Container Ready** - Docker + Docker Compose with health checks
- **⚡ CI/CD Automation** - GitHub Actions with artifact collection
- **🛠️ Developer Experience** - Complete VS Code integration with tasks and debugging
- **📊 Session Analytics** - Persistent JSON logging with search and export
- **🌐 Cloud Deployment** - AWS ECS and Google Cloud Run guides
- **🔧 Environment Management** - Automated install/uninstall with version control

### Technology Stack

- **Backend**: FastAPI + Python with async streaming
- **AI Integration**: Google Gemini 2.5 Pro API
- **Voice Processing**: Text-to-Speech and Speech-to-Text capabilities
- **Containerization**: Docker with multi-stage builds
- **CI/CD**: GitHub Actions with comprehensive testing
- **Development**: VS Code tasks, launch configs, and REST client integration

---

## Credits

**Creative Direction:** AdGenX Studio  
**Engineering Architecture:** AdGenXAI Labs  
**DevOps Integration:** Fusion Team  
**Platform Development:** Brandon LaCoste  

---

## License & Usage

Internal development repository — AdGenXAI Labs © 2025.  
For external collaboration or commercial licensing, contact the development team.

---

**AdGenXAI v1** tells the story.  
**AdGenXAI v2** runs the system.  
**Together** they form the foundation of adaptive creative intelligence.

---

🚀 **Ready to explore?** Start with `cd adgenxai-fusion && bash install.sh`