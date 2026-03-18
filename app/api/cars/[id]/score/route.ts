// app/api/cars/[id]/score/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET: 특정 차량 점수 조회
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const carId = parseInt(id);
    const token = req.cookies.get("fixcar-token")?.value;
    const payload = token ? await verifyToken(token) : null;

    const scores = await prisma.carScore.findMany({
      where: { carId },
      select: { category: true, score: true, userId: true },
    });

    // 카테고리별 평균
    const categories = ["외관", "실내", "주행성능", "연비", "편의사양", "가성비"];
    const avgScores = categories.map(cat => {
      const catScores = scores.filter(s => s.category === cat);
      const avg = catScores.length > 0
        ? Math.round((catScores.reduce((sum, s) => sum + s.score, 0) / catScores.length) * 10) / 10
        : 0;
      return { category: cat, avg, count: catScores.length };
    });

    // 내 점수
    const myScores = payload
      ? scores.filter(s => s.userId === payload.id).reduce((acc, s) => ({ ...acc, [s.category]: s.score }), {} as Record<string, number>)
      : {};

    const totalAvg = avgScores.filter(s => s.avg > 0).length > 0
      ? Math.round(avgScores.filter(s => s.avg > 0).reduce((sum, s) => sum + s.avg, 0) / avgScores.filter(s => s.avg > 0).length * 10) / 10
      : 0;

    return NextResponse.json({ success: true, data: { avgScores, myScores, totalAvg, totalReviews: new Set(scores.map(s => s.userId)).size } });
  } catch {
    return NextResponse.json({ success: false, error: "조회 실패" }, { status: 500 });
  }
}

// POST: 점수 등록/수정
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "로그인 후 평가할 수 있어요" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "인증 실패" }, { status: 401 });

    const { id } = await params;
    const carId = parseInt(id);
    const { scores } = await req.json();
    // scores = { "외관": 4, "실내": 5, ... }

    await Promise.all(
      Object.entries(scores).map(([category, score]) =>
        prisma.carScore.upsert({
          where: { carId_userId_category: { carId, userId: payload.id, category } },
          update: { score: score as number },
          create: { carId, userId: payload.id, category, score: score as number },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "저장 실패" }, { status: 500 });
  }
}
