import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const dealers = await prisma.dealer.findMany({
      include: {
        user: { select: { name:true, email:true } },
        _count: { select: { cars:true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(dealers);
  } catch {
    return NextResponse.json([]);
  }
}
