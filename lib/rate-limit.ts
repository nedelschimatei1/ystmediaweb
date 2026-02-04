// Temporarily disabled rate limiting for local testing.
// To re-enable, restore the Upstash-based implementation from version control.

/*
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  console.warn('Upstash Redis credentials not set. Rate limiting will not work without UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. Falling back to a no-op limiter for local testing.');

  // No-op limiter for local/dev when Upstash is not configured
  const noopLimiter = {
    limit: async (_: string) => ({ success: true }),
  } as const;

  export const contactLimiter = noopLimiter;
  export const newsletterLimiter = noopLimiter;
} else {
  const redis = new Redis({ url: redisUrl, token: redisToken });

  export const contactLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 reqs per hour
  });

  export const newsletterLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 reqs per hour
  });
}
*/

/*
  Memory-only rate limiter with blocklist and per-email throttles.
  - Per-IP sliding window counters
  - Per-email throttles (for newsletter signup attempts)
  - Failure reporting that increments a failure counter and temporarily blocks an IP after a threshold

  Configurable via env vars:
  CONTACT_LIMIT (default 10 per hour)
  NEWSLETTER_LIMIT (default 20 per hour)
  NEWSLETTER_EMAIL_LIMIT (default 3 per hour)
  BLOCK_THRESHOLD (default 5 failures)
  BLOCK_DURATION_MS (default 30 minutes)
*/

export type LimitResult = { success: boolean; remaining?: number; blockedUntil?: number };

function now() {
  return Date.now();
}

function createMemoryLimiter(maxRequests: number, windowMs: number, emailLimit = 3, blockThreshold = 5, blockDurationMs = 30 * 60 * 1000) {
  const requests = new Map<string, number[]>(); // key -> timestamps
  const emailRequests = new Map<string, number[]>(); // email -> timestamps
  const failures = new Map<string, { count: number; lastFailure: number }>();
  const blocked = new Map<string, number>(); // key -> blockedUntil timestamp

  function prune(arr: number[], windowStart: number) {
    return arr.filter((t) => t > windowStart);
  }

  return {
    limit: async (key: string, opts?: { email?: string }): Promise<LimitResult> => {
      const bUntil = blocked.get(key);
      const nowTs = now();
      if (bUntil && bUntil > nowTs) return { success: false, blockedUntil: bUntil };

      const windowStart = nowTs - windowMs;
      const arr = requests.get(key) || [];
      const fresh = prune(arr, windowStart);
      fresh.push(nowTs);
      requests.set(key, fresh);
      if (fresh.length > maxRequests) return { success: false, remaining: 0 };

      if (opts?.email) {
        const e = opts.email;
        const eArr = emailRequests.get(e) || [];
        const freshE = prune(eArr, windowStart);
        freshE.push(nowTs);
        emailRequests.set(e, freshE);
        if (freshE.length > emailLimit) return { success: false, remaining: 0 };
      }

      return { success: true, remaining: maxRequests - fresh.length };
    },

    reportFailure: async (key: string): Promise<{ blocked: boolean; blockedUntil?: number }> => {
      const nowTs = now();
      const f = failures.get(key) || { count: 0, lastFailure: 0 };
      f.count += 1;
      f.lastFailure = nowTs;
      failures.set(key, f);
      if (f.count >= blockThreshold) {
        const until = nowTs + blockDurationMs;
        blocked.set(key, until);
        failures.delete(key);
        return { blocked: true, blockedUntil: until };
      }
      return { blocked: false };
    },

    isBlocked: (key: string) => {
      const bUntil = blocked.get(key);
      if (!bUntil) return false;
      if (bUntil <= now()) {
        blocked.delete(key);
        return false;
      }
      return true;
    },

    resetFailures: (key: string) => failures.delete(key),
  };
}

// Build configured limiters
const contactLimit = Number(process.env.CONTACT_LIMIT || 10);
const newsletterLimit = Number(process.env.NEWSLETTER_LIMIT || 20);
const newsletterEmailLimit = Number(process.env.NEWSLETTER_EMAIL_LIMIT || 3);
const blockThreshold = Number(process.env.BLOCK_THRESHOLD || 5);
const blockDurationMs = Number(process.env.BLOCK_DURATION_MS || 30 * 60 * 1000);
const windowMs = 60 * 60 * 1000; // 1 hour

export const contactLimiter = createMemoryLimiter(contactLimit, windowMs, 1, blockThreshold, blockDurationMs);
export const newsletterLimiter = createMemoryLimiter(newsletterLimit, windowMs, newsletterEmailLimit, blockThreshold, blockDurationMs);

// Convenience helpers for cross-flow blocking
export async function reportFailure(key: string) {
  try {
    const r1 = await contactLimiter.reportFailure(key as any);
    const r2 = await newsletterLimiter.reportFailure(key as any);
    const blockedUntil = r1.blockedUntil || r2.blockedUntil;
    return { blocked: !!blockedUntil, blockedUntil };
  } catch (e) {
    return { blocked: false };
  }
}

export function isBlocked(key: string) {
  return contactLimiter.isBlocked(key as any) || newsletterLimiter.isBlocked(key as any);
}

export function resetFailures(key: string) {
  try {
    contactLimiter.resetFailures(key as any);
  } catch (e) {}
  try {
    newsletterLimiter.resetFailures(key as any);
  } catch (e) {}
}


