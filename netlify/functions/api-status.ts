// netlify/functions/api-status.ts - API status dashboard endpoint

import { Handler } from '@netlify/functions';
import {
  successResponse,
  checkMethod,
  getRequestId,
  logRequest,
  createTimer,
  HttpStatus,
  HealthCheckResponse,
  ServiceStatus,
} from '../../lib/api';

/**
 * Check if a service is available by making a test request
 */
async function checkServiceHealth(
  url: string,
  timeout: number = 5000
): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      method: 'GET',
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - start;

    if (response.ok) {
      return {
        status: 'up',
        latency,
        message: 'Service is healthy',
      };
    } else {
      return {
        status: 'degraded',
        latency,
        message: `Service returned status ${response.status}`,
      };
    }
  } catch (error) {
    const latency = Date.now() - start;
    return {
      status: 'down',
      latency,
      message: error instanceof Error ? error.message : 'Service unavailable',
    };
  }
}

/**
 * API Status Dashboard Endpoint
 * GET /api/status - Returns status of all API services
 */
export const handler: Handler = async (event, context) => {
  const requestId = getRequestId(event);
  const timer = createTimer();

  // Log the request
  logRequest(event, requestId);

  // Handle OPTIONS request
  const methodCheck = checkMethod(event, ['GET']);
  if (methodCheck) return methodCheck;

  try {
    const startTime = Date.now();

    // Check external services
    const services: Record<string, ServiceStatus> = {
      sensory_cortex: { status: 'up', message: 'Not configured' },
    };

    // Check if Sensory Cortex is configured
    const cortexUrl =
      process.env.NEXT_PUBLIC_SENSORY_CORTEX_URL || process.env.SENSORY_CORTEX_URL;
    if (cortexUrl) {
      services.sensory_cortex = await checkServiceHealth(`${cortexUrl}/health`);
    }

    // Check platform credentials
    services.instagram = {
      status: process.env.INSTAGRAM_ACCOUNT_ID && process.env.INSTAGRAM_ACCESS_TOKEN
        ? 'up'
        : 'down',
      message:
        process.env.INSTAGRAM_ACCOUNT_ID && process.env.INSTAGRAM_ACCESS_TOKEN
          ? 'Credentials configured'
          : 'Credentials not configured',
    };

    services.tiktok = {
      status: process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET
        ? 'up'
        : 'down',
      message:
        process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET
          ? 'Credentials configured'
          : 'Credentials not configured',
    };

    services.youtube = {
      status: process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_CLIENT_SECRET
        ? 'up'
        : 'down',
      message:
        process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_CLIENT_SECRET
          ? 'Credentials configured'
          : 'Credentials not configured',
    };

    // Determine overall status
    const allUp = Object.values(services).every((s) => s.status === 'up');
    const anyDown = Object.values(services).some((s) => s.status === 'down');

    const overallStatus: 'healthy' | 'degraded' | 'unhealthy' = allUp
      ? 'healthy'
      : anyDown
      ? 'degraded'
      : 'healthy';

    const uptime = process.uptime ? `${Math.floor(process.uptime())}s` : 'N/A';

    const healthResponse: HealthCheckResponse = {
      status: overallStatus,
      uptime,
      timestamp: new Date().toISOString(),
      services,
      version: '1.0.0',
    };

    return successResponse(healthResponse, HttpStatus.OK, {
      requestId,
      responseTime: timer.elapsed(),
    });
  } catch (error) {
    console.error('API status check error:', error);

    // Even if there's an error, return a basic status
    const healthResponse: HealthCheckResponse = {
      status: 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        error: {
          status: 'down',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      version: '1.0.0',
    };

    return successResponse(healthResponse, HttpStatus.OK, {
      requestId,
      responseTime: timer.elapsed(),
    });
  }
};
