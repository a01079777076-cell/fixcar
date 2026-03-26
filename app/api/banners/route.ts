import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* GET /api/banners?position=CARS — 활성 배너 목록 */
export async function GET(req: NextRequest) {
  const position = new URL(req.url).searchParams.get("position") || "CARS";
  const now = new Date();

  try {
    const banners = await prisma.banner.findMany({
      where: {
        active: true,
        position,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: banners });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}
