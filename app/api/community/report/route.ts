import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/* POST: 게시글 신고 */
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, error: "로그인 필요" }, { status: 401 });

    const { postId, category, reason } = await req.json();
    if (!postId || !category) return NextResponse.json({ success: false, error: "필수 항목 누락" }, { status: 400 });

    const validCategories = ["허위정보", "광고/홍보", "욕설/비방", "사기/스캠", "음란물", "저작권침해", "기타"];
    if (!validCategories.includes(category)) return NextResponse.json({ success: false, error: "유효하지 않은 신고 카테고리" }, { status: 400 });

    /* 중복 신고 체크 */
    const existing = await prisma.communityReport.findUnique({
      where: { postId_userId: { postId: Number(postId), userId: user.id } },
    });
    if (existing) return NextResponse.json({ success: false, error: "이미 신고한 게시글입니다" }, { status: 409 });

    const report = await prisma.communityReport.create({
      data: { postId: Number(postId), userId: user.id, category, reason: reason ? String(reason).slice(0, 1000) : null },
    });

    return NextResponse.json({ success: true, data: report });
  } catch (e) {
    console.error("Report error:", e);
    return NextResponse.json({ success: false, error: "신고 처리 실패" }, { status: 500 });
  }
}
