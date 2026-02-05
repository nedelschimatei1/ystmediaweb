import { z } from 'zod';
import { markUnsubscribed, getSubscriber } from '@/lib/subscribers';
import { safeLogError } from '@/lib/observability';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    const token = url.searchParams.get('token');

    if (!email || !token) {
      return new Response('Missing email or token', { status: 400 });
    }

    // Rate-limit unsubscribe attempts per IP to avoid enumeration
    try {
      const { contactLimiter, reportFailure } = await import('@/lib/rate-limit');
      const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'))?.split(',')[0] || 'unknown';
      const lim = await contactLimiter.limit(ip);
      if (!lim.success) return new Response('Too many requests', { status: 429 });

      const sub = await getSubscriber(email);
      if (!sub) return new Response('Subscriber not found', { status: 404 });

      // Constant-time token compare to avoid timing attacks
      const crypto = await import('crypto');
      const a = Buffer.from(String(sub.token));
      const b = Buffer.from(String(token));
      let ok = false;
      try {
        if (a.length === b.length && crypto.timingSafeEqual(a, b)) ok = true;
      } catch (e) {
        ok = false;
      }

      if (!ok) {
        // report failure for potential enumeration or brute-force
        try { await reportFailure(ip); } catch (e) {}
        return new Response('Invalid token', { status: 401 });
      }

      await markUnsubscribed(email);

      const html = `<html><body><h1>Unsubscribed</h1><p>You have been unsubscribed from our newsletter.</p></body></html>`;

      return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    } catch (e) {
      safeLogError(e, { route: '/api/unsubscribe' });
      return new Response('Server error', { status: 500 });
    }
  } catch (err) {
    safeLogError(err, { route: '/api/unsubscribe' });
    return new Response('Server error', { status: 500 });
  }
}
