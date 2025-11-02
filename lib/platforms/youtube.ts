// lib/platforms/youtube.ts
// YouTube Data API v3 publish helper

import fs from "fs";
import os from "os";
import path from "path";
import { google } from "googleapis";

export type YouTubeConfig = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

export type VideoMetadata = {
  title: string;
  description?: string;
  tags?: string[];
  privacyStatus?: "public" | "private" | "unlisted";
  categoryId?: string;
  thumbnailUrl?: string;
};

/**
 * Publish video from Buffer (existing functionality)
 */
export async function publishVideo(
  config: YouTubeConfig,
  videoBuffer: Buffer,
  metadata: VideoMetadata
): Promise<{ videoId: string }> {
  const { clientId, clientSecret, refreshToken } = config;
  const oAuth2 = new google.auth.OAuth2(clientId, clientSecret);
  oAuth2.setCredentials({ refresh_token: refreshToken });
  const youtube = google.youtube({ version: "v3", auth: oAuth2 });
  
  const tmpDir = os.tmpdir();
  const filename = `upload-${Date.now()}.mp4`;
  const filepath = path.join(tmpDir, filename);
  
  await fs.promises.writeFile(filepath, videoBuffer);
  
  try {
    const res = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: metadata.title,
          description: metadata.description || "",
          tags: metadata.tags || [],
          categoryId: metadata.categoryId || "22", // People & Blogs
        },
        status: { privacyStatus: metadata.privacyStatus || "public" },
      },
      media: { body: fs.createReadStream(filepath) },
    });
    
    // Set custom thumbnail if provided
    if (metadata.thumbnailUrl && res.data.id) {
      await setVideoThumbnail(youtube, res.data.id, metadata.thumbnailUrl);
    }
    
    return { videoId: res.data.id! };
  } finally {
    try { 
      await fs.promises.unlink(filepath); 
    } catch (e) { 
      console.warn("Failed to cleanup temp file:", e);
    }
  }
}

/**
 * Publish video from URL (new functionality)
 */
export async function publishVideoFromUrl(
  config: YouTubeConfig,
  videoUrl: string,
  metadata: VideoMetadata
): Promise<{ videoId: string }> {
  try {
    // Download video from URL
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.status} ${videoResponse.statusText}`);
    }
    
    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
    
    // Use existing upload functionality
    return await publishVideo(config, videoBuffer, metadata);
  } catch (error) {
    console.error("YouTube URL publishing error:", error);
    throw error;
  }
}

/**
 * Set custom thumbnail for a video
 */
async function setVideoThumbnail(
  youtube: any,
  videoId: string,
  thumbnailUrl: string
): Promise<void> {
  try {
    // Download thumbnail
    const thumbResponse = await fetch(thumbnailUrl);
    if (!thumbResponse.ok) {
      throw new Error(`Failed to download thumbnail: ${thumbResponse.status}`);
    }
    
    const thumbBuffer = Buffer.from(await thumbResponse.arrayBuffer());
    
    // Create temp file for thumbnail
    const tmpDir = os.tmpdir();
    const thumbFilename = `thumb-${Date.now()}.jpg`;
    const thumbFilepath = path.join(tmpDir, thumbFilename);
    
    await fs.promises.writeFile(thumbFilepath, thumbBuffer);
    
    try {
      await youtube.thumbnails.set({
        videoId: videoId,
        media: { body: fs.createReadStream(thumbFilepath) },
      });
    } finally {
      try {
        await fs.promises.unlink(thumbFilepath);
      } catch (e) {
        console.warn("Failed to cleanup thumbnail temp file:", e);
      }
    }
  } catch (error) {
    console.warn("Failed to set custom thumbnail:", error);
    // Don't throw - thumbnail is optional
  }
}

/**
 * Publish YouTube Short (optimized for shorts format)
 */
export async function publishShort(
  config: YouTubeConfig,
  videoUrl: string,
  metadata: Omit<VideoMetadata, 'categoryId'> & {
    isShort?: boolean;
  }
): Promise<{ videoId: string }> {
  const shortMetadata: VideoMetadata = {
    ...metadata,
    categoryId: "24", // Entertainment category for Shorts
    description: `${metadata.description || ""}\n\n#Shorts`.trim(),
  };
  
  return await publishVideoFromUrl(config, videoUrl, shortMetadata);
}
