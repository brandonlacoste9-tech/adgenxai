# Colony OS Integration Blueprint

AdGenXAI is being prepared to operate as the first decentralized content creation platform on Colony OS. The roadmap below maps each requested phase to concrete deliverables plus the artifacts introduced in this commit.

## Phase 1 – Colony OS API Integration
- ✅ **Colony SDK shim (`lib/colony/sdk.ts`)** – Provides agent registry, workflow state, and task distribution in-memory so that the frontend and API handlers can shape payloads that match the real Colony OS SDK contract.
- ✅ **Agent registration endpoint (`app/api/colony/route.ts`)** – Accepts `registerAgent`, `createTask`, `recordWorkflow`, and `publishMotion` actions to keep AdGenXAI's MCP agents synchronized with Colony OS registries.
- ✅ **Phase manifest (`lib/colony/config.ts`)** – Tracks readiness criteria and Colony hook touchpoints so that rituals and dashboards can expose progress.

**Next hop:** replace the in-memory shim with the live Colony SDK package once credentials are available.

## Phase 2 – Tokenization
- ✅ **Token economics model (`lib/colony/config.ts`)** – Captures ticker, supply, emission schedule, reward splits, and staking tiers. This is surfaced via `GET /api/colony?view=tokenomics` for dashboards, rituals, and DAO tooling.
- ✅ **Reward-aware engine (`lib/colony/engine.ts`)** – Automatically attaches bounty token info to each task and credits rewards during the completion workflow so we can simulate creator + agent payouts before mainnet deployment.

**Next hop:** wire the engine into Supabase or the eventual Colony treasury so balances persist beyond runtime.

## Phase 3 – Decentralization
- ✅ **Workflow + governance registries (`lib/colony/sdk.ts`)** – Support remote execution manifests, peer-to-peer payment specs, and storage adapters by persisting workflow threads and governance motions that can be mirrored to Colony OS when remote runtimes are enabled.
- ✅ **API exposure** – `recordWorkflow` and `publishMotion` actions allow UI surfaces (Creator Dashboard, BeeHive rituals) to push artifacts toward Colony orchestration layers.

**Next hop:** connect storage adapters (e.g., IPFS/Filecoin) and payment channels once Colony credentials + escrow modules are greenlit.

## Phase 4 – Advanced Features
- ✅ **Multi-agent workflows** – Workflow threads capture participants, phase, and consensus targets so distributed agents can reason about their role in each Colony mission.
- ✅ **Distributed AI consensus** – Votes + quality scores on `ColonyTask` records model the consensus feed required for DAO-level scoring.
- ✅ **Token-based bounties** – Every task minted by `createTask` includes bounty token metadata and uses staking data during agent selection, paving the way for on-chain bounty settlement.

**Next hop:** expose consensus feeds on the dashboard plus BeeHive rituals (Badge + Metrics) so token-backed quality scoring influences future prompts and payouts.

## Usage Recap
```bash
# Register a new agent with Colony-ready metadata
curl -X POST /api/colony \
  -H "Content-Type: application/json" \
  -d '{
    "action": "registerAgent",
    "payload": {
      "displayName": "Atlas MPC",
      "capabilities": [
        { "id": "story", "label": "Story Drafting", "weight": 1.5 },
        { "id": "sora", "label": "Video Generation" }
      ],
      "stake": 1200,
      "reputation": 0.72
    }
  }'

# Create a tokenized bounty that targets the Decentralization phase
curl -X POST /api/colony \
  -H "Content-Type: application/json" \
  -d '{
    "action": "createTask",
    "payload": {
      "phase": "decentralization",
      "description": "Publish remote render manifest to Colony",
      "requiredCapabilities": ["sora", "storage"],
      "reward": 75
    }
  }'
```

## Ritual Notes
- **Badge**: agent registrations can now be stamped inside BeeHive rituals because every agent payload captures origin, stake, and credentials.
- **Metrics**: `/api/colony` exposes integration health so dashboards can visualize phase readiness and bounty throughput.
- **Echo**: workflow + governance registries create the audit trail for lessons learned across Colony deployments.
- **History**: tasks + votes serve as the nucleus for persistent context once mirrored into Supabase or Colony state channels.
