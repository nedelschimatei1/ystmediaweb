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

// Build a simple in-memory sliding window limiter as a production fallback when Upstash is not configured.
// Not suitable for multi-process / horizontal scaling, but better than nothing when a proper Redis store is missing.

type Limiter = {
  limit: (key: string) => Promise<{ success: boolean; remaining?: number }>
};

function createMemoryLimiter(maxRequests: number, windowMs: number): Limiter {
  const map = new Map<string, number[]>(); // key -> timestamps
  return {
    limit: async (key: string) => {
      const now = Date.now();
      const windowStart = now - windowMs;
      const arr = map.get(key) || [];
      // remove old timestamps
      const fresh = arr.filter((t) => t > windowStart);
      fresh.push(now);
      map.set(key, fresh);
      if (fresh.length > maxRequests) return { success: false, remaining: 0 };
      return { success: true, remaining: maxRequests - fresh.length };
    },
  };
}

// Use environment-configured Upstash Ratelimit when available, otherwise use a reasonable fallback.
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (upstashUrl && upstashToken) {
  // Lazy-load Upstash libs only when configured
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Redis } = require('@upstash/redis');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Ratelimit } = require('@upstash/ratelimit');

    const redis = new Redis({ url: upstashUrl, token: upstashToken });

    export const contactLimiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 h') });
    export const newsletterLimiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 h') });
  } catch (e) {
    console.warn('Failed to initialize Upstash rate limiter, falling back to memory limiter', e);
    export const contactLimiter = createMemoryLimiter(5, 60 * 60 * 1000);
    export const newsletterLimiter = createMemoryLimiter(10, 60 * 60 * 1000);
  }
} else {
  // In production, still use a memory limiter to avoid allowing unlimited abuse in case Upstash isn't configured
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    export const contactLimiter = createMemoryLimiter(10, 60 * 60 * 1000); // 10 / hour
    export const newsletterLimiter = createMemoryLimiter(20, 60 * 60 * 1000); // 20 / hour
  } else {
    // Local dev: permissive but still keep a small limiter
    export const contactLimiter = createMemoryLimiter(1000, 60 * 60 * 1000);
    export const newsletterLimiter = createMemoryLimiter(1000, 60 * 60 * 1000);
  }
}

