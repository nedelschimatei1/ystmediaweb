export async function verifyRecaptcha(token: string | undefined, action: string) {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) {
    console.warn('RECAPTCHA_SECRET is not set. Skipping verification (not recommended for production).');
    return { success: true, score: 1 };
  }

  if (!token) return { success: false, score: 0 };

  const params = new URLSearchParams();
  params.append('secret', secret);
  params.append('response', token);

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const data = await res.json();
  // { success, score, action, challenge_ts, hostname }
  return data;
}
