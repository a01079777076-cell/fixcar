import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* POST: 조회수 증가 (BlogPost에 views 없으므로 별도 카운트) */
/* 현재 스키마에 views 필드가 없어서 content 기반 대안 사용 불가 */
/* → 간단히 VisitorLog를 활용하여 블로그 조회 기록 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = parseInt(id);
  if (!postId) return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });

  try {
    /* VisitorLog에 블로그 조회 기록 저장 */
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const today = new Date().toISOString().slice(0, 10);
    
    await prisma.visitorLog.create({
      data: {
        ip,
        userAgent: req.headers.get("user-agent") || "",
        referer: `blog:${postId}`,
        date: today,
      },
    });

    /* 해당 블로그의 총 조회수 카운트 */
    const count = await prisma.visitorLog.count({
      where: { referer: `blog:${postId}` },
    });

    return NextResponse.json({ views: count });
  } catch (e) {
    console.error("Blog view error:", e);
    return NextResponse.json({ views: 0 });
  }
}

/* GET: 조회수 조회 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = parseInt(id);
  try {
    const count = await prisma.visitorLog.count({
      where: { referer: `blog:${postId}` },
    });
    return NextResponse.json({ views: count });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}
