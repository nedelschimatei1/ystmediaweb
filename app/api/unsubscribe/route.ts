import { z } from 'zod';
import { markUnsubscribed, getSubscriber } from '@/lib/subscribers';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    const token = url.searchParams.get('token');

    if (!email || !token) {
      return new Response('Missing email or token', { status: 400 });
    }

    const sub = await getSubscriber(email);
    if (!sub) return new Response('Subscriber not found', { status: 404 });
    if (sub.token !== token) return new Response('Invalid token', { status: 401 });

    await markUnsubscribed(email);

    const html = `<html><body><h1>Unsubscribed</h1><p>${email} has been unsubscribed from our newsletter.</p></body></html>`;

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err) {
    console.error(err);
    return new Response('Server error', { status: 500 });
  }
}
