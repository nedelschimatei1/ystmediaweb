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

    // Verify reCAPTCHA
    const recaptcha = await verifyRecaptcha(parsed.token, 'contact');
    if (!recaptcha.success || (recaptcha.score && recaptcha.score < 0.45)) {
      return new Response(JSON.stringify({ error: 'reCAPTCHA verification failed' }), { status: 401 });
    }

    // Send notification email
    const notifyTo = process.env.CONTACT_NOTIFY_EMAIL || process.env.SMTP_USER;
    const subject = `New contact from ${parsed.firstName} ${parsed.lastName}`;
    const text = `New contact submission:\n\nName: ${parsed.firstName} ${parsed.lastName}\nEmail: ${parsed.email}\nOrganization: ${parsed.organization || '-'}\nService: ${parsed.service || '-'} ${parsed.otherService ? `(${parsed.otherService})` : ''}\n\nMessage:\n${parsed.message}`;

    await sendMail({
      to: notifyTo || 'contact@ystmedia.com',
      subject,
      text,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    if (err?.name === 'ZodError' || err?.issues) {
      return new Response(JSON.stringify({ error: 'Invalid input', details: err?.issues || err?.message }), { status: 400 });
    }
    console.error('Contact API error', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
