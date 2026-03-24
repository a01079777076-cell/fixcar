import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const post = await prisma.communityPost.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } },
      include: { author: { select: { name: true, nickname: true } } },
    });
    const comments = await prisma.communityComment.findMany({
      where: { postId: parseInt(id) },
      include: { author: { select: { name: true, nickname: true } } },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ post, comments });
  } catch { return NextResponse.json({ error: "조회 실패" }, { status: 500 }); }
}

/* PATCH: 글 수정 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  try {
    const post = await prisma.communityPost.findUnique({ where: { id: parseInt(id) } });
    if (!post) return NextResponse.json({ error: "글 없음" }, { status: 404 });
    if (post.authorId !== user.id && user.role !== "ADMIN") return NextResponse.json({ error: "권한 없음" }, { status: 403 });
    const { title, content, category } = await req.json();
    const updated = await prisma.communityPost.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title: String(title) }),
        ...(content !== undefined && { content: String(content) }),
        ...(category && { category }),
      },
    });
    return NextResponse.json({ success: true, post: updated });
  } catch { return NextResponse.json({ error: "수정 실패" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  try {
    const post = await prisma.communityPost.findUnique({ where: { id: parseInt(id) } });
    if (!post) return NextResponse.json({ error: "글 없음" }, { status: 404 });
    if (post.authorId !== user.id && user.role !== "ADMIN") return NextResponse.json({ error: "권한 없음" }, { status: 403 });
    await prisma.communityComment.deleteMany({ where: { postId: parseInt(id) } });
    await prisma.communityPost.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "삭제 실패" }, { status: 500 }); }
}
