import type { Handler } from '@netlify/functions';
import { errorResponse, jsonResponse } from './utils/response';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return errorResponse('Method not allowed', { statusCode: 405 });
  }

  try {
    const githubEvent = event.headers['x-github-event'];
    const deliveryId = event.headers['x-github-delivery'];
    const payload = JSON.parse(event.body || '{}');

    console.log('📥 Webhook received:', {
      event: githubEvent,
      deliveryId,
      repository: payload.repository?.full_name,
      action: payload.action,
      timestamp: new Date().toISOString()
    });

    return jsonResponse({
      received: true,
      deliveryId,
      event: githubEvent,
      message: '🧠 AdgenXAI Sensory Cortex - Event Processed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error:', error);
    return errorResponse('Internal server error', { statusCode: 500 }, {
      message: error instanceof Error ? error.message : 'Unknown'
    });
  }
};
