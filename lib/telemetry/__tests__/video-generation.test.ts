import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  trackVideoGeneration,
  estimateCost,
  generateRequestId,
  type VideoGenerationEvent,
} from '../video-generation';

describe('Video Generation Telemetry', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('trackVideoGeneration', () => {
    it('should log video generation event with timestamp', () => {
      const event: VideoGenerationEvent = {
        requestId: 'req-123',
        provider: 'longcat',
        status: 'completed',
        promptLength: 120,
        duration: 10,
        latencyMs: 2500,
        videoDurationSeconds: 10,
        costEstimate: 1.2,
      };

      trackVideoGeneration(event);

      expect(console.log).toHaveBeenCalledOnce();
      const logged = (console.log as any).mock.calls[0][0];
      const parsed = JSON.parse(logged);

      expect(parsed).toMatchObject({
        type: 'video_generation_request',
        ...event,
      });
      expect(parsed.timestamp).toBeTruthy();
    });

    it('should include error details when request fails', () => {
      const event: VideoGenerationEvent = {
        requestId: 'req-456',
        provider: 'sora',
        status: 'failed',
        promptLength: 80,
        latencyMs: 1200,
        errorCode: 'RATE_LIMITED',
        errorMessage: 'Too many requests',
      };

      trackVideoGeneration(event);

      const logged = (console.log as any).mock.calls[0][0];
      const parsed = JSON.parse(logged);

      expect(parsed.status).toBe('failed');
      expect(parsed.errorCode).toBe('RATE_LIMITED');
      expect(parsed.errorMessage).toBe('Too many requests');
    });

    it('should handle optional metadata', () => {
      const event: VideoGenerationEvent = {
        requestId: 'req-789',
        provider: 'runway',
        status: 'processing',
        promptLength: 150,
        latencyMs: 800,
        metadata: {
          aspectRatio: '16:9',
          style: 'cinematic',
          quality: 'high',
        },
      };

      trackVideoGeneration(event);

      const logged = (console.log as any).mock.calls[0][0];
      const parsed = JSON.parse(logged);

      expect(parsed.metadata).toEqual({
        aspectRatio: '16:9',
        style: 'cinematic',
        quality: 'high',
      });
    });
  });

  describe('estimateCost', () => {
    it('should estimate cost based on provider and duration', () => {
      expect(estimateCost('longcat', 10)).toBe(1.2);
      expect(estimateCost('sora', 10)).toBe(1.5);
      expect(estimateCost('runway', 10)).toBe(1.0);
      expect(estimateCost('pika', 10)).toBe(0.8);
    });

    it('should handle edge cases', () => {
      expect(estimateCost('longcat', 0)).toBe(0);
      expect(estimateCost('longcat', 30)).toBe(3.6);
      expect(estimateCost('longcat', 60)).toBe(7.2);
    });

    it('should default to longcat cost for unknown provider', () => {
      // @ts-expect-error Testing fallback behavior
      expect(estimateCost('unknown-provider', 10)).toBe(1.2);
    });
  });

  describe('generateRequestId', () => {
    it('should generate unique request IDs', () => {
      const id1 = generateRequestId();
      const id2 = generateRequestId();

      expect(id1).toMatch(/^req-\d+-[a-z0-9]+$/);
      expect(id2).toMatch(/^req-\d+-[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it('should include timestamp prefix', () => {
      const beforeTime = Date.now();
      const id = generateRequestId();
      const afterTime = Date.now();

      const timestampStr = id.split('-')[1];
      const timestamp = parseInt(timestampStr, 10);

      expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(timestamp).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('Telemetry integration scenarios', () => {
    it('should track complete video generation lifecycle', () => {
      const requestId = generateRequestId();

      // Initial request
      trackVideoGeneration({
        requestId,
        provider: 'longcat',
        status: 'queued',
        promptLength: 100,
        latencyMs: 50,
      });

      // Processing update
      trackVideoGeneration({
        requestId,
        provider: 'longcat',
        status: 'processing',
        promptLength: 100,
        latencyMs: 5000,
        metadata: { progress: 45 },
      });

      // Completion
      trackVideoGeneration({
        requestId,
        provider: 'longcat',
        status: 'completed',
        promptLength: 100,
        duration: 10,
        latencyMs: 12000,
        videoDurationSeconds: 10,
        costEstimate: estimateCost('longcat', 10),
      });

      expect(console.log).toHaveBeenCalledTimes(3);
    });

    it('should track error with cost implications', () => {
      const requestId = generateRequestId();

      trackVideoGeneration({
        requestId,
        provider: 'sora',
        status: 'failed',
        promptLength: 200,
        latencyMs: 15000,
        errorCode: 'TIMEOUT',
        errorMessage: 'Generation exceeded 15s timeout',
        costEstimate: 0, // Failed requests often don't charge
      });

      const logged = (console.log as any).mock.calls[0][0];
      const parsed = JSON.parse(logged);

      expect(parsed.costEstimate).toBe(0);
      expect(parsed.errorCode).toBe('TIMEOUT');
    });
  });
});
