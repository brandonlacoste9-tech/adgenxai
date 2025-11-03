// netlify/functions/post-to-instagram.ts
// Netlify function to publish images to Instagram

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { publishImage } from "../../lib/platforms/instagram";
import {
  validateHttpMethod,
  parseRequestBody,
  validateRequiredFields,
  validateEnvVars,
  successResponse,
  errorResponse,
} from "../../app/lib/netlify/function-helpers";

interface PostRequest {
  imageUrl: string;
  caption: string;
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
  const fieldsError = validateRequiredFields(body!, ["imageUrl", "caption"]);
  if (fieldsError) return fieldsError;

  const { imageUrl, caption } = body!;

  // Validate environment variables
  const envError = validateEnvVars(
    {
      INSTAGRAM_ACCOUNT_ID: process.env.INSTAGRAM_ACCOUNT_ID,
      INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,
    },
    "Instagram"
  );
  if (envError) return envError;

  try {
    // Publish to Instagram
    const result = await publishImage(
      {
        accountId: process.env.INSTAGRAM_ACCOUNT_ID!,
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN!,
      },
      imageUrl,
      caption
    );

    return successResponse({
      success: true,
      platform: "instagram",
      containerId: result.containerId,
      publishedId: result.publishedId,
      message: "Successfully published to Instagram",
    });
  } catch (error: any) {
    console.error("Instagram posting error:", error);
    return errorResponse("Failed to post to Instagram", error.message);
  }
};
