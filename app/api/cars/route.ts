import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* GET: 홈페이지 추천 매물 (최신순 + AVAILABLE만) */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 6;
  const brands = searchParams.get("brands"); /* 쉼표 구분 브랜드 필터 */

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { status: "AVAILABLE" };
    if (brands) {
      where.brand = { in: brands.split(",").map(b => b.trim()) };
    }

    const cars = await prisma.car.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        dealer: { select: { shopName: true, rating: true } },
      },
    });

    return NextResponse.json({ success: true, data: cars, total: cars.length });
  } catch (e) {
    console.error("Cars API error:", e);
    return NextResponse.json({ success: true, data: [], total: 0 });
  }
}
