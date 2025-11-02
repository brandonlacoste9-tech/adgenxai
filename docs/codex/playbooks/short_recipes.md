# Codex Playbook Recipes

## Attribution QA
- **Purpose:** Run the advanced attribution engine over canonical fixtures and compare models (first/last/linear/time-decay/Shapley/Markov).
- **Hooks:** `src/lib/attribution-engine-advanced.js`, `supabase/functions/attribution-analytics-api`.
- **Trigger:** PRs touching attribution code or weekly schedule.
- **Workflow:** Load ~50 journeys → run `AdvancedAttributionEngine` models → generate CSV/markdown deltas → alert when shifts >5% for top channels.
- **Output:** `reports/attribution-comparison-YYYYMMDD.md`.

## ML Prediction Drift (Nightly)
- **Purpose:** Evaluate `performance-prediction`/`ml-performance-api` using a holdout dataset and detect drift (AUC drop >2%, CTR mean shift >10%).
- **Hooks:** `supabase/functions/performance-prediction/index.ts`, `supabase/functions/ml-performance-api`.
- **Trigger:** Nightly schedule.
- **Workflow:** Pull holdout from `docs/codex/fixtures/holdout.json` → invoke prediction endpoints → compare to baseline → create `codex:ml-drift` issue on anomaly.

## UI Snapshot Tour (Analytics Surfaces)
- **Purpose:** Playwright snapshots for `AnalyticsDashboard`, `EnhancedDashboard`, `ComparisonAnalytics` to catch DOM/metric drift.
- **Hooks:** `src/components/AnalyticsDashboard.tsx`, `src/components/EnhancedDashboard.tsx`, `src/components/ComparisonAnalytics.tsx`.
- **Trigger:** Frontend PRs or nightly.
- **Workflow:** Launch Playwright, visit `/analytics`, `/comparison/:id`, `/enhanced` → capture widget snapshots → compare hashes → fail CI if critical elements disappear or breach thresholds.

## Pricing & Plan Consistency Linter
- **Purpose:** Assert rendered pricing aligns with canonical config.
- **Hooks:** `src/components/SubscriptionStatus.*`, `lib/stripe`, `configs/pricing.json` (source of truth).
- **Trigger:** Pricing-related PRs or nightly.
- **Workflow:** Render pricing page headlessly → extract price strings → compare to config → post PR comment and optional auto-fix.

## Content Engine Autopilot
- **Purpose:** Batch-generate autopsies/case studies using `cms-automation-api` and `CMSEngine`.
- **Hooks:** `src/lib/cms-engine-advanced.ts`, `supabase/functions/cms-automation-api`.
- **Trigger:** Manual `workflow_dispatch` or monthly cadence.
- **Workflow:** Feed campaign CSV → generate drafts → save to Supabase as drafts → open PR for `content/drafts/*.md` or create Linear issues.

## Analytics Sanity Scripts
- **Purpose:** Monitor AI performance scores vs revenue, fraud shield transitions, and missing metrics.
- **Hooks:** `src/components/ComparisonAnalytics.tsx` metrics exports.
- **Trigger:** Nightly.
- **Workflow:** Evaluate telemetry snapshots → flag score spikes without revenue, fraud shield `critical`, or missing metrics → file actionable issues with logs.
