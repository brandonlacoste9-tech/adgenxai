// netlify/functions/post-to-youtube.ts
// Netlify function to upload videos to YouTube

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { publishVideo, publishVideoFromUrl, publishShort } from "../../lib/platforms/youtube";

interface PostRequest {
  // Video source (one of these required)
  videoBase64?: string; // Base64 encoded video file
  videoUrl?: string;    // URL to video file
  
  // Metadata
  title: string;
  description?: string;
  tags?: string[];
  privacyStatus?: "public" | "private" | "unlisted";
  thumbnailUrl?: string;
  
  // Content type
  contentType?: "video" | "short";
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
      videoBase64, 
      videoUrl, 
      title, 
      description, 
      tags, 
      privacyStatus,
      thumbnailUrl,
      contentType = "video"
    } = body;

    // Validate inputs
    if (!title) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required field: title",
        }),
      };
    }

    if (!videoBase64 && !videoUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Either videoBase64 or videoUrl must be provided",
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

    const config = { clientId, clientSecret, refreshToken };
    const metadata = {
      title,
      description: description || "",
      tags: tags || [],
      privacyStatus: privacyStatus || "public",
      thumbnailUrl,
    };

    let result;

    // Handle different upload types
    if (contentType === "short" && videoUrl) {
      // YouTube Short from URL
      result = await publishShort(config, videoUrl, metadata);
    } else if (videoUrl) {
      // Regular video from URL
      result = await publishVideoFromUrl(config, videoUrl, metadata);
    } else if (videoBase64) {
      // Video from base64 (legacy support)
      const videoBuffer = Buffer.from(videoBase64, "base64");
      result = await publishVideo(config, videoBuffer, metadata);
    } else {
      throw new Error("Invalid upload configuration");
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        platform: "youtube",
        contentType,
        videoId: result.videoId,
        videoUrl: `https://www.youtube.com/watch?v=${result.videoId}`,
        shortUrl: contentType === "short" ? `https://www.youtube.com/shorts/${result.videoId}` : undefined,
        message: `Successfully uploaded ${contentType} to YouTube`,
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
