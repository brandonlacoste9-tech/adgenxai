// netlify/functions/post-to-instagram.ts
// Netlify function to publish images to Instagram

import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { z } from "zod";
import { publishImage } from "../../lib/platforms/instagram";
import { AuthError, requireAuth } from "../../lib/security/auth";
import { checkRateLimit } from "../../lib/security/rateLimiter";
import { logError, logInfo } from "../../lib/utils/logging";

interface PostRequest {
  imageUrl: string;
  caption: string;
}

const requestSchema = z.object({
  imageUrl: z.string().url({ message: "imageUrl must be a valid URL" }),
  caption: z
    .string()
    .min(1, "caption is required")
    .max(2200, "caption must be 2200 characters or fewer"),
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
      requiredScopes: ["social:instagram:write"],
    });

    const { imageUrl, caption } = parseBody(event.body || null);

    const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accountId || !accessToken) {
      return jsonResponse(500, {
        error:
          "Instagram credentials not configured. Set INSTAGRAM_ACCOUNT_ID and INSTAGRAM_ACCESS_TOKEN environment variables.",
      });
    }

    const rateLimitPerMinute = parseInt(
      process.env.INSTAGRAM_RATE_LIMIT_PER_MINUTE || "10",
      10
    );
    const rateResult = checkRateLimit(
      `instagram:${auth.userId}`,
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

    const result = await publishImage(
      { accountId, accessToken },
      imageUrl,
      caption
    );

    logInfo("Published image to Instagram", {
      userId: auth.userId,
      containerId: result.containerId,
      publishedId: result.publishedId,
    });

    return jsonResponse(200, {
      success: true,
      platform: "instagram",
      containerId: result.containerId,
      publishedId: result.publishedId,
      message: "Successfully published to Instagram",
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return jsonResponse(error.statusCode, {
        error: error.message,
        code: error.code,
      });
    }

    logError("Instagram posting error", { eventId: context.awsRequestId }, error);
    return jsonResponse(500, {
      error: "Failed to post to Instagram",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
