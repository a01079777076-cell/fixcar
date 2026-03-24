import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  try {
    const { postId } = await req.json();
    const post = await prisma.communityPost.update({ where: { id: Number(postId) }, data: { likes: { increment: 1 } } });
    return NextResponse.json({ success: true, likes: post.likes });
  } catch { return NextResponse.json({ error: "실패" }, { status: 500 }); }
}
