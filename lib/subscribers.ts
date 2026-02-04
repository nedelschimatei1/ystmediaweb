import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import fs from 'fs/promises';
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

type Data = {
  subscribers: Subscriber[];
};

let db: Low<Data> | null = null;

// Normalize emails for consistent comparisons
function normalizeEmail(email: string) {
  return (email || '').trim().toLowerCase();
}

// Merge/dedupe subscriber records by email. Keeps earliest createdAt, merges flags
function dedupeSubscribers(arr: Subscriber[]) {
  const map = new Map<string, Subscriber>();
  for (const s of arr) {
    const key = normalizeEmail(s.email);
    if (!map.has(key)) {
      map.set(key, { ...s, email: key });
      continue;
    }

    const existing = map.get(key)!;
    // Keep earliest createdAt
    const createdAt = existing.createdAt && s.createdAt ? (existing.createdAt < s.createdAt ? existing.createdAt : s.createdAt) : (existing.createdAt || s.createdAt);
    const token = existing.token || s.token || uuidv4();
    const bounceCount = Math.max(existing.bounceCount || 0, s.bounceCount || 0);
    const isBounced = !!(existing.isBounced || s.isBounced);
    // If any record is subscribed, keep subscribed true; otherwise false
    const subscribed = !!(existing.subscribed || s.subscribed);
    // Keep the most recent unsubscribedAt if present
    const unsubscribedAt = existing.unsubscribedAt || s.unsubscribedAt ? (existing.unsubscribedAt && s.unsubscribedAt ? (existing.unsubscribedAt > s.unsubscribedAt ? existing.unsubscribedAt : s.unsubscribedAt) : (existing.unsubscribedAt || s.unsubscribedAt)) : null;

    map.set(key, {
      email: key,
      subscribed,
      unsubscribedAt: unsubscribedAt ?? null,
      token,
      bounceCount,
      isBounced,
      createdAt,
    });
  }

  return Array.from(map.values());
}

async function ensure() {
  if (!db) {
    const file = join(process.cwd(), 'data', 'subscribers.json');

    // Ensure data directory and file exist with default data to prevent lowdb errors
    try {
      await fs.access(file);
    } catch (err) {
      await fs.mkdir(join(process.cwd(), 'data'), { recursive: true });
      await fs.writeFile(file, JSON.stringify({ subscribers: [] }, null, 2), 'utf-8');
    }

    const adapter = new JSONFile<Data>(file);
    try {
      // Debug info to trace lowdb init issues
      console.debug('[subscribers] ensure: file', file, 'cwd', process.cwd());
      const raw = await fs.readFile(file, 'utf-8').catch(() => null);
      console.debug('[subscribers] file-size', raw ? raw.length : 0, 'preview', raw ? raw.slice(0, 200) : null);
    } catch (e) {
      console.warn('[subscribers] debug read failed', e);
    }

    try {
      // Provide default data per lowdb v7 constructor signature
      db = new Low<Data>(adapter, { subscribers: [] });
    } catch (err) {
      console.warn('[subscribers] Failed to construct Low adapter, will attempt to recover file', err);
      // Attempt to read and rewrite the file manually
      try {
        const raw = await fs.readFile(file, 'utf-8');
        let parsed: any = null;
        try {
          parsed = JSON.parse(raw);
        } catch (pErr) {
          console.warn('[subscribers] JSON parse failed, recreating default file', pErr);
          parsed = { subscribers: [] };
          await fs.writeFile(file, JSON.stringify(parsed, null, 2), 'utf-8');
        }
        // Create a fresh adapter and initialize db with parsed data
        const freshAdapter = new JSONFile<Data>(file);
        // Use the parsed data as the default for Low
        db = new Low<Data>(freshAdapter, parsed);
        db.data = parsed;
        await db.write();
      } catch (e) {
        console.error('[subscribers] recovery failed, recreating file from scratch', e);
        await fs.writeFile(file, JSON.stringify({ subscribers: [] }, null, 2), 'utf-8');
        const freshAdapter = new JSONFile<Data>(file);
        db = new Low<Data>(freshAdapter, { subscribers: [] });
        await db.read();
      }
    }

    try {
      await db.read();
    } catch (err) {
      console.warn('[subscribers] lowdb read failed after recovery, recreating file with default data', err);
      await fs.writeFile(file, JSON.stringify({ subscribers: [] }, null, 2), 'utf-8');
      const freshAdapter = new JSONFile<Data>(file);
      db = new Low<Data>(freshAdapter, { subscribers: [] });
      await db.read();
    }

    if (!db.data) {
      db.data = { subscribers: [] };
      await db.write();
    }

    // Ensure no duplicate subscribers in memory after initial read / recovery
    if (db.data && Array.isArray(db.data.subscribers)) {
      const deduped = dedupeSubscribers(db.data.subscribers);
      if (deduped.length !== db.data.subscribers.length) {
        db.data.subscribers = deduped;
        await db.write();
      }
    }
  }
}

export async function getSubscriber(email: string) {
  await ensure();
  try {
    if (db && db.data) {
      db.data.subscribers = dedupeSubscribers(db.data.subscribers.map((s) => ({ ...s, email: normalizeEmail(s.email) })));
      const normalized = normalizeEmail(email);
      return db.data.subscribers.find((s) => s.email === normalized) || null;
    }
  } catch (e) {
    console.warn('[subscribers] getSubscriber lowdb access failed, falling back to file', e);
  }

  // File-based fallback
  try {
    const file = join(process.cwd(), 'data', 'subscribers.json');
    const raw = await fs.readFile(file, 'utf-8');
    const parsed = JSON.parse(raw) as Data;
    parsed.subscribers = dedupeSubscribers((parsed.subscribers || []).map((s) => ({ ...s, email: normalizeEmail(s.email) })));
    return (parsed.subscribers || []).find((s) => s.email === normalizeEmail(email)) || null;
  } catch (e) {
    console.warn('[subscribers] getSubscriber file fallback failed', e);
    return null;
  }
}

export async function upsertSubscriber(email: string) {
  try {
    await ensure();

    // Keep DB consistent: dedupe and normalize before operations
    db!.data!.subscribers = dedupeSubscribers(db!.data!.subscribers);

    const normalized = normalizeEmail(email);
    let existing = db!.data!.subscribers.find((s) => normalizeEmail(s.email) === normalized);
    if (existing) {
      // Update existing record instead of creating duplicates
      existing.subscribed = true;
      existing.unsubscribedAt = null;
      // ensure email is normalized in storage
      existing.email = normalized;
      await db!.write();
      return existing;
    }

    const sub: Subscriber = {
      email: normalized,
      subscribed: true,
      unsubscribedAt: null,
      token: uuidv4(),
      bounceCount: 0,
      isBounced: false,
      createdAt: new Date().toISOString(),
    };
    db!.data!.subscribers.push(sub);
    await db!.write();
    return sub;
  } catch (err) {
    console.warn('[subscribers] upsertSubscriber fallback to manual file write due to error', err);
    const file = join(process.cwd(), 'data', 'subscribers.json');
    try {
      await fs.mkdir(join(process.cwd(), 'data'), { recursive: true });
      const raw = await fs.readFile(file, 'utf-8').catch(() => null);
      let data: Data = { subscribers: [] };
      if (raw) {
        try {
          data = JSON.parse(raw);
          if (!data || !Array.isArray((data as any).subscribers)) data = { subscribers: [] };
        } catch (e) {
          data = { subscribers: [] };
        }
      }

      // Normalize and dedupe the on-disk data before applying updates
      data.subscribers = dedupeSubscribers((data.subscribers || []).map((s: Subscriber) => ({ ...s, email: normalizeEmail(s.email) })));

      const normalized = normalizeEmail(email);
      let existing = data.subscribers.find((s) => normalizeEmail(s.email) === normalized);
      if (existing) {
        existing.subscribed = true;
        existing.unsubscribedAt = null;
        existing.email = normalized;
        await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
        return existing;
      }

      const sub: Subscriber = {
        email: normalized,
        subscribed: true,
        unsubscribedAt: null,
        token: uuidv4(),
        bounceCount: 0,
        isBounced: false,
        createdAt: new Date().toISOString(),
      };
      data.subscribers.push(sub);
      await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
      return sub;
    } catch (e) {
      console.error('[subscribers] fallback write failed', e);
      throw e;
    }
  }
}

export async function markUnsubscribed(email: string, reason?: string) {
  await ensure();
  try {
    if (db && db.data) {
      // Normalize & dedupe before mutating
      db.data.subscribers = dedupeSubscribers(db.data.subscribers.map((x) => ({ ...x, email: normalizeEmail(x.email) })));
      const normalized = normalizeEmail(email);
      const s = db.data.subscribers.find((x) => x.email === normalized);
      if (!s) return null;
      s.subscribed = false;
      s.unsubscribedAt = new Date().toISOString();
      await db.write();
      return s;
    }
  } catch (e) {
    console.warn('[subscribers] markUnsubscribed lowdb access failed, falling back to file', e);
  }

  // File-based fallback
  const file = join(process.cwd(), 'data', 'subscribers.json');
  const raw = await fs.readFile(file, 'utf-8').catch(() => null);
  if (!raw) return null;
  let parsed = JSON.parse(raw) as Data;
  parsed.subscribers = dedupeSubscribers((parsed.subscribers || []).map((s) => ({ ...s, email: normalizeEmail(s.email) })));
  const s = parsed.subscribers.find((x) => x.email === normalizeEmail(email));
  if (!s) return null;
  s.subscribed = false;
  s.unsubscribedAt = new Date().toISOString();
  await fs.writeFile(file, JSON.stringify(parsed, null, 2), 'utf-8');
  return s;
}

export async function markBounce(email: string, isHard: boolean) {
  await ensure();
  try {
    if (db && db.data) {
      db.data.subscribers = dedupeSubscribers(db.data.subscribers.map((x) => ({ ...x, email: normalizeEmail(x.email) })));
      const normalized = normalizeEmail(email);
      const s = db.data.subscribers.find((x) => x.email === normalized);
      if (!s) return null;
      s.bounceCount = (s.bounceCount || 0) + 1;
      if (isHard) {
        s.isBounced = true;
        s.subscribed = false;
        s.unsubscribedAt = new Date().toISOString();
      }
      await db.write();
      return s;
    }
  } catch (e) {
    console.warn('[subscribers] markBounce lowdb access failed, falling back to file', e);
  }

  // File-based fallback
  const file = join(process.cwd(), 'data', 'subscribers.json');
  const raw = await fs.readFile(file, 'utf-8').catch(() => null);
  if (!raw) return null;
  let parsed = JSON.parse(raw) as Data;
  parsed.subscribers = dedupeSubscribers((parsed.subscribers || []).map((s) => ({ ...s, email: normalizeEmail(s.email) })));
  const s = parsed.subscribers.find((x) => x.email === normalizeEmail(email));
  if (!s) return null;
  s.bounceCount = (s.bounceCount || 0) + 1;
  if (isHard) {
    s.isBounced = true;
    s.subscribed = false;
    s.unsubscribedAt = new Date().toISOString();
  }
  await fs.writeFile(file, JSON.stringify(parsed, null, 2), 'utf-8');
  return s;
}

export async function listSubscribers() {
  await ensure();
  try {
    if (db && db.data) {
      db.data.subscribers = dedupeSubscribers(db.data.subscribers.map((s) => ({ ...s, email: normalizeEmail(s.email) })));
      await db.write();
      return db.data.subscribers;
    }
  } catch (e) {
    console.warn('[subscribers] listSubscribers lowdb access failed, falling back to file', e);
  }

  const file = join(process.cwd(), 'data', 'subscribers.json');
  const raw = await fs.readFile(file, 'utf-8').catch(() => null);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as Data;
  parsed.subscribers = dedupeSubscribers((parsed.subscribers || []).map((s) => ({ ...s, email: normalizeEmail(s.email) })));
  return parsed.subscribers || [];
}
