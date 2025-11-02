import type { Handler } from '@netlify/functions';
import { z } from 'zod';

import { buildEventKey, getEventsStore, storeName } from './utils/events-store';

type Headers = Record<string, string | undefined>;

const payloadSchema = z
  .object({
    action: z.string().optional(),
    repository: z
      .object({
        full_name: z.string().optional(),
        html_url: z.string().optional()
      })
      .optional(),
    sender: z
      .object({
        login: z.string().optional(),
        html_url: z.string().optional()
      })
      .optional()
  })
  .passthrough();

type GithubWebhookPayload = z.infer<typeof payloadSchema>;

type StorageResult = {
  stored: boolean;
  key: string | null;
  error?: string;
};

const headerValue = (headers: Headers, name: string): string | undefined => {
  const lower = name.toLowerCase();
  return headers[name] ?? headers[lower] ?? headers[name.toUpperCase()];
};

const parsePayload = (body: string | null): GithubWebhookPayload | null => {
  if (!body) {
    return null;
  }

  try {
    const parsed = JSON.parse(body);
    const result = payloadSchema.safeParse(parsed);
    if (!result.success) {
      console.warn('Invalid GitHub webhook payload shape', result.error.flatten());
      return null;
    }

    return result.data;
  } catch (error) {
    console.warn('Failed to parse GitHub webhook payload', error);
    return null;
  }
};

const persistEvent = async (
  deliveryId: string | undefined,
  eventType: string | undefined,
  payload: GithubWebhookPayload,
  receivedAt: string
): Promise<StorageResult> => {
  const store = getEventsStore();
  if (!store) {
    return {
      stored: false,
      key: null,
      error: `Blob store "${storeName}" is not configured`
    };
  }

  const key = buildEventKey(deliveryId);
  const summary = {
    deliveryId: deliveryId ?? null,
    event: eventType ?? 'unknown',
    action: payload.action ?? null,
    repository: payload.repository?.full_name ?? null,
    sender: payload.sender?.login ?? null,
    receivedAt
  };

  const metadata: Record<string, unknown> = {
    receivedAt
  };

  if (summary.event) {
    metadata.eventType = summary.event;
  }

  if (summary.action) {
    metadata.action = summary.action;
  }

  if (summary.repository) {
    metadata.repository = summary.repository;
  }

  if (summary.sender) {
    metadata.sender = summary.sender;
  }

  try {
    await store.setJSON(key, { ...summary, payload }, { metadata });
    return {
      stored: true,
      key
    };
  } catch (error) {
    console.error('Failed to persist webhook payload to blob store', error);
    return {
      stored: false,
      key,
      error: error instanceof Error ? error.message : 'Unknown storage error'
    };
  }
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const payload = parsePayload(event.body ?? null);

  if (!payload) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON payload' })
    };
  }

  const githubEvent = headerValue(event.headers ?? {}, 'x-github-event');
  const deliveryId = headerValue(event.headers ?? {}, 'x-github-delivery');
  const receivedAt = new Date().toISOString();

  console.log('📥 Webhook received:', {
    event: githubEvent,
    deliveryId,
    repository: payload.repository?.full_name,
    action: payload.action,
    timestamp: receivedAt
  });

  const storage = await persistEvent(deliveryId, githubEvent, payload, receivedAt);

  const responseBody = {
    received: true,
    deliveryId: deliveryId ?? null,
    event: githubEvent ?? 'unknown',
    message: '🧠 AdgenXAI Sensory Cortex - Event Processed',
    repository: payload.repository?.full_name ?? null,
    action: payload.action ?? null,
    sender: payload.sender?.login ?? null,
    timestamp: receivedAt,
    storage
  };

  const statusCode = storage.stored ? 200 : 202;

  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(responseBody)
  };
};
