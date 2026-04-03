// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/api/dealer/cars/[id]/route.ts
// ═══════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* DELETE: 딜러 본인 매물 삭제 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  const { id } = await params;

  try {
    const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
    const car = await prisma.car.findUnique({ where: { id: Number(id) } });
    if (!car) return NextResponse.json({ error: "매물 없음" }, { status: 404 });

    /* 본인 매물이거나 ADMIN만 삭제 가능 */
    if (user.role !== "ADMIN" && (!dealer || car.dealerId !== dealer.id)) {
      return NextResponse.json({ error: "본인 매물만 삭제할 수 있습니다" }, { status: 403 });
    }

    await prisma.car.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Car delete error:", e);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
