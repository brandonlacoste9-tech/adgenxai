// lib/platforms/tiktok.ts
// TikTok Content Posting API implementation

export type TikTokConfig = {
  clientKey: string;
  clientSecret: string;
  accessToken: string;
  openId?: string;
};

export type VideoUploadInfo = {
  uploadUrl: string;
  publishId: string;
};

export type PublishResult = {
  shareId: string;
  shareUrl?: string;
};

/**
 * Step 1: Initialize video upload and get upload URL
 */
export async function initializeVideoUpload(
  config: TikTokConfig
): Promise<VideoUploadInfo> {
  const { clientKey, accessToken } = config;
  
  const response = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source_info: {
        source: "FILE_UPLOAD",
        video_size: 50 * 1024 * 1024, // 50MB max
        chunk_size: 10 * 1024 * 1024,  // 10MB chunks
        total_chunk_count: 1
      }
    }),
  });

  const data = await response.json();
  
  if (!response.ok || data.error) {
    throw new Error(`TikTok init failed: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    uploadUrl: data.data.upload_url,
    publishId: data.data.publish_id
  };
}

/**
 * Step 2: Upload video file to TikTok's servers
 */
export async function uploadVideoFile(
  uploadUrl: string,
  videoBuffer: Buffer
): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "video/mp4",
      "Content-Range": `bytes 0-${videoBuffer.length - 1}/${videoBuffer.length}`,
    },
    body: new Uint8Array(videoBuffer),
  });

  if (!response.ok) {
    throw new Error(`TikTok upload failed: ${response.status} ${response.statusText}`);
  }
}

/**
 * Step 3: Publish the uploaded video
 */
export async function publishUploadedVideo(
  config: TikTokConfig,
  publishId: string,
  metadata: {
    title: string;
    description?: string;
    privacyLevel?: "SELF_ONLY" | "MUTUAL_FOLLOW_FRIENDS" | "FOLLOWER_OF_POSTER" | "PUBLIC_TO_EVERYONE";
    disableComment?: boolean;
    disableDuet?: boolean;
    disableStitch?: boolean;
    brandContentToggle?: boolean;
    brandOrganicToggle?: boolean;
  }
): Promise<PublishResult> {
  const { accessToken } = config;
  
  const response = await fetch("https://open.tiktokapis.com/v2/post/publish/", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publish_id: publishId,
      post_info: {
        title: metadata.title,
        description: metadata.description || "",
        privacy_level: metadata.privacyLevel || "PUBLIC_TO_EVERYONE",
        disable_comment: metadata.disableComment || false,
        disable_duet: metadata.disableDuet || false,
        disable_stitch: metadata.disableStitch || false,
        brand_content_toggle: metadata.brandContentToggle || false,
        brand_organic_toggle: metadata.brandOrganicToggle || false,
      }
    }),
  });

  const data = await response.json();
  
  if (!response.ok || data.error) {
    throw new Error(`TikTok publish failed: ${data.error?.message || 'Unknown error'}`);
  }

  return {
    shareId: data.data.share_id,
    shareUrl: data.data.share_url
  };
}

/**
 * Complete video publishing workflow (URL-based)
 */
export async function publishVideo(
  config: TikTokConfig,
  videoUrl: string,
  title: string,
  options: {
    description?: string;
    privacyLevel?: "SELF_ONLY" | "MUTUAL_FOLLOW_FRIENDS" | "FOLLOWER_OF_POSTER" | "PUBLIC_TO_EVERYONE";
    disableComment?: boolean;
    disableDuet?: boolean;
    disableStitch?: boolean;
  } = {}
): Promise<{ shareId: string; shareUrl?: string }> {
  try {
    // Step 1: Download video from URL
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.status}`);
    }
    
    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
    
    // Step 2: Initialize upload
    const uploadInfo = await initializeVideoUpload(config);
    
    // Step 3: Upload video file
    await uploadVideoFile(uploadInfo.uploadUrl, videoBuffer);
    
    // Step 4: Publish video
    const result = await publishUploadedVideo(config, uploadInfo.publishId, {
      title,
      description: options.description,
      privacyLevel: options.privacyLevel,
      disableComment: options.disableComment,
      disableDuet: options.disableDuet,
      disableStitch: options.disableStitch,
    });
    
    return result;
  } catch (error) {
    console.error("TikTok publishing error:", error);
    throw error;
  }
}
