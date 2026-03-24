import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const car = await prisma.car.findUnique({
      where: { id: parseInt(id) },
      include: { dealer: { select: { id: true, shopName: true, rating: true, verified: true } } },
    });
    if (!car) return NextResponse.json({ error: "매물을 찾을 수 없습니다" }, { status: 404 });
    return NextResponse.json(car);
  } catch { return NextResponse.json({ error: "조회 실패" }, { status: 500 }); }
}
