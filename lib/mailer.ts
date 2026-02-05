import nodemailer from 'nodemailer';
import logger from './logger';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
// Allow an explicit local override for insecure SMTP without auth (useful for smtp4dev / MailHog during staging)
const SMTP_ALLOW_INSECURE = process.env.SMTP_ALLOW_INSECURE === 'true';

if (!SMTP_HOST || ((!SMTP_USER || !SMTP_PASS) && !SMTP_ALLOW_INSECURE)) {
  // Do not throw during import to keep dev experience pleasant; throw when trying to send.
  logger.warn('SMTP is not fully configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS in env to enable sending emails, or set SMTP_ALLOW_INSECURE=true for local testing without auth.');
}
// Extra optional settings
const SMTP_BOUNCE_EMAIL = process.env.SMTP_BOUNCE_EMAIL;
const SMTP_LIST_UNSUBSCRIBE = process.env.SMTP_LIST_UNSUBSCRIBE; // e.g. mailto:unsubscribe@domain.com
const SMTP_LIST_UNSUBSCRIBE_URL = process.env.SMTP_LIST_UNSUBSCRIBE_URL; // optional https url
const SMTP_REPLY_TO = process.env.SMTP_REPLY_TO;

if (!SMTP_BOUNCE_EMAIL) {
  logger.warn('SMTP_BOUNCE_EMAIL is not set. Bounces will be delivered to SMTP_FROM or the envelope from address.');
}

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE, // false for STARTTLS
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  pool: true,
  maxConnections: Number(process.env.SMTP_POOL_MAX_CONNECTIONS || 5),
  maxMessages: Number(process.env.SMTP_POOL_MAX_MESSAGES || 100),
  tls: {
    // Enforce STARTTLS and modern TLS versions
    minVersion: 'TLSv1.2',
    rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false',
  },
});

import { forbidHeaderInjection } from './input';

export async function sendMail(opts: {
  from?: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
  replyTo?: string;
}) {
  if (!SMTP_HOST || ((!SMTP_USER || !SMTP_PASS) && !SMTP_ALLOW_INSECURE)) {
    throw new Error('SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS in environment, or set SMTP_ALLOW_INSECURE=true for local testing without auth.');
  }

  // Sanitize header values to prevent header injection
  const safeFrom = forbidHeaderInjection(opts.from || process.env.SMTP_FROM || `no-reply@${SMTP_HOST}`);
  const safeSubject = forbidHeaderInjection(opts.subject);
  const safeReplyTo = opts.replyTo ? forbidHeaderInjection(opts.replyTo as string) : (process.env.SMTP_REPLY_TO || process.env.SMTP_FROM || undefined);
  const safeTo = Array.isArray(opts.to) ? opts.to.map((t) => forbidHeaderInjection(t as string)) : forbidHeaderInjection(opts.to as string);

  const bounceAddress = process.env.SMTP_BOUNCE_EMAIL || process.env.SMTP_FROM || `no-reply@${SMTP_HOST}`;
  const listUnsubMail = process.env.SMTP_LIST_UNSUBSCRIBE || `mailto:${bounceAddress}`;
  const listUnsubUrl = process.env.SMTP_LIST_UNSUBSCRIBE_URL;

  const providedHeaders = opts.headers || {};
  const listUnsubscribeHeader = listUnsubUrl ? `${listUnsubMail}, <${listUnsubUrl}>` : `${listUnsubMail}`;

  const headers = {
    ...providedHeaders,
    'List-Unsubscribe': listUnsubscribeHeader,
  } as Record<string, string>;

  // If we have a URL-based unsubscribe, advertise One-Click support for compatible clients
  if (listUnsubUrl) {
    headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click';
  }

  // Sanitize header values provided by callers
  for (const k of Object.keys(headers)) {
    headers[k] = forbidHeaderInjection(headers[k]);
  }

  const envelopeTo = Array.isArray(safeTo) ? safeTo : [safeTo];

  return transporter.sendMail({
    from: safeFrom,
    to: safeTo,
    subject: safeSubject,
    text: opts.text,
    html: opts.html,
    envelope: { from: bounceAddress, to: envelopeTo },
    headers,
    replyTo: safeReplyTo,
  });
}
