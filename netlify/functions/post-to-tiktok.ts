// netlify/functions/post-to-tiktok.ts
// Netlify function to publish videos to TikTok

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { publishVideo, TikTokVideoMetadata } from "../../lib/platforms/tiktok";

interface PostRequest {
  videoUrl: string;
  title: string;
  description?: string;
  privacy_level?: "PUBLIC_TO_EVERYONE" | "MUTUAL_FOLLOW_FRIENDS" | "FOLLOWER_OF_CREATOR" | "SELF_ONLY";
  disable_duet?: boolean;
  disable_comment?: boolean;
  disable_stitch?: boolean;
  video_cover_timestamp_ms?: number;
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
    const {
      videoUrl,
      title,
      description,
      privacy_level,
      disable_duet,
      disable_comment,
      disable_stitch,
      video_cover_timestamp_ms,
    } = body;

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

    // Build metadata object
    const metadata: Partial<TikTokVideoMetadata> = {
      description,
      privacy_level,
      disable_duet,
      disable_comment,
      disable_stitch,
      video_cover_timestamp_ms,
    };

    // Publish to TikTok
    const result = await publishVideo(
      { clientKey, clientSecret, accessToken, openId },
      videoUrl,
      title,
      metadata
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        platform: "tiktok",
        shareId: result.shareId,
        publishId: result.publishId,
        videoUrl: `https://www.tiktok.com/@user/video/${result.shareId}`,
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
