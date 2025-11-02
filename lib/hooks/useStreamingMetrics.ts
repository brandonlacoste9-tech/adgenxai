import { useCallback, useRef } from 'react';

export interface StreamingMetric {
  timestamp: number;
  type: 'generation' | 'persona' | 'export';
  duration: number;
  success: boolean;
  metadata?: Record<string, any>;
}

export function useStreamingMetrics() {
  const metricsRef = useRef<StreamingMetric[]>([]);

  const recordMetric = useCallback((metric: Omit<StreamingMetric, 'timestamp'>) => {
    const fullMetric: StreamingMetric = {
      ...metric,
      timestamp: Date.now(),
    };
    
    metricsRef.current.push(fullMetric);
    
    // Optional: log for debugging
    console.log('Streaming metric recorded:', fullMetric);
    
    // Keep only last 100 metrics to prevent memory leaks
    if (metricsRef.current.length > 100) {
      metricsRef.current = metricsRef.current.slice(-100);
    }
  }, []);

  const getMetrics = useCallback(() => {
    return [...metricsRef.current];
  }, []);

  const clearMetrics = useCallback(() => {
    metricsRef.current = [];
  }, []);

  return {
    recordMetric,
    getMetrics,
    clearMetrics,
  };
}