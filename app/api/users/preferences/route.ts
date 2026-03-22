import { NextRequest, NextResponse } from "next/server";

/* POST: 유저 환경설정 저장 (클라이언트 localStorage와 병행) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    /* 현재는 localStorage 기반, 추후 DB 확장 가능 */
    return NextResponse.json({ success: true, ...body });
  } catch {
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}
