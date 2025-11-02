// netlify/functions/bee-ship.ts
// BEE-SHIP Autonomous Publishing System - Main orchestrator function

import { Handler } from "@netlify/functions";
import {
  publishToMultiplePlatforms,
  PlatformType,
  PlatformConfig,
  ContentData,
  PublishResult,
} from "../../lib/platforms/index";

interface BeeShipRequest {
  content: ContentData;
  platforms: PlatformType[];
  scheduleAt?: string; // ISO timestamp for scheduled publishing
  campaign_id?: string;
  retry?: boolean;
}

interface BeeShipResponse {
  success: boolean;
  campaign_id: string;
  results: PublishResult[];
  timestamp: string;
  message: string;
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, X-Signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

/**
 * Verify webhook signature if WEBHOOK_SECRET is configured
 */
function verifySignature(event: any): boolean {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    // If no secret is configured, allow the request
    return true;
  }

  const signature = event.headers["x-signature"];
  if (!signature) {
    return false;
  }

  // In production, implement proper HMAC signature verification
  // For now, simple comparison
  return signature === secret;
}

/**
 * Build platform configuration from environment variables
 */
function buildPlatformConfig(platforms: PlatformType[]): PlatformConfig {
  const config: PlatformConfig = {};

  if (platforms.includes("instagram")) {
    const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (accountId && accessToken) {
      config.instagram = { accountId, accessToken };
    }
  }

  if (platforms.includes("youtube")) {
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
    if (clientId && clientSecret && refreshToken) {
      config.youtube = { clientId, clientSecret, refreshToken };
    }
  }

  if (platforms.includes("tiktok")) {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    const openId = process.env.TIKTOK_OPEN_ID;
    if (clientKey && clientSecret && accessToken) {
      config.tiktok = { clientKey, clientSecret, accessToken, openId };
    }
  }

  return config;
}

/**
 * Rate limiting check (simple in-memory implementation)
 * In production, use Redis or similar distributed store
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || record.resetAt < now) {
    // Create new window
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export const handler: Handler = async (event) => {
  // Handle OPTIONS for CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
    };
  }

  try {
    // Verify webhook signature
    if (!verifySignature(event)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Invalid signature" }),
      };
    }

    // Rate limiting
    const identifier = event.headers["x-forwarded-for"] || "unknown";
    if (!checkRateLimit(identifier)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
        }),
      };
    }

    // Parse request
    const request: BeeShipRequest = JSON.parse(event.body || "{}");
    const { content, platforms, scheduleAt, campaign_id, retry } = request;

    // Validate request
    if (!content || !platforms || platforms.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Missing required fields: content and platforms",
        }),
      };
    }

    // Generate campaign ID if not provided
    const campaignId = campaign_id || `bee-ship-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Check if scheduled for future
    if (scheduleAt) {
      const scheduledTime = new Date(scheduleAt);
      const now = new Date();
      
      if (scheduledTime > now) {
        // In production, queue this for later processing
        // For now, return success with scheduled status
        return {
          statusCode: 202,
          headers,
          body: JSON.stringify({
            success: true,
            campaign_id: campaignId,
            status: "scheduled",
            scheduledFor: scheduleAt,
            message: "Content scheduled for future publishing",
            timestamp: new Date().toISOString(),
          }),
        };
      }
    }

    // Build platform configuration
    const config = buildPlatformConfig(platforms);

    // Validate that all requested platforms have configuration
    const missingConfig: string[] = [];
    for (const platform of platforms) {
      if (!config[platform]) {
        missingConfig.push(platform);
      }
    }

    if (missingConfig.length > 0) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: `Missing configuration for platforms: ${missingConfig.join(", ")}`,
          details: "Ensure all required environment variables are set",
        }),
      };
    }

    // Publish to all platforms
    console.log(`🐝 BEE-SHIP: Publishing campaign ${campaignId} to platforms: ${platforms.join(", ")}`);
    
    const results = await publishToMultiplePlatforms(platforms, config, content);

    // Check if any publishes succeeded
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    const response: BeeShipResponse = {
      success: successCount > 0,
      campaign_id: campaignId,
      results,
      timestamp: new Date().toISOString(),
      message: `🎉 BEE-SHIP: Published to ${successCount}/${results.length} platforms successfully`,
    };

    // Log results
    console.log(`✅ BEE-SHIP Campaign ${campaignId}: ${successCount} succeeded, ${failureCount} failed`);
    results.forEach((result) => {
      if (result.success) {
        console.log(`  ✓ ${result.platform}: ${result.url || result.publishedId}`);
      } else {
        console.error(`  ✗ ${result.platform}: ${result.error}`);
      }
    });

    return {
      statusCode: successCount > 0 ? 200 : 500,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error: any) {
    console.error("BEE-SHIP error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "BEE-SHIP publishing failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
