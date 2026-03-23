import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 커뮤니티 글 목록 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 200;

  try {
    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        author: { select: { name: true, nickname: true } },
        _count: { select: { comments: true } },
      },
    });
    return NextResponse.json({ success: true, data: posts });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

/* POST: 커뮤니티 글 작성 */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const { title, content, category } = await req.json();
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "제목과 내용을 입력해주세요" }, { status: 400 });
    }

    const post = await prisma.communityPost.create({
      data: {
        title: String(title).slice(0, 200),
        content: String(content).slice(0, 5000),
        category: category || "자유게시판",
        authorId: user.id,
      },
    });
    return NextResponse.json({ success: true, post });
  } catch (e) {
    return NextResponse.json({ error: "작성 실패" }, { status: 500 });
  }
}
