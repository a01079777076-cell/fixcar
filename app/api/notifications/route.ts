import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json([]);
  try {
    const notifs = [];

    /* 1. 내 문의에 답변이 달린 것 */
    const repliedInqs = await prisma.inquiry.findMany({
      where: { userId: user.id, status: "REPLIED" },
      include: { car: { select: { name: true, brand: true } } },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });
    for (const inq of repliedInqs) {
      notifs.push({
        id: `inq-${inq.id}`,
        type: "inquiry",
        title: "문의 답변 도착",
        message: `${inq.car.brand} ${inq.car.name}에 대한 답변이 도착했어요`,
        href: "/mypage",
        time: timeAgo(inq.updatedAt),
        read: false,
      });
    }

    /* 2. 내 커뮤니티 글에 댓글이 달린 것 */
    const myPosts = await prisma.communityPost.findMany({
      where: { authorId: user.id },
      select: { id: true, title: true },
    });
    for (const post of myPosts) {
      const recentComments = await prisma.communityComment.findMany({
        where: { postId: post.id, NOT: { authorId: user.id } },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { author: { select: { nickname: true, name: true } } },
      });
      for (const c of recentComments) {
        notifs.push({
          id: `cmt-${c.id}`,
          type: "inquiry",
          title: "새 댓글",
          message: `"${post.title}"에 ${c.author.nickname || c.author.name}님이 댓글을 남겼어요`,
          href: `/community/${post.id}`,
          time: timeAgo(c.createdAt),
          read: false,
        });
      }
    }

    /* 정렬: 최신순 */
    notifs.sort((a, b) => b.id.localeCompare(a.id));
    return NextResponse.json({ success: true, data: notifs.slice(0, 20) });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return `${Math.floor(days / 30)}개월 전`;
}
