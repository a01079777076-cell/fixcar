// 📁 저장 경로: app/api/wish-alert/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 내 매물 알림 목록 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  try {
    const alerts = await prisma.wishAlert.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: alerts });
  } catch { return NextResponse.json({ success: true, data: [] }); }
}

/* POST: 알림 등록 */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  try {
    const body = await req.json();
    const count = await prisma.wishAlert.count({ where: { userId: user.id } });
    if (count >= 10) return NextResponse.json({ error: "최대 10개까지 등록 가능합니다" }, { status: 400 });

    const alert = await prisma.wishAlert.create({
      data: {
        userId: user.id,
        brand: body.brand || null,
        model: body.model || null,
        minPrice: body.minPrice ? Number(body.minPrice) : null,
        maxPrice: body.maxPrice ? Number(body.maxPrice) : null,
        minYear: body.minYear ? Number(body.minYear) : null,
        maxYear: body.maxYear ? Number(body.maxYear) : null,
        fuel: body.fuel || null,
      },
    });
    return NextResponse.json({ success: true, data: alert });
  } catch (e) {
    console.error("Wish alert create error:", e);
    return NextResponse.json({ error: "등록 실패" }, { status: 500 });
  }
}

/* DELETE: 알림 삭제 */
export async function DELETE(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  try {
    const { id } = await req.json();
    const alert = await prisma.wishAlert.findUnique({ where: { id: Number(id) } });
    if (!alert || alert.userId !== user.id) return NextResponse.json({ error: "권한 없음" }, { status: 403 });
    await prisma.wishAlert.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "삭제 실패" }, { status: 500 }); }
}
