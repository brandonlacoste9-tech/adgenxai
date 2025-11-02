import { getStore } from '@netlify/blobs';

export type EventsStore = ReturnType<typeof getStore>;

let cachedStore: EventsStore | null | undefined;

const STORE_NAME = 'adgenxai-webhook-events';

export const getEventsStore = (): EventsStore | null => {
  if (cachedStore !== undefined) {
    return cachedStore;
  }

  try {
    cachedStore = getStore({ name: STORE_NAME });
  } catch (error) {
    console.error('Failed to initialize webhook events store', error);
    cachedStore = null;
  }

  return cachedStore;
};

export const buildEventKey = (deliveryId: string | undefined): string => {
  if (deliveryId) {
    const sanitized = deliveryId.trim().replace(/[^a-zA-Z0-9-_.]/g, '_');
    if (sanitized.length > 0) {
      return `events/${sanitized}`;
    }
  }

  return `events/generated-${Date.now()}`;
};

export const storeName = STORE_NAME;
