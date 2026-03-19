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

/* GET: 내 찜 목록 */
export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json([], { status: 200 });
  try {
    const favs = await prisma.favorite.findMany({
      where: { userId },
      include: { car: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(favs);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

/* POST: 찜 추가 */
export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  try {
    const body = await req.json();
    const carId = body.carId;
    if (!carId) return NextResponse.json({ error: "carId 필수" }, { status: 400 });

    /* 중복 체크 */
    const existing = await prisma.favorite.findFirst({ where: { userId, carId } });
    if (existing) return NextResponse.json(existing);

    const fav = await prisma.favorite.create({ data: { userId, carId } });
    return NextResponse.json(fav, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "찜 추가 실패", detail: String(e) }, { status: 500 });
  }
}

/* DELETE: 찜 제거 */
export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  try {
    const body = await req.json();
    const carId = body.carId;
    if (!carId) return NextResponse.json({ error: "carId 필수" }, { status: 400 });

    await prisma.favorite.deleteMany({ where: { userId, carId } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "찜 제거 실패", detail: String(e) }, { status: 500 });
  }
}
