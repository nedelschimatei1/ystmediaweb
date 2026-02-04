import { initDb } from './db';
import { v4 as uuidv4 } from 'uuid';

type Subscriber = {
  email: string;
  subscribed: boolean;
  unsubscribedAt?: string | null;
  token: string;
  bounceCount: number;
  isBounced: boolean;
  createdAt: string;
};

function normalizeEmail(email: string) {
  return (email || '').trim().toLowerCase();
}

function rowToSubscriber(row: any): Subscriber {
  return {
    email: row.email,
    subscribed: !!row.subscribed,
    unsubscribedAt: row.unsubscribedAt ? new Date(row.unsubscribedAt).toISOString() : null,
    token: row.token,
    bounceCount: row.bounceCount || 0,
    isBounced: !!row.isBounced,
    createdAt: new Date(row.createdAt).toISOString(),
  };
}

export async function getSubscriber(email: string) {
  const pool = await initDb();
  const normalized = normalizeEmail(email);
  const [rows]: any = await pool.execute('SELECT * FROM subscribers WHERE email = ? LIMIT 1', [normalized]);
  if (rows && rows.length) return rowToSubscriber(rows[0]);
  return null;
}

export async function upsertSubscriber(email: string) {
  const pool = await initDb();
  const normalized = normalizeEmail(email);

  // Update existing if present
  const [updateResult]: any = await pool.execute('UPDATE subscribers SET subscribed = 1, unsubscribedAt = NULL WHERE email = ?', [normalized]);
  if (updateResult && updateResult.affectedRows && updateResult.affectedRows > 0) {
    return await getSubscriber(normalized);
  }

  // Insert new
  const token = uuidv4();
  const createdAt = new Date();
  await pool.execute(
    'INSERT INTO subscribers (email, subscribed, unsubscribedAt, token, bounceCount, isBounced, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [normalized, 1, null, token, 0, 0, createdAt]
  );
  return await getSubscriber(normalized);
}

export async function markUnsubscribed(email: string) {
  const pool = await initDb();
  const normalized = normalizeEmail(email);
  await pool.execute('UPDATE subscribers SET subscribed = 0, unsubscribedAt = ? WHERE email = ?', [new Date(), normalized]);
  return await getSubscriber(normalized);
}

export async function markBounce(email: string, isHard: boolean) {
  const pool = await initDb();
  const normalized = normalizeEmail(email);
  if (isHard) {
    await pool.execute('UPDATE subscribers SET bounceCount = bounceCount + 1, isBounced = 1, subscribed = 0, unsubscribedAt = ? WHERE email = ?', [new Date(), normalized]);
  } else {
    await pool.execute('UPDATE subscribers SET bounceCount = bounceCount + 1 WHERE email = ?', [normalized]);
  }
  return await getSubscriber(normalized);
}

export async function listSubscribers() {
  const pool = await initDb();
  const [rows]: any = await pool.execute('SELECT * FROM subscribers ORDER BY createdAt ASC');
  return (rows || []).map(rowToSubscriber);
}




