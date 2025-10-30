import type { Handler } from '@netlify/functions';
import { jsonResponse } from './utils/response';

export const handler: Handler = async () => {
  // Minimal stub telemetry (upgrade later to read from storage/logs)
  const now = new Date();
  const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const data = {
    stats: {
      totalEvents: 1, // bump as you add storage; proves the pipe works
      processing: {
        mode: 'observation',
        enabled: process.env.ENABLE_WEBHOOK_PROCESSING === 'true'
      },
      timeRange: {
        start: start.toISOString(),
        end: now.toISOString()
      }
    }
  };

  return jsonResponse(data);
};
