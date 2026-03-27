// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/api/admin/create-admin/route.ts
// ⚠️  보안상 비활성화된 엔드포인트
// ═══════════════════════════════════════════════════
import { NextResponse } from "next/server";

/* 어드민 계정 생성 API — 사용 완료 후 영구 비활성화 */
export async function POST() {
  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}
