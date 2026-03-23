import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    /* 조회수 증가 */
    const post = await prisma.communityPost.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } },
      include: { author: { select: { name: true } } },
    });

    const comments = await prisma.communityComment.findMany({
      where: { postId: parseInt(id) },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ post, comments });
  } catch {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
