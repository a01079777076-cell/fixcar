import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 블로그 글 목록 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 20;
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { author: { select: { name: true } } },
    });
    return NextResponse.json(posts);
  } catch (e) {
    console.error("Blog GET:", e);
    return NextResponse.json([]);
  }
}

/* POST: 블로그 글 작성 */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  /* ADMIN만 글쓰기 가능 */
  if (user.role !== "ADMIN") return NextResponse.json({ error: "관리자만 글을 작성할 수 있습니다" }, { status: 403 });

  try {
    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "제목과 내용을 입력해주세요" }, { status: 400 });
    }

    /* 스키마: authorId(Int), title, summary, category, content(@db.Text), products(Json), tags(Json), published */
    const post = await prisma.blogPost.create({
      data: {
        title: String(body.title).slice(0, 200),
        content: String(body.content).slice(0, 50000),
        summary: body.thumbnail || body.summary || "",  /* thumbnail URL을 summary에 저장 */
        category: body.category || "구매 가이드",
        authorId: user.id,
        published: true,
        products: body.products || [],
        tags: body.tags || [],
      },
    });
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (e) {
    console.error("Blog POST:", e);
    return NextResponse.json({ error: "글 작성 실패", detail: String(e) }, { status: 500 });
  }
}
