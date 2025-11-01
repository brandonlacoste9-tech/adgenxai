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
