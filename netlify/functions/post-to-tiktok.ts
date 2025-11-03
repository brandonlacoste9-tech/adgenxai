// netlify/functions/post-to-tiktok.ts
// Netlify function to publish videos to TikTok (stub - requires implementation)

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { publishVideo } from "../../lib/platforms/tiktok";
import {
  validateHttpMethod,
  parseRequestBody,
  validateRequiredFields,
  validateEnvVars,
  successResponse,
  errorResponse,
} from "../../app/lib/netlify/function-helpers";

interface PostRequest {
  videoUrl: string;
  title: string;
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Validate HTTP method
  const methodError = validateHttpMethod(event, "POST");
  if (methodError) return methodError;

  // Parse request body
  const { body, error: parseError } = parseRequestBody<PostRequest>(event);
  if (parseError) return parseError;

  // Validate required fields
  const fieldsError = validateRequiredFields(body!, ["videoUrl", "title"]);
  if (fieldsError) return fieldsError;

  const { videoUrl, title } = body!;

  // Validate environment variables (openId is optional)
  const envError = validateEnvVars(
    {
      TIKTOK_CLIENT_KEY: process.env.TIKTOK_CLIENT_KEY,
      TIKTOK_CLIENT_SECRET: process.env.TIKTOK_CLIENT_SECRET,
      TIKTOK_ACCESS_TOKEN: process.env.TIKTOK_ACCESS_TOKEN,
    },
    "TikTok"
  );
  if (envError) return envError;

  try {
    // Note: TikTok publishing is not yet implemented
    // This will throw an error from the platform module
    const result = await publishVideo(
      {
        clientKey: process.env.TIKTOK_CLIENT_KEY!,
        clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
        accessToken: process.env.TIKTOK_ACCESS_TOKEN!,
        openId: process.env.TIKTOK_OPEN_ID,
      },
      videoUrl,
      title
    );

    return successResponse({
      success: true,
      platform: "tiktok",
      shareId: result.shareId,
      message: "Successfully published to TikTok",
    });
  } catch (error: any) {
    console.error("TikTok posting error:", error);

    // Check if it's the "not implemented" error
    if (error.message.includes("not implemented")) {
      return errorResponse(
        "TikTok publishing not yet implemented",
        "The TikTok Content Posting API integration needs to be completed. See lib/platforms/tiktok.ts",
        501
      );
    }

    return errorResponse("Failed to post to TikTok", error.message);
  }
};
