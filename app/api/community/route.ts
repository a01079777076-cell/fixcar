import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 커뮤니티 글 목록 */
export async function GET() {
  try {
    const posts = await prisma.communityPost.findMany({
      include: { author: { select: { name: true } }, _count: { select: { comments: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(posts);
  } catch (e) {
    console.error("Community GET:", e);
    return NextResponse.json([]);
  }
}

/* POST: 커뮤니티 글 작성 */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "제목과 내용을 입력해주세요" }, { status: 400 });
    }

    /* 스키마: authorId(Int), title, content(@db.Text), category, views */
    const post = await prisma.communityPost.create({
      data: {
        title: String(body.title).slice(0, 100),
        content: String(body.content).slice(0, 5000),
        category: body.category || "자유게시판",
        authorId: user.id,
      },
    });
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (e) {
    console.error("Community POST:", e);
    return NextResponse.json({ error: "글 작성 실패", detail: String(e) }, { status: 500 });
  }
}
