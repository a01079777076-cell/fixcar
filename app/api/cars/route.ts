import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const fuel = searchParams.get("fuel");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "createdAt";

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (fuel) where.fuel = fuel;
    if (maxPrice) where.price = { lte: parseInt(maxPrice) };

    const orderBy: Record<string, string> = {};
    if (sort === "price_asc") orderBy.price = "asc";
    else if (sort === "price_desc") orderBy.price = "desc";
    else if (sort === "mileage") orderBy.mileage = "asc";
    else if (sort === "newest") orderBy.year = "desc";
    else orderBy.createdAt = "desc";

    const cars = await prisma.car.findMany({
      where,
      orderBy,
      include: {
        dealer: {
          select: {
            shopName: true,
            rating: true,
            verified: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: cars });
  } catch (error) {
    console.error("Cars API Error:", error);
    return NextResponse.json(
      { success: false, error: "차량 목록을 불러올 수 없어요" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      dealerId, name, brand, year, mileage, fuel, color,
      region, price, cc, power, efficiency, transmission,
      owners, accident, tags, options, images,
    } = body;

    if (!dealerId || !name || !brand || !year || !mileage || !price) {
      return NextResponse.json(
        { success: false, error: "필수 항목이 누락됐어요" },
        { status: 400 }
      );
    }

    const car = await prisma.car.create({
      data: {
        dealerId: parseInt(dealerId),
        name, brand,
        year: parseInt(year),
        mileage: parseInt(mileage),
        fuel, color, region,
        price: parseInt(price),
        cc: parseInt(cc || "0"),
        power: parseInt(power || "0"),
        efficiency: efficiency || "0",
        transmission: transmission || "자동",
        owners: parseInt(owners || "1"),
        accident: accident === true,
        tags: tags || [],
        options: options || [],
        images: images || [],
      },
    });

    return NextResponse.json({ success: true, data: car }, { status: 201 });
  } catch (error) {
    console.error("Car Create Error:", error);
    return NextResponse.json(
      { success: false, error: "차량 등록에 실패했어요" },
      { status: 500 }
    );
  }
}
