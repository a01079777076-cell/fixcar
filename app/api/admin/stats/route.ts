import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalUsers, totalCars, totalVisitors, totalInquiries, pendingDealers] = await Promise.all([
      prisma.user.count().catch(()=>0),
      prisma.car.count().catch(()=>0),
      prisma.visitorLog.count().catch(()=>0),
      prisma.inquiry.count().catch(()=>0),
      prisma.dealer.count({ where:{ isApproved:false } }).catch(()=>0),
    ]);

    /* 오류 신고 - 테이블이 없을 수도 있으므로 try */
    let totalErrors = 0;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      totalErrors = await (prisma as any).errorReport?.count() || 0;
    } catch { totalErrors = 0; }

    return NextResponse.json({ totalUsers, totalCars, totalVisitors, totalInquiries, totalErrors, pendingDealers });
  } catch {
    return NextResponse.json({ totalUsers:0, totalCars:0, totalVisitors:0, totalInquiries:0, totalErrors:0, pendingDealers:0 });
  }
}
