import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserId(req: NextRequest): number | null {
  const token = req.cookies.get("fixcar-token")?.value || req.cookies.get("token")?.value || req.cookies.get("auth-token")?.value;
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
    const raw = payload.id || payload.userId || payload.sub || null;
    if (raw === null) return null;
    const num = Number(raw);
    return isNaN(num) ? null : num;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json([], { status: 200 });
  try {
    const favs = await prisma.favorite.findMany({ where: { userId }, include: { car: true }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(favs);
  } catch { return NextResponse.json([], { status: 200 }); }
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  try {
    const body = await req.json();
    const carId = typeof body.carId === "string" ? Number(body.carId) : body.carId;
    if (!carId) return NextResponse.json({ error: "carId 필수" }, { status: 400 });
    const existing = await prisma.favorite.findFirst({ where: { userId, carId } });
    if (existing) return NextResponse.json(existing);
    const fav = await prisma.favorite.create({ data: { userId, carId } });
    return NextResponse.json(fav, { status: 201 });
  } catch (e) { return NextResponse.json({ error: "찜 추가 실패", detail: String(e) }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  try {
    const body = await req.json();
    const carId = typeof body.carId === "string" ? Number(body.carId) : body.carId;
    if (!carId) return NextResponse.json({ error: "carId 필수" }, { status: 400 });
    await prisma.favorite.deleteMany({ where: { userId, carId } });
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: "찜 제거 실패", detail: String(e) }, { status: 500 }); }
}
