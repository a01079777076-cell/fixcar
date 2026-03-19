import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: true, liked: false });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: true, liked: false });
    const { searchParams } = new URL(req.url);
    const carId = parseInt(searchParams.get("carId") || "0");
    const fav = await prisma.favorite.findUnique({ where: { userId_carId: { userId: payload.id, carId } } });
    return NextResponse.json({ success: true, liked: !!fav });
  } catch {
    return NextResponse.json({ success: false, liked: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "로그인이 필요해요" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "인증 실패" }, { status: 401 });
    const { carId } = await req.json();
    await prisma.favorite.upsert({
      where: { userId_carId: { userId: payload.id, carId } },
      update: {},
      create: { userId: payload.id, carId },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "찜하기 실패" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "로그인이 필요해요" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "인증 실패" }, { status: 401 });
    const { carId } = await req.json();
    await prisma.favorite.deleteMany({ where: { userId: payload.id, carId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "찜 취소 실패" }, { status: 500 });
  }
}
