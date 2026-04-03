// 📁 저장 경로: app/api/search/autocomplete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 1) return NextResponse.json([]);

  try {
    const cars = await prisma.car.findMany({
      where: {
        status: "AVAILABLE",
        OR: [
          { brand: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { brand: true, name: true },
      take: 10,
      distinct: ["brand", "name"],
    });

    const suggestions = [...new Set(cars.map(c => `${c.brand} ${c.name}`))].slice(0, 8);
    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json([]);
  }
}
