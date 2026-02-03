import { NextResponse } from 'next/server';

// Stubbed out: no server-side effects while development/demo is client-only.
export async function POST(req: Request) {
  try {
    // Consume body safely but do nothing with it
    try {
      await req.json();
    } catch {
      // ignore parse errors
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ error: 'Server stub error' }, { status: 500 });
  }
}
