import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* GET: 배틀 인기 순위 (투표 수 기준) */
export async function GET() {
  try {
    const votes = await prisma.visitorLog.findMany({
      where: { userAgent: "battle-vote" },
      select: { referer: true },
    });

    /* 차량별 투표 수 집계 */
    const counts: Record<string,number> = {};
    for (const v of votes) {
      const name = v.referer.replace("battle:", "");
      counts[name] = (counts[name] || 0) + 1;
    }

    /* 정렬 */
    const ranked = Object.entries(counts)
      .map(([name, votes]) => ({ name, votes }))
      .sort((a, b) => b.votes - a.votes);

    return NextResponse.json(ranked);
  } catch {
    return NextResponse.json([]);
  }
}
