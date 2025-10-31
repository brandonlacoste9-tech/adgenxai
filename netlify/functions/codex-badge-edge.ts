// netlify/functions/codex-badge-edge.ts - Codex status badge endpoint
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
    const codexUrl = process.env.CODEX_BASE_URL;
    let status = 'healthy';
    let isAvailable = true;

    // Check Codex health if URL is configured
    if (codexUrl) {
      try {
        const response = await fetch(`${codexUrl}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(3000), // 3 second timeout for badge
        });

        if (!response.ok) {
          status = 'degraded';
          isAvailable = false;
        }
      } catch (error) {
        status = 'degraded';
        isAvailable = false;
        console.warn('Codex health check failed for badge:', error);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        service: 'codex',
        status,
        available: isAvailable,
        timestamp: new Date().toISOString(),
        badge: {
          schemaVersion: 1,
          label: 'codex',
          message: status,
          color: status === 'healthy' ? 'brightgreen' : 'yellow',
        },
      }),
    };
  } catch (error) {
    console.error('Codex badge error:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        service: 'codex',
        status: 'error',
        available: false,
        timestamp: new Date().toISOString(),
        badge: {
          schemaVersion: 1,
          label: 'codex',
          message: 'error',
          color: 'red',
        },
      }),
    };
  }
};
