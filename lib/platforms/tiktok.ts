// lib/platforms/tiktok.ts
// TikTok Content Posting API integration helpers

export type TikTokConfig = {
  clientKey: string;
  clientSecret: string;
  accessToken: string;
  openId?: string;
};

type TikTokAPIError = {
  code?: number | string;
  message?: string;
  log_id?: string;
};

type TikTokInitResponse = {
  data?: {
    publish_id?: string;
  };
  error?: TikTokAPIError;
};

type TikTokStatusResponse = {
  data?: {
    status?: string;
    share_id?: string;
    item_id?: string;
    video_id?: string;
    video?: { id?: string };
    fail_reason?: string;
  };
  error?: TikTokAPIError;
};

const TIKTOK_API_BASE = "https://open.tiktokapis.com/v2";
const POLL_INTERVAL_MS = 2000;
const MAX_STATUS_POLLS = 10;

function ensureConfig(config: TikTokConfig) {
  if (!config.accessToken) {
    throw new Error("TikTok access token is required");
  }
  if (!config.clientKey) {
    throw new Error("TikTok client key is required");
  }
  if (!config.openId) {
    throw new Error("TikTok openId is required for publishing");
  }
}

function buildHeaders(config: TikTokConfig) {
  return {
    "Authorization": `Bearer ${config.accessToken}`,
    "Content-Type": "application/json; charset=utf-8",
    "X-Tt-Client-Key": config.clientKey,
  } satisfies Record<string, string>;
}

function formatTikTokError(error?: TikTokAPIError) {
  if (!error) return "Unknown TikTok API error";
  const parts = [] as string[];
  if (typeof error.code !== "undefined") {
    parts.push(`code=${error.code}`);
  }
  if (error.message) {
    parts.push(error.message);
  }
  if (error.log_id) {
    parts.push(`log_id=${error.log_id}`);
  }
  return parts.join(" ") || "TikTok API returned an error";
}

function isTikTokSuccess(error?: TikTokAPIError) {
  if (!error) return true;
  return error.code === 0 || error.code === "ok";
}

async function parseTikTokResponse<T extends TikTokInitResponse | TikTokStatusResponse>(
  response: Response
): Promise<T> {
  const text = await response.text();
  let json: T;
  try {
    json = text ? (JSON.parse(text) as T) : ({} as T);
  } catch (error) {
    throw new Error(`Failed to parse TikTok API response: ${text}`);
  }

  const error = (json as TikTokInitResponse | TikTokStatusResponse).error;
  if (!response.ok || (error && !isTikTokSuccess(error))) {
    throw new Error(formatTikTokError(error));
  }

  return json;
}

async function delay(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function publishVideo(
  config: TikTokConfig,
  videoUrl: string,
  title: string
): Promise<{ shareId: string }> {
  ensureConfig(config);

  const sanitizedTitle = title.trim().slice(0, 150);
  const initUrl = new URL(`${TIKTOK_API_BASE}/post/publish/content/init/`);
  initUrl.searchParams.set("open_id", config.openId!);

  const initResponse = await fetch(initUrl, {
    method: "POST",
    headers: buildHeaders(config),
    body: JSON.stringify({
      post_info: {
        title: sanitizedTitle,
        privacy_level: "PUBLIC_TO_EVERYONE",
      },
      source_info: {
        source: "PULL_FROM_URL",
        video_url: videoUrl,
      },
    }),
  });

  const initData = await parseTikTokResponse<TikTokInitResponse>(initResponse);
  const publishId = initData.data?.publish_id;
  if (!publishId) {
    throw new Error("TikTok API did not return a publish_id");
  }

  const statusUrl = new URL(`${TIKTOK_API_BASE}/post/publish/content/status/`);
  statusUrl.searchParams.set("publish_id", publishId);
  statusUrl.searchParams.set("open_id", config.openId!);

  for (let attempt = 0; attempt < MAX_STATUS_POLLS; attempt++) {
    const statusResponse = await fetch(statusUrl, {
      method: "GET",
      headers: buildHeaders(config),
    });

    const statusData = await parseTikTokResponse<TikTokStatusResponse>(statusResponse);
    const status = statusData.data?.status;

    if (status === "SUCCESS") {
      const shareId =
        statusData.data?.share_id ||
        statusData.data?.item_id ||
        statusData.data?.video_id ||
        statusData.data?.video?.id;

      if (!shareId) {
        throw new Error("TikTok API did not return a share identifier");
      }

      return { shareId };
    }

    if (status === "FAILED" || status === "ERROR") {
      const reason = statusData.data?.fail_reason;
      throw new Error(reason || "TikTok reported a failure while publishing");
    }

    await delay(POLL_INTERVAL_MS);
  }

  throw new Error("Timed out waiting for TikTok to finish publishing the video");
}
