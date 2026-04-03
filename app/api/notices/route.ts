// 📁 저장 경로: app/api/notices/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const notices = await prisma.notice.findMany({ orderBy: [{ pinned: "desc" }, { createdAt: "desc" }], take: 50 });
    return NextResponse.json(notices);
  } catch { return NextResponse.json([]); }
}
