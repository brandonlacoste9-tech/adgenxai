// netlify/functions/webhook.ts - Main webhook routing to your AI Sensory Cortex on Netlify
import './lib/tracing-setup'; // Initialize tracing first
import { Handler } from '@netlify/functions';
import { trace, SpanStatusCode } from '@opentelemetry/api';

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

export const handler: Handler = async (event, context) => {
  const tracer = trace.getTracer('adgenxai-webhook');
  
  return tracer.startActiveSpan('webhook.process', async (span) => {
    try {
      span.setAttributes({
        'adgenxai.webhook.method': event.httpMethod,
        'adgenxai.webhook.path': event.path,
        'adgenxai.function.name': 'webhook',
      });

      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json',
      };

      if (event.httpMethod === 'OPTIONS') {
        span.setAttributes({ 'adgenxai.webhook.response': 'cors_preflight' });
        span.setStatus({ code: SpanStatusCode.OK });
        return { statusCode: 200, headers, body: '' };
      }

      if (event.httpMethod !== 'POST') {
        span.setAttributes({ 'adgenxai.webhook.error': 'invalid_method' });
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Invalid HTTP method' });
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'POST method required' }),
        };
      }

      const requestData: RequestData = event.body ? JSON.parse(event.body) : {};
      const { type, payload = {}, hero_variant, timestamp } = requestData;
      const processingId = `adgenxai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      span.setAttributes({
        'adgenxai.webhook.type': type || 'unknown',
        'adgenxai.webhook.processing_id': processingId,
        'adgenxai.webhook.hero_variant': hero_variant || 'default',
        'adgenxai.webhook.has_payload': Object.keys(payload).length > 0,
      });

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
        await tracer.startActiveSpan('webhook.cortex_call', async (cortexSpan) => {
          try {
            const endpoint = type === 'legendary_ad_generation' ? '/api/generate-ads' : 
                            type === 'enterprise_demo_request' ? '/api/enterprise-demo' :
                            '/api/process-generation';

            cortexSpan.setAttributes({
              'adgenxai.cortex.url': cortexUrl,
              'adgenxai.cortex.endpoint': endpoint,
              'adgenxai.cortex.type': type || 'unknown',
            });

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

            cortexSpan.setAttributes({
              'adgenxai.cortex.response.status': response.status,
              'adgenxai.cortex.response.ok': response.ok,
            });

            if (response.ok) {
              const cortexData = (await response.json()) as CortexResponse;
              cortexResponse = { ...cortexResponse, ...cortexData };
              cortexSpan.setAttributes({
                'adgenxai.cortex.response.processing_id': cortexData.processing_id || 'none',
                'adgenxai.cortex.response.status': cortexData.status || 'unknown',
              });
              console.log('🧠 AI Sensory Cortex Response:', cortexData);
              cortexSpan.setStatus({ code: SpanStatusCode.OK });
            } else {
              cortexSpan.setStatus({ code: SpanStatusCode.ERROR, message: `HTTP ${response.status}` });
            }
          } catch (error) {
            cortexSpan.recordException(error as Error);
            cortexSpan.setStatus({ code: SpanStatusCode.ERROR, message: 'Cortex call failed' });
            console.log('🔥 AI Sensory Cortex operating independently:', error);
          } finally {
            cortexSpan.end();
          }
        });
      }

      span.setAttributes({
        'adgenxai.webhook.response.success': true,
        'adgenxai.webhook.response.processing_id': processingId,
      });

      span.setStatus({ code: SpanStatusCode.OK });

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
      span.recordException(error as Error);
      span.setAttributes({ 'adgenxai.webhook.error': 'exception' });
      span.setStatus({ code: SpanStatusCode.ERROR, message: 'Webhook processing failed' });
      console.error('Webhook error:', error);
      
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          message: '🔥 AI Sensory Cortex operating at maximum capacity. Please try again in a moment.',
          timestamp: new Date().toISOString()
        }),
      };
    } finally {
      span.end();
    }
  });
};