// lib/monitoring/security.ts - Security monitoring and audit logging

import { reportSecurityIncident } from "./alerts";
import { captureError } from "./sentry";

/**
 * Security event types
 */
export type SecurityEvent =
  | "failed_authentication"
  | "suspicious_api_usage"
  | "rate_limit_exceeded"
  | "invalid_token"
  | "unauthorized_access"
  | "data_access"
  | "permission_denied";

/**
 * Track security event
 */
export function trackSecurityEvent(
  event: SecurityEvent,
  details: Record<string, any>
) {
  const logEntry = {
    type: "security_event",
    event,
    details,
    timestamp: new Date().toISOString(),
    ip: details.ip || "unknown",
    userAgent: details.userAgent || "unknown",
  };
  
  // Log to console
  console.warn(JSON.stringify(logEntry));
  
  // Track in Sentry
  captureError(new Error(`Security Event: ${event}`), logEntry);
  
  // Check if this is a critical security incident
  if (
    event === "suspicious_api_usage" ||
    event === "unauthorized_access"
  ) {
    reportSecurityIncident(event, details);
  }
}

/**
 * Track failed authentication attempts
 */
const failedAuthAttempts = new Map<string, number[]>();

export function trackFailedAuth(
  identifier: string,
  details: Record<string, any>
) {
  const now = Date.now();
  const attempts = failedAuthAttempts.get(identifier) || [];
  
  // Keep only attempts from last 15 minutes
  const recentAttempts = attempts.filter(time => now - time < 15 * 60 * 1000);
  recentAttempts.push(now);
  
  failedAuthAttempts.set(identifier, recentAttempts);
  
  trackSecurityEvent("failed_authentication", {
    identifier,
    attemptCount: recentAttempts.length,
    ...details,
  });
  
  // Alert if too many failed attempts
  if (recentAttempts.length >= 5) {
    reportSecurityIncident("Multiple failed authentication attempts", {
      identifier,
      attemptCount: recentAttempts.length,
      timeWindow: "15 minutes",
    });
  }
}

/**
 * Track API rate limit violations
 */
const rateLimitViolations = new Map<string, number[]>();

export function trackRateLimitViolation(
  identifier: string,
  endpoint: string,
  details?: Record<string, any>
) {
  const now = Date.now();
  const violations = rateLimitViolations.get(identifier) || [];
  
  // Keep only violations from last hour
  const recentViolations = violations.filter(time => now - time < 60 * 60 * 1000);
  recentViolations.push(now);
  
  rateLimitViolations.set(identifier, recentViolations);
  
  trackSecurityEvent("rate_limit_exceeded", {
    identifier,
    endpoint,
    violationCount: recentViolations.length,
    ...details,
  });
  
  // Alert if excessive violations
  if (recentViolations.length >= 10) {
    reportSecurityIncident("Excessive rate limit violations", {
      identifier,
      endpoint,
      violationCount: recentViolations.length,
      timeWindow: "1 hour",
    });
  }
}

/**
 * Track suspicious API usage patterns
 */
export function trackSuspiciousAPI(
  pattern: string,
  details: Record<string, any>
) {
  trackSecurityEvent("suspicious_api_usage", {
    pattern,
    ...details,
  });
  
  // Immediate alert for suspicious patterns
  reportSecurityIncident(`Suspicious API pattern detected: ${pattern}`, details);
}

/**
 * Track data access for audit trail
 */
export function auditDataAccess(
  resource: string,
  action: "read" | "write" | "delete",
  userId?: string,
  metadata?: Record<string, any>
) {
  const auditEntry = {
    type: "audit_log",
    resource,
    action,
    userId: userId || "anonymous",
    timestamp: new Date().toISOString(),
    ...metadata,
  };
  
  console.log(JSON.stringify(auditEntry));
  
  trackSecurityEvent("data_access", auditEntry);
}

/**
 * Track unauthorized access attempts
 */
export function trackUnauthorizedAccess(
  resource: string,
  userId?: string,
  details?: Record<string, any>
) {
  trackSecurityEvent("unauthorized_access", {
    resource,
    userId: userId || "anonymous",
    ...details,
  });
}

/**
 * Detect and track potential DDoS patterns
 */
const requestCounts = new Map<string, number[]>();

export function detectDDoS(
  identifier: string,
  threshold: number = 100
): boolean {
  const now = Date.now();
  const requests = requestCounts.get(identifier) || [];
  
  // Keep only requests from last minute
  const recentRequests = requests.filter(time => now - time < 60 * 1000);
  recentRequests.push(now);
  
  requestCounts.set(identifier, recentRequests);
  
  // Check if threshold exceeded
  if (recentRequests.length > threshold) {
    trackSuspiciousAPI("Potential DDoS attack", {
      identifier,
      requestCount: recentRequests.length,
      timeWindow: "1 minute",
      threshold,
    });
    return true;
  }
  
  return false;
}

/**
 * Validate and sanitize input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  // Basic XSS prevention
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate API token format
 */
export function validateTokenFormat(token: string): boolean {
  // Basic token format validation
  if (!token || token.length < 32) {
    trackSecurityEvent("invalid_token", {
      reason: "Token too short",
      length: token?.length || 0,
    });
    return false;
  }
  
  // Check for suspicious patterns
  if (token.includes("..") || token.includes("//")) {
    trackSecurityEvent("invalid_token", {
      reason: "Suspicious token pattern",
    });
    return false;
  }
  
  return true;
}

/**
 * Clean up old tracking data periodically
 */
export function cleanupSecurityTracking() {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  
  // Clean failed auth attempts
  for (const [key, attempts] of failedAuthAttempts.entries()) {
    const recent = attempts.filter(time => time > oneHourAgo);
    if (recent.length === 0) {
      failedAuthAttempts.delete(key);
    } else {
      failedAuthAttempts.set(key, recent);
    }
  }
  
  // Clean rate limit violations
  for (const [key, violations] of rateLimitViolations.entries()) {
    const recent = violations.filter(time => time > oneHourAgo);
    if (recent.length === 0) {
      rateLimitViolations.delete(key);
    } else {
      rateLimitViolations.set(key, recent);
    }
  }
  
  // Clean request counts
  for (const [key, requests] of requestCounts.entries()) {
    const recent = requests.filter(time => time > oneHourAgo);
    if (recent.length === 0) {
      requestCounts.delete(key);
    } else {
      requestCounts.set(key, recent);
    }
  }
}

// Run cleanup every hour
if (typeof setInterval !== "undefined") {
  setInterval(cleanupSecurityTracking, 60 * 60 * 1000);
}
