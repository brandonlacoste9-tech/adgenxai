// lib/platforms/__tests__/instagram.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { publishImage, publishStory, InstagramConfig } from "../instagram";

// Mock fetch globally
global.fetch = vi.fn();

describe("Instagram Platform Integration", () => {
  const mockConfig: InstagramConfig = {
    accountId: "test-account-id",
    accessToken: "test-access-token",
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("publishImage", () => {
    it("should successfully publish an image post", async () => {
      const imageUrl = "https://example.com/photo.jpg";
      const caption = "Test caption #instagram";

      // Mock create media response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "container-123" }),
      });

      // Mock publish media response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "published-456" }),
      });

      const result = await publishImage(mockConfig, imageUrl, caption);

      expect(result).toEqual({
        containerId: "container-123",
        publishedId: "published-456",
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("should retry on failure with exponential backoff", async () => {
      const imageUrl = "https://example.com/photo.jpg";
      const caption = "Test caption";

      // Mock first attempt fails
      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      // Mock second attempt succeeds
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "container-retry" }),
      });

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "published-retry" }),
      });

      const result = await publishImage(mockConfig, imageUrl, caption, {
        maxRetries: 2,
        retryDelay: 100,
      });

      expect(result).toEqual({
        containerId: "container-retry",
        publishedId: "published-retry",
      });

      // Should have retried the create call
      expect(global.fetch).toHaveBeenCalledTimes(3); // 2 create attempts + 1 publish
    });

    it("should handle create media API errors", async () => {
      const imageUrl = "https://example.com/photo.jpg";
      const caption = "Test caption";

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: {
            message: "Invalid image URL",
            type: "OAuthException",
            code: 100,
          },
        }),
      });

      await expect(publishImage(mockConfig, imageUrl, caption)).rejects.toThrow(
        /Instagram create media failed/
      );
    });

    it("should handle missing container ID", async () => {
      const imageUrl = "https://example.com/photo.jpg";
      const caption = "Test caption";

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}), // Missing id field
      });

      await expect(publishImage(mockConfig, imageUrl, caption)).rejects.toThrow(
        /Failed to create Instagram media/
      );
    });
  });

  describe("publishStory", () => {
    it("should successfully publish a story", async () => {
      const imageUrl = "https://example.com/story.jpg";

      // Mock create story response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "story-container-789" }),
      });

      // Mock publish story response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "story-published-012" }),
      });

      const result = await publishStory(mockConfig, imageUrl);

      expect(result).toEqual({
        containerId: "story-container-789",
        publishedId: "story-published-012",
      });

      // Verify story-specific API call
      const createCall = (global.fetch as any).mock.calls[0];
      const createParams = new URLSearchParams(createCall[1].body);
      expect(createParams.get("media_type")).toBe("STORIES");
    });

    it("should handle story publish errors", async () => {
      const imageUrl = "https://example.com/story.jpg";

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "story-container" }),
      });

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: {
            message: "Story format not supported",
          },
        }),
      });

      await expect(publishStory(mockConfig, imageUrl)).rejects.toThrow(
        /Instagram publish story failed/
      );
    });
  });
});
