// 📁 저장 경로: app/api/favorites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 내 찜 목록 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        car: {
          select: { id: true, name: true, brand: true, year: true, mileage: true, price: true, fuel: true, images: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: favorites });
  } catch { return NextResponse.json({ success: true, data: [] }); }
}

/* POST: 찜 추가 */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  try {
    const { carId } = await req.json();
    const existing = await prisma.favorite.findUnique({
      where: { userId_carId: { userId: user.id, carId: Number(carId) } },
    });
    if (existing) return NextResponse.json({ error: "이미 찜한 매물" }, { status: 409 });
    const fav = await prisma.favorite.create({ data: { userId: user.id, carId: Number(carId) } });
    return NextResponse.json({ success: true, data: fav });
  } catch (e) {
    return NextResponse.json({ error: "찜 추가 실패" }, { status: 500 });
  }
}

/* DELETE: 찜 해제 */
export async function DELETE(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  try {
    const { carId } = await req.json();
    await prisma.favorite.delete({
      where: { userId_carId: { userId: user.id, carId: Number(carId) } },
    });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "찜 해제 실패" }, { status: 500 }); }
}
