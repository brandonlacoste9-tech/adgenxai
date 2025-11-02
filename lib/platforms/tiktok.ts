// lib/platforms/tiktok.ts
// TikTok Content Posting API implementation

export type TikTokConfig = {
  clientKey: string;
  clientSecret: string;
  accessToken: string;
  openId?: string;
};

export type TikTokVideoMetadata = {
  title: string;
  description?: string;
  privacy_level?: "PUBLIC_TO_EVERYONE" | "MUTUAL_FOLLOW_FRIENDS" | "FOLLOWER_OF_CREATOR" | "SELF_ONLY";
  disable_duet?: boolean;
  disable_comment?: boolean;
  disable_stitch?: boolean;
  video_cover_timestamp_ms?: number;
};

interface TikTokInitResponse {
  data?: {
    publish_id: string;
    upload_url: string;
  };
  error?: {
    code: string;
    message: string;
    log_id: string;
  };
}

interface TikTokPublishResponse {
  data?: {
    publish_id: string;
    share_id: string;
  };
  error?: {
    code: string;
    message: string;
    log_id: string;
  };
}

export async function publishVideo(
  config: TikTokConfig,
  videoUrl: string,
  title: string,
  metadata?: Partial<TikTokVideoMetadata>
): Promise<{ shareId: string; publishId: string }> {
  const { accessToken } = config;

  // Step 1: Initialize video upload
  const postInfo = {
    title,
    description: metadata?.description || "",
    privacy_level: metadata?.privacy_level || "PUBLIC_TO_EVERYONE",
    disable_duet: metadata?.disable_duet || false,
    disable_comment: metadata?.disable_comment || false,
    disable_stitch: metadata?.disable_stitch || false,
    ...(metadata?.video_cover_timestamp_ms && {
      video_cover_timestamp_ms: metadata.video_cover_timestamp_ms,
    }),
  };

  const initResponse = await fetch(
    "https://open.tiktokapis.com/v2/post/publish/video/init/",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        post_info: postInfo,
        source_info: {
          source: "PULL_FROM_URL",
          video_url: videoUrl,
        },
      }),
    }
  );

  if (!initResponse.ok) {
    const errorData = await initResponse.json() as TikTokInitResponse;
    throw new Error(
      `TikTok init failed (${initResponse.status}): ${JSON.stringify(errorData.error || errorData)}`
    );
  }

  const initData = await initResponse.json() as TikTokInitResponse;
  
  if (!initData.data?.publish_id) {
    throw new Error(
      `TikTok init failed: Missing publish_id. Response: ${JSON.stringify(initData)}`
    );
  }

  const publishId = initData.data.publish_id;

  // Step 2: Check publish status (poll until complete)
  const maxRetries = 30; // 30 attempts with 2 second delay = 1 minute max
  const retryDelay = 2000; // 2 seconds

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, retryDelay));

    const statusResponse = await fetch(
      `https://open.tiktokapis.com/v2/post/publish/status/fetch/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          publish_id: publishId,
        }),
      }
    );

    if (!statusResponse.ok) {
      const errorData = await statusResponse.json() as TikTokPublishResponse;
      throw new Error(
        `TikTok status check failed (${statusResponse.status}): ${JSON.stringify(errorData.error || errorData)}`
      );
    }

    const statusData = await statusResponse.json() as TikTokPublishResponse;

    if (statusData.data?.share_id) {
      // Successfully published
      return {
        shareId: statusData.data.share_id,
        publishId: publishId,
      };
    }

    // Check for errors
    if (statusData.error) {
      throw new Error(
        `TikTok publish failed: ${statusData.error.message} (code: ${statusData.error.code})`
      );
    }
  }

  throw new Error(
    `TikTok publish timeout: Video did not complete publishing within expected time (publish_id: ${publishId})`
  );
}
