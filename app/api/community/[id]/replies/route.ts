// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/api/community/[id]/replies/route.ts
// ═══════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 답글 목록 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const replies = await prisma.communityReply.findMany({
      where: { postId: Number(id) },
      include: { user: { select: { id: true, name: true, nickname: true, role: true } } },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(replies);
  } catch (e) {
    console.error("Reply list error:", e);
    return NextResponse.json([]);
  }
}

/* POST: 답글 작성 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  const { id } = await params;

  try {
    const body = await req.json();
    const { content } = body;
    if (!content || content.trim().length === 0) return NextResponse.json({ error: "내용을 입력하세요" }, { status: 400 });
    if (content.length > 1000) return NextResponse.json({ error: "1000자 이내로 작성해주세요" }, { status: 400 });

    const post = await prisma.communityPost.findUnique({ where: { id: Number(id) } });
    if (!post) return NextResponse.json({ error: "게시글이 존재하지 않습니다" }, { status: 404 });

    const reply = await prisma.communityReply.create({
      data: {
        content: content.trim(),
        postId: Number(id),
        userId: user.id,
      },
      include: { user: { select: { id: true, name: true, nickname: true, role: true } } },
    });

    return NextResponse.json({ success: true, reply });
  } catch (e) {
    console.error("Reply create error:", e);
    return NextResponse.json({ error: "답글 작성 실패" }, { status: 500 });
  }
}

/* DELETE: 답글 삭제 */
export async function DELETE(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const { replyId } = await req.json();
    const reply = await prisma.communityReply.findUnique({ where: { id: Number(replyId) } });
    if (!reply) return NextResponse.json({ error: "답글 없음" }, { status: 404 });
    if (reply.userId !== user.id && user.role !== "ADMIN") return NextResponse.json({ error: "본인 답글만 삭제 가능" }, { status: 403 });

    await prisma.communityReply.delete({ where: { id: Number(replyId) } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Reply delete error:", e);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
