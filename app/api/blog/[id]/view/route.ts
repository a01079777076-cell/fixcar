import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* POST: 조회수 증가 + 조회 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = parseInt(id);
  if (!postId) return NextResponse.json({ views: 0 });

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const today = new Date().toISOString().slice(0, 10);
    const refKey = `blog:${postId}`;

    /* 같은 IP로 오늘 이미 기록했으면 스킵 */
    const exists = await prisma.visitorLog.findFirst({
      where: { ip, referer: refKey, date: today },
    });
    if (!exists) {
      await prisma.visitorLog.create({
        data: { ip, userAgent: req.headers.get("user-agent") || "", referer: refKey, date: today },
      });
    }

    const count = await prisma.visitorLog.count({ where: { referer: refKey } });
    return NextResponse.json({ views: count });
  } catch (e) {
    console.error("Blog view error:", e);
    return NextResponse.json({ views: 0 });
  }
}

/* GET: 조회수만 조회 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const count = await prisma.visitorLog.count({ where: { referer: `blog:${parseInt(id)}` } });
    return NextResponse.json({ views: count });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}
