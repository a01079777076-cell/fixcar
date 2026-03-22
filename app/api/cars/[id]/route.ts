import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const carId = parseInt(id);
  if (!carId) return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });

  try {
    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: {
        dealer: { select: { shopName: true, rating: true, dealCount: true, verified: true, userId: true } },
      },
    });
    if (!car) return NextResponse.json({ error: "차량을 찾을 수 없습니다" }, { status: 404 });
    return NextResponse.json(car);
  } catch (e) {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
