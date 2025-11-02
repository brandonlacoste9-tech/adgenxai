// lib/monitoring/performance.ts - Performance monitoring utilities
import { onCLS, onLCP, onFCP, onTTFB, Metric } from "web-vitals";
import { trackEvent } from "./sentry";

/**
 * Core Web Vitals thresholds (in milliseconds)
 */
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

/**
 * Get rating for a metric
 */
function getRating(metric: Metric): "good" | "needs-improvement" | "poor" {
  const threshold = THRESHOLDS[metric.name as keyof typeof THRESHOLDS];
  if (!threshold) return "good";
  
  if (metric.value <= threshold.good) return "good";
  if (metric.value <= threshold.needsImprovement) return "needs-improvement";
  return "poor";
}

/**
 * Send metric to analytics
 */
function sendToAnalytics(metric: Metric) {
  const rating = getRating(metric);
  
  // Track in Sentry
  trackEvent(`web-vital-${metric.name}`, {
    value: metric.value,
    rating,
    id: metric.id,
    navigationType: metric.navigationType,
  });
  
  // Send to custom analytics endpoint
  if (typeof window !== "undefined") {
    navigator.sendBeacon?.(
      "/api/analytics?action=track",
      JSON.stringify({
        type: "web-vital",
        metric: metric.name,
        value: metric.value,
        rating,
        timestamp: Date.now(),
      })
    );
  }
}

/**
 * Initialize Core Web Vitals monitoring
 */
export function initWebVitals() {
  if (typeof window === "undefined") return;
  
  onCLS(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}

/**
 * Track custom performance metric
 */
export function trackPerformance(name: string, value: number, metadata?: Record<string, any>) {
  trackEvent(`performance-${name}`, {
    value,
    ...metadata,
    timestamp: Date.now(),
  });
}

/**
 * Measure and track function execution time
 */
export async function measureExecutionTime<T>(
  name: string,
  fn: () => Promise<T> | T
): Promise<T> {
  const start = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    trackPerformance(name, duration, { status: "success" });
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    
    trackPerformance(name, duration, { 
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    });
    
    throw error;
  }
}

/**
 * Track API response time
 */
export function trackAPIResponseTime(
  endpoint: string,
  method: string,
  duration: number,
  status: number
) {
  trackPerformance(`api-${method}-${endpoint}`, duration, {
    method,
    endpoint,
    status,
  });
}

/**
 * Monitor memory usage (if available)
 */
export function getMemoryUsage(): number | null {
  if (typeof window === "undefined") return null;
  
  const memory = (performance as any).memory;
  if (!memory) return null;
  
  return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
}

/**
 * Track memory usage periodically
 */
export function startMemoryMonitoring(intervalMs: number = 60000) {
  if (typeof window === "undefined") return;
  
  const interval = setInterval(() => {
    const usage = getMemoryUsage();
    if (usage !== null) {
      trackPerformance("memory-usage", usage * 100);
    }
  }, intervalMs);
  
  return () => clearInterval(interval);
}
