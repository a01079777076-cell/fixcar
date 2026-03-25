import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* GET: 전체 딜러 상사 목록 */
export async function GET() {
  try {
    const dealers = await prisma.dealer.findMany({
      include: { _count: { select: { cars: true } } },
      orderBy: { rating: "desc" },
    });

    const result = dealers.map(d => ({
      id: d.id,
      shopName: d.shopName,
      shopAddr: d.shopAddr || "",
      complexName: d.complexName || "",
      shopPhone: d.shopPhone || "",
      rating: d.rating,
      dealCount: d.dealCount,
      verified: d.verified,
      carCount: d._count.cars,
    }));

    return NextResponse.json(result);
  } catch (e) {
    console.error("Shops GET error:", e);
    return NextResponse.json([]);
  }
}
