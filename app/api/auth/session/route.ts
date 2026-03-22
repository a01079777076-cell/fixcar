import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const payload = verifyToken(req);
    if (!payload) return NextResponse.json({ user: null });

    /* DB에서 최신 유저 정보 가져오기 */
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, provider: true, name: true, role: true, phone: true },
    });

    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
