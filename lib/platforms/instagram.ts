// lib/platforms/instagram.ts
// Instagram Graph API publishing helpers

export type InstagramConfig = {
  accountId: string;
  accessToken: string;
};

export type MediaType = "IMAGE" | "VIDEO" | "REELS" | "STORIES";

export type PublishResult = {
  containerId: string;
  publishedId: string;
  permalink?: string;
};

/**
 * Publish image to Instagram feed
 */
export async function publishImage(
  config: InstagramConfig,
  imageUrl: string,
  caption: string
): Promise<PublishResult> {
  return await publishMedia(config, {
    mediaType: "IMAGE",
    mediaUrl: imageUrl,
    caption,
  });
}

/**
 * Publish video to Instagram feed
 */
export async function publishVideo(
  config: InstagramConfig,
  videoUrl: string,
  caption: string,
  thumbnailUrl?: string
): Promise<PublishResult> {
  return await publishMedia(config, {
    mediaType: "VIDEO",
    mediaUrl: videoUrl,
    caption,
    thumbnailUrl,
  });
}

/**
 * Publish Instagram Reel
 */
export async function publishReel(
  config: InstagramConfig,
  videoUrl: string,
  caption: string,
  coverUrl?: string
): Promise<PublishResult> {
  return await publishMedia(config, {
    mediaType: "REELS",
    mediaUrl: videoUrl,
    caption,
    coverUrl,
  });
}

/**
 * Publish Instagram Story
 */
export async function publishStory(
  config: InstagramConfig,
  mediaUrl: string,
  mediaType: "IMAGE" | "VIDEO" = "IMAGE"
): Promise<PublishResult> {
  return await publishMedia(config, {
    mediaType: "STORIES",
    mediaUrl,
    isStory: true,
    storyMediaType: mediaType,
  });
}

/**
 * Generic media publishing function
 */
async function publishMedia(
  config: InstagramConfig,
  options: {
    mediaType: MediaType;
    mediaUrl: string;
    caption?: string;
    thumbnailUrl?: string;
    coverUrl?: string;
    isStory?: boolean;
    storyMediaType?: "IMAGE" | "VIDEO";
  }
): Promise<PublishResult> {
  const { accountId, accessToken } = config;
  const { mediaType, mediaUrl, caption, thumbnailUrl, coverUrl, isStory, storyMediaType } = options;

  // Step 1: Create media container
  const createParams = new URLSearchParams({
    access_token: accessToken,
  });

  if (isStory) {
    // Stories have different parameters
    createParams.append("media_type", storyMediaType || "IMAGE");
    if (storyMediaType === "IMAGE") {
      createParams.append("image_url", mediaUrl);
    } else {
      createParams.append("video_url", mediaUrl);
    }
  } else {
    // Regular posts, videos, and reels
    if (mediaType === "IMAGE") {
      createParams.append("image_url", mediaUrl);
    } else {
      createParams.append("video_url", mediaUrl);
      createParams.append("media_type", mediaType);
    }

    if (caption) {
      createParams.append("caption", caption);
    }

    if (thumbnailUrl && mediaType === "VIDEO") {
      createParams.append("thumb_offset", "0");
    }

    if (coverUrl && mediaType === "REELS") {
      createParams.append("cover_url", coverUrl);
    }
  }

  const endpoint = isStory 
    ? `https://graph.facebook.com/v18.0/${accountId}/media`
    : `https://graph.facebook.com/v18.0/${accountId}/media`;

  const createRes = await fetch(endpoint, {
    method: "POST",
    body: createParams,
  });

  const createData = await createRes.json();
  if (!createRes.ok || !createData.id) {
    throw new Error(`Failed to create Instagram media: ${JSON.stringify(createData)}`);
  }

  // Step 2: Publish the media
  const publishEndpoint = isStory
    ? `https://graph.facebook.com/v18.0/${accountId}/media_publish`
    : `https://graph.facebook.com/v18.0/${accountId}/media_publish`;

  const publishRes = await fetch(publishEndpoint, {
    method: "POST",
    body: new URLSearchParams({
      creation_id: createData.id,
      access_token: accessToken,
    }),
  });

  const publishData = await publishRes.json();
  if (!publishRes.ok || !publishData.id) {
    throw new Error(`Failed to publish Instagram media: ${JSON.stringify(publishData)}`);
  }

  // Step 3: Get permalink (for non-stories)
  let permalink;
  if (!isStory) {
    try {
      const permalinkRes = await fetch(
        `https://graph.facebook.com/v18.0/${publishData.id}?fields=permalink&access_token=${accessToken}`
      );
      const permalinkData = await permalinkRes.json();
      permalink = permalinkData.permalink;
    } catch (error) {
      console.warn("Failed to get permalink:", error);
    }
  }

  return {
    containerId: createData.id,
    publishedId: publishData.id,
    permalink,
  };
}

/**
 * Publish carousel (multiple images/videos)
 */
export async function publishCarousel(
  config: InstagramConfig,
  items: Array<{
    mediaUrl: string;
    mediaType: "IMAGE" | "VIDEO";
  }>,
  caption: string
): Promise<PublishResult> {
  const { accountId, accessToken } = config;

  // Step 1: Create media containers for each item
  const containerIds: string[] = [];

  for (const item of items) {
    const createParams = new URLSearchParams({
      access_token: accessToken,
      is_carousel_item: "true",
    });

    if (item.mediaType === "IMAGE") {
      createParams.append("image_url", item.mediaUrl);
    } else {
      createParams.append("video_url", item.mediaUrl);
      createParams.append("media_type", "VIDEO");
    }

    const createRes = await fetch(
      `https://graph.facebook.com/v18.0/${accountId}/media`,
      {
        method: "POST",
        body: createParams,
      }
    );

    const createData = await createRes.json();
    if (!createRes.ok || !createData.id) {
      throw new Error(`Failed to create carousel item: ${JSON.stringify(createData)}`);
    }

    containerIds.push(createData.id);
  }

  // Step 2: Create carousel container
  const carouselParams = new URLSearchParams({
    media_type: "CAROUSEL",
    children: containerIds.join(","),
    caption,
    access_token: accessToken,
  });

  const carouselRes = await fetch(
    `https://graph.facebook.com/v18.0/${accountId}/media`,
    {
      method: "POST",
      body: carouselParams,
    }
  );

  const carouselData = await carouselRes.json();
  if (!carouselRes.ok || !carouselData.id) {
    throw new Error(`Failed to create carousel: ${JSON.stringify(carouselData)}`);
  }

  // Step 3: Publish carousel
  const publishRes = await fetch(
    `https://graph.facebook.com/v18.0/${accountId}/media_publish`,
    {
      method: "POST",
      body: new URLSearchParams({
        creation_id: carouselData.id,
        access_token: accessToken,
      }),
    }
  );

  const publishData = await publishRes.json();
  if (!publishRes.ok || !publishData.id) {
    throw new Error(`Failed to publish carousel: ${JSON.stringify(publishData)}`);
  }

  // Get permalink
  let permalink;
  try {
    const permalinkRes = await fetch(
      `https://graph.facebook.com/v18.0/${publishData.id}?fields=permalink&access_token=${accessToken}`
    );
    const permalinkData = await permalinkRes.json();
    permalink = permalinkData.permalink;
  } catch (error) {
    console.warn("Failed to get permalink:", error);
  }

  return {
    containerId: carouselData.id,
    publishedId: publishData.id,
    permalink,
  };
}
