import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const car = await prisma.car.findUnique({ where: { id: parseInt(id) }, include: { dealer: true } });
    if (!car) return NextResponse.json({ error: "매물 없음" }, { status: 404 });
    if (car.dealer.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "권한 없음" }, { status: 403 });
    }

    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.mileage !== undefined) updateData.mileage = Number(body.mileage);
    if (body.description !== undefined) updateData.description = String(body.description);
    if (body.images !== undefined) updateData.images = body.images;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.options !== undefined) updateData.options = body.options;
    if (body.tags !== undefined) updateData.tags = body.tags;

    const updated = await prisma.car.update({ where: { id: parseInt(id) }, data: updateData });
    return NextResponse.json({ success: true, car: updated });
  } catch (e) {
    return NextResponse.json({ error: "수정 실패", detail: String(e) }, { status: 500 });
  }
}
