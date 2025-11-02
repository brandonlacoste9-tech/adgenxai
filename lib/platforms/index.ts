// lib/platforms/index.ts
// Centralized platform management and publishing orchestration

import * as Instagram from "./instagram";
import * as YouTube from "./youtube";
import * as TikTok from "./tiktok";

export type PlatformType = "instagram" | "youtube" | "tiktok";

export interface PlatformConfig {
  instagram?: Instagram.InstagramConfig;
  youtube?: YouTube.YouTubeConfig;
  tiktok?: TikTok.TikTokConfig;
}

export interface ContentData {
  type: "image" | "video";
  url: string;
  title?: string;
  caption?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface PublishResult {
  platform: PlatformType;
  success: boolean;
  publishedId?: string;
  containerId?: string;
  videoId?: string;
  shareId?: string;
  url?: string;
  error?: string;
}

/**
 * Publish content to multiple platforms
 */
export async function publishToMultiplePlatforms(
  platforms: PlatformType[],
  config: PlatformConfig,
  content: ContentData
): Promise<PublishResult[]> {
  const results: PublishResult[] = [];

  for (const platform of platforms) {
    try {
      const result = await publishToPlatform(platform, config, content);
      results.push(result);
    } catch (error: any) {
      results.push({
        platform,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

/**
 * Publish content to a single platform
 */
export async function publishToPlatform(
  platform: PlatformType,
  config: PlatformConfig,
  content: ContentData
): Promise<PublishResult> {
  switch (platform) {
    case "instagram":
      return await publishToInstagram(config.instagram!, content);
    case "youtube":
      return await publishToYouTube(config.youtube!, content);
    case "tiktok":
      return await publishToTikTok(config.tiktok!, content);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

async function publishToInstagram(
  config: Instagram.InstagramConfig,
  content: ContentData
): Promise<PublishResult> {
  if (content.type !== "image") {
    throw new Error("Instagram only supports image content via this API");
  }

  const mediaType = content.metadata?.mediaType || "post";
  
  const result = mediaType === "story"
    ? await Instagram.publishStory(config, content.url)
    : await Instagram.publishImage(config, content.url, content.caption || "");

  return {
    platform: "instagram",
    success: true,
    publishedId: result.publishedId,
    containerId: result.containerId,
    url: `https://www.instagram.com/p/${result.publishedId}`,
  };
}

async function publishToYouTube(
  config: YouTube.YouTubeConfig,
  content: ContentData
): Promise<PublishResult> {
  if (content.type !== "video") {
    throw new Error("YouTube only supports video content");
  }

  // Fetch video from URL
  const videoResponse = await fetch(content.url);
  if (!videoResponse.ok) {
    throw new Error(`Failed to fetch video from ${content.url}`);
  }
  
  const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

  const metadata: YouTube.YouTubeVideoMetadata = {
    title: content.title || "Untitled Video",
    description: content.description,
    tags: content.tags,
    privacyStatus: content.metadata?.privacyStatus || "public",
    categoryId: content.metadata?.categoryId,
    thumbnailBase64: content.metadata?.thumbnailBase64,
  };

  const result = await YouTube.publishVideo(config, videoBuffer, metadata);

  return {
    platform: "youtube",
    success: true,
    videoId: result.videoId,
    url: `https://www.youtube.com/watch?v=${result.videoId}`,
  };
}

async function publishToTikTok(
  config: TikTok.TikTokConfig,
  content: ContentData
): Promise<PublishResult> {
  if (content.type !== "video") {
    throw new Error("TikTok only supports video content");
  }

  const metadata: Partial<TikTok.TikTokVideoMetadata> = {
    description: content.description,
    privacy_level: content.metadata?.privacy_level,
    disable_duet: content.metadata?.disable_duet,
    disable_comment: content.metadata?.disable_comment,
    disable_stitch: content.metadata?.disable_stitch,
    video_cover_timestamp_ms: content.metadata?.video_cover_timestamp_ms,
  };

  const result = await TikTok.publishVideo(
    config,
    content.url,
    content.title || "Untitled Video",
    metadata
  );

  return {
    platform: "tiktok",
    success: true,
    shareId: result.shareId,
    publishedId: result.publishId,
    url: `https://www.tiktok.com/@user/video/${result.shareId}`,
  };
}

// Export platform-specific modules
export { Instagram, YouTube, TikTok };
