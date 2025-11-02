// lib/platforms/__tests__/index.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { publishToMultiplePlatforms, publishToPlatform, PlatformConfig, ContentData } from "../index";
import * as Instagram from "../instagram";
import * as YouTube from "../youtube";
import * as TikTok from "../tiktok";

// Mock platform modules
vi.mock("../instagram");
vi.mock("../youtube");
vi.mock("../tiktok");

global.fetch = vi.fn();

describe("Platform Orchestrator", () => {
  const mockConfig: PlatformConfig = {
    instagram: {
      accountId: "test-account",
      accessToken: "test-token",
    },
    youtube: {
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      refreshToken: "test-refresh-token",
    },
    tiktok: {
      clientKey: "test-client-key",
      clientSecret: "test-client-secret",
      accessToken: "test-access-token",
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("publishToPlatform", () => {
    it("should publish image to Instagram", async () => {
      const content: ContentData = {
        type: "image",
        url: "https://example.com/image.jpg",
        caption: "Test caption",
      };

      vi.spyOn(Instagram, "publishImage").mockResolvedValue({
        containerId: "container-123",
        publishedId: "published-456",
      });

      const result = await publishToPlatform("instagram", mockConfig, content);

      expect(result).toMatchObject({
        platform: "instagram",
        success: true,
        publishedId: "published-456",
        containerId: "container-123",
      });

      expect(Instagram.publishImage).toHaveBeenCalledWith(
        mockConfig.instagram,
        content.url,
        content.caption
      );
    });

    it("should publish story to Instagram", async () => {
      const content: ContentData = {
        type: "image",
        url: "https://example.com/story.jpg",
        metadata: { mediaType: "story" },
      };

      vi.spyOn(Instagram, "publishStory").mockResolvedValue({
        containerId: "story-container",
        publishedId: "story-published",
      });

      const result = await publishToPlatform("instagram", mockConfig, content);

      expect(result).toMatchObject({
        platform: "instagram",
        success: true,
      });

      expect(Instagram.publishStory).toHaveBeenCalledWith(
        mockConfig.instagram,
        content.url
      );
    });

    it("should publish video to YouTube", async () => {
      const content: ContentData = {
        type: "video",
        url: "https://example.com/video.mp4",
        title: "Test Video",
        description: "Test description",
        tags: ["test", "video"],
      };

      // Mock video fetch
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(1024),
      });

      vi.spyOn(YouTube, "publishVideo").mockResolvedValue({
        videoId: "test-video-id",
      });

      const result = await publishToPlatform("youtube", mockConfig, content);

      expect(result).toMatchObject({
        platform: "youtube",
        success: true,
        videoId: "test-video-id",
        url: "https://www.youtube.com/watch?v=test-video-id",
      });
    });

    it("should publish video to TikTok", async () => {
      const content: ContentData = {
        type: "video",
        url: "https://example.com/video.mp4",
        title: "TikTok Video",
        description: "TikTok description",
      };

      vi.spyOn(TikTok, "publishVideo").mockResolvedValue({
        shareId: "share-123",
        publishId: "publish-456",
      });

      const result = await publishToPlatform("tiktok", mockConfig, content);

      expect(result).toMatchObject({
        platform: "tiktok",
        success: true,
        shareId: "share-123",
        publishedId: "publish-456",
      });
    });

    it("should throw error for unsupported platform", async () => {
      const content: ContentData = {
        type: "image",
        url: "https://example.com/image.jpg",
      };

      await expect(
        publishToPlatform("unsupported" as any, mockConfig, content)
      ).rejects.toThrow(/Unsupported platform/);
    });

    it("should throw error when Instagram receives video content", async () => {
      const content: ContentData = {
        type: "video",
        url: "https://example.com/video.mp4",
      };

      await expect(
        publishToPlatform("instagram", mockConfig, content)
      ).rejects.toThrow(/Instagram only supports image content/);
    });

    it("should throw error when YouTube receives image content", async () => {
      const content: ContentData = {
        type: "image",
        url: "https://example.com/image.jpg",
      };

      await expect(
        publishToPlatform("youtube", mockConfig, content)
      ).rejects.toThrow(/YouTube only supports video content/);
    });
  });

  describe("publishToMultiplePlatforms", () => {
    it("should publish to multiple platforms successfully", async () => {
      const content: ContentData = {
        type: "image",
        url: "https://example.com/image.jpg",
        caption: "Multi-platform post",
      };

      vi.spyOn(Instagram, "publishImage").mockResolvedValue({
        containerId: "container-1",
        publishedId: "published-1",
      });

      const results = await publishToMultiplePlatforms(
        ["instagram"],
        mockConfig,
        content
      );

      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        platform: "instagram",
        success: true,
      });
    });

    it("should handle partial failures gracefully", async () => {
      const content: ContentData = {
        type: "video",
        url: "https://example.com/video.mp4",
        title: "Test Video",
      };

      // Mock video fetch
      (global.fetch as any).mockResolvedValue({
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(1024),
      });

      // YouTube succeeds
      vi.spyOn(YouTube, "publishVideo").mockResolvedValue({
        videoId: "success-video",
      });

      // TikTok fails
      vi.spyOn(TikTok, "publishVideo").mockRejectedValue(
        new Error("TikTok API error")
      );

      const results = await publishToMultiplePlatforms(
        ["youtube", "tiktok"],
        mockConfig,
        content
      );

      expect(results).toHaveLength(2);

      // First result (YouTube) should succeed
      expect(results[0]).toMatchObject({
        platform: "youtube",
        success: true,
        videoId: "success-video",
      });

      // Second result (TikTok) should fail
      expect(results[1]).toMatchObject({
        platform: "tiktok",
        success: false,
        error: "TikTok API error",
      });
    });

    it("should handle all platforms failing", async () => {
      const content: ContentData = {
        type: "video",
        url: "https://example.com/video.mp4",
        title: "Failing Video",
      };

      // Mock video fetch failing
      (global.fetch as any).mockRejectedValue(new Error("Network error"));

      const results = await publishToMultiplePlatforms(
        ["youtube", "tiktok"],
        mockConfig,
        content
      );

      expect(results).toHaveLength(2);
      expect(results.every((r) => !r.success)).toBe(true);
    });
  });
});
