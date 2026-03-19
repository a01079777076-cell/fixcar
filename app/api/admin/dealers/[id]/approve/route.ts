// app/api/admin/dealers/[id]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "권한 없음" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN") return NextResponse.json({ success: false, error: "관리자만 접근 가능" }, { status: 403 });

    const { id } = await params;
    const userId = parseInt(id);

    // User role을 DEALER로 변경
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: "DEALER" },
    });

    // Dealer 레코드 생성 (없으면)
    const { shopName } = await req.json().catch(() => ({ shopName: "픽스카 딜러" }));
    await prisma.dealer.upsert({
      where: { userId },
      update: { verified: true },
      create: { userId, shopName, verified: true },
    });

    return NextResponse.json({ success: true, data: { userId, role: user.role } });
  } catch {
    return NextResponse.json({ success: false, error: "승인 실패" }, { status: 500 });
  }
}
