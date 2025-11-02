import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  initializeVideoUpload,
  uploadVideoFile,
  publishUploadedVideo,
  publishVideo,
  type TikTokConfig,
} from "../tiktok";

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

  describe("initializeVideoUpload", () => {
    it("should successfully initialize video upload", async () => {
      const mockResponse = {
        data: {
          upload_url: "https://test-upload-url.tiktok.com",
          publish_id: "test-publish-id-123",
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await initializeVideoUpload(mockConfig);

      expect(result).toEqual({
        uploadUrl: "https://test-upload-url.tiktok.com",
        publishId: "test-publish-id-123",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://open.tiktokapis.com/v2/post/publish/video/init/",
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: `Bearer ${mockConfig.accessToken}`,
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("should handle API errors during initialization", async () => {
      const mockErrorResponse = {
        error: { message: "Invalid access token" },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => mockErrorResponse,
      });

      await expect(initializeVideoUpload(mockConfig)).rejects.toThrow(
        "TikTok init failed: Invalid access token"
      );
    });
  });

  describe("uploadVideoFile", () => {
    it("should successfully upload video file", async () => {
      const uploadUrl = "https://test-upload-url.tiktok.com";
      const videoBuffer = Buffer.from("test-video-data");

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
      });

      await uploadVideoFile(uploadUrl, videoBuffer);

      expect(global.fetch).toHaveBeenCalledWith(
        uploadUrl,
        expect.objectContaining({
          method: "PUT",
          headers: {
            "Content-Type": "video/mp4",
            "Content-Range": `bytes 0-${videoBuffer.length - 1}/${videoBuffer.length}`,
          },
        })
      );
    });

    it("should handle upload failures", async () => {
      const uploadUrl = "https://test-upload-url.tiktok.com";
      const videoBuffer = Buffer.from("test-video-data");

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(uploadVideoFile(uploadUrl, videoBuffer)).rejects.toThrow(
        "TikTok upload failed: 500 Internal Server Error"
      );
    });
  });

  describe("publishUploadedVideo", () => {
    it("should successfully publish video with metadata", async () => {
      const publishId = "test-publish-id";
      const metadata = {
        title: "Test Video",
        description: "Test Description",
        privacyLevel: "PUBLIC_TO_EVERYONE" as const,
        disableComment: false,
        disableDuet: true,
        disableStitch: false,
      };

      const mockResponse = {
        data: {
          share_id: "test-share-id-456",
          share_url: "https://www.tiktok.com/@user/video/123456",
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await publishUploadedVideo(mockConfig, publishId, metadata);

      expect(result).toEqual({
        shareId: "test-share-id-456",
        shareUrl: "https://www.tiktok.com/@user/video/123456",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://open.tiktokapis.com/v2/post/publish/",
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: `Bearer ${mockConfig.accessToken}`,
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("should handle publish errors", async () => {
      const publishId = "test-publish-id";
      const metadata = {
        title: "Test Video",
      };

      const mockErrorResponse = {
        error: { message: "Video processing failed" },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => mockErrorResponse,
      });

      await expect(
        publishUploadedVideo(mockConfig, publishId, metadata)
      ).rejects.toThrow("TikTok publish failed: Video processing failed");
    });
  });

  describe("publishVideo (full workflow)", () => {
    it("should complete full video publishing workflow", async () => {
      const videoUrl = "https://example.com/test-video.mp4";
      const title = "Test Video";
      const options = {
        description: "Test Description",
        privacyLevel: "PUBLIC_TO_EVERYONE" as const,
      };

      // Mock video download
      const mockVideoData = new ArrayBuffer(100);
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => mockVideoData,
      });

      // Mock initialize upload
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            upload_url: "https://upload-url.tiktok.com",
            publish_id: "publish-123",
          },
        }),
      });

      // Mock upload video file
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
      });

      // Mock publish
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            share_id: "share-789",
            share_url: "https://tiktok.com/@user/video/789",
          },
        }),
      });

      const result = await publishVideo(mockConfig, videoUrl, title, options);

      expect(result).toEqual({
        shareId: "share-789",
        shareUrl: "https://tiktok.com/@user/video/789",
      });

      // Verify all steps were called
      expect(global.fetch).toHaveBeenCalledTimes(4);
    });

    it("should handle video download failures", async () => {
      const videoUrl = "https://example.com/test-video.mp4";
      const title = "Test Video";

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(publishVideo(mockConfig, videoUrl, title)).rejects.toThrow(
        "Failed to download video: 404"
      );
    });

    it("should propagate errors from any step in the workflow", async () => {
      const videoUrl = "https://example.com/test-video.mp4";
      const title = "Test Video";

      // Mock successful video download
      const mockVideoData = new ArrayBuffer(100);
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => mockVideoData,
      });

      // Mock failed initialize upload
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: { message: "Rate limit exceeded" },
        }),
      });

      await expect(publishVideo(mockConfig, videoUrl, title)).rejects.toThrow(
        "TikTok init failed: Rate limit exceeded"
      );
    });
  });

  describe("TikTok configuration validation", () => {
    it("should work with minimal config (without openId)", async () => {
      const minimalConfig = {
        clientKey: "test-key",
        clientSecret: "test-secret",
        accessToken: "test-token",
      };

      const mockResponse = {
        data: {
          upload_url: "https://upload.tiktok.com",
          publish_id: "pub-123",
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await initializeVideoUpload(minimalConfig);

      expect(result.publishId).toBe("pub-123");
    });
  });
});
