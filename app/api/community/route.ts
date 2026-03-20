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

/* GET: 글 목록 */
export async function GET() {
  try {
    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(posts);
  } catch (e) {
    console.error("Community GET error:", e);
    return NextResponse.json([]);
  }
}

/* POST: 글 작성 */
export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, content, category } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "제목과 내용을 입력해주세요" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      title: String(title).slice(0, 100),
      content: String(content).slice(0, 5000),
      userId,
    };
    if (category) data.category = String(category);

    const post = await prisma.communityPost.create({ data });
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (e) {
    console.error("Community POST error:", e);
    return NextResponse.json({ error: "글 작성 실패", detail: String(e) }, { status: 500 });
  }
}
