import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const brand = searchParams.get("brand") || undefined;
    const fuel = searchParams.get("fuel") || undefined;
    const minPrice = searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : undefined;
    const minYear = searchParams.get("minYear") ? parseInt(searchParams.get("minYear")!) : undefined;
    const maxYear = searchParams.get("maxYear") ? parseInt(searchParams.get("maxYear")!) : undefined;
    const region = searchParams.get("region") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || "latest";

    const where: Record<string, unknown> = { status: "AVAILABLE" };
    if (brand) where.brand = brand;
    if (fuel) where.fuel = fuel;
    if (region) where.region = { contains: region };
    if (minPrice || maxPrice) where.price = { ...(minPrice && { gte: minPrice }), ...(maxPrice && { lte: maxPrice }) };
    if (minYear || maxYear) where.year = { ...(minYear && { gte: minYear }), ...(maxYear && { lte: maxYear }) };
    if (search) where.OR = [{ name: { contains: search } }, { brand: { contains: search } }];

    const orderBy = sort === "price_asc" ? { price: "asc" as const }
      : sort === "price_desc" ? { price: "desc" as const }
      : sort === "mileage" ? { mileage: "asc" as const }
      : { createdAt: "desc" as const };

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { dealer: { select: { shopName: true } } },
      }),
      prisma.car.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: cars,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ success: false, error: "조회 실패" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const car = await prisma.car.create({ data });
    return NextResponse.json({ success: true, data: car });
  } catch {
    return NextResponse.json({ success: false, error: "등록 실패" }, { status: 500 });
  }
}
