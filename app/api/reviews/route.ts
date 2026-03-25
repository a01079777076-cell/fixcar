import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fixcar-secret-key-2024");

async function getUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("fixcar-token")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { id: number; role: string };
  } catch { return null; }
}

/* GET: 딜러 리뷰 목록 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dealerId = searchParams.get("dealerId");
    if (!dealerId) return NextResponse.json({ success: false, error: "dealerId 필요" }, { status: 400 });

    const reviews = await (prisma as any).dealerReview?.findMany?.({
      where: { dealerId: Number(dealerId) },
      include: { user: { select: { nickname: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }) || [];

    return NextResponse.json({ success: true, data: reviews });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

/* POST: 리뷰 작성 */
export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ success: false, error: "로그인 필요" }, { status: 401 });

    const { dealerId, rating, content } = await req.json();
    if (!dealerId || !rating) return NextResponse.json({ success: false, error: "필수 항목 누락" }, { status: 400 });
    if (rating < 1 || rating > 5) return NextResponse.json({ success: false, error: "평점은 1~5점" }, { status: 400 });

    const review = await (prisma as any).dealerReview?.create?.({
      data: { dealerId: Number(dealerId), userId: user.id, rating: Number(rating), content: content || "" },
    });

    /* 딜러 평균 평점 업데이트 */
    const allReviews = await (prisma as any).dealerReview?.findMany?.({ where: { dealerId: Number(dealerId) } }) || [];
    if (allReviews.length > 0) {
      const avg = allReviews.reduce((s: number, r: any) => s + r.rating, 0) / allReviews.length;
      await prisma.dealer.update({ where: { id: Number(dealerId) }, data: { rating: Math.round(avg * 10) / 10 } });
    }

    return NextResponse.json({ success: true, data: review });
  } catch (e) {
    console.error("Review error:", e);
    return NextResponse.json({ success: false, error: "리뷰 등록 실패" }, { status: 500 });
  }
}
