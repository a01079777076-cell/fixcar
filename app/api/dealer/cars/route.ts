import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* POST: 매물 등록 */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  if (user.role !== "DEALER" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "딜러 권한이 필요합니다" }, { status: 403 });
  }

  try {
    /* 딜러 레코드 찾기 */
    let dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });

    /* ADMIN인데 딜러 레코드 없으면 자동 생성 */
    if (!dealer && user.role === "ADMIN") {
      dealer = await prisma.dealer.create({
        data: { userId: user.id, shopName: "픽스카 직영", verified: true },
      });
    }
    if (!dealer) return NextResponse.json({ error: "딜러 등록이 필요합니다" }, { status: 403 });

    const body = await req.json();

    /* 스키마: dealerId, name, brand, year, mileage, fuel, color, region, price, cc, power, efficiency, transmission, owners, accident, status, tags[], options[], images[] */
    const car = await prisma.car.create({
      data: {
        dealerId: dealer.id,
        name: String(body.name || "").slice(0, 200),
        brand: String(body.brand || ""),
        year: Number(body.year) || new Date().getFullYear(),
        mileage: Number(body.mileage) || 0,
        fuel: String(body.fuel || "가솔린"),
        color: String(body.color || ""),
        region: String(body.region || "광주"),
        price: Number(body.price) || 0,
        cc: Number(body.cc) || 0,
        power: Number(body.power) || 0,
        efficiency: String(body.efficiency || "0"),
        transmission: String(body.transmission || "자동"),
        owners: Number(body.owners) || 1,
        accident: Boolean(body.accident),
        status: "AVAILABLE",
        tags: body.tags || [],
        options: body.options || [],
        images: body.images || [],
      },
    });
    return NextResponse.json({ success: true, car }, { status: 201 });
  } catch (e) {
    console.error("Dealer car POST:", e);
    return NextResponse.json({ error: "차량 등록 실패", detail: String(e) }, { status: 500 });
  }
}

/* GET: 내 매물 목록 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });

  try {
    const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
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
