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

// Export no-op limiters so APIs don't block during local development.
export const contactLimiter = {
  limit: async (_ip: string) => ({ success: true }),
} as const;

export const newsletterLimiter = {
  limit: async (_ip: string) => ({ success: true }),
} as const;

