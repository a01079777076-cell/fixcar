// 📁 저장 경로: app/api/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({ orderBy: { startDate: "desc" }, take: 20 });
    return NextResponse.json(events);
  } catch { return NextResponse.json([]); }
}
