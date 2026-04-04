// 📁 저장 경로: app/api/community/[id]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  const { id } = await params;

  try {
    const post = await prisma.communityPost.findUnique({ where: { id: Number(id) } });
    if (!post) return NextResponse.json({ error: "게시글 없음" }, { status: 404 });

    // likes 필드를 +1 (단순 증가 방식)
    // TODO: 나중에 별도 CommunityLike 모델로 중복 방지
    const updated = await prisma.communityPost.update({
      where: { id: Number(id) },
      data: { likes: { increment: 1 } },
    });

    return NextResponse.json({ success: true, likes: updated.likes });
  } catch (e) {
    console.error("Like error:", e);
    return NextResponse.json({ error: "좋아요 실패" }, { status: 500 });
  }
}
