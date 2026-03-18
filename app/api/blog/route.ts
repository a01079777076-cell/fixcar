import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const take = parseInt(searchParams.get("take") || "20");

    const posts = await prisma.blogPost.findMany({
      where: { published: true, ...(category ? { category } : {}) },
      orderBy: { createdAt: "desc" },
      take,
      select: { id:true, title:true, summary:true, category:true, tags:true, createdAt:true, author:{ select:{ name:true } } },
    });
    return NextResponse.json({ success: true, data: posts });
  } catch {
    return NextResponse.json({ success: false, error: "조회 실패" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "로그인 필요" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN") return NextResponse.json({ success: false, error: "권한 없음" }, { status: 403 });

    const body = await req.json();
    const { title, summary, category, content, products, tags } = body;
    if (!title || !content) return NextResponse.json({ success: false, error: "제목과 내용을 입력해주세요" }, { status: 400 });

    const post = await prisma.blogPost.create({
      data: {
        title, summary: summary || "", category: category || "구매 가이드",
        content, products: products || [], tags: tags || [],
        published: true, authorId: payload.id,
      },
    });
    return NextResponse.json({ success: true, data: post });
  } catch {
    return NextResponse.json({ success: false, error: "저장 실패" }, { status: 500 });
  }
}
