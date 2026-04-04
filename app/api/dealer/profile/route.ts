// 📁 저장 경로: app/api/dealer/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 현재 딜러 프로필 조회 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const dealer = await prisma.dealer.findUnique({
      where: { userId: user.id },
      include: { user: { select: { name: true, email: true, phone: true } } },
    });
    if (!dealer) return NextResponse.json({ error: "딜러 정보 없음" }, { status: 404 });
    return NextResponse.json({ success: true, data: dealer });
  } catch (e) {
    console.error("Dealer profile GET error:", e);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

/* PUT: 딜러 프로필 수정 */
export async function PUT(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const body = await req.json();
    const { shopName, shopPhone, phoneLand, address, intro, brands, profilePhoto } = body;

    const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
    if (!dealer) return NextResponse.json({ error: "딜러 정보 없음" }, { status: 404 });

    const updated = await prisma.dealer.update({
      where: { id: dealer.id },
      data: {
        ...(shopName !== undefined && { shopName }),
        ...(shopPhone !== undefined && { shopPhone }),
        ...(address !== undefined && { shopAddr: address }),
        ...(intro !== undefined && { shopDesc: intro }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    console.error("Dealer profile PUT error:", e);
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}
