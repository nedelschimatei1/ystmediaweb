import { v4 as uuidv4 } from 'uuid';
import type { RowDataPacket, ResultSetHeader, FieldPacket } from 'mysql2';
import { query, exec } from './db-client'

// Strongly-typed representation of a subscriber in the public API
export type Subscriber = {
  email: string;
  subscribed: boolean;
  unsubscribedAt?: string | null;
  token: string;
  bounceCount: number;
  isBounced: boolean;
  createdAt: string; // ISO timestamp
};

// Internal DB row shape (keeps us explicit about possible DB value types)
type SubscriberRow = RowDataPacket & {
  email: string;
  subscribed: number | boolean;
  unsubscribedAt?: string | Date | null;
  token: string;
  bounceCount?: number;
  isBounced?: number | boolean;
  createdAt: string | Date;
};

function normalizeEmail(email: string) {
  return (email || '').trim().toLowerCase();
}

function rowToSubscriber(row: SubscriberRow): Subscriber {
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

export async function getSubscriber(email: string): Promise<Subscriber | null> {
  const normalized = normalizeEmail(email);
  const rows = await query<SubscriberRow>('SELECT * FROM subscribers WHERE email = ? LIMIT 1', [normalized]);
  if (rows && rows.length) return rowToSubscriber(rows[0]);
  return null;
}

export async function upsertSubscriber(email: string): Promise<Subscriber | null> {
  const normalized = normalizeEmail(email);

  // Update existing if present
  const updateResult = await exec('UPDATE subscribers SET subscribed = 1, unsubscribedAt = NULL WHERE email = ?', [normalized]);
  if (updateResult && updateResult.affectedRows && updateResult.affectedRows > 0) {
    return await getSubscriber(normalized);
  }

  // Insert new
  const token = uuidv4();
  const createdAt = new Date();
  await exec(
    'INSERT INTO subscribers (email, subscribed, unsubscribedAt, token, bounceCount, isBounced, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [normalized, 1, null, token, 0, 0, createdAt]
  );
  return await getSubscriber(normalized);
}

export async function markUnsubscribed(email: string): Promise<Subscriber | null> {
  const normalized = normalizeEmail(email);
  await exec('UPDATE subscribers SET subscribed = 0, unsubscribedAt = ? WHERE email = ?', [new Date(), normalized]);
  return await getSubscriber(normalized);
}

export async function markBounce(email: string, isHard: boolean): Promise<Subscriber | null> {
  const normalized = normalizeEmail(email);
  if (isHard) {
    await exec('UPDATE subscribers SET bounceCount = bounceCount + 1, isBounced = 1, subscribed = 0, unsubscribedAt = ? WHERE email = ?', [new Date(), normalized]);
  } else {
    await exec('UPDATE subscribers SET bounceCount = bounceCount + 1 WHERE email = ?', [normalized]);
  }
  return await getSubscriber(normalized);
}

export async function listSubscribers(): Promise<Subscriber[]> {
  const rows = await query<SubscriberRow>('SELECT * FROM subscribers ORDER BY createdAt ASC')
  return (rows || []).map(rowToSubscriber);
}




