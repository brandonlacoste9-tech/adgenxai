import crypto from "crypto";
import type { HandlerContext, HandlerEvent, HandlerResponse } from "@netlify/functions";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("../../../lib/platforms/instagram", () => ({
  publishImage: vi.fn().mockResolvedValue({
    containerId: "container-1",
    publishedId: "published-1",
  }),
}));

vi.mock("../../../lib/platforms/youtube", () => ({
  publishVideo: vi.fn().mockResolvedValue({
    videoId: "video-1",
  }),
}));

vi.mock("../../../lib/platforms/tiktok", () => ({
  publishVideo: vi.fn().mockRejectedValue(
    new Error("TikTok publishing not implemented. Add TikTok Content Posting API flow.")
  ),
}));

import { handler as instagramHandler } from "../post-to-instagram";
import { handler as youtubeHandler } from "../post-to-youtube";
import { handler as tiktokHandler } from "../post-to-tiktok";
import { resetRateLimits } from "../../../lib/security/rateLimiter";

const TEST_SECRET = "test-secret";

async function invokeHandler(
  handler: (
    event: HandlerEvent,
    context: HandlerContext
  ) => Promise<HandlerResponse | void> | HandlerResponse | void,
  event: Partial<HandlerEvent>,
  context: Partial<HandlerContext> = {}
): Promise<HandlerResponse> {
  const result = await handler(event as HandlerEvent, context as HandlerContext);
  if (!result) {
    throw new Error("Handler returned no response");
  }
  return result;
}

function signToken(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
    "base64url"
  );
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", TEST_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

beforeEach(() => {
  process.env.POSTING_JWT_SECRET = TEST_SECRET;
  process.env.INSTAGRAM_ACCOUNT_ID = "acct";
  process.env.INSTAGRAM_ACCESS_TOKEN = "token";
  process.env.YOUTUBE_CLIENT_ID = "client";
  process.env.YOUTUBE_CLIENT_SECRET = "secret";
  process.env.YOUTUBE_REFRESH_TOKEN = "refresh";
  process.env.TIKTOK_CLIENT_KEY = "key";
  process.env.TIKTOK_CLIENT_SECRET = "secret";
  process.env.TIKTOK_ACCESS_TOKEN = "access";
  process.env.TIKTOK_OPEN_ID = "open";
  delete process.env.INSTAGRAM_RATE_LIMIT_PER_MINUTE;
  delete process.env.YOUTUBE_RATE_LIMIT_PER_MINUTE;
  delete process.env.TIKTOK_RATE_LIMIT_PER_MINUTE;
  resetRateLimits();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("post-to-instagram", () => {
  it("requires authentication", async () => {
    const response = await invokeHandler(
      instagramHandler,
      {
        httpMethod: "POST",
        headers: {},
        body: JSON.stringify({ imageUrl: "https://example.com", caption: "hi" }),
      },
      {}
    );

    expect(response.statusCode).toBe(401);
  });

  it("publishes successfully with valid token", async () => {
    const token = signToken({
      sub: "user-1",
      scope: ["social:instagram:write"],
      exp: Math.floor(Date.now() / 1000) + 60,
    });

    const response = await invokeHandler(
      instagramHandler,
      {
        httpMethod: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ imageUrl: "https://example.com", caption: "hi" }),
      },
      { awsRequestId: "req-1" }
    );

    expect(response.statusCode).toBe(200);
    if (!response.body) {
      throw new Error("Expected response body");
    }
    const payload = JSON.parse(response.body);
    expect(payload.platform).toBe("instagram");
    expect(payload.containerId).toBe("container-1");
  });

  it("enforces rate limiting", async () => {
    process.env.INSTAGRAM_RATE_LIMIT_PER_MINUTE = "2";
    const token = signToken({
      sub: "user-1",
      scope: ["social:instagram:write"],
      exp: Math.floor(Date.now() / 1000) + 60,
    });

    const event: Partial<HandlerEvent> = {
      httpMethod: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ imageUrl: "https://example.com", caption: "hi" }),
    };

    const first = await invokeHandler(instagramHandler, event, {
      awsRequestId: "req-1",
    });
    const second = await invokeHandler(instagramHandler, event, {
      awsRequestId: "req-2",
    });
    const third = await invokeHandler(instagramHandler, event, {
      awsRequestId: "req-3",
    });

    expect(first.statusCode).toBe(200);
    expect(second.statusCode).toBe(200);
    expect(third.statusCode).toBe(429);
  });
});

describe("post-to-youtube", () => {
  it("rejects missing scope", async () => {
    const token = signToken({
      sub: "user-1",
      scope: ["social:instagram:write"],
      exp: Math.floor(Date.now() / 1000) + 60,
    });

    const response = await invokeHandler(
      youtubeHandler,
      {
        httpMethod: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ videoBase64: "ZmFrZQ==", title: "Hello" }),
      },
      { awsRequestId: "req-4" }
    );

    expect(response.statusCode).toBe(403);
  });

  it("uploads when authorized", async () => {
    const token = signToken({
      sub: "user-2",
      scope: ["social:youtube:write"],
      exp: Math.floor(Date.now() / 1000) + 60,
    });

    const response = await invokeHandler(
      youtubeHandler,
      {
        httpMethod: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ videoBase64: "ZmFrZQ==", title: "Hello" }),
      },
      { awsRequestId: "req-5" }
    );

    expect(response.statusCode).toBe(200);
    if (!response.body) {
      throw new Error("Expected response body");
    }
    const payload = JSON.parse(response.body);
    expect(payload.videoId).toBe("video-1");
  });
});

describe("post-to-tiktok", () => {
  it("propagates not implemented as 501", async () => {
    const token = signToken({
      sub: "user-3",
      scope: ["social:tiktok:write"],
      exp: Math.floor(Date.now() / 1000) + 60,
    });

    const response = await invokeHandler(
      tiktokHandler,
      {
        httpMethod: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ videoUrl: "https://example.com/video.mp4", title: "Hello" }),
      },
      { awsRequestId: "req-6" }
    );

    expect(response.statusCode).toBe(501);
    if (!response.body) {
      throw new Error("Expected response body");
    }
    const payload = JSON.parse(response.body);
    expect(payload.error).toContain("not yet implemented");
  });
});
