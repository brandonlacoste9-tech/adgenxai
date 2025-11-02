import { useCallback } from "react";

export interface StreamingMetric {
  model: string;
  latency: number;
  totalDuration: number;
  tokensGenerated: number;
  wasAborted: boolean;
  status: "success" | "error" | "aborted";
}

export function useStreamingMetrics() {
  const recordMetric = useCallback((metric: StreamingMetric) => {
    // Log metrics for monitoring/analytics
    // In production, this could send to an analytics service
    console.log("[Streaming Metric]", metric);
  }, []);

  return { recordMetric };
}
