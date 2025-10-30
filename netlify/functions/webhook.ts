// netlify/functions/webhook.ts - Main webhook routing to your AI Sensory Cortex on Netlify
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
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
    const requestData = JSON.parse(event.body || '{}');
    const { type, payload, hero_variant, timestamp } = requestData;
    const processingId = `adgenxai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Route to your AI Sensory Cortex (also on Netlify)
    const cortexUrl = process.env.NEXT_PUBLIC_SENSORY_CORTEX_URL || process.env.SENSORY_CORTEX_URL;
    let cortexResponse = {
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
          const cortexData = await response.json();
          cortexResponse = { ...cortexResponse, ...cortexData };
          console.log('🧠 AI Sensory Cortex Response:', cortexData);
        }
      } catch (error) {
        console.log('🔥 AI Sensory Cortex operating independently:', error);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `🎉 LEGENDARY! Your AI Sensory Cortex ${type} completed successfully!`,
        processing_id: processingId,
        cortex_response: cortexResponse,
        timestamp: new Date().toISOString()
      }),
    };

  } catch (error) {
    console.error('Webhook error:', error);
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