// lib/platforms/instagram.ts
// Instagram Graph API publishing helpers

export type InstagramConfig = {
  accountId: string;
  accessToken: string;
};

export async function publishImage(
  config: InstagramConfig,
  imageUrl: string,
  caption: string
): Promise<{ containerId: string; publishedId: string }> {
  const { accountId, accessToken } = config;

  const createRes = await fetch(
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

  if (!createRes.ok) {
    const errorBody = await createRes.text();
    throw new Error(
      `Failed to create Instagram media (status ${createRes.status}): ${errorBody}`
    );
  }

  const createData = (await createRes.json()) as { id?: string };
  if (!createData.id) {
    throw new Error(`Failed to create Instagram media: ${JSON.stringify(createData)}`);
  }

  const publishRes = await fetch(
    `https://graph.facebook.com/v17.0/${accountId}/media_publish`,
    {
      method: "POST",
      body: new URLSearchParams({
        creation_id: createData.id,
        access_token: accessToken,
      }),
    }
  );

  if (!publishRes.ok) {
    const errorBody = await publishRes.text();
    throw new Error(
      `Failed to publish Instagram media (status ${publishRes.status}): ${errorBody}`
    );
  }

  const publishData = (await publishRes.json()) as { id?: string };
  if (!publishData.id) {
    throw new Error(`Failed to publish Instagram media: ${JSON.stringify(publishData)}`);
  }

  return { containerId: createData.id, publishedId: publishData.id };
}
