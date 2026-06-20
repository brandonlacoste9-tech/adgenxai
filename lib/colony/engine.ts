import { randomUUID } from "crypto";

import { COLONY_PHASES, TOKEN_ECONOMICS } from "./config";
import { colonySdk } from "./sdk";
import {
  ColonyAgentProfile,
  ColonyPhase,
  ColonyPhaseId,
  ColonyTask,
  GovernanceMotion,
  TokenEconomics,
  WorkflowThread,
} from "./types";

export interface AgentRegistrationInput {
  displayName: string;
  capabilities: { id: string; label: string; weight?: number }[];
  stake?: number;
  reputation?: number;
  webhookUrl?: string;
  inboxEndpoint?: string;
  origin?: ColonyAgentProfile["origin"];
}

export interface TaskCreationInput {
  phase: ColonyPhaseId;
  description: string;
  payload?: Record<string, unknown>;
  reward?: number;
  requiredCapabilities?: string[];
}

class ColonyIntegrationEngine {
  constructor(
    private readonly phases: ColonyPhase[],
    private readonly tokenEconomics: TokenEconomics,
  ) {}

  registerAgent(input: AgentRegistrationInput) {
    if (!input?.displayName) {
      throw new Error("displayName is required for Colony agent registration");
    }

    const agent = colonySdk.registerAgent({
      id: `agent_${randomUUID()}`,
      displayName: input.displayName,
      capabilities: input.capabilities.map((capability) => ({
        ...capability,
        weight: capability.weight ?? 1,
      })),
      origin: input.origin ?? "adgenxai",
      stake: input.stake ?? 0,
      reputation: input.reputation ?? 0,
      webhookUrl: input.webhookUrl,
      inboxEndpoint: input.inboxEndpoint,
    });

    return {
      agent,
      phases: this.phases,
      tokenEconomics: this.tokenEconomics,
    };
  }

  createTask(input: TaskCreationInput) {
    if (!input?.description) {
      throw new Error("Task description is required");
    }

    const task: ColonyTask = {
      id: `task_${randomUUID()}`,
      phase: input.phase ?? "integration",
      description: input.description,
      payload: input.payload ?? {},
      reward: input.reward ?? this.tokenEconomics.emissionPerTask,
      bountyToken: this.tokenEconomics.ticker,
      requiredCapabilities: input.requiredCapabilities ?? [],
    };

    const distribution = colonySdk.distributeTask(task);
    return distribution;
  }

  recordWorkflow(thread: WorkflowThread) {
    return colonySdk.upsertWorkflow(thread);
  }

  publishMotion(motion: GovernanceMotion) {
    return colonySdk.upsertMotion(motion);
  }

  summarizeIntegration() {
    return {
      phases: this.phases,
      tokenEconomics: this.tokenEconomics,
      agents: colonySdk.listAgents(),
      workflows: colonySdk.listWorkflows(),
      tasks: colonySdk.listTasks(),
      motions: colonySdk.listMotions(),
    };
  }
}

export const colonyEngine = new ColonyIntegrationEngine(
  COLONY_PHASES,
  TOKEN_ECONOMICS,
);
