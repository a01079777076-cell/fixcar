import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const take = parseInt(searchParams.get("take") || "20");
    const skip = parseInt(searchParams.get("skip") || "0");

    const posts = await prisma.communityPost.findMany({
      where: category && category !== "전체" ? { category } : {},
      orderBy: { createdAt: "desc" },
      take, skip,
      include: {
        author: { select: { id:true, name:true } },
        _count: { select: { comments: true } },
      },
    });
    const total = await prisma.communityPost.count({ where: category && category !== "전체" ? { category } : {} });
    return NextResponse.json({ success: true, data: posts, total });
  } catch {
    return NextResponse.json({ success: false, error: "조회 실패" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "로그인 필요" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "인증 실패" }, { status: 401 });

    const { title, content, category } = await req.json();
    if (!title || !content) return NextResponse.json({ success: false, error: "제목과 내용 입력 필요" }, { status: 400 });

    const post = await prisma.communityPost.create({
      data: { title, content, category: category || "자유게시판", authorId: payload.id },
      include: { author: { select: { name: true } } },
    });
    return NextResponse.json({ success: true, data: post });
  } catch {
    return NextResponse.json({ success: false, error: "저장 실패" }, { status: 500 });
  }
}
