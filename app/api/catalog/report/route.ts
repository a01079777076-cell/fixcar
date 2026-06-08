import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, requireAdmin } from "@/lib/auth";

/* GET: 카탈로그 정보수정 요청 목록 (관리자) */
export async function GET(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard instanceof NextResponse) return guard;
  try {
    const reports = await prisma.catalogReport.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    /* 사용자별 누적 스팸 건수 집계 */
    const spamGroups = await prisma.catalogReport.groupBy({
      by: ["userId"],
      where: { status: "SPAM" },
      _count: { _all: true },
    });
    const spamMap = new Map(spamGroups.map(g => [g.userId, g._count._all]));

    const data = reports.map(r => ({
      ...r,
      user: { ...r.user, spamCount: spamMap.get(r.userId) || 0 },
    }));
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error("CatalogReport GET:", e);
    return NextResponse.json({ success: false, error: "목록 조회 실패" }, { status: 500 });
  }
}

/* POST: 카탈로그 정보 오류 신고 (로그인 사용자) */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ success: false, error: "로그인이 필요합니다" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.carModel || !body.wrongInfo || !body.correctInfo) {
      return NextResponse.json({ success: false, error: "모든 항목을 입력해주세요" }, { status: 400 });
    }
    const report = await prisma.catalogReport.create({
      data: {
        userId: user.id,
        carModel: String(body.carModel),
        wrongInfo: String(body.wrongInfo),
        correctInfo: String(body.correctInfo),
        status: "PENDING",
      },
    });
    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (e) {
    console.error("CatalogReport POST:", e);
    return NextResponse.json({ success: false, error: "신고 실패" }, { status: 500 });
  }
}

/* PATCH: 요청 상태 변경 (관리자) — 반영(APPROVED)/스팸(SPAM)/답변완료(ANSWERED) */
export async function PATCH(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard instanceof NextResponse) return guard;
  try {
    const { id, status } = await req.json();
    const allowed = ["PENDING", "APPROVED", "SPAM", "ANSWERED"];
    if (!id || !allowed.includes(status)) {
      return NextResponse.json({ success: false, error: "잘못된 요청" }, { status: 400 });
    }
    const report = await prisma.catalogReport.update({
      where: { id: Number(id) },
      data: { status },
    });
    return NextResponse.json({ success: true, data: report });
  } catch (e) {
    console.error("CatalogReport PATCH:", e);
    return NextResponse.json({ success: false, error: "상태 변경 실패" }, { status: 500 });
  }
}
