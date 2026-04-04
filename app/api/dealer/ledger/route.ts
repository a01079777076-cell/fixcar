// 📁 저장 경로: app/api/dealer/ledger/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// 차계부는 현재 DB 모델 없이 localStorage 기반으로 동작
// 나중에 Prisma 모델 추가 후 DB 연동 가능
// 이 API는 placeholder — 프론트에서 localStorage 사용

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  // TODO: DB 연동 시 아래 구현
  return NextResponse.json({ success: true, data: [], message: "차계부 데이터는 현재 기기에 저장됩니다." });
}

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  // TODO: DB 연동
  return NextResponse.json({ success: true, message: "차계부 DB 연동 예정" });
}
