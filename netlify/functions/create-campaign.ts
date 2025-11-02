import { Handler } from '@netlify/functions';
import CampaignOrchestrator, { CampaignRequest, CampaignResult } from '../../lib/campaign-orchestrator';

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
    const campaignRequest: CampaignRequest = JSON.parse(event.body || '{}');
    
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
      campaign_type: 'product_launch',
      duration_seconds: 60,
      aspect_ratios: ['16:9', '9:16', '1:1'],
      platforms: ['instagram', 'tiktok', 'youtube'],
      ...campaignRequest
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
