// netlify/functions/post-to-youtube.ts
// Netlify function to upload videos to YouTube

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { z } from "zod";
import { publishVideo } from "../../lib/platforms/youtube";
import { AuthError, requireAuth } from "../../lib/security/auth";
import { checkRateLimit } from "../../lib/security/rateLimiter";
import { logError, logInfo } from "../../lib/utils/logging";

interface PostRequest {
  videoBase64: string; // Base64 encoded video file
  title: string;
  description?: string;
  tags?: string[];
  privacyStatus?: "public" | "private" | "unlisted";
}

const requestSchema = z.object({
  videoBase64: z.string().min(1, "videoBase64 is required"),
  title: z.string().min(1, "title is required").max(100, "title too long"),
  description: z.string().max(5000, "description too long").optional(),
  tags: z.array(z.string().min(1, "tags cannot be empty")).max(500).optional(),
  privacyStatus: z.enum(["public", "private", "unlisted"]).optional(),
});

function jsonResponse(
  statusCode: number,
  body: unknown,
  extraHeaders?: Record<string, string>
) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...(extraHeaders || {}) },
    body: JSON.stringify(body),
  };
}

function parseBody(body: string | null): PostRequest {
  try {
    const json = JSON.parse(body || "{}");
    const parsed = requestSchema.safeParse(json);
    if (!parsed.success) {
      const message = parsed.error.errors.map((e) => e.message).join(", ");
      throw new AuthError(message, 400, "invalid_request");
    }
    return parsed.data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new AuthError("Request body must be valid JSON", 400, "invalid_request");
    }
    throw error;
  }
}

function decodeVideo(base64: string): Buffer {
  try {
    return Buffer.from(base64, "base64");
  } catch {
    throw new AuthError(
      "videoBase64 must be valid base64-encoded content",
      400,
      "invalid_request"
    );
  }
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed. Use POST." });
  }

  try {
    const auth = requireAuth(event.headers || {}, {
      requiredScopes: ["social:youtube:write"],
    });

    const { videoBase64, title, description, tags, privacyStatus } = parseBody(
      event.body || null
    );

    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      return jsonResponse(500, {
        error:
          "YouTube credentials not configured. Set YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, and YOUTUBE_REFRESH_TOKEN environment variables.",
      });
    }

    const rateLimitPerMinute = parseInt(
      process.env.YOUTUBE_RATE_LIMIT_PER_MINUTE || "6",
      10
    );
    const rateResult = checkRateLimit(
      `youtube:${auth.userId}`,
      rateLimitPerMinute,
      60_000
    );

    if (!rateResult.allowed) {
      return jsonResponse(
        429,
        {
          error: "Rate limit exceeded",
          retryAt: new Date(rateResult.reset).toISOString(),
        },
        {
          "Retry-After": String(
            Math.max(1, Math.ceil((rateResult.reset - Date.now()) / 1000))
          ),
        }
      );
    }

    const videoBuffer = decodeVideo(videoBase64);

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

    logInfo("Uploaded video to YouTube", {
      userId: auth.userId,
      videoId: result.videoId,
    });

    return jsonResponse(200, {
      success: true,
      platform: "youtube",
      videoId: result.videoId,
      videoUrl: `https://www.youtube.com/watch?v=${result.videoId}`,
      message: "Successfully uploaded to YouTube",
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return jsonResponse(error.statusCode, {
        error: error.message,
        code: error.code,
      });
    }

    logError("YouTube upload error", { eventId: context.awsRequestId }, error);
    return jsonResponse(500, {
      error: "Failed to upload to YouTube",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
