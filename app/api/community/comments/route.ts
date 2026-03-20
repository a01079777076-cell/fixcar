import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* POST: 댓글 작성 */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });

  try {
    const body = await req.json();
    const postId = Number(body.postId);
    if (!postId || !body.content) {
      return NextResponse.json({ error: "내용을 입력해주세요" }, { status: 400 });
    }

    /* 스키마: content(@db.Text), postId(Int), authorId(Int) */
    const comment = await prisma.communityComment.create({
      data: {
        content: String(body.content).slice(0, 2000),
        postId,
        authorId: user.id,
      },
    });
    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (e) {
    console.error("Comment POST:", e);
    return NextResponse.json({ error: "댓글 작성 실패" }, { status: 500 });
  }
}

/* GET: 특정 글의 댓글 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = Number(searchParams.get("postId"));
  if (!postId) return NextResponse.json([]);

  try {
    const comments = await prisma.communityComment.findMany({
      where: { postId },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json([]);
  }
}
