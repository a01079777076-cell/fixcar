// 📁 저장 경로: app/api/visitor/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const userAgent = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "";
    const today = new Date().toISOString().slice(0, 10);

    // 같은 IP + 같은 날짜 중복 체크
    const existing = await prisma.visitorLog.findFirst({
      where: { ip, date: today },
    });

    if (!existing) {
      await prisma.visitorLog.create({
        data: { ip, userAgent, referer, date: today },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}

/* GET: 방문자 통계 (admin용) */
export async function GET(req: NextRequest) {
  try {
    const period = req.nextUrl.searchParams.get("period") || "30";
    const days = Number(period);
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().slice(0, 10);

    const visitors = await prisma.visitorLog.groupBy({
      by: ["date"],
      where: { date: { gte: sinceStr } },
      _count: { id: true },
      orderBy: { date: "asc" },
    });

    const total = await prisma.visitorLog.count({ where: { date: { gte: sinceStr } } });
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = await prisma.visitorLog.count({ where: { date: today } });

    return NextResponse.json({
      success: true,
      data: {
        total,
        today: todayCount,
        daily: visitors.map(v => ({ date: v.date, count: v._count.id })),
      },
    });
  } catch {
    return NextResponse.json({ success: true, data: { total: 0, today: 0, daily: [] } });
  }
}
