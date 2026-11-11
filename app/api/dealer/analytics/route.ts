// 📁 저장 경로: app/api/dealer/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ success: false, error: "로그인 필요" }, { status: 401 });

  try {
    const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
    if (!dealer) return NextResponse.json({ success: false, error: "딜러 정보 없음" }, { status: 404 });

    const cars = await prisma.car.findMany({
      where: { dealerId: dealer.id },
      select: { id: true, name: true, views: true, status: true, _count: { select: { favorites: true, inquiries: true } } },
    });

    const totalViews = cars.reduce((sum, c) => sum + c.views, 0);
    const totalFavorites = cars.reduce((sum, c) => sum + c._count.favorites, 0);
    const totalInquiries = cars.reduce((sum, c) => sum + c._count.inquiries, 0);
    const activeCars = cars.filter(c => c.status === "AVAILABLE");
    const avgViews = cars.length > 0 ? (totalViews / cars.length).toFixed(1) : "0";

    const topCars = [...cars]
      .sort((a, b) => b.views - a.views)
      .slice(0, 3)
      .map(c => ({ id: c.id, name: c.name, views: c.views, favorites: c._count.favorites, inquiries: c._count.inquiries }));

    return NextResponse.json({
      success: true,
      data: {
        totalViews,
        totalFavorites,
        totalInquiries,
        avgViewsPerCar: avgViews,
        topCar: topCars[0]?.name || "",
        topCars,
        carCount: activeCars.length,
        totalCars: cars.length,
      },
    });
  } catch (e) {
    console.error("Analytics error:", e);
    return NextResponse.json({ success: false, error: "조회 실패" }, { status: 500 });
  }
}
