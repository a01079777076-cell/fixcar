import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiGuard } from "@/lib/api-guard";
import { MBTI_TYPES, sanitizeConditions, calcAffordable } from "@/data/car_mbti_data";

/* POST: 내 차량 MBTI 결과 저장
 * - scores 컬럼: { axes, conditions } JSON (조건까지 함께 보관)
 * - budget 컬럼: 구매 가능 차량가(만원) 문자열
 */
export async function POST(req: NextRequest) {
  const guard = apiGuard(req, { auth: "user", rateLimit: 20 });
  if (guard instanceof NextResponse) return guard;
  const user = guard.user!;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "잘못된 요청입니다" }, { status: 400 });
  }

  const type = typeof body.type === "string" ? body.type : "";
  if (!MBTI_TYPES[type]) {
    return NextResponse.json({ success: false, error: "유효하지 않은 MBTI 유형" }, { status: 400 });
  }
  const conditions = sanitizeConditions(body.conditions);
  const axes = body.axes && typeof body.axes === "object" ? body.axes : {};
  const priorities = Array.isArray(body.priorities) ? body.priorities.filter((p) => typeof p === "string").slice(0, 10) : [];
  const data = {
    type,
    priorities: JSON.stringify(priorities),
    scores: JSON.stringify({ axes, conditions }),
    budget: String(calcAffordable(conditions)),
  };

  try {
    await prisma.userMbti.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...data },
      update: data,
    });
    return NextResponse.json({ success: true, data: { type } });
  } catch (e) {
    console.error("[mbti/save] error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ success: false, error: "저장에 실패했습니다. 잠시 후 다시 시도해주세요" }, { status: 500 });
  }
}

/* GET: 내 MBTI 결과 조회 */
export async function GET(req: NextRequest) {
  const guard = apiGuard(req, { auth: "user" });
  if (guard instanceof NextResponse) return guard;
  const user = guard.user!;

  try {
    const mbti = await prisma.userMbti.findUnique({ where: { userId: user.id } });
    if (!mbti) return NextResponse.json({ success: true, data: null });
    let parsed: { axes?: unknown; conditions?: unknown } = {};
    try { parsed = JSON.parse(mbti.scores || "{}"); } catch { parsed = {}; }
    let priorities: unknown = [];
    try { priorities = JSON.parse(mbti.priorities || "[]"); } catch { priorities = []; }
    return NextResponse.json({
      success: true,
      data: {
        type: mbti.type,
        priorities,
        axes: parsed.axes ?? parsed,
        conditions: parsed.conditions ?? null,
        budget: mbti.budget,
        updatedAt: mbti.updatedAt,
      },
    });
  } catch (e) {
    console.error("[mbti/save] GET error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ success: false, error: "조회에 실패했습니다" }, { status: 500 });
  }
}
