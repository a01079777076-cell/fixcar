import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { type, url, desc } = await req.json();
    // 콘솔 로그 (추후 슬랙·이메일 연동)
    console.error(`[오류 신고] type=${type} url=${url} desc=${desc}`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
