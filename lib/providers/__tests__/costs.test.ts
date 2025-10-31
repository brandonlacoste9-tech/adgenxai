import { describe, it, expect } from "vitest";
import { getCostInfo, calculateCost } from "../costs";

describe("Cost Calculator", () => {
  describe("getCostInfo", () => {
    it("returns zero cost for GitHub Models", () => {
      const info = getCostInfo("github", "gpt-4o-mini");
      expect(info.promptCostPer1K).toBe(0);
      expect(info.completionCostPer1K).toBe(0);
    });

    it("returns correct costs for OpenAI gpt-4o", () => {
      const info = getCostInfo("openai", "gpt-4o");
      expect(info.promptCostPer1K).toBe(0.005);
      expect(info.completionCostPer1K).toBe(0.015);
    });

    it("returns correct costs for OpenAI gpt-4o-mini", () => {
      const info = getCostInfo("openai", "gpt-4o-mini");
      expect(info.promptCostPer1K).toBe(0.00015);
      expect(info.completionCostPer1K).toBe(0.0006);
    });

    it("returns correct costs for OpenAI gpt-3.5-turbo", () => {
      const info = getCostInfo("openai", "gpt-3.5-turbo");
      expect(info.promptCostPer1K).toBe(0.0005);
      expect(info.completionCostPer1K).toBe(0.0015);
    });

    it("returns model name in cost info", () => {
      const info = getCostInfo("openai", "gpt-4o-mini");
      expect(info.model).toBe("gpt-4o-mini");
    });

    it("returns zero cost for unknown model", () => {
      const info = getCostInfo("openai", "unknown-model");
      expect(info.promptCostPer1K).toBe(0);
      expect(info.completionCostPer1K).toBe(0);
    });
  });

  describe("calculateCost", () => {
    it("calculates cost correctly for gpt-4o-mini", () => {
      // 100 prompt tokens + 50 completion tokens
      // (100/1000 * 0.00015) + (50/1000 * 0.0006) = 0.000015 + 0.00003 = 0.000045
      const cost = calculateCost("openai", "gpt-4o-mini", 100, 50);
      expect(cost).toBeCloseTo(0.000045);
    });

    it("calculates zero cost for GitHub Models", () => {
      const cost = calculateCost("github", "gpt-4o", 1000, 500);
      expect(cost).toBe(0);
    });

    it("calculates cost correctly for gpt-4o", () => {
      // 1000 prompt tokens + 500 completion tokens
      // (1000/1000 * 0.005) + (500/1000 * 0.015) = 0.005 + 0.0075 = 0.0125
      const cost = calculateCost("openai", "gpt-4o", 1000, 500);
      expect(cost).toBeCloseTo(0.0125);
    });

    it("handles zero tokens", () => {
      const cost = calculateCost("openai", "gpt-4o-mini", 0, 0);
      expect(cost).toBe(0);
    });

    it("handles large token counts", () => {
      const cost = calculateCost("openai", "gpt-4o-mini", 100000, 50000);
      expect(cost).toBeGreaterThan(0);
    });
  });
});
