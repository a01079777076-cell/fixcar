import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* POST: 알림 등록 */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });

  try {
    const body = await req.json();
    /* 스키마: userId, brand?, model?, minPrice?, maxPrice?, minYear?, maxYear?, fuel?, active */
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
        active: true,
      },
    });
    return NextResponse.json({ success: true, alert }, { status: 201 });
  } catch (e) {
    console.error("Alert POST:", e);
    return NextResponse.json({ error: "알림 등록 실패" }, { status: 500 });
  }
}

/* GET: 내 알림 목록 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json([]);

  try {
    const alerts = await prisma.wishAlert.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(alerts);
  } catch {
    return NextResponse.json([]);
  }
}
