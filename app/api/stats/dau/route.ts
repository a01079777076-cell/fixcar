import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const todayVisitors = await prisma.visitorLog.groupBy({
      by: ["ip"],
      where: { date: today, referer: "visit" },
    });

    /* 월간 데이터 (최근 3개월) */
    const monthly: { month: string; count: number }[] = [];
    const now = new Date();
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const startDate = `${yearMonth}-01`;
      const endD = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const endDate = `${yearMonth}-${String(endD.getDate()).padStart(2, "0")}`;

      const visitors = await prisma.visitorLog.groupBy({
        by: ["ip"],
        where: { referer: "visit", date: { gte: startDate, lte: endDate } },
      });
      monthly.push({ month: `${d.getMonth() + 1}월`, count: visitors.length });
    }

    return NextResponse.json({ dau: todayVisitors.length, date: today, monthly });
  } catch {
    return NextResponse.json({ dau: 0, monthly: [] });
  }
}
