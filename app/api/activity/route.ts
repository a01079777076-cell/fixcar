import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 메인페이지 "누적 이용자" — 실제 데이터만
 * 부스트/가짜 수치 없음. 정확한 고유 방문자 수
 */

export async function GET() {
  try {
    /* 실제 누적 고유 방문자 (IP 기준) */
    const totalVisitors = await prisma.visitorLog.groupBy({
      by: ["ip"],
      where: { referer: "visit" },
    });

    /* 오늘 방문자 */
    const today = new Date().toISOString().slice(0, 10);
    const todayVisitors = await prisma.visitorLog.groupBy({
      by: ["ip"],
      where: { date: today, referer: "visit" },
    });

    /* 월별 추이 (최근 3개월, 실제 데이터) */
    const now = new Date();
    const monthly: { month: string; count: number }[] = [];

    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const startDate = `${yearMonth}-01`;
      const endD = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const endDate = `${yearMonth}-${String(endD.getDate()).padStart(2, "0")}`;

      const visitors = await prisma.visitorLog.groupBy({
        by: ["ip"],
        where: { referer: "visit", date: { gte: startDate, lte: endDate } },
      });

      monthly.push({ month: `${d.getMonth() + 1}월`, count: visitors.length });
    }

    return NextResponse.json({
      activeUsers: totalVisitors.length,
      today: todayVisitors.length,
      monthly,
    });
  } catch {
    return NextResponse.json({ activeUsers: 0, today: 0, monthly: [] });
  }
}
