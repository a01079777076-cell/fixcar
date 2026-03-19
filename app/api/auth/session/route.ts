import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ user: null });

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return NextResponse.json({ user: null });
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
    const userId = payload.userId || payload.id || payload.sub;
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
        role: user.role, /* ★ role 반환 */
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
