import { NextResponse } from "next/server";
import { sheets } from "@/lib/googleSheets";

export async function POST(req: Request) {
  let step = "start";

  try {
    step = "reading-json";
    const body = await req.json();

    console.log("✅ BODY:", body);

    step = "checking-env";
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    console.log("✅ ENV CHECK:", {
      hasSheetId: !!sheetId,
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey,
      sheetTab: process.env.GOOGLE_SHEET_TAB,
      gsa: !!process.env.GSA_SCRIPT_URL,
    });

    const hasSheetsConfig = Boolean(sheetId && clientEmail && privateKey);

    if (hasSheetsConfig) {
      step = "creating-sheet-tab";

      const sheetTab = process.env.GOOGLE_SHEET_TAB
        ? `'${process.env.GOOGLE_SHEET_TAB.replace(/'/g, "''")}'`
        : "Sheet1";

      console.log("✅ APPENDING TO:", {
        spreadsheetId: sheetId,
        range: `${sheetTab}!A:C`,
      });

      step = "google-sheet-append";

      const result = await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId!,
        range: `${sheetTab}!A:C`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [
            [
              body.name || "",
              body.phone || "",
              new Date().toLocaleString("en-IN",{
                timeZone: "Asia/Kolkata",
                 day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
              }),
            ],
          ],
        },
      });

      console.log("✅ SHEET APPEND RESULT:", result.data);

      return NextResponse.json({
        ok: true,
        note: "sheet-appended",
        result: result.data,
      });
    }

    step = "no-forward";
    console.log("submit payload:", body);

    return NextResponse.json({ ok: true, note: "no-forward" });
  } catch (err: any) {
    console.error("❌ SUBMIT ERROR:", {
      step,
      message: err?.message,
      code: err?.code,
      status: err?.status,
      response: err?.response?.data,
      stack: err?.stack,
    });

    return NextResponse.json(
      {
        ok: false,
        error: "server_error",
        failedAt: step,
        message: err?.message,
      },
      { status: 500 }
    );
  }
}