#!/usr/bin/env node
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const nodemailer = require('nodemailer');

const IMAP_HOST = process.env.IMAP_HOST || 'mail.webforest.ro';
const IMAP_PORT = Number(process.env.IMAP_PORT || 993);
const IMAP_USER = process.env.IMAP_USER;
const IMAP_PASS = process.env.IMAP_PASS;
const IMAP_TLS = process.env.IMAP_TLS !== 'false';
const IMAP_BOUNCE_FOLDER = process.env.IMAP_BOUNCE_FOLDER || 'Bounces';
const IMAP_PROCESSED_FOLDER = process.env.IMAP_PROCESSED_FOLDER || 'Processed';
const IMAP_POLL_INTERVAL_SECONDS = Number(process.env.IMAP_POLL_INTERVAL_SECONDS || 300);

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || `no-reply@${SMTP_HOST}`;
const CONTACT_NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL;

if (!IMAP_USER || !IMAP_PASS) {
  console.error('IMAP credentials are required. Set IMAP_USER and IMAP_PASS in env.');
  process.exit(1);
}

async function createSmtpTransport() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    pool: true,
    maxConnections: Number(process.env.SMTP_POOL_MAX_CONNECTIONS || 2),
    maxMessages: Number(process.env.SMTP_POOL_MAX_MESSAGES || 50),
  });
}

function extractRecipients(parsed) {
  const res = new Set();
  // X-Failed-Recipients header
  try {
    const xf = parsed.headers && parsed.headers.get && parsed.headers.get('x-failed-recipients');
    if (xf) {
      xf.split(',').map(s => s.trim()).forEach(r => res.add(r));
    }
  } catch (e) {}

  const text = (parsed.text || '') + '\n' + (parsed.html || '');

  // Look for Final-Recipient or Original-Recipient lines
  const reFinal = /Final-Recipient:\s*[^;]+;\s*([^\s;]+)/ig;
  let m;
  while ((m = reFinal.exec(text)) !== null) {
    res.add(m[1]);
  }

  const reOrig = /Original-Recipient:\s*[^;]+;\s*([^\s;]+)/ig;
  while ((m = reOrig.exec(text)) !== null) {
    res.add(m[1]);
  }

  // X-Failed-Recipients fallback in headers like 'x-failed-recipient'
  try {
    for (const [k, v] of parsed.headers || []) {
      if (k && k.toLowerCase().includes('x-failed-recipient')) {
        v.split(',').map(s => s.trim()).forEach(r => res.add(r));
      }
    }
  } catch (e) {}

  return Array.from(res);
}

function isHardBounce(parsed) {
  const text = (parsed.text || '').toLowerCase();
  // look for 5.x.x status or 'permanent' or 'user unknown'
  if (/status=\s*5\./i.test(text)) return true;
  if (/permanent failure|delivery permanently failed|user unknown|recipient not found/i.test(text)) return true;
  return false;
}

async function processMailbox() {
  const client = new ImapFlow({
    host: IMAP_HOST,
    port: IMAP_PORT,
    secure: IMAP_TLS,
    auth: { user: IMAP_USER, pass: IMAP_PASS },
  });

  await client.connect();
  console.log('Connected to IMAP');

  const transport = await createSmtpTransport();

  while (true) {
    try {
      // Ensure mailbox exists and open
      await client.mailboxOpen(IMAP_BOUNCE_FOLDER);
      const lock = await client.getMailboxLock(IMAP_BOUNCE_FOLDER);
      try {
        // Search for unseen messages
        const messages = await client.search({ seen: false });
        if (messages && messages.length) {
          console.log(`Found ${messages.length} new messages in ${IMAP_BOUNCE_FOLDER}`);
        }

        for (const seq of messages) {
          try {
            const msg = await client.fetchOne(seq, { source: true, uid: true });
            const parsed = await simpleParser(msg.source);
            const recipients = extractRecipients(parsed);
            const hard = isHardBounce(parsed);

            if (recipients.length === 0) {
              console.log('No bounced recipients detected for message uid:', msg.uid);
            } else {
              for (const r of recipients) {
                console.log(`Bounce detected: ${r} (hard=${hard})`);
                // Notify site owner
                if (CONTACT_NOTIFY_EMAIL) {
                  await transport.sendMail({
                    from: SMTP_FROM,
                    to: CONTACT_NOTIFY_EMAIL,
                    subject: `[Bounce] ${r} (${hard ? 'hard' : 'soft'})`,
                    text: `Detected bounce for ${r}\nHard: ${hard}\nSubject: ${parsed.subject || ''}\n\nFull excerpt:\n${(parsed.text || parsed.html || '').slice(0, 4000)}`,
                  });
                }

                // Mark bounce in subscribers store if present (MySQL)
                try {
                  const client = require('./subscriber-client');
                  await client.markBounce(r, hard);
                  console.log('Updated subscriber bounce state for', r);
                } catch (e) {
                  console.warn('Failed to update subscribers DB', e?.message || e);
                }
              }
            }

            // Move to processed folder (create if doesn't exist)
            try {
              await client.mailboxOpen(IMAP_PROCESSED_FOLDER).catch(async () => {
                await client.mailboxCreate(IMAP_PROCESSED_FOLDER);
              });
              await client.messageMove(msg.uid, IMAP_PROCESSED_FOLDER);
            } catch (e) {
              console.warn('Failed to move message, marking as seen:', e?.message || e);
              await client.messageFlagsAdd(msg.uid, ['\Seen']);
            }
          } catch (msgErr) {
            console.error('Error processing message', msgErr);
          }
        }
      } finally {
        lock.release();
        await client.mailboxClose();
      }
    } catch (err) {
      console.error('IMAP polling error', err);
    }

    await new Promise((r) => setTimeout(r, IMAP_POLL_INTERVAL_SECONDS * 1000));
  }
}

processMailbox().catch((err) => {
  console.error('Bounce parser crashed', err);
  process.exit(1);
});
