import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = parseInt(searchParams.get("postId") || "0");
    if (!postId) return NextResponse.json({ success: false, error: "postId 필요" }, { status: 400 });

    const comments = await prisma.communityComment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: { author: { select: { id:true, name:true } } },
    });
    return NextResponse.json({ success: true, data: comments });
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

    const { postId, content } = await req.json();
    if (!postId || !content) return NextResponse.json({ success: false, error: "내용 입력 필요" }, { status: 400 });

    const comment = await prisma.communityComment.create({
      data: { postId, content, authorId: payload.id },
      include: { author: { select: { name: true } } },
    });
    return NextResponse.json({ success: true, data: comment });
  } catch {
    return NextResponse.json({ success: false, error: "저장 실패" }, { status: 500 });
  }
}
