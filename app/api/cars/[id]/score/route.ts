import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });

  try {
    const body = await req.json();
    const carId = Number(body.carId);
    if (!carId || !body.category || !body.score) {
      return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
    }

    /* 스키마: carId, userId, category, score, @@unique([carId, userId, category]) */
    const score = await prisma.carScore.upsert({
      where: { carId_userId_category: { carId, userId: user.id, category: String(body.category) } },
      create: { carId, userId: user.id, category: String(body.category), score: Number(body.score) },
      update: { score: Number(body.score) },
    });
    return NextResponse.json({ success: true, score });
  } catch (e) {
    console.error("CarScore POST:", e);
    return NextResponse.json({ error: "점수 저장 실패" }, { status: 500 });
  }
}
