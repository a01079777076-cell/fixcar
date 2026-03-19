import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  /* ★ fixcar-token 쿠키 우선 확인 (카카오 콜백에서 이 이름으로 저장) */
  const token = req.cookies.get("fixcar-token")?.value
    || req.cookies.get("token")?.value
    || req.cookies.get("auth-token")?.value;

  if (!token) return NextResponse.json({ user: null });

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return NextResponse.json({ user: null });
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
    const userId = payload.id || payload.userId || payload.sub;
    if (!userId) return NextResponse.json({ user: null });

    /* DB에서 최신 role 조회 */
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
