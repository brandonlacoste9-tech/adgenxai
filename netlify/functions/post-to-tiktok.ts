// netlify/functions/post-to-tiktok.ts
// Netlify function to publish videos to TikTok via the Content Posting API

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

    if (!clientKey || !clientSecret || !accessToken || !openId) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "TikTok credentials not configured. Set TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_ACCESS_TOKEN, and TIKTOK_OPEN_ID environment variables.",
        }),
      };
    }

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
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to post to TikTok",
        details: error.message,
      }),
    };
  }
};
