import fs from 'fs';
import { join } from 'path';

const BRAND_COLOR = '#ff7a00';
const LOGO_PATH = '/logo-dark.png';
const SITE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');

// Prefer absolute URLs when SITE_URL is set; otherwise embed logo as a base64 data URI to avoid
// email client sanitization or broken relative URLs in some inboxes.
let LOGO_URL: string;
if (SITE_URL) {
  LOGO_URL = `${SITE_URL}${LOGO_PATH}`;
} else {
  try {
    const p = join(process.cwd(), 'public', LOGO_PATH.replace(/^\//, ''));
    const buf = fs.readFileSync(p);
    const mime = 'image/png';
    LOGO_URL = `data:${mime};base64,${buf.toString('base64')}`;
  } catch (e) {
    // Fallback to relative path if reading fails
    LOGO_URL = LOGO_PATH;
  }
}

// Compliance contact details (configurable via environment variables)
const COMPANY_NAME = process.env.COMPANY_NAME || 'YST Media';
const COMPANY_ADDRESS = process.env.COMPANY_ADDRESS || '';
const COMPANY_CONTACT_EMAIL = process.env.COMPANY_CONTACT_EMAIL || 'contact@ystmedia.com';
const PRIVACY_URL = SITE_URL ? `${SITE_URL}/privacy` : (process.env.PRIVACY_URL || '');

function wrapperHtml(title: string, preheader: string, bodyHtml: string, footerHtml: string, unsubscribeUrl: string = '') {
  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <style>
          /* Minimal responsive tweaks for clients that support them */
          @media only screen and (max-width:600px) {
            .container { width:100% !important; }
            .pad { padding:20px !important; }
            .h1 { font-size:20px !important; }
            .lead { font-size:16px !important; }
          }
        </style>
      </head>

      <body style="margin:0;padding:0;background:#f7f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#0f172a;">

        <!-- Hidden preheader: short summary visible in inbox preview -->
        <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;color:#ffffff;">${preheader}</div>

        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f7f7fb;">
          <tr>
            <td align="center" style="padding:32px 16px;">

              <!-- Main container -->
              <table class="container" width="680" cellpadding="0" cellspacing="0" role="presentation" style="max-width:680px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(2,6,23,0.06);">

                <!-- Logo -->
                <tr>
                  <td style="padding:28px 32px 0;text-align:center;background-color:transparent;">
                    <img src="${LOGO_URL}" alt="YST Media" width="180" style="max-width:180px;height:auto;display:block;margin:0 auto;" />
                  </td>
                </tr>

                <!-- Hero -->
                <tr>
                  <td style="padding:20px 40px 8px;text-align:left;">
                    <h1 class="h1" style="margin:0 0 8px;font-size:26px;line-height:1.12;color:#0f172a;font-weight:700;">${title}</h1>
                    <p class="lead" style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">${preheader}</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:0 40px 20px;text-align:left;">
                    <div style="color:#334155;font-size:15px;line-height:1.6;">${bodyHtml}</div>
                  </td>
                </tr>

                <!-- Footer content (includes unsubscribe and legal contact info for compliance) -->
                <tr>
                  <td style="padding:0 40px 24px;text-align:left;border-top:1px solid #f1f5f9;">
                    <div style="color:#6b7280;font-size:13px;line-height:1.5;">${footerHtml}</div>
                    <div style="color:#6b7280;font-size:13px;line-height:1.5;margin-top:12px;">
                      <p style="margin:0;">To stop receiving these emails, <a href="${unsubscribeUrl}" style="color:${BRAND_COLOR};text-decoration:underline;">unsubscribe</a> at any time.</p>
                      <p style="margin:8px 0 0;">${COMPANY_NAME}${COMPANY_ADDRESS ? ' • ' + COMPANY_ADDRESS : ''} • <a href="mailto:${COMPANY_CONTACT_EMAIL}" style="color:#6b7280;text-decoration:underline;">${COMPANY_CONTACT_EMAIL}</a></p>
                      ${PRIVACY_URL ? `<p style="margin:8px 0 0;"><a href="${PRIVACY_URL}" style="color:#6b7280;text-decoration:underline;">Privacy policy</a></p>` : ''}
                    </div>
                  </td>
                </tr>

                <!-- Sub-footer -->
                <tr>
                  <td style="padding:18px 24px;background:#fafafa;text-align:center;font-size:13px;color:#9ca3af;">
                    YST Media • <a href="mailto:contact@ystmedia.com" style="color:#9ca3af;text-decoration:underline;">contact@ystmedia.com</a>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
    </html>`;
}

export function confirmationTemplate(email: string, unsubscribeUrl: string, locale: 'ro' | 'en' = 'ro') {
  if (locale === 'en') {
    const title = 'Thanks for subscribing!';
    const pre = "You're now on our list — welcome.";
    const body = `
      <p style=\"margin:0 0 12px;\">You're now subscribed with <strong>${email}</strong>. We send a selection of insights, case studies and tools.</p>
      <p style=\"margin:12px 0 0;\">Manage your subscription: <a href=\"${unsubscribeUrl}\" style=\"color:${BRAND_COLOR};text-decoration:underline;\">manage preferences or unsubscribe</a></p>
    `;
    const footer = `<p style=\"margin:0;color:#6b7280;font-size:13px;\">If you didn't sign up, you can ignore this email or <a href=\"${unsubscribeUrl}\">unsubscribe</a>.</p>${PRIVACY_URL ? `<p style=\"margin:6px 0 0;color:#6b7280;font-size:13px;\">You can withdraw your consent at any time by unsubscribing. For details see our <a href=\"${PRIVACY_URL}\">privacy policy</a>.</p>` : ''}`;
    return { subject: 'Subscription confirmed', text: `Thanks for subscribing!\nManage your subscription: ${unsubscribeUrl}\n\n${COMPANY_NAME}${COMPANY_ADDRESS ? ' • ' + COMPANY_ADDRESS : ''} • ${COMPANY_CONTACT_EMAIL}${PRIVACY_URL ? '\nPrivacy: ' + PRIVACY_URL : ''}`, html: wrapperHtml(title, pre, body, footer, unsubscribeUrl) };
  }

  // Romanian
  const title = 'Mulțumim pentru abonare!';
  const pre = 'Bine ai venit în comunitatea noastră.';
  const body = `
    <p style=\"margin:0 0 12px;\">Te-ai abonat cu <strong>${email}</strong>. Îți vom trimite periodic studii de caz, idei și resurse utile.</p>
    <p style=\"margin:12px 0 0;\">Gestionează abonarea: <a href=\"${unsubscribeUrl}\" style=\"color:${BRAND_COLOR};text-decoration:underline;\">gestionează preferințele sau dezabonează-te</a></p>
  `;
  const footer = `<p style=\"margin:0;color:#6b7280;font-size:13px;\">Dacă nu ai cerut această abonare, poți ignora acest email sau te poți <a href=\"${unsubscribeUrl}\">dezabona</a>.</p>${PRIVACY_URL ? `<p style=\"margin:6px 0 0;color:#6b7280;font-size:13px;\">Poți retrage consimțământul în orice moment dezabonându-te. Pentru detalii consultă <a href=\"${PRIVACY_URL}\">politica de confidențialitate</a>.</p>` : ''}`;
  return { subject: 'Confirmare abonare', text: `Mulțumim pentru abonare!\nGestionează abonarea: ${unsubscribeUrl}\n\n${COMPANY_NAME}${COMPANY_ADDRESS ? ' • ' + COMPANY_ADDRESS : ''} • ${COMPANY_CONTACT_EMAIL}${PRIVACY_URL ? '\nPolitica de confidențialitate: ' + PRIVACY_URL : ''}`, html: wrapperHtml(title, pre, body, footer, unsubscribeUrl) };
}

export function ownerNotificationTemplate(email: string, locale: 'ro' | 'en' = 'ro') {
  if (locale === 'en') {
    const title = 'New newsletter subscription';
    const pre = 'A new subscriber has joined your list.';
    const body = `<p style=\"margin:0 0 8px;\"><strong>${email}</strong> subscribed to the newsletter.</p>`;
    const footer = `<p style=\"margin:0;color:#6b7280;font-size:13px;\">View subscribers in your dashboard or in <code>data/subscribers.json</code>.</p>`;
    return { subject: `New newsletter subscriber: ${email}`, text: `${email} subscribed\n\n${COMPANY_NAME}${COMPANY_ADDRESS ? ' • ' + COMPANY_ADDRESS : ''} • ${COMPANY_CONTACT_EMAIL}`, html: wrapperHtml(title, pre, body, footer, '') };
  }

  const title = 'Abonare nouă la newsletter';
  const pre = 'Un nou abonat s-a alăturat listei.';
  const body = `<p style=\"margin:0 0 8px;\"><strong>${email}</strong> s-a abonat la newsletter.</p>`;
  const footer = `<p style=\"margin:0;color:#6b7280;font-size:13px;\">Vezi abonații în <code>data/subscribers.json</code> sau în dashboard.</p>`;
  return { subject: `Abonat nou: ${email}`, text: `${email} s-a abonat\n\n${COMPANY_NAME}${COMPANY_ADDRESS ? ' • ' + COMPANY_ADDRESS : ''} • ${COMPANY_CONTACT_EMAIL}`, html: wrapperHtml(title, pre, body, footer, '') };
}

