import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* GET: 오늘의 일간 활성 사용자 수 (VisitorLog 기반 고유 IP 수) */
export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const count = await prisma.visitorLog.groupBy({
      by: ["ip"],
      where: { date: today },
    });
    return NextResponse.json({ dau: count.length, date: today });
  } catch {
    return NextResponse.json({ dau: 0 });
  }
}
