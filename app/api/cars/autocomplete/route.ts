import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* GET /api/cars/autocomplete?q=아반떼
   → 실제 DB 매물 기반 자동완성 후보 반환 */
export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q")?.trim() || "";
  if (q.length < 1) return NextResponse.json({ suggestions: [] });

  try {
    const cars = await prisma.car.findMany({
      where: {
        status: "AVAILABLE",
        OR: [
          { name:  { contains: q, mode: "insensitive" } },
          { brand: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { name: true, brand: true },
      take: 30,
    });

    /* 중복 제거: "브랜드 모델명" 형태로 통합 */
    const seen = new Set<string>();
    const suggestions: string[] = [];

    for (const c of cars) {
      const full = `${c.brand} ${c.name}`;
      if (!seen.has(full)) { seen.add(full); suggestions.push(full); }
      if (!seen.has(c.brand)) { seen.add(c.brand); suggestions.push(c.brand); }
      if (!seen.has(c.name))  { seen.add(c.name);  suggestions.push(c.name); }
    }

    return NextResponse.json({ suggestions: suggestions.slice(0, 10) });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
