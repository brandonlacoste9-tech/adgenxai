import { trackVideoGeneration, generateRequestId, estimateCost } from '../../lib/telemetry/video-generation';
import { LongCatClient } from '../../app/lib/providers/longcat-client';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const longcatClient = new LongCatClient({
  apiKey: process.env.LONGCAT_API_KEY || '',
  timeout: 300000,
  retryAttempts: 3,
});

export const handler = async (event: any, context: any) => {
  const requestId = generateRequestId();
  const startTime = Date.now();

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    const request = JSON.parse(event.body);
    const useLongCat = process.env.USE_LONGCAT !== '0';
    const { prompt, duration = 10, aspectRatio = '16:9', style = 'cinematic' } = request;

    if (!prompt) {
      trackVideoGeneration({
        requestId,
        provider: 'longcat',
        status: 'failed',
        promptLength: 0,
        latencyMs: Date.now() - startTime,
        errorCode: 'MISSING_PROMPT',
        errorMessage: 'Prompt is required',
      });

      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'X-Request-ID': requestId },
        body: JSON.stringify({ error: 'Prompt is required', requestId }),
      };
    }

    // If LongCat is disabled, return 501
    if (!useLongCat) {
      return {
        statusCode: 501,
        headers: { ...corsHeaders, 'X-Request-ID': requestId },
        body: JSON.stringify({ error: 'LongCat adapter is disabled', requestId }),
      };
    }

    // Call LongCat API for video generation
    const response = await longcatClient.generateVideo({
      prompt,
      duration,
      aspectRatio,
      style,
    });

    const latencyMs = Date.now() - startTime;

    // Track successful generation request
    trackVideoGeneration({
      requestId,
      provider: 'longcat',
      status: response.status || 'queued',
      promptLength: prompt?.length || 0,
      duration,
      latencyMs,
      videoDurationSeconds: response.duration,
      costEstimate: estimateCost('longcat', duration),
      metadata: {
        style,
        aspectRatio,
      },
    });

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'X-Request-ID': requestId },
      body: JSON.stringify({
        ...response,
        requestId,
      }),
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Track failed generation request
    trackVideoGeneration({
      requestId,
      provider: 'longcat',
      status: 'failed',
      promptLength: 0,
      latencyMs,
      errorCode: error instanceof Error ? error.constructor.name : 'unknown',
      errorMessage,
    });

    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'X-Request-ID': requestId },
      body: JSON.stringify({
        error: errorMessage,
        requestId,
      }),
    };
  }
};