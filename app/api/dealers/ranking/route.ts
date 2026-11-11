import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 10;

  try {
    const dealers = await prisma.dealer.findMany({
      where: { verified: true },
      orderBy: { rating: "desc" },
      take: limit,
      select: {
        id: true, shopName: true, rating: true, dealCount: true,
        _count: { select: { cars: true } },
      },
    });

    const result = dealers.map((d, i) => ({
      id: d.id,
      shopName: d.shopName,
      rating: d.rating,
      dealCount: d.dealCount,
      carCount: d._count.cars,
      rank: i + 1,
    }));

    return NextResponse.json(result);
  } catch {
    /* DB에 딜러가 없으면 빈 배열 (더미 데이터는 프론트에서 처리) */
    return NextResponse.json([]);
  }
}
