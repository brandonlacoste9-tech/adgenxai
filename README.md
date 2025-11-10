# AdGenXAI - AI Sensory Cortex

**AI-powered advertising automation platform with webhook-driven agent orchestration**

[![Build Status](https://github.com/brandonlacoste9-tech/adgenxai/workflows/CI/badge.svg)](https://github.com/brandonlacoste9-tech/adgenxai/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000/dashboard
```

---

## 📚 Documentation

- **[PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md)** - Project goals, features, and roadmap
- **[docs/README.md](docs/README.md)** - Complete documentation hub
- **[START_HERE_BEE_SHIP.md](START_HERE_BEE_SHIP.md)** - Deployment automation guide
- **[PHASE2_README.md](PHASE2_README.md)** - Autonomous PR workflow setup

---

## 🎯 What is AdGenXAI?

AdGenXAI enables content creators and marketers to **automate their entire content pipeline** using AI agents:

- 🤖 **AI Content Generation** - Generate ad copy with GPT-4 or GitHub Models
- 📊 **Creator Dashboard** - Track performance, costs, and analytics
- 🌐 **Multi-Platform Publishing** - Instagram, TikTok, YouTube (planned)
- 🎨 **Aurora Theme** - Beautiful, accessible UI with animations
- 🧠 **BeeHive Rituals** - Agent learning and optimization system
- 🔐 **Security-First** - RLS policies, auth gates, webhook validation

Built with Next.js, TypeScript, Tailwind CSS, and Netlify Functions.

---

## 🌟 Key Features

### Current (MVP)
- ✅ AI content generation with multiple providers
- ✅ Creator dashboard with analytics
- ✅ Prompt template library
- ✅ Agent performance tracking
- ✅ BEE-SHIP automated deployment
- ✅ Aurora-themed responsive UI
- ✅ Ghost CMS integration for content publishing

### Phase 2 (In Progress)
- [ ] Supabase database integration (PR-1)
- [ ] Enhanced provider system (PR-3)
- [ ] Supabase Auth (PR-5)
- [ ] Real-time subscriptions

### Phase 3 (Planned)
- [ ] Social media publishing
- [ ] Video generation (Sora)
- [ ] A/B testing framework
- [ ] CrewAI agent teams

See [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md) for complete feature roadmap.

---

## 🏗️ Architecture

**Sensory Cortex Pattern**: Webhook-driven AI orchestration
- Frontend: Next.js 14 (static export) + React + Tailwind
- Backend: Netlify Functions (serverless webhooks)
- AI: OpenAI API + GitHub Models
- Database: Supabase (PostgreSQL) - planned
- Auth: Supabase Auth - planned

**Agent-First Philosophy**: Specialized agents vs. monolithic AI
- Domain-specific agents for each task
- Chief-agent delegation patterns
- Persistent memory via BeeHive Rituals
- Human-in-the-loop approval gates

---

## 👥 Who is this for?

- **Solo Creators** - 3x content output with same effort
- **Marketing Managers** - Scale campaigns across clients
- **E-commerce Owners** - Generate product ads quickly
- **Agencies** - Streamline creative workflows

See [User Personas](PROJECT_REQUIREMENTS.md#4-user-personas-and-target-audience) for detailed profiles.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript 5 |
| Styling | Tailwind CSS, Framer Motion |
| Backend | Netlify Functions, Node.js |
| Database | Supabase (PostgreSQL) |
| AI | OpenAI API, GitHub Models |
| Testing | Vitest, Testing Library |
| CI/CD | GitHub Actions, BEE-SHIP |

---

## 📖 Documentation Index

| Document | Description |
|----------|-------------|
| [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md) | Business goals, features, personas |
| [docs/AGENT_FIRST_PHILOSOPHY.md](docs/AGENT_FIRST_PHILOSOPHY.md) | Architecture principles |
| [docs/BEEHIVE_RITUALS.md](docs/BEEHIVE_RITUALS.md) | Operational framework |
| [docs/CREATOR_DASHBOARD.md](docs/CREATOR_DASHBOARD.md) | User guide |
| [PHASE2_README.md](PHASE2_README.md) | Autonomous PR workflow |
| [START_HERE_BEE_SHIP.md](START_HERE_BEE_SHIP.md) | Deployment guide |

Full documentation: [docs/README.md](docs/README.md)

---

## 🤝 Contributing

We welcome contributions! See our [Phase 2 autonomous PR workflow](PHASE2_README.md) for how to contribute using AI-powered code review and automation.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

Inspired by:
- **David Ondrej's Vectal.ai** - Agent-First methodologies
- **OpenAI & Anthropic** - AI capabilities
- **CrewAI & n8n** - Open-source agent orchestration

---

**Last Updated**: November 2, 2025

> 🤖 See [.github/copilot-instructions.md](.github/copilot-instructions.md) for AI guidelines.

