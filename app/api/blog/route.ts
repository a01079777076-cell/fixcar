import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserId(req: NextRequest): number | null {
  const token = req.cookies.get("fixcar-token")?.value || req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
    const raw = payload.id || payload.userId || payload.sub;
    return raw ? Number(raw) : null;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 20;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const posts = await (prisma as any).blogPost.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return NextResponse.json(posts);
  } catch (e) {
    console.error("Blog GET error:", e);
    /* blogPost 테이블이 없으면 빈 배열 */
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "제목과 내용을 입력해주세요" }, { status: 400 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      title: String(body.title).slice(0, 200),
      content: String(body.content).slice(0, 50000),
      userId,
    };
    if (body.thumbnail) data.thumbnail = body.thumbnail;
    if (body.category) data.category = body.category;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const post = await (prisma as any).blogPost.create({ data });
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (e) {
    console.error("Blog POST error:", e);
    return NextResponse.json({ error: "글 작성 실패", detail: String(e) }, { status: 500 });
  }
}
