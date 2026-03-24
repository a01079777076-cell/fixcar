import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 블로그 글 목록 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 100;
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { author: { select: { name: true } } },
      /* content 포함 — 프론트에서 썸네일 추출용 */
    });
    return NextResponse.json({ success: true, data: posts });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

/* POST: 블로그 글 작성 (ADMIN) */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "관리자 권한 필요" }, { status: 403 });
  try {
    const { title, content, category, thumbnail } = await req.json();
    if (!title?.trim()) return NextResponse.json({ error: "제목 필요" }, { status: 400 });
    const post = await prisma.blogPost.create({
      data: {
        title: String(title),
        content: String(content || ""),
        category: category || "구매 가이드",
        summary: thumbnail || "", /* summary에 썸네일 URL 저장 */
        authorId: user.id,
      },
    });
    return NextResponse.json({ success: true, post });
  } catch (e) {
    return NextResponse.json({ error: "작성 실패", detail: String(e) }, { status: 500 });
  }
}
