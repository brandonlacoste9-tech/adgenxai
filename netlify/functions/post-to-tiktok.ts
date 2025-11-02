// netlify/functions/post-to-tiktok.ts
// Netlify function to publish videos to TikTok (stub - requires implementation)

import { Handler } from "@netlify/functions";
import { publishVideo } from "../../lib/platforms/tiktok";
import {
  checkMethod,
  getRequestId,
  logRequest,
  createTimer,
  validateBody,
  schemas,
  successResponse,
  errorResponse,
  HttpStatus,
  ErrorCode,
} from "../../lib/api";

export const handler: Handler = async (event, context) => {
  const requestId = getRequestId(event);
  const timer = createTimer();

  // Log request
  logRequest(event, requestId);

  // Check HTTP method
  const methodCheck = checkMethod(event, ['POST']);
  if (methodCheck) return methodCheck;

  try {
    // Validate request body
    const validation = validateBody(event.body, schemas.tiktokPost);
    if (!validation.success) {
      return validation.response;
    }

    const { videoUrl, title, description, privacyLevel } = validation.data;

    // Get TikTok credentials from environment variables
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    const openId = process.env.TIKTOK_OPEN_ID;

    if (!clientKey || !clientSecret || !accessToken) {
      return errorResponse(
        "TikTok credentials not configured. Set TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, and TIKTOK_ACCESS_TOKEN environment variables.",
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.MISSING_CONFIGURATION
      );
    }

    // Note: TikTok publishing is not yet implemented
    // This will throw an error from the platform module
    const result = await publishVideo(
      { clientKey, clientSecret, accessToken, openId },
      videoUrl,
      title
    );

    return successResponse(
      {
        platform: "tiktok",
        shareId: result.shareId,
        message: "Successfully published to TikTok",
      },
      HttpStatus.OK,
      {
        requestId,
        responseTime: timer.elapsed(),
      }
    );
  } catch (error: any) {
    console.error("TikTok posting error:", error);

    // Check if it's the "not implemented" error
    if (error.message.includes("not implemented")) {
      return errorResponse(
        "TikTok publishing not yet implemented",
        HttpStatus.SERVICE_UNAVAILABLE,
        ErrorCode.SERVICE_UNAVAILABLE,
        {
          message: "The TikTok Content Posting API integration needs to be completed. See lib/platforms/tiktok.ts",
        }
      );
    }

    return errorResponse(
      "Failed to post to TikTok",
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.EXTERNAL_API_ERROR,
      { message: error.message }
    );
  }
};
