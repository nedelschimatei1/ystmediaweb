# Contact Form & Newsletter — Flow and Implementation ✅

**Date:** 2026-02-04

---

## Overview
This document describes how the contact form and newsletter subscription flow were implemented in this project, what files to look at, environment variables required, how spam/protection is handled (reCAPTCHA + rate limiting), bounce handling and unsubscribe flow, and how to test everything locally.

---

## Components & High-level Flow 🎯

### Contact form (/contact)
1. Client: `components/contact/contact-form.tsx` collects user input and on submit: loads reCAPTCHA token (if site key is configured) and POSTs to `/api/contact`.
2. Server: `app/api/contact/route.ts` receives JSON payload and does:
   - Zod validation of inputs and server-side sanitization
   - Rate-limiting via `lib/rate-limit.ts` (memory-only limiter with per-IP throttles)
   - reCAPTCHA server verification via `lib/recaptcha.ts` (enforced in production)
   - Calls `lib/mailer.ts` to send notification email to site owner (and optionally confirmation to user)
   - Returns appropriate HTTP response codes (200, 4xx, 401, 429, 500)
3. Mail sending: `lib/mailer.ts` uses Nodemailer with pooled transport, sets envelope/headers (List-Unsubscribe support, bounce envelope) and `replyTo`

Files:
- components/contact/contact-form.tsx
- app/api/contact/route.ts
- lib/recaptcha.ts
- lib/rate-limit.ts
- lib/mailer.ts

Env vars (required)
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, SMTP_FROM
- RECAPTCHA_SECRET
- MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_DB (required for production subscriber storage; see `MIGRATE_SUBSCRIBERS` in `.env.example`)
- CONTACT_LIMIT, NEWSLETTER_LIMIT, NEWSLETTER_EMAIL_LIMIT, BLOCK_THRESHOLD, BLOCK_DURATION_MS (rate limiter configuration)
Test steps
- Use `Mailtrap` or `smtp4dev` as SMTP and check notification arrives
- Test reCAPTCHA failure by setting an invalid token (expect 401)
- Force many requests to see 429 from rate limiter if configured

---

### Newsletter (popup) flow
1. Client: `components/newsletter-popup.tsx` collects email and on submit:
   - Loads reCAPTCHA (client site key) and POSTs to `/api/newsletter`.
2. Server: `app/api/newsletter/route.ts` does:
   - Zod input validation
   - Rate-limiting (memory-only limiter with per-IP and per-email limits)
   - reCAPTCHA verification (enforced in production)
   - Upserts the subscriber into MySQL via `lib/subscribers.ts`
   - Sends a confirmation email to user (includes `List-Unsubscribe` header and a tokenized unsubscribe URL)
   - Notifies site owner
3. Subscriber store: `lib/subscribers.ts` — backed by MySQL (`lib/db.ts`). Tokens, bounce counts and flags are stored in the database; a one-time `MIGRATE_SUBSCRIBERS` import is available to migrate from `data/subscribers.json` if needed.
4. Unsubscribe endpoint: `app/api/unsubscribe/route.ts` validates token and unsubscribes the email (returns a confirmation page)

Files:
- components/newsletter-popup.tsx
- components/newsletter-wrapper.tsx
- app/api/newsletter/route.ts
- lib/subscribers.ts
- app/api/unsubscribe/route.ts

Env vars (required/optional)
- SITE_URL (used to generate unsubscribe links)
- SMTP_LIST_UNSUBSCRIBE, SMTP_LIST_UNSUBSCRIBE_URL, SMTP_REPLY_TO

Test steps
- Submit a test email and confirm a confirmation message with unsubscribe link is delivered
- Click unsubscribe link to validate tokenized unsubscribe
- Verify `List-Unsubscribe` header present in mail headers (mail clients often show an unsubscribe CTA)

---

## Bounce handling & automation 📬

1. Worker: `workers/bounce-parser.js` (uses `imapflow` + `mailparser`) polls a configured IMAP folder (default `Bounces`) or uses IMAP IDLE.
2. Workflow:
   - Webmail filter moves DSNs / bounced messages into the `Bounces` folder
   - Worker polls and parses messages, extracts bounced recipient(s), classifies hard vs soft bounces (heuristics: `5.x.x` status, "user unknown", etc.)
   - On a hard bounce: worker **marks subscriber** in the database (sets `isBounced = true` and `subscribed = false`) and notifies the site owner
   - Processed messages are moved to a `Processed` folder or marked Seen
3. Integration: the newsletter send logic should skip `isBounced` or unsubscribed addresses

Files & scripts:
- `workers/bounce-parser.js`
- `npm run bounce-worker` to run the worker
- `lib/subscribers.ts` (MySQL-backed store; legacy `data/subscribers.json` can be imported with `MIGRATE_SUBSCRIBERS=true` if present)

Env vars (IMAP)
- IMAP_HOST, IMAP_PORT, IMAP_USER, IMAP_PASS, IMAP_BOUNCE_FOLDER, IMAP_PROCESSED_FOLDER, IMAP_POLL_INTERVAL_SECONDS

Notes:
- Using a dedicated *bounce mailbox* (e.g., `bounces@domain`) is recommended. If not available, the current mailbox + folder rules works fine.
- For production-scale lists, switch `lowdb` → PostgreSQL/Supabase and use transactional updates.

---

## Rate limiting & spam protection 🛡️

- Rate limiting is implemented with a memory-only limiter by default (per-IP sliding windows and per-email throttles). Configure limits via env vars: `CONTACT_LIMIT`, `NEWSLETTER_LIMIT`, `NEWSLETTER_EMAIL_LIMIT`, `BLOCK_THRESHOLD`, and `BLOCK_DURATION_MS`. This in-memory limiter is suitable for the site's single-instance deployment (1k–10k visits); it does not persist state across restarts.
- reCAPTCHA verification is done server-side (`lib/recaptcha.ts`) before sending or subscriber creation. **Note:** `RECAPTCHA_SECRET` is required in production; the server enforces captcha checks and rejects low-score responses.
- Server-side input validation with `zod` to guard the shape and sizes of payloads; inputs are also sanitized and header-injection is blocked.

---

## Mail headers & deliverability improvements ✨

- `List-Unsubscribe` header is added to outgoing newsletter emails (both mailto and tokenized URL forms): helps mail clients offer an unsubscribe option.
- `envelope.from` is set to `SMTP_BOUNCE_EMAIL` (or `SMTP_FROM` fallback) so DSNs deliver to a controlled mailbox.
- `Reply-To` is set to `SMTP_REPLY_TO` (if configured).
- Use `SITE_URL` for unsubscribe links and send test mails to `mail-tester.com` or `Mailtrap` to inspect headers.

---

## Where to find everything (file list)
- `components/contact/contact-form.tsx` — contact form client
- `components/newsletter-popup.tsx` & `components/newsletter-wrapper.tsx` — newsletter UI
- `app/api/contact/route.ts` — contact POST route
- `app/api/newsletter/route.ts` — newsletter POST route
- `app/api/unsubscribe/route.ts` — unsubscribe handling
- `lib/mailer.ts` — Nodemailer transport + pooling + headers
- `lib/recaptcha.ts` — reCAPTCHA server verification
- `lib/rate-limit.ts` — memory-only limiter with per-IP and per-email throttles
- `lib/subscribers.ts` — subscriber store backed by MySQL (`lib/db.ts`)
- `workers/bounce-parser.js` — IMAP bounce processor
- `lib/logger.ts` — structured logging (pino) for server-side logs
- `.env.example` — all required environment variables
- `docs/smtp-integration.md` — integration summary
- `docs/contact-newsletter-flow.md` — this file

---

## Testing checklist ✅
1. Configure `.env.local` from `.env.example` (set SMTP and IMAP test credentials). Use `Mailtrap` or `smtp4dev` for SMTP and a test IMAP mailbox for bounces.
2. Start dev server: `npm run dev` and test contact form and newsletter submission flows.
3. Run the bounce worker locally: `npm run bounce-worker` and simulate DSNs (or create a rule to detect test bounce messages).
4. Check your DB or query `lib/subscribers.ts` (`listSubscribers`, `getSubscriber`) to see updated `bounceCount` and `isBounced` flags.
5. Verify headers in received email: `List-Unsubscribe`, `Reply-To`, and `Message-ID`.

---

## Recommendations / Next steps 📈
- Subscribers are already persisted in MySQL (`lib/subscribers.ts`). For larger scale or multi-region needs consider Postgres/Supabase or managed DBs with replication.
- Add queueing (BullMQ / Redis) for newsletter send jobs and separate worker(s) for sending to reduce request latency and handle retries/backoff.
- Add monitoring and structured logging (pino) for send failures and bounce spikes.
- Configure DKIM/SPF/DMARC for your sending domain (improves deliverability; ask your provider to enable DKIM signing or give you records).

---

If you’d like, I can also add a small admin UI to view/CSV-export subscribers and bounce stats, or migrate the subscriber store to Supabase on your request. ✅

