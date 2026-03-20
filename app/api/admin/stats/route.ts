import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const [totalUsers, totalCars, totalVisitors, totalInquiries, pendingDealers] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.car.count().catch(() => 0),
      prisma.visitorLog.count().catch(() => 0),
      prisma.inquiry.count().catch(() => 0),
      prisma.dealer.count().catch(() => 0),
    ]);

    /* 오류 신고 수는 JSON 파일에서 */
    let totalErrors = 0;
    try {
      const data = await readFile(path.join(process.cwd(), "data", "error_reports.json"), "utf-8");
      totalErrors = JSON.parse(data).length;
    } catch { totalErrors = 0; }

    return NextResponse.json({ totalUsers, totalCars, totalVisitors, totalInquiries, totalErrors, pendingDealers });
  } catch {
    return NextResponse.json({ totalUsers: 0, totalCars: 0, totalVisitors: 0, totalInquiries: 0, totalErrors: 0, pendingDealers: 0 });
  }
}
