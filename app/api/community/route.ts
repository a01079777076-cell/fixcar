// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/api/community/route.ts
// ═══════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { checkContent, checkUrls } from "@/lib/contentFilter";

/* GET: 커뮤니티 글 목록 (PUBLISHED만 공개) */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 200;

  try {
    let posts;
    try {
      posts = await prisma.communityPost.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          author: { select: { name: true, nickname: true } },
          _count: { select: { comments: true } },
        },
      });
    } catch {
      posts = await prisma.communityPost.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          author: { select: { name: true, nickname: true } },
          _count: { select: { comments: true } },
        },
      });
    }
    return NextResponse.json({ success: true, data: posts });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

/* POST: 글 작성 (무조건 저장, 유해시 FLAGGED) */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const { title, content, category } = await req.json();
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "제목과 내용을 입력해주세요" }, { status: 400 });
    }

    const plain = String(content).replace(/<[^>]*>/g, "");
    const titleCheck = checkContent(String(title));
    const contentCheck = checkContent(plain);
    const urlCheck = checkUrls(plain);
    const isHarmful = titleCheck.blocked || contentCheck.blocked || urlCheck.length > 0;
    const matches = [...titleCheck.matches, ...contentCheck.matches, ...urlCheck];

    const data: Record<string, unknown> = {
      title: String(title).slice(0, 200),
      content: String(content).slice(0, 5000),
      category: category || "자유게시판",
      authorId: user.id,
    };
    if (isHarmful) { data.status = "FLAGGED"; data.flagReason = `[자동감지] ${matches.slice(0, 10).join(", ")}`; }
    else { data.status = "PUBLISHED"; }

    let post;
    try {
      post = await prisma.communityPost.create({ data: data as any });
    } catch (e: any) {
      if (String(e).includes("Unknown field") || e?.code === "P2009") {
        const { status: _s, flagReason: _f, ...safe } = data;
        post = await prisma.communityPost.create({ data: safe as any });
      } else throw e;
    }
    return NextResponse.json({ success: true, post });
  } catch (e) {
    console.error("Community post error:", e);
    return NextResponse.json({ error: "작성 실패" }, { status: 500 });
  }
}

/* DELETE: 글 삭제 (FLAGGED는 삭제 불가) */
export async function DELETE(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const { postId } = await req.json();
    const post = await prisma.communityPost.findUnique({ where: { id: Number(postId) } });
    if (!post) return NextResponse.json({ error: "글 없음" }, { status: 404 });
    if (post.authorId !== user.id && user.role !== "ADMIN") return NextResponse.json({ error: "권한 없음" }, { status: 403 });

    if (user.role !== "ADMIN") {
      const s = (post as any).status;
      if (s === "FLAGGED" || s === "BLOCKED") return NextResponse.json({ error: "관리자 검토 중인 글은 삭제할 수 없습니다" }, { status: 403 });
    }

    await prisma.communityPost.delete({ where: { id: Number(postId) } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "삭제 실패" }, { status: 500 }); }
}
