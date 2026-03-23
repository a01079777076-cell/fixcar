import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* POST: 댓글 작성 */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const { postId, content } = await req.json();
    if (!postId || !content?.trim()) return NextResponse.json({ error: "내용을 입력해주세요" }, { status: 400 });

    const comment = await prisma.communityComment.create({
      data: { postId: Number(postId), content: String(content).slice(0, 2000), authorId: user.id },
      include: { author: { select: { name: true, nickname: true } } },
    });
    return NextResponse.json({ success: true, comment });
  } catch {
    return NextResponse.json({ error: "작성 실패" }, { status: 500 });
  }
}

/* DELETE: 댓글 삭제 */
export async function DELETE(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const commentId = Number(searchParams.get("id"));
    if (!commentId) return NextResponse.json({ error: "댓글 ID 필요" }, { status: 400 });

    const comment = await prisma.communityComment.findUnique({ where: { id: commentId } });
    if (!comment) return NextResponse.json({ error: "댓글 없음" }, { status: 404 });
    if (comment.authorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "권한 없음" }, { status: 403 });
    }

    await prisma.communityComment.delete({ where: { id: commentId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
