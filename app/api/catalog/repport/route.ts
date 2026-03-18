import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "로그인이 필요해요" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "인증 실패" }, { status: 401 });

    const { carModel, wrongInfo, correctInfo } = await req.json();
    if (!carModel || !wrongInfo || !correctInfo) {
      return NextResponse.json({ success: false, error: "모든 항목을 입력해주세요" }, { status: 400 });
    }

    const report = await prisma.catalogReport.create({
      data: { userId: payload.id, carModel, wrongInfo, correctInfo, status: "PENDING" },
    });
    return NextResponse.json({ success: true, data: report });
  } catch {
    return NextResponse.json({ success: false, error: "접수 실패" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "권한 없음" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN") return NextResponse.json({ success: false, error: "관리자만 접근 가능" }, { status: 403 });

    const reports = await prisma.catalogReport.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    });
    return NextResponse.json({ success: true, data: reports });
  } catch {
    return NextResponse.json({ success: false, error: "조회 실패" }, { status: 500 });
  }
}
