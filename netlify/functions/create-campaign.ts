import { Handler } from '@netlify/functions';
import CampaignOrchestrator, { CampaignRequest, CampaignResult } from '../../lib/campaign-orchestrator';
import { CAMPAIGN_DEFAULTS } from '../../lib/campaign-config';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  try {
    const body = event.body || '{}';
    let campaignRequest: CampaignRequest;
    
    try {
      campaignRequest = JSON.parse(body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }
    
    if (!campaignRequest.product) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required field: product'
        })
      };
    }

    const request: CampaignRequest = {
      duration_seconds: CAMPAIGN_DEFAULTS.DURATION_SECONDS,
      aspect_ratios: [...CAMPAIGN_DEFAULTS.ASPECT_RATIOS],
      platforms: [...CAMPAIGN_DEFAULTS.PLATFORMS],
      ...campaignRequest,
      campaign_type: campaignRequest.campaign_type || CAMPAIGN_DEFAULTS.CAMPAIGN_TYPE
    };

    const orchestrator = new CampaignOrchestrator();
    const result: CampaignResult = await orchestrator.createCampaign(request);

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
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Campaign creation failed',
        message
      })
    };
  }
};
