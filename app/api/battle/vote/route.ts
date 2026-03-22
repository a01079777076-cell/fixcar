import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* POST: 우승 차량에 1표 */
export async function POST(req: NextRequest) {
  try {
    const { carName } = await req.json();
    if (!carName) return NextResponse.json({ error: "차량명 필요" }, { status: 400 });

    /* VisitorLog 활용하여 투표 기록 */
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    await prisma.visitorLog.create({
      data: { ip, userAgent: "battle-vote", referer: `battle:${carName}`, date: new Date().toISOString().slice(0,10) },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "투표 실패" }, { status: 500 });
  }
}
