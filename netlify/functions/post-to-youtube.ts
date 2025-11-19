// netlify/functions/post-to-youtube.ts
// Netlify function to upload videos to YouTube

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { publishVideo } from "../../lib/platforms/youtube";

interface PostRequest {
  videoBase64: string; // Base64 encoded video file
  title: string;
  description?: string;
  tags?: string[];
  privacyStatus?: "public" | "private" | "unlisted";
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
    const { videoBase64, title, description, tags, privacyStatus } = body;

    // Validate inputs
    if (!videoBase64 || !title) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required fields: videoBase64 and title",
        }),
      };
    }

    // Get YouTube credentials from environment variables
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "YouTube credentials not configured. Set YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, and YOUTUBE_REFRESH_TOKEN environment variables.",
        }),
      };
    }

    // Convert base64 to Buffer
    const videoBuffer = Buffer.from(videoBase64, "base64");

    // Publish to YouTube
    const result = await publishVideo(
      { clientId, clientSecret, refreshToken },
      videoBuffer,
      {
        title,
        description: description || "",
        tags: tags || [],
        privacyStatus: privacyStatus || "public",
      }
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        platform: "youtube",
        videoId: result.videoId,
        videoUrl: `https://www.youtube.com/watch?v=${result.videoId}`,
        message: "Successfully uploaded to YouTube",
      }),
    };
  } catch (error: any) {
    console.error("YouTube upload error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to upload to YouTube",
        details: error.message,
      }),
    };
  }
};
