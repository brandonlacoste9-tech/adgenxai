import './lib/tracing-setup'; // Initialize tracing first
import { Handler } from '@netlify/functions';
import { trace, SpanStatusCode } from '@opentelemetry/api';
import CampaignOrchestrator, { CampaignRequest, CampaignResult } from '../../lib/campaign-orchestrator';
import { CAMPAIGN_DEFAULTS } from '../../lib/campaign-config';

const tracer = trace.getTracer('adgenxai-create-campaign');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event, context) => {
  return tracer.startActiveSpan('create-campaign.handler', async (span) => {
    span.setAttributes({
      'http.method': event.httpMethod,
      'http.url': event.path,
      'netlify.function': 'create-campaign',
      'user.agent': event.headers['user-agent'] || 'unknown'
    });

    try {
      if (event.httpMethod === 'OPTIONS') {
        span.setAttributes({ 'http.response.status_code': 200 });
        span.setStatus({ code: SpanStatusCode.OK });
        return { statusCode: 200, headers, body: '' };
      }

      if (event.httpMethod !== 'POST') {
        span.setAttributes({ 
          'http.response.status_code': 405,
          'error.type': 'method_not_allowed' 
        });
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Method not allowed' });
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
        };
      }

      const body = event.body || '{}';
      let campaignRequest: CampaignRequest;
      
      try {
        campaignRequest = JSON.parse(body);
        span.setAttributes({
          'campaign.product': campaignRequest.product || 'unknown',
          'campaign.type': campaignRequest.campaign_type || 'unknown',
          'campaign.platforms': JSON.stringify(campaignRequest.platforms || []),
          'request.body.size': body.length
        });
      } catch (parseError) {
        span.setAttributes({ 
          'http.response.status_code': 400,
          'error.type': 'json_parse_error' 
        });
        span.recordException(parseError as Error);
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Invalid JSON' });
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid JSON in request body' })
        };
      }
      
      if (!campaignRequest.product) {
        span.setAttributes({ 
          'http.response.status_code': 400,
          'error.type': 'missing_product' 
        });
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Missing product field' });
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Missing required field: product'
          })
        };
      }

      // Build request with defaults and overrides
      const request: CampaignRequest = {
        product: campaignRequest.product,
        campaign_type: campaignRequest.campaign_type || CAMPAIGN_DEFAULTS.CAMPAIGN_TYPE,
        platforms: campaignRequest.platforms || [...CAMPAIGN_DEFAULTS.PLATFORMS],
        duration_seconds: campaignRequest.duration_seconds || CAMPAIGN_DEFAULTS.DURATION_SECONDS,
        aspect_ratios: campaignRequest.aspect_ratios || [...CAMPAIGN_DEFAULTS.ASPECT_RATIOS],
        ...(campaignRequest.budget_limit && { budget_limit: campaignRequest.budget_limit }),
        ...(campaignRequest.target_audience && { target_audience: campaignRequest.target_audience }),
        ...(campaignRequest.brand_guidelines && { brand_guidelines: campaignRequest.brand_guidelines })
      };

      span.setAttributes({
        'campaign.final.product': request.product,
        'campaign.final.type': request.campaign_type,
        'campaign.final.platforms_count': request.platforms.length,
        'campaign.final.duration_seconds': request.duration_seconds,
        'campaign.final.aspect_ratios_count': request.aspect_ratios?.length || 0,
        'campaign.has_budget_limit': !!request.budget_limit,
        'campaign.has_target_audience': !!request.target_audience,
        'campaign.has_brand_guidelines': !!request.brand_guidelines
      });

      const orchestrator = new CampaignOrchestrator();
      const result: CampaignResult = await orchestrator.createCampaign(request);

      span.setAttributes({
        'http.response.status_code': 200,
        'campaign.result.success': true,
        'campaign.result.status': result.status,
        'campaign.result.total_cost': result.metadata.cost_breakdown.total_cost || 0,
        'campaign.result.models_used_count': result.metadata.models_used?.length || 0,
        'campaign.result.processing_time_ms': result.metadata.processing_time || 0,
        'campaign.result.engagement_score': result.metadata.estimated_performance.engagement_score || 0
      });
      span.setStatus({ code: SpanStatusCode.OK });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Campaign created successfully!',
          data: result
        })
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      
      span.setAttributes({
        'http.response.status_code': 500,
        'error.type': 'campaign_creation_failed',
        'error.message': message
      });
      
      if (error instanceof Error) {
        span.recordException(error);
      }
      span.setStatus({ code: SpanStatusCode.ERROR, message });
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Campaign creation failed',
          message
        })
      };
    } finally {
      span.end();
    }
  });
};