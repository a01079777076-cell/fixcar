import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 메인페이지 "누적 이용자" 표시용 API
 * - 실제 누적 고유 방문자(IP 기준)만 집계 — 부스트·기본값 없음
 */
export async function GET() {
  try {
    const realVisitors = await prisma.visitorLog.groupBy({
      by: ["ip"],
      where: { referer: "visit" },
    });

    /* 최근 3개월 월별 고유 방문자 */
    const now = new Date();
    const monthly: { month: string; count: number }[] = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const endD = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const visitors = await prisma.visitorLog.groupBy({
        by: ["ip"],
        where: { referer: "visit", date: { gte: `${yearMonth}-01`, lte: `${yearMonth}-${String(endD.getDate()).padStart(2, "0")}` } },
      });
      monthly.push({ month: `${d.getMonth() + 1}월`, count: visitors.length });
    }

    return NextResponse.json({ activeUsers: realVisitors.length, monthly });
  } catch (e) {
    console.error("[stats/activity] 조회 실패:", e);
    /* 실패 시 숫자를 지어내지 않음 */
    return NextResponse.json({ activeUsers: 0, monthly: [] });
  }
}
