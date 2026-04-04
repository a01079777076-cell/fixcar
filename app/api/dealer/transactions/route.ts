// 📁 저장 경로: app/api/dealer/transactions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
    if (!dealer) return NextResponse.json({ error: "딜러 정보 없음" }, { status: 404 });

    const carIds = (await prisma.car.findMany({
      where: { dealerId: dealer.id },
      select: { id: true },
    })).map(c => c.id);

    const purchases = await prisma.purchase.findMany({
      where: { carId: { in: carIds } },
      include: {
        car: { select: { name: true, brand: true, price: true } },
        user: { select: { name: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: purchases });
  } catch (e) {
    console.error("Transactions error:", e);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
