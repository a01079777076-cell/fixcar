import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "인증 필요" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== "DEALER") return NextResponse.json({ success: false, error: "딜러만 접근 가능" }, { status: 403 });

    const dealer = await prisma.dealer.findUnique({ where: { userId: payload.id } });
    if (!dealer) return NextResponse.json({ success: false, error: "딜러 정보 없음" }, { status: 404 });

    const [cars, inquiries, favorites] = await Promise.all([
      prisma.car.count({ where: { dealerId: dealer.id, status: { not: "SOLD" } } }),
      prisma.inquiry.count({ where: { car: { dealerId: dealer.id }, status: "PENDING" } }),
      prisma.favorite.count({ where: { car: { dealerId: dealer.id } } }),
    ]);

    return NextResponse.json({ success: true, data: { cars, inquiries, favorites, views: 0 } });
  } catch {
    return NextResponse.json({ success: false, error: "조회 실패" }, { status: 500 });
  }
}
