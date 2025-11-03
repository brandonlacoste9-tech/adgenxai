// netlify/functions/post-to-tiktok.ts
// Netlify function to publish videos to TikTok (stub - requires implementation)

import { publishVideo } from "../../lib/platforms/tiktok";
import { createPlatformHandler } from "../../lib/platform-handler-base";

interface PostRequest {
  videoUrl: string;
  title: string;
}

export const handler = createPlatformHandler<PostRequest>({
  platformName: "TikTok",
  envVarNames: {
    clientKey: "TIKTOK_CLIENT_KEY",
    clientSecret: "TIKTOK_CLIENT_SECRET",
    accessToken: "TIKTOK_ACCESS_TOKEN",
  },
  requiredFields: ["videoUrl", "title"],
  buildConfig: (envVars) => ({
    clientKey: envVars.TIKTOK_CLIENT_KEY,
    clientSecret: envVars.TIKTOK_CLIENT_SECRET,
    accessToken: envVars.TIKTOK_ACCESS_TOKEN,
    openId: process.env.TIKTOK_OPEN_ID, // optional
  }),
  publishFn: async (config, request) => {
    return await publishVideo(config, request.videoUrl, request.title);
  },
  formatSuccessResponse: (result) => ({
    shareId: result.shareId,
  }),
});
