// lib/monitoring/__tests__/security.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { sanitizeInput, validateTokenFormat, detectDDoS } from "../security";

describe("Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it("should sanitize XSS input", () => {
    const malicious = '<script>alert("XSS")</script>';
    const sanitized = sanitizeInput(malicious);
    
    expect(sanitized).not.toContain("<script>");
    expect(sanitized).toContain("&lt;script&gt;");
  });
  
  it("should sanitize quotes", () => {
    const input = 'Test "quotes" and \'apostrophes\'';
    const sanitized = sanitizeInput(input);
    
    expect(sanitized).toContain("&quot;");
    expect(sanitized).toContain("&#x27;");
  });
  
  it("should validate token format - valid token", () => {
    const validToken = "a".repeat(32);
    expect(validateTokenFormat(validToken)).toBe(true);
  });
  
  it("should validate token format - too short", () => {
    const shortToken = "abc123";
    expect(validateTokenFormat(shortToken)).toBe(false);
  });
  
  it("should validate token format - suspicious patterns", () => {
    const suspiciousToken = "a".repeat(32) + "..";
    expect(validateTokenFormat(suspiciousToken)).toBe(false);
  });
  
  it("should detect DDoS pattern", () => {
    const identifier = "test-ip";
    const threshold = 10;
    
    // First few requests should not trigger
    for (let i = 0; i < threshold; i++) {
      const result = detectDDoS(identifier, threshold);
      expect(result).toBe(false);
    }
    
    // Exceeding threshold should trigger
    const result = detectDDoS(identifier, threshold);
    expect(result).toBe(true);
  });
});
