// examples/social-posting-client.ts
// Example client code to call the social media posting functions

/**
 * Post an image to Instagram
 */
export async function postToInstagram(
  imageUrl: string,
  caption: string
): Promise<{ containerId: string; publishedId: string }> {
  const response = await fetch("/.netlify/functions/post-to-instagram", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageUrl,
      caption,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to post to Instagram");
  }

  const result = await response.json();
  return {
    containerId: result.containerId,
    publishedId: result.publishedId,
  };
}

/**
 * Upload a video to YouTube
 */
export async function postToYouTube(
  videoFile: File,
  title: string,
  options?: {
    description?: string;
    tags?: string[];
    privacyStatus?: "public" | "private" | "unlisted";
  }
): Promise<{ videoId: string; videoUrl: string }> {
  // Convert file to base64
  const videoBase64 = await fileToBase64(videoFile);

  const response = await fetch("/.netlify/functions/post-to-youtube", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      videoBase64,
      title,
      description: options?.description,
      tags: options?.tags,
      privacyStatus: options?.privacyStatus || "public",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload to YouTube");
  }

  const result = await response.json();
  return {
    videoId: result.videoId,
    videoUrl: result.videoUrl,
  };
}

/**
 * Post a video to TikTok (not yet implemented)
 */
export async function postToTikTok(
  videoUrl: string,
  title: string
): Promise<{ shareId: string }> {
  const response = await fetch("/.netlify/functions/post-to-tiktok", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      videoUrl,
      title,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to post to TikTok");
  }

  const result = await response.json();
  return {
    shareId: result.shareId,
  };
}

/**
 * Helper: Convert File to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1]; // Remove data:video/mp4;base64, prefix
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Example usage:
/*

// Instagram example
try {
  const result = await postToInstagram(
    "https://example.com/my-image.jpg",
    "Check out this amazing content! 🚀 #adgenxai"
  );
  console.log("Posted to Instagram:", result.publishedId);
} catch (error) {
  console.error("Instagram error:", error);
}

// YouTube example
const videoFile = document.querySelector('input[type="file"]').files[0];
try {
  const result = await postToYouTube(
    videoFile,
    "My Awesome Video Title",
    {
      description: "This is an amazing video created with AdGenXAI",
      tags: ["adgenxai", "automation", "ai"],
      privacyStatus: "public"
    }
  );
  console.log("Uploaded to YouTube:", result.videoUrl);
} catch (error) {
  console.error("YouTube error:", error);
}

// TikTok example (not yet implemented)
try {
  const result = await postToTikTok(
    "https://example.com/my-video.mp4",
    "Amazing content!"
  );
  console.log("Posted to TikTok:", result.shareId);
} catch (error) {
  console.error("TikTok error:", error);
}

*/
