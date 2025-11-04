import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes, defaultResource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis';
import { Span } from '@opentelemetry/api';

// Initialize OpenTelemetry tracing for AdgenXAI Open-Source Model Stack
export function initializeTracing() {
  // Create OTLP exporter for AI Toolkit (localhost:4318)
  const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
    headers: {},
  });

  // Define service resource for AdGenXAI platform
  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'adgenxai-open-source',
    [ATTR_SERVICE_VERSION]: '1.0.0',
    'deployment.environment': process.env.NODE_ENV || 'development',
    'adgenxai.model_stack': 'open-source',
    'adgenxai.models': 'longcat,emu3.5,chronoedit,kimi,amd-nitro,worldgrow',
  }).merge(defaultResource());

  // Initialize SDK with specific instrumentations (no auto-instrumentations)
  const sdk = new NodeSDK({
    resource,
    traceExporter,
    instrumentations: [
      // HTTP instrumentation for open-source model APIs
      new HttpInstrumentation({
        requestHook: (span: Span, request: any) => {
          // Add custom attributes for AdGenXAI model requests
          span.setAttributes({
            'adgenxai.request.path': request.url,
            'adgenxai.request.method': request.method,
            'adgenxai.model.type': getModelTypeFromUrl(request.url),
          });
        },
      }),
      // Express instrumentation for Netlify Functions
      new ExpressInstrumentation(),
      // Redis for caching model outputs
      new RedisInstrumentation(),
    ],
  });

  // Start tracing and store SDK reference
  sdk.start();
  tracingSDK = sdk;
  
  console.log('🚀 AdGenXAI open-source tracing initialized successfully!');
  console.log('📊 Traces will be sent to AI Toolkit at http://localhost:4318');
  console.log('🤖 Monitoring models: LongCat-Video, EMU 3.5, ChronoEdit, Kimi-linear, AMD Nitro-E, WorldGrow');
}

// Helper function to identify AdGenXAI model type from request URL
function getModelTypeFromUrl(url: string): string {
  if (!url) return 'unknown';
  
  // Map AdGenXAI open-source models
  if (url.includes('longcat') || url.includes('video')) return 'longcat-video';
  if (url.includes('emu') || url.includes('image-gen')) return 'emu-3.5';
  if (url.includes('chrono') || url.includes('edit')) return 'chronoedit';
  if (url.includes('kimi') || url.includes('text')) return 'kimi-linear';
  if (url.includes('amd') || url.includes('nitro') || url.includes('thumbnail')) return 'amd-nitro-e';
  if (url.includes('world') || url.includes('3d-env')) return 'worldgrow';
  if (url.includes('animate') || url.includes('character')) return 'wan-animate';
  if (url.includes('hunyuan') || url.includes('3d-model')) return 'hunyuan-3d';
  if (url.includes('umo') || url.includes('identity')) return 'bytedance-umo';
  if (url.includes('ditto') || url.includes('edit-video')) return 'ditto';
  if (url.includes('hailuo') || url.includes('cinematic')) return 'hailuo-ai';
  
  return 'unknown';
}

// Export the SDK for graceful shutdown if needed
let tracingSDK: NodeSDK | null = null;

export function getTracingSDK(): NodeSDK | null {
  return tracingSDK;
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔍 Shutting down OpenTelemetry tracing...');
});