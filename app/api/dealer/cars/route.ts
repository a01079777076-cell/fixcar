// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/api/dealer/cars/route.ts
// ═══════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 내 매물 목록 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

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

/* POST: 매물 등록 */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  /* DEALER 또는 ADMIN만 등록 가능 */
  if (user.role !== "DEALER" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "딜러 또는 관리자 권한이 필요합니다" }, { status: 403 });
  }

  try {
    /* Dealer 레코드 확인 / 없으면 자동생성 (ADMIN 포함) */
    let dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
    if (!dealer) {
      dealer = await prisma.dealer.create({
        data: {
          userId:   user.id,
          shopName: user.role === "ADMIN" ? "픽스카 관리자" : `${user.name || "딜러"}의 매장`,
          verified: user.role === "ADMIN",
        },
      });
    }

    const body = await req.json();
    const {
      name, brand, year, mileage, fuel, color, region, price,
      cc, transmission, owners, accident, tags, options, images,
      description, inspected,
    } = body;

    /* 필수값 검증 */
    if (!name || !brand || !price) {
      return NextResponse.json({ error: "차량명, 브랜드, 가격은 필수입니다" }, { status: 400 });
    }

    /* ADMIN은 바로 AVAILABLE, 딜러는 REVIEWING */
    const status = "REVIEWING" as const;

    /* 기본 데이터 */
    const baseData = {
      dealerId:     dealer.id,
      name:         String(name),
      brand:        String(brand),
      year:         Number(year)         || new Date().getFullYear(),
      mileage:      Number(mileage)      || 0,
      fuel:         String(fuel          || "가솔린"),
      color:        String(color         || ""),
      region:       String(region        || "광주"),
      price:        Number(price),
      cc:           Number(cc)           || 0,
      power:        0,
      transmission: String(transmission  || "자동"),
      owners:       Number(owners)       || 1,
      accident:     Boolean(accident),
      status,
      tags:         Array.isArray(tags)    ? tags    : [],
      options:      Array.isArray(options) ? options : [],
      images:       Array.isArray(images)  ? images  : [],
    };

    /* description / inspected / views 는 schema push 여부에 따라 존재 안 할 수 있어 try-catch */
    let car;
    try {
      car = await prisma.car.create({
        data: {
          ...baseData,
          description: description ? String(description).slice(0, 5000) : null,
          inspected:   Boolean(inspected),
          views:       0,
        },
      });
    } catch (fieldErr: any) {
      /* 신규 필드가 없는 경우 fallback: 기본 필드만으로 생성 */
      if (fieldErr?.code === "P2009" || String(fieldErr).includes("Unknown field")) {
        car = await prisma.car.create({ data: baseData });
      } else {
        throw fieldErr;
      }
    }

    return NextResponse.json({ success: true, car });
  } catch (e) {
    console.error("Car create error:", e);
    return NextResponse.json({ error: "매물 등록 실패", detail: String(e) }, { status: 500 });
  }
}
