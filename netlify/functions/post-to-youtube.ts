// netlify/functions/post-to-youtube.ts
// Netlify function to upload videos to YouTube

import { Handler } from "@netlify/functions";
import { publishVideo } from "../../lib/platforms/youtube";
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
    const validation = validateBody(event.body, schemas.youtubePost);
    if (!validation.success) {
      return validation.response;
    }

    const { videoUrl, title, description, tags, privacyStatus } = validation.data;

    // Get YouTube credentials from environment variables
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      return errorResponse(
        "YouTube credentials not configured. Set YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, and YOUTUBE_REFRESH_TOKEN environment variables.",
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.MISSING_CONFIGURATION
      );
    }

    // Note: This function expects a videoUrl from the validation schema
    // but the platform function expects a Buffer. We'll need to download the video
    // For now, we'll return a helpful error
    return errorResponse(
      "YouTube video upload requires implementation",
      HttpStatus.SERVICE_UNAVAILABLE,
      ErrorCode.SERVICE_UNAVAILABLE,
      {
        message: "Video download and buffer conversion needs to be implemented",
        videoUrl,
      }
    );

    // TODO: Implement video download from URL
    // const videoResponse = await fetch(videoUrl);
    // const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
    //
    // const result = await publishVideo(
    //   { clientId, clientSecret, refreshToken },
    //   videoBuffer,
    //   {
    //     title,
    //     description: description || "",
    //     tags: tags || [],
    //     privacyStatus: privacyStatus || "public",
    //   }
    // );
    //
    // return successResponse(
    //   {
    //     platform: "youtube",
    //     videoId: result.videoId,
    //     videoUrl: `https://www.youtube.com/watch?v=${result.videoId}`,
    //     message: "Successfully uploaded to YouTube",
    //   },
    //   HttpStatus.OK,
    //   {
    //     requestId,
    //     responseTime: timer.elapsed(),
    //   }
    // );
  } catch (error: any) {
    console.error("YouTube upload error:", error);
    return errorResponse(
      "Failed to upload to YouTube",
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.EXTERNAL_API_ERROR,
      { message: error.message }
    );
  }
};
