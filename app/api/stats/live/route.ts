// 📁 저장 경로: app/api/stats/live/route.ts
// 실시간 접속자 집계용 하트비트 — 새 테이블 없이 VisitorLog 재사용
//  · ip = "live:<브라우저 세션ID>", date = LIVE_DATE, createdAt = 마지막 신호 시각
//  · 세션당 1행만 유지(갱신), 오래된 행은 주기적으로 삭제 → DB 증가 없음
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiGuard } from "@/lib/api-guard";
import { LIVE_DATE, LIVE_WINDOW_MS } from "@/lib/live";

export async function POST(req: NextRequest) {
  const guard = apiGuard(req, { rateLimit: 10 });
  if (guard instanceof NextResponse) return guard;

  try {
    const { sid } = await req.json().catch(() => ({}));
    if (typeof sid !== "string" || !/^[a-zA-Z0-9-]{8,64}$/.test(sid)) {
      return NextResponse.json({ success: false, error: "잘못된 요청" }, { status: 400 });
    }
    const key = `live:${sid}`;
    const now = new Date();

    const updated = await prisma.visitorLog.updateMany({
      where: { ip: key, date: LIVE_DATE },
      data: { createdAt: now },
    });
    if (updated.count === 0) {
      await prisma.visitorLog.create({ data: { ip: key, date: LIVE_DATE, referer: "live", userAgent: "" } });
    }

    /* 약 5% 확률로 오래된 접속 기록 정리 (별도 크론 없이 크기 유지) */
    if (Math.random() < 0.05) {
      await prisma.visitorLog.deleteMany({
        where: { date: LIVE_DATE, createdAt: { lt: new Date(now.getTime() - 2 * LIVE_WINDOW_MS) } },
      });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
