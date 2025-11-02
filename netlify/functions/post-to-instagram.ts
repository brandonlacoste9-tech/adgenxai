// netlify/functions/post-to-instagram.ts
// Netlify function to publish images to Instagram

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { publishImage, publishStory } from "../../lib/platforms/instagram";

interface PostRequest {
  imageUrl: string;
  caption?: string;
  mediaType?: "post" | "story";
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
    const { imageUrl, caption, mediaType = "post" } = body;

    // Validate inputs
    if (!imageUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required field: imageUrl",
        }),
      };
    }

    if (mediaType === "post" && !caption) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "caption is required for post media type",
        }),
      };
    }

    // Get Instagram credentials from environment variables
    const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accountId || !accessToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Instagram credentials not configured. Set INSTAGRAM_ACCOUNT_ID and INSTAGRAM_ACCESS_TOKEN environment variables.",
        }),
      };
    }

    // Publish to Instagram based on media type
    const result = mediaType === "story"
      ? await publishStory({ accountId, accessToken }, imageUrl)
      : await publishImage({ accountId, accessToken }, imageUrl, caption!);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        platform: "instagram",
        mediaType,
        containerId: result.containerId,
        publishedId: result.publishedId,
        message: `Successfully published ${mediaType} to Instagram`,
      }),
    };
  } catch (error: any) {
    console.error("Instagram posting error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to post to Instagram",
        details: error.message,
      }),
    };
  }
};
