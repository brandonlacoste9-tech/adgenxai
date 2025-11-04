import './lib/tracing-setup'; // Initialize tracing first
import type { Handler } from '@netlify/functions';
import { trace, SpanStatusCode } from '@opentelemetry/api';

export const handler: Handler = async (event) => {
  const tracer = trace.getTracer('adgenxai-github-webhook');
  
  return tracer.startActiveSpan('github_webhook.process', async (span) => {
    try {
      span.setAttributes({
        'adgenxai.function.name': 'github-webhook',
        'adgenxai.webhook.method': event.httpMethod,
        'adgenxai.webhook.path': event.path,
      });

      if (event.httpMethod !== 'POST') {
        span.setAttributes({ 'adgenxai.webhook.error': 'invalid_method' });
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Invalid HTTP method' });
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
      }

      const githubEvent = event.headers['x-github-event'];
      const deliveryId = event.headers['x-github-delivery'];
      const payload = JSON.parse(event.body || '{}');
      
      span.setAttributes({
        'adgenxai.github.event': githubEvent || 'unknown',
        'adgenxai.github.delivery_id': deliveryId || 'none',
        'adgenxai.github.repository': payload.repository?.full_name || 'unknown',
        'adgenxai.github.action': payload.action || 'none',
        'adgenxai.github.has_payload': !!event.body,
      });
      
      console.log('📥 Webhook received:', {
        event: githubEvent,
        deliveryId,
        repository: payload.repository?.full_name,
        action: payload.action,
        timestamp: new Date().toISOString()
      });

      span.setAttributes({
        'adgenxai.webhook.response.success': true,
        'adgenxai.webhook.response.delivery_id': deliveryId || 'none',
      });

      span.setStatus({ code: SpanStatusCode.OK });

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          received: true,
          deliveryId,
          event: githubEvent,
          message: '🧠 AdgenXAI Sensory Cortex - Event Processed',
          timestamp: new Date().toISOString()
        })
      };
      
    } catch (error) {
      span.recordException(error as Error);
      span.setAttributes({ 'adgenxai.webhook.error': 'exception' });
      span.setStatus({ code: SpanStatusCode.ERROR, message: 'GitHub webhook processing failed' });
      console.error('❌ Error:', error);
      
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown'
        })
      };
    } finally {
      span.end();
    }
  });
};
