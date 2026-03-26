import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* GET /api/cars/[id] — 단건 조회 + 조회수 +1 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });

  try {
    /* 조회수 +1 (원자적 업데이트) */
    const car = await prisma.car.update({
      where: { id },
      data:  { views: { increment: 1 } },
      include: {
        dealer: {
          select: {
            id: true,
            shopName: true,
            shopPhone: true,
            shopAddr: true,
            complexName: true,
            rating: true,
            dealCount: true,
            verified: true,
          },
        },
        _count: { select: { favorites: true } },
      },
    });

    return NextResponse.json({ success: true, data: car });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "매물 없음" }, { status: 404 });
    }
    console.error("Car detail error:", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
