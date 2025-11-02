// netlify/functions/webhook-handler.ts
// Enhanced webhook receiver for autonomous publishing triggers and campaign management

import { Handler } from "@netlify/functions";

interface WebhookPayload {
  type: "publish" | "schedule" | "campaign_status" | "campaign_cancel";
  data: any;
  timestamp?: string;
  signature?: string;
}

interface CampaignData {
  id: string;
  content_url: string;
  platforms: string[];
  schedule_at?: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  results?: any[];
  created_at: string;
  updated_at: string;
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, X-Webhook-Signature",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Content-Type": "application/json",
};

// In-memory campaign store (use database in production)
const campaigns = new Map<string, CampaignData>();

/**
 * Verify webhook signature using HMAC
 */
function verifyWebhookSignature(
  payload: string,
  signature: string | undefined
): boolean {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    // If no secret configured, allow all webhooks
    return true;
  }

  if (!signature) {
    return false;
  }

  // In production, implement proper HMAC-SHA256 verification
  // const crypto = require('crypto');
  // const hmac = crypto.createHmac('sha256', secret);
  // const digest = hmac.update(payload).digest('hex');
  // return signature === `sha256=${digest}`;

  // Simple comparison for now
  return signature === secret;
}

/**
 * Handle publish webhook - trigger immediate publishing
 */
async function handlePublish(data: any): Promise<any> {
  const campaignId = `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create campaign record
  const campaign: CampaignData = {
    id: campaignId,
    content_url: data.content_url,
    platforms: data.platforms || ["instagram", "youtube", "tiktok"],
    status: "processing",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  campaigns.set(campaignId, campaign);

  // Call BEE-SHIP function to publish
  const beeShipUrl = `${process.env.URL || ""}/.netlify/functions/bee-ship`;
  
  try {
    const response = await fetch(beeShipUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: {
          type: data.content_type || "image",
          url: data.content_url,
          title: data.title,
          caption: data.caption,
          description: data.description,
          tags: data.tags,
          metadata: data.metadata,
        },
        platforms: data.platforms,
        campaign_id: campaignId,
      }),
    });

    const result = await response.json();

    // Update campaign status
    campaign.status = result.success ? "completed" : "failed";
    campaign.results = result.results;
    campaign.updated_at = new Date().toISOString();
    campaigns.set(campaignId, campaign);

    return {
      success: true,
      campaign_id: campaignId,
      status: campaign.status,
      results: result.results,
    };
  } catch (error: any) {
    campaign.status = "failed";
    campaign.updated_at = new Date().toISOString();
    campaigns.set(campaignId, campaign);

    throw error;
  }
}

/**
 * Handle schedule webhook - schedule content for future publishing
 */
async function handleSchedule(data: any): Promise<any> {
  const campaignId = `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const campaign: CampaignData = {
    id: campaignId,
    content_url: data.content_url,
    platforms: data.platforms || ["instagram", "youtube", "tiktok"],
    schedule_at: data.schedule_at,
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  campaigns.set(campaignId, campaign);

  // In production, add to job queue for scheduled execution
  // For now, just store the campaign

  return {
    success: true,
    campaign_id: campaignId,
    status: "scheduled",
    scheduled_for: data.schedule_at,
    message: "Campaign scheduled successfully",
  };
}

/**
 * Handle campaign status check
 */
async function handleCampaignStatus(data: any): Promise<any> {
  const campaignId = data.campaign_id;
  const campaign = campaigns.get(campaignId);

  if (!campaign) {
    throw new Error(`Campaign not found: ${campaignId}`);
  }

  return {
    success: true,
    campaign,
  };
}

/**
 * Handle campaign cancellation
 */
async function handleCampaignCancel(data: any): Promise<any> {
  const campaignId = data.campaign_id;
  const campaign = campaigns.get(campaignId);

  if (!campaign) {
    throw new Error(`Campaign not found: ${campaignId}`);
  }

  if (campaign.status === "completed") {
    throw new Error(`Cannot cancel completed campaign: ${campaignId}`);
  }

  campaign.status = "cancelled";
  campaign.updated_at = new Date().toISOString();
  campaigns.set(campaignId, campaign);

  return {
    success: true,
    campaign_id: campaignId,
    status: "cancelled",
    message: "Campaign cancelled successfully",
  };
}

export const handler: Handler = async (event) => {
  // Handle OPTIONS for CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Handle GET for health check and campaign listing
  if (event.httpMethod === "GET") {
    const path = event.path;
    const queryParams = event.queryStringParameters || {};

    // Health check
    if (path.endsWith("/webhook-handler") || path.endsWith("/webhook-handler/")) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: "healthy",
          service: "webhook-handler",
          version: "1.0.0",
          campaigns_count: campaigns.size,
        }),
      };
    }

    // List campaigns
    if (queryParams.list_campaigns === "true") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          campaigns: Array.from(campaigns.values()),
        }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Not found" }),
    };
  }

  // Only allow POST for webhook triggers
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
    };
  }

  try {
    const body = event.body || "{}";
    const signature = event.headers["x-webhook-signature"];

    // Verify signature
    if (!verifyWebhookSignature(body, signature)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Invalid webhook signature" }),
      };
    }

    // Parse webhook payload
    const payload: WebhookPayload = JSON.parse(body);
    const { type, data } = payload;

    console.log(`📬 Webhook received: ${type}`, data);

    let result: any;

    // Route to appropriate handler
    switch (type) {
      case "publish":
        result = await handlePublish(data);
        break;

      case "schedule":
        result = await handleSchedule(data);
        break;

      case "campaign_status":
        result = await handleCampaignStatus(data);
        break;

      case "campaign_cancel":
        result = await handleCampaignCancel(data);
        break;

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: `Unsupported webhook type: ${type}`,
            supported_types: ["publish", "schedule", "campaign_status", "campaign_cancel"],
          }),
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...result,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Webhook processing failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
