// netlify/functions/health.ts - AI Sensory Cortex health monitoring on Netlify
import { Handler } from '@netlify/functions';

interface CortexHealthData {
  uptime?: string;
  models?: string[];
  resources?: Record<string, any>;
  status?: string;
  [key: string]: any;
}

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const cortexUrl = process.env.NEXT_PUBLIC_SENSORY_CORTEX_URL || process.env.SENSORY_CORTEX_URL;
    const webhookProcessing = process.env.ENABLE_WEBHOOK_PROCESSING === 'true';
    
    let cortexData: CortexHealthData = { status: 'healthy' };
    
    if (cortexUrl) {
      try {
        const response = await fetch(`${cortexUrl}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          cortexData = (await response.json()) as CortexHealthData;
        }
      } catch (error) {
        console.warn('External cortex health check failed:', error);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: cortexData.status || 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        cortex: {
          webhook: {
            configured: true,
            processing: webhookProcessing,
          },
          telemetry: {
            enabled: true,
            retention: '30 days',
          },
        },
        endpoints: {
          webhook: '/.netlify/functions/github-webhook',
          telemetry: '/.netlify/functions/webhook-telemetry',
          dashboard: '/.netlify/functions/telemetry-dashboard',
          health: '/.netlify/functions/health',
        },
      }),
    };
  } catch (error) {
    console.error('Health endpoint error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
    };
  }
};