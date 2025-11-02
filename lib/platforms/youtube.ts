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

export type YouTubeVideoMetadata = {
  title: string;
  description?: string;
  tags?: string[];
  privacyStatus?: "public" | "private" | "unlisted";
  categoryId?: string;
  thumbnailBase64?: string; // Base64 encoded thumbnail image
};

export async function publishVideo(
  config: YouTubeConfig,
  videoBuffer: Buffer,
  metadata: YouTubeVideoMetadata
): Promise<{ videoId: string }> {
  const { clientId, clientSecret, refreshToken } = config;
  const oAuth2 = new google.auth.OAuth2(clientId, clientSecret);
  oAuth2.setCredentials({ refresh_token: refreshToken });
  const youtube = google.youtube({ version: "v3", auth: oAuth2 });
  const tmpDir = os.tmpdir();
  const videoFilename = `upload-${Date.now()}.mp4`;
  const videoFilepath = path.join(tmpDir, videoFilename);
  
  await fs.promises.writeFile(videoFilepath, videoBuffer);
  
  try {
    // Upload video
    const res = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: metadata.title,
          description: metadata.description || "",
          tags: metadata.tags || [],
          ...(metadata.categoryId && { categoryId: metadata.categoryId }),
        },
        status: { privacyStatus: metadata.privacyStatus || "public" },
      },
      media: { body: fs.createReadStream(videoFilepath) },
    });

    const videoId = res.data.id!;

    // Upload thumbnail if provided
    if (metadata.thumbnailBase64) {
      const thumbnailBuffer = Buffer.from(metadata.thumbnailBase64, "base64");
      const thumbnailFilename = `thumbnail-${Date.now()}.jpg`;
      const thumbnailFilepath = path.join(tmpDir, thumbnailFilename);
      
      await fs.promises.writeFile(thumbnailFilepath, thumbnailBuffer);
      
      try {
        await youtube.thumbnails.set({
          videoId,
          media: { body: fs.createReadStream(thumbnailFilepath) },
        });
      } finally {
        try {
          await fs.promises.unlink(thumbnailFilepath);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }

    return { videoId };
  } finally {
    try {
      await fs.promises.unlink(videoFilepath);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}
