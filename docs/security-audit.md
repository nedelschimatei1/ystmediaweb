# Security Audit — Contact & Newsletter Codebase

**Date:** 2026-02-04

## Quick summary ✅
- Overall: Good protections in place for a small-scale deployment (reCAPTCHA, Zod validation, memory-only rate limiting). Email send code and bounce handling implemented. Several important hardening steps remain before production: secrets handling, persistent storage security, DKIM/SPF/DMARC, logs/data exposure, and a few small process/race concerns.

---

## Findings (detailed) 🔎

1. Secrets and credentials
   - All runtime secrets are read from environment variables (SMTP, IMAP, RECAPTCHA, MySQL). `.env.example` contains placeholders — good practice.
   - Risk: IMAP credentials and SMTP creds must never be committed. Ensure real `.env` or secret files are in `.gitignore` and secrets are stored in the hosting provider's secret store.

2. Subscriber storage
   - Subscribers are stored in MySQL (see `lib/db.ts`). The previous `data/subscribers.json` file is ignored to avoid committing PII. **Risk:** ensure secrets are not tracked and rotate keys if needed.
- Ensure `RECAPTCHA_SECRET` is set in production to block automated signups. The app enforces reCAPTCHA (score threshold) and rate limiting in production; the project uses a memory-only limiter by default and can be configured to use Upstash/Redis later for centralized limits across instances.
   - Recommendation: add `data/*.json` to `.gitignore` and migrate to a database for production (Supabase/Postgres).

3. Input validation & payload handling
   - Server uses Zod for schema validation on both contact and newsletter routes — good.
   - Contact route currently returns Zod `details` for invalid input in the response. Avoid leaking validation internals in production responses (return a generic error message and log details server-side).

4. Spam/abuse protections
   - reCAPTCHA verification implemented server-side. Good.
   - Rate-limiting implemented with memory-only limiters (per-IP and per-email throttles). Tune limits via env vars (`CONTACT_LIMIT`, `NEWSLETTER_LIMIT`, `NEWSLETTER_EMAIL_LIMIT`) and consider upgrading to Upstash/Redis if you run multiple instances.

5. Email sending & headers
   - Nodemailer uses pooled transport with TLS enforcement and List-Unsubscribe headers added. `envelope.from` uses `SMTP_BOUNCE_EMAIL`.
   - Recommend DKIM / SPF / DMARC DNS configuration for domain to ensure deliverability and anti-spoofing.

6. Bounce handling & worker
   - Worker polls IMAP `Bounces` folder and marks hard bounces in the subscriber JSON. Good automation for small scale.
   - The bounce worker now updates subscribers in MySQL via a small helper client; this avoids file race conditions and is atomic at the DB level. Continue to be careful about logging PII from bounce messages.
   - The worker email notification includes excerpts of failed messages; be careful about logging or emailing sensitive PII.

7. Unsubscribe flow
   - Tokenized unsubscribe URLs are used (`token` stored per subscriber) — good to prevent accidental unsubscribes.
   - Ensure tokens are long/random (UUID used) and verified strictly (already implemented).

8. Error handling & logging
   - Some logs print message excerpts (bounce worker). Avoid logging full PII in production and redact where appropriate.
   - Avoid exposing detailed error stacks to clients.

9. Dependency & runtime security
   - New packages installed (imapflow, mailparser, nodemailer, mysql2). Keep dependencies up-to-date, run `npm audit`, and pin versions. Consider periodic dependency scanning.

10. CSRF & CORS
   - Next.js API routes are same-origin; forms use reCAPTCHA which helps prevent automated CSRF. If you expect cross-site POSTs, consider additional CSRF protections.

---

## Actionable Recommendations (priority ordered) 🔧

1. Secrets & git hygiene (very high) ✅
   - Add `data/*.json` to `.gitignore` immediately.
   - Remove `data/subscribers.json` from git history if it contains real data (use `git rm --cached` and rotate any secrets if needed).
   - Store secrets in your host (Vercel/Netlify/GCP secrets) and never in the repo.

2. Move subscriber store to a real DB (high)
   - Replace `lowdb` with Postgres/Supabase/PlanetScale. Benefits: concurrency, backups, access controls, easier querying.

3. Harden webhooks & responses (high)
   - Do not return raw Zod issues in production responses; return generic errors and log details server-side.
   - Rate-limit per IP and consider per-email limits to prevent abusive repeated submissions.

4. Worker improvements (medium)
   - Switch to a queue and worker that uses atomic DB updates (if you switch to DB) and add visibility/monitoring.
   - Use IMAP IDLE for near-real-time processing (optional) and handle auto-replies differently from DSNs.
   - Redact message excerpts in notifications and logs to avoid PII leaks.

5. Email deliverability and sender domain hardening (high)
   - Configure SPF, DKIM, and DMARC for your domain. Start DMARC with `p=none` and monitor reports before moving to `p=quarantine` or `p=reject`.
   - Set `List-Unsubscribe` and ensure `Return-Path` is properly set to a monitored address.

6. Secrets rotation & least privilege (medium)
   - Use separate SMTP user for app (not personal mailbox) and create a dedicated bounce mailbox if possible.
   - Rotate credentials and enforce strong passwords.

7. Monitoring & alerting (medium)
   - Add monitoring for bounce spikes, rate-limit triggers, and send failures. Use Sentry/Prometheus and provider dashboards.

8. Dependency hygiene (ongoing)
   - Run `npm audit` regularly and consider a GitHub Dependabot setup or similar.

---

## Quick remediation checklist (practical) ✅
- [x] Add `data/*.json` to `.gitignore` and remove `data/subscribers.json` from the repository (git rm --cached).
- [x] Move subscribers to MySQL and update `lib/subscribers.ts` to use it (see `lib/db.ts`).
- [ ] Rotate any credentials if they were ever committed.
- [ ] Hide validation details in API responses; only return a short message and log full errors server-side.
- [ ] Limit logs that contain PII; redact message bodies before emailing or logging.
- [ ] Configure DKIM/SPF/DMARC and verify with mail-tester / MXToolbox.
- [ ] Consider adding centralized rate limiting (Upstash/Redis) if you scale to multiple instances.
- [ ] Add monitoring/alerts for bounce rate and worker failures.

---

If you'd like, I can:
- Add `data/*.json` to `.gitignore` and remove the current `data/subscribers.json` from Git history safely, or
- Migrate `lib/subscribers.ts` to Supabase/Postgres now (create migration and new API), or
- Implement PII redaction and change the worker to call an API endpoint to update subscribers atomically.

Which remediation would you like me to do next? 🔐