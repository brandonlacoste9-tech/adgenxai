import { randomUUID } from "crypto";

import {
  ColonyAgentProfile,
  ColonyTask,
  ConsensusVote,
  GovernanceMotion,
  QualityScore,
  WorkflowThread,
} from "./types";

interface RegisteredAgent extends ColonyAgentProfile {
  registeredAt: number;
  tokenBalance: number;
}

interface TaskRecord extends ColonyTask {
  assignedAgent?: string;
  status: "pending" | "assigned" | "complete";
  votes: ConsensusVote[];
}

export class InMemoryColonySDK {
  private agents = new Map<string, RegisteredAgent>();
  private tasks = new Map<string, TaskRecord>();
  private workflows = new Map<string, WorkflowThread>();
  private governance = new Map<string, GovernanceMotion>();

  registerAgent(profile: ColonyAgentProfile): RegisteredAgent {
    const agent: RegisteredAgent = {
      ...profile,
      registeredAt: Date.now(),
      tokenBalance: 0,
    };

    this.agents.set(agent.id, agent);
    return agent;
  }

  listAgents(): RegisteredAgent[] {
    return Array.from(this.agents.values());
  }

  upsertWorkflow(thread: WorkflowThread): WorkflowThread {
    this.workflows.set(thread.id, thread);
    return thread;
  }

  listWorkflows(): WorkflowThread[] {
    return Array.from(this.workflows.values());
  }

  distributeTask(task: ColonyTask): TaskRecord {
    const agent = this.pickAgent(task);
    const record: TaskRecord = {
      ...task,
      assignedAgent: agent?.id,
      status: agent ? "assigned" : "pending",
      votes: [],
    };

    this.tasks.set(task.id, record);
    return record;
  }

  recordVote(vote: ConsensusVote): TaskRecord | undefined {
    const task = this.tasks.get(vote.taskId);
    if (!task) return undefined;

    const filteredVotes = task.votes.filter((v) => v.agentId !== vote.agentId);
    filteredVotes.push(vote);

    const signalSum = filteredVotes.reduce(
      (acc, current) => acc + current.signal * current.confidence,
      0,
    );
    const confidenceSum = filteredVotes.reduce(
      (acc, current) => acc + current.confidence,
      0,
    );

    const quality: QualityScore = {
      signal: confidenceSum === 0 ? 0 : signalSum / confidenceSum,
      reviewers: filteredVotes.length,
      rationale: "Consensus synthesized via in-memory Colony SDK",
    };

    const updated: TaskRecord = {
      ...task,
      votes: filteredVotes,
      qualityScore: quality,
    };

    this.tasks.set(task.id, updated);
    return updated;
  }

  completeTask(taskId: string, reward: number): TaskRecord | undefined {
    const task = this.tasks.get(taskId);
    if (!task) return undefined;

    const agent = task.assignedAgent ? this.agents.get(task.assignedAgent) : undefined;
    if (agent) {
      agent.tokenBalance += reward;
      this.agents.set(agent.id, agent);
    }

    const updated: TaskRecord = { ...task, status: "complete" };
    this.tasks.set(taskId, updated);
    return updated;
  }

  listTasks(): TaskRecord[] {
    return Array.from(this.tasks.values());
  }

  upsertMotion(motion: GovernanceMotion): GovernanceMotion {
    const id = motion.id ?? randomUUID();
    const stored: GovernanceMotion = { ...motion, id };
    this.governance.set(id, stored);
    return stored;
  }

  listMotions(): GovernanceMotion[] {
    return Array.from(this.governance.values());
  }

  private pickAgent(task: ColonyTask): RegisteredAgent | undefined {
    const allAgents = Array.from(this.agents.values());
    if (allAgents.length === 0) return undefined;

    const scored = allAgents
      .map((agent) => {
        const capabilityScore = task.requiredCapabilities.reduce((score, capabilityId) => {
          const capability = agent.capabilities.find((c) => c.id === capabilityId);
          return score + (capability ? capability.weight : 0);
        }, 0);

        const weightedStake = agent.stake * 0.25;
        const weightedReputation = agent.reputation * 0.5;

        return {
          agent,
          score: capabilityScore + weightedStake + weightedReputation,
        };
      })
      .sort((a, b) => b.score - a.score);

    return scored[0]?.agent;
  }
}

export const colonySdk = new InMemoryColonySDK();
