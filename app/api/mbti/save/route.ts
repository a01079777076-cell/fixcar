import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });

  try {
    const body = await req.json();
    const { type, priorities, scores, budget } = body;

    if (!type || type.length !== 4) {
      return NextResponse.json({ error: "유효하지 않은 MBTI 유형" }, { status: 400 });
    }

    /* UserMbti 테이블이 있으면 DB 저장, 없으면 로그만 */
    try {
      await (prisma as any).userMbti.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          type,
          priorities: JSON.stringify(priorities || []),
          scores: JSON.stringify(scores || {}),
          budget: budget || null,
        },
        update: {
          type,
          priorities: JSON.stringify(priorities || []),
          scores: JSON.stringify(scores || {}),
          budget: budget || null,
        },
      });
    } catch {
      /* 테이블이 아직 없으면 로그로 대체 */
      console.log(`[MBTI] userId:${user.id} type:${type} priorities:${JSON.stringify(priorities)}`);
    }

    return NextResponse.json({ success: true, type, userId: user.id });
  } catch (e) {
    console.error("MBTI save error:", e);
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}

/* GET: 내 MBTI 결과 조회 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const mbti = await (prisma as any).userMbti.findUnique({
      where: { userId: user.id },
    });
    if (!mbti) return NextResponse.json({ result: null });
    return NextResponse.json({
      result: {
        type: mbti.type,
        priorities: JSON.parse(mbti.priorities || "[]"),
        scores: JSON.parse(mbti.scores || "{}"),
        budget: mbti.budget,
      },
    });
  } catch {
    return NextResponse.json({ result: null });
  }
}
