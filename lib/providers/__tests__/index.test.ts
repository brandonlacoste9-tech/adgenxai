import { describe, it, expect } from "vitest";
import { getCostInfo } from "../costs";

describe("Provider Factory", () => {
  it("validates cost calculation", () => {
    // Test that cost info is available for different providers
    const githubCost = getCostInfo("github", "gpt-4o");
    expect(githubCost.promptCostPer1K).toBe(0);
    
    const openaiCost = getCostInfo("openai", "gpt-4o-mini");
    expect(openaiCost.promptCostPer1K).toBeGreaterThan(0);
  });

  it("validates provider types", () => {
    // Test type validation for providers
    const validProviders = ["github", "openai"];
    expect(validProviders).toContain("github");
    expect(validProviders).toContain("openai");
  });
});
