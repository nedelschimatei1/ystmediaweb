# SMTP Integration, reCAPTCHA & Rate Limiting — Implementation Summary ✅

**Date:** 2026-02-04

## Summary

Server-side email sending, reCAPTCHA verification, and a memory-only rate limiter were implemented and the contact & newsletter flows were wired to server APIs. Set environment variables and test with a staging SMTP account before going to production.

---

## What I implemented 🔧

- **Configuration**
  - Updated `next.config.mjs` — removed `output: 'export'` so Next server routes work.

- **Server utilities**
  - `lib/mailer.ts` — Nodemailer transport (STARTTLS support).
  - `lib/recaptcha.ts` — server-side reCAPTCHA verification helper.
  - `lib/rate-limit.ts` — memory-only rate limiter with per-IP and per-email throttles (configured via env vars; suitable for a single-instance deployment).
  - `lib/logger.ts` — structured server-side logging (pino).

- **API route handlers**
  - `app/api/contact/route.ts` — validates input, reCAPTCHA check, rate-limit, send notification email.
  - `app/api/newsletter/route.ts` — validates email, reCAPTCHA check, rate-limit, send notification email.

- **Client updates**
  - `components/contact/contact-form.tsx` — posts to `/api/contact`, loads reCAPTCHA, displays server validation errors, disables inputs while submitting.
  - `components/newsletter-popup.tsx` — posts to `/api/newsletter`, loads reCAPTCHA, disables input while submitting.

- **Dev convenience**
  - `.env.example` added with required environment variables and examples.

---

## Dependencies added ➕

- `nodemailer`
- `mysql2` (server-side MySQL pool + migrations)
- `pino` (server-side structured logging)

(Installed via `npm`).

Note: The default in-memory rate limiter is used for single-instance deployments; add centralized solutions later only if you need cross-instance consistency.

---

## Required environment variables 🔐

- `SMTP_HOST=mail.webforest.ro`
- `SMTP_PORT=587`
- `SMTP_USER=your-smtp-user`
- `SMTP_PASS=your-smtp-pass`
- `SMTP_SECURE=false`  # STARTTLS (port 587)
- `SMTP_FROM="YST Media <no-reply@ystmedia.com>"`
- `CONTACT_NOTIFY_EMAIL=ops@ystmedia.com`
- `MYSQL_HOST` `MYSQL_USER` `MYSQL_PASS` `MYSQL_DB` (required for production MySQL)
- `MIGRATE_SUBSCRIBERS=true` (optional, one-time to import `data/subscribers.json` into MySQL)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...`
- `RECAPTCHA_SECRET=...`

Notes: For STARTTLS set `SMTP_SECURE=false` and enforce `tls.minVersion='TLSv1.2'`.

---

## Security & spam protections ✅

- Server-side reCAPTCHA verification (score threshold ≈ 0.45).
- Rate limiting via in-memory sliding window limiter (configurable per `CONTACT_LIMIT`, `NEWSLETTER_LIMIT`, `NEWSLETTER_EMAIL_LIMIT`).
- Zod input validation with clear 4xx/5xx responses.

---

## How to test locally ▶️

1. Copy `.env.example` → `.env.local` and fill test credentials (use Mailtrap or smtp4dev).
2. Start dev server: `npm run dev`.
3. Submit contact form / newsletter popup — emails should be sent to `CONTACT_NOTIFY_EMAIL` or your testing inbox.
4. Trigger rate limits to verify 429 responses and tamper with reCAPTCHA token to test 401 responses.

---

## Next suggestions 💡

- Add double-opt-in and persistent subscriber storage (DB) or integrate a third-party provider for the newsletter.
- Add queueing/retry & monitoring for email send failures.
- Add server-side PII redaction in logs and stronger spam heuristics if needed.

---

## Quick file checklist

- Modified: `next.config.mjs`
- Added: `lib/mailer.ts`, `lib/recaptcha.ts`, `lib/rate-limit.ts`, `lib/logger.ts`
- Added: `app/api/contact/route.ts`, `app/api/newsletter/route.ts`
- Updated: `components/contact/contact-form.tsx`, `components/newsletter-popup.tsx`
- Added: `.env.example`

---

If you'd like, I can now:
- Add a small test page that sends a sample email, or
- Implement persistent subscriber storage (DB + double-opt-in), or
- Wire Mailchimp/ConvertKit integration for newsletter management.

Tell me which option you prefer and I’ll proceed. ✨
