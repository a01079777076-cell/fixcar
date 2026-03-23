import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 블로그 개별 글 조회 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
      include: { author: { select: { name: true } } },
    });
    if (!post) return NextResponse.json({ error: "글을 찾을 수 없습니다" }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

/* PATCH: 블로그 수정 (ADMIN 전용) */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = verifyToken(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "권한 없음" }, { status: 403 });

  try {
    const body = await req.json();
    const post = await prisma.blogPost.update({
      where: { id: parseInt(id) },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.category && { category: body.category }),
        ...(body.summary !== undefined && { summary: body.summary }),
      },
    });
    return NextResponse.json({ success: true, post });
  } catch {
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

/* DELETE: 블로그 삭제 (ADMIN 전용) */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = verifyToken(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "권한 없음" }, { status: 403 });

  try {
    await prisma.blogPost.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
