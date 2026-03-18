// app/api/admin/visitors/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "권한 없음" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN") return NextResponse.json({ success: false, error: "관리자만 접근 가능" }, { status: 403 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayVisits, totalVisits, weeklyData] = await Promise.all([
      prisma.visitorLog.count({ where: { createdAt: { gte: today } } }),
      prisma.visitorLog.count(),
      prisma.visitorLog.groupBy({
        by: ["date"],
        _count: { id: true },
        orderBy: { date: "asc" },
        take: 7,
      }),
    ]);

    // 오늘 unique IP 수
    const todayUnique = await prisma.visitorLog.groupBy({
      by: ["ip"],
      where: { createdAt: { gte: today } },
      _count: { id: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        todayTotal: todayVisits,
        todayUnique: todayUnique.length,
        totalVisits,
        weeklyData: weeklyData.map(d => ({ date: d.date, count: d._count.id })),
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "조회 실패" }, { status: 500 });
  }
}

// POST: 방문자 기록 (미들웨어에서 호출)
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const ua = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "";
    const today = new Date().toISOString().slice(0, 10);

    await prisma.visitorLog.create({
      data: { ip, userAgent: ua, referer, date: today },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
