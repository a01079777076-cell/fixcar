// 📁 저장 경로: app/api/dealer/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
    if (!dealer) return NextResponse.json({ error: "딜러 정보 없음" }, { status: 404 });

    const cars = await prisma.car.findMany({
      where: { dealerId: dealer.id },
      select: { id: true, name: true, views: true, status: true },
    });

    const totalViews = cars.reduce((sum, c) => sum + c.views, 0);
    const favorites = await prisma.favorite.count({
      where: { carId: { in: cars.map(c => c.id) } },
    });
    const inquiries = await prisma.inquiry.count({
      where: { carId: { in: cars.map(c => c.id) } },
    });

    const activeCars = cars.filter(c => c.status === "AVAILABLE");
    const avgViews = activeCars.length > 0 ? (totalViews / activeCars.length).toFixed(1) : "0";

    // Top car by views
    const topCar = cars.sort((a, b) => b.views - a.views)[0];

    return NextResponse.json({
      success: true,
      data: {
        totalViews,
        totalFavorites: favorites,
        totalInquiries: inquiries,
        avgViewsPerCar: avgViews,
        topCar: topCar?.name || "",
        carCount: activeCars.length,
      },
    });
  } catch (e) {
    console.error("Analytics error:", e);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
