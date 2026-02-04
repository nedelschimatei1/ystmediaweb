import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import { join } from 'path';
import logger from './logger';

let pool: mysql.Pool | null = null;

export async function initDb() {
  if (pool) return pool;

  const host = process.env.MYSQL_HOST;
  const port = Number(process.env.MYSQL_PORT || 3306);
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASS;
  const database = process.env.MYSQL_DB;
  const connectionLimit = Number(process.env.MYSQL_POOL_SIZE || 10);

  if (!host || !user || !database) {
    throw new Error('MySQL not configured. Set MYSQL_HOST, MYSQL_USER and MYSQL_DB in environment for production.');
  }

  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit,
    timezone: 'Z',
    decimalNumbers: true,
  });

  await ensureSchema(pool);

  // Optional migration from existing JSON file if MIGRATE_SUBSCRIBERS="true"
  if (process.env.MIGRATE_SUBSCRIBERS === 'true') {
    try {
      const p = join(process.cwd(), 'data', 'subscribers.json');
      const raw = await fs.readFile(p, 'utf-8').catch(() => null);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.subscribers)) {
          for (const s of parsed.subscribers) {
            const email = (s.email || '').toLowerCase().trim();
            if (!email) continue;
            const token = s.token || null;
            const createdAt = s.createdAt ? new Date(s.createdAt) : new Date();
            await pool.execute(
              `INSERT INTO subscribers (email, subscribed, unsubscribedAt, token, bounceCount, isBounced, createdAt)
               VALUES (?, ?, ?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE
                 subscribed = GREATEST(subscribed, VALUES(subscribed)),
                 bounceCount = GREATEST(bounceCount, VALUES(bounceCount)),
                 isBounced = (isBounced OR VALUES(isBounced)),
                 unsubscribedAt = IFNULL(VALUES(unsubscribedAt), unsubscribedAt)`,
              [email, s.subscribed ? 1 : 0, s.unsubscribedAt || null, token || null, s.bounceCount || 0, s.isBounced ? 1 : 0, createdAt]
            );
          }
        }
      }
    } catch (e) {
      logger.warn({ err: e }, '[db] migration failed');
    }
  }

  return pool;
}

async function ensureSchema(pool: mysql.Pool) {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS subscribers (
      email VARCHAR(255) NOT NULL PRIMARY KEY,
      subscribed TINYINT(1) NOT NULL DEFAULT 1,
      unsubscribedAt DATETIME NULL,
      token VARCHAR(36) NOT NULL,
      bounceCount INT NOT NULL DEFAULT 0,
      isBounced TINYINT(1) NOT NULL DEFAULT 0,
      createdAt DATETIME NOT NULL
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);
}
