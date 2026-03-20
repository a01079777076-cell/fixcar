import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CarStatus } from "@prisma/client";

function getUserId(req: NextRequest): number | null {
  const token = req.cookies.get("fixcar-token")?.value || req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
    const raw = payload.id || payload.userId || payload.sub;
    return raw ? Number(raw) : null;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  try {
    const dealer = await prisma.dealer.findFirst({ where: { userId } });
    if (!dealer) return NextResponse.json([]);
    const cars = await prisma.car.findMany({
      where: { dealerId: dealer.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(cars);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "인증 필요" }, { status: 401 });

  try {
    const dealer = await prisma.dealer.findFirst({ where: { userId } });
    if (!dealer) return NextResponse.json({ error: "딜러 권한이 없습니다" }, { status: 403 });

    const body = await req.json();
    if (!body.name) return NextResponse.json({ error: "차량명은 필수입니다" }, { status: 400 });

    const car = await prisma.car.create({
      data: {
        name: body.name || "",
        brand: body.brand || "",
        year: Number(body.year) || new Date().getFullYear(),
        mileage: Number(body.mileage) || 0,
        price: Number(body.price) || 0,
        fuel: body.fuel || "가솔린",
        transmission: body.transmission || "자동",
        color: body.color || "",
        tags: body.tags || [],
        images: body.images || [],
        isAccident: body.isAccident === true,
        isPick: false,
        status: CarStatus.AVAILABLE,
        dealerId: dealer.id,
      },
    });

    return NextResponse.json({ success: true, car }, { status: 201 });
  } catch (e) {
    console.error("Dealer car create error:", e);
    return NextResponse.json({ error: "매물 등록 실패", detail: String(e) }, { status: 500 });
  }
}
