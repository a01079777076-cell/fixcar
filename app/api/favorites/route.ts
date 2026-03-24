import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 내 찜 목록 (차량 정보 포함) */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json([]);
  try {
    const favs = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: { car: { select: { id: true, name: true, brand: true, price: true, images: true, mileage: true, fuel: true, year: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(favs);
  } catch { return NextResponse.json([]); }
}

/* POST: 찜 추가 */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  try {
    const { carId } = await req.json();
    const existing = await prisma.favorite.findUnique({ where: { userId_carId: { userId: user.id, carId: Number(carId) } } });
    if (existing) return NextResponse.json({ success: true, message: "이미 찜됨" });
    await prisma.favorite.create({ data: { userId: user.id, carId: Number(carId) } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "실패" }, { status: 500 }); }
}

/* DELETE: 찜 해제 */
export async function DELETE(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  try {
    const { carId } = await req.json();
    await prisma.favorite.deleteMany({ where: { userId: user.id, carId: Number(carId) } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "실패" }, { status: 500 }); }
}
