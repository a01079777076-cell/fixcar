import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dealerId = parseInt(id);
  if (!dealerId) return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });

  try {
    const dealer = await prisma.dealer.findUnique({
      where: { id: dealerId },
      select: { id: true, shopName: true, rating: true, dealCount: true, verified: true },
    });
    if (!dealer) return NextResponse.json({ error: "딜러를 찾을 수 없습니다" }, { status: 404 });

    const cars = await prisma.car.findMany({
      where: { dealerId, status: "AVAILABLE" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ dealer, cars });
  } catch {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
