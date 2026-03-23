import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json([]);

  try {
    const favs = await prisma.favorite.findMany({
      where: { userId: user.id },
      select: { carId: true },
    });
    return NextResponse.json(favs);
  } catch {
    return NextResponse.json([]);
  }
}
