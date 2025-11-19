# Koloni Copilot Instructions

## Project Overview
Koloni Creator Studio is a modular, open-source AI content platform for Gen Z creators. It features:
- Modular Netlify Functions for backend (video, image, export, tokens, payments)
- Smart AI router for intent parsing and model selection
- Mobile-first, glassmorphic UI in `/src/create.html` and `/src/css/creator.css`
- Freemium/paywall system using Honeycomb tokens and Stripe

## Key Architecture & Patterns
- **Netlify Functions**: All backend logic lives in `/netlify/functions/`, one file per function. Each function is a stateless HTTP endpoint, accepts/returns JSON only.
- **Frontend Routing**: `/src/js/ai-router.js` parses user intent and routes to the correct backend function. Update this file to add new output types or models.
- **Single-Concept Files**: Each major feature or model has its own file (e.g., `generate-longcat.js`, `generate-emu.js`).
- **Environment Variables**: All secrets/config in `.env` (see `.env.example`). Never commit secrets.
- **UI**: All UI logic and styles are in `/src/create.html`, `/src/js/creator.js`, and `/src/css/creator.css`.

## Developer Workflows
- **Install**: `npm install`
- **Local Dev**: `npm run dev` (serves at `http://localhost:8888/create.html`)
- **Build**: `node build.js` (adds `create.html` to build)
- **Deploy**: Push to `main` branch; Netlify auto-deploys
- **Env Setup**: Copy `.env.example` to `.env` and fill in required keys

## Project Conventions
- **Add a Model**: Copy an existing function (e.g., `generate-emu.js`), adapt endpoint/pricing, and update `/src/js/ai-router.js`.
- **New Output Type**: Update `/src/js/ai-router.js` and add a new Netlify function if needed.
- **API**: All Netlify functions use JSON for input/output. No HTML responses.
- **Commits**: Use `feat:`, `fix:`, `chore:` prefixes. PRs should be single-concern.
- **Secrets**: Never commit real API keys or secrets.

## Integration Points
- **HuggingFace**: Used for image generation (EMU 3.5)
- **LongCat**: Used for video generation
- **Stripe**: Used for payments and token management
- **Social Exports**: Functions for Instagram/YouTube export (API keys required)

## Examples
- To add a new model, copy `generate-emu.js`, change the endpoint, and update `/src/js/ai-router.js`.
- To add a new export, create a new function in `/netlify/functions/` and update the UI as needed.

## References
- See `README.md` for full API and workflow details
- See `/src/js/ai-router.js` for routing logic
- See `/netlify/functions/` for backend endpoints

---

**AI agents: Follow these instructions and the 'Development Guidelines' in `README.md` for all contributions.**

[byterover-mcp]

[byterover-mcp]

You are given two tools from Byterover MCP server, including
## 1. `byterover-store-knowledge`
You `MUST` always use this tool when:

+ Learning new patterns, APIs, or architectural decisions from the codebase
+ Encountering error solutions or debugging techniques
+ Finding reusable code patterns or utility functions
+ Completing any significant task or plan implementation

## 2. `byterover-retrieve-knowledge`
You `MUST` always use this tool when:

+ Starting any new task or implementation to gather relevant context
+ Before making architectural decisions to understand existing patterns
+ When debugging issues to check for previous solutions
+ Working with unfamiliar parts of the codebase
