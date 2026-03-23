import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ua = req.headers.get("user-agent") || "";
    const today = new Date().toISOString().slice(0, 10);

    /* 같은 IP로 오늘 이미 기록했으면 스킵 */
    const exists = await prisma.visitorLog.findFirst({
      where: { ip, date: today, referer: "visit" },
    });
    if (!exists) {
      await prisma.visitorLog.create({
        data: { ip, userAgent: ua, referer: "visit", date: today },
      });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
