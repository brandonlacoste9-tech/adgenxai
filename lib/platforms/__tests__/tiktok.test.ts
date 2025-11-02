// lib/platforms/__tests__/tiktok.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { publishVideo, TikTokConfig, TikTokVideoMetadata } from "../tiktok";

// Mock fetch globally
global.fetch = vi.fn();

describe("TikTok Platform Integration", () => {
  const mockConfig: TikTokConfig = {
    clientKey: "test-client-key",
    clientSecret: "test-client-secret",
    accessToken: "test-access-token",
    openId: "test-open-id",
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("publishVideo", () => {
    it("should successfully publish a video with minimal metadata", async () => {
      const videoUrl = "https://example.com/video.mp4";
      const title = "Test Video";

      // Mock init response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            publish_id: "pub-123456",
            upload_url: "https://upload.tiktok.com/...",
          },
        }),
      });

      // Mock status check response (success on first check)
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            publish_id: "pub-123456",
            share_id: "7123456789012345678",
          },
        }),
      });

      const result = await publishVideo(mockConfig, videoUrl, title);

      expect(result).toEqual({
        shareId: "7123456789012345678",
        publishId: "pub-123456",
      });

      // Verify init call
      expect(global.fetch).toHaveBeenCalledWith(
        "https://open.tiktokapis.com/v2/post/publish/video/init/",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer test-access-token",
            "Content-Type": "application/json; charset=UTF-8",
          }),
        })
      );
    });

    it("should handle init API errors", async () => {
      const videoUrl = "https://example.com/video.mp4";
      const title = "Test Video";

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: {
            code: "invalid_request",
            message: "Invalid video URL",
            log_id: "log-123",
          },
        }),
      });

      await expect(publishVideo(mockConfig, videoUrl, title)).rejects.toThrow(
        /TikTok init failed/
      );
    });
  });
});
