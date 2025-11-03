// netlify/functions/post-to-youtube.ts
// Netlify function to upload videos to YouTube

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { publishVideo } from "../../lib/platforms/youtube";
import {
  validateHttpMethod,
  parseRequestBody,
  validateRequiredFields,
  validateEnvVars,
  successResponse,
  errorResponse,
} from "../../app/lib/netlify/function-helpers";

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
  // Validate HTTP method
  const methodError = validateHttpMethod(event, "POST");
  if (methodError) return methodError;

  // Parse request body
  const { body, error: parseError } = parseRequestBody<PostRequest>(event);
  if (parseError) return parseError;

  // Validate required fields
  const fieldsError = validateRequiredFields(body!, ["videoBase64", "title"]);
  if (fieldsError) return fieldsError;

  const { videoBase64, title, description, tags, privacyStatus } = body!;

  // Validate environment variables
  const envError = validateEnvVars(
    {
      YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
      YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,
      YOUTUBE_REFRESH_TOKEN: process.env.YOUTUBE_REFRESH_TOKEN,
    },
    "YouTube"
  );
  if (envError) return envError;

  try {
    // Convert base64 to Buffer
    const videoBuffer = Buffer.from(videoBase64, "base64");

    // Publish to YouTube
    const result = await publishVideo(
      {
        clientId: process.env.YOUTUBE_CLIENT_ID!,
        clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
        refreshToken: process.env.YOUTUBE_REFRESH_TOKEN!,
      },
      videoBuffer,
      {
        title,
        description: description || "",
        tags: tags || [],
        privacyStatus: privacyStatus || "public",
      }
    );

    return successResponse({
      success: true,
      platform: "youtube",
      videoId: result.videoId,
      videoUrl: `https://www.youtube.com/watch?v=${result.videoId}`,
      message: "Successfully uploaded to YouTube",
    });
  } catch (error: any) {
    console.error("YouTube upload error:", error);
    return errorResponse("Failed to upload to YouTube", error.message);
  }
};
