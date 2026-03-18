import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "인증 필요" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "인증 실패" }, { status: 401 });

    const dealer = await prisma.dealer.findUnique({ where: { userId: payload.id } });
    if (!dealer) return NextResponse.json({ success: false, data: [] });

    const cars = await prisma.car.findMany({
      where: { dealerId: dealer.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { favorites: true, inquiries: true } } },
    });

    const data = cars.map(c => ({
      ...c,
      favorites: c._count.favorites,
      views: 0, // 조회수 추후 구현
    }));

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "조회 실패" }, { status: 500 });
  }
}
