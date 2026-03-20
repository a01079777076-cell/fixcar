import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* POST: 찜 토글 */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });

  try {
    const { carId } = await req.json();
    const cid = Number(carId);
    if (!cid) return NextResponse.json({ error: "carId 필요" }, { status: 400 });

    /* 스키마: userId(Int), carId(Int), @@unique([userId, carId]) */
    const existing = await prisma.favorite.findUnique({
      where: { userId_carId: { userId: user.id, carId: cid } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false });
    } else {
      await prisma.favorite.create({ data: { userId: user.id, carId: cid } });
      return NextResponse.json({ favorited: true });
    }
  } catch (e) {
    console.error("Favorite POST:", e);
    return NextResponse.json({ error: "처리 실패" }, { status: 500 });
  }
}

/* GET: 내 찜 목록 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json([]);

  try {
    const favs = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: { car: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(favs);
  } catch {
    return NextResponse.json([]);
  }
}
