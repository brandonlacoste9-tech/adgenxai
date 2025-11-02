// netlify/functions/monitoring-dashboard.ts - Real-time monitoring dashboard endpoint
import { Handler } from '@netlify/functions';
import { runAllHealthChecks } from '../../lib/monitoring/health-checks';
import { withMonitoring, trackColdStart } from '../../lib/monitoring/netlify-functions';

const monitoringHandler: Handler = async (event, context) => {
  trackColdStart('monitoring-dashboard');
  
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
    // Run comprehensive health checks
    const healthResults = await runAllHealthChecks();
    
    // Get system metrics (placeholder - in production, fetch from storage)
    const systemMetrics = {
      totalRequests: 0,
      errorRate: 0,
      avgResponseTime: 0,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
    
    // Get performance metrics (placeholder)
    const performanceMetrics = {
      functionColdStarts: 0,
      avgFunctionDuration: 0,
      bandwidthUsed: 0,
      cacheHitRate: 0,
    };
    
    // Get business metrics (placeholder)
    const businessMetrics = {
      campaignsCreated: 0,
      platformPublishSuccess: 0,
      platformPublishFailed: 0,
      apiUsage: 0,
    };
    
    const response = {
      status: healthResults.overall,
      timestamp: new Date().toISOString(),
      health: healthResults,
      system: systemMetrics,
      performance: performanceMetrics,
      business: businessMetrics,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Monitoring dashboard error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch monitoring data',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

export const handler = withMonitoring(monitoringHandler, 'monitoring-dashboard');
