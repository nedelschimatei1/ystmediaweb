# MySQL setup (Hostinger) — Notes & steps

This project now uses MySQL for subscriber storage. The server-side code automatically creates the `subscribers` table if it doesn't exist.

## Environment variables
Add these variables to your Hostinger environment/config panel (do not commit to repo):

- MYSQL_HOST - hostname provided by Hostinger (e.g., `mysql.hostinger.com`)
- MYSQL_PORT - typically `3306`
- MYSQL_USER - DB user
- MYSQL_PASS - DB user password
- MYSQL_DB - database name
- MYSQL_POOL_SIZE - (optional) connection pool size
- MIGRATE_SUBSCRIBERS - (optional) set to `true` one-time to import existing `data/subscribers.json` into the DB

Also set the mail-related envs (already present in project) and `COMPANY_*` / `PRIVACY_URL` if you want them in transactional emails.

## Migration
If you have existing `data/subscribers.json` and want to import into MySQL:

1. Set `MIGRATE_SUBSCRIBERS=true` in your environment and restart the app (or deploy).
2. The initialization routine will attempt to read `data/subscribers.json` and insert/merge subscribers. It uses `INSERT ... ON DUPLICATE KEY UPDATE` semantics so duplicates are safely merged.
3. After successful migration, set `MIGRATE_SUBSCRIBERS=false` and redeploy.

## Security & best practices
- Use a dedicated DB user with only the required privileges.
- Never commit secrets; use Hostinger's environment variable settings or a secrets manager.
- If your Hostinger DB requires TLS you can configure it via `mysql2` options in `lib/db.ts` (we can add this if required).
- Rotate credentials if they were ever exposed.

## Local development
- Add a `local.env` or `.env` (NOT committed) with values from Hostinger or your local MySQL instance.
- Run `pnpm install` (or `npm install`) to install the new dependency `mysql2`.

If you want, I can add an explicit migration script that logs progress, or add TLS/CA support for Hostinger if needed. Which would you like next?