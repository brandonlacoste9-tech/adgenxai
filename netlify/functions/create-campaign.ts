import { Handler } from '@netlify/functions';
import CampaignOrchestrator, { CampaignRequest, CampaignResult } from '../../lib/campaign-orchestrator';

/**
 * 🎯 THE MAGIC API ENDPOINT
 * 
 * POST /.netlify/functions/create-campaign
 * 
 * One API call → Complete advertising campaign with:
 * - Ad copy (Kimi-linear)
 * - 3D product model (Hunyuan 3D) 
 * - 3D environment (WorldGrow)
 * - Video content (LongCat-Video)
 * - Edited variants (Ditto)
 * - Thumbnail variants (Nitro-E)
 */

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  try {
    // Parse request body
    const campaignRequest: CampaignRequest = JSON.parse(event.body || '{}');
    
    // Validate required fields
    if (!campaignRequest.product) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required field: product',
          example: {
            product: "eco water bottle",
            campaign_type: "product_launch"
          }
        })
      };
    }

    // Set defaults if not provided
    const request: CampaignRequest = {
      campaign_type: 'product_launch',
      duration_seconds: 60,
      aspect_ratios: ['16:9', '9:16', '1:1'],
      platforms: ['instagram', 'tiktok', 'youtube'],
      ...campaignRequest
    };

    console.log('🚀 Creating campaign:', request);

    // Initialize orchestrator and create campaign
    const orchestrator = new CampaignOrchestrator();
    const result: CampaignResult = await orchestrator.createCampaign(request);

    console.log('✅ Campaign created successfully:', result.campaign_id);

    // Return successful result
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Campaign created successfully!',
        data: result,
        processing_info: {
          models_used: result.metadata.models_used,
          processing_time_ms: result.metadata.processing_time,
          estimated_cost: `$${result.metadata.cost_breakdown.total_cost.toFixed(2)}`
        }
      })
    };

  } catch (error) {
    console.error('❌ Campaign creation failed:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Campaign creation failed',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

/**
 * 🎯 EXAMPLE USAGE:
 * 
 * ```bash
 * curl -X POST https://your-site.netlify.app/.netlify/functions/create-campaign \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "product": "eco water bottle",
 *     "campaign_type": "product_launch",
 *     "target_audience": "health-conscious millennials",
 *     "duration_seconds": 90,
 *     "platforms": ["instagram", "tiktok"]
 *   }'
 * ```
 * 
 * Returns complete campaign with:
 * - Professional ad copy
 * - 3D product model  
 * - Branded video content
 * - Platform-optimized variants
 * - Performance predictions
 * - Cost breakdown
 */