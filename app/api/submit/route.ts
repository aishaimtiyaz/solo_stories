import { NextResponse } from 'next/server';
import { sheets } from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const hasSheetsConfig = Boolean(
      sheetId &&
      process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
    );

    if (hasSheetsConfig) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: "Sheet1!A:D",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[
            body.name || '',
            body.phone || '',
            body.email || '',
            new Date().toISOString(),
          ]],
        },
      });
      return NextResponse.json({ ok: true, note: 'sheet-appended' });
    }

    const gsa = process.env.GSA_SCRIPT_URL;
    if (gsa) {
      await fetch(gsa, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return NextResponse.json({ ok: true, note: 'forwarded-gsa' });
    }

    console.log('submit payload:', body);
    return NextResponse.json({ ok: true, note: 'no-forward' });
  } catch (err) {
    console.error('submit error:', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
