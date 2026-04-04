// 📁 저장 경로: app/api/community/[id]/report/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  const { id } = await params;

  try {
    const { category, reason } = await req.json();
    if (!category) return NextResponse.json({ error: "신고 유형 필수" }, { status: 400 });

    const post = await prisma.communityPost.findUnique({ where: { id: Number(id) } });
    if (!post) return NextResponse.json({ error: "게시글 없음" }, { status: 404 });

    // 중복 신고 체크
    const existing = await prisma.communityReport.findUnique({
      where: { postId_userId: { postId: Number(id), userId: user.id } },
    });
    if (existing) return NextResponse.json({ error: "이미 신고한 게시글입니다" }, { status: 409 });

    await prisma.communityReport.create({
      data: {
        postId: Number(id),
        userId: user.id,
        category,
        reason: reason || null,
      },
    });

    // 신고 5건 이상이면 자동 숨김
    const reportCount = await prisma.communityReport.count({ where: { postId: Number(id) } });
    if (reportCount >= 5) {
      await prisma.communityPost.update({
        where: { id: Number(id) },
        data: { status: "HIDDEN", flagReason: `자동숨김: 신고 ${reportCount}건` },
      });
    }

    return NextResponse.json({ success: true, reportCount });
  } catch (e) {
    console.error("Report error:", e);
    return NextResponse.json({ error: "신고 실패" }, { status: 500 });
  }
}
