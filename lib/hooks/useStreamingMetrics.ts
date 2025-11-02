import { useCallback } from 'react';

interface StreamingMetric {
  model: string;
  latency: number;
  totalDuration: number;
  tokensGenerated: number;
  wasAborted: boolean;
  status: 'success' | 'error' | 'aborted';
}

interface UseStreamingMetrics {
  recordMetric: (metric: StreamingMetric) => void;
}

export function useStreamingMetrics(): UseStreamingMetrics {
  const recordMetric = useCallback((metric: StreamingMetric) => {
    // Log metrics for debugging/monitoring
    console.log('Streaming Metric:', {
      model: metric.model,
      latency: `${metric.latency}ms`,
      totalDuration: `${metric.totalDuration}ms`,
      tokensGenerated: metric.tokensGenerated,
      wasAborted: metric.wasAborted,
      status: metric.status,
      tokensPerSecond: metric.totalDuration > 0 ? 
        (metric.tokensGenerated / (metric.totalDuration / 1000)).toFixed(2) : '0'
    });

    // TODO: Send to analytics service when integrated
    // Example: Analytics.track('chat_completion', metric);
  }, []);

  return { recordMetric };
}