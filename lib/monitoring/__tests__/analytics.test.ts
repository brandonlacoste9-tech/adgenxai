// lib/monitoring/__tests__/analytics.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { trackAnalyticsEvent, trackPageView, trackUserAction } from "../analytics";

// Mock navigator.sendBeacon
const mockSendBeacon = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
  
  // Mock navigator.sendBeacon
  Object.defineProperty(global.navigator, "sendBeacon", {
    value: mockSendBeacon,
    writable: true,
    configurable: true,
  });
  
  // Mock window and document
  Object.defineProperty(global, "window", {
    value: {
      location: { href: "http://localhost:3000/test" },
    },
    writable: true,
    configurable: true,
  });
  
  Object.defineProperty(global, "document", {
    value: {
      referrer: "http://localhost:3000",
      title: "Test Page",
    },
    writable: true,
    configurable: true,
  });
});

describe("Analytics", () => {
  it("should track analytics event", () => {
    trackAnalyticsEvent("user_signup", { userId: "123" });
    
    expect(mockSendBeacon).toHaveBeenCalled();
    const callArgs = mockSendBeacon.mock.calls[0];
    expect(callArgs[0]).toContain("/api/analytics");
    
    const payload = JSON.parse(callArgs[1]);
    expect(payload.type).toBe("event");
    expect(payload.event).toBe("user_signup");
    expect(payload.properties.userId).toBe("123");
  });
  
  it("should track page view", () => {
    trackPageView("/dashboard", "Dashboard");
    
    expect(mockSendBeacon).toHaveBeenCalled();
    const payload = JSON.parse(mockSendBeacon.mock.calls[0][1]);
    expect(payload.event).toBe("page_view");
    expect(payload.properties.path).toBe("/dashboard");
    expect(payload.properties.title).toBe("Dashboard");
  });
  
  it("should track user action", () => {
    trackUserAction("button_click", { buttonId: "submit" });
    
    expect(mockSendBeacon).toHaveBeenCalled();
    const payload = JSON.parse(mockSendBeacon.mock.calls[0][1]);
    expect(payload.event).toBe("user_action");
    expect(payload.properties.action).toBe("button_click");
    expect(payload.properties.buttonId).toBe("submit");
  });
});
