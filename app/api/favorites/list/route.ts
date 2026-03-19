import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

function getUserId(req: NextRequest): string | null {
  const token = req.cookies.get("token")?.value || req.cookies.get("auth-token")?.value;
  if (!token) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fixcar2025secretkey!@#$%") as any;
    return decoded.userId || decoded.id || decoded.sub || null;
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
