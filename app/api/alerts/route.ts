import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// 알림 목록 조회
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "로그인 필요" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "인증 실패" }, { status: 401 });

    const alerts = await prisma.wishAlert.findMany({
      where: { userId: payload.id, active: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: alerts });
  } catch {
    return NextResponse.json({ success: false, error: "조회 실패" }, { status: 500 });
  }
}

// 알림 생성
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "로그인 필요" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "인증 실패" }, { status: 401 });

    const { brand, model, minPrice, maxPrice, minYear, maxYear, fuel } = await req.json();

    // 최대 5개 제한
    const count = await prisma.wishAlert.count({ where: { userId: payload.id, active: true } });
    if (count >= 5) return NextResponse.json({ success: false, error: "알림은 최대 5개까지 설정할 수 있어요" }, { status: 400 });

    const alert = await prisma.wishAlert.create({
      data: {
        userId: payload.id,
        brand: brand || null,
        model: model || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        minYear: minYear || null,
        maxYear: maxYear || null,
        fuel: fuel || null,
      },
    });
    return NextResponse.json({ success: true, data: alert });
  } catch {
    return NextResponse.json({ success: false, error: "생성 실패" }, { status: 500 });
  }
}

// 알림 삭제
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("fixcar-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "로그인 필요" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: "인증 실패" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "0");

    await prisma.wishAlert.updateMany({
      where: { id, userId: payload.id },
      data: { active: false },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "삭제 실패" }, { status: 500 });
  }
}
