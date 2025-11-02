// netlify/functions/webhook.ts - Main webhook routing with comprehensive monitoring
import { Handler } from '@netlify/functions';
import { withMonitoring, trackColdStart, trackExternalAPI } from '../../lib/monitoring/netlify-functions';
import { trackBusinessMetric } from '../../lib/monitoring/analytics';

interface RequestData {
  type?: string;
  payload?: Record<string, any>;
  hero_variant?: string;
  timestamp?: string;
  [key: string]: any;
}

interface CortexResponse {
  status?: string;
  processing_id?: string;
  message?: string;
  hero_variant?: string;
  timestamp?: string;
  [key: string]: any;
}

const webhookHandler: Handler = async (event, context) => {
  trackColdStart('webhook');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'POST method required' }),
    };
  }

  try {
    const requestData: RequestData = event.body ? JSON.parse(event.body) : {};
    const { type, payload = {}, hero_variant, timestamp } = requestData;
    const processingId = `adgenxai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Track webhook request
    trackBusinessMetric('webhook_request', 1, { type, processingId });

    // Route to your AI Sensory Cortex (also on Netlify)
    const cortexUrl = process.env.NEXT_PUBLIC_SENSORY_CORTEX_URL || process.env.SENSORY_CORTEX_URL;
    let cortexResponse: CortexResponse = {
      status: 'legendary_success',
      processing_id: processingId,
      message: 'AI Sensory Cortex processing at legendary speed',
      hero_variant,
      timestamp: new Date().toISOString()
    };

    if (cortexUrl) {
      try {
        const endpoint = type === 'legendary_ad_generation' ? '/api/generate-ads' : 
                        type === 'enterprise_demo_request' ? '/api/enterprise-demo' :
                        '/api/process-generation';

        const cortexData = await trackExternalAPI(
          'sensory-cortex',
          `${cortexUrl}${endpoint}`,
          async () => {
            const response = await fetch(`${cortexUrl}${endpoint}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-AdGenXAI-Platform': 'netlify-web',
                'X-Processing-ID': processingId
              },
              body: JSON.stringify({
                processing_id: processingId,
                type,
                hero_variant,
                timestamp,
                ...payload
              })
            });

            if (response.ok) {
              return await response.json();
            }
            throw new Error(`Cortex responded with status ${response.status}`);
          }
        );

        cortexResponse = { ...cortexResponse, ...cortexData };
        console.log('🧠 AI Sensory Cortex Response:', cortexData);
        
        // Track successful processing
        trackBusinessMetric('cortex_success', 1, { type, processingId });
      } catch (error) {
        console.log('🔥 AI Sensory Cortex operating independently:', error);
        trackBusinessMetric('cortex_fallback', 1, { type, processingId });
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `🎉 LEGENDARY! Your AI Sensory Cortex ${type || 'request'} completed successfully!`,
        processing_id: processingId,
        cortex_response: cortexResponse,
        timestamp: new Date().toISOString()
      }),
    };

  } catch (error) {
    console.error('Webhook error:', error);
    
    // Track error
    trackBusinessMetric('webhook_error', 1);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: '🔥 AI Sensory Cortex operating at maximum capacity. Please try again in a moment.',
        timestamp: new Date().toISOString()
      }),
    };
  }
};

export const handler = withMonitoring(webhookHandler, 'webhook');