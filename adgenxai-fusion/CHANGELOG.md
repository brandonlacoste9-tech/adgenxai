# AdgenxAI Fusion Changelog

All notable changes are documented here to track the development history of the AdgenxAI Fusion Suite.

---

## [2.0.0] – 2025‑11‑01
### Added
- Complete AdgenxAI Fusion v2 Developer Package
- FastAPI backend with Gemini 2.5 Pro integration (`app.py`)
- Real‑time text streaming, TTS voice response, and speech recognition
- Persistent JSON logging system with search, filtering, and export
- Interactive web dashboard featuring dark mode UI
- Automatic session metrics (tokens, timing, logs)
- Voice prompt upload and transcription endpoint
- Text‑to‑speech playback endpoint
- Rehearsal orchestration via:
  - `rehearse.sh` script
  - `make rehearse` Makefile target
  - NPM `rehearse` script with cross‑platform env support
- Docker containerization (`Dockerfile`, `docker-compose.yml`)
- CI/CD GitHub Actions workflow (`fusion-rehearsal.yml`)
- VS Code and JetBrains REST/HTTP API test files
- Developer banner (`fusion_banner.sh`) for startup terminal info
- Installer (`install.sh`) with colorized progress and auto‑setup
- Teardown utility (`uninstall.sh`) for environment reset
- Unified `make reset` target linking uninstall routine
- Version bump utility (`bump_version.sh`) for automated version management
- Comprehensive documentation (`docs/orchestration.md`) and Codex references
- Logs and speech directories auto‑generated at setup
- Example `.env.example` template with all required variables
- Project‑wide developer experience optimization for VS Code
- VS Code launch configurations and task definitions
- Cloud deployment guide for AWS ECS and Google Cloud Run

### Changed
- Enhanced installer with colored CLI feedback and silent pip output  
- Makefile consolidated into aligned targets for local/docker/CI orchestration  
- Workflow improved with artifact upload of generated logs  
- Dynamic banner now displays git tags and commit information

### Fixed
- Minor directory permission inconsistencies on first build  
- Auto cleanup for orphaned containers upon `make reset`  

---

## [1.0.0] – 2024‑12‑15
### Added
- Initial FastAPI Gemini prototype  
- Primitive logging and local TTS demonstration  
- Manual curl‑based rehearsal scripts  

---

Version 2.0.0 marks the full transition of AdgenxAI Fusion from a demo into a production‑grade orchestration suite for unified multimodal operations.

For upcoming releases or maintenance patches, bump the version number following semantic versioning (major.minor.patch) and document new capabilities below.