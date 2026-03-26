import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET /api/dealer/profile — 내 딜러 프로필 + 통계 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const dealer = await prisma.dealer.findUnique({
      where: { userId: user.id },
      include: {
        _count: {
          select: {
            cars:    true,
            reviews: true,
          },
        },
      },
    });
    if (!dealer) return NextResponse.json({ error: "딜러 없음" }, { status: 404 });

    /* 판매 완료 수 */
    const soldCount = await prisma.car.count({
      where: { dealerId: dealer.id, status: "SOLD" },
    });

    /* 찜 총합 */
    const favCount = await prisma.favorite.count({
      where: { car: { dealerId: dealer.id } },
    });

    /* 문의 답변률 */
    const totalInq   = await prisma.inquiry.count({ where: { car: { dealerId: dealer.id } } });
    const repliedInq = await prisma.inquiry.count({ where: { car: { dealerId: dealer.id }, status: "REPLIED" } });

    return NextResponse.json({
      success: true,
      data: {
        ...dealer,
        soldCount,
        favCount,
        totalInq,
        repliedInq,
        replyRate: totalInq > 0 ? Math.round((repliedInq / totalInq) * 100) : 100,
      },
    });
  } catch (e) {
    console.error("Dealer profile error:", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
