import type { Handler } from '@netlify/functions';

import { getEventsStore, storeName } from './utils/events-store';

type CountMap = Record<string, number>;

type TelemetryEvent = {
  key: string;
  deliveryId: string | null;
  eventType: string;
  action: string | null;
  repository: string | null;
  sender: string | null;
  receivedAt: string | null;
};

const increment = (map: CountMap, key: string | null) => {
  if (!key) {
    return;
  }

  map[key] = (map[key] ?? 0) + 1;
};

const coerceString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  return null;
};

const computeTelemetry = async () => {
  const store = getEventsStore();
  if (!store) {
    return {
      events: [],
      configured: false
    };
  }

  const { blobs } = await store.list({ prefix: 'events/' });
  const events: TelemetryEvent[] = [];

  for (const blob of blobs) {
    const result = await store.getWithMetadata(blob.key, { type: 'json' });
    if (!result) {
      continue;
    }

    const { data, metadata } = result;
    const parsed = typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : {};
    const meta = (metadata as Record<string, unknown> | undefined) ?? {};

    const eventType = coerceString(meta['eventType']) ?? coerceString(parsed['event']) ?? 'unknown';
    const action = coerceString(meta['action']) ?? coerceString(parsed['action']);
    const repository = coerceString(meta['repository']) ?? coerceString(parsed['repository']);
    const senderFromMeta = coerceString(meta['sender']);
    const senderFromParsed = coerceString(parsed['sender']);
    const senderFromObject = typeof parsed['sender'] === 'object' && parsed['sender'] !== null
      ? coerceString((parsed['sender'] as Record<string, unknown>)['login'])
      : null;
    const sender = senderFromMeta ?? senderFromParsed ?? senderFromObject;
    const receivedAt = coerceString(meta['receivedAt']) ?? coerceString(parsed['receivedAt']);
    const deliveryId = coerceString(parsed['deliveryId']);

    events.push({
      key: blob.key,
      eventType,
      action,
      repository,
      sender,
      receivedAt,
      deliveryId: deliveryId ?? null
    });
  }

  return {
    events,
    configured: true
  };
};

export const handler: Handler = async () => {
  try {
    const { events, configured } = await computeTelemetry();

    if (!configured) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: {
            totalEvents: 0,
            eventTypes: {},
            actions: {},
            repositories: {},
            processing: {
              mode: 'observation',
              enabled: process.env.ENABLE_WEBHOOK_PROCESSING === 'true'
            },
            timeRange: {
              start: null,
              end: null
            }
          },
          storage: {
            configured: false,
            storeName
          },
          recentEvents: []
        })
      };
    }

    const eventTypeCounts: CountMap = {};
    const actionCounts: CountMap = {};
    const repositoryCounts: CountMap = {};
    const validTimestamps: number[] = [];

    for (const event of events) {
      increment(eventTypeCounts, event.eventType);
      increment(actionCounts, event.action);
      increment(repositoryCounts, event.repository);

      if (event.receivedAt) {
        const timestamp = Date.parse(event.receivedAt);
        if (!Number.isNaN(timestamp)) {
          validTimestamps.push(timestamp);
        }
      }
    }

    validTimestamps.sort((a, b) => a - b);

    const sortedEvents = events
      .slice()
      .sort((a, b) => {
        const left = a.receivedAt ? Date.parse(a.receivedAt) : 0;
        const right = b.receivedAt ? Date.parse(b.receivedAt) : 0;
        return right - left;
      });

    const recentEvents = sortedEvents.slice(0, 5).map((event) => ({
      deliveryId: event.deliveryId,
      event: event.eventType,
      action: event.action,
      repository: event.repository,
      sender: event.sender,
      receivedAt: event.receivedAt
    }));

    const timeRange = validTimestamps.length > 0
      ? {
          start: new Date(validTimestamps[0]).toISOString(),
          end: new Date(validTimestamps[validTimestamps.length - 1]).toISOString()
        }
      : {
          start: null,
          end: null
        };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stats: {
          totalEvents: events.length,
          eventTypes: eventTypeCounts,
          actions: actionCounts,
          repositories: repositoryCounts,
          processing: {
            mode: 'observation',
            enabled: process.env.ENABLE_WEBHOOK_PROCESSING === 'true'
          },
          timeRange
        },
        storage: {
          configured: true,
          storeName,
          items: events.length
        },
        recentEvents
      })
    };
  } catch (error) {
    console.error('Failed to compute webhook telemetry', error);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Failed to compute webhook telemetry',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
