// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/api/admin/cars/[id]/route.ts
// ═══════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/* GET: 매물 상세 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = requireAdmin(req);
  if (result instanceof NextResponse) return result;
  const { id } = await params;

  try {
    const car = await prisma.car.findUnique({
      where: { id: Number(id) },
      include: { dealer: { select: { shopName: true, user: { select: { name: true } } } } },
    });
    if (!car) return NextResponse.json({ error: "매물 없음" }, { status: 404 });
    return NextResponse.json(car);
  } catch {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

/* PATCH: 매물 수정 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const result = requireAdmin(req);
  if (result instanceof NextResponse) return result;
  const { id } = await params;

  try {
    const body = await req.json();
    const allowed = [
      "brand", "name", "year", "mileage", "fuel", "transmission", "color",
      "cc", "owners", "accident", "price", "region", "status", "tags",
      "options", "images", "description", "inspected", "isPick",
    ];
    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) data[key] = body[key];
    }
    if (Object.keys(data).length === 0) return NextResponse.json({ error: "수정할 항목 없음" }, { status: 400 });

    const car = await prisma.car.update({ where: { id: Number(id) }, data });
    return NextResponse.json({ success: true, car });
  } catch (e) {
    console.error("Admin car update error:", e);
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}
