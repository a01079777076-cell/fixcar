// app/api/inquiries/my/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "로그인 필요" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "인증 실패" }, { status: 401 });

    const inquiries = await prisma.inquiry.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: "desc" },
      include: { car: { select: { id:true, name:true, price:true, images:true } } },
    });

    return NextResponse.json({ success: true, data: inquiries });
  } catch {
    return NextResponse.json({ success: false, error: "조회 실패" }, { status: 500 });
  }
}
