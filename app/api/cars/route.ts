import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 20;
    const page = Number(searchParams.get("page")) || 1;
    const brand = searchParams.get("brand") || "";
    const fuelType = searchParams.get("fuelType") || "";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "latest";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (brand) where.brand = { contains: brand };
    if (fuelType) where.fuel = { contains: fuelType };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
      ];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: "desc" };
    if (sort === "priceLow") orderBy = { price: "asc" };
    else if (sort === "priceHigh") orderBy = { price: "desc" };
    else if (sort === "mileageLow") orderBy = { mileage: "asc" };
    else if (sort === "yearNew") orderBy = { year: "desc" };

    const cars = await prisma.car.findMany({
      where,
      orderBy,
      take: limit,
      skip: (page - 1) * limit,
    });

    return NextResponse.json(cars);
  } catch (e) {
    console.error("Cars API error:", e);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const car = await prisma.car.create({ data: body });
    return NextResponse.json(car, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "차량 등록 실패", detail: String(e) }, { status: 500 });
  }
}
