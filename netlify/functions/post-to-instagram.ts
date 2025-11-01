// netlify/functions/post-to-instagram.ts
// Netlify function to publish images to Instagram

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { publishImage } from "../../lib/platforms/instagram";

interface PostRequest {
  imageUrl: string;
  caption: string;
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
    const { imageUrl, caption } = body;

    // Validate inputs
    if (!imageUrl || !caption) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required fields: imageUrl and caption",
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

    // Publish to Instagram
    const result = await publishImage(
      { accountId, accessToken },
      imageUrl,
      caption
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        platform: "instagram",
        containerId: result.containerId,
        publishedId: result.publishedId,
        message: "Successfully published to Instagram",
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
