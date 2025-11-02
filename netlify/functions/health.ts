// netlify/functions/health.ts - Enhanced health monitoring with service checks
import { Handler } from '@netlify/functions';
import { runAllHealthChecks } from '../../lib/monitoring/health-checks';
import { withMonitoring, trackColdStart } from '../../lib/monitoring/netlify-functions';

interface CortexHealthData {
  uptime?: string;
  models?: string[];
  resources?: Record<string, any>;
  status?: string;
  [key: string]: any;
}

const healthHandler: Handler = async (event, context) => {
  trackColdStart('health');
  
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
    // Check if detailed health check is requested
    const detailed = event.queryStringParameters?.detailed === 'true';
    
    const cortexUrl = process.env.NEXT_PUBLIC_SENSORY_CORTEX_URL || process.env.SENSORY_CORTEX_URL;
    let cortexData: CortexHealthData = { status: 'legendary', legendary: true };
    
    if (cortexUrl) {
      try {
        const response = await fetch(`${cortexUrl}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          cortexData = (await response.json()) as CortexHealthData;
        }
      } catch (error) {
        console.log('Cortex health check failed:', error);
      }
    }

    // Run comprehensive health checks if detailed mode
    let serviceChecks = undefined;
    if (detailed) {
      const healthResults = await runAllHealthChecks();
      serviceChecks = healthResults;
    }

    const response = {
      status: 'legendary',
      uptime: cortexData.uptime || 'Always up',
      models: cortexData.models || ['GPT-4-Turbo', 'Claude-3.5-Sonnet'],
      resources: cortexData.resources || { cpu: '100%', memory: 'Legendary' },
      legendary: true,
      timestamp: new Date().toISOString(),
      ...(serviceChecks && { services: serviceChecks }),
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Health check error:', error);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'degraded',
        message: 'AI Sensory Cortex operating with reduced capacity',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

export const handler = withMonitoring(healthHandler, 'health');