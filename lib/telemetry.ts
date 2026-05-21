export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const telemetry = {
  track: (event: string, data?: Record<string, unknown>) => {
    console.log(`[telemetry] ${event}`, data || {});
  },
  error: (error: Error, context?: Record<string, unknown>) => {
    console.error(`[telemetry] ERROR:`, error.message, context || {});
  },
};
