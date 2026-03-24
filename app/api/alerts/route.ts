import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json([]);
  try {
    const alerts = await prisma.wishAlert.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: alerts });
  } catch { return NextResponse.json({ success: true, data: [] }); }
}

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  try {
    const { alerts } = await req.json();
    /* 기존 전부 삭제 후 재생성 */
    await prisma.wishAlert.deleteMany({ where: { userId: user.id } });
    for (const a of (alerts || [])) {
      await prisma.wishAlert.create({
        data: {
          userId: user.id,
          brand: a.brand === "전체" ? null : a.brand,
          minPrice: a.minPrice ? Number(a.minPrice) : null,
          maxPrice: a.maxPrice ? Number(a.maxPrice) : null,
          minYear: a.minYear ? Number(a.minYear) : null,
          fuel: a.fuel === "전체" ? null : a.fuel,
          active: a.active !== false,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "저장 실패" }, { status: 500 }); }
}
