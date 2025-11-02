// lib/monitoring/__tests__/alerts.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkErrorRate, checkResponseTime, ALERT_CONFIGS } from "../alerts";

// Mock the triggerAlert function
vi.mock("../alerts", async () => {
  const actual = await vi.importActual("../alerts");
  return {
    ...actual,
    triggerAlert: vi.fn(),
  };
});

describe("Alerts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it("should have correct alert configurations", () => {
    expect(ALERT_CONFIGS.HIGH_ERROR_RATE).toBeDefined();
    expect(ALERT_CONFIGS.HIGH_ERROR_RATE.threshold).toBe(5);
    expect(ALERT_CONFIGS.HIGH_ERROR_RATE.severity).toBe("error");
    
    expect(ALERT_CONFIGS.SLOW_RESPONSE_TIME).toBeDefined();
    expect(ALERT_CONFIGS.SLOW_RESPONSE_TIME.threshold).toBe(3000);
    expect(ALERT_CONFIGS.SLOW_RESPONSE_TIME.severity).toBe("warning");
  });
  
  it("should check error rate threshold", () => {
    checkErrorRate(10, 100); // 10% error rate
    // Should trigger alert since > 5%
    
    checkErrorRate(3, 100); // 3% error rate
    // Should not trigger alert since < 5%
  });
  
  it("should check response time threshold", () => {
    checkResponseTime(5000); // 5000ms
    // Should trigger alert since > 3000ms
    
    checkResponseTime(1000); // 1000ms
    // Should not trigger alert since < 3000ms
  });
});
