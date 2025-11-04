/**
 * Streaming Metrics Hook
 * Provides real-time metrics for AI streaming operations
 */
import { useState, useEffect, useCallback } from 'react';

export interface StreamingMetrics {
  tokensPerSecond: number;
  latency: number;
  costPerToken: number;
  totalTokens: number;
  estimatedCost: number;
}

export function useStreamingMetrics() {
  const [metrics, setMetrics] = useState<StreamingMetrics>({
    tokensPerSecond: 0,
    latency: 0,
    costPerToken: 0,
    totalTokens: 0,
    estimatedCost: 0
  });

  const updateMetrics = useCallback((update: Partial<StreamingMetrics>) => {
    setMetrics(prev => ({ ...prev, ...update }));
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics({
      tokensPerSecond: 0,
      latency: 0,
      costPerToken: 0,
      totalTokens: 0,
      estimatedCost: 0
    });
  }, []);

  return { metrics, updateMetrics, resetMetrics };
}

export default useStreamingMetrics;
