// netlify/functions/post-to-tiktok.ts
// Netlify function to publish videos to TikTok (stub - requires implementation)

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { publishVideo } from "../../lib/platforms/tiktok";

interface PostRequest {
  videoUrl: string;
  title: string;
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
    };
  }

  try {
    // Parse request body
    const body: PostRequest = JSON.parse(event.body || "{}");
    const { videoUrl, title } = body;

    // Validate inputs
    if (!videoUrl || !title) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required fields: videoUrl and title",
        }),
      };
    }

    // Get TikTok credentials from environment variables
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    const openId = process.env.TIKTOK_OPEN_ID;

    if (!clientKey || !clientSecret || !accessToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "TikTok credentials not configured. Set TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, and TIKTOK_ACCESS_TOKEN environment variables.",
        }),
      };
    }

    // Note: TikTok publishing is not yet implemented
    // This will throw an error from the platform module
    const result = await publishVideo(
      { clientKey, clientSecret, accessToken, openId },
      videoUrl,
      title
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        platform: "tiktok",
        shareId: result.shareId,
        message: "Successfully published to TikTok",
      }),
    };
  } catch (error: any) {
    console.error("TikTok posting error:", error);

    // Check if it's the "not implemented" error
    if (error.message.includes("not implemented")) {
      return {
        statusCode: 501,
        body: JSON.stringify({
          error: "TikTok publishing not yet implemented",
          details: "The TikTok Content Posting API integration needs to be completed. See lib/platforms/tiktok.ts",
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to post to TikTok",
        details: error.message,
      }),
    };
  }
};
