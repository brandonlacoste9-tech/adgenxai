/**
 * Video Generation Telemetry
 * 
 * Tracks video generation requests across all providers
 * for observability, cost tracking, and performance monitoring.
 */

export interface VideoGenerationEvent {
  requestId: string;
  provider: 'longcat' | 'sora' | 'runway' | 'pika';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  promptLength: number;
  duration?: number;
  latencyMs: number;
  errorCode?: string;
  errorMessage?: string;
  videoDurationSeconds?: number;
  costEstimate?: number; // USD
  metadata?: Record<string, unknown>;
}

/**
 * Track video generation event
 * 
 * Usage:
 * ```typescript
 * trackVideoGeneration({
 *   requestId: req.id,
 *   provider: 'longcat',
 *   status: 'completed',
 *   promptLength: 120,
 *   latencyMs: 2500,
 *   videoDurationSeconds: 10,
 *   costEstimate: 0.12
 * });
 * ```
 */
export function trackVideoGeneration(event: VideoGenerationEvent): void {
  // For now, log to console (structured JSON)
  // In production, send to your telemetry backend (Segment, Datadog, Mixpanel, etc.)
  
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({
    type: 'video_generation_request',
    timestamp: new Date().toISOString(),
    ...event,
  }));

  // TODO: Replace with your telemetry backend
  // Example: segment.track('video_generation_request', event);
  // Example: datadog.api.v2.logs.submitLog({ body: { ...event } });
}

/**
 * Estimate cost for a video generation request
 */
export function estimateCost(
  provider: 'longcat' | 'sora' | 'runway' | 'pika',
  durationSeconds: number
): number {
  const costPerSecond: Record<string, number> = {
    longcat: 0.12,
    sora: 0.15,
    runway: 0.10,
    pika: 0.08,
  };

  return (costPerSecond[provider] ?? 0.12) * durationSeconds;
}

/**
 * Track request correlation across layers
 * Helps tie frontend request → API → LongCat → response
 */
export function generateRequestId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
