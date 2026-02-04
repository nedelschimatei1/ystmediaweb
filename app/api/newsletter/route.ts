import { z } from 'zod';
import { sendMail } from '@/lib/mailer';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { newsletterLimiter } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'))?.split(',')[0] || 'unknown';

    try {
      const limitRes = await newsletterLimiter.limit(ip);
      if (!limitRes.success) {
        return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
      }
    } catch (e) {
      console.warn('Newsletter rate limiter error', e);
    }

    const body = await req.json();

    const schema = z.object({ email: z.string().email(), token: z.string().optional(), locale: z.enum(['ro','en']).optional() });
    const parsed = schema.parse(body);

    // Enforce reCAPTCHA in production if secret present
    const recaptchaSecret = process.env.RECAPTCHA_SECRET;
    let recaptcha;
    if (recaptchaSecret && process.env.NODE_ENV === 'production') {
      recaptcha = await verifyRecaptcha(parsed.token, 'newsletter');
      if (!recaptcha.success || (recaptcha.score && recaptcha.score < 0.45)) {
        console.warn('reCAPTCHA failed for newsletter', { ip, recaptcha });
        try {
          const { reportFailure } = await import('@/lib/rate-limit');
          await reportFailure(ip);
        } catch (e) {}
        return new Response(JSON.stringify({ error: 'reCAPTCHA verification failed' }), { status: 401 });
      }
    } else {
      // local/dev: allow but log for visibility
      recaptcha = { success: true, score: 1 } as const;
      if (!recaptchaSecret) console.warn('RECAPTCHA_SECRET not set — skipping verification for newsletter.');
    }

    // Normalize and sanitize email before DB call
    const { normalizeEmail, sanitizeTextForEmail } = await import('@/lib/input');
    const email = normalizeEmail(parsed.email);

    // Pre-check per-email throttle
    try {
      const { limit } = await import('@/lib/rate-limit');
      // Use newsletter limiter and pass email option
      const emailCheck = await import('@/lib/rate-limit').then((m) => m.newsletterLimiter.limit(ip, { email }));
      if (!emailCheck.success) {
        return new Response(JSON.stringify({ error: 'Too many requests for this email' }), { status: 429 });
      }
    } catch (e) {
      // ignore limiter errors
    }

    // Create or update subscriber record
    const sub = await import('@/lib/subscribers').then((m) => m.upsertSubscriber(email));

    // Notify site owner (HTML)
    const notifyTo = process.env.CONTACT_NOTIFY_EMAIL || process.env.SMTP_USER;
    try {
      const { ownerNotificationTemplate } = await import('@/lib/email-templates');
      const ownerTpl = ownerNotificationTemplate(email, parsed.locale || 'ro');
      await sendMail({
        to: notifyTo || 'contact@ystmedia.com',
        subject: ownerTpl.subject,
        text: ownerTpl.text,
        html: ownerTpl.html,
      });
    } catch (e) {
      // fallback to plain text notify
      await sendMail({
        to: notifyTo || 'contact@ystmedia.com',
        subject: `New newsletter subscription: ${parsed.email}`,
        text: `New newsletter subscription: ${parsed.email}`,
      });
    }

    // Send a confirmation email to subscriber (HTML) with List-Unsubscribe tokenized URL
    try {
      const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://ystmedia.com';
      const unsubscribeUrl = `${siteUrl.replace(/\/$/, '')}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(sub.token)}`;

      const { confirmationTemplate } = await import('@/lib/email-templates');
      const locale = (parsed.locale === 'en' ? 'en' : 'ro');
      const tpl = confirmationTemplate(email, unsubscribeUrl, locale);

      await sendMail({
        to: email,
        subject: tpl.subject,
        text: tpl.text,
        html: tpl.html,
        headers: {
          'List-Unsubscribe': `<mailto:${process.env.SMTP_LIST_UNSUBSCRIBE || 'unsubscribe@ystmedia.com'}>, <${unsubscribeUrl}>`,
        },
      });
    } catch (e) {
      console.warn('Failed to send confirmation email', e);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    if (err?.name === 'ZodError' || err?.issues) {
      try {
        const { reportFailure } = await import('@/lib/rate-limit');
        await reportFailure(ip);
      } catch (e) {}
      console.warn('Validation error on /api/newsletter', { ip });
      return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
    }
    console.error('Newsletter API error', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
