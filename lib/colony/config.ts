import { ColonyPhase, TokenEconomics } from "./types";

export const COLONY_PHASES: ColonyPhase[] = [
  {
    id: "integration",
    title: "Phase 1 · Colony OS Integration",
    purpose:
      "Wire AdGenXAI's MCP stack into Colony OS by registering agents and creating a message bridge for Colony tasks.",
    readinessCriteria: [
      "Colony SDK available as dependency",
      "Agent registration endpoint returning Colony-compatible payloads",
      "Task distribution simulator operational",
    ],
    colonyHooks: ["agent.registration", "task.transport", "registry.sync"],
    status: "in-progress",
  },
  {
    id: "tokenization",
    title: "Phase 2 · Token Economics",
    purpose:
      "Model the token economy needed for creator rewards, DAO funding, and stake-backed participation.",
    readinessCriteria: [
      "Reward schedule documented",
      "Creator / agent split published",
      "Governance hooks available",
    ],
    colonyHooks: ["token.rewards", "dao.governance", "staking"],
    status: "in-progress",
  },
  {
    id: "decentralization",
    title: "Phase 3 · Decentralized Execution",
    purpose:
      "Shift job execution and settlement into Colony OS including storage and peer-to-peer payments.",
    readinessCriteria: [
      "Remote execution manifest exported",
      "Storage adapter defined",
      "Payment intent spec signed",
    ],
    colonyHooks: ["runtime.distribute", "p2p.settlement", "storage.pin"],
    status: "not-started",
  },
  {
    id: "advanced",
    title: "Phase 4 · Colony-Native Superpowers",
    purpose:
      "Enable multi-agent workflows, consensus, and bounties that operate purely on Colony primitives.",
    readinessCriteria: [
      "Consensus voting live",
      "Quality scoring feed published",
      "Bounty board accessible to the DAO",
    ],
    colonyHooks: ["workflow.multi", "consensus", "bounties"],
    status: "not-started",
  },
];

export const TOKEN_ECONOMICS: TokenEconomics = {
  ticker: "GDNX",
  supply: 1_000_000_000,
  emissionPerTask: 15,
  creatorRewardSplit: 0.55,
  agentRewardSplit: 0.3,
  daoTreasurySplit: 0.15,
  stakingTiers: [
    {
      id: "scout",
      label: "Scout",
      minimumStake: 250,
      perks: ["Early agent registration", "Daily task airdrops"],
    },
    {
      id: "architect",
      label: "Architect",
      minimumStake: 2_000,
      perks: ["Weighted governance", "Workflow orchestration access"],
    },
    {
      id: "savant",
      label: "Savant",
      minimumStake: 10_000,
      perks: ["Bounty creation", "DAO proposal sponsorship", "Priority storage replication"],
    },
  ],
};
