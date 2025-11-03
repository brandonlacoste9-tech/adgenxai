// netlify/functions/post-to-youtube.ts
// Netlify function to upload videos to YouTube

import { publishVideo } from "../../lib/platforms/youtube";
import { createPlatformHandler } from "../../lib/platform-handler-base";

interface PostRequest {
  videoBase64: string; // Base64 encoded video file
  title: string;
  description?: string;
  tags?: string[];
  privacyStatus?: "public" | "private" | "unlisted";
}

export const handler = createPlatformHandler<PostRequest>({
  platformName: "YouTube",
  envVarNames: {
    clientId: "YOUTUBE_CLIENT_ID",
    clientSecret: "YOUTUBE_CLIENT_SECRET",
    refreshToken: "YOUTUBE_REFRESH_TOKEN",
  },
  requiredFields: ["videoBase64", "title"],
  buildConfig: (envVars) => ({
    clientId: envVars.YOUTUBE_CLIENT_ID,
    clientSecret: envVars.YOUTUBE_CLIENT_SECRET,
    refreshToken: envVars.YOUTUBE_REFRESH_TOKEN,
  }),
  publishFn: async (config, request) => {
    // Convert base64 to Buffer
    const videoBuffer = Buffer.from(request.videoBase64, "base64");

    return await publishVideo(config, videoBuffer, {
      title: request.title,
      description: request.description || "",
      tags: request.tags || [],
      privacyStatus: request.privacyStatus || "public",
    });
  },
  formatSuccessResponse: (result) => ({
    videoId: result.videoId,
    videoUrl: `https://www.youtube.com/watch?v=${result.videoId}`,
  }),
});
