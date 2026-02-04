import { z } from 'zod';
import { sendMail } from '@/lib/mailer';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { contactLimiter } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const ip =
      (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip'))
        ?.split(',')[0] ||
      'unknown';

    // Rate limiting
    try {
      const limitRes = await contactLimiter.limit(ip);
      if (!limitRes.success) {
        return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
      }
    } catch (e) {
      // If rate limiter misconfigured, allow through but log
      console.warn('Rate limiter error', e);
    }

    const body = await req.json();

    const schema = z.object({
      firstName: z.string().min(1).max(100),
      lastName: z.string().min(1).max(100),
      email: z.string().email(),
      organization: z.string().max(200).optional(),
      service: z.string().optional(),
      otherService: z.string().optional(),
      message: z.string().min(10).max(5000),
      token: z.string().optional(),
    });

    const parsed = schema.parse(body);

    // Enforce reCAPTCHA (require secret in production)
    const recaptchaSecret = process.env.RECAPTCHA_SECRET;
    const recaptcha = await verifyRecaptcha(parsed.token, 'contact');
    if (recaptchaSecret && process.env.NODE_ENV === 'production') {
      if (!recaptcha.success || (recaptcha.score && recaptcha.score < 0.45)) {
        console.warn('reCAPTCHA failed for contact', { ip, recaptcha });
        try {
          const { reportFailure } = await import('@/lib/rate-limit');
          await reportFailure(ip);
        } catch (e) {}
        return new Response(JSON.stringify({ error: 'reCAPTCHA verification failed' }), { status: 401 });
      }
    } else if (!recaptchaSecret) {
      console.warn('RECAPTCHA_SECRET not set — skipping verification for contact.');
    }

    // Sanitize inputs
    const { sanitizeTextForEmail, normalizeEmail, forbidHeaderInjection } = await import('@/lib/input');
    const firstName = sanitizeTextForEmail(parsed.firstName, 100);
    const lastName = sanitizeTextForEmail(parsed.lastName, 100);
    const email = normalizeEmail(parsed.email);
    const organization = sanitizeTextForEmail(parsed.organization || '', 200);
    const service = sanitizeTextForEmail(parsed.service || '', 100);
    const otherService = sanitizeTextForEmail(parsed.otherService || '', 200);
    const message = sanitizeTextForEmail(parsed.message, 5000);

    // Construct safe subject and text (prevent header injection)
    const notifyTo = process.env.CONTACT_NOTIFY_EMAIL || process.env.SMTP_USER || 'contact@ystmedia.com';
    const subject = forbidHeaderInjection(`New contact from ${firstName} ${lastName}`);
    const messagePreview = redactText(message, 500);
    const text = `New contact submission:\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nOrganization: ${organization || '-'}\nService: ${service || '-'} ${otherService ? `(${otherService})` : ''}\n\nMessage (preview):\n${messagePreview}`;

    try {
      await sendMail({
        to: forbidHeaderInjection(notifyTo),
        subject,
        text,
      });
    } catch (e) {
      console.error('Failed to send contact notification', e);
    }

    // Log only metadata server-side; do not log full message body
    console.info('Contact submission received', { ip, email, name: `${firstName} ${lastName}` });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    if (err?.name === 'ZodError' || err?.issues) {
      try {
        const { reportFailure } = await import('@/lib/rate-limit');
        await reportFailure(ip);
      } catch (e) {
        // ignore limiter failures
      }
      // Log validation details server-side (redacted in logs)
      console.warn('Validation error on /api/contact', { ip, error: err?.name || 'ZodError' });
      return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
    }
    console.error('Contact API error', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
