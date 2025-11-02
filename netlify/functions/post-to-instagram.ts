// netlify/functions/post-to-instagram.ts
// Netlify function to publish images to Instagram

import { Handler } from "@netlify/functions";
import { publishImage } from "../../lib/platforms/instagram";
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
    const validation = validateBody(event.body, schemas.instagramPost);
    if (!validation.success) {
      return validation.response;
    }

    const { imageUrl, caption } = validation.data;

    // Get Instagram credentials from environment variables
    const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accountId || !accessToken) {
      return errorResponse(
        "Instagram credentials not configured. Set INSTAGRAM_ACCOUNT_ID and INSTAGRAM_ACCESS_TOKEN environment variables.",
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.MISSING_CONFIGURATION
      );
    }

    // Publish to Instagram
    const result = await publishImage(
      { accountId, accessToken },
      imageUrl,
      caption
    );

    return successResponse(
      {
        platform: "instagram",
        containerId: result.containerId,
        publishedId: result.publishedId,
        message: "Successfully published to Instagram",
      },
      HttpStatus.OK,
      {
        requestId,
        responseTime: timer.elapsed(),
      }
    );
  } catch (error: any) {
    console.error("Instagram posting error:", error);
    return errorResponse(
      "Failed to post to Instagram",
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.EXTERNAL_API_ERROR,
      { message: error.message }
    );
  }
};
