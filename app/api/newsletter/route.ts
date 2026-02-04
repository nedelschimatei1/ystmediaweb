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

    // reCAPTCHA verification temporarily disabled for local testing — uncomment to re-enable in staging/prod.
    // const recaptcha = await verifyRecaptcha(parsed.token, 'newsletter');
    // console.debug('newsletter parsed:', { email: parsed.email, locale: parsed.locale ?? 'unset' });
    // console.debug('recaptcha result:', recaptcha);
    // if (!recaptcha.success || (recaptcha.score && recaptcha.score < 0.45)) {
    //   console.warn('reCAPTCHA failed', recaptcha);
    //   return new Response(JSON.stringify({ error: 'reCAPTCHA verification failed', details: recaptcha }), { status: 401 });
    // }
    // Bypass result used for local dev and staging without reCAPTCHA
    const recaptcha = { success: true, score: 1 } as const;

    // Create or update subscriber record
    const sub = await import('@/lib/subscribers').then((m) => m.upsertSubscriber(parsed.email));

    // Notify site owner (HTML)
    const notifyTo = process.env.CONTACT_NOTIFY_EMAIL || process.env.SMTP_USER;
    try {
      const { ownerNotificationTemplate } = await import('@/lib/email-templates');
      const ownerTpl = ownerNotificationTemplate(parsed.email, parsed.locale || 'ro');
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
      const unsubscribeUrl = `${siteUrl.replace(/\/$/, '')}/api/unsubscribe?email=${encodeURIComponent(parsed.email)}&token=${encodeURIComponent(sub.token)}`;

      const { confirmationTemplate } = await import('@/lib/email-templates');
      const locale = (parsed.locale === 'en' ? 'en' : 'ro');
      const tpl = confirmationTemplate(parsed.email, unsubscribeUrl, locale);

      await sendMail({
        to: parsed.email,
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
      return new Response(JSON.stringify({ error: 'Invalid input', details: err?.issues || err?.message }), { status: 400 });
    }
    console.error('Newsletter API error', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
