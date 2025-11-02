export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
}

interface RateLimitState {
  count: number;
  expiresAt: number;
}

const limitStates = new Map<string, RateLimitState>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = limitStates.get(key);

  if (!existing || existing.expiresAt <= now) {
    limitStates.set(key, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, reset: existing.expiresAt };
  }

  existing.count += 1;
  limitStates.set(key, existing);
  return { allowed: true, remaining: limit - existing.count, reset: existing.expiresAt };
}

export function resetRateLimits() {
  limitStates.clear();
}
