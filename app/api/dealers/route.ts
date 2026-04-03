// 📁 저장 경로: app/api/dealers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const dealers = await prisma.dealer.findMany({
      include: {
        user: { select: { name: true } },
        _count: { select: { cars: { where: { status: "AVAILABLE" } } } },
      },
      orderBy: { dealCount: "desc" },
    });
    return NextResponse.json(dealers);
  } catch { return NextResponse.json([]); }
}
