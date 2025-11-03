// netlify/functions/post-to-instagram.ts
// Netlify function to publish images to Instagram

import { publishImage } from "../../lib/platforms/instagram";
import { createPlatformHandler } from "../../lib/platform-handler-base";

interface PostRequest {
  imageUrl: string;
  caption: string;
}

export const handler = createPlatformHandler<PostRequest>({
  platformName: "Instagram",
  envVarNames: {
    accountId: "INSTAGRAM_ACCOUNT_ID",
    accessToken: "INSTAGRAM_ACCESS_TOKEN",
  },
  requiredFields: ["imageUrl", "caption"],
  buildConfig: (envVars) => ({
    accountId: envVars.INSTAGRAM_ACCOUNT_ID,
    accessToken: envVars.INSTAGRAM_ACCESS_TOKEN,
  }),
  publishFn: async (config, request) => {
    return await publishImage(config, request.imageUrl, request.caption);
  },
  formatSuccessResponse: (result) => ({
    containerId: result.containerId,
    publishedId: result.publishedId,
  }),
});
