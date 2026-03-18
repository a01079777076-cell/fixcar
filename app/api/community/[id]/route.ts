import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const post = await prisma.communityPost.findUnique({
      where: { id },
      include: { author: { select: { id:true, name:true } }, _count: { select: { comments: true } } },
    });
    if (!post) return NextResponse.json({ success: false, error: "게시글을 찾을 수 없어요" }, { status: 404 });

    // 조회수 증가
    await prisma.communityPost.update({ where: { id }, data: { views: { increment: 1 } } });

    return NextResponse.json({ success: true, data: post });
  } catch {
    return NextResponse.json({ success: false, error: "조회 실패" }, { status: 500 });
  }
}
