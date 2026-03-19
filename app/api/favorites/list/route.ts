import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserId(req: NextRequest): string | null {
  const token = req.cookies.get("token")?.value || req.cookies.get("auth-token")?.value;
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
    return payload.userId || payload.id || payload.sub || null;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json([]);
  try {
    const favs = await prisma.favorite.findMany({
      where: { userId },
      include: { car: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(favs);
  } catch {
    return NextResponse.json([]);
  }
}
