# Welcome to **adgenxai** 👋

> This is a quick starter / welcome card for new contributors and Live Share sessions.
>
> Paste this into Slack, VS Code Live Share, or pin it in the repo for easy onboarding.

---

## Quick links
- **Repo:** https://github.com/brandonlacoste9-tech/adgenxai  
- **Onboarding guide:** `prompts/ONBOARDING.md`  
- **Live status / demo:** `/status` or `/demo` (if present)

---

## How to get started (one-liners)
1. Clone the repo:
   ```bash
   git clone https://github.com/brandonlacoste9-tech/adgenxai
   cd adgenxai
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Recommended: open `.vscode/extensions.json` for team-recommended extensions and install them.
5. Read `prompts/ONBOARDING.md` for project-specific setup, conventions, and quick tasks.

---

## Quick orientation — what I (Brandon) & ChatGPT bring

I’m Brandon (new to adgenxai) and I’m pairing with **ChatGPT-5** to speed onboarding, automate repetitive work, and help with code, docs, and tests.

**VS Code highlights**

* **Live Share** — real-time pairing with shared terminals, debugging, and chat.
* **Tasks & Snippets** — `tasks.json` and shared snippets speed repetitive tasks.
* **GitHub integration** — review PRs and issues without leaving the editor.
* **Recommended extensions** — `.vscode/extensions.json` contains team suggestions (Copilot, ESLint, Prettier, EditorConfig, etc.).

**How ChatGPT can help**

* Generate, refactor, or explain code (React, TypeScript, Node, etc.).
* Draft issues, PR descriptions, and docs (onboarding, runbooks).
* Help design tests, mock APIs, and debugging steps.
* Suggest automation recipes (`tasks.json`, scripts, CI helpers).

**Example prompts to ask me / ChatGPT**

* “Create a reusable React component for X.”
* “Draft a bug report template for the repo.”
* “Help me add a smoke test for the codex-evals function.”
* “Walk me through the telemetry dashboard flow.”

---

## First small tasks (good starter work)


- Run the app locally and confirm `/status` or `/demo` works.
- Review `prompts/ONBOARDING.md` and suggest a tiny doc improvement.

- Add or review `.vscode/extensions.json` recommendations.

- Check the `netlify/functions` smoke scripts and run `npm run smoke:codex-evals` (if you have the env configured).
  
   _Required env vars: `OPENAI_API_KEY`, `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, `DATABASE_URL` (or `SUPABASE_*`), `CODEX_EVALS_BEARER_TOKEN`_

---

## Contacts & pairing

- **Owner / primary contact:** Brandon Leroux
- **GitHub:** [@brandonlacoste9-tech](https://github.com/brandonlacoste9-tech)
- **Want a walkthrough or pair session?** Ping me in Slack/VS Code and we’ll Live Share for 20–30m. I’m happy to pair on onboarding, telemetry, or CI/security tasks.

- **Slack channel:** [`#eng-onboarding`](https://your-workspace.slack.com/archives/CENGONBOARDING) (or your team’s channel)

**Preferred CTA:** [Book a demo](/demo) (or visit `/status` to view live telemetry).

---

Thanks for being here — excited to collaborate and make adgenxai smoother, safer, and faster.
If you want this pin as a Live Share welcome card or a shorter Slack snippet, I can also add a small pinned file (`.vscode/welcome-card.md`) — tell me and I’ll patch it in.


---

_Generated with help from ChatGPT-5._
# 👋 Welcome to AdGenXAI — Onboarding Packet

**Goal:** get any new teammate productive quickly. This doc summarizes the platform, the model roster, architecture, bootstrap steps, priorities, ops, and immediate tasks.

---

## 1 — Elevator pitch

AdGenXAI is a **fully open-source, multi-model AI advertising platform** that produces entire ad campaigns (text, images, video, 3D, animations) from a single request. We integrate 11 world-class models to cover everything from fast thumbnails to multi-minute story videos. Our approach: **bootstrap first, optimize later** — get models working locally, validate workflows, then invest in automation and infrastructure savings.

---

## 2 — Model roster (what, why, status, priority)

| Model               | Purpose                            | Status      | Priority |
| ------------------- | ---------------------------------- | ----------- | -------- |
| **LongCat-Video**   | Long-form video (up to 5 minutes)  | ✅ Cloned    | **P0**   |
| **EMU 3.5**         | Image generation & editing         | ✅ Cloned    | **P0**   |
| **ChronoEdit**      | Physics-aware image editing        | ✅ Cloned    | **P0**   |
| **Kimi-linear**     | Long-form text (1M tokens, KDA)    | ✅ Cloned    | **P0**   |
| **AMD Nitro-E**     | Fast thumbnails (0.16s/gen)        | ✅ Cloned    | **P0**   |
| **WorldGrow**       | Infinite 3D environments           | ✅ Cloned    | **P0**   |
| **Wan-Animate 2.2** | Character animation / replacement  | 🆕 Add      | **P1**   |
| **Hunyuan 3D 3.0**  | 3D model generation (PBR/rigging)  | 🆕 Add      | **P1**   |
| **ByteDance UMO**   | Multi-identity (group consistency) | 🆕 Add      | **P1**   |
| **Ditto (Editto)**  | Instruction-based video editing    | 🆕 Add      | **P1**   |
| **Hailuo AI**       | Short-form cinematic (6–10s video) | 🆕 Optional | **P2**   |

> Notes: LongCat, EMU, Kimi, ChronoEdit, Nitro-E and WorldGrow are the core P0 set to bootstrap first. Hailuo is an optional, premium short-form provider.

*(Sources and background research for LongCat/EMU/Kimi are available in the model docs and repositories.)*

---

## 3 — Where each model fits (short)

* **LongCat-Video**: primary long-form video engine (T2V, I2V, continuation). Use for brand stories and product demos. Open-source, MIT licensed; can replace Sora for long-form generation.
* **EMU 3.5**: production-grade image generation and editing; ideal for brand images and creative assets.
* **ChronoEdit**: physics-aware edits with temporal consistency — ideal for plausible scene edits and product mockups.
* **Kimi-linear**: 1M token LLM for long copy, scripts, and campaign-level reasoning (KDA attention). Use as text backbone.
* **AMD Nitro-E**: extremely fast thumbnails and variants. Use for preview/thumbnail generation.
* **WorldGrow / Hunyuan 3D**: 3D environments and product/character models. Use for immersive scenes and AR/VR exports.
* **Wan-Animate / Ditto / UMO**: animation, instruction-based editing, multi-identity — P1 integrations for richer creative workflows.
* **Hailuo**: optional provider for highly cinematic short clips (6–10s); consider as premium offering.

---

## 4 — High level architecture

**User Request → Intelligent Router → Workflow Orchestrator → Model Manager → (Models)**

* **Model Manager**: loads, monitors, and coordinates model instances (lazy load/unload).
* **Intelligent Router**: analyses prompt and selects provider(s) (providerSelector). Routing logic includes preview vs production, budget, duration, and content type.
* **Service Layer**: unified API endpoints (`generate_video`, `generate_image`, `generate_3d`, `generate_text`) that hide model specifics.
* **Workflow Orchestrator**: chains tasks (Kimi → EMU → LongCat → Ditto → Nitro-E) to produce full campaigns.
* **Telemetry & Observability**: requestId correlation, `video_generation_request/result` events, per-model cost/latency.

---

## 5 — Bootstrap-first playbook (Day 0 → Week 2)

**Principle:** get P0Models running locally first. Don't optimize infra prematurely.

### Hardware & storage

* 2TB free disk for model weights & outputs.
* GPUs: begin with available dev GPUs; 2×A100 80GB recommended for heavy experiments.

### Immediate steps (next 48 hours)

1. Read `Bootstrap-Guide.md`.
2. Setup conda env, install PyTorch (CUDA matching GPUs), FlashAttention, dependencies.
3. Run `./scripts/clone_all_repos.sh` to clone P0 repos.
4. Start `./scripts/download_model_weights.sh` in `tmux` — ~500GB.
5. Run smoke tests: `python scripts/test_models.py` and `netlify dev` for serverless functions.

### Week 1-2 (core)

* Validate text→image→video pipeline with: Kimi → EMU → ChronoEdit → LongCat → Nitro-E.
* Add durable job state for LongCat video jobs (Netlify Blobs or Supabase).
* Implement providerSelector for preview vs production routing.

---

## 6 — Immediate engineering tasks (Day 1–7)

**Top priorities (no regrets):**

1. **ProviderSelector**: small module that chooses cheapest/fastest provider for previews and route final runs to P0.
2. **Durable job storage** for LongCat jobs (avoid in-memory Maps).
3. **Cache adapter**: cache LongCat video outputs keyed by hash(prompt+params) with TTL & explicit invalidate.
4. **Telemetry events**: emit `video_generation_request` and `video_generation_result` with `requestId`, `provider`, `latency_ms`, `cost_estimate`.
5. **Retry logic**: Only retry transient (network/timeouts), do not retry 4xx; honor `Retry-After` on 429.
6. **Soft rollback**: `USE_LONGCAT=0` returns 501 and prevents LongCat calls.

---

## 7 — Testing & CI rules

* **Unit tests:** Vitest for provider adapters and client mocks (test 429/500/timeout/success).
* **Integration tests:** `netlify dev` + smoke calls to `/.netlify/functions/sora-generate` (local).
* **Pre-merge checks:** `npm run typecheck`, `npm run build`, `npm test`.
* **PRs must include:** updated `.env.example`, new telemetry events, and feature flag gating for risky changes.

---

## 8 — Operations & telemetry (what to monitor)

**Core telemetry events**

* `video_generation_request`: `{requestId, provider, duration, prompt_length, preview, budget}`
* `video_generation_result`: `{requestId, provider, status, latency_ms, cost_estimate, error}`

**Dashboard & alerts**

* Alerts: error rate >1% (5m), p95 latency >30s, cost spike.
* Dashboards: per-provider throughput, cost/day, p95/p99 latency, inflight jobs, LRU model memory usage.
* Logs: correlate logs with `requestId` for tracing.

**Emergency**

* Soft rollback: set `USE_LONGCAT=0`.
* Full rollback: revert the merge commit.
* Circuit breaker: trip provider on repeated 5xx/429.

---

## 9 — Cost & model usage strategy

* **Preview / fast mode**: Nitro-E or EMU low-res.
* **Production mode**: LongCat / full EMU / Hunyuan 3D.
* **Caching & dedupe**: reuse previous outputs for identical prompts.
* **Per-campaign budgets**: enforce quotas for P1/P2 usage.
* **Open-source focus**: optimize GPU and memory rather than API call cost.

---

## 10 — Claude automation & next optimization steps

**When to run**: after P0 bootstrap and real usage data (Week 3+).
**Focus areas** (high ROI): model loading/unloading, GPU sharing and batching, caching, Docker deployment optimization. Start with a $2–3 safe pass to find low-risk wins. Tools and scripts are already prepared (`scripts/claude-autofix.sh`) to scan for patterns.

---

## 11 — 16-week rollout (summary)

**Phase 1 (Weeks 1–2)** — Bootstrap P0 models, validate pipeline, smoke tests.
**Phase 2 (Weeks 3–6)** — API & service layer; providerSelector; durable job state; telemetry dashboards.
**Phase 3 (Weeks 7–11)** — Integrate P1 models (Wan-Animate, Hunyuan 3D, UMO, Ditto).
**Phase 4 (Week 12+)** — Optional Hailuo integration, cost dashboards, circuit breaker & scaling.

---

## 12 — Day-one quick commands

```bash
# Clone repo and install deps
git clone git@github.com:brandonlacoste9-tech/adgenxai.git
cd adgenxai
npm ci

# Copy env and edit
cp .env.example .env
# edit .env to add LONGCAT_API_KEY if available (local dev may use emulation)

# Start local dev
# Requires netlify-cli
DEBUG_LONGCAT=1 netlify dev

# Smoke test local function
curl -s -X POST http://localhost:8888/.netlify/functions/sora-generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Quick smoke test","duration":6}' | jq

# Run tests
npm run typecheck
npm test
```

---

## 13 — Security & compliance reminders

* **Do not** log secrets or raw API keys.
* Validate all webhook signatures (HMAC SHA-256).
* Run static code analysis on new model repos (bandit/pylint/safety).
* Confirm licenses (LongCat, EMU, Kimi are permissively licensed — check each repo) .

---

## 14 — References & reading (starter list)

* LongCat-Video repo & technical report — excellent coverage of T2V/I2V and 5-minute generation capabilities. Read before LongCat integration.
* EMU 3.5 repo & tech report — image / video editing, efficient VRAM usage.
* Kimi-linear repo & docs — KDA attention and 1M token context examples.
* ChronoEdit, Nitro-E, WorldGrow docs — integration patterns and examples.
  (Links and detailed guides are in the Bootstrap Guide and model docs.)

---

## 15 — Immediate asks for you / the team

1. Confirm **Netlify site id** and set production `LONGCAT_API_KEY`, `USE_LONGCAT=1`, `DEBUG_LONGCAT=0`, `ENABLE_TELEMETRY=true`.
2. Run the Bootstrap Guide steps to clone weights and validate P0 locally.
3. Assign owners for: LongCat, EMU, Kimi, ChronoEdit, Nitro-E, WorldGrow.
4. I can immediately produce: **ProviderSelector** + **Cache adapter** + **Circuit breaker** starter PRs with tests. Which should I create first?

---

## Bottom line

You've got a powerful, open, and modular AI stack. The onboarding path is: **bootstrap P0 → validate workflows → instrument telemetry → run Claude automation for infrastructure wins → integrate P1/P2**. That sequence minimizes cost and risk while getting real value fast.

If you want, I'll now:

* Produce the ProviderSelector starter PR + tests; **or**
* Output the Cache adapter (Netlify Blobs + tests); **or**
* Draft the Circuit Breaker PR (code + tests + docs).

Which do you want me to create first?
