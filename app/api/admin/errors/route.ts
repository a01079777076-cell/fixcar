import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    /* ErrorReport 테이블이 있으면 조회 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reports = await (prisma as any).errorReport?.findMany?.({
      orderBy: { createdAt: "desc" },
    }) || [];
    return NextResponse.json(reports);
  } catch {
    /* 테이블이 없으면 빈 배열 */
    return NextResponse.json([]);
  }
}
