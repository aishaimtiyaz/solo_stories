import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Forward to Google Apps Script URL if configured
    const gsa = process.env.GSA_SCRIPT_URL;
    if (gsa) {
      await fetch(gsa, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return NextResponse.json({ ok: true });
    }

    // If not configured, log and return success so client doesn't error
    // (You can set GSA_SCRIPT_URL to an Apps Script Web App that appends to a sheet.)
    console.log('submit payload:', body);
    return NextResponse.json({ ok: true, note: 'no-forward' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
