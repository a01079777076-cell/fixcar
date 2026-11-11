import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/* GET: 딜러 리뷰 목록 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dealerId = Number(searchParams.get("dealerId"));
    if (!dealerId) return NextResponse.json({ success: false, error: "dealerId 필요" }, { status: 400 });

    const reviews = await prisma.dealerReview.findMany({
      where: { dealerId },
      include: { user: { select: { nickname: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: reviews });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

/* POST: 리뷰 작성 */
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: "로그인 필요" }, { status: 401 });

    const { dealerId, rating, content } = await req.json();
    const dId = Number(dealerId);
    const r = Number(rating);
    if (!dId || !r) return NextResponse.json({ success: false, error: "필수 항목 누락" }, { status: 400 });
    if (!Number.isInteger(r) || r < 1 || r > 5) return NextResponse.json({ success: false, error: "평점은 1~5점" }, { status: 400 });

    /* 본인 상사에는 리뷰 금지 */
    const dealer = await prisma.dealer.findUnique({ where: { id: dId }, select: { userId: true } });
    if (!dealer) return NextResponse.json({ success: false, error: "딜러를 찾을 수 없습니다" }, { status: 404 });
    if (dealer.userId === user.id) return NextResponse.json({ success: false, error: "본인 상사에는 리뷰를 작성할 수 없습니다" }, { status: 403 });

    const existing = await prisma.dealerReview.findUnique({ where: { dealerId_userId: { dealerId: dId, userId: user.id } } });
    if (existing) return NextResponse.json({ success: false, error: "이미 리뷰를 작성했습니다" }, { status: 409 });

    const review = await prisma.dealerReview.create({
      data: { dealerId: dId, userId: user.id, rating: r, content: String(content || "").slice(0, 2000) },
    });

    /* 딜러 평균 평점 업데이트 */
    const agg = await prisma.dealerReview.aggregate({ where: { dealerId: dId }, _avg: { rating: true } });
    if (agg._avg.rating != null) {
      await prisma.dealer.update({ where: { id: dId }, data: { rating: Math.round(agg._avg.rating * 10) / 10 } });
    }

    return NextResponse.json({ success: true, data: review });
  } catch (e) {
    console.error("Review error:", e);
    return NextResponse.json({ success: false, error: "리뷰 등록 실패" }, { status: 500 });
  }
}
