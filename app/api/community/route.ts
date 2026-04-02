// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/api/community/route.ts
// ═══════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { checkContent, checkUrls } from "@/lib/contentFilter";

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

    /* status 필드가 있으면 BLOCKED 제외, 없으면 전체 반환 */
    const filtered = posts.filter((p: any) => {
      if (p.status && p.status === "BLOCKED") return false;
      return true;
    });

    return NextResponse.json({ success: true, data: filtered });
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

    const plainContent = String(content).replace(/<[^>]*>/g, "");

    /* ── 유해 콘텐츠 서버 검사 ── */
    const titleCheck = checkContent(String(title));
    const contentCheck = checkContent(plainContent);
    const urlCheck = checkUrls(plainContent);

    const isBlocked = titleCheck.blocked || contentCheck.blocked || urlCheck.length > 0;
    const allMatches = [...titleCheck.matches, ...contentCheck.matches, ...urlCheck];
    const severity = titleCheck.severity === "high" || contentCheck.severity === "high" ? "high" : "medium";

    if (isBlocked && severity === "high") {
      /* 심각한 위반: 즉시 차단 */
      return NextResponse.json({
        error: `부적절한 내용이 감지되었습니다: ${allMatches.slice(0, 3).join(", ")}. 반복 시 계정이 제재됩니다.`,
      }, { status: 400 });
    }

    /* 글 생성 (유해 콘텐츠 감지 시 FLAGGED 상태로 저장) */
    const postData: any = {
      title: String(title).slice(0, 200),
      content: String(content).slice(0, 5000),
      category: category || "자유게시판",
      authorId: user.id,
    };

    /* status 필드가 있으면 FLAGGED 처리 시도 */
    if (isBlocked) {
      postData.status = "FLAGGED";
      postData.flagReason = `[자동감지] ${allMatches.slice(0, 5).join(", ")}`;
    }

    let post;
    try {
      post = await prisma.communityPost.create({ data: postData });
    } catch (fieldErr: any) {
      /* status/flagReason 필드가 없는 경우 fallback */
      if (String(fieldErr).includes("Unknown field") || fieldErr?.code === "P2009") {
        const { status: _s, flagReason: _f, ...safeData } = postData;
        if (isBlocked) {
          /* 필드 없으면 차단 */
          return NextResponse.json({
            error: `부적절한 내용이 감지되었습니다. 관리자 검토가 필요합니다.`,
            flagged: true,
            matches: allMatches.slice(0, 3),
          }, { status: 400 });
        }
        post = await prisma.communityPost.create({ data: safeData });
      } else {
        throw fieldErr;
      }
    }

    if (isBlocked) {
      return NextResponse.json({
        success: true,
        post,
        warning: "일부 내용이 감지되어 관리자 검토 후 게시됩니다.",
        flagged: true,
      });
    }

    return NextResponse.json({ success: true, post });
  } catch (e) {
    console.error("Community post error:", e);
    return NextResponse.json({ error: "작성 실패" }, { status: 500 });
  }
}
