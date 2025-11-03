import { useCallback } from "react";

export interface StreamingMetric {
  model: string;
  latency: number;
  totalDuration: number;
  tokensGenerated: number;
  wasAborted: boolean;
  status: "success" | "error" | "aborted";
}

/**
 * Hook for recording streaming metrics
 * Stores metrics in localStorage for persistence
 */
export function useStreamingMetrics() {
  const recordMetric = useCallback((metric: StreamingMetric) => {
    try {
      // Get existing metrics from localStorage
      const existingMetrics = localStorage.getItem("streamingMetrics");
      const metrics: StreamingMetric[] = existingMetrics
        ? JSON.parse(existingMetrics)
        : [];

      // Add new metric with timestamp
      metrics.push({
        ...metric,
        timestamp: Date.now(),
      } as any);

      // Keep only last 100 metrics to avoid bloating localStorage
      const recentMetrics = metrics.slice(-100);

      // Save back to localStorage
      localStorage.setItem("streamingMetrics", JSON.stringify(recentMetrics));

      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.log("Streaming metric recorded:", metric);
      }
    } catch (error) {
      // Silently fail if localStorage is not available
      console.error("Failed to record streaming metric:", error);
    }
  }, []);

  const getMetrics = useCallback((): StreamingMetric[] => {
    try {
      const existingMetrics = localStorage.getItem("streamingMetrics");
      return existingMetrics ? JSON.parse(existingMetrics) : [];
    } catch (error) {
      console.error("Failed to get streaming metrics:", error);
      return [];
    }
  }, []);

  const clearMetrics = useCallback(() => {
    try {
      localStorage.removeItem("streamingMetrics");
    } catch (error) {
      console.error("Failed to clear streaming metrics:", error);
    }
  }, []);

  return {
    recordMetric,
    getMetrics,
    clearMetrics,
  };
}
