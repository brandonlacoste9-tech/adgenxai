export type ColonyPhaseId =
  | "integration"
  | "tokenization"
  | "decentralization"
  | "advanced";

export interface ColonyPhase {
  id: ColonyPhaseId;
  title: string;
  purpose: string;
  readinessCriteria: string[];
  colonyHooks: string[];
  status: "not-started" | "in-progress" | "ready";
}

export interface AgentCapability {
  id: string;
  label: string;
  weight: number; // used for scoring in task distribution
}

export interface ColonyAgentProfile {
  id: string;
  displayName: string;
  origin: "adgenxai" | "colony" | "partner";
  capabilities: AgentCapability[];
  stake: number;
  reputation: number;
  webhookUrl?: string;
  inboxEndpoint?: string;
  metadata?: Record<string, unknown>;
}

export interface WorkflowThread {
  id: string;
  title: string;
  participatingAgents: string[];
  currentPhase: ColonyPhaseId;
  consensusTarget: number; // percent agreement required
}

export interface ColonyTask {
  id: string;
  phase: ColonyPhaseId;
  description: string;
  payload: Record<string, unknown>;
  reward: number;
  bountyToken: string;
  requiredCapabilities: string[];
  qualityScore?: QualityScore;
}

export interface QualityScore {
  signal: number; // 0-1 normalized signal from distributed scoring
  reviewers: number;
  rationale: string;
}

export interface TokenEconomics {
  ticker: string;
  supply: number;
  emissionPerTask: number;
  creatorRewardSplit: number;
  agentRewardSplit: number;
  daoTreasurySplit: number;
  stakingTiers: StakeTier[];
}

export interface StakeTier {
  id: string;
  label: string;
  minimumStake: number;
  perks: string[];
}

export interface GovernanceMotion {
  id: string;
  title: string;
  status: "draft" | "open" | "closed";
  quorumRequired: number;
  votesFor: number;
  votesAgainst: number;
  metadata?: Record<string, unknown>;
}

export interface ConsensusVote {
  taskId: string;
  agentId: string;
  signal: number; // -1 to 1
  confidence: number; // 0-1
}
