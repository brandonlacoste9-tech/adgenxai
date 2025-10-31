// Token cost calculations for different providers
// Costs are approximate and based on per-1K tokens pricing

export interface CostInfo {
  /** Cost per 1K prompt tokens in USD */
  promptCostPer1K: number;
  /** Cost per 1K completion tokens in USD */
  completionCostPer1K: number;
  /** Model name */
  model: string;
}

/**
 * Get cost information for a given provider and model
 */
export function getCostInfo(provider: "github" | "openai", model: string): CostInfo {
  // GitHub Models pricing (free tier, then standard rates)
  // Note: GitHub Models provides free access during preview
  if (provider === "github") {
    if (model.includes("gpt-4o")) {
      return {
        model,
        promptCostPer1K: 0.0, // Free during preview
        completionCostPer1K: 0.0, // Free during preview
      };
    }
    return {
      model,
      promptCostPer1K: 0.0,
      completionCostPer1K: 0.0,
    };
  }

  // OpenAI pricing (as of 2024)
  if (provider === "openai") {
    if (model === "gpt-4o") {
      return {
        model,
        promptCostPer1K: 0.005, // $5.00 per 1M tokens
        completionCostPer1K: 0.015, // $15.00 per 1M tokens
      };
    }
    if (model === "gpt-4o-mini") {
      return {
        model,
        promptCostPer1K: 0.00015, // $0.150 per 1M tokens
        completionCostPer1K: 0.0006, // $0.600 per 1M tokens
      };
    }
    if (model.includes("gpt-3.5-turbo")) {
      return {
        model,
        promptCostPer1K: 0.0005, // $0.50 per 1M tokens
        completionCostPer1K: 0.0015, // $1.50 per 1M tokens
      };
    }
  }

  // Default fallback
  return {
    model,
    promptCostPer1K: 0.0,
    completionCostPer1K: 0.0,
  };
}

/**
 * Calculate total cost for a completion
 */
export function calculateCost(
  provider: "github" | "openai",
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const costs = getCostInfo(provider, model);
  const promptCost = (promptTokens / 1000) * costs.promptCostPer1K;
  const completionCost = (completionTokens / 1000) * costs.completionCostPer1K;
  return promptCost + completionCost;
}
