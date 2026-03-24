import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json([], { status: 403 });
  try {
    const cars = await prisma.car.findMany({
      include: { dealer: { select: { shopName: true, userId: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(cars);
  } catch { return NextResponse.json([]); }
}

export async function PATCH(req: NextRequest) {
  const user = verifyToken(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  try {
    const { carId, status } = await req.json();
    if (!["AVAILABLE", "REVIEWING", "SOLD", "RESERVED"].includes(status)) return NextResponse.json({ error: "잘못된 상태" }, { status: 400 });
    await prisma.car.update({ where: { id: Number(carId) }, data: { status } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "실패" }, { status: 500 }); }
}
