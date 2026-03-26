import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* GET: 매물 목록 (홈 추천 + 필터 검색 + 유사매물) */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit     = Number(searchParams.get("limit"))    || 20;
  const brands    = searchParams.get("brands");
  const brand     = searchParams.get("brand");
  const q         = searchParams.get("q");
  const fuel      = searchParams.get("fuel");
  const minPrice  = searchParams.get("minPrice");
  const maxPrice  = searchParams.get("maxPrice");
  const minYear   = searchParams.get("minYear");
  const maxYear   = searchParams.get("maxYear");
  const minMile   = searchParams.get("minMile");
  const maxMile   = searchParams.get("maxMile");
  const excludeId = searchParams.get("excludeId");
  const sortBy    = searchParams.get("sort") || "latest";

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { status: "AVAILABLE" };

    /* 브랜드 필터 */
    if (brands) where.brand = { in: brands.split(",").map((b) => b.trim()) };
    if (brand && brand !== "전체") where.brand = brand;

    /* 검색어 (차명 or 브랜드) */
    if (q) {
      where.OR = [
        { name:  { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    /* 연료 */
    if (fuel && fuel !== "전체") where.fuel = fuel;

    /* 가격 범위 */
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    /* 연식 범위 */
    if (minYear || maxYear) {
      where.year = {};
      if (minYear) where.year.gte = Number(minYear);
      if (maxYear) where.year.lte = Number(maxYear);
    }

    /* 주행거리 범위 */
    if (minMile || maxMile) {
      where.mileage = {};
      if (minMile) where.mileage.gte = Number(minMile);
      if (maxMile) where.mileage.lte = Number(maxMile);
    }

    /* 유사매물 제외 */
    if (excludeId) where.id = { not: Number(excludeId) };

    /* 정렬 */
    let orderBy: object = { createdAt: "desc" };
    if (sortBy === "price_asc")  orderBy = { price: "asc" };
    if (sortBy === "price_desc") orderBy = { price: "desc" };
    if (sortBy === "mileage")    orderBy = { mileage: "asc" };
    if (sortBy === "views")      orderBy = { views: "desc" };

    const cars = await prisma.car.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        dealer: { select: { shopName: true, rating: true, verified: true } },
        _count: { select: { favorites: true } },
      },
    });

    return NextResponse.json({ success: true, data: cars, total: cars.length });
  } catch (e) {
    console.error("Cars API error:", e);
    return NextResponse.json({ success: true, data: [], total: 0 });
  }
}
