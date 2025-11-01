# Codex Integration Artifacts

## 1. Ready-to-run `curl`

Save your payload to `codex_payload.json`, then invoke the Codex agent with:

```bash
curl -sS -X POST "$CODEX_AGENT_URL" \
  -H "Authorization: Bearer $CODEX_AGENT_TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @codex_payload.json | jq
```

Replace the placeholder values locally before executing. The command assumes the agent handles branch creation, commits, and PR orchestration.

## 4. Polished PR Creation Text

**Title**

```
feat: add Codex evals function + telemetry integration
```

**Body**

````
## Summary

This PR adds the Codex evals integration and telemetry UI:

- **New:** `netlify/functions/codex-evals.ts`  
  - Netlify function that proxies OpenAI `createEval` and `GET /evals/{id}`.
  - Uses an environment-safe `fetchFn` wrapper.
  - Optional bearer token protection via `EVALS_BEARER_TOKEN`.
  - Optional Netlify Blobs persistence for replay overlays; the function annotates responses with overlay telemetry (size, persisted, blob key and errors).

- **Updated:** `netlify/functions/telemetry-dashboard.ts`  
  - Server-side Codex Eval card that calls the eval endpoint via guarded fetch and renders job metadata and overlay telemetry (safe HTML escaping).

- **New:** `smoke-codex-evals.js`  
  - Minimal smoke test invoking the new function (dynamically imports `node-fetch` if `globalThis.fetch` is unavailable).

- **Updated:** `netlify.toml`, `package.json`, `README.md`  
  - Adds dev/production env declarations, a smoke script, and operational notes. README was converted to UTF-8 to avoid toolchain issues.

---

## Testing

**Typecheck & build**
```bash
npm run typecheck
npm run build
````

**Local dev + smoke**

1. Start dev server:

```bash
netlify dev
```

2. Run smoke test (replace placeholders):

```bash
SITE_URL=http://localhost:8888 \
EVALS_BEARER_TOKEN=some-token \
OPENAI_API_KEY=sk-... \
npm run smoke:codex-evals
```

Expected: JSON response containing `jobId`, `status`, `created_at`, and `meta` (may include `replayOverlay`, `overlayBlob`, or `overlayBlobError`).

**Preview test**

```bash
SITE_URL=https://<preview-url> \
EVALS_BEARER_TOKEN=... \
OPENAI_API_KEY=sk-... \
npm run smoke:codex-evals
```

---

## Reviewer checklist

* [ ] `netlify/functions/codex-evals.ts` exists and passes `tsc`.
* [ ] `telemetry-dashboard` renders Codex Eval card server-side and handles errors gracefully.
* [ ] Overlay telemetry is present in `meta.replayOverlay` when overlays are provided.
* [ ] `smoke-codex-evals.js` succeeds against local dev or preview.
* [ ] `netlify.toml` declares env vars but **no secrets are committed**.
* [ ] README updated (UTF-8), and operational notes make sense.
* [ ] Confirm Netlify env vars added to site settings before merging:

  * `OPENAI_API_KEY` (required)
  * `EVALS_BEARER_TOKEN` (recommended)
  * `NETLIFY_BLOBS_SITE_ID`, `NETLIFY_BLOBS_TOKEN` (optional)
  * `EVALS_LATEST_JOB_ID`, `SITE_URL` (optional)

---

## Notes for the integrator

* If the Codex agent reports merge conflicts, paste the conflict hunks here and I’ll craft the exact resolution patch.
* If your agent expects a different JSON envelope or uses a specific `branch/commit/author` convention, tell me and I’ll adapt the payload.
* I can also create a `curl` variant that streams the JSON or uses `--http2` for speed if your agent requires it.

---

Would you like me to:

* Fill the `curl` command with your real Codex endpoint/token (you provide them locally), or
* Produce a gzipped/minified JSON for upload as well, or
* Generate a mail-format `git am` patch?

Say which and I’ll deliver it instantly.
````
