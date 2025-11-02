// lib/platforms/instagram.ts
// Instagram Graph API publishing helpers

export type InstagramConfig = {
  accountId: string;
  accessToken: string;
};

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Retry wrapper for API calls with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, retryDelay = 1000 } = options;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Retry failed");
}

export async function publishImage(
  config: InstagramConfig,
  imageUrl: string,
  caption: string,
  options: RetryOptions = {}
): Promise<{ containerId: string; publishedId: string }> {
  const { accountId, accessToken } = config;

  const createRes = await retryWithBackoff(async () => {
    const res = await fetch(
      `https://graph.facebook.com/v17.0/${accountId}/media`,
      {
        method: "POST",
        body: new URLSearchParams({
          image_url: imageUrl,
          caption,
          access_token: accessToken,
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Instagram create media failed (${res.status}): ${JSON.stringify(errorData)}`);
    }

    return res;
  }, options);

  const createData = (await createRes.json()) as { id?: string };
  if (!createData.id) {
    throw new Error(`Failed to create Instagram media: ${JSON.stringify(createData)}`);
  }

  const publishRes = await retryWithBackoff(async () => {
    const res = await fetch(
      `https://graph.facebook.com/v17.0/${accountId}/media_publish`,
      {
        method: "POST",
        body: new URLSearchParams({
          creation_id: createData.id!,
          access_token: accessToken,
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Instagram publish media failed (${res.status}): ${JSON.stringify(errorData)}`);
    }

    return res;
  }, options);

  const publishData = (await publishRes.json()) as { id?: string };
  if (!publishData.id) {
    throw new Error(`Failed to publish Instagram media: ${JSON.stringify(publishData)}`);
  }

  return { containerId: createData.id, publishedId: publishData.id };
}

export async function publishStory(
  config: InstagramConfig,
  imageUrl: string,
  options: RetryOptions = {}
): Promise<{ containerId: string; publishedId: string }> {
  const { accountId, accessToken } = config;

  const createRes = await retryWithBackoff(async () => {
    const res = await fetch(
      `https://graph.facebook.com/v17.0/${accountId}/media`,
      {
        method: "POST",
        body: new URLSearchParams({
          image_url: imageUrl,
          media_type: "STORIES",
          access_token: accessToken,
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Instagram create story failed (${res.status}): ${JSON.stringify(errorData)}`);
    }

    return res;
  }, options);

  const createData = (await createRes.json()) as { id?: string };
  if (!createData.id) {
    throw new Error(`Failed to create Instagram story: ${JSON.stringify(createData)}`);
  }

  const publishRes = await retryWithBackoff(async () => {
    const res = await fetch(
      `https://graph.facebook.com/v17.0/${accountId}/media_publish`,
      {
        method: "POST",
        body: new URLSearchParams({
          creation_id: createData.id!,
          access_token: accessToken,
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Instagram publish story failed (${res.status}): ${JSON.stringify(errorData)}`);
    }

    return res;
  }, options);

  const publishData = (await publishRes.json()) as { id?: string };
  if (!publishData.id) {
    throw new Error(`Failed to publish Instagram story: ${JSON.stringify(publishData)}`);
  }

  return { containerId: createData.id, publishedId: publishData.id };
}
