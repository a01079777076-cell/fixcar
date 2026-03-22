import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 전체 매물 조회 (ADMIN 전용) */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "관리자 권한 필요" }, { status: 403 });

  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: "desc" },
      include: { dealer: { select: { shopName: true } } },
    });
    return NextResponse.json(cars);
  } catch {
    return NextResponse.json([]);
  }
}

/* PATCH: 매물 상태 변경 (승인/반려) */
export async function PATCH(req: NextRequest) {
  const user = verifyToken(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "관리자 권한 필요" }, { status: 403 });

  try {
    const { carId, status } = await req.json();
    if (!carId || !status) return NextResponse.json({ error: "carId, status 필요" }, { status: 400 });

    const car = await prisma.car.update({
      where: { id: Number(carId) },
      data: { status },
    });
    return NextResponse.json({ success: true, car });
  } catch (e) {
    return NextResponse.json({ error: "업데이트 실패", detail: String(e) }, { status: 500 });
  }
}
