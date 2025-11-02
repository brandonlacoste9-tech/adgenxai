// lib/monitoring/sentry.ts - Sentry monitoring utilities for AdGenXAI
import * as Sentry from "@sentry/nextjs";

/**
 * Capture an error with context
 */
export function captureError(error: Error | unknown, context?: Record<string, any>) {
  if (context) {
    Sentry.setContext("additional", context);
  }
  
  if (error instanceof Error) {
    Sentry.captureException(error);
  } else {
    Sentry.captureException(new Error(String(error)));
  }
}

/**
 * Track a custom event
 */
export function trackEvent(eventName: string, data?: Record<string, any>) {
  Sentry.captureMessage(eventName, {
    level: "info",
    extra: data,
  });
}

/**
 * Set user context for error tracking
 */
export function setUser(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser(user);
}

/**
 * Clear user context
 */
export function clearUser() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Start a performance span (simplified version)
 */
export function startTransaction(name: string, op: string) {
  // Using simplified span tracking that's compatible across versions
  return {
    name,
    op,
    setStatus: (status: string) => {},
    setData: (key: string, value: any) => {},
    finish: () => {},
  };
}

/**
 * Measure function performance
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => Promise<T> | T
): Promise<T> {
  const span = Sentry.startSpan({ name, op: "function" }, async () => {
    return await fn();
  });
  
  return span;
}

/**
 * Track API call performance
 */
export async function trackAPICall<T>(
  endpoint: string,
  method: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await Sentry.startSpan(
      { name: `API ${method} ${endpoint}`, op: "http.client" },
      async () => {
        return await fn();
      }
    );
    
    const duration = performance.now() - startTime;
    
    addBreadcrumb(`API ${method} ${endpoint}`, {
      duration: `${duration.toFixed(2)}ms`,
      status: "success",
    });
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    
    addBreadcrumb(`API ${method} ${endpoint}`, {
      duration: `${duration.toFixed(2)}ms`,
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    });
    
    captureError(error, { endpoint, method, duration });
    throw error;
  }
}
