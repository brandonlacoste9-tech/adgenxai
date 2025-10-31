// netlify/functions/cortex-badge-edge.ts - Cortex status badge endpoint
import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
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
    // Check cortex health endpoint
    let status = 'healthy';
    let processing = true;
    
    try {
      const baseUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:8888';
      const healthController = new AbortController();
      const healthTimeoutId = setTimeout(() => healthController.abort(), 3000);
      
      const healthResponse = await fetch(`${baseUrl}/.netlify/functions/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: healthController.signal,
      });

      clearTimeout(healthTimeoutId);
      
      if (!healthResponse.ok) {
        status = 'degraded';
      }

      // Check telemetry to see if processing is enabled
      const telemetryController = new AbortController();
      const telemetryTimeoutId = setTimeout(() => telemetryController.abort(), 3000);
      
      const telemetryResponse = await fetch(`${baseUrl}/.netlify/functions/webhook-telemetry`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: telemetryController.signal,
      });

      clearTimeout(telemetryTimeoutId);

      if (telemetryResponse.ok) {
        const telemetryData = await telemetryResponse.json();
        processing = telemetryData?.stats?.processing?.enabled ?? true;
      }
    } catch (error) {
      console.warn('Cortex health check failed for badge:', error);
      status = 'degraded';
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        service: 'cortex',
        status,
        processing,
        timestamp: new Date().toISOString(),
        badge: {
          schemaVersion: 1,
          label: 'cortex',
          message: processing ? status : `${status} (processing disabled)`,
          color: status === 'healthy' && processing ? 'brightgreen' : 'yellow',
        },
      }),
    };
  } catch (error) {
    console.error('Cortex badge error:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        service: 'cortex',
        status: 'error',
        processing: false,
        timestamp: new Date().toISOString(),
        badge: {
          schemaVersion: 1,
          label: 'cortex',
          message: 'error',
          color: 'red',
        },
      }),
    };
  }
};
