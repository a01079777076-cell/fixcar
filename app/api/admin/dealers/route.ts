import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const dealers = await prisma.dealer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(dealers);
  } catch {
    return NextResponse.json([]);
  }
}
