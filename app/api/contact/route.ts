// ========= app/api/contact/route.ts =========
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[문의 접수]", body);
    // TODO: 이메일 발송 (Resend/SendGrid)
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
