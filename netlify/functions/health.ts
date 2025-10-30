import type { Handler } from '@netlify/functions';
import { jsonResponse } from './utils/response';

export const handler: Handler = async () =>
  jsonResponse({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    cortex: {
      webhook: {
        configured: true,
        processing: process.env.ENABLE_WEBHOOK_PROCESSING === 'true'
      },
      telemetry: {
        enabled: true,
        retention: '30 days'
      }
    },
    endpoints: {
      webhook: '/.netlify/functions/github-webhook',
      telemetry: '/.netlify/functions/webhook-telemetry',
      dashboard: '/.netlify/functions/telemetry-dashboard',
      health: '/.netlify/functions/health'
    }
  });
