// netlify/functions/post-to-tiktok.ts
// Netlify function to publish videos to TikTok (stub - requires implementation)

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { z } from "zod";
import { publishVideo } from "../../lib/platforms/tiktok";
import { AuthError, requireAuth } from "../../lib/security/auth";
import { checkRateLimit } from "../../lib/security/rateLimiter";
import { logError, logInfo } from "../../lib/utils/logging";

interface PostRequest {
  videoUrl: string;
  title: string;
}

const requestSchema = z.object({
  videoUrl: z.string().url({ message: "videoUrl must be a valid URL" }),
  title: z.string().min(1, "title is required").max(220, "title too long"),
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
      requiredScopes: ["social:tiktok:write"],
    });

    const { videoUrl, title } = parseBody(event.body || null);

    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    const openId = process.env.TIKTOK_OPEN_ID;

    if (!clientKey || !clientSecret || !accessToken) {
      return jsonResponse(500, {
        error:
          "TikTok credentials not configured. Set TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, and TIKTOK_ACCESS_TOKEN environment variables.",
      });
    }

    const rateLimitPerMinute = parseInt(
      process.env.TIKTOK_RATE_LIMIT_PER_MINUTE || "5",
      10
    );
    const rateResult = checkRateLimit(
      `tiktok:${auth.userId}`,
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

    const result = await publishVideo(
      { clientKey, clientSecret, accessToken, openId },
      videoUrl,
      title
    );

    logInfo("Attempted TikTok publish", {
      userId: auth.userId,
      shareId: result.shareId,
    });

    return jsonResponse(200, {
      success: true,
      platform: "tiktok",
      shareId: result.shareId,
      message: "Successfully published to TikTok",
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return jsonResponse(error.statusCode, {
        error: error.message,
        code: error.code,
      });
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    logError("TikTok posting error", { eventId: context.awsRequestId }, error);

    if (message.includes("not implemented")) {
      return jsonResponse(501, {
        error: "TikTok publishing not yet implemented",
        details:
          "The TikTok Content Posting API integration needs to be completed. See lib/platforms/tiktok.ts",
      });
    }

    return jsonResponse(500, {
      error: "Failed to post to TikTok",
      details: message,
    });
  }
};
