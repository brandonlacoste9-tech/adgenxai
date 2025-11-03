interface TelemetryEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp?: string;
  requestId?: string;
}

interface TelemetryConfig {
  enabled: boolean;
  endpoint?: string;
  apiKey?: string;
  sampleRate?: number; // 0.0 to 1.0 for sampling
}

class TelemetryClient {
  private config: TelemetryConfig;

  constructor(config: TelemetryConfig) {
    this.config = {
      sampleRate: 1.0, // Default: capture all events
      ...config,
    };
  }

  track(event: string, properties: Record<string, unknown> = {}, requestId?: string): void {
    if (!this.config.enabled) {
      return;
    }

    // Sample events if rate < 1.0
    if (Math.random() > this.config.sampleRate) {
      return;
    }

    const telemetryEvent: TelemetryEvent = {
      event,
      properties: {
        ...properties,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
      requestId,
    };

    // Fire-and-forget - don't block the main request
    this.sendEvent(telemetryEvent).catch(error => {
      // Silent failure - telemetry should never break the app
      if (process.env.DEBUG_LONGCAT === '1') {
        console.warn('Telemetry failed:', error.message || error);
      }
    });
  }

  private async sendEvent(event: TelemetryEvent): Promise<void> {
    if (!this.config.endpoint) {
      // Development mode - just log to console
      if (process.env.DEBUG_LONGCAT === '1') {
        console.log('Telemetry:', event);
      }
      return;
    }

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify(event),
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (!response.ok) {
        // Log the failure but don't throw (so telemetry never breaks the app)
        if (process.env.DEBUG_LONGCAT === '1') {
          const responseText = await response.text().catch(() => 'Unable to read response');
          console.warn('Telemetry send failed:', response.status, responseText);
        }
      }
    } catch (err: any) {
      // Silent in prod, but log in debug mode
      if (process.env.DEBUG_LONGCAT === '1') {
        console.warn('Telemetry network error:', err.message || err);
      }
      // Don't rethrow - keep telemetry truly non-disruptive
    }
  }
}

// Singleton instance with environment-based configuration
const telemetry = new TelemetryClient({
  enabled: process.env.NODE_ENV === 'production' || process.env.DEBUG_LONGCAT === '1',
  endpoint: process.env.TELEMETRY_ENDPOINT,
  apiKey: process.env.TELEMETRY_API_KEY,
  sampleRate: parseFloat(process.env.TELEMETRY_SAMPLE_RATE || '1.0'),
});

export { telemetry };
export type { TelemetryEvent, TelemetryConfig };
