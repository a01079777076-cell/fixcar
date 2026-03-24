import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "권한 없음" }, { status: 403 });

  try {
    const today = new Date().toISOString().slice(0, 10);

    /* 오늘 방문자 (고유 IP) */
    const todayVisitors = await prisma.visitorLog.groupBy({
      by: ["ip"],
      where: { date: today, referer: "visit" },
    });

    /* 전체 누적 (고유 IP) */
    const totalVisitors = await prisma.visitorLog.groupBy({
      by: ["ip"],
      where: { referer: "visit" },
    });

    /* 일별 방문자 (최근 30일) */
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyStr = thirtyDaysAgo.toISOString().slice(0, 10);

    const dailyRaw = await prisma.visitorLog.groupBy({
      by: ["date"],
      where: { referer: "visit", date: { gte: thirtyStr } },
      _count: { ip: true },
    });

    /* 날짜별 고유 IP 수 계산 */
    const dailyMap: Record<string, Set<string>> = {};
    const logs = await prisma.visitorLog.findMany({
      where: { referer: "visit", date: { gte: thirtyStr } },
      select: { date: true, ip: true },
    });
    for (const log of logs) {
      if (!dailyMap[log.date]) dailyMap[log.date] = new Set();
      dailyMap[log.date].add(log.ip);
    }

    const daily = Object.entries(dailyMap)
      .map(([date, ips]) => ({ date, count: ips.size }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      today: todayVisitors.length,
      total: totalVisitors.length,
      daily,
    });
  } catch (e) {
    return NextResponse.json({ today: 0, total: 0, daily: [] });
  }
}
