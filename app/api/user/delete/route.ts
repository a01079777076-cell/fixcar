import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  try {
    /* 연관 데이터 삭제 */
    await prisma.communityComment.deleteMany({ where: { authorId: user.id } });
    await prisma.communityPost.deleteMany({ where: { authorId: user.id } });
    await prisma.favorite.deleteMany({ where: { userId: user.id } });
    await prisma.inquiry.deleteMany({ where: { userId: user.id } });
    try { await (prisma as any).userMbti.deleteMany({ where: { userId: user.id } }); } catch {}
    await prisma.user.delete({ where: { id: user.id } });

    const res = NextResponse.json({ success: true });
    res.cookies.set("fixcar-token", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
    return res;
  } catch (e) { return NextResponse.json({ error: "탈퇴 실패" }, { status: 500 }); }
}
