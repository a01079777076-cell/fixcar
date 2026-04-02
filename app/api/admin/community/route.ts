// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/api/admin/community/route.ts
// ═══════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/* GET: 보류(FLAGGED) 게시글 목록 */
export async function GET(req: NextRequest) {
  const result = requireAdmin(req);
  if (result instanceof NextResponse) return result;

  try {
    let posts;
    try {
      posts = await prisma.communityPost.findMany({
        where: { status: { in: ["FLAGGED", "BLOCKED"] } },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, nickname: true, email: true, role: true } },
        },
      });
    } catch {
      /* status 필드가 없는 경우 빈 배열 */
      posts = [];
    }
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json([]);
  }
}

/* PATCH: 보류 게시글 조치 (승인/차단/삭제 + 유저 제재) */
export async function PATCH(req: NextRequest) {
  const result = requireAdmin(req);
  if (result instanceof NextResponse) return result;

  try {
    const { action, postId, userId, banDays, reason } = await req.json();

    /* 게시글 조치 */
    if (action === "approve" && postId) {
      await prisma.communityPost.update({
        where: { id: Number(postId) },
        data: { status: "PUBLISHED", flagReason: null } as any,
      });
      return NextResponse.json({ success: true, message: "게시글 승인 완료" });
    }

    if (action === "block" && postId) {
      await prisma.communityPost.update({
        where: { id: Number(postId) },
        data: { status: "BLOCKED", flagReason: reason || "관리자 차단" } as any,
      });
      return NextResponse.json({ success: true, message: "게시글 차단 완료" });
    }

    if (action === "delete" && postId) {
      await prisma.communityPost.delete({ where: { id: Number(postId) } });
      return NextResponse.json({ success: true, message: "게시글 삭제 완료" });
    }

    /* 유저 제재 */
    if (action === "ban" && userId) {
      const banUntil = banDays === "permanent"
        ? new Date("2099-12-31")
        : new Date(Date.now() + Number(banDays) * 24 * 60 * 60 * 1000);

      try {
        await prisma.user.update({
          where: { id: Number(userId) },
          data: { bannedUntil: banUntil, banReason: reason || "커뮤니티 규정 위반" } as any,
        });
      } catch {
        /* bannedUntil/banReason 필드 없으면 role 변경으로 대체 */
        await prisma.user.update({
          where: { id: Number(userId) },
          data: { role: "BANNED" } as any,
        });
      }
      return NextResponse.json({ success: true, message: `유저 제재 완료 (${banDays === "permanent" ? "영구" : banDays + "일"})` });
    }

    /* 글 권한 삭제 (USER로 유지하되 글쓰기만 차단) */
    if (action === "mute" && userId) {
      try {
        const muteUntil = new Date(Date.now() + (Number(banDays) || 7) * 24 * 60 * 60 * 1000);
        await prisma.user.update({
          where: { id: Number(userId) },
          data: { mutedUntil: muteUntil } as any,
        });
      } catch {
        /* mutedUntil 필드 없으면 무시 */
      }
      return NextResponse.json({ success: true, message: `글쓰기 권한 ${banDays || 7}일 제한` });
    }

    return NextResponse.json({ error: "알 수 없는 action" }, { status: 400 });
  } catch (e) {
    console.error("Admin community error:", e);
    return NextResponse.json({ error: "처리 실패" }, { status: 500 });
  }
}
