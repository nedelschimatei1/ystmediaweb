# Changelog — Contact & Newsletter (selected) 

## 2026-02-04 — Migration & Security Hardening ✅

Highlights:
- Migrated subscriber storage from file-backed `lowdb` to **MySQL** (see `lib/db.ts`, `lib/subscribers.ts`). This removes race conditions and enables reliable upserts and bounce state tracking.
- Replaced ad-hoc `console.*` logging with **structured logging** using `pino` (`lib/logger.ts`), and replaced server-side logs across worker and API routes.
- Removed unused legacy dependencies (`lowdb`, Upstash packages) from active paths and ran `npm audit` (no high/critical issues found at time of check).
- Implemented an in-process **memory-only rate limiter** (per-IP and per-email throttles) suitable for the single-instance deployment and added per-IP protection on the unsubscribe endpoint.
- Improved privacy: added `redactEmail`/`redactText` helpers (`lib/input.ts`), used them in owner notifications and server logs to avoid PII leakage.

Files touched (high level):
- lib/db.ts, lib/subscribers.ts, workers/bounce-parser.js, lib/mailer.ts, lib/input.ts, lib/logger.ts, lib/rate-limit.ts
- app/api/contact/route.ts, app/api/newsletter/route.ts, app/api/unsubscribe/route.ts
- docs/security-audit.md, docs/contact-newsletter-flow.md, docs/smtp-integration.md

Next suggested actions:
- Add unit/integration tests (rate limiter, unsubscribe token, input sanitizers, email templates).
- Add retry/backoff & queueing for outbound mails and worker → API pattern for atomic updates.
- Add monitoring/alerts for bounce spikes and send failures.
- Rotate credentials if any were previously exposed.

---

(If you want, I can add a short GitHub release note or PR description using this changelog text.)
