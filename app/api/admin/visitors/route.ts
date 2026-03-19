import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const userAgent = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "";
    if (!ip || ip === "unknown") return NextResponse.json({ success: true });
    await prisma.visitorLog.create({ data: { ip, userAgent, referer, date: today } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ success: true }); }
}

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const [todayLogs, totalCount] = await Promise.all([
      prisma.visitorLog.findMany({ where: { date: today } }),
      prisma.visitorLog.count(),
    ]);
    const todayUnique = new Set(todayLogs.map(l=>l.ip)).size;
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate()-i);
      const dateStr = d.toISOString().slice(0,10);
      const count = await prisma.visitorLog.count({ where:{ date:dateStr } });
      weeklyData.push({ date:dateStr.slice(5), count });
    }
    return NextResponse.json({ success:true, data:{ todayTotal:todayLogs.length, todayUnique, totalVisits:totalCount, weeklyData } });
  } catch { return NextResponse.json({ success:false, error:"조회 실패" }, { status:500 }); }
}
